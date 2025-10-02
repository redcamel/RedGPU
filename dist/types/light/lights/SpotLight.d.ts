import ABaseLight from "../core/ABaseLight";
/**
 * 스포트라이트(SpotLight)를 정의하는 클래스입니다.
 *
 * 이 광원은 특정 위치에서 지정된 방향으로 빛을 방사하며,
 * 내부/외부 컷오프 각도를 통해 빛의 퍼짐 범위를 제어할 수 있습니다.
 *
 * @example
 * ```javascript
 * const light = new RedGPU.Light.SpotLight('#ffffff', 2.0);
 * light.setPosition(0, 5, 10);
 * light.lookAt(0, 0, 0);
 * scene.lightManager.addSpotLight(light);
 * ```
 * <iframe src="/RedGPU/examples/3d/light/spotLight/" ></iframe>
 *
 * 아래는 SpotLight 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [SpotLight Cluster Performance example](/RedGPU/examples/3d/light/spotLightPerformance/)
 * @category Light
 */
declare class SpotLight extends ABaseLight {
    #private;
    /**
     * 새로운 SpotLight 인스턴스를 생성합니다.
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
    /** 광원의 반경을 반환합니다. */
    get radius(): number;
    /** 광원의 반경을 설정합니다. */
    set radius(value: number);
    /** 방향 벡터의 X 성분을 반환합니다. */
    get directionX(): number;
    /** 방향 벡터의 X 성분을 설정합니다. */
    set directionX(value: number);
    /** 방향 벡터의 Y 성분을 반환합니다. */
    get directionY(): number;
    /** 방향 벡터의 Y 성분을 설정합니다. */
    set directionY(value: number);
    /** 방향 벡터의 Z 성분을 반환합니다. */
    get directionZ(): number;
    /** 방향 벡터의 Z 성분을 설정합니다. */
    set directionZ(value: number);
    /**
     * 광원의 방향 벡터를 [x, y, z] 형태로 반환합니다.
     */
    get direction(): [number, number, number];
    /**
     * 광원의 방향 벡터를 설정합니다.
     *
     * @param value - [x, y, z] 형태의 방향 벡터
     */
    set direction(value: [number, number, number]);
    /** 내부 컷오프 각도를 반환합니다. */
    get innerCutoff(): number;
    /** 내부 컷오프 각도를 설정합니다. */
    set innerCutoff(degrees: number);
    /** 외부 컷오프 각도를 반환합니다. */
    get outerCutoff(): number;
    /** 외부 컷오프 각도를 설정합니다. */
    set outerCutoff(degrees: number);
    /**
     * 내부 컷오프 각도의 코사인 값을 반환합니다.
     * 셰이더 계산 등에 사용됩니다.
     */
    get innerCutoffCos(): number;
    /**
     * 외부 컷오프 각도의 코사인 값을 반환합니다.
     * 셰이더 계산 등에 사용됩니다.
     */
    get outerCutoffCos(): number;
    /**
     * 광원의 위치를 설정합니다.
     *
     * @param x - X 좌표 또는 [x, y, z] 배열
     * @param y - Y 좌표 (x가 숫자일 경우)
     * @param z - Z 좌표 (x가 숫자일 경우)
     */
    setPosition(x: number | [number, number, number], y?: number, z?: number): void;
    /**
     * 특정 타겟 위치를 바라보도록 방향 벡터를 설정합니다.
     *
     * @param targetX - 타겟 X 좌표 또는 [x, y, z] 배열
     * @param targetY - 타겟 Y 좌표 (targetX가 숫자일 경우)
     * @param targetZ - 타겟 Z 좌표 (targetX가 숫자일 경우)
     */
    lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void;
}
export default SpotLight;
