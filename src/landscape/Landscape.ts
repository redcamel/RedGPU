import RedGPUContext from "../context/RedGPUContext";
import LandscapeRenderer from "./core/renderer/LandscapeRenderer";
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
import {FOLIAGE_SUB_CELL_SIZE} from "./foliage/FOLIAGE_CONSTANTS";
import GrassManager from "./grass/GrassManager";
import LandscapeGPUCuller from "./core/spatial/LandscapeGPUCuller";
import LandscapeDebuggerManager from "./debugger/LandscapeDebuggerManager";
import LANDSCAPE_DEFAULT_LOD_COLORS from "./LANDSCAPE_DEFAULT_LOD_COLORS";
import {mat4} from 'gl-matrix';
import {COMMAND_ENCODER_TYPE} from "../commandEncoderManager/COMMAND_ENCODER_TYPE";

const DEFAULT_LOD_MULTIPLIERS: number[] = [1.0, 2.0, 3.5, 6.0, 9.5, 14.0, 20.0];
const tempPVMatrix: Float32Array = new Float32Array(16);

/**
 * [KO] 대규모 지형의 타일 스트리밍, GPU 기반 절두체/HZB 오클루전 컬링, 연속적 LOD 모핑, 멀티 레이어 스플래팅, 식생(`FoliageManager`) 및 잔디(`GrassManager`) 생태계를 통합 관리하는 핵심 클래스입니다.
 * [EN] Core class that integrates and manages tile streaming, GPU-driven frustum/HZB occlusion culling, continuous LOD morphing, multi-layer splatting, and vegetation (`FoliageManager`) and grass (`GrassManager`) ecosystems for large-scale terrains.
 *
 * ### Example
 * ```typescript
 * // [KO] 4000x4000 월드 크기의 지형 생성 및 씬에 등록
 * // [EN] Create a terrain with 4000x4000 world size and assign it to the scene
 * const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);
 * landscape.globalHeightmapUrl = './assets/heightmap.png';
 * landscape.heightScale = 600;
 * scene.landscape = landscape;
 * ```
 *
 * @see [Basic Terrain example](/RedGPU/examples/3d/landscape/basicTerrain/)
 * @see [Multi-Layer Splatting example](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
 * @see [Tile Streaming example](/RedGPU/examples/3d/landscape/tileStreaming/)
 * @see [Procedural Grass example](/RedGPU/examples/3d/landscape/proceduralGrass/)
 * @see [Foliage and Impostors example](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
 * @see [Landscape and Water example](/RedGPU/examples/3d/landscape/landscapeAndWater/)
 * @see [Open World Integration example](/RedGPU/examples/3d/landscape/openWorldIntegration/)
 * @category Landscape
 */
class Landscape extends RedGPUObject {

    #spatialGrid: LandscapeSpatialGrid;
    #sharedGeometry: LandscapeSharedGeometry;
    #instanceBuffer: LandscapeInstanceBuffer;
    #tileStreamer: LandscapeTileStreamer;
    #material: LandscapeMaterial;
    #weightMapCPUSampler: LandscapeWeightMapCPUSampler;
    #gpuCuller: LandscapeGPUCuller | null = null;

    #foliageManager: FoliageManager;
    #grassManager: GrassManager;
    #debuggerManager: LandscapeDebuggerManager;

    #heightScale: number = 200.0;
    #componentSizeQuads: number = LANDSCAPE_BASE_GRID_SIZE.QUAD_64;
    #lod0SizeQuads: number = LANDSCAPE_BASE_GRID_SIZE.QUAD_256;

    #lodMetric: 'distance' | 'screenSize' = 'screenSize';
    #lodMaxLevel: number;
    #lodDistancesSq: number[] = [];
    #lodMultipliers: number[] = [];
    #lodColorsRGBA: [number, number, number, number][] = [];
    #lodDistancesBuffer: Float32Array = new Float32Array(8);
    #lastTanHalfFOV: number = 1.0;
    #tileHeightBuffer: Float32Array = new Float32Array(2);

    #receiveShadow: boolean = true;
    #castHeightmapShadow: boolean = false;
    #heightmapShadowSteps: number = 16;
    #heightmapShadowDistance: number = 1000.0;
    #heightmapShadowSoftness: number = 8.0;

    #renderer: LandscapeRenderer;
    #vertexShaderModule: GPUShaderModule;
    #lastHZBView: GPUTextureView | null = null;
    #lastHZBSampler: GPUSampler | null = null;
    #currentRenderViewStateData: RenderViewStateData | null = null;

