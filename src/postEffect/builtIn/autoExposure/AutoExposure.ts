import RedGPUObject from "../../../base/RedGPUObject";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import type View3D from "../../../display/view/View3D";
import GPU_LOAD_OP from "../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../gpuConst/GPU_STORE_OP";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import validateNumber from "../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import {IPostEffectResult} from "../../core/types";
import METERING_MODE from "./METERING_MODE";
import debugOverlayCode from "./wgsl/debugOverlay.wgsl";
import eyeAdaptationCode from "./wgsl/eyeAdaptation.wgsl";
import generateHistogramCode from "./wgsl/generateHistogram.wgsl";

const VALID_METERING_MODES: number[] = Object.values(METERING_MODE);
const STATE_BUFFER_BYTE_SIZE = 32;
const STATE_READBACK_BYTE_SIZE = 24;
const STATE_PRE_EXPOSURE_OFFSET = 8;
const HISTOGRAM_BIN_COUNT = 256;
const UNIFORM_BUFFER_BYTE_SIZE = 80;

/**
 * [KO] 컴퓨트 셰이더 기반 256-bin 로그 휘도 히스토그램 분석을 통해 자동 노출(Auto-Exposure)과 눈 적응(Eye Adaptation)을 수행하는 클래스입니다. `BuiltInEffectManager` 내부에서 자동으로 생성됩니다.
 * [EN] Class that performs auto-exposure and eye adaptation via compute-shader-based 256-bin log-luminance histogram analysis. Automatically created inside `BuiltInEffectManager`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 builtInEffectManager를 통해 접근
 * // [EN] Access via builtInEffectManager of View3D
 * const autoExposure = view.builtInEffectManager.autoExposure;
 * autoExposure.exposureCompensation = 0.5;
 * autoExposure.meteringMode = RedGPU.PostEffect.BuiltIn.METERING_MODE.CENTER_WEIGHTED;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/builtIn/lens/autoExposure/" style="width:100%; height:500px;"></iframe>
 *
 * @see [AutoExposure Example](/RedGPU/examples/postEffect/builtIn/lens/autoExposure/)
 * @category PostEffect
 */
class AutoExposure extends RedGPUObject {
    #view: View3D;
    #stateBuffer: StorageBuffer | null = null;
    #histogramBuffer: StorageBuffer | null = null;
    #debugHistogramBuffer: StorageBuffer | null = null;
    #uniformBuffer: UniformBuffer | null = null;

    #generateHistogramPipeline: GPUComputePipeline | null = null;
    #eyeAdaptationPipeline: GPUComputePipeline | null = null;
    #generateHistogramBindGroupLayout0: GPUBindGroupLayout | null = null;
    #generateHistogramBindGroupLayout1: GPUBindGroupLayout | null = null;
    #eyeAdaptationBindGroupLayout0: GPUBindGroupLayout | null = null;

    #debugOverlayPipeline: GPURenderPipeline | null = null;
    #debugOverlayBindGroupLayout0: GPUBindGroupLayout | null = null;
    #debugOverlayBindGroup0: GPUBindGroup | null = null;
    #debugColorAttachment: GPURenderPassColorAttachment;
    #debugRenderPassDescriptor: GPURenderPassDescriptor;

    #readBuffer: GPUBuffer | null = null;
    #isReading: boolean = false;
    #hasPendingReadback: boolean = false;
    #stateVersion: number = 0;
    #readbackVersion: number = 0;

    #currentAdaptedEV100: number = 1.0;
    #effectiveEV100: number = 1.0;
    #sceneAvgEV100: number = 1.0;
    #targetEV100: number = 1.0;
    #currentPreExposureRatio: number = 1.0;

    #minEV100: number = -2.0;
    #maxEV100: number = 20.0;
    #adaptationSpeedUp: number = 3.0;
    #adaptationSpeedDown: number = 1.0;
    #lowPercentile: number = 0.8;
    #highPercentile: number = 0.95;
    #maxExposureMultiplier: number = 64.0;
    #meteringMode: METERING_MODE = METERING_MODE.AVERAGE;
    #targetLuminance: number = 0.18;
    #exposureCompensation: number = 0.0;
    #useDebugOverlay: boolean = false;
    #forceReset: boolean = false;
    #hasRenderedOnce: boolean = false;

    #isExposureParamsDirty: boolean = true;
    #cachedTargetEV100Bias: number = 0.0;
    #cachedMinPossibleEV100: number = 0.0;

    #prevWidth: number = 0;
    #prevHeight: number = 0;
    #generateHistogramBindGroup0Cache: WeakMap<GPUTexture, GPUBindGroup> = new WeakMap();
    #generateHistogramBindGroup1: GPUBindGroup | null = null;
    #eyeAdaptationBindGroup0: GPUBindGroup | null = null;
    #currentGenerateHistogramBindGroup0: GPUBindGroup | null = null;
    #dispatchWorkgroupX: number = 1;
    #dispatchWorkgroupY: number = 1;

