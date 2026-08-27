import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import type {FoliageSubMesh} from "../../FoliageType";
import impostorBakeShaderWGSL from "./impostorBake.wgsl";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import {COMMAND_ENCODER_TYPE} from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

export interface FoliageBakeResult {
    texture: DirectTexture;
    normalTexture: DirectTexture;
    width: number;
    height: number;
    depth: number;
    bottomOffset: number;
}

class FoliageImpostorBaker {
    static #bakePipelineCache: Map<string, GPURenderPipeline> = new Map();
    static #bakeBindGroupLayout: GPUBindGroupLayout | null = null;

    static calculateAABBFromSubMeshes(subMeshes: FoliageSubMesh[]): {
        min: [number, number, number];
        max: [number, number, number];
        width: number;
        height: number;
        depth: number
    } {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        for (let s = 0; s < subMeshes.length; s++) {
            const sub = subMeshes[s];
            if ((sub as any)._octahedralWidth !== undefined || (sub as any)._bakedWidth !== undefined) continue;

            const vBuffer = sub.geometry?.vertexBuffer;
            const vData = vBuffer?.data;
            if (!vData) continue;

            const stride = (vBuffer.interleavedStruct?.arrayStride ? vBuffer.interleavedStruct.arrayStride / 4 : 12);
            const vCount = vBuffer.vertexCount || (vData.length / stride);
            const m = sub.relativeModelMatrix;

            for (let i = 0; i < vCount; i++) {
                const idx = i * stride;
                const x = vData[idx];
                const y = vData[idx + 1];
                const z = vData[idx + 2];

                const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
                const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
                const wz = m[2] * x + m[6] * y + m[10] * z + m[14];

                if (wx < minX) minX = wx;
                if (wy < minY) minY = wy;
                if (wz < minZ) minZ = wz;
                if (wx > maxX) maxX = wx;
                if (wy > maxY) maxY = wy;
                if (wz > maxZ) maxZ = wz;
            }
        }

        if (minX === Infinity) {
            return {min: [-1.0, 0, -1.0], max: [1.0, 2.0, 1.0], width: 2.0, height: 2.0, depth: 2.0};
        }

        const width = Math.max(maxX - minX, 0.1);
        const height = Math.max(maxY - minY, 0.1);
        const depth = Math.max(maxZ - minZ, 0.1);

        return {
            min: [minX, minY, minZ],
            max: [maxX, maxY, maxZ],
            width,
            height,
            depth
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
        const bakedWidth = Math.max(aabb.width, aabb.depth);
        const bakedHeight = aabb.height;
        const centerY = aabb.min[1] + bakedHeight * 0.5;

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

        // 2. MRT Target 1: World Normal + Roughness/Opacity
        const bakedNormalGPUTexture = gpuDevice.createTexture({
            label: `BakedImpostor_Normal_${bakeName}`,
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

        const margin = 1.05;
        const orthoHalfWidth = (bakedWidth * 0.5) * margin;
        const orthoHalfHeight = (bakedHeight * 0.5) * margin;
        const actualQuadWidth = orthoHalfWidth * 2.0;
        const actualQuadHeight = orthoHalfHeight * 2.0;
        const actualBottomOffset = centerY - orthoHalfHeight;

        console.log(`[FoliageImpostorBaker 🌲 MRT] Baking '${bakeName}': subMeshes=${subMeshes.length}, quadWidth=${actualQuadWidth}, quadHeight=${actualQuadHeight}`);

        const maxCameraDist = Math.max(actualQuadWidth, actualQuadHeight) * 3.0;
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

                const camX = normX * maxCameraDist;
                const camY = centerY + normY * maxCameraDist;
                const camZ = normZ * maxCameraDist;

                const proj = mat4.create();
                const view = mat4.create();
                const projView = mat4.create();

                mat4.orthoNO(proj, -orthoHalfWidth, orthoHalfWidth, -orthoHalfHeight, orthoHalfHeight, -maxCameraDist * 2.0, maxCameraDist * 4.0);
                const upVec = (Math.abs(normY) > 0.99) ? [0, 0, -1] : [0, 1, 0];
                mat4.lookAt(view, [camX, camY, camZ], [0, centerY, 0], upVec as any);
                mat4.multiply(projView, proj, view);

                renderPassViews.push({
                    projView,
                    vpX: gx * tileSize,
                    vpY: gy * tileSize,
                    tileSize
                });
            }
        }

        this.#initBindGroupLayouts(redGPUContext);

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
                    clearValue: {r: 0.5, g: 0.5, b: 1.0, a: 0},
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

        const tempBuffersToDestroy: GPUBuffer[] = [];

        for (let v = 0; v < renderPassViews.length; v++) {
            const vpInfo = renderPassViews[v];
            renderPass.setViewport(vpInfo.vpX, vpInfo.vpY, vpInfo.tileSize, vpInfo.tileSize, 0, 1);
            renderPass.setScissorRect(vpInfo.vpX, vpInfo.vpY, vpInfo.tileSize, vpInfo.tileSize);

            for (let s = 0; s < subMeshes.length; s++) {
                const sub = subMeshes[s];
                if ((sub as any)._octahedralWidth !== undefined || (sub as any)._bakedWidth !== undefined) continue;

                const pipeline = this.#getOrCreateBakePipeline(redGPUContext, sub);
                if (!pipeline) continue;

                renderPass.setPipeline(pipeline);

                const texture = sub.material.diffuseTexture || sub.material.baseColorTexture;
                const sampler = sub.material.diffuseTextureSampler || sub.material.baseColorTextureSampler || redGPUContext.resourceManager.basicSampler;

                let hasTexture = false;
                let gpuTextureView: GPUTextureView | null = null;
                if (texture && texture.gpuTexture) {
                    gpuTextureView = texture.gpuTexture.createView();
                    hasTexture = true;
                } else {
                    gpuTextureView = redGPUContext.resourceManager.emptyBitmapTextureView;
                }

                let r = 1.0, g = 1.0, b = 1.0, a = 1.0;
                if (sub.material) {
                    const mat = sub.material;
                    if (mat.baseColorFactor && Array.isArray(mat.baseColorFactor)) {
                        r = mat.baseColorFactor[0] ?? 1.0;
                        g = mat.baseColorFactor[1] ?? 1.0;
                        b = mat.baseColorFactor[2] ?? 1.0;
                        a = mat.baseColorFactor[3] ?? 1.0;
                    } else if (mat.diffuseColor && Array.isArray(mat.diffuseColor)) {
                        r = mat.diffuseColor[0] ?? 1.0;
                        g = mat.diffuseColor[1] ?? 1.0;
                        b = mat.diffuseColor[2] ?? 1.0;
                        a = mat.diffuseColor[3] ?? 1.0;
                    }
                }

                const bindGroup = gpuDevice.createBindGroup({
                    label: `BakeBindGroup_${s}`,
                    layout: this.#bakeBindGroupLayout!,
                    entries: [
                        {binding: 0, resource: gpuTextureView},
                        {binding: 1, resource: sampler.gpuSampler},
                    ]
                });
                renderPass.setBindGroup(0, bindGroup);

                const vBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
                if (!vBuffer) continue;

                const mvp = mat4.create();
                mat4.multiply(mvp, vpInfo.projView, sub.relativeModelMatrix);

                const nMat = mat4.create();
                mat4.invert(nMat, sub.relativeModelMatrix);
                mat4.transpose(nMat, nMat);

                const instanceData = new Float32Array(36);
                instanceData.set(mvp, 0); // 0..15 (locations 4..7)
                instanceData[16] = r;     // location 8
                instanceData[17] = g;
                instanceData[18] = b;
                instanceData[19] = a;
                instanceData[20] = hasTexture ? 1.0 : 0.0; // location 9
                instanceData[21] = 0.0;
                instanceData[22] = 0.0;
                instanceData[23] = 0.0;
                // nMat 3x3 in locations 10, 11, 12
                instanceData[24] = nMat[0];
                instanceData[25] = nMat[1];
                instanceData[26] = nMat[2];
                instanceData[27] = 0.0;
                instanceData[28] = nMat[4];
                instanceData[29] = nMat[5];
                instanceData[30] = nMat[6];
                instanceData[31] = 0.0;
                instanceData[32] = nMat[8];
                instanceData[33] = nMat[9];
                instanceData[34] = nMat[10];
                instanceData[35] = 0.0;

                const transformGPUBuffer = gpuDevice.createBuffer({
                    label: `BakeInstanceDataBuffer_${s}`,
                    size: 36 * 4,
                    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
                    mappedAtCreation: true,
                });
                new Float32Array(transformGPUBuffer.getMappedRange()).set(instanceData);
                transformGPUBuffer.unmap();
                tempBuffersToDestroy.push(transformGPUBuffer);

                renderPass.setVertexBuffer(0, vBuffer);
                renderPass.setVertexBuffer(1, transformGPUBuffer);

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
        for (let b = 0; b < tempBuffersToDestroy.length; b++) {
            tempBuffersToDestroy[b].destroy();
        }

        // Mipmap generation for both BaseColor and Normal textures
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
        }

        const directTexture = new DirectTexture(redGPUContext, `BakedFoliageImpostorAtlas_${bakeName}_${Date.now()}_${Math.random()}`, bakedGPUTexture);
        const directNormalTexture = new DirectTexture(redGPUContext, `BakedFoliageImpostorNormalAtlas_${bakeName}_${Date.now()}_${Math.random()}`, bakedNormalGPUTexture);

        return {
            texture: directTexture,
            normalTexture: directNormalTexture,
            width: actualQuadWidth,
            height: actualQuadHeight,
            depth: aabb.depth,
            bottomOffset: actualBottomOffset,
        };
    }

    static #initBindGroupLayouts(redGPUContext: RedGPUContext) {
        if (!this.#bakeBindGroupLayout) {
            this.#bakeBindGroupLayout = redGPUContext.gpuDevice.createBindGroupLayout({
                label: 'FoliageImpostorBake_BindGroupLayout',
                entries: [
                    {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                    {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                ]
            });
        }
    }

    static #getOrCreateBakePipeline(redGPUContext: RedGPUContext, sub: FoliageSubMesh): GPURenderPipeline | null {
        const gpuDevice = redGPUContext.gpuDevice;
        const key = `BakePipeline_MRT_${sub.strideBytes}_${sub.material?.uuid || 'def'}`;
        let pipeline = this.#bakePipelineCache.get(key);
        if (pipeline) return pipeline;

        const resourceManager = redGPUContext.resourceManager;

        const vertexShaderCode = `
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) uv: vec2<f32>,
                @location(1) color: vec4<f32>,
                @location(2) worldNormal: vec3<f32>,
                @location(3) @interpolate(flat) useTexture: u32,
            };

            struct TransformInput {
                @location(4) mvp0: vec4<f32>,
                @location(5) mvp1: vec4<f32>,
                @location(6) mvp2: vec4<f32>,
                @location(7) mvp3: vec4<f32>,
                @location(8) color: vec4<f32>,
                @location(9) extra: vec4<f32>,
                @location(10) nMat0: vec4<f32>,
                @location(11) nMat1: vec4<f32>,
                @location(12) nMat2: vec4<f32>,
            };

            @vertex
            fn main(
                @location(0) position: vec3<f32>,
                @location(1) normal: vec3<f32>,
                @location(2) uv: vec2<f32>,
                @location(3) vertexColor: vec4<f32>,
                trans: TransformInput
            ) -> VertexOutput {
                var out: VertexOutput;
                let mvp = mat4x4<f32>(trans.mvp0, trans.mvp1, trans.mvp2, trans.mvp3);
                let nMat = mat3x3<f32>(trans.nMat0.xyz, trans.nMat1.xyz, trans.nMat2.xyz);
                out.position = mvp * vec4<f32>(position, 1.0);
                out.uv = uv;
                out.worldNormal = normalize(nMat * normal);

                var finalColor = trans.color ;
                out.color = finalColor;
                out.useTexture = u32(trans.extra.x + 0.5);
                return out;
            }
        `;

        const vModule = resourceManager.createGPUShaderModule('FoliageImpostorBakeVertexModule', {
            code: vertexShaderCode
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
                            {shaderLocation: 3, offset: 40, format: 'float32x4'},
                        ]
                    },
                    {
                        arrayStride: 36 * 4,
                        stepMode: 'instance',
                        attributes: [
                            {shaderLocation: 4, offset: 0, format: 'float32x4'},
                            {shaderLocation: 5, offset: 16, format: 'float32x4'},
                            {shaderLocation: 6, offset: 32, format: 'float32x4'},
                            {shaderLocation: 7, offset: 48, format: 'float32x4'},
                            {shaderLocation: 8, offset: 64, format: 'float32x4'},
                            {shaderLocation: 9, offset: 80, format: 'float32x4'},
                            {shaderLocation: 10, offset: 96, format: 'float32x4'},
                            {shaderLocation: 11, offset: 112, format: 'float32x4'},
                            {shaderLocation: 12, offset: 128, format: 'float32x4'},
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
