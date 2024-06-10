import RedGPUContext from "../../context/RedGPUContext";

class MeshPipeline {
	#gpuPipeline: GPURenderPipeline

	constructor(redGPUContext: RedGPUContext, mesh, targetSystemUniformsBindGroupLayout: GPUBindGroupLayout) {
		const gpuDevice = redGPUContext.gpuDevice
		const {material, renderInfo_VertexUniformBindGroupLayout} = mesh
		const {topology, cullMode, frontFace} = mesh
		const {depthWriteEnabled, depthCompare, depthStencilFormat} = mesh
		const {renderInfo_FragmentUniformsBindGroupLayout} = material
		// 유니폼이 어떻게 바인딩 되어있는지 알려주는 파이프라인 레이아웃을 생성함
		// console.log(renderInfo_VertexUniformBindGroupLayout, renderInfo_FragmentUniformsBindGroupLayout)
		const gpuPipeline_Layout = gpuDevice.createPipelineLayout({
			// maxBindGroups의 영향을 받는다
			bindGroupLayouts: [
				targetSystemUniformsBindGroupLayout,
				renderInfo_VertexUniformBindGroupLayout,
				renderInfo_FragmentUniformsBindGroupLayout
			]
		})
		const gpuPipeline_Vertex = {
			module: material.vShaderModule,
			entryPoint: 'main',
			buffers: mesh.renderInfo_pipeline_VertexBuffersInfo // maxVertexBuffer에 영향을 받는다.
		}
		const pipeLineDescriptor: GPURenderPipelineDescriptor = {
			layout: gpuPipeline_Layout,
			vertex: gpuPipeline_Vertex,
			fragment: material.renderInfo_pipeline_Fragment,
			multisample: {
				count: redGPUContext.useMultiSample ? 4 : 1
			},
			//TODO 여기서 결국 관리해야함
			primitive: {
				topology,
				cullMode,
				frontFace,
			},
			depthStencil: {
				depthWriteEnabled,
				depthCompare,
				format: depthStencilFormat,
			}
		}
		// 실제로 GPU에 들어갈 파이프 라인을 만듬
		// 이를 토대로 그리기명령을 실행함
		this.#gpuPipeline = gpuDevice.createRenderPipeline(pipeLineDescriptor);
		// // console.log(this)
	}

	get gpuPipeline(): GPURenderPipeline {
		return this.#gpuPipeline;
	}
}

export default MeshPipeline
