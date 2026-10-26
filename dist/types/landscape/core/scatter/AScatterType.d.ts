import RedGPUObject from "../../../base/RedGPUObject";
import RedGPUContext from "../../../context/RedGPUContext";
import type { ScatterBaseSegmentAllocation } from "./AScatterMegaBuffer";
import type ScatterRenderUnit from "./ScatterRenderUnit";
/**
 * [KO] 스캐터 타입 생성 시 공통으로 전달되는 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface commonly passed when creating a scatter type.
 *
 * @category Landscape
 */
export interface AScatterTypeInitOptions {
    /**
     * [KO] 스캐터 타입의 고유 식별 이름
     * [EN] Unique identifier name of the scatter type
     */
    name: string;
    /**
     * [KO] 카메라로부터 인스턴스가 컬링되는 최대 가시 거리 (기본값: `200.0`)
     * [EN] Maximum visibility distance from the camera at which instances are culled (default: `200.0`)
     */
    cullingDistance?: number;
    /**
     * [KO] 그림자 패스에서 인스턴스가 컬링되는 최대 거리 (기본값: `50.0`)
     * [EN] Maximum distance at which instances are culled in the shadow pass (default: `50.0`)
     */
    shadowCullDistance?: number;
    /**
     * [KO] 지형 표면 대비 인스턴스 하단 높이 오프셋 (기본값: `0.0`)
     * [EN] Bottom height offset of the instance relative to the terrain surface (default: `0.0`)
     */
    bottomOffset?: number;
    /**
     * [KO] 인스턴스의 기준 높이 (기본값: `1.0`)
     * [EN] Base height of the instance (default: `1.0`)
     */
    height?: number;
    /**
     * [KO] 디렉셔널 라이트 그림자 투사 활성화 여부 (기본값: `true`)
     * [EN] Whether directional light shadow casting is enabled (default: `true`)
     */
    castShadow?: boolean;
    /**
     * [KO] 배치 밀도를 참조할 대상 지형 레이어의 이름 또는 인덱스
     * [EN] Name or index of the target terrain layer from which to reference placement density
     */
    targetLayer?: string | number;
    /**
     * [KO] 인스턴스가 배치될 수 있는 최소 지형 경사각 (단위: 도, 기본값: `0.0`)
     * [EN] Minimum terrain slope angle at which instances can be placed (in degrees, default: `0.0`)
     */
    minSlope?: number;
    /**
     * [KO] 인스턴스가 배치될 수 있는 최대 지형 경사각 (단위: 도, 기본값: `45.0`)
     * [EN] Maximum terrain slope angle at which instances can be placed (in degrees, default: `45.0`)
     */
    maxSlope?: number;
    /**
     * [KO] 레이어 가중치에 비례하여 인스턴스 스케일을 조절할지 여부 (기본값: `true`)
     * [EN] Whether to scale instance size proportionally to the layer weight (default: `true`)
     */
    densityScaleByWeight?: boolean;
    /**
     * [KO] 헥타르(10,000㎡)당 기준 배치 밀도 (기본값: `1000.0`)
     * [EN] Base placement density per hectare (10,000㎡) (default: `1000.0`)
     */
    densityPerHectare?: number;
    /**
     * [KO] 기준 밀도에 곱해지는 밀도 배율 (기본값: `1.0`)
     * [EN] Density multiplier applied to the base density (default: `1.0`)
     */
    densityMultiplier?: number;
    /**
     * [KO] 지형 표면 색상 및 법선과의 하단 블렌딩 강도 (`0.0`~`1.0`, 기본값: `1.0`)
     * [EN] Ground blending strength with terrain surface color and normal (`0.0`~`1.0`, default: `1.0`)
     */
    groundBlendStrength?: number;
}
/**
 * [KO] 지형 위에 분포되는 개별 스캐터(식생, 잔디 등) 타입의 공통 배치 속성 및 메가 버퍼 세그먼트 바인딩을 정의하는 추상 기반 클래스입니다.
 * [EN] Abstract base class defining common placement properties and mega buffer segment bindings for individual scatter (foliage, grass, etc.) types distributed on the terrain.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @typeParam TAllocation -
 * [KO] 이 스캐터 타입에 바인딩되는 메가 버퍼 세그먼트 할당 정보 타입 (`ScatterBaseSegmentAllocation`의 서브타입)
 * [EN] Mega buffer segment allocation info type bound to this scatter type (subtype of `ScatterBaseSegmentAllocation`)
 *
 * @category Landscape
 */
