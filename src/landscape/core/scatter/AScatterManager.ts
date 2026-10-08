/**
 * [KO] Landscape 스캐터 생태계(잔디 Grass, 식생 Foliage 등)를 총괄 관리하는 최상위 추상 기본 매니저 클래스입니다.
 * [EN] Top-level abstract base manager class orchestrating Landscape scatter ecosystems (Grass, Foliage, etc.).
 * @packageDocumentation
 */
import RedGPUObject from "../../../base/RedGPUObject";
import View3D from "../../../display/view/View3D";
import RenderViewStateData from "../../../display/view/core/RenderViewStateData";
import type Landscape from "../../Landscape";
import type AScatterType from "./AScatterType";
import {AScatterTypeInitOptions} from "./AScatterType";

/**
 * [KO] 대규모 지형(Landscape) 상에 인스턴스를 분산 배치하고 GPU 컬링 및 간접 드로우를 총괄하는 스캐터 매니저 추상 기본 클래스입니다.
 * [EN] Abstract base scatter manager class managing massive instance distribution, GPU culling, and indirect draws on landscapes.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **타입 컬렉션 및 수명주기 관리**: 등록된 스캐터 종(Type)의 배열 및 고유 이름 매핑을 단일 진실 공급원(SSOT)으로 관리합니다.
 * - **Zero-GC 원칙 준수**: 매 프레임 렌더 루프 및 갱신 핫패스에서 힙 메모리 할당 없이 사전 할당된 버퍼를 재사용합니다.
 * - **스캐터 서브시스템 다형성 보장**: GrassManager, FoliageManager 등의 매니저가 동일한 규격으로 상호 운용되도록 지원합니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 내부적으로 관리되는 추상 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class managed internally by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export abstract class AScatterManager<
    TType extends AScatterType = AScatterType,
    TOptions extends AScatterTypeInitOptions = AScatterTypeInitOptions
> extends RedGPUObject {

    #landscape: Landscape;
    #enabled: boolean = true;
    #types: TType[] = [];
    #typesByName: Map<string, TType> = new Map();

    /**
     * [KO] AScatterManager 추상 기본 클래스 생성자입니다.
     * [EN] Constructor for the AScatterManager abstract base class.
     *
     * @param landscape -
     * [KO] 스캐터 생태계가 바인딩될 부모 Landscape 인스턴스
     * [EN] Parent Landscape instance to which the scatter ecosystem is bound
     */
    constructor(landscape: Landscape) {
        super(landscape.redGPUContext);
        this.#landscape = landscape;
    }

    /**
     * [KO] 스캐터 생태계가 바인딩된 부모 Landscape 인스턴스를 반환합니다.
     * [EN] Gets the parent Landscape instance to which the scatter ecosystem is bound.
     */
    get landscape(): Landscape {
        return this.#landscape;
    }

    /**
     * [KO] 스캐터 시스템의 활성화 여부를 반환합니다.
     * [EN] Gets whether the scatter system is enabled.
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * [KO] 스캐터 시스템의 활성화 여부를 설정합니다. `false`일 경우 스트리밍, 컬링, 렌더링이 일시 중단됩니다.
     * [EN] Sets whether the scatter system is enabled. When `false`, streaming, culling, and rendering are suspended.
     */
    set enabled(val: boolean) {
        this.#enabled = !!val;
    }

    /**
     * [KO] 등록된 모든 스캐터 타입 목록을 반환합니다. (내부 배열 직접 참조)
     * [EN] Returns the list of all registered scatter types. (Direct reference to internal array)
     */
    get types(): TType[] {
        return this.#types;
    }

    /**
     * [KO] 등록된 스캐터 타입의 총 개수를 반환합니다.
     * [EN] Returns the total number of registered scatter types.
     */
    get typeCount(): number {
        return this.#types.length;
    }

    /**
     * [KO] 스트리밍되어 메모리에 로드된 활성 인스턴스 총합
     * [EN] Total number of populated/loaded active instances in memory
     */
    abstract get totalInstanceCount(): number;

    /**
     * [KO] VRAM 메가버퍼의 최대 인스턴스 수용 용량
     * [EN] Maximum instance capacity in VRAM mega-buffer
     */
    abstract get instanceCapacity(): number;

    /**
     * [KO] 메인 렌더 패스 간접 드로우콜 총 개수를 반환합니다. 활성화된 모든 스캐터 타입의 드로우콜을 단일 루프로 집계합니다.
     * [EN] Returns total number of indirect draw calls in the main render pass, aggregated across all active scatter types in a single loop.
     */
    get totalDrawCalls(): number {
        if (!this.enabled) return 0;
        let count = 0;
        const list = this.#types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            count += this.computeTypeDrawCalls(list[i]);
        }
        return count;
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스 간접 드로우콜 총 개수를 반환합니다. 그림자를 투사하는(castShadow: true) 스캐터 타입을 단일 루프로 집계합니다.
     * [EN] Returns total number of indirect draw calls in the CSM shadow map pass, aggregated across shadow-casting types in a single loop.
     */
    get shadowDrawCalls(): number {
        if (!this.enabled) return 0;
        let count = 0;
        const list = this.#types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const type = list[i];
            if (!type.castShadow) continue;
            count += this.computeTypeShadowDrawCalls(type);
        }
        return count;
    }

    /**
     * [KO] 특정 스캐터 타입이 메인 렌더 패스(서브클래스에 따라 Depth Prepass 포함)에서 발행하는 간접 드로우콜 수를 계산합니다.
     * [EN] Computes the number of indirect draw calls dispatched by a specific scatter type in the main render pass (including depth prepass depending on subclass).
     *
     * @param type - 대상 스캐터 타입 인스턴스
     */
    protected abstract computeTypeDrawCalls(type: TType): number;

    /**
     * [KO] 그림자를 투사하는 특정 스캐터 타입이 CSM 그림자 맵 패스에서 발행하는 간접 드로우콜 수를 계산합니다.
     * [EN] Computes the number of indirect draw calls dispatched by a shadow-casting scatter type in the CSM shadow pass.
     *
     * @param type - 대상 스캐터 타입 인스턴스
     */
    protected abstract computeTypeShadowDrawCalls(type: TType): number;

    /**
     * [KO] 고유 이름을 통해 등록된 스캐터 타입 인스턴스를 조회합니다.
     * [EN] Finds and retrieves a registered scatter type instance by unique name.
     *
     * @param name -
     * [KO] 조회할 스캐터 타입의 고유 이름
     * [EN] Unique name of the scatter type to retrieve
     * @returns
     * [KO] 일치하는 스캐터 타입 인스턴스 (미등록 시 `undefined`)
     * [EN] Matching scatter type instance (`undefined` if not registered)
     */
    getTypeByName(name: string): TType | undefined {
        if (!name) return undefined;
        return this.#typesByName.get(name);
    }

    /**
     * [KO] 등록된 모든 스캐터 타입을 일괄 제거하고 초기 상태로 리셋합니다.
     * [EN] Clears all registered scatter types and resets to the initial state.
     */
    clearTypes(): void {
        while (this.#types.length > 0) {
            this.removeType(this.#types[this.#types.length - 1]);
        }
        this.#typesByName.clear();
    }

    /**
     * [KO] 새로운 스캐터 타입을 생성하여 매니저에 등록합니다.
     * [EN] Creates and registers a new scatter type into the manager.
     */
    abstract addType(options: TOptions): TType;

    /**
     * [KO] 등록된 특정 스캐터 타입을 매니저에서 제거하고 관련 GPU 리소스를 안전하게 해제합니다.
     * [EN] Removes a specific registered scatter type from the manager and safely releases associated GPU resources.
     */
    abstract removeType(target: TType | string): boolean;

    /**
     * [KO] 등록된 모든 스캐터 타입의 인스턴스 배치를 강제로 다시 베이크합니다.
     * [EN] Forces a rebake of instance placement for all registered scatter types.
     */
    abstract rebakeAll(): void;

    /**
     * [KO] 매 프레임 스트리밍 영역을 갱신하고 GPU 컬링 Compute Pass를 디스패치합니다.
     * [EN] Updates streaming regions and dispatches GPU culling compute passes per frame.
     */
    abstract update(renderViewStateData: RenderViewStateData): void;

    /**
     * [KO] 메인 씬 렌더 패스에서 GPU 컬링을 통과한 인스턴스들을 일괄 드로우합니다.
     * [EN] Draws culled instances in the main scene render pass.
     */
    abstract render(view: View3D, passEncoder: GPURenderPassEncoder): void;

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스에서 그림자 투사가 설정된 인스턴스들의 그림자를 드로우합니다.
     * [EN] Draws shadows for shadow-casting instances in the cascaded shadow map (CSM) pass.
     */
    abstract renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void;

    /**
     * [KO] 매니저가 소유한 모든 GPU 버퍼, 파이프라인 및 자원을 안전하게 해제합니다.
     * [EN] Safely releases all GPU buffers, pipelines, and resources held by the manager.
     */
    abstract destroy(): void;

    /**
     * [KO] 내부 타입 컬렉션에 새로운 스캐터 타입을 등록합니다 (서브클래스 전용 헬퍼).
     * [EN] Registers a new scatter type into internal collections (Subclass-only helper).
     *
     * @param type - 등록할 스캐터 타입 인스턴스
     * @internal
     */
    protected registerTypeInternal(type: TType): void {
        this.#types.push(type);
        this.#typesByName.set(type.name, type);
    }

    /**
     * [KO] 내부 타입 컬렉션에서 특정 스캐터 타입을 제거합니다 (서브클래스 전용 헬퍼).
     * [EN] Removes a specific scatter type from internal collections (Subclass-only helper).
     *
     * @param target - 제거할 스캐터 타입 인스턴스 또는 고유 이름
     * @returns 제거된 스캐터 타입 인스턴스 (미발견 시 null)
     * @internal
     */
    protected unregisterTypeInternal(target: TType | string): TType | null {
        if (!target) return null;
        const name = typeof target === 'string' ? target : target.name;
        const found = this.#typesByName.get(name);
        if (!found) return null;

        const idx = this.#types.indexOf(found);
        if (idx !== -1) {
            this.#types.splice(idx, 1);
        }
        this.#typesByName.delete(name);
        return found;
    }
}

export default AScatterManager;