    #syncVertexBufferTarget: GPUBuffer | null = null;
    #syncVertexByteOffset: number = 0;
    #syncCascadeBuffers: UniformBuffer[] | null = null;
    #syncActiveCascadeCount: number = 0;
    #syncPostEffectBufferTarget: GPUBuffer | null = null;
    #syncPostEffectByteOffset: number = 0;

    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(UNIFORM_BUFFER_BYTE_SIZE);
    #cachedUniformF32: Float32Array = new Float32Array(this.#uniformArrayBuffer);
    #cachedUniformU32: Uint32Array = new Uint32Array(this.#uniformArrayBuffer);

    #stateInitArrayBuffer: ArrayBuffer = new ArrayBuffer(STATE_BUFFER_BYTE_SIZE);
    #stateInitF32: Float32Array = new Float32Array(this.#stateInitArrayBuffer);
    #stateInitU32: Uint32Array = new Uint32Array(this.#stateInitArrayBuffer);

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
        this.#debugColorAttachment = {
            view: null as unknown as GPUTextureView,
            loadOp: GPU_LOAD_OP.LOAD,
            storeOp: GPU_STORE_OP.STORE
        };
        this.#debugRenderPassDescriptor = {
            label: 'AutoExposure_DebugOverlay_RenderPass',
            colorAttachments: [this.#debugColorAttachment]
        };
        this.#initResources();
        this.#initPipelines();
    }

    /**
     * [KO] EV 스탑 단위의 노출 보정(Exposure Compensation) 값을 가져오거나 설정합니다. 양수 값일수록 화면이 밝아집니다. (기본값: `0.0`)
     * [EN] Gets or sets the exposure compensation value in EV stops. Positive values brighten the image. (Default: `0.0`)
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
        if (this.#exposureCompensation === value) return;
        this.#exposureCompensation = value;
        this.#effectiveEV100 = this.#currentAdaptedEV100 - value;
        this.#isExposureParamsDirty = true;
        if (!this.#hasRenderedOnce && this.#stateBuffer) {
            this.#writeCpuStateToGPU(0);
        }
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
        if (this.#targetLuminance === value) return;
        this.#targetLuminance = value;
        this.#isExposureParamsDirty = true;
    }

    /**
     * [KO] 자동 노출이 허용하는 최소 EV100 하한값을 가져오거나 설정합니다. `maxEV100`과 동일한 값으로 설정하면 해당 EV100으로 노출이 잠깁니다. (기본값: `-2.0`)
     * [EN] Gets or sets the minimum EV100 lower bound allowed by auto-exposure. Setting it equal to `maxEV100` locks exposure to that EV100. (Default: `-2.0`)
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
     * [KO] 자동 노출이 허용하는 최대 EV100 상한값을 가져오거나 설정합니다. `minEV100`과 동일한 값으로 설정하면 해당 EV100으로 노출이 잠깁니다. (기본값: `20.0`)
     * [EN] Gets or sets the maximum EV100 upper bound allowed by auto-exposure. Setting it equal to `minEV100` locks exposure to that EV100. (Default: `20.0`)
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
     * [KO] 어두운 곳에서 밝은 곳으로 이동할 때(명순응, EV100 상승)의 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `3.0`)
     * [EN] Gets or sets the adaptation speed when transitioning from dark to bright environments (light adaptation, EV100 increasing). (Min `0`, Default: `3.0`)
     *
     * @returns
     * [KO] 명순응 속도
     * [EN] Light adaptation speed
     */
    get adaptationSpeedUp(): number {
        return this.#adaptationSpeedUp;
    }

    set adaptationSpeedUp(value: number) {
        validateNumberRange(value, 0);
        this.#adaptationSpeedUp = value;
    }

    /**
     * [KO] 밝은 곳에서 어두운 곳으로 이동할 때(암순응, EV100 하강)의 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `1.0`)
     * [EN] Gets or sets the adaptation speed when transitioning from bright to dark environments (dark adaptation, EV100 decreasing). (Min `0`, Default: `1.0`)
     *
     * @returns
     * [KO] 암순응 속도
     * [EN] Dark adaptation speed
     */
    get adaptationSpeedDown(): number {
        return this.#adaptationSpeedDown;
    }

    set adaptationSpeedDown(value: number) {
        validateNumberRange(value, 0);
        this.#adaptationSpeedDown = value;
    }

    /**
     * [KO] 히스토그램 평균 산출 시 제외할 하위 암부 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.8`)
     * [EN] Gets or sets the lower shadow percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.8`)
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
     * [KO] 히스토그램 평균 산출 시 제외할 상위 명부(극단 광원 하이라이트) 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.95`)
     * [EN] Gets or sets the upper highlight percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.95`)
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
        if (this.#maxExposureMultiplier === value) return;
        this.#maxExposureMultiplier = value;
        this.#isExposureParamsDirty = true;
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
        if (!VALID_METERING_MODES.includes(value)) {
            consoleAndThrowError(`Invalid meteringMode: ${value}. Expected one of METERING_MODE values.`);
        }
        this.#meteringMode = value;
    }

    /**
     * [KO] 256-bin 히스토그램 분포 및 장면 평균·목표·적응 EV100 마커를 화면 좌측 하단 LDR 오버레이로 시각화할지 여부를 가져오거나 설정합니다. (기본값: `false`)
     * [EN] Gets or sets whether to render the real-time 256-bin histogram and scene/target/adapted EV100 HUD overlay at the bottom-left of the LDR viewport. (Default: `false`)
     *
     * @returns
     * [KO] 디버그 오버레이 활성화 여부
     * [EN] Whether the debug HUD overlay is enabled
     */
    get useDebugOverlay(): boolean {
        return this.#useDebugOverlay;
    }

    set useDebugOverlay(value: boolean) {
        this.#useDebugOverlay = Boolean(value);
    }

    /**
     * [KO] 현재 적응된 `currentAdaptedEV100`과 `exposureCompensation`을 반영하여 계산된 사전 노출 배율(`preExposure`)을 반환합니다.
     * [EN] Returns the pre-exposure multiplier (`preExposure`) calculated from `currentAdaptedEV100` and `exposureCompensation`.
     *
     * @returns
     * [KO] 사전 노출 배율
     * [EN] Pre-exposure multiplier
     */
    get preExposure(): number {
        return this.#calculatePreExposure(this.#currentAdaptedEV100, this.#exposureCompensation);
    }

    /**
     * [KO] 직전 프레임 대비 현재 프레임의 사전 노출 변화 비율(`preExposureRatio`)을 반환합니다.
     * [EN] Returns the frame-over-frame pre-exposure change ratio (`preExposureRatio`).
     *
     * @returns
     * [KO] 프레임 간 사전 노출 비율
     * [EN] Frame-over-frame pre-exposure ratio
     */
    get preExposureRatio(): number {
        return this.#currentPreExposureRatio;
    }

    /**
     * [KO] 노출 보정(`exposureCompensation`)까지 반영된 최종 유효 EV100(`currentAdaptedEV100 - exposureCompensation`) 값을 반환합니다.
     * [EN] Returns the effective EV100 (`currentAdaptedEV100 - exposureCompensation`) after applying exposure compensation.
     *
     * @returns
     * [KO] 최종 유효 EV100 값
     * [EN] Effective EV100 value
     */
    get effectiveEV100(): number {
        return this.#effectiveEV100;
    }

    /**
     * [KO] 히스토그램 분석을 통해 측정된 현재 장면의 평균 EV100 값을 반환합니다.
     * [EN] Returns the measured scene average EV100 from histogram analysis.
     *
     * @returns
     * [KO] 장면 평균 EV100 값
     * [EN] Scene average EV100 value
     */
    get sceneAvgEV100(): number {
        return this.#sceneAvgEV100;
    }

    /**
     * [KO] 목표 휘도 바이어스 및 범위 클램핑이 반영된 목표 EV100 값을 반환합니다.
     * [EN] Returns the clamped target EV100 after applying target luminance bias.
     *
     * @returns
     * [KO] 목표 EV100 값
     * [EN] Target EV100 value
     */
    get targetEV100(): number {
        return this.#targetEV100;
    }

    /**
     * [KO] 현재 적응된 EV100 값을 가져오거나 설정합니다. 값을 설정하면 내부 GPU 상태 버퍼도 즉시 동기화됩니다.
     * [EN] Gets or sets the currently adapted EV100 value. Setting this value immediately synchronizes the internal GPU state buffer.
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
        this.#stateVersion++;
        this.#currentAdaptedEV100 = value;
        this.#effectiveEV100 = value - this.#exposureCompensation;
        this.#sceneAvgEV100 = value;
        this.#targetEV100 = value;
        this.#currentPreExposureRatio = 1.0;
        if (this.#stateBuffer) {
            this.#writeCpuStateToGPU(1);
        }
    }

    /**
     * [KO] 할당된 GPU 버퍼들의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of the allocated GPU buffers.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number {
        let size = 0;
        if (this.#stateBuffer) size += this.#stateBuffer.videoMemorySize;
        if (this.#histogramBuffer) size += this.#histogramBuffer.videoMemorySize;
        if (this.#debugHistogramBuffer) size += this.#debugHistogramBuffer.videoMemorySize;
        if (this.#uniformBuffer) size += this.#uniformBuffer.videoMemorySize;
        if (this.#readBuffer) size += this.#readBuffer.size;
        return size;
    }

    /**
     * [KO] 카메라 컷 전환, 씬 이동, 텔레포트 직후 시간 지연 없이 다음 프레임에서 목표 노출로 즉시 수렴하도록 리셋을 예약합니다.
     * [EN] Schedules an instant zero-latency exposure convergence on the next frame for camera cuts, scene transitions, or teleports.
     */
    resetAdaptation(): void {
        this.#stateVersion++;
        this.#forceReset = true;
    }

    /**
     * [KO] GPU 상태 버퍼의 최신 `preExposure`(4B)를 뷰의 정점·프래그먼트 시스템 유니폼 버퍼 및 활성 캐스케이드 버퍼로 직접 복사합니다.
     * [EN] Copies the latest `preExposure` (4B) directly on the GPU from the state buffer into the view's vertex/fragment system uniform buffer and active cascade buffers.
     *
     * @param vertexBuffer -
     * [KO] 메인 시스템 유니폼 `GPUBuffer`
     * [EN] Main system uniform `GPUBuffer`
     * @param preExposureByteOffset -
     * [KO] `preExposure` 필드의 바이트 오프셋
     * [EN] Byte offset of the `preExposure` member
     * @param cascadeBuffers -
     * [KO] 그림자 캐스케이드 시스템 유니폼 버퍼 목록 (`Array<UniformBuffer>`)
     * [EN] Shadow cascade system uniform buffer list (`Array<UniformBuffer>`)
     * @param activeCascadeCount -
     * [KO] 현재 활성화된 캐스케이드 개수
     * [EN] Number of active cascades
     */
    syncVertexSystemUniformBuffers(
        vertexBuffer: GPUBuffer,
        preExposureByteOffset: number,
        cascadeBuffers: UniformBuffer[],
        activeCascadeCount: number
    ): void {
        if (!this.#stateBuffer) return;
        this.#syncVertexBufferTarget = vertexBuffer;
        this.#syncVertexByteOffset = preExposureByteOffset;
        this.#syncCascadeBuffers = cascadeBuffers;
        this.#syncActiveCascadeCount = activeCascadeCount;
        this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, this.#executeVertexBufferSync);
        this.#syncVertexBufferTarget = null;
        this.#syncCascadeBuffers = null;
    }

    /**
     * [KO] GPU 상태 버퍼의 최신 `preExposure` 및 `preExposureRatio`(연속 8B)를 후처리 시스템 유니폼 버퍼로 직접 복사합니다.
     * [EN] Copies the latest `preExposure` and `preExposureRatio` (contiguous 8B) directly on the GPU into the post-effect system uniform buffer.
     *
     * @param postEffectBuffer -
     * [KO] 후처리 시스템 유니폼 `GPUBuffer`
     * [EN] Post-effect system uniform `GPUBuffer`
     * @param preExposureByteOffset -
     * [KO] `preExposure` 필드의 시작 바이트 오프셋
     * [EN] Starting byte offset of the `preExposure` member
     */
    syncPostEffectSystemUniformBuffer(postEffectBuffer: GPUBuffer, preExposureByteOffset: number): void {
        if (!this.#stateBuffer) return;
        this.#syncPostEffectBufferTarget = postEffectBuffer;
        this.#syncPostEffectByteOffset = preExposureByteOffset;
        this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, this.#executePostEffectBufferSync);
        this.#syncPostEffectBufferTarget = null;
    }

    /**
     * [KO] 소스 HDR 컬러 텍스처를 바탕으로 256-bin 로그 휘도 히스토그램 생성 및 눈 적응 컴퓨트 패스를 기록합니다.
     * [EN] Records the 256-bin log-luminance histogram generation and eye adaptation compute passes from the source HDR color texture.
     *
     * @param sourceTextureInfo -
     * [KO] 후처리 입력 HDR 텍스처 정보 (`IPostEffectResult`)
     * [EN] Post-processing input HDR texture information (`IPostEffectResult`)
     */
    render(sourceTextureInfo: IPostEffectResult): void {
        if (!this.#uniformBuffer || !this.#generateHistogramBindGroupLayout0) return;

        const {gpuDevice, commandEncoderManager} = this;
        const {renderViewStateData} = this.#view;
        const sourceTexture = sourceTextureInfo.texture;
        const {width, height} = sourceTexture;
        const {deltaTime} = renderViewStateData;

        if (this.#isExposureParamsDirty) {
            this.#cachedTargetEV100Bias = Math.log2(9.6 * Math.max(0.000001, this.#targetLuminance));
            this.#cachedMinPossibleEV100 = this.#exposureCompensation - Math.log2(1.2 * Math.max(1.0, this.#maxExposureMultiplier));
            this.#isExposureParamsDirty = false;
        }

        const actualMinEV = Math.min(this.#minEV100, this.#maxEV100);
        const actualMaxEV = Math.max(this.#minEV100, this.#maxEV100);
        const rawRange = actualMaxEV - actualMinEV;
        const isLockedRange = rawRange < 0.0001 ? 1 : 0;
        const safeRange = isLockedRange ? 1.0 : rawRange;

        const lowP = Math.min(this.#lowPercentile, this.#highPercentile);
        const highP = Math.max(lowP + 0.001, Math.max(this.#lowPercentile, this.#highPercentile));
        const clampedHighP = Math.min(1.0, highP);
        const clampedLowP = Math.min(lowP, clampedHighP - 0.0001);

        const f32 = this.#cachedUniformF32;
        const u32 = this.#cachedUniformU32;
        f32[0] = deltaTime;
        f32[1] = this.#cachedTargetEV100Bias;
        f32[2] = this.#exposureCompensation;
        f32[3] = this.#cachedMinPossibleEV100;
        f32[4] = actualMinEV;
        f32[5] = actualMaxEV;
        f32[6] = safeRange;
        f32[7] = 1.0 / safeRange;
        f32[8] = Math.max(0.0, clampedLowP);
        f32[9] = clampedHighP;
        f32[10] = this.#adaptationSpeedUp;
        f32[11] = this.#adaptationSpeedDown;
        f32[12] = width;
        f32[13] = height;
        f32[14] = 1.0 / Math.max(1, height);
        u32[15] = this.#meteringMode;
        u32[16] = this.#forceReset ? 1 : 0;
        u32[17] = isLockedRange;
        u32[18] = 0;
        u32[19] = 0;

        this.#forceReset = false;
        this.#hasRenderedOnce = true;

        gpuDevice.queue.writeBuffer(
            this.#uniformBuffer.gpuBuffer,
            0,
            this.#uniformArrayBuffer,
            0,
            UNIFORM_BUFFER_BYTE_SIZE
        );

        const isSizeChanged = this.#prevWidth !== width || this.#prevHeight !== height;
        if (isSizeChanged) {
            this.#generateHistogramBindGroup0Cache = new WeakMap();
            this.#prevWidth = width;
            this.#prevHeight = height;
        }

        let cachedBindGroup0 = this.#generateHistogramBindGroup0Cache.get(sourceTexture);
        if (!cachedBindGroup0) {
            cachedBindGroup0 = gpuDevice.createBindGroup({
                label: 'AutoExposure_GenerateHistogram_BG0',
                layout: this.#generateHistogramBindGroupLayout0,
                entries: [
                    {binding: 0, resource: sourceTextureInfo.textureView}
                ]
            });
            this.#generateHistogramBindGroup0Cache.set(sourceTexture, cachedBindGroup0);
        }

        this.#currentGenerateHistogramBindGroup0 = cachedBindGroup0;
        this.#dispatchWorkgroupX = Math.ceil(width / 64);
        this.#dispatchWorkgroupY = Math.ceil(height / 64);

        commandEncoderManager.addPostProcessComputePass('AutoExposure_GenerateHistogram_Pass', this.#executeGenerateHistogramPass);
        commandEncoderManager.addPostProcessComputePass('AutoExposure_EyeAdaptation_Pass', this.#executeEyeAdaptationPass);

        if (!this.#isReading && this.#readBuffer) {
            this.#hasPendingReadback = true;
            this.#readbackVersion = this.#stateVersion;
            commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, this.#executeReadbackCopy);
        }
    }

    /**
     * [KO] 후처리가 완료된 LDR 타겟 텍스처 위에 실시간 256-bin 히스토그램 및 노출 마커 HUD 오버레이를 렌더링합니다.
     * [EN] Renders the real-time 256-bin histogram and exposure marker HUD overlay onto the post-processed LDR target texture.
     *
     * @param targetTextureView -
     * [KO] 후처리가 완료된 LDR 컬러 타겟 텍스처 뷰 (`rgba8unorm`)
     * [EN] Post-processed LDR color target texture view (`rgba8unorm`)
     */
    renderDebugOverlay(targetTextureView: GPUTextureView): void {
        if (!this.#useDebugOverlay || !this.#stateBuffer || !this.#debugHistogramBuffer || !this.#uniformBuffer) return;
        if (!this.#debugOverlayPipeline) {
            this.#initDebugOverlayPipeline();
        }
        this.#debugColorAttachment.view = targetTextureView;
        this.commandEncoderManager.addPostProcessRenderPass(
            this.#debugRenderPassDescriptor,
            this.#executeDebugOverlayPass
        );
    }

    /**
     * [KO] GPU에서 계산된 최신 노출 상태(적응 EV100, 유효 EV100, 장면 평균 EV100, 목표 EV100)를 리드백 버퍼로부터 비동기 매핑하여 CPU 게터에 동기화합니다.
     * [EN] Asynchronously maps the readback buffer to synchronize the GPU-computed exposure telemetry to CPU getters.
     */
    resolveReadback(): void {
        if (this.#hasPendingReadback && !this.#isReading && this.#readBuffer) {
            this.#hasPendingReadback = false;
            this.#isReading = true;
            const capturedVersion = this.#readbackVersion;
            this.#readBuffer.mapAsync(GPUMapMode.READ).then(() => {
                if (!this.#readBuffer) {
                    this.#isReading = false;
                    return;
                }
                if (capturedVersion === this.#stateVersion) {
                    const mappedData = new Float32Array(this.#readBuffer.getMappedRange());
                    this.#currentAdaptedEV100 = mappedData[0];
                    this.#effectiveEV100 = mappedData[1];
                    this.#currentPreExposureRatio = mappedData[3];
                    this.#sceneAvgEV100 = mappedData[4];
                    this.#targetEV100 = mappedData[5];
                }
                this.#readBuffer.unmap();
                this.#isReading = false;
            }).catch(() => {
                this.#isReading = false;
            });
        }
    }

    /**
     * [KO] 캐시된 소스 텍스처 바인드 그룹을 비웁니다.
     * [EN] Clears cached source texture bind groups.
     */
    clear(): void {
        this.#generateHistogramBindGroup0Cache = new WeakMap();
        this.#currentGenerateHistogramBindGroup0 = null;
        this.#prevWidth = 0;
        this.#prevHeight = 0;
    }

    /**
     * [KO] 할당된 GPU 버퍼 및 컴퓨트·오버레이 파이프라인 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU buffers and compute/overlay pipeline resources.
     */
    destroy(): void {
        if (this.#stateBuffer) {
            this.#stateBuffer.destroy();
            this.#stateBuffer = null;
        }
        if (this.#histogramBuffer) {
            this.#histogramBuffer.destroy();
            this.#histogramBuffer = null;
        }
        if (this.#debugHistogramBuffer) {
            this.#debugHistogramBuffer.destroy();
            this.#debugHistogramBuffer = null;
        }
        if (this.#uniformBuffer) {
            this.#uniformBuffer.destroy();
            this.#uniformBuffer = null;
        }
        if (this.#readBuffer) {
            this.#readBuffer.destroy();
            this.#readBuffer = null;
        }

        this.#generateHistogramPipeline = null;
        this.#eyeAdaptationPipeline = null;
        this.#generateHistogramBindGroupLayout0 = null;
        this.#generateHistogramBindGroupLayout1 = null;
        this.#eyeAdaptationBindGroupLayout0 = null;
        this.#generateHistogramBindGroup1 = null;
        this.#eyeAdaptationBindGroup0 = null;
        this.#currentGenerateHistogramBindGroup0 = null;

        this.#debugOverlayPipeline = null;
        this.#debugOverlayBindGroupLayout0 = null;
        this.#debugOverlayBindGroup0 = null;
    }

    #executeGenerateHistogramPass = (passEncoder: GPUComputePassEncoder): void => {
        if (!this.#generateHistogramPipeline || !this.#currentGenerateHistogramBindGroup0 || !this.#generateHistogramBindGroup1) return;
        passEncoder.setPipeline(this.#generateHistogramPipeline);
        passEncoder.setBindGroup(0, this.#currentGenerateHistogramBindGroup0);
        passEncoder.setBindGroup(1, this.#generateHistogramBindGroup1);
        passEncoder.dispatchWorkgroups(this.#dispatchWorkgroupX, this.#dispatchWorkgroupY, 1);
    };

    #executeEyeAdaptationPass = (passEncoder: GPUComputePassEncoder): void => {
        if (!this.#eyeAdaptationPipeline || !this.#eyeAdaptationBindGroup0) return;
        passEncoder.setPipeline(this.#eyeAdaptationPipeline);
        passEncoder.setBindGroup(0, this.#eyeAdaptationBindGroup0);
        passEncoder.dispatchWorkgroups(1, 1, 1);
    };

    #executeReadbackCopy = (encoder: GPUCommandEncoder): void => {
        if (!this.#stateBuffer || !this.#readBuffer) return;
        encoder.copyBufferToBuffer(this.#stateBuffer.gpuBuffer, 0, this.#readBuffer, 0, STATE_READBACK_BYTE_SIZE);
    };

    #executeVertexBufferSync = (encoder: GPUCommandEncoder): void => {
        if (!this.#stateBuffer || !this.#syncVertexBufferTarget) return;
        const srcBuffer = this.#stateBuffer.gpuBuffer;
        const dstOffset = this.#syncVertexByteOffset;
        encoder.copyBufferToBuffer(srcBuffer, STATE_PRE_EXPOSURE_OFFSET, this.#syncVertexBufferTarget, dstOffset, 4);
        const cascadeBuffers = this.#syncCascadeBuffers;
        if (cascadeBuffers) {
            for (let c = 0; c < this.#syncActiveCascadeCount; c++) {
                const cascadeBuf = cascadeBuffers[c];
                if (cascadeBuf) {
                    encoder.copyBufferToBuffer(srcBuffer, STATE_PRE_EXPOSURE_OFFSET, cascadeBuf.gpuBuffer, dstOffset, 4);
                }
            }
        }
    };

    #executePostEffectBufferSync = (encoder: GPUCommandEncoder): void => {
        if (!this.#stateBuffer || !this.#syncPostEffectBufferTarget) return;
        encoder.copyBufferToBuffer(
            this.#stateBuffer.gpuBuffer,
            STATE_PRE_EXPOSURE_OFFSET,
            this.#syncPostEffectBufferTarget,
            this.#syncPostEffectByteOffset,
            8
        );
    };

    #executeDebugOverlayPass = (passEncoder: GPURenderPassEncoder): void => {
        if (!this.#debugOverlayPipeline || !this.#debugOverlayBindGroup0) return;
        passEncoder.setPipeline(this.#debugOverlayPipeline);
        passEncoder.setBindGroup(0, this.#debugOverlayBindGroup0);
        passEncoder.draw(6, 1, 0, 0);
    };

    #calculatePreExposure(ev100: number, exposureCompensation: number): number {
        return 1.0 / (1.2 * Math.pow(2, ev100 - exposureCompensation));
    }

    #writeCpuStateToGPU(initializedFlag: number): void {
        if (!this.#stateBuffer) return;
        const f32 = this.#stateInitF32;
        const u32 = this.#stateInitU32;
        const effectiveEV100 = this.#currentAdaptedEV100 - this.#exposureCompensation;
        f32[0] = this.#currentAdaptedEV100;
        f32[1] = effectiveEV100;
        f32[2] = this.#calculatePreExposure(this.#currentAdaptedEV100, this.#exposureCompensation);
        f32[3] = 1.0;
        f32[4] = this.#sceneAvgEV100;
        f32[5] = this.#targetEV100;
        u32[6] = initializedFlag;
        u32[7] = 0;
        this.gpuDevice.queue.writeBuffer(
            this.#stateBuffer.gpuBuffer,
            0,
            this.#stateInitArrayBuffer,
            0,
            STATE_BUFFER_BYTE_SIZE
        );
    }

    #initResources(): void {
        const {gpuDevice, redGPUContext} = this;

        this.#view.rawCamera.updateExposure();
        const initialEV100 = Math.max(this.#minEV100, Math.min(this.#maxEV100, this.#view.rawCamera.ev100));
        this.#currentAdaptedEV100 = initialEV100;
        this.#effectiveEV100 = initialEV100 - this.#exposureCompensation;
        this.#sceneAvgEV100 = initialEV100;
        this.#targetEV100 = initialEV100;
        this.#currentPreExposureRatio = 1.0;

        this.#stateInitF32[0] = initialEV100;
        this.#stateInitF32[1] = this.#effectiveEV100;
        this.#stateInitF32[2] = this.#calculatePreExposure(initialEV100, this.#exposureCompensation);
        this.#stateInitF32[3] = 1.0;
        this.#stateInitF32[4] = initialEV100;
        this.#stateInitF32[5] = initialEV100;
        this.#stateInitU32[6] = 0;
        this.#stateInitU32[7] = 0;

        this.#stateBuffer = new StorageBuffer(redGPUContext, this.#stateInitArrayBuffer.slice(0), 'AutoExposure_EyeAdaptationState');
        this.#histogramBuffer = new StorageBuffer(redGPUContext, new Uint32Array(HISTOGRAM_BIN_COUNT).buffer, 'AutoExposure_HistogramBuffer');
        this.#debugHistogramBuffer = new StorageBuffer(redGPUContext, new Uint32Array(HISTOGRAM_BIN_COUNT).buffer, 'AutoExposure_DebugHistogramBuffer');

        this.#readBuffer = gpuDevice.createBuffer({
            size: STATE_READBACK_BYTE_SIZE,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            label: 'AutoExposure_ReadBuffer'
        });

        this.#uniformBuffer = new UniformBuffer(redGPUContext, new ArrayBuffer(UNIFORM_BUFFER_BYTE_SIZE), 'AutoExposure_UniformBuffer');
    }

    #initPipelines(): void {
        if (!this.#stateBuffer || !this.#histogramBuffer || !this.#debugHistogramBuffer || !this.#uniformBuffer) return;
        const {gpuDevice, resourceManager} = this;

        const generateHistogramModule = resourceManager.createGPUShaderModule('AutoExposure_GenerateHistogram', {code: generateHistogramCode});
        const eyeAdaptationModule = resourceManager.createGPUShaderModule('AutoExposure_EyeAdaptation', {code: eyeAdaptationCode});

        this.#generateHistogramBindGroupLayout0 = resourceManager.createBindGroupLayout('AutoExposure_GenerateHistogram_BGL0', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {}}
            ]
        });

        this.#generateHistogramBindGroupLayout1 = resourceManager.createBindGroupLayout('AutoExposure_GenerateHistogram_BGL1', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        this.#generateHistogramPipeline = gpuDevice.createComputePipeline({
            label: 'AutoExposure_GenerateHistogram_Pipeline',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [this.#generateHistogramBindGroupLayout0, this.#generateHistogramBindGroupLayout1]
            }),
            compute: {module: generateHistogramModule, entryPoint: 'main'}
        });

        this.#eyeAdaptationBindGroupLayout0 = resourceManager.createBindGroupLayout('AutoExposure_EyeAdaptation_BGL0', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        this.#eyeAdaptationPipeline = gpuDevice.createComputePipeline({
            label: 'AutoExposure_EyeAdaptation_Pipeline',
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.#eyeAdaptationBindGroupLayout0]}),
            compute: {module: eyeAdaptationModule, entryPoint: 'main'}
        });

        this.#generateHistogramBindGroup1 = gpuDevice.createBindGroup({
            label: 'AutoExposure_GenerateHistogram_BG1',
            layout: this.#generateHistogramBindGroupLayout1,
            entries: [
                {binding: 0, resource: {buffer: this.#histogramBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#stateBuffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.#uniformBuffer.gpuBuffer}}
            ]
        });

        this.#eyeAdaptationBindGroup0 = gpuDevice.createBindGroup({
            label: 'AutoExposure_EyeAdaptation_BG0',
            layout: this.#eyeAdaptationBindGroupLayout0,
            entries: [
                {binding: 0, resource: {buffer: this.#histogramBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#debugHistogramBuffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.#stateBuffer.gpuBuffer}},
                {binding: 3, resource: {buffer: this.#uniformBuffer.gpuBuffer}}
            ]
        });
    }

    #initDebugOverlayPipeline(): void {
        if (!this.#stateBuffer || !this.#debugHistogramBuffer || !this.#uniformBuffer) return;
        const {gpuDevice, resourceManager} = this;

        const overlayModule = resourceManager.createGPUShaderModule('AutoExposure_DebugOverlay', {code: debugOverlayCode});
        const sharedVis = GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT;

        this.#debugOverlayBindGroupLayout0 = resourceManager.createBindGroupLayout('AutoExposure_DebugOverlay_BGL0', {
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'read-only-storage'}},
                {binding: 2, visibility: sharedVis, buffer: {type: 'uniform'}}
            ]
        });

        this.#debugOverlayPipeline = gpuDevice.createRenderPipeline({
            label: 'AutoExposure_DebugOverlay_Pipeline',
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.#debugOverlayBindGroupLayout0]}),
            vertex: {
                module: overlayModule,
                entryPoint: 'vs_main'
            },
            fragment: {
                module: overlayModule,
                entryPoint: 'fs_main',
                targets: [{
                    format: 'rgba8unorm',
                    blend: {
                        color: {
                            srcFactor: 'src-alpha',
                            dstFactor: 'one-minus-src-alpha',
                            operation: 'add'
                        },
                        alpha: {
                            srcFactor: 'one',
                            dstFactor: 'one-minus-src-alpha',
                            operation: 'add'
                        }
                    }
                }]
            },
            primitive: {
                topology: 'triangle-list'
            }
        });

        this.#debugOverlayBindGroup0 = gpuDevice.createBindGroup({
            label: 'AutoExposure_DebugOverlay_BG0',
            layout: this.#debugOverlayBindGroupLayout0,
            entries: [
                {binding: 0, resource: {buffer: this.#debugHistogramBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#stateBuffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.#uniformBuffer.gpuBuffer}}
            ]
        });
    }
}

Object.freeze(AutoExposure);
export default AutoExposure;
