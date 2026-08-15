import RedGPUContext from "../../../context/RedGPUContext";

/**
 * FoliageInstanceBuffer
 * Zero-GC TypedArray 기반 Foliage GPU Instanced Buffer Allocator
 */
export class FoliageInstanceBuffer {
    readonly maxInstances: number;
    readonly strideFloats: number = 12; // Pos(3) + Quat(4) + Scale(3) + Extra(2)
    readonly strideBytes: number = 12 * 4;

    // Zero-GC 재사용 TypedArray
    readonly dataBuffer: Float32Array;

    #redGPUContext: RedGPUContext;
    #gpuBuffer: GPUBuffer | null = null;

    constructor(redGPUContext: RedGPUContext, maxInstances: number = 50000) {
        this.#redGPUContext = redGPUContext;
        this.maxInstances = maxInstances;
        this.dataBuffer = new Float32Array(this.maxInstances * this.strideFloats);

        this.#initGPUBuffer();
    }

    /**
     * 특정 인스턴스 슬롯 데이터 세팅 (매 프레임 힙 메모리 할당 없음)
     */
    setInstanceData(
        index: number,
        posX: number, posY: number, posZ: number,
        rotX: number, rotY: number, rotZ: number, rotW: number,
        scaleX: number, scaleY: number, scaleZ: number,
        fade: number, subId: number = 0
    ): void {
        const offset = index * this.strideFloats;
        const buffer = this.dataBuffer;

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

    /**
     * 활성화된 인스턴스 개수만큼만 GPU 버퍼로 업로드
     */
    uploadToGPU(activeCount: number): void {
        if (!this.#gpuBuffer || activeCount <= 0) return;

        const uploadCount = Math.min(activeCount, this.maxInstances);
        const uploadBytes = uploadCount * this.strideBytes;

        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        gpuDevice.queue.writeBuffer(
            this.#gpuBuffer,
            0,
            this.dataBuffer.buffer,
            0,
            uploadBytes
        );
    }

    getGPUBuffer(): GPUBuffer | null {
        return this.#gpuBuffer;
    }

    destroy(): void {
        if (this.#gpuBuffer) {
            this.#gpuBuffer.destroy();
            this.#gpuBuffer = null;
        }
    }

    #initGPUBuffer(): void {
        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        const requiredSize = this.dataBuffer.byteLength;

        this.#gpuBuffer = gpuDevice.createBuffer({
            label: 'FoliageInstanceBuffer_GPUBuffer',
            size: Math.max(requiredSize, 64),
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
    }
}
