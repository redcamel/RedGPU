import {mat4} from "gl-matrix";
import RedGPUContext from '../../../../context/RedGPUContext';
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";
import AScatterMegaBuffer, {
    DRAW_INDEXED_INDIRECT_ARGS_COUNT,
    ScatterBaseSegmentAllocation
} from '../../../core/scatter/AScatterMegaBuffer';
import foliageCullWGSL from '../culling/foliageCull.wgsl';
import FoliageRenderUnit from '../FoliageRenderUnit';
import {FoliageLODInfo} from '../Foliage';
import consoleAndThrowError from '../../../../utils/consoleAndThrowError';

const SHADOW_CASCADE_COUNT = 4;

export interface FoliageTypeAllocation extends ScatterBaseSegmentAllocation {
    name: string;
}

class FoliageMegaBuffer extends AScatterMegaBuffer {
    #globalUniformBytes: number;

    #shadowCulledGPUBuffer: GPUBuffer | null = null;
    #shadowIndirectGPUBuffer: GPUBuffer | null = null;
    #unifiedGlobalUniformGPUBuffer: GPUBuffer | null = null;
    #shadowIndirectResetTemplateGPUBuffer: GPUBuffer | null = null;

    #cpuUnifiedGlobalUniformData: Float32Array;
    #cpuUnifiedGlobalUniformUint32: Uint32Array;

    #shadowIndirectResetTemplate: Uint32Array;
    #dirtyTypeParams: boolean = true;

    #allocations: Map<string, FoliageTypeAllocation> = new Map();
    #allocatedTypes: FoliageTypeAllocation[] = [];

    #unifiedCullingBindGroup: GPUBindGroup | null = null;
    #cachedHZBTextureView: GPUTextureView | null = null;
    #cachedHZBSampler: GPUSampler | null = null;

    constructor(
        redGPUContext: RedGPUContext,
        initialCapacity: number = 65536,
        maxTypes: number = 64
    ) {
        const {resourceManager} = redGPUContext;
        const shaderInfo = resourceManager.wgslParser.parse(
            'Foliage_Cull_ShaderModule',
            foliageCullWGSL
        );

        super(
            redGPUContext,
            {
                shaderInfo,
                instanceStructName: 'FoliageInstance',
                typeParamStructName: 'FoliageTypeParam'
            },
            initialCapacity,
            maxTypes,
            maxTypes * 8
        );

        this.#shadowIndirectResetTemplate = new Uint32Array(
            this.maxRenderUnits * DRAW_INDEXED_INDIRECT_ARGS_COUNT * SHADOW_CASCADE_COUNT
        );

        const {uniforms, structs} = shaderInfo;
        const globalUniformBytes =
            uniforms?.['globalUniforms']?.arrayBufferByteLength ??
            structs?.['FoliageCullingUniforms']?.arrayBufferByteLength;
        if (!globalUniformBytes) {
            throw new Error('[FoliageMegaBuffer] Failed to reflect "FoliageCullingUniforms" struct size from foliageCullWGSL.');
        }

        this.#globalUniformBytes = globalUniformBytes;
        const globalUniformFloats = globalUniformBytes / Float32Array.BYTES_PER_ELEMENT;
        this.#cpuUnifiedGlobalUniformData = new Float32Array(globalUniformFloats);
        this.#cpuUnifiedGlobalUniformUint32 = new Uint32Array(this.#cpuUnifiedGlobalUniformData.buffer);

