import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../color/convertHexToRgb";
import ABaseLight from "../core/ABaseLight";

/**
 * [KO] 씬 전체에 방향성이나 그림자 없이 균일한 기본 밝기와 색조를 부여하는 환경광(Ambient Light) 클래스입니다.
 * [EN] Ambient light class that provides uniform base brightness and tint across the entire scene without directionality or shadows.
 *
 * ### Example
 * ```typescript
 * const ambientLight = new RedGPU.Light.AmbientLight('#ADD8E6', 50);
 * scene.lightManager.ambientLight = ambientLight;
 * ```
 *
 * @category Light
 */
class AmbientLight extends ABaseLight {
    #lux: number

    /**
     * [KO] 새로운 AmbientLight 인스턴스를 생성합니다.
     * [EN] Creates a new AmbientLight instance.
     *
     * ### Example
     * ```typescript
     * const light = new RedGPU.Light.AmbientLight('#ffffff', 100);
     * ```
     *
     * @param color -
     * [KO] 조명의 색상 (HEX 문자열, 기본값: `'#ADD8E6'`)
     * [EN] Light color (HEX string, default: `'#ADD8E6'`)
     * @param lux -
     * [KO] 조명의 조도 (Lux 단위, 기본값: `50`)
     * [EN] Illuminance of the light (in Lux, default: `50`)
     */
    constructor(color: string = '#ADD8E6', lux: number = 50) {
        super(new ColorRGB(...convertHexToRgb(color, true)));
        this.#lux = lux
    }

    /**
     * [KO] 환경광의 조도(Lux)를 반환하거나 설정합니다.
     * [EN] Gets or sets the illuminance (Lux) of the ambient light.
     *
     * @returns
     * [KO] 조도 값 (Lux)
     * [EN] Illuminance value (Lux)
     */
    get lux(): number {
        return this.#lux;
    }

    set lux(value: number) {
        this.#lux = value;
    }
}

Object.freeze(AmbientLight);
export default AmbientLight;