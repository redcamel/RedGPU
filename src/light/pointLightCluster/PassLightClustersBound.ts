import RedGPUContextBase from "../../context/RedGPUContextBase";
import RedGPUContext from "../../context/RedGPUContext";
import PassLightClustersBoundSource from "./PassLightClustersBound.wgsl";
import PassLightClustersHelper from "./PassLightClustersHelper";
import shaderDefineReplace from "../../systemShaderDefine/shaderDefineReplace";
import View from "../../main/view/View";

/**
 * 3D 클러스터 바운드를 생성하기위한 패스
 */
class PassLightClustersBound extends RedGPUContextBase {
    #targetView: View
    #clusterBoundBuffer: GPUBuffer
    get clusterBoundBuffer(): GPUBuffer {
        return this.#clusterBoundBuffer;
    }

    #clusterBoundBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor
    #clusterBoundBindGroupLayout: GPUBindGroupLayout
    #clusterBoundBindGroup: GPUBindGroup
    #clusterBoundPipeline: GPUComputePipeline
    #targetSystemUniformsBindGroupLayout: GPUBindGroupLayout

    constructor(redGPUContext: RedGPUContext, targetView: View) {
        super(redGPUContext)
        this.#targetView = targetView
        this.#targetSystemUniformsBindGroupLayout = targetView.systemUniformsBindGroupLayout
        this.#initPipeLine()
        console.log('PassLightClustersBound', this)
    }

    render(commandEncoder: GPUCommandEncoder, passEncoder: GPUComputePassEncoder) {
        const systemUniformBindGroup: GPUBindGroup = this.#targetView.renderInfo_SystemUniformBindGroup
        if (systemUniformBindGroup) {
            const DISPATCH_SIZE = PassLightClustersHelper.getDispatchSize()
            passEncoder.setPipeline(this.#clusterBoundPipeline);
            passEncoder.setBindGroup(0, systemUniformBindGroup);
            passEncoder.setBindGroup(1, this.#clusterBoundBindGroup);
            passEncoder.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);

        }

    }

    #initPipeLine() {
        const {gpuDevice} = this.redGPUContext
        const source = shaderDefineReplace(PassLightClustersBoundSource)

        this.#clusterBoundBuffer = gpuDevice.createBuffer({
            size: PassLightClustersHelper.getTotalTileSize() * 32, // TODO 왜지? - Cluster x, y, z size * 32 bytes per cluster.
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.#clusterBoundBindGroupLayoutDescriptor = {
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'storage'}
                }
            ]
        }
        this.#clusterBoundBindGroupLayout = gpuDevice.createBindGroupLayout(this.#clusterBoundBindGroupLayoutDescriptor);
        this.#clusterBoundBindGroup = gpuDevice.createBindGroup({
            layout: this.#clusterBoundBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#clusterBoundBuffer,
                    },
                }
            ],
        });

        this.#clusterBoundPipeline = gpuDevice.createComputePipeline({
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [
                    this.#targetSystemUniformsBindGroupLayout,
                    this.#clusterBoundBindGroupLayout,
                ]
            }),
            compute: {
                module: gpuDevice.createShaderModule({
                    code: source,
                    label: "Cluster Bounds"
                }),
                entryPoint: 'main',
            }
        });


    }
}

export default PassLightClustersBound
