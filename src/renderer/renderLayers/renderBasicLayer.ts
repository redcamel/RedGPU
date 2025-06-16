import View3D from "../../display/view/View3D";
import RenderViewStateData from "../RenderViewStateData";

const renderBasicLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
	const {debugViewRenderState, skybox, scene} = view
	debugViewRenderState.currentRenderPassEncoder = viewRenderPassEncoder
	const {instanceMeshLayer} = debugViewRenderState
	const {children} = scene
	if (skybox) skybox.render(debugViewRenderState)
	renderList(children, debugViewRenderState)
	renderList(instanceMeshLayer, debugViewRenderState)
}
export default renderBasicLayer
const renderList = (list, debugViewRenderState: RenderViewStateData) => {
	let i = 0
	const len = list.length;
	for (i; i < len; i++) {
		list[i].render(debugViewRenderState);
	}
	// console.log(debugViewRenderState.dirtyVertexUniformFromMaterial)
	debugViewRenderState.prevVertexGpuBuffer = null
	debugViewRenderState.prevFragmentUniformBindGroup = null
	debugViewRenderState.prevVertexGpuBuffer = null
}
