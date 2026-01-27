import ABaseLight from "../core/ABaseLight";
/**
 * [KO] 스포트라이트(SpotLight)를 정의하는 클래스입니다.
 * [EN] Class that defines a spotlight source.
 *
 * [KO] 이 광원은 특정 위치에서 지정된 방향으로 빛을 방사하며, 내부/외부 컷오프 각도를 통해 빛의 퍼짐 범위를 제어할 수 있습니다.
 * [EN] This light radiates light in a specific direction from a certain position, and the spread of light can be controlled through inner/outer cutoff angles.
 * * ### Example
 * ```typescript
 * const light = new RedGPU.Light.SpotLight('#ffffff', 2.0);
 * light.setPosition(0, 5, 10);
 * light.lookAt(0, 0, 0);
 * scene.lightManager.addSpotLight(light);
 * ```
 * <iframe src="/RedGPU/examples/3d/light/spotLight/" ></iframe>
 *
 * [KO] 아래는 SpotLight 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and behavior of SpotLight.
 * @see [SpotLight Cluster Performance example](/RedGPU/examples/3d/light/spotLightPerformance/)
 * @category Light
 */
declare class SpotLight extends ABaseLight {
    #private;
    /**
     * [KO] 새로운 SpotLight 인스턴스를 생성합니다.
     * [EN] Creates a new SpotLight instance.
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
     * [KO] 방향 벡터의 X 성분을 반환합니다.
     * [EN] Returns the X component of the direction vector.
     * @returns
     * [KO] X 성분 값
     * [EN] X component value
     */
    get directionX(): number;
    /**
     * [KO] 방향 벡터의 X 성분을 설정합니다.
     * [EN] Sets the X component of the direction vector.
     * @param value -
     * [KO] X 성분 값
     * [EN] X component value
     */
    set directionX(value: number);
    /**
     * [KO] 방향 벡터의 Y 성분을 반환합니다.
     * [EN] Returns the Y component of the direction vector.
     * @returns
     * [KO] Y 성분 값
     * [EN] Y component value
     */
    get directionY(): number;
    /**
     * [KO] 방향 벡터의 Y 성분을 설정합니다.
     * [EN] Sets the Y component of the direction vector.
     * @param value -
     * [KO] Y 성분 값
     * [EN] Y component value
     */
    set directionY(value: number);
    /**
     * [KO] 방향 벡터의 Z 성분을 반환합니다.
     * [EN] Returns the Z component of the direction vector.
     * @returns
     * [KO] Z 성분 값
     * [EN] Z component value
     */
    get directionZ(): number;
    /**
     * [KO] 방향 벡터의 Z 성분을 설정합니다.
     * [EN] Sets the Z component of the direction vector.
     * @param value -
     * [KO] Z 성분 값
     * [EN] Z component value
     */
    set directionZ(value: number);
    /**
     * [KO] 광원의 방향 벡터를 [x, y, z] 형태로 반환합니다.
     * [EN] Returns the direction vector of the light in [x, y, z] format.
     * @returns
     * [KO] 방향 벡터 [x, y, z]
     * [EN] Direction vector [x, y, z]
     */
    get direction(): [number, number, number];
    /**
     * [KO] 광원의 방향 벡터를 설정합니다.
     * [EN] Sets the direction vector of the light.
     * @param value -
     * [KO] [x, y, z] 형태의 방향 벡터
     * [EN] Direction vector in [x, y, z] format
     */
    set direction(value: [number, number, number]);
    /**
     * [KO] 내부 컷오프 각도를 반환합니다.
     * [EN] Returns the inner cutoff angle.
     * @returns
     * [KO] 각도 (degree)
     * [EN] Angle (degrees)
     */
    get innerCutoff(): number;
    /**
     * [KO] 내부 컷오프 각도를 설정합니다.
     * [EN] Sets the inner cutoff angle.
     * @param degrees -
     * [KO] 각도 (degree)
     * [EN] Angle (degrees)
     */
    set innerCutoff(degrees: number);
    /**
     * [KO] 외부 컷오프 각도를 반환합니다.
     * [EN] Returns the outer cutoff angle.
     * @returns
     * [KO] 각도 (degree)
     * [EN] Angle (degrees)
     */
    get outerCutoff(): number;
    /**
     * [KO] 외부 컷오프 각도를 설정합니다.
     * [EN] Sets the outer cutoff angle.
     * @param degrees -
     * [KO] 각도 (degree)
     * [EN] Angle (degrees)
     */
    set outerCutoff(degrees: number);
    /**
     * [KO] 내부 컷오프 각도의 코사인 값을 반환합니다.
     * [EN] Returns the cosine value of the inner cutoff angle.
     *
     * [KO] 셰이더 계산 등에 사용됩니다.
     * [EN] Used for shader calculations, etc.
     * @returns
     * [KO] 코사인 값
     * [EN] Cosine value
     */
    get innerCutoffCos(): number;
    /**
     * [KO] 외부 컷오프 각도의 코사인 값을 반환합니다.
     * [EN] Returns the cosine value of the outer cutoff angle.
     *
     * [KO] 셰이더 계산 등에 사용됩니다.
     * [EN] Used for shader calculations, etc.
     * @returns
     * [KO] 코사인 값
     * [EN] Cosine value
     */
    get outerCutoffCos(): number;
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
    /**
     * [KO] 특정 타겟 위치를 바라보도록 방향 벡터를 설정합니다.
     * [EN] Sets the direction vector to look at a specific target position.
     * @param targetX -
     * [KO] 타겟 X 좌표 또는 [x, y, z] 배열
     * [EN] Target X coordinate or [x, y, z] array
     * @param targetY -
     * [KO] 타겟 Y 좌표 (targetX가 숫자일 경우)
     * [EN] Target Y coordinate (if targetX is a number)
     * @param targetZ -
     * [KO] 타겟 Z 좌표 (targetX가 숫자일 경우)
     * [EN] Target Z coordinate (if targetX is a number)
     */
    lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void;
}
export default SpotLight;
