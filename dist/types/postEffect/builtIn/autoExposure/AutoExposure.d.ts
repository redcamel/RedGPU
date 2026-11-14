import RedGPUObject from "../../../base/RedGPUObject";
import type View3D from "../../../display/view/View3D";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import { IPostEffectResult } from "../../core/types";
import METERING_MODE from "./METERING_MODE";
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
 * <iframe src="/RedGPU/examples/postEffect/builtIn/lens/autoExposure/"></iframe>
 *
 * @see [AutoExposure Example](/RedGPU/examples/postEffect/builtIn/lens/autoExposure/)
 * @category PostEffect
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
     * [KO] EV 스탑 단위의 노출 보정(Exposure Compensation) 값을 가져오거나 설정합니다. 양수 값일수록 화면이 밝아집니다. (기본값: `0.0`)
     * [EN] Gets or sets the exposure compensation value in EV stops. Positive values brighten the image. (Default: `0.0`)
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
     * [KO] 자동 노출이 허용하는 최소 EV100 하한값을 가져오거나 설정합니다. `maxEV100`과 동일한 값으로 설정하면 해당 EV100으로 노출이 잠깁니다. (기본값: `-2.0`)
     * [EN] Gets or sets the minimum EV100 lower bound allowed by auto-exposure. Setting it equal to `maxEV100` locks exposure to that EV100. (Default: `-2.0`)
     *
     * @returns
     * [KO] 최소 EV100 값
     * [EN] Minimum EV100 value
     */
    get minEV100(): number;
    set minEV100(value: number);
    /**
     * [KO] 자동 노출이 허용하는 최대 EV100 상한값을 가져오거나 설정합니다. `minEV100`과 동일한 값으로 설정하면 해당 EV100으로 노출이 잠깁니다. (기본값: `16.0`)
     * [EN] Gets or sets the maximum EV100 upper bound allowed by auto-exposure. Setting it equal to `minEV100` locks exposure to that EV100. (Default: `16.0`)
     *
     * @returns
     * [KO] 최대 EV100 값
     * [EN] Maximum EV100 value
     */
    get maxEV100(): number;
    set maxEV100(value: number);
    /**
     * [KO] 어두운 곳에서 밝은 곳으로 이동할 때(명순응, EV100 상승)의 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `3.0`)
     * [EN] Gets or sets the adaptation speed when transitioning from dark to bright environments (light adaptation, EV100 increasing). (Min `0`, Default: `3.0`)
     *
     * @returns
     * [KO] 명순응 속도
     * [EN] Light adaptation speed
     */
    get adaptationSpeedUp(): number;
    set adaptationSpeedUp(value: number);
    /**
     * [KO] 밝은 곳에서 어두운 곳으로 이동할 때(암순응, EV100 하강)의 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `1.0`)
     * [EN] Gets or sets the adaptation speed when transitioning from bright to dark environments (dark adaptation, EV100 decreasing). (Min `0`, Default: `1.0`)
     *
     * @returns
     * [KO] 암순응 속도
     * [EN] Dark adaptation speed
     */
    get adaptationSpeedDown(): number;
    set adaptationSpeedDown(value: number);
    /**
     * [KO] 히스토그램 평균 산출 시 제외할 하위 암부 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.8`)
     * [EN] Gets or sets the lower shadow percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.8`)
     *
     * @returns
     * [KO] 하위 백분위 값 (`0` ~ `1`)
     * [EN] Low percentile value (`0` to `1`)
     */
    get lowPercentile(): number;
    set lowPercentile(value: number);
    /**
     * [KO] 히스토그램 평균 산출 시 제외할 상위 명부(극단 광원 하이라이트) 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.983`)
     * [EN] Gets or sets the upper highlight percentile threshold excluded when averaging the histogram. (`0` to `1`, Default: `0.983`)
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
     * [KO] 화면 휘도 측정 시 사용할 측광 모드(`METERING_MODE`)를 가져오거나 설정합니다. (기본값: `METERING_MODE.CENTER_WEIGHTED`)
     * [EN] Gets or sets the metering mode (`METERING_MODE`) used when measuring screen luminance. (Default: `METERING_MODE.CENTER_WEIGHTED`)
     *
     * @returns
     * [KO] 현재 측광 모드
     * [EN] Current metering mode
     */
    get meteringMode(): METERING_MODE;
    set meteringMode(value: METERING_MODE);
    /**
     * [KO] 256-bin 히스토그램 분포 및 장면 평균·목표·적응 EV100 마커를 화면 좌측 하단 LDR 오버레이로 시각화할지 여부를 가져오거나 설정합니다. (기본값: `false`)
     * [EN] Gets or sets whether to render the real-time 256-bin histogram and scene/target/adapted EV100 HUD overlay at the bottom-left of the LDR viewport. (Default: `false`)
     *
     * @returns
     * [KO] 디버그 오버레이 활성화 여부
     * [EN] Whether the debug HUD overlay is enabled
     */
    get useDebugOverlay(): boolean;
    set useDebugOverlay(value: boolean);
    /**
     * [KO] 현재 적응된 `currentAdaptedEV100`과 `exposureCompensation`을 반영하여 계산된 사전 노출 배율(`preExposure`)을 반환합니다.
     * [EN] Returns the pre-exposure multiplier (`preExposure`) calculated from `currentAdaptedEV100` and `exposureCompensation`.
     *
     * @returns
     * [KO] 사전 노출 배율
     * [EN] Pre-exposure multiplier
     */
    get preExposure(): number;
    /**
     * [KO] 직전 프레임 대비 현재 프레임의 사전 노출 변화 비율(`preExposureRatio`)을 반환합니다.
     * [EN] Returns the frame-over-frame pre-exposure change ratio (`preExposureRatio`).
     *
     * @returns
     * [KO] 프레임 간 사전 노출 비율
     * [EN] Frame-over-frame pre-exposure ratio
     */
    get preExposureRatio(): number;
    /**
     * [KO] 노출 보정(`exposureCompensation`)까지 반영된 최종 유효 EV100(`currentAdaptedEV100 - exposureCompensation`) 값을 반환합니다.
     * [EN] Returns the effective EV100 (`currentAdaptedEV100 - exposureCompensation`) after applying exposure compensation.
     *
     * @returns
     * [KO] 최종 유효 EV100 값
     * [EN] Effective EV100 value
     */
    get effectiveEV100(): number;
    /**
     * [KO] 히스토그램 분석을 통해 측정된 현재 장면의 평균 EV100 값을 반환합니다.
     * [EN] Returns the measured scene average EV100 from histogram analysis.
     *
     * @returns
     * [KO] 장면 평균 EV100 값
     * [EN] Scene average EV100 value
     */
    get sceneAvgEV100(): number;
    /**
     * [KO] 목표 휘도 바이어스 및 범위 클램핑이 반영된 목표 EV100 값을 반환합니다.
     * [EN] Returns the clamped target EV100 after applying target luminance bias.
     *
     * @returns
     * [KO] 목표 EV100 값
     * [EN] Target EV100 value
     */
    get targetEV100(): number;
    /**
     * [KO] 현재 적응된 EV100 값을 가져오거나 설정합니다. 값을 설정하면 내부 GPU 상태 버퍼도 즉시 동기화됩니다.
     * [EN] Gets or sets the currently adapted EV100 value. Setting this value immediately synchronizes the internal GPU state buffer.
     *
     * @returns
     * [KO] 현재 적응된 EV100 값
     * [EN] Currently adapted EV100 value
     */
    get currentAdaptedEV100(): number;
    set currentAdaptedEV100(value: number);
    /**
     * [KO] 할당된 GPU 버퍼들의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of the allocated GPU buffers.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 카메라 컷 전환, 씬 이동, 텔레포트 직후 시간 지연 없이 다음 프레임에서 목표 노출로 즉시 수렴하도록 리셋을 예약합니다.
     * [EN] Schedules an instant zero-latency exposure convergence on the next frame for camera cuts, scene transitions, or teleports.
     */
    resetAdaptation(): void;
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
    syncVertexSystemUniformBuffers(vertexBuffer: GPUBuffer, preExposureByteOffset: number, cascadeBuffers: UniformBuffer[], activeCascadeCount: number): void;
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
    syncPostEffectSystemUniformBuffer(postEffectBuffer: GPUBuffer, preExposureByteOffset: number): void;
    /**
     * [KO] 소스 HDR 컬러 텍스처를 바탕으로 256-bin 로그 휘도 히스토그램 생성 및 눈 적응 컴퓨트 패스를 기록합니다.
     * [EN] Records the 256-bin log-luminance histogram generation and eye adaptation compute passes from the source HDR color texture.
     *
     * @param sourceTextureInfo -
     * [KO] 후처리 입력 HDR 텍스처 정보 (`IPostEffectResult`)
     * [EN] Post-processing input HDR texture information (`IPostEffectResult`)
     */
    render(sourceTextureInfo: IPostEffectResult): void;
    /**
     * [KO] 후처리가 완료된 LDR 타겟 텍스처 위에 실시간 256-bin 히스토그램 및 노출 마커 HUD 오버레이를 렌더링합니다.
     * [EN] Renders the real-time 256-bin histogram and exposure marker HUD overlay onto the post-processed LDR target texture.
     *
     * @param targetTextureView -
     * [KO] 후처리가 완료된 LDR 컬러 타겟 텍스처 뷰 (`rgba8unorm`)
     * [EN] Post-processed LDR color target texture view (`rgba8unorm`)
     */
    renderDebugOverlay(targetTextureView: GPUTextureView): void;
    /**
     * [KO] GPU에서 계산된 최신 노출 상태(적응 EV100, 유효 EV100, 장면 평균 EV100, 목표 EV100)를 리드백 버퍼로부터 비동기 매핑하여 CPU 게터에 동기화합니다.
     * [EN] Asynchronously maps the readback buffer to synchronize the GPU-computed exposure telemetry to CPU getters.
     */
    resolveReadback(): void;
    /**
     * [KO] 캐시된 소스 텍스처 바인드 그룹을 비웁니다.
     * [EN] Clears cached source texture bind groups.
     */
    clear(): void;
    /**
     * [KO] 할당된 GPU 버퍼 및 컴퓨트·오버레이 파이프라인 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU buffers and compute/overlay pipeline resources.
     */
    destroy(): void;
}
export default AutoExposure;
