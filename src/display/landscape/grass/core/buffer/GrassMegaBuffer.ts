import RedGPUContext from "../../../../../context/RedGPUContext";

export interface GrassLODAllocation {
    lodIndex: number;
    lodDistance: number;
    indirectOffset: number;
    culledBaseOffset: number;
    indexCount: number;
    firstIndex: number;
    baseVertex: number;
}

export interface GrassTypeAllocation {
    typeId: number;
    name: string;
    maxInstances: number;
    rawBaseOffset: number;
    culledBaseOffset: number;
    indirectBaseOffset: number;
    activeCount: number;
    lods: GrassLODAllocation[];
}

export class GrassMegaBuffer {
    static readonly STRIDE_FLOATS: number = 8;
    static readonly STRIDE_BYTES: number = 32;
    static readonly MAX_TYPES: number = 16;
    static readonly MAX_INDIRECT_CALLS: number = 64;
    static readonly TYPE_PARAM_FLOATS: number = 20;

    #redGPUContext: RedGPUContext;
    #maxTotalInstances: number;
    #maxTypes: number;

    #cpuRawDataBuffer: Float32Array;
    #cpuRawDataUint32: Uint32Array;
    #cpuTypeParamsBuffer: Float32Array;
    #cpuTypeParamsUint32: Uint32Array;
    #indirectResetTemplate: Uint32Array;

    #rawGPUBuffer: GPUBuffer | null = null;
    #culledGPUBuffer: GPUBuffer | null = null;
    #indirectGPUBuffer: GPUBuffer | null = null;
    #typeParamsGPUBuffer: GPUBuffer | null = null;

    #allocations: Map<number, GrassTypeAllocation> = new Map();
    #totalAllocatedInstances: number = 0;
    #totalAllocatedCulledInstances: number = 0;
    #totalIndirectDrawCalls: number = 0;
    #typeCount: number = 0;

    #onRecreated: (() => void) | null = null;

    constructor(redGPUContext: RedGPUContext, initialCapacity: number = 131072, maxTypes: number = 16) {
        this.#redGPUContext = redGPUContext;
        this.#maxTotalInstances = Math.ceil(initialCapacity / 64) * 64;
        this.#maxTypes = maxTypes;

        this.#cpuRawDataBuffer = new Float32Array(this.#maxTotalInstances * GrassMegaBuffer.STRIDE_FLOATS);
        this.#cpuRawDataUint32 = new Uint32Array(this.#cpuRawDataBuffer.buffer);
        this.#cpuTypeParamsBuffer = new Float32Array(this.#maxTypes * GrassMegaBuffer.TYPE_PARAM_FLOATS);
        this.#cpuTypeParamsUint32 = new Uint32Array(this.#cpuTypeParamsBuffer.buffer);
        this.#indirectResetTemplate = new Uint32Array(GrassMegaBuffer.MAX_INDIRECT_CALLS * 5);

        this.#initBuffers();
    }

    get rawGPUBuffer(): GPUBuffer | null {
        return this.#rawGPUBuffer;
    }

    get culledGPUBuffer(): GPUBuffer | null {
        return this.#culledGPUBuffer;
    }

    get indirectGPUBuffer(): GPUBuffer | null {
        return this.#indirectGPUBuffer;
    }

    get typeParamsGPUBuffer(): GPUBuffer | null {
        return this.#typeParamsGPUBuffer;
    }

    get totalAllocatedInstances(): number {
        return this.#totalAllocatedInstances;
    }

    get maxTotalInstances(): number {
        return this.#maxTotalInstances;
    }

    get totalIndirectDrawCalls(): number {
        return this.#totalIndirectDrawCalls;
    }

    set onRecreated(cb: (() => void) | null) {
        this.#onRecreated = cb;
    }

