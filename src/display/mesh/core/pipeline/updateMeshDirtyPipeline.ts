import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import Mesh from "../../Mesh";
import createMeshVertexShaderModule from "../shader/createMeshVertexShaderModule";
import createBasePipeline from "./createBasePipeline";

/**
 * [KO] 메시의 변경된 파이프라인 상태와 버텍스 셰이더 모듈을 갱신합니다.
 * [EN] Updates the dirty pipeline state and vertex shader module of a mesh.
 *
 * ::: warning
 * [KO] 이 함수는 시스템에 의해 내부적으로 호출됩니다.<br/>직접 호출하지 마십시오.
 * [EN] This function is called internally by the system.<br/>Do not call it directly.
 * :::
 *
 * @param mesh -
 * [KO] 파이프라인을 갱신할 대상 Mesh 인스턴스
 * [EN] Target Mesh instance to update the pipeline for
 * @param renderViewStateData -
 * [KO] 현재 렌더링 뷰 상태 데이터 (선택)
 * [EN] Current render view state data (optional)
 * @category Core
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
    // @ts-ignore
    const vertexBindGroupLayout: GPUBindGroupLayout = mesh.customVertexBindGroupLayout || resourceManager.getGPUBindGroupLayout(
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

    mesh.redGPUContext.globalVertexSSBO.updateUintData(
        mesh.globalVertexSlotIndex,
        new Uint32Array([mesh.pickingId]),
        resourceManager.GLOBAL_VERTEX_STRUCT.members.pickingId.uniformOffset / 4
    )
    material.dirtyPipeline = false
    mesh.dirtyPipeline = false
    if (renderViewStateData) renderViewStateData.renderResults.numDirtyPipelines++
}
export default updateMeshDirtyPipeline
