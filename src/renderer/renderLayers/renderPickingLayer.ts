import View3D from "../../display/view/View3D";
import renderListForLayer from "./core/renderListForLayer";

const renderPickingLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {debugViewRenderState, pickingManager} = view
    debugViewRenderState.currentRenderPassEncoder = viewRenderPassEncoder
    const {castingList} = pickingManager
    renderListForLayer(castingList, debugViewRenderState, 'pickingPipeline')
}
export default renderPickingLayer
