import ABaseLight from "../core/ABaseLight";
/**
 * 환경광(AmbientLight)을 정의하는 클래스입니다.
 *
 * 이 광원은 씬 전체에 균일하게 퍼지는 기본 조명으로,
 * 그림자나 방향성 없이 모든 객체에 동일한 밝기를 제공합니다.
 * 주로 전체적인 분위기 조절이나 기본 조명으로 사용됩니다.
 *
 * @example
 * ```javascript
 * const ambient = new RedGPU.Light.AmbientLight();
 * scene.lightManager.ambientLight = ambient;
 * ```
 * @category Light
 */
declare class AmbientLight extends ABaseLight {
    /**
     * 새로운 AmbientLight 인스턴스를 생성합니다.
     *
     * @param color - 광원의 색상 (기본값: 연한 하늘색 #ADD8E6)
     * @param intensity - 광원의 세기 (기본값: 0.1)
     */
    constructor(color?: string, intensity?: number);
}
export default AmbientLight;
