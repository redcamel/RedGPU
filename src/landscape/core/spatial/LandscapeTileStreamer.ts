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
 * [KO] 타일의 그리드 행/열 및 컴포넌트 메타데이터를 기반으로 16비트 높이맵 텍스처 URL을 반환하는 함수 타입입니다.
 * [EN] Function type resolving the 16-bit heightmap texture URL based on tile grid row/column and component metadata.
 */
export type LandscapeTileUrlResolver = (row: number, col: number, comp?: LandscapeComponent) => string;

/**
 * [KO] 카메라 위치 기반 비동기 지형 타일 스트리밍, 가상 텍스처 아틀라스(VHT/VNT/VBT) 베이킹 및 CPU 지형 고도 샘플링을 총괄하는 스트리머 클래스입니다.
 * [EN] Streamer orchestrating distance-based async terrain tile streaming, virtual texture atlas (VHT/VNT/VBT) baking, and CPU height sampling.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **거리 기반 비동기 스트리밍**: 카메라와의 거리를 감시하여 `tileLoadingRadius` 범위 내에 진입한 타일의 높이맵을 비동기 다운로드합니다. 프레임 드랍을 방지하기 위해 `tileMaxLoadsPerFrame`을 통해 프레임당 최대 로딩 개수를 엄격히 제어합니다.
 * - **가상 텍스처 아틀라스 파이프라인 총괄**:
 *   - VHT(가상 높이): 16비트 PNG 또는 원시 데이터로부터 타일 높이맵을 아틀라스에 베이킹합니다.
 *   - VNT(가상 노멀): VHT 높이 데이터를 기반으로 Sobel/중앙 차분 노멀을 실시간 베이킹합니다.
 *   - VBT(가상 베이스): 스플랫 레이어와 VNT를 융합하여 PBR 베이스컬러/노멀/ORM 아틀라스를 합성하고 타일별 독자 밉체인을 구축합니다.
 * - **고속 CPU 고도 질의 (`getInterpolatedHeightAt`)**: 캐릭터 컨트롤러나 카메라, 식생/잔디 스캐터 배치가 지형 표면에 정확히 밀착할 수 있도록 CPU 메모리에 캐싱된 16비트 높이맵 픽셀 데이터를 이중 선형 보간하여 지형 높이를 즉시 반환합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Distance-based Async Streaming**: Monitors camera positions to asynchronously stream heightmaps within `tileLoadingRadius`. Strictly regulates frame budget via `tileMaxLoadsPerFrame` to prevent stutter.
 * - **Virtual Texture Atlas Pipeline Orchestration**:
 *   - VHT (Height): Bakes tile heightmaps from 16-bit PNG or raw buffers into the VHT atlas.
 *   - VNT (Normal): Computes and bakes Sobel/central difference normals from VHT height data in real time.
 *   - VBT (Base): Composites PBR BaseColor/Normal/ORM atlases by blending splat layers with VNT normals and constructs per-tile mip-chains.
 * - **High-Speed CPU Height Queries (`getInterpolatedHeightAt`)**: Bilinearly interpolates 16-bit cached height pixels to instantly resolve terrain elevation for character controllers, cameras, and foliage/grass placement.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeTileStreamer extends RedGPUObject {
    #spatialGrid: LandscapeSpatialGrid;

    #tileLoadingRadius: number = 2500.0;
    #tileMaxLoadsPerFrame: number = 1;
    #tileUrlResolver: LandscapeTileUrlResolver | null = null;
    #onTileLoaded: ((comp: LandscapeComponent) => void) | null = null;

    #vhtAtlasTexture: DirectTexture | null = null;
    #vntAtlasTexture: DirectTexture | null = null;
    #vbtBaseColorAtlas: DirectTexture | null = null;
    #vbtNormalAtlas: DirectTexture | null = null;
    #vbtORMAtlas: DirectTexture | null = null;
    #vhtGenerator: LandscapeVHTGenerator | null = null;
    #vntGenerator: LandscapeVNTGenerator | null = null;
    #vbtGenerator: LandscapeVBTGenerator | null = null;
    #material: LandscapeMaterial | null = null;
    #globalHeightmapUrl: string = '';
    #globalHeightTexture: GPUTexture | null = null;
    #globalCPUHeightMap: { width: number; height: number; pixels: ArrayLike<number>; maxVal: number } | null = null;
    #onGlobalHeightmapBaked: (() => void) | null = null;

    #heightScale: number = 500.0;
    /**
     * [KO] LOD 0 단계의 쿼드 세그먼트 수
     * [EN] Number of quad segments for LOD 0
     */
    lod0SizeQuads: number = 256;

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
     * [KO] LandscapeTileStreamer 생성자입니다.
     * [EN] Constructor for LandscapeTileStreamer.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 / [EN] RedGPU context
     * @param spatialGrid - [KO] 공간 그리드 인스턴스 / [EN] Spatial grid instance
     * @param tileLoadingRadius - [KO] 타일 비동기 로딩 반경 (기본값: 2500) / [EN] Tile async loading radius (default: 2500)
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
     * [KO] 가상 하이트맵(VHT) 아틀라스 텍스처를 반환합니다.
     * [EN] Returns the virtual heightmap (VHT) atlas texture.
     */
    get vhtAtlasTexture(): DirectTexture | null {
        return this.#vhtAtlasTexture;
    }

    /**
     * [KO] 가상 노멀맵(VNT) 아틀라스 텍스처를 반환합니다.
     * [EN] Returns the virtual normal (VNT) atlas texture.
     */
    get vntAtlasTexture(): DirectTexture | null {
        return this.#vntAtlasTexture;
    }

    /**
     * [KO] 가상 베이크 베이스 컬러(VBT BaseColor) 아틀라스 텍스처를 반환합니다.
     * [EN] Returns the virtual baked base color (VBT BaseColor) atlas texture.
     */
    get vbtBaseColorAtlas(): DirectTexture | null {
        return this.#vbtBaseColorAtlas;
    }

    /**
     * [KO] 가상 베이크 노멀(VBT Normal) 아틀라스 텍스처를 반환합니다.
     * [EN] Returns the virtual baked normal (VBT Normal) atlas texture.
     */
    get vbtNormalAtlas(): DirectTexture | null {
        return this.#vbtNormalAtlas;
    }

    /**
     * [KO] 가상 베이크 ORM(VBT ORM) 아틀라스 텍스처를 반환합니다.
     * [EN] Returns the virtual baked ORM (VBT ORM) atlas texture.
     */
    get vbtORMAtlas(): DirectTexture | null {
        return this.#vbtORMAtlas;
    }

    /**
     * [KO] 가상 하이트맵(VHT) 생성기 인스턴스를 반환합니다.
     * [EN] Returns the LandscapeVHTGenerator instance.
     */
    get vhtGenerator(): LandscapeVHTGenerator | null {
        return this.#vhtGenerator;
    }

    /**
     * [KO] 가상 노멀맵(VNT) 생성기 인스턴스를 반환합니다.
     * [EN] Returns the LandscapeVNTGenerator instance.
     */
    get vntGenerator(): LandscapeVNTGenerator | null {
        return this.#vntGenerator;
    }

    /**
     * [KO] 가상 베이크 텍스처(VBT) 생성기 인스턴스를 반환합니다.
     * [EN] Returns the LandscapeVBTGenerator instance.
     */
    get vbtGenerator(): LandscapeVBTGenerator | null {
        return this.#vbtGenerator;
    }

    /**
     * [KO] 전체 지형의 저해상도 글로벌 높이맵 URL을 반환합니다.
     * [EN] Returns the global low-resolution heightmap URL.
     */
    get globalHeightmapUrl(): string {
        return this.#globalHeightmapUrl;
    }

    /**
     * [KO] 글로벌 높이맵 URL을 설정하고 비동기 다운로드 및 베이스 아틀라스 베이킹을 시작합니다.
     * [EN] Sets the global heightmap URL and initiates async download and base atlas baking.
     */
    set globalHeightmapUrl(val: string) {
        if (this.#globalHeightmapUrl !== val) {
            this.#globalHeightmapUrl = val;
            this.#loadGlobalHeightmapAsync();
        }
    }

    /**
     * [KO] 글로벌 높이맵 GPUTexture 인스턴스를 반환합니다.
     * [EN] Returns the global heightmap GPUTexture instance.
     */
    get globalHeightTexture(): GPUTexture | null {
        return this.#globalHeightTexture;
    }

    /**
     * [KO] 카메라 기준 타일 활성화 로딩 반경(기본값: 2500)을 반환합니다.
     * [EN] Returns the camera tile loading radius (default: 2500).
     */
    get tileLoadingRadius(): number {
        return this.#tileLoadingRadius;
    }

    /**
     * [KO] 카메라 기준 타일 활성화 로딩 반경을 설정합니다. (최소값: 100)
     * [EN] Sets the camera tile loading radius (minimum: 100).
     */
    set tileLoadingRadius(val: number) {
        this.#tileLoadingRadius = Math.max(100, val);
    }

    /**
     * [KO] 프레임당 최대 비동기 타일 다운로드 요청 수를 반환합니다.
     * [EN] Returns the maximum async tile loads initiated per frame.
     */
    get tileMaxLoadsPerFrame(): number {
        return this.#tileMaxLoadsPerFrame;
    }

    /**
     * [KO] 프레임당 최대 비동기 타일 다운로드 요청 수를 설정합니다. (최소값: 1)
     * [EN] Sets the maximum async tile loads initiated per frame (minimum: 1).
     */
    set tileMaxLoadsPerFrame(val: number) {
        this.#tileMaxLoadsPerFrame = Math.max(1, val);
    }

    /**
     * [KO] 등록된 타일 URL 리졸버 함수를 반환합니다.
     * [EN] Returns the registered tile URL resolver function.
     */
    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileUrlResolver;
    }

    /**
     * [KO] 타일 URL 리졸버 함수를 설정하고 타일 캐시 상태를 리셋합니다.
     * [EN] Sets the tile URL resolver function and resets tile cache states.
     */
    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileUrlResolver = resolver;
        this.resetTileState();
    }

    /**
     * [KO] 현재 완전히 로드되어 아틀라스에 베이킹된 타일의 총 개수를 반환합니다.
     * [EN] Returns the total count of tiles fully loaded and baked into the atlas.
     */
    get tileLoadedCount(): number {
        return this.#loadedMap.size;
    }

    /**
     * [KO] 카메라 위치에 따라 로딩 반경 내 미로딩 타일을 수집하고 우선순위(거리순)로 정렬하여 프레임당 로딩 한도 내에서 비동기 로딩을 트리거합니다.
     * [EN] Collects unloaded tiles within the camera radius, sorts them by distance priority, and triggers async loads within per-frame budgets.
     *
     * @param cameraX - [KO] 카메라 월드 X 좌표 / [EN] Camera world X coordinate
     * @param cameraZ - [KO] 카메라 월드 Z 좌표 / [EN] Camera world Z coordinate
     * @param cameraY - [KO] 카메라 월드 Y 고도 / [EN] Camera world Y elevation
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
     * [KO] 모든 로딩 중, 로딩 완료, 실패 상태 및 CPU 높이 캐시를 초기화합니다.
     * [EN] Resets all loading, loaded, failed tile states, and CPU height cache.
     */
    resetTileState(): void {
        this.#loadingMap.clear();
        this.#loadedMap.clear();
        this.#failedMap.clear();
        this.#cpuHeightMap.clear();
        this.#pendingQueue.length = 0;
    }

    /**
     * [KO] 지정된 아틀라스 타입에 해당하는 DirectTexture 인스턴스를 반환합니다.
     * [EN] Returns the DirectTexture instance corresponding to the specified atlas type.
     *
     * @param type - [KO] 요청할 아틀라스 타입 / [EN] Requested atlas type
     */
    getAtlasTexture(type: 'vht' | 'vnt' | 'vbtBaseColor' | 'vbtNormal' | 'vbtORM'): DirectTexture | null {
        switch (type) {
            case 'vht':
                return this.#vhtAtlasTexture;
            case 'vnt':
                return this.#vntAtlasTexture;
            case 'vbtBaseColor':
                return this.#vbtBaseColorAtlas;
            case 'vbtNormal':
                return this.#vbtNormalAtlas;
            case 'vbtORM':
                return this.#vbtORMAtlas;
            default:
                return null;
        }
    }

    /**
     * [KO] 지정된 타일 개수에 맞추어 VHT, VNT 및 VBT 아틀라스 텍스처 크기를 재할당하고 보장합니다.
     * [EN] Ensures and reallocates VHT, VNT, and VBT atlas texture sizes according to the given component counts.
     *
     * @param componentCountX - [KO] X축 컴포넌트(타일) 개수 / [EN] Component count along X axis
     * @param componentCountZ - [KO] Z축 컴포넌트(타일) 개수 / [EN] Component count along Z axis
     * @returns [KO] 텍스처가 새로 재생성되었으면 true, 기존 크기와 일치하면 false / [EN] True if textures were recreated, false if unchanged
     */
    ensureAtlasSize(componentCountX: number, componentCountZ: number): boolean {
        const targetAtlasW = componentCountX * 512;
        const targetAtlasH = componentCountZ * 512;

        if (
            this.#vhtAtlasTexture &&
            this.#vhtAtlasTexture.gpuTexture.width === targetAtlasW &&
            this.#vhtAtlasTexture.gpuTexture.height === targetAtlasH
        ) {
            return false;
        }

        if (this.#vhtAtlasTexture) this.#vhtAtlasTexture.destroy();
        if (this.#vntAtlasTexture) this.#vntAtlasTexture.destroy();
        if (this.#vbtBaseColorAtlas) this.#vbtBaseColorAtlas.destroy();
        if (this.#vbtNormalAtlas) this.#vbtNormalAtlas.destroy();
        if (this.#vbtORMAtlas) this.#vbtORMAtlas.destroy();

        const redGPUContext = this.redGPUContext;
        const gpuDevice = redGPUContext.gpuDevice;

        const rawVhtTexture = gpuDevice.createTexture({
            size: [targetAtlasW, targetAtlasH],
            format: 'r32float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_VHT_AtlasTexture'
        });
        this.#vhtAtlasTexture = new DirectTexture(redGPUContext, 'Landscape_VHT_AtlasTexture', rawVhtTexture);

        const rawVntTexture = gpuDevice.createTexture({
            size: [targetAtlasW, targetAtlasH],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VNT_AtlasTexture'
        });
        this.#vntAtlasTexture = new DirectTexture(redGPUContext, 'Landscape_VNT_AtlasTexture', rawVntTexture);

        const rawVbtBaseColor = gpuDevice.createTexture({
            size: [targetAtlasW, targetAtlasH],
            mipLevelCount: 6,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VBT_BaseColorAtlasTexture'
        });
        this.#vbtBaseColorAtlas = new DirectTexture(redGPUContext, 'Landscape_VBT_BaseColorAtlasTexture', rawVbtBaseColor);

        const rawVbtNormal = gpuDevice.createTexture({
            size: [targetAtlasW, targetAtlasH],
            mipLevelCount: 6,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VBT_NormalAtlasTexture'
        });
        this.#vbtNormalAtlas = new DirectTexture(redGPUContext, 'Landscape_VBT_NormalAtlasTexture', rawVbtNormal);

        const rawVbtORM = gpuDevice.createTexture({
            size: [targetAtlasW, targetAtlasH],
            mipLevelCount: 6,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VBT_ORMAtlasTexture'
        });
        this.#vbtORMAtlas = new DirectTexture(redGPUContext, 'Landscape_VBT_ORMAtlasTexture', rawVbtORM);

        return true;
    }

    /**
     * [KO] VBT 베이킹에 사용할 지형 머티리얼을 지정합니다.
     * [EN] Sets the landscape material used for VBT atlas baking.
     *
     * @param mat - [KO] 지형 머티리얼 인스턴스 / [EN] Landscape material instance
     */
    setMaterial(mat: LandscapeMaterial | null): void {
        this.#material = mat;
    }

    /**
     * [KO] 새로운 공간 그리드를 연결하고 기존 스트리밍 상태를 리셋합니다.
     * [EN] Assigns a new spatial grid and resets existing streaming states.
     *
     * @param grid - [KO] 새로운 공간 그리드 인스턴스 / [EN] New spatial grid instance
     */
    setSpatialGrid(grid: LandscapeSpatialGrid): void {
        this.#spatialGrid = grid;
        this.resetTileState();
    }

    /**
     * [KO] 개별 타일의 텍스처 로딩 및 베이킹이 완료되었을 때 실행될 콜백을 설정합니다.
     * [EN] Sets the callback invoked when an individual tile texture is loaded and baked.
     *
     * @param callback - [KO] 타일 로드 완료 콜백 / [EN] Tile loaded callback
     */
    setOnTileLoaded(callback: ((tileComponent: LandscapeComponent) => void) | null): void {
        this.#onTileLoaded = callback;
    }

    /**
     * [KO] 전체 아틀라스를 글로벌 베이스 높이맵으로 일괄 베이킹(VHT, VNT, VBT)합니다.
     * [EN] Bakes the entire atlas with the global base heightmap across VHT, VNT, and VBT.
     *
     * @param globalHeightTexture - [KO] 대상 글로벌 높이 텍스처 / [EN] Target global height texture
     * @param componentCountX - [KO] X축 컴포넌트 수 / [EN] Component count along X
     * @param componentCountZ - [KO] Z축 컴포넌트 수 / [EN] Component count along Z
     * @param heightScale - [KO] 지형 높이 스케일 / [EN] Terrain height scale
     * @param worldSizeX - [KO] 지형 월드 X 크기 / [EN] Terrain world X size
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

        this.#vhtGenerator?.bakeGlobalBase(
            tex,
            this.#vhtAtlasTexture,
            countX,
            countZ
        );

        this.#vntGenerator?.bakeTileRegion(
            this.#vhtAtlasTexture,
            this.#vntAtlasTexture,
            0, 0,
            atlasW, atlasH,
            hScale,
            wsX,
            countX
        );

        this.rebakeAllLoadedVBT();
    }

    /**
     * [KO] 글로벌 높이맵 베이킹 완료 시 호출될 콜백을 등록합니다.
     * [EN] Registers the callback invoked when global heightmap baking is completed.
     *
     * @param callback - [KO] 완료 콜백 함수 / [EN] Completion callback function
     */
    setOnGlobalHeightmapBaked(callback: (() => void) | null): void {
        this.#onGlobalHeightmapBaked = callback;
    }

    /**
     * [KO] 모든 아틀라스 텍스처, 제너레이터 및 내부 상태를 파괴하고 메모리를 해제합니다.
     * [EN] Destroys all atlas textures, generators, and internal states, releasing GPU memory.
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

        if (this.#vhtAtlasTexture) {
            this.#vhtAtlasTexture.destroy();
            this.#vhtAtlasTexture = null;
        }
        if (this.#vntAtlasTexture) {
            this.#vntAtlasTexture.destroy();
            this.#vntAtlasTexture = null;
        }
        if (this.#vbtBaseColorAtlas) {
            this.#vbtBaseColorAtlas.destroy();
            this.#vbtBaseColorAtlas = null;
        }
        if (this.#vbtNormalAtlas) {
            this.#vbtNormalAtlas.destroy();
            this.#vbtNormalAtlas = null;
        }
        if (this.#vbtORMAtlas) {
            this.#vbtORMAtlas.destroy();
            this.#vbtORMAtlas = null;
        }

        this.#material = null;
        this.#tileUrlResolver = null;
        this.#onTileLoaded = null;
        this.#onGlobalHeightmapBaked = null;
    }

    /**
     * [KO] 글로벌 높이맵 GPUTexture를 직접 지정합니다.
     * [EN] Directly assigns the global heightmap GPUTexture.
     *
     * @param tex - [KO] 글로벌 높이맵 GPUTexture / [EN] Global heightmap GPUTexture
     */
    setGlobalHeightTexture(tex: GPUTexture | null): void {
        this.#globalHeightTexture = tex;
    }

    /**
     * [KO] CPU 측 레이캐스팅 및 고도 샘플링에 사용될 글로벌 높이맵 픽셀 데이터를 설정합니다.
     * [EN] Sets global CPU heightmap pixel data used for elevation sampling and raycasting.
     *
     * @param data - [KO] 글로벌 높이맵 픽셀 버퍼 객체 / [EN] Global heightmap pixel buffer data
     */
    setGlobalCPUHeightMap(data: {
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
     * [KO] 지정된 타일 영역을 고해상도 타일 데이터에서 글로벌 저해상도 베이스 높이 데이터로 복원합니다.
     * [EN] Restores a tile region in the atlas from high-res tile data back to the global low-res base height.
     *
     * @param comp - [KO] 복원할 타일 컴포넌트 / [EN] Tile component to restore
     */
    restoreTileToGlobalBase(comp: LandscapeComponent): void {
        if (!this.#globalHeightTexture || !this.#vhtAtlasTexture || !this.#vhtGenerator || !this.#spatialGrid) return;
        const TILE_PIXEL_SIZE = 512;
        const targetX = comp.componentX * TILE_PIXEL_SIZE;
        const targetZ = comp.componentZ * TILE_PIXEL_SIZE;
        const compCountX = this.#spatialGrid.tileCountX;
        const compCountZ = this.#spatialGrid.tileCountZ;

        const uMin = comp.componentX / compCountX;
        const vMin = comp.componentZ / compCountZ;
        const uMax = (comp.componentX + 1) / compCountX;
        const vMax = (comp.componentZ + 1) / compCountZ;

        this.#vhtGenerator.bakeGlobalRegion(
            this.#globalHeightTexture,
            this.#vhtAtlasTexture,
            targetX,
            targetZ,
            TILE_PIXEL_SIZE,
            TILE_PIXEL_SIZE,
            uMin,
            vMin,
            uMax,
            vMax
        );

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
                compCountX
            );
        }
    }

    /**
     * [KO] 지형의 최대 높이 스케일 설정을 갱신합니다.
     * [EN] Updates the terrain height scale configuration.
     *
     * @param heightScale - [KO] 지형 높이 스케일 / [EN] Terrain height scale
     */
    setTerrainConfig(heightScale: number): void {
        this.#heightScale = heightScale;
    }

    /**
     * [KO] 현재 로드된 모든 타일의 가상 노멀맵(VNT)을 재계산하여 아틀라스에 다시 베이킹합니다.
     * [EN] Recalculates and rebakes virtual normal maps (VNT) for all currently loaded tiles.
     */
    rebakeAllLoadedVNT(): void {
        if (!this.#vhtAtlasTexture || !this.#vntAtlasTexture || !this.#vntGenerator || !this.#spatialGrid) return;

        const TILE_PIXEL_SIZE = 512;
        const vhtAtlas = this.#vhtAtlasTexture;
        const vntAtlas = this.#vntAtlasTexture;
        const vntGen = this.#vntGenerator;
        const heightScale = this.#heightScale;
        const worldSizeX = this.#spatialGrid.worldSizeX;
        const componentCountX = this.#spatialGrid.tileCountX;
        const componentCountZ = this.#spatialGrid.tileCountZ;

        for (const key of this.#cpuHeightMap.keys()) {
            const parts = key.split('_');
            const row = parseInt(parts[0], 10);
            const col = parseInt(parts[1], 10);

            if (row >= componentCountZ || col >= componentCountX) continue;

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
                componentCountX
            );
        }
    }

    /**
     * [KO] 특정 행과 열의 타일이 메모리에 로드되어 있는지 여부를 확인합니다.
     * [EN] Checks whether the tile at the specified row and column is loaded.
     *
     * @param row - [KO] 그리드 행 인덱스 / [EN] Grid row index
     * @param col - [KO] 그리드 컬럼 인덱스 / [EN] Grid column index
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
     * [KO] 임의의 월드 X, Z 위치에서의 정확한 지형 고도(Y)를 CPU에서 쌍선형 보간(Bilinear Interpolation)하여 반환합니다.
     * [EN] Returns the exact terrain elevation (Y) at an arbitrary world X, Z position via bilinear interpolation on CPU.
     *
     * @param x - [KO] 월드 X 좌표 / [EN] World X coordinate
     * @param z - [KO] 월드 Z 좌표 / [EN] World Z coordinate
     * @returns [KO] 계산된 월드 Y 고도값 / [EN] Computed world Y elevation
     */
    getHeightAt(x: number, z: number): number {
        if (!this.#spatialGrid) return 0.0;

        const grid = this.#spatialGrid;
        const halfWX = grid.halfWorldSizeX;
        const halfWZ = grid.halfWorldSizeZ;

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

        const tileSizeX = grid.tileSizeX;
        const tileSizeZ = grid.tileSizeZ;
        const tileMinX = col * tileSizeX - halfWX;
        const tileMinZ = row * tileSizeZ - halfWZ;

        const segments = this.lod0SizeQuads || 256;
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

        const worldSizeX = grid.worldSizeX;
        const worldSizeZ = grid.worldSizeZ;
        const texSizeX = grid.tileCountX * 512;
        const texSizeZ = grid.tileCountZ * 512;

        const v00_x = tileMinX + ix * stepX;
        const v00_z = tileMinZ + iz * stepZ;
        const v10_x = v00_x + stepX;
        const v01_z = v00_z + stepZ;

        const gU0 = (v00_x + halfWX) / worldSizeX;
        const gV0 = (v00_z + halfWZ) / worldSizeZ;
        const gU1 = (v10_x + halfWX) / worldSizeX;
        const gV1 = (v01_z + halfWZ) / worldSizeZ;

        const globalTexX0 = Math.min(texSizeX - 1, Math.max(0, Math.floor(gU0 * texSizeX)));
        const globalTexZ0 = Math.min(texSizeZ - 1, Math.max(0, Math.floor(gV0 * texSizeZ)));
        const globalTexX1 = Math.min(texSizeX - 1, Math.max(0, Math.floor(gU1 * texSizeX)));
        const globalTexZ1 = Math.min(texSizeZ - 1, Math.max(0, Math.floor(gV1 * texSizeZ)));

        let h00 = 0;
        let h10 = 0;
        let h01 = 0;
        let h11 = 0;

        if (tileData) {
            const tX0 = Math.min(511, Math.max(0, globalTexX0 - col * 512));
            const tZ0 = Math.min(511, Math.max(0, globalTexZ0 - row * 512));
            const tX1 = Math.min(511, Math.max(0, globalTexX1 - col * 512));
            const tZ1 = Math.min(511, Math.max(0, globalTexZ1 - row * 512));

            const pixels = tileData.pixels;
            const w = tileData.width;

            h00 = pixels[tZ0 * w + tX0] || 0;
            h10 = pixels[tZ0 * w + tX1] || 0;
            h01 = pixels[tZ1 * w + tX0] || 0;
            h11 = pixels[tZ1 * w + tX1] || 0;
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
        const W = g.width;
        const H = g.height;
        const cx = Math.max(0.0, Math.min(W - 1.0, u * W - 0.5));
        const cy = Math.max(0.0, Math.min(H - 1.0, v * H - 0.5));

        const x0 = Math.floor(cx);
        const y0 = Math.floor(cy);
        const x1 = Math.min(x0 + 1, W - 1);
        const y1 = Math.min(y0 + 1, H - 1);
        const tx = cx - x0;
        const ty = cy - y0;

        const pixels = g.pixels;
        const p00 = pixels[y0 * W + x0] || 0;
        const p10 = pixels[y0 * W + x1] || 0;
        const p01 = pixels[y1 * W + x0] || 0;
        const p11 = pixels[y1 * W + x1] || 0;

        const top = p00 * (1.0 - tx) + p10 * tx;
        const bot = p01 * (1.0 - tx) + p11 * tx;
        const val = top * (1.0 - ty) + bot * ty;

        return (val / g.maxVal) * 65535.0;
    }

    /**
     * [KO] 머티리얼 레이어 정보를 기반으로 전체 VBT(베이스 컬러, 노멀, ORM) 아틀라스를 다시 베이킹합니다.
     * [EN] Rebakes the full VBT (base color, normal, ORM) atlases based on material layer configurations.
     *
     * @param _budgetPerFrame - [KO] 프레임당 베이킹 예산 (선택 사항) / [EN] Optional baking budget per frame
     */
    rebakeAllLoadedVBT(_budgetPerFrame?: number): void {
        if (!this.#vbtGenerator || !this.#vbtBaseColorAtlas || !this.#vbtNormalAtlas || !this.#vbtORMAtlas || !this.#material || !this.#vntAtlasTexture) return;

        this.#vbtGenerator.bakeAtlas(
            this.#vntAtlasTexture,
            this.#vbtBaseColorAtlas,
            this.#vbtNormalAtlas,
            this.#vbtORMAtlas,
            this.#material,
            512
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
                        const tileCountX = this.#spatialGrid.tileCountX;
                        const tileCountZ = this.#spatialGrid.tileCountZ;

                        for (let n = 0; n < neighborOffsets.length; n++) {
                            const nz = comp.componentZ + neighborOffsets[n][0];
                            const nx = comp.componentX + neighborOffsets[n][1];

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

                this.setGlobalCPUHeightMap(cpuParsed);
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
