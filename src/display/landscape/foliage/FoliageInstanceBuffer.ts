import RedGPUContext from "../../../context/RedGPUContext";
import type {FoliageLODInfo, FoliageSubMesh} from "./FoliageType";

class FoliageInstanceBuffer {

    static readonly #cullingUniformData = new Float32Array(80);
    static readonly #cullingUniformUint32 = new Uint32Array(FoliageInstanceBuffer.#cullingUniformData.buffer);
    static readonly #STRIDE_FLOATS: number = 12;
    static readonly #STRIDE_BYTES: number = 12 * 4;

    #maxInstances: number;
    #redGPUContext: RedGPUContext;
    #dataBuffer: Float32Array;

    #indirectGPUBuffer: GPUBuffer | null = null;
    #staticIndirectResetTemplate: Uint32Array | null = null;
    #rawGPUBuffer: GPUBuffer | null = null;
    #culledGPUBuffer: GPUBuffer | null = null;
    #cullingUniformBuffer: GPUBuffer | null = null;
    #cullingBindGroup: GPUBindGroup | null = null;

    constructor(redGPUContext: RedGPUContext, maxInstances: number = 50000, subMeshes?: readonly FoliageSubMesh[]) {
        this.#redGPUContext = redGPUContext;
        this.#maxInstances = maxInstances;
        this.#dataBuffer = new Float32Array(this.#maxInstances * FoliageInstanceBuffer.#STRIDE_FLOATS);

        this.#initGPUBuffer(subMeshes);
    }

    get maxInstances(): number {
        return this.#maxInstances;
    }

    writeSubData(data: Float32Array, offsetFloats: number = 0): void {
        this.#dataBuffer.set(data, offsetFloats);
    }

