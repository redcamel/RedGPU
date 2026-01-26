import RedGPUContext from "../../context/RedGPUContext";
import './DebugRender.css'
import DebugBufferList from "./cls/DebugBufferList";
import DebugRedGPUContext from "./cls/DebugRedGPUContext";
import DebugTextureList from "./cls/DebugTextureList";
import DebugTotalState from "./cls/DebugTotalState";
import DebugViewList from "./cls/DebugViewList";
import Fps from './cls/Fps'

/**
 * [KO] RedGPU의 디버깅 정보를 화면에 렌더링하는 클래스입니다.
 * [EN] A class that renders RedGPU debugging information to the screen.
 *
 * [KO] FPS, 비디오 메모리 사용량, 드로우 콜 수, 텍스처 및 버퍼 리소스 상태 등 다양한 렌더링 통계 정보를 시각화하여 제공합니다.
 * [EN] Visualizes and provides various rendering statistics such as FPS, video memory usage, draw call count, and texture and buffer resource status.
 *
 * * ### Example
 * ```typescript
 * // 일반적으로 Renderer 내부에서 자동으로 생성되고 사용됩니다.
 * // Usually automatically created and used inside the Renderer.
 * const debugRender = new RedGPU.Renderer.DebugRender(redGPUContext);
 * ```
 *
 * @category Renderer
 */
class DebugRender {
    /**
     * [KO] FPS (Frames Per Second) 정보 관리 객체
     * [EN] FPS (Frames Per Second) information management object
     */
    fps: Fps;
    //
    /**
     * [KO] 전체 렌더링 상태 정보 관리 객체
     * [EN] Overall rendering state information management object
     */
    debugTotalState: DebugTotalState;
    /**
     * [KO] 뷰 목록 디버깅 정보 관리 객체
     * [EN] View list debugging information management object
     */
    debugViewList: DebugViewList;
    /**
     * [KO] RedGPUContext 상태 디버깅 정보 관리 객체
     * [EN] RedGPUContext state debugging information management object
     */
    debugRedGPUContext: DebugRedGPUContext;
    /**
     * [KO] 비트맵 텍스처 목록 디버깅 정보 관리 객체
     * [EN] Bitmap texture list debugging information management object
     */
    debugBitmapTextureList: DebugTextureList;
    /**
     * [KO] 큐브 텍스처 목록 디버깅 정보 관리 객체
     * [EN] Cube texture list debugging information management object
     */
    debugCubeTextureList: DebugTextureList;
    /**
     * [KO] HDR 텍스처 목록 디버깅 정보 관리 객체
     * [EN] HDR texture list debugging information management object
     */
    debugHDRTextureList: DebugTextureList;
    /**
     * [KO] 패킹된 텍스처 목록 디버깅 정보 관리 객체
     * [EN] Packed texture list debugging information management object
     */
    debugPackedTextureList: DebugTextureList;
    /**
     * [KO] 인덱스 버퍼 목록 디버깅 정보 관리 객체
     * [EN] Index buffer list debugging information management object
     */
    debugIndexBufferList: DebugBufferList;
    /**
     * [KO] 버텍스 버퍼 목록 디버깅 정보 관리 객체
     * [EN] Vertex buffer list debugging information management object
     */
    debugVertexBufferList: DebugBufferList;
    /**
     * [KO] 유니폼 버퍼 목록 디버깅 정보 관리 객체
     * [EN] Uniform buffer list debugging information management object
     */
    debugUniformBufferList: DebugBufferList;
    /**
     * [KO] 스토리지 버퍼 목록 디버깅 정보 관리 객체
     * [EN] Storage buffer list debugging information management object
     */
    debugStorageBufferList: DebugBufferList;
    /**
     * [KO] 일반 버퍼 목록 디버깅 정보 관리 객체
     * [EN] General buffer list debugging information management object
     */
    debugBufferList: DebugBufferList;
    //
    /**
     * [KO] 전체 3D 그룹 수
     * [EN] Total number of 3D groups
     */
    totalNum3DGroups: number
    /**
     * [KO] 전체 3D 오브젝트 수
     * [EN] Total number of 3D objects
     */
    totalNum3DObjects: number
    /**
     * [KO] 전체 드로우 콜 수
     * [EN] Total number of draw calls
     */
    totalNumDrawCalls: number;
    /**
     * [KO] 전체 인스턴스 수
     * [EN] Total number of instances
     */
    totalNumInstances: number
    /**
     * [KO] 전체 삼각형 수
     * [EN] Total number of triangles
     */
    totalNumTriangles: number;
    /**
     * [KO] 전체 포인트 수
     * [EN] Total number of points
     */
    totalNumPoints: number;
    /**
     * [KO] 전체 사용된 비디오 메모리 (바이트)
     * [EN] Total used video memory (bytes)
     */
    totalUsedVideoMemory: number
    #domRoot: HTMLElement

