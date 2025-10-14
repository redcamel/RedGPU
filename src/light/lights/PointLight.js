import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../utils/convertColor/convertHexToRgb";
import ABaseLight from "../core/ABaseLight";
/**
 * 점광원(PointLight)을 정의하는 클래스입니다.
 *
 * 이 광원은 특정 위치에서 모든 방향으로 빛을 방사하며,
 * 반경(radius)을 기준으로 빛의 영향을 받는 범위를 설정할 수 있습니다.
 *
 * @example
 * ```javascript
 * const light = new RedGPU.Light.PointLight('#ffcc00', 1.5);
 * light.setPosition(0, 5, 10);
 * scene.lightManager.addPointLight(light);
 * ```
 * <iframe src="/RedGPU/examples/3d/light/pointLight/" ></iframe>
 *
 * 아래는 PointLight 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [PointLight Cluster Performance example](/RedGPU/examples/3d/light/pointLightPerformance/)
 * @category Light
 */
class PointLight extends ABaseLight {
    /** 광원의 영향을 미치는 반경입니다. */
    #radius = 1;
    /** 광원의 X 좌표입니다. */
    #x = 0;
    /** 광원의 Y 좌표입니다. */
    #y = 0;
    /** 광원의 Z 좌표입니다. */
    #z = 0;
    /**
     * 새로운 PointLight 인스턴스를 생성합니다.
     *
     * @param color - 광원의 색상 (hex 문자열, 예: '#ffffff')
     * @param intensity - 광원의 세기 (기본값: 1)
     */
    constructor(color = '#fff', intensity = 1) {
        super(new ColorRGB(...convertHexToRgb(color, true)), intensity);
    }
    /** X 좌표를 반환합니다. */
    get x() {
        return this.#x;
    }
    /** X 좌표를 설정합니다. */
    set x(value) {
        this.#x = value;
    }
    /** Y 좌표를 반환합니다. */
    get y() {
        return this.#y;
    }
    /** Y 좌표를 설정합니다. */
    set y(value) {
        this.#y = value;
    }
    /** Z 좌표를 반환합니다. */
    get z() {
        return this.#z;
    }
    /** Z 좌표를 설정합니다. */
    set z(value) {
        this.#z = value;
    }
    /**
     * 광원의 위치를 [x, y, z] 형태로 반환합니다.
     */
    get position() {
        return [this.#x, this.#y, this.#z];
    }
    /**
     * 광원의 반경을 반환합니다.
     */
    get radius() {
        return this.#radius;
    }
    /**
     * 광원의 반경을 설정합니다.
     *
     * @param value - 반경 값 (예: 5.0)
     */
    set radius(value) {
        this.#radius = value;
    }
    /**
     * 광원의 위치를 설정합니다.
     *
     * @param x - X 좌표 또는 [x, y, z] 배열
     * @param y - Y 좌표 (x가 숫자일 경우)
     * @param z - Z 좌표 (x가 숫자일 경우)
     */
    setPosition(x, y, z) {
        if (Array.isArray(x)) {
            [this.#x, this.#y, this.#z] = x;
        }
        else {
            this.#x = x;
            this.#y = y;
            this.#z = z;
        }
    }
}
Object.freeze(PointLight);
export default PointLight;
