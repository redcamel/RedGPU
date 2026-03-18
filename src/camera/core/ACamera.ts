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
    #exposureCompensation: number = 0;

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

        // [KO] Exposure Scale = 1 / (K * 2^EV100) * 2^Bias
        // [EN] Exposure Scale = 1 / (K * 2^EV100) * 2^Bias
        const baseExposure = 1 / (ACamera.CALIBRATION_CONSTANT * Math.pow(2, this.#ev100));
        this.#exposure = baseExposure * Math.pow(2, this.#exposureCompensation);

        this.#exposureDirty = false;
    }
}

export default ACamera;
