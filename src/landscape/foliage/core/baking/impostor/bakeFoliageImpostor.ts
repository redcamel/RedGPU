/**
 * [KO] 식생 옥타헤드럴 임포스터 베이커 모듈입니다.
 * [EN] Foliage octahedral impostor baker module.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import type FoliageRenderUnit from "../../FoliageRenderUnit";
import impostorBakeVertexWGSL from "./impostorBakeVertex.wgsl";
import impostorBakeShaderWGSL from "./impostorBake.wgsl";
import impostorDilationWGSL from "./impostorDilation.wgsl";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import {COMMAND_ENCODER_TYPE} from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] 식생 임포스터 베이킹 결과 인터페이스입니다.
 * [EN] Result interface for foliage impostor baking.
 */
export interface FoliageBakeResult {
    /**
     * [KO] 베이킹된 베이스 컬러 텍스처
     * [EN] Baked base color texture
     */
    baseColorTexture: DirectTexture;
    /**
     * [KO] 베이킹된 노멀 텍스처
     * [EN] Baked normal texture
     */
    normalTexture: DirectTexture;
    /**
     * [KO] 베이킹된 패킹 ORM (Occlusion, Roughness, Metallic) 텍스처
     * [EN] Baked packed ORM (Occlusion, Roughness, Metallic) texture
     */
    packedORMTexture: DirectTexture;
    /**
     * [KO] 빌보드 쿼드 너비
     * [EN] Billboard quad width
     */
    width: number;
    /**
     * [KO] 빌보드 쿼드 높이
     * [EN] Billboard quad height
     */
    height: number;
    /**
     * [KO] 빌보드 깊이
     * [EN] Billboard depth
     */
    depth: number;
    /**
     * [KO] 피벗 기준 바닥 오프셋
     * [EN] Bottom offset relative to pivot
     */
    bottomOffset: number;
}

interface ImpostorBakerContextCache {
    bakeBindGroupLayout: GPUBindGroupLayout;
    bakePipelineCache: Map<string, GPURenderPipeline>;
    dilationBindGroupLayout: GPUBindGroupLayout;
    dilationPipeline: GPUComputePipeline;
}

const contextCache: WeakMap<RedGPUContext, ImpostorBakerContextCache> = new WeakMap();
const EMPTY_FLOAT32_12: Float32Array = new Float32Array(12);

function getOrCreateContextCache(redGPUContext: RedGPUContext): ImpostorBakerContextCache {
    let cache = contextCache.get(redGPUContext);
    if (!cache) {
        const {gpuDevice, resourceManager} = redGPUContext;

        const bakeBindGroupLayout = resourceManager.createBindGroupLayout('Foliage_Impostor_Bake_BindGroupLayout', {
            label: 'Foliage_Impostor_Bake_BindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                {binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                {binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
            ]
        });

        const dilationShader = resourceManager.createGPUShaderModule('Foliage_Impostor_Dilation_ShaderModule', {
            code: impostorDilationWGSL
        });

        const dilationBindGroupLayout = resourceManager.createBindGroupLayout('Foliage_Impostor_Dilation_BindGroupLayout', {
            label: 'Foliage_Impostor_Dilation_BindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'unfilterable-float'}},
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm'}
                },
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        const dilationPipelineLayout = resourceManager.createGPUPipelineLayout('Foliage_Impostor_Dilation_PipelineLayout', {
            bindGroupLayouts: [dilationBindGroupLayout]
        });

        const dilationPipeline = gpuDevice.createComputePipeline({
            label: 'Foliage_Impostor_Dilation_ComputePipeline',
            layout: dilationPipelineLayout,
            compute: {
                module: dilationShader,
                entryPoint: 'main'
            }
        });

        cache = {
            bakeBindGroupLayout,
            bakePipelineCache: new Map(),
            dilationBindGroupLayout,
            dilationPipeline
        };
        contextCache.set(redGPUContext, cache);
    }
    return cache;
}

/**
 * [KO] 4x4 행렬이 항등 행렬(Identity Matrix)인지 여부를 검사합니다.
 * [EN] Checks whether a 4x4 matrix is an identity matrix.
 */
