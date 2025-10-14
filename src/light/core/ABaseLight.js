/**
 * 모든 광원 클래스의 기본이 되는 추상 클래스입니다.
 *
 * 색상, 세기(intensity), 디버깅 시각화 기능 등을 포함하며,
 * DirectionalLight, PointLight 등 다양한 조명 클래스의 기반으로 사용됩니다.
 */
class ABaseLight {
    /**
     * 광원의 디버깅 시각화를 위한 도우미 객체입니다. sdfsdf
     * 외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.
     */
    drawDebugger;
    /** 광원의 색상 정보입니다. */
    #color;
    /** 광원의 세기(intensity)를 나타냅니다. */
    #intensity;
    /** 디버깅 시각화 기능의 활성화 여부입니다. */
    #enableDebugger = false;
    /**
     * 새로운 ABaseLight 인스턴스를 생성합니다.
     *
     * @param color - 광원의 색상 (ColorRGB 객체)
     * @param intensity - 광원의 세기 (기본값: 1)
     */
    constructor(color, intensity = 1) {
        this.#color = color;
        this.#intensity = intensity;
    }
    /**
     * 디버깅 시각화 기능의 활성화 여부를 반환합니다.
     */
    get enableDebugger() {
        return this.#enableDebugger;
    }
    /**
     * 디버깅 시각화 기능을 활성화하거나 비활성화합니다.
     *
     * @param value - true면 디버깅 기능 활성화
     */
    set enableDebugger(value) {
        this.#enableDebugger = value;
    }
    /**
     * 광원의 색상을 반환합니다.
     */
    get color() {
        return this.#color;
    }
    /**
     * 광원의 색상을 설정합니다.
     *
     * @param value - ColorRGB 객체
     */
    set color(value) {
        this.#color = value;
    }
    /**
     * 광원의 세기를 반환합니다.
     */
    get intensity() {
        return this.#intensity;
    }
    /**
     * 광원의 세기를 설정합니다.
     *
     * @param value - 숫자 값 (예: 1.0)
     */
    set intensity(value) {
        this.#intensity = value;
    }
}
Object.freeze(ABaseLight);
export default ABaseLight;
