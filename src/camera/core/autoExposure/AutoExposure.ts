import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import {ASinglePassPostEffectResult} from "../../../postEffect/core/ASinglePassPostEffect";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import downsampleLogLuminanceCode from "./wgsl/downsampleLogLuminance.wgsl";
import adaptationCode from "./wgsl/adaptation.wgsl";
import ACamera from "../ACamera";
import METERING_MODE from "../METERING_MODE";

/**
 * [KO] 자동 노출(Auto-Exposure) 및 눈 적응(Eye Adaptation)을 수행하는 클래스입니다.
 * [EN] Class that performs auto-exposure and eye adaptation.
 */
class AutoExposure {
    readonly #redGPUContext: RedGPUContext;
    readonly #view: View3D;
    #adaptedEV100Buffer: StorageBuffer;
    #histogramBuffer: StorageBuffer;

    #adaptationPipeline: GPUComputePipeline;

    #cachedDownsampleBindGroupLayouts: Map<boolean, GPUBindGroupLayout> = new Map();
    #cachedDownsamplePipelines: Map<boolean, GPUComputePipeline> = new Map();
    #downsampleBindGroupLayout1: GPUBindGroupLayout;
    #adaptationBindGroupLayout0: GPUBindGroupLayout;

    #uniformBuffer: UniformBuffer;

    #currentAdaptedEV100: number = 1.0;
    #readBuffer: GPUBuffer;
    #isReading: boolean = false;

    // [KO] 자동 노출 알고리즘 파라미터 (ToneMappingManager에서 이전됨)
    // [EN] Auto-exposure algorithm parameters (Moved from ToneMappingManager)
    #minEV100: number = 0.0;
    #maxEV100: number = 15.0;
    #adaptationSpeedUp: number = 3.0;
    #adaptationSpeedDown: number = 1.0;
    #lowPercentile: number = 0.8;
    #highPercentile: number = 0.983;
    #maxExposureMultiplier: number = 16.0;
    #meteringMode: METERING_MODE = METERING_MODE.AVERAGE;
    #targetLuminance: number = 0.18;
    #exposureCompensation: number = 0.0;


    constructor(view: View3D) {
        this.#view = view;
        this.#redGPUContext = view.redGPUContext;
        this.#initResources();
        this.#initPipelines();
    }

    /** [KO] 노출 보정(Exposure Compensation) 값을 반환합니다. [EN] Returns the exposure compensation value. */
    get exposureCompensation(): number {
        return this.#exposureCompensation;
    }

    /** [KO] 노출 보정(Exposure Compensation) 값을 설정합니다. [EN] Sets the exposure compensation value. */
    set exposureCompensation(value: number) {
        this.#exposureCompensation = value;
    }

    /** [KO] 목표 휘도를 반환합니다. [EN] Returns the target luminance. */
    get targetLuminance(): number {
        return this.#targetLuminance;
    }

    /** [KO] 목표 휘도를 설정합니다. [EN] Sets the target luminance. */
    set targetLuminance(value: number) {
        this.#targetLuminance = value;
    }

    /** [KO] 자동 노출 최소 EV100을 반환합니다. [EN] Returns the minimum EV100 for auto-exposure. */
    get minEV100(): number {
        return this.#minEV100;
    }

    /** [KO] 자동 노출 최소 EV100을 설정합니다. [EN] Sets the minimum EV100 for auto-exposure. */
    set minEV100(value: number) {
        this.#minEV100 = value;
    }

    /** [KO] 자동 노출 최대 EV100을 반환합니다. [EN] Returns the maximum EV100 for auto-exposure. */
    get maxEV100(): number {
        return this.#maxEV100;
    }

    /** [KO] 자동 노출 최대 EV100을 설정합니다. [EN] Sets the maximum EV100 for auto-exposure. */
    set maxEV100(value: number) {
        this.#maxEV100 = value;
    }

