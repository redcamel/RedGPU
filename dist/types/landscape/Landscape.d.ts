import "./core/shader/library/LandscapeShaderLibrary";
import RedGPUContext from "../context/RedGPUContext";
import RenderViewStateData from "../display/view/core/RenderViewStateData";
import LandscapeComponent from "./core/spatial/LandscapeComponent";
import LandscapeInstanceBuffer from "./core/spatial/LandscapeInstanceBuffer";
import LandscapeMaterial from "./LandscapeMaterial";
import LandscapeLayer, { LandscapeLayerOptions } from "./LandscapeLayer";
import LandscapeSharedGeometry from "./core/spatial/LandscapeSharedGeometry";
import ColorRGBA from "../color/ColorRGBA";
import { LandscapeTileUrlResolver } from "./core/spatial/LandscapeTileStreamer";
import RedGPUObject from "../base/RedGPUObject";
import FoliageManager from "./foliage/FoliageManager";
import GrassManager from "./grass/GrassManager";
import LandscapeDebuggerManager from "./debugger/LandscapeDebuggerManager";
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
declare class Landscape extends RedGPUObject {
    #private;
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
    constructor(redGPUContext: RedGPUContext, worldSize?: number | [number, number]);
    /**
     * [KO] 지형 타일들이 공유하는 LOD 격자 지오메트리(`LandscapeSharedGeometry`)를 반환합니다.
     * [EN] Returns the shared LOD grid geometry (`LandscapeSharedGeometry`) used by terrain tiles.
     *
     * @returns
     * [KO] `LandscapeSharedGeometry` 인스턴스
     * [EN] `LandscapeSharedGeometry` instance
     */
    get sharedGeometry(): LandscapeSharedGeometry;
    /**
     * [KO] 타일 인스턴스 및 간접 드로우 GPU 버퍼를 관리하는 `LandscapeInstanceBuffer`를 반환합니다.
     * [EN] Returns the `LandscapeInstanceBuffer` managing tile instance and indirect draw GPU buffers.
     *
     * @returns
     * [KO] `LandscapeInstanceBuffer` 인스턴스
     * [EN] `LandscapeInstanceBuffer` instance
     */
    get instanceBuffer(): LandscapeInstanceBuffer;
    /**
     * [KO] 지형 렌더링에 사용되는 정점 셰이더 모듈(`GPUShaderModule`)을 반환합니다.
     * [EN] Returns the vertex shader module (`GPUShaderModule`) used for terrain rendering.
     *
     * @returns
     * [KO] `GPUShaderModule` 인스턴스
     * [EN] `GPUShaderModule` instance
     */
    get vertexShaderModule(): GPUShaderModule;
    /**
     * [KO] 지형 디버그 시각화 및 와이어프레임 상태를 제어하는 `LandscapeDebuggerManager`를 반환합니다.
     * [EN] Returns the `LandscapeDebuggerManager` that controls terrain debug visualization and wireframe states.
     *
     * @returns
     * [KO] `LandscapeDebuggerManager` 인스턴스
     * [EN] `LandscapeDebuggerManager` instance
     */
    get debuggerManager(): LandscapeDebuggerManager;
    /**
     * [KO] 지형 위 식생(3D 메시) 산포를 관리하는 `FoliageManager`를 반환합니다.
     * [EN] Returns the `FoliageManager` that manages vegetation (3D mesh) scattering on the terrain.
     *
     * @returns
     * [KO] `FoliageManager` 인스턴스
     * [EN] `FoliageManager` instance
     */
    get foliageManager(): FoliageManager;
    /**
     * [KO] 지형 위 절차적 잔디 및 초목 클럼프를 관리하는 `GrassManager`를 반환합니다.
     * [EN] Returns the `GrassManager` that manages procedural grass and vegetation clumps on the terrain.
     *
     * @returns
     * [KO] `GrassManager` 인스턴스
     * [EN] `GrassManager` instance
     */
    get grassManager(): GrassManager;
    /**
     * [KO] 지형의 표면 레이어와 텍스처 블렌딩을 담당하는 `LandscapeMaterial`을 반환합니다.
     * [EN] Returns the `LandscapeMaterial` responsible for terrain surface layers and texture blending.
     *
     * @returns
     * [KO] `LandscapeMaterial` 인스턴스
     * [EN] `LandscapeMaterial` instance
     */
    get material(): LandscapeMaterial;
    /**
     * [KO] 지형의 전체 월드 크기 `[worldSizeX, worldSizeZ]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the total world size `[worldSizeX, worldSizeZ]` of the terrain.
     *
     * @returns
     * [KO] 월드 크기 튜플 `[number, number]`
     * [EN] World size tuple `[number, number]`
     */
    get worldSize(): [number, number];
    set worldSize(value: number | [number, number]);
    /**
     * [KO] 지형의 X축 방향 전체 월드 크기를 반환합니다.
     * [EN] Returns the total world size of the terrain along the X-axis.
     *
     * @returns
     * [KO] X축 월드 크기
     * [EN] World size along the X-axis
     */
    get worldSizeX(): number;
    /**
     * [KO] 지형의 Z축 방향 전체 월드 크기를 반환합니다.
     * [EN] Returns the total world size of the terrain along the Z-axis.
     *
     * @returns
     * [KO] Z축 월드 크기
     * [EN] World size along the Z-axis
     */
    get worldSizeZ(): number;
    /**
     * [KO] X축 월드 크기의 역수(`1 / worldSizeX`)를 반환합니다.
     * [EN] Returns the reciprocal of the X-axis world size (`1 / worldSizeX`).
     *
     * @returns
     * [KO] X축 월드 크기의 역수
     * [EN] Reciprocal of the X-axis world size
     */
    get invWorldSizeX(): number;
    /**
     * [KO] Z축 월드 크기의 역수(`1 / worldSizeZ`)를 반환합니다.
     * [EN] Returns the reciprocal of the Z-axis world size (`1 / worldSizeZ`).
     *
     * @returns
     * [KO] Z축 월드 크기의 역수
     * [EN] Reciprocal of the Z-axis world size
     */
    get invWorldSizeZ(): number;
    /**
     * [KO] X축 월드 크기의 절반(`worldSizeX * 0.5`)을 반환합니다.
     * [EN] Returns half of the X-axis world size (`worldSizeX * 0.5`).
     *
     * @returns
     * [KO] X축 월드 크기의 절반
     * [EN] Half of the X-axis world size
     */
    get halfWorldSizeX(): number;
    /**
     * [KO] Z축 월드 크기의 절반(`worldSizeZ * 0.5`)을 반환합니다.
     * [EN] Returns half of the Z-axis world size (`worldSizeZ * 0.5`).
     *
     * @returns
     * [KO] Z축 월드 크기의 절반
     * [EN] Half of the Z-axis world size
     */
    get halfWorldSizeZ(): number;
    /**
     * [KO] 지형을 분할하는 X/Z축 타일(컴포넌트) 개수 `[countX, countZ]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the number of tiles (components) `[countX, countZ]` dividing the terrain along the X and Z axes.
     *
     * @returns
     * [KO] 컴포넌트 개수 튜플 `[number, number]`
     * [EN] Component count tuple `[number, number]`
     */
    get componentCount(): [number, number];
    set componentCount(value: number | [number, number]);
    /**
     * [KO] 단일 타일(컴포넌트)의 월드 크기 `[tileSizeX, tileSizeZ]`를 반환합니다.
     * [EN] Returns the world size `[tileSizeX, tileSizeZ]` of a single tile (component).
     *
     * @returns
     * [KO] 타일 크기 튜플 `[number, number]`
     * [EN] Tile size tuple `[number, number]`
     */
    get tileSize(): [number, number];
    /**
     * [KO] 정규화된 하이트맵 값(`0.0 ~ 1.0`)에 곱해지는 최대 고도 스케일(월드 단위, 기본값: `200.0`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum elevation scale (in world units, default: `200.0`) multiplied by normalized heightmap values (`0.0 to 1.0`).
     *
     * @returns
     * [KO] 최대 높이 스케일
     * [EN] Maximum height scale
     */
    get heightScale(): number;
    set heightScale(val: number);
    /**
     * [KO] 일반 타일 컴포넌트의 한 변당 기본 쿼드(Quad) 분할 수를 반환하거나 설정합니다. (`LANDSCAPE_BASE_GRID_SIZE` 규격 값만 허용)
     * [EN] Gets or sets the base quad subdivision count per side of a standard tile component. (Only values from `LANDSCAPE_BASE_GRID_SIZE` are allowed)
     *
     * @returns
     * [KO] 컴포넌트 한 변당 쿼드 개수
     * [EN] Number of quads per side of a component
     */
    get componentSizeQuads(): number;
    set componentSizeQuads(value: number);
    /**
     * [KO] 최고 해상도인 LOD 0 타일의 한 변당 쿼드(Quad) 분할 수를 반환하거나 설정합니다.
     * [EN] Gets or sets the quad subdivision count per side for the highest-resolution LOD 0 tile.
     *
     * @returns
     * [KO] LOD 0 타일의 한 변당 쿼드 개수
     * [EN] Number of quads per side for LOD 0 tiles
     */
    get lod0SizeQuads(): number;
    set lod0SizeQuads(value: number);
    /**
     * [KO] 지형 공간 그리드에 속한 모든 `LandscapeComponent` 배열을 반환합니다.
     * [EN] Returns the array of all `LandscapeComponent` instances belonging to the terrain spatial grid.
     *
     * @returns
     * [KO] `LandscapeComponent` 배열
     * [EN] Array of `LandscapeComponent` instances
     */
    get components(): LandscapeComponent[];
    /**
     * [KO] 타일 LOD 결정 기준(`'distance'` 또는 `'screenSize'`, 기본값: `'screenSize'`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the tile LOD determination metric (`'distance'` or `'screenSize'`, default: `'screenSize'`).
     *
     * @returns
     * [KO] LOD 결정 기준 (`'distance' | 'screenSize'`)
     * [EN] LOD determination metric (`'distance' | 'screenSize'`)
     */
    get lodMetric(): 'distance' | 'screenSize';
    set lodMetric(value: 'distance' | 'screenSize');
    /**
     * [KO] 지형 메시에 사용할 최대 LOD 단계 수(범위: `1 ~ 8`, 기본값: `5`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum number of LOD levels used for the terrain mesh (range: `1 to 8`, default: `5`).
     *
     * @returns
     * [KO] 최대 LOD 단계 수
     * [EN] Maximum number of LOD levels
     */
    get lodMaxLevel(): number;
    set lodMaxLevel(value: number);
    /**
     * [KO] 각 LOD 레벨 전환 임계 거리의 제곱값 배열을 반환합니다.
     * [EN] Returns the array of squared threshold distances for each LOD level transition.
     *
     * @returns
     * [KO] LOD 전환 거리 제곱값 배열 (`number[]`)
     * [EN] Array of squared LOD transition distances (`number[]`)
     */
    get lodDistancesSq(): number[];
    /**
     * [KO] 지형 머티리얼의 기본 베이스 컬러(`ColorRGBA`)를 반환합니다.
     * [EN] Returns the default base color (`ColorRGBA`) of the terrain material.
     *
     * @returns
     * [KO] `ColorRGBA` 인스턴스
     * [EN] `ColorRGBA` instance
     */
    get baseColor(): ColorRGBA;
    /**
     * [KO] 지형 머티리얼에 등록된 `LandscapeLayer` 배열을 반환합니다.
     * [EN] Returns the array of `LandscapeLayer` instances registered in the terrain material.
     *
     * @returns
     * [KO] `LandscapeLayer` 배열
     * [EN] Array of `LandscapeLayer` instances
     */
    get layers(): LandscapeLayer[];
    /**
     * [KO] 근접 고해상도 텍스처 디테일이 적용되는 거리(월드 단위)를 반환하거나 설정합니다.
     * [EN] Gets or sets the distance (in world units) within which high-resolution near-detail textures are applied.
     *
     * @returns
     * [KO] 근접 디테일 블렌딩 거리
     * [EN] Near-detail blending distance
     */
    get nearDetailDistance(): number;
    set nearDetailDistance(val: number);
    /**
     * [KO] 전체 지형에 걸쳐 기본 고도를 제공하는 전역 하이트맵 이미지 URL을 반환하거나 설정합니다.
     * [EN] Gets or sets the global heightmap image URL that provides base elevation across the entire terrain.
     *
     * @returns
     * [KO] 전역 하이트맵 URL 문자열
     * [EN] Global heightmap URL string
     */
    get globalHeightmapUrl(): string;
    set globalHeightmapUrl(val: string);
    /**
     * [KO] 카메라 위치를 중심으로 고해상도 타일 하이트맵을 스트리밍 로드할 반경(월드 단위, 기본값: `2500.0`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the radius (in world units, default: `2500.0`) around the camera position within which high-resolution tile heightmaps are streamed.
     *
     * @returns
     * [KO] 타일 스트리밍 로드 반경
     * [EN] Tile streaming loading radius
     */
    get tileLoadingRadius(): number;
    set tileLoadingRadius(value: number);
    /**
     * [KO] 단일 프레임당 동시에 디코딩 및 베이킹을 시작할 최대 타일 개수를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum number of tiles to start decoding and baking per single frame.
     *
     * @returns
     * [KO] 프레임당 최대 타일 로드 개수
     * [EN] Maximum tile loads per frame
     */
    get tileMaxLoadsPerFrame(): number;
    set tileMaxLoadsPerFrame(value: number);
    /**
     * [KO] 현재 로드가 완료되어 활성화된 지형 타일의 개수를 반환합니다.
     * [EN] Returns the number of terrain tiles currently loaded and active.
     *
     * @returns
     * [KO] 로드 완료된 타일 개수
     * [EN] Number of loaded tiles
     */
    get tileLoadedCount(): number;
    /**
     * [KO] 가상 하이트 텍스처(VHT) 아틀라스의 `GPUTextureView`를 반환합니다.
     * [EN] Returns the `GPUTextureView` of the Virtual Height Texture (VHT) atlas.
     *
     * @returns
     * [KO] VHT 아틀라스 `GPUTextureView` 또는 `null`
     * [EN] VHT atlas `GPUTextureView` or `null`
     */
    get vhtTextureView(): GPUTextureView | null;
    /**
     * [KO] 가상 블렌드 텍스처(VBT) 베이스 컬러 아틀라스의 `GPUTextureView`를 반환합니다.
     * [EN] Returns the `GPUTextureView` of the Virtual Blend Texture (VBT) base color atlas.
     *
     * @returns
     * [KO] VBT 베이스 컬러 아틀라스 `GPUTextureView` 또는 `null`
     * [EN] VBT base color atlas `GPUTextureView` or `null`
     */
    get vbtTextureView(): GPUTextureView | null;
    /**
     * [KO] 식생 및 잔디 산포에 필요한 VHT/VBT 아틀라스와 로드된 타일이 모두 유효한 상태인지 여부를 반환합니다.
     * [EN] Returns whether both the VHT/VBT atlases and loaded tiles required for foliage and grass scattering are valid.
     *
     * @returns
     * [KO] 산포 아틀라스 유효 여부
     * [EN] Whether the scatter atlases are valid
     */
    get hasValidScatterAtlas(): boolean;
    /**
     * [KO] VBT 베이스 컬러 아틀라스와 로드된 타일이 유효한 상태인지 여부를 반환합니다.
     * [EN] Returns whether the VBT base color atlas and loaded tiles are valid.
     *
     * @returns
     * [KO] VBT 아틀라스 유효 여부
     * [EN] Whether the VBT atlas is valid
     */
    get hasValidVbtAtlas(): boolean;
    /**
     * [KO] 타일 행/열 인덱스(`row`, `col`)를 기반으로 개별 타일 하이트맵 이미지 URL을 반환하는 리졸버 함수를 반환하거나 설정합니다.
     * [EN] Gets or sets the resolver function that returns individual tile heightmap image URLs based on tile row and column indices (`row`, `col`).
     *
     * @returns
     * [KO] 타일 URL 리졸버 함수 또는 `null`
     * [EN] Tile URL resolver function or `null`
     */
    get tileUrlResolver(): LandscapeTileUrlResolver | null;
    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null);
    /**
     * [KO] 지형이 방향성 광원의 그림자 맵(Shadow Map)을 수신할지 여부를 반환하거나 설정합니다. (기본값: `true`)
     * [EN] Gets or sets whether the terrain receives directional light shadow maps. (Default: `true`)
     *
     * @returns
     * [KO] 그림자 수신 여부
     * [EN] Whether shadow receiving is enabled
     */
    get receiveShadow(): boolean;
    set receiveShadow(value: boolean);
    /**
     * [KO] 하이트맵 레이마칭 기반의 지형 자체 그림자(Heightmap Self-Shadow) 활성화 여부를 반환하거나 설정합니다. (기본값: `false`)
     * [EN] Gets or sets whether heightmap raymarching-based terrain self-shadowing is enabled. (Default: `false`)
     *
     * @returns
     * [KO] 하이트맵 자체 그림자 활성화 여부
     * [EN] Whether heightmap self-shadowing is enabled
     */
    get castHeightmapShadow(): boolean;
    set castHeightmapShadow(value: boolean);
    /**
     * [KO] 하이트맵 자체 그림자 레이마칭의 최대 추적 거리(월드 단위, 최솟값: `10.0`, 기본값: `1000.0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum trace distance (in world units, minimum: `10.0`, default: `1000.0`) for heightmap self-shadow raymarching.
     *
     * @returns
     * [KO] 하이트맵 그림자 최대 추적 거리
     * [EN] Maximum heightmap shadow trace distance
     */
    get heightmapShadowDistance(): number;
    set heightmapShadowDistance(value: number);
    /**
     * [KO] 하이트맵 자체 그림자 레이마칭의 샘플링 스텝 수(범위: `4 ~ 64`, 기본값: `16`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the number of sampling steps (range: `4 to 64`, default: `16`) for heightmap self-shadow raymarching.
     *
     * @returns
     * [KO] 하이트맵 그림자 레이마칭 스텝 수
     * [EN] Number of heightmap shadow raymarching steps
     */
    get heightmapShadowSteps(): number;
    set heightmapShadowSteps(value: number);
    /**
     * [KO] 하이트맵 자체 그림자 경계의 부드러움(Softness) 계수(최솟값: `0.1`, 기본값: `8.0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the softness factor (minimum: `0.1`, default: `8.0`) for heightmap self-shadow edges.
     *
     * @returns
     * [KO] 하이트맵 그림자 부드러움 계수
     * [EN] Heightmap shadow softness factor
     */
    get heightmapShadowSoftness(): number;
    set heightmapShadowSoftness(value: number);
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
    getHeightAt(x: number, z: number): number;
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
    isTileLoaded(row: number, col: number): boolean;
    /**
     * [KO] 지형 머티리얼에 새로운 스플래팅 레이어(`LandscapeLayer`)를 생성하여 추가하고 반환합니다. PBR 재질 레이어는 최대 8개까지 등록할 수 있으며, 가중치 맵(`weightTexture`)은 지형 전체에서 단일 RGBA 텍스처 1장(4채널: `'R' | 'G' | 'B' | 'A'`)을 공유하여 사용합니다.
     * [EN] Creates, adds, and returns a new splatting layer (`LandscapeLayer`) to the terrain material. Up to 8 PBR material layers can be registered, sharing a single RGBA weight map texture (`weightTexture`, 4 channels: `'R' | 'G' | 'B' | 'A'`) across the terrain.
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
    addLayer(options: LandscapeLayerOptions): LandscapeLayer;
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
    removeLayer(layer: LandscapeLayer | string): boolean;
    /**
     * [KO] 지형 머티리얼에 등록된 모든 스플래팅 레이어를 제거합니다.
     * [EN] Removes all splatting layers registered in the terrain material.
     */
    clearLayers(): void;
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
    getLayer(name: string): LandscapeLayer | undefined;
    /**
     * [KO] 매 프레임 카메라 뷰 상태를 기반으로 타일 스트리밍, GPU 컬링, 식생(`FoliageManager`) 및 잔디(`GrassManager`) 컴퓨트 패스를 갱신합니다.
     * [EN] Updates tile streaming, GPU culling, foliage (`FoliageManager`), and grass (`GrassManager`) compute passes each frame based on the camera view state.
     *
     * @param renderViewStateData -
     * [KO] 현재 프레임의 뷰 및 절두체 상태 데이터 (`RenderViewStateData`)
     * [EN] Current frame's view and frustum state data (`RenderViewStateData`)
     */
    update(renderViewStateData: RenderViewStateData): void;
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
    render(view: any, passEncoder?: GPURenderPassEncoder): void;
    /**
     * [KO] 지형에 속한 모든 하위 매니저(식생, 잔디, 타일 스트리머, 컬러, 렌더러, 지오메트리 등)와 GPU 리소스를 해제합니다.
     * [EN] Releases all sub-managers (foliage, grass, tile streamer, culler, renderer, geometry, etc.) and GPU resources belonging to the terrain.
     */
    destroy(): void;
}
export default Landscape;
