import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import FoliageSubMeshAssembler from "./core/assembler/FoliageSubMeshAssembler";
import FoliageSubCellPartitioner from "./core/spatial/FoliageSubCellPartitioner";
import FoliageSubCellStreamer from "./core/spatial/FoliageSubCellStreamer";

import FoliageSubMesh from "./FoliageSubMesh";
import FoliageShadowMergedSubMesh from "./core/submesh/FoliageShadowMergedSubMesh";
import FoliageMegaBuffer, {FoliageTypeAllocation} from "./core/buffer/FoliageMegaBuffer";
import FOLIAGE_TYPE from "./FOLIAGE_TYPE";

export {FoliageSubMesh, FoliageShadowMergedSubMesh};

export interface FoliageLODConfig {

    mesh: Mesh | Mesh[];

    lodDistance?: number;

    receiveShadow?: boolean;
}

export interface FoliageLODInfo {
    lodIndex: number;
    lodDistance: number;
    subMeshOffset: number;
    subMeshCount: number;
    receiveShadow?: boolean;
}

export interface FoliageTypeOptions {
    name: string;

    lods: FoliageLODConfig[];

    /**
     * [KO] 타일당 목표 스폰 인스턴스 수 (1000m x 1000m 타일 기준, 기본값: 5000)
     * [EN] Target instance count per tile
     * @default 5000
     */
    instancesPerTile?: number;

    /**
     * [KO] @deprecated 스트리밍 환경에서는 streamingRadius, instancesPerTile, densityMultiplier를 기반으로 GPU 버퍼 용량이 100% 자동 산출됩니다.
     * [EN] @deprecated Automatically derived from streamingRadius, instancesPerTile, and densityMultiplier.
     */
    maxInstances?: number;

    cullingDistance?: number;
    fadeStartDistance?: number;

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;

    useImpostor?: boolean;

    /**
     * [KO] 스캐터 인스턴스 분류 타입 ('foliage' | 'grass' | 'basic')
     * [EN] Scatter instance classification type ('foliage' | 'grass' | 'basic')
     * @default FOLIAGE_TYPE.FOLIAGE
     */
    type?: FOLIAGE_TYPE;

    /** @deprecated Use type instead */
    isFoliage?: boolean;

    useDepthPrepass?: boolean;

    bottomOffset?: number;

    castShadow?: boolean;

    /**
     * [KO] 해당 식생이 그림자를 투영(Casting)할 최대 물리적 거리 (m)
     * [EN] Maximum shadow casting distance in meters
     * @default 300.0
     */
    maxShadowDistance?: number;

    /**
     * [KO] 서브셀 단위 스트리밍 활성화 여부
     * [EN] Enable sub-cell streaming
     * @default true
     */
    enableStreaming?: boolean;

    /**
     * [KO] 스트리밍 로드 반경 (m)
     * [EN] Streaming load radius in meters
     * @default 600.0
     */
    streamingRadius?: number;

    /**
     * [KO] 서브셀 격자 크기 (m)
     * [EN] Sub-cell grid size in meters
     * @default 100.0
     */
    subCellSize?: number;

    /**
     * [KO] 타겟 지형 스플랫 레이어 명칭 (예: 'Grass', 'Rock') 또는 인덱스. 지정하지 않으면 전역 배치.
     * [EN] Target landscape splat layer name or index. If undefined, spawns globally.
     */
    targetLayer?: string | number;

    /**
     * [KO] 식생이 스폰되기 위한 최소 스플랫맵 가중치 (0.0 ~ 1.0)
     * [EN] Minimum splat map weight threshold for spawning
     * @default 0.1
     */
    minWeightThreshold?: number;

    /**
     * [KO] 식생 스폰 최소 경사각 (도, Degree)
     * [EN] Minimum terrain slope angle in degrees
     * @default 0.0
     */
    minSlope?: number;

    /**
     * [KO] 식생 스폰 최대 경사각 (도, Degree)
     * [EN] Maximum terrain slope angle in degrees
     * @default 45.0
     */
    maxSlope?: number;

