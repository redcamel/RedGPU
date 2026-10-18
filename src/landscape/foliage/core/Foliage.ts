import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import type Landscape from "../../Landscape";
import assembleFoliageRenderUnits from "./assembleFoliageRenderUnits";
import FoliageRenderUnit from "./FoliageRenderUnit";
import FoliageMegaBuffer, {FoliageTypeAllocation} from "./buffer/FoliageMegaBuffer";
import {AScatterType, AScatterTypeInitOptions} from "../../core/scatter";
import FoliageSlotPooler from "./buffer/FoliageSlotPooler";
import FoliageInstanceBaker from "./baking/FoliageInstanceBaker";
import {FOLIAGE_SEED_GRID_SIZE} from "../FOLIAGE_CONSTANTS";

function sampleNormalizedLayerWeight(
    landscape: any,
    targetLayer: any,
    u: number,
    v: number
): number {
    if (!targetLayer) return 0.0;
    const {layers} = landscape;
    if (!layers || layers.length <= 1) {
        return typeof targetLayer.getWeightAtUV === 'function' ? targetLayer.getWeightAtUV(u, v) : 0.0;
    }

    let activeWeightLayerCount = 0;
    let totalWeight = 0.0;
    let targetWeight = 0.0;

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const {enabled, weightTexture} = layer;
        if (!enabled) continue;
        if (weightTexture?.src) {
            activeWeightLayerCount++;
        }
        const w = typeof layer.getWeightAtUV === 'function' ? layer.getWeightAtUV(u, v) : 0.0;
        totalWeight += w;
        if (layer === targetLayer) {
            targetWeight = w;
        }
    }

    if (activeWeightLayerCount <= 1 || totalWeight <= 0.001) {
        return targetWeight;
    }

    return targetWeight / totalWeight;
}

function computeScatterGridSeed(gridX: number, gridZ: number, nameHash: number): number {
    let seed = ((gridX * 73856093) ^ (gridZ * 19349663) ^ (nameHash * 83492791)) >>> 0;
    return seed === 0 ? 0x9e3779b9 : seed;
}

/**
 * [KO] 식생(Foliage) 스트리밍의 최소 공간 단위인 서브 셀(Sub-Cell) 상태 정보 인터페이스입니다.
 * [EN] Interface representing the state information of a sub-cell, the minimum spatial unit for foliage streaming.
 * @category Landscape
 */
export interface FoliageSubCell {
    /**
     * [KO] 서브 셀 그리드 좌표(`subCellX`, `subCellZ`)를 패킹한 고유 키
     * [EN] Unique key packed from sub-cell grid coordinates (`subCellX`, `subCellZ`)
     */
    subCellKey: number;
    /**
     * [KO] 서브 셀의 그리드 X 인덱스
     * [EN] Grid X index of the sub-cell
     */
    subCellX: number;
    /**
     * [KO] 서브 셀의 그리드 Z 인덱스
     * [EN] Grid Z index of the sub-cell
     */
    subCellZ: number;
    /**
     * [KO] 서브 셀 중심의 월드 X 좌표
     * [EN] World X coordinate of the sub-cell center
     */
    centerX: number;
    /**
     * [KO] 서브 셀 중심의 월드 Z 좌표
     * [EN] World Z coordinate of the sub-cell center
     */
    centerZ: number;
    /**
     * [KO] 서브 셀 내 배치될 유효 인스턴스 개수 (미계산 시 `-1`)
     * [EN] Number of valid instances to be placed in the sub-cell (`-1` if not yet computed)
     */
    instanceCount: number;
    /**
     * [KO] 현재 GPU 메가 버퍼에 마운트되어 있는지 여부
     * [EN] Whether the sub-cell is currently mounted in the GPU mega buffer
     */
    isMounted: boolean;
    /**
     * [KO] 마운트된 GPU 메가 버퍼 내 슬롯 시작 오프셋 (미마운트 시 `-1`)
     * [EN] Starting slot offset within the mounted GPU mega buffer (`-1` if unmounted)
     */
    mountedSlotIndex: number;
}

function packSubCellKey(scX: number, scZ: number): number {
    return ((scZ << 16) | (scX & 0xFFFF)) | 0;
}

function sortSubCellsByDistance<T extends { centerX: number; centerZ: number }>(
    subCells: T[],
    dists: Float32Array,
    camX: number,
    camZ: number,
    count: number
): void {
    if (count <= 1) return;

    for (let i = 0; i < count; i++) {
        const {centerX, centerZ} = subCells[i];
        const dx = centerX - camX;
        const dz = centerZ - camZ;
        dists[i] = dx * dx + dz * dz;
    }

    quickSortSubCells(subCells, dists, 0, count - 1);
}

function quickSortSubCells<T>(
    subCells: T[],
    dists: Float32Array,
    left: number,
    right: number
): void {
    if (left >= right) return;
    const pivotVal = dists[(left + right) >> 1];
    let i = left;
    let j = right;
    while (i <= j) {
        while (dists[i] < pivotVal) i++;
        while (dists[j] > pivotVal) j--;
        if (i <= j) {
            const tempSubCell = subCells[i];
            subCells[i] = subCells[j];
            subCells[j] = tempSubCell;

            const tempDist = dists[i];
            dists[i] = dists[j];
            dists[j] = tempDist;

            i++;
            j--;
        }
    }
    if (left < j) quickSortSubCells(subCells, dists, left, j);
    if (i < right) quickSortSubCells(subCells, dists, i, right);
}

/**
 * [KO] 식생(Foliage)의 개별 LOD(Level of Detail) 단계 구성을 정의하는 인터페이스입니다.
 * [EN] Interface defining an individual LOD (Level of Detail) level configuration for foliage.
 * @category Landscape
 */
export interface FoliageLODConfig {
    /**
     * [KO] 해당 LOD 단계에서 렌더링할 `Mesh` 또는 `Mesh` 배열
     * [EN] `Mesh` or array of `Mesh` instances to render at this LOD level
     */
    mesh: Mesh | Mesh[];
    /**
     * [KO] 해당 LOD 단계가 적용되는 최대 카메라 거리 (미터 단위)
     * [EN] Maximum camera distance at which this LOD level applies (in meters)
     */
    lodDistance?: number;
    /**
     * [KO] 해당 LOD 단계의 그림자 수신 여부
     * [EN] Whether this LOD level receives shadows
     */
    receiveShadow?: boolean;
}

/**
 * [KO] 어셈블리 완료 후 GPU 컬링 및 렌더링에 사용되는 LOD 메타데이터 인터페이스입니다.
 * [EN] LOD metadata interface used for GPU culling and rendering after assembly.
 * @category Landscape
 */
export interface FoliageLODInfo {
    /**
     * [KO] LOD 단계 인덱스
     * [EN] LOD level index
     */
    lodIndex: number;
    /**
     * [KO] 해당 LOD 단계의 전환 거리 (미터 단위)
     * [EN] Transition distance for this LOD level (in meters)
     */
    lodDistance: number;
    /**
     * [KO] 렌더 유닛 배열 내 시작 오프셋
     * [EN] Starting offset within the render unit array
     */
    renderUnitOffset: number;
    /**
     * [KO] 해당 LOD 단계에 속한 렌더 유닛 개수
     * [EN] Number of render units belonging to this LOD level
     */
    renderUnitCount: number;
    /**
     * [KO] 그림자 수신 여부
     * [EN] Whether shadows are received
     */
    receiveShadow?: boolean;
}

/**
 * [KO] 식생(`Foliage`) 타입 생성 및 초기화를 위한 설정 옵션 인터페이스입니다.
 * [EN] Configuration options interface for creating and initializing a `Foliage` type.
 * @category Landscape
 */
export interface FoliageOptions extends AScatterTypeInitOptions {
    /**
     * [KO] 거리별 LOD 메시 구성 목록
     * [EN] List of distance-based LOD mesh configurations
     */
    lods: FoliageLODConfig[];
    /**
     * [KO] 식생 표면의 그림자 수신 여부 (기본값: `true`)
     * [EN] Whether the foliage surface receives shadows (default: `true`)
     */
    receiveShadow?: boolean;

