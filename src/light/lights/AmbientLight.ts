import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../color/convertHexToRgb";
import ABaseLight from "../core/ABaseLight";

/**
 * [KO] 환경광(AmbientLight)을 정의하는 클래스입니다.
 * [EN] Class that defines AmbientLight.
 *
 * [KO] 씬 전체에 균일하게 퍼지는 기본 조명으로, 그림자나 방향성 없이 모든 객체에 동일한 밝기를 제공합니다.
 * [KO] 광량 단위로 **룩스(Lux, lx)**를 사용하며, 자동 노출(Auto-Exposure) 시스템과 연동됩니다.
 * [EN] Basic lighting that spreads uniformly across the scene, providing the same brightness to all objects without shadows or directionality.
 * [EN] Uses **Lux (lx)** as the light unit and works with the Auto-Exposure system.
 *
 * ### [KO] 조도 기준 예시 (Lux)
 * - 보름달 밤: 0.25 lx
 * - 일반 거실: 50 lx
 * - 사무실: 300 ~ 500 lx
 * - 흐린 날 야외: 1,000 lx
 * - 태양 직사광: 100,000 lx
 *
 * * ### Example
 * ```typescript
 * const ambient = new RedGPU.Light.AmbientLight('#ADD8E6', 50); // 50 Lux
 * scene.lightManager.ambientLight = ambient;
 * ```
 * @category Light
 */
class AmbientLight extends ABaseLight {
    #lux: number = 0

    /**
     * [KO] 새로운 AmbientLight 인스턴스를 생성합니다.
     * [EN] Creates a new AmbientLight instance.
     * @param color -
     * [KO] 광원의 색상 (기본값: 연한 하늘색 #ADD8E6)
     * [EN] Color of the light (default: light sky blue #ADD8E6)
     * @param lux -
     * [KO] 광원의 조도 (단위: Lux, 기본값: 0)
     * [EN] Illuminance of the light (unit: Lux, default: 0)
     */
    constructor(color: string = '#ADD8E6', lux: number = 0) {
        super(new ColorRGB(...convertHexToRgb(color, true)));
        this.#lux = lux
    }

    /**
     * [KO] 광원의 조도(Lux)를 반환하거나 설정합니다.
     * [EN] Returns or sets the illuminance (Lux) of the light.
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