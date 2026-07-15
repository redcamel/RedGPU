import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import Mesh from "../../Mesh";
import createMeshVertexShaderModule from "../shader/createMeshVertexShaderModule";
import createBasePipeline from "./createBasePipeline";

/**
 * Updates the dirty state of a mesh's pipeline and related data.
 *
 * @param {Mesh} mesh - The mesh to update.
 * @param {RenderViewStateData} renderViewStateData - The render state data used for debugging.
 *

 */
const updateMeshDirtyPipeline = (
    mesh: Mesh,
    renderViewStateData?: RenderViewStateData
) => {
    console.log('updateMeshDirtyPipeline')
    const {material, gpuRenderInfo, redGPUContext} = mesh
    const {resourceManager} = redGPUContext
    mesh.dirtyTransform = true
    if (material.dirtyPipeline) material._updateFragmentState()
    const vertexShader = createMeshVertexShaderModule(mesh)
    const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
        gpuRenderInfo.vertexStructInfo.uniforms.vertexUniforms ? ResourceManager.PRESET_VERTEX_GPUBindGroupLayout :
            mesh.animationInfo.skinInfo ? ResourceManager.PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_SKIN : ResourceManager.PRESET_GLOBAL_VERTEX_GPUBindGroupLayout
    )
    gpuRenderInfo.vertexShaderModule = vertexShader
    gpuRenderInfo.pipeline = createBasePipeline(mesh, vertexShader, vertexBindGroupLayout)
    gpuRenderInfo.shadowPipeline = null
    gpuRenderInfo.pickingPipeline = null
    const {vertexUniformInfo, vertexUniformBuffer} = mesh.gpuRenderInfo

    if (vertexUniformInfo) {
        const {members} = vertexUniformInfo
        for (const k in members) {
            if (k !== 'pickingId' && k !== 'pixelSize') mesh[k] = mesh[k]
        }
    }

    // if (mesh.gpuRenderInfo.vertexUniformInfo.members.pickingId) {
    // mesh.gpuRenderInfo.vertexUniformBuffer.writeOnlyBuffer(mesh.gpuRenderInfo.vertexUniformInfo.members.pickingId, mesh.pickingId)
    mesh.redGPUContext.globalVertexSSBO.updateUintData(
        mesh.globalVertexSlotIndex,
        new Uint32Array([mesh.pickingId]),
        resourceManager.GLOBAL_VERTEX_STRUCT.members.pickingId.uniformOffset / 4
    )
    // }
    material.dirtyPipeline = false
    mesh.dirtyPipeline = false
    if (renderViewStateData) renderViewStateData.renderResults.numDirtyPipelines++
}
export default updateMeshDirtyPipeline
