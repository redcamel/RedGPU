import RedGPUContext from "../../context/RedGPUContext";
import './DebugRender.css'
import DebugBufferList from "./cls/DebugBufferList";
import DebugRedGPUContext from "./cls/DebugRedGPUContext";
import DebugTextureList from "./cls/DebugTextureList";
import DebugTotalState from "./cls/DebugTotalState";
import DebugViewList from "./cls/DebugViewList";
import Fps from './cls/Fps'

class DebugRender {
	fps: Fps;
	//
	debugTotalState: DebugTotalState;
	debugViewList: DebugViewList;
	debugRedGPUContext: DebugRedGPUContext;
	debugBitmapTextureList: DebugTextureList;
	debugCubeTextureList: DebugTextureList;
	debugHDRTextureList: DebugTextureList;
	debugPackedTextureList: DebugTextureList;
	debugIndexBufferList: DebugBufferList;
	debugVertexBufferList: DebugBufferList;
	debugUniformBufferList: DebugBufferList;
	debugStorageBufferList: DebugBufferList;
	debugBufferList: DebugBufferList;
	//
	totalNum3DGroups: number
	totalNum3DObjects: number
	totalNumDrawCalls: number;
	totalNumInstances: number
	totalNumTriangles: number;
	totalNumPoints: number;
	totalUsedVideoMemory: number
	#domRoot: HTMLElement

	constructor(redGPUContext:RedGPUContext) {
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
