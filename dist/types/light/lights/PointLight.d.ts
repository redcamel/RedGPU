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
declare class PointLight extends ABaseLight {
    #private;
    /**
     * 새로운 PointLight 인스턴스를 생성합니다.
     *
     * @param color - 광원의 색상 (hex 문자열, 예: '#ffffff')
     * @param intensity - 광원의 세기 (기본값: 1)
     */
    constructor(color?: string, intensity?: number);
    /** X 좌표를 반환합니다. */
    get x(): number;
    /** X 좌표를 설정합니다. */
    set x(value: number);
    /** Y 좌표를 반환합니다. */
    get y(): number;
    /** Y 좌표를 설정합니다. */
    set y(value: number);
    /** Z 좌표를 반환합니다. */
    get z(): number;
    /** Z 좌표를 설정합니다. */
    set z(value: number);
    /**
     * 광원의 위치를 [x, y, z] 형태로 반환합니다.
     */
    get position(): [number, number, number];
    /**
     * 광원의 반경을 반환합니다.
     */
    get radius(): number;
    /**
     * 광원의 반경을 설정합니다.
     *
     * @param value - 반경 값 (예: 5.0)
     */
    set radius(value: number);
    /**
     * 광원의 위치를 설정합니다.
     *
     * @param x - X 좌표 또는 [x, y, z] 배열
     * @param y - Y 좌표 (x가 숫자일 경우)
     * @param z - Z 좌표 (x가 숫자일 경우)
     */
    setPosition(x: number | [number, number, number], y?: number, z?: number): void;
}
export default PointLight;
