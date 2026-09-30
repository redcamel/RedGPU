import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import landscapeVertexSource from "../shader/landscapeVertex.wgsl";
import landscapeFragmentSource from "../shader/landscapeFragment.wgsl";
import {getUnionBindGroupLayoutDescriptorFromShaderInfos} from "../../../material/core";

/**
 * [KO] GPU 컴퓨트 컬링 및 간접 드로우(Indirect Draw)를 지원하기 위한 지형 타일 인스턴스 버퍼 및 유니폼 버퍼 관리자입니다.
 * [EN] Buffer manager handling terrain tile instance buffers, indirect draw arguments, and global landscape uniform buffers for GPU compute culling and multi-LOD indirect rendering.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **타일 인스턴스 스토리지 버퍼 (`allInputTilesBuffer`)**: 전체 지형 타일의 월드 좌표, 바운딩 박스, 높이 범위, 아틀라스 UV 오프셋 등의 메타데이터를 저장합니다.
 * - **가시 인덱스 스트림 버퍼 (`visibleTileIndicesBuffer`)**: GPU 컬링 패스에서 가시성을 통과한 타일들의 인덱스가 순차적으로 기록되는 GPU 전용 출력 버퍼입니다.
 * - **멀티 LOD 인디렉트 버퍼 (`indirectDrawBuffer`)**: WebGPU의 `drawIndexedIndirect` 스펙에 맞추어 LOD 레벨당 5개의 uint32 필드(`indexCount`, `instanceCount`, `firstIndex`, `baseVertex`, `firstInstance`)를 배치하여 멀티 레벨 간접 드로우를 단일 패스로 처리합니다.
 * - **전역 유니폼 동기화 (`landscapeUniformBuffer`)**: 카메라 역행렬, 뷰/프로젝션 행렬, 높이 스케일, 안개 파라미터 등을 256바이트 정렬 버퍼로 래핑하여 셰이더와 동기화합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Tile Instance Storage (`allInputTilesBuffer`)**: Houses spatial metadata for all terrain tiles including world coordinates, bounding boxes, height bounds, and atlas UV offsets.
 * - **Visible Index Stream (`visibleTileIndicesBuffer`)**: Dedicated GPU output buffer sequentially populated with tile indices that passed frustum and occlusion culling tests.
 * - **Multi-LOD Indirect Buffer (`indirectDrawBuffer`)**: Layouts 5 uint32 fields (`indexCount`, `instanceCount`, `firstIndex`, `baseVertex`, `firstInstance`) per LOD level conforming to WebGPU `drawIndexedIndirect` specifications.
 * - **Global Uniform Sync (`landscapeUniformBuffer`)**: Synchronizes view/projection matrices, height scales, and fog parameters via a 256-byte aligned uniform buffer.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeInstanceBuffer extends RedGPUObject {
    #maxComponentCount: number;
    #lodMaxLevel: number;

    #allInputTilesBuffer: GPUBuffer | null = null;
    #visibleTileIndicesBuffer: GPUBuffer | null = null;
    #indirectDrawBuffer: GPUBuffer | null = null;
    #landscapeUniformBuffer: GPUBuffer | null = null;

    #instanceStorageBindGroup: GPUBindGroup | null = null;
    #instanceStorageBindGroupLayout: GPUBindGroupLayout | null = null;

    #allInputTilesData: Float32Array;

    #landscapeUniformData: Float32Array;
    #landscapeUniformUintData: Uint32Array;
    #landscapeUniformByteLength: number = 256;

    #indirectArgsBuffer: Uint32Array = new Uint32Array(40);

    /**
     * [KO] LandscapeInstanceBuffer 생성자입니다.
     * [EN] Constructor for LandscapeInstanceBuffer.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 / [EN] RedGPU context
     * @param maxComponentCount - [KO] 최대 타일(컴포넌트) 개수 / [EN] Maximum component (tile) count
     * @param lodMaxLevel - [KO] 최대 LOD 단계 수 / [EN] Maximum LOD levels count
     */
    constructor(redGPUContext: RedGPUContext, maxComponentCount: number, lodMaxLevel: number) {
        super(redGPUContext);
        this.#maxComponentCount = maxComponentCount;
        this.#lodMaxLevel = lodMaxLevel;

        this.#allInputTilesData = new Float32Array(maxComponentCount * 8);

        this.#createGPUResources();

        this.#landscapeUniformData = new Float32Array(this.#landscapeUniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#landscapeUniformUintData = new Uint32Array(this.#landscapeUniformData.buffer);
    }

    /**
     * [KO] 전체 입력 타일의 원본 메타데이터가 저장되는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer containing raw metadata of all input tiles.
     */
    get allInputTilesBuffer(): GPUBuffer | null {
        return this.#allInputTilesBuffer;
    }

    /**
     * [KO] GPU 컬링 후 가시적인 타일 인덱스 목록이 저장되는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer containing visible tile indices output by GPU culling.
     */
    get visibleTileIndicesBuffer(): GPUBuffer | null {
        return this.#visibleTileIndicesBuffer;
    }

    /**
     * [KO] LOD 레벨별 간접 드로우 인자(`drawIndexedIndirect`)가 기록되는 GPU 버퍼를 반환합니다.
     * [EN] Returns the GPU indirect draw argument buffer (`drawIndexedIndirect`) per LOD level.
     */
    get indirectDrawBuffer(): GPUBuffer | null {
        return this.#indirectDrawBuffer;
    }

    /**
     * [KO] 지형 글로벌 렌더링 파라미터가 기록되는 유니폼 버퍼를 반환합니다.
     * [EN] Returns the global landscape uniform buffer.
     */
    get landscapeUniformBuffer(): GPUBuffer | null {
        return this.#landscapeUniformBuffer;
    }

    /**
     * [KO] 지형 버텍스/프래그먼트 셰이더용 인스턴스 스토리지 바인드 그룹을 반환합니다.
     * [EN] Returns the instance storage bind group for vertex and fragment shaders.
     */
    get instanceStorageBindGroup(): GPUBindGroup | null {
        return this.#instanceStorageBindGroup;
    }

    /**
     * [KO] 인스턴스 스토리지 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the instance storage bind group layout.
     */
    get instanceStorageBindGroupLayout(): GPUBindGroupLayout | null {
        return this.#instanceStorageBindGroupLayout;
    }

    /**
     * [KO] 허용된 최대 타일(컴포넌트) 개수를 반환합니다.
     * [EN] Returns the maximum allowed component (tile) count.
     */
    get maxComponentCount(): number {
        return this.#maxComponentCount;
    }

    /**
     * [KO] 최대 LOD 단계 수를 반환합니다.
     * [EN] Returns the maximum number of LOD levels.
     */
    get lodMaxLevel(): number {
        return this.#lodMaxLevel;
    }

    /**
     * [KO] 특정 타일 인덱스의 정적 공간 및 디버그 색상 데이터를 CPU 버퍼에 설정합니다.
     * [EN] Sets the static spatial and debug color data of a specific tile index in the CPU buffer.
     *
     * @param index - [KO] 타일 인덱스 / [EN] Tile index
     * @param worldX - [KO] 타일 월드 X 좌표 / [EN] Tile world X coordinate
     * @param worldZ - [KO] 타일 월드 Z 좌표 / [EN] Tile world Z coordinate
     * @param r - [KO] 디버그 R 채널 / [EN] Debug R channel
     * @param g - [KO] 디버그 G 채널 / [EN] Debug G channel
     * @param b - [KO] 디버그 B 채널 / [EN] Debug B channel
     * @param a - [KO] 디버그 A 채널 / [EN] Debug A channel
     */
    setStaticTileData(
        index: number,
        worldX: number,
        worldZ: number,
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 0.0
    ): void {
        const offset = index * 8;
        this.#allInputTilesData[offset] = r;
        this.#allInputTilesData[offset + 1] = g;
        this.#allInputTilesData[offset + 2] = b;
        this.#allInputTilesData[offset + 3] = a;

        this.#allInputTilesData[offset + 4] = worldX;
        this.#allInputTilesData[offset + 5] = worldZ;
    }

    /**
     * [KO] CPU 측에 구성된 모든 정적 타일 데이터를 GPU 스토리지 버퍼로 업로드합니다.
     * [EN] Uploads all configured static tile data from CPU memory to the GPU storage buffer.
     */
    uploadStaticTilesToGPU(): void {
        const gpuDevice = this.gpuDevice;
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
     * [KO] 지형 글로벌 유니폼 버퍼 데이터를 갱신하고 GPU로 전송합니다.
     * [EN] Updates global landscape uniform buffer parameters and uploads to GPU.
     *
     * @param heightScale - [KO] 지형 높이 스케일 / [EN] Terrain height scale
     * @param worldSizeX - [KO] 전체 지형 월드 X 크기 / [EN] Total terrain world X size
     * @param worldSizeZ - [KO] 전체 지형 월드 Z 크기 / [EN] Total terrain world Z size
     * @param lodColoration - [KO] LOD 레벨 시각화 색상 활성화 여부 / [EN] Whether LOD level color visualization is enabled
     * @param maxComponentCount - [KO] 최대 컴포넌트 개수 / [EN] Maximum component count
     * @param tileSizeX - [KO] 단일 타일 X 크기 / [EN] Single tile X size
     * @param tileSizeZ - [KO] 단일 타일 Z 크기 / [EN] Single tile Z size
     * @param baseQuads - [KO] 기본 쿼드 세그먼트 수 / [EN] Base quad segment count
     * @param vhtTextureWidth - [KO] 가상 하이트맵(VHT) 텍스처 너비 / [EN] VHT texture width
     * @param vhtTextureHeight - [KO] 가상 하이트맵(VHT) 텍스처 높이 / [EN] VHT texture height
     * @param lodColorsRGBA - [KO] LOD별 색상 배열 / [EN] Array of RGBA colors per LOD
     * @param lodDistancesSq - [KO] LOD 전환 제곱 거리 배열 / [EN] Squared distance thresholds per LOD
     * @param tanHalfFOV - [KO] 카메라 tan(halfFOV) 값 / [EN] Camera tan(halfFOV)
     * @param lodMetric - [KO] 화면 투영 오차 LOD 계수 / [EN] Screen space error LOD metric
     * @param lod0Quads - [KO] LOD 0 단계 쿼드 해상도 / [EN] LOD 0 quad resolution
     * @param receiveShadow - [KO] 그림자 수신 여부 / [EN] Whether terrain receives shadows
     * @param castHeightmapShadow - [KO] 하이트맵 셀프 섀도우 연산 여부 / [EN] Whether to cast heightmap self-shadows
     * @param heightmapShadowSteps - [KO] 레이마칭 스텝 수 / [EN] Raymarching sample steps
     * @param heightmapShadowDistance - [KO] 그림자 최대 추적 거리 / [EN] Maximum shadow tracing distance
     * @param heightmapShadowSoftness - [KO] 소프트 섀도우 부드러움 계수 / [EN] Soft shadow factor
     * @param foliageSubCellColoration - [KO] 식생 서브셀 그리드 시각화 여부 / [EN] Whether foliage subcell grid is colored
     * @param foliageSubCellSize - [KO] 식생 서브셀 크기 / [EN] Foliage subcell size
     * @param foliageStreamingRadius - [KO] 식생 스트리밍 반경 / [EN] Foliage streaming radius
     * @param debugMode - [KO] 디버그 모드 플래그 / [EN] Debug mode flag
     */
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
        foliageSubCellSize: number = 100.0,
        foliageStreamingRadius: number = 600.0,
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
        // f32[10], f32[11] are reserved padding for 16-byte alignment of lodColors

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

        const distCount = Math.min(8, lodDistancesSq.length);
        for (let i = 0; i < 8; i++) {
            f32[44 + i] = (i < distCount && lodDistancesSq[i] > 0) ? lodDistancesSq[i] : 1e15;
        }

        f32[52] = tanHalfFOV;
        f32[53] = lodMetric;
        f32[54] = lod0Quads;
        f32[55] = receiveShadow ? 1.0 : 0.0;
        f32[56] = castHeightmapShadow ? 1.0 : 0.0;
        f32[57] = heightmapShadowSteps;
        f32[58] = heightmapShadowDistance;
        f32[59] = heightmapShadowSoftness;

        f32[60] = foliageSubCellColoration ? 1.0 : 0.0;
        f32[61] = foliageSubCellSize;
        f32[62] = foliageStreamingRadius;
        u32[63] = debugMode;

        gpuDevice.queue.writeBuffer(
            this.#landscapeUniformBuffer,
            0,
            this.#landscapeUniformData.buffer,
            0,
            this.#landscapeUniformData.byteLength
        );
    }

    /**
     * [KO] 각 LOD 레벨별 간접 인덱스 드로우 인자 버퍼(`indexCount, 0, firstIndex, baseVertex, firstInstance`)를 초기화합니다.
     * [EN] Resets the indirect indexed draw arguments buffer per LOD level.
     *
     * @param sharedGeometry - [KO] LOD 범위 정보를 제공하는 공유 지오메트리 객체 / [EN] Shared geometry object providing LOD ranges
     * @param lodMaxLevel - [KO] 최대 LOD 단계 수 / [EN] Maximum LOD levels count
     * @param isWireframe - [KO] 와이어프레임 렌더링 여부 / [EN] Whether wireframe mode is enabled
     */
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
            const indexCount = isWireframe ? lodRange.wireframeIndexCount : lodRange.indexCount;
            const firstIndex = isWireframe ? lodRange.wireframeFirstIndex : lodRange.firstIndex;
            const baseVertex = lodRange.baseVertex;

            argsData[offset] = indexCount;
            argsData[offset + 1] = 0;
            argsData[offset + 2] = firstIndex;
            argsData[offset + 3] = baseVertex;
            argsData[offset + 4] = lod * this.#maxComponentCount;
        }

        const byteLength = lodMaxLevel * 5 * 4;
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, argsData.buffer, 0, byteLength);
    }

    /**
     * [KO] 가상 텍스처 아틀라스(VHT/VNT/VBT) 뷰들을 인스턴스 렌더링 바인드 그룹에 연결합니다.
     * [EN] Binds virtual texture atlas views (VHT/VNT/VBT) to the instance rendering bind group.
     *
     * @param vhtTextureView - [KO] 가상 하이트맵(VHT) 텍스처 뷰 / [EN] VHT texture view
     * @param vntTextureView - [KO] 가상 노멀맵(VNT) 텍스처 뷰 / [EN] Optional VNT texture view
     * @param vbtBaseColorView - [KO] 가상 베이크 베이스컬러 텍스처 뷰 / [EN] Optional VBT base color texture view
     * @param vbtNormalView - [KO] 가상 베이크 노멀 텍스처 뷰 / [EN] Optional VBT normal texture view
     * @param vbtORMView - [KO] 가상 베이크 ORM 텍스처 뷰 / [EN] Optional VBT ORM texture view
     */
    updateBindGroup(
        vhtTextureView: GPUTextureView,
        vntTextureView?: GPUTextureView,
        vbtBaseColorView?: GPUTextureView,
        vbtNormalView?: GPUTextureView,
        vbtORMView?: GPUTextureView
    ): void {
        const gpuDevice = this.gpuDevice;
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
                resource: this.resourceManager.basicSampler.gpuSampler
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
            label: 'Landscape_Instance_StorageBindGroup',
            layout: this.#instanceStorageBindGroupLayout,
            entries: entries
        });
    }

    /**
     * [KO] 할당된 모든 GPU 버퍼 리소스를 해제합니다.
     * [EN] Destroys all allocated GPU buffer resources.
     */
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
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const resourceManager = this.resourceManager;
        const vertexShaderInfo = resourceManager.wgslParser.parse('Landscape_VertexShaderInfo', landscapeVertexSource);
        const fragmentShaderInfo = resourceManager.wgslParser.parse('Landscape_FragmentShaderInfo', landscapeFragmentSource);

        const descriptor = getUnionBindGroupLayoutDescriptorFromShaderInfos([
            {shaderInfo: vertexShaderInfo, visibility: GPUShaderStage.VERTEX},
            {shaderInfo: fragmentShaderInfo, visibility: GPUShaderStage.FRAGMENT}
        ], 1, {
            3: {texture: {sampleType: 'unfilterable-float', viewDimension: '2d'}}
        });

        this.#instanceStorageBindGroupLayout = resourceManager.createBindGroupLayout(
            'Landscape_Instance_StorageBindGroupLayout',
            {
                label: 'Landscape_Instance_StorageBindGroupLayout',
                ...descriptor
            }
        );
        this.#allInputTilesBuffer = gpuDevice.createBuffer({
            label: 'Landscape_Instance_AllInputTilesBuffer',
            size: this.#maxComponentCount * 32,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.#visibleTileIndicesBuffer = gpuDevice.createBuffer({
            label: 'Landscape_Instance_VisibleTileIndicesBuffer',
            size: this.#maxComponentCount * this.#lodMaxLevel * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.#indirectDrawBuffer = gpuDevice.createBuffer({
            label: 'Landscape_Instance_IndirectDrawBuffer',
            size: this.#lodMaxLevel * 20,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        const uniformByteLength = vertexShaderInfo?.uniforms?.landscapeUniforms?.arrayBufferByteLength
            || fragmentShaderInfo?.uniforms?.landscapeUniforms?.arrayBufferByteLength
            || 208;
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
