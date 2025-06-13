import View3D from "../../display/view/View3D";
import shdowManager from "../../shadow/ShdowManager";
import renderListForLayer from "./core/renderListForLayer";

const renderShadowLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {debugViewRenderState, scene,} = view
    debugViewRenderState.currentRenderPassEncoder = viewRenderPassEncoder
    const {shadowManager} = scene
    const {directionalShadowManager} = shadowManager
    const {castingList} = directionalShadowManager
    renderListForLayer(castingList, debugViewRenderState, 'shadowPipeline')
}
export default renderShadowLayer