    allocateType(
        typeId: number,
        name: string,
        maxInstances: number,
        lodsOrIndexCount: any,
        firstIndex: number = 0,
        baseVertex: number = 0
    ): GrassTypeAllocation {
        const rounded = Math.ceil(maxInstances / 64) * 64;

        let lodConfigs: Array<{
            lodIndex: number;
            lodDistance: number;
            indexCount: number;
            firstIndex: number;
            baseVertex: number;
        }>;

        if (Array.isArray(lodsOrIndexCount) && lodsOrIndexCount.length > 0) {
            lodConfigs = lodsOrIndexCount.map((l, i) => ({
                lodIndex: l.lodIndex ?? i,
                lodDistance: l.lodDistance ?? 9999,
                indexCount: l.indexCount ?? 0,
                firstIndex: l.firstIndex ?? 0,
                baseVertex: l.baseVertex ?? 0
            }));
        } else {
            lodConfigs = [{
                lodIndex: 0,
                lodDistance: 9999,
                indexCount: typeof lodsOrIndexCount === 'number' ? lodsOrIndexCount : 0,
                firstIndex,
                baseVertex
            }];
        }

        const totalCulledNeeded = rounded * lodConfigs.length;

        if (
            this.#totalAllocatedInstances + rounded > this.#maxTotalInstances ||
            this.#totalAllocatedCulledInstances + totalCulledNeeded > this.#maxTotalInstances * 4
        ) {
            this.#resizeBuffer(Math.max(this.#maxTotalInstances * 2, this.#totalAllocatedInstances + rounded));
        }

        const rawBaseOffset = this.#totalAllocatedInstances;
        const indirectBaseOffset = this.#totalIndirectDrawCalls;
        const culledBaseOffset = this.#totalAllocatedCulledInstances;

        const lodAllocations: GrassLODAllocation[] = [];
        for (let i = 0; i < lodConfigs.length; i++) {
            const cfg = lodConfigs[i];
            const lodIndirectOffset = this.#totalIndirectDrawCalls++;
            const lodCulledOffset = this.#totalAllocatedCulledInstances;
            this.#totalAllocatedCulledInstances += rounded;

            const lodAlloc: GrassLODAllocation = {
                lodIndex: cfg.lodIndex,
                lodDistance: cfg.lodDistance,
                indirectOffset: lodIndirectOffset,
                culledBaseOffset: lodCulledOffset,
                indexCount: cfg.indexCount,
                firstIndex: cfg.firstIndex,
                baseVertex: cfg.baseVertex
            };
            lodAllocations.push(lodAlloc);
            this.#updateIndirectTemplateForLOD(lodAlloc);
        }

        const alloc: GrassTypeAllocation = {
            typeId,
            name,
            maxInstances: rounded,
            rawBaseOffset,
            culledBaseOffset,
            indirectBaseOffset,
            activeCount: 0,
            lods: lodAllocations
        };

        this.#allocations.set(typeId, alloc);
        this.#totalAllocatedInstances += rounded;
        this.#typeCount++;

        return alloc;
    }

    writeInstanceData(
        globalInstanceIndex: number,
        x: number,
        y: number,
        z: number,
        rotationY: number,
        scaleXZ: number,
        scaleY: number
    ): void {
        const base = globalInstanceIndex * GrassMegaBuffer.STRIDE_FLOATS;
        this.#cpuRawDataBuffer[base] = x;
        this.#cpuRawDataBuffer[base + 1] = y;
        this.#cpuRawDataBuffer[base + 2] = z;
        this.#cpuRawDataBuffer[base + 3] = rotationY;
        this.#cpuRawDataBuffer[base + 4] = scaleXZ;
        this.#cpuRawDataBuffer[base + 5] = scaleY;
        this.#cpuRawDataBuffer[base + 6] = 0.0;
        this.#cpuRawDataBuffer[base + 7] = 0.0;
    }

    uploadInstances(startInstance: number, count: number): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#rawGPUBuffer || count <= 0) return;

        const byteOffset = startInstance * GrassMegaBuffer.STRIDE_BYTES;
        const byteSize = count * GrassMegaBuffer.STRIDE_BYTES;

