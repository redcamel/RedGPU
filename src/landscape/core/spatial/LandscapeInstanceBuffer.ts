import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import landscapeVertexSource from "../shader/landscapeVertex.wgsl";
import landscapeFragmentSource from "../shader/landscapeFragment.wgsl";
import {getUnionBindGroupLayoutDescriptorFromShaderInfos} from "../../../material/core";
import {FOLIAGE_SUB_CELL_SIZE} from "../../foliage/FOLIAGE_CONSTANTS";

/**
 * [KO] 지형(Landscape) 타일 인스턴스 버퍼, 가시 타일 스토리지 버퍼, 인다이렉트 드로우 버퍼 및 전역 지형 유니폼 버퍼를 관리하는 클래스입니다.
 * [EN] Class that manages Landscape tile instance buffers, visible tile storage buffers, indirect draw buffers, and global terrain uniform buffers.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
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

    /**
     * [KO] `LandscapeInstanceBuffer` 인스턴스를 생성하고 GPU 버퍼들을 할당합니다.
     * [EN] Creates a `LandscapeInstanceBuffer` instance and allocates GPU buffers.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param maxComponentCount -
     * [KO] 최대 타일 컴포넌트 개수
     * [EN] Maximum number of tile components
     * @param lodMaxLevel -
     * [KO] 최대 LOD 레벨 수
     * [EN] Maximum number of LOD levels
     */
    constructor(redGPUContext: RedGPUContext, maxComponentCount: number, lodMaxLevel: number) {
        super(redGPUContext);
        this.#maxComponentCount = maxComponentCount;
        this.#lodMaxLevel = lodMaxLevel;

        this.#allTilesData = new Float32Array(maxComponentCount * 4);

        this.#createGPUResources();

        this.#landscapeUniformData = new Float32Array(this.#landscapeUniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#landscapeUniformUintData = new Uint32Array(this.#landscapeUniformData.buffer);
    }

    /**
     * [KO] 모든 타일의 정적 월드 좌표 및 높이 경계가 저장된 GPU 버퍼를 반환합니다.
     * [EN] Returns the GPU buffer storing static world coordinates and height bounds for all tiles.
     *
     * @returns
     * [KO] 전체 타일 정적 정보 `GPUBuffer` 또는 `null`
     * [EN] Static tile information `GPUBuffer` or `null`
     */
    get allTilesBuffer(): GPUBuffer | null {
        return this.#allTilesBuffer;
    }

    /**
     * [KO] GPU 컬링 통과 후 가시 타일 데이터가 기록되는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer where visible tile data is written after GPU culling.
     *
     * @returns
     * [KO] 가시 타일 스토리지 `GPUBuffer` 또는 `null`
     * [EN] Visible tile storage `GPUBuffer` or `null`
     */
    get visibleTilesBuffer(): GPUBuffer | null {
        return this.#visibleTilesBuffer;
    }

    /**
     * [KO] LOD별 `drawIndexedIndirect` 인자가 저장된 GPU 버퍼를 반환합니다.
     * [EN] Returns the GPU buffer storing `drawIndexedIndirect` arguments per LOD.
     *
     * @returns
     * [KO] 인다이렉트 드로우 `GPUBuffer` 또는 `null`
     * [EN] Indirect draw `GPUBuffer` or `null`
     */
    get indirectDrawBuffer(): GPUBuffer | null {
        return this.#indirectDrawBuffer;
    }

    /**
     * [KO] 지형 렌더링 시 그룹 1에 바인딩되는 인스턴스 스토리지 바인드 그룹을 반환합니다.
     * [EN] Returns the instance storage bind group bound to group 1 during terrain rendering.
     *
     * @returns
     * [KO] 인스턴스 스토리지 `GPUBindGroup` 또는 `null`
     * [EN] Instance storage `GPUBindGroup` or `null`
     */
    get instanceStorageBindGroup(): GPUBindGroup | null {
        return this.#instanceStorageBindGroup;
    }

    /**
     * [KO] 인스턴스 스토리지 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the instance storage bind group layout.
     *
     * @returns
     * [KO] 인스턴스 스토리지 `GPUBindGroupLayout` 또는 `null`
     * [EN] Instance storage `GPUBindGroupLayout` or `null`
     */
    get instanceStorageBindGroupLayout(): GPUBindGroupLayout | null {
        return this.#instanceStorageBindGroupLayout;
    }

    /**
     * [KO] 버퍼가 수용 가능한 최대 타일 컴포넌트 개수를 반환합니다.
     * [EN] Returns the maximum number of tile components the buffer can accommodate.
     *
     * @returns
     * [KO] 최대 타일 컴포넌트 개수
     * [EN] Maximum number of tile components
     */
    get maxComponentCount(): number {
        return this.#maxComponentCount;
    }

    /**
     * [KO] 설정된 최대 LOD 레벨 수를 반환합니다.
     * [EN] Returns the configured maximum number of LOD levels.
     *
     * @returns
     * [KO] 최대 LOD 레벨 수
     * [EN] Maximum number of LOD levels
     */
    get lodMaxLevel(): number {
        return this.#lodMaxLevel;
    }

    /**
     * [KO] 특정 인덱스 타일의 정적 위치 및 정규화 높이 경계 데이터를 CPU 버퍼에 기록합니다.
     * [EN] Writes static position and normalized height bound data of a tile at a specific index to the CPU buffer.
     *
     * @param index -
     * [KO] 타일 인덱스
     * [EN] Tile index
     * @param centerWorldX -
     * [KO] 타일 중심 월드 X 좌표
     * [EN] Tile center world X coordinate
     * @param centerWorldZ -
     * [KO] 타일 중심 월드 Z 좌표
     * [EN] Tile center world Z coordinate
     * @param minHeightNorm -
     * [KO] 정규화된 최소 높이값 (`0.0` ~ `1.0`)
     * [EN] Normalized minimum height value (`0.0` to `1.0`)
     * @param maxHeightNorm -
     * [KO] 정규화된 최대 높이값 (`0.0` ~ `1.0`)
     * [EN] Normalized maximum height value (`0.0` to `1.0`)
     */
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

    /**
     * [KO] 특정 인덱스 타일의 정규화된 최소/최대 높이 경계값만 갱신합니다.
     * [EN] Updates only the normalized minimum/maximum height bounds of a tile at a specific index.
     *
     * @param index -
     * [KO] 타일 인덱스
     * [EN] Tile index
     * @param minHeightNorm -
     * [KO] 정규화된 최소 높이값
     * [EN] Normalized minimum height value
     * @param maxHeightNorm -
     * [KO] 정규화된 최대 높이값
     * [EN] Normalized maximum height value
     */
    updateTileHeightBounds(index: number, minHeightNorm: number, maxHeightNorm: number): void {
        const offset = index * 4;
        this.#allTilesData[offset + 2] = minHeightNorm;
        this.#allTilesData[offset + 3] = maxHeightNorm;
    }

    /**
     * [KO] CPU에 구성된 전체 타일 정적 데이터를 GPU 버퍼(`allTilesBuffer`)로 업로드합니다.
     * [EN] Uploads all static tile data configured on the CPU to the GPU buffer (`allTilesBuffer`).
     */
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

    /**
     * [KO] 지형 버텍스 및 프래그먼트 셰이더에서 사용하는 전역 유니폼 버퍼를 갱신합니다.
     * [EN] Updates the global uniform buffer used by terrain vertex and fragment shaders.
     *
     * @param heightScale -
     * [KO] 지형 높이 스케일
     * [EN] Terrain height scale
     * @param worldSizeX -
     * [KO] 전체 지형의 가로(X) 월드 크기
     * [EN] Total world width (X) of the terrain
     * @param worldSizeZ -
     * [KO] 전체 지형의 세로(Z) 월드 크기
     * [EN] Total world depth (Z) of the terrain
     * @param lodColoration -
     * [KO] LOD 레벨별 디버그 색상 표시 여부
     * [EN] Whether to display debug colors per LOD level
     * @param maxComponentCount -
     * [KO] 최대 타일 컴포넌트 개수
     * [EN] Maximum number of tile components
     * @param tileSizeX -
     * [KO] 단일 타일 가로(X) 월드 크기
     * [EN] Single tile world width (X)
     * @param tileSizeZ -
     * [KO] 단일 타일 세로(Z) 월드 크기
     * [EN] Single tile world depth (Z)
     * @param baseQuads -
     * [KO] 기본 타일 쿼드 분할 수
     * [EN] Base tile quad subdivision count
     * @param vhtTextureWidth -
     * [KO] VHT 아틀라스 텍스처 가로 해상도
     * [EN] VHT atlas texture width resolution
     * @param vhtTextureHeight -
     * [KO] VHT 아틀라스 텍스처 세로 해상도
     * [EN] VHT atlas texture height resolution
     * @param lodColorsRGBA -
     * [KO] LOD 레벨별 RGBA 디버그 색상 배열
     * [EN] Array of RGBA debug colors per LOD level
     * @param lodDistancesSq -
     * [KO] LOD 레벨별 전환 거리 제곱(`distance^2`) 배열 (`Array<number>`)
     * [EN] Array of squared transition distances (`distance^2`) per LOD level (`Array<number>`)
     * @param tanHalfFOV -
     * [KO] 카메라 수직 시야각 절반의 탄젠트 값
     * [EN] Tangent of half the camera vertical field of view
     * @param lodMetric -
     * [KO] LOD 화면 공간 오차 메트릭
     * [EN] LOD screen-space error metric
     * @param lod0Quads -
     * [KO] LOD 0 단계의 쿼드 분할 수
     * [EN] Quad subdivision count at LOD 0
     * @param receiveShadow -
     * [KO] 그림자 수신 여부
     * [EN] Whether to receive shadows
     * @param castHeightmapShadow -
     * [KO] 하이트맵 레이마칭 자체 그림자 활성화 여부
     * [EN] Whether heightmap raymarching self-shadow is enabled
     * @param heightmapShadowSteps -
     * [KO] 하이트맵 그림자 레이마칭 스텝 수
     * [EN] Number of raymarching steps for heightmap shadow
     * @param heightmapShadowDistance -
     * [KO] 하이트맵 그림자 최대 추적 거리
     * [EN] Maximum trace distance for heightmap shadow
     * @param heightmapShadowSoftness -
     * [KO] 하이트맵 그림자 소프트니스 계수
     * [EN] Softness factor for heightmap shadow
     * @param foliageSubCellColoration -
     * [KO] 식생 서브셀 디버그 색상 표시 여부
     * [EN] Whether to display foliage sub-cell debug coloration
     * @param foliageSubCellSize -
     * [KO] 식생 서브셀 월드 크기
     * [EN] World size of a foliage sub-cell
     * @param debugMode -
     * [KO] 지형 셰이더 디버그 모드 인덱스
     * [EN] Terrain shader debug mode index
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

    /**
     * [KO] 매 프레임 컬링 패스 실행 전, 각 LOD의 `instanceCount`를 0으로 초기화한 인다이렉트 드로우 인자를 GPU 버퍼에 기록합니다.
     * [EN] Writes indirect draw arguments with `instanceCount` reset to 0 for each LOD to the GPU buffer before executing the culling pass each frame.
     *
     * @param sharedGeometry -
     * [KO] LOD별 인덱스 오프셋 및 정점 범위를 제공하는 공유 지오메트리 객체
     * [EN] Shared geometry object providing index offsets and vertex ranges per LOD
     * @param lodMaxLevel -
     * [KO] 최대 LOD 레벨 수
     * [EN] Maximum number of LOD levels
     * @param isWireframe -
     * [KO] 와이어프레임 인덱스 범위 사용 여부
     * [EN] Whether to use wireframe index ranges
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

    /**
     * [KO] VHT, VNT 및 VBT 아틀라스 텍스처 뷰를 바인딩하여 인스턴스 스토리지 바인드 그룹을 갱신합니다.
     * [EN] Updates the instance storage bind group by binding VHT, VNT, and VBT atlas texture views.
     *
     * @param vhtTextureView -
     * [KO] 가상 하이트맵 아틀라스(VHT) 텍스처 뷰
     * [EN] Virtual Heightmap Texture (VHT) atlas view
     * @param vntTextureView -
     * [KO] 가상 노멀맵 아틀라스(VNT) 텍스처 뷰 (선택)
     * [EN] Virtual Normalmap Texture (VNT) atlas view (optional)
     * @param vbtBaseColorView -
     * [KO] 가상 블렌드 BaseColor 아틀라스(VBT) 텍스처 뷰 (선택)
     * [EN] Virtual Blend Texture (VBT) BaseColor atlas view (optional)
     * @param vbtNormalView -
     * [KO] 가상 블렌드 Normal 아틀라스(VBT) 텍스처 뷰 (선택)
     * [EN] Virtual Blend Texture (VBT) Normal atlas view (optional)
     * @param vbtORMView -
     * [KO] 가상 블렌드 ORM 아틀라스(VBT) 텍스처 뷰 (선택)
     * [EN] Virtual Blend Texture (VBT) ORM atlas view (optional)
     */
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

    /**
     * [KO] 할당된 모든 GPU 버퍼(`allTilesBuffer`, `visibleTilesBuffer`, `indirectDrawBuffer`, `landscapeUniformBuffer`)를 파괴합니다.
     * [EN] Destroys all allocated GPU buffers (`allTilesBuffer`, `visibleTilesBuffer`, `indirectDrawBuffer`, `landscapeUniformBuffer`).
     */
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
