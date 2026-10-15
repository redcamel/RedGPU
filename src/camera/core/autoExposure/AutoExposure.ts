import View3D from "../../../display/view/View3D";
import {IPostEffectResult} from "../../../postEffect/core/types";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import validateNumber from "../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import downsampleLogLuminanceCode from "./wgsl/downsampleLogLuminance.wgsl";
import adaptationCode from "./wgsl/adaptation.wgsl";
import METERING_MODE from "../METERING_MODE";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import copyGPUBuffer from "../../../utils/copyGPUBuffer";
import GBUFFER_TYPE from "../../../display/view/core/GBUFFER_TYPE";
import RedGPUObject from "../../../base/RedGPUObject";


/**
 * [KO] 컴퓨트 셰이더 기반 256-bin 로그 휘도 히스토그램 분석을 통해 자동 노출(Auto-Exposure)과 눈 적응(Eye Adaptation)을 수행하는 클래스입니다. `PostEffectManager` 내부에서 자동으로 생성됩니다.
 * [EN] Class that performs auto-exposure and eye adaptation via compute-shader-based 256-bin log-luminance histogram analysis. Automatically created inside `PostEffectManager`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 postEffectManager를 통해 접근
 * // [EN] Access via postEffectManager of View3D
 * const autoExposure = view.postEffectManager.autoExposure;
 * autoExposure.exposureCompensation = 0.5;
 * autoExposure.meteringMode = RedGPU.Camera.Core.METERING_MODE.CENTER_WEIGHTED;
 * ```
 *
 * @category Core
 */
class AutoExposure extends RedGPUObject {
    #view: View3D;
    #adaptedEV100Buffer: StorageBuffer;
    #histogramBuffer: StorageBuffer;

    #adaptationPipeline: GPUComputePipeline;
    #downsamplePipeline: GPUComputePipeline;
    #downsampleBindGroupLayout0: GPUBindGroupLayout;
    #downsampleBindGroupLayout1: GPUBindGroupLayout;
    #adaptationBindGroupLayout0: GPUBindGroupLayout;

    #uniformBuffer: UniformBuffer;

    #currentAdaptedEV100: number = 1.0;
    #readBuffer: GPUBuffer;
    #isReading: boolean = false;

    #minEV100: number = -2.0;
    #maxEV100: number = 16.0;
    #adaptationSpeedUp: number = 3.0;
    #adaptationSpeedDown: number = 1.0;
    #lowPercentile: number = 0.8;
    #highPercentile: number = 0.95;
    #maxExposureMultiplier: number = 64.0;
    #meteringMode: METERING_MODE = METERING_MODE.AVERAGE;
    #targetLuminance: number = 0.18;
    #exposureCompensation: number = 0.0;

    #prevWidth: number;
    #prevHeight: number;
    #downsampleBindGroup0Cache: WeakMap<GPUTexture, GPUBindGroup> = new WeakMap();
    #downsampleBindGroup1: GPUBindGroup;
    #adaptationBindGroup0: GPUBindGroup;

    #cachedUniformData: Float32Array = new Float32Array(16);
    #cachedEV100Data: Float32Array = new Float32Array(1);

    /**
     * [KO] `AutoExposure` 인스턴스를 초기화합니다.
     * [EN] Initializes an `AutoExposure` instance.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     */
    constructor(view: View3D) {
        super(view.redGPUContext);
        this.#view = view;
        this.#initResources();
        this.#initPipelines();
    }

    /**
     * [KO] EV 스탑 단위의 노출 보정(Exposure Compensation) 값을 가져오거나 설정합니다. (기본값: `0.0`)
     * [EN] Gets or sets the exposure compensation value in EV stops. (Default: `0.0`)
     *
     * @returns
     * [KO] 노출 보정 값 (EV)
     * [EN] Exposure compensation value in EV
     */
    get exposureCompensation(): number {
        return this.#exposureCompensation;
    }

    set exposureCompensation(value: number) {
        validateNumber(value);
        this.#exposureCompensation = value;
    }

    /**
     * [KO] 자동 노출이 수렴하려는 목표 평균 휘도(18% 미들 그레이 기준)를 가져오거나 설정합니다. (`0` 이상, 기본값: `0.18`)
     * [EN] Gets or sets the target average luminance (based on 18% middle gray) toward which auto-exposure converges. (Min `0`, Default: `0.18`)
     *
     * @returns
     * [KO] 목표 휘도 값
     * [EN] Target luminance value
     */
    get targetLuminance(): number {
        return this.#targetLuminance;
    }

    set targetLuminance(value: number) {
        validateNumberRange(value, 0);
        this.#targetLuminance = value;
    }

