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

    // 타일당 48 bytes (tileX, tileZ, prevTileX, prevTileZ, lodLevel, pad0, pad1, pad2, color r,g,b,a)
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

        const tileFloatSize = maxTileCount * 12; // 12 floats per tile (48 bytes)
        this.#instanceFloatData = new Float32Array(tileFloatSize);
        this.#instanceUintData = new Uint32Array(this.#instanceFloatData.buffer);

        this.#lodFirstInstanceList = new Int32Array(lodCount);
        this.#lodInstanceCountList = new Int32Array(lodCount);
        this.#lodCursorList = new Int32Array(lodCount);

        this.#createGPUResources();
    }

    get instanceStorageBuffer(): GPUBuffer | null {
        return this.#instanceStorageBuffer;
    }

    get instanceStorageBindGroup(): GPUBindGroup | null {
        return this.#instanceStorageBindGroup;
    }

    get instanceStorageBindGroupLayout(): GPUBindGroupLayout | null {
        return this.#instanceStorageBindGroupLayout;
    }

    get maxTileCount(): number {
        return this.#maxTileCount;
    }

    get lodCount(): number {
        return this.#lodCount;
    }

    /**
     * [KO] 매 프레임 LOD별 인스턴스 카운트 할당을 초기화합니다 (Zero-GC).
     */
    prepareLODAllocation(lodCounts: Int32Array): void {
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
     * [KO] 특정 LOD 그룹 내의 타일 인스턴스 데이터 (현재/이전 위치)를 StorageBuffer 메모리에 작성합니다 (Zero-GC).
     */
    writeLODInstanceData(
        lodLevel: number,
        tileX: number,
        tileZ: number,
        prevTileX: number,
        prevTileZ: number,
        r: number,
        g: number,
        b: number,
        a: number = 1.0
    ): void {
        const targetIndex = this.#lodCursorList[lodLevel]++;
        const offset = targetIndex * 12; // 12 floats stride (48 bytes)

        this.#instanceFloatData[offset] = tileX;
        this.#instanceFloatData[offset + 1] = tileZ;
        this.#instanceFloatData[offset + 2] = prevTileX;
        this.#instanceFloatData[offset + 3] = prevTileZ;

        this.#instanceUintData[offset + 4] = lodLevel;
        this.#instanceFloatData[offset + 5] = 0; // pad0
        this.#instanceFloatData[offset + 6] = 0; // pad1
        this.#instanceFloatData[offset + 7] = 0; // pad2

        this.#instanceFloatData[offset + 8] = r;
        this.#instanceFloatData[offset + 9] = g;
        this.#instanceFloatData[offset + 10] = b;
        this.#instanceFloatData[offset + 11] = a;
    }

    getLODFirstInstance(lodLevel: number): number {
        return this.#lodFirstInstanceList[lodLevel] ?? 0;
    }

    getLODInstanceCount(lodLevel: number): number {
        return this.#lodInstanceCountList[lodLevel] ?? 0;
    }

    /**
     * [KO] CPU 버퍼 데이터를 GPU StorageBuffer로 플러시합니다.
     */
    flushToGPU(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#instanceStorageBuffer) return;

        gpuDevice.queue.writeBuffer(
            this.#instanceStorageBuffer,
            0,
            this.#instanceFloatData.buffer,
            0,
            this.#maxTileCount * 48
        );
    }

    destroy(): void {
        if (this.#instanceStorageBuffer) {
            this.#instanceStorageBuffer.destroy();
            this.#instanceStorageBuffer = null;
        }
        if (this.#indirectCommandBuffer) {
            this.#indirectCommandBuffer.destroy();
            this.#indirectCommandBuffer = null;
        }
    }

    #createGPUResources(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        // 1. GPUBindGroupLayout 생성 (StorageBuffer - ReadOnlyStorage - 2번 바인딩 인덱스)
        this.#instanceStorageBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'LandscapeInstanceStorageBindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'read-only-storage'
                    }
                }
            ]
        });

        // 2. GPUBuffer 생성 (48 bytes per tile)
        this.#instanceStorageBuffer = gpuDevice.createBuffer({
            label: 'LandscapeInstanceStorageBuffer',
            size: Math.max(128, this.#maxTileCount * 48),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        // 3. GPUBindGroup 생성
        this.#instanceStorageBindGroup = gpuDevice.createBindGroup({
            label: 'LandscapeInstanceStorageBindGroup',
            layout: this.#instanceStorageBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#instanceStorageBuffer
                    }
                }
            ]
        });
    }
}

export default LandscapeInstanceBuffer;
