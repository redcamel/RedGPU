import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../color/convertHexToRgb";
import ABaseLight from "../core/ABaseLight";

/**
 * 방향성 광원을 정의하는 클래스입니다.
 *
 * 이 광원은 특정 방향으로 균일하게 빛을 투사하며, 태양광과 같은 효과를 구현할 때 사용됩니다.
 * 위치 기반이 아닌 방향 기반으로 작동하며, 그림자 생성 및 광원 시뮬레이션에 적합합니다.
 *
 * @example
 * ```javascript
 * const light = new RedGPU.Light.DirectionalLight();
 * scene.lightManager.addDirectionalLight(light);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/light/directionalLight/" ></iframe>
 *
 * @category Light
 */
class DirectionalLight extends ABaseLight {
    /**
     * 광원의 X 방향 벡터 값입니다.
     * 기본값은 -1이며, 광원이 왼쪽 방향으로 향하도록 설정됩니다.
     */
    #directionX: number = -1;
    /**
     * 광원의 Y 방향 벡터 값입니다.
     * 기본값은 -1이며, 광원이 아래 방향으로 향하도록 설정됩니다.
     */
    #directionY: number = -1;
    /**
     * 광원의 Z 방향 벡터 값입니다.
     * 기본값은 -1이며, 광원이 뒤쪽 방향으로 향하도록 설정됩니다.
     */
    #directionZ: number = -1;

    /**
     * 새로운 DirectionalLight 인스턴스를 생성합니다.
     *
     * @param direction - 광원의 방향 벡터 [x, y, z]
     * @param color - 광원의 색상 (hex 문자열, 예: '#ffcc00')
     * @param intensity - 광원의 세기 (기본값: 1)
     */
    constructor(direction: [number, number, number] = [-1, -1, -1], color: string = '#fff', intensity: number = 1) {
        super(new ColorRGB(...convertHexToRgb(color, true)), intensity);
        this.#directionX = direction[0];
        this.#directionY = direction[1];
        this.#directionZ = direction[2];
    }

    /** 광원의 X 방향 벡터 값을 반환합니다. */
    get directionX(): number {
        return this.#directionX;
    }

    /** 광원의 X 방향 벡터 값을 설정합니다. */
    set directionX(value: number) {
        this.#directionX = value;
    }

    /** 광원의 Y 방향 벡터 값을 반환합니다. */
    get directionY(): number {
        return this.#directionY;
    }

    /** 광원의 Y 방향 벡터 값을 설정합니다. */
    set directionY(value: number) {
        this.#directionY = value;
    }

    /** 광원의 Z 방향 벡터 값을 반환합니다. */
    get directionZ(): number {
        return this.#directionZ;
    }

    /** 광원의 Z 방향 벡터 값을 설정합니다. */
    set directionZ(value: number) {
        this.#directionZ = value;
    }

    /**
     * 광원의 전체 방향 벡터를 반환합니다.
     *
     * @returns 방향 벡터 [x, y, z]
     */
    get direction(): [number, number, number] {
        return [this.#directionX, this.#directionY, this.#directionZ];
    }

    /**
     * 광원의 전체 방향 벡터를 설정합니다.
     *
     * @param value - 방향 벡터 [x, y, z]
     */
    set direction(value: [number, number, number]) {
        this.#directionX = value[0];
        this.#directionY = value[1];
        this.#directionZ = value[2];
    }
}

Object.freeze(DirectionalLight);
export default DirectionalLight;
