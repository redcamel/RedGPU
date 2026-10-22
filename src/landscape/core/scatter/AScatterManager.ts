import RedGPUObject from "../../../base/RedGPUObject";
import View3D from "../../../display/view/View3D";
import RenderViewStateData from "../../../display/view/core/RenderViewStateData";
import type Landscape from "../../Landscape";
import type AScatterType from "./AScatterType";
import {AScatterTypeInitOptions} from "./AScatterType";

/**
 * [KO] 지형 스캐터(식생, 잔디 등) 타입들의 등록, 생명주기, GPU 베이킹/컬링 업데이트 및 렌더링을 총괄하는 추상 매니저 클래스입니다.
 * [EN] Abstract manager class that oversees registration, lifecycle, GPU baking/culling updates, and rendering of terrain scatter (foliage, grass, etc.) types.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @typeParam TType -
 * [KO] 매니저가 관리하는 스캐터 타입 클래스 (`AScatterType`의 서브클래스)
 * [EN] Scatter type class managed by the manager (subclass of `AScatterType`)
 * @typeParam TOptions -
 * [KO] 스캐터 타입 생성 시 전달되는 초기화 옵션 인터페이스 (`AScatterTypeInitOptions`의 서브타입)
 * [EN] Initialization options interface passed when creating a scatter type (subtype of `AScatterTypeInitOptions`)
 *
 * @category Landscape
 */
abstract class AScatterManager<
    TType extends AScatterType = AScatterType,
    TOptions extends AScatterTypeInitOptions = AScatterTypeInitOptions
