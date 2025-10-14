import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import createMeshVertexShaderModule from "../shader/createMeshVertexShaderModule";
import createBasePipeline from "./createBasePipeline";
/**
 * Updates the dirty state of a mesh's pipeline and related data.
 *
 * @param {Mesh} mesh - The mesh to update.
 * @param {RenderViewStateData} renderViewStateData - The render state data used for debugging.
 *

 */
const updateMeshDirtyPipeline = (mesh, renderViewStateData) => {
    console.log('updateMeshDirtyPipeline');
    const { material, gpuRenderInfo, redGPUContext } = mesh;
    const { resourceManager } = redGPUContext;
    mesh.dirtyTransform = true;
    if (material.dirtyPipeline)
        material._updateFragmentState();
    const vertexShader = createMeshVertexShaderModule(mesh);
    const vertexBindGroupLayout = resourceManager.getGPUBindGroupLayout(mesh.animationInfo.skinInfo ? ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_SKIN : ResourceManager.PRESET_VERTEX_GPUBindGroupLayout);
    gpuRenderInfo.vertexShaderModule = vertexShader;
    gpuRenderInfo.pipeline = createBasePipeline(mesh, vertexShader, vertexBindGroupLayout);
    gpuRenderInfo.shadowPipeline = null;
    gpuRenderInfo.pickingPipeline = null;
    const { vertexUniformInfo } = mesh.gpuRenderInfo;
    const { members } = vertexUniformInfo;
    for (const k in members) {
        if (k !== 'pickingId')
            mesh[k] = mesh[k];
    }
    if (mesh.gpuRenderInfo.vertexUniformInfo.members.pickingId) {
        mesh.gpuRenderInfo.vertexUniformBuffer.writeBuffer(mesh.gpuRenderInfo.vertexUniformInfo.members.pickingId, mesh.pickingId);
    }
    material.dirtyPipeline = false;
    mesh.dirtyPipeline = false;
    if (renderViewStateData)
        renderViewStateData.numDirtyPipelines++;
};
export default updateMeshDirtyPipeline;
