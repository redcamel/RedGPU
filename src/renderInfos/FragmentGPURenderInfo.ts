import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";

/**
 * Represents information about a GPU fragment render operation.
 */
class FragmentGPURenderInfo {
	fragmentShaderModule: GPUShaderModule;
	fragmentShaderSourceVariant:Record<string, string>;
	fragmentShaderVariantConditionalBlocks:string[];
	fragmentUniformInfo: any;
	fragmentBindGroupLayout: GPUBindGroupLayout;
	fragmentUniformBuffer: UniformBuffer;
	fragmentUniformBindGroup: GPUBindGroup;
	fragmentState: GPUFragmentState;

	constructor(
		fragmentShaderModule: GPUShaderModule,
		fragmentShaderSourceVariant:Record<string, string>,
		fragmentShaderVariantConditionalBlocks:string[],
		fragmentUniformInfo: any,
		fragmentBindGroupLayout: GPUBindGroupLayout,
		fragmentUniformBuffer: UniformBuffer,
		fragmentUniformBindGroup?: GPUBindGroup,
		fragmentState?: GPUFragmentState
	) {
		this.fragmentShaderModule = fragmentShaderModule;
		this.fragmentShaderSourceVariant = fragmentShaderSourceVariant;
		this.fragmentShaderVariantConditionalBlocks = fragmentShaderVariantConditionalBlocks;
		this.fragmentUniformInfo = fragmentUniformInfo;
		this.fragmentBindGroupLayout = fragmentBindGroupLayout;
		this.fragmentUniformBuffer = fragmentUniformBuffer;
		this.fragmentUniformBindGroup = fragmentUniformBindGroup;
		this.fragmentState = fragmentState;
	}
}

Object.freeze(FragmentGPURenderInfo)
export default FragmentGPURenderInfo
