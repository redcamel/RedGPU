import ColorRGB from "../../color/ColorRGB";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * [KO] 모든 조명(Light)의 공통 속성(`color`, `intensityMultiplier`, `enableDebugger`)을 정의하는 추상 클래스입니다.
 * [EN] Abstract class that defines common properties (`color`, `intensityMultiplier`, `enableDebugger`) for all lights.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Light
 */
abstract class ABaseLight {
    #color: ColorRGB;
    #intensityMultiplier: number;
    #enableDebugger: boolean = false;

    /**
     * [KO] ABaseLight 인스턴스를 초기화합니다.
     * [EN] Initializes the ABaseLight instance.
     *
     * @param color -
     * [KO] 조명의 기본 색상 (`ColorRGB` 인스턴스)
     * [EN] Base color of the light (`ColorRGB` instance)
     * @param intensityMultiplier -
     * [KO] 조명 강도 배율 (기본값: `1`)
     * [EN] Light intensity multiplier (default: `1`)
     */
    constructor(color: ColorRGB, intensityMultiplier: number = 1) {
        this.#color = color;
        this.#intensityMultiplier = intensityMultiplier;
    }

    /**
     * [KO] 조명 시각적 디버거 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the visual light debugger is enabled.
     *
     * @returns
     * [KO] 디버거 활성화 여부
     * [EN] Whether the debugger is enabled
     */
    get enableDebugger(): boolean {
        return this.#enableDebugger;
    }

    set enableDebugger(value: boolean) {
        this.#enableDebugger = value;
    }

    /**
     * [KO] 조명의 색상(`ColorRGB`) 인스턴스를 반환하거나 설정합니다.
     * [EN] Gets or sets the color (`ColorRGB`) instance of the light.
     *
     * @returns
     * [KO] 조명의 `ColorRGB` 인스턴스
     * [EN] `ColorRGB` instance of the light
     */
    get color(): ColorRGB {
        return this.#color;
    }

    set color(value: ColorRGB) {
        if (!(value instanceof ColorRGB)) {
            consoleAndThrowError('Only ColorRGB instances are allowed.');
        }
        this.#color = value;
    }

    /**
     * [KO] 조명 강도 배율(`0` 이상의 실수)을 반환하거나 설정합니다.
     * [EN] Gets or sets the light intensity multiplier (real number `0` or greater).
     *
     * @returns
     * [KO] 조명 강도 배율
     * [EN] Light intensity multiplier
     */
    get intensityMultiplier(): number {
        return this.#intensityMultiplier;
    }

    set intensityMultiplier(value: number) {
        validatePositiveNumberRange(value, 0);
        this.#intensityMultiplier = value;
    }
}

Object.freeze(ABaseLight);
export default ABaseLight;