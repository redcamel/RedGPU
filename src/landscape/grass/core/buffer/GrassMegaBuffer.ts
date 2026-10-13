import RedGPUContext from '../../../../context/RedGPUContext';
import AScatterMegaBuffer, {type ScatterBaseSegmentAllocation} from '../../../core/scatter/AScatterMegaBuffer';
import grassCullWGSL from '../culling/grassCull.wgsl';
import type Grass from '../Grass';

interface GrassDrawSlot {
    readonly indirectOffset: number;
}

export interface GrassTypeAllocation extends ScatterBaseSegmentAllocation {
    instanceCount: number;
    nearSlots: GrassDrawSlot[];
    farSlots: GrassDrawSlot[];
}

class GrassMegaBuffer extends AScatterMegaBuffer {
    #allocations: Map<number, GrassTypeAllocation> = new Map();
    #unifiedCullingBindGroup: GPUBindGroup | null = null;
    #cachedGlobalUniformBuffer: GPUBuffer | null = null;
    #cachedCullBindGroupLayout: GPUBindGroupLayout | null = null;

    constructor(
        redGPUContext: RedGPUContext,
        initialCapacity: number = 131072,
        maxTypes: number = 64
    ) {
        const {resourceManager} = redGPUContext;
        const shaderInfo = resourceManager.wgslParser.parse(
            'Grass_Cull_ShaderModule',
            grassCullWGSL
        );

        super(
            redGPUContext,
            {
                shaderInfo,
                instanceStructName: 'GrassInstance',
                typeParamStructName: 'GrassTypeParam',
            },
            initialCapacity,
            maxTypes,
            maxTypes * 8
        );

        this.#initBuffers();
    }

    override get isReady(): boolean {
        return super.isReady && this.culledGPUBuffer !== null;
    }

    allocateType(
        typeId: number,
        maxInstances: number,
        renderUnits: { indexCount: number; firstIndex?: number }[]
    ): GrassTypeAllocation {
        const existing = this.#allocations.get(typeId);
        if (existing) {
            return existing;
        }

        const renderUnitCount = Math.max(1, renderUnits.length);
        const baseAlloc = this.allocateBaseSegment(typeId, maxInstances, renderUnitCount * 2, 2);
        const {culledBaseOffset, maxInstances: baseMax, indirectBaseOffset} = baseAlloc;

        const nearCulledOffset = culledBaseOffset;
        const farCulledOffset = culledBaseOffset + baseMax;

        const nearSlots: GrassDrawSlot[] = [];
        const farSlots: GrassDrawSlot[] = [];

        for (let s = 0; s < renderUnitCount; s++) {
            const unit = renderUnits[s];
            const {indexCount, firstIndex} = unit;
            const slotIdx = indirectBaseOffset + s;
            const nearSlot: GrassDrawSlot = {
                indirectOffset: slotIdx
            };
            this.registerIndirectDrawSlot(slotIdx, indexCount, firstIndex, 0, nearCulledOffset);
            nearSlots.push(nearSlot);
        }

        for (let s = 0; s < renderUnitCount; s++) {
            const unit = renderUnits[s];
            const {indexCount, firstIndex} = unit;
            const slotIdx = indirectBaseOffset + renderUnitCount + s;
            const farSlot: GrassDrawSlot = {
                indirectOffset: slotIdx
            };
            this.registerIndirectDrawSlot(slotIdx, indexCount, firstIndex, 0, farCulledOffset);
            farSlots.push(farSlot);
        }

        this.syncIndirectResetTemplateToGPU(indirectBaseOffset, renderUnitCount * 2);

        const alloc: GrassTypeAllocation = {
            ...baseAlloc,
            renderUnitCount,
            instanceCount: 0,
            nearSlots,
            farSlots
        };

        this.#allocations.set(typeId, alloc);
        return alloc;
    }

    freeType(typeId: number): void {
        const alloc = this.#allocations.get(typeId);
        if (alloc) {
            alloc.instanceCount = 0;
            this.#allocations.delete(typeId);
        }

        const {typeParamFloats, cpuTypeParamsBuffer, gpuDevice, typeParamsGPUBuffer} = this;
        if (typeParamFloats > 0) {
            const baseFloat = typeId * typeParamFloats;
            cpuTypeParamsBuffer.fill(0, baseFloat, baseFloat + typeParamFloats);

            if (typeParamsGPUBuffer) {
                const byteOffset = baseFloat * Float32Array.BYTES_PER_ELEMENT;
                const byteSize = typeParamFloats * Float32Array.BYTES_PER_ELEMENT;
                gpuDevice.queue.writeBuffer(
                    typeParamsGPUBuffer,
                    byteOffset,
                    cpuTypeParamsBuffer.buffer,
                    byteOffset,
                    byteSize
                );
            }
        }
    }

    getAllocation(typeId: number): GrassTypeAllocation | undefined {
        return this.#allocations.get(typeId);
    }