    /**
     * [KO] 할당할 최대 인스턴스 수용량 (미지정 시 밀도와 반경 기반으로 자동 계산)
     * [EN] Maximum instance capacity to allocate (automatically calculated based on density and radius if omitted)
     */
    maxInstances?: number;

    /**
     * [KO] 인스턴스 랜덤 스케일 최솟값 `[x, y, z]` (기본값: `[1.0, 1.0, 1.0]`)
     * [EN] Minimum random instance scale `[x, y, z]` (default: `[1.0, 1.0, 1.0]`)
     */
    minScale?: [number, number, number];

    /**
     * [KO] 인스턴스 랜덤 스케일 최댓값 `[x, y, z]` (기본값: `[1.0, 1.0, 1.0]`)
     * [EN] Maximum random instance scale `[x, y, z]` (default: `[1.0, 1.0, 1.0]`)
     */
    maxScale?: [number, number, number];

    /**
     * [KO] Y축 기준 랜덤 회전 적용 여부 (기본값: `true`)
     * [EN] Whether to apply random rotation around the Y-axis (default: `true`)
     */
    randomRotationY?: boolean;

    /**
     * [KO] 원거리 옥타헤드럴 임포스터(Octahedral Impostor) LOD 자동 생성 및 사용 여부 (기본값: `true`)
     * [EN] Whether to automatically generate and use a far-distance Octahedral Impostor LOD (default: `true`)
     */
    useImpostor?: boolean;

    /**
     * [KO] 메시 결합 시 원본 피벗(Pivot) 보존 여부
     * [EN] Whether to preserve the original pivot when assembling meshes
     */
    preservePivot?: boolean;

    /**
     * [KO] 바람에 의한 줄기/기둥 흔들림 강도 배율 (기본값: `1.0`)
     * [EN] Wind-driven trunk bending scale multiplier (default: `1.0`)
     */
    trunkBendScale?: number;

    /**
     * [KO] 바람에 의한 잎사귀 떨림 강도 배율 (기본값: `1.0`)
     * [EN] Wind-driven leaf flutter scale multiplier (default: `1.0`)
     */
    leafFlutterScale?: number;

    /**
     * [KO] 지형 표면 법선(Normal) 방향으로 인스턴스 정렬 여부 (기본값: `false`)
     * [EN] Whether to align instances to the terrain surface normal (default: `false`)
     */
    alignToNormal?: boolean;

    /**
     * [KO] 지형 법선 정렬 반영 비율 (`0.0` ~ `1.0`, 기본값: `1.0`)
     * [EN] Terrain normal alignment factor (`0.0` to `1.0`, default: `1.0`)
     */
    alignFactor?: number;

    /**
     * [KO] 지형 하단 색상 블렌딩이 적용되는 높이 범위 (미터 단위, 기본값: `1.5`)
     * [EN] Height range over which terrain ground color blending is applied in meters (default: `1.5`)
     */
    groundBlendRange?: number;

    /**
     * [KO] Depth Prepass 렌더링 사용 여부 (기본값: `true`)
     * [EN] Whether to use Depth Prepass rendering (default: `true`)
     */
    useDepthPrepass?: boolean;
}

/**
 * [KO] 지형(`Landscape`) 위에 배치되는 단일 식생(나무, 바위, 관목 등) 타입의 LOD, 서브 셀 스트리밍 및 렌더링 속성을 관리하는 클래스입니다.
 * [EN] Class that manages LODs, sub-cell streaming, and rendering properties for a single foliage type (trees, rocks, shrubs, etc.) placed on a `Landscape`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const pineTree = landscape.foliageManager.addType({
 *     name: 'PineTree',
 *     lods: [
 *         { mesh: pineLod0Mesh, lodDistance: 60 },
 *         { mesh: pineLod1Mesh, lodDistance: 150 }
 *     ],
 *     densityPerHectare: 150,
 *     useImpostor: true
 * });
 * ```
 *
 * @see {@link FoliageManager}
 * @see {@link FoliageOptions}
 * @category Landscape
 */
class Foliage extends AScatterType<FoliageTypeAllocation> {
    /**
     * [KO] 단일 식생 타입이 안전하게 할당할 수 있는 최대 인스턴스 수용량 (`262144`)
     * [EN] Maximum safe instance capacity that a single foliage type can allocate (`262144`)
     */
    static MAX_SAFE_TYPE_CAPACITY: number = 262144;

    #minScale: [number, number, number] = [1.0, 1.0, 1.0];
    #maxScale: [number, number, number] = [1.0, 1.0, 1.0];
    #randomRotationY: boolean = true;
    #maxInstances: number = 0;

    #renderUnits: FoliageRenderUnit[] = [];
    #shadowMergedRenderUnits: FoliageRenderUnit[] = [];
    #lod0RenderUnits: FoliageRenderUnit[] = [];
    #depthPrepassOpaqueRenderUnits: FoliageRenderUnit[] = [];
    #depthPrepassMaskedRenderUnits: FoliageRenderUnit[] = [];
    #mainRenderUnits: FoliageRenderUnit[] = [];
    #hasMaskedLOD0: boolean = false;
    #lodInfoList: FoliageLODInfo[] = [];
    #lodInfoListWithoutImpostor: FoliageLODInfo[] | null = null;

    #megaBuffer: FoliageMegaBuffer | null = null;

    #boundingRadius: number = 10.0;
    #nameHash: number = 0;
    #useImpostor: boolean = true;
    #useDepthPrepass: boolean = true;
    #receiveShadow: boolean = true;
    #trunkBendScale: number = 1.0;
    #leafFlutterScale: number = 1.0;
    #alignToNormal: boolean = false;
    #alignFactor: number = 1.0;
    #groundBlendRange: number = 1.5;
    #impostorRenderUnit: FoliageRenderUnit | null = null;

    #subCells: Map<number, FoliageSubCell> = new Map();
    #mountedSubCells: FoliageSubCell[] = [];
    #tempCandidates: FoliageSubCell[] = [];
    #candidateDists: Float32Array = new Float32Array(512);
    #lastMountedCount: number = 0;
    #lastUnmountedCount: number = 0;
    #lastCamX: number = 0;
    #lastCamZ: number = 0;
    #streamingRadius: number = 0;

    #baker: FoliageInstanceBaker | null = null;
    /**
     * [KO] 유니폼 파라미터가 변경되어 UBO 갱신이 필요할 때 호출되는 콜백 함수
     * [EN] Callback function invoked when uniform parameters change and UBO update is required
     */
    onUniformDirty?: (typeId: number) => void;
    /**
     * [KO] 배치 파라미터 변경으로 인해 서브 셀 인스턴스 재배치가 필요할 때 호출되는 콜백 함수
     * [EN] Callback function invoked when sub-cell instance repopulation is required due to placement parameter changes
     */
    onRepopulateRequired?: (type: Foliage) => void;
    #slotPooler: FoliageSlotPooler | null = null;
    #landscape: Landscape | null = null;

