import RedGPUContext from "../../../context/RedGPUContext";
import type {FoliageSubMesh} from "./FoliageType";

class FoliageInstanceBuffer {

    static #cullingUniformData = new Float32Array(44);
    static #cullingUniformUint32 = new Uint32Array(FoliageInstanceBuffer.#cullingUniformData.buffer);
    #maxInstances: number;
    #strideFloats: number = 12;

    #redGPUContext: RedGPUContext;
    #strideBytes: number = 12 * 4;

    #dataBuffer: Float32Array;

    #indirectGPUBuffer: GPUBuffer | null = null;
    #resetIndirectData: Uint32Array | null = null;
    #rawGPUBuffer: GPUBuffer | null = null;
    #culledGPUBuffer: GPUBuffer | null = null;
    #cullingUniformBuffer: GPUBuffer | null = null;
    #cullingBindGroup: GPUBindGroup | null = null;

    constructor(redGPUContext: RedGPUContext, maxInstances: number = 50000, subMeshes?: FoliageSubMesh[]) {
        this.#redGPUContext = redGPUContext;
        this.#maxInstances = maxInstances;
        this.#dataBuffer = new Float32Array(this.#maxInstances * this.#strideFloats);

        this.#initGPUBuffer(subMeshes);
    }

    get maxInstances(): number {
        return this.#maxInstances;
    }

    get dataBuffer(): Float32Array {
        return this.#dataBuffer;
    }

    setInstanceData(
        index: number,
        posX: number, posY: number, posZ: number,
        rotX: number, rotY: number, rotZ: number, rotW: number,
        scaleX: number, scaleY: number, scaleZ: number,
        fade: number = 1.0, subId: number = 0
    ): void {
        const offset = index * this.#strideFloats;
        const buffer = this.#dataBuffer;

        buffer[offset] = posX;
        buffer[offset + 1] = posY;
        buffer[offset + 2] = posZ;

        buffer[offset + 3] = rotX;
        buffer[offset + 4] = rotY;
        buffer[offset + 5] = rotZ;
        buffer[offset + 6] = rotW;

        buffer[offset + 7] = scaleX;
        buffer[offset + 8] = scaleY;
        buffer[offset + 9] = scaleZ;

        buffer[offset + 10] = fade;
        buffer[offset + 11] = subId;
    }

