import RenderViewStateData from "../../../display/view/core/RenderViewStateData";

/**
 * [KO] 지정된 렌더 레이어의 객체 목록을 순회하며 드로우 콜을 수행합니다.
 * [EN] Iterates through the object list of the specified render layer and executes draw calls.
 *
 * @param list -
 * [KO] 렌더링할 객체 배열
 * [EN] Array of objects to render
 * @param renderViewStateData -
 * [KO] 현재 뷰의 렌더링 상태 데이터
 * [EN] Render state data of the current view
 * @param pipelineKey -
 * [KO] 사용할 렌더 파이프라인 프로퍼티 키 (기본값: `'pipeline'`)
 * [EN] Property key of the render pipeline to use (default: `'pipeline'`)
 * @category Renderer
 */
const renderListForLayer = (list, renderViewStateData: RenderViewStateData, pipelineKey: string = 'pipeline') => {
    let i = 0
    const len = list.length;
    const {
        currentRenderPassEncoder,
        renderResults
    } = renderViewStateData
    currentRenderPassEncoder.setBindGroup(0, renderViewStateData.view.systemUniform_Vertex_UniformBindGroup)
    for (i; i < len; i++) {
        const target = list[i]
        if (target.passFrustumCulling && target.gpuRenderInfo) {
            const currentGeometry = target._geometry
            const currentMaterial = target._material
            if (currentGeometry) renderResults.num3DObjects++
            else renderResults.num3DGroups++
            const {gpuRenderInfo} = target
            const {vertexUniformBindGroup} = gpuRenderInfo

            if (currentGeometry && gpuRenderInfo[pipelineKey]) {
                currentRenderPassEncoder.setPipeline(gpuRenderInfo[pipelineKey])
                const {gpuBuffer} = currentGeometry.vertexBuffer
                const {fragmentUniformBindGroup} = currentMaterial.gpuRenderInfo
                currentRenderPassEncoder.setVertexBuffer(0, gpuBuffer)
                currentRenderPassEncoder.setBindGroup(1, vertexUniformBindGroup);
                currentRenderPassEncoder.setBindGroup(2, fragmentUniformBindGroup)
                renderResults.numDrawCalls++
                if (currentGeometry.indexBuffer) {
                    const {indexBuffer} = currentGeometry
                    const {indexCount, triangleCount, gpuBuffer: indexGPUBuffer, format} = indexBuffer
                    currentRenderPassEncoder.setIndexBuffer(indexGPUBuffer, format)
                    currentRenderPassEncoder.drawIndexed(indexCount, 1, 0, 0, target.globalVertexSlotIndex);
                    renderResults.numTriangles += triangleCount
                    renderResults.numPoints += indexCount
                } else {
                    const {vertexBuffer} = currentGeometry
                    const {vertexCount, triangleCount} = vertexBuffer
                    currentRenderPassEncoder.draw(vertexCount, 1, 0, target.globalVertexSlotIndex);
                    renderResults.numTriangles += triangleCount;
                    renderResults.numPoints += vertexCount
                }
            }
        }
    }
}
export default renderListForLayer
