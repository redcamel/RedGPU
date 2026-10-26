import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";
import {parse16BitPngBuffer} from "../../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";
import DirectTexture from "../../../resources/texture/DirectTexture";
import LandscapeVNTGenerator from "../generator/LandscapeVNTGenerator";
import LandscapeVHTGenerator from "../generator/LandscapeVHTGenerator";
import LandscapeVBTGenerator from "../generator/LandscapeVBTGenerator";
import LandscapeMaterial from "../../LandscapeMaterial";

const NEIGHBOR_OFFSETS: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
];

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
class LandscapeTileStreamer extends RedGPUObject {
    #spatialGrid: LandscapeSpatialGrid;

    #tileLoadingRadius: number = 2500.0;
    #tileMaxLoadsPerFrame: number = 1;
    #tileUrlResolver: LandscapeTileUrlResolver | null = null;
    #onTileLoaded: ((comp: LandscapeComponent) => void) | null = null;

    #vhtAtlasTexture: DirectTexture | null = null;
    #vntAtlasTexture: DirectTexture | null = null;
    #vbtBaseColorAtlas: DirectTexture | null = null;
    #vbtAtlasArrayView: GPUTextureView | null = null;
    #vhtGenerator: LandscapeVHTGenerator | null = null;
    #vntGenerator: LandscapeVNTGenerator | null = null;
    #vbtGenerator: LandscapeVBTGenerator | null = null;
    #material: LandscapeMaterial | null = null;
    #globalHeightmapUrl: string = '';
    #globalHeightTexture: GPUTexture | null = null;
    #globalCPUHeightMap: { width: number; height: number; pixels: ArrayLike<number>; maxVal: number } | null = null;
    #onGlobalHeightmapBaked: (() => void) | null = null;

    #heightScale: number = 200.0;
    #lod0SizeQuads: number = 256;

    #tempCellBuffer: Int32Array = new Int32Array(2);
    #activeComponentsBuffer: LandscapeComponent[] = [];
    #pendingQueue: LandscapeComponent[] = [];

    #loadingMap: Map<string, boolean> = new Map();
    #loadedMap: Map<string, boolean> = new Map();
    #cpuHeightMap: Map<string, any> = new Map();
    #failedMap: Map<string, number> = new Map();

    #sortCamX: number = 0;
    #sortCamZ: number = 0;

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
    constructor(redGPUContext: RedGPUContext, spatialGrid: LandscapeSpatialGrid, tileLoadingRadius: number = 2500.0) {
        super(redGPUContext);
        this.#spatialGrid = spatialGrid;
        this.#tileLoadingRadius = tileLoadingRadius;
        this.#vhtGenerator = new LandscapeVHTGenerator(redGPUContext);
        this.#vntGenerator = new LandscapeVNTGenerator(redGPUContext);
        this.#vbtGenerator = new LandscapeVBTGenerator(redGPUContext);
    }

    /**
     * [KO] 가상 하이트맵 아틀라스(VHT) 텍스처를 반환합니다.
     * [EN] Returns the Virtual Heightmap Texture (VHT) atlas.
     *
     * @returns
     * [KO] VHT 아틀라스 `DirectTexture` 또는 `null`
     * [EN] VHT atlas `DirectTexture` or `null`
     */
    get vhtAtlasTexture(): DirectTexture | null {
        return this.#vhtAtlasTexture;
    }

    /**
     * [KO] 가상 노멀맵 아틀라스(VNT) 텍스처를 반환합니다.
     * [EN] Returns the Virtual Normalmap Texture (VNT) atlas.
     *
     * @returns
     * [KO] VNT 아틀라스 `DirectTexture` 또는 `null`
     * [EN] VNT atlas `DirectTexture` or `null`
     */
    get vntAtlasTexture(): DirectTexture | null {
        return this.#vntAtlasTexture;
    }

    /**
     * [KO] 가상 블렌드 텍스처(VBT: BaseColor, Normal, ORM) 3-레이어 아틀라스 `DirectTexture`를 반환합니다. 기본 `gpuTextureView`는 Layer 0(BaseColor)의 2D 뷰를 제공합니다.
     * [EN] Returns the 3-layer Virtual Blend Texture (VBT: BaseColor, Normal, ORM) atlas `DirectTexture`. Its default `gpuTextureView` provides the 2D view of Layer 0 (BaseColor).
     *
     * @returns
     * [KO] VBT 아틀라스 `DirectTexture` 또는 `null`
     * [EN] VBT atlas `DirectTexture` or `null`
     */
    get vbtBaseColorAtlas(): DirectTexture | null {
        return this.#vbtBaseColorAtlas;
    }

