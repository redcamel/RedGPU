/**
 * [KO] 단일 식생(Foliage) 종(Type)의 LOD 메쉬, 인스턴스 스트리밍, 렌더링 파라미터를 정의하고 관리하는 핵심 엔티티 모듈입니다.
 * [EN] Core entity module defining and managing LOD meshes, instance streaming, and rendering parameters for a single foliage type.
 * @packageDocumentation
 */
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import type Landscape from "../../Landscape";
import LandscapeComponent from "../../core/spatial/LandscapeComponent";
import assembleFoliageSubMeshes from "./assembler/assembleFoliageSubMeshes";
import FoliageSubMesh from "./submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "./submesh/FoliageShadowMergedSubMesh";
import FoliageScatterMegaBuffer, {FoliageTypeAllocation} from "./buffer/FoliageScatterMegaBuffer";
import {
    AScatterType,
    computeScatterGridSeed,
    fastPack2x16float,
    fastPackUniformScale,
    packSubCellKey,
    sampleNormalizedLayerWeight,
    ScatterInstanceBaker,
    sortSubCellsByDistance
} from "../../core/scatter";
import {FoliageSubMeshSlotPooler} from "./submesh/FoliageSubMeshSlotPooler";

/**
 * [KO] 식생 인스턴스의 불변 월드 배치 좌표 및 의사난수 시드를 산출하는 고정 스캐터 그리드 크기 (단위: 미터, 100m).
 * [EN] Fixed scatter grid size (100m) for computing immutable world placement coordinates and PRNG seeds.
 */
export const FIXED_SCATTER_GRID_SIZE: number = 100.0;

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
     * [KO] 전체 서브메시 배열 내 해당 LOD 시작 오프셋
     * [EN] Starting offset of this LOD in the global sub-mesh array
     */
    subMeshOffset: number;
    /**
     * [KO] 해당 LOD에 속한 서브메시 개수
     * [EN] Number of sub-meshes belonging to this LOD
     */
    subMeshCount: number;
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
export interface FoliageOptions {
    /**
     * [KO] 식생 종(Type)의 고유 식별 이름
     * [EN] Unique identification name of the foliage type
     */
    name: string;

    /**
     * [KO] LOD 레벨별 메쉬 및 가시 거리 구성 배열
     * [EN] Array of mesh and visibility distance configurations per LOD level
     */
    lods: FoliageLODConfig[];

    /**
     * [KO] 헥타르(10,000m²)당 기본 인스턴스 밀도 (기본값: 20.0)
     * [EN] Base instance density per hectare (10,000m²) (default: 20.0)
     */
    densityPerHectare?: number;

    /**
     * [KO] 이 식생 타입에 할당될 최대 인스턴스 수용 용량 (기본값: 16384)
     * [EN] Maximum instance capacity allocated for this foliage type (default: 16384)
     */
    maxInstances?: number;

    /**
     * [KO] 카메라로부터의 최대 렌더 컬링 거리 (미터, 기본값: 2000.0)
     * [EN] Maximum render culling distance from camera in meters (default: 2000.0)
     */
    cullingDistance?: number;

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
     * [KO] 밑둥 피벗 보정 오프셋 (미터)
     * [EN] Bottom pivot correction offset in meters
     */
    bottomOffset?: number;

    /**
     * [KO] 식생 모델의 물리 높이(미터, 미지정 시 지오메트리 바운딩 높이 자동 측정)
     * [EN] Physical height in meters of the foliage model (auto-measured from geometry bounding if omitted)
     */
    height?: number;

    /**
     * [KO] 서브메시 결합 시 원본 피벗 유지 여부 (기본값: true)
     * [EN] Whether to preserve original pivots when combining sub-meshes (default: true)
     */
    preservePivot?: boolean;

    /**
     * [KO] 그림자 캐스팅 활성화 여부 (기본값: true)
     * [EN] Whether shadow casting is enabled (default: true)
     */
    castShadow?: boolean;

    /**
     * [KO] 그림자 캐스팅 최대 거리 (미터, 기본값: 200.0)
     * [EN] Maximum shadow casting distance in meters (default: 200.0)
     */
    shadowCullDistance?: number;

    /**
     * [KO] 카메라 위치 기반 서브셀 동적 스트리밍 활성화 여부 (기본값: true)
     * [EN] Whether camera-based dynamic sub-cell streaming is enabled (default: true)
     */
    enableStreaming?: boolean;

    /**
     * [KO] 서브셀 스트리밍 활성 반경 (미터, 기본값: 600.0)
     * [EN] Active sub-cell streaming radius in meters (default: 600.0)
     */
    streamingRadius?: number;


    /**
     * [KO] 배치 대상 지형 스플랫 레이어 (레이어 이름 또는 인덱스)
     * [EN] Target terrain splat layer for placement (layer name or index)
     */
    targetLayer?: string | number;

    /**
     * [KO] 배치 허용 최소 경사도 (0.0=평지, 1.0=수직 절벽)
     * [EN] Minimum slope constraint for placement (0.0=flat, 1.0=vertical)
     */
    minSlope?: number;

    /**
     * [KO] 배치 허용 최대 경사도 (0.0=평지, 1.0=수직 절벽)
     * [EN] Maximum slope constraint for placement (0.0=flat, 1.0=vertical)
     */
    maxSlope?: number;

    /**
     * [KO] 스플랫 레이어 가중치에 비례하여 인스턴스 밀도를 조절할지 여부 (기본값: true)
     * [EN] Whether instance density scales proportionally to splat layer weight (default: true)
     */
    densityScaleByWeight?: boolean;

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
     * [KO] 전체 밀도 배수 (기본값: 1.0)
     * [EN] Global density multiplier (default: 1.0)
     */
    densityMultiplier?: number;