    /**
     * [KO] 자동 노출이 허용하는 최소 EV100 하한값을 가져오거나 설정합니다. (기본값: `-2.0`)
     * [EN] Gets or sets the minimum EV100 lower bound allowed by auto-exposure. (Default: `-2.0`)
     *
     * @returns
     * [KO] 최소 EV100 값
     * [EN] Minimum EV100 value
     */
    get minEV100(): number {
        return this.#minEV100;
    }

    set minEV100(value: number) {
        validateNumber(value);
        this.#minEV100 = value;
    }

    /**
     * [KO] 자동 노출이 허용하는 최대 EV100 상한값을 가져오거나 설정합니다. (기본값: `16.0`)
     * [EN] Gets or sets the maximum EV100 upper bound allowed by auto-exposure. (Default: `16.0`)
     *
     * @returns
     * [KO] 최대 EV100 값
     * [EN] Maximum EV100 value
     */
    get maxEV100(): number {
        return this.#maxEV100;
    }

    set maxEV100(value: number) {
        validateNumber(value);
        this.#maxEV100 = value;
    }

    /**
     * [KO] 어두운 곳에서 밝은 곳으로 전환될 때의 눈 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `3.0`)
     * [EN] Gets or sets the eye adaptation speed when transitioning from dark to bright environments. (Min `0`, Default: `3.0`)
     *
     * @returns
     * [KO] 밝아질 때의 적응 속도
     * [EN] Brightening adaptation speed
     */
    get adaptationSpeedUp(): number {
        return this.#adaptationSpeedUp;
    }

    set adaptationSpeedUp(value: number) {
        validateNumberRange(value, 0);
        this.#adaptationSpeedUp = value;
    }

    /**
     * [KO] 밝은 곳에서 어두운 곳으로 전환될 때의 눈 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `1.0`)
     * [EN] Gets or sets the eye adaptation speed when transitioning from bright to dark environments. (Min `0`, Default: `1.0`)
     *
     * @returns
     * [KO] 어두워질 때의 적응 속도
     * [EN] Darkening adaptation speed
     */
    get adaptationSpeedDown(): number {
        return this.#adaptationSpeedDown;
    }

    set adaptationSpeedDown(value: number) {
        validateNumberRange(value, 0);
        this.#adaptationSpeedDown = value;
    }

    /**
     * [KO] 히스토그램 평균 산출 시 제외할 하위 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.8`)
     * [EN] Gets or sets the lower percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.8`)
     *
     * @returns
     * [KO] 하위 백분위 값 (`0` ~ `1`)
     * [EN] Low percentile value (`0` to `1`)
     */
    get lowPercentile(): number {
        return this.#lowPercentile;
    }

    set lowPercentile(value: number) {
        validateNumberRange(value, 0, 1);
        this.#lowPercentile = value;
    }

    /**
     * [KO] 히스토그램 평균 산출 시 제외할 상위 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.95`)
     * [EN] Gets or sets the upper percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.95`)
     *
     * @returns
     * [KO] 상위 백분위 값 (`0` ~ `1`)
     * [EN] High percentile value (`0` to `1`)
     */
    get highPercentile(): number {
        return this.#highPercentile;
    }

    set highPercentile(value: number) {
        validateNumberRange(value, 0, 1);
        this.#highPercentile = value;
    }

    /**
     * [KO] 어두운 장면에서 허용할 최대 노출 증폭 배율을 가져오거나 설정합니다. (`1.0` 이상, 기본값: `64.0`)
     * [EN] Gets or sets the maximum exposure amplification multiplier allowed in dark scenes. (Min `1.0`, Default: `64.0`)
     *
     * @returns
     * [KO] 최대 노출 증폭 배율
     * [EN] Maximum exposure amplification multiplier
     */
    get maxExposureMultiplier(): number {
        return this.#maxExposureMultiplier;
    }

    set maxExposureMultiplier(value: number) {
        validateNumberRange(value, 1);
        this.#maxExposureMultiplier = value;
    }

    /**
     * [KO] 화면 휘도 측정 시 사용할 측광 모드(`METERING_MODE`)를 가져오거나 설정합니다. (기본값: `METERING_MODE.AVERAGE`)
     * [EN] Gets or sets the metering mode (`METERING_MODE`) used when measuring screen luminance. (Default: `METERING_MODE.AVERAGE`)
     *
     * @returns
     * [KO] 현재 측광 모드
     * [EN] Current metering mode
     */
    get meteringMode(): METERING_MODE {
        return this.#meteringMode;
    }

    set meteringMode(value: METERING_MODE) {
        this.#meteringMode = value;
    }