    setInstanceData(
        index: number,
        posX: number, posY: number, posZ: number,
        rotX: number, rotY: number, rotZ: number, rotW: number,
        scaleX: number, scaleY: number, scaleZ: number,
        fade: number = 1.0, subId: number = 0
    ): void {
        const offset = index * FoliageInstanceBuffer.#STRIDE_FLOATS;
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
        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        const byteCount = Math.min(activeCount * FoliageInstanceBuffer.#STRIDE_BYTES, this.#dataBuffer.byteLength);

        gpuDevice.queue.writeBuffer(
            this.#rawGPUBuffer,
            0,
            this.#dataBuffer.buffer,
            this.#dataBuffer.byteOffset,
            byteCount
        );
    }

    uploadRangeToGPU(startIndex: number, count: number): void {
        if (!this.#rawGPUBuffer || count <= 0) return;
        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        const srcByteOffset = startIndex * FoliageInstanceBuffer.#STRIDE_BYTES;
        const byteCount = Math.min(count * FoliageInstanceBuffer.#STRIDE_BYTES, this.#dataBuffer.byteLength - srcByteOffset);
        if (byteCount <= 0) return;

        gpuDevice.queue.writeBuffer(
            this.#rawGPUBuffer,
            srcByteOffset,
            this.#dataBuffer.buffer,
            this.#dataBuffer.byteOffset + srcByteOffset,
            byteCount
        );
    }

    initStaticLODUniforms(
        lodInfoList?: readonly FoliageLODInfo[],
        lodDistance: number = 100.0,
        lod0SubMeshCount: number = 1,
        hasBillboard: boolean = false,
        cullingDist: number = 2000.0
    ): void {
        if (!this.#cullingUniformBuffer) return;

        const f32 = FoliageInstanceBuffer.#cullingUniformData;
        const u32 = FoliageInstanceBuffer.#cullingUniformUint32;

        if (lodInfoList && lodInfoList.length > 0) {
            const listLen = Math.min(lodInfoList.length, 8);
            for (let l = 0; l < 8; l++) {
                const base = 40 + l * 4;
                if (l < listLen) {
                    const info = lodInfoList[l];
                    f32[base] = info.lodDistance;
                    f32[base + 1] = info.fadeRange;
                    u32[base + 2] = info.subMeshOffset;
                    u32[base + 3] = info.subMeshCount;
                } else {
                    f32[base] = 999999.0;
                    f32[base + 1] = 10.0;
                    u32[base + 2] = 0;
                    u32[base + 3] = 0;
                }
            }
        } else {
            const base0 = 40;
            f32[base0] = lodDistance;
            f32[base0 + 1] = 10.0;
            u32[base0 + 2] = 0;
            u32[base0 + 3] = Math.max(lod0SubMeshCount, 1);

            const base1 = 44;
            f32[base1] = cullingDist;
            f32[base1 + 1] = 15.0;
            u32[base1 + 2] = Math.max(lod0SubMeshCount, 1);
            u32[base1 + 3] = hasBillboard ? 1 : 0;

            for (let l = 2; l < 8; l++) {
                const base = 40 + l * 4;
                f32[base] = 999999.0;
                f32[base + 1] = 10.0;
                u32[base + 2] = 0;
                u32[base + 3] = 0;
            }
        }

        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        gpuDevice.queue.writeBuffer(
            this.#cullingUniformBuffer,
            160,
            f32.buffer,
            f32.byteOffset + 160,
            128
        );
    }

    updateCullingUniforms(
        camX: number, camY: number, camZ: number,
        cullingDist: number, fadeStartDist: number,
        activeCount: number, boundingRadius: number,
        worldSizeX: number, heightScale: number, bottomOffset: number, hasVHT: boolean,
        frustumPlanes: number[][] | null,
        fovFactorSq: number = 1.0,
        numLODs: number = 1
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
        f32[7] = worldSizeX > 0 ? (1.0 / worldSizeX) : 0.0;

        f32[8] = heightScale;
        f32[9] = bottomOffset;
        u32[10] = hasVHT ? 1 : 0;
        u32[11] = numLODs;

        u32[12] = this.#maxInstances;
        f32[13] = fovFactorSq > 0 ? fovFactorSq : 1.0;
        u32[14] = 0;
        u32[15] = 0;

        if (frustumPlanes && frustumPlanes.length >= 6) {
            for (let p = 0; p < 6; p++) {
                const plane = frustumPlanes[p];
                const baseOffset = 16 + p * 4;
                f32[baseOffset] = plane[0];
                f32[baseOffset + 1] = plane[1];
                f32[baseOffset + 2] = plane[2];
                f32[baseOffset + 3] = plane[3];
            }
        } else {
            f32.fill(0, 16, 40);
        }

        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        gpuDevice.queue.writeBuffer(
            this.#cullingUniformBuffer,
            0,
            f32.buffer,
            f32.byteOffset,
            160
        );
    }

    resetMultiIndirectCount(subMeshes?: readonly FoliageSubMesh[]): void {
        if (!this.#indirectGPUBuffer) return;

        const template = this.#staticIndirectResetTemplate;
        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;

        if (template && template.length > 0) {
            gpuDevice.queue.writeBuffer(
                this.#indirectGPUBuffer,
                0,
                template.buffer,
                template.byteOffset,
                template.byteLength
            );
            return;
        }

        const subCount = subMeshes ? subMeshes.length : 0;
        if (subCount === 0) return;

        const u32 = new Uint32Array(subCount * 5);
        for (let s = 0; s < subCount; s++) {
            const sub = subMeshes[s];
            const count = sub.isIndexed ? sub.indexCount : sub.vertexCount;
            u32[s * 5] = count;
        }

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
        this.#staticIndirectResetTemplate = null;
    }

    #initGPUBuffer(subMeshes?: readonly FoliageSubMesh[]): void {
        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        const requiredSize = Math.max(this.#dataBuffer.byteLength, 64);

        this.#rawGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageInstanceBuffer_RawGPUBuffer',
            size: requiredSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#culledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageInstanceBuffer_CulledGPUBuffer',
            size: requiredSize * 8, // Support up to 8 LOD slots
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        const subCount = subMeshes ? Math.max(subMeshes.length, 1) : 1;
        const indirectSize = Math.max(subCount * 20, 64);
        this.#indirectGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageInstanceBuffer_MultiIndirectBuffer',
            size: indirectSize,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        if (subMeshes && subMeshes.length > 0) {
            const template = new Uint32Array(subMeshes.length * 5);
            for (let s = 0; s < subMeshes.length; s++) {
                const sub = subMeshes[s];
                const count = sub.isIndexed ? sub.indexCount : sub.vertexCount;
                template[s * 5] = count;
            }
            this.#staticIndirectResetTemplate = template;
        }

        this.#cullingUniformBuffer = gpuDevice.createBuffer({
            label: 'FoliageInstanceBuffer_CullingUniformBuffer',
            size: 512,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }
}

Object.freeze(FoliageInstanceBuffer);
export default FoliageInstanceBuffer;
