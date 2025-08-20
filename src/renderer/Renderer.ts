import {mat4} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
import GPU_LOAD_OP from "../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../gpuConst/GPU_STORE_OP";
import TAA from "../postEffect/TAA/TAA";
import DebugRender from "./debugRender/DebugRender";
import FinalRender from "./finalRender/FinalRender";
import render2PathLayer from "./renderLayers/render2PathLayer";
import renderAlphaLayer from "./renderLayers/renderAlphaLayer";
import renderBasicLayer from "./renderLayers/renderBasicLayer";
import renderPickingLayer from "./renderLayers/renderPickingLayer";
import renderShadowLayer from "./renderLayers/renderShadowLayer";

class Renderer {
	#prevViewportSize: { width: number, height: number };
	#finalRender: FinalRender
	#debugRender: DebugRender

	constructor() {
	}

	renderFrame(redGPUContext: RedGPUContext, time: number) {
		if (!this.#finalRender) this.#finalRender = new FinalRender()
		if (!this.#debugRender) this.#debugRender = new DebugRender(redGPUContext)
		// 오브젝트 렌더시작
		const viewList_renderPassDescriptorList: GPURenderPassDescriptor[] = []
		/**
		 * TODO - 단일 view를 렌더링하고, view.x,view.y가 0일때는
		 * 를 써도 될것 같은데... 왜냐면 뷰포트가 같으니까....
		 */
		{
			let i = 0
			const len = redGPUContext.viewList.length
			for (i; i < len; i++) {
				const targetView = redGPUContext.viewList[i]
				viewList_renderPassDescriptorList.push(this.renderView(targetView, time));
			}
		}
		this.#finalRender.render(redGPUContext, viewList_renderPassDescriptorList)
		//

		redGPUContext.antialiasingManager.changedMSAA = false

		console.log('/////////////////// end renderFrame ///////////////////')
	}

	start(redGPUContext: RedGPUContext, render: Function) {
		cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
		const HD_render = (time: number) => {
			render?.(time)
			redGPUContext.currentTime = time
			this.renderFrame(
				redGPUContext,
				time
			)
			this.#debugRender.render(redGPUContext, time)
			redGPUContext.currentRequestAnimationFrame = requestAnimationFrame(HD_render)
		}
		redGPUContext.currentRequestAnimationFrame = requestAnimationFrame(HD_render)
	}

	stop(redGPUContext: RedGPUContext) {
		cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
	}

	renderView(view: View3D, time: number) {
		const {
			redGPUContext,
			camera,
			scene,
			pickingManager,
			pixelRectObject,
			axis,
			grid,
			skybox,
			debugViewRenderState
		} = view
		const {antialiasingManager} = redGPUContext
		const {useMSAA} = antialiasingManager
		const {shadowManager} = scene
		const {directionalShadowManager} = shadowManager
		const {
			colorAttachment,
			depthStencilAttachment,
			gBufferNormalTextureAttachment,
		} = this.#createAttachmentsForView(view)
		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: [colorAttachment,gBufferNormalTextureAttachment],
			depthStencilAttachment,
		}
		// @ts-ignore
		camera.update?.(view, time)
		const commandEncoder: GPUCommandEncoder = redGPUContext.gpuDevice.createCommandEncoder()
		view.debugViewRenderState.reset(null, time)
		if (pixelRectObject.width && pixelRectObject.height) {
			if (directionalShadowManager.shadowDepthTextureView) {
				const shadowPassDescriptor: GPURenderPassDescriptor = {
					colorAttachments: [],
					depthStencilAttachment: {
						view: directionalShadowManager.shadowDepthTextureView,
						depthClearValue: 1.0,
						depthLoadOp: GPU_LOAD_OP.CLEAR,
						depthStoreOp: GPU_STORE_OP.STORE,
					},
				};
				const viewShadowRenderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(shadowPassDescriptor)
				this.#updateViewSystemUniforms(view, viewShadowRenderPassEncoder, true, false)
				renderShadowLayer(view, viewShadowRenderPassEncoder)
				viewShadowRenderPassEncoder.end()
				directionalShadowManager.resetCastingList()
			}
			{
				const viewRenderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
				this.#updateViewSystemUniforms(view, viewRenderPassEncoder, false, true)
				debugViewRenderState.currentRenderPassEncoder = viewRenderPassEncoder
				if (skybox) skybox.render(debugViewRenderState)
				renderBasicLayer(view, viewRenderPassEncoder)
				if (axis) axis.render(debugViewRenderState)
				if (grid) grid.render(debugViewRenderState)
				renderAlphaLayer(view, viewRenderPassEncoder)
				viewRenderPassEncoder.end()
			}
			{
				if (view.debugViewRenderState.render2PathLayer.length) {
					const {mipmapGenerator} = redGPUContext.resourceManager
					let renderPath1ResultTexture = view.viewRenderTextureManager.renderPath1ResultTexture
					// useMSAA 설정에 따라 소스 텍스처 선택
					let sourceTexture = useMSAA
						? view.viewRenderTextureManager.gBufferColorResolveTexture
						: view.viewRenderTextureManager.gBufferColorTexture;
					if (!sourceTexture) {
						if (useMSAA) {
							console.error('MSAA가 활성화되어 있지만 gBufferColorResolveTexture가 정의되지 않았습니다');
						} else {
							console.error('gBufferColorTexture가 정의되지 않았습니다');
						}
						console.log('view.redGPUContext.useMSAA:', useMSAA);
						console.log('viewRenderTextureManager:', view.viewRenderTextureManager);
					}
					if (!renderPath1ResultTexture) {
						console.error('renderPath1ResultTexture가 정의되지 않았습니다');
					}
					commandEncoder.copyTextureToTexture(
						{
							texture: sourceTexture,
						},
						{
							texture: renderPath1ResultTexture,
						},
						{width: view.pixelRectObject.width, height: view.pixelRectObject.height, depthOrArrayLayers: 1},
					);
					mipmapGenerator.generateMipmap(renderPath1ResultTexture, view.viewRenderTextureManager.renderPath1ResultTextureDescriptor, true)
					const renderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass({
						colorAttachments: [{
							...colorAttachment,
							loadOp: 'load'
						},
							{
								...gBufferNormalTextureAttachment,
								loadOp: 'load'
							}

						],
						depthStencilAttachment: {
							...depthStencilAttachment,
							depthLoadOp: GPU_LOAD_OP.LOAD,
						},
					});
					let renderPath1ResultTextureView = view.viewRenderTextureManager.renderPath1ResultTextureView
					this.#updateViewSystemUniforms(view, renderPassEncoder, false, false, renderPath1ResultTextureView);
					// 예제에서 주어진 렌더링 로직 실행
					render2PathLayer(view, renderPassEncoder);
					renderPassEncoder.end(); // 첫 번째 패스 종료
				}
			}
			// 포스트 이펙트 체크

			if (pickingManager) {
				pickingManager.checkTexture(view)
				const pickingPassDescriptor: GPURenderPassDescriptor = {
					colorAttachments: [
						{
							view: pickingManager.pickingGPUTextureView,
							clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
							loadOp: GPU_LOAD_OP.CLEAR,
							storeOp: GPU_STORE_OP.STORE
						}
					],
					depthStencilAttachment: {
						view: pickingManager.pickingDepthGPUTextureView,
						depthClearValue: 1.0,
						depthLoadOp: GPU_LOAD_OP.CLEAR,
						depthStoreOp: GPU_STORE_OP.STORE,
					},
				};
				const viewPickingRenderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(pickingPassDescriptor)
				this.#updateViewSystemUniforms(view, viewPickingRenderPassEncoder, false, false)
				renderPickingLayer(view, viewPickingRenderPassEncoder)
				viewPickingRenderPassEncoder.end()
				// renderPassDescriptor.colorAttachments[0].pickingView = pickingManager.pickingGPUTextureView
			}
		}
		redGPUContext.gpuDevice.queue.submit([commandEncoder.finish()])
		renderPassDescriptor.colorAttachments[0].postEffectView = view.postEffectManager.render().textureView
		view.debugViewRenderState.viewRenderTime = (performance.now() - view.debugViewRenderState.startTime);
		pickingManager.checkEvents(view, time)


		return renderPassDescriptor
	}

	#createAttachmentsForView(view: View3D) {
		const {scene, redGPUContext, viewRenderTextureManager} = view
		const {depthTextureView, gBufferColorTextureView, gBufferColorResolveTextureView,gBufferNormalTextureView,gBufferNormalResolveTextureView} = viewRenderTextureManager
		const {useBackgroundColor, backgroundColor} = scene
		const {antialiasingManager} = redGPUContext
		const {useMSAA} = antialiasingManager
		const rgbaNormal = backgroundColor.rgbaNormal
		const colorAttachment: GPURenderPassColorAttachment = {
			view: gBufferColorTextureView,
			clearValue: useBackgroundColor ? {
				r: rgbaNormal[0] * rgbaNormal[3],
				g: rgbaNormal[1] * rgbaNormal[3],
				b: rgbaNormal[2] * rgbaNormal[3],
				a: rgbaNormal[3]
			} : {r: 0, g: 0, b: 0, a: 0},
			loadOp: GPU_LOAD_OP.CLEAR,
			storeOp: GPU_STORE_OP.STORE
		}


		// console.log('depthTextureView', depthTextureView)
		const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
			view: depthTextureView,
			depthClearValue: 1.0,
			depthLoadOp: GPU_LOAD_OP.CLEAR,
			depthStoreOp: GPU_STORE_OP.STORE,
		}
		const gBufferNormalTextureAttachment: GPURenderPassColorAttachment = {
			view: gBufferNormalTextureView,
			clearValue: {r: 0, g: 0, b: 0, a: 0},
			loadOp: GPU_LOAD_OP.CLEAR,
			storeOp: GPU_STORE_OP.STORE
		}
		if (useMSAA){
			colorAttachment.resolveTarget = gBufferColorResolveTextureView
			gBufferNormalTextureAttachment.resolveTarget = gBufferNormalResolveTextureView
		}
		return {colorAttachment, depthStencilAttachment,gBufferNormalTextureAttachment,};
	}

	#updateViewSystemUniforms(view: View3D, viewRenderPassEncoder: GPURenderPassEncoder, shadowRender: boolean = false, calcPointLightCluster: boolean = true,
	                          renderPath1ResultTextureView: GPUTextureView = null) {
		const {inverseProjectionMatrix, pixelRectObject, projectionMatrix, rawCamera, redGPUContext, scene} = view
		const {gpuDevice} = redGPUContext
		const {modelMatrix: cameraMatrix, position: cameraPosition} = rawCamera
		const structInfo = view.systemUniform_Vertex_StructInfo;
		const gpuBuffer = view.systemUniform_Vertex_UniformBuffer.gpuBuffer;
		const {shadowManager, lightManager} = scene
		const {directionalShadowManager} = shadowManager
		const camera2DYn = rawCamera instanceof Camera2D;
		{
			if (shadowRender) {
				// pixelRectObject 해당하는 크기로 뷰포트를 만들고짜른다.
				const width = directionalShadowManager.shadowDepthTextureSize
				const height = directionalShadowManager.shadowDepthTextureSize
				viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
				viewRenderPassEncoder.setScissorRect(0, 0, width, height);
			} else {
				// pixelRectObject 해당하는 크기로 뷰포트를 만들고짜른다.
				const {width, height} = pixelRectObject
				if (!this.#prevViewportSize || this.#prevViewportSize.width !== width || this.#prevViewportSize.height !== height) {
					viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
					viewRenderPassEncoder.setScissorRect(0, 0, width, height);
					this.#prevViewportSize = {width, height};
				}
			}
		}
		lightManager.updateViewSystemUniforms(view)
		directionalShadowManager.updateViewSystemUniforms(redGPUContext)
		view.update(view, shadowRender, calcPointLightCluster, renderPath1ResultTextureView)
		// 시스템 유니폼 업데이트
		viewRenderPassEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
		[
			{key: 'projectionMatrix', value: projectionMatrix},
			{key: 'projectionCameraMatrix', value: mat4.multiply(temp, projectionMatrix, cameraMatrix)},
			{key: 'inverseProjectionMatrix', value: inverseProjectionMatrix},
			{key: 'resolution', value: [view.pixelRectObject.width, view.pixelRectObject.height]},
		].forEach(({key, value}) => {
			gpuDevice.queue.writeBuffer(
				gpuBuffer,
				structInfo.members[key].uniformOffset,
				new structInfo.members[key].View(value)
			);
		});
		// 카메라 시스템 유니폼 업데이트
		[
			{key: 'cameraMatrix', value: cameraMatrix},
			{key: 'cameraPosition', value: cameraPosition},
			{key: 'nearClipping', value: [camera2DYn ? 0 : rawCamera.nearClipping]},
			{key: 'farClipping', value: [camera2DYn ? 0 : rawCamera.farClipping]},
		].forEach(({key, value}) => {
			gpuDevice.queue.writeBuffer(
				gpuBuffer,
				structInfo.members.camera.members[key].uniformOffset,
				new structInfo.members.camera.members[key].View(value)
			);
		})
		// console.log('structInfo',view.scene.directionalLights)
	}
}

let temp = mat4.create()
export default Renderer