    /**
     * [KO] `Landscape` 인스턴스를 생성합니다.
     * [EN] Creates a `Landscape` instance.
     *
     * ### Example
     * ```typescript
     * // [KO] 가로/세로 4000 크기의 지형 인스턴스 생성
     * // [EN] Create a Landscape instance with 4000x4000 dimensions
     * const landscape = new RedGPU.Landscape.Landscape(redGPUContext, [4000, 4000]);
     * ```
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param worldSize -
     * [KO] 지형의 전체 월드 크기 (단일 숫자 또는 `[worldSizeX, worldSizeZ]` 튜플, 기본값: `2000`)
     * [EN] Total world size of the terrain (single number or `[worldSizeX, worldSizeZ]` tuple, default: `2000`)
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
        const {QUAD_64: componentSizeQuads, QUAD_256: lod0SizeQuads} = LANDSCAPE_BASE_GRID_SIZE;
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
        this.#heightScale = 200.0;

        this.#tileStreamer.ensureAtlasSize(componentCountX, componentCountZ);
        this.#tileStreamer.setMaterial(material);

        material.setOnRebakeVBTRequested(() => {
            this.#tileStreamer.rebakeAllLoadedVBT();
            this.#grassManager?.rebakeAll();
        });

        this.#initSystems(redGPUContext, componentCountX, componentCountZ, lodMaxLevel);
        this.#foliageManager = new FoliageManager(this, () => {
            this.#updateLandscapeUniforms();
        });
        this.#grassManager = new GrassManager(this);
        this.#tileStreamer.setOnTileLoaded((tileComponent) => {
            this.#onTileHeightBoundsLoaded(tileComponent);
        });
        this.#tileStreamer.setOnGlobalHeightmapBaked(() => {
            this.#syncAllTileHeightBoundsFromGlobalHeightmap();
            this.#grassManager?.rebakeAll();
            this.#foliageManager?.repopulateAll();
        });
        this.#debuggerManager = new LandscapeDebuggerManager(this, this.#tileStreamer, {
            onDebugPropertyChange: (key) => {
                if (key === 'debugMode' || key === 'lodColoration') {
                    this.#updateLandscapeUniforms();
                }
            }
        });
        this.#renderer = new LandscapeRenderer(this);
        this.#updateLandscapeUniforms();
    }

    /**
     * [KO] 지형 타일들이 공유하는 LOD 격자 지오메트리(`LandscapeSharedGeometry`)를 반환합니다.
     * [EN] Returns the shared LOD grid geometry (`LandscapeSharedGeometry`) used by terrain tiles.
     *
     * @returns
     * [KO] `LandscapeSharedGeometry` 인스턴스
     * [EN] `LandscapeSharedGeometry` instance
     */
    get sharedGeometry(): LandscapeSharedGeometry {
        return this.#sharedGeometry;
    }

    /**
     * [KO] 타일 인스턴스 및 간접 드로우 GPU 버퍼를 관리하는 `LandscapeInstanceBuffer`를 반환합니다.
     * [EN] Returns the `LandscapeInstanceBuffer` managing tile instance and indirect draw GPU buffers.
     *
     * @returns
     * [KO] `LandscapeInstanceBuffer` 인스턴스
     * [EN] `LandscapeInstanceBuffer` instance
     */
    get instanceBuffer(): LandscapeInstanceBuffer {
        return this.#instanceBuffer;
    }

    /**
     * [KO] 지형 렌더링에 사용되는 정점 셰이더 모듈(`GPUShaderModule`)을 반환합니다.
     * [EN] Returns the vertex shader module (`GPUShaderModule`) used for terrain rendering.
     *
     * @returns
     * [KO] `GPUShaderModule` 인스턴스
     * [EN] `GPUShaderModule` instance
     */
    get vertexShaderModule(): GPUShaderModule {
        return this.#vertexShaderModule;
    }

    /**
     * [KO] 지형 디버그 시각화 및 오버레이를 제어하는 `LandscapeDebuggerManager`를 반환합니다.
     * [EN] Returns the `LandscapeDebuggerManager` that controls terrain debug visualization and overlays.
     *
     * @returns
     * [KO] `LandscapeDebuggerManager` 인스턴스
     * [EN] `LandscapeDebuggerManager` instance
     */
    get debuggerManager(): LandscapeDebuggerManager {
        return this.#debuggerManager;
    }

    /**
     * [KO] 지형 위 식생(3D 메시) 산포를 관리하는 `FoliageManager`를 반환합니다.
     * [EN] Returns the `FoliageManager` that manages vegetation (3D mesh) scattering on the terrain.
     *
     * @returns
     * [KO] `FoliageManager` 인스턴스
     * [EN] `FoliageManager` instance
     */
    get foliageManager(): FoliageManager {
        return this.#foliageManager;
    }

    /**
     * [KO] 지형 위 절차적 잔디 및 초목 클럼프를 관리하는 `GrassManager`를 반환합니다.
     * [EN] Returns the `GrassManager` that manages procedural grass and vegetation clumps on the terrain.
     *
     * @returns
     * [KO] `GrassManager` 인스턴스
     * [EN] `GrassManager` instance
     */
    get grassManager(): GrassManager {
        return this.#grassManager;
    }

    /**
     * [KO] 지형의 표면 레이어와 텍스처 블렌딩을 담당하는 `LandscapeMaterial`을 반환합니다.
     * [EN] Returns the `LandscapeMaterial` responsible for terrain surface layers and texture blending.
     *
     * @returns
     * [KO] `LandscapeMaterial` 인스턴스
     * [EN] `LandscapeMaterial` instance
     */
    get material(): LandscapeMaterial {
        return this.#material;
    }

    /**
     * [KO] 지형의 전체 월드 크기 `[worldSizeX, worldSizeZ]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the total world size `[worldSizeX, worldSizeZ]` of the terrain.
     *
     * @returns
     * [KO] 월드 크기 튜플 `[number, number]`
     * [EN] World size tuple `[number, number]`
     */
    get worldSize(): [number, number] {
        return this.#spatialGrid.worldSize;
    }

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
     * [KO] 지형의 X축 방향 전체 월드 크기를 반환합니다.
     * [EN] Returns the total world size of the terrain along the X-axis.
     *
     * @returns
     * [KO] X축 월드 크기
     * [EN] World size along the X-axis
     */
    get worldSizeX(): number {
        return this.#spatialGrid.worldSizeX;
    }

    /**
     * [KO] 지형의 Z축 방향 전체 월드 크기를 반환합니다.
     * [EN] Returns the total world size of the terrain along the Z-axis.
     *
     * @returns
     * [KO] Z축 월드 크기
     * [EN] World size along the Z-axis
     */
    get worldSizeZ(): number {
        return this.#spatialGrid.worldSizeZ;
    }

