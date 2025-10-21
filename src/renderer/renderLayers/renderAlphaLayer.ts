import View3D from "../../display/view/View3D";
import sortTransparentObjects from "../../utils/math/sortTransparentObjects";

const renderAlphaLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
	const {renderViewStateData, rawCamera,} = view
	renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
	// renderAlphaLayer
	const {alphaLayer, transparentLayer, particleLayer} = renderViewStateData
	if(alphaLayer.length) {
		viewRenderPassEncoder.executeBundles(alphaLayer);
	}
	// renderTransparentLayer
	const {x, y, z} = rawCamera
	if(transparentLayer.length) {
		viewRenderPassEncoder.executeBundles(sortTransparentObjects({x, y, z}, transparentLayer))
	}
	// particleLayer
	if(particleLayer.length) {
		viewRenderPassEncoder.executeBundles(particleLayer);
	}
}
export default renderAlphaLayer