    /** [KO] 눈 적응 속도(밝아질 때)를 반환합니다. [EN] Returns the eye adaptation speed (brightening). */
    get adaptationSpeedUp(): number {
        return this.#adaptationSpeedUp;
    }

    /** [KO] 눈 적응 속도(밝아질 때)를 설정합니다. [EN] Sets the eye adaptation speed (brightening). */
    set adaptationSpeedUp(value: number) {
        this.#adaptationSpeedUp = value;
    }

    /** [KO] 눈 적응 속도(어두워질 때)를 반환합니다. [EN] Returns the eye adaptation speed (darkening). */
    get adaptationSpeedDown(): number {
        return this.#adaptationSpeedDown;
    }

    /** [KO] 눈 적응 속도(어두워질 때)를 설정합니다. [EN] Sets the eye adaptation speed (darkening). */
    set adaptationSpeedDown(value: number) {
        this.#adaptationSpeedDown = value;
    }

    /** [KO] 히스토그램 분석 범위(하위 퍼센트 제외)를 반환합니다. [EN] Returns the histogram analysis range (exclude bottom percentile). */
    get lowPercentile(): number {
        return this.#lowPercentile;
    }

    /** [KO] 히스토그램 분석 범위(하위 퍼센트 제외)를 설정합니다. [EN] Sets the histogram analysis range (exclude bottom percentile). */
    set lowPercentile(value: number) {
        this.#lowPercentile = value;
    }

    /** [KO] 히스토그램 분석 범위(상위 퍼센트 제외)를 반환합니다. [EN] Returns the histogram analysis range (exclude top percentile). */
    get highPercentile(): number {
        return this.#highPercentile;
    }

    /** [KO] 히스토그램 분석 범위(상위 퍼센트 제외)를 설정합니다. [EN] Sets the histogram analysis range (exclude top percentile). */
    set highPercentile(value: number) {
        this.#highPercentile = value;
    }

    /** [KO] 자동 노출의 최대 증폭 배율을 반환합니다. [EN] Returns the maximum exposure multiplier for auto-exposure. */
    get maxExposureMultiplier(): number {
        return this.#maxExposureMultiplier;
    }

    /** [KO] 자동 노출의 최대 증폭 배율을 설정합니다. (기본값: 16.0) [EN] Sets the maximum exposure multiplier for auto-exposure. (Default: 16.0) */
    set maxExposureMultiplier(value: number) {
        this.#maxExposureMultiplier = value;
    }

    /** [KO] 자동 노출의 측광 모드(Metering Mode)를 반환합니다. [EN] Returns the metering mode for auto-exposure. */
    get meteringMode(): METERING_MODE {
        return this.#meteringMode;
    }

    /** [KO] 자동 노출의 측광 모드(Metering Mode)를 설정합니다. [EN] Sets the metering mode for auto-exposure. */
    set meteringMode(value: METERING_MODE) {
        this.#meteringMode = value;
    }

