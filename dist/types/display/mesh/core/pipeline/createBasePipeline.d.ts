import Mesh from "../../Mesh";
declare const createBasePipeline: (mesh: Mesh, module: GPUShaderModule, vertexBindGroupLayout: GPUBindGroupLayout, pipelineType?: string) => GPURenderPipeline;
export default createBasePipeline;