    /**
     * [KO] 밑둥 지면 색상 블렌딩 강도 (기본값: 0.8)
     * [EN] Bottom ground color blending strength (default: 0.8)
     */
    groundBlendStrength?: number;

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
 * const tree = landscape.foliageManager.addFoliage({
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

    #subMeshes: FoliageSubMesh[] = [];
    #shadowMergedSubMeshes: FoliageShadowMergedSubMesh[] = [];
    #lod0SubMeshes: FoliageSubMesh[] = [];
    #depthPrepassOpaqueSubMeshes: FoliageSubMesh[] = [];
    #depthPrepassMaskedSubMeshes: FoliageSubMesh[] = [];
    #mainSubMeshes: FoliageSubMesh[] = [];
    #hasMaskedLOD0: boolean = false;
    #unifiedGeometries: (Geometry | null)[] = [];
    #lodInfoList: FoliageLODInfo[] = [];

    #megaBuffer: FoliageScatterMegaBuffer | null = null;

    #boundingRadius: number = 10.0;
    #nameHash: number = 0;
    #useImpostor: boolean = true;
    #useDepthPrepass: boolean = true;
    #enableStreaming: boolean = true;
    #streamingRadius: number = 600.0;
    #windMultiplier: number = 1.0;
    #windFlutterMultiplier: number = 1.0;
    #alignToNormal: boolean = false;
    #alignFactor: number = 1.0;
    #groundBlendRange: number = 1.5;
    #impostorSubMesh: FoliageSubMesh | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #loadedTileKeys: Set<number> = new Set();
    #subCells: Map<number, FoliageSubCell> = new Map();
    #mountedSubCells: FoliageSubCell[] = [];
    #tempCandidates: FoliageSubCell[] = [];
    #candidateDists: Float32Array = new Float32Array(512);
    #lastMountedCount: number = 0;
    #lastUnmountedCount: number = 0;
    #lastCamX: number = 0;
    #lastCamZ: number = 0;

    #baker: ScatterInstanceBaker | null = null;
    #onDirty?: () => void;
    #onRepopulateRequired?: (type: Foliage) => void;
    #slotPooler: FoliageSubMeshSlotPooler | null = null;
    #subMeshMegaUBO: GPUBuffer | null = null;
    #landscape: Landscape | null = null;

    /**
     * [KO] 지형 식생/나무 인스턴스를 생성합니다. (사용자가 직접 생성하지 마시고 `landscape.foliageManager.addFoliage(options)` 팩토리 메서드를 사용하십시오.)
     * [EN] Creates a landscape foliage instance. (Do not instantiate directly; use the `landscape.foliageManager.addFoliage(options)` factory method instead.)
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param options -
     * [KO] 식생 설정 옵션
     * [EN] Foliage configuration options
     * @param sharedSubMeshBindGroupLayout -
     * [KO] 공유 서브메시 바인드 그룹 레이아웃 (선택사항)
     * [EN] Shared sub-mesh bind group layout (optional)
     * @param megaBuffer -
     * [KO] 식생 메가 버퍼 (선택사항)
     * [EN] Foliage mega buffer (optional)
     * @param onDirty -
     * [KO] 더티 상태 콜백 함수 (선택사항)
     * [EN] Dirty state callback function (optional)
     * @param onRepopulateRequired -
     * [KO] 재배치 요구 콜백 함수 (선택사항)
     * [EN] Repopulate required callback function (optional)
     * @param baker -
     * [KO] 식생 인스턴스 물리 베이커 (선택사항)
     * [EN] Foliage instance physical baker (optional)
     * @param slotPooler -
     * [KO] 256B 정렬 Dynamic Offset UBO 슬롯 풀러 (선택사항)
     * [EN] 256B aligned Dynamic Offset UBO slot pooler (optional)
     * @param subMeshMegaUBO -
     * [KO] 단일 고정 메가 UBO 버퍼 (선택사항)
     * [EN] Single fixed mega UBO buffer (optional)
     * @param landscape -
     * [KO] 부모 Landscape 인스턴스 (선택사항)
     * [EN] Parent Landscape instance (optional)
     */
    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageOptions,
        sharedSubMeshBindGroupLayout?: GPUBindGroupLayout | null,
        megaBuffer?: FoliageScatterMegaBuffer | null,
        onDirty?: () => void,
        onRepopulateRequired?: (type: Foliage) => void,
        baker?: ScatterInstanceBaker | null,
        slotPooler?: FoliageSubMeshSlotPooler | null,
        subMeshMegaUBO?: GPUBuffer | null,
        landscape?: Landscape | null
    ) {
        super(redGPUContext, options?.name || '');
        this.#landscape = landscape || null;
        this.#slotPooler = slotPooler || null;
        this.#subMeshMegaUBO = subMeshMegaUBO || null;

        const {
            name,
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
            useDepthPrepass = true
        } = options;

        this.#onDirty = onDirty;
        this.#onRepopulateRequired = onRepopulateRequired;
        this.#baker = baker || null;

        this.#useImpostor = useImpostor;
        this.#useDepthPrepass = useDepthPrepass !== false;

        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;
        this.#megaBuffer = megaBuffer || null;

        const minScale: [number, number, number] = optMinScale ? [...optMinScale] : [1.0, 1.0, 1.0];
        const maxScale: [number, number, number] = optMaxScale ? [...optMaxScale] : [1.0, 1.0, 1.0];

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

        const assembleResult = assembleFoliageSubMeshes(
            this.redGPUContext,
            options,
            this.#subMeshVertexBindGroupLayout!,
            this.#slotPooler,
            this.#subMeshMegaUBO
        );
        this.#unifiedGeometries = assembleResult.unifiedGeometries || [];
        this.#lodInfoList = assembleResult.lodInfoList || [];
        const resolvedBottomOffset = options.bottomOffset ?? 0;
        this.#boundingRadius = assembleResult.boundingRadius || 10.0;
        const resolvedHeight = options.height !== undefined
            ? Math.max(0.1, Number(options.height) || 0.1)
            : (assembleResult.boundingHeight || 2.0);

        this.#initBuckets(
            assembleResult.subMeshes,
            assembleResult.shadowMergedSubMeshes || []
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

        const resolvedShadowCullDistance = options.shadowCullDistance !== undefined
            ? Math.max(0, Number(options.shadowCullDistance) || 0)
            : defaultShadowDist;

        this.setRawScatterProperties({
            height: resolvedHeight,
            bottomOffset: resolvedBottomOffset,
            cullingDistance,
            shadowCullDistance: resolvedShadowCullDistance,
            targetLayer: options.targetLayer,
            minSlope: options.minSlope ?? 0.0,
            maxSlope: options.maxSlope ?? 45.0,
            densityScaleByWeight: options.densityScaleByWeight !== false,
            densityPerHectare: resolvedDensityPerHectare,
            densityMultiplier,
            castShadow: castShadow !== false,
            groundBlendStrength: resolvedGroundBlendStrength
        });

        this.#minScale = minScale;
        this.#maxScale = maxScale;
        this.#randomRotationY = options.randomRotationY ?? true;
        this.#maxInstances = resolvedMaxInstances;
        this.#enableStreaming = options.enableStreaming !== false;
        this.#streamingRadius = streamingRadius;

        this.updateDrawCallCount(this.drawCallCount);

        if (this.#megaBuffer) {
            const alloc = this.#megaBuffer.allocateType(
                this.name,
                resolvedMaxInstances,
                this.#subMeshes,
                this.#shadowMergedSubMeshes,
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

    /**
     * [KO] 인스턴스 절차적 배치 시 적용되는 최소 스케일 `[x, y, z]`을 반환합니다.
     * [EN] Returns the minimum scale `[x, y, z]` applied during procedural instance placement.
     */
    get minScale(): [number, number, number] {
        return this.#minScale;
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
     * [KO] 모든 LOD 단계를 포함하는 전체 서브메시 목록을 반환합니다.
     * [EN] Returns the list of all sub-meshes across all LOD levels.
     */
    get subMeshes(): FoliageSubMesh[] {
        return this.#subMeshes;
    }

    /**
     * [KO] LOD 레벨별 단일 통합 지오메트리 배열을 반환합니다.
     * [EN] Returns the array of per-LOD unified geometries.
     */
    override get unifiedGeometries(): (Geometry | null)[] {
        return this.#unifiedGeometries;
    }

    /**
     * [KO] 이 식생 타입이 메인 렌더 패스에서 소비하는 간접 드로우콜 개수를 반환합니다.
     * [EN] Returns the number of indirect draw calls consumed by this foliage type in the main render pass.
     */
    override get drawCallCount(): number {
        let count = this.#mainSubMeshes.length;
        if (this.#useDepthPrepass) {
            count += this.#depthPrepassOpaqueSubMeshes.length + this.#depthPrepassMaskedSubMeshes.length;
        }
        return count;
    }

    /**
     * [KO] 등록된 총 서브메시 개수를 반환합니다.
     * [EN] Returns the total number of registered sub-meshes.
     */
    override get subMeshCount(): number {
        return this.#subMeshes.length;
    }


    /**
     * [KO] 뎁스 프리패스에서 Fast-Z로 렌더링되는 불투명(Opaque) 서브메시 목록을 반환합니다.
     * [EN] Returns the list of opaque sub-meshes rendered with Fast-Z in depth prepass.
     */
    get depthPrepassOpaqueSubMeshes(): FoliageSubMesh[] {
        return this.#depthPrepassOpaqueSubMeshes;
    }

    /**
     * [KO] 뎁스 프리패스에서 알파 테스트로 렌더링되는 마스크(Masked) 서브메시 목록을 반환합니다.
     * [EN] Returns the list of masked sub-meshes rendered with alpha testing in depth prepass.
     */
    get depthPrepassMaskedSubMeshes(): FoliageSubMesh[] {
        return this.#depthPrepassMaskedSubMeshes;
    }

    /**
     * [KO] 메인 포워드 렌더 패스에서 렌더링되는 서브메시 목록을 반환합니다.
     * [EN] Returns the list of sub-meshes rendered in the main forward render pass.
     */
    get mainSubMeshes(): FoliageSubMesh[] {
        return this.#mainSubMeshes;
    }

    /**
     * [KO] 최상위 디테일 단계(LOD 0)에 속하는 서브메시 목록을 반환합니다.
     * [EN] Returns the list of sub-meshes belonging to the highest detail level (LOD 0).
     */
    get lod0SubMeshes(): FoliageSubMesh[] {
        return this.#lod0SubMeshes;
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스용으로 병합 최적화된 서브메시 목록을 반환합니다.
     * [EN] Returns the list of merged sub-meshes optimized for cascaded shadow map (CSM) passes.
     */
    get shadowMergedSubMeshes(): FoliageShadowMergedSubMesh[] {
        return this.#shadowMergedSubMeshes;
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
        return this.allocation?.instanceCount ?? 0;
    }

    /**
     * [KO] 서브메시 UBO 슬롯 풀러 인스턴스를 반환합니다.
     * [EN] Returns the sub-mesh UBO slot pooler instance.
     */
    get slotPooler(): FoliageSubMeshSlotPooler | null {
        return this.#slotPooler;
    }

    /**
     * [KO] 단일 고정 메가 UBO 버퍼를 반환합니다.
     * [EN] Returns the single fixed mega UBO buffer.
     */
    get subMeshMegaUBO(): GPUBuffer | null {
        return this.#subMeshMegaUBO;
    }

    /**
     * [KO] 프러스텀 및 구체 컬링에 사용되는 바운딩 구체 반경(미터)을 반환합니다.
     * [EN] Returns the bounding sphere radius in meters used for frustum and sphere culling.
     */
    get boundingRadius(): number {
        return this.#boundingRadius;
    }

    /**
     * [KO] 카메라 위치 기반 서브셀 동적 스트리밍 활성화 여부를 반환합니다.
     * [EN] Returns whether camera-based dynamic sub-cell streaming is enabled.
     */
    get enableStreaming(): boolean {
        return this.#enableStreaming;
    }

    /**
     * [KO] 카메라 위치 기반 서브셀 동적 스트리밍 활성화 여부를 설정합니다.
     * [EN] Sets whether camera-based dynamic sub-cell streaming is enabled.
     *
     * @param value -
     * [KO] 스트리밍 활성화 여부
     * [EN] Whether to enable streaming
     */
    set enableStreaming(value: boolean) {
        this.#enableStreaming = !!value;
    }

    /**
     * [KO] 서브셀 스트리밍이 활성화되는 반경(미터)을 반환합니다.
     * [EN] Returns the active sub-cell streaming radius in meters.
     */
    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    /**
     * [KO] 서브셀 스트리밍이 활성화되는 반경(미터)을 설정합니다. 값이 축소될 경우 반경을 벗어난 서브셀을 즉시 언마운트합니다.
     * [EN] Sets active sub-cell streaming radius in meters. When reduced, sub-cells outside the radius are immediately unmounted.
     *
     * @param value -
     * [KO] 설정할 스트리밍 반경 (최소값: 10.0)
     * [EN] Streaming radius to set (minimum: 10.0)
     */
    set streamingRadius(value: number) {
        const numVal = Math.max(10.0, Number(value) || 10.0);
        if (this.#streamingRadius !== numVal) {
            const oldRadius = this.#streamingRadius;
            this.#streamingRadius = numVal;

            if (numVal < oldRadius && this.#mountedSubCells.length > 0) {
                const subCellSize = this.#landscape?.foliageManager?.subCellSize ?? 100.0;
                const unmountMargin = Math.max(10.0, subCellSize * 0.5);
                const unmountRadiusSq = (numVal + unmountMargin) * (numVal + unmountMargin);
                const megaBuffer = this.#megaBuffer;
                const allocation = this.allocation;
                if (megaBuffer && allocation) {
                    const mounted = this.#mountedSubCells;
                    for (let i = mounted.length - 1; i >= 0; i--) {
                        const sc = mounted[i];
                        const dx = sc.centerX - this.#lastCamX;
                        const dz = sc.centerZ - this.#lastCamZ;
                        if (dx * dx + dz * dz > unmountRadiusSq) {
                            this.#unmountSubCellAt(i, megaBuffer, allocation);
                        }
                    }
                }
            }

            this.#onDirty?.();
        }
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

    set windMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windMultiplier !== numVal) {
            this.#windMultiplier = numVal;
            this.#syncInternalWind();
            this.#onDirty?.();
        }
    }

    /**
     * [KO] 잎사귀 세부 떨림(Flutter) 강도 배수를 반환합니다.
     * [EN] Returns the leaf flutter simulation strength multiplier.
     */
    get windFlutterMultiplier(): number {
        return this.#windFlutterMultiplier;
    }

    set windFlutterMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windFlutterMultiplier !== numVal) {
            this.#windFlutterMultiplier = numVal;
            this.#syncInternalWind();
            this.#onDirty?.();
        }
    }

    /**
     * [KO] 지형 표면 법선 벡터에 맞추어 인스턴스를 기울일지 여부를 반환합니다.
     * [EN] Returns whether to align instance orientation to the terrain surface normal.
     */
    get alignToNormal(): boolean {
        return this.#alignToNormal;
    }

    set alignToNormal(val: boolean) {
        const boolVal = !!val;
        if (this.#alignToNormal !== boolVal) {
            this.#alignToNormal = boolVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    /**
     * [KO] 지형 법선 정렬 강도 (0.0=완전 수직 유지, 1.0=지형 경사면 완전 정렬)를 반환합니다.
     * [EN] Returns the terrain normal alignment factor (0.0=stay upright, 1.0=full slope alignment).
     */
    get alignFactor(): number {
        return this.#alignFactor;
    }

    set alignFactor(val: number) {
        const numVal = Math.min(1.0, Math.max(0.0, Number(val) || 0.0));
        if (this.#alignFactor !== numVal) {
            this.#alignFactor = numVal;
            if (this.#alignToNormal) {
                this.#onRepopulateRequired?.(this);
            }
        }
    }

    /**
     * [KO] 이 식생 타입에 임포스터 서브메시가 생성되어 존재하는지 여부를 반환합니다.
     * [EN] Returns whether an impostor sub-mesh exists for this foliage type.
     */
    get hasImpostor(): boolean {
        return !!this.#impostorSubMesh;
    }

    /**
     * [KO] 원거리 렌더링 시 옥타헤드럴 임포스터 빌보드를 활성화하여 사용할지 여부를 반환합니다.
     * [EN] Returns whether octahedral impostor billboards are enabled for distant rendering.
     */
    get useImpostor(): boolean {
        return this.#useImpostor && !!this.#impostorSubMesh;
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
     * [KO] 식생 렌더링 시 뎁스 프리패스(Early-Z) 패스를 활성화할지 여부를 반환합니다.
     * [EN] Returns whether the depth prepass (Early-Z) is enabled during foliage rendering.
     */
    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
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
            this.updateDrawCallCount(this.drawCallCount);
            this.#onDirty?.();
        }
    }

    /**
     * [KO] 현재 로드되어 인스턴스가 등록된 타일의 총 개수를 반환합니다.
     * [EN] Returns the total number of currently loaded tiles with populated instances.
     */
    get loadedTileCount(): number {
        return this.#loadedTileKeys.size;
    }

    /**
     * [KO] 지형 밑둥 표면 색상 블렌딩이 적용되는 수직 높이 범위(미터)를 반환합니다.
     * [EN] Returns the vertical height range in meters where bottom surface color blending is applied.
     */
    get groundBlendRange(): number {
        return this.#groundBlendRange;
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
            this.#updateSubMeshGroundBlend();
        }
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

    protected override onParameterChanged(prop: string, value: any): void {
        switch (prop) {
            case 'bottomOffset':
                this.#syncTypeParams();
                this.rebake();
                break;
            case 'cullingDistance':
            case 'fadeStartDistance':
                this.#syncTypeParams();
                break;
            case 'shadowCullDistance':
            case 'castShadow':
                this.#syncTypeParams();
                this.#onDirty?.();
                break;
            case 'targetLayer':
            case 'minSlope':
            case 'maxSlope':
            case 'densityScaleByWeight':
            case 'densityPerHectare':
            case 'densityMultiplier':
                this.#onRepopulateRequired?.(this);
                break;
            case 'groundBlendStrength':
                this.#updateSubMeshGroundBlend();
                break;
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
                this.#syncTypeParams();
                this.#onDirty?.();
            }
        }
    }


    /**
     * [KO] 스트리머의 타일 캐시 및 로드된 컴포넌트 키 목록을 완전히 비웁니다.
     * [EN] Clears the tile cache and loaded component key set in the streamer.
     */
    clearTileCache(): void {
        this.#loadedTileKeys.clear();
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
     * [KO] 신규 지형 타일 컴포넌트가 로드되었을 때 호출되는 타일 라이프사이클 훅입니다. (온디맨드 모드에서는 CPU 스파이크 없이 타일 키만 기록)
     * [EN] Terrain tile lifecycle hook invoked when a new tile component finishes loading. (In on-demand mode, records tile key with zero CPU spike)
     *
     * @param tileComponent -
     * [KO] 로드된 지형 타일 컴포넌트 (`LandscapeComponent`)
     * [EN] Loaded terrain tile component (`LandscapeComponent`)
     * @param landscape -
     * [KO] 부모 Landscape 인스턴스 (선택사항)
     * [EN] Parent Landscape instance (optional)
     */
    populateTile(tileComponent: LandscapeComponent, landscape?: Landscape): void {
        if (!tileComponent) return;
        if (landscape) this.#landscape = landscape;

        const cz = (tileComponent.componentZ ?? 0) & 0xffff;
        const cx = (tileComponent.componentX ?? 0) & 0xffff;
        const key = (cz << 16) | cx;
        if (this.#loadedTileKeys.has(key)) return;

        const effectiveLandscape = landscape || this.#landscape;
        this.#loadedTileKeys.add(key);

        if (!this.#enableStreaming) {
            const subCellSize = this.#landscape?.foliageManager?.subCellSize ?? 100.0;
            this.#partitionTileSync(tileComponent, effectiveLandscape, subCellSize);
            const megaBuffer = this.#megaBuffer;
            const allocation = this.allocation;
            if (megaBuffer && allocation) {
                this.#mountAllSubCells(megaBuffer, allocation, subCellSize);
            }
        }
    }

    /**
     * [KO] 식생 인스턴스, 하위 서브메시 및 스트리머 리소스를 안전하게 해제합니다.
     * [EN] Safely releases foliage instance, child sub-meshes, and streamer resources.
     */
    override destroy(): void {
        this.clearTileCache();

        const subCount = this.#subMeshes.length;
        for (let i = 0; i < subCount; i++) {
            this.#subMeshes[i].destroy();
        }
        this.#subMeshes.length = 0;
        this.#lod0SubMeshes.length = 0;
        this.#depthPrepassOpaqueSubMeshes.length = 0;
        this.#depthPrepassMaskedSubMeshes.length = 0;
        this.#mainSubMeshes.length = 0;

        const shadowCount = this.#shadowMergedSubMeshes.length;
        for (let i = 0; i < shadowCount; i++) {
            this.#shadowMergedSubMeshes[i].destroy();
        }
        this.#shadowMergedSubMeshes.length = 0;

        this.#unifiedGeometries.length = 0;
        super.destroy();
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

        const megaBuffer = this.#megaBuffer;
        const allocation = this.allocation;
        if (!megaBuffer || !allocation) return;

        const subCellSize = this.#landscape?.foliageManager?.subCellSize ?? 100.0;

        if (!this.#enableStreaming) {
            this.#mountAllSubCells(megaBuffer, allocation, subCellSize);
            return;
        }

        const typeRadius = this.#streamingRadius;
        const unmountMargin = Math.max(10.0, subCellSize * 0.5);
        const unmountRadius = typeRadius + unmountMargin;
        const unmountRadiusSq = unmountRadius * unmountRadius;

        let unmountedThisFrame = 0;
        const mounted = this.#mountedSubCells;
        for (let i = mounted.length - 1; i >= 0; i--) {
            if (unmountedThisFrame >= unmountBudget) break;

            const subCell = mounted[i];
            const dx = subCell.centerX - camX;
            const dz = subCell.centerZ - camZ;
            const distSq = dx * dx + dz * dz;

            if (distSq > unmountRadiusSq) {
                this.#unmountSubCellAt(i, megaBuffer, allocation);
                unmountedThisFrame++;
            }
        }
        this.#lastUnmountedCount = unmountedThisFrame;

        if (mountBudget <= 0) return;

        const candidates = this.#tempCandidates;
        candidates.length = 0;

        const landscape = this.#landscape;
        const worldSizeX = landscape?.worldSize?.[0] ?? 16000.0;
        const worldSizeZ = landscape?.worldSize?.[1] ?? 16000.0;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

        const totalCellsX = Math.max(1, Math.floor(worldSizeX / subCellSize));
        const totalCellsZ = Math.max(1, Math.floor(worldSizeZ / subCellSize));

        const minSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX - typeRadius + halfWorldX) / subCellSize)));
        const maxSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX + typeRadius + halfWorldX) / subCellSize)));
        const minSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ - typeRadius + halfWorldZ) / subCellSize)));
        const maxSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ + typeRadius + halfWorldZ) / subCellSize)));

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
                        subCell = this.#populateSingleSubCell(sx, sz, subCellSize);
                        this.#subCells.set(key, subCell);
                    }
                    if (subCell && !subCell.isMounted && subCell.instanceCount > 0) {
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
     * [KO] 지정된 오프셋 및 개수의 인스턴스 데이터를 CPU 스테이징에서 GPU 원본 인스턴스 버퍼로 업로드하고 베이킹 태스크를 등록합니다.
     * [EN] Uploads instance data of the specified range from CPU staging to GPU raw buffer and queues baking tasks.
     *
     * @param startIndex -
     * [KO] 타입 할당 내 로컬 시작 오프셋
     * [EN] Local start offset within type allocation
     * @param count -
     * [KO] 업로드할 인스턴스 개수
     * [EN] Number of instances to upload
     */
    uploadRangeToGPU(startIndex: number, count: number): void {
        const alloc = this.allocation;
        if (this.#megaBuffer && alloc) {
            this.#megaBuffer.uploadAllocationRangeToGPU(alloc, startIndex, count);
            if (this.#baker && count > 0) {
                const globalIndex = alloc.rawBaseOffset + startIndex;
                this.#baker.addBakeTasks(globalIndex, count, alloc.typeId);
            }
        }
    }

    /**
     * [KO] 현재 활성화된 모든 식생 인스턴스의 지형 스냅 및 물리 배치를 재베이킹합니다.
     * [EN] Re-bakes terrain snapping and physical placement for all currently active foliage instances.
     */
    rebake(): void {
        const alloc = this.allocation;
        if (this.#megaBuffer && alloc && this.#baker && alloc.instanceCount > 0) {
            this.#baker.addBakeTasks(
                alloc.rawBaseOffset,
                alloc.instanceCount,
                alloc.typeId
            );
        }
    }

    #syncInternalWind(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;
        const subList = this.#subMeshes;
        const count = subList.length;
        const windMul = this.#windMultiplier;
        const flutterMul = this.#windFlutterMultiplier;
        const treeH = Math.max(5.0, this.#boundingRadius * 1.8);

        for (let i = 0; i < count; i++) {
            const sub = subList[i];
            const effectiveFlutterMul = sub.isMasked ? flutterMul : 0.0;
            sub.updateWindMultipliers(
                gpuDevice,
                windMul,
                effectiveFlutterMul,
                treeH
            );
        }

        const shadowList = this.#shadowMergedSubMeshes;
        const shadowCount = shadowList.length;
        for (let i = 0; i < shadowCount; i++) {
            shadowList[i].updateWindMultipliers(
                gpuDevice,
                windMul,
                flutterMul * 0.5,
                treeH
            );
        }
    }

    #initBuckets(
        subMeshes: FoliageSubMesh[],
        shadowMergedSubMeshes: FoliageShadowMergedSubMesh[]
    ): void {
        this.#subMeshes = subMeshes;
        this.#shadowMergedSubMeshes = shadowMergedSubMeshes;

        let impostorSub: FoliageSubMesh | null = null;
        const subCount = subMeshes.length;
        for (let i = 0; i < subCount; i++) {
            const sub = subMeshes[i];
            if (sub.isImpostor) {
                impostorSub = sub;
                break;
            }
        }
        this.#impostorSubMesh = impostorSub;

        const lod0List = this.#lod0SubMeshes;
        lod0List.length = 0;
        let hasMaskedLOD0 = false;
        for (let i = 0; i < subCount; i++) {
            const sub = subMeshes[i];
            if (sub.lodIndex === 0) {
                lod0List.push(sub);
                if (sub.isMasked) {
                    hasMaskedLOD0 = true;
                }
            }
        }
        this.#hasMaskedLOD0 = hasMaskedLOD0;

        this.#updatePassBuckets();
    }

    #updatePassBuckets(): void {
        const subList = this.#subMeshes;
        const count = subList.length;

        const prepassOpaqueList = this.#depthPrepassOpaqueSubMeshes;
        const prepassMaskedList = this.#depthPrepassMaskedSubMeshes;
        const mainList = this.#mainSubMeshes;

        prepassOpaqueList.length = 0;
        prepassMaskedList.length = 0;
        mainList.length = 0;

        const useImpostor = this.#useImpostor && !!this.#impostorSubMesh;
        const useDepthPrepass = this.#useDepthPrepass;

        for (let i = 0; i < count; i++) {
            const sub = subList[i];
            if (!useImpostor && sub.isImpostor) continue;
            if (useDepthPrepass && sub.canRenderInPass('depthPrepass')) {
                if (!sub.isMasked) {
                    prepassOpaqueList.push(sub);
                } else {
                    prepassMaskedList.push(sub);
                }
            }
            if (sub.canRenderInPass('main')) {
                mainList.push(sub);
            }
        }
    }

    #updateSubMeshGroundBlend(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;
        const subList = this.#subMeshes;
        const subCount = subList.length;
        for (let s = 0; s < subCount; s++) {
            const sub = subList[s];
            if (!sub.isImpostor) {
                sub.updateGroundBlendParams(gpuDevice, this.groundBlendStrength, this.#groundBlendRange);
            }
        }
    }

    #syncTypeParams(): void {
        const alloc = this.allocation;
        if (this.#megaBuffer && alloc) {
            const hasImp = !!this.#impostorSubMesh;
            const effectiveLodList = (!this.#useImpostor && hasImp && this.#lodInfoList.length > 1)
                ? this.#lodInfoList.slice(0, -1)
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

    #mountSubCell(subCell: FoliageSubCell, megaBuffer: FoliageScatterMegaBuffer, allocation: any, subCellSize: number): void {
        if (subCell.isMounted) return;
        const currentActive = allocation.instanceCount;
        const count = subCell.instanceCount;
        if (currentActive + count > allocation.maxInstances) return;

        const f32 = megaBuffer.cpuRawDataBuffer;
        const u32 = megaBuffer.cpuRawDataUint32;
        const strideFloats = megaBuffer.strideFloats;
        const baseFloat = (allocation.rawBaseOffset + currentActive) * strideFloats;

        this.#populateSubCellInstances(f32, u32, baseFloat, subCell, subCellSize);

        subCell.isMounted = true;
        subCell.mountedSlotIndex = currentActive;
        this.#mountedSubCells.push(subCell);

        allocation.instanceCount = currentActive + count;
        this.uploadRangeToGPU(currentActive, count);
    }

    #unmountSubCellAt(mountedIndex: number, megaBuffer: FoliageScatterMegaBuffer, allocation: any): void {
        const mounted = this.#mountedSubCells;
        const targetSubCell = mounted[mountedIndex];
        const targetSlot = targetSubCell.mountedSlotIndex;
        const targetCount = targetSubCell.instanceCount;
        const currentActive = allocation.instanceCount;

        const isLast = (mountedIndex === mounted.length - 1);

        if (isLast) {
            mounted.pop();
            targetSubCell.isMounted = false;
            targetSubCell.mountedSlotIndex = -1;
            allocation.instanceCount = Math.max(0, currentActive - targetCount);
        } else {
            const lastSubCell = mounted.pop()!;
            const lastSlot = lastSubCell.mountedSlotIndex;
            const lastCount = lastSubCell.instanceCount;

            const f32 = megaBuffer.cpuRawDataBuffer;
            const strideFloats = megaBuffer.strideFloats;

            const srcStartFloat = (allocation.rawBaseOffset + lastSlot) * strideFloats;
            const srcEndFloat = srcStartFloat + lastCount * strideFloats;
            const destFloat = (allocation.rawBaseOffset + targetSlot) * strideFloats;

            f32.copyWithin(destFloat, srcStartFloat, srcEndFloat);

            lastSubCell.mountedSlotIndex = targetSlot;
            mounted[mountedIndex] = lastSubCell;

            targetSubCell.isMounted = false;
            targetSubCell.mountedSlotIndex = -1;

            allocation.instanceCount = Math.max(0, currentActive - targetCount);
            this.uploadRangeToGPU(targetSlot, lastCount);
        }
    }

    #mountAllSubCells(megaBuffer: FoliageScatterMegaBuffer, allocation: any, subCellSize: number): void {
        if (this.#mountedSubCells.length === this.#subCells.size) return;
        this.#subCells.forEach(subCell => {
            if (!subCell.isMounted) {
                this.#mountSubCell(subCell, megaBuffer, allocation, subCellSize);
            }
        });
    }

    #partitionTileSync(comp: any, landscape: any, subCellSize: number): void {
        const compCountX = landscape?.componentCount?.[0] ?? 8;
        const tileSizeMeters = comp.componentSizeQuads || ((landscape && landscape.worldSize) ? landscape.worldSize[0] / compCountX : 1000);
        const halfTile = tileSizeMeters * 0.5;

        const tileMinX = comp.worldX - halfTile;
        const tileMaxX = comp.worldX + halfTile;
        const tileMinZ = comp.worldZ - halfTile;
        const tileMaxZ = comp.worldZ + halfTile;

        const worldSizeX = landscape?.worldSize?.[0] ?? 16000.0;
        const worldSizeZ = landscape?.worldSize?.[1] ?? 16000.0;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

        const invSubCell = 1.0 / subCellSize;
        const startScX = Math.floor((tileMinX + halfWorldX) * invSubCell);
        const endScX = Math.floor((tileMaxX + halfWorldX - 0.001) * invSubCell);
        const startScZ = Math.floor((tileMinZ + halfWorldZ) * invSubCell);
        const endScZ = Math.floor((tileMaxZ + halfWorldZ - 0.001) * invSubCell);

        for (let scZ = startScZ; scZ <= endScZ; scZ++) {
            for (let scX = startScX; scX <= endScX; scX++) {
                const key = packSubCellKey(scX, scZ);
                if (!this.#subCells.has(key)) {
                    const subCell = this.#populateSingleSubCell(scX, scZ, subCellSize);
                    this.#subCells.set(key, subCell);
                }
            }
        }
    }

    #populateSingleSubCell(scX: number, scZ: number, subCellSize: number): FoliageSubCell {
        const key = packSubCellKey(scX, scZ);
        const landscape = this.#landscape;
        const worldSizeX = landscape?.worldSize?.[0] ?? 16000.0;
        const worldSizeZ = landscape?.worldSize?.[1] ?? 16000.0;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

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

        const densityPerHectare = this.densityPerHectare;
        const densityMultiplier = this.densityMultiplier ?? 1.0;
        const targetCountPerHectare = Math.max(0, Math.round(densityPerHectare * densityMultiplier));
        if (targetCountPerHectare <= 0) return cell;

        const targetLayer = this.targetLayer;
        const hasTargetLayer = targetLayer !== undefined && targetLayer !== '';
        let targetLayerObj: any = null;
        if (hasTargetLayer && landscape?.layers) {
            if (typeof targetLayer === 'string') {
                targetLayerObj = landscape.layers.find((l: any) => l.name === targetLayer);
            } else if (typeof targetLayer === 'number') {
                targetLayerObj = landscape.layers[targetLayer];
            }
        }
        if (hasTargetLayer && !targetLayerObj) {
            return cell;
        }

        const densityScaleByWeight = this.densityScaleByWeight !== false;
        const hasGetHeight = typeof landscape?.getHeightAt === 'function';
        const minSlope = this.minSlope ?? 0.0;
        const maxSlope = this.maxSlope ?? 45.0;
        const hasSlopeFilter = hasGetHeight && (minSlope > 0.0 || maxSlope < 90.0);

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
                        const u = (posX + halfWorldX) / worldSizeX;
                        const v = (posZ + halfWorldZ) / worldSizeZ;
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

    #populateSubCellInstances(
        f32: Float32Array,
        u32: Uint32Array,
        baseFloat: number,
        subCell: FoliageSubCell,
        subCellSize: number
    ): void {
        const strideFloats = this.#megaBuffer?.strideFloats || 8;
        const landscape = this.#landscape;

        const densityPerHectare = this.densityPerHectare;
        const densityMultiplier = this.densityMultiplier ?? 1.0;
        const targetCountPerHectare = Math.max(0, Math.round(densityPerHectare * densityMultiplier));
        if (targetCountPerHectare <= 0 || subCell.instanceCount <= 0) return;

        const worldSizeX = landscape?.worldSize?.[0] ?? 16000.0;
        const worldSizeZ = landscape?.worldSize?.[1] ?? 16000.0;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

        const subMinX = subCell.subCellX * subCellSize - halfWorldX;
        const subMaxX = subMinX + subCellSize;
        const subMinZ = subCell.subCellZ * subCellSize - halfWorldZ;
        const subMaxZ = subMinZ + subCellSize;

        const startGx = Math.floor((subMinX + halfWorldX) / FIXED_SCATTER_GRID_SIZE);
        const endGx = Math.floor((subMaxX + halfWorldX - 0.001) / FIXED_SCATTER_GRID_SIZE);
        const startGz = Math.floor((subMinZ + halfWorldZ) / FIXED_SCATTER_GRID_SIZE);
        const endGz = Math.floor((subMaxZ + halfWorldZ - 0.001) / FIXED_SCATTER_GRID_SIZE);

        const optMinScale = this.minScale;
        const optMaxScale = this.maxScale;
        const randomRotationY = this.randomRotationY;
        const scaleDiffX = optMaxScale[0] - optMinScale[0];
        const scaleDiffY = optMaxScale[1] - optMinScale[1];
        const scaleDiffZ = optMaxScale[2] - optMinScale[2];
        const isUniformXZ = (scaleDiffX === scaleDiffZ && optMinScale[0] === optMinScale[2]);

        const targetLayer = this.targetLayer;
        const hasTargetLayer = targetLayer !== undefined && targetLayer !== '';
        let targetLayerObj: any = null;
        if (hasTargetLayer && landscape?.layers) {
            if (typeof targetLayer === 'string') {
                targetLayerObj = landscape.layers.find((l: any) => l.name === targetLayer);
            } else if (typeof targetLayer === 'number') {
                targetLayerObj = landscape.layers[targetLayer];
            }
        }

        const densityScaleByWeight = this.densityScaleByWeight !== false;
        const hasGetHeight = typeof landscape?.getHeightAt === 'function';
        const minSlope = this.minSlope ?? 0.0;
        const maxSlope = this.maxSlope ?? 45.0;
        const hasSlopeFilter = hasGetHeight && (minSlope > 0.0 || maxSlope < 90.0);

        const alignToNormal = this.#alignToNormal;
        const alignFactor = this.#alignFactor;
        const needNormalAlign = hasGetHeight && alignToNormal && alignFactor > 0.001;

        const bottomOffset = this.bottomOffset ?? 0.0;
        const typeId = this.allocation?.typeId ?? 0;
        const packedTypeAndDefaultGround = (((typeId & 0xFF) << 24) | 0x00333333) >>> 0;
        let written = 0;

        for (let gz = startGz; gz <= endGz && written < subCell.instanceCount; gz++) {
            const gridMinZ = gz * FIXED_SCATTER_GRID_SIZE - halfWorldZ;
            for (let gx = startGx; gx <= endGx && written < subCell.instanceCount; gx++) {
                const gridMinX = gx * FIXED_SCATTER_GRID_SIZE - halfWorldX;
                let seed = computeScatterGridSeed(gx, gz, this.#nameHash);

                const maxAttempts = densityScaleByWeight
                    ? targetCountPerHectare
                    : ((targetLayerObj || hasSlopeFilter) ? targetCountPerHectare * 2 : targetCountPerHectare);
                let generatedInGrid = 0;

                for (let i = 0; i < maxAttempts && generatedInGrid < targetCountPerHectare && written < subCell.instanceCount; i++) {
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
                        const u = (posX + halfWorldX) / worldSizeX;
                        const v = (posZ + halfWorldZ) / worldSizeZ;
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

                    let normalX = 0.0;
                    let normalY = 1.0;
                    let normalZ = 0.0;

                    if (hasSlopeFilter || needNormalAlign) {
                        const step = 1.0;
                        const hL = landscape.getHeightAt(posX - step, posZ);
                        const hR = landscape.getHeightAt(posX + step, posZ);
                        const hD = landscape.getHeightAt(posX, posZ - step);
                        const hU = landscape.getHeightAt(posX, posZ + step);
                        const nx = (hL - hR) / (2 * step);
                        const nz = (hD - hU) / (2 * step);
                        const invLen = 1.0 / Math.sqrt(nx * nx + 1.0 + nz * nz);

                        if (hasSlopeFilter) {
                            const slopeDeg = Math.acos(Math.min(1.0, invLen)) * 57.29577951308232;
                            if (slopeDeg < minSlope || slopeDeg > maxSlope) continue;
                        }

                        if (needNormalAlign) {
                            normalX = nx * invLen;
                            normalY = invLen;
                            normalZ = nz * invLen;
                        }
                    }

                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rScale = (seed >>> 0) / 4294967296.0;

                    const scaleX = optMinScale[0] + rScale * scaleDiffX;
                    const scaleY = optMinScale[1] + rScale * scaleDiffY;
                    const scaleZ = isUniformXZ ? scaleX : (optMinScale[2] + rScale * scaleDiffZ);

                    let posY = 0.0;
                    if (hasGetHeight) {
                        posY = landscape.getHeightAt(posX, posZ) + bottomOffset * scaleY;
                    }

                    let rotX = 0.0;
                    let rotY = 0.0;
                    let rotZ = 0.0;
                    let rotW = 1.0;

                    if (randomRotationY) {
                        seed ^= seed << 13;
                        seed ^= seed >>> 17;
                        seed ^= seed << 5;
                        const rAngle = (seed >>> 0) / 4294967296.0;
                        const angle = rAngle * (Math.PI * 2);
                        const halfAngle = angle * 0.5;
                        rotY = Math.sin(halfAngle);
                        rotW = Math.cos(halfAngle);
                    }

                    if (needNormalAlign) {
                        const vx = normalZ;
                        const vz = -normalX;
                        const vw = 1.0 + normalY;
                        const tiltLen = Math.sqrt(vx * vx + vz * vz + vw * vw);
                        if (tiltLen > 0.0001) {
                            const invTilt = 1.0 / tiltLen;
                            const tx = (vx * invTilt) * alignFactor;
                            const tz = (vz * invTilt) * alignFactor;
                            const tw = (1.0 - alignFactor) + (vw * invTilt) * alignFactor;
                            const alignLen = Math.sqrt(tx * tx + tz * tz + tw * tw);
                            const invAlign = 1.0 / (alignLen > 0.0001 ? alignLen : 1.0);
                            const ax = tx * invAlign;
                            const az = tz * invAlign;
                            const aw = tw * invAlign;

                            const fx = ax * rotW - az * rotY;
                            const fy = aw * rotY;
                            const fz = az * rotW + ax * rotY;
                            const fw = aw * rotW;

                            rotX = fx;
                            rotY = fy;
                            rotZ = fz;
                            rotW = fw;
                        }
                    }

                    generatedInGrid++;

                    if (posX >= subMinX && posX < subMaxX && posZ >= subMinZ && posZ < subMaxZ) {
                        const ix = Math.max(-32768, Math.min(32767, (rotX * 32767) | 0));
                        const iy = Math.max(-32768, Math.min(32767, (rotY * 32767) | 0));
                        const iz = Math.max(-32768, Math.min(32767, (rotZ * 32767) | 0));
                        const iw = Math.max(-32768, Math.min(32767, (rotW * 32767) | 0));

                        const rotPackedY = ((ix & 0xFFFF) | ((iy & 0xFFFF) << 16)) >>> 0;
                        const rotPackedW = ((iz & 0xFFFF) | ((iw & 0xFFFF) << 16)) >>> 0;

                        const scalePacked = isUniformXZ
                            ? fastPackUniformScale(scaleX)
                            : fastPack2x16float(scaleX, scaleZ);

                        const outOffset = baseFloat + written * strideFloats;
                        f32[outOffset + 0] = posX;
                        f32[outOffset + 1] = posY;
                        f32[outOffset + 2] = posZ;
                        f32[outOffset + 3] = scaleY;

                        u32[outOffset + 4] = rotPackedY;
                        u32[outOffset + 5] = rotPackedW;
                        u32[outOffset + 6] = scalePacked;
                        u32[outOffset + 7] = packedTypeAndDefaultGround;

                        written++;
                    }
                }
            }
        }
    }
}

Object.freeze(Foliage);
export default Foliage;
