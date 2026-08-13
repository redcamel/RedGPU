import RedGPUContext from "../../context/RedGPUContext";

/**
 * [KO] Landscape 지형의 LOD 레벨별 Multi-LOD Instanced Rendering 버퍼를 전담 관리하는 클래스입니다.
 * [EN] Class dedicated to managing Multi-LOD Instanced Rendering buffers for Landscape terrain.
 */
export class LandscapeInstanceBuffer {
    #redGPUContext: RedGPUContext;
    #gpuDevice: GPUDevice;

    #instanceStorageBuffer: GPUBuffer;
    #indirectCommandBuffer: GPUBuffer;

    #instanceDataArray: Float32Array;
    #indirectCommandArray: Uint32Array;

    #maxTileCount: number;
    #lodCount: number;

    /**
     * [KO] LandscapeInstanceBuffer 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeInstanceBuffer.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param maxTileCount - [KO] 최대 타일 개수 [EN] Maximum tile count
     * @param lodCount - [KO] LOD 단계 수 [EN] Number of LOD levels
     */
    constructor(redGPUContext: RedGPUContext, maxTileCount: number, lodCount: number) {
        this.#redGPUContext = redGPUContext;
        this.#gpuDevice = redGPUContext.gpuDevice;
        this.#maxTileCount = maxTileCount;
        this.#lodCount = lodCount;

        // 1. Instance Data Storage Array (32 Bytes per tile: posX, posY, posZ, pad, scaleX, scaleZ, lodLevel, pad)
        this.#instanceDataArray = new Float32Array(maxTileCount * 8);

        // 2. Indirect Command Array (20 Bytes per LOD: indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
        this.#indirectCommandArray = new Uint32Array(lodCount * 5);

        // 3. WebGPU GPUStorageBuffer 생성 (Instance Data)
        this.#instanceStorageBuffer = this.#gpuDevice.createBuffer({
            label: 'LandscapeInstanceStorageBuffer',
            size: this.#instanceDataArray.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        // 4. WebGPU GPUIndirectBuffer 생성 (Indirect Draw Commands)
        this.#indirectCommandBuffer = this.#gpuDevice.createBuffer({
            label: 'LandscapeIndirectCommandBuffer',
            size: this.#indirectCommandArray.byteLength,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
    }

    /** [KO] Instance Storage Buffer 객체를 반환합니다. */
    public get instanceStorageBuffer(): GPUBuffer {
        return this.#instanceStorageBuffer;
    }

    /** [KO] Indirect Draw Command Buffer 객체를 반환합니다. */
    public get indirectCommandBuffer(): GPUBuffer {
        return this.#indirectCommandBuffer;
    }

    /** [KO] 최대 타일 개수 */
    public get maxTileCount(): number {
        return this.#maxTileCount;
    }

    /** [KO] LOD 단계 수 */
    public get lodCount(): number {
        return this.#lodCount;
    }

    /**
     * [KO] 타일 인스턴스 3D 변환 데이터를 GPU Storage Buffer로 제출합니다 (Zero-GC).
     */
    public writeInstanceData(tileIndex: number, posX: number, posY: number, posZ: number, scaleX: number, scaleZ: number, lodLevel: number): void {
        const offset = tileIndex * 8;
        const arr = this.#instanceDataArray;
        arr[offset + 0] = posX;
        arr[offset + 1] = posY;
        arr[offset + 2] = posZ;
        arr[offset + 3] = 0; // padding
        arr[offset + 4] = scaleX;
        arr[offset + 5] = scaleZ;
        arr[offset + 6] = lodLevel;
        arr[offset + 7] = 0; // padding
    }

    /**
     * [KO] LOD 레벨별 Indirect Draw Command 커맨드를 구성합니다 (20 Bytes 바이너리 매핑).
     */
    public writeIndirectCommand(lodLevel: number, indexCount: number, instanceCount: number, firstIndex: number = 0, baseVertex: number = 0, firstInstance: number = 0): void {
        const offset = lodLevel * 5;
        const arr = this.#indirectCommandArray;
        arr[offset + 0] = indexCount;
        arr[offset + 1] = instanceCount;
        arr[offset + 2] = firstIndex;
        arr[offset + 3] = baseVertex;
        arr[offset + 4] = firstInstance;
    }

    /**
     * [KO] 변경된 Instance Data 및 Indirect Commands 버퍼를 GPU 버퍼 메모리로 동기화 제출합니다.
     */
    public flushToGPU(): void {
        const queue = this.#gpuDevice.queue;
        queue.writeBuffer(this.#instanceStorageBuffer, 0, this.#instanceDataArray.buffer as ArrayBuffer, this.#instanceDataArray.byteOffset, this.#instanceDataArray.byteLength);
        queue.writeBuffer(this.#indirectCommandBuffer, 0, this.#indirectCommandArray.buffer as ArrayBuffer, this.#indirectCommandArray.byteOffset, this.#indirectCommandArray.byteLength);
    }

    /**
     * [KO] 버퍼 자원을 해제합니다.
     */
    public destroy(): void {
        this.#instanceStorageBuffer.destroy();
        this.#indirectCommandBuffer.destroy();
    }
}

export default LandscapeInstanceBuffer;
