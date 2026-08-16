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

    // Zero-GC Uniform Buffer Data (160 bytes: heightScale, worldSizeX, worldSizeZ, lodColoration, maxCompCount, 3 pad, 8 vec4 lodColors)
    #landscapeUniformData: Float32Array = new Float32Array(40);
    #landscapeUniformUintData: Uint32Array;

    // Zero-GC Indirect Draw Arguments Data (최대 8단계 LOD * 5 uints = 40 uints = 160 bytes)
    #indirectArgsBuffer: Uint32Array = new Uint32Array(40);

    constructor(redGPUContext: RedGPUContext, maxComponentCount: number, maxLODLevel: number) {
        this.#redGPUContext = redGPUContext;
        this.#maxComponentCount = maxComponentCount;
        this.#maxLODLevel = maxLODLevel;

        this.#allInputTilesData = new Float32Array(maxComponentCount * 8);
        this.#landscapeUniformUintData = new Uint32Array(this.#landscapeUniformData.buffer);

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
     * [KO] Landscape 전역 Uniform(heightScale, worldSizeX, worldSizeZ, lodColoration, maxComponentCount, lodColors)을 GPU로 전송합니다 (160 bytes, Zero-GC).
     */
    updateUniforms(
        heightScale: number,
        worldSizeX: number,
        worldSizeZ: number,
        lodColoration: boolean,
        maxComponentCount: number,
        lodColorsRGBA: [number, number, number, number][]
    ): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#landscapeUniformBuffer) return;

        const f32 = this.#landscapeUniformData;
        const u32 = this.#landscapeUniformUintData;

        f32[0] = heightScale;
        f32[1] = worldSizeX;
        f32[2] = worldSizeZ;
        f32[3] = lodColoration ? 1.0 : 0.0;

        u32[4] = maxComponentCount;
        u32[5] = 0;
        u32[6] = 0;
        u32[7] = 0;

        const colorCount = Math.min(8, lodColorsRGBA.length);
        for (let i = 0; i < 8; i++) {
            const base = 8 + i * 4;
            if (i < colorCount) {
                const color = lodColorsRGBA[i];
                f32[base] = color[0];
                f32[base + 1] = color[1];
                f32[base + 2] = color[2];
                f32[base + 3] = color[3];
            } else {
                f32[base] = 0;
                f32[base + 1] = 0;
                f32[base + 2] = 0;
                f32[base + 3] = 0;
            }
        }

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

        const argsData = this.#indirectArgsBuffer;
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

        const byteLength = maxLODLevel * 5 * 4;
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, argsData.buffer, 0, byteLength);
    }

    /**
     * [KO] RVT (VHT 고도맵 + VNT 노멀맵 + VBT 3종 세트) 텍스처 및 전역 UniformBuffer를 수신하여 @group(1) GPUBindGroup을 생성/갱신합니다 (Index Redirection 대응).
     */
    updateBindGroup(
        vhtSampler: GPUSampler,
        vhtTextureView: GPUTextureView,
        vntTextureView?: GPUTextureView,
        vbtBaseColorView?: GPUTextureView,
        vbtNormalView?: GPUTextureView,
        vbtORMView?: GPUTextureView
    ): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#instanceStorageBindGroupLayout || !this.#allInputTilesBuffer || !this.#visibleTileIndicesBuffer || !this.#landscapeUniformBuffer) return;

        const fallbackView = vntTextureView || vhtTextureView;

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
            },
            {
                binding: 4,
                resource: fallbackView
            },
            {
                binding: 5,
                resource: {
                    buffer: this.#landscapeUniformBuffer
                }
            },
            {
                binding: 6,
                resource: vbtBaseColorView || fallbackView
            },
            {
                binding: 7,
                resource: vbtNormalView || fallbackView
            },
            {
                binding: 8,
                resource: vbtORMView || fallbackView
            }
        ];

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

        // 1. GPUBindGroupLayout 생성 (@group(1): AllInputTiles, VisibleTileIndices, Sampler, VHT Height, VNT Normal, LandscapeUniforms, VBT 3-Set)
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
                },
                {
                    binding: 6,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float',
                        viewDimension: '2d'
                    }
                },
                {
                    binding: 7,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float',
                        viewDimension: '2d'
                    }
                },
                {
                    binding: 8,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float',
                        viewDimension: '2d'
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

        // 5. Landscape 전역 Uniform Buffer 생성 (160 bytes: 4 floats 기본 + 4 uints 패딩/카운트 + 32 floats 8색상)
        this.#landscapeUniformBuffer = gpuDevice.createBuffer({
            label: 'LandscapeGlobalUniformBuffer',
            size: 160,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
}

export default LandscapeInstanceBuffer;
