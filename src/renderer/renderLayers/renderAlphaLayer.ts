import View3D from "../../display/view/View3D";
import sortTransparentObjects from "../../utils/math/sortTransparentObjects";

const renderAlphaLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
	const {renderViewStateData, rawCamera,} = view
	renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
	// renderAlphaLayer
	const {bundleListAlphaLayer, bundleListTransparentLayer, bundleListParticleLayer} = renderViewStateData
	if(bundleListAlphaLayer.length) {
		viewRenderPassEncoder.executeBundles(bundleListAlphaLayer);
	}
	// renderTransparentLayer
	const {x, y, z} = rawCamera
	if(bundleListTransparentLayer.length) {
		viewRenderPassEncoder.executeBundles(sortTransparentObjects({x, y, z}, bundleListTransparentLayer))
	}
	// particleLayer
	if(bundleListParticleLayer.length) {
		viewRenderPassEncoder.executeBundles(bundleListParticleLayer);
	}
}
export default renderAlphaLayer