function isIdentityMatrix(m: mat4 | null | undefined): boolean {
    if (!m) return true;
    return (
        m[0] === 1 && m[5] === 1 && m[10] === 1 && m[15] === 1 &&
        m[1] === 0 && m[2] === 0 && m[3] === 0 &&
        m[4] === 0 && m[6] === 0 && m[7] === 0 &&
        m[8] === 0 && m[9] === 0 && m[11] === 0 &&
        m[12] === 0 && m[13] === 0 && m[14] === 0
    );
}

/**
 * [KO] 렌더 단위 배열을 순회하여 합성 AABB, 바운딩 반경 및 중심점을 계산합니다.
 * [EN] Computes the composite AABB, bounding radius, and center by traversing render units.
 * @param renderUnits -
 * [KO] 대상 렌더 단위 배열
 * [EN] Target render unit array
 * @returns
 * [KO] 계산된 바운딩 정보 (min, max, width, height, depth, center, maxRadius)
 * [EN] Computed bounding information (min, max, width, height, depth, center, maxRadius)
 */
function calculateAABBFromRenderUnits(renderUnits: FoliageRenderUnit[]): {
    min: [number, number, number];
    max: [number, number, number];
    width: number;
    height: number;
    depth: number;
    center: [number, number, number];
    maxRadius: number;
} {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    let maxHorizDistSq = 0;

    for (let s = 0; s < renderUnits.length; s++) {
        const unit = renderUnits[s];
        const {isImpostor, geometry, relativeModelMatrix} = unit;
        if (isImpostor) continue;

        const {vertexBuffer} = geometry;
        const {data, stride, vertexCount} = vertexBuffer;
        if (!data || data.length === 0) continue;

        const isIdentity = isIdentityMatrix(relativeModelMatrix);

        if (isIdentity) {
            for (let i = 0, idx = 0; i < vertexCount; i++, idx += stride) {
                const x = data[idx];
                const y = data[idx + 1];
                const z = data[idx + 2];

                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (z < minZ) minZ = z;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
                if (z > maxZ) maxZ = z;

                const horizDistSq = x * x + z * z;
                if (horizDistSq > maxHorizDistSq) maxHorizDistSq = horizDistSq;
            }
        } else {
            const modelMatrix = relativeModelMatrix;
            const m0 = modelMatrix[0], m4 = modelMatrix[4], m8 = modelMatrix[8], m12 = modelMatrix[12];
            const m1 = modelMatrix[1], m5 = modelMatrix[5], m9 = modelMatrix[9], m13 = modelMatrix[13];
            const m2 = modelMatrix[2], m6 = modelMatrix[6], m10 = modelMatrix[10], m14 = modelMatrix[14];

            for (let i = 0, idx = 0; i < vertexCount; i++, idx += stride) {
                const x = data[idx];
                const y = data[idx + 1];
                const z = data[idx + 2];

                const wx = m0 * x + m4 * y + m8 * z + m12;
                const wy = m1 * x + m5 * y + m9 * z + m13;
                const wz = m2 * x + m6 * y + m10 * z + m14;

                if (wx < minX) minX = wx;
                if (wy < minY) minY = wy;
                if (wz < minZ) minZ = wz;
                if (wx > maxX) maxX = wx;
                if (wy > maxY) maxY = wy;
                if (wz > maxZ) maxZ = wz;

                const horizDistSq = wx * wx + wz * wz;
                if (horizDistSq > maxHorizDistSq) maxHorizDistSq = horizDistSq;
            }
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
            maxRadius: 4.0
        };
    }

    const width = Math.max(maxX - minX, 0.1);
    const height = Math.max(maxY - minY, 0.1);
    const depth = Math.max(maxZ - minZ, 0.1);
    const centerX = 0.0;
    const centerY = (minY + maxY) * 0.5;
    const centerZ = 0.0;

    const halfHeight = height * 0.5;
    const calculatedMaxRadius = Math.sqrt(maxHorizDistSq + halfHeight * halfHeight);
    const maxRadius = (Number.isFinite(calculatedMaxRadius) && calculatedMaxRadius > 0.1)
        ? calculatedMaxRadius
        : Math.hypot(Math.max(Math.abs(minX), Math.abs(maxX)), halfHeight, Math.max(Math.abs(minZ), Math.abs(maxZ)));

    return {
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ],
        width,
        height,
        depth,
        center: [centerX, centerY, centerZ],
        maxRadius
    };
}

