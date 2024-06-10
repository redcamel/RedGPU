import RedGPUContext from "../context/RedGPUContext";
import RedGPUContextBase from "../context/RedGPUContextBase";
import UniformBufferDescriptor from "../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import UniformBufferFloat32 from "../resource/buffers/uniformBuffer/UniformBufferFloat32";
import makeShaderModule from "../resource/makeShaderModule";
import makeUUID from "../util/makeUUID";

class BaseMaterial extends RedGPUContextBase {
	#vShaderModule
	#fShaderModule
	#fragmentUniformBuffer: UniformBufferFloat32
	//////////////////////////
	#renderInfo_FragmentUniformBindGroup: GPUBindGroup
	#renderInfo_pipeline_Fragment: GPUFragmentState
	#renderInfo_FragmentUniformBindGroupDescriptor: GPUBindGroupDescriptor
	#renderInfo_FragmentUniformsBindGroupLayout: GPUBindGroupLayout
	//////////////////////////
	#bindGroupID = makeUUID()
	#dirtyTexture: boolean = true

	/**
	 *
	 * @param redGPUContext
	 * @param vertexSource
	 * @param fragmentSource
	 * @param fragmentUniformBufferDescriptor
	 * @param fragmentUniformBindGroupLayoutDescriptor
	 */
	constructor(
		redGPUContext: RedGPUContext,
		vertexSource: string, fragmentSource: string,
		fragmentUniformBufferDescriptor,
		fragmentUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor
	) {
		super(redGPUContext)
		const gpuDevice = this.redGPUContext.gpuDevice
		this.#vShaderModule = makeShaderModule(gpuDevice, vertexSource, `vertex_${this.constructor.name}`)
		this.#fShaderModule = makeShaderModule(gpuDevice, fragmentSource, `fragment_${this.constructor.name}`)
		this.#fragmentUniformBuffer = new UniformBufferFloat32(this.redGPUContext, new UniformBufferDescriptor(fragmentUniformBufferDescriptor))
		// console.log(this,this.#fragmentUniformBuffer)
		this.#updateRenderInfo_FragmentUniformsBindGroupLayout(fragmentUniformBindGroupLayoutDescriptor)
		// console.log(this)
	}

	get vShaderModule() {
		return this.#vShaderModule;
	}

	get fShaderModule() {
		return this.#fShaderModule;
	}

	get fragmentUniformBuffer(): UniformBufferFloat32 {
		return this.#fragmentUniformBuffer;
	}

	get renderInfo_FragmentUniformBindGroup(): GPUBindGroup {
		return this.#renderInfo_FragmentUniformBindGroup;
	}

	get renderInfo_pipeline_Fragment(): GPUFragmentState {
		return this.#renderInfo_pipeline_Fragment;
	}

	get renderInfo_FragmentUniformsBindGroupLayout(): GPUBindGroupLayout {
		return this.#renderInfo_FragmentUniformsBindGroupLayout;
	}

	get bindGroupID() {
		return this.#bindGroupID;
	}

	set bindGroupID(value) {
		this.#bindGroupID = value;
	}

	get dirtyTexture(): boolean {
		return this.#dirtyTexture;
	}

	set dirtyTexture(value: boolean) {
		this.#dirtyTexture = value;
	}

	updateRenderInfo_pipeline_Fragment() {
		// TODO 속성이 변경되면 아래 정보가 변경되니 업데이트 해줘야함
		const preferredCanvasFormat = navigator.gpu.getPreferredCanvasFormat()
		this.#renderInfo_pipeline_Fragment = {
			module: this.fShaderModule,
			entryPoint: 'main',
			targets: [
				{
					format: preferredCanvasFormat,
					blend: {
						color: {
							srcFactor: "src-alpha",
							dstFactor: "one-minus-src-alpha",
							operation: "add"
						},
						alpha: {
							srcFactor: "one",
							dstFactor: "one-minus-src-alpha",
							operation: "add"
						}
					}
				},
			],
		}
	}

	updateFragmentUniformBindGroup(renderInfo_FragmentUniformBindGroupDescriptor: GPUBindGroupDescriptor) {
		const gpuDevice = this.redGPUContext.gpuDevice
		// 유니폼 바인딩 레이아웃에 맞는 디스크립터를 생성한다.
		// console.log(renderInfo_FragmentUniformBindGroupDescriptor)
		this.#renderInfo_FragmentUniformBindGroupDescriptor = renderInfo_FragmentUniformBindGroupDescriptor
		// 재질 유니폼
		this.#renderInfo_FragmentUniformBindGroup = gpuDevice.createBindGroup(this.#renderInfo_FragmentUniformBindGroupDescriptor);
	}

	updateBindGroup() {
		throw 'updateBindGroup 재정의해야함'
	}

	initUniformValue() {
		throw 'initUniformValue 재정의해야함'
	}

	#updateRenderInfo_FragmentUniformsBindGroupLayout(fragmentUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor) {
		const gpuDevice = this.redGPUContext.gpuDevice
		this.#renderInfo_FragmentUniformsBindGroupLayout = gpuDevice.createBindGroupLayout(fragmentUniformBindGroupLayoutDescriptor);
		this.updateRenderInfo_pipeline_Fragment()
	}
}

export default BaseMaterial

