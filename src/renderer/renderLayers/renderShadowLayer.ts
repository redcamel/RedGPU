import View3D from "../../display/view/View3D";
import renderListForLayer from "./core/renderListForLayer";

const renderShadowLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {renderViewStateData, scene,} = view
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
    const {shadowManager} = scene
    const {directionalShadowManager} = shadowManager
    const {castingList} = directionalShadowManager
    renderListForLayer(castingList, renderViewStateData, 'shadowPipeline')
}
export default renderShadowLayer
