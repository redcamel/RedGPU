/**
 * [KO] Landscape 스캐터 생태계(잔디, 식생 등)를 총괄하는 매니저 공통 표준 인터페이스입니다.
 * [EN] Common standard interface for managers orchestrating Landscape scatter ecosystems (Grass, Foliage, etc.).
 * @packageDocumentation
 */
import View3D from "../../../display/view/View3D";
import RenderViewStateData from "../../../display/view/core/RenderViewStateData";

/**
 * [KO] 지형 상에 대규모 인스턴스를 분산 배치하고 GPU 컬링 및 간접 드로우를 총괄하는 스캐터 매니저 공통 인터페이스입니다.
 * [EN] Common scatter manager interface managing massive instance distribution, GPU culling, and indirect draws on landscapes.
 */
export interface IScatterManager<TType, TOptions = any> {
    /**
     * [KO] 시스템 활성화 여부
     * [EN] Whether the scatter system is enabled
     */
    enabled: boolean;

    /**
     * [KO] 등록된 스캐터 타입 목록 (대입 불가 프로퍼티, 배열 요소 자체는 가변)
     * [EN] List of registered scatter types (non-assignable property, array elements are mutable)
     */
    readonly types: TType[];

    /**
     * [KO] 등록된 스캐터 타입의 총 개수
     * [EN] Total number of registered scatter types
     */
    readonly typeCount: number;

    /**
     * [KO] 스트리밍되어 메모리에 로드된 활성 인스턴스 총합
     * [EN] Total number of populated/loaded active instances in memory
     */
    readonly totalInstanceCount: number;

    /**
     * [KO] VRAM 메가버퍼의 최대 인스턴스 수용 용량
     * [EN] Maximum instance capacity in VRAM mega-buffer
     */
    readonly instanceCapacity: number;

    /**
     * [KO] 메인 렌더 패스 간접 드로우콜 총 개수
     * [EN] Total number of indirect draw calls in the main render pass
     */
    readonly totalDrawCalls: number;

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스 간접 드로우콜 총 개수
     * [EN] Total number of indirect draw calls in the cascaded shadow map (CSM) pass
     */
    readonly shadowDrawCalls: number;

    /**
     * [KO] 새로운 스캐터 타입을 생성하여 매니저에 등록합니다.
     * [EN] Creates and registers a new scatter type into the manager.
     * @param options - 스캐터 타입 생성 옵션
     * @returns 생성된 스캐터 타입 인스턴스
     */
    addType(options: TOptions): TType;

    /**
     * [KO] 등록된 특정 스캐터 타입을 매니저에서 제거하고 관련 GPU 리소스를 안전하게 해제합니다.
     * [EN] Removes a specific registered scatter type from the manager and safely releases associated GPU resources.
     * @param target - 제거할 스캐터 타입 인스턴스 또는 고유 이름
     * @returns 제거 성공 여부
     */
    removeType(target: TType | string): boolean;

    /**
     * [KO] 고유 이름을 통해 등록된 스캐터 타입 인스턴스를 검색합니다.
     * [EN] Finds and retrieves a registered scatter type instance by unique name.
     * @param name - 검색할 스캐터 타입의 고유 이름
     * @returns 일치하는 스캐터 타입 인스턴스 (미발견 시 undefined)
     */
    getTypeByName(name: string): TType | undefined;

    /**
     * [KO] 등록된 모든 스캐터 타입을 일괄 제거하고 초기 상태로 리셋합니다.
     * [EN] Clears all registered scatter types and resets to the initial state.
     */
    clearTypes(): void;

    /**
     * [KO] 등록된 모든 스캐터 타입의 인스턴스 배치를 강제로 다시 베이크합니다.
     * [EN] Forces a rebake of instance placement for all registered scatter types.
     */
    rebakeAll(): void;

    /**
     * [KO] 매 프레임 스트리밍 영역을 갱신하고 GPU 컬링 Compute Pass를 디스패치합니다.
     * [EN] Updates streaming regions and dispatches GPU culling compute passes per frame.
     * @param renderViewStateData - 뷰 렌더 상태 데이터
     */
    update(renderViewStateData: RenderViewStateData): void;

    /**
     * [KO] 메인 씬 렌더 패스에서 GPU 컬링을 통과한 인스턴스들을 일괄 드로우합니다.
     * [EN] Draws culled instances in the main scene render pass.
     * @param view - 현재 렌더링 중인 View3D 객체
     * @param passEncoder - 메인 씬 GPURenderPassEncoder
     */
    render(view: View3D, passEncoder: GPURenderPassEncoder): void;

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스에서 그림자 투사가 설정된 인스턴스들의 그림자를 드로우합니다.
     * [EN] Draws shadows for shadow-casting instances in the cascaded shadow map (CSM) pass.
     * @param view - 그림자 패스를 렌더링 중인 View3D 객체
     * @param passEncoder - 섀도우 맵 생성을 위한 GPURenderPassEncoder
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void;

    /**
     * [KO] 매니저가 소유한 모든 GPU 버퍼, 파이프라인 및 자원을 안전하게 해제합니다.
     * [EN] Safely releases all GPU buffers, pipelines, and resources held by the manager.
     */
    destroy(): void;
}

export default IScatterManager;