    /**
     * [KO] X축 월드 크기의 역수(`1 / worldSizeX`)를 반환합니다.
     * [EN] Returns the reciprocal of the X-axis world size (`1 / worldSizeX`).
     *
     * @returns
     * [KO] X축 월드 크기의 역수
     * [EN] Reciprocal of the X-axis world size
     */
    get invWorldSizeX(): number {
        return this.#spatialGrid.invWorldSizeX;
    }

    /**
     * [KO] Z축 월드 크기의 역수(`1 / worldSizeZ`)를 반환합니다.
     * [EN] Returns the reciprocal of the Z-axis world size (`1 / worldSizeZ`).
     *
     * @returns
     * [KO] Z축 월드 크기의 역수
     * [EN] Reciprocal of the Z-axis world size
     */
    get invWorldSizeZ(): number {
        return this.#spatialGrid.invWorldSizeZ;
    }

    /**
     * [KO] X축 월드 크기의 절반(`worldSizeX * 0.5`)을 반환합니다.
     * [EN] Returns half of the X-axis world size (`worldSizeX * 0.5`).
     *
     * @returns
     * [KO] X축 월드 크기의 절반
     * [EN] Half of the X-axis world size
     */
    get halfWorldSizeX(): number {
        return this.#spatialGrid.halfWorldSizeX;
    }

    /**
     * [KO] Z축 월드 크기의 절반(`worldSizeZ * 0.5`)을 반환합니다.
     * [EN] Returns half of the Z-axis world size (`worldSizeZ * 0.5`).
     *
     * @returns
     * [KO] Z축 월드 크기의 절반
     * [EN] Half of the Z-axis world size
     */
    get halfWorldSizeZ(): number {
        return this.#spatialGrid.halfWorldSizeZ;
    }

    /**
     * [KO] 지형을 분할하는 X/Z축 타일(컴포넌트) 개수 `[countX, countZ]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the number of tiles (components) `[countX, countZ]` dividing the terrain along the X and Z axes.
     *
     * @returns
     * [KO] 컴포넌트 개수 튜플 `[number, number]`
     * [EN] Component count tuple `[number, number]`
     */
    get componentCount(): [number, number] {
        return this.#spatialGrid.componentCount;
    }

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
     * [KO] 단일 타일(컴포넌트)의 월드 크기 `[tileSizeX, tileSizeZ]`를 반환합니다.
     * [EN] Returns the world size `[tileSizeX, tileSizeZ]` of a single tile (component).
     *
     * @returns
     * [KO] 타일 크기 튜플 `[number, number]`
     * [EN] Tile size tuple `[number, number]`
     */
    get tileSize(): [number, number] {
        return this.#spatialGrid.tileSize;
    }

    /**
     * [KO] 정규화된 하이트맵 값(`0.0 ~ 1.0`)에 곱해지는 최대 고도 스케일(월드 단위, 기본값: `200.0`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum elevation scale (in world units, default: `200.0`) multiplied by normalized heightmap values (`0.0 to 1.0`).
     *
     * @returns
     * [KO] 최대 높이 스케일
     * [EN] Maximum height scale
     */
    get heightScale(): number {
        return this.#heightScale;
    }

    set heightScale(val: number) {
        if (this.#heightScale !== val) {
            this.#heightScale = val;
            this.#tileStreamer?.setTerrainConfig(val);
            this.#updateLandscapeUniforms();
            this.#tileStreamer?.rebakeAllLoadedVNT();
            this.#grassManager?.rebakeAll();
            this.#foliageManager?.repopulateAll();
        }
    }

    /**
     * [KO] 일반 타일 컴포넌트의 한 변당 기본 쿼드(Quad) 분할 수를 반환하거나 설정합니다. (`LANDSCAPE_BASE_GRID_SIZE` 규격 값만 허용)
     * [EN] Gets or sets the base quad subdivision count per side of a standard tile component. (Only values from `LANDSCAPE_BASE_GRID_SIZE` are allowed)
     *
     * @returns
     * [KO] 컴포넌트 한 변당 쿼드 개수
     * [EN] Number of quads per side of a component
     */
    get componentSizeQuads(): number {
        return this.#componentSizeQuads;
    }

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
     * [KO] 최고 해상도인 LOD 0 타일의 한 변당 쿼드(Quad) 분할 수를 반환하거나 설정합니다.
     * [EN] Gets or sets the quad subdivision count per side for the highest-resolution LOD 0 tile.
     *
     * @returns
     * [KO] LOD 0 타일의 한 변당 쿼드 개수
     * [EN] Number of quads per side for LOD 0 tiles
     */
    get lod0SizeQuads(): number {
        return this.#lod0SizeQuads;
    }

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
     * [KO] 지형 공간 그리드에 속한 모든 `LandscapeComponent` 배열을 반환합니다.
     * [EN] Returns the array of all `LandscapeComponent` instances belonging to the terrain spatial grid.
     *
     * @returns
     * [KO] `LandscapeComponent` 배열
     * [EN] Array of `LandscapeComponent` instances
     */
    get components(): LandscapeComponent[] {
        return this.#spatialGrid.flatCells;
    }

    /**
     * [KO] 타일 LOD 결정 기준(`'distance'` 또는 `'screenSize'`, 기본값: `'screenSize'`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the tile LOD determination metric (`'distance'` or `'screenSize'`, default: `'screenSize'`).
     *
     * @returns
     * [KO] LOD 결정 기준 (`'distance' | 'screenSize'`)
     * [EN] LOD determination metric (`'distance' | 'screenSize'`)
     */
    get lodMetric(): 'distance' | 'screenSize' {
        return this.#lodMetric;
    }

