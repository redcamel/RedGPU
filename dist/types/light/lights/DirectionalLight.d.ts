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
declare class DirectionalLight extends ABaseLight {
    #private;
    /**
     * 새로운 DirectionalLight 인스턴스를 생성합니다.
     *
     * @param direction - 광원의 방향 벡터 [x, y, z]
     * @param color - 광원의 색상 (hex 문자열, 예: '#ffcc00')
     * @param intensity - 광원의 세기 (기본값: 1)
     */
    constructor(direction?: [number, number, number], color?: string, intensity?: number);
    /** 광원의 X 방향 벡터 값을 반환합니다. */
    get directionX(): number;
    /** 광원의 X 방향 벡터 값을 설정합니다. */
    set directionX(value: number);
    /** 광원의 Y 방향 벡터 값을 반환합니다. */
    get directionY(): number;
    /** 광원의 Y 방향 벡터 값을 설정합니다. */
    set directionY(value: number);
    /** 광원의 Z 방향 벡터 값을 반환합니다. */
    get directionZ(): number;
    /** 광원의 Z 방향 벡터 값을 설정합니다. */
    set directionZ(value: number);
    /**
     * 광원의 전체 방향 벡터를 반환합니다.
     *
     * @returns 방향 벡터 [x, y, z]
     */
    get direction(): [number, number, number];
    /**
     * 광원의 전체 방향 벡터를 설정합니다.
     *
     * @param value - 방향 벡터 [x, y, z]
     */
    set direction(value: [number, number, number]);
}
export default DirectionalLight;
