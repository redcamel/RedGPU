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

    #prevTime: number = 0;

    #currentAdaptedEV100: number = 3.9;
    #readBuffer: GPUBuffer;
    #isReading: boolean = false;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#initResources();
        this.#initPipelines();
    }

    /**
     * [KO] 현재 적응된 EV100 값을 반환합니다.
     * [EN] Returns the currently adapted EV100 value.
     */
    get currentAdaptedEV100(): number {
        return this.#currentAdaptedEV100;
    }

    /**
     * [KO] 현재 적응된 EV100 값을 설정합니다. (GPU 버퍼도 함께 갱신)
     * [EN] Sets the currently adapted EV100 value. (Also updates the GPU buffer)
     */
    set currentAdaptedEV100(value: number) {
        this.#currentAdaptedEV100 = value;
        const initialData = new Float32Array([value]);
        this.#redGPUContext.gpuDevice.queue.writeBuffer(this.#adaptedEV100Buffer.gpuBuffer, 0, initialData.buffer);
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
        
        // [KO] 통합 유니폼 데이터 구성 (총 16개 요소) [EN] Unified uniform data configuration (total 16 elements)
        const uniformData = new Float32Array(16);
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
        const {rawCamera, toneMappingManager} = view;
        const currentTime = performance.now();
        const deltaTime = this.#prevTime === 0 ? 0.016 : (currentTime - this.#prevTime) / 1000;
        this.#prevTime = currentTime;
        
        const ev100Range = toneMappingManager.maxEV100 - toneMappingManager.minEV100;
        
        // [KO] 현재 프레임에 적용되어 있는 최종 노출값 계산 (View3D와 동일한 공식 사용)
        // [EN] Calculate the final exposure value applied to the current frame (using the same formula as View3D)
        const currentPreExposure = (() => {
            const ev100 = view.postEffectManager.useAutoExposure
                ? this.currentAdaptedEV100
                : rawCamera.ev100;
            // [KO] UE5 표준 물리 노출 공식 적용: (100 * targetLuminance * 2^ExposureCompensation) / (K * 2^EV100)
            // [EN] Apply UE5 standard physical exposure formula: (100 * targetLuminance * 2^ExposureCompensation) / (K * 2^EV100)
            return (100 * toneMappingManager.targetLuminance * Math.pow(2, toneMappingManager.exposureCompensation)) / (ACamera.CALIBRATION_CONSTANT * Math.pow(2, ev100));
        })();

        // Update uniforms (총 16개 필드 순서 유지)
        gpuDevice.queue.writeBuffer(
            this.#uniformBuffer.gpuBuffer, 
            0, 
            new Float32Array([
                deltaTime, 
                toneMappingManager.targetLuminance, 
                toneMappingManager.adaptationSpeedUp, 
                toneMappingManager.adaptationSpeedDown, 
                toneMappingManager.exposureCompensation, 
                toneMappingManager.minEV100, 
                toneMappingManager.maxEV100,
                ACamera.CALIBRATION_CONSTANT,
                ev100Range,
                toneMappingManager.lowPercentile,
                toneMappingManager.highPercentile,
                1.0 / ev100Range,
                width,
                height,
                currentPreExposure,
                toneMappingManager.maxExposureMultiplier
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
                this.#currentAdaptedEV100 = data[0];
                this.#readBuffer.unmap();
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
