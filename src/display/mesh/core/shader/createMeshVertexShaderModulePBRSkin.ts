import Mesh from "../../Mesh";
import vertexModuleSourcePbrSkin from "../../shader/meshVertexPbrSkin.wgsl";
import createMeshVertexUniformBuffers from "../createMeshVertexUniformBuffers";
import getBasicMeshVertexBindGroupDescriptor from "./getBasicMeshVertexBindGroupDescriptor";

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
            // const newData = new ArrayBuffer(mesh.animationInfo.skinInfo.vertexStorageInfo.arrayBufferByteLength)

            mesh.animationInfo.skinInfo.vertexStorageBuffer = gpuDevice.createBuffer({
                size: mesh.geometry.vertexBuffer.vertexCount * 64, // SkinnedVertex (position 16, normal 16, tangent 16, currentClipPos 16) = 64 bytes
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            });
            mesh.animationInfo.skinInfo.prevVertexStorageBuffer = gpuDevice.createBuffer({
                size: mesh.geometry.vertexBuffer.vertexCount * 16, // vec4<f32> position = 16 bytes
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
