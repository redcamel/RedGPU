import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import type {FoliageSubMesh} from "../../FoliageType";
import impostorBakeVertexWGSL from "./impostorBakeVertex.wgsl";
import impostorBakeShaderWGSL from "./impostorBake.wgsl";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import {COMMAND_ENCODER_TYPE} from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

export interface FoliageBakeResult {
    baseColorTexture: DirectTexture;
    texture: DirectTexture; // backward-compatibility alias
    normalTexture: DirectTexture;
    packedORMTexture: DirectTexture;
    ormTexture: DirectTexture; // backward-compatibility alias
    width: number;
    height: number;
    depth: number;
    bottomOffset: number;
    /** 타일 내 실제 나무 UV 크기: quadUV * tileUVScale + tileUVOffset → 아틀라스 타일 내 나무 영역 UV */
    tileUVScale: [number, number];
    /** 타일 내 실제 나무 UV 시작 오프셋 */
    tileUVOffset: [number, number];
}


class FoliageImpostorBaker {
    static #bakePipelineCache: Map<string, GPURenderPipeline> = new Map();
    static #bakeBindGroupLayout: GPUBindGroupLayout | null = null;

    static calculateAABBFromSubMeshes(subMeshes: FoliageSubMesh[]): {
        min: [number, number, number];
        max: [number, number, number];
        width: number;
        height: number;
        depth: number;
        center: [number, number, number];
        maxRadius: number;
        bottomOffset: number;
    } {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        for (let s = 0; s < subMeshes.length; s++) {
            const sub = subMeshes[s];
            if (sub.isImpostor) continue;

            const vBuffer = sub.geometry?.vertexBuffer;
            const vData = vBuffer?.data;
            if (!vData || vData.length === 0) continue;

            const stride = vBuffer.stride || (vBuffer.interleavedStruct?.arrayStride ? vBuffer.interleavedStruct.arrayStride / 4 : 18);
            const vCount = vBuffer.vertexCount || Math.floor(vData.length / stride);
            const m = sub.relativeModelMatrix;

            for (let i = 0; i < vCount; i++) {
                const idx = i * stride;
                const x = vData[idx];
                const y = vData[idx + 1];
                const z = vData[idx + 2];

                const wx = m ? (m[0] * x + m[4] * y + m[8] * z + m[12]) : x;
                const wy = m ? (m[1] * x + m[5] * y + m[9] * z + m[13]) : y;
                const wz = m ? (m[2] * x + m[6] * y + m[10] * z + m[14]) : z;

                if (wx < minX) minX = wx;
                if (wy < minY) minY = wy;
                if (wz < minZ) minZ = wz;
                if (wx > maxX) maxX = wx;
                if (wy > maxY) maxY = wy;
                if (wz > maxZ) maxZ = wz;
            }
        }

        if (minX === Infinity) {
            return {
                min: [-2.0, 0, -2.0],
                max: [2.0, 6.0, 2.0],
                width: 4.0,
                height: 6.0,
                depth: 4.0,
                center: [0, 3.0, 0],
                maxRadius: 4.0,
                bottomOffset: 0
            };
        }

        const width = Math.max(maxX - minX, 0.1);
        const height = Math.max(maxY - minY, 0.1);
        const depth = Math.max(maxZ - minZ, 0.1);
        const centerX = 0.0;
        const centerY = (minY + maxY) * 0.5;
        const centerZ = 0.0;
        const bottomOffset = minY;

        // 🌲 실제 모든 정점들과 수직 중심축 (0, centerY, 0) 사이의 최대 거리 R_max 계산 (피벗 이탈 및 짤림 원천 방지)
        let maxDistSq = 0;
        for (let s = 0; s < subMeshes.length; s++) {
            const sub = subMeshes[s];
            if (sub.isImpostor) continue;

            const vBuffer = sub.geometry?.vertexBuffer;
            const vData = vBuffer?.data;
            if (!vData || vData.length === 0) continue;

            const stride = vBuffer.stride || (vBuffer.interleavedStruct?.arrayStride ? vBuffer.interleavedStruct.arrayStride / 4 : 18);
            const vCount = vBuffer.vertexCount || Math.floor(vData.length / stride);
            const m = sub.relativeModelMatrix;

            for (let i = 0; i < vCount; i++) {
                const idx = i * stride;
                const x = vData[idx];
                const y = vData[idx + 1];
                const z = vData[idx + 2];

                const wx = (m ? (m[0] * x + m[4] * y + m[8] * z + m[12]) : x);
                const wy = (m ? (m[1] * x + m[5] * y + m[9] * z + m[13]) : y) - centerY;
                const wz = (m ? (m[2] * x + m[6] * y + m[10] * z + m[14]) : z);

                const dSq = wx * wx + wy * wy + wz * wz;
                if (dSq > maxDistSq) maxDistSq = dSq;
            }
        }

        const rawMaxRadius = Math.sqrt(maxDistSq);
        const fallbackRadius = Math.hypot(Math.max(Math.abs(minX), Math.abs(maxX)), height * 0.5, Math.max(Math.abs(minZ), Math.abs(maxZ)));
        const maxRadius = (Number.isFinite(rawMaxRadius) && rawMaxRadius > 0.1) ? rawMaxRadius : fallbackRadius;

        return {
            min: [minX, minY, minZ],
            max: [maxX, maxY, maxZ],
            width,
            height,
            depth,
            center: [centerX, centerY, centerZ],
            maxRadius,
            bottomOffset
        };
    }