    /**
     * [KO] DebugRender 인스턴스를 생성합니다.
     * [EN] Creates a DebugRender instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        this.fps = new Fps(redGPUContext)
        this.debugTotalState = new DebugTotalState()
        this.debugRedGPUContext = new DebugRedGPUContext()
        this.debugViewList = new DebugViewList()
        this.debugBitmapTextureList = new DebugTextureList()
        this.debugCubeTextureList = new DebugTextureList('Cube')
        this.debugHDRTextureList = new DebugTextureList('HDR')
        this.debugPackedTextureList = new DebugTextureList('Packed')
        this.debugIndexBufferList = new DebugBufferList('IndexBuffer')
        this.debugVertexBufferList = new DebugBufferList('VertexBuffer')
        this.debugUniformBufferList = new DebugBufferList('UniformBuffer')
        this.debugStorageBufferList = new DebugBufferList('StorageBuffer')
        this.debugBufferList = new DebugBufferList('Buffer')
        this.#resetCounters();
    }

    /**
     * [KO] 디버그 정보를 렌더링하고 업데이트합니다.
     * [EN] Renders and updates debug information.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param time -
     * [KO] 현재 시간 (ms)
     * [EN] Current time (ms)
     */
    render(redGPUContext: RedGPUContext, time: number) {
        if (redGPUContext.useDebugPanel) {
            this.#createDebugPanel()
            this.fps.update(this, redGPUContext, time)
            this.debugRedGPUContext.update(this, redGPUContext, time)
            this.debugViewList.update(this, redGPUContext, time)
            this.debugBitmapTextureList.update(this, redGPUContext, time)
            this.debugCubeTextureList.update(this, redGPUContext, time)
            this.debugHDRTextureList.update(this, redGPUContext, time)
            this.debugPackedTextureList.update(this, redGPUContext, time)
            this.debugIndexBufferList.update(this, redGPUContext,)
            this.debugVertexBufferList.update(this, redGPUContext,)
            this.debugUniformBufferList.update(this, redGPUContext,)
            this.debugStorageBufferList.update(this, redGPUContext,)
            this.debugBufferList.update(this, redGPUContext,)
            this.debugTotalState.update(this, redGPUContext, time)
        } else {
            this.#removeDebugPanel()
        }
        this.#resetCounters();
    }

    #resetCounters() {
        this.totalNum3DGroups = 0
        this.totalNum3DObjects = 0
        this.totalNumInstances = 0
        this.totalNumDrawCalls = 0
        this.totalNumTriangles = 0
        this.totalNumPoints = 0
        this.totalUsedVideoMemory = 0
    }

    #createDebugPanel() {
        if (!this.#domRoot) {
            this.#domRoot = document.createElement('div');
            this.#domRoot.className = 'RedGPUDebugPanel'
            document.body.appendChild(this.#domRoot);
            [
                this.fps.debugStatisticsDomService,
                this.debugTotalState.debugStatisticsDomService,
                this.debugRedGPUContext.debugStatisticsDomService,
                this.debugViewList.debugStatisticsDomService,
                this.debugBufferList.debugStatisticsDomService,
                this.debugVertexBufferList.debugStatisticsDomService,
                this.debugIndexBufferList.debugStatisticsDomService,
                this.debugUniformBufferList.debugStatisticsDomService,
                this.debugStorageBufferList.debugStatisticsDomService,
                this.debugBitmapTextureList.debugStatisticsDomService,
                this.debugPackedTextureList.debugStatisticsDomService,
                this.debugCubeTextureList.debugStatisticsDomService,
                this.debugHDRTextureList.debugStatisticsDomService,
            ].forEach(v => this.#domRoot.appendChild(v.dom))
        }
    }

    #removeDebugPanel() {
        if (this.#domRoot) {
            this.#domRoot.remove()
            this.#domRoot = null
        }
    }
}

Object.freeze(DebugRender)
export default DebugRender