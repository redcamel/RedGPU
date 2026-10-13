import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

abstract class AScatterCuller extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    get computePipeline(): GPUComputePipeline | null {
        return this.#computePipeline;
    }

    get bindGroupLayout(): GPUBindGroupLayout | null {
        return this.#bindGroupLayout;
    }

    destroy(): void {
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
    }

    initComputePipeline(
        shaderName: string,
        shaderSource: string,
        labelPrefix: string,
        entryPoint: string = 'main'
    ): void {
        const {resourceManager, gpuDevice} = this.redGPUContext;
        const {wgslParser} = resourceManager;
        const shaderInfo = wgslParser.parse(shaderName, shaderSource);
        const computeModule = resourceManager.getGPUShaderModule(shaderName)
            ?? resourceManager.createGPUShaderModule(shaderName, {
                code: shaderSource
            });

        const bindGroupLayoutDescriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout(`${labelPrefix}_BindGroupLayout`, {
            label: `${labelPrefix}_BindGroupLayout`,
            ...bindGroupLayoutDescriptor
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout(`${labelPrefix}_PipelineLayout`, {
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `${labelPrefix}_ComputePipeline`,
            layout: pipelineLayout,
            compute: {
                module: computeModule,
                entryPoint
            }
        });
    }

    dispatchCompute(
        computePass: GPUComputePassEncoder,
        bindGroup: GPUBindGroup,
        totalInstances: number,
        workgroupSize: number = 64
    ): void {
        if (!this.#computePipeline || totalInstances <= 0) return;
        computePass.setPipeline(this.#computePipeline);
        computePass.setBindGroup(0, bindGroup);
        const workgroupCount = Math.ceil(totalInstances / workgroupSize);
        computePass.dispatchWorkgroups(workgroupCount);
    }
}

Object.freeze(AScatterCuller);
export default AScatterCuller;

