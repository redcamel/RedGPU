/**
 * [KO] 단일 식생(Foliage) 종(Type)의 LOD 메쉬, 인스턴스 스트리밍, 렌더링 파라미터를 정의하고 관리하는 핵심 엔티티 모듈입니다.
 * [EN] Core entity module defining and managing LOD meshes, instance streaming, and rendering parameters for a single foliage type.
 * @packageDocumentation
 */
import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import Mesh from "../../../display/mesh/Mesh";
import type Landscape from "../../Landscape";
import LandscapeComponent from "../../core/spatial/LandscapeComponent";
import assembleFoliageSubMeshes from "./assembler/assembleFoliageSubMeshes";
import FoliageSubCellPartitioner from "./subcell/FoliageSubCellPartitioner";
import FoliageSubCellStreamer from "./subcell/FoliageSubCellStreamer";

import FoliageSubMesh from "./submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "./submesh/FoliageShadowMergedSubMesh";
import FoliageMegaBuffer, {FoliageTypeAllocation} from "./buffer/FoliageMegaBuffer";
import type {FoliageInstanceBaker} from "./baking/FoliageInstanceBaker";

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
     * [KO] 밀도 축약 옵션 (`densityPerHectare`와 동일)
     * [EN] Alias for `densityPerHectare`
     */
    density?: number;

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
    maxShadowDistance?: number;

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
     * [KO] 서브셀 공간 분할 그리드 크기 (미터, 기본값: 100.0)
     * [EN] Sub-cell spatial grid division size in meters (default: 100.0)
     */
    subCellSize?: number;

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
export class Foliage extends RedGPUObject {
    #options: FoliageOptions;

    #subMeshes: FoliageSubMesh[] = [];
    #lod0SubMeshes: FoliageSubMesh[] = [];
    #depthPrepassSubMeshes: FoliageSubMesh[] = [];
    #mainSubMeshes: FoliageSubMesh[] = [];
    #shadowMergedSubMeshes: FoliageShadowMergedSubMesh[] = [];
    #lodInfoList: FoliageLODInfo[] = [];

    #megaBuffer: FoliageMegaBuffer | null = null;
    #allocation: FoliageTypeAllocation | null = null;

