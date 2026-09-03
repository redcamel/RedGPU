import RedGPUContext from "../../../../../context/RedGPUContext";
import type {FoliageLODInfo} from "../../FoliageType";
import type FoliageSubMesh from "../../FoliageSubMesh";

export interface FoliageTypeAllocation {
    typeId: number;
    name: string;
    maxInstances: number;
    rawBaseOffset: number;
    culledBaseOffset: number;
    indirectBaseOffset: number;  
    subMeshCount: number;
    activeCount: number;
}

export interface CascadeCullingParam {
    maxDistance: number;
    hasShadow: boolean;
    frustumPlanes: number[][] | null;
}

class FoliageMegaBuffer {
    static readonly #STRIDE_FLOATS: number = 8;
    static readonly #STRIDE_BYTES: number = 8 * 4; 
    static readonly #MAX_TYPES: number = 64;
    static readonly #TYPE_PARAM_FLOATS: number = 44; 

    static readonly #tempFloat32: Float32Array = new Float32Array(1);
    static readonly #tempUint32: Uint32Array = new Uint32Array(FoliageMegaBuffer.#tempFloat32.buffer);
    #cpuRawDataUint32: Uint32Array;

    constructor(redGPUContext: RedGPUContext, maxTotalInstances: number = 500000, maxSubMeshes: number = 256) {
        this.#redGPUContext = redGPUContext;
        this.#maxTotalInstances = maxTotalInstances;
        this.#maxSubMeshes = maxSubMeshes;
        this.#cpuRawDataBuffer = new Float32Array(this.#maxTotalInstances * FoliageMegaBuffer.#STRIDE_FLOATS);
        this.#cpuRawDataUint32 = new Uint32Array(this.#cpuRawDataBuffer.buffer);
        this.#indirectResetTemplate = new Uint32Array(this.#maxSubMeshes * 5);
        this.#shadowIndirectResetTemplate = new Uint32Array(this.#maxSubMeshes * 5 * 4);

        this.#initBuffers();
    }

