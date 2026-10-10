/**
 * [KO] 단일 식생(Foliage) 종(Type)의 LOD 메쉬, 인스턴스 스트리밍, 렌더링 파라미터를 정의하고 관리하는 핵심 엔티티 모듈입니다.
 * [EN] Core entity module defining and managing LOD meshes, instance streaming, and rendering parameters for a single foliage type.
 * @packageDocumentation
 */
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import type Landscape from "../../Landscape";
import assembleFoliageRenderUnits from "./assembleFoliageRenderUnits";
import FoliageRenderUnit from "./FoliageRenderUnit";
import FoliageScatterMegaBuffer, {FoliageTypeAllocation} from "./buffer/FoliageScatterMegaBuffer";
import {AScatterType, AScatterTypeInitOptions} from "../../core/scatter";
import {FoliageSlotPooler} from "./buffer/FoliageSlotPooler";
import FoliageInstanceBaker from "./baking/FoliageInstanceBaker";

/**
 * [KO] 지형의 활성화된 레이어 목록 전체를 순회하여 특정 대상 레이어의 총합 대비 정규화된 가중치를 계산합니다. (식생 멀티 레이어 배치용)
 * [EN] Traverses all active landscape layers to compute the normalized weight of a target layer relative to total weight. (For foliage multi-layer placement)
 *
 * @param landscape - 대상 Landscape 인스턴스
 * @param targetLayer - 가중치를 산출할 대상 LandscapeLayer 객체
 * @param u - U 텍스처 좌표 (0.0 ~ 1.0)
 * @param v - V 텍스처 좌표 (0.0 ~ 1.0)
 * @returns 0.0 ~ 1.0 범위로 정규화된 레이어 가중치 값
 */
