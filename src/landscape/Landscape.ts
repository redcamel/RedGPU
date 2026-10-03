import RedGPUContext from "../context/RedGPUContext";
import GPU_PRIMITIVE_TOPOLOGY from "../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import RenderViewStateData from "../display/view/core/RenderViewStateData";
import PerspectiveCamera from "../camera/camera/PerspectiveCamera";
import landscapeVertexSource from "./core/shader/landscapeVertex.wgsl";
import LANDSCAPE_BASE_GRID_SIZE, {validateLandscapeBaseGridSize} from "./LANDSCAPE_BASE_GRID_SIZE";
import LandscapeComponent from "./core/spatial/LandscapeComponent";
import LandscapeInstanceBuffer from "./core/spatial/LandscapeInstanceBuffer";
import LandscapeMaterial from "./LandscapeMaterial";
import LandscapeWeightMapCPUSampler from "./core/cache/LandscapeWeightMapCPUSampler";
import LandscapeLayer, {LandscapeLayerOptions} from "./LandscapeLayer";
import LandscapeSharedGeometry from "./core/spatial/LandscapeSharedGeometry";
import ColorRGBA from "../color/ColorRGBA";
import LandscapeSpatialGrid from "./core/spatial/LandscapeSpatialGrid";
import LandscapeTileStreamer, {LandscapeTileUrlResolver} from "./core/spatial/LandscapeTileStreamer";
import RedGPUObject from "../base/RedGPUObject";
import FoliageManager from "./foliage/FoliageManager";
import GrassManager from "./grass/GrassManager";
import {LandscapeGPUCuller} from "./core/spatial/LandscapeGPUCuller";
import computeViewFrustumPlanes from "../math/computeViewFrustumPlanes";
import DebuggerManager from "./debugger/DebuggerManager";
import LANDSCAPE_DEFAULT_LOD_COLORS from "./LANDSCAPE_DEFAULT_LOD_COLORS";
import {mat4} from 'gl-matrix';

const DEFAULT_LOD_MULTIPLIERS: number[] = [1.0, 2.0, 3.5, 6.0, 9.5, 14.0, 20.0];
const tempPVMatrix: Float32Array = new Float32Array(16);

/**
 * [KO] 대규모 오픈월드 지형(Landscape)의 렌더링, 동적 타일 스트리밍, 복합 생태계 서브시스템을 총괄하는 핵심 클래스입니다.
 * [EN] Core orchestration class for large-scale open-world terrain rendering, dynamic tile streaming, and ecosystem subsystem integration.
 *
 * [KO] 가상 텍스처 아틀라스(VHT/VNT/VBT)와 GPU 컴퓨트 파이프라인을 기반으로 광활한 야외 지형을 실시간 고성능으로 표현하며, 주요 생태계 기능들은 전용 서브시스템을 통해 명확히 분리 관리됩니다:
 * [KO] - **지면 텍스처 블렌딩 (Texture Blending)**: 지형의 지표면 다중 텍스처 블렌딩은 Landscape 자체의 **레이어 시스템**(`addLayer()`, `layers`, `LandscapeLayer`)으로 관리됩니다. 각 레이어별 베이스 컬러, 노멀, ORM 및 스플랫 가중치 맵(WeightMap)을 유연하게 합성합니다.
 * [KO] - **절차적 잔디 생태계 (Procedural Grass)**: 지형 표면에 대규모로 배치되는 잔디는 {@link Landscape.grassManager | `landscape.grassManager`} 인스턴스로 독립 관리됩니다. GPU 컴퓨트 기반 밀도 베이킹, 거리별 스트리밍, 바람 시뮬레이션을 수행합니다.
 * [KO] - **대규모 식생 및 3D 임포스터 (Foliage & Impostors)**: 나무, 수풀, 바위 등 3D 식생 오브젝트는 {@link Landscape.foliageManager | `landscape.foliageManager`} 인스턴스로 독립 관리됩니다. 자동 HZB 오클루전 컬링, 계층적 LOD 및 원거리 3D 옥타헤드럴 임포스터 베이킹을 지원합니다.
 * [KO] - **실시간 시각 디버깅 (Visual Debugging)**: 가상 하이트맵(VHT), 가상 노멀(VNT), 베이킹 텍스처(VBT) 및 공간 그리드는 {@link Landscape.debuggerManager | `landscape.debuggerManager`} 인스턴스를 통해 실시간 온스크린 뷰어로 모니터링할 수 있습니다.
 *
 * [EN] Delivers vast outdoor terrain with real-time performance using virtual texture atlases (VHT/VNT/VBT) and a GPU compute pipeline, with key features managed through dedicated subsystems:
 * [EN] - **Texture Blending**: Multi-texture surface blending is managed by Landscape's own **layer system** (`addLayer()`, `layers`, `LandscapeLayer`), flexibly compositing base color, normal, ORM, and weight maps per layer.
 * [EN] - **Procedural Grass**: Large-scale grass populating the terrain surface is independently managed via the {@link Landscape.grassManager | `landscape.grassManager`} instance, handling GPU compute-based density baking, distance streaming, and wind simulation.
 * [EN] - **Foliage & Impostors**: 3D vegetation objects such as trees, bushes, and rocks are independently managed via the {@link Landscape.foliageManager | `landscape.foliageManager`} instance, supporting automatic HZB occlusion culling, hierarchical LOD, and distant 3D octahedral impostor baking.
 * [EN] - **Visual Debugging**: Virtual heightmaps (VHT), normals (VNT), baked textures (VBT), and spatial grids can be monitored via on-screen viewers using the {@link Landscape.debuggerManager | `landscape.debuggerManager`} instance.
 *
 * <iframe src="/RedGPU/examples/3d/landscape/openWorldIntegration/"></iframe>
 *
 * ### Example
 * ```typescript
 * // 지형 크기 지정 생성 (기본값: 2000) / Create landscape with world size (default: 2000)
 * const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 2000);
 * landscape.heightScale = 600;
 *
 * // 글로벌 16비트 높이맵 지정 / Assign 16-bit global heightmap
 * landscape.globalHeightmapUrl = '/assets/terrain/global_heightmap_1024.png';
 *
 * // 1. 지면 텍스처 블렌딩 (Layer 시스템)
 * landscape.addLayer({
 *     diffuseTexture: grassTexture,
 *     normalTexture: grassNormalTexture,
 *     uvScale: [40, 40]
 * });
 *
 * // 2. 절차적 잔디 제어 (grassManager 인스턴스)
 * landscape.grassManager.addGrass({
 *     name: 'FieldGrass',
 *     mesh: grassMesh,
 *     densityPerHectare: 20000
 * });
 *
 * // 3. 식생 및 수목 제어 (foliageManager 인스턴스)
 * landscape.foliageManager.addFoliage({
 *     name: 'PineTree',
 *     lods: [{ mesh: treeMesh, lodDistance: 150 }],
 *     densityPerHectare: 90
 * });
 *
 * // 4. 디버거 온스크린 모니터링 (debuggerManager 인스턴스)
 * landscape.debuggerManager.vbt = true;
 *
 * // 씬에 지형 등록 / Add landscape to scene
 * scene.landscape = landscape;
 * ```
 *
 * [KO] 아래는 Landscape의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Landscape.
 * @see [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)
 * @see [Tile Streaming & Continuous LOD](/RedGPU/examples/3d/landscape/tileStreaming/)
 * @see [Multi-Layer Splatting](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
 * @see [Procedural Grass Field](/RedGPU/examples/3d/landscape/proceduralGrass/)
 * @see [Foliage & Impostors](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
 * @see [Landscape & Water System](/RedGPU/examples/3d/landscape/landscapeAndWater/)
 *
 * @category Landscape
 */
