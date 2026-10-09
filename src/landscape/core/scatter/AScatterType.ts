/**
 * [KO] 모든 스캐터 타입(잔디 Grass, 식생 Foliage 등)의 공통 속성, 서브메시/드로우콜 통계 및 메가버퍼 연동을 담당하는 최상위 추상 기본 클래스입니다.
 * [EN] Top-level abstract base class responsible for common properties, sub-mesh/draw-call statistics, and mega-buffer integration across all scatter types (Grass, Foliage, etc.).
 * @packageDocumentation
 */
import RedGPUObject from "../../../base/RedGPUObject";
import RedGPUContext from "../../../context/RedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import type {ScatterBaseSegmentAllocation} from "./AScatterMegaBuffer";
import type ScatterRenderUnit from "./ScatterRenderUnit";

/**
 * [KO] 모든 스캐터 타입(잔디 Grass, 식생 Foliage 등)의 공통 초기화 옵션 인터페이스입니다.
 * [EN] Common initialization options interface for all scatter types (Grass, Foliage, etc.).
 */
export interface AScatterTypeInitOptions {
    /**
     * [KO] 스캐터 종(Type)의 고유 식별 이름
     * [EN] Unique identification name of the scatter type
     */
    name: string;

    /**
     * [KO] 카메라로부터의 최대 렌더 컬링 거리 (미터)
     * [EN] Maximum render culling distance from camera in meters
     */
    cullingDistance?: number;

    /**
     * [KO] 그림자 캐스팅 최대 거리 (미터)
     * [EN] Maximum shadow casting distance in meters
     */
    shadowCullDistance?: number;

    /**
     * [KO] 밑둥/뿌리 피벗 보정 오프셋 (미터)
     * [EN] Bottom pivot correction offset in meters
     */
    bottomOffset?: number;

    /**
     * [KO] 스캐터 모델의 물리 높이 (미터)
     * [EN] Physical height in meters of the scatter model
     */
    height?: number;

    /**
     * [KO] 그림자 캐스팅 활성화 여부
     * [EN] Whether shadow casting is enabled
     */
    castShadow?: boolean;

    /**
     * [KO] 배치 대상 지형 스플랫 레이어 (레이어 이름 또는 인덱스)
     * [EN] Target terrain splat layer for placement (layer name or index)
     */
    targetLayer?: string | number;

    /**
     * [KO] 배치 허용 최소 경사도 (각도: 0~90)
     * [EN] Minimum slope constraint in degrees (0-90) allowed for placement
     */
    minSlope?: number;

    /**
     * [KO] 배치 허용 최대 경사도 (각도: 0~90)
     * [EN] Maximum slope constraint in degrees (0-90) allowed for placement
     */
    maxSlope?: number;

    /**
     * [KO] 스플랫 레이어 가중치에 비례하여 인스턴스 밀도를 조절할지 여부
     * [EN] Whether instance density scales proportionally to splat layer weight
     */
    densityScaleByWeight?: boolean;

    /**
     * [KO] 헥타르(10,000m²)당 기본 인스턴스 밀도
     * [EN] Base instance density per hectare (10,000m²)
     */
    densityPerHectare?: number;

    /**
     * [KO] 전체 밀도 배수
     * [EN] Global density multiplier
     */
    densityMultiplier?: number;

    /**
     * [KO] 밑둥 지면 색상 블렌딩 강도 (0.0~1.0)
     * [EN] Bottom ground color blending strength (0.0-1.0)
     */
    groundBlendStrength?: number;

    /**
     * [KO] 카메라 중심 서브셀 스트리밍 활성 반경 (미터 단위)
     * [EN] Active sub-cell streaming radius around camera in meters
     */
    streamingRadius?: number;
}

