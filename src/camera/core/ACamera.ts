import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";

/**
 * [KO] 모든 카메라의 기본이 되는 추상 클래스입니다. 물리적 카메라 속성과 공통 메타데이터를 관리합니다.
 * [EN] Abstract base class for all cameras. Manages physical camera properties and common metadata.
 */
abstract class ACamera {
    /**
     * [KO] 인스턴스 고유 ID
     * [EN] Instance unique ID
     */
    #instanceId: number;

    /**
     * [KO] 카메라 이름
     * [EN] Camera name
     */
    #name: string;

    /**
     * [KO] 조리개 (f-stop)
     * [EN] Aperture (f-stop)
     */
    #aperture: number = 2.8;

    /**
     * [KO] 셔터 속도 (초)
     * [EN] Shutter speed (seconds)
     */
    #shutterSpeed: number = 1 / 60;

    /**
     * [KO] 센서 감도 (ISO)
     * [EN] Sensor sensitivity (ISO)
     */
    #iso: number = 100;

    /**
     * [KO] 노출 보정 (Exposure Compensation / Bias)
     * [EN] Exposure compensation (Bias)
     */
    #exposureCompensation: number = 0.0;

    /**
     * [KO] 목표 휘도 (18% Middle Gray 기준)
     * [EN] Target luminance (based on 18% Middle Gray)
     */
    #targetLuminance: number = 0.18;

    /**
     * [KO] 자동 노출 최소 범위 (EV100)
     * [EN] Minimum auto-exposure limit (EV100)
     */
    #minEV100: number = 1.0;

    /**
     * [KO] 자동 노출 최대 범위 (EV100)
     * [EN] Maximum auto-exposure limit (EV100)
     */
    #maxEV100: number = 20.0;

    /**
     * [KO] 눈 적응 속도 (밝아질 때)
     * [EN] Eye adaptation speed (brightening)
     */
    #adaptationSpeedUp: number = 3.0;

    /**
     * [KO] 눈 적응 속도 (어두워질 때)
     * [EN] Eye adaptation speed (darkening)
     */
    #adaptationSpeedDown: number = 1.0;

    /**
     * [KO] 히스토그램 분석 범위 (하위 퍼센트 제외)
     * [EN] Histogram analysis range (exclude bottom percentile)
     */
    #lowPercentile: number = 0.8;

    /**
     * [KO] 히스토그램 분석 범위 (상위 퍼센트 제외)
     * [EN] Histogram analysis range (exclude top percentile)
     */
    #highPercentile: number = 0.98;

    /**
     * [KO] 교정 상수 (Calibration Constant, K)
     * [EN] Calibration constant (K)
     * @description
     * [KO] 언리얼 엔진 5 및 사진학적 표준 (18% Middle Gray 기준 K = 1.2)
     * [EN] Unreal Engine 5 and photographic standard (K = 1.2 based on 18% Middle Gray)
     */
    static readonly CALIBRATION_CONSTANT: number = 1.2;

    /**
     * [KO] 캐시된 EV100
     * [EN] Cached EV100
     */
    #ev100: number = 0;

    /**
     * [KO] 캐시된 물리 노출 배율
     * [EN] Cached physical exposure multiplier
     */
    #exposure: number = 0;

    /**
     * [KO] 노출 값이 다시 계산되어야 하는지 여부
     * [EN] Whether the exposure needs to be recalculated
     */
    #exposureDirty: boolean = true;

