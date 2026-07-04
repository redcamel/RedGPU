import View3D from "../../display/view/View3D";
import DrawDebuggerPointLight from "../../display/drawDebugger/light/DrawDebuggerPointLight";
import DrawDebuggerSpotLight from "../../display/drawDebugger/light/DrawDebuggerSpotLight";
import PassClusterLightBound from "../clusterLight/pass/bound/PassClusterLightBound";
import PassClustersLight from "../clusterLight/pass/light/PassClustersLight";
import PassClustersLightHelper from "../clusterLight/core/PassClustersLightHelper";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] 클러스터 기반 조명 연산을 관리하는 매니저 클래스입니다.
 * [EN] Manager class that manages cluster-based lighting computations.
 *
 * [KO] 씬 내부의 포인트 조명(PointLight)과 스포트 조명(SpotLight)을 3D 클러스터 공간에 매핑하여 효율적으로 렌더링하도록 돕습니다.
 * [EN] Maps point lights (PointLight) and spot lights (SpotLight) within the scene to 3D cluster space for efficient rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Light
 */
class ClusterLightManager extends RedGPUObject {

    #view: View3D

    /**
     * [KO] 더티 체킹용 이전 프레임 너비
     * [EN] Previous frame width for dirty checking
     */
    #prevWidth: number = undefined
    /**
     * [KO] 더티 체킹용 이전 프레임 높이
     * [EN] Previous frame height for dirty checking
     */
    #prevHeight: number = undefined
    /**
     * [KO] 클러스터 라이트 경계 계산 패스
     * [EN] Cluster light boundary calculation pass
     */
    #passClusterLightBound: PassClusterLightBound
    /**
     * [KO] 클러스터 라이트 처리 패스
     * [EN] Cluster light processing pass
     */
    #passClustersLight: PassClustersLight
    /**
     * [KO] 클러스터 라이트 데이터를 저장하는 GPU 버퍼
     * [EN] GPU buffer for storing cluster light data
     */
    #clusterLightsBuffer: GPUBuffer
    /**
     * [KO] 클러스터 라이트 데이터를 담은 Float32Array
     * [EN] Float32Array containing cluster light data
     */
    #clusterLightsBufferData: Float32Array

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
     * [KO] 클러스터 라이팅 경계 패스를 반환합니다.
     * [EN] Returns the cluster light boundary pass.
     */
    get passClusterLightBound(): PassClusterLightBound {
        return this.#passClusterLightBound;
    }

    /**
     * [KO] 클러스터 라이팅 렌더링 패스를 반환합니다.
     * [EN] Returns the cluster lighting rendering pass.
     */
    get passClustersLight(): PassClustersLight {
        return this.#passClustersLight;
    }

    /**
     * [KO] 클러스터 라이트 데이터를 담은 GPUBuffer를 반환합니다.
     * [EN] Returns the GPUBuffer containing cluster light data.
     */
    get clusterLightsBuffer(): GPUBuffer {
        return this.#clusterLightsBuffer;
    }

    /**
     * [KO] 클러스터 라이트 데이터를 담은 Float32Array를 반환합니다.
     * [EN] Returns the Float32Array containing cluster light data.
     */
    get clusterLightsBufferData(): Float32Array {
        return this.#clusterLightsBufferData;
    }

    /**
     * [KO] 클러스터 라이트를 업데이트합니다.
     * [KO] 포인트 라이트와 스팟 라이트 데이터를 계산하고 GPU 버퍼에 업로드합니다.
     * [EN] Updates cluster lights.
     * [EN] Calculates PointLight and SpotLight data and uploads them to the GPU buffer.
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
                // console.log('실행이되긴하하나2')
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
                // console.log('실행이되긴하하나2')
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
                        // TODO - 버그 IBL과 함꼐 실행하면 죽는다
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
}

Object.freeze(ClusterLightManager)
export default ClusterLightManager