    static bakeSubMeshes(
        redGPUContext: RedGPUContext,
        subMeshes: FoliageSubMesh[],
        bakeName: string = 'Foliage'
    ): FoliageBakeResult {
        const gpuDevice = redGPUContext.gpuDevice;
        if (!gpuDevice) {
            throw new Error('[FoliageImpostorBaker] GPUDevice is not initialized.');
        }

        const aabb = this.calculateAABBFromSubMeshes(subMeshes);
        const centerX = aabb.center[0];
        const centerY = aabb.center[1];
        const centerZ = aabb.center[2];
        const maxRadius = aabb.maxRadius;

        // 🌲 3D 대각선 회전 및 상공 뷰(Pitch 45°~90°) 시 투영 높이 팽창을 완벽히 포괄하는 25% 안전 마진 (시저 클리핑 0% 보장)
        const margin = 1.25;
        const orthoHalfWidth = maxRadius * margin;
        const orthoHalfHeight = maxRadius * margin;

        const actualQuadWidth = orthoHalfWidth * 2.0;
        const actualQuadHeight = orthoHalfHeight * 2.0;
        const actualBottomOffset = centerY - orthoHalfHeight;

        const gridSize = 8;
        const tileSize = 256;
        const atlasWidth = gridSize * tileSize; // 2048
        const atlasHeight = gridSize * tileSize; // 2048
        const mipLevelCount = getMipLevelCount(atlasWidth, atlasHeight);

        // 1. MRT Target 0: BaseColor + Alpha Mask
        const bakedGPUTexture = gpuDevice.createTexture({
            label: `BakedImpostor_BaseColor_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            mipLevelCount,
            format: 'rgba8unorm-srgb',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
        });

        // 2. MRT Target 1: World Normal + Radial Depth
        const bakedNormalGPUTexture = gpuDevice.createTexture({
            label: `BakedImpostor_Normal_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            mipLevelCount,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
        });

        // 3. MRT Target 2: Physical Material Properties (ORM + Subsurface)
        const bakedORMGPUTexture = gpuDevice.createTexture({
            label: `BakedImpostor_ORM_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            mipLevelCount,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
        });

        const depthGPUTexture = gpuDevice.createTexture({
            label: `BakedImpostor_Depth_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        console.log(`[FoliageImpostorBaker 🌲 3-Atlas MRT] Baking '${bakeName}': subMeshes=${subMeshes.length}, aabb=[W:${aabb.width.toFixed(2)}, H:${aabb.height.toFixed(2)}, D:${aabb.depth.toFixed(2)}], maxRadius=${maxRadius.toFixed(2)}, quadSize=${actualQuadWidth.toFixed(2)}, center=[${centerX.toFixed(2)}, ${centerY.toFixed(2)}, ${centerZ.toFixed(2)}], bottomOffset=${actualBottomOffset.toFixed(2)}`);

        const maxCameraDist = maxRadius * 4.0;
        const renderPassViews = [];

        for (let gy = 0; gy < gridSize; gy++) {
            for (let gx = 0; gx < gridSize; gx++) {
                const u = (gx + 0.5) / gridSize;
                const v = (gy + 0.5) / gridSize;

                const uPrime = 2.0 * u - 1.0;
                const vPrime = 2.0 * v - 1.0;
                const dirX = (uPrime - vPrime) * 0.5;
                const dirZ = (uPrime + vPrime) * 0.5;
                const dirY = Math.max(1.0 - (Math.abs(dirX) + Math.abs(dirZ)), 0.0);

                const len = Math.hypot(dirX, dirY, dirZ) || 1.0;
                const normX = dirX / len;
                const normY = dirY / len;
                const normZ = dirZ / len;

                const camX = centerX + normX * maxCameraDist;
                const camY = centerY + normY * maxCameraDist;
                const camZ = centerZ + normZ * maxCameraDist;

                const proj = mat4.create();
                const view = mat4.create();
                const projView = mat4.create();

                // 🌲 WebGPU 표준 [0.0, 1.0] Depth 클립 공간을 위한 mat4.orthoZO 사용 (전면 50% 뎁스 클리핑 완벽 방지)
                mat4.orthoZO(proj, -orthoHalfWidth, orthoHalfWidth, -orthoHalfHeight, orthoHalfHeight, 0.0, maxCameraDist * 2.0);

                // 🌲 모든 64개 각도에서 수목이 일관되게 정립하도록 월드 Up 벡터 적용
                const upVec = (Math.abs(normY) > 0.999) ? [0, 0, -1] : [0, 1, 0];
                mat4.lookAt(view, [camX, camY, camZ], [centerX, centerY, centerZ], upVec as any);
                mat4.multiply(projView, proj, view);


                renderPassViews.push({
                    projView,
                    normX,
                    normY,
                    normZ,
                    vpX: gx * tileSize,
                    vpY: gy * tileSize,
                    tileSize
                });
            }
        }

        this.#initBindGroupLayouts(redGPUContext);

        const resourceManager = redGPUContext.resourceManager;
        const emptyTexView = resourceManager.emptyBitmapTextureView;
        const basicSampler = resourceManager.basicSampler;

        // 1. 🌲 서브메시별 머티리얼 BindGroup 1회 사전 생성 (루프 밖 캐싱)
        const subBindGroups: (GPUBindGroup | null)[] = [];
        for (let s = 0; s < subMeshes.length; s++) {
            const sub = subMeshes[s];
            if (sub.isImpostor) {
                subBindGroups.push(null);
                continue;
            }
            const mat = sub.material;
            const diffTex = mat.diffuseTexture || mat.baseColorTexture;
            const diffSampler = mat.diffuseTextureSampler || mat.baseColorTextureSampler || basicSampler;
            const normTex = mat.normalTexture;
            const normSampler = mat.normalTextureSampler || basicSampler;
            const ormTex = mat.packedORMTexture || mat.metallicRoughnessTexture || mat.occlusionTexture;
            const ormSampler = mat.packedORMTextureSampler || mat.metallicRoughnessTextureSampler || basicSampler;

            const diffView = (diffTex && diffTex.gpuTexture) ? diffTex.gpuTexture.createView() : emptyTexView;
            const normView = (normTex && normTex.gpuTexture) ? normTex.gpuTexture.createView() : emptyTexView;
            const ormView = (ormTex && ormTex.gpuTexture) ? ormTex.gpuTexture.createView() : emptyTexView;

            const bg = gpuDevice.createBindGroup({
                label: `BakeBindGroup_${s}`,
                layout: this.#bakeBindGroupLayout!,
                entries: [
                    {binding: 0, resource: diffView},
                    {binding: 1, resource: diffSampler.gpuSampler},
                    {binding: 2, resource: normView},
                    {binding: 3, resource: normSampler.gpuSampler},
                    {binding: 4, resource: ormView},
                    {binding: 5, resource: ormSampler.gpuSampler},
                ]
            });
            subBindGroups.push(bg);
        }

        // 2. 🌲 전체 뷰포트 x 서브메시용 단일 통합 인스턴스 버퍼 계산 및 1회 생성 (GPUBuffer 256개 -> 1개)
        const totalViews = renderPassViews.length;
        const totalSub = subMeshes.length;
        const totalDrawCalls = totalViews * totalSub;
        const strideFloats = 48;
        const totalFloats = totalDrawCalls * strideFloats;
        const allInstanceData = new Float32Array(totalFloats);

        const tempMVP = mat4.create();
        const tempNMat = mat4.create();

        let drawSlot = 0;
        for (let v = 0; v < totalViews; v++) {
            const vpInfo = renderPassViews[v];
            for (let s = 0; s < totalSub; s++) {
                const sub = subMeshes[s];
                const baseOffset = drawSlot * strideFloats;
                drawSlot++;

                if (sub.isImpostor) continue;

                mat4.multiply(tempMVP, vpInfo.projView, sub.relativeModelMatrix);
                mat4.invert(tempNMat, sub.relativeModelMatrix);
                mat4.transpose(tempNMat, tempNMat);

                let r = 1.0, g = 1.0, b = 1.0, a = 1.0;
                let roughness = 0.7;
                let metallic = 0.0;
                let ao = 1.0;
                let cutOff = 0.35;
                let useVertexColor = false;
                const mat = sub.material;
                if (mat) {
                    const bcf = mat.baseColorFactor || mat.diffuseColor || mat.color;
                    if (bcf) {
                        if (Array.isArray(bcf) || ArrayBuffer.isView(bcf)) {
                            r = bcf[0] ?? 1.0;
                            g = bcf[1] ?? 1.0;
                            b = bcf[2] ?? 1.0;
                            a = bcf[3] ?? 1.0;
                        } else if (typeof bcf.r === 'number') {
                            r = bcf.r;
                            g = bcf.g;
                            b = bcf.b;
                            a = bcf.a ?? 1.0;
                        }
                    }
                    useVertexColor = !!mat.useVertexColor;
                    if (typeof mat.roughnessFactor === 'number') roughness = mat.roughnessFactor;
                    else if (typeof mat.roughness === 'number') roughness = mat.roughness;
                    if (typeof mat.metallicFactor === 'number') metallic = mat.metallicFactor;
                    else if (typeof mat.metallic === 'number') metallic = mat.metallic;
                    if (typeof mat.occlusionStrength === 'number') ao = mat.occlusionStrength;
                    if (typeof mat.cutOff === 'number' && mat.cutOff > 0) cutOff = mat.cutOff;
                }

                const diffTex = mat.diffuseTexture || mat.baseColorTexture;
                const normTex = mat.normalTexture;
                const ormTex = mat.packedORMTexture || mat.metallicRoughnessTexture || mat.occlusionTexture;
                const hasDiff = !!(diffTex && diffTex.gpuTexture);
                const hasNorm = !!(normTex && normTex.gpuTexture);
                const hasORM = !!(ormTex && ormTex.gpuTexture);
                const isFoliage = mat?.isFoliage !== false;

                allInstanceData.set(tempMVP, baseOffset);

                // baseColorFactor (r, g, b, a)
                allInstanceData[baseOffset + 16] = r;
                allInstanceData[baseOffset + 17] = g;
                allInstanceData[baseOffset + 18] = b;
                allInstanceData[baseOffset + 19] = a;

                // materialParams (roughness, metallic, ao, cutOff)
                allInstanceData[baseOffset + 20] = roughness;
                allInstanceData[baseOffset + 21] = metallic;
                allInstanceData[baseOffset + 22] = ao;
                allInstanceData[baseOffset + 23] = cutOff;

                // textureFlags (hasDiff, hasNorm, hasORM, useVertexColor)
                allInstanceData[baseOffset + 24] = hasDiff ? 1.0 : 0.0;
                allInstanceData[baseOffset + 25] = hasNorm ? 1.0 : 0.0;
                allInstanceData[baseOffset + 26] = hasORM ? 1.0 : 0.0;
                allInstanceData[baseOffset + 27] = useVertexColor ? 1.0 : 0.0;


                // mMat with translation in w (Exact World Position computation)
                const m = sub.relativeModelMatrix;
                allInstanceData[baseOffset + 28] = m[0];
                allInstanceData[baseOffset + 29] = m[1];
                allInstanceData[baseOffset + 30] = m[2];
                allInstanceData[baseOffset + 31] = m[12]; // transX

                allInstanceData[baseOffset + 32] = m[4];
                allInstanceData[baseOffset + 33] = m[5];
                allInstanceData[baseOffset + 34] = m[6];
                allInstanceData[baseOffset + 35] = m[13]; // transY

                allInstanceData[baseOffset + 36] = m[8];
                allInstanceData[baseOffset + 37] = m[9];
                allInstanceData[baseOffset + 38] = m[10];
                allInstanceData[baseOffset + 39] = m[14]; // transZ

                // sphereCenterRadius
                allInstanceData[baseOffset + 40] = centerX;
                allInstanceData[baseOffset + 41] = centerY;
                allInstanceData[baseOffset + 42] = centerZ;
                allInstanceData[baseOffset + 43] = maxRadius;

                // cameraDir (xyz: normDir, w: isFoliage)
                allInstanceData[baseOffset + 44] = vpInfo.normX;
                allInstanceData[baseOffset + 45] = vpInfo.normY;
                allInstanceData[baseOffset + 46] = vpInfo.normZ;
                allInstanceData[baseOffset + 47] = isFoliage ? 1.0 : 0.0;

            }
        }

        const sharedTransformGPUBuffer = gpuDevice.createBuffer({
            label: `BakeSharedInstanceDataBuffer_${bakeName}`,
            size: totalFloats * 4,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        new Float32Array(sharedTransformGPUBuffer.getMappedRange()).set(allInstanceData);
        sharedTransformGPUBuffer.unmap();

        const commandEncoder = gpuDevice.createCommandEncoder({label: `BakeImpostor_${bakeName}`});
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: bakedGPUTexture.createView({baseMipLevel: 0, mipLevelCount: 1}),
                    clearValue: {r: 0, g: 0, b: 0, a: 0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                {
                    view: bakedNormalGPUTexture.createView({baseMipLevel: 0, mipLevelCount: 1}),
                    clearValue: {r: 0.5, g: 0.5, b: 1.0, a: 0.0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },

                {
                    view: bakedORMGPUTexture.createView({baseMipLevel: 0, mipLevelCount: 1}),
                    clearValue: {r: 1.0, g: 0.7, b: 0.0, a: 0.0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: depthGPUTexture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'discard',
            },
        });

        let currentDrawSlot = 0;
        for (let v = 0; v < totalViews; v++) {
            const vpInfo = renderPassViews[v];
            renderPass.setViewport(vpInfo.vpX, vpInfo.vpY, vpInfo.tileSize, vpInfo.tileSize, 0, 1);
            renderPass.setScissorRect(vpInfo.vpX, vpInfo.vpY, vpInfo.tileSize, vpInfo.tileSize);

            for (let s = 0; s < totalSub; s++) {
                const sub = subMeshes[s];
                const bufferOffsetBytes = currentDrawSlot * strideFloats * 4;
                currentDrawSlot++;

                if (sub.isImpostor) continue;

                const pipeline = this.#getOrCreateBakePipeline(redGPUContext, sub);
                if (!pipeline) continue;

                renderPass.setPipeline(pipeline);

                const bindGroup = subBindGroups[s];
                if (bindGroup) {
                    renderPass.setBindGroup(0, bindGroup);
                }

                const vBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
                if (!vBuffer) continue;

                renderPass.setVertexBuffer(0, vBuffer);
                renderPass.setVertexBuffer(1, sharedTransformGPUBuffer, bufferOffsetBytes);

                if (sub.isIndexed && sub.geometry.indexBuffer?.gpuBuffer) {
                    renderPass.setIndexBuffer(sub.geometry.indexBuffer.gpuBuffer, sub.indexFormat || 'uint32');
                    renderPass.drawIndexed(sub.indexCount);
                } else {
                    renderPass.draw(sub.vertexCount);
                }
            }
        }

        renderPass.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        depthGPUTexture.destroy();
        sharedTransformGPUBuffer.destroy();

        // 🌲 Mipmap generation for BaseColor, Normal, and ORM textures
        if (mipLevelCount > 1) {
            redGPUContext.resourceManager.mipmapGenerator.generateMipmap(
                bakedGPUTexture,
                {
                    size: [atlasWidth, atlasHeight, 1],
                    mipLevelCount,
                    format: 'rgba8unorm-srgb',
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                },
                false,
                COMMAND_ENCODER_TYPE.IMMEDIATE
            );

            redGPUContext.resourceManager.mipmapGenerator.generateMipmap(
                bakedNormalGPUTexture,
                {
                    size: [atlasWidth, atlasHeight, 1],
                    mipLevelCount,
                    format: 'rgba8unorm',
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                },
                false,
                COMMAND_ENCODER_TYPE.IMMEDIATE
            );

            redGPUContext.resourceManager.mipmapGenerator.generateMipmap(
                bakedORMGPUTexture,
                {
                    size: [atlasWidth, atlasHeight, 1],
                    mipLevelCount,
                    format: 'rgba8unorm',
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                },
                false,
                COMMAND_ENCODER_TYPE.IMMEDIATE
            );
        }

        const directTexture = new DirectTexture(redGPUContext, `BakedFoliageImpostorAtlas_${bakeName}_${Date.now()}_${Math.random()}`, bakedGPUTexture);
        const directNormalTexture = new DirectTexture(redGPUContext, `BakedFoliageImpostorNormalAtlas_${bakeName}_${Date.now()}_${Math.random()}`, bakedNormalGPUTexture);
        const directORMTexture = new DirectTexture(redGPUContext, `BakedFoliageImpostorORMAtlas_${bakeName}_${Date.now()}_${Math.random()}`, bakedORMGPUTexture);

        return {
            baseColorTexture: directTexture,
            texture: directTexture,
            normalTexture: directNormalTexture,
            packedORMTexture: directORMTexture,
            ormTexture: directORMTexture,
            width: actualQuadWidth,
            height: actualQuadHeight,
            depth: actualQuadWidth,
            bottomOffset: actualBottomOffset,
            tileUVScale: [1.0, 1.0] as [number, number],
            tileUVOffset: [0.0, 0.0] as [number, number],
        };

    }

    static #initBindGroupLayouts(redGPUContext: RedGPUContext) {
        if (!this.#bakeBindGroupLayout) {
            this.#bakeBindGroupLayout = redGPUContext.gpuDevice.createBindGroupLayout({
                label: 'FoliageImpostorBake_BindGroupLayout',
                entries: [
                    {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                    {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                    {binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                    {binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                    {binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                    {binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                ]
            });
        }
    }

    static #getOrCreateBakePipeline(redGPUContext: RedGPUContext, sub: FoliageSubMesh): GPURenderPipeline | null {
        const gpuDevice = redGPUContext.gpuDevice;
        const key = `BakePipeline_MRT3_${sub.strideBytes}_${sub.material?.uuid || 'def'}`;
        let pipeline = this.#bakePipelineCache.get(key);
        if (pipeline) return pipeline;

        const resourceManager = redGPUContext.resourceManager;

        const vModule = resourceManager.createGPUShaderModule('FoliageImpostorBakeVertexModule', {
            code: impostorBakeVertexWGSL
        });
        const fModule = resourceManager.createGPUShaderModule('FoliageImpostorBakeFragmentModule', {
            code: impostorBakeShaderWGSL
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'BakePipelineLayout',
            bindGroupLayouts: [this.#bakeBindGroupLayout!]
        });

        pipeline = gpuDevice.createRenderPipeline({
            label: key,
            layout: pipelineLayout,
            vertex: {
                module: vModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: Math.max(sub.strideBytes, 72),
                        attributes: [
                            {shaderLocation: 0, offset: 0, format: 'float32x3'},
                            {shaderLocation: 1, offset: 12, format: 'float32x3'},
                            {shaderLocation: 2, offset: 24, format: 'float32x2'},
                            {shaderLocation: 3, offset: 32, format: 'float32x2'},
                            {shaderLocation: 4, offset: 40, format: 'float32x4'},
                            {shaderLocation: 5, offset: 56, format: 'float32x4'},
                        ]
                    },
                    {
                        arrayStride: 48 * 4,
                        stepMode: 'instance',
                        attributes: [
                            {shaderLocation: 6, offset: 0, format: 'float32x4'},
                            {shaderLocation: 7, offset: 16, format: 'float32x4'},
                            {shaderLocation: 8, offset: 32, format: 'float32x4'},
                            {shaderLocation: 9, offset: 48, format: 'float32x4'},
                            {shaderLocation: 10, offset: 64, format: 'float32x4'},
                            {shaderLocation: 11, offset: 80, format: 'float32x4'},
                            {shaderLocation: 12, offset: 96, format: 'float32x4'},
                            {shaderLocation: 13, offset: 112, format: 'float32x4'},
                            {shaderLocation: 14, offset: 128, format: 'float32x4'},
                            {shaderLocation: 15, offset: 144, format: 'float32x4'},
                            {shaderLocation: 16, offset: 160, format: 'float32x4'},
                            {shaderLocation: 17, offset: 176, format: 'float32x4'},
                        ]
                    }
                ]
            },
            fragment: {
                module: fModule,
                entryPoint: 'main',
                targets: [
                    {
                        format: 'rgba8unorm-srgb',
                        blend: undefined
                    },
                    {
                        format: 'rgba8unorm',
                        blend: undefined
                    },
                    {
                        format: 'rgba8unorm',
                        blend: undefined
                    }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            }
        });

        this.#bakePipelineCache.set(key, pipeline);
        return pipeline;
    }
}

export default FoliageImpostorBaker;

