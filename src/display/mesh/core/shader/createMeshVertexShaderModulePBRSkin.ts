import Mesh from "../../Mesh";
import vertexModuleSourcePbrSkin from "../../shader/meshVertexPbrSkin.wgsl";
import createMeshVertexUniformBuffers from "../createMeshVertexUniformBuffers";
import getBasicMeshVertexBindGroupDescriptor from "./getBasicMeshVertexBindGroupDescriptor";

/**
 * [KO] PBR 스키닝이 적용된 메시를 위한 버텍스 GPUShaderModule 및 스토리지 버퍼를 생성합니다.
 * [EN] Creates a vertex GPUShaderModule and storage buffers for a mesh with PBR skinning applied.
 *
 * ::: warning
 * [KO] 이 함수는 시스템에 의해 내부적으로 호출됩니다.<br/>직접 호출하지 마십시오.
 * [EN] This function is called internally by the system.<br/>Do not call it directly.
 * :::
 *
 * @param VERTEX_SHADER_MODULE_NAME_PBR_SKIN -
 * [KO] 버텍스 셰이더 모듈 식별 이름
 * [EN] Vertex shader module identifier name
 * @param mesh -
 * [KO] 대상 Mesh 인스턴스
 * [EN] Target Mesh instance
 * @returns
 * [KO] 생성된 버텍스 GPUShaderModule 인스턴스
 * [EN] Created vertex GPUShaderModule instance
 * @category Core
 */
const createMeshVertexShaderModulePBRSkin = (
    VERTEX_SHADER_MODULE_NAME_PBR_SKIN: string,
    mesh: Mesh,
): GPUShaderModule => {
    const {redGPUContext, currentShaderModuleName} = mesh
    const {resourceManager, gpuDevice} = redGPUContext
    const {gpuRenderInfo} = mesh
    const label = `${VERTEX_SHADER_MODULE_NAME_PBR_SKIN}`
    const code = `${vertexModuleSourcePbrSkin}`
    const vModuleDescriptor: GPUShaderModuleDescriptor = {code}
    console.log('createMeshVertexShaderModulePBRSkin', currentShaderModuleName)
    if (currentShaderModuleName === label) return resourceManager.getGPUShaderModule(label,)
    else {
        gpuRenderInfo.vertexUniformInfo = resourceManager.wgslParser.parse(`MESH_VERTEX_PBR_SKIN_JOINT`, vModuleDescriptor.code).uniforms.vertexUniforms
        if (mesh.animationInfo.skinInfo) {
            createMeshVertexUniformBuffers(mesh, true)
            mesh.animationInfo.skinInfo.vertexStorageInfo = resourceManager.wgslParser.parse(`MESH_VERTEX_PBR_SKIN_JOINT`, vModuleDescriptor.code).storage.vertexStorages

            mesh.animationInfo.skinInfo.vertexStorageBuffer = gpuDevice.createBuffer({
                size: mesh.geometry.vertexBuffer.vertexCount * 64,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            });
            mesh.animationInfo.skinInfo.prevVertexStorageBuffer = gpuDevice.createBuffer({
                size: mesh.geometry.vertexBuffer.vertexCount * 16,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            });
            gpuRenderInfo.vertexUniformBindGroup = redGPUContext.gpuDevice.createBindGroup(getBasicMeshVertexBindGroupDescriptor(mesh, true));
        } else {
            createMeshVertexUniformBuffers(mesh)
            gpuRenderInfo.vertexUniformBindGroup = redGPUContext.gpuDevice.createBindGroup(getBasicMeshVertexBindGroupDescriptor(mesh));
        }
    }

    mesh.gpuRenderInfo.vertexShaderModule = resourceManager.createGPUShaderModule(
        label,
        vModuleDescriptor
    )
    return mesh.gpuRenderInfo.vertexShaderModule
}
export default createMeshVertexShaderModulePBRSkin