export class Landscape extends RedGPUObject {
    // =========================================================================
    // Core Context & Subsystems
    // =========================================================================
    #spatialGrid: LandscapeSpatialGrid;
    #sharedGeometry: LandscapeSharedGeometry;
    #instanceBuffer: LandscapeInstanceBuffer;
    #tileStreamer: LandscapeTileStreamer;
    #material: LandscapeMaterial;
    #weightMapCPUSampler: LandscapeWeightMapCPUSampler;
    #gpuCuller: LandscapeGPUCuller | null = null;

    // =========================================================================
    // Subsystem Managers
    // =========================================================================
    #foliageManager: FoliageManager;
    #grassManager: GrassManager;
    #debuggerManager: DebuggerManager;

    // =========================================================================
    // Spatial Dimensions & Grid Configuration
    // =========================================================================
    #heightScale: number = 500.0;
    #componentSizeQuads: number = LANDSCAPE_BASE_GRID_SIZE.QUAD_64;
    #lod0SizeQuads: number = LANDSCAPE_BASE_GRID_SIZE.QUAD_256;

    // =========================================================================
    // LOD Configuration & Buffers
    // =========================================================================
    #lodMetric: 'distance' | 'screenSize' = 'screenSize';
    #lodMaxLevel: number;
    #lodDistancesSq: number[] = [];
    #lodMultipliers: number[] = [];
    #lodColorsRGBA: [number, number, number, number][] = [];
    #lodDistancesBuffer: Float32Array = new Float32Array(8);
    #lastTanHalfFOV: number = 1.0;


    // =========================================================================
    // Lighting & Heightmap Shadow
    // =========================================================================
    #receiveShadow: boolean = true;
    #castHeightmapShadow: boolean = true;
    #heightmapShadowSteps: number = 16;
    #heightmapShadowDistance: number = 3000.0;
    #heightmapShadowSoftness: number = 8.0;

    // =========================================================================
    // Rendering Pipeline & Caches
    // =========================================================================
    #vertexShaderModule: GPUShaderModule;
    #renderPipelineCache: Map<string, GPURenderPipeline> = new Map();
    #cachedRenderPipeline: GPURenderPipeline | null = null;
    #lastRenderTopology: string = '';
    #lastRenderMaterialUUID: string = '';
    #lastRenderVariantModule: any = null;
    #lastRenderMsaaID: string = '';
    #lastHZBView: GPUTextureView | null = null;
    #lastHZBSampler: GPUSampler | null = null;

