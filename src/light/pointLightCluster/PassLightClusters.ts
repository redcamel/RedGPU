import RedGPUContextBase from "../../context/RedGPUContextBase";
import RedGPUContext from "../../context/RedGPUContext";
import PassLightClustersSource from "./PassLightClusters.wgsl";
import PassLightClustersBound from "./PassLightClustersBound";
import UniformBufferFloat32 from "../../resource/buffers/uniformBuffer/UniformBufferFloat32";
import PassLightClustersHelper from "./PassLightClustersHelper";
import shaderDefineReplace from "../../systemShaderDefine/shaderDefineReplace";
import View from "../../main/view/View";

/**
 * 3D 클러스터 바운드를 생성하기위한 패스
 */
const emptyArray = new Uint32Array([0, 0, 0, 0]);

class PassLightClusters extends RedGPUContextBase {
    #targetView: View
    #clusterLightBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor
    #clusterLightBindGroupLayout: GPUBindGroupLayout
    #clusterLightBindGroup: GPUBindGroup
    #clusterLightPipeline: GPUComputePipeline
    #clusterLightsBuffer: GPUBuffer
    get clusterLightsBuffer(): GPUBuffer {
        return this.#clusterLightsBuffer;
    }

    #passLightClustersBound: PassLightClustersBound
    #lightInfo: UniformBufferFloat32
    #targetSystemUniformsBindGroupLayout: GPUBindGroupLayout

    constructor(redGPUContext: RedGPUContext, targetView: View) {
        super(redGPUContext)
        this.#targetView = targetView
        this.#targetSystemUniformsBindGroupLayout = targetView.systemUniformsBindGroupLayout
        this.#passLightClustersBound = targetView.passLightClustersBound
        this.#lightInfo = targetView.systemClusterLightBufferInfo
        this.#initPipeLine()
        console.log('PassLightClusters', this)
    }


    #initPipeLine() {
        const {gpuDevice} = this.redGPUContext
        const source = shaderDefineReplace(PassLightClustersSource)

        this.#clusterLightsBuffer = gpuDevice.createBuffer({
            size: PassLightClustersHelper.getClusterLightBufferSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.#clusterLightBindGroupLayoutDescriptor = {
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'storage'}
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'storage'}
                }
            ]
        }
        this.#clusterLightBindGroupLayout = gpuDevice.createBindGroupLayout(this.#clusterLightBindGroupLayoutDescriptor);
        this.#clusterLightBindGroup = gpuDevice.createBindGroup({
            layout: this.#clusterLightBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#passLightClustersBound.clusterBoundBuffer,
                    },
                },
                {
                    binding: 1,
                    resource: {
                        buffer: this.#clusterLightsBuffer,
                    },
                }
            ],
        });

        this.#clusterLightPipeline = gpuDevice.createComputePipeline({
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [
                    this.#targetSystemUniformsBindGroupLayout,
                    this.#clusterLightBindGroupLayout,
                ]
            }),
            compute: {
                module: gpuDevice.createShaderModule({
                    code: source,
                    label: "Cluster Light"
                }),
                entryPoint: 'main',
            }
        });
    }

    render(
        commandEncoder: GPUCommandEncoder,
        passEncoder: GPUComputePassEncoder
    ) {
        const systemUniformBindGroup: GPUBindGroup = this.#targetView.renderInfo_SystemUniformBindGroup
        if (systemUniformBindGroup) {

            const DISPATCH_SIZE = PassLightClustersHelper.getDispatchSize()
            this.redGPUContext.gpuDevice.queue.writeBuffer(this.clusterLightsBuffer, 0, emptyArray);
            passEncoder.setPipeline(this.#clusterLightPipeline);
            passEncoder.setBindGroup(0, systemUniformBindGroup);
            passEncoder.setBindGroup(1, this.#clusterLightBindGroup);
            passEncoder.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);
            // console.log(passEncoder)
        }


    }
}

export default PassLightClusters