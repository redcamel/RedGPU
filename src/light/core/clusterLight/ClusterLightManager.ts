import View3D from "../../../display/view/View3D";
import PassClusterLightBound from "./pass/bound/PassClusterLightBound";
import PassClustersLight from "./pass/light/PassClustersLight";
import PassClustersLightHelper from "./core/PassClustersLightHelper";
import RedGPUObject from "../../../base/RedGPUObject";

/**
 * [KO] `View3D`의 3차원 프러스텀 클러스터 분할 및 다중 광원(`PointLight`, `SpotLight`) GPU 컬링 패스를 관리하는 시스템 내부 클래스입니다.
 * [EN] Internal system class that manages 3D frustum cluster subdivision and multi-light (`PointLight`, `SpotLight`) GPU culling passes for a `View3D`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const clusterLightManager = view.clusterLightManager;
 * ```
 *
 * @see [PointLight Performance Example](/RedGPU/examples/3d/light/pointLightPerformance/)
 * @see [SpotLight Performance Example](/RedGPU/examples/3d/light/spotLightPerformance/)
 * @category Light
 */
class ClusterLightManager extends RedGPUObject {

    #view: View3D
    #prevWidth: number = undefined
    #prevHeight: number = undefined
    #prevTotalLightCount: number = 0
    #passClusterLightBound: PassClusterLightBound
    #passClustersLight: PassClustersLight
    #clusterLightsBuffer: GPUBuffer
    #clusterLightsBufferData: Float32Array

    /**
     * [KO] ClusterLightManager 인스턴스를 초기화합니다.
     * [EN] Initializes the ClusterLightManager instance.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     */
    constructor(view: View3D) {
        super(view.redGPUContext)
        const {resourceManager} = this
        this.#view = view

        this.#clusterLightsBufferData = new Float32Array((16 * PassClustersLightHelper.MAX_CLUSTER_LIGHTS) + 4)
        this.#clusterLightsBuffer = resourceManager.createGPUBuffer(`VIEW_CLUSTER_LIGHTS_BUFFER`,
            {
                size: this.#clusterLightsBufferData.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            }
        )

        this.#passClusterLightBound = new PassClusterLightBound(this.redGPUContext, this.#view)
        this.#passClustersLight = new PassClustersLight(this.redGPUContext, this.#view, this.#passClusterLightBound)
    }

    /**
     * [KO] 클러스터 AABB 바운드 계산 컴퓨트 패스(`PassClusterLightBound`)를 반환합니다.
     * [EN] Returns the cluster AABB bound calculation compute pass (`PassClusterLightBound`).
     *
     * @returns
     * [KO] `PassClusterLightBound` 인스턴스
     * [EN] `PassClusterLightBound` instance
     */
    get passClusterLightBound(): PassClusterLightBound {
        return this.#passClusterLightBound;
    }

    /**
     * [KO] 클러스터별 광원 교차 컬링 컴퓨트 패스(`PassClustersLight`)를 반환합니다.
     * [EN] Returns the per-cluster light intersection culling compute pass (`PassClustersLight`).
     *
     * @returns
     * [KO] `PassClustersLight` 인스턴스
     * [EN] `PassClustersLight` instance
     */
    get passClustersLight(): PassClustersLight {
        return this.#passClustersLight;
    }

    /**
     * [KO] 클러스터 광원 데이터가 저장된 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer storing cluster light data.
     *
     * @returns
     * [KO] 클러스터 광원 `GPUBuffer`
     * [EN] Cluster light `GPUBuffer`
     */
    get clusterLightsBuffer(): GPUBuffer {
        return this.#clusterLightsBuffer;
    }

    /**
     * [KO] 씬의 `PointLight` 및 `SpotLight` 데이터를 GPU 버퍼에 업로드하고 클러스터 라이팅 컴퓨트 패스를 실행합니다.
     * [EN] Uploads `PointLight` and `SpotLight` data from the scene to the GPU buffer and executes the clustered lighting compute passes.
     */
    updateClusterLights() {
        const {scene, renderViewStateData, pixelRectArray} = this.#view
        if (!scene) return

        const {pointLights, spotLights} = scene.lightManager
        const pointLightNum = pointLights.length
        const spotLightNum = spotLights.length
        const totalLightNum = pointLightNum + spotLightNum
        if (totalLightNum === 0 && this.#prevTotalLightCount === 0) return

        const width = pixelRectArray[2]
        const height = pixelRectArray[3]

        if (!this.#view.systemUniform_Vertex_UniformBindGroup || width === 0 || height === 0) return

        this.#prevTotalLightCount = totalLightNum

        const dirtyPixelSize = this.#prevWidth === undefined || this.#prevHeight === undefined || this.#prevWidth !== width || this.#prevHeight !== height
        if (dirtyPixelSize) {
            this.#passClusterLightBound.render()
            this.#prevWidth = width
            this.#prevHeight = height
        }

        if (pointLightNum) {
            let i = pointLightNum
            while (i--) {
                const tLight = pointLights[i]
                const stride = 16
                const offset = 4 + stride * i
                this.#clusterLightsBufferData.set(
                    [
                        ...tLight.position, tLight.radius,
                        ...tLight.color.rgbNormalLinear, tLight.intensityMultiplier * tLight.lumen, 0
                    ],
                    offset,
                )
                if (tLight.enableDebugger) {
                    tLight.render(renderViewStateData)
                }
            }
        }
        if (spotLightNum) {
            const stride = 16
            const prevOffset = pointLightNum * stride
            let i = spotLightNum
            while (i--) {
                const tLight = spotLights[i]
                const offset = 4 + stride * i + prevOffset;
                this.#clusterLightsBufferData.set(
                    [
                        ...tLight.position, tLight.radius,
                        ...tLight.color.rgbNormalLinear, tLight.intensityMultiplier * tLight.lumen, 1, ...tLight.direction, tLight.outerCutoff, tLight.innerCutoff
                    ],
                    offset,
                )
                if (tLight.enableDebugger) {
                    tLight.render(renderViewStateData)
                }
            }
        }
        this.#clusterLightsBufferData.set(
            [pointLightNum, spotLightNum, 0, 0],
            0,
        )
        this.gpuDevice.queue.writeBuffer(this.#clusterLightsBuffer, 0, this.#clusterLightsBufferData as BufferSource);
        this.#passClustersLight.render()
    }

    /**
     * [KO] 할당된 GPU 버퍼 및 하위 컴퓨트 패스 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU buffers and sub-compute pass resources.
     */
    destroy(): void {
        if (this.#clusterLightsBuffer) {
            try {
                this.#clusterLightsBuffer.destroy();
            } catch (e) {
            }
            this.#clusterLightsBuffer = null;
        }

        if (this.#passClusterLightBound) {
            this.#passClusterLightBound.destroy();
            this.#passClusterLightBound = null;
        }

        if (this.#passClustersLight) {
            this.#passClustersLight.destroy();
            this.#passClustersLight = null;
        }

        this.#view = null;
        this.#clusterLightsBufferData = null;
        this.#prevTotalLightCount = 0;
    }
}

Object.freeze(ClusterLightManager)
export default ClusterLightManager