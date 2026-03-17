import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import downsampleLogLuminanceCode from "./wgsl/downsampleLogLuminance.wgsl";
import adaptationCode from "./wgsl/adaptation.wgsl";

/**
 * [KO] 자동 노출(Auto-Exposure) 및 눈 적응(Eye Adaptation)을 수행하는 클래스입니다.
 * [EN] Class that performs auto-exposure and eye adaptation.
 */
class AutoExposure {
    readonly #redGPUContext: RedGPUContext;
    #adaptedLuminanceBuffer: StorageBuffer;
    #intermediateLuminanceTexture: GPUTexture;
    #intermediateLuminanceTextureView: GPUTextureView;
    
    #downsamplePipeline: GPUComputePipeline;
    #adaptationPipeline: GPUComputePipeline;
    
    #downsampleBindGroupLayout0: GPUBindGroupLayout;
    #downsampleBindGroupLayout1: GPUBindGroupLayout;
    #adaptationBindGroupLayout0: GPUBindGroupLayout;
    #adaptationBindGroupLayout1: GPUBindGroupLayout;
    
    #uniformBuffer: UniformBuffer;
    #speed: number = 1.0;
    #adjustmentSpeedUp: number = 2.0;
    #adjustmentSpeedDown: number = 1.0;
    #targetLuminance: number = 0.18;
    
