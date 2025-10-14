/**
 * Represents information about a GPU fragment render operation.
 */
class FragmentGPURenderInfo {
    fragmentShaderModule;
    fragmentShaderSourceVariant;
    fragmentShaderVariantConditionalBlocks;
    fragmentUniformInfo;
    fragmentBindGroupLayout;
    fragmentUniformBuffer;
    fragmentUniformBindGroup;
    fragmentState;
    constructor(fragmentShaderModule, fragmentShaderSourceVariant, fragmentShaderVariantConditionalBlocks, fragmentUniformInfo, fragmentBindGroupLayout, fragmentUniformBuffer, fragmentUniformBindGroup, fragmentState) {
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
Object.freeze(FragmentGPURenderInfo);
export default FragmentGPURenderInfo;