function sampleNormalizedLayerWeight(
    landscape: any,
    targetLayer: any,
    u: number,
    v: number
): number {
    if (!targetLayer) return 0.0;
    const layers = landscape.layers;
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

/**
 * [KO] 그리드 정수 좌표와 식생 타입 이름 해시로부터 결정론적(Deterministic) 32비트 의사난수 시드를 산출합니다.
 * [EN] Computes a deterministic 32-bit PRNG seed from integer grid coordinates and foliage type name hash.
 */
function computeScatterGridSeed(gridX: number, gridZ: number, nameHash: number): number {
    let seed = ((gridX * 73856093) ^ (gridZ * 19349663) ^ (nameHash * 83492791)) >>> 0;
    return seed === 0 ? 0x9e3779b9 : seed;
}

/**
 * [KO] 식생 인스턴스의 불변 월드 배치 좌표 및 의사난수 시드를 산출하는 고정 스캐터 그리드 크기 (단위: 미터, 100m).
 * [EN] Fixed scatter grid size (100m) for computing immutable world placement coordinates and PRNG seeds.
 */
const FIXED_SCATTER_GRID_SIZE: number = 100.0;

/**
 * [KO] 식생 서브셀 데이터 인터페이스입니다. (경량 메타데이터 구조체)
 * [EN] Foliage subcell data interface. (Lightweight metadata struct)
 */
export interface FoliageSubCell {
    subCellKey: number;
    subCellX: number;
    subCellZ: number;
    centerX: number;
    centerZ: number;
    instanceCount: number;
    isMounted: boolean;
    mountedSlotIndex: number;
}

/**
 * [KO] 서브셀의 정수 2D 좌표를 단일 32비트 정수 키로 패킹합니다.
 * [EN] Packs integer 2D coordinates of a subcell into a single 32-bit integer key.
 *
 * @param scX - 서브셀 정수 X 좌표
 * @param scZ - 서브셀 정수 Z 좌표
 * @returns 32비트 고유 정수 키
 */
function packSubCellKey(scX: number, scZ: number): number {
    return ((scZ << 16) | (scX & 0xFFFF)) | 0;
}

/**
 * [KO] 중심 좌표(`centerX`, `centerZ`)를 갖는 서브셀 객체 배열을 카메라 기준 거리 제곱값 오름차순으로 제자리 퀵 정렬합니다. (Zero-GC & 거리 단 1회 계산)
 * [EN] In-place quick-sorts subcell object arrays having `centerX` and `centerZ` in ascending order of squared distance to camera. (Zero-GC & single distance evaluation)
 *
 * @param subCells - 정렬할 서브셀 객체 배열
 * @param dists - 사전 할당된 거리 버퍼 (최소 subCells.length 이상의 Float32Array)
 * @param camX - 카메라 월드 X 좌표
 * @param camZ - 카메라 월드 Z 좌표
 * @param count - 정렬할 서브셀 개수
 */
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
 * [KO] 식생 LOD 설정 인터페이스입니다.
 * [EN] Foliage LOD configuration interface.
 */
export interface FoliageLODConfig {
    /**
     * [KO] LOD 레벨에 해당하는 메쉬 또는 메쉬 배열
     * [EN] Mesh or array of meshes corresponding to this LOD level
     */
    mesh: Mesh | Mesh[];
    /**
     * [KO] 해당 LOD가 전환되는 최대 가시 거리 (미터)
     * [EN] Maximum visible distance in meters at which this LOD switches
     */
    lodDistance?: number;
    /**
     * [KO] 해당 LOD 레벨의 그림자 수신 여부 (기본값: true)
     * [EN] Whether this LOD level receives shadows (default: true)
     */
    receiveShadow?: boolean;
}

/**
 * [KO] 조립 완료된 식생 LOD 메타데이터 인터페이스입니다.
 * [EN] Assembled foliage LOD metadata interface.
 */
export interface FoliageLODInfo {
    /**
     * [KO] LOD 레벨 인덱스 (0부터 시작)
     * [EN] LOD level index (starting from 0)
     */
    lodIndex: number;
    /**
     * [KO] LOD 전환 최대 거리 (미터)
     * [EN] LOD transition maximum distance in meters
     */
    lodDistance: number;
    /**
     * [KO] 전체 렌더 단위 배열 내 해당 LOD 시작 오프셋
     * [EN] Starting offset of this LOD in the global render unit array
     */
    renderUnitOffset: number;
    /**
     * [KO] 해당 LOD에 속한 렌더 단위 개수
     * [EN] Number of render units belonging to this LOD
     */
    renderUnitCount: number;
    /**
     * [KO] 그림자 수신 여부
     * [EN] Whether shadows are received
     */
    receiveShadow?: boolean;
}

/**
 * [KO] Foliage 인스턴스 생성 및 배치 설정을 위한 옵션 인터페이스입니다.
 * [EN] Configuration options interface for creating and scattering Foliage instances.
 */
export interface FoliageOptions extends AScatterTypeInitOptions {
    /**
     * [KO] LOD 레벨별 메쉬 및 가시 거리 구성 배열
     * [EN] Array of mesh and visibility distance configurations per LOD level
     */
    lods: FoliageLODConfig[];
    /**
     * [KO] 이 식생 타입의 그림자 수신 여부 (기본값: true)
     * [EN] Whether this foliage type receives shadows (default: true)
     */
    receiveShadow?: boolean;

    /**
     * [KO] 이 식생 타입에 할당될 최대 인스턴스 수용 용량 (기본값: 16384)
     * [EN] Maximum instance capacity allocated for this foliage type (default: 16384)
     */
    maxInstances?: number;

    /**
     * [KO] 인스턴스 랜덤 스케일 최소값 [x, y, z] (기본값: [1, 1, 1])
     * [EN] Minimum random scale for instances [x, y, z] (default: [1, 1, 1])
     */
    minScale?: [number, number, number];

    /**
     * [KO] 인스턴스 랜덤 스케일 최대값 [x, y, z] (기본값: [1, 1, 1])
     * [EN] Maximum random scale for instances [x, y, z] (default: [1, 1, 1])
     */
    maxScale?: [number, number, number];

    /**
     * [KO] 인스턴스 배치 시 Y축 360도 무작위 회전 적용 여부 (기본값: true)
     * [EN] Whether to apply random 360-degree Y rotation on placement (default: true)
     */
    randomRotationY?: boolean;

    /**
     * [KO] 마지막 LOD 단계에 옥타헤드럴 임포스터 빌보드를 자동 생성하여 부착할지 여부 (기본값: true)
     * [EN] Whether to automatically bake and attach an octahedral impostor billboard to the final LOD level (default: true)
     */
    useImpostor?: boolean;

    /**
     * [KO] 서브메시 결합 시 원본 피벗 유지 여부 (기본값: true)
     * [EN] Whether to preserve original pivots when combining sub-meshes (default: true)
     */
    preservePivot?: boolean;

    /**
     * [KO] 서브셀 스트리밍 활성 반경 (미터, 기본값: 600.0)
     * [EN] Active sub-cell streaming radius in meters (default: 600.0)
     */
    streamingRadius?: number;

    /**
     * [KO] 인스턴스 바람 시뮬레이션 기본 강도 배수 (기본값: 1.0)
     * [EN] Instance wind simulation base strength multiplier (default: 1.0)
     */
    windMultiplier?: number;

    /**
     * [KO] 인스턴스 잔잎 흔들림 강도 배수 (기본값: 1.0)
     * [EN] Instance leaf flutter strength multiplier (default: 1.0)
     */
    windFlutterMultiplier?: number;

    /**
     * [KO] 지형 표면 법선 벡터에 맞추어 인스턴스를 기울일지 여부
     * [EN] Whether to align instance orientation to terrain surface normal
     */
    alignToNormal?: boolean;

    /**
     * [KO] 지형 법선 정렬 강도 (0.0=수직 유지, 1.0=완전 경사 정렬)
     * [EN] Terrain normal alignment factor (0.0=stay upright, 1.0=full slope alignment)
     */
    alignFactor?: number;

    /**
     * [KO] 밑둥 지면 색상 블렌딩 높이 범위 (미터, 기본값: 1.5)
     * [EN] Bottom ground color blending vertical range in meters (default: 1.5)
     */
    groundBlendRange?: number;

    /**
     * [KO] 식생 렌더링 시 뎁스 프리패스(Early-Z) 패스 참여 여부 (기본값: true)
     * [EN] Whether foliage participates in the depth prepass (Early-Z) pass (default: true)
     */
    useDepthPrepass?: boolean;
}

/**
 * [KO] 단일 식생 종의 다단계 LOD 서브메쉬, 옥타헤드럴 임포스터, 서브셀 인스턴스 스트리밍을 총괄하는 핵심 클래스입니다.
 * [EN] Core class orchestrating multi-level LOD sub-meshes, octahedral impostors, and sub-cell instance streaming for a single foliage type.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // FoliageManager를 통해 인스턴스를 등록하고 참조를 얻습니다.
 * const tree = landscape.foliageManager.addType({
 *     name: 'PineTree',
 *     lods: [{ mesh: treeMesh }]
 * });
 * ```
 */
export class Foliage extends AScatterType<FoliageTypeAllocation> {
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

    #megaBuffer: FoliageScatterMegaBuffer | null = null;

    #boundingRadius: number = 10.0;
    #nameHash: number = 0;
    #useImpostor: boolean = true;
    #useDepthPrepass: boolean = true;
    #receiveShadow: boolean = true;
    #windMultiplier: number = 1.0;
    #windFlutterMultiplier: number = 1.0;
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

    #baker: FoliageInstanceBaker | null = null;
    onUniformDirty?: (typeId: number) => void;
    onRepopulateRequired?: (type: Foliage) => void;
    #slotPooler: FoliageSlotPooler | null = null;
    #landscape: Landscape | null = null;

    /**
     * [KO] 지형 식생/나무 인스턴스를 생성합니다. (사용자가 직접 생성하지 마시고 `landscape.foliageManager.addType(options)` 팩토리 메서드를 사용하십시오.)
     * [EN] Creates a landscape foliage instance. (Do not instantiate directly; use the `landscape.foliageManager.addType(options)` factory method instead.)
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param options -
     * [KO] 식생 설정 옵션
     * [EN] Foliage configuration options
     * @param megaBuffer -
     * [KO] 식생 메가 버퍼 (선택사항)
     * [EN] Foliage mega buffer (optional)
     * @param baker -
     * [KO] 식생 인스턴스 물리 베이커 (선택사항)
     * [EN] Foliage instance physical baker (optional)
     * @param slotPooler -
     * [KO] 256B 정렬 Dynamic Offset UBO 슬롯 풀러 (선택사항)
     * [EN] 256B aligned Dynamic Offset UBO slot pooler (optional)
     * @param landscape -
     * [KO] 부모 Landscape 인스턴스 (선택사항)
     * [EN] Parent Landscape instance (optional)
     */
    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageOptions,
        megaBuffer?: FoliageScatterMegaBuffer | null,
        baker?: FoliageInstanceBaker | null,
        slotPooler?: FoliageSlotPooler | null,
        landscape?: Landscape | null
    ) {
        super(redGPUContext, options.name);
        this.#landscape = landscape || null;
        this.#slotPooler = slotPooler || null;

        const {
            name,
            receiveShadow = true,
            castShadow = true,
            useImpostor = true,
            cullingDistance = 2000.0,
            minScale: optMinScale,
            maxScale: optMaxScale,
            densityPerHectare,
            densityMultiplier: optDensityMultiplier,
            streamingRadius = 600.0,
            maxInstances,
            windMultiplier,
            windFlutterMultiplier,
            alignToNormal = false,
            alignFactor,
            groundBlendStrength,
            groundBlendRange,
            useDepthPrepass = true,
            shadowCullDistance: optShadowCullDistance,
            targetLayer,
            minSlope = 0.0,
            maxSlope = 45.0,
            densityScaleByWeight = true,
            randomRotationY,
            bottomOffset = 0.0,
            height: optHeight
        } = options;

        this.#baker = baker || null;

        this.#receiveShadow = receiveShadow;
        this.#useImpostor = useImpostor;
        this.#useDepthPrepass = useDepthPrepass;
        this.#megaBuffer = megaBuffer || null;

        const [minX = 1.0, minY = 1.0, minZ = 1.0] = optMinScale || [];
        const [maxX = 1.0, maxY = 1.0, maxZ = 1.0] = optMaxScale || [];
        const minScale: [number, number, number] = [minX, minY, minZ];
        const maxScale: [number, number, number] = [maxX, maxY, maxZ];

        let resolvedDensityPerHectare = 20.0;
        if (densityPerHectare !== undefined) {
            resolvedDensityPerHectare = Math.max(0, Number(densityPerHectare) || 0);
        }

        const densityMultiplier = optDensityMultiplier !== undefined
            ? Math.max(0.0, Number(optDensityMultiplier) || 0.0)
            : 1.0;

        const effectiveRadius = streamingRadius + 150.0;
        const effectiveAreaMetersSq = Math.PI * effectiveRadius * effectiveRadius * 1.25;
        const activeHectares = effectiveAreaMetersSq / 10000.0;

        const expectedActiveInstances = activeHectares * resolvedDensityPerHectare * densityMultiplier;
        const calculatedMax = Math.ceil((expectedActiveInstances * 1.30) / 64) * 64;

        const minSafeCapacity = 16384;

        const resolvedMaxInstances = maxInstances !== undefined
            ? Math.max(maxInstances, calculatedMax, minSafeCapacity)
            : Math.max(calculatedMax, minSafeCapacity);

        const resolvedWindMultiplier = windMultiplier !== undefined ? Math.max(0, Number(windMultiplier) || 0) : 1.0;
        const resolvedWindFlutterMultiplier = windFlutterMultiplier !== undefined ? Math.max(0, Number(windFlutterMultiplier) || 0) : 1.0;

        const resolvedAlignToNormal = alignToNormal;
        const resolvedAlignFactor = alignFactor !== undefined
            ? Math.min(1.0, Math.max(0.0, Number(alignFactor) || 0))
            : 1.0;

        this.#windMultiplier = resolvedWindMultiplier;
        this.#windFlutterMultiplier = resolvedWindFlutterMultiplier;
        this.#alignToNormal = resolvedAlignToNormal;
        this.#alignFactor = resolvedAlignFactor;

        const resolvedGroundBlendStrength = groundBlendStrength !== undefined
            ? Math.max(0.0, Math.min(1.0, Number(groundBlendStrength) || 0.0))
            : 0.8;
        this.#groundBlendRange = groundBlendRange !== undefined
            ? Math.max(0.1, Number(groundBlendRange) || 0.1)
            : 1.5;

        let hash = 0;
        const nameStr = name || '';
        for (let c = 0; c < nameStr.length; c++) {
            hash = (hash * 31 + nameStr.charCodeAt(c)) | 0;
        }
        this.#nameHash = hash;

        const {
            lodInfoList,
            boundingRadius,
            boundingHeight,
            renderUnits: assembledUnits,
            shadowMergedRenderUnits: assembledShadowUnits
        } = assembleFoliageRenderUnits(
            this.redGPUContext,
            options,
            this.#slotPooler
        );
        this.#lodInfoList = lodInfoList;
        this.#lodInfoListWithoutImpostor = lodInfoList.length > 1 ? lodInfoList.slice(0, -1) : null;
        this.#boundingRadius = boundingRadius;
        const resolvedHeight = optHeight !== undefined
            ? Math.max(0.1, Number(optHeight) || 0.1)
            : (boundingHeight || 2.0);

        this.#initBuckets(
            assembledUnits,
            assembledShadowUnits
        );

        let defaultShadowDist = 300.0;
        const effectiveHeight = resolvedHeight * maxScale[1];
        if (effectiveHeight < 0.6) {
            defaultShadowDist = 35.0;
        } else if (effectiveHeight < 1.5) {
            defaultShadowDist = 75.0;
        } else if (effectiveHeight < 3.5) {
            defaultShadowDist = 160.0;
        } else {
            defaultShadowDist = 350.0;
        }

        const resolvedShadowCullDistance = optShadowCullDistance !== undefined
            ? Math.max(0, Number(optShadowCullDistance) || 0)
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
            densityMultiplier,
            castShadow,
            groundBlendStrength: resolvedGroundBlendStrength,
            streamingRadius
        });

        this.#minScale = minScale;
        this.#maxScale = maxScale;
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
            const effectiveShadowDist = this.castShadow ? this.shadowCullDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                alloc,
                this.cullingDistance,
                this.fadeStartDistance,
                this.#boundingRadius,
                this.bottomOffset,
                this.#lodInfoList,
                effectiveShadowDist,
                this.height
            );
        }

        this.#syncInternalWind();
        this.flushAllRenderUnitUBOs();
    }

    set windMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windMultiplier !== numVal) {
            this.#windMultiplier = numVal;
            this.#syncInternalWind();
            this.#notifyUniformDirty();
        }
    }

    set windFlutterMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windFlutterMultiplier !== numVal) {
            this.#windFlutterMultiplier = numVal;
            this.#syncInternalWind();
            this.#notifyUniformDirty();
        }
    }

    /**
     * [KO] 식생 이름 문자열의 32비트 해시 정수값을 반환합니다.
     * [EN] Returns the 32-bit hash integer of the foliage name string.
     */
    get nameHash(): number {
        return this.#nameHash;
    }

    /**
     * [KO] 이 식생 타입에 할당된 최대 인스턴스 수용 용량을 반환합니다.
     * [EN] Returns the maximum instance capacity allocated for this foliage type.
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
     * [KO] 인스턴스 절차적 배치 시 적용되는 최소 스케일 `[x, y, z]`을 반환합니다.
     * [EN] Returns the minimum scale `[x, y, z]` applied during procedural instance placement.
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
     * [KO] 인스턴스 절차적 배치 시 적용되는 최대 스케일 `[x, y, z]`을 반환합니다.
     * [EN] Returns the maximum scale `[x, y, z]` applied during procedural instance placement.
     */
    get maxScale(): [number, number, number] {
        return this.#maxScale;
    }

    /**
     * [KO] 인스턴스 배치 시 Y축 360도 무작위 회전 적용 여부를 반환합니다.
     * [EN] Returns whether random 360-degree Y rotation is applied during placement.
     */
    get randomRotationY(): boolean {
        return this.#randomRotationY;
    }

    /**
     * [KO] 인스턴스 데이터 및 간접 드로우 버퍼를 관리하는 연결된 메가버퍼를 반환합니다.
     * [EN] Returns the associated mega-buffer managing instance data and indirect draw buffers.
     */
    get megaBuffer(): FoliageScatterMegaBuffer | null {
        return this.#megaBuffer;
    }

    /**
     * [KO] 연결된 부모 Landscape 인스턴스를 반환합니다.
     * [EN] Returns the associated parent Landscape instance.
     */
    get landscape(): Landscape | null {
        return this.#landscape;
    }

    /**
     * [KO] 해당 식생 모델을 구성하는 공통 렌더 단위(FoliageRenderUnit) 컬렉션을 반환합니다.
     * [EN] Returns the collection of common render units composing this foliage model.
     */
    get renderUnits(): readonly FoliageRenderUnit[] {
        return this.#renderUnits;
    }

    /**
     * [KO] 이 식생 타입이 메인 렌더 패스에서 소비하는 간접 드로우콜 개수를 반환합니다.
     * [EN] Returns the number of indirect draw calls consumed by this foliage type in the main render pass.
     */
    override get drawCallCount(): number {
        let count = this.#mainRenderUnits.length;
        if (this.#useDepthPrepass) {
            count += this.#depthPrepassOpaqueRenderUnits.length + this.#depthPrepassMaskedRenderUnits.length;
        }
        return count;
    }

    /**
     * [KO] 뎁스 프리패스에서 Fast-Z로 렌더링되는 불투명(Opaque) 렌더 단위 목록을 반환합니다.
     * [EN] Returns the list of opaque render units rendered with Fast-Z in depth prepass.
     */
    get depthPrepassOpaqueRenderUnits(): FoliageRenderUnit[] {
        return this.#depthPrepassOpaqueRenderUnits;
    }

    /**
     * [KO] 뎁스 프리패스에서 알파 테스트로 렌더링되는 마스크(Masked) 렌더 단위 목록을 반환합니다.
     * [EN] Returns the list of masked render units rendered with alpha testing in depth prepass.
     */
    get depthPrepassMaskedRenderUnits(): FoliageRenderUnit[] {
        return this.#depthPrepassMaskedRenderUnits;
    }

    /**
     * [KO] 메인 포워드 렌더 패스에서 렌더링되는 렌더 단위 목록을 반환합니다.
     * [EN] Returns the list of render units rendered in the main forward render pass.
     */
    get mainRenderUnits(): FoliageRenderUnit[] {
        return this.#mainRenderUnits;
    }

    /**
     * [KO] 최상위 디테일 단계(LOD 0)에 속하는 렌더 단위 목록을 반환합니다.
     * [EN] Returns the list of render units belonging to the highest detail level (LOD 0).
     */
    get lod0RenderUnits(): FoliageRenderUnit[] {
        return this.#lod0RenderUnits;
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스용으로 병합 최적화된 렌더 단위 목록을 반환합니다.
     * [EN] Returns the list of merged render units optimized for cascaded shadow map (CSM) passes.
     */
    get shadowMergedRenderUnits(): FoliageRenderUnit[] {
        return this.#shadowMergedRenderUnits;
    }

    /**
     * [KO] 모든 LOD 레벨의 전환 거리 및 서브메시 오프셋 정보를 담은 배열을 반환합니다.
     * [EN] Returns the array containing transition distances and sub-mesh offsets for all LOD levels.
     */
    get lodInfoList(): FoliageLODInfo[] {
        return this.#lodInfoList;
    }

    /**
     * [KO] 현재 스트리밍되어 GPU 버퍼 상에 활성화된 인스턴스 수를 반환합니다.
     * [EN] Returns the number of instances currently active and streamed into GPU buffers.
     */
    get activeInstanceCount(): number {
        return this.allocation ? this.allocation.instanceCount : 0;
    }

    /**
     * [KO] 서브메시 UBO 슬롯 풀러 인스턴스를 반환합니다.
     * [EN] Returns the sub-mesh UBO slot pooler instance.
     */
    get slotPooler(): FoliageSlotPooler | null {
        return this.#slotPooler;
    }

    /**
     * [KO] 프러스텀 및 구체 컬링에 사용되는 바운딩 구체 반경(미터)을 반환합니다.
     * [EN] Returns the bounding sphere radius in meters used for frustum and sphere culling.
     */
    get boundingRadius(): number {
        return this.#boundingRadius;
    }




    /**
     * [KO] LOD 0 단계에 알파 마스킹(Cutout) 머티리얼이 포함되어 있는지 여부를 반환합니다.
     * [EN] Returns whether the LOD 0 stage contains alpha-masked (cutout) materials.
     */
    get hasMaskedLOD0(): boolean {
        return this.#hasMaskedLOD0;
    }


    /**
     * [KO] 인스턴스 줄기 바람 흔들림 강도 배수를 반환합니다.
     * [EN] Returns the trunk wind simulation strength multiplier.
     */
    get windMultiplier(): number {
        return this.#windMultiplier;
    }

    set alignToNormal(val: boolean) {
        const boolVal = !!val;
        if (this.#alignToNormal !== boolVal) {
            this.#alignToNormal = boolVal;
            this.#notifyRepopulateRequired();
        }
    }

    /**
     * [KO] 잎사귀 세부 떨림(Flutter) 강도 배수를 반환합니다.
     * [EN] Returns the leaf flutter simulation strength multiplier.
     */
    get windFlutterMultiplier(): number {
        return this.#windFlutterMultiplier;
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
     * [KO] 지형 표면 법선 벡터에 맞추어 인스턴스를 기울일지 여부를 반환합니다.
     * [EN] Returns whether to align instance orientation to the terrain surface normal.
     */
    get alignToNormal(): boolean {
        return this.#alignToNormal;
    }

    /**
     * [KO] 지형 밑둥 표면 색상 블렌딩이 적용되는 수직 높이 범위(미터)를 설정합니다.
     * [EN] Sets vertical height range in meters where bottom surface color blending is applied.
     *
     * @param v -
     * [KO] 설정할 지형 블렌딩 수직 범위 (최소값: 0.1)
     * [EN] Terrain blending vertical range to set (minimum: 0.1)
     */
    set groundBlendRange(v: number) {
        const val = Math.max(0.1, Number(v) || 0.1);
        if (this.#groundBlendRange !== val) {
            this.#groundBlendRange = val;
            this.#updateRenderUnitGroundBlend();
            this.#notifyUniformDirty();
        }
    }

    /**
     * [KO] 지형 법선 정렬 강도 (0.0=완전 수직 유지, 1.0=지형 경사면 완전 정렬)를 반환합니다.
     * [EN] Returns the terrain normal alignment factor (0.0=stay upright, 1.0=full slope alignment).
     */
    get alignFactor(): number {
        return this.#alignFactor;
    }

    /**
     * [KO] 이 식생 타입에 임포스터 렌더 단위가 생성되어 존재하는지 여부를 반환합니다.
     * [EN] Returns whether an impostor render unit exists for this foliage type.
     */
    get hasImpostor(): boolean {
        return !!this.#impostorRenderUnit;
    }

    /**
     * [KO] 원거리 렌더링 시 옥타헤드럴 임포스터 빌보드를 활성화하여 사용할지 여부를 반환합니다.
     * [EN] Returns whether octahedral impostor billboards are enabled for distant rendering.
     */
    get useImpostor(): boolean {
        return this.#useImpostor && !!this.#impostorRenderUnit;
    }

    /**
     * [KO] 원거리 렌더링 시 옥타헤드럴 임포스터 빌보드를 활성화하여 사용할지 여부를 설정합니다.
     * [EN] Sets whether octahedral impostor billboards are enabled for distant rendering.
     *
     * @param value -
     * [KO] 임포스터 빌보드 활성화 여부
     * [EN] Whether to enable octahedral impostor billboards
     */
    set useImpostor(value: boolean) {
        if (!this.#impostorRenderUnit) return;
        const boolVal = !!value;
        if (this.#useImpostor !== boolVal) {
            this.#useImpostor = boolVal;
            this.#updatePassBuckets();
            this.#notifyUniformDirty();
        }
    }

    /**
     * [KO] 식생 렌더링 시 뎁스 프리패스(Early-Z) 패스를 활성화할지 여부를 설정합니다.
     * [EN] Sets whether the depth prepass (Early-Z) is enabled during foliage rendering.
     *
     * @param value -
     * [KO] 뎁스 프리패스 활성화 여부
     * [EN] Whether depth prepass is enabled
     */
    set useDepthPrepass(value: boolean) {
        const boolVal = !!value;
        if (this.#useDepthPrepass !== boolVal) {
            this.#useDepthPrepass = boolVal;
            this.#updatePassBuckets();
            this.#notifyUniformDirty();
        }
    }

    /**
     * [KO] 식생 렌더링 시 뎁스 프리패스(Early-Z) 패스를 활성화할지 여부를 반환합니다.
     * [EN] Returns whether the depth prepass (Early-Z) is enabled during foliage rendering.
     */
    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    /**
     * [KO] 이 식생 타입의 그림자 수신 여부를 반환합니다.
     * [EN] Returns whether this foliage type receives shadows.
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    /**
     * [KO] 이 식생 타입의 그림자 수신 여부를 설정합니다.
     * [EN] Sets whether this foliage type receives shadows.
     *
     * @param value -
     * [KO] 그림자 수신 여부
     * [EN] Whether shadows are received
     */
    set receiveShadow(value: boolean) {
        const boolVal = !!value;
        if (this.#receiveShadow !== boolVal) {
            this.#receiveShadow = boolVal;
            this.#updateRenderUnitReceiveShadow();
            this.onParameterChanged('receiveShadow', boolVal);
        }
    }

    /**
     * [KO] 특정 LOD 단계의 최대 가시/전환 거리(미터)를 동적으로 변경합니다.
     * [EN] Dynamically changes the maximum visible/transition distance (meters) for a specific LOD level.
     *
     * @param lodIndex -
     * [KO] 변경할 LOD 레벨 인덱스
     * [EN] LOD level index to modify
     * @param distance -
     * [KO] 새로운 LOD 전환 거리 (미터)
     * [EN] New LOD transition distance (meters)
     */
    setLODDistance(lodIndex: number, distance: number): void {
        const info = this.#lodInfoList[lodIndex];
        if (info) {
            const val = Math.max(0, Number(distance) || 0);
            if (info.lodDistance !== val) {
                info.lodDistance = val;
                this.#notifyUniformDirty();
            }
        }
    }


    /**
     * [KO] 지형 밑둥 표면 색상 블렌딩이 적용되는 수직 높이 범위(미터)를 반환합니다.
     * [EN] Returns the vertical height range in meters where bottom surface color blending is applied.
     */
    get groundBlendRange(): number {
        return this.#groundBlendRange;
    }

    /**
     * [KO] 식생 인스턴스, 하위 서브메시 및 서브셀 스트리밍 리소스를 안전하게 해제합니다.
     * [EN] Safely releases foliage instance, child sub-meshes, and sub-cell streaming resources.
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
     * [KO] 현재 GPU 버퍼에 마운트되어 활성화된 서브셀의 총 개수를 반환합니다.
     * [EN] Returns the total number of sub-cells currently mounted and active in the GPU buffer.
     */
    get mountedSubCellCount(): number {
        return this.#mountedSubCells.length;
    }

    /**
     * [KO] 직전 스트리밍 업데이트에서 실제로 마운트된 서브셀 개수
     * [EN] Number of sub-cells actually mounted in the last streaming update
     */
    get lastMountedCount(): number {
        return this.#lastMountedCount;
    }

    /**
     * [KO] 직전 스트리밍 업데이트에서 실제로 언마운트된 서브셀 개수
     * [EN] Number of sub-cells actually unmounted in the last streaming update
     */
    get lastUnmountedCount(): number {
        return this.#lastUnmountedCount;
    }


    /**
     * [KO] 이 식생 타입에 속한 모든 렌더 단위 및 그림자 렌더 단위의 UBO 슬롯 파라미터와 타입 파라미터를 GPU로 단일 플러시합니다 (프레임 지연 배칭 전용).
     * [EN] Flushes UBO slot parameters and type parameters for all render units and shadow render units of this foliage type to GPU (deferred frame batching).
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
     * [KO] 스트리밍된 서브셀 캐시 및 GPU 마운트 인스턴스를 완전히 비우고 초기화합니다.
     * [EN] Completely clears and resets the streamed sub-cell cache and GPU mounted instances.
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
                this.#notifyRepopulateRequired();
                this.#notifyUniformDirty();
                break;

            case 'cullingDistance':
            case 'fadeStartDistance':
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

            case 'streamingRadius': {
                if (prevValue !== undefined && value < prevValue && this.#mountedSubCells.length > 0) {
                    const landscape = this.#landscape;
                    const megaBuffer = this.#megaBuffer;
                    const allocation = this.allocation;
                    if (landscape && megaBuffer && allocation) {
                        const subCellSize = landscape.foliageManager.subCellSize;
                        const unmountMargin = Math.max(10.0, subCellSize * 0.5);
                        const unmountRadiusSq = (value + unmountMargin) * (value + unmountMargin);
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
                }
                this.#notifyUniformDirty();
                break;
            }
        }
    }

    /**
     * [KO] 카메라 위치에 기반하여 이 식생 고유의 스트리밍 반경(streamingRadius) 내 서브셀을 온디맨드로 생성하고 GPU 메가버퍼에 점진적으로 마운트/언마운트합니다.
     * [EN] Populates sub-cells on-demand within this foliage's streamingRadius based on camera position and incrementally mounts/unmounts to the GPU mega-buffer.
     *
     * @param camX -
     * [KO] 카메라 월드 X 좌표
     * [EN] Camera world X coordinate
     * @param camZ -
     * [KO] 카메라 월드 Z 좌표
     * [EN] Camera world Z coordinate
     * @param mountBudget -
     * [KO] 이번 업데이트에서 마운트 가능한 최대 서브셀 수 (기본값: 16)
     * [EN] Maximum sub-cells allowed to mount in this update (default: 16)
     * @param unmountBudget -
     * [KO] 이번 업데이트에서 언마운트 가능한 최대 서브셀 수 (기본값: 32)
     * [EN] Maximum sub-cells allowed to unmount in this update (default: 32)
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
                        subCell = this.#populateSingleSubCell(sx, sz, subCellSize, landscape);
                        this.#subCells.set(key, subCell);
                    }
                    const {isMounted, instanceCount} = subCell;
                    if (!isMounted && instanceCount > 0) {
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

        const toMountCount = Math.min(candidateCount, mountBudget);
        for (let i = 0; i < toMountCount; i++) {
            const subCell = candidates[i];
            this.#mountSubCell(subCell, megaBuffer, allocation, subCellSize);
        }
        this.#lastMountedCount = toMountCount;
    }

    /**
     * [KO] 현재 활성화된 모든 식생 인스턴스의 지형 스냅 및 물리 배치를 재베이킹합니다.
     * [EN] Re-bakes terrain snapping and physical placement for all currently active foliage instances.
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
        const windMul = this.#windMultiplier;
        const flutterMul = this.#windFlutterMultiplier;
        const treeH = Math.max(5.0, this.#boundingRadius * 1.8);

        for (let i = 0; i < count; i++) {
            const unit = unitList[i];
            const effectiveFlutterMul = unit.isMasked ? flutterMul : 0.0;
            unit.updateWindMultipliers(
                windMul,
                effectiveFlutterMul,
                treeH
            );
        }

        const shadowList = this.#shadowMergedRenderUnits;
        const shadowCount = shadowList.length;
        for (let i = 0; i < shadowCount; i++) {
            shadowList[i].updateWindMultipliers(
                windMul,
                flutterMul,
                treeH
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

            const effectiveShadowDist = this.castShadow ? this.shadowCullDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                alloc,
                this.cullingDistance,
                this.fadeStartDistance,
                this.#boundingRadius,
                this.bottomOffset,
                effectiveLodList,
                effectiveShadowDist,
                this.height
            );
        }
    }

    #mountSubCell(subCell: FoliageSubCell, megaBuffer: FoliageScatterMegaBuffer, allocation: FoliageTypeAllocation, subCellSize: number): void {
        if (subCell.isMounted) return;
        const {instanceCount: count} = subCell;
        const {instanceCount: currentActive, maxInstances, rawBaseOffset} = allocation;
        if (currentActive + count > maxInstances) return;

        const targetSlot = rawBaseOffset + currentActive;
        const landscape = this.#landscape;

        if (landscape.hasValidScatterAtlas) {
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

    #unmountSubCellAt(mountedIndex: number, megaBuffer: FoliageScatterMegaBuffer, allocation: FoliageTypeAllocation, subCellSize: number): void {
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


    #populateSingleSubCell(scX: number, scZ: number, subCellSize: number, currentLandscape?: Landscape): FoliageSubCell {
        const key = packSubCellKey(scX, scZ);
        const landscape = currentLandscape || this.#landscape;
        if (!landscape) {
            throw new Error('[Foliage] Cannot populate sub-cell without an attached Landscape.');
        }
        const {
            worldSizeX,
            worldSizeZ,
            invWorldSizeX,
            invWorldSizeZ,
            halfWorldSizeX: halfWorldX,
            halfWorldSizeZ: halfWorldZ
        } = landscape;

        const centerX = (scX + 0.5) * subCellSize - halfWorldX;
        const centerZ = (scZ + 0.5) * subCellSize - halfWorldZ;

        const cell: FoliageSubCell = {
            subCellKey: key,
            subCellX: scX,
            subCellZ: scZ,
            centerX,
            centerZ,
            instanceCount: 0,
            isMounted: false,
            mountedSlotIndex: -1
        };

        const {
            densityPerHectare,
            densityMultiplier = 1.0,
            targetLayer,
            densityScaleByWeight = true,
            minSlope = 0.0,
            maxSlope = 45.0
        } = this;
        const targetCountPerHectare = Math.max(0, Math.round(densityPerHectare * densityMultiplier));
        if (targetCountPerHectare <= 0) return cell;
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
            return cell;
        }

        const hasSlopeFilter = minSlope > 0.0 || maxSlope < 90.0;

        const subMinX = scX * subCellSize - halfWorldX;
        const subMaxX = subMinX + subCellSize;
        const subMinZ = scZ * subCellSize - halfWorldZ;
        const subMaxZ = subMinZ + subCellSize;

        const startGx = Math.floor((subMinX + halfWorldX) / FIXED_SCATTER_GRID_SIZE);
        const endGx = Math.floor((subMaxX + halfWorldX - 0.001) / FIXED_SCATTER_GRID_SIZE);
        const startGz = Math.floor((subMinZ + halfWorldZ) / FIXED_SCATTER_GRID_SIZE);
        const endGz = Math.floor((subMaxZ + halfWorldZ - 0.001) / FIXED_SCATTER_GRID_SIZE);

        const nameHash = this.#nameHash;
        let validCount = 0;

        for (let gz = startGz; gz <= endGz; gz++) {
            const gridMinZ = gz * FIXED_SCATTER_GRID_SIZE - halfWorldZ;
            for (let gx = startGx; gx <= endGx; gx++) {
                const gridMinX = gx * FIXED_SCATTER_GRID_SIZE - halfWorldX;
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

                    const posX = gridMinX + rX * FIXED_SCATTER_GRID_SIZE;
                    const posZ = gridMinZ + rZ * FIXED_SCATTER_GRID_SIZE;

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
        return cell;
    }
}

Object.freeze(Foliage);
export default Foliage;
