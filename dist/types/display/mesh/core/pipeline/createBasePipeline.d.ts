import Mesh from "../../Mesh";
/**
 * [KO] 메시 렌더링을 위한 기본 GPURenderPipeline을 생성합니다.
 * [EN] Creates a base GPURenderPipeline for mesh rendering.
 *
 * ::: warning
 * [KO] 이 함수는 시스템에 의해 내부적으로 호출됩니다.<br/>직접 호출하지 마십시오.
 * [EN] This function is called internally by the system.<br/>Do not call it directly.
 * :::
 *
 * @param mesh -
 * [KO] 대상 Mesh 인스턴스
 * [EN] Target Mesh instance
 * @param module -
 * [KO] 버텍스 GPUShaderModule
 * [EN] Vertex GPUShaderModule
 * @param vertexBindGroupLayout -
 * [KO] 버텍스 GPUBindGroupLayout
 * [EN] Vertex GPUBindGroupLayout
 * @param pipelineType -
 * [KO] 파이프라인 타입 (`PIPELINE_TYPE.SHADOW`, `PIPELINE_TYPE.PICKING`, 또는 기본값)
 * [EN] Pipeline type (`PIPELINE_TYPE.SHADOW`, `PIPELINE_TYPE.PICKING`, or default)
 * @returns
 * [KO] 생성된 GPURenderPipeline 인스턴스
 * [EN] Created GPURenderPipeline instance
 * @category Core
 */
declare const createBasePipeline: (mesh: Mesh, module: GPUShaderModule, vertexBindGroupLayout: GPUBindGroupLayout, pipelineType?: string) => GPURenderPipeline;
export default createBasePipeline;
