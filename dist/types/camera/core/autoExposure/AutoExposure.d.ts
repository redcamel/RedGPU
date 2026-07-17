import View3D from "../../../display/view/View3D";
import { IPostEffectResult } from "../../../postEffect/core/types";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import METERING_MODE from "../METERING_MODE";
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
declare class AutoExposure extends RedGPUObject {
    #private;
    constructor(view: View3D);
    /**
     * [KO] 노출 보정(Exposure Compensation) 값을 반환합니다.
     * [EN] Returns the exposure compensation value.
     *
     * @returns
     * [KO] 노출 보정 값
     * [EN] Exposure compensation value
     */
    get exposureCompensation(): number;
    /**
     * [KO] 노출 보정(Exposure Compensation) 값을 설정합니다.
     * [EN] Sets the exposure compensation value.
     *
     * @param value -
     * [KO] 설정할 노출 보정 값
     * [EN] Exposure compensation value to set
     */
    set exposureCompensation(value: number);
    /**
     * [KO] 목표 휘도를 반환합니다.
     * [EN] Returns the target luminance.
     *
     * @returns
     * [KO] 목표 휘도 값
     * [EN] Target luminance value
     */
    get targetLuminance(): number;
    /**
     * [KO] 목표 휘도를 설정합니다.
     * [EN] Sets the target luminance.
     *
     * @param value -
     * [KO] 설정할 목표 휘도 값
     * [EN] Target luminance value to set
     */
    set targetLuminance(value: number);
    /**
     * [KO] 자동 노출 최소 EV100을 반환합니다.
     * [EN] Returns the minimum EV100 for auto-exposure.
     *
     * @returns
     * [KO] 최소 EV100 값
     * [EN] Minimum EV100 value
     */
    get minEV100(): number;
    /**
     * [KO] 자동 노출 최소 EV100을 설정합니다.
     * [EN] Sets the minimum EV100 for auto-exposure.
     *
     * @param value -
     * [KO] 설정할 최소 EV100 값
     * [EN] Minimum EV100 value to set
     */
    set minEV100(value: number);
    /**
     * [KO] 자동 노출 최대 EV100을 반환합니다.
     * [EN] Returns the maximum EV100 for auto-exposure.
     *
     * @returns
     * [KO] 최대 EV100 값
     * [EN] Maximum EV100 value
     */
    get maxEV100(): number;
    /**
     * [KO] 자동 노출 최대 EV100을 설정합니다.
     * [EN] Sets the maximum EV100 for auto-exposure.
     *
     * @param value -
     * [KO] 설정할 최대 EV100 값
     * [EN] Maximum EV100 value to set
     */
    set maxEV100(value: number);
    /**
     * [KO] 눈 적응 속도(밝아질 때)를 반환합니다.
     * [EN] Returns the eye adaptation speed (brightening).
     *
     * @returns
     * [KO] 눈 적응 속도 (상승)
     * [EN] Eye adaptation speed (upward)
     */
    get adaptationSpeedUp(): number;
    /**
     * [KO] 눈 적응 속도(밝아질 때)를 설정합니다.
     * [EN] Sets the eye adaptation speed (brightening).
     *
     * @param value -
     * [KO] 설정할 눈 적응 속도 (상승)
     * [EN] Eye adaptation speed (upward) to set
     */
    set adaptationSpeedUp(value: number);
    /**
     * [KO] 눈 적응 속도(어두워질 때)를 반환합니다.
     * [EN] Returns the eye adaptation speed (darkening).
     *
     * @returns
     * [KO] 눈 적응 속도 (하강)
     * [EN] Eye adaptation speed (downward)
     */
    get adaptationSpeedDown(): number;
    /**
     * [KO] 눈 적응 속도(어두워질 때)를 설정합니다.
     * [EN] Sets the eye adaptation speed (darkening).
     *
     * @param value -
     * [KO] 설정할 눈 적응 속도 (하강)
     * [EN] Eye adaptation speed (downward) to set
     */
    set adaptationSpeedDown(value: number);
    /**
     * [KO] 히스토그램 분석 범위(하위 퍼센트 제외)를 반환합니다.
     * [EN] Returns the histogram analysis range (exclude bottom percentile).
     *
     * @returns
     * [KO] 하위 백분위 값 (0 ~ 1)
     * [EN] Low percentile value (0 - 1)
     */
    get lowPercentile(): number;
    /**
     * [KO] 히스토그램 분석 범위(하위 퍼센트 제외)를 설정합니다.
     * [EN] Sets the histogram analysis range (exclude bottom percentile).
     *
     * @param value -
     * [KO] 설정할 하위 백분위 값 (0 ~ 1)
     * [EN] Low percentile value to set (0 - 1)
     */
    set lowPercentile(value: number);
    /**
     * [KO] 히스토그램 분석 범위(상위 퍼센트 제외)를 반환합니다.
     * [EN] Returns the histogram analysis range (exclude top percentile).
     *
     * @returns
     * [KO] 상위 백분위 값 (0 ~ 1)
     * [EN] High percentile value (0 - 1)
     */
    get highPercentile(): number;
    /**
     * [KO] 히스토그램 분석 범위(상위 퍼센트 제외)를 설정합니다.
     * [EN] Sets the histogram analysis range (exclude top percentile).
     *
     * @param value -
     * [KO] 설정할 상위 백분위 값 (0 ~ 1)
     * [EN] High percentile value to set (0 - 1)
     */
    set highPercentile(value: number);
    /**
     * [KO] 자동 노출의 최대 증폭 배율을 반환합니다.
     * [EN] Returns the maximum exposure multiplier for auto-exposure.
     *
     * @returns
     * [KO] 최대 노출 증폭 배율
     * [EN] Maximum exposure multiplier
     */
    get maxExposureMultiplier(): number;
    /**
     * [KO] 자동 노출의 최대 증폭 배율을 설정합니다. (기본값: 16.0)
     * [EN] Sets the maximum exposure multiplier for auto-exposure. (Default: 16.0)
     *
     * @param value -
     * [KO] 설정할 최대 노출 증폭 배율
     * [EN] Maximum exposure multiplier to set
     */
    set maxExposureMultiplier(value: number);
    /**
     * [KO] 자동 노출의 측광 모드(Metering Mode)를 반환합니다.
     * [EN] Returns the metering mode for auto-exposure.
     *
     * @returns
     * [KO] 측광 모드
     * [EN] Metering mode
     */
    get meteringMode(): METERING_MODE;
    /**
     * [KO] 자동 노출의 측광 모드(Metering Mode)를 설정합니다.
     * [EN] Sets the metering mode for auto-exposure.
     *
     * @param value -
     * [KO] 설정할 측광 모드
     * [EN] Metering mode to set
     */
    set meteringMode(value: METERING_MODE);
    /**
     * [KO] 현재 적응된 노출 배율(preExposure)을 반환합니다.
     * [EN] Returns the currently adapted exposure multiplier (preExposure).
     *
     * @returns
     * [KO] 현재 노출 배율
     * [EN] Current exposure multiplier
     */
    get preExposure(): number;
    /**
     * [KO] 현재 적응된 EV100 값을 반환합니다.
     * [EN] Returns the currently adapted EV100 value.
     *
     * @returns
     * [KO] 적응된 EV100 값
     * [EN] Adapted EV100 value
     */
    get currentAdaptedEV100(): number;
    /**
     * [KO] 현재 적응된 EV100 값을 설정합니다. (GPU 버퍼도 함께 갱신)
     * [EN] Sets the currently adapted EV100 value. (Also updates the GPU buffer)
     *
     * @param value -
     * [KO] 설정할 EV100 값
     * [EN] EV100 value to set
     */
    set currentAdaptedEV100(value: number);
    /**
     * [KO] 적응된 EV100 데이터가 저장되는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer where adapted EV100 data is stored.
     *
     * @returns
     * [KO] 스토리지 버퍼 인스턴스
     * [EN] Storage buffer instance
     */
    get adaptedLuminanceBuffer(): StorageBuffer;
    /**
     * [KO] 자동 노출 처리를 수행합니다. (커맨드 기록)
     * [EN] Performs auto exposure processing. (Record commands)
     *
     * @param sourceTextureInfo -
     * [KO] 소스 텍스처 정보
     * [EN] Source texture information
     */
    render(sourceTextureInfo: IPostEffectResult): void;
    /**
     * [KO] GPU 작업 완료 후 데이터를 비동기적으로 읽어옵니다. (Renderer에서 호출)
     * [EN] Asynchronously reads back data after GPU work completion. (Called by Renderer)
     */
    resolveReadback(): void;
    /**
     * [KO] AutoExposure 인스턴스를 파기하고 할당된 물리 GPU 버퍼들을 모두 소멸시킵니다.
     * [EN] Destroys the AutoExposure instance and releases all allocated physical GPU buffers.
     */
    destroy(): void;
}
export default AutoExposure;
