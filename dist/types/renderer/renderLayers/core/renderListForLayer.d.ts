import RenderViewStateData from "../../../display/view/core/RenderViewStateData";
/**
 * [KO] 지정된 렌더 레이어의 객체 목록을 순회하며 드로우 콜을 수행합니다.
 * [EN] Iterates through the object list of the specified render layer and executes draw calls.
 *
 * @param list -
 * [KO] 렌더링할 객체 배열
 * [EN] Array of objects to render
 * @param renderViewStateData -
 * [KO] 현재 뷰의 렌더링 상태 데이터
 * [EN] Render state data of the current view
 * @param pipelineKey -
 * [KO] 사용할 렌더 파이프라인 프로퍼티 키 (기본값: `'pipeline'`)
 * [EN] Property key of the render pipeline to use (default: `'pipeline'`)
 * @category Renderer
 */
declare const renderListForLayer: (list: any, renderViewStateData: RenderViewStateData, pipelineKey?: string) => void;
export default renderListForLayer;