    static #floatToHalf(val: number): number {
        FoliageMegaBuffer.#tempFloat32[0] = val;
        const f = FoliageMegaBuffer.#tempUint32[0];
        const sign = (f >> 16) & 0x8000;
        let exp = ((f >> 23) & 0xFF) - 127 + 15;
        let mant = (f >> 13) & 0x03FF;
        if (exp <= 0) return sign;
        if (exp >= 31) return sign | 0x7C00;
        return sign | (exp << 10) | mant;
    }

    #redGPUContext: RedGPUContext;
    #maxTotalInstances: number;
    #maxSubMeshes: number;

    #rawGPUBuffer: GPUBuffer | null = null;
    #culledGPUBuffer: GPUBuffer | null = null;
    #indirectGPUBuffer: GPUBuffer | null = null;
    #typeParamsGPUBuffer: GPUBuffer | null = null;

    #shadowCulledGPUBuffer: GPUBuffer | null = null;
    #shadowIndirectGPUBuffer: GPUBuffer | null = null;
    #unifiedGlobalUniformGPUBuffer: GPUBuffer | null = null;
    #indirectResetTemplateGPUBuffer: GPUBuffer | null = null;
    #shadowIndirectResetTemplateGPUBuffer: GPUBuffer | null = null;

    #cpuRawDataBuffer: Float32Array;

    static #pack2x16snorm(x: number, y: number): number {
        const ix = Math.max(-32768, Math.min(32767, Math.round(x * 32767)));
        const iy = Math.max(-32768, Math.min(32767, Math.round(y * 32767)));
        return (ix & 0xFFFF) | ((iy & 0xFFFF) << 16);
    }
    #cpuTypeParamsData: Float32Array = new Float32Array(FoliageMegaBuffer.#MAX_TYPES * FoliageMegaBuffer.#TYPE_PARAM_FLOATS);
    #cpuTypeParamsUint32: Uint32Array = new Uint32Array(this.#cpuTypeParamsData.buffer);

    #cpuUnifiedGlobalUniformData: Float32Array = new Float32Array(200);
    #cpuUnifiedGlobalUniformUint32: Uint32Array = new Uint32Array(this.#cpuUnifiedGlobalUniformData.buffer);

    #indirectResetTemplate: Uint32Array;
    #shadowIndirectResetTemplate: Uint32Array;

    #dirtyTypeParams: boolean = true;

    #allocations: Map<string, FoliageTypeAllocation> = new Map();
    #allocatedTypes: FoliageTypeAllocation[] = [];
    #nextRawOffset: number = 0;
    #nextCulledOffset: number = 0;
    #nextIndirectOffset: number = 0;

    #unifiedCullingBindGroup: GPUBindGroup | null = null;
    #cachedVHTView: GPUTextureView | null = null;
    #cachedVHTSampler: GPUSampler | null = null;
    #cachedHZBView: GPUTextureView | null = null;
    #cachedHZBSampler: GPUSampler | null = null;

    static #pack2x16float(x: number, y: number): number {
        const hx = FoliageMegaBuffer.#floatToHalf(x);
        const hy = FoliageMegaBuffer.#floatToHalf(y);
        return (hx & 0xFFFF) | ((hy & 0xFFFF) << 16);
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

    get shadowCulledGPUBuffer(): GPUBuffer | null {
        return this.#shadowCulledGPUBuffer;
    }

    get shadowIndirectGPUBuffer(): GPUBuffer | null {
        return this.#shadowIndirectGPUBuffer;
    }

    get maxTotalInstances(): number {
        return this.#maxTotalInstances;
    }

    get maxSubMeshes(): number {
        return this.#maxSubMeshes;
    }

    get totalAllocatedRange(): number {
        return this.#nextRawOffset;
    }

    get totalActiveInstances(): number {
        let total = 0;
        const count = this.#allocatedTypes.length;
        for (let i = 0; i < count; i++) {
            total += this.#allocatedTypes[i].activeCount;
        }
        return total;
    }

    allocateTypeSegment(
        name: string,
        maxInstances: number,
        subMeshes: readonly FoliageSubMesh[]
    ): FoliageTypeAllocation {
        if (this.#allocations.has(name)) {
            return this.#allocations.get(name)!;
        }

        const typeId = this.#allocatedTypes.length;
        if (typeId >= FoliageMegaBuffer.#MAX_TYPES) {
            throw new Error(`[FoliageMegaBuffer] Maximum supported FoliageTypes (${FoliageMegaBuffer.#MAX_TYPES}) exceeded.`);
        }

        const subMeshCount = subMeshes.length;
        const rawBaseOffset = this.#nextRawOffset;
        const culledBaseOffset = this.#nextCulledOffset;
        const indirectBaseOffset = this.#nextIndirectOffset;

        const allocation: FoliageTypeAllocation = {
            typeId,
            name,
            maxInstances,
            rawBaseOffset,
            culledBaseOffset,
            indirectBaseOffset,
            subMeshCount,
            activeCount: 0
        };

        this.#allocations.set(name, allocation);
        this.#allocatedTypes.push(allocation);

        const baseFloat = rawBaseOffset * FoliageMegaBuffer.#STRIDE_FLOATS;
        for (let i = 0; i < maxInstances; i++) {
            this.#cpuRawDataBuffer[baseFloat + i * FoliageMegaBuffer.#STRIDE_FLOATS + 7] = typeId;
        }

        this.#nextRawOffset += maxInstances;
        this.#nextCulledOffset += maxInstances * 8; 
        this.#nextIndirectOffset += subMeshCount;

        for (let s = 0; s < subMeshCount; s++) {
            const sub = subMeshes[s];
            sub.instanceBufferOffset = (culledBaseOffset + (sub.lodIndex * maxInstances)) * FoliageMegaBuffer.#STRIDE_BYTES;
            sub.indirectOffsetBytes = (indirectBaseOffset + s) * 20;
        }

        this.registerSubMeshesToTemplate(subMeshes, indirectBaseOffset);
        this.#unifiedCullingBindGroup = null; 

        return allocation;
    }

    getAllocation(name: string): FoliageTypeAllocation | undefined {
        return this.#allocations.get(name);
    }

    writeInstancesData(allocation: FoliageTypeAllocation, data: Float32Array, count: number): void {
        allocation.activeCount = count;
        if (count <= 0) return;

        const baseFloatOffset = allocation.rawBaseOffset * FoliageMegaBuffer.#STRIDE_FLOATS;
        const writeFloats = Math.min(count * FoliageMegaBuffer.#STRIDE_FLOATS, allocation.maxInstances * FoliageMegaBuffer.#STRIDE_FLOATS);

        const typeId = allocation.typeId;
        const srcLen = Math.min(data.length, writeFloats);
        this.#cpuRawDataBuffer.set(data.subarray(0, srcLen), baseFloatOffset);

        for (let i = 0; i < count; i++) {
            const instOffset = baseFloatOffset + i * FoliageMegaBuffer.#STRIDE_FLOATS;
            this.#cpuRawDataBuffer[instOffset + 7] = typeId;
        }

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (this.#rawGPUBuffer && gpuDevice) {
            const byteOffset = baseFloatOffset * 4;
            const byteCount = writeFloats * 4;
            gpuDevice.queue.writeBuffer(
                this.#rawGPUBuffer,
                byteOffset,
                this.#cpuRawDataBuffer.buffer,
                this.#cpuRawDataBuffer.byteOffset + byteOffset,
                byteCount
            );
        }
    }

    setInstanceData(
        allocation: FoliageTypeAllocation,
        index: number,
        posX: number, posY: number, posZ: number,
        rotX: number, rotY: number, rotZ: number, rotW: number,
        scaleX: number, scaleY: number, scaleZ: number,
        fade: number = 1.0
    ): void {
        const offset = (allocation.rawBaseOffset + index) * FoliageMegaBuffer.#STRIDE_FLOATS;
        const f32 = this.#cpuRawDataBuffer;
        const u32 = this.#cpuRawDataUint32;

        f32[offset] = posX;
        f32[offset + 1] = posY;
        f32[offset + 2] = posZ;
        f32[offset + 3] = scaleY;

        u32[offset + 4] = FoliageMegaBuffer.#pack2x16snorm(rotX, rotY);
        u32[offset + 5] = FoliageMegaBuffer.#pack2x16snorm(rotZ, rotW);
        u32[offset + 6] = FoliageMegaBuffer.#pack2x16float(scaleX, scaleZ);
        f32[offset + 7] = allocation.typeId;
    }

    uploadAllocationToGPU(allocation: FoliageTypeAllocation): void {
        if (!this.#rawGPUBuffer || allocation.activeCount <= 0) return;
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const byteOffset = allocation.rawBaseOffset * FoliageMegaBuffer.#STRIDE_BYTES;
        const byteCount = allocation.activeCount * FoliageMegaBuffer.#STRIDE_BYTES;

        gpuDevice.queue.writeBuffer(
            this.#rawGPUBuffer,
            byteOffset,
            this.#cpuRawDataBuffer.buffer,
            this.#cpuRawDataBuffer.byteOffset + byteOffset,
            byteCount
        );
    }

    uploadAllocationRangeToGPU(allocation: FoliageTypeAllocation, startIndex: number, count: number): void {
        if (!this.#rawGPUBuffer || count <= 0) return;
        allocation.activeCount = Math.max(allocation.activeCount, startIndex + count);
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const startByteOffset = (allocation.rawBaseOffset + startIndex) * FoliageMegaBuffer.#STRIDE_BYTES;
        const byteCount = count * FoliageMegaBuffer.#STRIDE_BYTES;

        gpuDevice.queue.writeBuffer(
            this.#rawGPUBuffer,
            startByteOffset,
            this.#cpuRawDataBuffer.buffer,
            this.#cpuRawDataBuffer.byteOffset + startByteOffset,
            byteCount
        );
    }

    resetMultiIndirectCommands(commandEncoder?: GPUCommandEncoder): void {
        if (this.#nextIndirectOffset === 0) return;

        const mainBytes = this.#nextIndirectOffset * 20;
        const shadowResetBytes = Math.min(
            (this.#maxSubMeshes * 3 + this.#nextIndirectOffset) * 20,
            this.#shadowIndirectResetTemplate.byteLength
        );

        if (commandEncoder && this.#indirectResetTemplateGPUBuffer && this.#shadowIndirectResetTemplateGPUBuffer) {
            if (this.#indirectGPUBuffer) {
                commandEncoder.copyBufferToBuffer(
                    this.#indirectResetTemplateGPUBuffer, 0,
                    this.#indirectGPUBuffer, 0,
                    mainBytes
                );
            }
            if (this.#shadowIndirectGPUBuffer) {
                commandEncoder.copyBufferToBuffer(
                    this.#shadowIndirectResetTemplateGPUBuffer, 0,
                    this.#shadowIndirectGPUBuffer, 0,
                    shadowResetBytes
                );
            }
            return;
        }

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (this.#indirectGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#indirectGPUBuffer,
                0,
                this.#indirectResetTemplate.buffer,
                this.#indirectResetTemplate.byteOffset,
                mainBytes
            );
        }

        if (this.#shadowIndirectGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#shadowIndirectGPUBuffer,
                0,
                this.#shadowIndirectResetTemplate.buffer,
                this.#shadowIndirectResetTemplate.byteOffset,
                shadowResetBytes
            );
        }
    }

    updateUnifiedGlobalUniforms(
        camX: number, camY: number, camZ: number,
        worldSizeX: number, heightScale: number, hasVHT: boolean,
        fovFactor: number,
        mainFrustumPlanes: number[][] | null,
        cascades: readonly CascadeCullingParam[],
        activeCascadeCount: number = 4,
        hasHZB: boolean = false,
        mainProjectionViewMatrix: any = null,
        viewportHeight: number = 1080.0
    ): void {
        if (!this.#unifiedGlobalUniformGPUBuffer || !this.#typeParamsGPUBuffer) return;

        const gf32 = this.#cpuUnifiedGlobalUniformData;
        const gu32 = this.#cpuUnifiedGlobalUniformUint32;

        gf32[0] = camX;
        gf32[1] = camY;
        gf32[2] = camZ;
        gu32[3] = this.#nextRawOffset;

        gf32[4] = worldSizeX > 0 ? (1.0 / worldSizeX) : 0.0;
        gf32[5] = heightScale;
        gu32[6] = hasVHT ? 1 : 0;
        gf32[7] = fovFactor > 0 ? fovFactor : 1.0;

        gu32[8] = this.#maxSubMeshes;
        gu32[9] = this.#maxTotalInstances * 8;
        gu32[10] = activeCascadeCount;
        gu32[11] = hasHZB ? 1 : 0;
        gf32[12] = viewportHeight > 0 ? viewportHeight : 1080.0;
        gu32[13] = 0;
        gu32[14] = 0;
        gu32[15] = 0;

        if (mainFrustumPlanes && mainFrustumPlanes.length >= 6) {
            for (let p = 0; p < 6; p++) {
                const plane = mainFrustumPlanes[p];
                const baseOffset = 16 + p * 4;
                gf32[baseOffset] = plane[0];
                gf32[baseOffset + 1] = plane[1];
                gf32[baseOffset + 2] = plane[2];
                gf32[baseOffset + 3] = plane[3];
            }
        }

        for (let c = 0; c < 4; c++) {
            const cascade = cascades[c];
            const cascadeBase = 40 + c * 28;
            if (cascade && cascade.hasShadow) {
                gf32[cascadeBase] = cascade.maxDistance;
                gu32[cascadeBase + 1] = 1;
                gu32[cascadeBase + 2] = 0;
                gu32[cascadeBase + 3] = 0;

                const planes = cascade.frustumPlanes;
                if (planes && planes.length >= 6) {
                    for (let p = 0; p < 6; p++) {
                        const plane = planes[p];
                        const pOffset = cascadeBase + 4 + p * 4;
                        gf32[pOffset] = plane[0];
                        gf32[pOffset + 1] = plane[1];
                        gf32[pOffset + 2] = plane[2];
                        gf32[pOffset + 3] = plane[3];
                    }
                }
            } else {
                gf32[cascadeBase] = 0.0;
                gu32[cascadeBase + 1] = 0;
                gu32[cascadeBase + 2] = 0;
                gu32[cascadeBase + 3] = 0;
            }
        }

        if (mainProjectionViewMatrix && mainProjectionViewMatrix.length >= 16) {
            for (let m = 0; m < 16; m++) {
                gf32[152 + m] = mainProjectionViewMatrix[m];
            }
        }

        const count = this.#allocatedTypes.length;
        for (let i = 0; i < count; i++) {
            const alloc = this.#allocatedTypes[i];
            const baseOffset = alloc.typeId * FoliageMegaBuffer.#TYPE_PARAM_FLOATS;
            const prevCount = this.#cpuTypeParamsUint32[baseOffset + 9];
            if (prevCount !== alloc.activeCount) {
                this.#cpuTypeParamsUint32[baseOffset + 9] = alloc.activeCount;
                this.#dirtyTypeParams = true;
            }
        }

        const gpuDevice = this.#redGPUContext.gpuDevice;
        gpuDevice.queue.writeBuffer(
            this.#unifiedGlobalUniformGPUBuffer,
            0,
            gf32.buffer,
            gf32.byteOffset,
            672 
        );

        if (this.#dirtyTypeParams) {
            this.#dirtyTypeParams = false;
            gpuDevice.queue.writeBuffer(
                this.#typeParamsGPUBuffer,
                0,
                this.#cpuTypeParamsData.buffer,
                this.#cpuTypeParamsData.byteOffset,
                this.#allocatedTypes.length * FoliageMegaBuffer.#TYPE_PARAM_FLOATS * 4
            );
        }
    }

    updateTypeParams(
        allocation: FoliageTypeAllocation,
        cullingDistance: number,
        fadeStartDistance: number,
        boundingRadius: number,
        bottomOffset: number,
        lodInfoList: readonly FoliageLODInfo[],
        maxShadowCascadeIndex: number = 3
    ): void {
        this.#dirtyTypeParams = true;
        const typeId = allocation.typeId;
        const baseOffset = typeId * FoliageMegaBuffer.#TYPE_PARAM_FLOATS;
        const f32 = this.#cpuTypeParamsData;
        const u32 = this.#cpuTypeParamsUint32;

        f32[baseOffset] = cullingDistance;
        f32[baseOffset + 1] = fadeStartDistance;
        f32[baseOffset + 2] = boundingRadius;
        f32[baseOffset + 3] = bottomOffset;

        const numLODs = Math.min(lodInfoList.length, 8);
        u32[baseOffset + 4] = numLODs;
        u32[baseOffset + 5] = allocation.maxInstances;
        u32[baseOffset + 6] = allocation.culledBaseOffset;
        u32[baseOffset + 7] = allocation.indirectBaseOffset;

        u32[baseOffset + 8] = allocation.rawBaseOffset;
        u32[baseOffset + 9] = allocation.activeCount;
        u32[baseOffset + 10] = maxShadowCascadeIndex;
        u32[baseOffset + 11] = 0;

        for (let l = 0; l < 8; l++) {
            const lodBase = baseOffset + 12 + l * 4;
            if (l < numLODs) {
                const info = lodInfoList[l];
                f32[lodBase] = info.lodDistance;
                f32[lodBase + 1] = 0.0;
                u32[lodBase + 2] = info.subMeshOffset;
                u32[lodBase + 3] = info.subMeshCount;
            } else {
                f32[lodBase] = 999999.0;
                f32[lodBase + 1] = 0.0;
                u32[lodBase + 2] = 0;
                u32[lodBase + 3] = 0;
            }
        }
    }

    getOrCreateUnifiedCullingBindGroup(
        layout: GPUBindGroupLayout,
        vhtTextureView?: GPUTextureView,
        vhtSampler?: GPUSampler,
        hzbTextureView?: GPUTextureView,
        hzbSampler?: GPUSampler
    ): GPUBindGroup | null {
        if (!this.#rawGPUBuffer || !this.#unifiedGlobalUniformGPUBuffer || !this.#typeParamsGPUBuffer ||
            !this.#culledGPUBuffer || !this.#indirectGPUBuffer ||
            !this.#shadowCulledGPUBuffer || !this.#shadowIndirectGPUBuffer) {
            return null;
        }

        const targetVHTView = vhtTextureView || this.#redGPUContext.resourceManager.emptyTexture2DArrayView;
        const targetVHTSampler = vhtSampler || this.#redGPUContext.resourceManager.basicSampler.gpuSampler;
        const targetHZBView = hzbTextureView || this.#redGPUContext.resourceManager.emptyTexture2DArrayView;
        const targetHZBSampler = hzbSampler || this.#redGPUContext.resourceManager.basicSampler.gpuSampler;

        if (this.#unifiedCullingBindGroup &&
            this.#cachedVHTView === targetVHTView && this.#cachedVHTSampler === targetVHTSampler &&
            this.#cachedHZBView === targetHZBView && this.#cachedHZBSampler === targetHZBSampler) {
            return this.#unifiedCullingBindGroup;
        }

        const gpuDevice = this.#redGPUContext.gpuDevice;
        this.#unifiedCullingBindGroup = gpuDevice.createBindGroup({
            label: 'UnifiedFoliageMegaCullingBindGroup',
            layout,
            entries: [
                {binding: 0, resource: {buffer: this.#rawGPUBuffer}},
                {binding: 1, resource: {buffer: this.#unifiedGlobalUniformGPUBuffer}},
                {binding: 2, resource: {buffer: this.#typeParamsGPUBuffer}},
                {binding: 3, resource: {buffer: this.#culledGPUBuffer}},
                {binding: 4, resource: {buffer: this.#indirectGPUBuffer}},
                {binding: 5, resource: {buffer: this.#shadowCulledGPUBuffer}},
                {binding: 6, resource: {buffer: this.#shadowIndirectGPUBuffer}},
                {binding: 7, resource: targetVHTView},
                {binding: 8, resource: targetVHTSampler},
                {binding: 9, resource: targetHZBView},
                {binding: 10, resource: targetHZBSampler},
            ],
        });

        this.#cachedVHTView = targetVHTView;
        this.#cachedVHTSampler = targetVHTSampler;
        this.#cachedHZBView = targetHZBView;
        this.#cachedHZBSampler = targetHZBSampler;
        return this.#unifiedCullingBindGroup;
    }

    getOrCreateGlobalCullingBindGroup(
        layout: GPUBindGroupLayout,
        vhtTextureView?: GPUTextureView,
        vhtSampler?: GPUSampler,
        hzbTextureView?: GPUTextureView,
        hzbSampler?: GPUSampler
    ): GPUBindGroup | null {
        return this.getOrCreateUnifiedCullingBindGroup(layout, vhtTextureView, vhtSampler, hzbTextureView, hzbSampler);
    }

    destroy(): void {
        this.#rawGPUBuffer?.destroy();
        this.#culledGPUBuffer?.destroy();
        this.#indirectGPUBuffer?.destroy();
        this.#typeParamsGPUBuffer?.destroy();
        this.#shadowCulledGPUBuffer?.destroy();
        this.#shadowIndirectGPUBuffer?.destroy();
        this.#unifiedGlobalUniformGPUBuffer?.destroy();
        this.#indirectResetTemplateGPUBuffer?.destroy();
        this.#shadowIndirectResetTemplateGPUBuffer?.destroy();

        this.#rawGPUBuffer = null;
        this.#culledGPUBuffer = null;
        this.#indirectGPUBuffer = null;
        this.#typeParamsGPUBuffer = null;
        this.#shadowCulledGPUBuffer = null;
        this.#shadowIndirectGPUBuffer = null;
        this.#unifiedGlobalUniformGPUBuffer = null;
        this.#indirectResetTemplateGPUBuffer = null;
        this.#shadowIndirectResetTemplateGPUBuffer = null;
        this.#unifiedCullingBindGroup = null;
        this.#allocations.clear();
        this.#allocatedTypes.length = 0;
    }

    registerSubMeshesToTemplate(subMeshes: readonly FoliageSubMesh[], indirectBaseOffset: number): void {
        for (let s = 0; s < subMeshes.length; s++) {
            const sub = subMeshes[s];
            const count = sub.isIndexed ? sub.indexCount : sub.vertexCount;
            this.#indirectResetTemplate[(indirectBaseOffset + s) * 5] = count;

            for (let c = 0; c < 4; c++) {
                const shadowSlot = (c * this.#maxSubMeshes + indirectBaseOffset + s) * 5;
                this.#shadowIndirectResetTemplate[shadowSlot] = count;
            }
        }

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice && this.#indirectResetTemplateGPUBuffer && this.#shadowIndirectResetTemplateGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#indirectResetTemplateGPUBuffer,
                0,
                this.#indirectResetTemplate.buffer,
                0,
                this.#indirectResetTemplate.byteLength
            );
            gpuDevice.queue.writeBuffer(
                this.#shadowIndirectResetTemplateGPUBuffer,
                0,
                this.#shadowIndirectResetTemplate.buffer,
                0,
                this.#shadowIndirectResetTemplate.byteLength
            );
        }
    }

    #initBuffers(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const rawByteSize = Math.max(this.#maxTotalInstances * FoliageMegaBuffer.#STRIDE_BYTES, 64);
        const culledByteSize = rawByteSize * 8; 
        const indirectByteSize = Math.max(this.#maxSubMeshes * 20, 64);
        const typeParamsByteSize = FoliageMegaBuffer.#MAX_TYPES * FoliageMegaBuffer.#TYPE_PARAM_FLOATS * 4;

        this.#rawGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Raw',
            size: rawByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#culledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_Main',
            size: culledByteSize,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        this.#indirectGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Indirect_Main',
            size: indirectByteSize,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#indirectResetTemplateGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Indirect_Template',
            size: indirectByteSize,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });

        this.#shadowCulledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_ShadowMega',
            size: culledByteSize * 4,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        this.#shadowIndirectGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Indirect_ShadowMega',
            size: indirectByteSize * 4,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#shadowIndirectResetTemplateGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Indirect_ShadowTemplate',
            size: indirectByteSize * 4,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });

        this.#typeParamsGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_TypeParams',
            size: typeParamsByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#unifiedGlobalUniformGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_UnifiedGlobalUniform',
            size: 800,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }
}

Object.freeze(FoliageMegaBuffer);
export default FoliageMegaBuffer;