    /**
     * [KO] 지형 프래그먼트 셰이더 바인딩을 위한 VBT 3-레이어(BaseColor, Normal, ORM) `2d-array` 텍스처 뷰를 반환합니다.
     * [EN] Returns the VBT 3-layer (BaseColor, Normal, ORM) `2d-array` texture view for terrain fragment shader binding.
     *
     * @returns
     * [KO] VBT `2d-array` `GPUTextureView` 또는 `null`
     * [EN] VBT `2d-array` `GPUTextureView` or `null`
     */
    get vbtAtlasArrayView(): GPUTextureView | null {
        return this.#vbtAtlasArrayView;
    }

    /**
     * [KO] LOD 0 단계의 축당 쿼드 분할 수를 가져오거나 설정합니다.
     * [EN] Gets or sets the quad subdivision count per axis at LOD 0.
     *
     * @returns
     * [KO] LOD 0 축당 쿼드 분할 수
     * [EN] LOD 0 quad subdivision count per axis
     */
    get lod0SizeQuads(): number {
        return this.#lod0SizeQuads;
    }

    set lod0SizeQuads(value: number) {
        this.#lod0SizeQuads = value;
    }

    /**
     * [KO] 전역 베이스 하이트맵 이미지의 URL을 가져오거나 설정합니다.
     * [EN] Gets or sets the URL of the global base heightmap image.
     *
     * @returns
     * [KO] 전역 베이스 하이트맵 URL 문자열
     * [EN] Global base heightmap URL string
     */
    get globalHeightmapUrl(): string {
        return this.#globalHeightmapUrl;
    }

    set globalHeightmapUrl(val: string) {
        if (this.#globalHeightmapUrl !== val) {
            this.#globalHeightmapUrl = val;
            this.#loadGlobalHeightmapAsync();
        }
    }

    /**
     * [KO] 로드된 전역 베이스 하이트맵의 원시 `GPUTexture`를 반환합니다.
     * [EN] Returns the raw `GPUTexture` of the loaded global base heightmap.
     *
     * @returns
     * [KO] 전역 베이스 하이트맵 `GPUTexture` 또는 `null`
     * [EN] Global base heightmap `GPUTexture` or `null`
     */
    get globalHeightTexture(): GPUTexture | null {
        return this.#globalHeightTexture;
    }

    /**
     * [KO] 카메라 주변 타일 스트리밍 로딩 반경(월드 단위)을 가져오거나 설정합니다.
     * [EN] Gets or sets the tile streaming loading radius (in world units) around the camera.
     *
     * @returns
     * [KO] 타일 스트리밍 로딩 반경 (월드 단위)
     * [EN] Tile streaming loading radius (in world units)
     */
    get tileLoadingRadius(): number {
        return this.#tileLoadingRadius;
    }

    set tileLoadingRadius(val: number) {
        this.#tileLoadingRadius = Math.max(100, val);
    }

    /**
     * [KO] 프레임당 최대 비동기 타일 로드 요청 개수를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum number of asynchronous tile load requests per frame.
     *
     * @returns
     * [KO] 프레임당 최대 비동기 타일 로드 요청 개수
     * [EN] Maximum number of asynchronous tile load requests per frame
     */
    get tileMaxLoadsPerFrame(): number {
        return this.#tileMaxLoadsPerFrame;
    }

    set tileMaxLoadsPerFrame(val: number) {
        this.#tileMaxLoadsPerFrame = Math.max(1, val);
    }

