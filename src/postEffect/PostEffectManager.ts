import {mat4} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../resources/sampler/Sampler";
import parseWGSL from "../resources/wgslParser/parseWGSL";
import AMultiPassPostEffect from "./core/AMultiPassPostEffect";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
import postEffectSystemUniformCode from "./core/postEffectSystemUniform.wgsl"
import FXAA from "./FXAA";

class PostEffectManager {
	readonly #view: View3D
	#postEffects: Array<ASinglePassPostEffect | AMultiPassPostEffect> = []
	#storageTexture: GPUTexture
	#sourceTextureView: GPUTextureView
	#storageTextureView: GPUTextureView
	#COMPUTE_WORKGROUP_SIZE_X = 16
	#COMPUTE_WORKGROUP_SIZE_Y = 4
	#COMPUTE_WORKGROUP_SIZE_Z = 1
	#fxaa: FXAA
	#textureComputeShaderModule: GPUShaderModule
	#textureComputeBindGroup: GPUBindGroup
	#textureComputeBindGroupLayout: GPUBindGroupLayout
	#textureComputePipeline: GPUComputePipeline
	#previousDimensions: { width: number, height: number }
	#postEffectSystemUniformBuffer: UniformBuffer;
	#postEffectSystemUniformBufferStructInfo;

	constructor(view: View3D) {
		this.#view = view;
		this.#init()
	}

	get postEffectSystemUniformBuffer(): UniformBuffer {
		return this.#postEffectSystemUniformBuffer;
	}

	get view(): View3D {
		return this.#view;
	}

	get effectList(): Array<ASinglePassPostEffect | AMultiPassPostEffect> {
		return this.#postEffects;
	}

	addEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
		this.#postEffects.push(v)
	}

	addEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect) {
		//TODO
	}

	getEffectAt(index: number): ASinglePassPostEffect | AMultiPassPostEffect {
		return this.#postEffects[index]
	}

	removeEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
		//TODO
	}

	removeEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect) {
		//TODO
	}

	removeAllEffect() {
		this.#postEffects.forEach(effect => {
			effect.clear()
		})
		this.#postEffects.length = 0
	}

	render() {
		const {viewRenderTextureManager, redGPUContext} = this.#view;
		const {antialiasingManager} = redGPUContext
		const {useMSAA, useFXAA} = antialiasingManager;
		const {colorTextureView, colorResolveTextureView, colorTexture} = viewRenderTextureManager;
		const {width, height} = colorTexture;
		this.#updateSystemUniforms()
		// 초기 텍스처 설정 (MSAA 여부에 따라 소스 결정)
		const initialSourceView = useMSAA ? colorResolveTextureView : colorTextureView;
		this.#sourceTextureView = this.#renderToStorageTexture(this.#view, initialSourceView);
		let currentTextureView = this.#sourceTextureView;
		this.#postEffects.forEach(effect => {
			currentTextureView = effect.render(
				this.#view,
				width,
				height,
				currentTextureView,
			);
		});
		// FXAA 적용 (필요한 경우)
		if (useFXAA) {
			if (!this.#fxaa) {
				this.#fxaa = new FXAA(redGPUContext);
			}
			this.#fxaa.subpix = antialiasingManager.fxaa_subpix
			currentTextureView = this.#fxaa.render(
				this.#view,
				width,
				height,
				currentTextureView
			);
		}
		return currentTextureView;
	}

	clear() {
		this.#postEffects.forEach(effect => {
			effect.clear()
		})
	}

	#updateSystemUniforms() {
		const {inverseProjectionMatrix, projectionMatrix, rawCamera, redGPUContext, scene} = this.#view
		const {gpuDevice} = redGPUContext
		const {modelMatrix: cameraMatrix, position: cameraPosition} = rawCamera
		const structInfo = this.#postEffectSystemUniformBufferStructInfo
		const gpuBuffer = this.#postEffectSystemUniformBuffer.gpuBuffer;
		const camera2DYn = rawCamera instanceof Camera2D;
		console.log(structInfo);
		const projectionCameraMatrix = mat4.multiply(temp, projectionMatrix, cameraMatrix);
		[
			{key: 'projectionMatrix', value: projectionMatrix},
			{key: 'projectionCameraMatrix', value: projectionCameraMatrix},
			{key: 'inverseProjectionMatrix', value: inverseProjectionMatrix},
			{key: 'inverseProjectionCameraMatrix', value: mat4.invert(temp2, projectionCameraMatrix)},
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
			//@ts-ignore
			{key: 'fieldOfView', value: rawCamera.fieldOfView * Math.PI / 180},
		].forEach(({key, value}) => {
			gpuDevice.queue.writeBuffer(
				gpuBuffer,
				structInfo.members.camera.members[key].uniformOffset,
				new structInfo.members.camera.members[key].View(value)
			);
		})
		// console.log('structInfo',view.scene.directionalLights)
	}

	#init() {
		const {redGPUContext} = this.#view;
		const {gpuDevice, width} = redGPUContext;
		const textureComputeShader = this.#getTextureComputeShader();
		this.#textureComputeShaderModule = gpuDevice.createShaderModule({code: textureComputeShader,});
		this.#textureComputeBindGroupLayout = this.#createTextureBindGroupLayout(redGPUContext);
		this.#textureComputePipeline = this.#createTextureComputePipeline(gpuDevice, this.#textureComputeShaderModule, this.#textureComputeBindGroupLayout)
		const SHADER_INFO = parseWGSL(postEffectSystemUniformCode)
		const UNIFORM_STRUCT = SHADER_INFO.uniforms.systemUniforms;
		const postEffectSystemUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
		this.#postEffectSystemUniformBufferStructInfo = UNIFORM_STRUCT;
		this.#postEffectSystemUniformBuffer = new UniformBuffer(redGPUContext, postEffectSystemUniformData, '#postEffectSystemUniformBuffer');
	}

	#renderToStorageTexture(view: View3D, sourceTextureView: GPUTextureView) {
		const {redGPUContext, viewRenderTextureManager} = view;
		const {colorTexture} = viewRenderTextureManager;
		const {gpuDevice, antialiasingManager} = redGPUContext;
		const {useMSAA, changedMSAA} = antialiasingManager;
		const {width, height} = colorTexture;
		const dimensionsChanged = width !== this.#previousDimensions?.width || height !== this.#previousDimensions?.height;
		// 크기가 변경되면 텍스처 재생성
		if (dimensionsChanged) {
			if (this.#storageTexture) {
				this.#storageTexture.destroy();
				this.#storageTexture = null;
			}
			this.#storageTexture = this.#createStorageTexture(gpuDevice, width, height);
			this.#storageTextureView = this.#storageTexture.createView({label: this.#storageTexture.label});
		}
		// 크기 변경 또는 MSAA 변경 시 BindGroup 재생성
		if (dimensionsChanged || changedMSAA) {
			this.#textureComputeBindGroup = this.#createTextureBindGroup(
				redGPUContext,
				this.#textureComputeBindGroupLayout,
				sourceTextureView,
				this.#storageTextureView
			);
		}
		this.#previousDimensions = {width, height};
		this.#executeComputePass(
			gpuDevice,
			this.#textureComputePipeline,
			this.#textureComputeBindGroup,
			width, height
		);
		return this.#storageTextureView;
	}

	#getTextureComputeShader() {
		return `
      @group(0) @binding(0) var sourceTextureSampler: sampler;
      @group(0) @binding(1) var sourceTexture : texture_2d<f32>;
      @group(0) @binding(2) var outputTexture : texture_storage_2d<rgba8unorm, write>;
      @compute @workgroup_size(${this.#COMPUTE_WORKGROUP_SIZE_X},${this.#COMPUTE_WORKGROUP_SIZE_Y},${this.#COMPUTE_WORKGROUP_SIZE_Z})
      fn main (
        @builtin(global_invocation_id) global_id : vec3<u32>,
      ){
          let index = vec2<u32>(global_id.xy );
          let dimensions: vec2<u32> = textureDimensions(sourceTexture);
          let dimW = f32(dimensions.x);
          let dimH = f32(dimensions.y);
          let uv = 	vec2<f32>((f32(index.x)+0.5)/dimW,(f32(index.y)+0.5)/dimH);
          var color:vec4<f32> = textureSampleLevel(
            sourceTexture,
            sourceTextureSampler,
            uv,
            0
          );
          textureStore(outputTexture, index, color );
      };
    `;
	}

	#createTextureBindGroupLayout(redGPUContext: RedGPUContext) {
		return redGPUContext.resourceManager.createBindGroupLayout('POST_EFFECT_COPY_TO_STORAGE', {
			entries: [
				{binding: 0, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering',}},
				{binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {}},
				{binding: 2, visibility: GPUShaderStage.COMPUTE, storageTexture: {format: 'rgba8unorm'}},
			]
		});
	}

	#createStorageTexture(gpuDevice: GPUDevice, width: number, height: number) {
		return gpuDevice.createTexture({
			size: {width: width, height: height,},
			format: 'rgba8unorm',
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
			label: `PostEffect_Storage_${width}x${height}_${Date.now()}`,
		});
	}

	#createTextureBindGroup(redGPUContext: RedGPUContext, bindGroupLayout: GPUBindGroupLayout, sourceTextureView: GPUTextureView, storageTextureView: GPUTextureView) {
		return redGPUContext.gpuDevice.createBindGroup({
			layout: bindGroupLayout,
			entries: [
				{binding: 0, resource: new Sampler(redGPUContext).gpuSampler},
				{binding: 1, resource: sourceTextureView},
				{binding: 2, resource: storageTextureView},
			]
		});
	}

	#createTextureComputePipeline(gpuDevice: GPUDevice, shaderModule: GPUShaderModule, bindGroupLayout: GPUBindGroupLayout) {
		return gpuDevice.createComputePipeline({
			layout: gpuDevice.createPipelineLayout({
				bindGroupLayouts: [
					bindGroupLayout,
				]
			}),
			compute: {
				module: shaderModule,
				entryPoint: 'main',
			}
		});
	}

	#executeComputePass(gpuDevice: GPUDevice, pipeline: GPUComputePipeline, bindGroup: GPUBindGroup, width: number, height: number) {
		const commandEncoder = gpuDevice.createCommandEncoder();
		const computePassEncoder = commandEncoder.beginComputePass();
		computePassEncoder.setPipeline(pipeline);
		computePassEncoder.setBindGroup(0, bindGroup);
		computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.#COMPUTE_WORKGROUP_SIZE_X), Math.ceil(height / this.#COMPUTE_WORKGROUP_SIZE_Y));
		computePassEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
	}
}

let temp = mat4.create()
let temp2 = mat4.create()
Object.freeze(PostEffectManager)
export default PostEffectManager
