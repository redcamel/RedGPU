import RenderViewStateData from "../../RenderViewStateData";
import createBasePipeline from "../../../display/mesh/core/pipeline/createBasePipeline";
import PIPELINE_TYPE from "../../../display/mesh/core/pipeline/PIPELINE_TYPE";

const renderListForLayer = (list, debugViewRenderState: RenderViewStateData, pipelineKey: string = 'pipeline') => {
	let i = 0
	const len = list.length;
	const {
		currentRenderPassEncoder,
	} = debugViewRenderState
	for (i; i < len; i++) {
		const target = list[i]
		if (target.gpuRenderInfo) {
			const currentGeometry = target._geometry
			const currentMaterial = target._material
			// render
			if (currentGeometry) debugViewRenderState.num3DObjects++
			else debugViewRenderState.num3DGroups++
			const {gpuRenderInfo} = target
			const {vertexUniformBindGroup} = gpuRenderInfo
			if(!gpuRenderInfo[pipelineKey]){
				if(pipelineKey === 'shadowPipeline'){
					gpuRenderInfo.shadowPipeline = target.gpuRenderInfo.vertexStructInfo.vertexEntries.includes('drawDirectionalShadowDepth') ? createBasePipeline(target, target.gpuRenderInfo.vertexShaderModule, target.gpuRenderInfo.vertexBindGroupLayout, PIPELINE_TYPE.SHADOW) : null
				}else if(pipelineKey === 'pickingPipeline'){
					gpuRenderInfo.pickingPipeline =  target.gpuRenderInfo.vertexStructInfo.vertexEntries.includes('picking') ? createBasePipeline(target, target.gpuRenderInfo.vertexShaderModule, target.gpuRenderInfo.vertexBindGroupLayout, PIPELINE_TYPE.PICKING) : null
				}
			}
			if (currentGeometry && gpuRenderInfo[pipelineKey]) {
				currentRenderPassEncoder.setPipeline(gpuRenderInfo[pipelineKey])
				const {gpuBuffer} = currentGeometry.vertexBuffer
				const {fragmentUniformBindGroup} = currentMaterial.gpuRenderInfo
				if (debugViewRenderState.prevVertexGpuBuffer !== gpuBuffer) {
					currentRenderPassEncoder.setVertexBuffer(0, gpuBuffer)
					debugViewRenderState.prevVertexGpuBuffer = gpuBuffer
					if (target.particleBuffers) {
						target.particleBuffers.forEach((v, index) => {
							currentRenderPassEncoder.setVertexBuffer(index + 1, v)
						})
						debugViewRenderState.prevVertexGpuBuffer = null
					}
				}
				currentRenderPassEncoder.setBindGroup(1, vertexUniformBindGroup); // 버텍스 유니폼 버퍼 1번 고정
				if (debugViewRenderState.prevFragmentUniformBindGroup !== fragmentUniformBindGroup) {
					currentRenderPassEncoder.setBindGroup(2, fragmentUniformBindGroup)
					debugViewRenderState.prevFragmentUniformBindGroup = fragmentUniformBindGroup
				}
				//
				debugViewRenderState.numDrawCalls++
				//
				if (currentGeometry.indexBuffer) {
					const {indexBuffer} = currentGeometry
					const {indexNum, triangleCount, gpuBuffer: indexGPUBuffer} = indexBuffer
					currentRenderPassEncoder.setIndexBuffer(indexGPUBuffer, 'uint32')
					// @ts-ignore
					if (target.particleBuffers) currentRenderPassEncoder.drawIndexed(indexNum, target.particleNum, 0, 0, 0);
					else currentRenderPassEncoder.drawIndexed(indexNum, 1, 0, 0, 0);
					debugViewRenderState.numTriangles += triangleCount
					debugViewRenderState.numPoints += indexNum
				} else {
					const {vertexBuffer} = currentGeometry
					const {vertexCount, triangleCount} = vertexBuffer
					currentRenderPassEncoder.draw(vertexCount, 1, 0, 0);
					debugViewRenderState.numTriangles += triangleCount;
					debugViewRenderState.numPoints += vertexCount
				}
			}
		}
	}
	debugViewRenderState.prevVertexGpuBuffer = null
	debugViewRenderState.prevFragmentUniformBindGroup = null
	debugViewRenderState.prevVertexGpuBuffer = null
}
export default renderListForLayer