    #prevTime: number = 0;
    #currentExposureMultiplier: number = 1.0;
    #readBuffer: GPUBuffer;
    #isReading: boolean = false;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#initResources();
        this.#initPipelines();
    }

    get currentExposureMultiplier(): number {
        return this.#currentExposureMultiplier;
    }

    #initResources() {
        const {gpuDevice} = this.#redGPUContext;
        // Adapted luminance buffer (initialized to target luminance)
        const initialData = new Float32Array([this.#targetLuminance]);
        this.#adaptedLuminanceBuffer = new StorageBuffer(this.#redGPUContext, initialData.buffer, 'AutoExposure_AdaptedLuminance');
        
        // Readback buffer
        this.#readBuffer = gpuDevice.createBuffer({
            size: 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            label: 'AutoExposure_ReadBuffer'
        });

        // Intermediate 16x16 luminance texture
        this.#intermediateLuminanceTexture = this.#redGPUContext.resourceManager.createManagedTexture({
            size: [16, 16, 1],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
            label: 'AutoExposure_IntermediateLuminance'
        });
        this.#intermediateLuminanceTextureView = this.#intermediateLuminanceTexture.createView();
        
        // Uniform buffer
        const uniformData = new Float32Array([this.#speed, this.#adjustmentSpeedUp, this.#adjustmentSpeedDown, this.#targetLuminance]);
        this.#uniformBuffer = new UniformBuffer(this.#redGPUContext, uniformData.buffer, 'AutoExposure_UniformBuffer');
    }

    #initPipelines() {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
        
        const downsampleModule = resourceManager.createGPUShaderModule('AutoExposure_Downsample', { code: downsampleLogLuminanceCode });
        const adaptationModule = resourceManager.createGPUShaderModule('AutoExposure_Adaptation', { code: adaptationCode });
        
        // 리플렉션 오류를 피하기 위해 수동으로 레이아웃 정의 (Manual Layout Definition)
        this.#downsampleBindGroupLayout0 = resourceManager.createBindGroupLayout('AutoExposure_Downsample_BGL0', {
            entries: [{ binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {} }]
        });
        this.#downsampleBindGroupLayout1 = resourceManager.createBindGroupLayout('AutoExposure_Downsample_BGL1', {
            entries: [{ binding: 0, visibility: GPUShaderStage.COMPUTE, storageTexture: { format: 'rgba16float', access: 'write-only' } }]
        });
        
        this.#adaptationBindGroupLayout0 = resourceManager.createBindGroupLayout('AutoExposure_Adaptation_BGL0', {
            entries: [{ binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {} }]
        });
        this.#adaptationBindGroupLayout1 = resourceManager.createBindGroupLayout('AutoExposure_Adaptation_BGL1', {
            entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } }
            ]
        });
        
        this.#downsamplePipeline = gpuDevice.createComputePipeline({
            label: 'AutoExposure_Downsample_Pipeline',
            layout: gpuDevice.createPipelineLayout({ bindGroupLayouts: [this.#downsampleBindGroupLayout0, this.#downsampleBindGroupLayout1] }),
            compute: { module: downsampleModule, entryPoint: 'main' }
        });
        
        this.#adaptationPipeline = gpuDevice.createComputePipeline({
            label: 'AutoExposure_Adaptation_Pipeline',
            layout: gpuDevice.createPipelineLayout({ bindGroupLayouts: [this.#adaptationBindGroupLayout0, this.#adaptationBindGroupLayout1] }),
            compute: { module: adaptationModule, entryPoint: 'main' }
        });
    }

    render(view: View3D, sourceTextureInfo: ASinglePassPostEffectResult) {
        const {gpuDevice} = this.#redGPUContext;
        const currentTime = performance.now();
        const deltaTime = this.#prevTime === 0 ? 0.016 : (currentTime - this.#prevTime) / 1000;
        this.#prevTime = currentTime;
        
        // Update uniforms
        gpuDevice.queue.writeBuffer(this.#uniformBuffer.gpuBuffer, 0, new Float32Array([deltaTime]));
        
        const encoder = gpuDevice.createCommandEncoder({ label: 'AutoExposure_CommandEncoder' });
        
        // Pass 1: Downsample to 16x16 log-luminance
        const downsampleBindGroup0 = gpuDevice.createBindGroup({
            layout: this.#downsampleBindGroupLayout0,
            entries: [{ binding: 0, resource: sourceTextureInfo.textureView }]
        });
        const downsampleBindGroup1 = gpuDevice.createBindGroup({
            layout: this.#downsampleBindGroupLayout1,
            entries: [{ binding: 0, resource: this.#intermediateLuminanceTextureView }]
        });
        
        const pass1 = encoder.beginComputePass();
        pass1.setPipeline(this.#downsamplePipeline);
        pass1.setBindGroup(0, downsampleBindGroup0);
        pass1.setBindGroup(1, downsampleBindGroup1);
        pass1.dispatchWorkgroups(1, 1, 1);
        pass1.end();
        
        // Pass 2: Reduce to 1x1 and Adapt
        const adaptationBindGroup0 = gpuDevice.createBindGroup({
            layout: this.#adaptationBindGroupLayout0,
            entries: [{ binding: 0, resource: this.#intermediateLuminanceTextureView }]
        });
        const adaptationBindGroup1 = gpuDevice.createBindGroup({
            layout: this.#adaptationBindGroupLayout1,
            entries: [
                { binding: 0, resource: { buffer: this.#adaptedLuminanceBuffer.gpuBuffer } },
                { binding: 1, resource: { buffer: this.#uniformBuffer.gpuBuffer } }
            ]
        });
        
        const pass2 = encoder.beginComputePass();
        pass2.setPipeline(this.#adaptationPipeline);
        pass2.setBindGroup(0, adaptationBindGroup0);
        pass2.setBindGroup(1, adaptationBindGroup1);
        pass2.dispatchWorkgroups(1, 1, 1);
        pass2.end();
        
        // 오직 읽기 작업 중이 아닐 때만 GPU 버퍼에서 읽기 전용 버퍼로 복사 및 비동기 읽기 시작
        if (!this.#isReading) {
            encoder.copyBufferToBuffer(this.#adaptedLuminanceBuffer.gpuBuffer, 0, this.#readBuffer, 0, 4);
            
            this.#isReading = true;
            gpuDevice.queue.submit([encoder.finish()]);
            
            this.#readBuffer.mapAsync(GPUMapMode.READ).then(() => {
                const data = new Float32Array(this.#readBuffer.getMappedRange());
                const adaptedLum = data[0];
                this.#readBuffer.unmap();
                
                // finalExposure = target / average
                this.#currentExposureMultiplier = this.#targetLuminance / Math.max(adaptedLum, 0.0001);
                this.#isReading = false;
            });
        } else {
            // 읽기 작업 중이면 컴퓨트 패스만 제출
            gpuDevice.queue.submit([encoder.finish()]);
        }
    }

    get adaptedLuminanceBuffer(): StorageBuffer {
        return this.#adaptedLuminanceBuffer;
    }
}

export default AutoExposure;
