import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../resources/wgslParser/core/ShaderVariantGenerator";
/**
 * Represents information about a GPU fragment render operation.
 */
declare class FragmentGPURenderInfo {
    fragmentShaderModule: GPUShaderModule;
    fragmentShaderSourceVariant: ShaderVariantGenerator;
    fragmentShaderVariantConditionalBlocks: string[];
    fragmentUniformInfo: any;
    fragmentBindGroupLayout: GPUBindGroupLayout;
    fragmentUniformBuffer: UniformBuffer;
    fragmentUniformBindGroup: GPUBindGroup;
    fragmentState: GPUFragmentState;
    constructor(fragmentShaderModule: GPUShaderModule, fragmentShaderSourceVariant: ShaderVariantGenerator, fragmentShaderVariantConditionalBlocks: string[], fragmentUniformInfo: any, fragmentBindGroupLayout: GPUBindGroupLayout, fragmentUniformBuffer: UniformBuffer, fragmentUniformBindGroup?: GPUBindGroup, fragmentState?: GPUFragmentState);
}
export default FragmentGPURenderInfo;
