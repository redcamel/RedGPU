import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";

const renderBasicLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
	const {renderViewStateData, scene} = view
	renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
	const {children} = scene
	let i = 0
	const len = children.length;
	for (i; i < len; i++) {
		children[i].render(renderViewStateData);
	}
	renderViewStateData.prevVertexGpuBuffer = null
	renderViewStateData.prevFragmentUniformBindGroup = null
	renderViewStateData.prevVertexGpuBuffer = null
	viewRenderPassEncoder.executeBundles(renderViewStateData.bundleListBasicList);
}
export default renderBasicLayer
