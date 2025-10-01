import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../../resources/resourceManager/ResourceManager";
import Mesh from "../Mesh";

/**
 * createMeshVertexUniformBuffers
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 * @param mesh
 * @param skin
 */
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
