import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import type View3D from "../../display/view/View3D";
import BaseObject from "../../base/BaseObject";

const STANDARD_SHUTTER_SPEEDS = [
    1, 1 / 1.3, 1 / 1.6, 1 / 2, 1 / 2.5, 1 / 3.2, 1 / 4, 1 / 5, 1 / 6, 1 / 8, 1 / 10, 1 / 13, 1 / 15, 1 / 20, 1 / 25, 1 / 30, 1 / 40, 1 / 50, 1 / 60, 1 / 80, 1 / 100, 1 / 125, 1 / 160, 1 / 200, 1 / 250, 1 / 320, 1 / 400, 1 / 500, 1 / 640, 1 / 800, 1 / 1000, 1 / 1250, 1 / 1600, 1 / 2000, 1 / 2500, 1 / 3200, 1 / 4000, 1 / 5000, 1 / 6400, 1 / 8000
];

/**
 * [KO] 모든 카메라 클래스의 최상위 추상 클래스로, 조리개·셔터 속도·ISO 기반 물리 노출(EV100) 연산을 관리합니다.
 * [EN] Abstract base class for all cameras, managing physical exposure (EV100) calculations based on aperture, shutter speed, and ISO.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
abstract class ACamera extends BaseObject {
    #aperture: number = 16.0;
    #shutterSpeed: number = 1 / 3200;
    #iso: number = 100;
    #ev100: number = 0;
    #useAutoExposure: boolean = true;
    #isExposureDirty: boolean = true;

    /**
     * [KO] 자동 노출 활성화 여부를 가져오거나 설정합니다. 비활성화(`false`) 전환 시 현재 EV100을 유지하도록 ISO를 100으로 고정하고 가장 가까운 표준 셔터 속도로 스냅합니다. (기본값: `true`)
     * [EN] Gets or sets whether auto exposure is enabled. When switched to `false`, fixes ISO to 100 and snaps shutter speed to the nearest standard stop to preserve the current EV100. (Default: `true`)
     *
     * @returns
     * [KO] 자동 노출 활성화 여부
     * [EN] Whether auto exposure is enabled
     */
    get useAutoExposure(): boolean {
        return this.#useAutoExposure;
    }

    set useAutoExposure(value: boolean) {
        if (this.#useAutoExposure === value) return;

        if (this.#useAutoExposure && !value) {
            this.#iso = 100;
            const rawShutterSpeed = (this.#aperture * this.#aperture) / Math.pow(2, this.#ev100);

            let closestSpeed = STANDARD_SHUTTER_SPEEDS[0];
            let minDiff = Math.abs(closestSpeed - rawShutterSpeed);
            for (let i = 1, length = STANDARD_SHUTTER_SPEEDS.length; i < length; i++) {
                const currentSpeed = STANDARD_SHUTTER_SPEEDS[i];
                const diff = Math.abs(currentSpeed - rawShutterSpeed);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestSpeed = currentSpeed;
                }
            }
            this.#shutterSpeed = closestSpeed;

            this.#isExposureDirty = true;
        }

        this.#useAutoExposure = value;
    }

    /**
     * [KO] ISO 100 기준 물리적 노출 지수(EV100)를 반환합니다.
     * [EN] Returns the physical exposure value at ISO 100 (EV100).
     *
     * @returns
     * [KO] EV100 값
     * [EN] EV100 value
     */
    get ev100(): number {
        if (this.#isExposureDirty) this.updateExposure();
        return this.#ev100;
    }

    /**
     * [KO] 조리개(f-stop) 값을 가져오거나 설정합니다. (양수, 기본값: `16.0`)
     * [EN] Gets or sets the aperture (f-stop) value. (Positive number, Default: `16.0`)
     *
     * @returns
     * [KO] 조리개(f-stop) 값
     * [EN] Aperture (f-stop) value
     */
    get aperture(): number {
        return this.#aperture;
    }

    set aperture(value: number) {
        validatePositiveNumberRange(value, Number.MIN_VALUE);
        if (this.#aperture === value) return;
        this.#aperture = value;
        this.#isExposureDirty = true;
    }

    /**
     * [KO] 초(second) 단위의 셔터 속도를 가져오거나 설정합니다. (양수, 기본값: `1 / 3200`)
     * [EN] Gets or sets the shutter speed in seconds. (Positive number, Default: `1 / 3200`)
     *
     * @returns
     * [KO] 셔터 속도 (초)
     * [EN] Shutter speed in seconds
     */
    get shutterSpeed(): number {
        return this.#shutterSpeed;
    }

    set shutterSpeed(value: number) {
        validatePositiveNumberRange(value, Number.MIN_VALUE);
        if (this.#shutterSpeed === value) return;
        this.#shutterSpeed = value;
        this.#isExposureDirty = true;
    }

    /**
     * [KO] 센서 감도(ISO)를 가져오거나 설정합니다. (양수, 기본값: `100`)
     * [EN] Gets or sets the sensor sensitivity (ISO). (Positive number, Default: `100`)
     *
     * @returns
     * [KO] ISO 감도 값
     * [EN] ISO sensitivity value
     */
    get iso(): number {
        return this.#iso;
    }

    set iso(value: number) {
        validatePositiveNumberRange(value, Number.MIN_VALUE);
        if (this.#iso === value) return;
        this.#iso = value;
        this.#isExposureDirty = true;
    }

    /**
     * [KO] 자동 노출 결과 또는 수동 물리 파라미터(`aperture`, `shutterSpeed`, `iso`)를 바탕으로 `ev100` 값을 갱신합니다.
     * [EN] Updates the `ev100` value based on auto exposure results or manual physical parameters (`aperture`, `shutterSpeed`, `iso`).
     *
     * @param view -
     * [KO] 자동 노출 값을 참조할 `View3D` 인스턴스 (선택)
     * [EN] Optional `View3D` instance from which to read adapted auto exposure
     */
    updateExposure(view?: View3D): void {
        if (view && this.#useAutoExposure) {
            this.#ev100 = view.builtInEffectManager.autoExposure.currentAdaptedEV100;
        } else {
            this.#ev100 = Math.log2((this.#aperture * this.#aperture / this.#shutterSpeed) * (100 / this.#iso));
        }
        this.#isExposureDirty = false;
    }
}

Object.freeze(ACamera);
export default ACamera;

