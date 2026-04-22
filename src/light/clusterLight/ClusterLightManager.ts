import {RedGPUContext} from "../../context";
import View3D from "../../display/view/View3D";
import DrawDebuggerPointLight from "../../display/drawDebugger/light/DrawDebuggerPointLight";
import DrawDebuggerSpotLight from "../../display/drawDebugger/light/DrawDebuggerSpotLight";
import PassClusterLightBound from "./pass/bound/PassClusterLightBound";
import PassClustersLight from "./pass/light/PassClustersLight";
import PassClustersLightHelper from "./core/PassClustersLightHelper";

class ClusterLightManager {
    #redGPUContext: RedGPUContext
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
        this.#view = view
        this.#redGPUContext = view.redGPUContext

        this.#clusterLightsBufferData = new Float32Array((16 * PassClustersLightHelper.MAX_CLUSTER_LIGHTS) + 4)
        this.#clusterLightsBuffer = this.#redGPUContext.resourceManager.createGPUBuffer(`VIEW_CLUSTER_LIGHTS_BUFFER`,
            {
                size: this.#clusterLightsBufferData.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            }
        )
        this.#redGPUContext.gpuDevice.queue.writeBuffer(this.#clusterLightsBuffer, 0, this.#clusterLightsBufferData as BufferSource)

    }

    /**
     * [KO] 클러스터 라이트 경계 패스를 반환합니다.
     * [EN] Returns the cluster light boundary pass.
     */
    get passClusterLightBound(): PassClusterLightBound {
        return this.#passClusterLightBound;
    }

    get passClustersLight(): PassClustersLight {
        return this.#passClustersLight;
    }

    get clusterLightsBuffer(): GPUBuffer {
        return this.#clusterLightsBuffer;
    }

    get clusterLightsBufferData(): Float32Array {
        return this.#clusterLightsBufferData;
    }

    /**
     * 클러스터 라이트를 업데이트합니다.
     * 포인트 라이트와 스팟 라이트 데이터를 계산하고 GPU 버퍼에 업로드합니다.
     *
     * @param calcClusterLight - 클러스터 라이트 계산 여부 (기본값: false)
     * @private
     */
    updateClusterLights(calcClusterLight: boolean = false) {
        if (!calcClusterLight) return
        const {redGPUContext, scene, renderViewStateData, pixelRectArray} = this.#view
        const dirtyPixelSize = this.#prevWidth == undefined || this.#prevHeight == undefined || this.#prevWidth !== pixelRectArray[2] || this.#prevHeight !== pixelRectArray[3]
        // const dirtyPixelSize = true;
        if (!this.#passClusterLightBound) {
            this.#passClusterLightBound = new PassClusterLightBound(redGPUContext, this.#view)
        }
        if (this.#passClustersLight && dirtyPixelSize) {
            // console.log('passClusterLightBound 재계산')
            this.#passClusterLightBound.render()
            this.#prevWidth = pixelRectArray[2]
            this.#prevHeight = pixelRectArray[3]
        }
        if (!this.#passClustersLight) {
            this.#passClustersLight = new PassClustersLight(redGPUContext, this.#view)
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
                            ...tLight.color.rgbNormalLinear, tLight.intensity * tLight.lumen, 0
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
                            ...tLight.color.rgbNormalLinear, tLight.intensity * tLight.lumen, 1, ...tLight.direction, tLight.outerCutoff, tLight.innerCutoff
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
            this.#redGPUContext.gpuDevice.queue.writeBuffer(this.#clusterLightsBuffer, 0, this.#clusterLightsBufferData as BufferSource);
            this.#passClustersLight.render()
        }
    }
}

Object.freeze(ClusterLightManager)
export default ClusterLightManager