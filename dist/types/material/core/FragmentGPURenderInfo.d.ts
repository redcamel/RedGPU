import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../resources/wgslParser/core/ShaderVariantGenerator";
/**
 * [KO] GPU 프래그먼트 렌더링 작업에 대한 정보를 나타냅니다.
 * [EN] Represents information about a GPU fragment render operation.
 * @category Material
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
