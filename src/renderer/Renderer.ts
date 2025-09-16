import {mat4} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import RedGPUContext from "../context/RedGPUContext";
import Mesh from "../display/mesh/Mesh";
import View3D from "../display/view/View3D";
import GPU_LOAD_OP from "../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../gpuConst/GPU_STORE_OP";
import ParsedSkinInfo_GLTF from "../loader/gltf/cls/ParsedSkinInfo_GLTF";
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

	#batchUpdateSkinMatrices(redGPUContext: RedGPUContext, meshes: Mesh[]) {
		if (meshes.length === 0) return;
		const commandEncoder = redGPUContext.gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginComputePass();
		const {gpuDevice} = redGPUContext;
		let i = meshes.length;
		while (i--) {
			const mesh = meshes[i];
			const skinInfo = mesh.animationInfo.skinInfo as ParsedSkinInfo_GLTF;
			// skinInfo.update(redGPUContext,commandEncoder,mesh)
			const usedJointIndices = skinInfo.usedJoints === null
				? skinInfo.getUsedJointIndices(mesh)
				: skinInfo.usedJoints;
			skinInfo.usedJoints = usedJointIndices;
			skinInfo.nodeGlobalTransform = skinInfo.nodeGlobalTransform || new Float32Array(mesh.modelMatrix.length);
			{
				const sourceMatrix = mesh.modelMatrix;
				const resultMatrix = skinInfo.nodeGlobalTransform;
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
			const nodeGlobalTransform = skinInfo.nodeGlobalTransform;
			{
				const neededSize = skinInfo.joints.length * 16;
				if (!skinInfo.reusableJointNodeGlobalTransform || skinInfo.reusableJointNodeGlobalTransform.length !== neededSize) {
					skinInfo.reusableJointNodeGlobalTransform = new Float32Array(neededSize);
				}
				let j = usedJointIndices.length;
				while (j--) {
					const jointIndex = usedJointIndices[j];
					const jm = skinInfo.joints[jointIndex].modelMatrix;
					const ibm = skinInfo.inverseBindMatrices[jointIndex];
					const offset = jointIndex * 16;
					const out = skinInfo.reusableJointNodeGlobalTransform;
					const t00 = nodeGlobalTransform[0] * jm[0] + nodeGlobalTransform[4] * jm[1] + nodeGlobalTransform[8] * jm[2] + nodeGlobalTransform[12] * jm[3];
					const t01 = nodeGlobalTransform[1] * jm[0] + nodeGlobalTransform[5] * jm[1] + nodeGlobalTransform[9] * jm[2] + nodeGlobalTransform[13] * jm[3];
					const t02 = nodeGlobalTransform[2] * jm[0] + nodeGlobalTransform[6] * jm[1] + nodeGlobalTransform[10] * jm[2] + nodeGlobalTransform[14] * jm[3];
					const t03 = nodeGlobalTransform[3] * jm[0] + nodeGlobalTransform[7] * jm[1] + nodeGlobalTransform[11] * jm[2] + nodeGlobalTransform[15] * jm[3];
					const t10 = nodeGlobalTransform[0] * jm[4] + nodeGlobalTransform[4] * jm[5] + nodeGlobalTransform[8] * jm[6] + nodeGlobalTransform[12] * jm[7];
					const t11 = nodeGlobalTransform[1] * jm[4] + nodeGlobalTransform[5] * jm[5] + nodeGlobalTransform[9] * jm[6] + nodeGlobalTransform[13] * jm[7];
					const t12 = nodeGlobalTransform[2] * jm[4] + nodeGlobalTransform[6] * jm[5] + nodeGlobalTransform[10] * jm[6] + nodeGlobalTransform[14] * jm[7];
					const t13 = nodeGlobalTransform[3] * jm[4] + nodeGlobalTransform[7] * jm[5] + nodeGlobalTransform[11] * jm[6] + nodeGlobalTransform[15] * jm[7];
					const t20 = nodeGlobalTransform[0] * jm[8] + nodeGlobalTransform[4] * jm[9] + nodeGlobalTransform[8] * jm[10] + nodeGlobalTransform[12] * jm[11];
					const t21 = nodeGlobalTransform[1] * jm[8] + nodeGlobalTransform[5] * jm[9] + nodeGlobalTransform[9] * jm[10] + nodeGlobalTransform[13] * jm[11];
					const t22 = nodeGlobalTransform[2] * jm[8] + nodeGlobalTransform[6] * jm[9] + nodeGlobalTransform[10] * jm[10] + nodeGlobalTransform[14] * jm[11];
					const t23 = nodeGlobalTransform[3] * jm[8] + nodeGlobalTransform[7] * jm[9] + nodeGlobalTransform[11] * jm[10] + nodeGlobalTransform[15] * jm[11];
					const t30 = nodeGlobalTransform[0] * jm[12] + nodeGlobalTransform[4] * jm[13] + nodeGlobalTransform[8] * jm[14] + nodeGlobalTransform[12] * jm[15];
					const t31 = nodeGlobalTransform[1] * jm[12] + nodeGlobalTransform[5] * jm[13] + nodeGlobalTransform[9] * jm[14] + nodeGlobalTransform[13] * jm[15];
					const t32 = nodeGlobalTransform[2] * jm[12] + nodeGlobalTransform[6] * jm[13] + nodeGlobalTransform[10] * jm[14] + nodeGlobalTransform[14] * jm[15];
					const t33 = nodeGlobalTransform[3] * jm[12] + nodeGlobalTransform[7] * jm[13] + nodeGlobalTransform[11] * jm[14] + nodeGlobalTransform[15] * jm[15];
					// temp1 * inverseBindMatrix
					out[offset] = t00 * ibm[0] + t10 * ibm[1] + t20 * ibm[2] + t30 * ibm[3];
					out[offset + 1] = t01 * ibm[0] + t11 * ibm[1] + t21 * ibm[2] + t31 * ibm[3];
					out[offset + 2] = t02 * ibm[0] + t12 * ibm[1] + t22 * ibm[2] + t32 * ibm[3];
					out[offset + 3] = t03 * ibm[0] + t13 * ibm[1] + t23 * ibm[2] + t33 * ibm[3];
					out[offset + 4] = t00 * ibm[4] + t10 * ibm[5] + t20 * ibm[6] + t30 * ibm[7];
					out[offset + 5] = t01 * ibm[4] + t11 * ibm[5] + t21 * ibm[6] + t31 * ibm[7];
					out[offset + 6] = t02 * ibm[4] + t12 * ibm[5] + t22 * ibm[6] + t32 * ibm[7];
					out[offset + 7] = t03 * ibm[4] + t13 * ibm[5] + t23 * ibm[6] + t33 * ibm[7];
					out[offset + 8] = t00 * ibm[8] + t10 * ibm[9] + t20 * ibm[10] + t30 * ibm[11];
					out[offset + 9] = t01 * ibm[8] + t11 * ibm[9] + t21 * ibm[10] + t31 * ibm[11];
					out[offset + 10] = t02 * ibm[8] + t12 * ibm[9] + t22 * ibm[10] + t32 * ibm[11];
					out[offset + 11] = t03 * ibm[8] + t13 * ibm[9] + t23 * ibm[10] + t33 * ibm[11];
					out[offset + 12] = t00 * ibm[12] + t10 * ibm[13] + t20 * ibm[14] + t30 * ibm[15];
					out[offset + 13] = t01 * ibm[12] + t11 * ibm[13] + t21 * ibm[14] + t31 * ibm[15];
					out[offset + 14] = t02 * ibm[12] + t12 * ibm[13] + t22 * ibm[14] + t32 * ibm[15];
					out[offset + 15] = t03 * ibm[12] + t13 * ibm[13] + t23 * ibm[14] + t33 * ibm[15];
				}
			}
			if (!skinInfo.computeShader) {
				skinInfo.createCompute(
					redGPUContext,
					gpuDevice,
					mesh.animationInfo.skinInfo.vertexStorageBuffer,
					mesh.animationInfo.weightBuffer,
					skinInfo.reusableJointNodeGlobalTransform
				);
			}
			gpuDevice.queue.writeBuffer(
				skinInfo.jointNodeGlobalTransformBuffer,
				0,
				skinInfo.reusableJointNodeGlobalTransform
			);
			{

				passEncoder.setPipeline(skinInfo.computePipeline);
				passEncoder.setBindGroup(0, skinInfo.bindGroup);
				passEncoder.dispatchWorkgroups(Math.ceil(mesh.geometry.vertexBuffer.vertexCount / 64));

			}
		}
		passEncoder.end();
		// 한 번에 제출
		redGPUContext.gpuDevice.queue.submit([commandEncoder.finish()]);
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
			debugViewRenderState,
			taa
		} = view
		const {antialiasingManager} = redGPUContext
		const {useMSAA} = antialiasingManager
		const {shadowManager} = scene
		const {directionalShadowManager} = shadowManager
		const {
			colorAttachment,
			depthStencilAttachment,
			gBufferNormalTextureAttachment,
			gBufferMotionVectorTextureAttachment
		} = this.#createAttachmentsForView(view)
		{
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
		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: [colorAttachment, gBufferNormalTextureAttachment, gBufferMotionVectorTextureAttachment],
			depthStencilAttachment,
		}
		// @ts-ignore
		camera.update?.(view, time)
		const commandEncoder: GPUCommandEncoder = redGPUContext.gpuDevice.createCommandEncoder()
		const computeCommandEncoder: GPUCommandEncoder = redGPUContext.gpuDevice.createCommandEncoder()
		this.#batchUpdateSkinMatrices(redGPUContext,debugViewRenderState.skinList)
		view.debugViewRenderState.reset(null,computeCommandEncoder, time)

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
						colorAttachments: [...renderPassDescriptor.colorAttachments].map(v => ({...v, loadOp: GPU_LOAD_OP.LOAD})),
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
		renderPassDescriptor.colorAttachments[0].postEffectView = view.postEffectManager.render().textureView
		redGPUContext.gpuDevice.queue.submit([commandEncoder.finish()])
		view.debugViewRenderState.viewRenderTime = (performance.now() - view.debugViewRenderState.startTime);
		pickingManager.checkEvents(view, time);
		{
			const {projectionMatrix, noneJitterProjectionMatrix, rawCamera, redGPUContext,} = view
			const {modelMatrix: cameraMatrix} = rawCamera
			const {gpuDevice} = redGPUContext;
			const structInfo = view.systemUniform_Vertex_StructInfo;
			const gpuBuffer = view.systemUniform_Vertex_UniformBuffer.gpuBuffer;
			[
				{key: 'prevProjectionCameraMatrix', value: mat4.multiply(temp3, noneJitterProjectionMatrix, cameraMatrix)},
				// {key: 'prevProjectionCameraMatrix', value: mat4.multiply(temp3, projectionMatrix, cameraMatrix)},
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
