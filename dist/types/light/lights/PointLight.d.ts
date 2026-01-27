import ABaseLight from "../core/ABaseLight";
/**
 * [KO] 점광원(PointLight)을 정의하는 클래스입니다.
 * [EN] Class that defines a point light source.
 *
 * [KO] 이 광원은 특정 위치에서 모든 방향으로 빛을 방사하며, 반경(radius)을 기준으로 빛의 영향을 받는 범위를 설정할 수 있습니다.
 * [EN] This light radiates light in all directions from a specific position, and the range affected by the light can be set based on the radius.
 * * ### Example
 * ```typescript
 * const light = new RedGPU.Light.PointLight('#ffcc00', 1.5);
 * light.setPosition(0, 5, 10);
 * scene.lightManager.addPointLight(light);
 * ```
 * <iframe src="/RedGPU/examples/3d/light/pointLight/" ></iframe>
 *
 * [KO] 아래는 PointLight 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and behavior of PointLight.
 * @see [PointLight Cluster Performance example](/RedGPU/examples/3d/light/pointLightPerformance/)
 * @category Light
 */
declare class PointLight extends ABaseLight {
    #private;
    /**
     * [KO] 새로운 PointLight 인스턴스를 생성합니다.
     * [EN] Creates a new PointLight instance.
     * @param color -
     * [KO] 광원의 색상 (hex 문자열, 예: '#ffffff')
     * [EN] Color of the light (hex string, e.g., '#ffffff')
     * @param intensity -
     * [KO] 광원의 세기 (기본값: 1)
     * [EN] Intensity of the light (default: 1)
     */
    constructor(color?: string, intensity?: number);
    /**
     * [KO] X 좌표를 반환합니다.
     * [EN] Returns the X coordinate.
     * @returns
     * [KO] X 좌표
     * [EN] X coordinate
     */
    get x(): number;
    /**
     * [KO] X 좌표를 설정합니다.
     * [EN] Sets the X coordinate.
     * @param value -
     * [KO] X 좌표
     * [EN] X coordinate
     */
    set x(value: number);
    /**
     * [KO] Y 좌표를 반환합니다.
     * [EN] Returns the Y coordinate.
     * @returns
     * [KO] Y 좌표
     * [EN] Y coordinate
     */
    get y(): number;
    /**
     * [KO] Y 좌표를 설정합니다.
     * [EN] Sets the Y coordinate.
     * @param value -
     * [KO] Y 좌표
     * [EN] Y coordinate
     */
    set y(value: number);
    /**
     * [KO] Z 좌표를 반환합니다.
     * [EN] Returns the Z coordinate.
     * @returns
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    get z(): number;
    /**
     * [KO] Z 좌표를 설정합니다.
     * [EN] Sets the Z coordinate.
     * @param value -
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    set z(value: number);
    /**
     * [KO] 광원의 위치를 [x, y, z] 형태로 반환합니다.
     * [EN] Returns the position of the light in [x, y, z] format.
     * @returns
     * [KO] 위치 배열 [x, y, z]
     * [EN] Position array [x, y, z]
     */
    get position(): [number, number, number];
    /**
     * [KO] 광원의 반경을 반환합니다.
     * [EN] Returns the radius of the light.
     * @returns
     * [KO] 반경 값
     * [EN] Radius value
     */
    get radius(): number;
    /**
     * [KO] 광원의 반경을 설정합니다.
     * [EN] Sets the radius of the light.
     * @param value -
     * [KO] 반경 값 (예: 5.0)
     * [EN] Radius value (e.g., 5.0)
     */
    set radius(value: number);
    /**
     * [KO] 광원의 위치를 설정합니다.
     * [EN] Sets the position of the light.
     * @param x -
     * [KO] X 좌표 또는 [x, y, z] 배열
     * [EN] X coordinate or [x, y, z] array
     * @param y -
     * [KO] Y 좌표 (x가 숫자일 경우)
     * [EN] Y coordinate (if x is a number)
     * @param z -
     * [KO] Z 좌표 (x가 숫자일 경우)
     * [EN] Z coordinate (if x is a number)
     */
    setPosition(x: number | [number, number, number], y?: number, z?: number): void;
}
export default PointLight;
