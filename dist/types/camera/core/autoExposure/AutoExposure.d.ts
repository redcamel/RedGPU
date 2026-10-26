import View3D from "../../../display/view/View3D";
import { IPostEffectResult } from "../../../postEffect/core/types";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import METERING_MODE from "../METERING_MODE";
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
declare class AutoExposure extends RedGPUObject {
    #private;
    /**
     * [KO] `AutoExposure` 인스턴스를 초기화합니다.
     * [EN] Initializes an `AutoExposure` instance.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     */
    constructor(view: View3D);
    /**
     * [KO] EV 스탑 단위의 노출 보정(Exposure Compensation) 값을 가져오거나 설정합니다. (기본값: `0.0`)
     * [EN] Gets or sets the exposure compensation value in EV stops. (Default: `0.0`)
     *
     * @returns
     * [KO] 노출 보정 값 (EV)
     * [EN] Exposure compensation value in EV
     */
    get exposureCompensation(): number;
    set exposureCompensation(value: number);
    /**
     * [KO] 자동 노출이 수렴하려는 목표 평균 휘도(18% 미들 그레이 기준)를 가져오거나 설정합니다. (`0` 이상, 기본값: `0.18`)
     * [EN] Gets or sets the target average luminance (based on 18% middle gray) toward which auto-exposure converges. (Min `0`, Default: `0.18`)
     *
     * @returns
     * [KO] 목표 휘도 값
     * [EN] Target luminance value
     */
    get targetLuminance(): number;
    set targetLuminance(value: number);
    /**
     * [KO] 자동 노출이 허용하는 최소 EV100 하한값을 가져오거나 설정합니다. (기본값: `-2.0`)
     * [EN] Gets or sets the minimum EV100 lower bound allowed by auto-exposure. (Default: `-2.0`)
     *
     * @returns
     * [KO] 최소 EV100 값
     * [EN] Minimum EV100 value
     */
    get minEV100(): number;
    set minEV100(value: number);
    /**
     * [KO] 자동 노출이 허용하는 최대 EV100 상한값을 가져오거나 설정합니다. (기본값: `16.0`)
     * [EN] Gets or sets the maximum EV100 upper bound allowed by auto-exposure. (Default: `16.0`)
     *
     * @returns
     * [KO] 최대 EV100 값
     * [EN] Maximum EV100 value
     */
    get maxEV100(): number;
    set maxEV100(value: number);
    /**
     * [KO] 어두운 곳에서 밝은 곳으로 전환될 때의 눈 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `3.0`)
     * [EN] Gets or sets the eye adaptation speed when transitioning from dark to bright environments. (Min `0`, Default: `3.0`)
     *
     * @returns
     * [KO] 밝아질 때의 적응 속도
     * [EN] Brightening adaptation speed
     */
    get adaptationSpeedUp(): number;
    set adaptationSpeedUp(value: number);
    /**
     * [KO] 밝은 곳에서 어두운 곳으로 전환될 때의 눈 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `1.0`)
     * [EN] Gets or sets the eye adaptation speed when transitioning from bright to dark environments. (Min `0`, Default: `1.0`)
     *
     * @returns
     * [KO] 어두워질 때의 적응 속도
     * [EN] Darkening adaptation speed
     */
    get adaptationSpeedDown(): number;
    set adaptationSpeedDown(value: number);
    /**
     * [KO] 히스토그램 평균 산출 시 제외할 하위 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.8`)
     * [EN] Gets or sets the lower percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.8`)
     *
     * @returns
     * [KO] 하위 백분위 값 (`0` ~ `1`)
     * [EN] Low percentile value (`0` to `1`)
     */
    get lowPercentile(): number;
    set lowPercentile(value: number);
    /**
     * [KO] 히스토그램 평균 산출 시 제외할 상위 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.95`)
     * [EN] Gets or sets the upper percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.95`)
     *
     * @returns
     * [KO] 상위 백분위 값 (`0` ~ `1`)
     * [EN] High percentile value (`0` to `1`)
     */
    get highPercentile(): number;
    set highPercentile(value: number);
    /**
     * [KO] 어두운 장면에서 허용할 최대 노출 증폭 배율을 가져오거나 설정합니다. (`1.0` 이상, 기본값: `64.0`)
     * [EN] Gets or sets the maximum exposure amplification multiplier allowed in dark scenes. (Min `1.0`, Default: `64.0`)
     *
     * @returns
     * [KO] 최대 노출 증폭 배율
     * [EN] Maximum exposure amplification multiplier
     */
    get maxExposureMultiplier(): number;
    set maxExposureMultiplier(value: number);
    /**
     * [KO] 화면 휘도 측정 시 사용할 측광 모드(`METERING_MODE`)를 가져오거나 설정합니다. (기본값: `METERING_MODE.AVERAGE`)
     * [EN] Gets or sets the metering mode (`METERING_MODE`) used when measuring screen luminance. (Default: `METERING_MODE.AVERAGE`)
     *
     * @returns
     * [KO] 현재 측광 모드
     * [EN] Current metering mode
     */
    get meteringMode(): METERING_MODE;
    set meteringMode(value: METERING_MODE);
    /**
     * [KO] 카메라의 현재 `ev100`과 `exposureCompensation`을 반영하여 계산된 사전 노출 배율(`preExposure`)을 반환합니다.
     * [EN] Returns the pre-exposure multiplier (`preExposure`) calculated from the camera's current `ev100` and `exposureCompensation`.
     *
     * @returns
     * [KO] 사전 노출 배율
     * [EN] Pre-exposure multiplier
     */
    get preExposure(): number;
    /**
     * [KO] 현재 적응된 EV100 값을 가져오거나 설정합니다. 값을 설정하면 내부 GPU 스토리지 버퍼도 즉시 갱신됩니다.
     * [EN] Gets or sets the currently adapted EV100 value. Setting this value immediately updates the internal GPU storage buffer.
     *
     * @returns
     * [KO] 현재 적응된 EV100 값
     * [EN] Currently adapted EV100 value
     */
    get currentAdaptedEV100(): number;
    set currentAdaptedEV100(value: number);
    /**
     * [KO] 적응된 EV100 값이 기록되는 GPU `StorageBuffer` 인스턴스를 반환합니다.
     * [EN] Returns the GPU `StorageBuffer` instance storing the adapted EV100 value.
     *
     * @returns
     * [KO] 적응된 EV100 `StorageBuffer`
     * [EN] Adapted EV100 `StorageBuffer`
     */
    get adaptedLuminanceBuffer(): StorageBuffer;
    /**
     * [KO] 소스 컬러 텍스처의 로그 휘도 히스토그램 생성 및 눈 적응 컴퓨트 패스를 기록합니다.
     * [EN] Records the log-luminance histogram generation and eye adaptation compute passes for the source color texture.
     *
     * @param sourceTextureInfo -
     * [KO] 후처리 입력 텍스처 정보 (`IPostEffectResult`)
     * [EN] Post-processing input texture information (`IPostEffectResult`)
     */
    render(sourceTextureInfo: IPostEffectResult): void;
    /**
     * [KO] GPU에서 계산된 적응형 EV100 값을 리드백 버퍼로부터 비동기 매핑하여 CPU 상태에 동기화합니다.
     * [EN] Asynchronously maps the readback buffer to synchronize the GPU-computed adapted EV100 value to CPU state.
     */
    resolveReadback(): void;
    /**
     * [KO] 할당된 GPU 버퍼 및 컴퓨트 파이프라인 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU buffers and compute pipeline resources.
     */
    destroy(): void;
}
export default AutoExposure;