declare abstract class AScatterType<TAllocation extends ScatterBaseSegmentAllocation = ScatterBaseSegmentAllocation> extends RedGPUObject {
    #private;
    /**
     * [KO] `AScatterType` 인스턴스를 초기화합니다.
     * [EN] Initializes an `AScatterType` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param name -
     * [KO] 스캐터 타입의 고유 이름 (비어 있지 않은 문자열 필수)
     * [EN] Unique name of the scatter type (non-empty string required)
     * @param typeId -
     * [KO] 스캐터 타입의 초기 숫자 ID (기본값: `0`)
     * [EN] Initial numeric ID of the scatter type (default: `0`)
     * @throws
     * [KO] `name`이 비어 있거나 유효한 문자열이 아닌 경우 에러 발생
     * [EN] Throws an error if `name` is empty or not a valid string
     */
    constructor(redGPUContext: RedGPUContext, name: string, typeId?: number);
    /**
     * [KO] 스캐터 타입의 고유 이름을 반환합니다. 생성 이후에는 변경할 수 없습니다.
     * [EN] Returns the unique name of the scatter type. Cannot be changed after creation.
     *
     * @returns
     * [KO] 스캐터 타입의 고유 이름
     * [EN] Unique name of the scatter type
     */
    get name(): string;
    set name(_value: string);
    /**
     * [KO] 스캐터 타입에 할당된 고유 숫자 ID를 반환하거나 설정합니다.
     * [EN] Gets or sets the unique numeric ID assigned to the scatter type.
     *
     * @returns
     * [KO] 스캐터 타입 숫자 ID
     * [EN] Scatter type numeric ID
     */
    get typeId(): number;
    set typeId(value: number);
    /**
     * [KO] 이 스캐터 타입을 구성하는 `ScatterRenderUnit` 배열을 반환합니다.
     * [EN] Returns the array of `ScatterRenderUnit` instances composing this scatter type.
     *
     * @returns
     * [KO] 렌더 유닛 배열 (`ScatterRenderUnit[]`)
     * [EN] Array of render units (`ScatterRenderUnit[]`)
     */
    abstract get renderUnits(): ScatterRenderUnit[];
    /**
     * [KO] 메가 버퍼에서 이 타입에 할당된 세그먼트 정보(`TAllocation | null`)를 반환합니다.
     * [EN] Returns the segment allocation info (`TAllocation | null`) assigned to this type in the mega buffer.
     *
     * @returns
     * [KO] 세그먼트 할당 정보(`TAllocation`) 또는 미할당 시 `null`
     * [EN] Segment allocation info (`TAllocation`), or `null` if unallocated
     */
    get allocation(): TAllocation | null;
    /**
     * [KO] 스캐터 인스턴스의 기준 높이를 반환하거나 설정합니다 (`0.01` 이상).
     * [EN] Gets or sets the base height of scatter instances (`0.01` or greater).
     *
     * @returns
     * [KO] 인스턴스 기준 높이
     * [EN] Instance base height
     */
    get height(): number;
    /**
     * [KO] 지형 표면으로부터의 인스턴스 하단 높이 오프셋을 반환하거나 설정합니다.
     * [EN] Gets or sets the bottom height offset of instances from the terrain surface.
     *
     * @returns
     * [KO] 하단 높이 오프셋
     * [EN] Bottom height offset
     */
    get bottomOffset(): number;
    set height(val: number);
    /**
     * [KO] 메인 패스 인스턴스 가시 컬링 거리를 반환하거나 설정합니다 (`0` 이상).
     * [EN] Gets or sets the main pass instance visibility culling distance (`0` or greater).
     *
     * @returns
     * [KO] 메인 패스 가시 컬링 거리
     * [EN] Main pass visibility culling distance
     */
    get cullingDistance(): number;
    set bottomOffset(val: number);
    /**
     * [KO] 그림자 패스 인스턴스 컬링 거리를 반환하거나 설정합니다 (`0` 이상).
     * [EN] Gets or sets the shadow pass instance culling distance (`0` or greater).
     *
     * @returns
     * [KO] 그림자 패스 컬링 거리
     * [EN] Shadow pass culling distance
     */
    get shadowCullDistance(): number;
    set cullingDistance(val: number);
    /**
     * [KO] 배치 밀도 가중치를 참조할 대상 지형 레이어 이름 또는 인덱스를 반환하거나 설정합니다.
     * [EN] Gets or sets the target terrain layer name or index from which to reference placement density weights.
     *
     * @returns
     * [KO] 대상 레이어 이름(`string`), 인덱스(`number`) 또는 `undefined`
     * [EN] Target layer name (`string`), index (`number`), or `undefined`
     */
    get targetLayer(): string | number | undefined;
    set shadowCullDistance(val: number);
    /**
     * [KO] 인스턴스 배치가 허용되는 최소 지형 경사각(도, `0.0`~`90.0`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the minimum terrain slope angle (degrees, `0.0`~`90.0`) allowed for instance placement.
     *
     * @returns
     * [KO] 최소 지형 경사각 (단위: 도)
     * [EN] Minimum terrain slope angle (in degrees)
     */
    get minSlope(): number;
    set targetLayer(val: string | number | undefined);
    /**
     * [KO] 인스턴스 배치가 허용되는 최대 지형 경사각(도, `0.0`~`90.0`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum terrain slope angle (degrees, `0.0`~`90.0`) allowed for instance placement.
     *
     * @returns
     * [KO] 최대 지형 경사각 (단위: 도)
     * [EN] Maximum terrain slope angle (in degrees)
     */
    get maxSlope(): number;
    set minSlope(val: number);
    /**
     * [KO] 지형 레이어 가중치에 따라 인스턴스 스케일을 조절할지 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether to scale instance size according to the terrain layer weight.
     *
     * @returns
     * [KO] 가중치 기반 스케일 조절 여부
     * [EN] Whether weight-based scaling is enabled
     */
    get densityScaleByWeight(): boolean;
    set maxSlope(val: number);
    /**
     * [KO] 헥타르(10,000㎡)당 기준 인스턴스 밀도를 반환하거나 설정합니다 (`0.0` 이상).
     * [EN] Gets or sets the base instance density per hectare (10,000㎡) (`0.0` or greater).
     *
     * @returns
     * [KO] 헥타르당 기준 배치 밀도
     * [EN] Base placement density per hectare
     */
    get densityPerHectare(): number;
    set densityScaleByWeight(val: boolean);
    /**
     * [KO] 기준 밀도에 곱해지는 밀도 배율을 반환하거나 설정합니다 (`0.0` 이상).
     * [EN] Gets or sets the density multiplier applied to the base density (`0.0` or greater).
     *
     * @returns
     * [KO] 밀도 배율
     * [EN] Density multiplier
     */
    get densityMultiplier(): number;
    set densityPerHectare(val: number);
    /**
     * [KO] 디렉셔널 라이트 그림자 투사 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether directional light shadow casting is enabled.
     *
     * @returns
     * [KO] 그림자 투사 활성화 여부
     * [EN] Whether shadow casting is enabled
     */
    get castShadow(): boolean;
    set densityMultiplier(val: number);
    /**
     * [KO] 지형 표면과의 하단 블렌딩 강도(`0.0`~`1.0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the ground blending strength (`0.0`~`1.0`) with the terrain surface.
     *
     * @returns
     * [KO] 하단 블렌딩 강도 (`0.0`~`1.0`)
     * [EN] Ground blending strength (`0.0`~`1.0`)
     */
    get groundBlendStrength(): number;
    set castShadow(val: boolean);
    /**
     * [KO] 메가 버퍼 세그먼트 할당 정보를 이 스캐터 타입에 바인딩합니다.
     * [EN] Binds mega buffer segment allocation information to this scatter type.
     *
     * @param allocation -
     * [KO] 바인딩할 세그먼트 할당 정보 또는 `null`
     * [EN] Segment allocation information to bind, or `null`
     */
    bindAllocation(allocation: TAllocation | null): void;
    set groundBlendStrength(val: number);
    /**
     * [KO] `onParameterChanged` 콜백을 트리거하지 않고 스캐터 속성들의 내부 원시 값을 일괄 설정합니다.
     * [EN] Batch-sets the internal raw values of scatter properties without triggering the `onParameterChanged` callback.
     *
     * @param values -
     * [KO] 일괄 설정할 스캐터 속성 값 객체
     * [EN] Object containing scatter property values to batch-set
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
    }): void;
    /**
     * [KO] 스캐터 타입의 파라미터가 변경되었을 때 서브클래스에서 UBO 갱신 또는 리베이킹을 처리하기 위한 추상 훅 메서드입니다.
     * [EN] Abstract hook method for subclasses to handle UBO updates or rebaking when a scatter type parameter changes.
     *
     * @param prop -
     * [KO] 변경된 프로퍼티 이름
     * [EN] Name of the changed property
     */
    abstract onParameterChanged(prop: string): void;
    /**
     * [KO] 스캐터 타입의 세그먼트 할당 참조를 해제합니다.
     * [EN] Releases the segment allocation reference of the scatter type.
     */
    destroy(): void;
}
export default AScatterType;
