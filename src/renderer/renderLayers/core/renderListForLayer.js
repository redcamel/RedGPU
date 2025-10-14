import createBasePipeline from "../../../display/mesh/core/pipeline/createBasePipeline";
import PIPELINE_TYPE from "../../../display/mesh/core/pipeline/PIPELINE_TYPE";
const renderListForLayer = (list, renderViewStateData, pipelineKey = 'pipeline') => {
    let i = 0;
    const len = list.length;
    const { currentRenderPassEncoder, } = renderViewStateData;
    currentRenderPassEncoder.setBindGroup(0, renderViewStateData.view.systemUniform_Vertex_UniformBindGroup);
    for (i; i < len; i++) {
        const target = list[i];
        if (target.gpuRenderInfo) {
            const currentGeometry = target._geometry;
            const currentMaterial = target._material;
            // render
            if (currentGeometry)
                renderViewStateData.num3DObjects++;
            else
                renderViewStateData.num3DGroups++;
            const { gpuRenderInfo } = target;
            const { vertexUniformBindGroup } = gpuRenderInfo;
            if (!gpuRenderInfo[pipelineKey]) {
                if (pipelineKey === 'shadowPipeline') {
                    gpuRenderInfo.shadowPipeline = target.gpuRenderInfo.vertexStructInfo.vertexEntries.includes('drawDirectionalShadowDepth') ? createBasePipeline(target, target.gpuRenderInfo.vertexShaderModule, target.gpuRenderInfo.vertexBindGroupLayout, PIPELINE_TYPE.SHADOW) : null;
                }
                else if (pipelineKey === 'pickingPipeline') {
                    gpuRenderInfo.pickingPipeline = target.gpuRenderInfo.vertexStructInfo.vertexEntries.includes('picking') ? createBasePipeline(target, target.gpuRenderInfo.vertexShaderModule, target.gpuRenderInfo.vertexBindGroupLayout, PIPELINE_TYPE.PICKING) : null;
                }
            }
            if (currentGeometry && gpuRenderInfo[pipelineKey]) {
                currentRenderPassEncoder.setPipeline(gpuRenderInfo[pipelineKey]);
                const { gpuBuffer } = currentGeometry.vertexBuffer;
                const { fragmentUniformBindGroup } = currentMaterial.gpuRenderInfo;
                if (renderViewStateData.prevVertexGpuBuffer !== gpuBuffer) {
                    currentRenderPassEncoder.setVertexBuffer(0, gpuBuffer);
                    renderViewStateData.prevVertexGpuBuffer = gpuBuffer;
                }
                currentRenderPassEncoder.setBindGroup(1, vertexUniformBindGroup);
                if (renderViewStateData.prevFragmentUniformBindGroup !== fragmentUniformBindGroup) {
                    currentRenderPassEncoder.setBindGroup(2, fragmentUniformBindGroup);
                    renderViewStateData.prevFragmentUniformBindGroup = fragmentUniformBindGroup;
                }
                //
                renderViewStateData.numDrawCalls++;
                //
                if (currentGeometry.indexBuffer) {
                    const { indexBuffer } = currentGeometry;
                    const { indexCount, triangleCount, gpuBuffer: indexGPUBuffer, format } = indexBuffer;
                    currentRenderPassEncoder.setIndexBuffer(indexGPUBuffer, format);
                    currentRenderPassEncoder.drawIndexed(indexCount, 1, 0, 0, 0);
                    renderViewStateData.numTriangles += triangleCount;
                    renderViewStateData.numPoints += indexCount;
                }
                else {
                    const { vertexBuffer } = currentGeometry;
                    const { vertexCount, triangleCount } = vertexBuffer;
                    currentRenderPassEncoder.draw(vertexCount, 1, 0, 0);
                    renderViewStateData.numTriangles += triangleCount;
                    renderViewStateData.numPoints += vertexCount;
                }
            }
        }
    }
    renderViewStateData.prevVertexGpuBuffer = null;
    renderViewStateData.prevFragmentUniformBindGroup = null;
    renderViewStateData.prevVertexGpuBuffer = null;
};
export default renderListForLayer;
