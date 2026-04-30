import RedGPUContext from "../../src/context/RedGPUContext";
import './index.css'
import DebugBufferList from "./cls/DebugBufferList";
import DebugRedGPUContext from "./cls/DebugRedGPUContext";
import DebugTextureList from "./cls/DebugTextureList";
import DebugTotalState from "./cls/DebugTotalState";
import DebugViewList from "./cls/DebugViewList";
import Fps from './cls/Fps'

/**
 * [KO] RedGPU???¸ìŠ¤?™í„° ?•ë³´ë¥??”ë©´???Œë”ë§í•˜???´ëž˜?¤ìž…?ˆë‹¤.
 * [EN] A class that renders RedGPU inspector information to the screen.
 *
 * [KO] FPS, ë¹„ë””??ë©”ëª¨ë¦??¬ìš©?? ?œë¡œ??ì½??? ?ìŠ¤ì²?ë°?ë²„í¼ ë¦¬ì†Œ???íƒœ ???¤ì–‘???Œë”ë§??µê³„ ?•ë³´ë¥??œê°?”í•˜???œê³µ?©ë‹ˆ??
 * [EN] Visualizes and provides various rendering statistics such as FPS, video memory usage, draw call count, and texture and buffer resource status.
 *
 * * ### Example
 * ```typescript
 * // ?¼ë°˜?ìœ¼ë¡?Renderer ?´ë??ì„œ ?ë™?¼ë¡œ ?ì„±?˜ê³  ?¬ìš©?©ë‹ˆ??
 * // Usually automatically created and used inside the Renderer.
 * const inspector = new RedGPU.RedGPUInspector();
 * ```
 *
 * @category Renderer
 */
class RedGPUInspector {
    /**
     * [KO] FPS (Frames Per Second) ?•ë³´ ê´€ë¦?ê°ì²´
     * [EN] FPS (Frames Per Second) information management object
     */
    fps: Fps;
    //
    /**
     * [KO] ?„ì²´ ?Œë”ë§??íƒœ ?•ë³´ ê´€ë¦?ê°ì²´
     * [EN] Overall rendering state information management object
     */
    debugTotalState: DebugTotalState;
    /**
     * [KO] ë·?ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] View list debugging information management object
     */
    debugViewList: DebugViewList;
    /**
     * [KO] RedGPUContext ?íƒœ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] RedGPUContext state debugging information management object
     */
    debugRedGPUContext: DebugRedGPUContext;
    /**
     * [KO] ë¹„íŠ¸ë§??ìŠ¤ì²?ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] Bitmap texture list debugging information management object
     */
    debugBitmapTextureList: DebugTextureList;
    /**
     * [KO] ?ë¸Œ ?ìŠ¤ì²?ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] Cube texture list debugging information management object
     */
    debugCubeTextureList: DebugTextureList;
    /**
     * [KO] HDR ?ìŠ¤ì²?ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] HDR texture list debugging information management object
     */
    debugHDRTextureList: DebugTextureList;
    /**
     * [KO] ?¨í‚¹???ìŠ¤ì²?ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] Packed texture list debugging information management object
     */
    debugPackedTextureList: DebugTextureList;
    /**
     * [KO] ?¸ë±??ë²„í¼ ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] Index buffer list debugging information management object
     */
    debugIndexBufferList: DebugBufferList;
    /**
     * [KO] ë²„í…??ë²„í¼ ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] Vertex buffer list debugging information management object
     */
    debugVertexBufferList: DebugBufferList;
    /**
     * [KO] ? ë‹ˆ??ë²„í¼ ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] Uniform buffer list debugging information management object
     */
    debugUniformBufferList: DebugBufferList;
    /**
     * [KO] ?¤í† ë¦¬ì? ë²„í¼ ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] Storage buffer list debugging information management object
     */
    debugStorageBufferList: DebugBufferList;
    /**
     * [KO] ?¼ë°˜ ë²„í¼ ëª©ë¡ ?”ë²„ê¹??•ë³´ ê´€ë¦?ê°ì²´
     * [EN] General buffer list debugging information management object
     */
    debugBufferList: DebugBufferList;
    //
    /**
     * [KO] ?„ì²´ 3D ê·¸ë£¹ ??
     * [EN] Total number of 3D groups
     */
    totalNum3DGroups: number
    /**
     * [KO] ?„ì²´ 3D ?¤ë¸Œ?íŠ¸ ??
     * [EN] Total number of 3D objects
     */
    totalNum3DObjects: number
    /**
     * [KO] ?„ì²´ ?œë¡œ??ì½???
     * [EN] Total number of draw calls
     */
    totalNumDrawCalls: number;
    /**
     * [KO] ?„ì²´ ?¸ìŠ¤?´ìŠ¤ ??
     * [EN] Total number of instances
     */
    totalNumInstances: number
    /**
     * [KO] ?„ì²´ ?¼ê°????
     * [EN] Total number of triangles
     */
    totalNumTriangles: number;
    /**
     * [KO] ?„ì²´ ?¬ì¸????
     * [EN] Total number of points
     */
    totalNumPoints: number;
    /**
     * [KO] ?„ì²´ ?¬ìš©??ë¹„ë””??ë©”ëª¨ë¦?(ë°”ì´??
     * [EN] Total used video memory (bytes)
     */
    totalUsedVideoMemory: number
    /**
     * [KO] ?”ë²„ê·??¨ë„ ?¬ìš© ?¬ë?
     * [EN] Whether to use the debug panel
     */
    useDebugPanel: boolean = false
    #domRoot: HTMLElement

    /**
     * [KO] RedGPUInspector ?¸ìŠ¤?´ìŠ¤ë¥??ì„±?©ë‹ˆ??
     * [EN] Creates a RedGPUInspector instance.
     */
    constructor() {
        this.fps = new Fps()
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
     * [KO] ?”ë²„ê·??•ë³´ë¥??Œë”ë§í•˜ê³??…ë°?´íŠ¸?©ë‹ˆ??
     * [EN] Renders and updates debug information.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext ?¸ìŠ¤?´ìŠ¤
     * [EN] RedGPUContext instance
     * @param time -
     * [KO] ?„ìž¬ ?œê°„ (ms)
     * [EN] Current time (ms)
     */
    render(redGPUContext: RedGPUContext, time: number) {
        if (this.useDebugPanel) {
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

Object.freeze(RedGPUInspector)
export default RedGPUInspector
