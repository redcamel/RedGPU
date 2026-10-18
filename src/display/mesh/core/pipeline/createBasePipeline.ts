import GPU_COMPARE_FUNCTION from "../../../../gpuConst/GPU_COMPARE_FUNCTION";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import Mesh from "../../Mesh";
import PIPELINE_TYPE from "./PIPELINE_TYPE";

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
const createBasePipeline = (
    mesh: Mesh,
    module: GPUShaderModule,
    vertexBindGroupLayout: GPUBindGroupLayout,
    pipelineType?: string,
): GPURenderPipeline => {
    const {redGPUContext} = mesh
    const {gpuDevice, resourceManager} = redGPUContext
    const material_gpuRenderInfo = mesh.material.gpuRenderInfo
    let entryPoint: string;
    let pipelineLabel: string;
    switch (pipelineType) {
        case PIPELINE_TYPE.SHADOW :
            entryPoint = 'entryPointShadowVertex'
            pipelineLabel = `${module.label}_shadow_pipeline`
            break
        case PIPELINE_TYPE.PICKING :
            entryPoint = 'entryPointPickingVertex'
            pipelineLabel = `${module.label}_picking_pipeline`
            break
        default :
            entryPoint = 'main'
            pipelineLabel = `${module.label}_pipeline`
    }
    const vertexState: GPUVertexState = {
        module,
        entryPoint,
        buffers: mesh.vertexStateBuffers
    }
    const bindGroupLayouts: GPUBindGroupLayout[] = [
        resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
        vertexBindGroupLayout
    ]
    if (pipelineType !== PIPELINE_TYPE.SHADOW) bindGroupLayouts.push(material_gpuRenderInfo.fragmentBindGroupLayout)
    const pipelineLayoutDescriptor: GPUPipelineLayoutDescriptor = {
        bindGroupLayouts,
        label: `${pipelineLabel}_${material_gpuRenderInfo.fragmentBindGroupLayout.label}`
    }
    const pipelineLayout: GPUPipelineLayout = resourceManager.createGPUPipelineLayout(`${pipelineLayoutDescriptor.label}`, pipelineLayoutDescriptor);
    const pipelineDescriptor: GPURenderPipelineDescriptor = {
        label: pipelineLabel,
        layout: pipelineLayout,
        vertex: vertexState,
        primitive: mesh.primitiveState.state,
    }
    switch (pipelineType) {
        case PIPELINE_TYPE.SHADOW :
            pipelineDescriptor.depthStencil = {
                depthWriteEnabled: true,
                depthCompare: GPU_COMPARE_FUNCTION.LESS_EQUAL,
                format: 'depth32float',
            }
            break
        case PIPELINE_TYPE.PICKING :
            if (mesh.material) {
                pipelineDescriptor.fragment = {
                    module: mesh.material.gpuRenderInfo.fragmentShaderModule,
                    entryPoint: 'entryPointPickingFragment',
                    targets: [
                        {
                            format: navigator.gpu.getPreferredCanvasFormat(),
                        }
                    ]
                }
                pipelineDescriptor.depthStencil = mesh.depthStencilState.state
            }
            break
        default :
            pipelineDescriptor.fragment = material_gpuRenderInfo.fragmentState
            pipelineDescriptor.depthStencil = mesh.depthStencilState.state
            pipelineDescriptor.multisample = {
                count: redGPUContext.antialiasingManager.useMSAA ? 4 : 1,
            }
    }
    return gpuDevice.createRenderPipeline(pipelineDescriptor)
}
export default createBasePipeline
