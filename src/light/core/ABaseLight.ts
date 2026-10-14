import ColorRGB from "../../color/ColorRGB";
import ADrawDebuggerLight from "../../display/drawDebugger/light/ADrawDebuggerLight";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * [KO] 모든 조명(Light) 클래스의 기본이 되는 추상 클래스입니다.
 * [EN] Abstract class that serves as the base for all light classes.
 *
 * [KO] 조명의 색상(`color`), 강도 배율(`intensityMultiplier`), 디버거 활성화(`enableDebugger`) 등 모든 조명이 공유하는 공통 속성을 정의합니다.
 * [EN] Defines common properties shared by all lights, such as light color (`color`), intensity multiplier (`intensityMultiplier`), and debugger activation (`enableDebugger`).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Light
 */
abstract class ABaseLight {
    /**
     * [KO] 조명 영역을 시각적으로 표시하는 디버거 객체
     * [EN] Debugger object that visually displays the light area
     */
    drawDebugger: ADrawDebuggerLight<ABaseLight>;
    #color: ColorRGB;
    #intensityMultiplier: number;
    #enableDebugger: boolean = false;

    /**
     * [KO] ABaseLight의 생성자입니다.
     * [EN] Constructor for ABaseLight.
     *
     * @param color -
     * [KO] 조명의 기본 색상 (`ColorRGB` 인스턴스)
     * [EN] Base color of the light (`ColorRGB` instance)
     * @param intensityMultiplier -
     * [KO] 조명 강도 배율 (기본값: `1`)
     * [EN] Light intensity multiplier (default: `1`)
     */
    protected constructor(color: ColorRGB, intensityMultiplier: number = 1) {
        this.#color = color;
        this.#intensityMultiplier = intensityMultiplier;
    }

    /**
     * [KO] 조명 디버거 활성화 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether the light debugger is enabled.
     *
     * ### Example
     * ```typescript
     * // [KO] 조명 디버거 활성화
     * // [EN] Enable light debugger
     * light.enableDebugger = true;
     * ```
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
     * [KO] 조명의 색상(`ColorRGB`) 객체를 가져오거나 설정합니다.
     * [EN] Gets or sets the color (`ColorRGB`) object of the light.
     *
     * ### Example
     * ```typescript
     * // [KO] 조명 색상 변경
     * // [EN] Change light color
     * light.color.setColorByHEX('#ff0000');
     * ```
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
     * [KO] 조명의 시각적 강도를 조절하기 위한 강도 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the intensity multiplier to adjust the visual strength of the light.
     *
     * ### Example
     * ```typescript
     * // [KO] 조명 강도 배율 설정
     * // [EN] Set light intensity multiplier
     * light.intensityMultiplier = 1.5;
     * ```
     *
     * @returns
     * [KO] 조명 강도 배율 (`0` 이상의 값)
     * [EN] Light intensity multiplier (value greater than or equal to `0`)
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