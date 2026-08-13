import RedGPUContext from "../../context/RedGPUContext";

/**
 * [KO] Landscape Multi-LOD Batching Instanced Rendering 전용 GPU Storage Buffer & Indirect Buffer 관리 클래스입니다.
 * [EN] GPU Storage Buffer & Indirect Buffer management class dedicated to Landscape Multi-LOD Batching Instanced Rendering.
 */
export class LandscapeInstanceBuffer {
    #redGPUContext: RedGPUContext;
    #maxTileCount: number;
    #lodCount: number;

    #instanceStorageBuffer: GPUBuffer | null = null;
    #instanceStorageBindGroup: GPUBindGroup | null = null;
    #instanceStorageBindGroupLayout: GPUBindGroupLayout | null = null;

    #indirectCommandBuffer: GPUBuffer | null = null;

    // 타일당 32 bytes (tileX, tileZ, lodLevel, pad, color r,g,b,a)
    #instanceFloatData: Float32Array;
    #instanceUintData: Uint32Array;

    // LOD별 인스턴스 카운트 및 오프셋 추적용 재사용 버퍼 (Zero-GC)
    #lodFirstInstanceList: Int32Array;
    #lodInstanceCountList: Int32Array;
    #lodCursorList: Int32Array;

    constructor(redGPUContext: RedGPUContext, maxTileCount: number, lodCount: number) {
        this.#redGPUContext = redGPUContext;
        this.#maxTileCount = maxTileCount;
        this.#lodCount = lodCount;

        const tileFloatSize = maxTileCount * 8; // 8 floats per tile (32 bytes)
        this.#instanceFloatData = new Float32Array(tileFloatSize);
        this.#instanceUintData = new Uint32Array(this.#instanceFloatData.buffer);

        this.#lodFirstInstanceList = new Int32Array(lodCount);
        this.#lodInstanceCountList = new Int32Array(lodCount);
        this.#lodCursorList = new Int32Array(lodCount);

        this.#createGPUResources();
    }

    public get instanceStorageBuffer(): GPUBuffer | null {
        return this.#instanceStorageBuffer;
    }

    public get instanceStorageBindGroup(): GPUBindGroup | null {
        return this.#instanceStorageBindGroup;
    }

    public get instanceStorageBindGroupLayout(): GPUBindGroupLayout | null {
        return this.#instanceStorageBindGroupLayout;
    }

    public get maxTileCount(): number {
        return this.#maxTileCount;
    }

    public get lodCount(): number {
        return this.#lodCount;
    }

    /**
     * [KO] 매 프레임 LOD별 인스턴스 카운트 할당을 초기화합니다 (Zero-GC).
     */
    public prepareLODAllocation(lodCounts: Int32Array): void {
        let cursor = 0;
        for (let lod = 0; lod < this.#lodCount; lod++) {
            const count = lodCounts[lod] ?? 0;
            this.#lodFirstInstanceList[lod] = cursor;
            this.#lodInstanceCountList[lod] = count;
            this.#lodCursorList[lod] = cursor;
            cursor += count;
        }
    }

    /**
     * [KO] 특정 LOD 그룹 내의 타일 인스턴스 데이터를 StorageBuffer 메모리에 작성합니다 (Zero-GC).
     */
    public writeLODInstanceData(
        lodLevel: number,
        tileX: number,
        tileZ: number,
        r: number,
        g: number,
        b: number,
        a: number = 1.0
    ): void {
        const targetIndex = this.#lodCursorList[lodLevel]++;
        const offset = targetIndex * 8;

        this.#instanceFloatData[offset] = tileX;
        this.#instanceFloatData[offset + 1] = tileZ;
        this.#instanceUintData[offset + 2] = lodLevel;
        this.#instanceFloatData[offset + 3] = 0; // padding

        this.#instanceFloatData[offset + 4] = r;
        this.#instanceFloatData[offset + 5] = g;
        this.#instanceFloatData[offset + 6] = b;
        this.#instanceFloatData[offset + 7] = a;
    }

    public getLODFirstInstance(lodLevel: number): number {
        return this.#lodFirstInstanceList[lodLevel] ?? 0;
    }

    public getLODInstanceCount(lodLevel: number): number {
        return this.#lodInstanceCountList[lodLevel] ?? 0;
    }

    /**
     * [KO] CPU 버퍼 데이터를 GPU StorageBuffer로 플러시합니다.
     */
    public flushToGPU(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#instanceStorageBuffer) return;

        gpuDevice.queue.writeBuffer(
            this.#instanceStorageBuffer,
            0,
            this.#instanceFloatData.buffer,
            0,
            this.#maxTileCount * 32
        );
    }

    public destroy(): void {
        if (this.#instanceStorageBuffer) {
            this.#instanceStorageBuffer.destroy();
            this.#instanceStorageBuffer = null;
        }
    }

    #createGPUResources(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        // 1. 전체 타일 GPU Storage Buffer 생성
        this.#instanceStorageBuffer = gpuDevice.createBuffer({
            size: Math.max(256, this.#maxTileCount * 32),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: "LandscapeInstanceStorageBuffer_MultiLOD"
        });

        // 2. BindGroupLayout (Group 2번) 생성
        this.#instanceStorageBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: "LandscapeInstanceStorageBindGroupLayout_Group2",
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {type: 'read-only-storage'}
            }]
        });

        // 3. BindGroup 생성
        this.#instanceStorageBindGroup = gpuDevice.createBindGroup({
            label: "LandscapeInstanceStorageBindGroup_Group2",
            layout: this.#instanceStorageBindGroupLayout,
            entries: [{
                binding: 0,
                resource: {buffer: this.#instanceStorageBuffer}
            }]
        });
    }
}

export default LandscapeInstanceBuffer;
