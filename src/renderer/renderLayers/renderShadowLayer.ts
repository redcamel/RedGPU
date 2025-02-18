import View3D from "../../display/view/View3D";
import renderListForLayer from "./core/renderListForLayer";

const renderShadowLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {debugViewRenderState, scene,} = view
    debugViewRenderState.currentRenderPassEncoder = viewRenderPassEncoder
    const {castingList} = scene.shadowManager
    renderListForLayer(castingList, debugViewRenderState, 'shadowPipeline')
}
export default renderShadowLayer
