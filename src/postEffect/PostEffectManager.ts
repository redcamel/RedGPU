import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
import Sampler from "../resources/sampler/Sampler";
import AMultiPassPostEffect from "./core/AMultiPassPostEffect";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";

class PostEffectManager {
    readonly #view: View3D
    #effectList = []
    #sourceTexture: GPUTexture
    #sourceTextureView: GPUTextureView
    #WORK_SIZE_X = 16
    #WORK_SIZE_Y = 4
    #WORK_SIZE_Z = 1

    constructor(view: View3D) {
        this.#view = view;
    }

    get view(): View3D {
        return this.#view;
    }

    get effectList(): any[] {
        return this.#effectList;
    }

    addEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        this.#effectList.push(v)
    }

    addEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        //TODO
    }

    getEffectAt(index: number): ASinglePassPostEffect | AMultiPassPostEffect {
        return this.#effectList[index]
    }

    removeEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        //TODO
    }

    removeEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        //TODO
    }

    removeAllEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        this.#effectList.forEach(effect => {
            effect.clear()
        })
        this.#effectList.length = 0
    }

    render() {
        const {colorResolveTextureView, colorTexture} = this.#view.viewRenderTextureManager
        //
        this.#sourceTextureView = this.#copyToStorage(this.#view, colorResolveTextureView)
        let sourceTextureView = this.#sourceTextureView
        const {width, height} = colorTexture
        this.#effectList.forEach(effect => {
            sourceTextureView = effect.render(
                this.#view,
                width,
                height,
                sourceTextureView
            )
        })
        return sourceTextureView
    }

    clear() {
        this.#effectList.forEach(effect => {
            effect.clear()
        })
    }

    #copyToStorage(view: View3D, sourceTextureView: GPUTextureView) {
        if (this.#sourceTexture) {
            this.#sourceTexture.destroy();
            this.#sourceTexture = null;
        }
        const {redGPUContext, viewRenderTextureManager} = view;
        const {colorTexture} = viewRenderTextureManager;
        const {gpuDevice} = redGPUContext;
        const {width, height} = colorTexture;
        const computeCode = this.#getComputeCode();
        const computeModule = gpuDevice.createShaderModule({code: computeCode,});
        const bindGroupLayout_compute = this.#createBindGroupLayout(redGPUContext);
        this.#sourceTexture = this.#createTexture(gpuDevice, width, height);
        const copyTextureView = this.#sourceTexture.createView();
        this.#runComputePass(
            gpuDevice,
            this.#createComputePipeline(gpuDevice, computeModule, bindGroupLayout_compute),
            this.#createBindGroup(redGPUContext, bindGroupLayout_compute, sourceTextureView, copyTextureView),
            width, height
        );
        return copyTextureView;
    }

    #getComputeCode() {
        return `
      @group(0) @binding(0) var sourceTextureSampler: sampler;
      @group(0) @binding(1) var sourceTexture : texture_2d<f32>;
      @group(0) @binding(2) var outputTexture : texture_storage_2d<rgba8unorm, write>;
      @compute @workgroup_size(${this.#WORK_SIZE_X},${this.#WORK_SIZE_Y},${this.#WORK_SIZE_Z})
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

    #createBindGroupLayout(redGPUContext: RedGPUContext) {
        return redGPUContext.resourceManager.createBindGroupLayout('POST_EFFECT_COPY_TO_STORAGE', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering',}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, storageTexture: {format: 'rgba8unorm'}},
            ]
        });
    }

    #createTexture(gpuDevice: GPUDevice, width: number, height: number) {
        return gpuDevice.createTexture({
            size: {width: width, height: height,},
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING
        });
    }

    #createBindGroup(redGPUContext: RedGPUContext, bindGroupLayout: GPUBindGroupLayout, sourceTextureView: GPUTextureView, copyTextureView: GPUTextureView) {
        return redGPUContext.gpuDevice.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {binding: 0, resource: new Sampler(redGPUContext).gpuSampler},
                {binding: 1, resource: sourceTextureView},
                {binding: 2, resource: copyTextureView},
            ]
        });
    }

    #createComputePipeline(gpuDevice: GPUDevice, cModule: GPUShaderModule, bindGroupLayout: GPUBindGroupLayout) {
        return gpuDevice.createComputePipeline({
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [
                    bindGroupLayout,
                ]
            }),
            compute: {
                module: cModule,
                entryPoint: 'main',
            }
        });
    }

    #runComputePass(gpuDevice: GPUDevice, pipeline: GPUComputePipeline, bindGroup: GPUBindGroup, width: number, height: number) {
        const commandEncoder = gpuDevice.createCommandEncoder();
        const computePassEncoder = commandEncoder.beginComputePass();
        computePassEncoder.setPipeline(pipeline);
        computePassEncoder.setBindGroup(0, bindGroup);
        computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.#WORK_SIZE_X), Math.ceil(height / this.#WORK_SIZE_Y));
        computePassEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
    }
}

Object.freeze(PostEffectManager)
export default PostEffectManager
