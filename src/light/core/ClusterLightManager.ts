import View3D from "../../display/view/View3D";
import DrawDebuggerPointLight from "../../display/drawDebugger/light/DrawDebuggerPointLight";
import DrawDebuggerSpotLight from "../../display/drawDebugger/light/DrawDebuggerSpotLight";
import PassClusterLightBound from "../clusterLight/pass/bound/PassClusterLightBound";
import PassClustersLight from "../clusterLight/pass/light/PassClustersLight";
import PassClustersLightHelper from "../clusterLight/core/PassClustersLightHelper";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] 클러스터 라이팅(Clustered Lighting) 데이터 및 컴퓨트 패스를 관리하는 매니저 클래스입니다.
 * [EN] Manager class that manages Clustered Lighting data and compute passes.
 *
 * [KO] 뷰(`View3D`) 공간을 3차원 프러스텀 클러스터(타일)로 분할하고, 다수의 포인트 조명(`PointLight`)과 스포트 조명(`SpotLight`) 데이터를 GPU 스토리지 버퍼로 업로드하여 클러스터별 조명 컬링 패스를 수행합니다. `View3D` 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Divides the `View3D` space into 3D frustum clusters (tiles), uploads multiple `PointLight` and `SpotLight` data to a GPU storage buffer, and executes per-cluster light culling passes. Automatically created internally when a `View3D` is created.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [PointLight Performance Example](/RedGPU/examples/3d/light/pointLightPerformance/)
 * @see [SpotLight Performance Example](/RedGPU/examples/3d/light/spotLightPerformance/)
 * @category Light
 */
class ClusterLightManager extends RedGPUObject {

    #view: View3D
    #prevWidth: number = undefined
    #prevHeight: number = undefined
    #passClusterLightBound: PassClusterLightBound
    #passClustersLight: PassClustersLight
    #clusterLightsBuffer: GPUBuffer
    #clusterLightsBufferData: Float32Array

    /**
     * [KO] ClusterLightManager 인스턴스를 생성합니다.
     * [EN] Creates a ClusterLightManager instance.
     *
     * @param view -
     * [KO] 클러스터 라이팅을 적용할 `View3D` 인스턴스
     * [EN] `View3D` instance to apply clustered lighting
     */
    constructor(view: View3D) {
        super(view.redGPUContext)
        const {resourceManager, gpuDevice} = this
        this.#view = view

        this.#clusterLightsBufferData = new Float32Array((16 * PassClustersLightHelper.MAX_CLUSTER_LIGHTS) + 4)
        this.#clusterLightsBuffer = resourceManager.createGPUBuffer(`VIEW_CLUSTER_LIGHTS_BUFFER`,
            {
                size: this.#clusterLightsBufferData.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            }
        )
        gpuDevice.queue.writeBuffer(this.#clusterLightsBuffer, 0, this.#clusterLightsBufferData as BufferSource)

        this.#passClusterLightBound = new PassClusterLightBound(this.redGPUContext, this.#view)
        this.#passClustersLight = new PassClustersLight(this.redGPUContext, this.#view, this.#passClusterLightBound)
    }

    /**
     * [KO] 클러스터 경계(AABB) 계산 컴퓨트 패스 객체를 반환합니다.
     * [EN] Returns the cluster bound (AABB) calculation compute pass object.
     *
     * @returns
     * [KO] `PassClusterLightBound` 인스턴스
     * [EN] `PassClusterLightBound` instance
     */
    get passClusterLightBound(): PassClusterLightBound {
        return this.#passClusterLightBound;
    }

    /**
     * [KO] 클러스터별 조명 교차 판정 컴퓨트 패스 객체를 반환합니다.
     * [EN] Returns the per-cluster light intersection test compute pass object.
     *
     * @returns
     * [KO] `PassClustersLight` 인스턴스
     * [EN] `PassClustersLight` instance
     */
    get passClustersLight(): PassClustersLight {
        return this.#passClustersLight;
    }

    /**
     * [KO] 클러스터 조명 데이터가 저장된 `GPUBuffer`를 반환합니다.
     * [EN] Returns the `GPUBuffer` storing cluster light data.
     *
     * @returns
     * [KO] 클러스터 조명 스토리지 `GPUBuffer`
     * [EN] Cluster light storage `GPUBuffer`
     */
    get clusterLightsBuffer(): GPUBuffer {
        return this.#clusterLightsBuffer;
    }

    /**
     * [KO] 클러스터 조명 데이터를 담고 있는 `Float32Array` 버퍼 데이터를 반환합니다.
     * [EN] Returns the `Float32Array` buffer data containing cluster light information.
     *
     * @returns
     * [KO] 클러스터 조명 `Float32Array` 데이터
     * [EN] Cluster light `Float32Array` data
     */
    get clusterLightsBufferData(): Float32Array {
        return this.#clusterLightsBufferData;
    }

    /**
     * [KO] 현재 씬의 포인트 조명 및 스포트 조명 데이터를 갱신하고 클러스터 라이팅 컴퓨트 패스를 실행합니다.
     * [EN] Updates point light and spot light data in the current scene and executes the clustered lighting compute passes.
     */
    updateClusterLights() {
        const {redGPUContext, scene, renderViewStateData, pixelRectArray} = this.#view
        const width = pixelRectArray[2]
        const height = pixelRectArray[3]

        if (!this.#view.systemUniform_Vertex_UniformBindGroup || width === 0 || height === 0) return

        const dirtyPixelSize = this.#prevWidth === undefined || this.#prevHeight === undefined || this.#prevWidth !== width || this.#prevHeight !== height
        if (dirtyPixelSize) {
            this.#passClusterLightBound.render()
            this.#prevWidth = width
            this.#prevHeight = height
        }

        if (scene) {
            const {pointLights, spotLights} = scene.lightManager
            const pointLightNum = pointLights.length
            const spotLightNum = spotLights.length
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
                        if (!tLight.drawDebugger) tLight.drawDebugger = new DrawDebuggerPointLight(redGPUContext, tLight)
                        tLight.drawDebugger.render(renderViewStateData)
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
                        if (!tLight.drawDebugger) tLight.drawDebugger = new DrawDebuggerSpotLight(redGPUContext, tLight)
                        tLight.drawDebugger.render(renderViewStateData)
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
    }

    /**
     * [KO] ClusterLightManager 인스턴스를 파기하고 할당된 GPU 버퍼 및 하위 컴퓨트 패스를 해제합니다.
     * [EN] Destroys the ClusterLightManager instance and releases allocated GPU buffers and sub-compute passes.
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
    }
}

Object.freeze(ClusterLightManager)
export default ClusterLightManager