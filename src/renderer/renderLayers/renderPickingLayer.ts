import View3D from "../../display/view/View3D";
import renderListForLayer from "./core/renderListForLayer";

/**
 * [KO] PickingManager??罹먯뒪?????紐⑸줉??picking ?뚯씠?꾨씪?몄쑝濡??뚮뜑留곹빀?덈떎.
 * [EN] Renders the PickingManager's casting list using the picking pipeline.
 *
 * @param view -
 * [KO] ?뚮뜑留곹븷 View3D ?몄뒪?댁뒪
 * [EN] View3D instance to render
 * @param viewRenderPassEncoder -
 * [KO] picking ?뚮뜑 ?⑥뒪 ?몄퐫?? * [EN] Picking render pass encoder
 */
const renderPickingLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {renderViewStateData, pickingManager} = view
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
    const {castingList} = pickingManager
    renderListForLayer(castingList, renderViewStateData, 'pickingPipeline')
}
export default renderPickingLayer