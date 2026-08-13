import RedGPUContext from "../../context/RedGPUContext";

/**
 * [KO] Landscape Multi-LOD Batching Instanced Rendering 전용 GPU Storage Buffer & VHT BindGroup 관리 클래스입니다.
 * [EN] GPU Storage Buffer & VHT BindGroup management class dedicated to Landscape Multi-LOD Batching Instanced Rendering.
 */
export class LandscapeInstanceBuffer {
    #redGPUContext: RedGPUContext;
    #maxComponentCount: number;
    #maxLODLevel: number;

    #instanceStorageBuffer: GPUBuffer | null = null;
    #instanceStorageBindGroup: GPUBindGroup | null = null;
    #instanceStorageBindGroupLayout: GPUBindGroupLayout | null = null;

    // 컴포넌트 타일당 48 bytes (worldX, worldZ, prevWorldX, prevWorldZ, lodLevel, heightScale, worldSizeX, worldSizeZ, color r,g,b,a)
    #instanceFloatData: Float32Array;
    #instanceUintData: Uint32Array;

    // LOD별 인스턴스 카운트 및 오프셋 추적용 재사용 버퍼 (Zero-GC)
    #lodFirstInstanceList: Int32Array;
    #lodInstanceCountList: Int32Array;
    #lodCursorList: Int32Array;

    constructor(redGPUContext: RedGPUContext, maxComponentCount: number, maxLODLevel: number) {
        this.#redGPUContext = redGPUContext;
        this.#maxComponentCount = maxComponentCount;
        this.#maxLODLevel = maxLODLevel;

        const tileFloatSize = maxComponentCount * 12; // 12 floats per tile (48 bytes)
        this.#instanceFloatData = new Float32Array(tileFloatSize);
        this.#instanceUintData = new Uint32Array(this.#instanceFloatData.buffer);

        this.#lodFirstInstanceList = new Int32Array(maxLODLevel);
        this.#lodInstanceCountList = new Int32Array(maxLODLevel);
        this.#lodCursorList = new Int32Array(maxLODLevel);

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

    get maxComponentCount(): number {
        return this.#maxComponentCount;
    }

    get maxLODLevel(): number {
        return this.#maxLODLevel;
    }

    /**
     * [KO] 매 프레임 LOD별 인스턴스 카운트 할당을 초기화합니다 (Zero-GC).
     */
    prepareLODAllocation(lodCounts: Int32Array): void {
        let cursor = 0;
        for (let lod = 0; lod < this.#maxLODLevel; lod++) {
            const count = lodCounts[lod] ?? 0;
            this.#lodFirstInstanceList[lod] = cursor;
            this.#lodInstanceCountList[lod] = count;
            this.#lodCursorList[lod] = cursor;
            cursor += count;
        }
    }

    /**
     * [KO] 특정 LOD 그룹 내의 타일 인스턴스 데이터 (위치, LOD, heightScale, worldSizeX/Z, 색상)를 StorageBuffer 메모리에 작성합니다 (Zero-GC).
     */
    writeLODInstanceData(
        lodLevel: number,
        worldX: number,
        worldZ: number,
        prevWorldX: number,
        prevWorldZ: number,
        r: number,
        g: number,
        b: number,
        a: number = 1.0,
        heightScale: number = 500.0,
        worldSizeX: number = 8000.0,
        worldSizeZ: number = 8000.0
    ): void {
        const targetIndex = this.#lodCursorList[lodLevel]++;
        const offset = targetIndex * 12; // 12 floats stride (48 bytes)

        this.#instanceFloatData[offset] = worldX;
        this.#instanceFloatData[offset + 1] = worldZ;
        this.#instanceFloatData[offset + 2] = prevWorldX;
        this.#instanceFloatData[offset + 3] = prevWorldZ;

        this.#instanceUintData[offset + 4] = lodLevel;
        this.#instanceFloatData[offset + 5] = heightScale;
        this.#instanceFloatData[offset + 6] = worldSizeX;
        this.#instanceFloatData[offset + 7] = worldSizeZ;

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
            this.#maxComponentCount * 48
        );
    }

    /**
     * [KO] VHT 텍스처 및 샘플러를 수신하여 @group(2) GPUBindGroup을 생성/갱신합니다.
     */
    updateBindGroup(vhtSampler: GPUSampler, vhtTextureView: GPUTextureView): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#instanceStorageBindGroupLayout || !this.#instanceStorageBuffer) return;

        this.#instanceStorageBindGroup = gpuDevice.createBindGroup({
            label: 'LandscapeInstanceStorageBindGroup',
            layout: this.#instanceStorageBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#instanceStorageBuffer
                    }
                },
                {
                    binding: 1,
                    resource: vhtSampler
                },
                {
                    binding: 2,
                    resource: vhtTextureView
                }
            ]
        });
    }

    destroy(): void {
        if (this.#instanceStorageBuffer) {
            this.#instanceStorageBuffer.destroy();
            this.#instanceStorageBuffer = null;
        }
    }

    #createGPUResources(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        // 1. GPUBindGroupLayout 생성 (@group(2): StorageBuffer, Sampler, VHT Texture_2D)
        this.#instanceStorageBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'LandscapeInstanceStorageBindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'read-only-storage'
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX,
                    sampler: {
                        type: 'non-filtering'
                    }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.VERTEX,
                    texture: {
                        sampleType: 'unfilterable-float',
                        viewDimension: '2d'
                    }
                }
            ]
        });

        // 2. GPUBuffer 생성 (48 bytes per tile)
        this.#instanceStorageBuffer = gpuDevice.createBuffer({
            label: 'LandscapeInstanceStorageBuffer',
            size: Math.max(128, this.#maxComponentCount * 48),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
    }
}

export default LandscapeInstanceBuffer;
