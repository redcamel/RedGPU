import View3D from "../../display/view/View3D";
import renderListForLayer from "./core/renderListForLayer";

/**
 * [KO] PickingManager의 캐스팅 대상 목록을 picking 파이프라인으로 렌더링합니다.
 * [EN] Renders the PickingManager's casting list using the picking pipeline.
 *
 * @param view -
 * [KO] 렌더링할 View3D 인스턴스
 * [EN] View3D instance to render
 * @param viewRenderPassEncoder -
 * [KO] picking 렌더 패스 인코더
 * [EN] Picking render pass encoder
 * @category Renderer
 */
const renderPickingLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {renderViewStateData, pickingManager} = view
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
    const {castingList} = pickingManager
    renderListForLayer(castingList, renderViewStateData, 'pickingPipeline')
}
export default renderPickingLayer