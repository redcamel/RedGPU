import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import PassLightClustersBoundSource from "./PassClusterLightBound.wgsl";
import PassClustersLightHelper from "./PassClustersLightHelper";

/**
 * [KO] 클러스터 조명의 경계를 계산하는 컴퓨트 패스 클래스입니다.
 * [EN] Compute pass class that calculates the bounds of cluster lights.
 *
 * [KO] 화면을 타일로 나누고 각 타일의 3D 공간 상의 AABB(Axis-Aligned Bounding Box)를 계산합니다.
 * [EN] Divides the screen into tiles and calculates the AABB (Axis-Aligned Bounding Box) in 3D space for each tile.
 * @category Light
 */
class PassClusterLightBound {
    #view: View3D
    #clusterBoundBuffer: GPUBuffer
    #clusterBoundBindGroupLayout: GPUBindGroupLayout
    #clusterBoundBindGroup: GPUBindGroup
    #clusterBoundPipeline: GPUComputePipeline
    readonly #redGPUContext: RedGPUContext

    /**
     * [KO] PassClusterLightBound 인스턴스를 생성합니다.
     * [EN] Creates a PassClusterLightBound instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    constructor(redGPUContext: RedGPUContext, view: View3D) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#view = view;
        this.#initPipeLine();
    }

    /**
     * [KO] 클러스터 경계 버퍼를 반환합니다.
     * [EN] Returns the cluster bound buffer.
     * @returns
     * [KO] 클러스터 경계 GPUBuffer
     * [EN] Cluster bound GPUBuffer
     */
    get clusterBoundBuffer(): GPUBuffer {
        return this.#clusterBoundBuffer;
    }

    /**
     * [KO] 클러스터 경계를 계산하는 컴퓨트 패스를 실행합니다.
     * [EN] Executes the compute pass to calculate cluster bounds.
     */
    render() {
        const sysUniformBindGroup = this.#view.systemUniform_Vertex_UniformBindGroup;
        if (sysUniformBindGroup) {
            const {gpuDevice} = this.#redGPUContext
            const commandEncoder = gpuDevice.createCommandEncoder();
            const passEncoder = commandEncoder.beginComputePass({
                label: 'Bound cluster'
            });
            const DISPATCH_SIZE = PassClustersLightHelper.getDispatchSize();
            passEncoder.setPipeline(this.#clusterBoundPipeline);
            passEncoder.setBindGroup(0, sysUniformBindGroup);
            passEncoder.setBindGroup(1, this.#clusterBoundBindGroup);
            passEncoder.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);
            passEncoder.end();
            gpuDevice.queue.submit([commandEncoder.finish()]);
        }
    }

    #initPipeLine() {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
        const source = parseWGSL(PassLightClustersBoundSource, 'PASS_CLUSTER_LIGHT_BOUND').defaultSource;
        this.#clusterBoundBuffer = resourceManager.createGPUBuffer(`PASS_CLUSTER_BOUND_BUFFER`, {
            size: PassClustersLightHelper.getTotalTileSize() * 32, // Cluster x, y, z size * 32 bytes per cluster. Why? It's to be verified.
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.#clusterBoundBindGroupLayout = gpuDevice.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'storage'}
                }
            ]
        });
        this.#clusterBoundBindGroup = gpuDevice.createBindGroup({
            label: 'CLUSTER_BOUND_BIND_GROUP',
            layout: this.#clusterBoundBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#clusterBoundBuffer,
                    }
                }
            ],
        });
        this.#clusterBoundPipeline = gpuDevice.createComputePipeline({
            label: 'CLUSTER_BOUND_PIPELINE',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [
                    resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
                    this.#clusterBoundBindGroupLayout,
                ]
            }),
            compute: {
                module: resourceManager.createGPUShaderModule('CLUSTER_BOUND_SHADER', {
                    code: source,
                }),
                entryPoint: 'main',
            }
        });
    }
}

export default PassClusterLightBound;