    /**
     * [KO] 가중치 비례 밀도 적용 여부
     * [EN] Whether to scale spawn density proportional to layer weight
     * @default true
     */
    densityScaleByWeight?: boolean;


    /**
     * [KO] 스폰 밀도 배율 계수
     * [EN] Density multiplier scale factor
     * @default 1.0
     */
    densityMultiplier?: number;
}

class FoliageType {
    #options: FoliageTypeOptions;
    #redGPUContext: RedGPUContext;

    #subMeshes: FoliageSubMesh[] = [];
    #depthPrepassSubMeshes: FoliageSubMesh[] = [];
    #mainSubMeshes: FoliageSubMesh[] = [];
    #shadowMergedSubMeshes: FoliageShadowMergedSubMesh[] = [];
    #lodInfoList: FoliageLODInfo[] = [];

    #megaBuffer: FoliageMegaBuffer | null = null;
    #allocation: FoliageTypeAllocation | null = null;

    #cullingDistance: number = 2000.0;
    #fadeStartDistance: number = 1500.0;
    #activeInstanceCount: number = 0;
    #bottomOffset: number = 0;
    #boundingRadius: number = 10.0;
    #nameHash: number = 0;
    #type: FOLIAGE_TYPE = FOLIAGE_TYPE.FOLIAGE;
    #castShadow: boolean = true;
    #maxShadowDistance: number = 300.0;
    #useImpostor: boolean = true;
    #isFoliage: boolean = true;
    #useDepthPrepass: boolean = true;
    #enableStreaming: boolean = true;
    #streamingRadius: number = 600.0;
    #subCellSize: number = 100.0;
    #targetLayer?: string | number;
    #minWeightThreshold: number = 0.1;
    #minSlope: number = 0.0;
    #maxSlope: number = 45.0;
    #densityScaleByWeight: boolean = true;
    #instancesPerTile?: number;
    #densityMultiplier: number = 1.0;
    #impostorSubMesh: FoliageSubMesh | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #loadedTileKeys: Set<number> = new Set();
    #streamer: FoliageSubCellStreamer;
    #onDirty?: () => void;

    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageTypeOptions,
        sharedSubMeshBindGroupLayout?: GPUBindGroupLayout | null,
        megaBuffer?: FoliageMegaBuffer | null,
        onDirty?: () => void
    ) {
        this.#streamer = new FoliageSubCellStreamer(this);
        this.#redGPUContext = redGPUContext;
        this.#options = options;
        this.#onDirty = onDirty;
        this.#castShadow = options.castShadow !== false;

        const resolvedType: FOLIAGE_TYPE = options.type
            || (options.isFoliage === false ? FOLIAGE_TYPE.BASIC : FOLIAGE_TYPE.FOLIAGE);
        this.#type = resolvedType;

        const isBasic = resolvedType === FOLIAGE_TYPE.BASIC;
        const isGrass = resolvedType === FOLIAGE_TYPE.GRASS;

        this.#isFoliage = !isBasic;
        this.#useImpostor = options.useImpostor !== undefined
            ? options.useImpostor
            : (!isBasic && !isGrass);
        this.#useDepthPrepass = options.useDepthPrepass !== undefined
            ? options.useDepthPrepass
            : !isBasic;

        let defaultShadowDist = 300.0;
        if (isGrass) defaultShadowDist = 35.0;
        else if (isBasic) defaultShadowDist = 150.0;

        this.#maxShadowDistance = options.maxShadowDistance !== undefined
            ? Math.max(0, Number(options.maxShadowDistance) || 0)
            : defaultShadowDist;

        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;
        this.#megaBuffer = megaBuffer || null;

        this.#cullingDistance = options.cullingDistance ?? 2000.0;
        this.#fadeStartDistance = options.fadeStartDistance ?? 1500.0;

        const minScale: [number, number, number] = options.minScale ? [...options.minScale] : [1.0, 1.0, 1.0];
        const maxScale: [number, number, number] = options.maxScale ? [...options.maxScale] : [1.0, 1.0, 1.0];

        const instancesPerTile = options.instancesPerTile ?? 5000;
        const densityMultiplier = options.densityMultiplier ?? 1.0;
        const streamingRadius = options.streamingRadius ?? 600.0;
        const subCellSize = options.subCellSize ?? 100.0;

        // 스트리밍 기반 GPU 버퍼 용량 자동 산출 (Phase 3.1)
        // 1. 유효 스트리밍 반경 (히스테리시스 150m 포함)
        const effectiveRadius = streamingRadius + 150.0;
        const cellArea = subCellSize * subCellSize;

        // 2. 최대 동시 활성 서브셀 수 (원형 면적 + 안전 계수 1.25)
        const maxActiveSubCells = Math.ceil((Math.PI * effectiveRadius * effectiveRadius / cellArea) * 1.25);

        // 3. 서브셀당 평균 인스턴스 수 (1000m 타일 = 10x10 = 100 서브셀)
        const avgInstancesPerSubCell = (instancesPerTile / 100.0) * densityMultiplier;

        // 4. 안전 버퍼 용량 (30% 여유 마진 및 64 배수 정렬)
        const calculatedMax = Math.ceil((maxActiveSubCells * avgInstancesPerSubCell * 1.30) / 64) * 64;

        // 최소 안전 용량: 16,384개 (16K 슬롯)
        // WebGPU 표준 maxBufferSize(256MB) 한도 준수 (5개 타입 등록 시 메가버퍼 ~83MB)
        // 스트리밍 반경 600m 내 최대 활성 인스턴스(약 4,000~5,000개) 대비 3배 이상의 충분한 버퍼 여유 제공
        const minSafeCapacity = 16384;

        // 5. 사용자가 명시하지 않은 경우 calculatedMax와 minSafeCapacity 중 큰 값 사용
        const resolvedMaxInstances = options.maxInstances !== undefined
            ? Math.max(options.maxInstances, calculatedMax, minSafeCapacity)
            : Math.max(calculatedMax, minSafeCapacity);

        this.#options = Object.freeze({
            name: options.name,
            type: this.#type,
            lods: options.lods,
            maxInstances: resolvedMaxInstances,
            cullingDistance: this.#cullingDistance,
            fadeStartDistance: this.#fadeStartDistance,
            minScale,
            maxScale,
            randomRotationY: options.randomRotationY ?? true,
            useImpostor: this.#useImpostor,
            isFoliage: this.#isFoliage,
            useDepthPrepass: this.#useDepthPrepass,
            bottomOffset: options.bottomOffset,
            castShadow: this.#castShadow,
            maxShadowDistance: this.#maxShadowDistance,
            enableStreaming: options.enableStreaming !== false,
            streamingRadius,
            subCellSize,
            targetLayer: options.targetLayer,
            minWeightThreshold: options.minWeightThreshold ?? 0.1,
            minSlope: options.minSlope ?? 0.0,
            maxSlope: options.maxSlope ?? 45.0,
            densityScaleByWeight: options.densityScaleByWeight !== false,
            instancesPerTile,
            densityMultiplier
        });

        this.#enableStreaming = this.#options.enableStreaming!;
        this.#streamingRadius = this.#options.streamingRadius!;
        this.#subCellSize = this.#options.subCellSize!;
        this.#targetLayer = this.#options.targetLayer;
        this.#minWeightThreshold = this.#options.minWeightThreshold!;
        this.#minSlope = this.#options.minSlope!;
        this.#maxSlope = this.#options.maxSlope!;
        this.#densityScaleByWeight = this.#options.densityScaleByWeight!;
        this.#instancesPerTile = this.#options.instancesPerTile;
        this.#densityMultiplier = this.#options.densityMultiplier!;

        let hash = 0;
        const nameStr = this.#options.name || '';
        for (let c = 0; c < nameStr.length; c++) {
            hash = (hash * 31 + nameStr.charCodeAt(c)) | 0;
        }
        this.#nameHash = hash;

        const assembleResult = FoliageSubMeshAssembler.assemble(
            this.#redGPUContext,
            this.#options,
            this.#subMeshVertexBindGroupLayout!
        );
        this.#subMeshes = assembleResult.subMeshes;
        this.#shadowMergedSubMeshes = assembleResult.shadowMergedSubMeshes || [];
        this.#lodInfoList = assembleResult.lodInfoList || [];
        const userOffset = options.bottomOffset;
        this.#bottomOffset = userOffset !== undefined ? userOffset : (assembleResult.bottomOffset ?? 0);
        this.#boundingRadius = assembleResult.boundingRadius || 10.0;
        let impostorSub: FoliageSubMesh | null = null;
        for (let i = 0; i < this.#subMeshes.length; i++) {
            if (this.#subMeshes[i].isImpostor) {
                impostorSub = this.#subMeshes[i];
                break;
            }
        }
        this.#impostorSubMesh = impostorSub;

        this.#updatePassBuckets();

        if (this.#megaBuffer) {
            this.#allocation = this.#megaBuffer.allocateTypeSegment(
                this.#options.name,
                this.#options.maxInstances,
                this.#subMeshes,
                this.#shadowMergedSubMeshes,
                this.#lodInfoList
            );
            const effectiveShadowDist = this.#castShadow ? this.#maxShadowDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                this.#allocation,
                this.#cullingDistance,
                this.#fadeStartDistance,
                this.#boundingRadius,
                this.#bottomOffset,
                this.#lodInfoList,
                effectiveShadowDist
            );
        }
    }

    get name(): string {
        return this.#options.name;
    }

    get nameHash(): number {
        return this.#nameHash;
    }

    /**
     * [KO] @deprecated bufferCapacity를 사용하세요.
     * [EN] @deprecated Use bufferCapacity instead.
     */
    get maxInstances(): number {
        return this.bufferCapacity;
    }

    /**
     * [KO] GPU 메가버퍼에 할당된 최대 인스턴스 수용 용량 (슬롯 수)
     * [EN] Allocated maximum instance capacity in GPU MegaBuffer
     */
    get bufferCapacity(): number {
        return this.#allocation ? this.#allocation.maxInstances : (this.#options.maxInstances ?? 0);
    }



    get minScale(): readonly [number, number, number] {
        return this.#options.minScale;
    }

    get maxScale(): readonly [number, number, number] {
        return this.#options.maxScale;
    }

    get randomRotationY(): boolean {
        return this.#options.randomRotationY;
    }

    get options(): FoliageTypeOptions {
        return this.#options;
    }

    get allocation(): FoliageTypeAllocation | null {
        return this.#allocation;
    }

    get megaBuffer(): FoliageMegaBuffer | null {
        return this.#megaBuffer;
    }

    get subMeshes(): readonly FoliageSubMesh[] {
        return this.#subMeshes;
    }

    get depthPrepassSubMeshes(): readonly FoliageSubMesh[] {
        return this.#depthPrepassSubMeshes;
    }

    get mainSubMeshes(): readonly FoliageSubMesh[] {
        return this.#mainSubMeshes;
    }

    get shadowMergedSubMeshes(): readonly FoliageShadowMergedSubMesh[] {
        return this.#shadowMergedSubMeshes;
    }


    getShadowMergedMesh(lodIndex: number): FoliageShadowMergedSubMesh | null {
        for (let i = 0; i < this.#shadowMergedSubMeshes.length; i++) {
            if (this.#shadowMergedSubMeshes[i].lodIndex === lodIndex) {
                return this.#shadowMergedSubMeshes[i];
            }
        }
        return null;
    }

    get lodInfoList(): readonly FoliageLODInfo[] {
        return this.#lodInfoList;
    }

    get activeInstanceCount(): number {
        return this.#allocation ? this.#allocation.activeCount : this.#activeInstanceCount;
    }

    /**
     * [KO] 로드된 모든 타일에서 분할되어 CPU 캐시에 보관된 총 인스턴스 수
     * [EN] Total instances partitioned across all loaded tiles and cached on CPU
     */
    get totalInstanceCount(): number {
        return this.#streamer.totalInstanceCount;
    }

    get boundingRadius(): number {
        return this.#boundingRadius;
    }

    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    set bottomOffset(val: number) {
        if (this.#bottomOffset !== val) {
            this.#bottomOffset = val;
            this.#syncTypeParams();
        }
    }

    get cullingDistance(): number {
        return this.#cullingDistance;
    }

    set cullingDistance(val: number) {
        const numVal = Math.max(0, val);
        if (this.#cullingDistance !== numVal) {
            this.#cullingDistance = numVal;
            this.#syncTypeParams();
        }
    }

    get fadeStartDistance(): number {
        return this.#fadeStartDistance;
    }

    set fadeStartDistance(val: number) {
        const numVal = Math.max(0, val);
        if (this.#fadeStartDistance !== numVal) {
            this.#fadeStartDistance = numVal;
            this.#syncTypeParams();
        }
    }


    /**
     * [KO] 해당 식생이 그림자를 투영(Casting)할 최대 물리적 거리 (m)
     * [EN] Maximum shadow casting distance in meters
     */
    get maxShadowDistance(): number {
        return this.#maxShadowDistance;
    }

    set maxShadowDistance(value: number) {
        const numVal = Math.max(0, Number(value) || 0);
        if (this.#maxShadowDistance !== numVal) {
            this.#maxShadowDistance = numVal;
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }

    get enableStreaming(): boolean {
        return this.#enableStreaming;
    }

    set enableStreaming(value: boolean) {
        this.#enableStreaming = !!value;
    }

    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    set streamingRadius(value: number) {
        const numVal = Math.max(10.0, Number(value) || 10.0);
        if (this.#streamingRadius !== numVal) {
            this.#streamingRadius = numVal;
            this.#onDirty?.();
        }
    }

    get subCellSize(): number {
        return this.#subCellSize;
    }

    set subCellSize(value: number) {
        this.#subCellSize = Math.max(10.0, Number(value) || 10.0);
    }

    get targetLayer(): string | number | undefined {
        return this.#targetLayer;
    }

    set targetLayer(val: string | number | undefined) {
        this.#targetLayer = val;
    }

    get minWeightThreshold(): number {
        return this.#minWeightThreshold;
    }

    set minWeightThreshold(val: number) {
        this.#minWeightThreshold = Math.max(0.0, Math.min(1.0, Number(val) || 0.0));
    }

    get minSlope(): number {
        return this.#minSlope;
    }

    set minSlope(val: number) {
        this.#minSlope = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
    }

    get maxSlope(): number {
        return this.#maxSlope;
    }

    set maxSlope(val: number) {
        this.#maxSlope = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
    }

    get densityScaleByWeight(): boolean {
        return this.#densityScaleByWeight;
    }

    set densityScaleByWeight(val: boolean) {
        this.#densityScaleByWeight = !!val;
    }

    get instancesPerTile(): number | undefined {
        return this.#instancesPerTile;
    }

    set instancesPerTile(val: number | undefined) {
        this.#instancesPerTile = val !== undefined ? Math.max(1, (val | 0)) : undefined;
    }

    get densityMultiplier(): number {
        return this.#densityMultiplier;
    }

    set densityMultiplier(val: number) {
        this.#densityMultiplier = Math.max(0.0, Number(val) || 0.0);
    }

    /**
     * [KO] 타일 캐시를 비우고 스트리머를 초기화합니다 (재생성용).
     * [EN] Clears tile cache and resets streamer for repopulation.
     */
    clearTileCache(): void {
        this.#streamer.clear();
        this.#loadedTileKeys.clear();
        this.#activeInstanceCount = 0;
    }

    get castShadow(): boolean {
        return this.#castShadow;
    }


    set castShadow(value: boolean) {
        const boolVal = !!value;
        if (this.#castShadow !== boolVal) {
            this.#castShadow = boolVal;
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }


    getLODReceiveShadow(lodIndex: number): boolean {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return false;
        return this.#lodInfoList[lodIndex].receiveShadow !== false;
    }

    setLODReceiveShadow(lodIndex: number, value: boolean): void {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return;
        const boolVal = !!value;
        const lodInfo = this.#lodInfoList[lodIndex];
        if (lodInfo.receiveShadow === boolVal) return;

        (lodInfo as any).receiveShadow = boolVal;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice) {
            const subMeshes = this.#subMeshes;
            const count = subMeshes.length;
            for (let i = 0; i < count; i++) {
                if (subMeshes[i].lodIndex === lodIndex) {
                    subMeshes[i].updateReceiveShadow(gpuDevice, boolVal);
                }
            }
        }
        this.#onDirty?.();
    }


    get hasImpostor(): boolean {
        return !!this.#impostorSubMesh;
    }

    get useImpostor(): boolean {
        return this.#useImpostor && !!this.#impostorSubMesh;
    }


    set useImpostor(value: boolean) {
        if (!this.#impostorSubMesh) return;
        const boolVal = !!value;
        if (this.#useImpostor !== boolVal) {
            this.#useImpostor = boolVal;
            this.#updatePassBuckets();
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }

    /**
     * [KO] 스캐터 인스턴스 분류 타입 ('foliage' | 'grass' | 'basic')
     * [EN] Scatter instance classification type ('foliage' | 'grass' | 'basic')
     */
    get type(): FOLIAGE_TYPE {
        return this.#type;
    }

    set type(value: FOLIAGE_TYPE) {
        if (this.#type !== value) {
            this.#type = value;
            this.#isFoliage = value !== FOLIAGE_TYPE.BASIC;
            this.#updatePassBuckets();
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }

    /** @deprecated Use type instead */
    get isFoliage(): boolean {
        return this.#isFoliage;
    }

    /** @deprecated Use type instead */
    set isFoliage(value: boolean) {
        const boolVal = !!value;
        if (this.#isFoliage !== boolVal) {
            this.#isFoliage = boolVal;
            this.#type = boolVal ? FOLIAGE_TYPE.FOLIAGE : FOLIAGE_TYPE.BASIC;
            this.#updatePassBuckets();
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }

    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    set useDepthPrepass(value: boolean) {
        const boolVal = !!value;
        if (this.#useDepthPrepass !== boolVal) {
            this.#useDepthPrepass = boolVal;
            this.#updatePassBuckets();
            this.#onDirty?.();
        }
    }


    getLODDistance(lodIndex: number): number {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return 0;
        return this.#lodInfoList[lodIndex].lodDistance;
    }


    setLODDistance(lodIndex: number, distance: number): void {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return;
        const numVal = Math.max(0, distance);
        if (this.#lodInfoList[lodIndex].lodDistance !== numVal) {
            (this.#lodInfoList[lodIndex] as any).lodDistance = numVal;
            this.#syncTypeParams();
        }
    }

    populateTile(comp: any, landscape?: any, targetCountPerTile?: number): void {
        if (!comp) return;
        const cz = (comp.componentZ ?? 0) & 0xffff;
        const cx = (comp.componentX ?? 0) & 0xffff;
        const key = (cz << 16) | cx;
        if (this.#loadedTileKeys.has(key)) return;

        // [Phase 3.1] 지형 타일 비동기 다운로드 가드:
        // 타일의 높이맵 이미지 데이터가 아직 CPU 메모리에 파싱되지 않은 경우 조기 리턴합니다.
        // 이를 통해 고도 0.0(땅속 지하 파묻힘)으로 잘못 구워지거나 loadedTileKeys에 잠겨
        // 실제 다운로드 후 영구 누락되는 치명적 버그를 완벽하게 차단합니다.
        if (landscape && typeof landscape.isTileLoaded === 'function') {
            if (!landscape.isTileLoaded(cz, cx)) {
                return;
            }
        }

        this.#loadedTileKeys.add(key);

        const chunks = FoliageSubCellPartitioner.partitionTile(
            comp,
            this,
            landscape,
            this.#subCellSize,
            targetCountPerTile
        );
        this.#streamer.addChunks(chunks);

        if (!this.#enableStreaming) {
            this.#streamer.update(new Set(), new Int32Array(0), 0, 0, 0, false);
            this.#activeInstanceCount = this.#allocation?.activeCount ?? 0;
        }
    }

    updateStreaming(
        activeSubCellKeys: ReadonlySet<number>,
        activeKeyArray: Int32Array,
        activeKeyCount: number,
        camX: number,
        camZ: number
    ): void {
        this.#streamer.update(activeSubCellKeys, activeKeyArray, activeKeyCount, camX, camZ, this.#enableStreaming);
        this.#activeInstanceCount = this.#allocation?.activeCount ?? 0;
    }

    get culledGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer?.culledGPUBuffer || null;
    }

    get indirectGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer?.indirectGPUBuffer || null;
    }

    get shadowCulledGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer?.shadowCulledGPUBuffer || null;
    }

    get shadowIndirectGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer?.shadowIndirectGPUBuffer || null;
    }

    setInstanceData(
        index: number,
        posX: number, posY: number, posZ: number,
        rotX: number, rotY: number, rotZ: number, rotW: number,
        scaleX: number, scaleY: number, scaleZ: number,
        fade: number = 1.0
    ): void {
        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.setInstanceData(this.#allocation, index, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, fade);
        }
    }

    uploadRangeToGPU(startIndex: number, count: number): void {
        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.uploadAllocationRangeToGPU(this.#allocation, startIndex, count);
        }
    }

    resetIndirectBuffer(): void {
        if (this.#megaBuffer) {
            this.#megaBuffer.resetMultiIndirectCommands();
        }
    }

    setInstancesData(data: Float32Array, count?: number): void {
        const instanceCount = count !== undefined ? count : Math.floor(data.length / 8);
        this.#activeInstanceCount = Math.min(instanceCount, this.#options.maxInstances);

        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.writeInstancesData(this.#allocation, data, this.#activeInstanceCount);
        }
        this.resetIndirectBuffer();
    }

    destroy(): void {
        this.#streamer.clear();
        for (let i = 0; i < this.#subMeshes.length; i++) {
            const sub = this.#subMeshes[i];
            sub.destroy();
        }
        this.#subMeshes.length = 0;
        for (let i = 0; i < this.#shadowMergedSubMeshes.length; i++) {
            const shadowSub = this.#shadowMergedSubMeshes[i];
            shadowSub.destroy();
        }
        this.#shadowMergedSubMeshes.length = 0;
        this.#loadedTileKeys.clear();
    }

    #updatePassBuckets(): void {
        const useImp = this.#useImpostor;
        const isFoliage = this.#isFoliage;
        const useDepthPrepass = this.#useDepthPrepass;
        const subList = this.#subMeshes;
        const count = subList.length;

        const prepassList: FoliageSubMesh[] = [];
        const mainList: FoliageSubMesh[] = [];

        for (let i = 0; i < count; i++) {
            const sub = subList[i];
            if (!useImp && sub.isImpostor) continue;
            if (isFoliage && useDepthPrepass && sub.canRenderInPass('depthPrepass')) {
                prepassList.push(sub);
            }
            if (sub.canRenderInPass('main')) {
                mainList.push(sub);
            }
        }

        this.#depthPrepassSubMeshes = prepassList;
        this.#mainSubMeshes = mainList;
    }

    #syncTypeParams(): void {
        if (this.#megaBuffer && this.#allocation) {
            const hasImp = !!this.#impostorSubMesh;
            const effectiveLodList = (!this.#useImpostor && hasImp && this.#lodInfoList.length > 1)
                ? this.#lodInfoList.slice(0, -1)
                : this.#lodInfoList;

            const effectiveShadowDist = this.#castShadow ? this.#maxShadowDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                this.#allocation,
                this.#cullingDistance,
                this.#fadeStartDistance,
                this.#boundingRadius,
                this.#bottomOffset,
                effectiveLodList,
                effectiveShadowDist
            );
        }
    }
}

Object.freeze(FoliageType);
export default FoliageType;