    /**
     * [KO] 카메라의 현재 `ev100`과 `exposureCompensation`을 반영하여 계산된 사전 노출 배율(`preExposure`)을 반환합니다.
     * [EN] Returns the pre-exposure multiplier (`preExposure`) calculated from the camera's current `ev100` and `exposureCompensation`.
     *
     * @returns
     * [KO] 사전 노출 배율
     * [EN] Pre-exposure multiplier
     */
    get preExposure(): number {
        const {rawCamera} = this.#view;
        return this.#calculatePreExposure(rawCamera.ev100, this.#exposureCompensation);
    }

    /**
     * [KO] 현재 적응된 EV100 값을 가져오거나 설정합니다. 값을 설정하면 내부 GPU 스토리지 버퍼도 즉시 갱신됩니다.
     * [EN] Gets or sets the currently adapted EV100 value. Setting this value immediately updates the internal GPU storage buffer.
     *
     * @returns
     * [KO] 현재 적응된 EV100 값
     * [EN] Currently adapted EV100 value
     */
    get currentAdaptedEV100(): number {
        return this.#currentAdaptedEV100;
    }

    set currentAdaptedEV100(value: number) {
        validateNumber(value);
        this.#currentAdaptedEV100 = value;
        const u = this.#cachedEV100Data;
        u[0] = value;
        this.gpuDevice.queue.writeBuffer(this.#adaptedEV100Buffer.gpuBuffer, 0, u.buffer, u.byteOffset, u.byteLength);
    }

    /**
     * [KO] 적응된 EV100 값이 기록되는 GPU `StorageBuffer` 인스턴스를 반환합니다.
     * [EN] Returns the GPU `StorageBuffer` instance storing the adapted EV100 value.
     *
     * @returns
     * [KO] 적응된 EV100 `StorageBuffer`
     * [EN] Adapted EV100 `StorageBuffer`
     */
    get adaptedLuminanceBuffer(): StorageBuffer {
        return this.#adaptedEV100Buffer;
    }

    /**
     * [KO] 소스 컬러 텍스처의 로그 휘도 히스토그램 생성 및 눈 적응 컴퓨트 패스를 기록합니다.
     * [EN] Records the log-luminance histogram generation and eye adaptation compute passes for the source color texture.
     *
     * @param sourceTextureInfo -
     * [KO] 후처리 입력 텍스처 정보 (`IPostEffectResult`)
     * [EN] Post-processing input texture information (`IPostEffectResult`)
     */
    render(sourceTextureInfo: IPostEffectResult) {
        const {gpuDevice, commandEncoderManager} = this;
        const {width, height} = this.#view.viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const {rawCamera, renderViewStateData} = this.#view;
        const {deltaTime} = renderViewStateData;

        const ev100Range = this.#maxEV100 - this.#minEV100;
        const currentPreExposure = this.#calculatePreExposure(rawCamera.ev100, this.#exposureCompensation);

        const targetEV100Bias = Math.log2(9.6 * Math.max(0.000001, this.#targetLuminance)) + this.#exposureCompensation;
        const minPossibleEV100 = this.#exposureCompensation - Math.log2(1.2 * Math.max(1.0, this.#maxExposureMultiplier));

        const u = this.#cachedUniformData;
        u[0] = deltaTime;
        u[1] = targetEV100Bias;
        u[2] = this.#adaptationSpeedUp;
        u[3] = this.#adaptationSpeedDown;
        u[4] = minPossibleEV100;
        u[5] = this.#minEV100;
        u[6] = this.#maxEV100;
        u[7] = ev100Range;
        u[8] = this.#lowPercentile;
        u[9] = this.#highPercentile;
        u[10] = 1.0 / ev100Range;
        u[11] = width;
        u[12] = height;
        u[13] = currentPreExposure;
        u[14] = this.#meteringMode;
        u[15] = 0.0;

        gpuDevice.queue.writeBuffer(
            this.#uniformBuffer.gpuBuffer,
            0,
            u.buffer,
            u.byteOffset,
            u.byteLength
        );

        const sizeChanged = this.#prevWidth !== width || this.#prevHeight !== height;

        if (sizeChanged) {
            this.#downsampleBindGroup0Cache = new WeakMap();
            this.#prevWidth = width;
            this.#prevHeight = height;
        }

        let cachedBG0 = this.#downsampleBindGroup0Cache.get(sourceTextureInfo.texture);
        if (!cachedBG0) {
            cachedBG0 = gpuDevice.createBindGroup({
                label: 'AutoExposure_Downsample_BG0',
                layout: this.#downsampleBindGroupLayout0,
                entries: [
                    {binding: 0, resource: sourceTextureInfo.textureView}
                ]
            });
            this.#downsampleBindGroup0Cache.set(sourceTextureInfo.texture, cachedBG0);
        }

        commandEncoderManager.addPostProcessComputePass('AutoExposure_GenerateHistogram_Pass', (pass1) => {
            pass1.setPipeline(this.#downsamplePipeline);
            pass1.setBindGroup(0, cachedBG0);
            pass1.setBindGroup(1, this.#downsampleBindGroup1);
            pass1.dispatchWorkgroups(Math.ceil(width / 32), Math.ceil(height / 32), 1);
        });

        commandEncoderManager.addPostProcessComputePass('AutoExposure_Adaptation_Pass', (pass2) => {
            pass2.setPipeline(this.#adaptationPipeline);
            pass2.setBindGroup(0, this.#adaptationBindGroup0);
            pass2.dispatchWorkgroups(1, 1, 1);
        });

        if (!this.#isReading) {
            commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, encoder => {
                copyGPUBuffer(encoder, this.#adaptedEV100Buffer.gpuBuffer, this.#readBuffer);
            });
        }
    }

    /**
     * [KO] GPU에서 계산된 적응형 EV100 값을 리드백 버퍼로부터 비동기 매핑하여 CPU 상태에 동기화합니다.
     * [EN] Asynchronously maps the readback buffer to synchronize the GPU-computed adapted EV100 value to CPU state.
     */
    resolveReadback() {
        if (!this.#isReading && this.#readBuffer) {
            this.#isReading = true;
            this.#readBuffer.mapAsync(GPUMapMode.READ).then(() => {
                if (!this.#readBuffer) {
                    this.#isReading = false;
                    return;
                }
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
     * [KO] 할당된 GPU 버퍼 및 컴퓨트 파이프라인 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU buffers and compute pipeline resources.
     */
    destroy() {
        if (this.#adaptedEV100Buffer) {
            this.#adaptedEV100Buffer.destroy();
            this.#adaptedEV100Buffer = null;
        }
        if (this.#histogramBuffer) {
            this.#histogramBuffer.destroy();
            this.#histogramBuffer = null;
        }
        if (this.#uniformBuffer) {
            this.#uniformBuffer.destroy();
            this.#uniformBuffer = null;
        }
        if (this.#readBuffer) {
            this.#readBuffer.destroy();
            this.#readBuffer = null;
        }

        this.#adaptationPipeline = null;
        this.#downsamplePipeline = null;
        this.#downsampleBindGroupLayout0 = null;
        this.#downsampleBindGroupLayout1 = null;
        this.#adaptationBindGroupLayout0 = null;
        this.#downsampleBindGroup1 = null;
        this.#adaptationBindGroup0 = null;
    }

    #calculatePreExposure(ev100: number, exposureCompensation: number): number {
        return Math.pow(2, exposureCompensation) / (1.2 * Math.pow(2, ev100));
    }

    #initResources() {
        const {gpuDevice, redGPUContext} = this;

        this.#view.rawCamera.updateExposure();
        const initialEV100 = Math.max(this.#minEV100, Math.min(this.#maxEV100, this.#view.rawCamera.ev100));
        this.#currentAdaptedEV100 = initialEV100;

        const initialData = new Float32Array([initialEV100]);
        this.#adaptedEV100Buffer = new StorageBuffer(redGPUContext, initialData.buffer, 'AutoExposure_AdaptedEV100');

        this.#histogramBuffer = new StorageBuffer(redGPUContext, new Uint32Array(256).buffer, 'AutoExposure_HistogramBuffer');

        this.#readBuffer = gpuDevice.createBuffer({
            size: 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            label: 'AutoExposure_ReadBuffer'
        });

        const uniformData = new Float32Array(16);
        this.#uniformBuffer = new UniformBuffer(redGPUContext, uniformData.buffer, 'AutoExposure_UniformBuffer');
    }

    #initPipelines() {
        const {gpuDevice, resourceManager} = this;

        const downsampleModule = resourceManager.createGPUShaderModule('AutoExposure_Downsample', {code: downsampleLogLuminanceCode});
        const adaptationModule = resourceManager.createGPUShaderModule('AutoExposure_Adaptation', {code: adaptationCode});

        this.#downsampleBindGroupLayout0 = resourceManager.createBindGroupLayout('AutoExposure_Downsample_BGL0', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {}}
            ]
        });

        this.#downsampleBindGroupLayout1 = resourceManager.createBindGroupLayout('AutoExposure_Downsample_BGL1', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        this.#downsamplePipeline = gpuDevice.createComputePipeline({
            label: 'AutoExposure_Downsample_Pipeline',
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.#downsampleBindGroupLayout0, this.#downsampleBindGroupLayout1]}),
            compute: {module: downsampleModule, entryPoint: 'main'}
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
}

Object.freeze(AutoExposure);
export default AutoExposure;