    set lodMetric(value: 'distance' | 'screenSize') {
        if (this.#lodMetric !== value) {
            this.#lodMetric = value;
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * [KO] 지형 메시에 사용할 최대 LOD 단계 수(범위: `1 ~ 8`, 기본값: `5`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum number of LOD levels used for the terrain mesh (range: `1 to 8`, default: `5`).
     *
     * @returns
     * [KO] 최대 LOD 단계 수
     * [EN] Maximum number of LOD levels
     */
    get lodMaxLevel(): number {
        return this.#lodMaxLevel;
    }

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
     * [KO] 각 LOD 레벨 전환 임계 거리의 제곱값 배열을 반환합니다.
     * [EN] Returns the array of squared threshold distances for each LOD level transition.
     *
     * @returns
     * [KO] LOD 전환 거리 제곱값 배열 (`number[]`)
     * [EN] Array of squared LOD transition distances (`number[]`)
     */
    get lodDistancesSq(): number[] {
        return this.#lodDistancesSq;
    }

    /**
     * [KO] 지형 머티리얼의 기본 베이스 컬러(`ColorRGBA`)를 반환합니다.
     * [EN] Returns the default base color (`ColorRGBA`) of the terrain material.
     *
     * @returns
     * [KO] `ColorRGBA` 인스턴스
     * [EN] `ColorRGBA` instance
     */
    get baseColor(): ColorRGBA {
        return this.#material.baseColor;
    }

    /**
     * [KO] 지형 머티리얼에 등록된 `LandscapeLayer` 배열을 반환합니다.
     * [EN] Returns the array of `LandscapeLayer` instances registered in the terrain material.
     *
     * @returns
     * [KO] `LandscapeLayer` 배열
     * [EN] Array of `LandscapeLayer` instances
     */
    get layers(): LandscapeLayer[] {
        return this.#material.layers;
    }

    /**
     * [KO] 근접 고해상도 텍스처 디테일이 적용되는 거리(월드 단위)를 반환하거나 설정합니다.
     * [EN] Gets or sets the distance (in world units) within which high-resolution near-detail textures are applied.
     *
     * @returns
     * [KO] 근접 디테일 블렌딩 거리
     * [EN] Near-detail blending distance
     */
    get nearDetailDistance(): number {
        return this.#material.nearDetailDistance;
    }

    set nearDetailDistance(val: number) {
        this.#material.nearDetailDistance = val;
    }

    /**
     * [KO] 전체 지형에 걸쳐 기본 고도를 제공하는 전역 하이트맵 이미지 URL을 반환하거나 설정합니다.
     * [EN] Gets or sets the global heightmap image URL that provides base elevation across the entire terrain.
     *
     * @returns
     * [KO] 전역 하이트맵 URL 문자열
     * [EN] Global heightmap URL string
     */
    get globalHeightmapUrl(): string {
        return this.#tileStreamer?.globalHeightmapUrl ?? '';
    }

    set globalHeightmapUrl(val: string) {
        if (this.#tileStreamer) {
            this.#tileStreamer.globalHeightmapUrl = val;
        }
    }

    /**
     * [KO] 카메라 위치를 중심으로 고해상도 타일 하이트맵을 스트리밍 로드할 반경(월드 단위, 기본값: `2500.0`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the radius (in world units, default: `2500.0`) around the camera position within which high-resolution tile heightmaps are streamed.
     *
     * @returns
     * [KO] 타일 스트리밍 로드 반경
     * [EN] Tile streaming loading radius
     */
    get tileLoadingRadius(): number {
        return this.#tileStreamer.tileLoadingRadius;
    }

    set tileLoadingRadius(value: number) {
        this.#tileStreamer.tileLoadingRadius = value;
    }

    /**
     * [KO] 단일 프레임당 동시에 디코딩 및 베이킹을 시작할 최대 타일 개수를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum number of tiles to start decoding and baking per single frame.
     *
     * @returns
     * [KO] 프레임당 최대 타일 로드 개수
     * [EN] Maximum tile loads per frame
     */
    get tileMaxLoadsPerFrame(): number {
        return this.#tileStreamer.tileMaxLoadsPerFrame;
    }

    set tileMaxLoadsPerFrame(value: number) {
        this.#tileStreamer.tileMaxLoadsPerFrame = value;
    }

    /**
     * [KO] 현재 로드가 완료되어 활성화된 지형 타일의 개수를 반환합니다.
     * [EN] Returns the number of terrain tiles currently loaded and active.
     *
     * @returns
     * [KO] 로드 완료된 타일 개수
     * [EN] Number of loaded tiles
     */
    get tileLoadedCount(): number {
        return this.#tileStreamer?.tileLoadedCount ?? 0;
    }

    /**
     * [KO] 가상 하이트 텍스처(VHT) 아틀라스의 `GPUTextureView`를 반환합니다.
     * [EN] Returns the `GPUTextureView` of the Virtual Height Texture (VHT) atlas.
     *
     * @returns
     * [KO] VHT 아틀라스 `GPUTextureView` 또는 `null`
     * [EN] VHT atlas `GPUTextureView` or `null`
     */
    get vhtTextureView(): GPUTextureView | null {
        return this.#tileStreamer?.vhtAtlasTexture?.gpuTextureView ?? null;
    }

    /**
     * [KO] 가상 블렌드 텍스처(VBT) 베이스 컬러 아틀라스의 `GPUTextureView`를 반환합니다.
     * [EN] Returns the `GPUTextureView` of the Virtual Blend Texture (VBT) base color atlas.
     *
     * @returns
     * [KO] VBT 베이스 컬러 아틀라스 `GPUTextureView` 또는 `null`
     * [EN] VBT base color atlas `GPUTextureView` or `null`
     */
    get vbtTextureView(): GPUTextureView | null {
        return this.#tileStreamer?.vbtBaseColorAtlas?.gpuTextureView ?? null;
    }

    /**
     * [KO] 식생 및 잔디 산포에 필요한 VHT/VBT 아틀라스와 로드된 타일이 모두 유효한 상태인지 여부를 반환합니다.
     * [EN] Returns whether both the VHT/VBT atlases and loaded tiles required for foliage and grass scattering are valid.
     *
     * @returns
     * [KO] 산포 아틀라스 유효 여부
     * [EN] Whether the scatter atlases are valid
     */
    get hasValidScatterAtlas(): boolean {
        const streamer = this.#tileStreamer;
        return !!(
            streamer?.vhtAtlasTexture?.gpuTextureView &&
            streamer?.vbtBaseColorAtlas?.gpuTextureView &&
            streamer?.tileLoadedCount > 0
        );
    }

    /**
     * [KO] VBT 베이스 컬러 아틀라스와 로드된 타일이 유효한 상태인지 여부를 반환합니다.
     * [EN] Returns whether the VBT base color atlas and loaded tiles are valid.
     *
     * @returns
     * [KO] VBT 아틀라스 유효 여부
     * [EN] Whether the VBT atlas is valid
     */
    get hasValidVbtAtlas(): boolean {
        const streamer = this.#tileStreamer;
        return !!(
            streamer?.vbtBaseColorAtlas?.gpuTextureView &&
            streamer?.tileLoadedCount > 0
        );
    }

    /**
     * [KO] 타일 행/열 인덱스(`row`, `col`)를 기반으로 개별 타일 하이트맵 이미지 URL을 반환하는 리졸버 함수를 반환하거나 설정합니다.
     * [EN] Gets or sets the resolver function that returns individual tile heightmap image URLs based on tile row and column indices (`row`, `col`).
     *
     * @returns
     * [KO] 타일 URL 리졸버 함수 또는 `null`
     * [EN] Tile URL resolver function or `null`
     */
    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileStreamer.tileUrlResolver;
    }

    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileStreamer.tileUrlResolver = resolver;
    }

    /**
     * [KO] 지형이 방향성 광원의 그림자 맵(Shadow Map)을 수신할지 여부를 반환하거나 설정합니다. (기본값: `true`)
     * [EN] Gets or sets whether the terrain receives directional light shadow maps. (Default: `true`)
     *
     * @returns
     * [KO] 그림자 수신 여부
     * [EN] Whether shadow receiving is enabled
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
     * [KO] 하이트맵 레이마칭 기반의 지형 자체 그림자(Heightmap Self-Shadow) 활성화 여부를 반환하거나 설정합니다. (기본값: `false`)
     * [EN] Gets or sets whether heightmap raymarching-based terrain self-shadowing is enabled. (Default: `false`)
     *
     * @returns
     * [KO] 하이트맵 자체 그림자 활성화 여부
     * [EN] Whether heightmap self-shadowing is enabled
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
     * [KO] 하이트맵 자체 그림자 레이마칭의 최대 추적 거리(월드 단위, 최솟값: `10.0`, 기본값: `1000.0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum trace distance (in world units, minimum: `10.0`, default: `1000.0`) for heightmap self-shadow raymarching.
     *
     * @returns
     * [KO] 하이트맵 그림자 최대 추적 거리
     * [EN] Maximum heightmap shadow trace distance
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
     * [KO] 하이트맵 자체 그림자 레이마칭의 샘플링 스텝 수(범위: `4 ~ 64`, 기본값: `16`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the number of sampling steps (range: `4 to 64`, default: `16`) for heightmap self-shadow raymarching.
     *
     * @returns
     * [KO] 하이트맵 그림자 레이마칭 스텝 수
     * [EN] Number of heightmap shadow raymarching steps
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
     * [KO] 하이트맵 자체 그림자 경계의 부드러움(Softness) 계수(최솟값: `0.1`, 기본값: `8.0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the softness factor (minimum: `0.1`, default: `8.0`) for heightmap self-shadow edges.
     *
     * @returns
     * [KO] 하이트맵 그림자 부드러움 계수
     * [EN] Heightmap shadow softness factor
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

    /**
     * [KO] 지정된 월드 X, Z 좌표에서의 지형 표면 높이(Y 좌표, 월드 단위)를 CPU 하이트맵 캐시로부터 계산하여 반환합니다.
     * [EN] Computes and returns the terrain surface height (Y coordinate, in world units) at the specified world X, Z coordinates from the CPU heightmap cache.
     *
     * ### Example
     * ```typescript
     * // [KO] 월드 (120, -45) 위치의 지형 고도 조회
     * // [EN] Query terrain elevation at world position (120, -45)
     * const groundY = landscape.getHeightAt(120, -45);
     * ```
     *
     * @param x -
     * [KO] 월드 X 좌표
     * [EN] World X coordinate
     * @param z -
     * [KO] 월드 Z 좌표
     * [EN] World Z coordinate
     * @returns
     * [KO] 보간된 지형 표면 높이 (월드 단위)
     * [EN] Interpolated terrain surface height in world units
     */
    getHeightAt(x: number, z: number): number {
        return this.#tileStreamer.getHeightAt(x, z);
    }

    /**
     * [KO] 지정된 행(`row`)과 열(`col`) 인덱스의 지형 타일이 로드 완료되었는지 여부를 반환합니다.
     * [EN] Returns whether the terrain tile at the specified `row` and `col` indices has finished loading.
     *
     * @param row -
     * [KO] 타일 행(Z축) 인덱스
     * [EN] Tile row (Z-axis) index
     * @param col -
     * [KO] 타일 열(X축) 인덱스
     * [EN] Tile column (X-axis) index
     * @returns
     * [KO] 타일 로드 완료 여부
     * [EN] Whether the tile is loaded
     */
    isTileLoaded(row: number, col: number): boolean {
        return this.#tileStreamer?.isTileLoaded(row, col) ?? false;
    }

    /**
     * [KO] 지형 머티리얼에 새로운 스플래팅 레이어(`LandscapeLayer`)를 생성하여 추가하고 반환합니다. (최대 8개)
     * [EN] Creates, adds, and returns a new splatting layer (`LandscapeLayer`) to the terrain material. (Maximum 8 layers)
     *
     * ### Example
     * ```typescript
     * // [KO] 지형에 잔디 스플래팅 레이어 추가
     * // [EN] Add a grass splatting layer to the landscape
     * const grassLayer = landscape.addLayer({
     *     name: 'Grass',
     *     baseColorTexture: './assets/grass_diff.jpg',
     *     normalTexture: './assets/grass_norm.jpg',
     *     uvScale: [25, 25]
     * });
     * ```
     *
     * @param options -
     * [KO] 생성할 레이어의 설정 옵션 (`LandscapeLayerOptions`)
     * [EN] Configuration options for the layer to create (`LandscapeLayerOptions`)
     * @returns
     * [KO] 생성되어 추가된 `LandscapeLayer` 인스턴스
     * [EN] Created and added `LandscapeLayer` instance
     */
    addLayer(options: LandscapeLayerOptions): LandscapeLayer {
        const layer = new LandscapeLayer(this.redGPUContext, options);
        layer.weightMapCPUSampler = this.#weightMapCPUSampler;
        const weightSrc = layer.weightTexture?.src;
        if (weightSrc) {
            this.#weightMapCPUSampler.load(weightSrc);
        }
        this.#material.addLayer(layer);
        return layer;
    }

    /**
     * [KO] 지정된 `LandscapeLayer` 인스턴스 또는 레이어 이름을 지형 머티리얼에서 제거합니다.
     * [EN] Removes the specified `LandscapeLayer` instance or layer name from the terrain material.
     *
     * @param layer -
     * [KO] 제거할 `LandscapeLayer` 인스턴스 또는 레이어 이름
     * [EN] `LandscapeLayer` instance or layer name to remove
     * @returns
     * [KO] 제거 성공 여부
     * [EN] Whether the layer was successfully removed
     */
    removeLayer(layer: LandscapeLayer | string): boolean {
        if (!layer) return false;
        return this.#material.removeLayer(layer);
    }

    /**
     * [KO] 지형 머티리얼에 등록된 모든 스플래팅 레이어를 제거합니다.
     * [EN] Removes all splatting layers registered in the terrain material.
     */
    clearLayers(): void {
        this.#material.clearLayers();
    }

    /**
     * [KO] 지정된 이름을 가진 `LandscapeLayer`를 찾아 반환합니다.
     * [EN] Finds and returns the `LandscapeLayer` with the specified name.
     *
     * @param name -
     * [KO] 조회할 레이어 이름
     * [EN] Layer name to look up
     * @returns
     * [KO] 일치하는 `LandscapeLayer` 인스턴스 또는 `undefined`
     * [EN] Matching `LandscapeLayer` instance or `undefined`
     */
    getLayer(name: string): LandscapeLayer | undefined {
        if (!name) return undefined;
        return this.#material.getLayer(name);
    }

    /**
     * [KO] 매 프레임 카메라 뷰 상태를 기반으로 타일 스트리밍, GPU 컬링, 식생(`FoliageManager`) 및 잔디(`GrassManager`) 컴퓨트 패스를 갱신합니다.
     * [EN] Updates tile streaming, GPU culling, foliage (`FoliageManager`), and grass (`GrassManager`) compute passes each frame based on the camera view state.
     *
     * @param renderViewStateData -
     * [KO] 현재 프레임의 뷰 및 절두체 상태 데이터 (`RenderViewStateData`)
     * [EN] Current frame's view and frustum state data (`RenderViewStateData`)
     */
    update(renderViewStateData: RenderViewStateData): void {
        if (!renderViewStateData) return;

        const {view, frustumPlanesFlat} = renderViewStateData;
        const rawCamera = view.rawCamera as PerspectiveCamera;
        if (!rawCamera) return;

        if (this.#material) {
            this.#material.updateUniformsData();
        }

        const {x, y, z, viewMatrix, fieldOfView} = rawCamera;
        const {projectionMatrix, hierarchicalZBuffer} = view;

        this.#tileStreamer.update(x, z, y);

        const {tileCountX, tileCountZ, tileSizeX, tileSizeZ} = this.#spatialGrid;
        const totalComponents = tileCountX * tileCountZ;

        this.#instanceBuffer.resetIndirectDrawBuffer(this.#sharedGeometry, this.#lodMaxLevel, !!this.#debuggerManager?.landscapeWireframe);

        const fovDeg = fieldOfView ?? 60.0;
        const tanHalfFOV = Math.tan(((fovDeg * Math.PI) / 180.0) * 0.5);
        if (Math.abs(this.#lastTanHalfFOV - tanHalfFOV) > 1e-4) {
            this.#lastTanHalfFOV = tanHalfFOV;
            this.#updateLandscapeUniforms();
        }
        const lodMetricVal = this.#lodMetric === 'screenSize' ? 1.0 : 0.0;

        const effectiveHZBTextureView = hierarchicalZBuffer?.textureView || null;
        const effectiveHZBSampler = hierarchicalZBuffer?.sampler || null;

        if (this.#lastHZBView !== effectiveHZBTextureView) {
            this.#lastHZBView = effectiveHZBTextureView;
            this.#lastHZBSampler = effectiveHZBSampler;
            const instanceBuffer = this.#instanceBuffer;
            if (instanceBuffer) {
                const {allTilesBuffer, visibleTilesBuffer, indirectDrawBuffer} = instanceBuffer;
                if (allTilesBuffer && visibleTilesBuffer && indirectDrawBuffer) {
                    this.#gpuCuller?.updateBindGroup(
                        allTilesBuffer,
                        visibleTilesBuffer,
                        indirectDrawBuffer,
                        effectiveHZBTextureView,
                        effectiveHZBSampler
                    );
                }
            }
        }

        let mainPVMatrix: Float32Array | null = null;
        if (projectionMatrix && viewMatrix) {
            mainPVMatrix = tempPVMatrix;
            mat4.multiply(mainPVMatrix, projectionMatrix, viewMatrix);
        }

        this.#gpuCuller?.updateUniforms(
            x, y, z,
            this.#lodMaxLevel,
            tileSizeX, tileSizeZ,
            this.#heightScale,
            totalComponents,
            frustumPlanesFlat,
            this.#lodDistancesBuffer,
            tanHalfFOV,
            lodMetricVal,
            !!effectiveHZBTextureView,
            mainPVMatrix
        );

        this.#foliageManager?.update(renderViewStateData);
        this.#grassManager?.update(renderViewStateData);
        this.#currentRenderViewStateData = renderViewStateData;

        this.commandEncoderManager.useEncoder(
            COMMAND_ENCODER_TYPE.PRE_PROCESS,
            this.#onResetEcosystemIndirectCommands
        );

        this.commandEncoderManager.addPreProcessComputePass(
            'Landscape_UnifiedCulling_ComputePass',
            this.#onPreProcessUnifiedComputePass
        );

        this.#debuggerManager.update(rawCamera);
    }

