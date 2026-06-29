import View3D from "../../../display/view/View3D";
import {IPostEffectResult} from "../../../postEffect/core/types";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import downsampleLogLuminanceCode from "./wgsl/downsampleLogLuminance.wgsl";
import adaptationCode from "./wgsl/adaptation.wgsl";
import ACamera from "../ACamera";
import METERING_MODE from "../METERING_MODE";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import copyGPUBuffer from "../../../utils/copyGPUBuffer";
import GBUFFER_TYPE from "../../../display/view/core/GBUFFER_TYPE";
import RedGPUObject from "../../../base/RedGPUObject";


/**
 * [KO] 자동 노출(Auto-Exposure) 및 눈 적응(Eye Adaptation)을 수행하는 클래스입니다.
 * [EN] Class that performs auto-exposure and eye adaptation.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
class AutoExposure extends RedGPUObject {
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

    // 캐싱 관련 필드
    #prevMSAAID: string;
    #prevWidth: number;
    #prevHeight: number;
    #downsampleBindGroup0Cache: WeakMap<GPUTexture, { swap0: GPUBindGroup, swap1: GPUBindGroup }> = new WeakMap();
    #downsampleBindGroup1: GPUBindGroup;
    #adaptationBindGroup0: GPUBindGroup;

    constructor(view: View3D) {
        super(view.redGPUContext)
        this.#view = view;
        this.#initResources();
        this.#initPipelines();
    }

    /**
     * [KO] 노출 보정(Exposure Compensation) 값을 반환합니다.
     * [EN] Returns the exposure compensation value.
     *
     * @returns
     * [KO] 노출 보정 값
     * [EN] Exposure compensation value
     */
    get exposureCompensation(): number {
        return this.#exposureCompensation;
    }

    /**
     * [KO] 노출 보정(Exposure Compensation) 값을 설정합니다.
     * [EN] Sets the exposure compensation value.
     *
     * @param value -
     * [KO] 설정할 노출 보정 값
     * [EN] Exposure compensation value to set
     */
    set exposureCompensation(value: number) {
        this.#exposureCompensation = value;
    }

    /**
     * [KO] 목표 휘도를 반환합니다.
     * [EN] Returns the target luminance.
     *
     * @returns
     * [KO] 목표 휘도 값
     * [EN] Target luminance value
     */
    get targetLuminance(): number {
        return this.#targetLuminance;
    }

    /**
     * [KO] 목표 휘도를 설정합니다.
     * [EN] Sets the target luminance.
     *
     * @param value -
     * [KO] 설정할 목표 휘도 값
     * [EN] Target luminance value to set
     */
    set targetLuminance(value: number) {
        this.#targetLuminance = value;
    }

    /**
     * [KO] 자동 노출 최소 EV100을 반환합니다.
     * [EN] Returns the minimum EV100 for auto-exposure.
     *
     * @returns
     * [KO] 최소 EV100 값
     * [EN] Minimum EV100 value
     */
    get minEV100(): number {
        return this.#minEV100;
    }

    /**
     * [KO] 자동 노출 최소 EV100을 설정합니다.
     * [EN] Sets the minimum EV100 for auto-exposure.
     *
     * @param value -
     * [KO] 설정할 최소 EV100 값
     * [EN] Minimum EV100 value to set
     */
    set minEV100(value: number) {
        this.#minEV100 = value;
    }

    /**
     * [KO] 자동 노출 최대 EV100을 반환합니다.
     * [EN] Returns the maximum EV100 for auto-exposure.
     *
     * @returns
     * [KO] 최대 EV100 값
     * [EN] Maximum EV100 value
     */
    get maxEV100(): number {
        return this.#maxEV100;
    }

    /**
     * [KO] 자동 노출 최대 EV100을 설정합니다.
     * [EN] Sets the maximum EV100 for auto-exposure.
     *
     * @param value -
     * [KO] 설정할 최대 EV100 값
     * [EN] Maximum EV100 value to set
     */
    set maxEV100(value: number) {
        this.#maxEV100 = value;
    }

    /**
     * [KO] 눈 적응 속도(밝아질 때)를 반환합니다.
     * [EN] Returns the eye adaptation speed (brightening).
     *
     * @returns
     * [KO] 눈 적응 속도 (상승)
     * [EN] Eye adaptation speed (upward)
     */
    get adaptationSpeedUp(): number {
        return this.#adaptationSpeedUp;
    }

    /**
     * [KO] 눈 적응 속도(밝아질 때)를 설정합니다.
     * [EN] Sets the eye adaptation speed (brightening).
     *
     * @param value -
     * [KO] 설정할 눈 적응 속도 (상승)
     * [EN] Eye adaptation speed (upward) to set
     */
    set adaptationSpeedUp(value: number) {
        this.#adaptationSpeedUp = value;
    }

    /**
     * [KO] 눈 적응 속도(어두워질 때)를 반환합니다.
     * [EN] Returns the eye adaptation speed (darkening).
     *
     * @returns
     * [KO] 눈 적응 속도 (하강)
     * [EN] Eye adaptation speed (downward)
     */
    get adaptationSpeedDown(): number {
        return this.#adaptationSpeedDown;
    }

    /**
     * [KO] 눈 적응 속도(어두워질 때)를 설정합니다.
     * [EN] Sets the eye adaptation speed (darkening).
     *
     * @param value -
     * [KO] 설정할 눈 적응 속도 (하강)
     * [EN] Eye adaptation speed (downward) to set
     */
    set adaptationSpeedDown(value: number) {
        this.#adaptationSpeedDown = value;
    }

    /**
     * [KO] 히스토그램 분석 범위(하위 퍼센트 제외)를 반환합니다.
     * [EN] Returns the histogram analysis range (exclude bottom percentile).
     *
     * @returns
     * [KO] 하위 백분위 값 (0 ~ 1)
     * [EN] Low percentile value (0 - 1)
     */
    get lowPercentile(): number {
        return this.#lowPercentile;
    }

    /**
     * [KO] 히스토그램 분석 범위(하위 퍼센트 제외)를 설정합니다.
     * [EN] Sets the histogram analysis range (exclude bottom percentile).
     *
     * @param value -
     * [KO] 설정할 하위 백분위 값 (0 ~ 1)
     * [EN] Low percentile value to set (0 - 1)
     */
    set lowPercentile(value: number) {
        this.#lowPercentile = value;
    }

    /**
     * [KO] 히스토그램 분석 범위(상위 퍼센트 제외)를 반환합니다.
     * [EN] Returns the histogram analysis range (exclude top percentile).
     *
     * @returns
     * [KO] 상위 백분위 값 (0 ~ 1)
     * [EN] High percentile value (0 - 1)
     */
    get highPercentile(): number {
        return this.#highPercentile;
    }

    /**
     * [KO] 히스토그램 분석 범위(상위 퍼센트 제외)를 설정합니다.
     * [EN] Sets the histogram analysis range (exclude top percentile).
     *
     * @param value -
     * [KO] 설정할 상위 백분위 값 (0 ~ 1)
     * [EN] High percentile value to set (0 - 1)
     */
    set highPercentile(value: number) {
        this.#highPercentile = value;
    }

    /**
     * [KO] 자동 노출의 최대 증폭 배율을 반환합니다.
     * [EN] Returns the maximum exposure multiplier for auto-exposure.
     *
     * @returns
     * [KO] 최대 노출 증폭 배율
     * [EN] Maximum exposure multiplier
     */
    get maxExposureMultiplier(): number {
        return this.#maxExposureMultiplier;
    }

    /**
     * [KO] 자동 노출의 최대 증폭 배율을 설정합니다. (기본값: 16.0)
     * [EN] Sets the maximum exposure multiplier for auto-exposure. (Default: 16.0)
     *
     * @param value -
     * [KO] 설정할 최대 노출 증폭 배율
     * [EN] Maximum exposure multiplier to set
     */
    set maxExposureMultiplier(value: number) {
        this.#maxExposureMultiplier = value;
    }

    /**
     * [KO] 자동 노출의 측광 모드(Metering Mode)를 반환합니다.
     * [EN] Returns the metering mode for auto-exposure.
     *
     * @returns
     * [KO] 측광 모드
     * [EN] Metering mode
     */
    get meteringMode(): METERING_MODE {
        return this.#meteringMode;
    }

    /**
     * [KO] 자동 노출의 측광 모드(Metering Mode)를 설정합니다.
     * [EN] Sets the metering mode for auto-exposure.
     *
     * @param value -
     * [KO] 설정할 측광 모드
     * [EN] Metering mode to set
     */
    set meteringMode(value: METERING_MODE) {
        this.#meteringMode = value;
    }

    /**
     * [KO] 현재 적응된 노출 배율(preExposure)을 반환합니다.
     * [EN] Returns the currently adapted exposure multiplier (preExposure).
     *
     * @returns
     * [KO] 현재 노출 배율
     * [EN] Current exposure multiplier
     */
    get preExposure(): number {
        const {rawCamera} = this.#view;
        return this.#calculatePreExposure(rawCamera.ev100, this.#exposureCompensation);
    }

    /**
     * [KO] 현재 적응된 EV100 값을 반환합니다.
     * [EN] Returns the currently adapted EV100 value.
     *
     * @returns
     * [KO] 적응된 EV100 값
     * [EN] Adapted EV100 value
     */
    get currentAdaptedEV100(): number {
        return this.#currentAdaptedEV100;
    }

    /**
     * [KO] 현재 적응된 EV100 값을 설정합니다. (GPU 버퍼도 함께 갱신)
     * [EN] Sets the currently adapted EV100 value. (Also updates the GPU buffer)
     *
     * @param value -
     * [KO] 설정할 EV100 값
     * [EN] EV100 value to set
     */
    set currentAdaptedEV100(value: number) {
        this.#currentAdaptedEV100 = value;
        const initialData = new Float32Array([value]);
        this.gpuDevice.queue.writeBuffer(this.#adaptedEV100Buffer.gpuBuffer, 0, initialData.buffer);
    }

    /**
     * [KO] 적응된 EV100 데이터가 저장되는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer where adapted EV100 data is stored.
     *
     * @returns
     * [KO] 스토리지 버퍼 인스턴스
     * [EN] Storage buffer instance
     */
    get adaptedLuminanceBuffer(): StorageBuffer {
        return this.#adaptedEV100Buffer;
    }

    /**
     * [KO] 자동 노출 처리를 수행합니다. (커맨드 기록)
     * [EN] Performs auto exposure processing. (Record commands)
     *
     * @param sourceTextureInfo -
     * [KO] 소스 텍스처 정보
     * [EN] Source texture information
     */
    render(sourceTextureInfo: IPostEffectResult) {
        const {gpuDevice, antialiasingManager, commandEncoderManager} = this;
        const {useMSAA, msaaID} = antialiasingManager;
        const {width, height} = this.#view.viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const {rawCamera, renderViewStateData, viewRenderTextureManager} = this.#view;
        const {deltaTime, swapBufferIndex} = renderViewStateData;

        const ev100Range = this.#maxEV100 - this.#minEV100;

        // [KO] 현재 프레임에 적용되어 있는 최종 노출값 계산
        const currentPreExposure = this.#calculatePreExposure(rawCamera.ev100, this.#exposureCompensation);

        // Update uniforms
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

        const msaaChanged = this.#prevMSAAID !== msaaID;
        const sizeChanged = this.#prevWidth !== width || this.#prevHeight !== height;

        if (msaaChanged || sizeChanged) {
            this.#downsampleBindGroup0Cache = new WeakMap();
            this.#prevMSAAID = msaaID;
            this.#prevWidth = width;
            this.#prevHeight = height;
        }

        let cachedBG0 = this.#downsampleBindGroup0Cache.get(sourceTextureInfo.texture);
        if (!cachedBG0) {
            const depthView0 = viewRenderTextureManager.depthTextureView;
            const depthView1 = viewRenderTextureManager.prevDepthTextureView;
            const layout0 = this.#getDownsampleBindGroupLayout0(useMSAA);

            cachedBG0 = {
                swap0: gpuDevice.createBindGroup({
                    label: 'AutoExposure_Downsample_BG0_Swap0',
                    layout: layout0,
                    entries: [
                        {binding: 0, resource: sourceTextureInfo.textureView},
                        {binding: 1, resource: depthView0}
                    ]
                }),
                swap1: gpuDevice.createBindGroup({
                    label: 'AutoExposure_Downsample_BG0_Swap1',
                    layout: layout0,
                    entries: [
                        {binding: 0, resource: sourceTextureInfo.textureView},
                        {binding: 1, resource: depthView1}
                    ]
                })
            };
            this.#downsampleBindGroup0Cache.set(sourceTextureInfo.texture, cachedBG0);
        }

        // [KO] 히스토그램 버퍼 명시적 초기화
        commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, encoder => {
            encoder.clearBuffer(this.#histogramBuffer.gpuBuffer);
        });

        // Pass 1: Generate Histogram
        const pipeline = this.#getDownsamplePipeline(useMSAA);
        commandEncoderManager.addPostProcessComputePass('AutoExposure_GenerateHistogram_Pass', (pass1) => {
            pass1.setPipeline(pipeline);
            pass1.setBindGroup(0, swapBufferIndex ? cachedBG0.swap1 : cachedBG0.swap0);
            pass1.setBindGroup(1, this.#downsampleBindGroup1);
            pass1.dispatchWorkgroups(Math.ceil(width / 32), Math.ceil(height / 32), 1);
        });

        // Pass 2: Average Histogram and Adapt
        commandEncoderManager.addPostProcessComputePass('AutoExposure_Adaptation_Pass', (pass2) => {
            pass2.setPipeline(this.#adaptationPipeline);
            pass2.setBindGroup(0, this.#adaptationBindGroup0);
            pass2.dispatchWorkgroups(1, 1, 1);
        });

        // [KO] 오직 읽기 작업 중이 아닐 때만 GPU 버퍼에서 읽기 전용 버퍼로 복사 명령 기록
        // [EN] Record copy command only when not currently reading
        if (!this.#isReading) {
            commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, encoder => {
                copyGPUBuffer(encoder, this.#adaptedEV100Buffer.gpuBuffer, this.#readBuffer);
            });
        }
    }

    /**
     * [KO] GPU 작업 완료 후 데이터를 비동기적으로 읽어옵니다. (Renderer에서 호출)
     * [EN] Asynchronously reads back data after GPU work completion. (Called by Renderer)
     */
    resolveReadback() {
        if (!this.#isReading) {
            this.#isReading = true;
            this.#readBuffer.mapAsync(GPUMapMode.READ).then(() => {
                const data = new Float32Array(this.#readBuffer.getMappedRange());
                this.#currentAdaptedEV100 = data[0];
                this.#readBuffer.unmap();
                this.#isReading = false;
            }).catch(() => {
                this.#isReading = false;
            });
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
        const {gpuDevice, redGPUContext} = this;

        // [KO] 초기 EV100 값 설정 (기본적으로 카메라의 물리적 EV100으로 시작하여 급격한 노출 변화를 방지합니다)
        // [EN] Set initial EV100 value (starts with the camera's physical EV100 by default to prevent sudden exposure changes)
        this.#view.rawCamera.updateExposure();
        const initialEV100 = Math.max(this.#minEV100, Math.min(this.#maxEV100, this.#view.rawCamera.ev100));
        this.#currentAdaptedEV100 = initialEV100;

        const initialData = new Float32Array([initialEV100]);
        this.#adaptedEV100Buffer = new StorageBuffer(redGPUContext, initialData.buffer, 'AutoExposure_AdaptedEV100');

        // [KO] 히스토그램 버퍼 (256 bins) [EN] Histogram buffer (256 bins)
        this.#histogramBuffer = new StorageBuffer(redGPUContext, new Uint32Array(256).buffer, 'AutoExposure_HistogramBuffer');

        // Readback buffer
        this.#readBuffer = gpuDevice.createBuffer({
            size: 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            label: 'AutoExposure_ReadBuffer'
        });

        // [KO] 통합 유니폼 데이터 구성 (총 18개 요소) [EN] Unified globalStruct data configuration (total 18 elements)
        const uniformData = new Float32Array(18);
        this.#uniformBuffer = new UniformBuffer(redGPUContext, uniformData.buffer, 'AutoExposure_UniformBuffer');
    }

    #initPipelines() {
        const {gpuDevice, resourceManager,} = this;

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

        this.#downsampleBindGroup1 = gpuDevice.createBindGroup({
            label: 'AutoExposure_Downsample_BG1',
            layout: this.#downsampleBindGroupLayout1,
            entries: [
                {binding: 0, resource: {buffer: this.#histogramBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#uniformBuffer.gpuBuffer}}
            ]
        });

        this.#adaptationBindGroup0 = gpuDevice.createBindGroup({
            label: 'AutoExposure_Adaptation_BG0',
            layout: this.#adaptationBindGroupLayout0,
            entries: [
                {binding: 0, resource: {buffer: this.#histogramBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#adaptedEV100Buffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.#uniformBuffer.gpuBuffer}}
            ]
        });
    }

    #getDownsamplePipeline(useMSAA: boolean): GPUComputePipeline {
        if (this.#cachedDownsamplePipelines.has(useMSAA)) return this.#cachedDownsamplePipelines.get(useMSAA);

        const {gpuDevice, resourceManager} = this;
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

        const {gpuDevice} = this;
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

Object.freeze(AutoExposure)
export default AutoExposure;