    /**
     * [KO] 현재 적응된 노출 배율(preExposure)을 반환합니다.
     * [EN] Returns the currently adapted exposure multiplier (preExposure).
     */
    get preExposure(): number {
        const {rawCamera} = this.#view;
        return this.#calculatePreExposure(rawCamera.ev100, this.#exposureCompensation);
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

    get adaptedLuminanceBuffer(): StorageBuffer {
        return this.#adaptedEV100Buffer;
    }

    render(view: View3D, sourceTextureInfo: ASinglePassPostEffectResult) {
        const {gpuDevice, antialiasingManager} = this.#redGPUContext;
        const {useMSAA} = antialiasingManager;
        const {width, height} = view.viewRenderTextureManager.gBufferColorTexture;
        const {rawCamera, renderViewStateData} = view;
        const {deltaTime} = renderViewStateData;

        const ev100Range = this.#maxEV100 - this.#minEV100;

        // [KO] 현재 프레임에 적용되어 있는 최종 노출값 계산 (View3D와 동일한 공식 사용)
        // [EN] Calculate the final exposure value applied to the current frame (using the same formula as View3D)
        const currentPreExposure = this.#calculatePreExposure(rawCamera.ev100, this.#exposureCompensation);

        // Update uniforms (총 17개 필드로 확장)
        gpuDevice.queue.writeBuffer(
            this.#uniformBuffer.gpuBuffer,
            0,
            new Float32Array([
                deltaTime,
                this.#targetLuminance,
                this.#adaptationSpeedUp,
                this.#adaptationSpeedDown,
                this.#exposureCompensation,
                this.#minEV100,
                this.#maxEV100,
                ACamera.CALIBRATION_CONSTANT,
                ev100Range,
                this.#lowPercentile,
                this.#highPercentile,
                1.0 / ev100Range,
                width,
                height,
                currentPreExposure,
                this.#maxExposureMultiplier,
                this.#meteringMode
            ])
        );

        const encoder = gpuDevice.createCommandEncoder({label: 'AutoExposure_CommandEncoder'});

        // [KO] 히스토그램 버퍼 명시적 초기화 [EN] Explicitly clear histogram buffer
        encoder.clearBuffer(this.#histogramBuffer.gpuBuffer);

        // Pass 1: Generate Histogram
        const pipeline = this.#getDownsamplePipeline(useMSAA);
        const downsampleBindGroup0 = gpuDevice.createBindGroup({
            layout: this.#getDownsampleBindGroupLayout0(useMSAA),
            entries: [
                {binding: 0, resource: sourceTextureInfo.textureView},
                {binding: 1, resource: view.viewRenderTextureManager.depthTextureView}
            ]
        });
        const downsampleBindGroup1 = gpuDevice.createBindGroup({
            layout: this.#downsampleBindGroupLayout1,
            entries: [
                {binding: 0, resource: {buffer: this.#histogramBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#uniformBuffer.gpuBuffer}}
            ]
        });

        const pass1 = encoder.beginComputePass();
        pass1.setPipeline(pipeline);
        pass1.setBindGroup(0, downsampleBindGroup0);
        pass1.setBindGroup(1, downsampleBindGroup1);
        pass1.dispatchWorkgroups(Math.ceil(width / 16), Math.ceil(height / 16), 1);
        pass1.end();

        // Pass 2: Average Histogram and Adapt
        const adaptationBindGroup0 = gpuDevice.createBindGroup({
            layout: this.#adaptationBindGroupLayout0,
            entries: [
                {binding: 0, resource: {buffer: this.#histogramBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#adaptedEV100Buffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.#uniformBuffer.gpuBuffer}}
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

    /**
     * [KO] EV100 기반으로 물리적 노출 배율(preExposure)을 계산합니다. (UE5 표준 물리 노출 공식)
     * [EN] Calculates physical exposure multiplier (preExposure) based on EV100. (UE5 standard physical exposure formula)
     * @param ev100 - [KO] 물리적 노출 지수 [EN] Physical exposure value (EV100)
     * @param exposureCompensation - [KO] 노출 보정 값 [EN] Exposure compensation value
     * @returns [KO] 계산된 노출 배율 [EN] Calculated exposure multiplier
     */
    #calculatePreExposure(ev100: number, exposureCompensation: number): number {
        // [KO] UE5 표준 물리 노출 공식 적용: 1 / (1.2 * 2^EV100) * 2^ExposureCompensation
        // [EN] Apply UE5 standard physical exposure formula: 1 / (1.2 * 2^EV100) * 2^ExposureCompensation
        // [KO] 여기서 1.2는 언리얼의 노출 보정 계수(K)이며, ACamera.CALIBRATION_CONSTANT(12.5)와 조합되어 최종 휘도를 결정합니다.
        // [EN] Here, 1.2 is Unreal's exposure calibration factor, used in combination with ACamera.CALIBRATION_CONSTANT (12.5) to determine final luminance.
        return Math.pow(2, exposureCompensation) / (1.2 * Math.pow(2, ev100));
    }

    #initResources() {
        const {gpuDevice} = this.#redGPUContext;

        // [KO] 초기 EV100 값 설정 (기본적으로 1.0으로 시작하거나 이전 프레임의 적응 값을 유지합니다)
        // [EN] Set initial EV100 value (starts at 1.0 by default or maintains the adapted value from the previous frame)
        const initialData = new Float32Array([1.0]);
        this.#adaptedEV100Buffer = new StorageBuffer(this.#redGPUContext, initialData.buffer, 'AutoExposure_AdaptedEV100');

        // [KO] 히스토그램 버퍼 (256 bins) [EN] Histogram buffer (256 bins)
        this.#histogramBuffer = new StorageBuffer(this.#redGPUContext, new Uint32Array(256).buffer, 'AutoExposure_HistogramBuffer');

        // Readback buffer
        this.#readBuffer = gpuDevice.createBuffer({
            size: 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            label: 'AutoExposure_ReadBuffer'
        });

        // [KO] 통합 유니폼 데이터 구성 (총 18개 요소) [EN] Unified uniform data configuration (total 18 elements)
        const uniformData = new Float32Array(18);
        this.#uniformBuffer = new UniformBuffer(this.#redGPUContext, uniformData.buffer, 'AutoExposure_UniformBuffer');
    }

    #initPipelines() {
        const {gpuDevice, resourceManager} = this.#redGPUContext;

        const adaptationModule = resourceManager.createGPUShaderModule('AutoExposure_Adaptation', {code: adaptationCode});

        this.#downsampleBindGroupLayout1 = resourceManager.createBindGroupLayout('AutoExposure_Downsample_BGL1', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        this.#adaptationBindGroupLayout0 = resourceManager.createBindGroupLayout('AutoExposure_Adaptation_BGL0', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        this.#adaptationPipeline = gpuDevice.createComputePipeline({
            label: 'AutoExposure_Adaptation_Pipeline',
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.#adaptationBindGroupLayout0]}),
            compute: {module: adaptationModule, entryPoint: 'main'}
        });
    }

    #getDownsamplePipeline(useMSAA: boolean): GPUComputePipeline {
        if (this.#cachedDownsamplePipelines.has(useMSAA)) return this.#cachedDownsamplePipelines.get(useMSAA);

        const {gpuDevice, resourceManager} = this.#redGPUContext;
        const shaderCode = useMSAA
            ? downsampleLogLuminanceCode.replace('texture_depth_2d', 'texture_depth_multisampled_2d')
            : downsampleLogLuminanceCode;

        const module = resourceManager.createGPUShaderModule(`AutoExposure_Downsample_${useMSAA ? 'MSAA' : 'NonMSAA'}`, {code: shaderCode});
        const layout = this.#getDownsampleBindGroupLayout0(useMSAA);

        const pipeline = gpuDevice.createComputePipeline({
            label: `AutoExposure_Downsample_Pipeline_${useMSAA ? 'MSAA' : 'NonMSAA'}`,
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [layout, this.#downsampleBindGroupLayout1]}),
            compute: {module, entryPoint: 'main'}
        });

        this.#cachedDownsamplePipelines.set(useMSAA, pipeline);
        return pipeline;
    }

    #getDownsampleBindGroupLayout0(useMSAA: boolean): GPUBindGroupLayout {
        if (this.#cachedDownsampleBindGroupLayouts.has(useMSAA)) return this.#cachedDownsampleBindGroupLayouts.get(useMSAA);

        const {gpuDevice} = this.#redGPUContext;
        const layout = gpuDevice.createBindGroupLayout({
            label: `AutoExposure_Downsample_BGL0_${useMSAA ? 'MSAA' : 'NonMSAA'}`,
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'depth', multisampled: useMSAA}}
            ]
        });

        this.#cachedDownsampleBindGroupLayouts.set(useMSAA, layout);
        return layout;
    }
}

export default AutoExposure;
