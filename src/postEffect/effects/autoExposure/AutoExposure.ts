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
    #histogramBuffer: StorageBuffer;
    
    #downsamplePipeline: GPUComputePipeline;
    #adaptationPipeline: GPUComputePipeline;
    
    #downsampleBindGroupLayout0: GPUBindGroupLayout;
    #downsampleBindGroupLayout1: GPUBindGroupLayout;
    #adaptationBindGroupLayout0: GPUBindGroupLayout;
    
    #uniformBuffer: UniformBuffer;
    #speed: number = 3.0;
    #adjustmentSpeedUp: number = 2.0;
    #adjustmentSpeedDown: number = 1.0;
    #targetLuminance: number = 0.18;
    #minLuminance: number = 0.03;
    #maxLuminance: number = 2.0;
    #maxExposureMultiplier: number = 8.0;

    // [KO] 히스토그램 파라미터 [EN] Histogram parameters
    #minLogLum: number = -10.0;
    #maxLogLum: number = 10.0;
    #lowPercentile: number = 0.1;  // [KO] 하위 10% 제외 [EN] Exclude bottom 10%
    #highPercentile: number = 0.9; // [KO] 상위 10% 제외 [EN] Exclude top 10%
    
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
        
        // [KO] 히스토그램 버퍼 (64 bins) [EN] Histogram buffer (64 bins)
        this.#histogramBuffer = new StorageBuffer(this.#redGPUContext, new Uint32Array(64).buffer, 'AutoExposure_HistogramBuffer');

        // Readback buffer
        this.#readBuffer = gpuDevice.createBuffer({
            size: 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            label: 'AutoExposure_ReadBuffer'
        });
        
        // [KO] 통합 유니폼 데이터 구성 (총 14개 요소) [EN] Unified uniform data configuration (total 14 elements)
        const uniformData = new Float32Array(14);
        this.#uniformBuffer = new UniformBuffer(this.#redGPUContext, uniformData.buffer, 'AutoExposure_UniformBuffer');
    }

    #initPipelines() {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
        
        const downsampleModule = resourceManager.createGPUShaderModule('AutoExposure_Downsample', { code: downsampleLogLuminanceCode });
        const adaptationModule = resourceManager.createGPUShaderModule('AutoExposure_Adaptation', { code: adaptationCode });
        
        this.#downsampleBindGroupLayout0 = resourceManager.createBindGroupLayout('AutoExposure_Downsample_BGL0', {
            entries: [{ binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {} }]
        });
        this.#downsampleBindGroupLayout1 = resourceManager.createBindGroupLayout('AutoExposure_Downsample_BGL1', {
            entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } }
            ]
        });
        
        this.#adaptationBindGroupLayout0 = resourceManager.createBindGroupLayout('AutoExposure_Adaptation_BGL0', {
            entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } }
            ]
        });
        
        this.#downsamplePipeline = gpuDevice.createComputePipeline({
            label: 'AutoExposure_Downsample_Pipeline',
            layout: gpuDevice.createPipelineLayout({ bindGroupLayouts: [this.#downsampleBindGroupLayout0, this.#downsampleBindGroupLayout1] }),
            compute: { module: downsampleModule, entryPoint: 'main' }
        });
        
        this.#adaptationPipeline = gpuDevice.createComputePipeline({
            label: 'AutoExposure_Adaptation_Pipeline',
            layout: gpuDevice.createPipelineLayout({ bindGroupLayouts: [this.#adaptationBindGroupLayout0] }),
            compute: { module: adaptationModule, entryPoint: 'main' }
        });
    }

    render(view: View3D, sourceTextureInfo: ASinglePassPostEffectResult) {
        const {gpuDevice} = this.#redGPUContext;
        const {width, height} = view.viewRenderTextureManager.gBufferColorTexture;
        const currentTime = performance.now();
        const deltaTime = this.#prevTime === 0 ? 0.016 : (currentTime - this.#prevTime) / 1000;
        this.#prevTime = currentTime;
        
        const logLumRange = this.#maxLogLum - this.#minLogLum;
        
        // Update uniforms (총 14개 필드 순서 유지)
        gpuDevice.queue.writeBuffer(
            this.#uniformBuffer.gpuBuffer, 
            0, 
            new Float32Array([
                deltaTime, 
                this.#speed, 
                this.#adjustmentSpeedUp, 
                this.#adjustmentSpeedDown, 
                this.#targetLuminance, 
                this.#minLuminance, 
                this.#maxLuminance,
                this.#minLogLum,
                logLumRange,
                this.#lowPercentile,
                this.#highPercentile,
                1.0 / logLumRange,
                width,
                height
            ])
        );
        
        const encoder = gpuDevice.createCommandEncoder({ label: 'AutoExposure_CommandEncoder' });
        
        // Pass 1: Generate Histogram
        const downsampleBindGroup0 = gpuDevice.createBindGroup({
            layout: this.#downsampleBindGroupLayout0,
            entries: [{ binding: 0, resource: sourceTextureInfo.textureView }]
        });
        const downsampleBindGroup1 = gpuDevice.createBindGroup({
            layout: this.#downsampleBindGroupLayout1,
            entries: [
                { binding: 0, resource: { buffer: this.#histogramBuffer.gpuBuffer } },
                { binding: 1, resource: { buffer: this.#uniformBuffer.gpuBuffer } }
            ]
        });
        
        const pass1 = encoder.beginComputePass();
        pass1.setPipeline(this.#downsamplePipeline);
        pass1.setBindGroup(0, downsampleBindGroup0);
        pass1.setBindGroup(1, downsampleBindGroup1);
        pass1.dispatchWorkgroups(Math.ceil(width / 16), Math.ceil(height / 16), 1);
        pass1.end();
        
        // Pass 2: Average Histogram and Adapt
        const adaptationBindGroup0 = gpuDevice.createBindGroup({
            layout: this.#adaptationBindGroupLayout0,
            entries: [
                { binding: 0, resource: { buffer: this.#histogramBuffer.gpuBuffer } },
                { binding: 1, resource: { buffer: this.#adaptedLuminanceBuffer.gpuBuffer } },
                { binding: 2, resource: { buffer: this.#uniformBuffer.gpuBuffer } }
            ]
        });
        
        const pass2 = encoder.beginComputePass();
        pass2.setPipeline(this.#adaptationPipeline);
        pass2.setBindGroup(0, adaptationBindGroup0);
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
                let exposure = this.#targetLuminance / Math.max(adaptedLum, 0.0001);
                this.#currentExposureMultiplier = Math.min(exposure, this.#maxExposureMultiplier);
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