    /**
     * [KO] 내부 `LandscapeRenderer`를 통해 지형 메시를 현재 렌더 패스에 렌더링합니다.
     * [EN] Renders the terrain mesh into the current render pass via the internal `LandscapeRenderer`.
     *
     * @param view -
     * [KO] 렌더링 뷰 또는 `RenderViewStateData` 객체
     * [EN] Render view or `RenderViewStateData` object
     * @param passEncoder -
     * [KO] 사용할 `GPURenderPassEncoder` (생략 시 `view`에서 추출)
     * [EN] `GPURenderPassEncoder` to use (extracted from `view` if omitted)
     */
    render(view: any, passEncoder?: GPURenderPassEncoder): void {
        this.#renderer.render(view, passEncoder);
    }

    /**
     * [KO] 지형에 속한 모든 하위 매니저(식생, 잔디, 타일 스트리머, 컬러, 렌더러, 지오메트리 등)와 GPU 리소스를 해제합니다.
     * [EN] Releases all sub-managers (foliage, grass, tile streamer, culler, renderer, geometry, etc.) and GPU resources belonging to the terrain.
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
        this.#renderer?.destroy();
        this.#currentRenderViewStateData = null;
    }

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
            const {vhtAtlasTexture, vntAtlasTexture, vbtBaseColorAtlas, vbtNormalAtlas, vbtORMAtlas} = tileStreamer;
            this.#instanceBuffer.updateBindGroup(
                vhtAtlasTexture.gpuTextureView,
                vntAtlasTexture.gpuTextureView,
                vbtBaseColorAtlas?.gpuTextureView,
                vbtNormalAtlas?.gpuTextureView,
                vbtORMAtlas?.gpuTextureView
            );
        }

        this.#rebuildLODStructures();
        this.#rebuildTiles();
    }

    #rebuildTiles(): void {
        const {tileCountX, tileCountZ, tileSizeX, tileSizeZ} = this.#spatialGrid;
        const componentCountX = tileCountX;
        const componentCountZ = tileCountZ;
        const targetCount = componentCountX * componentCountZ;

        this.#tileStreamer.resetTileState();
        this.#sharedGeometry.updateTileSize(tileSizeX, tileSizeZ);
        this.#updateLODDistances();
        this.#renderer?.clearPipelineCaches();

        let needRebuildBindGroup = false;
        const changed = this.#tileStreamer.ensureAtlasSize(componentCountX, componentCountZ);
        if (changed) {
            this.#tileStreamer.setTerrainConfig(this.#heightScale);
            this.#tileStreamer.resetTileState();
            needRebuildBindGroup = true;
        }

        if (!this.#instanceBuffer || this.#instanceBuffer.maxComponentCount !== targetCount || this.#instanceBuffer.lodMaxLevel !== this.#lodMaxLevel) {
            if (this.#instanceBuffer) {
                this.#instanceBuffer.destroy();
            }
            this.#instanceBuffer = new LandscapeInstanceBuffer(this.redGPUContext, targetCount, this.#lodMaxLevel);
            needRebuildBindGroup = true;
        }

        if (needRebuildBindGroup && this.#tileStreamer.vhtAtlasTexture && this.#tileStreamer.vntAtlasTexture) {
            const {
                vhtAtlasTexture,
                vntAtlasTexture,
                vbtBaseColorAtlas,
                vbtNormalAtlas,
                vbtORMAtlas,
                globalHeightTexture
            } = this.#tileStreamer;
            this.#instanceBuffer.updateBindGroup(
                vhtAtlasTexture.gpuTextureView,
                vntAtlasTexture.gpuTextureView,
                vbtBaseColorAtlas?.gpuTextureView,
                vbtNormalAtlas?.gpuTextureView,
                vbtORMAtlas?.gpuTextureView
            );
            if (globalHeightTexture) {
                this.#bakeGlobalBaseToVHT();
            }
        }

        this.#gpuCuller = new LandscapeGPUCuller(this.redGPUContext);

        this.#spatialGrid.rebuildTiles((comp, index) => {
            comp.setHeightBounds(0.0, 1.0);
            this.#instanceBuffer.setStaticTileData(
                index,
                comp.worldX,
                comp.worldZ,
                comp.minHeightNorm,
                comp.maxHeightNorm
            );
        });

        this.#instanceBuffer.uploadStaticTilesToGPU();
        this.#updateLandscapeUniforms();

        const instanceBuffer = this.#instanceBuffer;
        if (instanceBuffer) {
            const {allTilesBuffer, visibleTilesBuffer, indirectDrawBuffer} = instanceBuffer;
            if (allTilesBuffer && visibleTilesBuffer && indirectDrawBuffer) {
                this.#gpuCuller.updateBindGroup(
                    allTilesBuffer,
                    visibleTilesBuffer,
                    indirectDrawBuffer,
                    this.#lastHZBView,
                    this.#lastHZBSampler
                );
            }
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
            FOLIAGE_SUB_CELL_SIZE,
            this.#debuggerManager?.landscapeDebugMode ?? 0
        );
    }

    #onResetEcosystemIndirectCommands = (encoder: GPUCommandEncoder): void => {
        this.#foliageManager?.recordResetCommands(encoder);
        this.#grassManager?.recordResetCommands(encoder);
    };

    #onPreProcessUnifiedComputePass = (computePass: GPUComputePassEncoder): void => {
        const totalComponents = this.#spatialGrid.tileCountX * this.#spatialGrid.tileCountZ;
        this.#gpuCuller?.dispatchPass(computePass, totalComponents);
        this.#foliageManager?.dispatchCullingPass(computePass);
        if (this.#currentRenderViewStateData) {
            this.#grassManager?.dispatchCullingPass(computePass, this.#currentRenderViewStateData);
        }
    };

    #onTileHeightBoundsLoaded(comp: LandscapeComponent): void {
        const index = comp.componentZ * this.#spatialGrid.tileCountX + comp.componentX;
        this.#instanceBuffer.updateTileHeightBounds(index, comp.minHeightNorm, comp.maxHeightNorm);
        const gpuDevice = this.redGPUContext.gpuDevice;
        const allTilesBuffer = this.#instanceBuffer.allTilesBuffer;
        if (gpuDevice && allTilesBuffer) {
            this.#tileHeightBuffer[0] = comp.minHeightNorm;
            this.#tileHeightBuffer[1] = comp.maxHeightNorm;
            gpuDevice.queue.writeBuffer(
                allTilesBuffer,
                index * 16 + 8,
                this.#tileHeightBuffer.buffer,
                0,
                8
            );
        }
    }

    #syncAllTileHeightBoundsFromGlobalHeightmap(): void {
        const g = this.#tileStreamer?.globalCPUHeightMap;
        if (!g) return;
        const {width, height, pixels, maxVal} = g;
        const tileCountX = this.#spatialGrid.tileCountX;
        const tileCountZ = this.#spatialGrid.tileCountZ;
        const maxNorm = maxVal || (pixels instanceof Uint16Array ? 65535.0 : 255.0);

        const flatCells = this.#spatialGrid.flatCells;
        for (let idx = 0; idx < flatCells.length; idx++) {
            const comp = flatCells[idx];
            if (!comp) continue;
            const {componentX, componentZ} = comp;
            const uMin = componentX / tileCountX;
            const uMax = (componentX + 1) / tileCountX;
            const vMin = componentZ / tileCountZ;
            const vMax = (componentZ + 1) / tileCountZ;

            const pxMinX = Math.floor(uMin * width);
            const pxMaxX = Math.min(width - 1, Math.ceil(uMax * width));
            const pxMinZ = Math.floor(vMin * height);
            const pxMaxZ = Math.min(height - 1, Math.ceil(vMax * height));

            let minP = Infinity;
            let maxP = -Infinity;
            for (let z = pxMinZ; z <= pxMaxZ; z++) {
                const rowOffset = z * width;
                for (let x = pxMinX; x <= pxMaxX; x++) {
                    const p = pixels[rowOffset + x];
                    if (p < minP) minP = p;
                    if (p > maxP) maxP = p;
                }
            }

            if (minP !== Infinity && maxP !== -Infinity) {
                const minHeightNorm = minP / maxNorm;
                const maxHeightNorm = maxP / maxNorm;
                comp.setHeightBounds(minHeightNorm, maxHeightNorm);
                this.#instanceBuffer.updateTileHeightBounds(idx, minHeightNorm, maxHeightNorm);
            }
        }
        this.#instanceBuffer.uploadStaticTilesToGPU();
    }

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
}

Object.freeze(Landscape);
export default Landscape;