    /**
     * [KO] `Foliage` 인스턴스를 생성합니다.
     * [EN] Creates a `Foliage` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param options -
     * [KO] 식생 타입 초기화 옵션
     * [EN] Foliage type initialization options
     * @param megaBuffer -
     * [KO] 식생 인스턴스 데이터를 저장할 `FoliageMegaBuffer` 인스턴스
     * [EN] `FoliageMegaBuffer` instance to store foliage instance data
     * @param baker -
     * [KO] 서브 셀 인스턴스 베이킹을 수행하는 `FoliageInstanceBaker` 인스턴스
     * [EN] `FoliageInstanceBaker` instance that performs sub-cell instance baking
     * @param slotPooler -
     * [KO] 렌더 유닛 UBO 슬롯을 관리하는 `FoliageSlotPooler` 인스턴스
     * [EN] `FoliageSlotPooler` instance managing render unit UBO slots
     * @param landscape -
     * [KO] 식생이 배치될 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance where foliage is placed
     */
    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageOptions,
        megaBuffer?: FoliageMegaBuffer | null,
        baker?: FoliageInstanceBaker | null,
        slotPooler?: FoliageSlotPooler | null,
        landscape?: Landscape | null
    ) {
        super(redGPUContext, options.name);
        this.#landscape = landscape ?? null;
        this.#slotPooler = slotPooler ?? null;

        const {
            name,
            receiveShadow = true,
            castShadow = true,
            useImpostor = true,
            cullingDistance = 2000.0,
            minScale,
            maxScale,
            densityPerHectare,
            densityMultiplier,
            maxInstances,
            trunkBendScale,
            leafFlutterScale,
            alignToNormal = false,
            alignFactor,
            groundBlendStrength,
            groundBlendRange,
            useDepthPrepass = true,
            shadowCullDistance,
            targetLayer,
            minSlope = 0.0,
            maxSlope = 45.0,
            densityScaleByWeight = true,
            randomRotationY,
            bottomOffset = 0.0,
            height
        } = options;

        this.#baker = baker ?? null;

        this.#receiveShadow = receiveShadow;
        this.#useImpostor = useImpostor;
        this.#useDepthPrepass = useDepthPrepass;
        this.#megaBuffer = megaBuffer ?? null;

        const [minX = 1.0, minY = 1.0, minZ = 1.0] = minScale ?? [];
        const [maxX = 1.0, maxY = 1.0, maxZ = 1.0] = maxScale ?? [];
        const resolvedMinScale: [number, number, number] = [minX, minY, minZ];
        const resolvedMaxScale: [number, number, number] = [maxX, maxY, maxZ];

        let resolvedDensityPerHectare = 20.0;
        if (densityPerHectare !== undefined) {
            resolvedDensityPerHectare = Math.max(0, Number(densityPerHectare) || 0);
        }

        const resolvedDensityMultiplier = densityMultiplier !== undefined
            ? Math.max(0.0, Number(densityMultiplier) || 0.0)
            : 1.0;

        const resolvedTrunkBendScale = trunkBendScale !== undefined ? Math.max(0, Number(trunkBendScale) || 0) : 1.0;
        const resolvedLeafFlutterScale = leafFlutterScale !== undefined ? Math.max(0, Number(leafFlutterScale) || 0) : 1.0;

        const resolvedAlignToNormal = alignToNormal;
        const resolvedAlignFactor = alignFactor !== undefined
            ? Math.min(1.0, Math.max(0.0, Number(alignFactor) || 0))
            : 1.0;

        this.#trunkBendScale = resolvedTrunkBendScale;
        this.#leafFlutterScale = resolvedLeafFlutterScale;
        this.#alignToNormal = resolvedAlignToNormal;
        this.#alignFactor = resolvedAlignFactor;

        const resolvedGroundBlendStrength = groundBlendStrength !== undefined
            ? Math.max(0.0, Math.min(1.0, Number(groundBlendStrength) || 0.0))
            : 0.8;
        this.#groundBlendRange = groundBlendRange !== undefined
            ? Math.max(0.1, Number(groundBlendRange) || 0.1)
            : 1.5;

        let hash = 0;
        const nameStr = name ?? '';
        for (let c = 0; c < nameStr.length; c++) {
            hash = (hash * 31 + nameStr.charCodeAt(c)) | 0;
        }
        this.#nameHash = hash;

        const {
            lodInfoList,
            boundingRadius,
            boundingHeight,
            renderUnits,
            shadowMergedRenderUnits
        } = assembleFoliageRenderUnits(
            redGPUContext,
            options,
            this.#slotPooler
        );
        this.#lodInfoList = lodInfoList;
        this.#lodInfoListWithoutImpostor = lodInfoList.length > 1 ? lodInfoList.slice(0, -1) : null;
        this.#boundingRadius = boundingRadius;
        const resolvedHeight = height !== undefined
            ? Math.max(0.1, Number(height) || 0.1)
            : (boundingHeight || 2.0);

        this.#initBuckets(
            renderUnits,
            shadowMergedRenderUnits
        );

        let defaultShadowDist = 300.0;
        const effectiveHeight = resolvedHeight * resolvedMaxScale[1];
        if (effectiveHeight < 0.6) {
            defaultShadowDist = 35.0;
        } else if (effectiveHeight < 1.5) {
            defaultShadowDist = 75.0;
        } else if (effectiveHeight < 3.5) {
            defaultShadowDist = 160.0;
        } else {
            defaultShadowDist = 350.0;
        }

        const resolvedShadowCullDistance = shadowCullDistance !== undefined
            ? Math.max(0, Number(shadowCullDistance) || 0)
            : defaultShadowDist;

        this.setRawScatterProperties({
            height: resolvedHeight,
            bottomOffset,
            cullingDistance,
            shadowCullDistance: resolvedShadowCullDistance,
            targetLayer,
            minSlope,
            maxSlope,
            densityScaleByWeight,
            densityPerHectare: resolvedDensityPerHectare,
            densityMultiplier: resolvedDensityMultiplier,
            castShadow,
            groundBlendStrength: resolvedGroundBlendStrength
        });

        this.#recalculateStreamingRadius();

        const effectiveRadius = this.#streamingRadius;
        const effectiveAreaMetersSq = Math.PI * effectiveRadius * effectiveRadius * 1.25;
        const activeHectares = effectiveAreaMetersSq / 10000.0;

        const expectedActiveInstances = activeHectares * resolvedDensityPerHectare * resolvedDensityMultiplier;
        const calculatedMax = Math.ceil((expectedActiveInstances * 1.30) / 64) * 64;

        const MAX_SAFE_CAPACITY = Foliage.MAX_SAFE_TYPE_CAPACITY;
        const minSafeCapacity = 16384;

        const resolvedMaxInstances = maxInstances !== undefined
            ? Math.min(MAX_SAFE_CAPACITY, Math.max(maxInstances, 64))
            : Math.min(MAX_SAFE_CAPACITY, Math.max(calculatedMax, minSafeCapacity));

        this.#minScale = resolvedMinScale;
        this.#maxScale = resolvedMaxScale;
        this.#randomRotationY = randomRotationY !== false;
        this.#maxInstances = resolvedMaxInstances;

        if (this.#megaBuffer) {
            const alloc = this.#megaBuffer.allocateType(
                this.name,
                resolvedMaxInstances,
                this.#renderUnits,
                this.#shadowMergedRenderUnits,
                this.#lodInfoList
            );
            this.bindAllocation(alloc);
            const {cullingDistance, bottomOffset, height, castShadow, shadowCullDistance} = this;
            const effectiveShadowDist = castShadow ? shadowCullDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                alloc,
                cullingDistance,
                cullingDistance * 0.75,
                this.#boundingRadius,
                bottomOffset,
                this.#lodInfoList,
                effectiveShadowDist,
                height
            );
        }

        this.#syncInternalWind();
        this.flushAllRenderUnitUBOs();
    }

    /**
     * [KO] 바람에 의한 줄기/기둥 흔들림 강도 배율을 반환하거나 설정합니다.
     * [EN] Gets or sets the wind-driven trunk bending scale multiplier.
     * @returns
     * [KO] 줄기 흔들림 강도 배율
     * [EN] Trunk bending scale multiplier
     */
    get trunkBendScale(): number {
        return this.#trunkBendScale;
    }

    set trunkBendScale(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#trunkBendScale !== numVal) {
            this.#trunkBendScale = numVal;
            this.#syncInternalWind();
            this.#notifyUniformDirty();
        }
    }

    /**
     * [KO] 식생 타입 이름으로부터 계산된 해시 값을 반환합니다.
     * [EN] Returns the hash value calculated from the foliage type name.
     * @returns
     * [KO] 이름 해시 값
     * [EN] Name hash value
     */
    get nameHash(): number {
        return this.#nameHash;
    }

    /**
     * [KO] 이 식생 타입에 할당된 최대 인스턴스 수용량을 반환합니다.
     * [EN] Returns the maximum instance capacity allocated to this foliage type.
     * @returns
     * [KO] 최대 인스턴스 수
     * [EN] Maximum instance count
     */
    get maxInstances(): number {
        return this.allocation ? this.allocation.maxInstances : this.#maxInstances;
    }

    set minScale(v: [number, number, number] | [number, number]) {
        if (!v) return;
        const [vx, vy, vz = vx] = v;
        const s = this.#minScale;
        const sx = Math.max(0.01, Number(vx) || 0.01);
        const sy = Math.max(0.01, Number(vy) || 0.01);
        const sz = Math.max(0.01, Number(vz) || 0.01);
        if (s[0] !== sx || s[1] !== sy || s[2] !== sz) {
            s[0] = sx;
            s[1] = sy;
            s[2] = sz;
            this.clearSubCellCache();
            this.#notifyRepopulateRequired();
        }
    }

    /**
     * [KO] 인스턴스 랜덤 스케일의 최솟값 `[x, y, z]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the minimum random instance scale `[x, y, z]`.
     * @returns
     * [KO] 최소 스케일 튜플 `[x, y, z]`
     * [EN] Minimum scale tuple `[x, y, z]`
     */
    get minScale(): [number, number, number] {
        return this.#minScale;
    }

    set maxScale(v: [number, number, number] | [number, number]) {
        if (!v) return;
        const [vx, vy, vz = vx] = v;
        const s = this.#maxScale;
        const sx = Math.max(0.01, Number(vx) || 0.01);
        const sy = Math.max(0.01, Number(vy) || 0.01);
        const sz = Math.max(0.01, Number(vz) || 0.01);
        if (s[0] !== sx || s[1] !== sy || s[2] !== sz) {
            s[0] = sx;
            s[1] = sy;
            s[2] = sz;
            this.clearSubCellCache();
            this.#notifyRepopulateRequired();
        }
    }

    /**
     * [KO] 인스턴스 랜덤 스케일의 최댓값 `[x, y, z]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum random instance scale `[x, y, z]`.
     * @returns
     * [KO] 최대 스케일 튜플 `[x, y, z]`
     * [EN] Maximum scale tuple `[x, y, z]`
     */
    get maxScale(): [number, number, number] {
        return this.#maxScale;
    }

    /**
     * [KO] Y축 기준 랜덤 회전 적용 여부를 반환합니다.
     * [EN] Returns whether random rotation around the Y-axis is applied.
     * @returns
     * [KO] Y축 랜덤 회전 여부
     * [EN] Whether Y-axis random rotation is enabled
     */
    get randomRotationY(): boolean {
        return this.#randomRotationY;
    }

    /**
     * [KO] 연결된 `FoliageMegaBuffer` 인스턴스를 반환합니다.
     * [EN] Returns the associated `FoliageMegaBuffer` instance.
     * @returns
     * [KO] `FoliageMegaBuffer` 인스턴스 또는 `null`
     * [EN] `FoliageMegaBuffer` instance or `null`
     */
    get megaBuffer(): FoliageMegaBuffer | null {
        return this.#megaBuffer;
    }

    /**
     * [KO] 식생이 배치된 대상 `Landscape` 인스턴스를 반환합니다.
     * [EN] Returns the target `Landscape` instance where the foliage is placed.
     * @returns
     * [KO] `Landscape` 인스턴스 또는 `null`
     * [EN] `Landscape` instance or `null`
     */
    get landscape(): Landscape | null {
        return this.#landscape;
    }

    /**
     * [KO] 모든 LOD 단계의 `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of `FoliageRenderUnit` instances across all LOD levels.
     * @returns
     * [KO] `FoliageRenderUnit` 배열
     * [EN] Array of `FoliageRenderUnit`
     */
    get renderUnits(): FoliageRenderUnit[] {
        return this.#renderUnits;
    }

    /**
     * [KO] 현재 활성화된 패스 구성을 기준으로 발생하는 총 드로우콜 수를 반환합니다.
     * [EN] Returns the total number of draw calls generated based on the currently active pass configuration.
     * @returns
     * [KO] 드로우콜 수
     * [EN] Number of draw calls
     */
    override get drawCallCount(): number {
        let count = this.#mainRenderUnits.length;
        if (this.#useDepthPrepass) {
            count += this.#depthPrepassOpaqueRenderUnits.length + this.#depthPrepassMaskedRenderUnits.length;
        }
        return count;
    }

    /**
     * [KO] Depth Prepass에서 렌더링되는 불투명(Opaque) `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of opaque `FoliageRenderUnit` instances rendered in the Depth Prepass.
     * @returns
     * [KO] 불투명 Depth Prepass 렌더 유닛 배열
     * [EN] Array of opaque Depth Prepass render units
     */
    get depthPrepassOpaqueRenderUnits(): FoliageRenderUnit[] {
        return this.#depthPrepassOpaqueRenderUnits;
    }

    /**
     * [KO] Depth Prepass에서 렌더링되는 알파 마스크(Masked) `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of alpha-masked `FoliageRenderUnit` instances rendered in the Depth Prepass.
     * @returns
     * [KO] 알파 마스크 Depth Prepass 렌더 유닛 배열
     * [EN] Array of alpha-masked Depth Prepass render units
     */
    get depthPrepassMaskedRenderUnits(): FoliageRenderUnit[] {
        return this.#depthPrepassMaskedRenderUnits;
    }

    /**
     * [KO] 메인 컬러 패스에서 렌더링되는 `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of `FoliageRenderUnit` instances rendered in the main color pass.
     * @returns
     * [KO] 메인 패스 렌더 유닛 배열
     * [EN] Array of main pass render units
     */
    get mainRenderUnits(): FoliageRenderUnit[] {
        return this.#mainRenderUnits;
    }

    /**
     * [KO] LOD 0 단계에 해당하는 `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of `FoliageRenderUnit` instances belonging to LOD 0.
     * @returns
     * [KO] LOD 0 렌더 유닛 배열
     * [EN] Array of LOD 0 render units
     */
    get lod0RenderUnits(): FoliageRenderUnit[] {
        return this.#lod0RenderUnits;
    }

    /**
     * [KO] 그림자 패스 렌더링을 위해 병합된 `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of merged `FoliageRenderUnit` instances for shadow pass rendering.
     * @returns
     * [KO] 그림자용 병합 렌더 유닛 배열
     * [EN] Array of shadow-merged render units
     */
    get shadowMergedRenderUnits(): FoliageRenderUnit[] {
        return this.#shadowMergedRenderUnits;
    }

    /**
     * [KO] 구성된 각 LOD 단계의 메타데이터(`FoliageLODInfo`) 목록을 반환합니다.
     * [EN] Returns the list of metadata (`FoliageLODInfo`) for each configured LOD level.
     * @returns
     * [KO] `FoliageLODInfo` 배열
     * [EN] Array of `FoliageLODInfo`
     */
    get lodInfoList(): FoliageLODInfo[] {
        return this.#lodInfoList;
    }

    /**
     * [KO] 현재 GPU 메가 버퍼에 마운트되어 활성화된 총 인스턴스 수를 반환합니다.
     * [EN] Returns the total number of active instances currently mounted in the GPU mega buffer.
     * @returns
     * [KO] 활성 인스턴스 수
     * [EN] Active instance count
     */
    get activeInstanceCount(): number {
        return this.allocation ? this.allocation.instanceCount : 0;
    }

    /**
     * [KO] 렌더 유닛 UBO 슬롯을 관리하는 `FoliageSlotPooler` 인스턴스를 반환합니다.
     * [EN] Returns the `FoliageSlotPooler` instance managing render unit UBO slots.
     * @returns
     * [KO] `FoliageSlotPooler` 인스턴스 또는 `null`
     * [EN] `FoliageSlotPooler` instance or `null`
     */
    get slotPooler(): FoliageSlotPooler | null {
        return this.#slotPooler;
    }

    /**
     * [KO] 식생 메시의 바운딩 구 반경(미터 단위)을 반환합니다.
     * [EN] Returns the bounding sphere radius of the foliage mesh in meters.
     * @returns
     * [KO] 바운딩 반경
     * [EN] Bounding radius
     */
    get boundingRadius(): number {
        return this.#boundingRadius;
    }

    /**
     * [KO] LOD 0 단계에 알파 마스크(Masked) 재질이 포함되어 있는지 여부를 반환합니다.
     * [EN] Returns whether LOD 0 contains an alpha-masked material.
     * @returns
     * [KO] LOD 0 알파 마스크 포함 여부
     * [EN] Whether LOD 0 has a masked material
     */
    get hasMaskedLOD0(): boolean {
        return this.#hasMaskedLOD0;
    }

    /**
     * [KO] 바람에 의한 잎사귀 떨림 강도 배율을 반환하거나 설정합니다.
     * [EN] Gets or sets the wind-driven leaf flutter scale multiplier.
     * @returns
     * [KO] 잎사귀 떨림 강도 배율
     * [EN] Leaf flutter scale multiplier
     */
    get leafFlutterScale(): number {
        return this.#leafFlutterScale;
    }

    set alignToNormal(val: boolean) {
        const boolVal = !!val;
        if (this.#alignToNormal !== boolVal) {
            this.#alignToNormal = boolVal;
            this.#notifyRepopulateRequired();
        }
    }

    set leafFlutterScale(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#leafFlutterScale !== numVal) {
            this.#leafFlutterScale = numVal;
            this.#syncInternalWind();
            this.#notifyUniformDirty();
        }
    }

    set alignFactor(val: number) {
        const numVal = Math.min(1.0, Math.max(0.0, Number(val) || 0.0));
        if (this.#alignFactor !== numVal) {
            this.#alignFactor = numVal;
            if (this.#alignToNormal) {
                this.#notifyRepopulateRequired();
            }
        }
    }

    /**
     * [KO] 지형 표면 법선(Normal) 방향으로 인스턴스를 정렬할지 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether to align instances to the terrain surface normal.
     * @returns
     * [KO] 지형 법선 정렬 활성화 여부
     * [EN] Whether terrain normal alignment is enabled
     */
    get alignToNormal(): boolean {
        return this.#alignToNormal;
    }

    set groundBlendRange(v: number) {
        const val = Math.max(0.1, Number(v) || 0.1);
        if (this.#groundBlendRange !== val) {
            this.#groundBlendRange = val;
            this.#updateRenderUnitGroundBlend();
            this.#notifyUniformDirty();
        }
    }

    /**
     * [KO] 지형 법선 정렬 반영 비율(`0.0` ~ `1.0`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the terrain normal alignment factor (`0.0` to `1.0`).
     * @returns
     * [KO] 법선 정렬 반영 비율
     * [EN] Normal alignment factor
     */
    get alignFactor(): number {
        return this.#alignFactor;
    }

    /**
     * [KO] 이 식생 타입에 생성된 옥타헤드럴 임포스터 렌더 유닛이 존재하는지 여부를 반환합니다.
     * [EN] Returns whether an octahedral impostor render unit exists for this foliage type.
     * @returns
     * [KO] 임포스터 렌더 유닛 존재 여부
     * [EN] Whether an impostor render unit exists
     */
    get hasImpostor(): boolean {
        return !!this.#impostorRenderUnit;
    }

    /**
     * [KO] 원거리 옥타헤드럴 임포스터(Octahedral Impostor) LOD 사용 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the far-distance Octahedral Impostor LOD is used.
     * @returns
     * [KO] 임포스터 사용 여부
     * [EN] Whether the impostor is used
     */
    get useImpostor(): boolean {
        return this.#useImpostor && !!this.#impostorRenderUnit;
    }

    set useImpostor(value: boolean) {
        if (!this.#impostorRenderUnit) return;
        const boolVal = !!value;
        if (this.#useImpostor !== boolVal) {
            this.#useImpostor = boolVal;
            this.#updatePassBuckets();
            this.#notifyUniformDirty();
        }
    }

    set useDepthPrepass(value: boolean) {
        const boolVal = !!value;
        if (this.#useDepthPrepass !== boolVal) {
            this.#useDepthPrepass = boolVal;
            this.#updatePassBuckets();
            this.#notifyUniformDirty();
        }
    }

    /**
     * [KO] Depth Prepass 렌더링 사용 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether Depth Prepass rendering is used.
     * @returns
     * [KO] Depth Prepass 사용 여부
     * [EN] Whether Depth Prepass is used
     */
    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    /**
     * [KO] 식생 표면의 그림자 수신 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the foliage surface receives shadows.
     * @returns
     * [KO] 그림자 수신 여부
     * [EN] Whether shadows are received
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set receiveShadow(value: boolean) {
        const boolVal = !!value;
        if (this.#receiveShadow !== boolVal) {
            this.#receiveShadow = boolVal;
            this.#updateRenderUnitReceiveShadow();
            this.onParameterChanged('receiveShadow', boolVal);
        }
    }

    /**
     * [KO] 서브 셀 스트리밍이 수행되는 유효 반경(미터 단위)을 반환합니다.
     * [EN] Returns the effective radius in meters within which sub-cell streaming is performed.
     * @returns
     * [KO] 스트리밍 반경 (미터)
     * [EN] Streaming radius in meters
     */
    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    /**
     * [KO] 지형 하단 색상 블렌딩이 적용되는 높이 범위(미터 단위)를 반환하거나 설정합니다.
     * [EN] Gets or sets the height range in meters over which terrain ground color blending is applied.
     * @returns
     * [KO] 지형 블렌딩 높이 범위 (미터)
     * [EN] Ground blend height range in meters
     */
    get groundBlendRange(): number {
        return this.#groundBlendRange;
    }

    /**
     * [KO] 현재 마운트되어 있는 서브 셀의 개수를 반환합니다.
     * [EN] Returns the number of currently mounted sub-cells.
     * @returns
     * [KO] 마운트된 서브 셀 개수
     * [EN] Number of mounted sub-cells
     */
    get mountedSubCellCount(): number {
        return this.#mountedSubCells.length;
    }

    /**
     * [KO] 가장 최근 스트리밍 업데이트에서 새로 마운트된 서브 셀 개수를 반환합니다.
     * [EN] Returns the number of newly mounted sub-cells in the most recent streaming update.
     * @returns
     * [KO] 최근 마운트된 서브 셀 개수
     * [EN] Recently mounted sub-cell count
     */
    get lastMountedCount(): number {
        return this.#lastMountedCount;
    }

    /**
     * [KO] 가장 최근 스트리밍 업데이트에서 마운트 해제된 서브 셀 개수를 반환합니다.
     * [EN] Returns the number of unmounted sub-cells in the most recent streaming update.
     * @returns
     * [KO] 최근 언마운트된 서브 셀 개수
     * [EN] Recently unmounted sub-cell count
     */
    get lastUnmountedCount(): number {
        return this.#lastUnmountedCount;
    }

    /**
     * [KO] 식생 타입의 모든 렌더 유닛, 서브 셀 캐시 및 관련 리소스를 해제합니다.
     * [EN] Releases all render units, sub-cell caches, and associated resources of the foliage type.
     */
    override destroy(): void {
        this.clearSubCellCache();

        const unitCount = this.#renderUnits.length;
        for (let i = 0; i < unitCount; i++) {
            this.#renderUnits[i].destroy();
        }
        this.#renderUnits.length = 0;
        this.#lod0RenderUnits.length = 0;
        this.#depthPrepassOpaqueRenderUnits.length = 0;
        this.#depthPrepassMaskedRenderUnits.length = 0;
        this.#mainRenderUnits.length = 0;

        const shadowCount = this.#shadowMergedRenderUnits.length;
        for (let i = 0; i < shadowCount; i++) {
            this.#shadowMergedRenderUnits[i].destroy();
        }
        this.#shadowMergedRenderUnits.length = 0;

        this.#lodInfoList.length = 0;
        this.#mountedSubCells.length = 0;
        this.#tempCandidates.length = 0;

        this.#impostorRenderUnit = null;
        this.#landscape = null;
        this.#slotPooler = null;
        this.#baker = null;
        this.#megaBuffer = null;
        this.onUniformDirty = undefined;
        this.onRepopulateRequired = undefined;

        super.destroy();
    }

    /**
     * [KO] 타입 파라미터를 동기화하고 모든 렌더 유닛 및 그림자 렌더 유닛의 슬롯 UBO를 GPU에 플러시합니다.
     * [EN] Synchronizes type parameters and flushes the slot UBOs of all render units and shadow render units to the GPU.
     */
    flushAllRenderUnitUBOs(): void {
        this.#syncTypeParams();
        const unitList = this.#renderUnits;
        const count = unitList.length;
        for (let i = 0; i < count; i++) {
            unitList[i].flushSlotUBO();
        }
        const shadowList = this.#shadowMergedRenderUnits;
        const shadowCount = shadowList.length;
        for (let i = 0; i < shadowCount; i++) {
            shadowList[i].flushSlotUBO();
        }
    }

    /**
     * [KO] 마운트된 모든 서브 셀의 상태를 초기화하고 서브 셀 캐시를 비웁니다.
     * [EN] Resets the state of all mounted sub-cells and clears the sub-cell cache.
     */
    clearSubCellCache(): void {
        this.#tempCandidates.length = 0;
        const mounted = this.#mountedSubCells;
        for (let i = 0; i < mounted.length; i++) {
            mounted[i].isMounted = false;
            mounted[i].mountedSlotIndex = -1;
        }
        mounted.length = 0;
        this.#subCells.clear();
        this.#lastMountedCount = 0;
        this.#lastUnmountedCount = 0;
        if (this.allocation) {
            this.allocation.instanceCount = 0;
        }
    }

    /**
     * [KO] 특정 LOD 단계의 전환 거리를 변경합니다.
     * [EN] Updates the transition distance of a specific LOD level.
     *
     * @param lodIndex -
     * [KO] 대상 LOD 단계 인덱스
     * [EN] Target LOD level index
     * @param distance -
     * [KO] 설정할 전환 거리 (미터 단위)
     * [EN] Transition distance to set in meters
     */
    setLODDistance(lodIndex: number, distance: number): void {
        const info = this.#lodInfoList[lodIndex];
        if (info) {
            const val = Math.max(0, Number(distance) || 0);
            if (info.lodDistance !== val) {
                info.lodDistance = val;
                this.#recalculateStreamingRadius();
                this.#notifyUniformDirty();
            }
        }
    }

    /**
     * [KO] 스캐터 속성 값이 변경되었을 때 호출되어 캐시 초기화, 리베이크 또는 UBO 갱신을 트리거합니다.
     * [EN] Invoked when a scatter property value changes, triggering cache reset, rebaking, or UBO update.
     *
     * @param prop -
     * [KO] 변경된 속성 이름
     * [EN] Name of the changed property
     * @param value -
     * [KO] 새로운 속성 값
     * [EN] New property value
     * @param prevValue -
     * [KO] 이전 속성 값
     * [EN] Previous property value
     */
    override onParameterChanged(prop: string, value: any, prevValue?: any): void {
        switch (prop) {
            case 'targetLayer':
            case 'minSlope':
            case 'maxSlope':
            case 'densityScaleByWeight':
            case 'densityPerHectare':
            case 'densityMultiplier':
            case 'minScale':
            case 'maxScale':
                this.clearSubCellCache();
                this.#notifyRepopulateRequired();
                break;
            case 'bottomOffset':
                this.#notifyUniformDirty();
                break;

            case 'cullingDistance': {
                this.#recalculateStreamingRadius();
                this.#notifyUniformDirty();
                break;
            }
            case 'shadowCullDistance':
            case 'castShadow':
                this.#notifyUniformDirty();
                break;
            case 'groundBlendStrength':
                this.#updateRenderUnitGroundBlend();
                this.#notifyUniformDirty();
                break;
            case 'receiveShadow':
                this.#updateRenderUnitReceiveShadow();
                break;
        }
    }

    #recalculateStreamingRadius(): void {
        const landscape = this.#landscape;
        if (!landscape) return;

        const subCellSize = landscape.foliageManager.subCellSize;

        let maxDrawableDistance = this.cullingDistance;
        if (!this.#useImpostor && this.#lodInfoList.length > 0) {
            const lastLOD = this.#lodInfoList[this.#lodInfoList.length - 1];
            if (lastLOD.lodDistance > 0 && lastLOD.lodDistance < 100000.0) {
                maxDrawableDistance = lastLOD.lodDistance;
            }
        }

        const effectiveVisualDistance = Math.min(this.cullingDistance, maxDrawableDistance);

        const streamingMargin = subCellSize * 1.5;
        const calculatedRadius = Math.ceil(effectiveVisualDistance + streamingMargin);

        const oldRadius = this.#streamingRadius;
        if (calculatedRadius !== oldRadius) {
            this.#streamingRadius = calculatedRadius;
            if (oldRadius > 0 && calculatedRadius < oldRadius) {
                this.#pruneMountedSubCellsOutOfRange(calculatedRadius, subCellSize);
            }
        }
    }

    #pruneMountedSubCellsOutOfRange(newRadius: number, subCellSize: number): void {
        const megaBuffer = this.#megaBuffer;
        const allocation = this.allocation;
        if (!megaBuffer || !allocation || this.#mountedSubCells.length === 0) return;

        const unmountMargin = subCellSize * 0.5;
        const unmountRadiusSq = (newRadius + unmountMargin) * (newRadius + unmountMargin);
        const mounted = this.#mountedSubCells;

        for (let i = mounted.length - 1; i >= 0; i--) {
            const {centerX, centerZ} = mounted[i];
            const dx = centerX - this.#lastCamX;
            const dz = centerZ - this.#lastCamZ;
            if (dx * dx + dz * dz > unmountRadiusSq) {
                this.#unmountSubCellAt(i, megaBuffer, allocation, subCellSize);
            }
        }
    }

    /**
     * [KO] 카메라 위치를 기준으로 스트리밍 반경 내외의 서브 셀을 예산(Budget) 범위 안에서 마운트하거나 언마운트합니다.
     * [EN] Mounts or unmounts sub-cells inside and outside the streaming radius within the given budget based on the camera position.
     *
     * @param camX -
     * [KO] 카메라의 월드 X 좌표
     * [EN] World X coordinate of the camera
     * @param camZ -
     * [KO] 카메라의 월드 Z 좌표
     * [EN] World Z coordinate of the camera
     * @param mountBudget -
     * [KO] 프레임당 최대 서브 셀 마운트 허용 개수 (기본값: `16`)
     * [EN] Maximum number of sub-cells allowed to mount per frame (default: `16`)
     * @param unmountBudget -
     * [KO] 프레임당 최대 서브 셀 언마운트 허용 개수 (기본값: `32`)
     * [EN] Maximum number of sub-cells allowed to unmount per frame (default: `32`)
     */
    updateStreaming(
        camX: number,
        camZ: number,
        mountBudget: number = 16,
        unmountBudget: number = 32
    ): void {
        this.#lastMountedCount = 0;
        this.#lastUnmountedCount = 0;
        this.#lastCamX = camX;
        this.#lastCamZ = camZ;

        const allocation = this.allocation;
        const megaBuffer = this.#megaBuffer;
        const landscape = this.#landscape;
        if (!allocation || !megaBuffer || !landscape) return;

        const subCellSize = landscape.foliageManager.subCellSize;
        const typeRadius = this.streamingRadius;
        const unmountMargin = Math.max(10.0, subCellSize * 0.5);
        const unmountRadius = typeRadius + unmountMargin;
        const unmountRadiusSq = unmountRadius * unmountRadius;

        let unmountedThisFrame = 0;
        const mounted = this.#mountedSubCells;
        for (let i = mounted.length - 1; i >= 0; i--) {
            if (unmountedThisFrame >= unmountBudget) break;

            const {centerX, centerZ} = mounted[i];
            const dx = centerX - camX;
            const dz = centerZ - camZ;
            const distSq = dx * dx + dz * dz;

            if (distSq > unmountRadiusSq) {
                this.#unmountSubCellAt(i, megaBuffer, allocation, subCellSize);
                unmountedThisFrame++;
            }
        }
        this.#lastUnmountedCount = unmountedThisFrame;

        if (mountBudget <= 0) return;

        const candidates = this.#tempCandidates;
        candidates.length = 0;

        const {
            worldSizeX,
            worldSizeZ,
            halfWorldSizeX: halfWorldX,
            halfWorldSizeZ: halfWorldZ
        } = landscape;

        const invSubCellSize = 1.0 / subCellSize;
        const totalCellsX = Math.max(1, Math.floor(worldSizeX * invSubCellSize));
        const totalCellsZ = Math.max(1, Math.floor(worldSizeZ * invSubCellSize));

        const minSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX - typeRadius + halfWorldX) * invSubCellSize)));
        const maxSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX + typeRadius + halfWorldX) * invSubCellSize)));
        const minSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ - typeRadius + halfWorldZ) * invSubCellSize)));
        const maxSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ + typeRadius + halfWorldZ) * invSubCellSize)));

        const mountRadiusSq = typeRadius * typeRadius;

        for (let sz = minSZ; sz <= maxSZ; sz++) {
            const cellCenterZ = (sz + 0.5) * subCellSize - halfWorldZ;
            const diffZ = cellCenterZ - camZ;
            const diffZSq = diffZ * diffZ;

            for (let sx = minSX; sx <= maxSX; sx++) {
                const cellCenterX = (sx + 0.5) * subCellSize - halfWorldX;
                const diffX = cellCenterX - camX;

                if (diffX * diffX + diffZSq <= mountRadiusSq) {
                    const key = packSubCellKey(sx, sz);
                    let subCell = this.#subCells.get(key);
                    if (!subCell) {
                        subCell = {
                            subCellKey: key,
                            subCellX: sx,
                            subCellZ: sz,
                            centerX: cellCenterX,
                            centerZ: cellCenterZ,
                            instanceCount: -1,
                            isMounted: false,
                            mountedSlotIndex: -1
                        };
                        this.#subCells.set(key, subCell);
                    }
                    if (!subCell.isMounted && subCell.instanceCount !== 0) {
                        candidates.push(subCell);
                    }
                }
            }
        }

        const candidateCount = candidates.length;
        if (candidateCount === 0) return;

        if (this.#candidateDists.length < candidateCount) {
            this.#candidateDists = new Float32Array(Math.max(candidateCount, this.#candidateDists.length * 2));
        }
        sortSubCellsByDistance(candidates, this.#candidateDists, camX, camZ, candidateCount);

        let mountedThisFrame = 0;
        let populatedThisFrame = 0;
        const populateBudget = mountBudget;

        for (let i = 0; i < candidateCount; i++) {
            if (mountedThisFrame >= mountBudget) break;
            const subCell = candidates[i];

            if (subCell.instanceCount === -1) {
                if (populatedThisFrame >= populateBudget) {
                    continue;
                }
                this.#computeSubCellInstances(subCell, subCellSize, landscape);
                populatedThisFrame++;
                if (subCell.instanceCount <= 0) {
                    continue;
                }
            }

            this.#mountSubCell(subCell, megaBuffer, allocation, subCellSize);
            mountedThisFrame++;
        }
        this.#lastMountedCount = mountedThisFrame;
    }

    /**
     * [KO] 현재 마운트된 모든 서브 셀의 인스턴스 변환 데이터를 GPU 메가 버퍼에 다시 베이킹합니다.
     * [EN] Rebakes the instance transform data of all currently mounted sub-cells into the GPU mega buffer.
     */
    rebake(): void {
        const alloc = this.allocation;
        const landscape = this.#landscape;
        const baker = this.#baker;
        if (this.#megaBuffer && baker && alloc && landscape && alloc.instanceCount > 0) {
            const mounted = this.#mountedSubCells;
            const count = mounted.length;
            const {foliageManager} = landscape;
            const {subCellSize} = foliageManager;
            for (let i = 0; i < count; i++) {
                const subCell = mounted[i];
                const {isMounted, instanceCount, mountedSlotIndex} = subCell;
                if (isMounted && instanceCount > 0) {
                    baker.dispatchBakeSubCell(
                        this.#megaBuffer,
                        landscape,
                        this,
                        subCell,
                        alloc.rawBaseOffset + mountedSlotIndex,
                        instanceCount,
                        subCellSize
                    );
                }
            }
        }
    }

    #notifyUniformDirty(): void {
        this.onUniformDirty?.(this.typeId);
    }

    #notifyRepopulateRequired(): void {
        this.onRepopulateRequired?.(this);
        this.#notifyUniformDirty();
    }

    #syncInternalWind(): void {
        const unitList = this.#renderUnits;
        const count = unitList.length;
        const trunkScale = this.#trunkBendScale;
        const leafScale = this.#leafFlutterScale;
        const foliageH = Math.max(5.0, this.#boundingRadius * 1.8);

        for (let i = 0; i < count; i++) {
            const unit = unitList[i];
            const effectiveLeafScale = unit.isMasked ? leafScale : 0.0;
            unit.updateWindScales(
                trunkScale,
                effectiveLeafScale,
                foliageH
            );
        }

        const shadowList = this.#shadowMergedRenderUnits;
        const shadowCount = shadowList.length;
        for (let i = 0; i < shadowCount; i++) {
            shadowList[i].updateWindScales(
                trunkScale,
                leafScale,
                foliageH
            );
        }
    }

    #initBuckets(
        renderUnits: FoliageRenderUnit[],
        shadowMergedRenderUnits: FoliageRenderUnit[]
    ): void {
        this.#renderUnits = renderUnits;
        this.#shadowMergedRenderUnits = shadowMergedRenderUnits;

        let impostorUnit: FoliageRenderUnit | null = null;
        const unitCount = renderUnits.length;
        for (let i = 0; i < unitCount; i++) {
            const unit = renderUnits[i];
            if (unit.isImpostor) {
                impostorUnit = unit;
                break;
            }
        }
        this.#impostorRenderUnit = impostorUnit;

        const lod0List = this.#lod0RenderUnits;
        lod0List.length = 0;
        let hasMaskedLOD0 = false;
        for (let i = 0; i < unitCount; i++) {
            const unit = renderUnits[i];
            const {lodIndex, isMasked} = unit;
            if (lodIndex === 0) {
                lod0List.push(unit);
                if (isMasked) {
                    hasMaskedLOD0 = true;
                }
            }
        }
        this.#hasMaskedLOD0 = hasMaskedLOD0;

        this.#updatePassBuckets();
    }

    #updatePassBuckets(): void {
        const unitList = this.#renderUnits;
        const count = unitList.length;

        const prepassOpaqueList = this.#depthPrepassOpaqueRenderUnits;
        const prepassMaskedList = this.#depthPrepassMaskedRenderUnits;
        const mainList = this.#mainRenderUnits;

        prepassOpaqueList.length = 0;
        prepassMaskedList.length = 0;
        mainList.length = 0;

        const useImpostor = this.#useImpostor && !!this.#impostorRenderUnit;
        const useDepthPrepass = this.#useDepthPrepass;

        for (let i = 0; i < count; i++) {
            const unit = unitList[i];
            const {isImpostor, isMasked} = unit;
            if (!useImpostor && isImpostor) continue;
            if (useDepthPrepass && unit.canRenderInPass('depthPrepass')) {
                if (!isMasked) {
                    prepassOpaqueList.push(unit);
                } else {
                    prepassMaskedList.push(unit);
                }
            }
            if (unit.canRenderInPass('main')) {
                mainList.push(unit);
            }
        }
    }

    #updateRenderUnitGroundBlend(): void {
        const unitList = this.#renderUnits;
        const unitCount = unitList.length;
        for (let s = 0; s < unitCount; s++) {
            const unit = unitList[s];
            if (!unit.isImpostor) {
                unit.updateGroundBlendParams(this.groundBlendStrength, this.#groundBlendRange);
            }
        }
    }

    #updateRenderUnitReceiveShadow(): void {
        const unitList = this.#renderUnits;
        const unitCount = unitList.length;
        const receiveShadow = this.#receiveShadow;
        for (let s = 0; s < unitCount; s++) {
            const unit = unitList[s];
            if (!unit.isImpostor) {
                unit.updateReceiveShadow(receiveShadow);
            }
        }
    }

    #syncTypeParams(): void {
        const alloc = this.allocation;
        if (this.#megaBuffer && alloc) {
            const hasImp = !!this.#impostorRenderUnit;
            const effectiveLodList = (!this.#useImpostor && hasImp && this.#lodInfoListWithoutImpostor)
                ? this.#lodInfoListWithoutImpostor
                : this.#lodInfoList;

            const {cullingDistance, bottomOffset, height, castShadow, shadowCullDistance} = this;
            const effectiveShadowDist = castShadow ? shadowCullDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                alloc,
                cullingDistance,
                cullingDistance * 0.75,
                this.#boundingRadius,
                bottomOffset,
                effectiveLodList,
                effectiveShadowDist,
                height
            );
        }
    }

    #mountSubCell(subCell: FoliageSubCell, megaBuffer: FoliageMegaBuffer, allocation: FoliageTypeAllocation, subCellSize: number): void {
        if (subCell.isMounted) return;
        const {instanceCount: count} = subCell;
        const {instanceCount: currentActive, maxInstances, rawBaseOffset} = allocation;
        if (currentActive + count > maxInstances) return;

        const targetSlot = rawBaseOffset + currentActive;
        const landscape = this.#landscape;

        if (landscape?.hasValidScatterAtlas) {
            this.#baker.dispatchBakeSubCell(
                megaBuffer,
                landscape,
                this,
                subCell,
                targetSlot,
                count,
                subCellSize
            );
        }

        subCell.isMounted = true;
        subCell.mountedSlotIndex = currentActive;
        this.#mountedSubCells.push(subCell);

        allocation.instanceCount = currentActive + count;
    }

    #unmountSubCellAt(mountedIndex: number, megaBuffer: FoliageMegaBuffer, allocation: FoliageTypeAllocation, subCellSize: number): void {
        const mounted = this.#mountedSubCells;
        const targetSubCell = mounted[mountedIndex];
        const {mountedSlotIndex, instanceCount} = targetSubCell;
        const currentActive = allocation.instanceCount;

        const lastIndex = mounted.length - 1;
        const isLast = (mountedIndex === lastIndex);

        if (isLast) {
            mounted.pop();
            targetSubCell.isMounted = false;
            targetSubCell.mountedSlotIndex = -1;
            allocation.instanceCount = Math.max(0, currentActive - instanceCount);
        } else {
            const lastSubCell = mounted[lastIndex];
            mounted.length = lastIndex;
            const {instanceCount: lastCount} = lastSubCell;

            lastSubCell.mountedSlotIndex = mountedSlotIndex;
            mounted[mountedIndex] = lastSubCell;

            targetSubCell.isMounted = false;
            targetSubCell.mountedSlotIndex = -1;

            allocation.instanceCount = Math.max(0, currentActive - instanceCount);

            const landscape = this.#landscape;
            if (landscape?.hasValidScatterAtlas && lastCount > 0) {
                this.#baker.dispatchBakeSubCell(
                    megaBuffer,
                    landscape,
                    this,
                    lastSubCell,
                    allocation.rawBaseOffset + mountedSlotIndex,
                    lastCount,
                    subCellSize
                );
            }
        }
    }

    #computeSubCellInstances(cell: FoliageSubCell, subCellSize: number, currentLandscape?: Landscape): void {
        const landscape = currentLandscape ?? this.#landscape;
        if (!landscape) {
            cell.instanceCount = 0;
            return;
        }
        const {
            worldSizeX,
            worldSizeZ,
            invWorldSizeX,
            invWorldSizeZ,
            halfWorldSizeX: halfWorldX,
            halfWorldSizeZ: halfWorldZ
        } = landscape;
        const {subCellX: scX, subCellZ: scZ} = cell;

        const {
            densityPerHectare,
            densityMultiplier = 1.0,
            targetLayer,
            densityScaleByWeight = true,
            minSlope = 0.0,
            maxSlope = 45.0
        } = this;
        const targetCountPerHectare = Math.max(0, Math.round(densityPerHectare * densityMultiplier));
        if (targetCountPerHectare <= 0) {
            cell.instanceCount = 0;
            return;
        }
        const hasTargetLayer = targetLayer !== undefined && targetLayer !== '';
        let targetLayerObj: any = null;
        if (hasTargetLayer && landscape.layers) {
            if (typeof targetLayer === 'string') {
                const layers = landscape.layers;
                const len = layers.length;
                for (let li = 0; li < len; li++) {
                    if (layers[li].name === targetLayer) {
                        targetLayerObj = layers[li];
                        break;
                    }
                }
            } else if (typeof targetLayer === 'number') {
                targetLayerObj = landscape.layers[targetLayer];
            }
        }
        if (hasTargetLayer && !targetLayerObj) {
            cell.instanceCount = 0;
            return;
        }

        const hasSlopeFilter = minSlope > 0.0 || maxSlope < 90.0;

        const subMinX = scX * subCellSize - halfWorldX;
        const subMaxX = subMinX + subCellSize;
        const subMinZ = scZ * subCellSize - halfWorldZ;
        const subMaxZ = subMinZ + subCellSize;

        const startGx = Math.floor((subMinX + halfWorldX) / FOLIAGE_SEED_GRID_SIZE);
        const endGx = Math.floor((subMaxX + halfWorldX - 0.001) / FOLIAGE_SEED_GRID_SIZE);
        const startGz = Math.floor((subMinZ + halfWorldZ) / FOLIAGE_SEED_GRID_SIZE);
        const endGz = Math.floor((subMaxZ + halfWorldZ - 0.001) / FOLIAGE_SEED_GRID_SIZE);

        const nameHash = this.#nameHash;
        let validCount = 0;

        for (let gz = startGz; gz <= endGz; gz++) {
            const gridMinZ = gz * FOLIAGE_SEED_GRID_SIZE - halfWorldZ;
            for (let gx = startGx; gx <= endGx; gx++) {
                const gridMinX = gx * FOLIAGE_SEED_GRID_SIZE - halfWorldX;
                let seed = computeScatterGridSeed(gx, gz, nameHash);

                const maxAttempts = densityScaleByWeight
                    ? targetCountPerHectare
                    : ((targetLayerObj || hasSlopeFilter) ? targetCountPerHectare * 2 : targetCountPerHectare);
                let generatedInGrid = 0;

                for (let i = 0; i < maxAttempts && generatedInGrid < targetCountPerHectare; i++) {
                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rX = (seed >>> 0) / 4294967296.0;

                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rZ = (seed >>> 0) / 4294967296.0;

                    const posX = gridMinX + rX * FOLIAGE_SEED_GRID_SIZE;
                    const posZ = gridMinZ + rZ * FOLIAGE_SEED_GRID_SIZE;

                    if (targetLayerObj) {
                        const u = (posX + halfWorldX) * invWorldSizeX;
                        const v = (posZ + halfWorldZ) * invWorldSizeZ;
                        const weight = sampleNormalizedLayerWeight(landscape, targetLayerObj, u, v);
                        if (weight < 0.1) continue;
                        if (densityScaleByWeight) {
                            seed ^= seed << 13;
                            seed ^= seed >>> 17;
                            seed ^= seed << 5;
                            const rReject = (seed >>> 0) / 4294967296.0;
                            if (rReject > weight) continue;
                        }
                    }

                    if (hasSlopeFilter) {
                        const step = 1.0;
                        const hL = landscape.getHeightAt(posX - step, posZ);
                        const hR = landscape.getHeightAt(posX + step, posZ);
                        const hD = landscape.getHeightAt(posX, posZ - step);
                        const hU = landscape.getHeightAt(posX, posZ + step);
                        const nx = (hL - hR) / (2 * step);
                        const nz = (hD - hU) / (2 * step);
                        const invLen = 1.0 / Math.sqrt(nx * nx + 1.0 + nz * nz);
                        const slopeDeg = Math.acos(Math.min(1.0, invLen)) * 57.29577951308232;
                        if (slopeDeg < minSlope || slopeDeg > maxSlope) continue;
                    }

                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;

                    if (this.randomRotationY) {
                        seed ^= seed << 13;
                        seed ^= seed >>> 17;
                        seed ^= seed << 5;
                    }

                    generatedInGrid++;

                    if (posX >= subMinX && posX < subMaxX && posZ >= subMinZ && posZ < subMaxZ) {
                        validCount++;
                    }
                }
            }
        }

        cell.instanceCount = validCount;
    }

    #populateSingleSubCell(scX: number, scZ: number, subCellSize: number, currentLandscape?: Landscape): FoliageSubCell {
        const landscape = currentLandscape ?? this.#landscape;
        const halfWorldX = landscape ? landscape.halfWorldSizeX : 0;
        const halfWorldZ = landscape ? landscape.halfWorldSizeZ : 0;
        const cell: FoliageSubCell = {
            subCellKey: packSubCellKey(scX, scZ),
            subCellX: scX,
            subCellZ: scZ,
            centerX: (scX + 0.5) * subCellSize - halfWorldX,
            centerZ: (scZ + 0.5) * subCellSize - halfWorldZ,
            instanceCount: -1,
            isMounted: false,
            mountedSlotIndex: -1
        };
        this.#computeSubCellInstances(cell, subCellSize, landscape);
        return cell;
    }
}

Object.freeze(Foliage);
export default Foliage;

