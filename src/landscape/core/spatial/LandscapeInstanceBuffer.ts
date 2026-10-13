import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import landscapeVertexSource from "../shader/landscapeVertex.wgsl";
import landscapeFragmentSource from "../shader/landscapeFragment.wgsl";
import {getUnionBindGroupLayoutDescriptorFromShaderInfos} from "../../../material/core";
import {FOLIAGE_SUB_CELL_SIZE} from "../../foliage/FOLIAGE_CONSTANTS";

class LandscapeInstanceBuffer extends RedGPUObject {
    #maxComponentCount: number;
    #lodMaxLevel: number;

    #allTilesBuffer: GPUBuffer | null = null;
    #visibleTilesBuffer: GPUBuffer | null = null;
    #indirectDrawBuffer: GPUBuffer | null = null;
    #landscapeUniformBuffer: GPUBuffer | null = null;

    #instanceStorageBindGroup: GPUBindGroup | null = null;
    #instanceStorageBindGroupLayout: GPUBindGroupLayout | null = null;

    #allTilesData: Float32Array;

    #landscapeUniformData: Float32Array;
    #landscapeUniformUintData: Uint32Array;
    #landscapeUniformByteLength: number = 320;

    #indirectArgsBuffer: Uint32Array = new Uint32Array(40);

    constructor(redGPUContext: RedGPUContext, maxComponentCount: number, lodMaxLevel: number) {
        super(redGPUContext);
        this.#maxComponentCount = maxComponentCount;
        this.#lodMaxLevel = lodMaxLevel;

        this.#allTilesData = new Float32Array(maxComponentCount * 4);

        this.#createGPUResources();

        this.#landscapeUniformData = new Float32Array(this.#landscapeUniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#landscapeUniformUintData = new Uint32Array(this.#landscapeUniformData.buffer);
    }

    get allTilesBuffer(): GPUBuffer | null {
        return this.#allTilesBuffer;
    }

    get visibleTilesBuffer(): GPUBuffer | null {
        return this.#visibleTilesBuffer;
    }