    /**
     * [KO] Landscape 인스턴스를 생성하고 가상 텍스처 아틀라스 및 지형 파이프라인을 초기화합니다.
     * [EN] Creates a Landscape instance and initializes virtual texture atlases and terrain pipelines.
     *
     * ### Example
     * ```typescript
     * // 기본 2000m x 2000m 크기로 생성 / Create with default 2000m x 2000m dimensions
     * const landscape = new RedGPU.Landscape.Landscape(redGPUContext);
     *
     * // 사용자 정의 월드 크기 지정 / Specify custom world dimensions
     * const landscapeLarge = new RedGPU.Landscape.Landscape(redGPUContext, 8000);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param worldSize -
     * [KO] 지형의 월드 가로/세로 크기 (단일 숫자 또는 `[sizeX, sizeZ]`, 기본값: 2000)
     * [EN] World dimensions of the landscape (single number or `[sizeX, sizeZ]`, default: 2000)
     */
    constructor(redGPUContext: RedGPUContext, worldSize: number | [number, number] = 2000) {
        super(redGPUContext);

        let wsX = 2000;
        let wsZ = 2000;
        if (Array.isArray(worldSize)) {
            [wsX, wsZ] = worldSize;
        } else if (typeof worldSize === 'number') {
            wsX = wsZ = worldSize;
        }

        const worldSizeX = wsX;
        const worldSizeZ = wsZ;
        const componentCountX = 16;
        const componentCountZ = 16;
        const tileSizeX = worldSizeX / componentCountX;
        const tileSizeZ = worldSizeZ / componentCountZ;
        const componentSizeQuads = LANDSCAPE_BASE_GRID_SIZE.QUAD_64;
        const lod0SizeQuads = LANDSCAPE_BASE_GRID_SIZE.QUAD_256;
        const lodMaxLevel = 5;

        const material = new LandscapeMaterial(redGPUContext);
        const sharedGeometry = new LandscapeSharedGeometry(redGPUContext, tileSizeX, tileSizeZ, componentSizeQuads, lodMaxLevel, lod0SizeQuads);

        this.#spatialGrid = new LandscapeSpatialGrid(componentCountX, componentCountZ, tileSizeX, tileSizeZ);
        this.#sharedGeometry = sharedGeometry;
        this.#material = material;
        this.#weightMapCPUSampler = new LandscapeWeightMapCPUSampler();
        this.#componentSizeQuads = componentSizeQuads;
        this.#lod0SizeQuads = lod0SizeQuads;
        this.#lodMaxLevel = lodMaxLevel;
        this.#lodMetric = 'screenSize';
        this.#tileStreamer = new LandscapeTileStreamer(redGPUContext, this.#spatialGrid, 2500.0);
        this.#tileStreamer.lod0SizeQuads = lod0SizeQuads;
        this.#heightScale = 500.0;

        this.#tileStreamer.ensureAtlasSize(componentCountX, componentCountZ);
        this.#tileStreamer.setMaterial(material);

        material.setOnRebakeVBTRequested(() => {
            this.#tileStreamer.rebakeAllLoadedVBT();
            this.#grassManager?.rebakeAll();
        });

        this.#initSystems(redGPUContext, componentCountX, componentCountZ, lodMaxLevel);
        this.#foliageManager = new FoliageManager(this, this.#tileStreamer, () => {
            this.#updateLandscapeUniforms();
        });
        this.#grassManager = new GrassManager(this, this.#tileStreamer);
        this.#tileStreamer.setOnTileLoaded((tileComponent) => {
            this.#foliageManager?.onTileLoaded(tileComponent);
            this.#grassManager?.onTileLoaded(tileComponent);
        });
        this.#tileStreamer.setOnGlobalHeightmapBaked(() => {
            this.#grassManager?.rebakeAll();
        });
        this.#debuggerManager = new DebuggerManager(this, this.#tileStreamer, {
            onDebugPropertyChange: (key) => {
                if (key === 'debugMode' || key === 'lodColoration') {
                    this.#updateLandscapeUniforms();
                }
            }
        });
        this.#updateLandscapeUniforms();
    }

    // =========================================================================
    // Properties: Context & Subsystem Managers
    // =========================================================================
    /**
     * [KO] 지형의 시각화 디버깅(타일 바운드, 노멀, LOD 와이어프레임 등)을 총괄하는 디버거 매니저를 반환합니다.
     * [EN] Returns the debugger manager that coordinates visual debugging (tile bounds, normals, LOD wireframes, etc.).
     */
    get debuggerManager(): DebuggerManager {
        return this.#debuggerManager;
    }

    /**
     * [KO] 지형 상에 배치되는 나무, 바위 등의 3D 식생 및 임포스터 인스턴싱 매니저를 반환합니다.
     * [EN] Returns the foliage manager for 3D vegetation, rocks, and impostor instancing on the terrain.
     */
    get foliageManager(): FoliageManager {
        return this.#foliageManager;
    }

    /**
     * [KO] 절차적 잔디 필드 및 Multi-Draw Indirect 렌더링 매니저를 반환합니다.
     * [EN] Returns the procedural grass field and Multi-Draw Indirect rendering manager.
     */
    get grassManager(): GrassManager {
        return this.#grassManager;
    }

    /**
     * [KO] 지형 렌더링에 사용되는 `LandscapeMaterial` 재질 인스턴스를 반환합니다.
     * [EN] Returns the `LandscapeMaterial` instance used for terrain rendering.
     */
    get material(): LandscapeMaterial {
        return this.#material;
    }


    // =========================================================================
    // Properties: Spatial & Grid Dimensions
    // =========================================================================
    /**
     * [KO] 지형의 월드 크기 `[sizeX, sizeZ]`를 튜플로 반환합니다.
     * [EN] Returns the world dimensions `[sizeX, sizeZ]` of the landscape as a tuple.
     *
     * @defaultValue [2000, 2000]
     */
    get worldSize(): [number, number] {
        return this.#spatialGrid.worldSize;
    }

    /**
     * [KO] 지형의 월드 크기를 설정합니다. 단일 숫자 전달 시 가로/세로 동일 크기로 지정됩니다.
     * [EN] Sets the world size of the landscape. Providing a single number applies to both dimensions.
     *
     * @param value -
     * [KO] 월드 크기 (숫자 또는 `[sizeX, sizeZ]` 배열)
     * [EN] World size (number or `[sizeX, sizeZ]` array)
     */
    set worldSize(value: number | [number, number]) {
        let wx = this.#spatialGrid.worldSizeX;
        let wz = this.#spatialGrid.worldSizeZ;
        if (Array.isArray(value)) {
            wx = value[0];
            wz = value[1];
        } else if (typeof value === 'number') {
            wx = value;
            wz = value;
        }

        if (wx > 0 && wz > 0 && (this.#spatialGrid.worldSizeX !== wx || this.#spatialGrid.worldSizeZ !== wz)) {
            const tcX = this.#spatialGrid.tileCountX;
            const tcZ = this.#spatialGrid.tileCountZ;
            this.#spatialGrid.setConfig(tcX, tcZ, wx / tcX, wz / tcZ);
            this.#updateLandscapeUniforms();
            this.#rebuildTiles();
        }
    }

    /**
     * [KO] 지형을 구성하는 X축 및 Z축 컴포넌트(타일) 분할 개수 `[countX, countZ]`를 반환합니다.
     * [EN] Returns the number of component (tile) subdivisions along X and Z axes as `[countX, countZ]`.
     */
    get componentCount(): [number, number] {
        return this.#spatialGrid.componentCount;
    }

    /**
     * [KO] 지형 컴포넌트 타일 분할 개수를 설정합니다. (1~32 범위로 클램핑)
     * [EN] Sets the number of component tile subdivisions (clamped between 1 and 32).
     *
     * @param value -
     * [KO] 컴포넌트 개수 (숫자 또는 `[countX, countZ]` 배열)
     * [EN] Component count (number or `[countX, countZ]` array)
     */
    set componentCount(value: number | [number, number]) {
        let tcX = this.#spatialGrid.tileCountX;
        let tcZ = this.#spatialGrid.tileCountZ;
        if (Array.isArray(value)) {
            tcX = this.#clampComponentCount(value[0]);
            tcZ = this.#clampComponentCount(value[1]);
        } else if (typeof value === 'number') {
            const count = this.#clampComponentCount(value);
            tcX = count;
            tcZ = count;
        }

        if (this.#spatialGrid.tileCountX !== tcX || this.#spatialGrid.tileCountZ !== tcZ) {
            const wx = this.#spatialGrid.worldSizeX;
            const wz = this.#spatialGrid.worldSizeZ;
            this.#spatialGrid.setConfig(tcX, tcZ, wx / tcX, wz / tcZ);
            this.#rebuildTiles();
        }
    }

    /**
     * [KO] 각 컴포넌트 타일 1개의 월드 크기 `[sizeX, sizeZ]`를 반환합니다.
     * [EN] Returns the world dimensions `[sizeX, sizeZ]` of a single component tile.
     */
    get tileSize(): [number, number] {
        return this.#spatialGrid.tileSize;
    }

    /**
     * [KO] 지형의 최대 고도 스케일(높이 비율)을 반환합니다.
     * [EN] Returns the maximum elevation height scale of the landscape.
     */
    get heightScale(): number {
        return this.#heightScale;
    }

    /**
     * [KO] 지형의 고도 스케일을 설정하고, 가상 노멀 및 텍스처 아틀라스를 재베이킹합니다.
     * [EN] Sets the elevation height scale of the landscape and triggers atlas re-baking.
     *
     * @param val -
     * [KO] 지형 고도 스케일
     * [EN] Terrain elevation height scale
     */
    set heightScale(val: number) {
        if (this.#heightScale !== val) {
            this.#heightScale = val;
            this.#tileStreamer?.setTerrainConfig(val);
            this.#updateLandscapeUniforms();
            this.#tileStreamer?.rebakeAllLoadedVNT();
            this.#tileStreamer?.rebakeAllLoadedVBT();
            this.#grassManager?.rebakeAll();
            this.#foliageManager?.rebakeAll();
        }
    }

    /**
     * [KO] 각 컴포넌트 메시 타일의 기본 쿼드 그리드 해상도를 반환합니다.
     * [EN] Returns the base quad grid resolution for each component mesh tile.
     */
    get componentSizeQuads(): number {
        return this.#componentSizeQuads;
    }

    /**
     * [KO] 각 컴포넌트 메시 타일의 기본 쿼드 해상도를 설정합니다. (`LANDSCAPE_BASE_GRID_SIZE` 값 사용)
     * [EN] Sets the base quad resolution for component mesh tiles (use `LANDSCAPE_BASE_GRID_SIZE` values).
     *
     * @param value -
     * [KO] 그리드 크기 (`16`, `32`, `64`, `128`, `256`, `512`)
     * [EN] Grid size (`16`, `32`, `64`, `128`, `256`, `512`)
     */
    set componentSizeQuads(value: number) {
        validateLandscapeBaseGridSize(value);
        if (value > 0 && this.#componentSizeQuads !== value) {
            this.#componentSizeQuads = value;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.redGPUContext,
                this.#spatialGrid.tileSizeX,
                this.#spatialGrid.tileSizeZ,
                value,
                this.#lodMaxLevel,
                this.#lod0SizeQuads
            );
            this.#rebuildTiles();
        }
    }

    /**
     * [KO] 최고 해상도(LOD 0) 타일의 쿼드 해상도를 반환합니다.
     * [EN] Returns the quad resolution for highest detail (LOD 0) tiles.
     */
    get lod0SizeQuads(): number {
        return this.#lod0SizeQuads;
    }

    /**
     * [KO] 최고 해상도(LOD 0) 타일의 쿼드 해상도를 설정합니다.
     * [EN] Sets the quad resolution for highest detail (LOD 0) tiles.
     *
     * @param value -
     * [KO] LOD 0 쿼드 해상도
     * [EN] LOD 0 quad resolution
     */
    set lod0SizeQuads(value: number) {
        const clamped = Math.max(this.#componentSizeQuads, Math.round(value));
        if (this.#lod0SizeQuads !== clamped) {
            this.#lod0SizeQuads = clamped;
            this.#tileStreamer.lod0SizeQuads = clamped;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.redGPUContext,
                this.#spatialGrid.tileSizeX,
                this.#spatialGrid.tileSizeZ,
                this.#componentSizeQuads,
                this.#lodMaxLevel,
                clamped
            );
            this.#rebuildTiles();
        }
    }

    /**
     * @example
     * ```ts
     * const tiles = landscape.components;
     * console.log(`총 타일 컴포넌트: ${tiles.length}`);
     * ```
     *
     * [KO]
     * 지형 공간 그리드에 등록된 모든 `LandscapeComponent` 인스턴스 배열을 가져옵니다. (읽기 전용)
     *
     * [EN]
     * Gets the array of all `LandscapeComponent` instances registered in the landscape spatial grid. (Read-only)
     *
     */
    get components(): LandscapeComponent[] {
        return this.#spatialGrid.flatCells;
    }


    // =========================================================================
    // Properties: LOD Configuration
    // =========================================================================
    /**
     * [KO] 현재 적용된 LOD 계산 방식(`'distance'` 또는 `'screenSize'`)을 반환합니다.
     * [EN] Returns the current LOD calculation metric (`'distance'` or `'screenSize'`).
     */
    get lodMetric(): 'distance' | 'screenSize' {
        return this.#lodMetric;
    }

    /**
     * @example
     * ```ts
     * // 화면 투영 크기 기반 LOD 선택 모드로 전환
     * landscape.lodMetric = 'screenSize';
     * ```
     *
     * [KO]
     * LOD 계산 메트릭 방식을 설정합니다.
     * - `'distance'`: 카메라와 타일 간의 유클리드 거리를 기준으로 LOD를 결정합니다.
     * - `'screenSize'`: 카메라 FOV 및 화면 투영 크기(픽셀 오차)를 기준으로 LOD를 동적으로 결정합니다.
     *
     * [EN]
     * Sets the LOD metric calculation method.
     * - `'distance'`: Determines LOD based on Euclidean distance between the camera and tile.
     * - `'screenSize'`: Dynamically determines LOD based on camera FOV and screen-projected size (pixel error).
     *
     * @defaultValue 'distance'
     */
    set lodMetric(value: 'distance' | 'screenSize') {
        if (this.#lodMetric !== value) {
            this.#lodMetric = value;
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * [KO] 지형의 최대 LOD 단계 수(1~8)를 반환합니다.
     * [EN] Returns the maximum number of LOD levels (1 to 8) for the landscape.
     */
    get lodMaxLevel(): number {
        return this.#lodMaxLevel;
    }

    /**
     * [KO] 지형의 최대 LOD 단계 수를 설정합니다.
     * [EN] Sets the maximum number of LOD levels for the landscape.
     *
     * @param value -
     * [KO] 최대 LOD 단계 수 (1 ~ 8)
     * [EN] Maximum LOD levels (1 to 8)
     */
    set lodMaxLevel(value: number) {
        const count = Math.min(8, Math.max(1, Math.round(value)));
        if (this.#lodMaxLevel !== count) {
            this.#lodMaxLevel = count;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.redGPUContext,
                this.#spatialGrid.tileSizeX,
                this.#spatialGrid.tileSizeZ,
                this.#componentSizeQuads,
                count,
                this.#lod0SizeQuads
            );
            this.#rebuildLODStructures();
            this.#rebuildTiles();
        }
    }

    /**
     * @example
     * ```ts
     * console.log(landscape.lodDistancesSq);
     * ```
     *
     * [KO]
     * LOD 레벨 전환 기준 거리의 제곱값 배열을 가져옵니다. (읽기 전용)
     *
     * [EN]
     * Gets the array of squared distance thresholds used for LOD level transitions. (Read-only)
     *
     */
    get lodDistancesSq(): number[] {
        return this.#lodDistancesSq;
    }


    // =========================================================================
    // Properties: Material & Splat Layers
    // =========================================================================
    /**
     * [KO] 지형의 기본 베이스 틴트 색상(`ColorRGBA`)을 반환합니다.
     * [EN] Returns the base tint color (`ColorRGBA`) of the landscape.
     */
    get baseColor(): ColorRGBA {
        return this.#material.baseColor;
    }

    /**
     * [KO] 지형에 등록된 텍스처 블렌딩 레이어 목록을 읽기 전용 배열로 반환합니다.
     * [EN] Returns a read-only array of texture blending layers registered on the landscape.
     */
    get layers(): LandscapeLayer[] {
        return this.#material.layers;
    }

    /**
     * [KO] 지형 스플랫 가중치 맵을 CPU 측에서 이중선형 보간으로 샘플링하는 CPU 전용 가중치 샘플러를 반환합니다.
     * [EN] Returns the CPU-side weight sampler that samples terrain splat weight maps via bilinear interpolation.
     */
    get weightMapCPUSampler(): LandscapeWeightMapCPUSampler {
        return this.#weightMapCPUSampler;
    }


    /**
     * [KO] 카메라 근접 텍스처 디테일이 최대로 유지되는 시작 거리(월드 단위)를 반환합니다.
     * [EN] Returns the near-distance threshold (world units) where close-up texture detail remains fully visible.
     */
    get nearDetailDistance(): number {
        return this.#material.nearDetailDistance;
    }

    /**
     * [KO] 카메라 근접 텍스처 디테일 시작 거리를 설정합니다.
     * [EN] Sets the near-distance threshold for close-up texture detail.
     *
     * @param val -
     * [KO] 근접 디테일 유지 거리
     * [EN] Near detail distance
     */
    set nearDetailDistance(val: number) {
        this.#material.nearDetailDistance = val;
    }

    /**
     * [KO] 근접 디테일에서 원거리 텍스처로 페이드 전환되는 구간 길이를 반환합니다.
     * [EN] Returns the fade transition range from near detail to distant textures.
     */
    get nearDetailFade(): number {
        return this.#material.nearDetailFade;
    }

    /**
     * [KO] 근접 디테일 페이드 전환 구간 길이를 설정합니다.
     * [EN] Sets the fade transition range from near detail to distant textures.
     *
     * @param val -
     * [KO] 페이드 전환 거리
     * [EN] Near detail fade range
     */
    set nearDetailFade(val: number) {
        this.#material.nearDetailFade = val;
    }


    // =========================================================================
    // Properties: Streaming & Virtual Textures
    // =========================================================================
    /**
     * [KO] 비동기로 로드할 전체 지형 16비트 높이맵 이미지의 URL을 반환합니다.
     * [EN] Returns the URL of the global 16-bit heightmap image to load asynchronously.
     */
    get globalHeightmapUrl(): string {
        return this.#tileStreamer?.globalHeightmapUrl ?? '';
    }

    /**
     * [KO] 전체 지형 16비트 높이맵 이미지 URL을 설정하고 비동기 다운로드 및 가상 텍스처 베이킹을 시작합니다.
     * [EN] Sets the global 16-bit heightmap image URL and triggers asynchronous download and VT baking.
     *
     * @param val -
     * [KO] 높이맵 이미지 파일 URL
     * [EN] Heightmap image file URL
     */
    set globalHeightmapUrl(val: string) {
        if (this.#tileStreamer) {
            this.#tileStreamer.globalHeightmapUrl = val;
        }
    }


    /**
     * @example
     * ```ts
     * // 타일 스트리밍 로딩 반경을 3000으로 확장
     * landscape.tileLoadingRadius = 3000.0;
     * ```
     *
     * [KO]
     * 카메라 주변에서 가상 지형 타일을 능동적으로 메모리에 스트리밍할 로딩 반경(월드 단위)을 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets the streaming loading radius (in world units) around the camera within which terrain tiles are actively loaded into memory.
     *
     * @defaultValue 2000.0
     */
    get tileLoadingRadius(): number {
        return this.#tileStreamer.tileLoadingRadius;
    }

    set tileLoadingRadius(value: number) {
        this.#tileStreamer.tileLoadingRadius = value;
    }

    /**
     * @example
     * ```ts
     * // 프레임당 최대 4개 타일 비동기 로드
     * landscape.tileMaxLoadsPerFrame = 4;
     * ```
     *
     * [KO]
     * 단일 프레임당 비동기로 로드 및 업로드할 수 있는 최대 타일 텍스처 수를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets the maximum number of tile textures that can be asynchronously loaded and uploaded per frame.
     *
     * @defaultValue 2
     */
    get tileMaxLoadsPerFrame(): number {
        return this.#tileStreamer.tileMaxLoadsPerFrame;
    }

    set tileMaxLoadsPerFrame(value: number) {
        this.#tileStreamer.tileMaxLoadsPerFrame = value;
    }

    /**
     * @example
     * ```ts
     * console.log(`현재 로드된 타일: ${landscape.tileLoadedCount}`);
     * ```
     *
     * [KO]
     * 가상 텍스처 아틀라스에 현재 로드되어 메모리에 유지되고 있는 타일의 총 개수를 가져옵니다. (읽기 전용)
     *
     * [EN]
     * Gets the total number of tiles currently loaded and active in the virtual texture atlas. (Read-only)
     *
     */
    get tileLoadedCount(): number {
        return this.#tileStreamer?.tileLoadedCount ?? 0;
    }

    /**
     * @example
     * ```ts
     * landscape.tileUrlResolver = (row, col) => ({
     *     heightUrl: `/assets/terrain/tiles/tile_${row}_${col}_height.png`,
     *     normalUrl: `/assets/terrain/tiles/tile_${row}_${col}_normal.png`
     * });
     * ```
     *
     * [KO]
     * 타일 그리드의 행/열 좌표 `(row, col)`를 기반으로 해당 타일의 높이맵 및 관련 텍스처 URL을 반환하는 해석 함수를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets the resolver callback function that returns texture URLs for a tile given its grid coordinates `(row, col)`.
     *
     */
    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileStreamer.tileUrlResolver;
    }

    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileStreamer.tileUrlResolver = resolver;
    }


    // =========================================================================
    // Properties: Shadow & Lighting
    // =========================================================================
    /**
     * @example
     * ```ts
     * // 외부 광원 그림자 수신 비활성화
     * landscape.receiveShadow = false;
     * console.log(landscape.receiveShadow); // false
     * ```
     *
     * [KO]
     * 지형 표면이 Directional Light 등 외부 섀도우 맵으로부터 그림자를 수신할지 여부를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets whether the terrain surface receives shadows from external shadow maps (e.g. Directional Light).
     *
     * @defaultValue true
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set receiveShadow(value: boolean) {
        if (this.#receiveShadow !== value) {
            this.#receiveShadow = value;
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * // 높이맵 레이마칭 자체 그림자 활성화
     * landscape.castHeightmapShadow = true;
     * landscape.heightmapShadowSteps = 32;
     * ```
     *
     * [KO]
     * 주 광원(Sun Direction) 방향으로 가상 높이맵 텍스처(VHT)를 레이마칭하여 지형 자체의 산맥이나 굴곡으로 인한 그림자(Self-Shadowing)를 계산할지 여부를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets whether to calculate terrain self-shadowing by raymarching the Virtual Heightmap Texture (VHT) towards the primary light direction.
     *
     * @defaultValue false
     */
    get castHeightmapShadow(): boolean {
        return this.#castHeightmapShadow;
    }

    set castHeightmapShadow(value: boolean) {
        if (this.#castHeightmapShadow !== value) {
            this.#castHeightmapShadow = value;
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * // 자체 그림자 최대 탐색 거리를 500으로 설정
     * landscape.heightmapShadowDistance = 500.0;
     * ```
     *
     * [KO]
     * 높이맵 자체 그림자 계산 시 광선(Ray)이 지형 표면을 추적하는 최대 거리(월드 단위)를 설정하거나 가져옵니다. 최소값은 10.0입니다.
     *
     * [EN]
     * Gets or sets the maximum raymarching trace distance (in world units) for heightmap self-shadow calculations. Minimum value is 10.0.
     *
     * @defaultValue 3000.0
     */
    get heightmapShadowDistance(): number {
        return this.#heightmapShadowDistance;
    }

    set heightmapShadowDistance(value: number) {
        if (this.#heightmapShadowDistance !== value) {
            this.#heightmapShadowDistance = Math.max(10.0, value);
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * // 레이마칭 품질 향상을 위해 스텝 수 증가
     * landscape.heightmapShadowSteps = 32;
     * ```
     *
     * [KO]
     * 높이맵 자체 그림자 레이마칭의 샘플링 스텝 수를 설정하거나 가져옵니다. 4에서 64 사이의 정수로 클램프됩니다.
     *
     * [EN]
     * Gets or sets the number of sampling steps for heightmap self-shadow raymarching. Clamped between 4 and 64.
     *
     * @defaultValue 16
     */
    get heightmapShadowSteps(): number {
        return this.#heightmapShadowSteps;
    }

    set heightmapShadowSteps(value: number) {
        if (this.#heightmapShadowSteps !== value) {
            this.#heightmapShadowSteps = Math.max(4, Math.min(64, Math.round(value)));
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * // 부드러운 반그림자 표현
     * landscape.heightmapShadowSoftness = 2.0;
     * ```
     *
     * [KO]
     * 높이맵 자체 그림자의 반그림자(Penumbra) 소프트니스 계수를 설정하거나 가져옵니다. 최소값은 0.1입니다.
     *
     * [EN]
     * Gets or sets the penumbra softness factor for heightmap self-shadows. Minimum value is 0.1.
     *
     * @defaultValue 8.0
     */
    get heightmapShadowSoftness(): number {
        return this.#heightmapShadowSoftness;
    }

    set heightmapShadowSoftness(value: number) {
        if (this.#heightmapShadowSoftness !== value) {
            this.#heightmapShadowSoftness = Math.max(0.1, value);
            this.#updateLandscapeUniforms();
        }
    }


    // =========================================================================
    // Public Feature APIs (Terrain Query & Layer Management)
    // =========================================================================
    /**
     * [KO] 월드 좌표 `(x, z)` 위치에서의 보간된 지형 표면 높이(Y값)를 반환합니다.
     * [EN] Returns the interpolated terrain surface height (Y coordinate) at the specified world `(x, z)` position.
     *
     * ### Example
     * ```typescript
     * const groundY = landscape.getHeightAt(100, 250);
     * character.y = groundY;
     * ```
     *
     * @param x -
     * [KO] 월드 X 좌표
     * [EN] World X coordinate
     * @param z -
     * [KO] 월드 Z 좌표
     * [EN] World Z coordinate
     * @returns
     * [KO] 보간된 지형 높이값 (Y)
     * [EN] Interpolated terrain height value (Y)
     */
    getHeightAt(x: number, z: number): number {
        return this.#tileStreamer.getHeightAt(x, z);
    }

    /**
     * @example
     * ```ts
     * if (landscape.isTileLoaded(0, 0)) {
     *     console.log('타일 (0, 0) 로드 완료');
     * }
     * ```
     *
     * [KO]
     * 특정 행(row)과 열(col) 좌표의 지형 타일이 가상 텍스처 아틀라스에 완전히 로드되어 렌더링 가능한 상태인지 확인합니다.
     *
     * [EN]
     * Checks whether the terrain tile at the specified row and column coordinates is fully loaded and ready for rendering in the virtual texture atlas.
     *
     * @param row - 타일 그리드 행 인덱스 / Tile grid row index.
     * @param col - 타일 그리드 열 인덱스 / Tile grid column index.
     * @returns 로드 완료 여부 / Whether the tile is loaded.
     */
    isTileLoaded(row: number, col: number): boolean {
        return this.#tileStreamer?.isTileLoaded(row, col) ?? false;
    }


    /**
     * [KO] 새로운 텍스처 블렌딩 레이어(`LandscapeLayer`)를 생성하여 지형에 추가합니다.
     * [EN] Creates and adds a new texture blending layer (`LandscapeLayer`) to the landscape.
     *
     * ### Example
     * ```typescript
     * const grassLayer = landscape.addLayer({
     *     diffuseTexture: grassTexture,
     *     normalTexture: grassNormalTexture,
     *     uvScale: [40, 40]
     * });
     * ```
     *
     * @param options -
     * [KO] 지형 레이어 생성 옵션
     * [EN] Terrain layer creation options
     * @returns
     * [KO] 생성된 LandscapeLayer 인스턴스
     * [EN] The created LandscapeLayer instance
     */
    addLayer(options: LandscapeLayerOptions): LandscapeLayer {
        const layer = new LandscapeLayer(this.redGPUContext, options);
        layer.weightMapCPUSampler = this.#weightMapCPUSampler;
        const weightSrc = layer.weightTexture?.src || (options as any)?.weightTexture?.src;
        if (weightSrc) {
            this.#weightMapCPUSampler.load(weightSrc);
        }
        this.#material.addLayer(layer);
        return layer;
    }

    /**
     * [KO] 지정된 레이어 인스턴스 또는 레이어 UUID를 전달받아 지형에서 제거합니다.
     * [EN] Removes the specified layer instance or layer by UUID from the landscape.
     *
     * @param layer -
     * [KO] 제거할 LandscapeLayer 인스턴스 또는 UUID 문자열
     * [EN] LandscapeLayer instance or UUID string to remove
     * @returns
     * [KO] 제거 성공 여부
     * [EN] Whether removal succeeded
     */
    removeLayer(layer: LandscapeLayer | string): boolean {
        if (!layer) return false;
        return this.#material.removeLayer(layer);
    }

    /**
     * [KO] 지형에 등록된 모든 텍스처 레이어를 제거합니다.
     * [EN] Clears all texture layers registered on the landscape.
     */
    clearLayers(): void {
        this.#material.clearLayers();
    }

    /**
     * [KO] 등록된 텍스처 블렌딩 레이어를 이름(`name`)으로 조회합니다.
     * [EN] Retrieves a registered texture blending layer by name.
     *
     * ### Example
     * ```typescript
     * const grassLayer = landscape.getLayer('Grass');
     * if (grassLayer) {
     *     grassLayer.roughness = 0.8;
     * }
     * ```
     *
     * @param name -
     * [KO] 조회할 레이어의 고유 이름
     * [EN] Unique name of the layer to retrieve
     * @returns
     * [KO] 일치하는 {@link LandscapeLayer} 인스턴스 (미등록 시 `undefined`)
     * [EN] Matching {@link LandscapeLayer} instance (`undefined` if not registered)
     */
    getLayer(name: string): LandscapeLayer | undefined {
        if (!name) return undefined;
        return this.#material.getLayer(name);
    }


    // =========================================================================
    // Core Lifecycle & Rendering
    // =========================================================================
    /**
     * @example
     * ```ts
     * // 렌더 루프에서 매 프레임 호출
     * landscape.update(renderViewStateData);
     * ```
     *
     * [KO]
     * 매 프레임 카메라 위치 및 뷰 프러스텀, HZB(Hierarchical Z-Buffer)를 기반으로 지형 서브시스템을 갱신합니다.
     * 타일 스트리밍, GPU 인스턴스 인다이렉트 드로우 버퍼 리셋, GPU 컬링 컴퓨트 패스 등록, 디버거 갱신을 일괄 수행합니다.
     *
     * [EN]
     * Updates terrain subsystems every frame based on the camera position, view frustum, and HZB (Hierarchical Z-Buffer).
     * Performs tile streaming updates, GPU instance indirect draw buffer resets, GPU culling compute pass dispatch registration, and debugger updates.
     *
     * @param renderViewStateData - 현재 뷰 상태 및 렌더 데이터 / Current view state and rendering data.
     */
    update(renderViewStateData: RenderViewStateData): void {
        if (!renderViewStateData) return;

        const currentView = renderViewStateData.view;
        const rawCamera = currentView.rawCamera as PerspectiveCamera;
        if (!rawCamera) return;

        if (this.#material) {
            this.#material.updateUniformsData();
        }

        const camX = rawCamera.x;
        const camY = rawCamera.y;
        const camZ = rawCamera.z;

        const projMatrix = currentView.projectionMatrix;
        const viewMatrix = rawCamera.viewMatrix;

        let frustumPlanes: number[][] | null = renderViewStateData.frustumPlanes ?? null;
        if (!frustumPlanes && projMatrix && viewMatrix) {
            frustumPlanes = computeViewFrustumPlanes(projMatrix, viewMatrix);
        }

        this.#tileStreamer.update(camX, camZ, camY);

        const totalComponents = this.#spatialGrid.tileCountX * this.#spatialGrid.tileCountZ;

        this.#instanceBuffer.resetIndirectDrawBuffer(this.#sharedGeometry, this.#lodMaxLevel, !!this.#debuggerManager?.landscapeWireframe);

        const fovDeg = rawCamera.fieldOfView ?? (rawCamera as any).fov ?? 60.0;
        const tanHalfFOV = Math.tan(((fovDeg * Math.PI) / 180.0) * 0.5);
        if (Math.abs(this.#lastTanHalfFOV - tanHalfFOV) > 1e-4) {
            this.#lastTanHalfFOV = tanHalfFOV;
            this.#updateLandscapeUniforms();
        }
        const lodMetricVal = this.#lodMetric === 'screenSize' ? 1.0 : 0.0;

        const hzb = currentView.hierarchicalZBuffer;
        const effectiveHZBTextureView = hzb?.textureView || null;
        const effectiveHZBSampler = hzb?.sampler || null;

        if (this.#lastHZBView !== effectiveHZBTextureView) {
            this.#lastHZBView = effectiveHZBTextureView;
            this.#lastHZBSampler = effectiveHZBSampler;
            if (this.#instanceBuffer?.allInputTilesBuffer && this.#instanceBuffer?.visibleTileIndicesBuffer && this.#instanceBuffer?.indirectDrawBuffer) {
                this.#gpuCuller?.updateBindGroup(
                    this.#instanceBuffer.allInputTilesBuffer,
                    this.#instanceBuffer.visibleTileIndicesBuffer,
                    this.#instanceBuffer.indirectDrawBuffer,
                    effectiveHZBTextureView,
                    effectiveHZBSampler
                );
            }
        }

        let mainPVMatrix: Float32Array | null = null;
        if (projMatrix && viewMatrix) {
            mainPVMatrix = tempPVMatrix;
            mat4.multiply(mainPVMatrix, projMatrix, viewMatrix);
        }

        this.#gpuCuller?.updateUniforms(
            camX, camY, camZ,
            this.#lodMaxLevel,
            this.#spatialGrid.worldSizeX, this.#spatialGrid.worldSizeZ,
            this.#spatialGrid.tileSizeX, this.#spatialGrid.tileSizeZ,
            this.#heightScale,
            totalComponents,
            frustumPlanes,
            this.#lodDistancesBuffer,
            tanHalfFOV,
            lodMetricVal,
            !!effectiveHZBTextureView,
            mainPVMatrix
        );

        this.commandEncoderManager.addPreProcessComputePass(
            'Landscape_GPUCulling_ComputePass',
            this.#onPreProcessComputePass
        );

        this.#debuggerManager.update(rawCamera);
    }

    /**
     * @example
     * ```ts
     * // 렌더 패스 인코더를 전달하여 지형 드로우 콜 기록
     * landscape.render(view, renderPassEncoder);
     * ```
     *
     * [KO]
     * 지형의 인다이렉트 드로우(Indirect Draw) 파이프라인을 실행하여 현재 렌더 패스에 지형 렌더링 커맨드를 기록합니다.
     * GPU 인스턴스 버퍼와 결합 인덱스/버텍스 버퍼, 바인드 그룹(시스템 유니폼, 인스턴스 스토리지, 머티리얼)을 바인딩하고
     * LOD별 인다이렉트 드로우 콜을 순차적으로 발행합니다.
     *
     * [EN]
     * Executes the indirect draw pipeline of the landscape to record terrain rendering commands into the active render pass.
     * Binds the GPU instance buffer, combined vertex/index buffers, and bind groups (system uniform, instance storage, material),
     * and sequentially issues indirect draw calls for each LOD level.
     *
     * @param view - {@link RedGPU.Display.View3D} 또는 렌더 뷰 상태 객체 / {@link RedGPU.Display.View3D} or render view state data.
     * @param passEncoder - 대상 WebGPU 렌더 패스 인코더 (생략 시 view에서 추출) / Optional target WebGPU render pass encoder.
     */
    render(view: any, passEncoder?: GPURenderPassEncoder): void {
        const renderPassEncoder = passEncoder || view?.currentRenderPassEncoder || view?.renderPassEncoder;
        const view3D = view?.view || view;
        if (!renderPassEncoder) return;

        const material = this.#material;
        const renderResults = (view as RenderViewStateData)?.renderResults || (view3D as any)?.renderViewStateData?.renderResults;

        if (material) {
            if (material.dirtyPipeline) {
                material._updateFragmentState();
                material.dirtyPipeline = false;
                this.#clearPipelineCaches();
                if (renderResults) {
                    renderResults.numDirtyPipelines++;
                }
            }
        }

        const instanceBuffer = this.#instanceBuffer;
        const sharedGeometry = this.#sharedGeometry;
        const combinedVB = sharedGeometry?.combinedVertexBuffer;
        const isWireframe = !!this.#debuggerManager?.landscapeWireframe;
        const combinedIB = isWireframe ? sharedGeometry?.combinedWireframeIndexBuffer : sharedGeometry?.combinedIndexBuffer;

        if (!instanceBuffer || !combinedVB || !combinedIB) return;

        const storageBG = instanceBuffer.instanceStorageBindGroup;
        const storageBGLayout = instanceBuffer.instanceStorageBindGroupLayout;
        if (!storageBG || !storageBGLayout) return;

        const pipeline = this.#getOrCreateRenderPipeline(combinedVB, storageBGLayout);
        if (!pipeline) return;

        renderPassEncoder.setPipeline(pipeline);

        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup;
        if (systemBG) {
            renderPassEncoder.setBindGroup(0, systemBG);
        }

        renderPassEncoder.setBindGroup(1, storageBG);

        const matUniformBG = this.#material?.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG) {
            renderPassEncoder.setBindGroup(2, matUniformBG);
        }
        renderPassEncoder.setVertexBuffer(0, combinedVB.gpuBuffer);
        renderPassEncoder.setIndexBuffer(combinedIB.gpuBuffer, 'uint32');

        const lodMaxLevel = sharedGeometry.lodMaxLevel;
        const indirectDrawBuffer = instanceBuffer.indirectDrawBuffer;

        if (indirectDrawBuffer) {
            for (let lod = 0; lod < lodMaxLevel; lod++) {
                const offset = lod * 20;
                renderPassEncoder.drawIndexedIndirect(indirectDrawBuffer, offset);

                if (renderResults) {
                    renderResults.numDrawCalls++;
                }
            }
        }
    }

    /**
     * @example
     * ```ts
     * landscape.destroy();
     * ```
     *
     * [KO]
     * 지형 인스턴스와 관련된 모든 GPU 리소스(텍스처 아틀라스, 인스턴스 버퍼, 지오메트리, 파이프라인 캐시) 및 서브시스템 매니저를 해제하고 파기합니다.
     *
     * [EN]
     * Releases and destroys all GPU resources (texture atlases, instance buffer, geometry, pipeline caches) and subsystem managers associated with this landscape instance.
     *
     */
    destroy(): void {
        this.#debuggerManager?.destroy();
        this.#weightMapCPUSampler?.destroy();
        this.#foliageManager?.destroy?.();
        this.#grassManager?.destroy?.();
        this.#sharedGeometry?.destroy();
        this.#gpuCuller?.destroy();
        this.#tileStreamer?.destroy();

        if (this.#instanceBuffer) {
            this.#instanceBuffer.destroy();
        }
        this.#clearPipelineCaches();
    }


    // =========================================================================
    // Private Implementation Details
    // =========================================================================
    #initSystems(
        redGPUContext: RedGPUContext,
        componentCountX: number,
        componentCountZ: number,
        lodMaxLevel: number
    ) {
        this.#tileStreamer.setTerrainConfig(this.#heightScale);

        const resourceManager = redGPUContext.resourceManager;
        let vModule = resourceManager.getGPUShaderModule('Landscape_Flat_VertexShaderModule');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('Landscape_Flat_VertexShaderModule', {
                code: landscapeVertexSource
            });
        }
        this.#vertexShaderModule = vModule;

        this.#instanceBuffer = new LandscapeInstanceBuffer(redGPUContext, componentCountX * componentCountZ, lodMaxLevel);
        const tileStreamer = this.#tileStreamer;
        if (tileStreamer?.vhtAtlasTexture && tileStreamer?.vntAtlasTexture) {
            this.#instanceBuffer.updateBindGroup(
                tileStreamer.vhtAtlasTexture.gpuTextureView,
                tileStreamer.vntAtlasTexture.gpuTextureView,
                tileStreamer.vbtBaseColorAtlas?.gpuTextureView,
                tileStreamer.vbtNormalAtlas?.gpuTextureView,
                tileStreamer.vbtORMAtlas?.gpuTextureView
            );
        }

        this.#rebuildLODStructures();
        this.#rebuildTiles();
    }

    #rebuildTiles(): void {
        const componentCountX = this.#spatialGrid.tileCountX;
        const componentCountZ = this.#spatialGrid.tileCountZ;
        const tileSizeX = this.#spatialGrid.tileSizeX;
        const tileSizeZ = this.#spatialGrid.tileSizeZ;
        const targetCount = componentCountX * componentCountZ;

        if (this.#tileStreamer) {
            this.#tileStreamer.resetTileState();
        }
        this.#sharedGeometry.updateTileSize(tileSizeX, tileSizeZ);
        this.#updateLODDistances();
        this.#clearPipelineCaches();

        let needRebuildBindGroup = false;
        if (this.#tileStreamer) {
            const changed = this.#tileStreamer.ensureAtlasSize(componentCountX, componentCountZ);
            if (changed) {
                this.#tileStreamer.setTerrainConfig(this.#heightScale);
                this.#tileStreamer.resetTileState();
                needRebuildBindGroup = true;
            }
        }

        if (!this.#instanceBuffer || this.#instanceBuffer.maxComponentCount !== targetCount || this.#instanceBuffer.lodMaxLevel !== this.#lodMaxLevel) {
            if (this.#instanceBuffer) {
                this.#instanceBuffer.destroy();
            }
            this.#instanceBuffer = new LandscapeInstanceBuffer(this.redGPUContext, targetCount, this.#lodMaxLevel);
            needRebuildBindGroup = true;
        }

        if (needRebuildBindGroup && this.#tileStreamer?.vhtAtlasTexture && this.#tileStreamer?.vntAtlasTexture) {
            this.#instanceBuffer.updateBindGroup(
                this.#tileStreamer.vhtAtlasTexture.gpuTextureView,
                this.#tileStreamer.vntAtlasTexture.gpuTextureView,
                this.#tileStreamer.vbtBaseColorAtlas?.gpuTextureView,
                this.#tileStreamer.vbtNormalAtlas?.gpuTextureView,
                this.#tileStreamer.vbtORMAtlas?.gpuTextureView
            );
            if (this.#tileStreamer?.globalHeightTexture) {
                this.#bakeGlobalBaseToVHT();
            }
        }

        this.#gpuCuller = new LandscapeGPUCuller(this.redGPUContext);

        this.#spatialGrid.rebuildTiles((comp, index) => {
            this.#instanceBuffer.setStaticTileData(
                index,
                comp.worldX,
                comp.worldZ,
                0, 0, 0, 0.0
            );
        });

        this.#instanceBuffer.uploadStaticTilesToGPU();
        this.#updateLandscapeUniforms();

        if (this.#instanceBuffer.allInputTilesBuffer && this.#instanceBuffer.visibleTileIndicesBuffer && this.#instanceBuffer.indirectDrawBuffer) {
            this.#gpuCuller.updateBindGroup(
                this.#instanceBuffer.allInputTilesBuffer,
                this.#instanceBuffer.visibleTileIndicesBuffer,
                this.#instanceBuffer.indirectDrawBuffer,
                this.#lastHZBView,
                this.#lastHZBSampler
            );
        }

        this.#material?.requestVBTRebake(true);
    }

    #rebuildLODStructures(): void {
        this.#lodColorsRGBA.length = 0;
        this.#lodMultipliers.length = 0;

        for (let i = 0; i < this.#lodMaxLevel; i++) {
            this.#lodColorsRGBA.push(LANDSCAPE_DEFAULT_LOD_COLORS[i % LANDSCAPE_DEFAULT_LOD_COLORS.length] as [number, number, number, number]);
        }

        const multipliers = DEFAULT_LOD_MULTIPLIERS;
        for (let i = 0; i < this.#lodMaxLevel - 1; i++) {
            this.#lodMultipliers.push(multipliers[i] ?? (1.0 * Math.pow(1.8, i)));
        }

        this.#updateLODDistances();
        this.#updateLandscapeUniforms();
    }

    #updateLODDistances(): void {
        this.#lodDistancesSq.length = 0;
        const tileSizeMax = Math.max(this.#spatialGrid.tileSizeX, this.#spatialGrid.tileSizeZ);
        const count = this.#lodMultipliers.length;

        for (let i = 0; i < count; i++) {
            const dist = tileSizeMax * this.#lodMultipliers[i];
            this.#lodDistancesSq.push(dist * dist);
        }

        const lodDistancesArray = this.#lodDistancesBuffer;
        lodDistancesArray.fill(1e15);
        const countDist = Math.min(8, this.#lodDistancesSq.length);
        for (let i = 0; i < countDist; i++) {
            const val = this.#lodDistancesSq[i];
            if (val && val > 0) {
                lodDistancesArray[i] = val;
            }
        }
    }

    #updateLandscapeUniforms(): void {
        const {
            tileCountX: countX,
            tileCountZ: countZ,
            worldSizeX,
            worldSizeZ,
            tileSizeX,
            tileSizeZ
        } = this.#spatialGrid;
        const vhtW = this.#tileStreamer?.vhtAtlasTexture?.gpuTexture?.width || (countX * 512);
        const vhtH = this.#tileStreamer?.vhtAtlasTexture?.gpuTexture?.height || (countZ * 512);
        const lodMetricVal = this.#lodMetric === 'screenSize' ? 1.0 : 0.0;
        this.#instanceBuffer?.updateUniforms(
            this.#heightScale,
            worldSizeX,
            worldSizeZ,
            this.#debuggerManager?.landscapeLodColoration ?? false,
            countX * countZ,
            tileSizeX,
            tileSizeZ,
            this.#componentSizeQuads,
            vhtW,
            vhtH,
            this.#lodColorsRGBA,
            this.#lodDistancesSq,
            this.#lastTanHalfFOV,
            lodMetricVal,
            this.#lod0SizeQuads,
            this.#receiveShadow,
            this.#castHeightmapShadow,
            this.#heightmapShadowSteps,
            this.#heightmapShadowDistance,
            this.#heightmapShadowSoftness,
            this.#foliageManager?.debugSubCellColoration ?? false,
            this.#foliageManager?.subCellSize ?? 100.0,
            this.#foliageManager?.streamingRadius ?? 600.0,
            this.#debuggerManager?.landscapeDebugMode ?? 0
        );
    }

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        const totalComponents = this.#spatialGrid.tileCountX * this.#spatialGrid.tileCountZ;
        this.#gpuCuller?.dispatchPass(computePass, totalComponents);
    };

    #bakeGlobalBaseToVHT(): void {
        if (!this.#tileStreamer?.globalHeightTexture) return;

        this.#tileStreamer.bakeGlobalBase();
        this.#grassManager?.rebakeAll();
    }

    #clampComponentCount(val: number): number {
        const maxTextureDim = this.gpuDevice?.limits?.maxTextureDimension2D ?? 8192;
        const maxTilesForHardware = Math.floor(maxTextureDim / 512);
        const maxAllowed = Math.min(32, Math.max(1, maxTilesForHardware));
        return Math.min(maxAllowed, Math.max(1, Math.round(val)));
    }

    #getOrCreateRenderPipeline(geom: any, storageBGLayout: GPUBindGroupLayout): GPURenderPipeline | null {
        const gpuDevice = this.gpuDevice;
        const material = this.#material;
        if (!gpuDevice || !material || !material.gpuRenderInfo) return null;

        const {msaaID, useMSAA} = this.antialiasingManager;
        const sampleCount = useMSAA ? 4 : 1;
        const isWireframe = !!this.#debuggerManager?.landscapeWireframe;
        const topology = isWireframe ? GPU_PRIMITIVE_TOPOLOGY.LINE_LIST : GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        const fragModule = material.gpuRenderInfo.fragmentShaderModule;

        if (
            this.#cachedRenderPipeline &&
            this.#lastRenderTopology === topology &&
            this.#lastRenderMaterialUUID === material.uuid &&
            this.#lastRenderVariantModule === fragModule &&
            this.#lastRenderMsaaID === msaaID
        ) {
            return this.#cachedRenderPipeline;
        }

        const variantKey = (fragModule as any)?.label || 'default';
        const key = `${topology}_${material.uuid}_${variantKey}_${msaaID}`;

        if (this.#renderPipelineCache.has(key)) {
            const pipeline = this.#renderPipelineCache.get(key)!;
            this.#cachedRenderPipeline = pipeline;
            this.#lastRenderTopology = topology;
            this.#lastRenderMaterialUUID = material.uuid;
            this.#lastRenderVariantModule = fragModule;
            this.#lastRenderMsaaID = msaaID;
            return pipeline;
        }

        try {
            const resourceManager = this.resourceManager;
            const systemBGLayout = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');
            const fragUniformBGLayout = material.gpuRenderInfo.fragmentBindGroupLayout;

            const pipelineLayout = resourceManager.createGPUPipelineLayout(`Landscape_PipelineLayout_${key}`, {
                bindGroupLayouts: [systemBGLayout, storageBGLayout, fragUniformBGLayout]
            });

            const vertexBuffers: GPUVertexBufferLayout[] = [{
                arrayStride: geom?.interleavedStruct?.arrayStride ?? 20,
                attributes: geom?.interleavedStruct?.attributes ?? [
                    {shaderLocation: 0, offset: 0, format: 'float32x3'},
                    {shaderLocation: 1, offset: 12, format: 'float32x2'}
                ]
            }];

            const pipeline = gpuDevice.createRenderPipeline({
                label: `Landscape_RenderPipeline_${key}`,
                layout: pipelineLayout,
                vertex: {
                    module: this.#vertexShaderModule,
                    entryPoint: 'main',
                    buffers: vertexBuffers,
                },
                fragment: material.gpuRenderInfo.fragmentState,
                primitive: {
                    topology: topology,
                    cullMode: isWireframe ? 'none' : 'back'
                },
                depthStencil: {
                    format: 'depth32float',
                    depthWriteEnabled: true,
                    depthCompare: 'less-equal',
                },
                multisample: {count: sampleCount}
            });

            this.#renderPipelineCache.set(key, pipeline);
            this.#cachedRenderPipeline = pipeline;
            this.#lastRenderTopology = topology;
            this.#lastRenderMaterialUUID = material.uuid;
            this.#lastRenderVariantModule = fragModule;
            this.#lastRenderMsaaID = msaaID;
            return pipeline;
        } catch (e) {
            console.warn('Failed to create Landscape RenderPipeline:', e);
            return null;
        }
    }

    #clearPipelineCaches(): void {
        this.#renderPipelineCache.clear();
        this.#cachedRenderPipeline = null;
        this.#lastRenderTopology = '';
        this.#lastRenderMaterialUUID = '';
        this.#lastRenderVariantModule = null;
        this.#lastRenderMsaaID = '';
    }


}

Object.freeze(Landscape);
export default Landscape;
