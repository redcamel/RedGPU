import RedGPUContext from "../../../context/RedGPUContext";
import landscapeVertexSource from "../shader/landscapeVertex.wgsl";
import landscapeFragmentSource from "../shader/landscapeFragment.wgsl";
import {getUnionBindGroupLayoutDescriptorFromShaderInfos} from "../../../material/core";

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

    #allInputTilesData: Float32Array;

    #landscapeUniformData: Float32Array;
    #landscapeUniformUintData: Uint32Array;
    #landscapeUniformByteLength: number = 208;

    #indirectArgsBuffer: Uint32Array = new Uint32Array(40);

    constructor(redGPUContext: RedGPUContext, maxComponentCount: number, maxLODLevel: number) {
        this.#redGPUContext = redGPUContext;
        this.#maxComponentCount = maxComponentCount;
        this.#maxLODLevel = maxLODLevel;

        this.#allInputTilesData = new Float32Array(maxComponentCount * 8);

        this.#createGPUResources();

        this.#landscapeUniformData = new Float32Array(this.#landscapeUniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#landscapeUniformUintData = new Uint32Array(this.#landscapeUniformData.buffer);
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

    setStaticTileData(
        index: number,
        worldX: number,
        worldZ: number,
        prevWorldX: number,
        prevWorldZ: number,
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 0.0
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

    updateUniforms(
        heightScale: number,
        worldSizeX: number,
        worldSizeZ: number,
        lodColoration: boolean,
        maxComponentCount: number,
        tileSizeX: number,
        tileSizeZ: number,
        baseQuads: number,
        vhtTextureWidth: number,
        vhtTextureHeight: number,
        lodFadeStartRatio: number,
        lodGeomorphStartRatio: number,
        lodColorsRGBA: [number, number, number, number][],
        lodDistancesSq: number[]
    ): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#landscapeUniformBuffer) return;

        const f32 = this.#landscapeUniformData;
        const u32 = this.#landscapeUniformUintData;

        // vec4 0
        f32[0] = heightScale;
        f32[1] = worldSizeX;
        f32[2] = worldSizeZ;
        f32[3] = lodColoration ? 1.0 : 0.0;

        // vec4 1
        u32[4] = maxComponentCount;
        f32[5] = tileSizeX;
        f32[6] = tileSizeZ;
        f32[7] = baseQuads;

        // vec4 2
        f32[8] = vhtTextureWidth;
        f32[9] = vhtTextureHeight;
        f32[10] = lodFadeStartRatio;
        f32[11] = lodGeomorphStartRatio;

        // vec4 3~10
        const colorCount = Math.min(8, lodColorsRGBA.length);
        for (let i = 0; i < 8; i++) {
            const base = 12 + i * 4;
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

        // vec4 11~12
        const distCount = Math.min(8, lodDistancesSq.length);
        for (let i = 0; i < 8; i++) {
            f32[44 + i] = (i < distCount && lodDistancesSq[i] > 0) ? lodDistancesSq[i] : 1e15;
        }

        gpuDevice.queue.writeBuffer(
            this.#landscapeUniformBuffer,
            0,
            this.#landscapeUniformData.buffer,
            0,
            this.#landscapeUniformData.byteLength
        );
    }

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
            argsData[offset + 1] = 0;
            argsData[offset + 2] = firstIndex;
            argsData[offset + 3] = baseVertex;
            argsData[offset + 4] = lod * this.#maxComponentCount;
        }

        const byteLength = maxLODLevel * 5 * 4;
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, argsData.buffer, 0, byteLength);
    }

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

        const resourceManager = this.#redGPUContext.resourceManager;
        const vertexShaderInfo = resourceManager.wgslParser.parse('LANDSCAPE_VERTEX', landscapeVertexSource);
        const fragmentShaderInfo = resourceManager.wgslParser.parse('LANDSCAPE_FRAGMENT', landscapeFragmentSource);

        const descriptor = getUnionBindGroupLayoutDescriptorFromShaderInfos([
            {shaderInfo: vertexShaderInfo, visibility: GPUShaderStage.VERTEX},
            {shaderInfo: fragmentShaderInfo, visibility: GPUShaderStage.FRAGMENT}
        ], 1, {
            // VHT Height Atlas(binding 3)는 r32float 포맷이므로 unfilterable-float 설정 명시
            3: {texture: {sampleType: 'unfilterable-float', viewDimension: '2d'}}
        });

        this.#instanceStorageBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'LandscapeInstanceStorageBindGroupLayout',
            ...descriptor
        });

        this.#allInputTilesBuffer = gpuDevice.createBuffer({
            label: 'LandscapeAllInputTilesStorageBuffer',
            size: this.#maxComponentCount * 32,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.#visibleTileIndicesBuffer = gpuDevice.createBuffer({
            label: 'LandscapeVisibleTileIndicesStorageBuffer',
            size: this.#maxComponentCount * this.#maxLODLevel * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.#indirectDrawBuffer = gpuDevice.createBuffer({
            label: 'LandscapeIndirectDrawBuffer',
            size: this.#maxLODLevel * 20,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        const uniformByteLength = vertexShaderInfo?.uniforms?.landscapeUniforms?.arrayBufferByteLength
            || fragmentShaderInfo?.uniforms?.landscapeUniforms?.arrayBufferByteLength
            || 208;
        this.#landscapeUniformByteLength = uniformByteLength;

        this.#landscapeUniformBuffer = gpuDevice.createBuffer({
            label: 'LandscapeGlobalUniformBuffer',
            size: uniformByteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
}

export default LandscapeInstanceBuffer;
