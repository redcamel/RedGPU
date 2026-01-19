import ABaseLight from "../core/ABaseLight";
/**
 * [KO] 방향성 광원을 정의하는 클래스입니다.
 * [EN] Class that defines a directional light source.
 *
 * [KO] 이 광원은 특정 방향으로 균일하게 빛을 투사하며, 태양광과 같은 효과를 구현할 때 사용됩니다. 위치 기반이 아닌 방향 기반으로 작동하며, 그림자 생성 및 광원 시뮬레이션에 적합합니다.
 * [EN] This light projects light uniformly in a specific direction and is used to implement effects like sunlight. It operates based on direction rather than position and is suitable for shadow generation and light simulation.
 * * ### Example
 * ```typescript
 * const light = new RedGPU.Light.DirectionalLight();
 * scene.lightManager.addDirectionalLight(light);
 * ```
 * <iframe src="/RedGPU/examples/3d/light/directionalLight/" ></iframe>
 * @category Light
 */
declare class DirectionalLight extends ABaseLight {
    #private;
    /**
     * [KO] 새로운 DirectionalLight 인스턴스를 생성합니다.
     * [EN] Creates a new DirectionalLight instance.
     * @param direction -
     * [KO] 광원의 방향 벡터 [x, y, z]
     * [EN] Direction vector of the light [x, y, z]
     * @param color -
     * [KO] 광원의 색상 (hex 문자열, 예: '#ffcc00')
     * [EN] Color of the light (hex string, e.g., '#ffcc00')
     * @param intensity -
     * [KO] 광원의 세기 (기본값: 1)
     * [EN] Intensity of the light (default: 1)
     */
    constructor(direction?: [number, number, number], color?: string, intensity?: number);
    /**
     * [KO] 광원의 X 방향 벡터 값을 반환합니다.
     * [EN] Returns the X direction vector value of the light.
     * @returns
     * [KO] X 방향 벡터 값
     * [EN] X direction vector value
     */
    get directionX(): number;
    /**
     * [KO] 광원의 X 방향 벡터 값을 설정합니다.
     * [EN] Sets the X direction vector value of the light.
     * @param value -
     * [KO] X 방향 벡터 값
     * [EN] X direction vector value
     */
    set directionX(value: number);
    /**
     * [KO] 광원의 Y 방향 벡터 값을 반환합니다.
     * [EN] Returns the Y direction vector value of the light.
     * @returns
     * [KO] Y 방향 벡터 값
     * [EN] Y direction vector value
     */
    get directionY(): number;
    /**
     * [KO] 광원의 Y 방향 벡터 값을 설정합니다.
     * [EN] Sets the Y direction vector value of the light.
     * @param value -
     * [KO] Y 방향 벡터 값
     * [EN] Y direction vector value
     */
    set directionY(value: number);
    /**
     * [KO] 광원의 Z 방향 벡터 값을 반환합니다.
     * [EN] Returns the Z direction vector value of the light.
     * @returns
     * [KO] Z 방향 벡터 값
     * [EN] Z direction vector value
     */
    get directionZ(): number;
    /**
     * [KO] 광원의 Z 방향 벡터 값을 설정합니다.
     * [EN] Sets the Z direction vector value of the light.
     * @param value -
     * [KO] Z 방향 벡터 값
     * [EN] Z direction vector value
     */
    set directionZ(value: number);
    /**
     * [KO] 광원의 전체 방향 벡터를 반환합니다.
     * [EN] Returns the full direction vector of the light.
     * @returns
     * [KO] 방향 벡터 [x, y, z]
     * [EN] Direction vector [x, y, z]
     */
    get direction(): [number, number, number];
    /**
     * [KO] 광원의 전체 방향 벡터를 설정합니다.
     * [EN] Sets the full direction vector of the light.
     * @param value -
     * [KO] 방향 벡터 [x, y, z]
     * [EN] Direction vector [x, y, z]
     */
    set direction(value: [number, number, number]);
}
export default DirectionalLight;
