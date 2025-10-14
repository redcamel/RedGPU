class VertexGPURenderInfo {
    vertexShaderModule;
    vertexShaderSourceVariant;
    vertexShaderVariantConditionalBlocks;
    vertexStructInfo;
    vertexUniformInfo;
    vertexBindGroupLayout;
    vertexUniformBindGroup;
    vertexUniformBuffer;
    pipeline;
    shadowPipeline;
    pickingPipeline;
    constructor(vertexShaderModule, vertexShaderSourceVariant, vertexShaderVariantConditionalBlocks, vertexUniformInfo, vertexBindGroupLayout, vertexUniformBuffer, vertexUniformBindGroup, pipeline, shadowPipeline, pickingPipeline) {
        this.vertexShaderModule = vertexShaderModule;
        this.vertexShaderSourceVariant = vertexShaderSourceVariant;
        this.vertexShaderVariantConditionalBlocks = vertexShaderVariantConditionalBlocks;
        this.vertexUniformInfo = vertexUniformInfo;
        this.vertexBindGroupLayout = vertexBindGroupLayout;
        this.vertexUniformBindGroup = vertexUniformBindGroup;
        this.vertexUniformBuffer = vertexUniformBuffer;
        this.pipeline = pipeline;
        this.shadowPipeline = shadowPipeline;
        this.pickingPipeline = pickingPipeline;
    }
}
Object.freeze(VertexGPURenderInfo);
export default VertexGPURenderInfo;