    uploadToGPU(activeCount: number): void {
        if (!this.#rawGPUBuffer || activeCount <= 0) return;

        const uploadCount = Math.min(activeCount, this.#maxInstances);
        const uploadBytes = uploadCount * this.#strideBytes;

        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        gpuDevice.queue.writeBuffer(
            this.#rawGPUBuffer,
            0,
            this.#dataBuffer.buffer,
            0,
            uploadBytes
        );
    }

    uploadRangeToGPU(startIndex: number, count: number): void {
        if (!this.#rawGPUBuffer || count <= 0) return;

        const validStart = Math.min(startIndex, this.#maxInstances);
        const validCount = Math.min(count, this.#maxInstances - validStart);
        if (validCount <= 0) return;

        const srcByteOffset = validStart * this.#strideBytes;
        const uploadBytes = validCount * this.#strideBytes;

        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        gpuDevice.queue.writeBuffer(
            this.#rawGPUBuffer,
            srcByteOffset,
            this.#dataBuffer.buffer,
            this.#dataBuffer.byteOffset + srcByteOffset,
            uploadBytes
        );
    }

    updateCullingUniforms(
        camX: number, camY: number, camZ: number,
        cullingDist: number, fadeStartDist: number,
        activeCount: number, boundingRadius: number,
        worldSizeX: number, heightScale: number, bottomOffset: number, hasVHT: boolean,
        subMeshCount: number,
        frustumPlanes: number[][] | null,
        lodDistance: number = 100.0,
        lod0SubMeshCount: number = 1,
        hasBillboard: boolean = false,
        lodFadeRange: number = 30.0
    ): void {
        if (!this.#cullingUniformBuffer) return;

        const f32 = FoliageInstanceBuffer.#cullingUniformData;
        const u32 = FoliageInstanceBuffer.#cullingUniformUint32;

        f32[0] = camX;
        f32[1] = camY;
        f32[2] = camZ;
        f32[3] = cullingDist;
        f32[4] = fadeStartDist;
        u32[5] = activeCount;
        f32[6] = boundingRadius;
        f32[7] = worldSizeX;
        f32[8] = heightScale;
        f32[9] = bottomOffset;
        u32[10] = hasVHT ? 1 : 0;
        u32[11] = Math.max(subMeshCount, 1);
        f32[12] = lodDistance;
        u32[13] = Math.max(lod0SubMeshCount, 1);
        u32[14] = hasBillboard ? 1 : 0;
        u32[15] = this.#maxInstances;
        f32[16] = lodFadeRange;
        f32[17] = worldSizeX > 0 ? (1.0 / worldSizeX) : 0.0;
        f32[18] = 0;
        f32[19] = 0;

        if (frustumPlanes && frustumPlanes.length >= 6) {
            for (let p = 0; p < 6; p++) {
                const plane = frustumPlanes[p];
                const baseOffset = 20 + p * 4;
                f32[baseOffset] = plane[0];
                f32[baseOffset + 1] = plane[1];
                f32[baseOffset + 2] = plane[2];
                f32[baseOffset + 3] = plane[3];
            }
        } else {
            f32.fill(0, 20, 44);
        }

        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        gpuDevice.queue.writeBuffer(
            this.#cullingUniformBuffer,
            0,
            f32.buffer,
            f32.byteOffset,
            176
        );
    }

    resetMultiIndirectCount(subMeshes: FoliageSubMesh[]): void {
        const subCount = subMeshes ? subMeshes.length : 0;
        if (!this.#indirectGPUBuffer || subCount === 0) return;

        if (!this.#resetIndirectData || this.#resetIndirectData.length < subCount * 5) {
            this.#resetIndirectData = new Uint32Array(subCount * 5);
        }

        const u32 = this.#resetIndirectData;
        for (let s = 0; s < subCount; s++) {
            const sub = subMeshes[s];
            const count = sub.isIndexed ? sub.indexCount : sub.vertexCount;
            const base = s * 5;
            u32[base] = count;
            u32[base + 1] = 0;
            u32[base + 2] = 0;
            u32[base + 3] = 0;
            u32[base + 4] = 0;
        }

        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        gpuDevice.queue.writeBuffer(
            this.#indirectGPUBuffer,
            0,
            u32.buffer,
            u32.byteOffset,
            subCount * 20
        );
    }

    getRawGPUBuffer(): GPUBuffer | null {
        return this.#rawGPUBuffer;
    }

    getCulledGPUBuffer(): GPUBuffer | null {
        return this.#culledGPUBuffer;
    }

    getIndirectGPUBuffer(): GPUBuffer | null {
        return this.#indirectGPUBuffer;
    }

    getCullingUniformBuffer(): GPUBuffer | null {
        return this.#cullingUniformBuffer;
    }

    #cachedVHTView: GPUTextureView | null = null;
    #cachedVHTSampler: GPUSampler | null = null;

    getOrCreateCullingBindGroup(layout: GPUBindGroupLayout, vhtTextureView?: GPUTextureView, vhtSampler?: GPUSampler): GPUBindGroup | null {
        if (!this.#rawGPUBuffer || !this.#cullingUniformBuffer || !this.#culledGPUBuffer || !this.#indirectGPUBuffer) return null;

        const targetView = vhtTextureView || this.#redGPUContext.resourceManager.emptyTexture2DArrayView;
        const targetSampler = vhtSampler || this.#redGPUContext.resourceManager.basicSampler.gpuSampler;

        if (this.#cullingBindGroup && this.#cachedVHTView === targetView && this.#cachedVHTSampler === targetSampler) {
            return this.#cullingBindGroup;
        }

        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        this.#cullingBindGroup = gpuDevice.createBindGroup({
            label: 'FoliageCullingBindGroup',
            layout: layout,
            entries: [
                {binding: 0, resource: {buffer: this.#rawGPUBuffer}},
                {binding: 1, resource: {buffer: this.#cullingUniformBuffer}},
                {binding: 2, resource: {buffer: this.#culledGPUBuffer}},
                {binding: 3, resource: {buffer: this.#indirectGPUBuffer}},
                {binding: 4, resource: targetView},
                {binding: 5, resource: targetSampler},
            ],
        });

        this.#cachedVHTView = targetView;
        this.#cachedVHTSampler = targetSampler;
        return this.#cullingBindGroup;
    }

    destroy(): void {
        if (this.#rawGPUBuffer) {
            this.#rawGPUBuffer.destroy();
            this.#rawGPUBuffer = null;
        }
        if (this.#culledGPUBuffer) {
            this.#culledGPUBuffer.destroy();
            this.#culledGPUBuffer = null;
        }
        if (this.#indirectGPUBuffer) {
            this.#indirectGPUBuffer.destroy();
            this.#indirectGPUBuffer = null;
        }
        if (this.#cullingUniformBuffer) {
            this.#cullingUniformBuffer.destroy();
            this.#cullingUniformBuffer = null;
        }
        this.#cullingBindGroup = null;
        this.#resetIndirectData = null;
    }

    #initGPUBuffer(subMeshes?: FoliageSubMesh[]): void {
        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        const requiredSize = Math.max(this.#dataBuffer.byteLength, 64);

        this.#rawGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageInstanceBuffer_RawGPUBuffer',
            size: requiredSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#culledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageInstanceBuffer_CulledGPUBuffer',
            size: requiredSize * 2,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        const subCount = subMeshes ? Math.max(subMeshes.length, 1) : 1;
        const indirectSize = Math.max(subCount * 20, 64);
        this.#indirectGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageInstanceBuffer_MultiIndirectBuffer',
            size: indirectSize,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#cullingUniformBuffer = gpuDevice.createBuffer({
            label: 'FoliageInstanceBuffer_CullingUniformBuffer',
            size: 256,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }
}

Object.freeze(FoliageInstanceBuffer);
export default FoliageInstanceBuffer;