/**
 * [KO] 모든 스캐터 타입(잔디 Grass, 식생 Foliage 등)의 최상위 추상 기본 클래스입니다.
 * [EN] Top-level abstract base class for all scatter types (Grass, Foliage, etc.).
 *
 * **[KO] 아키텍처 및 역할:**
 * - **식별 및 수명주기 통일**: 모든 스캐터 종의 이름(`name`), 고유 ID(`typeId`)를 캡슐화합니다.
 * - **VRAM 세그먼트 메타데이터 바인딩**: 메가버퍼에서 배정된 세그먼트 할당 메타데이터(`allocation`)를 제네릭 타입으로 보관합니다.
 * - **렌더 유닛 다형성 및 단일 진실 공급원**: 각 스캐터 종의 렌더 유닛 컬렉션(`renderUnits`)을 추상 게터로 강제하며, 렌더 유닛 개수(`renderUnitCount`)는 항상 `renderUnits.length`와 일치하도록 보장합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Unified Identification & Lifecycle**: Encapsulates name (`name`) and unique ID (`typeId`) across all scatter species.
 * - **VRAM Segment Metadata Binding**: Retains segment allocation metadata (`allocation`) assigned by mega-buffers as a generic type.
 * - **Render Unit Polymorphism & Single Source of Truth**: Mandates render unit collection (`renderUnits`) via an abstract getter, guaranteeing `renderUnitCount` always equals `renderUnits.length`.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스화할 수 없습니다. 서브클래스(Grass, Foliage)를 통해 사용하십시오.
 * [EN] This class is abstract and cannot be directly instantiated. Use via subclasses (Grass, Foliage).
 * :::
 */
export abstract class AScatterType<
    TAllocation extends ScatterBaseSegmentAllocation = ScatterBaseSegmentAllocation
