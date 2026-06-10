import type View3D from "../../display/view/View3D";
import BaseObject from "../../base/BaseObject";
/**
 * [KO] 모든 카메라의 기본이 되는 추상 클래스입니다. 물리적 카메라 속성과 공통 메타데이터를 관리합니다.
 * [EN] Abstract base class for all cameras. Manages physical camera properties and common metadata.
 *
 * @category Core
 */
declare abstract class ACamera extends BaseObject {
    #private;
    /**
     * [KO] 교정 상수 (Calibration Constant, K)
     * [EN] Calibration constant (K)
     * @description
     * [KO] 언리얼 엔진 5 및 사진학적 표준 (ISO 2720 표준 기준 K = 12.5)
     * [EN] Unreal Engine 5 and photographic standard (K = 12.5 based on ISO 2720)
     */
    static readonly CALIBRATION_CONSTANT: number;
    /**
     * [KO] 자동 노출 사용 여부를 반환합니다.
     * [EN] Returns whether to use auto exposure.
     *
     * @returns
     * [KO] 자동 노출 활성화 여부
     * [EN] Whether auto exposure is enabled
     */
    get useAutoExposure(): boolean;
    /**
     * [KO] 자동 노출 사용 여부를 설정합니다.
     * [EN] Sets whether to use auto exposure.
     *
     * @param value -
     * [KO] 설정할 자동 노출 활성화 여부
     * [EN] Whether to enable auto exposure to set
     */
    set useAutoExposure(value: boolean);
    /**
     * [KO] 물리적 노출 지수(EV100)를 반환합니다.
     * [EN] Returns the physical exposure value (EV100).
     *
     * @returns
     * [KO] EV100 값
     * [EN] EV100 value
     */
    get ev100(): number;
    /**
     * [KO] 조리개(f-stop) 값을 반환합니다.
     * [EN] Returns the aperture (f-stop) value.
     *
     * @returns
     * [KO] 조리개 값
     * [EN] Aperture value
     */
    get aperture(): number;
    /**
     * [KO] 조리개(f-stop) 값을 설정합니다.
     * [EN] Sets the aperture (f-stop) value.
     *
     * @param value -
     * [KO] 설정할 조리개 값
     * [EN] Aperture value to set
     */
    set aperture(value: number);
    /**
     * [KO] 셔터 속도(초 단위)를 반환합니다.
     * [EN] Returns the shutter speed (in seconds).
     *
     * @returns
     * [KO] 셔터 속도
     * [EN] Shutter speed
     */
    get shutterSpeed(): number;
    /**
     * [KO] 셔터 속도(초 단위)를 설정합니다.
     * [EN] Sets the shutter speed (in seconds).
     *
     * @param value -
     * [KO] 설정할 셔터 속도
     * [EN] Shutter speed to set
     */
    set shutterSpeed(value: number);
    /**
     * [KO] 센서 감도(ISO)를 반환합니다.
     * [EN] Returns the sensor sensitivity (ISO).
     *
     * @returns
     * [KO] ISO 감도
     * [EN] ISO sensitivity
     */
    get iso(): number;
    /**
     * [KO] 센서 감도(ISO)를 설정합니다.
     * [EN] Sets the sensor sensitivity (ISO).
     *
     * @param value -
     * [KO] 설정할 ISO 감도
     * [EN] ISO sensitivity to set
     */
    set iso(value: number);
    /**
     * [KO] 노출 값을 업데이트합니다.
     * [EN] Updates the exposure value.
     *
     * @param view -
     * [KO] View3D 인스턴스 (선택 사항)
     * [EN] View3D instance (optional)
     */
    updateExposure(view?: View3D): void;
}
export default ACamera;
