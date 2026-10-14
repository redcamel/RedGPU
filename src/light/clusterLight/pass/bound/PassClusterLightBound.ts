import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";

import ClusterCellBoundsSource from "../../core/ClusterBoundsGrid.wgsl";
import PassLightClustersBoundSource from "./PassClusterLightBound.wgsl";
import PassClustersLightHelper from "../../core/PassClustersLightHelper";
import RedGPUObject from "../../../../base/RedGPUObject";

/**
 * [KO] 뷰 프러스텀(View Frustum)을 3차원 클러스터 그리드로 분할하고 각 셀의 AABB 바운딩 볼륨을 계산하는 컴퓨트 패스 클래스입니다.
 * [EN] Compute pass class that subdivides the view frustum into a 3D cluster grid and calculates the AABB bounding volume for each cell.
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
class PassClusterLightBound extends RedGPUObject {
    #view: View3D
    #clusterBoundBuffer: GPUBuffer
    #clusterBoundBindGroupLayout: GPUBindGroupLayout
    #clusterBoundBindGroup: GPUBindGroup
    #clusterBoundPipeline: GPUComputePipeline
    #source

    /**
     * [KO] 새로운 PassClusterLightBound 인스턴스를 생성합니다.
     * [EN] Creates a new PassClusterLightBound instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param view -
     * [KO] 클러스터 바운딩 볼륨을 계산할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance for which cluster bounding volumes are calculated
     */
    constructor(redGPUContext: RedGPUContext, view: View3D) {
        super(redGPUContext)
        this.#view = view;
        this.#initPipeLine();
    }

    /**
     * [KO] 각 클러스터 타일의 뷰 공간 AABB 바운딩 데이터가 저장된 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer containing the view-space AABB bounding data for each cluster tile.
     *
     * @returns
     * [KO] 클러스터 바운드 `GPUBuffer` 인스턴스
     * [EN] Cluster bound `GPUBuffer` instance
     */
    get clusterBoundBuffer(): GPUBuffer {
        return this.#clusterBoundBuffer;
    }

    /**
     * [KO] 클러스터 타일의 AABB 바운딩 볼륨을 계산하는 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches the compute pass that calculates the AABB bounding volumes of cluster tiles.
     */
    render() {
        const sysUniformBindGroup = this.#view.systemUniform_Vertex_UniformBindGroup;
        if (sysUniformBindGroup) {
            const {commandEncoderManager} = this;
            commandEncoderManager.addPreProcessComputePass('PassClusterLightBound_ComputePass', (computePass) => {
                const DISPATCH_SIZE = PassClustersLightHelper.getDispatchSize();
                computePass.setPipeline(this.#clusterBoundPipeline);
                computePass.setBindGroup(0, sysUniformBindGroup);
                computePass.setBindGroup(1, this.#clusterBoundBindGroup);
                computePass.dispatchWorkgroups(DISPATCH_SIZE[0], DISPATCH_SIZE[1], DISPATCH_SIZE[2]);
            });
        }
    }

    /**
     * [KO] 할당된 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Releases allocated GPU buffer and pipeline resources.
     */
    destroy(): void {
        if (this.#clusterBoundBuffer) {
            try {
                this.#clusterBoundBuffer.destroy();
            } catch (e) {
            }
            this.#clusterBoundBuffer = null;
        }
        this.#clusterBoundBindGroup = null;
        this.#clusterBoundBindGroupLayout = null;
        this.#clusterBoundPipeline = null;
        this.#source = null;
        this.#view = null;
        console.log("🧹 PassClusterLightBound destroy 완료");
    }

    #initPipeLine() {
        const {gpuDevice, resourceManager} = this;
        this.#source = resourceManager.wgslParser.parse('PASS_CLUSTER_LIGHT_BOUND', ClusterCellBoundsSource + PassLightClustersBoundSource).defaultSource;
        this.#clusterBoundBuffer = resourceManager.createGPUBuffer(`PASS_CLUSTER_BOUND_BUFFER`, {
            size: PassClustersLightHelper.getTotalTileSize() * 32,
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
                    code: this.#source,
                }),
                entryPoint: 'main',
            }
        });
    }
}

Object.freeze(PassClusterLightBound)
export default PassClusterLightBound;