> extends RedGPUObject {

    #landscape: Landscape;
    #enabled: boolean = true;
    #types: TType[] = [];
    #typesByName: Map<string, TType> = new Map();

    /**
     * [KO] `AScatterManager` 인스턴스를 초기화합니다.
     * [EN] Initializes an `AScatterManager` instance.
     *
     * @param landscape -
     * [KO] 이 스캐터 매니저를 소유하는 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance that owns this scatter manager
     */
    constructor(landscape: Landscape) {
        super(landscape.redGPUContext);
        this.#landscape = landscape;
    }

    /**
     * [KO] 이 스캐터 매니저가 속한 `Landscape` 인스턴스를 반환합니다.
     * [EN] Returns the `Landscape` instance to which this scatter manager belongs.
     *
     * @returns
     * [KO] 소유자 `Landscape` 인스턴스
     * [EN] Owner `Landscape` instance
     */
    get landscape(): Landscape {
        return this.#landscape;
    }

    /**
     * [KO] 스캐터 매니저의 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the scatter manager is enabled.
     *
     * @returns
     * [KO] 활성화 여부
     * [EN] Whether enabled
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    set enabled(val: boolean) {
        this.#enabled = val;
    }

    /**
     * [KO] 현재 등록된 모든 스캐터 타입(`TType[]`) 목록을 반환합니다.
     * [EN] Returns the list of all currently registered scatter types (`TType[]`).
     *
     * @returns
     * [KO] 등록된 스캐터 타입 배열 (`TType[]`)
     * [EN] Array of registered scatter types (`TType[]`)
     */
    get types(): TType[] {
        return this.#types;
    }

    /**
     * [KO] 할당된 전체 스캐터 인스턴스 수를 반환합니다.
     * [EN] Returns the total number of allocated scatter instances.
     *
     * @returns
     * [KO] 전체 인스턴스 수
     * [EN] Total instance count
     */
    abstract get totalInstanceCount(): number;

    /**
     * [KO] 메가 버퍼에 확보된 최대 인스턴스 수용량(Capacity)을 반환합니다.
     * [EN] Returns the maximum instance capacity allocated in the mega buffer.
     *
     * @returns
     * [KO] 최대 인스턴스 수용량
     * [EN] Maximum instance capacity
     */
    abstract get instanceCapacity(): number;

    /**
     * [KO] 활성 상태에서 등록된 모든 스캐터 타입의 총 메인 패스 드로우콜 수를 반환합니다.
     * [EN] Returns the total number of main pass draw calls across all registered scatter types when enabled.
     *
     * @returns
     * [KO] 총 메인 패스 드로우콜 수
     * [EN] Total main pass draw call count
     */
    get totalDrawCalls(): number {
        const {enabled, types} = this;
        if (!enabled) return 0;
        let count = 0;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            count += this.computeTypeDrawCalls(types[i]);
        }
        return count;
    }

    /**
     * [KO] 그림자 투사(`castShadow`)가 활성화된 모든 스캐터 타입의 총 그림자 패스 드로우콜 수를 반환합니다.
     * [EN] Returns the total number of shadow pass draw calls across all scatter types with `castShadow` enabled.
     *
     * @returns
     * [KO] 총 그림자 패스 드로우콜 수
     * [EN] Total shadow pass draw call count
     */
    get shadowDrawCalls(): number {
        const {enabled, types} = this;
        if (!enabled) return 0;
        let count = 0;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const type = types[i];
            const {castShadow} = type;
            if (!castShadow) continue;
            count += this.computeTypeShadowDrawCalls(type);
        }
        return count;
    }

    /**
     * [KO] 개별 스캐터 타입의 메인 렌더 패스 드로우콜 수를 계산합니다.
     * [EN] Computes the number of main render pass draw calls for an individual scatter type.
     *
     * @param type -
     * [KO] 드로우콜 수를 계산할 대상 스캐터 타입
     * [EN] Target scatter type for which to compute the draw call count
     * @returns
     * [KO] 해당 타입의 메인 패스 드로우콜 수
     * [EN] Main pass draw call count for the type
     */
    abstract computeTypeDrawCalls(type: TType): number;

    /**
     * [KO] 개별 스캐터 타입의 그림자 렌더 패스 드로우콜 수를 계산합니다.
     * [EN] Computes the number of shadow render pass draw calls for an individual scatter type.
     *
     * @param type -
     * [KO] 그림자 드로우콜 수를 계산할 대상 스캐터 타입
     * [EN] Target scatter type for which to compute the shadow draw call count
     * @returns
     * [KO] 해당 타입의 그림자 패스 드로우콜 수
     * [EN] Shadow pass draw call count for the type
     */
    abstract computeTypeShadowDrawCalls(type: TType): number;

    /**
     * [KO] 고유 이름으로 등록된 스캐터 타입 인스턴스를 조회합니다.
     * [EN] Looks up a registered scatter type instance by its unique name.
     *
     * @param name -
     * [KO] 조회할 스캐터 타입 이름
     * [EN] Name of the scatter type to look up
     * @returns
     * [KO] 일치하는 스캐터 타입 인스턴스 또는 존재하지 않을 경우 `undefined`
     * [EN] Matching scatter type instance, or `undefined` if not found
     */
    getTypeByName(name: string): TType | undefined {
        return this.#typesByName.get(name);
    }

    /**
     * [KO] 등록된 모든 스캐터 타입을 순차적으로 제거하고 내부 맵을 초기화합니다.
     * [EN] Sequentially removes all registered scatter types and clears the internal map.
     */
    clearTypes(): void {
        const {types} = this;
        while (types.length > 0) {
            this.removeType(types[types.length - 1]);
        }
        this.#typesByName.clear();
    }

    /**
     * [KO] 새로운 스캐터 타입을 생성하여 매니저에 등록합니다.
     * [EN] Creates a new scatter type and registers it with the manager.
     *
     * @param options -
     * [KO] 스캐터 타입 초기화 옵션
     * [EN] Scatter type initialization options
     * @returns
     * [KO] 생성 및 등록된 스캐터 타입 인스턴스
     * [EN] Created and registered scatter type instance
     */
    abstract addType(options: TOptions): TType;

    /**
     * [KO] 지정된 스캐터 타입 인스턴스 또는 이름에 해당하는 타입을 매니저에서 제거합니다.
     * [EN] Removes the specified scatter type instance or the type matching the given name from the manager.
     *
     * @param target -
     * [KO] 제거할 스캐터 타입 인스턴스 또는 타입 이름 문자열
     * [EN] Scatter type instance or type name string to remove
     * @returns
     * [KO] 제거 성공 여부
     * [EN] Whether the removal succeeded
     */
    abstract removeType(target: TType | string): boolean;

    /**
     * [KO] 등록된 모든 스캐터 타입의 인스턴스 배치를 처음부터 다시 베이킹하도록 요청합니다.
     * [EN] Requests a full rebake of instance placements for all registered scatter types.
     */
    abstract rebakeAll(): void;

    /**
     * [KO] 매 프레임 뷰 상태 데이터를 기반으로 스캐터 베이킹 및 GPU 컬링 파이프라인을 업데이트합니다.
     * [EN] Updates the scatter baking and GPU culling pipelines every frame based on the view state data.
     *
     * @param renderViewStateData -
     * [KO] 현재 프레임의 뷰 렌더링 상태 데이터
     * [EN] View rendering state data for the current frame
     */
    abstract update(renderViewStateData: RenderViewStateData): void;

    /**
     * [KO] 메인 렌더 패스에서 가시 스캐터 인스턴스들을 렌더링합니다.
     * [EN] Renders visible scatter instances in the main render pass.
     *
     * @param view -
     * [KO] 현재 렌더링 중인 `View3D` 인스턴스
     * [EN] Currently rendering `View3D` instance
     * @param passEncoder -
     * [KO] 메인 렌더 패스 인코더
     * [EN] Main render pass encoder
     */
    abstract render(view: View3D, passEncoder: GPURenderPassEncoder): void;

    /**
     * [KO] 디렉셔널 그림자 렌더 패스에서 그림자 투사 스캐터 인스턴스들을 렌더링합니다.
     * [EN] Renders shadow-casting scatter instances in the directional shadow render pass.
     *
     * @param view -
     * [KO] 현재 렌더링 중인 `View3D` 인스턴스
     * [EN] Currently rendering `View3D` instance
     * @param passEncoder -
     * [KO] 그림자 렌더 패스 인코더
     * [EN] Shadow render pass encoder
     */
    abstract renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void;

    /**
     * [KO] 매니저가 관리하는 모든 스캐터 타입과 GPU 리소스를 파기합니다.
     * [EN] Destroys all scatter types and GPU resources managed by the manager.
     */
    abstract destroy(): void;

    /**
     * [KO] 스캐터 타입 인스턴스를 내부 배열 및 이름 맵(`Map<string, TType>`)에 등록합니다.
     * [EN] Registers a scatter type instance into the internal array and name map (`Map<string, TType>`).
     *
     * @param type -
     * [KO] 등록할 스캐터 타입 인스턴스
     * [EN] Scatter type instance to register
     */
    registerTypeInternal(type: TType): void {
        const {name} = type;
        this.#types.push(type);
        this.#typesByName.set(name, type);
    }

    /**
     * [KO] 내부 배열 및 이름 맵(`Map<string, TType>`)에서 대상 스캐터 타입의 등록을 해제하고 반환합니다.
     * [EN] Unregisters and returns the target scatter type from the internal array and name map (`Map<string, TType>`).
     *
     * @param target -
     * [KO] 등록 해제할 스캐터 타입 인스턴스 또는 타입 이름 문자열
     * [EN] Scatter type instance or type name string to unregister
     * @returns
     * [KO] 등록 해제된 스캐터 타입 인스턴스 또는 찾지 못한 경우 `null`
     * [EN] Unregistered scatter type instance, or `null` if not found
     */
    unregisterTypeInternal(target: TType | string): TType | null {
        if (!target) return null;
        const lookupName = typeof target === 'string' ? target : target.name;
        const found = this.#typesByName.get(lookupName);
        if (!found) return null;

        const idx = this.#types.indexOf(found);
        if (idx !== -1) {
            this.#types.splice(idx, 1);
        }
        this.#typesByName.delete(lookupName);
        return found;
    }
}

Object.freeze(AScatterManager);
export default AScatterManager;
