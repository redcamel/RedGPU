import RedGPUContext from "../../../context/RedGPUContext";

/**
 * [KO] Landscape 100% GPU-Driven Index Redirection Multi-LOD Batching & Indirect Drawing 전용 GPU Storage & Uniform Buffer 관리 클래스입니다.
 * [EN] GPU Storage & Uniform Buffer management class dedicated to Landscape 100% GPU-Driven Index Redirection Multi-LOD Batching & Indirect Drawing.
 */
export class LandscapeInstanceBuffer {
    #redGPUContext: RedGPUContext;
    #maxComponentCount: number;
    #maxLODLevel: number;

    #allInputTilesBuffer: GPUBuffer | null = null;
    #visibleTileIndicesBuffer: GPUBuffer | null = null;
    #indirectDrawBuffer: GPUBuffer | null = null;
    #landscapeUniformBuffer: GPUBuffer | null = null;

    #instanceStorageBindGroup: GPUBindGroup | null = null;
    #instanceStorageBindGroupLayout: GPUBindGroupLayout | null = null;

    // CPU Static Input Tile Data (32 bytes per tile: worldX, worldZ, prevWorldX, prevWorldZ, r, g, b, a)
    #allInputTilesData: Float32Array;

    // Zero-GC Uniform Buffer Data (16 bytes: heightScale 1f, worldSizeX 1f, worldSizeZ 1f, pad 1f)
    #landscapeUniformData: Float32Array = new Float32Array(4);

    constructor(redGPUContext: RedGPUContext, maxComponentCount: number, maxLODLevel: number) {
        this.#redGPUContext = redGPUContext;
        this.#maxComponentCount = maxComponentCount;
        this.#maxLODLevel = maxLODLevel;

        this.#allInputTilesData = new Float32Array(maxComponentCount * 8);

        this.#createGPUResources();
    }

    get allInputTilesBuffer(): GPUBuffer | null {
        return this.#allInputTilesBuffer;
    }

    get visibleTileIndicesBuffer(): GPUBuffer | null {
        return this.#visibleTileIndicesBuffer;
    }

    get indirectDrawBuffer(): GPUBuffer | null {
        return this.#indirectDrawBuffer;
    }

    get landscapeUniformBuffer(): GPUBuffer | null {
        return this.#landscapeUniformBuffer;
    }

    get instanceStorageBuffer(): GPUBuffer | null {
        return this.#allInputTilesBuffer;
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
     * [KO] 타일 정적 고유 데이터(worldX, worldZ, prevWorldX, prevWorldZ, color)를 셋업합니다 (타일당 32바이트).
     */
    setStaticTileData(
        index: number,
        worldX: number,
        worldZ: number,
        prevWorldX: number,
        prevWorldZ: number,
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 1.0
    ): void {
        const offset = index * 8;
        this.#allInputTilesData[offset] = worldX;
        this.#allInputTilesData[offset + 1] = worldZ;
        this.#allInputTilesData[offset + 2] = prevWorldX;
        this.#allInputTilesData[offset + 3] = prevWorldZ;

        this.#allInputTilesData[offset + 4] = r;
        this.#allInputTilesData[offset + 5] = g;
        this.#allInputTilesData[offset + 6] = b;
        this.#allInputTilesData[offset + 7] = a;
    }

    /**
     * [KO] 전체 타일 정적 원본 데이터를 GPU StorageBuffer 메모리로 1회 전송합니다.
     */
    uploadStaticTilesToGPU(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#allInputTilesBuffer) return;

        gpuDevice.queue.writeBuffer(
            this.#allInputTilesBuffer,
            0,
            this.#allInputTilesData.buffer,
            0,
            this.#allInputTilesData.byteLength
        );
    }

    /**
     * [KO] Landscape 전역 Uniform(heightScale, worldSizeX, worldSizeZ)을 GPU로 전송합니다 (16 bytes, Zero-GC).
     */
    updateUniforms(heightScale: number, worldSizeX: number, worldSizeZ: number): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#landscapeUniformBuffer) return;

        this.#landscapeUniformData[0] = heightScale;
        this.#landscapeUniformData[1] = worldSizeX;
        this.#landscapeUniformData[2] = worldSizeZ;
        this.#landscapeUniformData[3] = 0;

        gpuDevice.queue.writeBuffer(
            this.#landscapeUniformBuffer,
            0,
            this.#landscapeUniformData.buffer,
            0,
            this.#landscapeUniformData.byteLength
        );
    }

    /**
     * [KO] 매 프레임 GPU Compute Pass 시작 직전 Indirect Draw Buffer 의 instanceCount 숫자를 0으로 초기화하고 LOD별 인자를 동기화합니다 (Zero-GC).
     */
    resetIndirectDrawBuffer(
        sharedGeometry: { getLODRange(lod: number): any },
        maxLODLevel: number,
        isWireframe: boolean
    ): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#indirectDrawBuffer) return;

