import GPU_COMPARE_FUNCTION from "../../../../gpuConst/GPU_COMPARE_FUNCTION";
import ResourceManager from "../../../../resources/resourceManager/ResourceManager";
import {keepLog} from "../../../../utils";
import Mesh from "../../Mesh";
import PIPELINE_TYPE from "./PIPELINE_TYPE";

const createBasePipeline = (
	mesh: Mesh,
	module: GPUShaderModule,
	vertexBindGroupLayout: GPUBindGroupLayout,
	pipelineType?: string,
): GPURenderPipeline => {
	// 메쉬에서 GPU 리소스 관리자와 GPU 디바이스를 가져옵니다.
	const {redGPUContext} = mesh
	const {gpuDevice} = redGPUContext
	const material_gpuRenderInfo = mesh.material.gpuRenderInfo
	let entryPoint: string;
	let pipelineLabel: string;
	module = mesh.gpuRenderInfo.vertexShaderModule
	switch (pipelineType) {
		case PIPELINE_TYPE.SHADOW :
			entryPoint = 'drawDirectionalShadowDepth'
			pipelineLabel = `${module.label}_shadow_pipelineDescriptor`
			break
		case PIPELINE_TYPE.PICKING :
			entryPoint = 'picking'
			pipelineLabel = `${module.label}_picking_pipelineDescriptor`
			break
		default :
			entryPoint = 'main'
			pipelineLabel = `${module.label}_pipelineDescriptor`
	}
	// 셰이더 모듈 설명자를 생성합니다.
	const vertexState: GPUVertexState = {
		module,
		entryPoint,
		buffers: mesh.vertexStateBuffers
	}
	// BindGroup 레이아웃을 가져온다
	const bindGroupLayouts: GPUBindGroupLayout[] = [
		redGPUContext.resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
		vertexBindGroupLayout
	]
	if (pipelineType !== PIPELINE_TYPE.SHADOW) bindGroupLayouts.push(material_gpuRenderInfo.fragmentBindGroupLayout)
	const pipelineLayoutDescriptor: GPUPipelineLayoutDescriptor = {bindGroupLayouts}
	const pipelineLayout: GPUPipelineLayout = gpuDevice.createPipelineLayout(pipelineLayoutDescriptor);
	const pipelineDescriptor: GPURenderPipelineDescriptor = {
		label: pipelineLabel,
		layout: pipelineLayout,
		vertex: vertexState,
		primitive: mesh.primitiveState.state,
	}
	switch (pipelineType) {
		case PIPELINE_TYPE.SHADOW :
			pipelineDescriptor.depthStencil = {
				depthWriteEnabled: true,
				depthCompare: GPU_COMPARE_FUNCTION.LESS_EQUAL,
				format: 'depth32float',
			}
			break
		case PIPELINE_TYPE.PICKING :
			if (mesh.material) {
				pipelineDescriptor.fragment = {
					module: mesh.material.gpuRenderInfo.fragmentShaderModule,
					entryPoint: 'picking',
					targets: [
						{
							format: navigator.gpu.getPreferredCanvasFormat(),
						}
					]
				}
				pipelineDescriptor.depthStencil = mesh.depthStencilState.state
			}
			break
		default :
			pipelineDescriptor.fragment = material_gpuRenderInfo.fragmentState
			pipelineDescriptor.depthStencil = mesh.depthStencilState.state
			pipelineDescriptor.multisample = {
				count: redGPUContext.antialiasingManager.useMSAA ? 4 : 1,
			}
	}
	return gpuDevice.createRenderPipeline(pipelineDescriptor)
}
export default createBasePipeline
