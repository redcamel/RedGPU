import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import ClusterCellBoundsSource from "../../core/ClusterBoundsGrid.wgsl";
import PassLightClustersSource from "./PassClustersLight.wgsl";
import PassClustersLightHelper from "../../core/PassClustersLightHelper";
import RedGPUObject from "../../../../base/RedGPUObject";
import PassClusterLightBound from "../bound/PassClusterLightBound";

const emptyArray = new Uint32Array([0, 0, 0, 0]);

/**
 * [KO] 각 클러스터 타일의 AABB와 씬 내 광원(PointLight, SpotLight) 간의 교차 판정(Culling)을 수행하여 타일별 유효 조명 목록을 구축하는 컴퓨트 패스 클래스입니다.
 * [EN] Compute pass class that performs intersection culling between each cluster tile's AABB and lights in the scene (PointLight, SpotLight) to build per-tile active light lists.
 *
 * [KO] 시스템에 의해 자동으로 생성되어 `View3D` 내부에서 관리됩니다.
 * [EN] Automatically created by the system and managed internally within `View3D`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
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
     * [KO] 새로운 PassClustersLight 인스턴스를 생성합니다.
     * [EN] Creates a new PassClustersLight instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param view -
     * [KO] 클러스터 라이트 컬링을 수행할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance for cluster light culling
     * @param passClusterLightBound -
     * [KO] 클러스터 AABB 바운드 정보를 제공하는 `PassClusterLightBound` 인스턴스
     * [EN] `PassClusterLightBound` instance providing cluster AABB bound data
     */
    constructor(redGPUContext: RedGPUContext, view: View3D, passClusterLightBound: PassClusterLightBound) {
        super(redGPUContext)
        this.#view = view;
        this.#passClusterLightBound = passClusterLightBound;
        this.#initPipeLine();
    }

    /**
     * [KO] 각 클러스터 셀별 조명 인덱스 및 개수가 저장된 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer containing the light indices and counts for each cluster cell.
     *
     * @returns
     * [KO] 클러스터 라이트 그리드 `GPUBuffer` 인스턴스
     * [EN] Cluster light grid `GPUBuffer` instance
     */
    get clusterLightsBuffer(): GPUBuffer {
        return this.#clusterLightsBuffer;
    }

    /**
     * [KO] 매 프레임 클러스터별 광원 교차 판정(Culling) 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches the per-cluster light intersection culling compute pass each frame.
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

    /**
     * [KO] 할당된 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Releases allocated GPU buffer and pipeline resources.
     */
    destroy(): void {
        if (this.#clusterLightsBuffer) {
            try {
                this.#clusterLightsBuffer.destroy();
            } catch (e) {
            }
            this.#clusterLightsBuffer = null;
        }
        this.#clusterLightBindGroup = null;
        this.#clusterLightPipeline = null;
        this.#passClusterLightBound = null;
        this.#clusterLightBindGroupLayout = null
        this.#view = null;
    }

    #initPipeLine() {
        const {gpuDevice, resourceManager} = this;
        const source = resourceManager.wgslParser.parse('PASS_CLUSTERS_LIGHT', ClusterCellBoundsSource + PassLightClustersSource).defaultSource;
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
                    code: source,
                }),
                entryPoint: 'main'
            }
        });
    }
}

Object.freeze(PassClustersLight)
export default PassClustersLight;