        gpuDevice.queue.writeBuffer(
            this.#rawGPUBuffer,
            byteOffset,
            this.#cpuRawDataBuffer.buffer,
            byteOffset,
            byteSize
        );
    }

    updateTypeParams(
        typeId: number,
        cullingDistance: number,
        fadeStartDistance: number,
        shrinkStartDistance: number,
        bottomOffset: number,
        groundBlendStrength: number,
        meshHeight: number,
        rawBaseOffset: number = 0,
        activeCount: number = 0,
        culledBaseOffset: number = 0,
        indirectBaseOffset: number = 0,
        lodCount: number = 1,
        maxInstancesPerLod: number = 0,
        lodDistances: [number, number, number, number] = [9999, 9999, 9999, 9999],
        minSlopeTan2: number = 0.0,
        maxSlopeTan2: number = 999999.0,
        hasSlopeFilter: boolean = false
    ): void {
        const base = typeId * GrassMegaBuffer.TYPE_PARAM_FLOATS;
        const f32 = this.#cpuTypeParamsBuffer;
        const u32 = this.#cpuTypeParamsUint32;

        f32[base] = cullingDistance;
        f32[base + 1] = fadeStartDistance;
        f32[base + 2] = shrinkStartDistance;
        f32[base + 3] = bottomOffset;
        f32[base + 4] = groundBlendStrength;
        f32[base + 5] = meshHeight;
        u32[base + 6] = rawBaseOffset;
        u32[base + 7] = activeCount;
        u32[base + 8] = culledBaseOffset;
        u32[base + 9] = indirectBaseOffset;
        u32[base + 10] = lodCount;
        u32[base + 11] = maxInstancesPerLod;
        f32[base + 12] = lodDistances[0] ?? 9999;
        f32[base + 13] = lodDistances[1] ?? 9999;
        f32[base + 14] = lodDistances[2] ?? 9999;
        f32[base + 15] = lodDistances[3] ?? 9999;
        f32[base + 16] = minSlopeTan2;
        f32[base + 17] = maxSlopeTan2;
        u32[base + 18] = hasSlopeFilter ? 1 : 0;
        f32[base + 19] = 0.0;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice && this.#typeParamsGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#typeParamsGPUBuffer,
                base * 4,
                this.#cpuTypeParamsBuffer.buffer,
                base * 4,
                GrassMegaBuffer.TYPE_PARAM_FLOATS * 4
            );
        }
    }

    resetIndirectDrawCountsCPU(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#indirectGPUBuffer || this.#totalIndirectDrawCalls === 0) return;
        gpuDevice.queue.writeBuffer(
            this.#indirectGPUBuffer,
            0,
            this.#indirectResetTemplate.buffer,
            0,
            this.#totalIndirectDrawCalls * 5 * 4
        );
    }

    getAllocation(typeId: number): GrassTypeAllocation | undefined {
        return this.#allocations.get(typeId);
    }

    destroy(): void {
        this.#rawGPUBuffer?.destroy();
        this.#culledGPUBuffer?.destroy();
        this.#indirectGPUBuffer?.destroy();
        this.#typeParamsGPUBuffer?.destroy();

        this.#rawGPUBuffer = null;
        this.#culledGPUBuffer = null;
        this.#indirectGPUBuffer = null;
        this.#typeParamsGPUBuffer = null;

        this.#allocations.clear();
    }

    #initBuffers(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const culledCapacity = Math.max(this.#maxTotalInstances * 4, this.#totalAllocatedCulledInstances);
        const rawByteSize = this.#maxTotalInstances * GrassMegaBuffer.STRIDE_BYTES;
        const culledByteSize = culledCapacity * GrassMegaBuffer.STRIDE_BYTES;
        const indirectByteSize = GrassMegaBuffer.MAX_INDIRECT_CALLS * 5 * 4;
        const typeParamsByteSize = this.#maxTypes * GrassMegaBuffer.TYPE_PARAM_FLOATS * 4;

        this.#rawGPUBuffer?.destroy();
        this.#culledGPUBuffer?.destroy();
        this.#indirectGPUBuffer?.destroy();
        this.#typeParamsGPUBuffer?.destroy();

        this.#rawGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassMegaBuffer_RawInstances',
            size: rawByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#culledGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassMegaBuffer_CulledInstances',
            size: culledByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });

        this.#indirectGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassMegaBuffer_IndirectDraw',
            size: indirectByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST,
        });

        this.#typeParamsGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassMegaBuffer_TypeParams',
            size: typeParamsByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
    }

    #updateIndirectTemplateForLOD(lodAlloc: GrassLODAllocation): void {
        const offset = lodAlloc.indirectOffset * 5;
        this.#indirectResetTemplate[offset] = lodAlloc.indexCount;
        this.#indirectResetTemplate[offset + 1] = 0;
        this.#indirectResetTemplate[offset + 2] = lodAlloc.firstIndex;
        this.#indirectResetTemplate[offset + 3] = lodAlloc.baseVertex;
        this.#indirectResetTemplate[offset + 4] = lodAlloc.culledBaseOffset;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice && this.#indirectGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#indirectGPUBuffer,
                offset * 4,
                this.#indirectResetTemplate.buffer,
                offset * 4,
                20
            );
        }
    }

    #resizeBuffer(newCapacity: number): void {
        const oldCapacity = this.#maxTotalInstances;
        this.#maxTotalInstances = Math.ceil(newCapacity / 64) * 64;

        const newRawBuffer = new Float32Array(this.#maxTotalInstances * GrassMegaBuffer.STRIDE_FLOATS);
        newRawBuffer.set(this.#cpuRawDataBuffer);
        this.#cpuRawDataBuffer = newRawBuffer;
        this.#cpuRawDataUint32 = new Uint32Array(newRawBuffer.buffer);

        this.#initBuffers();

        if (this.#onRecreated) {
            this.#onRecreated();
        }
    }
}

export default GrassMegaBuffer;
