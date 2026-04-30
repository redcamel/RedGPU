import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import type View3D from "../../display/view/View3D";

/**
 * [KO] 모든 카메라의 기본이 되는 추상 클래스입니다. 물리적 카메라 속성과 공통 메타데이터를 관리합니다.
 * [EN] Abstract base class for all cameras. Manages physical camera properties and common metadata.
 */
abstract class ACamera {
    /**
     * [KO] 교정 상수 (Calibration Constant, K)
     * [EN] Calibration constant (K)
     * @description
     * [KO] 언리얼 엔진 5 및 사진학적 표준 (ISO 2720 표준 기준 K = 12.5)
     * [EN] Unreal Engine 5 and photographic standard (K = 12.5 based on ISO 2720)
     */
    static readonly CALIBRATION_CONSTANT: number = 12.5;
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
    #aperture: number = 16.0;
    /**
     * [KO] 셔터 속도 (초)
     * [EN] Shutter speed (seconds)
     */
    #shutterSpeed: number = 1 / 3200;
    /**
     * [KO] 센서 감도 (ISO)
     * [EN] Sensor sensitivity (ISO)
     */
    #iso: number = 100;
    /**
     * [KO] 캐시된 EV100
     * [EN] Cached EV100
     */
    #ev100: number = 0;

    /**
     * [KO] 자동 노출 사용 여부
     * [EN] Whether to use auto exposure
     */
    #useAutoExposure: boolean = true;

    /**
     * [KO] 노출 값이 다시 계산되어야 하는지 여부
     * [EN] Whether the exposure needs to be recalculated
     */
    #exposureDirty: boolean = true;

    /**
     * [KO] 자동 노출 사용 여부를 반환합니다.
     * [EN] Returns whether to use auto exposure.
     */
    get useAutoExposure(): boolean {
        return this.#useAutoExposure;
    }

    /**
     * [KO] 자동 노출 사용 여부를 설정합니다.
     * [EN] Sets whether to use auto exposure.
     */
    set useAutoExposure(value: boolean) {
        if (this.#useAutoExposure === value) return;

        if (this.#useAutoExposure && !value) {
            // [KO] ON -> OFF 전환 시: 시각적 연속성을 위해 셔터 속도를 재계산하고 표준 값으로 스냅합니다.
            // [EN] ON -> OFF transition: Recalculate shutter speed and snap to standard values for visual continuity.

            // 1. ISO를 100으로 표준화 (Standardize ISO to 100)
            this.#iso = 100;

            // 2. 현재 EV100을 유지하기 위한 셔터 속도 계산 (ISO 100 기준)
            let rawShutterSpeed = (this.#aperture * this.#aperture) / Math.pow(2, this.#ev100);

            // 3. 표준 셔터 스피드 리스트 (1/3 스탑 단위)
            const standardSpeeds = [
                1, 1 / 1.3, 1 / 1.6, 1 / 2, 1 / 2.5, 1 / 3.2, 1 / 4, 1 / 5, 1 / 6, 1 / 8, 1 / 10, 1 / 13, 1 / 15, 1 / 20, 1 / 25, 1 / 30, 1 / 40, 1 / 50, 1 / 60, 1 / 80, 1 / 100, 1 / 125, 1 / 160, 1 / 200, 1 / 250, 1 / 320, 1 / 400, 1 / 500, 1 / 640, 1 / 800, 1 / 1000, 1 / 1250, 1 / 1600, 1 / 2000, 1 / 2500, 1 / 3200, 1 / 4000, 1 / 5000, 1 / 6400, 1 / 8000
            ];

            // 가장 가까운 표준 값 찾기
            this.#shutterSpeed = standardSpeeds.reduce((prev, curr) =>
                Math.abs(curr - rawShutterSpeed) < Math.abs(prev - rawShutterSpeed) ? curr : prev
            );

            this.#exposureDirty = true;
        }

        this.#useAutoExposure = value;
    }

    /**
     * [KO] 물리적 노출 지수(EV100)를 반환합니다.
     * [EN] Returns the physical exposure value (EV100).
     */
    get ev100(): number {
        if (this.#exposureDirty) this.updateExposure();
        return this.#ev100;
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

    /**
     * [KO] 노출 값을 업데이트합니다.
     * [EN] Updates the exposure value.
     * @param view [KO] View3D 인스턴스 (선택 사항) [EN] View3D instance (optional)
     */
    updateExposure(view?: View3D): void {
        if (view && this.#useAutoExposure) {
            // [KO] 자동 노출 사용 시 적응된 EV100 값을 가져옴
            // [EN] Get the adapted EV100 value when using auto exposure
            this.#ev100 = view.postEffectManager.autoExposure.currentAdaptedEV100;
        } else {
            // [KO] 물리적 수치 기반 EV100 계산: log2( (Aperture^2 / ShutterSpeed) * (100 / ISO) )
            // [EN] Calculate EV100 based on physical values: log2( (Aperture^2 / ShutterSpeed) * (100 / ISO) )
            this.#ev100 = Math.log2((this.#aperture * this.#aperture / this.#shutterSpeed) * (100 / this.#iso));
        }
        this.#exposureDirty = false;
    }
}

export default ACamera;
