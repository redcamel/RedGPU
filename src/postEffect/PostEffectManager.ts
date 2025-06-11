import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
import Sampler from "../resources/sampler/Sampler";
import AMultiPassPostEffect from "./core/AMultiPassPostEffect";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
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

	constructor(view: View3D) {
		this.#view = view;
		this.#init()
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

		const { viewRenderTextureManager, redGPUContext } = this.#view;
		const { useMSAA, useFXAA } = redGPUContext;
		const { colorTextureView, colorResolveTextureView, colorTexture } = viewRenderTextureManager;
		const { width, height } = colorTexture;

		// 초기 텍스처 설정 (MSAA 여부에 따라 소스 결정)
		const initialSourceView = useMSAA ? colorResolveTextureView : colorTextureView;
		this.#sourceTextureView = this.#renderToStorageTexture(this.#view, initialSourceView);

		let currentTextureView = this.#sourceTextureView;

		this.#postEffects.forEach(effect => {
			currentTextureView = effect.render(
				this.#view,
				width,
				height,
				currentTextureView
			);
		});

		// FXAA 적용 (필요한 경우)
		if (useFXAA) {
			if (!this.#fxaa) {
				this.#fxaa = new FXAA(this.#view.redGPUContext);
			}

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

	#textureComputeShaderModule: GPUShaderModule
	#textureComputeBindGroup: GPUBindGroup
	#textureComputeBindGroupLayout: GPUBindGroupLayout
	#textureComputePipeline: GPUComputePipeline

	#init() {
		const {redGPUContext} = this.#view;
		const {gpuDevice} = redGPUContext;
		const textureComputeShader = this.#getTextureComputeShader();
		this.#textureComputeShaderModule = gpuDevice.createShaderModule({code: textureComputeShader,});
		this.#textureComputeBindGroupLayout = this.#createTextureBindGroupLayout(redGPUContext);
		this.#textureComputePipeline = this.#createTextureComputePipeline(gpuDevice, this.#textureComputeShaderModule, this.#textureComputeBindGroupLayout)
	}

	#previousDimensions: { width: number, height: number }
	#previousUseMSAA: boolean

	#renderToStorageTexture(view: View3D, sourceTextureView: GPUTextureView) {
		const {redGPUContext, viewRenderTextureManager} = view;
		const {colorTexture} = viewRenderTextureManager;
		const {gpuDevice, useMSAA} = redGPUContext;
		const {width, height} = colorTexture;
		const dimensionsChanged = width !== this.#previousDimensions?.width || height !== this.#previousDimensions?.height;
		const msaaChanged = this.#previousUseMSAA !== useMSAA;
		// 크기가 변경되면 텍스처 재생성
		if (dimensionsChanged) {
			if (this.#storageTexture) {
				this.#storageTexture.destroy();
				this.#storageTexture = null;
			}
			this.#storageTexture = this.#createStorageTexture(gpuDevice, width, height);
			this.#storageTextureView = this.#storageTexture.createView();
		}
		// 크기 변경 또는 MSAA 변경 시 BindGroup 재생성
		if (dimensionsChanged || msaaChanged) {
			this.#textureComputeBindGroup = this.#createTextureBindGroup(
				redGPUContext,
				this.#textureComputeBindGroupLayout,
				sourceTextureView,
				this.#storageTextureView
			);
		}
		this.#previousUseMSAA = useMSAA;
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
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING
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

Object.freeze(PostEffectManager)
export default PostEffectManager
