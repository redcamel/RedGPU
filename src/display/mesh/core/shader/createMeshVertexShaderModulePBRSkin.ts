import StorageBuffer from "../../../../resources/buffer/storageBuffer/StorageBuffer";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import {keepLog} from "../../../../utils";
import Mesh from "../../Mesh";
import vertexModuleSourcePbrSkin from "../../shader/meshVertexPbrSkin.wgsl";
import createMeshVertexUniformBuffers from "../createMeshVertexUniformBuffers";
import getBasicMeshVertexBindGroupDescriptor from "./getBasicMeshVertexBindGroupDescriptor";

const createMeshVertexShaderModulePBRSkin = (
	VERTEX_SHADER_MODULE_NAME_PBR_SKIN: string,
	mesh: Mesh,
): GPUShaderModule => {
	const {redGPUContext, currentShaderModuleName} = mesh
	const {resourceManager} = redGPUContext
	const {gpuRenderInfo} = mesh
	const jointNum = `${mesh.animationInfo.skinInfo.joints.length}`
	const label = `${VERTEX_SHADER_MODULE_NAME_PBR_SKIN}_${jointNum}`
	const code = `${vertexModuleSourcePbrSkin}`
	const vModuleDescriptor: GPUShaderModuleDescriptor = {code}
	console.log('createMeshVertexShaderModulePBRSkin', currentShaderModuleName)
	if (currentShaderModuleName === label) return resourceManager.getGPUShaderModule(label,)
	else {
		vModuleDescriptor.code = code.replaceAll('#JOINT_NUM', jointNum)
		gpuRenderInfo.vertexUniformInfo = parseWGSL(vModuleDescriptor.code).uniforms.vertexUniforms
		if (mesh.animationInfo.skinInfo) {
			createMeshVertexUniformBuffers(mesh, true)
			mesh.animationInfo.skinInfo.vertexStorageInfo = parseWGSL(vModuleDescriptor.code).storage.vertexStorages
			keepLog('mesh.animationInfo.skinInfo.vertexStorageInfo', mesh.animationInfo.skinInfo.vertexStorageInfo)
			const newData = new ArrayBuffer(mesh.animationInfo.skinInfo.vertexStorageInfo.arrayBufferByteLength)
			mesh.animationInfo.skinInfo.vertexStorageBuffer = new StorageBuffer(
				mesh.redGPUContext,
				newData,
				mesh.name
			)
			gpuRenderInfo.vertexUniformBindGroup = redGPUContext.gpuDevice.createBindGroup(getBasicMeshVertexBindGroupDescriptor(mesh, true));
		} else {
			createMeshVertexUniformBuffers(mesh)
			gpuRenderInfo.vertexUniformBindGroup = redGPUContext.gpuDevice.createBindGroup(getBasicMeshVertexBindGroupDescriptor(mesh));
		}
	}
	const module = resourceManager.createGPUShaderModule(
		label,
		vModuleDescriptor
	)
	mesh.gpuRenderInfo.vertexShaderModule = module
	return mesh.gpuRenderInfo.vertexShaderModule
}
export default createMeshVertexShaderModulePBRSkin