    /**
     * [KO] 물리적 노출 지수(EV100)를 반환합니다.
     * [EN] Returns the physical exposure value (EV100).
     */
    get ev100(): number {
        if (this.#exposureDirty) this.#updateExposure();
        return this.#ev100;
    }

    /**
     * [KO] 물리적 노출 배율(Exposure)을 반환합니다.
     * [EN] Returns the physical exposure multiplier.
     */
    get exposure(): number {
        if (this.#exposureDirty) this.#updateExposure();
        return this.#exposure;
    }

    /**
     * [KO] 노출 보정(Exposure Compensation) 값을 반환합니다.
     * [EN] Returns the exposure compensation value.
     */
    get exposureCompensation(): number {
        return this.#exposureCompensation;
    }

    /**
     * [KO] 노출 보정(Exposure Compensation) 값을 설정합니다.
     * [EN] Sets the exposure compensation value.
     */
    set exposureCompensation(value: number) {
        validateNumber(value);
        if (this.#exposureCompensation === value) return;
        this.#exposureCompensation = value;
        this.#exposureDirty = true;
    }

    /**
     * [KO] 목표 휘도를 반환합니다.
     * [EN] Returns the target luminance.
     */
    get targetLuminance(): number {
        return this.#targetLuminance;
    }

    /**
     * [KO] 목표 휘도를 설정합니다.
     * [EN] Sets the target luminance.
     */
    set targetLuminance(value: number) {
        validateNumber(value);
        this.#targetLuminance = value;
    }

    /**
     * [KO] 자동 노출 최소 EV100을 반환합니다.
     * [EN] Returns the minimum EV100 for auto-exposure.
     */
    get minEV100(): number {
        return this.#minEV100;
    }

    /**
     * [KO] 자동 노출 최소 EV100을 설정합니다.
     * [EN] Sets the minimum EV100 for auto-exposure.
     */
    set minEV100(value: number) {
        validateNumber(value);
        this.#minEV100 = value;
    }

    /**
     * [KO] 자동 노출 최대 EV100을 반환합니다.
     * [EN] Returns the maximum EV100 for auto-exposure.
     */
    get maxEV100(): number {
        return this.#maxEV100;
    }

    /**
     * [KO] 자동 노출 최대 EV100을 설정합니다.
     * [EN] Sets the maximum EV100 for auto-exposure.
     */
    set maxEV100(value: number) {
        validateNumber(value);
        this.#maxEV100 = value;
    }

    /**
     * [KO] 눈 적응 속도(밝아질 때)를 반환합니다.
     * [EN] Returns the eye adaptation speed (brightening).
     */
    get adaptationSpeedUp(): number {
        return this.#adaptationSpeedUp;
    }

    /**
     * [KO] 눈 적응 속도(밝아질 때)를 설정합니다.
     * [EN] Sets the eye adaptation speed (brightening).
     */
    set adaptationSpeedUp(value: number) {
        validateNumber(value);
        this.#adaptationSpeedUp = value;
    }

    /**
     * [KO] 눈 적응 속도(어두워질 때)를 반환합니다.
     * [EN] Returns the eye adaptation speed (darkening).
     */
    get adaptationSpeedDown(): number {
        return this.#adaptationSpeedDown;
    }

    /**
     * [KO] 눈 적응 속도(어두워질 때)를 설정합니다.
     * [EN] Sets the eye adaptation speed (darkening).
     */
    set adaptationSpeedDown(value: number) {
        validateNumber(value);
        this.#adaptationSpeedDown = value;
    }

    /**
     * [KO] 히스토그램 분석 범위(하위 퍼센트 제외)를 반환합니다.
     * [EN] Returns the histogram analysis range (exclude bottom percentile).
     */
    get lowPercentile(): number {
        return this.#lowPercentile;
    }

    /**
     * [KO] 히스토그램 분석 범위(하위 퍼센트 제외)를 설정합니다.
     * [EN] Sets the histogram analysis range (exclude bottom percentile).
     */
    set lowPercentile(value: number) {
        validateNumber(value);
        this.#lowPercentile = value;
    }

    /**
     * [KO] 히스토그램 분석 범위(상위 퍼센트 제외)를 반환합니다.
     * [EN] Returns the histogram analysis range (exclude top percentile).
     */
    get highPercentile(): number {
        return this.#highPercentile;
    }

    /**
     * [KO] 히스토그램 분석 범위(상위 퍼센트 제외)를 설정합니다.
     * [EN] Sets the histogram analysis range (exclude top percentile).
     */
    set highPercentile(value: number) {
        validateNumber(value);
        this.#highPercentile = value;
    }

    /**
     * [KO] 조리개(f-stop) 값을 반환합니다.
     * [EN] Returns the aperture (f-stop) value.
     */
    get aperture(): number {
        return this.#aperture;
    }

    /**
     * [KO] 조리개(f-stop) 값을 설정합니다.
     * [EN] Sets the aperture (f-stop) value.
     */
    set aperture(value: number) {
        validateNumber(value);
        if (this.#aperture === value) return;
        this.#aperture = value;
        this.#exposureDirty = true;
    }

    /**
     * [KO] 셔터 속도(초 단위)를 반환합니다.
     * [EN] Returns the shutter speed (in seconds).
     */
    get shutterSpeed(): number {
        return this.#shutterSpeed;
    }

    /**
     * [KO] 셔터 속도(초 단위)를 설정합니다.
     * [EN] Sets the shutter speed (in seconds).
     */
    set shutterSpeed(value: number) {
        validateNumber(value);
        if (this.#shutterSpeed === value) return;
        this.#shutterSpeed = value;
        this.#exposureDirty = true;
    }

    /**
     * [KO] 센서 감도(ISO)를 반환합니다.
     * [EN] Returns the sensor sensitivity (ISO).
     */
    get iso(): number {
        return this.#iso;
    }

    /**
     * [KO] 센서 감도(ISO)를 설정합니다.
     * [EN] Sets the sensor sensitivity (ISO).
     */
    set iso(value: number) {
        validateNumber(value);
        if (this.#iso === value) return;
        this.#iso = value;
        this.#exposureDirty = true;
    }

    /**
     * [KO] 카메라 이름을 반환합니다.
     * [EN] Returns the camera name.
     */
    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    /**
     * [KO] 카메라 이름을 설정합니다.
     * [EN] Sets the camera name.
     */
    set name(value: string) {
        this.#name = value;
    }

    #updateExposure(): void {
        // [KO] EV100 = log2( (Aperture^2 / ShutterSpeed) * (100 / ISO) )
        this.#ev100 = Math.log2((this.#aperture * this.#aperture / this.#shutterSpeed) * (100 / this.#iso));

        // [KO] 물리 기반 노출 배율 계산
        // [EN] Physically based exposure scale calculation
        // [KO] 공식: (targetLuminance * 2^ExposureCompensation) / (K * 2^EV100)
        // [EN] Formula: (targetLuminance * 2^ExposureCompensation) / (K * 2^EV100)
        const luminanceScale = this.#targetLuminance / ACamera.CALIBRATION_CONSTANT;
        this.#exposure = (luminanceScale * Math.pow(2, this.#exposureCompensation)) / Math.pow(2, this.#ev100);

        this.#exposureDirty = false;
    }
}

export default ACamera;
