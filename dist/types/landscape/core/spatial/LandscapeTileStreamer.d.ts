import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";
import DirectTexture from "../../../resources/texture/DirectTexture";
import LandscapeMaterial from "../../LandscapeMaterial";
/**
 * [KO] 행(row)과 열(col) 인덱스를 기반으로 지형 하이트맵 타일 이미지의 URL을 반환하는 리졸버 함수 타입입니다.
 * [EN] Resolver function type that returns the URL of a terrain heightmap tile image based on row and column indices.
 *
 * @param row -
 * [KO] 타일의 행(Z) 인덱스
 * [EN] Row (Z) index of the tile
 * @param col -
 * [KO] 타일의 열(X) 인덱스
 * [EN] Column (X) index of the tile
 * @param comp -
 * [KO] 대상 타일의 `LandscapeComponent` 인스턴스 (선택)
 * [EN] `LandscapeComponent` instance of the target tile (optional)
 * @returns
 * [KO] 로드할 타일 하이트맵 리소스의 URL 문자열
 * [EN] URL string of the tile heightmap resource to load
 *
 * @category Landscape
 */
export type LandscapeTileUrlResolver = (row: number, col: number, comp?: LandscapeComponent) => string;
/**
 * [KO] 카메라 위치 기반의 비동기 타일 하이트맵 스트리밍, 가상 아틀라스(VHT/VNT/VBT) 베이킹 및 CPU 높이 샘플링을 총괄하는 클래스입니다.
 * [EN] Class that manages camera-based asynchronous tile heightmap streaming, virtual atlas (VHT/VNT/VBT) baking, and CPU height sampling.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class LandscapeTileStreamer extends RedGPUObject {
    #private;
    /**
     * [KO] `LandscapeTileStreamer` 인스턴스를 생성하고 아틀라스 생성기(VHT, VNT, VBT)를 초기화합니다.
     * [EN] Creates a `LandscapeTileStreamer` instance and initializes atlas generators (VHT, VNT, VBT).
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param spatialGrid -
     * [KO] 지형 공간 분할 그리드 인스턴스
     * [EN] Landscape spatial grid instance
     * @param tileLoadingRadius -
     * [KO] 타일 스트리밍 활성화 반경 (기본값: `2500.0`)
     * [EN] Tile streaming activation radius (default: `2500.0`)
     */
    constructor(redGPUContext: RedGPUContext, spatialGrid: LandscapeSpatialGrid, tileLoadingRadius?: number);
    /**
     * [KO] 가상 하이트맵 아틀라스(VHT) 텍스처를 반환합니다.
     * [EN] Returns the Virtual Heightmap Texture (VHT) atlas.
     *
     * @returns
     * [KO] VHT 아틀라스 `DirectTexture` 또는 `null`
     * [EN] VHT atlas `DirectTexture` or `null`
     */
    get vhtAtlasTexture(): DirectTexture | null;
    /**
     * [KO] 가상 노멀맵 아틀라스(VNT) 텍스처를 반환합니다.
     * [EN] Returns the Virtual Normalmap Texture (VNT) atlas.
     *
     * @returns
     * [KO] VNT 아틀라스 `DirectTexture` 또는 `null`
     * [EN] VNT atlas `DirectTexture` or `null`
     */
    get vntAtlasTexture(): DirectTexture | null;
    /**
     * [KO] 가상 블렌드 텍스처(VBT: BaseColor, Normal, ORM) 3-레이어 아틀라스 `DirectTexture`를 반환합니다. 기본 `gpuTextureView`는 Layer 0(BaseColor)의 2D 뷰를 제공합니다.
     * [EN] Returns the 3-layer Virtual Blend Texture (VBT: BaseColor, Normal, ORM) atlas `DirectTexture`. Its default `gpuTextureView` provides the 2D view of Layer 0 (BaseColor).
     *
     * @returns
     * [KO] VBT 아틀라스 `DirectTexture` 또는 `null`
     * [EN] VBT atlas `DirectTexture` or `null`
     */
    get vbtBaseColorAtlas(): DirectTexture | null;
    /**
     * [KO] 지형 프래그먼트 셰이더 바인딩을 위한 VBT 3-레이어(BaseColor, Normal, ORM) `2d-array` 텍스처 뷰를 반환합니다.
     * [EN] Returns the VBT 3-layer (BaseColor, Normal, ORM) `2d-array` texture view for terrain fragment shader binding.
     *
     * @returns
     * [KO] VBT `2d-array` `GPUTextureView` 또는 `null`
     * [EN] VBT `2d-array` `GPUTextureView` or `null`
     */
    get vbtAtlasArrayView(): GPUTextureView | null;
    /**
     * [KO] LOD 0 단계의 축당 쿼드 분할 수를 가져오거나 설정합니다.
     * [EN] Gets or sets the quad subdivision count per axis at LOD 0.
     *
     * @returns
     * [KO] LOD 0 축당 쿼드 분할 수
     * [EN] LOD 0 quad subdivision count per axis
     */
    get lod0SizeQuads(): number;
    set lod0SizeQuads(value: number);
    /**
     * [KO] 전역 베이스 하이트맵 이미지의 URL을 가져오거나 설정합니다.
     * [EN] Gets or sets the URL of the global base heightmap image.
     *
     * @returns
     * [KO] 전역 베이스 하이트맵 URL 문자열
     * [EN] Global base heightmap URL string
     */
    get globalHeightmapUrl(): string;
    set globalHeightmapUrl(val: string);
    /**
     * [KO] 로드된 전역 베이스 하이트맵의 원시 `GPUTexture`를 반환합니다.
     * [EN] Returns the raw `GPUTexture` of the loaded global base heightmap.
     *
     * @returns
     * [KO] 전역 베이스 하이트맵 `GPUTexture` 또는 `null`
     * [EN] Global base heightmap `GPUTexture` or `null`
     */
    get globalHeightTexture(): GPUTexture | null;
    /**
     * [KO] 카메라 주변 타일 스트리밍 로딩 반경(월드 단위)을 가져오거나 설정합니다.
     * [EN] Gets or sets the tile streaming loading radius (in world units) around the camera.
     *
     * @returns
     * [KO] 타일 스트리밍 로딩 반경 (월드 단위)
     * [EN] Tile streaming loading radius (in world units)
     */
    get tileLoadingRadius(): number;
    set tileLoadingRadius(val: number);
    /**
     * [KO] 프레임당 최대 비동기 타일 로드 요청 개수를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum number of asynchronous tile load requests per frame.
     *
     * @returns
     * [KO] 프레임당 최대 비동기 타일 로드 요청 개수
     * [EN] Maximum number of asynchronous tile load requests per frame
     */
    get tileMaxLoadsPerFrame(): number;
    set tileMaxLoadsPerFrame(val: number);
    /**
     * [KO] 타일별 하이트맵 URL을 결정하는 리졸버 함수를 가져오거나 설정합니다.
     * [EN] Gets or sets the resolver function that determines the heightmap URL per tile.
     *
     * @returns
     * [KO] 타일 URL 리졸버 함수 (`LandscapeTileUrlResolver`) 또는 `null`
     * [EN] Tile URL resolver function (`LandscapeTileUrlResolver`) or `null`
     */
    get tileUrlResolver(): LandscapeTileUrlResolver | null;
    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null);
    /**
     * [KO] 현재까지 스트리밍 로드가 완료된 타일의 개수를 반환합니다.
     * [EN] Returns the number of tiles that have finished streaming loading so far.
     *
     * @returns
     * [KO] 로드 완료된 타일 개수
     * [EN] Number of loaded tiles
     */
    get tileLoadedCount(): number;
    /**
     * [KO] 현재 설정된 전역 CPU 하이트맵 픽셀 데이터를 반환합니다.
     * [EN] Returns the currently configured global CPU heightmap pixel data.
     *
     * @returns
     * [KO] 전역 CPU 하이트맵 픽셀 데이터 객체 또는 `null`
     * [EN] Global CPU heightmap pixel data object or `null`
     */
    get globalCPUHeightMap(): {
        width: number;
        height: number;
        pixels: ArrayLike<number>;
        maxVal: number;
    } | null;
    /**
     * [KO] 카메라 위치를 기준으로 반경 내 미로드 타일을 거리순으로 정렬하여 비동기 로드를 요청합니다.
     * [EN] Sorts unloaded tiles within the radius by distance based on camera position and requests asynchronous loading.
     *
     * @param cameraX -
     * [KO] 카메라 월드 X 좌표
     * [EN] Camera world X coordinate
     * @param cameraZ -
     * [KO] 카메라 월드 Z 좌표
     * [EN] Camera world Z coordinate
     * @param cameraY -
     * [KO] 카메라 월드 Y 좌표 (고도에 따른 동적 반경/속도 보정에 사용)
     * [EN] Camera world Y coordinate (used for dynamic radius/rate adjustment based on altitude)
     */
    update(cameraX: number, cameraZ: number, cameraY?: number): void;
    /**
     * [KO] 타일 로딩 상태 맵, 실패 기록, 대기열 및 CPU 하이트맵 캐시를 모두 초기화합니다.
     * [EN] Clears all tile loading state maps, failure records, pending queues, and CPU heightmap caches.
     */
    resetTileState(): void;
    /**
     * [KO] 타일 그리드 크기에 맞춰 VHT, VNT, VBT 아틀라스 텍스처의 해상도를 확인하고 필요 시 재생성합니다.
     * [EN] Verifies the resolution of VHT, VNT, and VBT atlas textures according to the tile grid size and recreates them if necessary.
     *
     * @param componentCountX -
     * [KO] 가로(X) 방향 타일 컴포넌트 개수
     * [EN] Number of tile components along the X axis
     * @param componentCountZ -
     * [KO] 세로(Z) 방향 타일 컴포넌트 개수
     * [EN] Number of tile components along the Z axis
     * @returns
     * [KO] 아틀라스 텍스처가 새로 생성되었으면 `true`, 기존 크기가 유지되었으면 `false`
     * [EN] `true` if the atlas textures were newly created, `false` if the existing size was kept
     */
    ensureAtlasSize(componentCountX: number, componentCountZ: number): boolean;
    /**
     * [KO] VBT 베이킹에 참조할 지형 머티리얼(`LandscapeMaterial`)을 설정합니다.
     * [EN] Sets the terrain material (`LandscapeMaterial`) to reference for VBT baking.
     *
     * @param mat -
     * [KO] 연결할 `LandscapeMaterial` 인스턴스 또는 `null`
     * [EN] `LandscapeMaterial` instance to link, or `null`
     */
    setMaterial(mat: LandscapeMaterial | null): void;
    /**
     * [KO] 개별 타일 하이트맵 로드 및 베이킹이 완료될 때 호출될 콜백 함수를 설정합니다.
     * [EN] Sets the callback function to be invoked when an individual tile heightmap finishes loading and baking.
     *
     * @param callback -
     * [KO] 타일 로드 완료 시 호출될 콜백 함수 또는 `null`
     * [EN] Callback function invoked upon tile load completion, or `null`
     */
    setOnTileLoaded(callback: ((tileComponent: LandscapeComponent) => void) | null): void;
    /**
     * [KO] 전역 베이스 하이트맵 텍스처를 VHT 아틀라스 전체 영역에 베이킹하고 VNT 노멀을 갱신합니다.
     * [EN] Bakes the global base heightmap texture into the entire VHT atlas region and updates VNT normals.
     *
     * @param globalHeightTexture -
     * [KO] 베이킹할 전역 하이트맵 `GPUTexture` (생략 시 내부 로드된 텍스처 사용)
     * [EN] Global heightmap `GPUTexture` to bake (uses internally loaded texture if omitted)
     * @param componentCountX -
     * [KO] 가로 방향 타일 개수 (선택)
     * [EN] Number of tiles along the X axis (optional)
     * @param componentCountZ -
     * [KO] 세로 방향 타일 개수 (선택)
     * [EN] Number of tiles along the Z axis (optional)
     * @param heightScale -
     * [KO] 지형 높이 스케일 (선택)
     * [EN] Terrain height scale (optional)
     * @param worldSizeX -
     * [KO] 지형 전체 가로 월드 크기 (선택)
     * [EN] Total terrain world width (X) (optional)
     */
    bakeGlobalBase(globalHeightTexture?: GPUTexture | null, componentCountX?: number, componentCountZ?: number, heightScale?: number, worldSizeX?: number): void;
    /**
     * [KO] 전역 하이트맵의 로드 및 베이킹이 완료되었을 때 호출될 콜백 함수를 설정합니다.
     * [EN] Sets the callback function to be invoked when loading and baking of the global heightmap is completed.
     *
     * @param callback -
     * [KO] 전역 하이트맵 베이킹 완료 콜백 또는 `null`
     * [EN] Global heightmap baking completion callback, or `null`
     */
    setOnGlobalHeightmapBaked(callback: (() => void) | null): void;
    /**
     * [KO] 스트리머가 보유한 아틀라스 텍스처, 생성기 및 내부 상태를 모두 파괴하고 해제합니다.
     * [EN] Destroys and releases all atlas textures, generators, and internal states held by the streamer.
     */
    destroy(): void;
    /**
     * [KO] 지형의 높이 스케일(`heightScale`) 설정을 갱신합니다.
     * [EN] Updates the terrain height scale (`heightScale`) configuration.
     *
     * @param heightScale -
     * [KO] 적용할 높이 스케일 값
     * [EN] Height scale value to apply
     */
    setTerrainConfig(heightScale: number): void;
    /**
     * [KO] 이미 로드된 모든 타일에 대해 변경된 `heightScale` 등을 반영하여 VNT 노멀 아틀라스를 재베이킹합니다.
     * [EN] Rebakes the VNT normal atlas for all already loaded tiles to reflect updated parameters such as `heightScale`.
     */
    rebakeAllLoadedVNT(): void;
    /**
     * [KO] 지정된 행(row)과 열(col) 인덱스의 타일이 스트리밍 로드 완료 상태인지 확인합니다.
     * [EN] Checks whether the tile at the specified row and column indices has finished streaming loading.
     *
     * @param row -
     * [KO] 타일 행(Z) 인덱스
     * [EN] Tile row (Z) index
     * @param col -
     * [KO] 타일 열(X) 인덱스
     * [EN] Tile column (X) index
     * @returns
     * [KO] 타일 로드가 완료되었으면 `true`, 아니면 `false`
     * [EN] `true` if the tile is loaded, otherwise `false`
     */
    isTileLoaded(row: number, col: number): boolean;
    /**
     * [KO] 지정한 월드 `(x, z)` 좌표에서의 지형 표면 높이(Y)를 CPU 캐시 데이터로부터 보간하여 계산합니다.
     * [EN] Calculates the terrain surface height (Y) at the specified world `(x, z)` coordinates by interpolating from CPU cached data.
     *
     * @param x -
     * [KO] 월드 X 좌표
     * [EN] World X coordinate
     * @param z -
     * [KO] 월드 Z 좌표
     * [EN] World Z coordinate
     * @returns
     * [KO] 보간된 월드 Y 높이값 (범위 밖이거나 데이터가 없으면 `0.0`)
     * [EN] Interpolated world Y height value (`0.0` if out of bounds or no data is available)
     */
    getHeightAt(x: number, z: number): number;
    /**
     * [KO] 현재 설정된 머티리얼과 VNT 아틀라스를 기반으로 가상 블렌드 텍스처(VBT) 아틀라스 전체를 재베이킹합니다.
     * [EN] Rebakes the entire Virtual Blend Texture (VBT) atlas based on the currently configured material and VNT atlas.
     */
    rebakeAllLoadedVBT(): void;
}
export default LandscapeTileStreamer;