/**
 * [KO] 주어진 식생 렌더 유닛들을 8x8 옥타헤드럴 뷰로 렌더링하여 베이스컬러/노멀/ORM 아틀라스를 베이킹합니다.
 * [EN] Renders foliage render units across an 8x8 octahedral grid to bake baseColor, normal, and ORM atlases.
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param renderUnits -
 * [KO] 베이킹할 소스 렌더 유닛 배열
 * [EN] Source render unit array to bake
 * @param bakeName -
 * [KO] 베이킹 리소스 라벨용 식별자 (기본값: 'Foliage')
 * [EN] Identifier for resource labels (default: 'Foliage')
 * @returns
 * [KO] 생성된 아틀라스 텍스처 및 빌보드 치수 결과
 * [EN] Resulting atlas textures and billboard dimensions
 */
function bakeFoliageImpostor(
    redGPUContext: RedGPUContext,
    renderUnits: FoliageRenderUnit[],
    bakeName: string = 'Foliage'
): FoliageBakeResult {
    const {gpuDevice} = redGPUContext;
    const cache = getOrCreateContextCache(redGPUContext);

    const aabb = calculateAABBFromRenderUnits(renderUnits);
    const {center, maxRadius} = aabb;
    const [centerX, centerY, centerZ] = center;

        const margin = 1.25;
        const orthoHalfWidth = maxRadius * margin;
        const orthoHalfHeight = maxRadius * margin;

        const actualQuadWidth = orthoHalfWidth * 2.0;
        const actualQuadHeight = orthoHalfHeight * 2.0;
        const actualBottomOffset = centerY - orthoHalfHeight;

        const gridSize = 8;
        const tileSize = 256;
        const atlasWidth = gridSize * tileSize;
        const atlasHeight = gridSize * tileSize;
        const mipLevelCount = getMipLevelCount(atlasWidth, atlasHeight);

        const bakedGPUTexture = gpuDevice.createTexture({
            label: `Foliage_Impostor_BaseColorTexture_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            mipLevelCount,
            format: 'rgba8unorm-srgb',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
        });

        const bakedNormalGPUTexture = gpuDevice.createTexture({
            label: `Foliage_Impostor_NormalTexture_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            mipLevelCount,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
        });

        const bakedORMGPUTexture = gpuDevice.createTexture({
            label: `Foliage_Impostor_ORMTexture_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            mipLevelCount,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
        });

        const depthGPUTexture = gpuDevice.createTexture({
            label: `Foliage_Impostor_DepthTexture_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

    const {width, height, depth} = aabb;
    console.log(`[bakeFoliageImpostor 🌲 3-Atlas MRT] Baking '${bakeName}': renderUnits=${renderUnits.length}, aabb=[W:${width.toFixed(2)}, H:${height.toFixed(2)}, D:${depth.toFixed(2)}], maxRadius=${maxRadius.toFixed(2)}, quadSize=${actualQuadWidth.toFixed(2)}, center=[${centerX.toFixed(2)}, ${centerY.toFixed(2)}, ${centerZ.toFixed(2)}], bottomOffset=${actualBottomOffset.toFixed(2)}`);

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

                mat4.orthoZO(proj, -orthoHalfWidth, orthoHalfWidth, -orthoHalfHeight, orthoHalfHeight, 0.0, maxCameraDist * 2.0);

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

    const {resourceManager} = redGPUContext;
    const {basicSampler, emptyBitmapTextureView} = resourceManager;

    const cachedRenderUnits: {
            isImpostor: boolean;
            pipeline: GPURenderPipeline | null;
            bindGroup: GPUBindGroup | null;
            vertexBuffer: GPUBuffer | null;
            indexBuffer: GPUBuffer | null;
            isIndexed: boolean;
            indexCount: number;
            indexFormat: GPUIndexFormat;
            vertexCount: number;
        relativeModelMatrix: mat4 | null;
        isIdentityModelMatrix: boolean;
            matProps: Float32Array;
            modelMatProps: Float32Array;
            isFoliage: number;
        }[] = [];

    for (let s = 0; s < renderUnits.length; s++) {
        const unit = renderUnits[s];
        const {isImpostor, relativeModelMatrix} = unit;
        if (isImpostor) {
            cachedRenderUnits.push({
                isImpostor: true,
                pipeline: null,
                bindGroup: null,
                vertexBuffer: null,
                indexBuffer: null,
                isIndexed: false,
                indexCount: 0,
                indexFormat: 'uint32',
                vertexCount: 0,
                relativeModelMatrix,
                isIdentityModelMatrix: true,
                matProps: EMPTY_FLOAT32_12,
                modelMatProps: EMPTY_FLOAT32_12,
                isFoliage: 0,
            });
            continue;
        }

        const {
            material: mat,
            geometry,
            isIndexed,
            indexCount,
            indexFormat = 'uint32',
            vertexCount
        } = unit;
        const {vertexBuffer, indexBuffer} = geometry;
        const isIdentityModelMatrix = isIdentityMatrix(relativeModelMatrix);

        const {
            baseColorTexture,
            baseColorTextureSampler,
            normalTexture,
            normalTextureSampler,
            packedORMTexture,
            metallicRoughnessTexture,
            occlusionTexture,
            packedORMTextureSampler,
            metallicRoughnessTextureSampler
        } = mat;

        const diffSampler = baseColorTextureSampler || basicSampler;
        const normSampler = normalTextureSampler || basicSampler;
        const ormTex = packedORMTexture || metallicRoughnessTexture || occlusionTexture;
        const ormSampler = packedORMTextureSampler || metallicRoughnessTextureSampler || basicSampler;

        const diffView = resourceManager.getGPUResourceBitmapTextureView(baseColorTexture) || emptyBitmapTextureView;
        const normView = resourceManager.getGPUResourceBitmapTextureView(normalTexture) || emptyBitmapTextureView;
        const ormView = resourceManager.getGPUResourceBitmapTextureView(ormTex) || emptyBitmapTextureView;

            const bindGroup = gpuDevice.createBindGroup({
                label: `Foliage_Impostor_Bake_BindGroup_${s}`,
                layout: cache.bakeBindGroupLayout,
                entries: [
                    {binding: 0, resource: diffView},
                    {binding: 1, resource: diffSampler.gpuSampler},
                    {binding: 2, resource: normView},
                    {binding: 3, resource: normSampler.gpuSampler},
                    {binding: 4, resource: ormView},
                    {binding: 5, resource: ormSampler.gpuSampler},
                ]
            });

            let r = 1.0, g = 1.0, b = 1.0, a = 1.0;
            let roughness = 1.0;
            let metallic = 0.0;
            let ao = 1.0;
            let cutOff = 0.35;
        const {baseColorFactor, color} = mat;
        const bcf = baseColorFactor || color;
        if (bcf) {
            if (Array.isArray(bcf) || ArrayBuffer.isView(bcf)) {
                [r = 1.0, g = 1.0, b = 1.0, a = 1.0] = bcf as any;
            } else if (typeof bcf.r === 'number') {
                ({r, g, b, a = 1.0} = bcf);
            }
        }
        const {
            roughnessFactor,
            roughness: matRoughness,
            metallicFactor,
            metallic: matMetallic,
            occlusionStrength,
            cutOff: matCutOff,
            useVertexColor: matUseVertexColor,
            isFoliage: matIsFoliage
        } = mat;

        if (typeof roughnessFactor === 'number') roughness = roughnessFactor;
        else if (typeof matRoughness === 'number') roughness = matRoughness;
        if (typeof metallicFactor === 'number') metallic = metallicFactor;
        else if (typeof matMetallic === 'number') metallic = matMetallic;
        if (typeof occlusionStrength === 'number') ao = occlusionStrength;
        if (typeof matCutOff === 'number' && matCutOff > 0) cutOff = matCutOff;
        const useVertexColor = !!matUseVertexColor;

        const hasDiff = !!baseColorTexture?.gpuTexture;
        const hasNorm = !!normalTexture?.gpuTexture;
        const hasORM = !!ormTex?.gpuTexture;
        const isFoliage = matIsFoliage !== false ? 1.0 : 0.0;

        const matProps = new Float32Array([
            r, g, b, a,
            roughness, metallic, ao, cutOff,
            hasDiff ? 1.0 : 0.0, hasNorm ? 1.0 : 0.0, hasORM ? 1.0 : 0.0, useVertexColor ? 1.0 : 0.0
        ]);

        const modelMatProps = new Float32Array([
            relativeModelMatrix[0], relativeModelMatrix[1], relativeModelMatrix[2], relativeModelMatrix[12],
            relativeModelMatrix[4], relativeModelMatrix[5], relativeModelMatrix[6], relativeModelMatrix[13],
            relativeModelMatrix[8], relativeModelMatrix[9], relativeModelMatrix[10], relativeModelMatrix[14]
        ]);

        cachedRenderUnits.push({
            isImpostor: false,
            pipeline: getOrCreateBakePipeline(redGPUContext, unit),
            bindGroup,
            vertexBuffer: vertexBuffer.gpuBuffer,
            indexBuffer: indexBuffer?.gpuBuffer ?? null,
            isIndexed,
            indexCount,
            indexFormat,
            vertexCount,
            relativeModelMatrix,
            isIdentityModelMatrix,
            matProps,
            modelMatProps,
            isFoliage,
        });
        }

        const totalViews = renderPassViews.length;
    const totalUnits = renderUnits.length;
    const totalDrawCalls = totalViews * totalUnits;
        const strideFloats = 48;
        const totalFloats = totalDrawCalls * strideFloats;
        const allInstanceData = new Float32Array(totalFloats);

        const tempMVP = mat4.create();

        let drawSlot = 0;
        for (let v = 0; v < totalViews; v++) {
            const vpInfo = renderPassViews[v];
            const {normX, normY, normZ, projView} = vpInfo;

            for (let s = 0; s < totalUnits; s++) {
                const cached = cachedRenderUnits[s];
                const {
                    isImpostor,
                    isIdentityModelMatrix,
                    relativeModelMatrix,
                    matProps,
                    modelMatProps
                } = cached;
                const baseOffset = drawSlot * strideFloats;
                drawSlot++;

                if (isImpostor) continue;

                if (isIdentityModelMatrix || !relativeModelMatrix) {
                    allInstanceData.set(projView, baseOffset);
                } else {
                    mat4.multiply(tempMVP, projView, relativeModelMatrix);
                    allInstanceData.set(tempMVP, baseOffset);
                }

                allInstanceData.set(matProps, baseOffset + 16);
                allInstanceData.set(modelMatProps, baseOffset + 28);

                allInstanceData[baseOffset + 40] = centerX;
                allInstanceData[baseOffset + 41] = centerY;
                allInstanceData[baseOffset + 42] = centerZ;
                allInstanceData[baseOffset + 43] = maxRadius;

                allInstanceData[baseOffset + 44] = normX;
                allInstanceData[baseOffset + 45] = normY;
                allInstanceData[baseOffset + 46] = normZ;
                allInstanceData[baseOffset + 47] = cached.isFoliage;
            }
        }

        const sharedTransformGPUBuffer = gpuDevice.createBuffer({
            label: `Foliage_Impostor_Bake_SharedInstanceDataBuffer_${bakeName}`,
            size: totalFloats * 4,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        new Float32Array(sharedTransformGPUBuffer.getMappedRange()).set(allInstanceData);
        sharedTransformGPUBuffer.unmap();

        const commandEncoder = gpuDevice.createCommandEncoder({label: `Foliage_Impostor_Bake_CommandEncoder_${bakeName}`});
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
                    clearValue: {r: 0.5, g: 1.0, b: 0.5, a: 0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                {
                    view: bakedORMGPUTexture.createView({baseMipLevel: 0, mipLevelCount: 1}),
                    clearValue: {r: 1.0, g: 1.0, b: 0.0, a: 0.0},
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
            const {vpX, vpY, tileSize} = renderPassViews[v];
            renderPass.setViewport(vpX, vpY, tileSize, tileSize, 0, 1);
            renderPass.setScissorRect(vpX, vpY, tileSize, tileSize);

            for (let s = 0; s < totalUnits; s++) {
                const cached = cachedRenderUnits[s];
                const bufferOffsetBytes = currentDrawSlot * strideFloats * 4;
                currentDrawSlot++;

                const {
                    isImpostor,
                    pipeline,
                    bindGroup,
                    vertexBuffer,
                    isIndexed,
                    indexBuffer,
                    indexFormat,
                    indexCount,
                    vertexCount
                } = cached;

                if (isImpostor || !pipeline) continue;

                renderPass.setPipeline(pipeline);

                if (bindGroup) {
                    renderPass.setBindGroup(0, bindGroup);
                }

                renderPass.setVertexBuffer(0, vertexBuffer);
                renderPass.setVertexBuffer(1, sharedTransformGPUBuffer, bufferOffsetBytes);

                if (isIndexed && indexBuffer) {
                    renderPass.setIndexBuffer(indexBuffer, indexFormat);
                    renderPass.drawIndexed(indexCount);
                } else {
                    renderPass.draw(vertexCount);
                }
            }
        }

        renderPass.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        depthGPUTexture.destroy();
        sharedTransformGPUBuffer.destroy();

    executeDilation(redGPUContext, bakedGPUTexture, atlasWidth, atlasHeight, tileSize);
    executeDilation(redGPUContext, bakedNormalGPUTexture, atlasWidth, atlasHeight, tileSize);
    executeDilation(redGPUContext, bakedORMGPUTexture, atlasWidth, atlasHeight, tileSize);

        if (mipLevelCount > 1) {
            const {resourceManager} = redGPUContext;
            const {mipmapGenerator} = resourceManager;
            const {IMMEDIATE} = COMMAND_ENCODER_TYPE;

            mipmapGenerator.generateMipmap(
                bakedGPUTexture,
                {
                    size: [atlasWidth, atlasHeight, 1],
                    mipLevelCount,
                    format: 'rgba8unorm-srgb',
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                },
                false,
                IMMEDIATE
            );

            mipmapGenerator.generateMipmap(
                bakedNormalGPUTexture,
                {
                    size: [atlasWidth, atlasHeight, 1],
                    mipLevelCount,
                    format: 'rgba8unorm',
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                },
                false,
                IMMEDIATE
            );

            mipmapGenerator.generateMipmap(
                bakedORMGPUTexture,
                {
                    size: [atlasWidth, atlasHeight, 1],
                    mipLevelCount,
                    format: 'rgba8unorm',
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                },
                false,
                IMMEDIATE
            );
        }

        const directTexture = new DirectTexture(redGPUContext, `BakedFoliageImpostorAtlas_${bakeName}_${Date.now()}_${Math.random()}`, bakedGPUTexture);
        const directNormalTexture = new DirectTexture(redGPUContext, `BakedFoliageImpostorNormalAtlas_${bakeName}_${Date.now()}_${Math.random()}`, bakedNormalGPUTexture);
        const directORMTexture = new DirectTexture(redGPUContext, `BakedFoliageImpostorORMAtlas_${bakeName}_${Date.now()}_${Math.random()}`, bakedORMGPUTexture);

        return {
            baseColorTexture: directTexture,
            normalTexture: directNormalTexture,
            packedORMTexture: directORMTexture,
            width: actualQuadWidth,
            height: actualQuadHeight,
            depth,
            bottomOffset: actualBottomOffset,
        };

    }

function getOrCreateBakePipeline(redGPUContext: RedGPUContext, unit: FoliageRenderUnit): GPURenderPipeline | null {
    const cache = getOrCreateContextCache(redGPUContext);
    const {bakePipelineCache, bakeBindGroupLayout} = cache;
    const {gpuDevice, resourceManager} = redGPUContext;
    const stride = Math.max(unit.strideBytes, 72);
    const key = `Foliage_Impostor_Bake_RenderPipeline_${stride}`;
    let pipeline = bakePipelineCache.get(key);
    if (pipeline) return pipeline;

    const vModule = resourceManager.createGPUShaderModule('Foliage_Impostor_Bake_VertexModule', {
        code: impostorBakeVertexWGSL
    });
    const fModule = resourceManager.createGPUShaderModule('Foliage_Impostor_Bake_FragmentModule', {
        code: impostorBakeShaderWGSL
    });

    const pipelineLayout = resourceManager.createGPUPipelineLayout('Foliage_Impostor_Bake_PipelineLayout', {
        bindGroupLayouts: [bakeBindGroupLayout]
    });

        pipeline = gpuDevice.createRenderPipeline({
            label: key,
            layout: pipelineLayout,
            vertex: {
                module: vModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: stride,
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

        cache.bakePipelineCache.set(key, pipeline);
        return pipeline;
    }

function executeDilation(
    redGPUContext: RedGPUContext,
    targetTexture: GPUTexture,
    width: number,
    height: number,
    tileSize: number
) {
    const cache = getOrCreateContextCache(redGPUContext);
    const {dilationBindGroupLayout, dilationPipeline} = cache;
    const {gpuDevice} = redGPUContext;

    const pingPongA = gpuDevice.createTexture({
        label: 'Foliage_Impostor_Dilation_PingPongTexture_A',
        size: [width, height, 1],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST
    });

    const pingPongB = gpuDevice.createTexture({
        label: 'Foliage_Impostor_Dilation_PingPongTexture_B',
        size: [width, height, 1],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST
    });

    const steps = [1, 2, 4, 8];
    const viewA = pingPongA.createView({baseMipLevel: 0, mipLevelCount: 1});
    const viewB = pingPongB.createView({baseMipLevel: 0, mipLevelCount: 1});

    const uniformBuffers: GPUBuffer[] = [];
    const stepBindGroups: GPUBindGroup[] = [];

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const uniformBuffer = gpuDevice.createBuffer({
            label: `Foliage_Impostor_Dilation_UniformBuffer_Step${step}`,
            size: 16,
            usage: GPUBufferUsage.UNIFORM,
            mappedAtCreation: true
        });
        new Uint32Array(uniformBuffer.getMappedRange()).set([width, height, tileSize, step]);
        uniformBuffer.unmap();
        uniformBuffers.push(uniformBuffer);

        const isEven = (i % 2 === 0);
        const srcView = isEven ? viewA : viewB;
        const dstView = isEven ? viewB : viewA;

        stepBindGroups.push(gpuDevice.createBindGroup({
            label: `Foliage_Impostor_Dilation_BindGroup_Step${step}`,
            layout: dilationBindGroupLayout,
            entries: [
                {binding: 0, resource: srcView},
                {binding: 1, resource: dstView},
                {binding: 2, resource: {buffer: uniformBuffer}}
            ]
        }));
    }

    const numWorkgroupsX = Math.ceil(width / 8);
    const numWorkgroupsY = Math.ceil(height / 8);

    const commandEncoder = gpuDevice.createCommandEncoder({label: 'Foliage_Impostor_Dilation_CommandEncoder'});

    commandEncoder.copyTextureToTexture(
        {texture: targetTexture, mipLevel: 0},
        {texture: pingPongA, mipLevel: 0},
        [width, height, 1]
    );

    for (let i = 0; i < steps.length; i++) {
        const computePass = commandEncoder.beginComputePass({label: `Foliage_Impostor_Dilation_ComputePass_Step${steps[i]}`});
        computePass.setPipeline(dilationPipeline);
        computePass.setBindGroup(0, stepBindGroups[i]);
        computePass.dispatchWorkgroups(numWorkgroupsX, numWorkgroupsY);
        computePass.end();
    }

    commandEncoder.copyTextureToTexture(
        {texture: pingPongA, mipLevel: 0},
        {texture: targetTexture, mipLevel: 0},
        [width, height, 1]
    );

    gpuDevice.queue.submit([commandEncoder.finish()]);

    for (let i = 0; i < uniformBuffers.length; i++) {
        uniformBuffers[i].destroy();
    }
    pingPongA.destroy();
    pingPongB.destroy();
}

export default bakeFoliageImpostor;

