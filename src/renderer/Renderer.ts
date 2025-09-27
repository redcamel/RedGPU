import {mat4} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
import GPU_LOAD_OP from "../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../gpuConst/GPU_STORE_OP";
import gltfAnimationLooper from "../loader/gltf/animationLooper/gltfAnimationLooper";
import ParsedSkinInfo_GLTF from "../loader/gltf/cls/ParsedSkinInfo_GLTF";
import DebugRender from "./debugRender/DebugRender";
import FinalRender from "./finalRender/FinalRender";
import render2PathLayer from "./renderLayers/render2PathLayer";
import renderAlphaLayer from "./renderLayers/renderAlphaLayer";
import renderBasicLayer from "./renderLayers/renderBasicLayer";
import renderPickingLayer from "./renderLayers/renderPickingLayer";
import renderShadowLayer from "./renderLayers/renderShadowLayer";
import RenderViewStateData from "./RenderViewStateData";

let temp0 = new Float32Array(16)
let temp1 = new Float32Array(16)

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

	#renderViewShadow(view: View3D, commandEncoder: GPUCommandEncoder) {
		const {scene} = view
		const {shadowManager} = scene
		const {directionalShadowManager} = shadowManager
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
	}

	#renderViewBasicLayer(view: View3D, commandEncoder: GPUCommandEncoder, renderPassDescriptor: GPURenderPassDescriptor) {
		const {debugViewRenderState, skybox, grid, axis} = view
		const viewRenderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
		this.#updateViewSystemUniforms(view, viewRenderPassEncoder, false, true)
		debugViewRenderState.currentRenderPassEncoder = viewRenderPassEncoder
		if (skybox) skybox.render(debugViewRenderState)
		if (axis) axis.render(debugViewRenderState)
		if (grid) grid.render(debugViewRenderState)
		renderBasicLayer(view, viewRenderPassEncoder)
		renderAlphaLayer(view, viewRenderPassEncoder)
		viewRenderPassEncoder.end()
	}

	#renderView2PathLayer(view: View3D, commandEncoder: GPUCommandEncoder, renderPassDescriptor: GPURenderPassDescriptor, depthStencilAttachment: GPURenderPassDepthStencilAttachment) {
		const {redGPUContext} = view
		const {antialiasingManager} = redGPUContext
		const {useMSAA} = antialiasingManager
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
				{texture: sourceTexture,},
				{texture: renderPath1ResultTexture,},
				{width: view.pixelRectObject.width, height: view.pixelRectObject.height, depthOrArrayLayers: 1},
			);
			mipmapGenerator.generateMipmap(renderPath1ResultTexture, view.viewRenderTextureManager.renderPath1ResultTextureDescriptor, true)
			const renderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass({
				colorAttachments: [...renderPassDescriptor.colorAttachments].map(v => ({...v, loadOp: GPU_LOAD_OP.LOAD})),
				depthStencilAttachment: {
					...depthStencilAttachment,
					depthLoadOp: GPU_LOAD_OP.LOAD,
				},
			});
			let renderPath1ResultTextureView = view.viewRenderTextureManager.renderPath1ResultTextureView
			this.#updateViewSystemUniforms(view, renderPassEncoder, false, false, renderPath1ResultTextureView);
			render2PathLayer(view, renderPassEncoder);
			renderPassEncoder.end();
		}
	}

	#renderViewPickingLayer(view: View3D, commandEncoder: GPUCommandEncoder,) {
		const {pickingManager} = view
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
		}
	}

	#updateJitter(view: View3D,) {
		const {taa} = view
		const frameIndex = taa.frameIndex || 0;
		const jitterScale = taa.jitterStrength;
		const sampleCount = 32;
		const currentSample = frameIndex % sampleCount;
		// Halton 시퀀스 계산
		const haltonX = this.#haltonSequence(currentSample + 1, 2);
		const haltonY = this.#haltonSequence(currentSample + 1, 3);
		// 픽셀 단위 지터
		const jitterX = (haltonX - 0.5) * jitterScale;
		const jitterY = (haltonY - 0.5) * jitterScale;
		view.setJitterOffset(jitterX, jitterY);
	}

	renderView(view: View3D, time: number) {
		const {
			redGPUContext,
			camera,
			pickingManager,
			pixelRectObject,
			debugViewRenderState
		} = view
		const {
			colorAttachment,
			depthStencilAttachment,
			gBufferNormalTextureAttachment,
			gBufferMotionVectorTextureAttachment
		} = this.#createAttachmentsForView(view)
		this.#updateJitter(view)
		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: [colorAttachment, gBufferNormalTextureAttachment, gBufferMotionVectorTextureAttachment],
			depthStencilAttachment,
		}
		// @ts-ignore
		camera.update?.(view, time)
		const commandEncoder: GPUCommandEncoder = redGPUContext.gpuDevice.createCommandEncoder({
			label: 'ViewRender_MainCommandEncoder'
		})
		const computeCommandEncoder: GPUCommandEncoder = redGPUContext.gpuDevice.createCommandEncoder({
			label: 'ViewRender_MainComputeCommandEncoder'
		})
		this.#batchUpdateSkinMatrices(redGPUContext, debugViewRenderState)
		view.debugViewRenderState.reset(null, computeCommandEncoder, time)
		if (pixelRectObject.width && pixelRectObject.height) {
			this.#renderViewShadow(view, commandEncoder)
			this.#renderViewBasicLayer(view, commandEncoder, renderPassDescriptor)
			this.#renderView2PathLayer(view, commandEncoder, renderPassDescriptor, depthStencilAttachment)
			this.#renderViewPickingLayer(view, commandEncoder)
		}
		renderPassDescriptor.colorAttachments[0].postEffectView = view.postEffectManager.render().textureView
		redGPUContext.gpuDevice.queue.submit([commandEncoder.finish()])
		view.debugViewRenderState.viewRenderTime = (performance.now() - view.debugViewRenderState.startTime);
		pickingManager.checkEvents(view, time);
		{
			const {noneJitterProjectionMatrix, rawCamera, redGPUContext} = view
			const {modelMatrix: cameraMatrix} = rawCamera
			const {gpuDevice} = redGPUContext;
			const structInfo = view.systemUniform_Vertex_StructInfo;
			const gpuBuffer = view.systemUniform_Vertex_UniformBuffer.gpuBuffer;
			[
				{key: 'prevProjectionCameraMatrix', value: mat4.multiply(temp3, noneJitterProjectionMatrix, cameraMatrix)},
			].forEach(({key, value}) => {
				gpuDevice.queue.writeBuffer(
					gpuBuffer,
					structInfo.members[key].uniformOffset,
					new structInfo.members[key].View(value)
				);
			});
		}
		redGPUContext.gpuDevice.queue.submit([computeCommandEncoder.finish()])
		return renderPassDescriptor
	}

	#haltonSequence(index: number, base: number): number {
		let result = 0;
		let fraction = 1 / base;
		let i = index;
		while (i > 0) {
			result += (i % base) * fraction;
			i = Math.floor(i / base);
			fraction /= base;
		}
		return result;
	}

	#batchUpdateSkinMatrices(redGPUContext: RedGPUContext, debugViewRenderState: RenderViewStateData) {
		const {animationList, skinList} = debugViewRenderState;
		const skinListNum = skinList.length
		const animationListNum = animationList.length
		// keepLog(animationList)
		const {gpuDevice} = redGPUContext;
		const commandEncoder = gpuDevice.createCommandEncoder({
			label: 'BatchUpdateSkinMatrices_CommandEncoder'
		});
		const passEncoder = commandEncoder.beginComputePass();
		// for (let i = 0; i < animationListNum; i++) {
		// 	const activeAnimations = animationList[i]
		//
		// }
		if (animationListNum) {
			gltfAnimationLooper(
				redGPUContext,
				debugViewRenderState.timestamp,
				passEncoder,
				animationList.flat()
			)
		}
		for (let i = 0; i < skinListNum; i++) {
			const mesh = skinList[i];
			const skinInfo = mesh.animationInfo.skinInfo as ParsedSkinInfo_GLTF;
			// 사용된 조인트 인덱스 초기화
			if (!skinInfo.usedJoints) {
				skinInfo.usedJoints = skinInfo.getUsedJointIndices(mesh);
			}
			// 조인트 행렬 저장 버퍼 크기 확인 및 초기화
			const neededSize = (1 + skinInfo.usedJoints.length) * 16;
			if (!skinInfo.jointData || skinInfo.jointData.length !== neededSize) {
				skinInfo.jointData = new Float32Array(neededSize);
				skinInfo.computeShader = null
			}
			// 모델 행렬의 역행렬 계산
			skinInfo.invertNodeGlobalTransform = skinInfo.invertNodeGlobalTransform || new Float32Array(mesh.modelMatrix.length);
			// mat4.invert(skinInfo.invertNodeGlobalTransform, mesh.modelMatrix);
			{
				{
					const sourceMatrix = mesh.modelMatrix;
					const resultMatrix = skinInfo.invertNodeGlobalTransform;
					const m00 = sourceMatrix[0], m01 = sourceMatrix[1], m02 = sourceMatrix[2], m03 = sourceMatrix[3];
					const m10 = sourceMatrix[4], m11 = sourceMatrix[5], m12 = sourceMatrix[6], m13 = sourceMatrix[7];
					const m20 = sourceMatrix[8], m21 = sourceMatrix[9], m22 = sourceMatrix[10], m23 = sourceMatrix[11];
					const m30 = sourceMatrix[12], m31 = sourceMatrix[13], m32 = sourceMatrix[14], m33 = sourceMatrix[15];
					const c00 = m11 * (m22 * m33 - m23 * m32) - m12 * (m21 * m33 - m23 * m31) + m13 * (m21 * m32 - m22 * m31);
					const c01 = -(m10 * (m22 * m33 - m23 * m32) - m12 * (m20 * m33 - m23 * m30) + m13 * (m20 * m32 - m22 * m30));
					const c02 = m10 * (m21 * m33 - m23 * m31) - m11 * (m20 * m33 - m23 * m30) + m13 * (m20 * m31 - m21 * m30);
					const c03 = -(m10 * (m21 * m32 - m22 * m31) - m11 * (m20 * m32 - m22 * m30) + m12 * (m20 * m31 - m21 * m30));
					const c10 = -(m01 * (m22 * m33 - m23 * m32) - m02 * (m21 * m33 - m23 * m31) + m03 * (m21 * m32 - m22 * m31));
					const c11 = m00 * (m22 * m33 - m23 * m32) - m02 * (m20 * m33 - m23 * m30) + m03 * (m20 * m32 - m22 * m30);
					const c12 = -(m00 * (m21 * m33 - m23 * m31) - m01 * (m20 * m33 - m23 * m30) + m03 * (m20 * m31 - m21 * m30));
					const c13 = m00 * (m21 * m32 - m22 * m31) - m01 * (m20 * m32 - m22 * m30) + m02 * (m20 * m31 - m21 * m30);
					const c20 = m01 * (m12 * m33 - m13 * m32) - m02 * (m11 * m33 - m13 * m31) + m03 * (m11 * m32 - m12 * m31);
					const c21 = -(m00 * (m12 * m33 - m13 * m32) - m02 * (m10 * m33 - m13 * m30) + m03 * (m10 * m32 - m12 * m30));
					const c22 = m00 * (m11 * m33 - m13 * m31) - m01 * (m10 * m33 - m13 * m30) + m03 * (m10 * m31 - m11 * m30);
					const c23 = -(m00 * (m11 * m32 - m12 * m31) - m01 * (m10 * m32 - m12 * m30) + m02 * (m10 * m31 - m11 * m30));
					const c30 = -(m01 * (m12 * m23 - m13 * m22) - m02 * (m11 * m23 - m13 * m21) + m03 * (m11 * m22 - m12 * m21));
					const c31 = m00 * (m12 * m23 - m13 * m22) - m02 * (m10 * m23 - m13 * m20) + m03 * (m10 * m22 - m12 * m20);
					const c32 = -(m00 * (m11 * m23 - m13 * m21) - m01 * (m10 * m23 - m13 * m20) + m03 * (m10 * m21 - m11 * m20));
					const c33 = m00 * (m11 * m22 - m12 * m21) - m01 * (m10 * m22 - m12 * m20) + m02 * (m10 * m21 - m11 * m20);
					const determinant = m00 * c00 + m01 * c01 + m02 * c02 + m03 * c03;
					if (Math.abs(determinant) < 1e-10) {
						console.error('Matrix is not invertible (determinant is zero or near zero)');
						resultMatrix[0] = 1;
						resultMatrix[1] = 0;
						resultMatrix[2] = 0;
						resultMatrix[3] = 0;
						resultMatrix[4] = 0;
						resultMatrix[5] = 1;
						resultMatrix[6] = 0;
						resultMatrix[7] = 0;
						resultMatrix[8] = 0;
						resultMatrix[9] = 0;
						resultMatrix[10] = 1;
						resultMatrix[11] = 0;
						resultMatrix[12] = 0;
						resultMatrix[13] = 0;
						resultMatrix[14] = 0;
						resultMatrix[15] = 1;
					} else {
						const invDet = 1.0 / determinant;
						resultMatrix[0] = c00 * invDet;
						resultMatrix[1] = c10 * invDet;
						resultMatrix[2] = c20 * invDet;
						resultMatrix[3] = c30 * invDet;
						resultMatrix[4] = c01 * invDet;
						resultMatrix[5] = c11 * invDet;
						resultMatrix[6] = c21 * invDet;
						resultMatrix[7] = c31 * invDet;
						resultMatrix[8] = c02 * invDet;
						resultMatrix[9] = c12 * invDet;
						resultMatrix[10] = c22 * invDet;
						resultMatrix[11] = c32 * invDet;
						resultMatrix[12] = c03 * invDet;
						resultMatrix[13] = c13 * invDet;
						resultMatrix[14] = c23 * invDet;
						resultMatrix[15] = c33 * invDet;
					}
				}
			}
			// Compute Shader 초기화 (최초 1회)
			if (!skinInfo.computeShader) {
				skinInfo.createCompute(
					redGPUContext,
					gpuDevice,
					mesh.animationInfo.skinInfo.vertexStorageBuffer,
					mesh.animationInfo.weightBuffer,
				);
			}
			{
				const usedJoints = skinInfo.usedJoints
				let i = usedJoints.length;
				const jointData = skinInfo.jointData;
				while (i--) {
					jointData.set(skinInfo.joints[usedJoints[i]].modelMatrix, (i + 1) * 16);
				}
				jointData.set(skinInfo.invertNodeGlobalTransform, 0)
				gpuDevice.queue.writeBuffer(skinInfo.uniformBuffer, 0, jointData)
			}
			// Compute Pass 설정 및 Dispatch
			passEncoder.setPipeline(skinInfo.computePipeline);
			passEncoder.setBindGroup(0, skinInfo.bindGroup);
			passEncoder.dispatchWorkgroups(Math.ceil(mesh.geometry.vertexBuffer.vertexCount / skinInfo.WORK_SIZE));
		}
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
	}

	#createAttachmentsForView(view: View3D) {
		const {scene, redGPUContext, viewRenderTextureManager} = view
		const {
			depthTextureView,
			gBufferColorTextureView, gBufferColorResolveTextureView,
			gBufferNormalTextureView, gBufferNormalResolveTextureView,
			gBufferMotionVectorTextureView, gBufferMotionVectorResolveTextureView,
		} = viewRenderTextureManager
		const {antialiasingManager} = redGPUContext
		const {useMSAA} = antialiasingManager
		const colorAttachment: GPURenderPassColorAttachment = {
			view: gBufferColorTextureView,
			clearValue: {r: 0, g: 0, b: 0, a: 0},
			loadOp: GPU_LOAD_OP.CLEAR,
			storeOp: GPU_STORE_OP.STORE
		}
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
		const gBufferMotionVectorTextureAttachment: GPURenderPassColorAttachment = {
			view: gBufferMotionVectorTextureView,
			clearValue: {r: 0, g: 0, b: 0, a: 0},
			loadOp: GPU_LOAD_OP.CLEAR,
			storeOp: GPU_STORE_OP.STORE
		}
		if (useMSAA) {
			colorAttachment.resolveTarget = gBufferColorResolveTextureView
			gBufferNormalTextureAttachment.resolveTarget = gBufferNormalResolveTextureView
			gBufferMotionVectorTextureAttachment.resolveTarget = gBufferMotionVectorResolveTextureView
		}
		return {
			colorAttachment,
			depthStencilAttachment,
			gBufferNormalTextureAttachment,
			gBufferMotionVectorTextureAttachment
		};
	}

	#updateViewSystemUniforms(view: View3D, viewRenderPassEncoder: GPURenderPassEncoder, shadowRender: boolean = false, calcPointLightCluster: boolean = true,
	                          renderPath1ResultTextureView: GPUTextureView = null) {
		const {
			inverseProjectionMatrix,
			pixelRectObject,
			noneJitterProjectionMatrix,
			projectionMatrix,
			rawCamera,
			redGPUContext,
			scene
		} = view
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
			{key: 'noneJitterProjectionMatrix', value: noneJitterProjectionMatrix},
			{key: 'noneJitterProjectionCameraMatrix', value: mat4.multiply(temp2, noneJitterProjectionMatrix, cameraMatrix)},
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
let temp2 = mat4.create()
let temp3 = mat4.create()
export default Renderer
