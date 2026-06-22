import RenderViewStateData from "../../../display/view/core/RenderViewStateData";

const renderListForLayer = (list, renderViewStateData: RenderViewStateData, pipelineKey: string = 'pipeline') => {
    let i = 0
    const len = list.length;
    const {
        currentRenderPassEncoder,
        renderResults
    } = renderViewStateData
    //TODO - 렌더번들기반으로 이것도 옮겨야함
    currentRenderPassEncoder.setBindGroup(0, renderViewStateData.view.systemUniform_Vertex_UniformBindGroup)
    for (i; i < len; i++) {
        const target = list[i]
        if (target.passFrustumCulling && target.gpuRenderInfo) {
            const currentGeometry = target._geometry
            const currentMaterial = target._material
            // render
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
                //
                renderResults.numDrawCalls++
                //
                if (currentGeometry.indexBuffer) {
                    const {indexBuffer} = currentGeometry
                    const {indexCount, triangleCount, gpuBuffer: indexGPUBuffer, format} = indexBuffer
                    currentRenderPassEncoder.setIndexBuffer(indexGPUBuffer, format)
                    currentRenderPassEncoder.drawIndexed(indexCount, 1, 0, 0, target.globalVertexBufferSlotIndex);
                    renderResults.numTriangles += triangleCount
                    renderResults.numPoints += indexCount
                } else {
                    const {vertexBuffer} = currentGeometry
                    const {vertexCount, triangleCount} = vertexBuffer
                    currentRenderPassEncoder.draw(vertexCount, 1, 0, target.globalVertexBufferSlotIndex);
                    renderResults.numTriangles += triangleCount;
                    renderResults.numPoints += vertexCount
                }
            }
        }
    }
}
export default renderListForLayer
