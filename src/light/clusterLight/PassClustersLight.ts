import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import PassLightClustersSource from "./PassClustersLight.wgsl";
import PassClustersLightHelper from "./PassClustersLightHelper";

const emptyArray = new Uint32Array([0, 0, 0, 0]);

/**
 * [KO] 각 클러스터에 영향을 주는 조명을 식별하는 컴퓨트 패스 클래스입니다.
 * [EN] Compute pass class that identifies lights affecting each cluster.
 *
 * [KO] 포인트 조명 및 스포트 조명과 클러스터(타일) 간의 교차 검사를 수행하여 각 클러스터에 포함되는 조명 인덱스를 기록합니다.
 * [EN] Performs intersection tests between point lights/spot lights and clusters (tiles) to record light indices included in each cluster.
 * @category Light
 */
class PassClustersLight {
    #view: View3D
    #clusterLightBindGroup: GPUBindGroup
    #clusterLightPipeline: GPUComputePipeline
    #clusterLightsBuffer: GPUBuffer
    readonly #redGPUContext: RedGPUContext

    /**
     * [KO] PassClustersLight 인스턴스를 생성합니다.
     * [EN] Creates a PassClustersLight instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    constructor(redGPUContext: RedGPUContext, view: View3D,) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#view = view;
        this.#initPipeLine();
        console.log(this);
    }

    /**
     * [KO] 클러스터 조명 버퍼를 반환합니다.
     * [EN] Returns the cluster lights buffer.
     * @returns
     * [KO] 클러스터 조명 GPUBuffer
     * [EN] Cluster lights GPUBuffer
     */
    get clusterLightsBuffer(): GPUBuffer {
        return this.#clusterLightsBuffer;
    }

    /**
     * [KO] 클러스터 조명을 계산하는 컴퓨트 패스를 실행합니다.
     * [EN] Executes the compute pass to calculate cluster lights.
     */
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
        const source = parseWGSL(PassLightClustersSource, 'PASS_CLUSTERS_LIGHT').defaultSource;
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