    get indirectDrawBuffer(): GPUBuffer | null {
        return this.#indirectDrawBuffer;
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

    get lodMaxLevel(): number {
        return this.#lodMaxLevel;
    }

    setStaticTileData(
        index: number,
        centerWorldX: number,
        centerWorldZ: number,
        minHeightNorm: number = 0.0,
        maxHeightNorm: number = 1.0
    ): void {
        const offset = index * 4;
        this.#allTilesData[offset] = centerWorldX;
        this.#allTilesData[offset + 1] = centerWorldZ;
        this.#allTilesData[offset + 2] = minHeightNorm;
        this.#allTilesData[offset + 3] = maxHeightNorm;
    }

    updateTileHeightBounds(index: number, minHeightNorm: number, maxHeightNorm: number): void {
        const offset = index * 4;
        this.#allTilesData[offset + 2] = minHeightNorm;
        this.#allTilesData[offset + 3] = maxHeightNorm;
    }

    uploadStaticTilesToGPU(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#allTilesBuffer) return;

        gpuDevice.queue.writeBuffer(
            this.#allTilesBuffer,
            0,
            this.#allTilesData.buffer,
            0,
            this.#allTilesData.byteLength
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
        lodColorsRGBA: [number, number, number, number][],
        lodDistancesSq: number[],
        tanHalfFOV: number = 1.0,
        lodMetric: number = 0.0,
        lod0Quads: number = 256,
        receiveShadow: boolean = true,
        castHeightmapShadow: boolean = true,
        heightmapShadowSteps: number = 16,
        heightmapShadowDistance: number = 3000.0,
        heightmapShadowSoftness: number = 8.0,
        foliageSubCellColoration: boolean = false,
        foliageSubCellSize: number = FOLIAGE_SUB_CELL_SIZE,
        debugMode: number = 0
    ): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#landscapeUniformBuffer) return;

        const f32 = this.#landscapeUniformData;
        const u32 = this.#landscapeUniformUintData;

        f32[0] = heightScale;
        f32[1] = worldSizeX;
        f32[2] = worldSizeZ;
        f32[3] = lodColoration ? 1.0 : 0.0;

        u32[4] = maxComponentCount;
        f32[5] = tileSizeX;
        f32[6] = tileSizeZ;
        f32[7] = baseQuads;

        f32[8] = vhtTextureWidth;
        f32[9] = vhtTextureHeight;
        f32[10] = tanHalfFOV;
        f32[11] = lodMetric;

        const colorCount = Math.min(8, lodColorsRGBA.length);
        for (let i = 0; i < 8; i++) {
            const base = 12 + i * 4;
            if (i < colorCount) {
                const [r, g, b, a] = lodColorsRGBA[i];
                f32[base] = r;
                f32[base + 1] = g;
                f32[base + 2] = b;
                f32[base + 3] = a;
            } else {
                f32[base] = 0;
                f32[base + 1] = 0;
                f32[base + 2] = 0;
                f32[base + 3] = 0;
            }
        }

        const distCount = Math.min(8, lodDistancesSq.length);
        for (let i = 0; i < 8; i++) {
            const val = (i < distCount && lodDistancesSq[i] > 0) ? lodDistancesSq[i] : 1e15;
            f32[44 + i] = val;

            if (val < 1e14) {
                const nextDist = Math.sqrt(val);
                const prevVal = (i > 0 && i - 1 < distCount && lodDistancesSq[i - 1] > 0) ? lodDistancesSq[i - 1] : 0;
                const prevDist = (i > 0 && prevVal < 1e14) ? Math.sqrt(prevVal) : 0.0;
                const morphRange = Math.max(1.0, nextDist - prevDist);
                const morphStartDist = prevDist + morphRange * 0.7;
                const morphEndDist = nextDist;
                f32[52 + i] = morphStartDist;
                f32[60 + i] = 1.0 / Math.max(0.001, morphEndDist - morphStartDist);
            } else {
                f32[52 + i] = 1e15;
                f32[60 + i] = 0.0;
            }
        }

        f32[68] = lod0Quads;
        f32[69] = receiveShadow ? 1.0 : 0.0;
        f32[70] = castHeightmapShadow ? 1.0 : 0.0;
        f32[71] = heightmapShadowSteps;
        f32[72] = heightmapShadowDistance;
        f32[73] = heightmapShadowSoftness;
        f32[74] = foliageSubCellColoration ? 1.0 : 0.0;
        f32[75] = foliageSubCellSize;

        u32[76] = debugMode;
        f32[77] = 0.0;
        f32[78] = 0.0;
        f32[79] = 0.0;

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
        lodMaxLevel: number,
        isWireframe: boolean
    ): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#indirectDrawBuffer) return;

        const argsData = this.#indirectArgsBuffer;
        for (let lod = 0; lod < lodMaxLevel; lod++) {
            const offset = lod * 5;
            const lodRange = sharedGeometry.getLODRange(lod);
            const {
                wireframeIndexCount,
                indexCount: solidIndexCount,
                wireframeFirstIndex,
                firstIndex: solidFirstIndex,
                baseVertex
            } = lodRange;
            const indexCount = isWireframe ? wireframeIndexCount : solidIndexCount;
            const firstIndex = isWireframe ? wireframeFirstIndex : solidFirstIndex;

            argsData[offset] = indexCount;
            argsData[offset + 1] = 0;
            argsData[offset + 2] = firstIndex;
            argsData[offset + 3] = baseVertex;
            argsData[offset + 4] = lod * this.#maxComponentCount;
        }

        const byteLength = lodMaxLevel * 5 * 4;
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, argsData.buffer, 0, byteLength);
    }

    updateBindGroup(
        vhtTextureView: GPUTextureView,
        vntTextureView?: GPUTextureView,
        vbtBaseColorView?: GPUTextureView,
        vbtNormalView?: GPUTextureView,
        vbtORMView?: GPUTextureView
    ): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#instanceStorageBindGroupLayout || !this.#visibleTilesBuffer || !this.#landscapeUniformBuffer) return;

        const fallbackView = vntTextureView || vhtTextureView;

        const entries: GPUBindGroupEntry[] = [
            {
                binding: 0,
                resource: {
                    buffer: this.#visibleTilesBuffer
                }
            },
            {
                binding: 2,
                resource: vhtTextureView
            },
            {
                binding: 3,
                resource: fallbackView
            },
            {
                binding: 4,
                resource: {
                    buffer: this.#landscapeUniformBuffer
                }
            },
            {
                binding: 5,
                resource: vbtBaseColorView || fallbackView
            },
            {
                binding: 6,
                resource: vbtNormalView || fallbackView
            },
            {
                binding: 7,
                resource: vbtORMView || fallbackView
            }
        ];

        this.#instanceStorageBindGroup = gpuDevice.createBindGroup({
            label: 'Landscape_Instance_StorageBindGroup',
            layout: this.#instanceStorageBindGroupLayout,
            entries: entries
        });
    }

    destroy(): void {
        if (this.#allTilesBuffer) {
            this.#allTilesBuffer.destroy();
            this.#allTilesBuffer = null;
        }
        if (this.#visibleTilesBuffer) {
            this.#visibleTilesBuffer.destroy();
            this.#visibleTilesBuffer = null;
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
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const resourceManager = this.resourceManager;
        const vertexShaderInfo = resourceManager.wgslParser.parse('Landscape_VertexShaderInfo', landscapeVertexSource);
        const fragmentShaderInfo = resourceManager.wgslParser.parse('Landscape_FragmentShaderInfo', landscapeFragmentSource);

        const descriptor = getUnionBindGroupLayoutDescriptorFromShaderInfos([
            {shaderInfo: vertexShaderInfo, visibility: GPUShaderStage.VERTEX},
            {shaderInfo: fragmentShaderInfo, visibility: GPUShaderStage.FRAGMENT}
        ], 1, {
            2: {texture: {sampleType: 'unfilterable-float', viewDimension: '2d'}}
        });

        this.#instanceStorageBindGroupLayout = resourceManager.createBindGroupLayout(
            'Landscape_Instance_StorageBindGroupLayout',
            {
                label: 'Landscape_Instance_StorageBindGroupLayout',
                ...descriptor
            }
        );
        this.#allTilesBuffer = gpuDevice.createBuffer({
            label: 'Landscape_Instance_AllTilesBuffer',
            size: this.#maxComponentCount * 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.#visibleTilesBuffer = gpuDevice.createBuffer({
            label: 'Landscape_Instance_VisibleTilesBuffer',
            size: this.#maxComponentCount * this.#lodMaxLevel * 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.#indirectDrawBuffer = gpuDevice.createBuffer({
            label: 'Landscape_Instance_IndirectDrawBuffer',
            size: this.#lodMaxLevel * 20,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        const uniformByteLength = vertexShaderInfo?.uniforms?.landscapeUniforms?.arrayBufferByteLength
            || fragmentShaderInfo?.uniforms?.landscapeUniforms?.arrayBufferByteLength
            || 320;
        this.#landscapeUniformByteLength = uniformByteLength;

        this.#landscapeUniformBuffer = gpuDevice.createBuffer({
            label: 'Landscape_GlobalUniformBuffer',
            size: uniformByteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
}

Object.freeze(LandscapeInstanceBuffer);
export default LandscapeInstanceBuffer;

