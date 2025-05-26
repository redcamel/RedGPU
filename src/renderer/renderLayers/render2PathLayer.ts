import View3D from "../../display/view/View3D";
import renderListForLayer from "./core/renderListForLayer";

const render2PathLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {debugViewRenderState, } = view
    debugViewRenderState.currentRenderPassEncoder = viewRenderPassEncoder
    // render2PathLayer
    const {render2PathLayer} = debugViewRenderState
    renderListForLayer(render2PathLayer, debugViewRenderState)

}
export default render2PathLayer
