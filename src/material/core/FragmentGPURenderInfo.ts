import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../resources/wgslParser/core/ShaderVariantGenerator";

/**
 * [KO] GPU 프래그먼트 렌더링 작업에 대한 정보를 나타냅니다.
 * [EN] Represents information about a GPU fragment render operation.
 *
 * ### Example
 * ```typescript
 * // 시스템 내부적으로 머티리얼의 렌더링 정보를 저장하는 데 사용됩니다.
 * // Used internally by the system to store rendering information for materials.
 * ```
 * @category Material
 */
class FragmentGPURenderInfo {
    fragmentShaderModule: GPUShaderModule;
    fragmentShaderSourceVariant: ShaderVariantGenerator;
    fragmentShaderVariantConditionalBlocks: string[];
    fragmentUniformInfo: any;
    fragmentBindGroupLayout: GPUBindGroupLayout;
    fragmentUniformBuffer: UniformBuffer;
    fragmentUniformBindGroup: GPUBindGroup;
    fragmentState: GPUFragmentState;

    constructor(
        fragmentShaderModule: GPUShaderModule,
        fragmentShaderSourceVariant: ShaderVariantGenerator,
        fragmentShaderVariantConditionalBlocks: string[],
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