        const argsData = new Uint32Array(maxLODLevel * 5);
        for (let lod = 0; lod < maxLODLevel; lod++) {
            const offset = lod * 5;
            const lodRange = sharedGeometry.getLODRange(lod);
            const indexCount = isWireframe ? lodRange.wireframeIndexCount : lodRange.indexCount;
            const firstIndex = isWireframe ? lodRange.wireframeFirstIndex : lodRange.firstIndex;
            const baseVertex = lodRange.baseVertex;

            argsData[offset] = indexCount;
            argsData[offset + 1] = 0; // instanceCount (GPU atomicAdd target)
            argsData[offset + 2] = firstIndex;
            argsData[offset + 3] = baseVertex;
            argsData[offset + 4] = lod * this.#maxComponentCount; // firstInstance offset for Index Redirection
        }

        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, argsData.buffer, 0, argsData.byteLength);
    }

    /**
     * [KO] RVT (VHT 고도맵 + VNT 노멀맵) 텍스처 및 전역 UniformBuffer를 수신하여 @group(1) GPUBindGroup을 생성/갱신합니다 (Index Redirection 대응).
     */
    updateBindGroup(vhtSampler: GPUSampler, vhtTextureView: GPUTextureView, vntTextureView?: GPUTextureView): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#instanceStorageBindGroupLayout || !this.#allInputTilesBuffer || !this.#visibleTileIndicesBuffer || !this.#landscapeUniformBuffer) return;

        const entries: GPUBindGroupEntry[] = [
            {
                binding: 0,
                resource: {
                    buffer: this.#allInputTilesBuffer
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: this.#visibleTileIndicesBuffer
                }
            },
            {
                binding: 2,
                resource: vhtSampler
            },
            {
                binding: 3,
                resource: vhtTextureView
            }
        ];

        if (vntTextureView) {
            entries.push({
                binding: 4,
                resource: vntTextureView
            });
        } else {
            entries.push({
                binding: 4,
                resource: vhtTextureView
            });
        }

        entries.push({
            binding: 5,
            resource: {
                buffer: this.#landscapeUniformBuffer
            }
        });

        this.#instanceStorageBindGroup = gpuDevice.createBindGroup({
            label: 'LandscapeInstanceStorageBindGroup',
            layout: this.#instanceStorageBindGroupLayout,
            entries: entries
        });
    }

    destroy(): void {
        if (this.#allInputTilesBuffer) {
            this.#allInputTilesBuffer.destroy();
            this.#allInputTilesBuffer = null;
        }
        if (this.#visibleTileIndicesBuffer) {
            this.#visibleTileIndicesBuffer.destroy();
            this.#visibleTileIndicesBuffer = null;
        }
        if (this.#indirectDrawBuffer) {
            this.#indirectDrawBuffer.destroy();
            this.#indirectDrawBuffer = null;
        }
        if (this.#landscapeUniformBuffer) {
            this.#landscapeUniformBuffer.destroy();
            this.#landscapeUniformBuffer = null;
        }
    }

    #createGPUResources(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        // 1. GPUBindGroupLayout 생성 (@group(1): AllInputTiles, VisibleTileIndices, Sampler, VHT Height, VNT Normal, LandscapeUniforms)
        this.#instanceStorageBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'LandscapeInstanceStorageBindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'read-only-storage'
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'read-only-storage'
                    }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: 'filtering'
                    }
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'unfilterable-float',
                        viewDimension: '2d'
                    }
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float',
                        viewDimension: '2d'
                    }
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ]
        });

        // 2. All Input Tiles StorageBuffer 생성 (32 bytes per tile)
        this.#allInputTilesBuffer = gpuDevice.createBuffer({
            label: 'LandscapeAllInputTilesStorageBuffer',
            size: this.#maxComponentCount * 32,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        // 3. Visible Tile Indices StorageBuffer 생성 (4 bytes u32 per tile * maxLODLevel)
        this.#visibleTileIndicesBuffer = gpuDevice.createBuffer({
            label: 'LandscapeVisibleTileIndicesStorageBuffer',
            size: this.#maxComponentCount * this.#maxLODLevel * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        // 4. Indirect Draw Buffer 생성 (5 uints per LOD = 20 bytes * maxLODLevel)
        this.#indirectDrawBuffer = gpuDevice.createBuffer({
            label: 'LandscapeIndirectDrawBuffer',
            size: this.#maxLODLevel * 20,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        // 5. Landscape 전역 Uniform Buffer 생성 (16 bytes)
        this.#landscapeUniformBuffer = gpuDevice.createBuffer({
            label: 'LandscapeGlobalUniformBuffer',
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
}

export default LandscapeInstanceBuffer;
