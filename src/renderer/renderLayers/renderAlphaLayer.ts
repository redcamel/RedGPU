import View3D from "../../display/view/View3D";
import sortTransparentObjects from "../../utils/math/sortTransparentObjects";

const renderAlphaLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
	const {renderViewStateData, rawCamera,} = view
	renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
	// renderAlphaLayer
	const {alphaLayer, transparentLayer, particleLayer} = renderViewStateData
	viewRenderPassEncoder.executeBundles(alphaLayer);
	// renderTransparentLayer
	const {x, y, z} = rawCamera
	viewRenderPassEncoder.executeBundles(sortTransparentObjects({x, y, z}, transparentLayer))
	// particleLayer
	viewRenderPassEncoder.executeBundles(particleLayer);
}
export default renderAlphaLayer
