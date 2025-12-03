import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import PassLightClustersSource from "./PassClustersLight.wgsl";
import PassClustersLightHelper from "./PassClustersLightHelper";

const emptyArray = new Uint32Array([0, 0, 0, 0]);

class PassClustersLight {
    #view: View3D
    #clusterLightBindGroup: GPUBindGroup
    #clusterLightPipeline: GPUComputePipeline
    #clusterLightsBuffer: GPUBuffer
    readonly #redGPUContext: RedGPUContext

    constructor(redGPUContext: RedGPUContext, view: View3D,) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#view = view;
        this.#initPipeLine();
        console.log(this);
    }

    // Getter method for clusterLightsBuffer
    get clusterLightsBuffer(): GPUBuffer {
        return this.#clusterLightsBuffer;
    }

    render() {
        const {gpuDevice} = this.#redGPUContext
        const systemUniformBindGroup: GPUBindGroup = this.#view.systemUniform_Vertex_UniformBindGroup;
        if (systemUniformBindGroup) {
            const commandEncoder = gpuDevice.createCommandEncoder();
            const passEncoder = commandEncoder.beginComputePass({
                label: 'ClusterLight cluster'
            });
            const DISPATCH_SIZE = PassClustersLightHelper.getDispatchSize();
            this.#redGPUContext.gpuDevice.queue.writeBuffer(this.clusterLightsBuffer, 0, emptyArray);
            passEncoder.setPipeline(this.#clusterLightPipeline);
            passEncoder.setBindGroup(0, systemUniformBindGroup);
            passEncoder.setBindGroup(1, this.#clusterLightBindGroup);
            passEncoder.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);
            passEncoder.end();
            gpuDevice.queue.submit([commandEncoder.finish()]);
        }
    }

    #initPipeLine() {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
        const source = parseWGSL(PassLightClustersSource).defaultSource;
        this.#clusterLightsBuffer = resourceManager.createGPUBuffer(`PASS_CLUSTER_LIGHTS_BUFFER`, {
            size: PassClustersLightHelper.getClusterLightsBufferSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        const clusterLightBindGroupLayout = gpuDevice.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'read-only-storage'}
                }
            ]
        });
        this.#clusterLightBindGroup = gpuDevice.createBindGroup({
            label: 'CLUSTER_LIGHT_BIND_GROUP',
            layout: clusterLightBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#view.passLightClustersBound.clusterBoundBuffer
                    }
                }
            ]
        });
        this.#clusterLightPipeline = gpuDevice.createComputePipeline({
            label: 'CLUSTER_LIGHT_PIPELINE',
            layout: gpuDevice.createPipelineLayout({
                label: 'CLUSTER_LIGHT_PIPELINE_LAYOUT',
                bindGroupLayouts: [
                    resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
                    clusterLightBindGroupLayout
                ]
            }),
            compute: {
                module: resourceManager.createGPUShaderModule('CLUSTER_LIGHTS_SHADER', {
                    code: source,
                }),
                entryPoint: 'main'
            }
        });
    }
}

export default PassClustersLight;