> extends RedGPUObject {
    #name: string;
    #typeId: number;
    #allocation: TAllocation | null = null;

    // --- 12종 공통 스캐터 파라미터 (Foliage & Grass 공통) + 물리 높이 ---
    #height: number = 1.0;
    #cullingDistance: number = 200.0;
    #fadeStartDistance: number = 150.0;
    #shadowCullDistance: number = 50.0;
    #bottomOffset: number = 0.0;
    #targetLayer: string | number | undefined = '';
    #minSlope: number = 0.0;
    #maxSlope: number = 45.0;
    #densityScaleByWeight: boolean = true;
    #densityPerHectare: number = 1000.0;
    #densityMultiplier: number = 1.0;
    #castShadow: boolean = true;
    #groundBlendStrength: number = 1.0;
    #streamingRadius: number = 200.0;

    /**
     * [KO] AScatterType 인스턴스를 생성합니다.
     * [EN] Creates an AScatterType instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param name -
     * [KO] 스캐터 타입 고유 이름
     * [EN] Unique scatter type name
     * @param typeId -
     * [KO] 스캐터 타입 고유 ID (기본값: 0)
     * [EN] Unique scatter type ID (default: 0)
     */
    constructor(redGPUContext: RedGPUContext, name: string, typeId: number = 0) {
        super(redGPUContext);

        if (!name || typeof name !== 'string' || name.trim() === '') {
            consoleAndThrowError(`[${new.target.name}] name is required and must be a non-empty string!`);
        }

        const trimmedName = name.trim();
        super.name = trimmedName;
        this.#name = trimmedName;
        this.#typeId = typeId;
    }

    /**
     * [KO] 스캐터 인스턴스의 고유 식별자 이름을 반환합니다. (불변)
     * [EN] Returns the unique identifier name of the scatter instance. (immutable)
     */
    override get name(): string {
        return this.#name;
    }

    override set name(_value: string) {
        consoleAndThrowError(`[${this.constructor.name}] name property is readonly and cannot be changed.`);
    }

    /**
     * [KO] 스캐터 매니저 내부에서 배정하는 고유 타입 식별자 정수 (Type ID)를 반환합니다. (단일 진실 공급원)
     * [EN] Returns the unique type identifier integer (Type ID) assigned internally by scatter managers. (Single source of truth)
     */
    get typeId(): number {
        return this.#allocation ? this.#allocation.typeId : this.#typeId;
    }

    /**
     * [KO] 스캐터 타입 식별자 정수를 설정합니다.
     * [EN] Sets the unique type identifier integer.
     */
    set typeId(value: number) {
        this.#typeId = value;
        if (this.#allocation) {
            this.#allocation.typeId = value;
        }
    }

    /**
     * [KO] 해당 스캐터 모델을 구성하는 공통 렌더 단위(Render Unit) 컬렉션을 반환하는 추상 게터입니다.
     * [EN] Abstract getter returning the collection of common render units composing this scatter model.
     */
    abstract get renderUnits(): readonly ScatterRenderUnit[];

    /**
     * [KO] 해당 스캐터 모델을 구성하는 렌더 단위 총 개수를 반환합니다. (단일 진실 공급원)
     * [EN] Returns the total number of render units composing this scatter model. (Single source of truth)
     */
    get renderUnitCount(): number {
        return this.renderUnits.length;
    }

    /**
     * [KO] 해당 스캐터 타입이 렌더 패스에서 발행하는 간접 드로우콜 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by this scatter type in render passes.
     */
    abstract get drawCallCount(): number;

    /**
     * [KO] 메가버퍼 내 기본 세그먼트 할당 메타데이터를 반환합니다. (미할당 시 null)
     * [EN] Returns the base segment allocation metadata within the mega-buffer. (null if not allocated)
     */
    get allocation(): TAllocation | null {
        return this.#allocation;
    }

    /**
     * [KO] 메가버퍼에서 배정된 세그먼트 메타데이터를 바인딩하고 Type ID를 동기화합니다.
     * [EN] Binds the segment allocation metadata assigned by the mega-buffer and synchronizes Type ID.
     *
     * @param allocation -
     * [KO] 할당 메타데이터 객체
     * [EN] Allocation metadata object
     */
    bindAllocation(allocation: TAllocation | null): void {
        this.#allocation = allocation;
        if (allocation) {
            this.#typeId = allocation.typeId;
        }
    }

    /**
     * [KO] 스캐터 모델의 세로 물리 높이(미터)를 반환합니다.
     * [EN] Returns the vertical physical height in meters of the scatter model.
     */
    get height(): number {
        return this.#height;
    }

    /**
     * [KO] 지형 표면 대비 밑둥/뿌리 피벗 추가 Y 보정 오프셋(미터)을 반환합니다.
     * [EN] Returns additional bottom pivot correction offset in meters relative to terrain surface.
     */
    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    set bottomOffset(val: number) {
        const numVal = Number(val) || 0;
        if (this.#bottomOffset !== numVal) {
            this.#bottomOffset = numVal;
            this.onParameterChanged('bottomOffset', numVal);
        }
    }

    /**
     * [KO] 카메라로부터의 최대 렌더 컬링 거리(미터)를 반환합니다.
     * [EN] Returns the maximum render culling distance from camera in meters.
     */
    get cullingDistance(): number {
        return this.#cullingDistance;
    }

    set cullingDistance(val: number) {
        const numVal = Math.max(0, Number(val) || 0);
        if (this.#cullingDistance !== numVal) {
            this.#cullingDistance = numVal;
            this.#fadeStartDistance = numVal * 0.75;
            this.onParameterChanged('cullingDistance', numVal);
        }
    }

    /**
     * [KO] 카메라 거리에 따라 인스턴스 페이드(스케일 축소)가 시작되는 거리 (미터 단위, cullingDistance * 0.75로 자동 계산)
     * [EN] Distance in meters where instance fade begins (automatically calculated as cullingDistance * 0.75)
     */
    get fadeStartDistance(): number {
        return this.#fadeStartDistance;
    }

    /**
     * [KO] 그림자 캐스팅이 적용되는 최대 거리(미터)를 반환합니다.
     * [EN] Returns the maximum shadow casting distance in meters.
     */
    get shadowCullDistance(): number {
        return this.#shadowCullDistance;
    }

    set shadowCullDistance(val: number) {
        const numVal = Math.max(0, Number(val) || 0);
        if (this.#shadowCullDistance !== numVal) {
            this.#shadowCullDistance = numVal;
            this.onParameterChanged('shadowCullDistance', numVal);
        }
    }

    /**
     * [KO] 스캐터 인스턴스가 배치될 대상 지형 스플랫 레이어 식별자(이름 또는 인덱스)를 반환합니다.
     * [EN] Returns target terrain splat layer identifier (name or index) for placement.
     */
    get targetLayer(): string | number | undefined {
        return this.#targetLayer;
    }

    set targetLayer(val: string | number | undefined) {
        if (this.#targetLayer !== val) {
            this.#targetLayer = val;
            this.onParameterChanged('targetLayer', val);
        }
    }

    /**
     * [KO] 배치가 허용되는 최소 경사도(각도: 0~90)를 반환합니다.
     * [EN] Returns minimum slope constraint in degrees (0-90) allowed for placement.
     */
    get minSlope(): number {
        return this.#minSlope;
    }

    set minSlope(val: number) {
        const numVal = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
        if (this.#minSlope !== numVal) {
            this.#minSlope = numVal;
            this.onParameterChanged('minSlope', numVal);
        }
    }

    /**
     * [KO] 배치가 허용되는 최대 경사도(각도: 0~90)를 반환합니다.
     * [EN] Returns maximum slope constraint in degrees (0-90) allowed for placement.
     */
    get maxSlope(): number {
        return this.#maxSlope;
    }

    set maxSlope(val: number) {
        const numVal = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
        if (this.#maxSlope !== numVal) {
            this.#maxSlope = numVal;
            this.onParameterChanged('maxSlope', numVal);
        }
    }

    /**
     * [KO] 스플랫 레이어 가중치에 비례하여 인스턴스 밀도를 조절할지 여부를 반환합니다.
     * [EN] Returns whether instance density scales proportionally to splat layer weight.
     */
    get densityScaleByWeight(): boolean {
        return this.#densityScaleByWeight;
    }

    set densityScaleByWeight(val: boolean) {
        const boolVal = !!val;
        if (this.#densityScaleByWeight !== boolVal) {
            this.#densityScaleByWeight = boolVal;
            this.onParameterChanged('densityScaleByWeight', boolVal);
        }
    }

    /**
     * [KO] 헥타르(10,000m²)당 인스턴스 기본 밀도를 반환합니다.
     * [EN] Returns base instance density per hectare (10,000m²).
     */
    get densityPerHectare(): number {
        return this.#densityPerHectare;
    }

    set densityPerHectare(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#densityPerHectare !== numVal) {
            this.#densityPerHectare = numVal;
            this.onParameterChanged('densityPerHectare', numVal);
        }
    }

    /**
     * [KO] 인스턴스 전체 밀도 배수를 반환합니다.
     * [EN] Returns global instance density multiplier.
     */
    get densityMultiplier(): number {
        return this.#densityMultiplier;
    }

    set densityMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#densityMultiplier !== numVal) {
            this.#densityMultiplier = numVal;
            this.onParameterChanged('densityMultiplier', numVal);
        }
    }

    /**
     * [KO] 인스턴스가 그림자를 투영(캐스팅)할지 여부를 반환합니다.
     * [EN] Returns whether instances cast shadows.
     */
    get castShadow(): boolean {
        return this.#castShadow;
    }

    set castShadow(val: boolean) {
        const boolVal = !!val;
        if (this.#castShadow !== boolVal) {
            this.#castShadow = boolVal;
            this.onParameterChanged('castShadow', boolVal);
        }
    }

    /**
     * [KO] 지형 밑둥/뿌리 표면 색상 블렌딩 강도(0.0~1.0)를 반환합니다.
     * [EN] Returns bottom surface ground color blending strength (0.0-1.0).
     */
    get groundBlendStrength(): number {
        return this.#groundBlendStrength;
    }

    set groundBlendStrength(val: number) {
        const numVal = Math.max(0.0, Math.min(1.0, Number(val) || 0.0));
        if (this.#groundBlendStrength !== numVal) {
            this.#groundBlendStrength = numVal;
            this.onParameterChanged('groundBlendStrength', numVal);
        }
    }

    /**
     * [KO] 카메라 중심 서브셀 스트리밍 활성 반경(미터 단위)을 반환합니다.
     * [EN] Returns active sub-cell streaming radius around camera in meters.
     */
    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    set streamingRadius(val: number) {
        const numVal = Math.max(10.0, Number(val) || 10.0);
        if (this.#streamingRadius !== numVal) {
            const oldRadius = this.#streamingRadius;
            this.#streamingRadius = numVal;
            this.onParameterChanged('streamingRadius', numVal, oldRadius);
        }
    }

    /**
     * [KO] 서브클래스 생성자 초기화 시 후속 훅 트리거 없이 고유 기본값을 안전하게 주입합니다.
     * [EN] Safely injects initial unique default values during subclass construction without triggering hooks.
     */
    setRawScatterProperties(values: {
        height?: number;
        cullingDistance?: number;
        shadowCullDistance?: number;
        bottomOffset?: number;
        targetLayer?: string | number | undefined;
        minSlope?: number;
        maxSlope?: number;
        densityScaleByWeight?: boolean;
        densityPerHectare?: number;
        densityMultiplier?: number;
        castShadow?: boolean;
        groundBlendStrength?: number;
        streamingRadius?: number;
    }): void {
        const {
            height,
            cullingDistance,
            shadowCullDistance,
            bottomOffset,
            targetLayer,
            minSlope,
            maxSlope,
            densityScaleByWeight,
            densityPerHectare,
            densityMultiplier,
            castShadow,
            groundBlendStrength,
            streamingRadius
        } = values;
        if (height !== undefined) this.#height = height;
        if (cullingDistance !== undefined) {
            this.#cullingDistance = cullingDistance;
            this.#fadeStartDistance = cullingDistance * 0.75;
        }
        if (shadowCullDistance !== undefined) this.#shadowCullDistance = shadowCullDistance;
        if (bottomOffset !== undefined) this.#bottomOffset = bottomOffset;
        if (targetLayer !== undefined) this.#targetLayer = targetLayer;
        if (minSlope !== undefined) this.#minSlope = minSlope;
        if (maxSlope !== undefined) this.#maxSlope = maxSlope;
        if (densityScaleByWeight !== undefined) this.#densityScaleByWeight = densityScaleByWeight;
        if (densityPerHectare !== undefined) this.#densityPerHectare = densityPerHectare;
        if (densityMultiplier !== undefined) this.#densityMultiplier = densityMultiplier;
        if (castShadow !== undefined) this.#castShadow = castShadow;
        if (groundBlendStrength !== undefined) this.#groundBlendStrength = groundBlendStrength;
        if (streamingRadius !== undefined) this.#streamingRadius = Math.max(10.0, Number(streamingRadius) || 10.0);
    }

    /**
     * [KO] 파라미터 변경 시 서브클래스별 고유 후속 반응(유니폼 동기화, 더티 플래그 등)을 처리하는 추상 훅 메서드입니다.
     * [EN] Abstract hook method to handle subclass-specific side effects upon parameter change.
     *
     * @param prop - [KO] 변경된 속성 식별자 / [EN] Changed property identifier
     * @param value - [KO] 새로 설정된 유효값 / [EN] Newly set validated value
     * @param prevValue - [KO] 변경 전 이전 값 (선택사항) / [EN] Previous value before change (optional)
     */
    abstract onParameterChanged(prop: string, value: any, prevValue?: any): void;

    /**
     * [KO] 스캐터 타입 리소스를 해제합니다.
     * [EN] Destroys scatter type resources.
     */
    destroy(): void {
        this.#allocation = null;
    }
}

Object.freeze(AScatterType);
export default AScatterType;
