import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import ClusterCellBoundsSource from "../../core/ClusterBoundsGrid.wgsl";
import PassLightClustersSource from "./PassClustersLight.wgsl";
import PassClustersLightHelper from "../../core/PassClustersLightHelper";
import RedGPUObject from "../../../../base/RedGPUObject";
import PassClusterLightBound from "../bound/PassClusterLightBound";

const emptyArray = new Uint32Array([0, 0, 0, 0]);

/**
 * [KO] 각 클러스터에 영향을 주는 조명을 식별하는 컴퓨트 패스 클래스입니다.
 * [EN] Compute pass class that identifies lights affecting each cluster.
 *
 * [KO] 포인트 조명 및 스포트 조명과 클러스터(타일) 간의 교차 검사를 수행하여 각 클러스터에 포함되는 조명 인덱스를 기록합니다.
 * [EN] Performs intersection tests between point lights/spot lights and clusters (tiles) to record light indices included in each cluster.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 * @category Light
 */
class PassClustersLight extends RedGPUObject {
    #view: View3D
    #clusterLightBindGroup: GPUBindGroup
    #clusterLightPipeline: GPUComputePipeline
    #clusterLightBindGroupLayout: GPUBindGroupLayout
    #clusterLightsBuffer: GPUBuffer
    #passClusterLightBound: PassClusterLightBound

    /**
     * [KO] PassClustersLight 인스턴스를 생성합니다.
     * [EN] Creates a PassClustersLight instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param passClusterLightBound -
     * [KO] PassClusterLightBound 인스턴스
     * [EN] PassClusterLightBound instance
     */
    constructor(redGPUContext: RedGPUContext, view: View3D, passClusterLightBound: PassClusterLightBound) {
        super(redGPUContext)
        this.#view = view;
        this.#passClusterLightBound = passClusterLightBound;
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
        const systemUniformBindGroup: GPUBindGroup = this.#view.systemUniform_Vertex_UniformBindGroup;
        if (systemUniformBindGroup) {
            const {commandEncoderManager, gpuDevice} = this;
            commandEncoderManager.addPreProcessComputePass('PassClustersLight_ComputePass', (computePass) => {
                const DISPATCH_SIZE = PassClustersLightHelper.getDispatchSize();
                gpuDevice.queue.writeBuffer(this.clusterLightsBuffer, 0, emptyArray);
                computePass.setPipeline(this.#clusterLightPipeline);
                computePass.setBindGroup(0, systemUniformBindGroup);
                computePass.setBindGroup(1, this.#clusterLightBindGroup);
                computePass.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);
            });
        }
    }

    #source

    /**
     * [KO] PassClustersLight 인스턴스를 파기하고 할당된 GPUBuffer 및 파이프라인을 해제합니다.
     * [EN] Destroys the PassClustersLight instance and releases allocated GPUBuffer and pipelines.
     */
    destroy(): void {
        if (this.#clusterLightsBuffer) {
            try {
                this.#clusterLightsBuffer.destroy();
            } catch (e) {
                // 예외 처리
            }
            this.#clusterLightsBuffer = null;
        }
        this.#clusterLightBindGroup = null;
        this.#clusterLightPipeline = null;
        this.#passClusterLightBound = null;
        this.#clusterLightBindGroupLayout = null
        this.#source = null
        this.#view = null;
        console.log("🧹 PassClustersLight destroy 완료");
    }

    #initPipeLine() {
        const {gpuDevice, resourceManager} = this;
        this.#source = parseWGSL('PASS_CLUSTERS_LIGHT', ClusterCellBoundsSource + PassLightClustersSource).defaultSource;
        // keepLog(this.#source )
        this.#clusterLightsBuffer = resourceManager.createGPUBuffer(`PASS_CLUSTER_LIGHTS_BUFFER`, {
            size: PassClustersLightHelper.getClusterLightsBufferSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.#clusterLightBindGroupLayout = gpuDevice.createBindGroupLayout({
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
            layout: this.#clusterLightBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#passClusterLightBound.clusterBoundBuffer
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
                    this.#clusterLightBindGroupLayout
                ]
            }),
            compute: {
                module: resourceManager.createGPUShaderModule('CLUSTER_LIGHTS_SHADER', {
                    code: this.#source,
                }),
                entryPoint: 'main'
            }
        });
    }
}

Object.freeze(PassClustersLight)
export default PassClustersLight;