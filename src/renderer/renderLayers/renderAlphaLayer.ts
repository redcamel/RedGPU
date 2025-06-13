import View3D from "../../display/view/View3D";
import sortTransparentObjects from "../../utils/math/sortTransparentObjects";
import renderListForLayer from "./core/renderListForLayer";

const renderAlphaLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
	const {debugViewRenderState, rawCamera,} = view
	debugViewRenderState.currentRenderPassEncoder = viewRenderPassEncoder
	// renderAlphaLayer
	const {alphaLayer, transparentLayer, particleLayer} = debugViewRenderState
	renderListForLayer(alphaLayer, debugViewRenderState)
	// renderTransparentLayer
	const {x, y, z} = rawCamera
	sortTransparentObjects({x, y, z}, transparentLayer)
	renderListForLayer(transparentLayer, debugViewRenderState)
	//
	renderListForLayer(particleLayer, debugViewRenderState)
}
export default renderAlphaLayer