    /**
     * [KO] 타일별 하이트맵 URL을 결정하는 리졸버 함수를 가져오거나 설정합니다.
     * [EN] Gets or sets the resolver function that determines the heightmap URL per tile.
     *
     * @returns
     * [KO] 타일 URL 리졸버 함수 (`LandscapeTileUrlResolver`) 또는 `null`
     * [EN] Tile URL resolver function (`LandscapeTileUrlResolver`) or `null`
     */
    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileUrlResolver;
    }

    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileUrlResolver = resolver;
        this.resetTileState();
    }

    /**
     * [KO] 현재까지 스트리밍 로드가 완료된 타일의 개수를 반환합니다.
     * [EN] Returns the number of tiles that have finished streaming loading so far.
     *
     * @returns
     * [KO] 로드 완료된 타일 개수
     * [EN] Number of loaded tiles
     */
    get tileLoadedCount(): number {
        return this.#loadedMap.size;
    }

    /**
     * [KO] 현재 설정된 전역 CPU 하이트맵 픽셀 데이터를 반환합니다.
     * [EN] Returns the currently configured global CPU heightmap pixel data.
     *
     * @returns
     * [KO] 전역 CPU 하이트맵 픽셀 데이터 객체 또는 `null`
     * [EN] Global CPU heightmap pixel data object or `null`
     */
    get globalCPUHeightMap(): { width: number; height: number; pixels: ArrayLike<number>; maxVal: number } | null {
        return this.#globalCPUHeightMap;
    }

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
    update(cameraX: number, cameraZ: number, cameraY: number = 0): void {
        if (!this.#tileUrlResolver) return;

        const radius = Math.max(this.#tileLoadingRadius, Math.abs(cameraY) * 2.0);
        const grid = this.#spatialGrid;
        if (!grid) return;

        const activeBuffer = this.#activeComponentsBuffer;
        grid.getActiveComponentsInRadius(cameraX, cameraZ, radius, activeBuffer);

        const now = performance.now();
        const RETRY_INTERVAL_MS = 10000;

        const pending = this.#pendingQueue;
        pending.length = 0;

        for (let i = 0; i < activeBuffer.length; i++) {
            const comp = activeBuffer[i];
            const key = comp.key;

            if (this.#loadedMap.has(key) || this.#loadingMap.has(key)) {
                continue;
            }

            const lastFailedTime = this.#failedMap.get(key);
            if (lastFailedTime !== undefined && now - lastFailedTime < RETRY_INTERVAL_MS) {
                continue;
            }

            pending.push(comp);
        }

        if (pending.length > 1) {
            this.#sortCamX = cameraX;
            this.#sortCamZ = cameraZ;
            pending.sort(this.#sortCompare);
        }

        const loadRate = Math.abs(cameraY) > 1000 ? Math.max(this.#tileMaxLoadsPerFrame, 4) : this.#tileMaxLoadsPerFrame;
        const loadCount = Math.min(pending.length, loadRate);
        for (let i = 0; i < loadCount; i++) {
            const comp = pending[i];
            this.#loadTileAsync(comp);
        }
    }

    /**
     * [KO] 타일 로딩 상태 맵, 실패 기록, 대기열 및 CPU 하이트맵 캐시를 모두 초기화합니다.
     * [EN] Clears all tile loading state maps, failure records, pending queues, and CPU heightmap caches.
     */
    resetTileState(): void {
        this.#loadingMap.clear();
        this.#loadedMap.clear();
        this.#failedMap.clear();
        this.#cpuHeightMap.clear();
        this.#pendingQueue.length = 0;
    }

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
    ensureAtlasSize(componentCountX: number, componentCountZ: number): boolean {
        const targetAtlasW = componentCountX * 512;
        const targetAtlasH = componentCountZ * 512;
        const targetVbtAtlasW = componentCountX * 256;
        const targetVbtAtlasH = componentCountZ * 256;

        if (
            this.#vhtAtlasTexture &&
            this.#vhtAtlasTexture.gpuTexture.width === targetAtlasW &&
            this.#vhtAtlasTexture.gpuTexture.height === targetAtlasH &&
            this.#vbtBaseColorAtlas &&
            this.#vbtBaseColorAtlas.gpuTexture.width === targetVbtAtlasW &&
            this.#vbtBaseColorAtlas.gpuTexture.height === targetVbtAtlasH
        ) {
            return false;
        }

        this.#vhtAtlasTexture?.destroy();
        this.#vntAtlasTexture?.destroy();
        this.#vbtBaseColorAtlas?.destroy();
        this.#vbtAtlasArrayView = null;

        const {redGPUContext} = this;
        const {gpuDevice} = redGPUContext;

        const rawVhtTexture = gpuDevice.createTexture({
            size: [targetAtlasW, targetAtlasH],
            format: 'r32float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_VHT_AtlasTexture'
        });
        this.#vhtAtlasTexture = new DirectTexture(redGPUContext, 'Landscape_VHT_AtlasTexture', rawVhtTexture);

        const rawVntTexture = gpuDevice.createTexture({
            size: [targetAtlasW, targetAtlasH],
            format: 'rgba16float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VNT_AtlasTexture'
        });
        this.#vntAtlasTexture = new DirectTexture(redGPUContext, 'Landscape_VNT_AtlasTexture', rawVntTexture);

        const rawVbtAtlas = gpuDevice.createTexture({
            size: [targetVbtAtlasW, targetVbtAtlasH, 3],
            mipLevelCount: 6,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VBT_AtlasArrayTexture'
        });
        this.#vbtBaseColorAtlas = new DirectTexture(redGPUContext, 'Landscape_VBT_BaseColorAtlasTexture', rawVbtAtlas);
        this.#vbtAtlasArrayView = rawVbtAtlas.createView({
            dimension: '2d-array',
            format: 'rgba8unorm',
            baseMipLevel: 0,
            mipLevelCount: 6,
            baseArrayLayer: 0,
            arrayLayerCount: 3,
            label: 'Landscape_VBT_AtlasArrayView'
        });

        return true;
    }

    /**
     * [KO] VBT 베이킹에 참조할 지형 머티리얼(`LandscapeMaterial`)을 설정합니다.
     * [EN] Sets the terrain material (`LandscapeMaterial`) to reference for VBT baking.
     *
     * @param mat -
     * [KO] 연결할 `LandscapeMaterial` 인스턴스 또는 `null`
     * [EN] `LandscapeMaterial` instance to link, or `null`
     */
    setMaterial(mat: LandscapeMaterial | null): void {
        this.#material = mat;
    }

    /**
     * [KO] 개별 타일 하이트맵 로드 및 베이킹이 완료될 때 호출될 콜백 함수를 설정합니다.
     * [EN] Sets the callback function to be invoked when an individual tile heightmap finishes loading and baking.
     *
     * @param callback -
     * [KO] 타일 로드 완료 시 호출될 콜백 함수 또는 `null`
     * [EN] Callback function invoked upon tile load completion, or `null`
     */
    setOnTileLoaded(callback: ((tileComponent: LandscapeComponent) => void) | null): void {
        this.#onTileLoaded = callback;
    }

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
    bakeGlobalBase(
        globalHeightTexture?: GPUTexture | null,
        componentCountX?: number,
        componentCountZ?: number,
        heightScale?: number,
        worldSizeX?: number
    ): void {
        const tex = globalHeightTexture || this.#globalHeightTexture;
        if (!tex || !this.#vhtAtlasTexture || !this.#vntAtlasTexture) return;

        const countX = componentCountX ?? this.#spatialGrid?.tileCountX ?? 16;
        const countZ = componentCountZ ?? this.#spatialGrid?.tileCountZ ?? 16;
        const hScale = heightScale ?? this.#heightScale;
        const wsX = worldSizeX ?? this.#spatialGrid?.worldSizeX ?? (countX * (this.#spatialGrid?.tileSizeX ?? 125));

        const atlasW = countX * 512;
        const atlasH = countZ * 512;

        if (!this.#vhtGenerator || !this.#vntGenerator) {
            return;
        }

        this.#vhtGenerator.bakeGlobalBase(
            tex,
            this.#vhtAtlasTexture,
            countX,
            countZ
        );

        const globalSampleStep = Math.max(1, Math.round(atlasW / Math.max(1, tex.width)));
        this.#vntGenerator.bakeTileRegion(
            this.#vhtAtlasTexture,
            this.#vntAtlasTexture,
            0, 0,
            atlasW, atlasH,
            hScale,
            wsX,
            countX,
            globalSampleStep
        );
    }

    /**
     * [KO] 전역 하이트맵의 로드 및 베이킹이 완료되었을 때 호출될 콜백 함수를 설정합니다.
     * [EN] Sets the callback function to be invoked when loading and baking of the global heightmap is completed.
     *
     * @param callback -
     * [KO] 전역 하이트맵 베이킹 완료 콜백 또는 `null`
     * [EN] Global heightmap baking completion callback, or `null`
     */
    setOnGlobalHeightmapBaked(callback: (() => void) | null): void {
        this.#onGlobalHeightmapBaked = callback;
    }

    /**
     * [KO] 스트리머가 보유한 아틀라스 텍스처, 생성기 및 내부 상태를 모두 파괴하고 해제합니다.
     * [EN] Destroys and releases all atlas textures, generators, and internal states held by the streamer.
     */
    destroy(): void {
        this.resetTileState();

        this.#vhtGenerator?.destroy();
        this.#vhtGenerator = null;
        this.#vntGenerator?.destroy();
        this.#vntGenerator = null;
        this.#vbtGenerator?.destroy();
        this.#vbtGenerator = null;

        if (this.#globalHeightTexture) {
            this.#globalHeightTexture.destroy();
            this.#globalHeightTexture = null;
        }

        this.#vhtAtlasTexture?.destroy();
        this.#vhtAtlasTexture = null;
        this.#vntAtlasTexture?.destroy();
        this.#vntAtlasTexture = null;
        this.#vbtBaseColorAtlas?.destroy();
        this.#vbtBaseColorAtlas = null;
        this.#vbtAtlasArrayView = null;

        this.#material = null;
        this.#tileUrlResolver = null;
        this.#onTileLoaded = null;
        this.#onGlobalHeightmapBaked = null;
    }

    #setGlobalCPUHeightMap(data: {
        width: number;
        height: number;
        pixels: ArrayLike<number>;
        maxVal?: number
    } | null): void {
        if (!data) {
            this.#globalCPUHeightMap = null;
            return;
        }
        const maxVal = data.maxVal ?? (data.pixels instanceof Uint16Array ? 65535.0 : 255.0);
        this.#globalCPUHeightMap = {
            width: data.width,
            height: data.height,
            pixels: data.pixels,
            maxVal
        };
    }

    /**
     * [KO] 지형의 높이 스케일(`heightScale`) 설정을 갱신합니다.
     * [EN] Updates the terrain height scale (`heightScale`) configuration.
     *
     * @param heightScale -
     * [KO] 적용할 높이 스케일 값
     * [EN] Height scale value to apply
     */
    setTerrainConfig(heightScale: number): void {
        this.#heightScale = heightScale;
    }

    /**
     * [KO] 이미 로드된 모든 타일에 대해 변경된 `heightScale` 등을 반영하여 VNT 노멀 아틀라스를 재베이킹합니다.
     * [EN] Rebakes the VNT normal atlas for all already loaded tiles to reflect updated parameters such as `heightScale`.
     */
    rebakeAllLoadedVNT(): void {
        if (!this.#vhtAtlasTexture || !this.#vntAtlasTexture || !this.#vntGenerator || !this.#spatialGrid) return;

        const TILE_PIXEL_SIZE = 512;
        const vhtAtlas = this.#vhtAtlasTexture;
        const vntAtlas = this.#vntAtlasTexture;
        const vntGen = this.#vntGenerator;
        const heightScale = this.#heightScale;
        const {worldSizeX, tileCountX, tileCountZ} = this.#spatialGrid;

        if (this.#globalHeightTexture) {
            const atlasW = tileCountX * TILE_PIXEL_SIZE;
            const globalSampleStep = Math.max(1, Math.round(atlasW / Math.max(1, this.#globalHeightTexture.width)));
            vntGen.bakeTileRegion(
                vhtAtlas,
                vntAtlas,
                0,
                0,
                atlasW,
                tileCountZ * TILE_PIXEL_SIZE,
                heightScale,
                worldSizeX,
                tileCountX,
                globalSampleStep
            );
        }

        for (const key of this.#cpuHeightMap.keys()) {
            const [rowStr, colStr] = key.split('_');
            const row = parseInt(rowStr, 10);
            const col = parseInt(colStr, 10);

            if (row >= tileCountZ || col >= tileCountX) continue;

            const targetX = col * TILE_PIXEL_SIZE;
            const targetZ = row * TILE_PIXEL_SIZE;

            vntGen.bakeTileRegion(
                vhtAtlas,
                vntAtlas,
                targetX,
                targetZ,
                TILE_PIXEL_SIZE,
                TILE_PIXEL_SIZE,
                heightScale,
                worldSizeX,
                tileCountX
            );
        }
    }

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
    isTileLoaded(row: number, col: number): boolean {
        const comp = this.#spatialGrid?.getComponent(row, col);
        return comp ? this.#loadedMap.has(comp.key) : false;
    }

    #sortCompare = (a: LandscapeComponent, b: LandscapeComponent): number => {
        const da = (a.worldX - this.#sortCamX) * (a.worldX - this.#sortCamX)
            + (a.worldZ - this.#sortCamZ) * (a.worldZ - this.#sortCamZ);
        const db = (b.worldX - this.#sortCamX) * (b.worldX - this.#sortCamX)
            + (b.worldZ - this.#sortCamZ) * (b.worldZ - this.#sortCamZ);
        return da - db;
    };

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
    getHeightAt(x: number, z: number): number {
        if (!this.#spatialGrid) return 0.0;

        const grid = this.#spatialGrid;
        const {halfWorldSizeX: halfWX, halfWorldSizeZ: halfWZ} = grid;

        if (x < -halfWX || x > halfWX || z < -halfWZ || z > halfWZ) {
            return 0.0;
        }

        grid.getCellCoordinates(x, z, this.#tempCellBuffer);
        const col = this.#tempCellBuffer[0];
        const row = this.#tempCellBuffer[1];
        const comp = grid.getComponent(row, col);
        if (!comp) return 0.0;

        const tileData = this.#cpuHeightMap.get(comp.key);
        if (!tileData && !this.#globalCPUHeightMap) {
            return 0.0;
        }

        const {tileSizeX, tileSizeZ} = grid;
        const tileMinX = col * tileSizeX - halfWX;
        const tileMinZ = row * tileSizeZ - halfWZ;

        const segments = this.#lod0SizeQuads || 256;
        const stepX = tileSizeX / segments;
        const stepZ = tileSizeZ / segments;

        const relX = Math.min(tileSizeX, Math.max(0.0, x - tileMinX));
        const relZ = Math.min(tileSizeZ, Math.max(0.0, z - tileMinZ));

        const gx = relX / stepX;
        const gz = relZ / stepZ;
        const ix = Math.min(segments - 1, Math.floor(gx));
        const iz = Math.min(segments - 1, Math.floor(gz));
        const fx = gx - ix;
        const fz = gz - iz;

        const {tileCountX, tileCountZ} = grid;
        const texSizeX = tileCountX * 512;
        const texSizeZ = tileCountZ * 512;
        const texStep = 512 / segments;

        const globalTexX0 = Math.min(texSizeX - 1, Math.max(0, Math.round(col * 512 + ix * texStep)));
        const globalTexZ0 = Math.min(texSizeZ - 1, Math.max(0, Math.round(row * 512 + iz * texStep)));
        const globalTexX1 = Math.min(texSizeX - 1, Math.max(0, Math.round(col * 512 + (ix + 1) * texStep)));
        const globalTexZ1 = Math.min(texSizeZ - 1, Math.max(0, Math.round(row * 512 + (iz + 1) * texStep)));

        let h00 = 0;
        let h10 = 0;
        let h01 = 0;
        let h11 = 0;

        if (tileData) {
            const tX0 = Math.min(511, Math.max(0, globalTexX0 - col * 512));
            const tZ0 = Math.min(511, Math.max(0, globalTexZ0 - row * 512));
            const tX1 = Math.min(511, Math.max(0, globalTexX1 - col * 512));
            const tZ1 = Math.min(511, Math.max(0, globalTexZ1 - row * 512));

            const {pixels, width, height} = tileData;

            if (width === 512 && height === 512) {
                h00 = pixels[tZ0 * 512 + tX0] || 0;
                h10 = pixels[tZ0 * 512 + tX1] || 0;
                h01 = pixels[tZ1 * 512 + tX0] || 0;
                h11 = pixels[tZ1 * 512 + tX1] || 0;
            } else {
                h00 = this.#sampleGlobalLinear(tileData, (tX0 + 0.5) / 512.0, (tZ0 + 0.5) / 512.0);
                h10 = this.#sampleGlobalLinear(tileData, (tX1 + 0.5) / 512.0, (tZ0 + 0.5) / 512.0);
                h01 = this.#sampleGlobalLinear(tileData, (tX0 + 0.5) / 512.0, (tZ1 + 0.5) / 512.0);
                h11 = this.#sampleGlobalLinear(tileData, (tX1 + 0.5) / 512.0, (tZ1 + 0.5) / 512.0);
            }
        } else if (this.#globalCPUHeightMap) {
            const g = this.#globalCPUHeightMap;
            const sU0 = (globalTexX0 + 0.5) / texSizeX;
            const sV0 = (globalTexZ0 + 0.5) / texSizeZ;
            const sU1 = (globalTexX1 + 0.5) / texSizeX;
            const sV1 = (globalTexZ1 + 0.5) / texSizeZ;

            h00 = this.#sampleGlobalLinear(g, sU0, sV0);
            h10 = this.#sampleGlobalLinear(g, sU1, sV0);
            h01 = this.#sampleGlobalLinear(g, sU0, sV1);
            h11 = this.#sampleGlobalLinear(g, sU1, sV1);
        }

        let rawVal: number;
        if (fx + fz <= 1.0) {
            rawVal = h00 + (h10 - h00) * fx + (h01 - h00) * fz;
        } else {
            rawVal = h11 + (h01 - h11) * (1.0 - fx) + (h10 - h11) * (1.0 - fz);
        }

        return (rawVal / 65535.0) * this.#heightScale;
    }

    #sampleGlobalLinear(
        g: { width: number; height: number; pixels: ArrayLike<number>; maxVal: number },
        u: number,
        v: number
    ): number {
        const {width, height, pixels} = g;
        const cx = Math.max(0.0, Math.min(width - 1.0, u * width - 0.5));
        const cy = Math.max(0.0, Math.min(height - 1.0, v * height - 0.5));

        const x0 = Math.floor(cx);
        const y0 = Math.floor(cy);
        const x1 = Math.min(x0 + 1, width - 1);
        const y1 = Math.min(y0 + 1, height - 1);
        const tx = cx - x0;
        const ty = cy - y0;
        const p00 = pixels[y0 * width + x0] || 0;
        const p10 = pixels[y0 * width + x1] || 0;
        const p01 = pixels[y1 * width + x0] || 0;
        const p11 = pixels[y1 * width + x1] || 0;

        const top = p00 * (1.0 - tx) + p10 * tx;
        const bot = p01 * (1.0 - tx) + p11 * tx;
        const val = top * (1.0 - ty) + bot * ty;

        return (val / g.maxVal) * 65535.0;
    }

    /**
     * [KO] 현재 설정된 머티리얼과 VNT 아틀라스를 기반으로 가상 블렌드 텍스처(VBT) 아틀라스 전체를 재베이킹합니다.
     * [EN] Rebakes the entire Virtual Blend Texture (VBT) atlas based on the currently configured material and VNT atlas.
     */
    rebakeAllLoadedVBT(): void {
        if (!this.#vbtGenerator || !this.#vbtBaseColorAtlas || !this.#material || !this.#vntAtlasTexture) return;

        this.#vbtGenerator.bakeAtlas(
            this.#vntAtlasTexture,
            this.#vbtBaseColorAtlas,
            this.#material,
            256
        );
    }

    async #loadTileAsync(comp: LandscapeComponent): Promise<void> {
        if (!this.#tileUrlResolver) return;

        const key = comp.key;
        this.#loadingMap.set(key, true);

        try {
            const url = this.#tileUrlResolver(comp.componentZ, comp.componentX, comp);
            if (!url) return;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();

            const cpuParsed = await parse16BitPngBuffer(buffer);

            if (cpuParsed) {
                const {width, height, pixels} = cpuParsed;

                let minP = pixels[0];
                let maxP = pixels[0];
                const count = pixels.length;
                for (let i = 1; i < count; i++) {
                    const val = pixels[i];
                    if (val < minP) minP = val;
                    if (val > maxP) maxP = val;
                }
                const maxNorm = pixels instanceof Uint16Array ? 65535.0 : 255.0;
                (cpuParsed as any).maxVal = maxNorm;
                const minHeightNorm = minP / maxNorm;
                const maxHeightNorm = maxP / maxNorm;
                comp.setHeightBounds(minHeightNorm, maxHeightNorm);

                const gpuDevice = this.gpuDevice;
                const bytesPerRow = width * 2;

                const gpuTexture = gpuDevice.createTexture({
                    size: [width, height],
                    format: 'r16unorm',
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
                    label: `Landscape_Tile_16BitPngTexture_r16unorm_${key}`
                });

                gpuDevice.queue.writeTexture(
                    {texture: gpuTexture},
                    pixels.buffer,
                    {bytesPerRow},
                    [width, height]
                );

                this.#loadedMap.set(key, true);
                this.#cpuHeightMap.set(key, cpuParsed);
                this.#failedMap.delete(key);

                if (this.#vhtAtlasTexture && this.#vhtAtlasTexture.gpuTexture) {
                    const rawAtlasTexture = this.#vhtAtlasTexture.gpuTexture;
                    const TILE_PIXEL_SIZE = 512;
                    const targetX = comp.componentX * TILE_PIXEL_SIZE;
                    const targetZ = comp.componentZ * TILE_PIXEL_SIZE;

                    if (
                        targetX + TILE_PIXEL_SIZE <= rawAtlasTexture.width &&
                        targetZ + TILE_PIXEL_SIZE <= rawAtlasTexture.height
                    ) {
                        if (this.#vhtGenerator) {
                            this.#vhtGenerator.bakeTileRegion(
                                gpuTexture,
                                this.#vhtAtlasTexture,
                                targetX,
                                targetZ,
                                TILE_PIXEL_SIZE,
                                TILE_PIXEL_SIZE
                            );
                        }
                        this.commandEncoderManager.addDeferredDestroy(gpuTexture);

                        if (this.#vntAtlasTexture && this.#vntGenerator) {
                            this.#vntGenerator.bakeTileRegion(
                                this.#vhtAtlasTexture,
                                this.#vntAtlasTexture,
                                targetX,
                                targetZ,
                                TILE_PIXEL_SIZE,
                                TILE_PIXEL_SIZE,
                                this.#heightScale,
                                this.#spatialGrid.worldSizeX,
                                this.#spatialGrid.tileCountX
                            );
                        }

                        const neighborOffsets = NEIGHBOR_OFFSETS;
                        const {tileCountX, tileCountZ} = this.#spatialGrid;

                        for (let n = 0; n < neighborOffsets.length; n++) {
                            const [offsetZ, offsetX] = neighborOffsets[n];
                            const nz = comp.componentZ + offsetZ;
                            const nx = comp.componentX + offsetX;

                            if (nz >= 0 && nz < tileCountZ && nx >= 0 && nx < tileCountX) {
                                const nKey = `${nz}_${nx}`;
                                if (this.#loadedMap.has(nKey)) {
                                    const nTargetX = nx * TILE_PIXEL_SIZE;
                                    const nTargetZ = nz * TILE_PIXEL_SIZE;

                                    if (this.#vntAtlasTexture && this.#vntGenerator) {
                                        this.#vntGenerator.bakeTileRegion(
                                            this.#vhtAtlasTexture,
                                            this.#vntAtlasTexture,
                                            nTargetX,
                                            nTargetZ,
                                            TILE_PIXEL_SIZE,
                                            TILE_PIXEL_SIZE,
                                            this.#heightScale,
                                            this.#spatialGrid.worldSizeX,
                                            tileCountX
                                        );
                                    }
                                }
                            }
                        }

                        this.#onTileLoaded?.(comp);
                    }
                }
            }
        } catch (e) {
            console.warn(`[LandscapeTileStreamer ⚠️] Tile (${key}) load failed:`, e);
            this.#failedMap.set(key, performance.now());
        } finally {
            this.#loadingMap.delete(key);
        }
    }

    async #loadGlobalHeightmapAsync(): Promise<void> {
        if (!this.#globalHeightmapUrl) return;
        try {
            const response = await fetch(this.#globalHeightmapUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();
            const cpuParsed = await parse16BitPngBuffer(buffer);

            if (cpuParsed) {
                const {width, height, pixels} = cpuParsed;
                const gpuDevice = this.gpuDevice;
                const count = width * height;
                const f32Pixels = new Float32Array(count);
                const inv65535 = 1.0 / 65535.0;
                for (let i = 0; i < count; i++) {
                    f32Pixels[i] = pixels[i] * inv65535;
                }
                const bytesPerRow = width * 4;

                if (this.#globalHeightTexture) {
                    this.#globalHeightTexture.destroy();
                }

                this.#globalHeightTexture = gpuDevice.createTexture({
                    size: [width, height],
                    format: 'r32float',
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
                    label: 'Landscape_GlobalHeightTexture_r32float'
                });

                gpuDevice.queue.writeTexture(
                    {texture: this.#globalHeightTexture},
                    f32Pixels.buffer,
                    {bytesPerRow},
                    [width, height]
                );

                this.#setGlobalCPUHeightMap(cpuParsed);
                this.bakeGlobalBase();
                this.#onGlobalHeightmapBaked?.();
            }
        } catch (e) {
            console.warn('[LandscapeTileStreamer ⚠️] Failed to load globalHeightmapUrl:', this.#globalHeightmapUrl, e);
        }
    }
}

Object.freeze(LandscapeTileStreamer);
export default LandscapeTileStreamer;