    #cullingDistance: number = 2000.0;
    #fadeStartDistance: number = 1500.0;
    #bottomOffset: number = 0;
    #boundingRadius: number = 10.0;
    #boundingHeight: number = 2.0;
    #nameHash: number = 0;
    #castShadow: boolean = true;
    #maxShadowDistance: number = 300.0;
    #useImpostor: boolean = true;
    #useDepthPrepass: boolean = true;
    #hasMaskedLOD0: boolean = false;
    #enableStreaming: boolean = true;
    #streamingRadius: number = 600.0;
    #subCellSize: number = 100.0;
    #targetLayer?: string | number;
    #minSlope: number = 0.0;
    #maxSlope: number = 45.0;
    #densityScaleByWeight: boolean = true;
    #densityPerHectare: number = 20.0;
    #densityMultiplier: number = 1.0;
    #windMultiplier: number = 1.0;
    #windFlutterMultiplier: number = 1.0;
    #alignToNormal: boolean = false;
    #alignFactor: number = 1.0;
    #groundBlendStrength: number = 0.8;
    #groundBlendRange: number = 1.5;
    #lastWindParams: {
        windDirX: number;
        windDirY: number;
        windSpeed: number;
        windStrength: number;
        windFreq: number;
        windFlutterStrength: number;
        windEnabled: boolean;
    } | null = null;
    #impostorSubMesh: FoliageSubMesh | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #loadedTileKeys: Set<number> = new Set();
    #streamer: FoliageSubCellStreamer;
    #baker: FoliageInstanceBaker | null = null;
    #onDirty?: () => void;
    #onRepopulateRequired?: (type: Foliage) => void;

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
     */
    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageOptions,
        sharedSubMeshBindGroupLayout?: GPUBindGroupLayout | null,
        megaBuffer?: FoliageMegaBuffer | null,
        onDirty?: () => void,
        onRepopulateRequired?: (type: Foliage) => void,
        baker?: FoliageInstanceBaker | null
    ) {
        super(redGPUContext);
        if (!options?.name || typeof options.name !== 'string' || options.name.trim() === '') {
            consoleAndThrowError('[Foliage] options.name is required and must be a non-empty string!');
        }

        const {
            name,
            castShadow = true,
            useImpostor = true,
            cullingDistance = 2000.0,
            minScale: optMinScale,
            maxScale: optMaxScale,
            densityPerHectare,
            density,
            densityMultiplier: optDensityMultiplier,
            streamingRadius = 600.0,
            subCellSize = 100.0,
            maxInstances,
            windMultiplier,
            windFlutterMultiplier,
            alignToNormal = false,
            alignFactor,
            groundBlendStrength,
            groundBlendRange
        } = options;

        super.name = name.trim();
        this.#streamer = new FoliageSubCellStreamer(this);
        this.#options = options;
        this.#onDirty = onDirty;
        this.#onRepopulateRequired = onRepopulateRequired;
        this.#baker = baker || null;
        this.#castShadow = castShadow !== false;

        this.#useImpostor = useImpostor;
        this.#useDepthPrepass = true;

        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;
        this.#megaBuffer = megaBuffer || null;

        this.#cullingDistance = cullingDistance;
        this.#fadeStartDistance = this.#cullingDistance * 0.75;

        const minScale: [number, number, number] = optMinScale ? [...optMinScale] : [1.0, 1.0, 1.0];
        const maxScale: [number, number, number] = optMaxScale ? [...optMaxScale] : [1.0, 1.0, 1.0];

        let resolvedDensityPerHectare = 20.0;
        if (densityPerHectare !== undefined) {
            resolvedDensityPerHectare = Math.max(0, Number(densityPerHectare) || 0);
        } else if (density !== undefined) {
            resolvedDensityPerHectare = Math.max(0, Number(density) || 0);
        }
        this.#densityPerHectare = resolvedDensityPerHectare;

        const densityMultiplier = optDensityMultiplier !== undefined
            ? Math.max(0.0, Number(optDensityMultiplier) || 0.0)
            : 1.0;
        this.#densityMultiplier = densityMultiplier;

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

        this.#groundBlendStrength = groundBlendStrength !== undefined
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
            this.#subMeshVertexBindGroupLayout!
        );
        this.#subMeshes = assembleResult.subMeshes;
        this.#lod0SubMeshes = this.#subMeshes.filter(sub => sub.lodIndex === 0);
        let hasMaskedLOD0 = false;
        for (let i = 0; i < this.#lod0SubMeshes.length; i++) {
            if (this.#lod0SubMeshes[i].isMasked) {
                hasMaskedLOD0 = true;
                break;
            }
        }
        this.#hasMaskedLOD0 = hasMaskedLOD0;
        this.#shadowMergedSubMeshes = assembleResult.shadowMergedSubMeshes || [];
        this.#lodInfoList = assembleResult.lodInfoList || [];
        this.#bottomOffset = options.bottomOffset ?? 0;
        this.#boundingRadius = assembleResult.boundingRadius || 10.0;
        this.#boundingHeight = assembleResult.boundingHeight || 2.0;

        let defaultShadowDist = 300.0;
        const effectiveHeight = this.#boundingHeight * maxScale[1];
        if (effectiveHeight < 0.6) {
            defaultShadowDist = 35.0;
        } else if (effectiveHeight < 1.5) {
            defaultShadowDist = 75.0;
        } else if (effectiveHeight < 3.5) {
            defaultShadowDist = 160.0;
        } else {
            defaultShadowDist = 350.0;
        }

        this.#maxShadowDistance = options.maxShadowDistance !== undefined
            ? Math.max(0, Number(options.maxShadowDistance) || 0)
            : defaultShadowDist;

        this.#options = Object.freeze({
            name: options.name,
            lods: options.lods,
            maxInstances: resolvedMaxInstances,
            cullingDistance: this.#cullingDistance,
            minScale,
            maxScale,
            randomRotationY: options.randomRotationY ?? true,
            useImpostor: this.#useImpostor,
            bottomOffset: this.#bottomOffset,
            castShadow: this.#castShadow,
            maxShadowDistance: this.#maxShadowDistance,
            enableStreaming: options.enableStreaming !== false,
            streamingRadius,
            subCellSize,
            targetLayer: options.targetLayer,
            minSlope: options.minSlope ?? 0.0,
            maxSlope: options.maxSlope ?? 45.0,
            densityScaleByWeight: options.densityScaleByWeight !== false,
            densityPerHectare: resolvedDensityPerHectare,
            densityMultiplier,
            windMultiplier: resolvedWindMultiplier,
            windFlutterMultiplier: resolvedWindFlutterMultiplier,
            alignToNormal: resolvedAlignToNormal,
            alignFactor: resolvedAlignFactor,
            groundBlendStrength: this.#groundBlendStrength,
            groundBlendRange: this.#groundBlendRange
        });

        this.#enableStreaming = this.#options.enableStreaming!;
        this.#streamingRadius = this.#options.streamingRadius!;
        this.#subCellSize = this.#options.subCellSize!;
        this.#targetLayer = this.#options.targetLayer;
        this.#minSlope = this.#options.minSlope!;
        this.#maxSlope = this.#options.maxSlope!;
        this.#densityScaleByWeight = this.#options.densityScaleByWeight!;
        this.#densityPerHectare = resolvedDensityPerHectare;
        this.#densityMultiplier = this.#options.densityMultiplier!;

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
                effectiveShadowDist,
                this.#boundingHeight
            );
        }
    }


    override get name(): string {
        return super.name;
    }

    override set name(value: string) {
        consoleAndThrowError('[Foliage] name property is readonly and cannot be changed.');
    }

    get nameHash(): number {
        return this.#nameHash;
    }

    get maxInstances(): number {
        return this.bufferCapacity;
    }

    get bufferCapacity(): number {
        return this.#allocation ? this.#allocation.maxInstances : (this.#options.maxInstances ?? 0);
    }

    get minScale(): [number, number, number] {
        return this.#options.minScale;
    }

    get maxScale(): [number, number, number] {
        return this.#options.maxScale;
    }

    get randomRotationY(): boolean {
        return this.#options.randomRotationY;
    }

    get options(): FoliageOptions {
        return this.#options;
    }

    get allocation(): FoliageTypeAllocation | null {
        return this.#allocation;
    }

    get megaBuffer(): FoliageMegaBuffer | null {
        return this.#megaBuffer;
    }

    get subMeshes(): FoliageSubMesh[] {
        return this.#subMeshes;
    }

    get depthPrepassSubMeshes(): FoliageSubMesh[] {
        return this.#depthPrepassSubMeshes;
    }

    get mainSubMeshes(): FoliageSubMesh[] {
        return this.#mainSubMeshes;
    }

    get lod0SubMeshes(): FoliageSubMesh[] {
        return this.#lod0SubMeshes;
    }

    get shadowMergedSubMeshes(): FoliageShadowMergedSubMesh[] {
        return this.#shadowMergedSubMeshes;
    }

    get lodInfoList(): FoliageLODInfo[] {
        return this.#lodInfoList;
    }

    get activeInstanceCount(): number {
        return this.#allocation?.activeCount ?? 0;
    }

    get totalInstanceCount(): number {
        return this.#streamer.totalInstanceCount;
    }

    get boundingRadius(): number {
        return this.#boundingRadius;
    }

    get boundingHeight(): number {
        return this.#boundingHeight;
    }

    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    set bottomOffset(val: number) {
        if (this.#bottomOffset !== val) {
            this.#bottomOffset = val;
            this.#syncTypeParams();
            this.rebake();
        }
    }

    get cullingDistance(): number {
        return this.#cullingDistance;
    }

    set cullingDistance(val: number) {
        const numVal = Math.max(0, val);
        if (this.#cullingDistance !== numVal) {
            this.#cullingDistance = numVal;
            this.#fadeStartDistance = numVal * 0.75;
            this.#syncTypeParams();
        }
    }

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
        if (this.#targetLayer !== val) {
            this.#targetLayer = val;
            this.#onRepopulateRequired?.(this);
        }
    }

    get minSlope(): number {
        return this.#minSlope;
    }

    set minSlope(val: number) {
        const numVal = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
        if (this.#minSlope !== numVal) {
            this.#minSlope = numVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get maxSlope(): number {
        return this.#maxSlope;
    }

    set maxSlope(val: number) {
        const numVal = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
        if (this.#maxSlope !== numVal) {
            this.#maxSlope = numVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get densityScaleByWeight(): boolean {
        return this.#densityScaleByWeight;
    }

    set densityScaleByWeight(val: boolean) {
        const boolVal = !!val;
        if (this.#densityScaleByWeight !== boolVal) {
            this.#densityScaleByWeight = boolVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get densityPerHectare(): number {
        return this.#densityPerHectare;
    }

    set densityPerHectare(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#densityPerHectare !== numVal) {
            this.#densityPerHectare = numVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get density(): number {
        return this.#densityPerHectare;
    }

    set density(val: number) {
        this.densityPerHectare = val;
    }

    get densityMultiplier(): number {
        return this.#densityMultiplier;
    }

    set densityMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#densityMultiplier !== numVal) {
            this.#densityMultiplier = numVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get instancesPerCell(): number {
        const cellArea = this.#subCellSize * this.#subCellSize;
        return Math.max(0, Math.round((this.#densityPerHectare * (cellArea / 10000.0)) * this.#densityMultiplier));
    }

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

    syncWindToSubMeshes(
        gpuDevice: GPUDevice,
        windDirX: number,
        windDirY: number,
        windSpeed: number,
        windStrength: number,
        windFreq: number,
        windFlutterStrength: number,
        windEnabled: boolean
    ): void {
        this.#lastWindParams = {
            windDirX,
            windDirY,
            windSpeed,
            windStrength,
            windFreq,
            windFlutterStrength,
            windEnabled,
        };
        const subList = this.#subMeshes;
        const count = subList.length;
        const windMul = this.#windMultiplier;
        const flutterMul = this.#windFlutterMultiplier;
        const treeH = Math.max(5.0, this.#boundingRadius * 1.8);

        for (let i = 0; i < count; i++) {
            const sub = subList[i];

            const effectiveFlutterMul = sub.isMasked ? flutterMul : 0.0;
            sub.updateWindParams(
                gpuDevice,
                windDirX,
                windDirY,
                windSpeed,
                windStrength,
                windFreq,
                windFlutterStrength,
                windEnabled,
                windMul,
                effectiveFlutterMul,
                treeH
            );
        }

        const shadowList = this.#shadowMergedSubMeshes;
        const shadowCount = shadowList.length;
        for (let i = 0; i < shadowCount; i++) {
            shadowList[i].updateWindParams(
                gpuDevice,
                windDirX,
                windDirY,
                windSpeed,
                windStrength,
                windFreq,
                windFlutterStrength,
                windEnabled,
                windMul,
                flutterMul * 0.5,
                treeH
            );
        }
    }

    setLODReceiveShadow(lodIndex: number, value: boolean): void {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return;
        const boolVal = !!value;
        const lodInfo = this.#lodInfoList[lodIndex];
        if (lodInfo.receiveShadow === boolVal) return;

        (lodInfo as any).receiveShadow = boolVal;

        const gpuDevice = this.gpuDevice;
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

    clearTileCache(): void {
        this.#streamer.clear();
        this.#loadedTileKeys.clear();
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

    #syncInternalWind(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#lastWindParams) return;
        this.syncWindToSubMeshes(
            gpuDevice,
            this.#lastWindParams.windDirX,
            this.#lastWindParams.windDirY,
            this.#lastWindParams.windSpeed,
            this.#lastWindParams.windStrength,
            this.#lastWindParams.windFreq,
            this.#lastWindParams.windFlutterStrength,
            this.#lastWindParams.windEnabled
        );
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
    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }
    get hasMaskedLOD0(): boolean {
        return this.#hasMaskedLOD0;
    }

    get groundBlendStrength(): number {
        return this.#groundBlendStrength;
    }

    set groundBlendStrength(v: number) {
        const val = Math.max(0.0, Math.min(1.0, Number(v) || 0.0));
        if (this.#groundBlendStrength !== val) {
            this.#groundBlendStrength = val;
            this.#updateSubMeshGroundBlend();
        }
    }

    get groundBlendRange(): number {
        return this.#groundBlendRange;
    }

    set groundBlendRange(v: number) {
        const val = Math.max(0.1, Number(v) || 0.1);
        if (this.#groundBlendRange !== val) {
            this.#groundBlendRange = val;
            this.#updateSubMeshGroundBlend();
        }
    }

    #updateSubMeshGroundBlend(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;
        const subCount = this.#subMeshes.length;
        for (let s = 0; s < subCount; s++) {
            const sub = this.#subMeshes[s];
            if (!sub.isImpostor) {
                sub.updateGroundBlendParams(gpuDevice, this.#groundBlendStrength, this.#groundBlendRange);
            }
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

    populateTile(tileComponent: LandscapeComponent, landscape?: Landscape): void {
        if (!tileComponent) return;
        const cz = (tileComponent.componentZ ?? 0) & 0xffff;
        const cx = (tileComponent.componentX ?? 0) & 0xffff;
        const key = (cz << 16) | cx;
        if (this.#loadedTileKeys.has(key)) return;

        if (landscape && typeof landscape.isTileLoaded === 'function') {
            if (!landscape.isTileLoaded(cz, cx)) {
                return;
            }
        }

        this.#loadedTileKeys.add(key);

        const chunks = FoliageSubCellPartitioner.partitionTile(
            tileComponent,
            this,
            landscape,
            this.#subCellSize
        );
        this.#streamer.addChunks(chunks);

        if (!this.#enableStreaming) {
            this.#streamer.update(new Int32Array(0), 0, 0, 0, false);
        }
    }

    updateStreaming(
        activeKeyArray: Int32Array,
        activeKeyCount: number,
        camX: number,
        camZ: number
    ): void {
        this.#streamer.update(activeKeyArray, activeKeyCount, camX, camZ, this.#enableStreaming);
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

    uploadRangeToGPU(startIndex: number, count: number): void {
        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.uploadAllocationRangeToGPU(this.#allocation, startIndex, count);
            if (this.#baker && count > 0) {
                const globalIndex = this.#allocation.rawBaseOffset + startIndex;
                this.#baker.addBakeTasks(globalIndex, count, this.#allocation.typeId);
            }
        }
    }

    rebake(): void {
        if (this.#megaBuffer && this.#allocation && this.#baker && this.#allocation.activeCount > 0) {
            this.#baker.addBakeTasks(
                this.#allocation.rawBaseOffset,
                this.#allocation.activeCount,
                this.#allocation.typeId
            );
        }
    }

    destroy(): void {
        this.#streamer.clear();
        for (let i = 0; i < this.#subMeshes.length; i++) {
            const sub = this.#subMeshes[i];
            sub.destroy();
        }
        this.#subMeshes.length = 0;
        this.#lod0SubMeshes.length = 0;
        for (let i = 0; i < this.#shadowMergedSubMeshes.length; i++) {
            const shadowSub = this.#shadowMergedSubMeshes[i];
            shadowSub.destroy();
        }
        this.#shadowMergedSubMeshes.length = 0;
        this.#loadedTileKeys.clear();
    }

    #updatePassBuckets(): void {
        const useImp = this.#useImpostor;
        const useDepthPrepass = this.#useDepthPrepass;
        const subList = this.#subMeshes;
        const count = subList.length;

        const prepassList: FoliageSubMesh[] = [];
        const mainList: FoliageSubMesh[] = [];

        for (let i = 0; i < count; i++) {
            const sub = subList[i];
            if (!useImp && sub.isImpostor) continue;
            if (useDepthPrepass && sub.canRenderInPass('depthPrepass')) {
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
                effectiveShadowDist,
                this.#boundingHeight
            );
        }
    }
}

Object.freeze(Foliage);
export default Foliage;
