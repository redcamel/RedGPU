import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../../resources/resourceManager/ResourceManager";
import Mesh from "../Mesh";

const createMeshVertexUniformBuffers = (mesh: Mesh, skin: boolean = false) => {
	const {gpuRenderInfo, redGPUContext} = mesh
	const {resourceManager} = redGPUContext;
	const bindGroupLayout = resourceManager.getGPUBindGroupLayout(
		skin ? ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_SKIN : ResourceManager.PRESET_VERTEX_GPUBindGroupLayout
	);
	const vertexUniformData = new ArrayBuffer(
		gpuRenderInfo.vertexUniformInfo.arrayBufferByteLength
	);
	const vertexUniformBuffer = new UniformBuffer(
		redGPUContext,
		vertexUniformData,
		mesh.name
	);
	gpuRenderInfo.vertexBindGroupLayout = bindGroupLayout;
	gpuRenderInfo.vertexUniformBuffer = vertexUniformBuffer;
}
export default createMeshVertexUniformBuffers
