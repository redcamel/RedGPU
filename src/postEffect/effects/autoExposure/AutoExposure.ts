import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import downsampleLogLuminanceCode from "./wgsl/downsampleLogLuminance.wgsl";
import adaptationCode from "./wgsl/adaptation.wgsl";
import ACamera from "../../../camera/core/ACamera";

/**
 * [KO] 자동 노출(Auto-Exposure) 및 눈 적응(Eye Adaptation)을 수행하는 클래스입니다.
 * [EN] Class that performs auto-exposure and eye adaptation.
 */
class AutoExposure {
    readonly #redGPUContext: RedGPUContext;
    #adaptedEV100Buffer: StorageBuffer;
    #histogramBuffer: StorageBuffer;
    
    #downsamplePipeline: GPUComputePipeline;
    #adaptationPipeline: GPUComputePipeline;
    
    #downsampleBindGroupLayout0: GPUBindGroupLayout;
    #downsampleBindGroupLayout1: GPUBindGroupLayout;
    #adaptationBindGroupLayout0: GPUBindGroupLayout;
    
    #uniformBuffer: UniformBuffer;
    #maxExposureMultiplier: number = 64.0;

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
        
        // [KO] 초기 EV100 값 설정 (0.18 휘도에 해당하는 약 3.9 EV)
        // [EN] Set initial EV100 value (approx. 3.9 EV for 0.18 luminance)
        const initialData = new Float32Array([3.9]);
        this.#adaptedEV100Buffer = new StorageBuffer(this.#redGPUContext, initialData.buffer, 'AutoExposure_AdaptedEV100');
        
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
        const {rawCamera} = view;
        const currentTime = performance.now();
        const deltaTime = this.#prevTime === 0 ? 0.016 : (currentTime - this.#prevTime) / 1000;
        this.#prevTime = currentTime;
        
        const ev100Range = rawCamera.maxEV100 - rawCamera.minEV100;
        
        // Update uniforms (총 14개 필드 순서 유지)
        gpuDevice.queue.writeBuffer(
            this.#uniformBuffer.gpuBuffer, 
            0, 
            new Float32Array([
                deltaTime, 
                1.0, // unused speed (will be removed in shader later)
                rawCamera.adaptationSpeedUp, 
                rawCamera.adaptationSpeedDown, 
                rawCamera.exposureCompensation, 
                rawCamera.minEV100, 
                rawCamera.maxEV100,
                ACamera.CALIBRATION_CONSTANT,
                ev100Range,
                rawCamera.lowPercentile,
                rawCamera.highPercentile,
                1.0 / ev100Range,
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
                { binding: 1, resource: { buffer: this.#adaptedEV100Buffer.gpuBuffer } },
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
            encoder.copyBufferToBuffer(this.#adaptedEV100Buffer.gpuBuffer, 0, this.#readBuffer, 0, 4);
            
            this.#isReading = true;
            gpuDevice.queue.submit([encoder.finish()]);
            
            this.#readBuffer.mapAsync(GPUMapMode.READ).then(() => {
                const data = new Float32Array(this.#readBuffer.getMappedRange());
                const adaptedEV100 = data[0];
                this.#readBuffer.unmap();
                
                // [KO] 물리적 휘도 환산: L = (2^EV100 * K) / 100
                // [EN] Convert to physical luminance: L = (2^EV100 * K) / 100
                const physicalLuminance = (Math.pow(2, adaptedEV100) * ACamera.CALIBRATION_CONSTANT) / 100;

                // [KO] 카메라의 설정을 반영한 최종 노출 배율 계산
                // [EN] Final exposure calculation reflecting camera's settings
                let exposure = (rawCamera.targetLuminance / Math.max(physicalLuminance, 0.0001)) * Math.pow(2, rawCamera.exposureCompensation);
                
                this.#currentExposureMultiplier = Math.min(exposure, this.#maxExposureMultiplier);
                this.#isReading = false;
            });
        } else {
            // 읽기 작업 중이면 컴퓨트 패스만 제출
            gpuDevice.queue.submit([encoder.finish()]);
        }
    }

    get adaptedLuminanceBuffer(): StorageBuffer {
        return this.#adaptedEV100Buffer;
    }
}

export default AutoExposure;
