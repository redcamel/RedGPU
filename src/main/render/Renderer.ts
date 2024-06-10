import RedGPUContext from "../../context/RedGPUContext";
import RedGPUContextBase from "../../context/RedGPUContextBase";
import {View} from "../view";
import FinalRenderer from "./renderFinal/FinalRenderer";

class Renderer extends RedGPUContextBase {
	#prevViewNum: number = 0
	#prevTime: number
	#requestID: number
	#prevUseMultiSample: boolean
	#finalRenderer: FinalRenderer
	#mainRender: Function
	#afterRender: Function
	#beforeRender: Function

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext)
		this.#finalRenderer = new FinalRenderer(redGPUContext)
	}

	get mainRender(): Function {
		return this.#mainRender;
	}

	set mainRender(value: Function) {
		this.#mainRender = value;
	}

	get afterRender(): Function {
		return this.#afterRender;
	}

	set afterRender(value: Function) {
		this.#afterRender = value;
	}

	get beforeRender(): Function {
		return this.#beforeRender;
	}

	set beforeRender(value: Function) {
		this.#beforeRender = value;
	}

	startRender() {
		this.#prevTime = performance.now()
		this.renderFrame()
	}

	stopRender() {
		this.#prevTime = performance.now()
		cancelAnimationFrame(this.#requestID)
	}

	renderFrame(nowTime: number = 0) {
		// nowTime = performance.now()
		const redGPUContext = this.redGPUContext
		const targetDebugger = redGPUContext.debugger
		const soloRenderYn = redGPUContext.viewList.length === 1
		if (nowTime - this.#prevTime > 8) {
			let hasPostEffect = false
			redGPUContext.viewList.forEach(view => {
				this.#renderView(view, nowTime, redGPUContext, soloRenderYn)
			})
			redGPUContext.viewList.forEach(view => {
				if (view.postEffectManager.children.length) hasPostEffect = true
			})
			if (!soloRenderYn || hasPostEffect) {
				this.#finalRenderer.render(redGPUContext.viewList)
			}
			this.#prevTime = nowTime
			targetDebugger.render()
			redGPUContext.dirtyMultiSample = false
		}
		this.#requestID = requestAnimationFrame((time) => {
			this.renderFrame(time)
		})
	}

	#renderView(view: View, nowTime: number, redGPUContext: RedGPUContext, soloRender: boolean = true) {
		const {scene, pixelViewRectInt} = view
		let beforeTime: number = 0
		let mainTime: number = 0
		let afterTime: number = 0
		let checkStartTime = nowTime
		if (this.#beforeRender) {
			this.#beforeRender(nowTime, view, scene)
		}
		beforeTime = performance.now() - checkStartTime
		checkStartTime = performance.now()
		if (this.#mainRender) {
			this.#mainRender(nowTime, view, scene)
		}
		if (view.camera.dirtyTransformState) view.camera.update()
		let renderMeshNum = 0
		let triangleNum = 0
		const {gpuDevice, gpuContext} = redGPUContext
		const commandEncoder: GPUCommandEncoder = gpuDevice.createCommandEncoder();
		const hasPostEffect = !!view.postEffectManager.children.length
		if (soloRender && !hasPostEffect) {
			view.resolveTexture = gpuContext.getCurrentTexture();
			view.resolveTextureView = view.resolveTexture.createView()
		}
		if (
			redGPUContext.dirtyMultiSample
			|| !view.resultTexture
			|| view.resultTexture.width !== pixelViewRectInt[2]
			|| view.resultTexture.height !== pixelViewRectInt[3]
		) {
			console.log('reset view.resultTexture')
			const size = [pixelViewRectInt[2], pixelViewRectInt[3]]
			const sampleCount = redGPUContext.useMultiSample ? 4 : 1
			const usage = hasPostEffect ? (GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING) : soloRender ? GPUTextureUsage.RENDER_ATTACHMENT : (GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING)
			const format = navigator.gpu.getPreferredCanvasFormat()
			view.resultTexture = gpuDevice.createTexture({
				size,
				sampleCount,
				format,
				usage
			});
			view.resultTextureView = view.resultTexture.createView({label: `${view.label}_resultTextureView`});
			///////////
			if (soloRender && !hasPostEffect) {
			} else {
				view.resolveTexture = gpuDevice.createTexture({
					size,
					sampleCount: 1,
					format,
					usage,
				});
				view.resolveTextureView = view.resolveTexture.createView({label: `${view.label}_resolveTextureView`});
			}
			///////////
			view.depthTexture = gpuDevice.createTexture({
				size,
				sampleCount,
				format: 'depth24plus-stencil8',
				usage,
			});
			view.depthTextureView = view.depthTexture.createView();
			console.log('뷰렌더텍스쳐갱신')
		}
		const {backgroundColorRGB, backgroundAlpha} = scene
		const renderPassDescriptor: GPURenderPassDescriptor = {
			/**
			 * @typedef {GPURenderPassColorAttachment}
			 */
			colorAttachments: [
				{
					view: redGPUContext.useMultiSample ? view.resultTextureView : view.resolveTextureView,
					resolveTarget: redGPUContext.useMultiSample ? view.resolveTextureView : undefined,
					// TODO - Scene의 색상을 받도록 수정
					clearValue: {
						r: backgroundColorRGB[0],
						g: backgroundColorRGB[1],
						b: backgroundColorRGB[2],
						a: backgroundAlpha
					},
					loadOp: 'clear',
					storeOp: 'store',
				},
			],
			depthStencilAttachment: {
				view: view.depthTextureView,
				depthClearValue: 1.0,
				depthLoadOp: "clear",
				depthStoreOp: "store",
				stencilClearValue: 0,
				stencilLoadOp: "load",
				stencilStoreOp: "store",
			}
		};
		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
		passEncoder.setBindGroup(0, view.renderInfo_SystemUniformBindGroup);
		passEncoder.setViewport(0, 0, pixelViewRectInt[2], pixelViewRectInt[3], 0, 1);
		passEncoder.setScissorRect(0, 0, pixelViewRectInt[2], pixelViewRectInt[3]);
		view.updateSystemUniform()
		view.updateClusters()
		/////////
		scene.skyBox?.render(view, passEncoder, nowTime)
		scene.grid?.render(view, passEncoder, nowTime)
		scene.axis?.render(view, passEncoder, nowTime)
		/////////
		{
			const list = view.scene.children
			let i = view.scene.children.length
			while (i--) {
				const t0: any = list[i].render(view, passEncoder, nowTime)
				renderMeshNum += t0 ? 1 : 0
				if (t0.geometry) triangleNum += t0.geometry.indexBuffer.indexNum / 3
			}
		}
		//
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
		{
			if (view.postEffectManager.children.length) {
				view.resolveTextureView = view.postEffectManager.render()
			}
		}
		mainTime = performance.now() - checkStartTime
		checkStartTime = performance.now()
		if (this.#afterRender) {
			this.#afterRender(nowTime, view, scene)
		}
		afterTime = performance.now() - checkStartTime
		{
			view.viewDebugger.update(view, scene, nowTime, this.#prevTime, beforeTime, mainTime, afterTime, renderMeshNum, triangleNum)
		}
	}
}

export default Renderer