    updateTypeParams(typeId: number, grass: Grass, alloc: GrassTypeAllocation): void {
        const {typeParamFloats} = this;
        if (typeParamFloats === 0) return;

        const baseFloat = typeId * typeParamFloats;
        const {cpuTypeParamsBuffer: cf, cpuTypeParamsUint32: cu} = this;

        const {
            cullingDistance: cullingDist,
            farDistance: farDist,
            shadowCullDistance: shadowCullDist,
            shadowFadeStartDistance
        } = grass;
        const fadeStartDist = cullingDist * 0.75;
        const shadowFadeStartDist = Math.min(shadowFadeStartDistance, shadowCullDist);

        cf[baseFloat + 0] = cullingDist * cullingDist;
        cf[baseFloat + 1] = farDist * farDist;
        cf[baseFloat + 2] = fadeStartDist * fadeStartDist;
        cf[baseFloat + 3] = 1.0 / Math.max(0.001, cullingDist - fadeStartDist);

        const {
            rawBaseOffset,
            culledBaseOffset,
            maxInstances,
            nearSlots,
            farSlots,
            renderUnitCount,
            instanceCount
        } = alloc;

        cu[baseFloat + 4] = rawBaseOffset;
        cu[baseFloat + 5] = culledBaseOffset;
        cu[baseFloat + 6] = culledBaseOffset + maxInstances;
        const nearOffset = nearSlots[0]?.indirectOffset ?? 0;
        cu[baseFloat + 7] = nearOffset;
        cu[baseFloat + 8] = farSlots[0]?.indirectOffset ?? nearOffset;
        cu[baseFloat + 9] = renderUnitCount;
        cu[baseFloat + 10] = farSlots.length > 0 ? 1 : 0;
        cu[baseFloat + 11] = instanceCount;
        cu[baseFloat + 12] = maxInstances;
        cf[baseFloat + 13] = cullingDist;
        cf[baseFloat + 14] = shadowCullDist * shadowCullDist;
        cf[baseFloat + 15] = shadowFadeStartDist * shadowFadeStartDist;
        cf[baseFloat + 16] = 1.0 / Math.max(0.001, shadowCullDist - shadowFadeStartDist);
        cf[baseFloat + 17] = shadowCullDist;
        cu[baseFloat + 18] = 0;
        cu[baseFloat + 19] = 0;

        const {gpuDevice, typeParamsGPUBuffer} = this;
        if (typeParamsGPUBuffer) {
            const byteOffset = baseFloat * Float32Array.BYTES_PER_ELEMENT;
            const byteSize = typeParamFloats * Float32Array.BYTES_PER_ELEMENT;
            gpuDevice.queue.writeBuffer(
                typeParamsGPUBuffer,
                byteOffset,
                cf.buffer,
                byteOffset,
                byteSize
            );
        }
    }

    override invalidateUnifiedCullingBindGroup(): void {
        this.#unifiedCullingBindGroup = null;
        this.#cachedGlobalUniformBuffer = null;
        this.#cachedCullBindGroupLayout = null;
    }

    getOrCreateUnifiedCullingBindGroup(
        bindGroupLayout: GPUBindGroupLayout,
        globalUniformBuffer: GPUBuffer
    ): GPUBindGroup | null {
        const {
            gpuDevice,
            rawGPUBuffer,
            culledGPUBuffer,
            indirectGPUBuffer,
            typeParamsGPUBuffer
        } = this;

        if (!rawGPUBuffer || !culledGPUBuffer || !indirectGPUBuffer || !typeParamsGPUBuffer) {
            return null;
        }

        if (
            this.#unifiedCullingBindGroup &&
            this.#cachedCullBindGroupLayout === bindGroupLayout &&
            this.#cachedGlobalUniformBuffer === globalUniformBuffer
        ) {
            return this.#unifiedCullingBindGroup;
        }

        this.#cachedCullBindGroupLayout = bindGroupLayout;
        this.#cachedGlobalUniformBuffer = globalUniformBuffer;

        this.#unifiedCullingBindGroup = gpuDevice.createBindGroup({
            label: 'Grass_UnifiedCullingBindGroup',
            layout: bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: globalUniformBuffer}},
                {binding: 1, resource: {buffer: rawGPUBuffer}},
                {binding: 2, resource: {buffer: culledGPUBuffer}},
                {binding: 3, resource: {buffer: indirectGPUBuffer}},
                {binding: 4, resource: {buffer: typeParamsGPUBuffer}},
            ]
        });

        return this.#unifiedCullingBindGroup;
    }

    onResizeBuffers(newCapacity: number): void {
        this.invalidateUnifiedCullingBindGroup();
        const {gpuDevice, strideBytes} = this;
        const {STORAGE} = GPUBufferUsage;

        const capacity = newCapacity > 0 ? newCapacity : this.instanceCapacity;
        const culledCapacity = capacity * 2;
        const culledByteSize = culledCapacity * strideBytes;

        this.culledGPUBuffer.destroy();
        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassMegaBuffer_CulledInstances',
            size: culledByteSize,
            usage: STORAGE,
        });
    }

    onDestroy(): void {
        this.invalidateUnifiedCullingBindGroup();
        this.#allocations.clear();
        this.clearBaseAllocations();
    }

    #initBuffers(): void {
        const {gpuDevice, strideBytes, instanceCapacity} = this;
        const {STORAGE} = GPUBufferUsage;

        const culledCapacity = instanceCapacity * 2;
        const culledByteSize = culledCapacity * strideBytes;

        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassMegaBuffer_CulledInstances',
            size: culledByteSize,
            usage: STORAGE,
        });
    }
}

Object.freeze(GrassMegaBuffer);
export default GrassMegaBuffer;