        this.#initBuffers();
    }

    get shadowCulledGPUBuffer(): GPUBuffer | null {
        return this.#shadowCulledGPUBuffer;
    }

    get shadowIndirectGPUBuffer(): GPUBuffer | null {
        return this.#shadowIndirectGPUBuffer;
    }

    override get isReady(): boolean {
        return super.isReady && this.culledGPUBuffer != null && this.#shadowCulledGPUBuffer != null && this.#unifiedGlobalUniformGPUBuffer != null;
    }

    allocateType(
        name: string,
        maxInstances: number,
        renderUnits: FoliageRenderUnit[],
        shadowMergedRenderUnits?: FoliageRenderUnit[],
        lodInfoList?: FoliageLODInfo[]
    ): FoliageTypeAllocation {
        const existing = this.#allocations.get(name);
        if (existing) {
            return existing;
        }

        const typeId = this.#allocatedTypes.length;
        if (typeId >= this.maxTypes) {
            throw new Error(`[FoliageMegaBuffer] Maximum supported FoliageTypes (${this.maxTypes}) exceeded.`);
        }

        const renderUnitCount = renderUnits.length;
        const baseSegment = this.allocateBaseSegment(name, maxInstances, renderUnitCount, 8);
        const {culledBaseOffset, indirectBaseOffset, maxInstances: alignedMaxInstances} = baseSegment;

        const allocation: FoliageTypeAllocation = {
            ...baseSegment,
            typeId,
            name,
            renderUnitCount,
            instanceCount: 0
        };

        this.#allocations.set(name, allocation);
        this.#allocatedTypes.push(allocation);

        const {strideBytes} = this;

        for (let s = 0; s < renderUnitCount; s++) {
            const unit = renderUnits[s];
            const {lodIndex} = unit;
            unit.instanceBufferOffset = (culledBaseOffset + (lodIndex * alignedMaxInstances)) * strideBytes;
            unit.indirectOffsetBytes = (indirectBaseOffset + s) * 20;
        }

        if (shadowMergedRenderUnits && lodInfoList) {
            for (let i = 0; i < shadowMergedRenderUnits.length; i++) {
                const shadowUnit = shadowMergedRenderUnits[i];
                const {lodIndex} = shadowUnit;
                let lodInfo: any = null;
                for (let l = 0; l < lodInfoList.length; l++) {
                    if (lodInfoList[l].lodIndex === lodIndex) {
                        lodInfo = lodInfoList[l];
                        break;
                    }
                }
                const unitOffset = lodInfo?.renderUnitOffset ?? 0;
                shadowUnit.instanceBufferOffset = (culledBaseOffset + (lodIndex * alignedMaxInstances)) * strideBytes;
                shadowUnit.indirectOffsetBytes = (indirectBaseOffset + unitOffset) * 20;
            }
        }

        this.registerRenderUnitsToTemplate(renderUnits, indirectBaseOffset, shadowMergedRenderUnits, lodInfoList);
        this.invalidateUnifiedCullingBindGroup();

        return allocation;
    }

    updateUnifiedGlobalUniforms(
        renderViewStateData: RenderViewStateData,
        fovFactor: number,
        viewProjectionMatrix: mat4 | null = null,
        hzbWidth: number = 512.0,
        hzbHeight: number = 256.0,
        depthBias: number = 0.002
    ): void {
        const {typeParamsGPUBuffer} = this;
        if (!typeParamsGPUBuffer) return;

        const {
            view,
            activeCascadeCount,
            cascadeSplitDepths,
            cascadeShadowFrustumPlanesByCascade,
            frustumPlanesFlat: mainFrustumPlanes
        } = renderViewStateData;
        const {rawCamera, pixelRectArray, hierarchicalZBuffer} = view;
        const {x, y, z} = rawCamera;
        const viewportHeight = pixelRectArray[3];
        const hzbEnabled = !!hierarchicalZBuffer?.textureView;

        const gf32 = this.#cpuUnifiedGlobalUniformData;
        const gu32 = this.#cpuUnifiedGlobalUniformUint32;
        const {totalAllocatedInstances, maxRenderUnits, instanceCapacity} = this;

        gf32[0] = x;
        gf32[1] = y;
        gf32[2] = z;
        gu32[3] = totalAllocatedInstances;

        gf32[4] = fovFactor > 0 ? fovFactor : 1.0;
        gu32[5] = maxRenderUnits;
        gu32[6] = instanceCapacity * 8;
        gu32[7] = activeCascadeCount;

        gu32[8] = (hzbEnabled && viewProjectionMatrix) ? 1 : 0;
        gf32[9] = viewportHeight > 0 ? viewportHeight : 1080.0;
        gf32[10] = depthBias;
        gf32[11] = 0;

        gf32[12] = 0;
        gf32[13] = 0;
        gf32[14] = 0;
        gf32[15] = 0;

        if (viewProjectionMatrix) {
            gf32.set(viewProjectionMatrix, 16);
        } else {
            gf32.fill(0, 16, 32);
        }

        gf32.set(mainFrustumPlanes, 32);

        for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
            const cascadeBase = 56 + c * 28;
            if (c < activeCascadeCount && cascadeShadowFrustumPlanesByCascade?.[c]) {
                gf32[cascadeBase] = cascadeSplitDepths?.[c] ?? 0.0;
                gu32[cascadeBase + 1] = 1;
                gu32[cascadeBase + 2] = 0;
                gu32[cascadeBase + 3] = 0;
                gf32.set(cascadeShadowFrustumPlanesByCascade[c], cascadeBase + 4);
            } else {
                gf32[cascadeBase] = 0.0;
                gu32[cascadeBase + 1] = 0;
                gu32[cascadeBase + 2] = 0;
                gu32[cascadeBase + 3] = 0;
                gf32.fill(0, cascadeBase + 4, cascadeBase + 28);
            }
        }

        const count = this.#allocatedTypes.length;
        const {typeParamFloats, cpuTypeParamsUint32} = this;
        for (let i = 0; i < count; i++) {
            const alloc = this.#allocatedTypes[i];
            const {typeId, instanceCount} = alloc;
            const baseOffset = typeId * typeParamFloats;
            const prevCount = cpuTypeParamsUint32[baseOffset + 9];
            if (prevCount !== instanceCount) {
                cpuTypeParamsUint32[baseOffset + 9] = instanceCount;
                this.#dirtyTypeParams = true;
            }
        }

        const {gpuDevice} = this;
        const {buffer, byteOffset} = gf32;
        const globalUniformBytes = this.#globalUniformBytes;
        gpuDevice.queue.writeBuffer(
            this.#unifiedGlobalUniformGPUBuffer,
            0,
            buffer,
            byteOffset,
            globalUniformBytes
        );

        if (this.#dirtyTypeParams) {
            this.#dirtyTypeParams = false;
            const {buffer, byteOffset} = this.cpuTypeParamsBuffer;
            gpuDevice.queue.writeBuffer(
                typeParamsGPUBuffer,
                0,
                buffer,
                byteOffset,
                this.#allocatedTypes.length * typeParamFloats * 4
            );
        }
    }

    updateTypeParams(
        allocation: FoliageTypeAllocation,
        cullingDistance: number,
        fadeStartDistance: number,
        boundingRadius: number,
        bottomOffset: number,
        lodInfoList: FoliageLODInfo[],
        shadowCullDistance: number = 300.0,
        height: number = 2.0
    ): void {
        this.#dirtyTypeParams = true;
        const {
            typeId,
            maxInstances,
            culledBaseOffset,
            indirectBaseOffset,
            rawBaseOffset,
            instanceCount
        } = allocation;
        const baseOffset = typeId * this.typeParamFloats;
        const {cpuTypeParamsBuffer: f32, cpuTypeParamsUint32: u32} = this;

        f32[baseOffset] = cullingDistance;
        f32[baseOffset + 1] = fadeStartDistance;
        f32[baseOffset + 2] = boundingRadius;
        f32[baseOffset + 3] = bottomOffset;

        const numLODs = Math.min(lodInfoList.length, 8);
        u32[baseOffset + 4] = numLODs;
        u32[baseOffset + 5] = maxInstances;
        u32[baseOffset + 6] = culledBaseOffset;
        u32[baseOffset + 7] = indirectBaseOffset;

        const fadeRange = Math.max(cullingDistance - fadeStartDistance, 1.0);
        u32[baseOffset + 8] = rawBaseOffset;
        u32[baseOffset + 9] = instanceCount;
        f32[baseOffset + 10] = shadowCullDistance;

        f32[baseOffset + 11] = 1.0 / fadeRange;
        f32[baseOffset + 12] = height;
        f32[baseOffset + 13] = 0;
        f32[baseOffset + 14] = 0;
        f32[baseOffset + 15] = 0;

        for (let l = 0; l < 8; l++) {
            const lodBase = baseOffset + 16 + l * 8;
            if (l < numLODs) {
                const info = lodInfoList[l];
                const {lodDistance, renderUnitOffset, renderUnitCount} = info;
                const prevDist = l > 0 ? lodInfoList[l - 1].lodDistance : 0.0;
                const span = Math.max(lodDistance - prevDist, 5.0);
                const fadeRange = Math.max(5.0, Math.min(15.0, span * 0.10));
                const halfRange = fadeRange * 0.5;

                const enterStart = Math.max(prevDist - halfRange, 0.0);
                const enterEnd = prevDist + halfRange;
                const exitStart = lodDistance - halfRange;
                const exitEnd = lodDistance + halfRange;

                const enterSpan = Math.max(enterEnd - enterStart, 0.001);
                const exitSpan = Math.max(exitEnd - exitStart, 0.001);

                f32[lodBase] = enterStart;
                f32[lodBase + 1] = enterEnd;
                f32[lodBase + 2] = exitStart;
                f32[lodBase + 3] = exitEnd;
                f32[lodBase + 4] = 1.0 / enterSpan;
                f32[lodBase + 5] = 1.0 / exitSpan;
                u32[lodBase + 6] = renderUnitOffset;
                u32[lodBase + 7] = renderUnitCount;
            } else {
                f32[lodBase] = 999999.0;
                f32[lodBase + 1] = 999999.0;
                f32[lodBase + 2] = 999999.0;
                f32[lodBase + 3] = 999999.0;
                f32[lodBase + 4] = 0.0;
                f32[lodBase + 5] = 0.0;
                u32[lodBase + 6] = 0;
                u32[lodBase + 7] = 0;
            }
        }
    }

    getOrCreateUnifiedCullingBindGroup(
        layout: GPUBindGroupLayout,
        hzbTextureView?: GPUTextureView | null,
        hzbSampler?: GPUSampler | null
    ): GPUBindGroup | null {
        const {
            rawGPUBuffer,
            typeParamsGPUBuffer,
            culledGPUBuffer,
            indirectGPUBuffer,
            gpuDevice,
            resourceManager
        } = this;
        const shadowCulled = this.#shadowCulledGPUBuffer;
        const shadowIndirect = this.#shadowIndirectGPUBuffer;
        const globalUniform = this.#unifiedGlobalUniformGPUBuffer;

        if (!rawGPUBuffer || !typeParamsGPUBuffer || !culledGPUBuffer || !indirectGPUBuffer || !shadowCulled || !shadowIndirect || !globalUniform) {
            return null;
        }

        const {emptyR32FloatTextureView, basicSampler} = resourceManager;
        const targetHZBView = hzbTextureView ?? emptyR32FloatTextureView;
        const targetHZBSampler = hzbSampler ?? basicSampler.gpuSampler;

        if (this.#unifiedCullingBindGroup &&
            this.#cachedHZBTextureView === targetHZBView &&
            this.#cachedHZBSampler === targetHZBSampler) {
            return this.#unifiedCullingBindGroup;
        }

        this.#cachedHZBTextureView = targetHZBView;
        this.#cachedHZBSampler = targetHZBSampler;

        this.#unifiedCullingBindGroup = gpuDevice.createBindGroup({
            label: 'FoliageMegaBuffer_Culling_BindGroup',
            layout,
            entries: [
                {binding: 0, resource: {buffer: rawGPUBuffer}},
                {binding: 1, resource: {buffer: globalUniform}},
                {binding: 2, resource: {buffer: typeParamsGPUBuffer}},
                {binding: 3, resource: {buffer: culledGPUBuffer}},
                {binding: 4, resource: {buffer: indirectGPUBuffer}},
                {binding: 5, resource: {buffer: shadowCulled}},
                {binding: 6, resource: {buffer: shadowIndirect}},
                {binding: 7, resource: targetHZBView},
                {binding: 8, resource: targetHZBSampler},
            ],
        });

        return this.#unifiedCullingBindGroup;
    }

    override invalidateUnifiedCullingBindGroup(): void {
        this.#unifiedCullingBindGroup = null;
        this.#cachedHZBTextureView = null;
        this.#cachedHZBSampler = null;
    }

    registerRenderUnitsToTemplate(
        renderUnits: FoliageRenderUnit[],
        indirectBaseOffset: number,
        shadowMergedRenderUnits?: FoliageRenderUnit[],
        lodInfoList?: FoliageLODInfo[]
    ): void {
        const {maxRenderUnits} = this;

        for (let s = 0; s < renderUnits.length; s++) {
            const unit = renderUnits[s];
            const {isIndexed, indexCount, vertexCount, firstIndex} = unit;
            const count = isIndexed ? indexCount : vertexCount;
            this.registerIndirectDrawSlot(indirectBaseOffset + s, count, firstIndex);

            for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
                const shadowSlot = (c * maxRenderUnits + indirectBaseOffset + s) * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
                this.#shadowIndirectResetTemplate[shadowSlot] = count;
                this.#shadowIndirectResetTemplate[shadowSlot + 2] = firstIndex;
            }
        }

        if (shadowMergedRenderUnits && lodInfoList) {
            const hasMaskedLOD0 = renderUnits.some(({lodIndex, isMasked}) => lodIndex === 0 && isMasked);
            for (let i = 0; i < shadowMergedRenderUnits.length; i++) {
                const shadowUnit = shadowMergedRenderUnits[i];
                const {lodIndex, isIndexed, indexCount, vertexCount, firstIndex} = shadowUnit;
                if (lodIndex === 0 && hasMaskedLOD0) {
                    continue;
                }
                let lodInfo: FoliageLODInfo | null = null;
                for (let l = 0; l < lodInfoList.length; l++) {
                    if (lodInfoList[l].lodIndex === lodIndex) {
                        lodInfo = lodInfoList[l];
                        break;
                    }
                }
                if (!lodInfo) continue;
                const slotIndex = indirectBaseOffset + lodInfo.renderUnitOffset;
                const count = isIndexed ? indexCount : vertexCount;
                for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
                    const shadowSlot = (c * maxRenderUnits + slotIndex) * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
                    this.#shadowIndirectResetTemplate[shadowSlot] = count;
                    this.#shadowIndirectResetTemplate[shadowSlot + 2] = firstIndex;
                }
            }
        }

        this.syncIndirectResetTemplateToGPU(indirectBaseOffset, renderUnits.length);

        if (this.#shadowIndirectResetTemplateGPUBuffer) {
            const {buffer, byteLength} = this.#shadowIndirectResetTemplate;
            this.gpuDevice.queue.writeBuffer(
                this.#shadowIndirectResetTemplateGPUBuffer,
                0,
                buffer,
                0,
                byteLength
            );
        }
    }

    onResizeBuffers(newCapacity: number): void {
        const {gpuDevice, strideBytes} = this;
        const {VERTEX, STORAGE} = GPUBufferUsage;
        const culledBufferUsage = VERTEX | STORAGE;

        const instanceCapacity = newCapacity > 0 ? newCapacity : this.instanceCapacity;
        const culledByteSize = instanceCapacity * 8 * strideBytes;
        const maxBufferSize = gpuDevice.limits?.maxBufferSize ?? 2147483648;
        const shadowCulledByteSize = culledByteSize * SHADOW_CASCADE_COUNT;

        if (shadowCulledByteSize > maxBufferSize) {
            consoleAndThrowError(
                `[FoliageMegaBuffer] Requested shadow culled buffer size (${shadowCulledByteSize} bytes) exceeds WebGPU maxBufferSize limit (${maxBufferSize} bytes).`
            );
        }

        this.culledGPUBuffer.destroy();
        this.#shadowCulledGPUBuffer.destroy();

        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_Main',
            size: culledByteSize,
            usage: culledBufferUsage,
        });

        this.#shadowCulledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_ShadowMega',
            size: shadowCulledByteSize,
            usage: culledBufferUsage,
        });

        this.invalidateUnifiedCullingBindGroup();
    }

    onDestroy(): void {
        this.invalidateUnifiedCullingBindGroup();
        this.#shadowCulledGPUBuffer.destroy();
        this.#shadowIndirectGPUBuffer.destroy();
        this.#unifiedGlobalUniformGPUBuffer.destroy();
        this.#shadowIndirectResetTemplateGPUBuffer.destroy();

        this.#shadowCulledGPUBuffer = null;
        this.#shadowIndirectGPUBuffer = null;
        this.#unifiedGlobalUniformGPUBuffer = null;
        this.#shadowIndirectResetTemplateGPUBuffer = null;
        this.#allocations.clear();
        this.#allocatedTypes.length = 0;
        this.clearBaseAllocations();
    }

    override onResetMultiIndirectCommands(commandEncoder: GPUCommandEncoder | null): void {
        const targetGPUBuffer = this.#shadowIndirectGPUBuffer;
        const templateGPUBuffer = this.#shadowIndirectResetTemplateGPUBuffer;

        const indirectStrideBytes = DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
        const byteSize = Math.min(
            (this.maxRenderUnits * 3 + this.totalIndirectDrawCalls) * indirectStrideBytes,
            this.#shadowIndirectResetTemplate.byteLength
        );
        if (byteSize <= 0) return;

        if (commandEncoder) {
            commandEncoder.copyBufferToBuffer(
                templateGPUBuffer,
                0,
                targetGPUBuffer,
                0,
                byteSize
            );
        } else {
            this.gpuDevice.queue.writeBuffer(
                targetGPUBuffer,
                0,
                this.#shadowIndirectResetTemplate.buffer,
                0,
                byteSize
            );
        }
    }

    #initBuffers(): void {
        const {gpuDevice, instanceCapacity, maxRenderUnits, strideBytes} = this;
        const {VERTEX, STORAGE, INDIRECT, COPY_DST, COPY_SRC, UNIFORM} = GPUBufferUsage;

        const rawByteSize = Math.max(instanceCapacity * strideBytes, 64);
        const culledByteSize = rawByteSize * 8;
        const maxBufferSize = gpuDevice.limits?.maxBufferSize ?? 2147483648;
        const shadowCulledByteSize = culledByteSize * SHADOW_CASCADE_COUNT;

        if (shadowCulledByteSize > maxBufferSize) {
            consoleAndThrowError(
                `[FoliageMegaBuffer] Initial shadow culled buffer size (${shadowCulledByteSize} bytes) exceeds WebGPU maxBufferSize limit (${maxBufferSize} bytes).`
            );
        }

        const indirectByteSize = Math.max(
            maxRenderUnits * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT,
            64
        );

        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_Main',
            size: culledByteSize,
            usage: VERTEX | STORAGE,
        });

        this.#shadowCulledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_ShadowMega',
            size: shadowCulledByteSize,
            usage: VERTEX | STORAGE,
        });

        this.#shadowIndirectGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Indirect_ShadowMega',
            size: indirectByteSize * SHADOW_CASCADE_COUNT,
            usage: INDIRECT | STORAGE | COPY_DST,
        });

        this.#shadowIndirectResetTemplateGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Indirect_ShadowTemplate',
            size: indirectByteSize * SHADOW_CASCADE_COUNT,
            usage: COPY_SRC | COPY_DST,
        });

        this.#unifiedGlobalUniformGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_GlobalUniformBuffer',
            size: this.#globalUniformBytes,
            usage: UNIFORM | COPY_DST,
        });
    }
}

Object.freeze(FoliageMegaBuffer);
export default FoliageMegaBuffer;

