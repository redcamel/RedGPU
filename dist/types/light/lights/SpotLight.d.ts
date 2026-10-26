import DrawDebuggerSpotLight from "../../display/drawDebugger/light/DrawDebuggerSpotLight";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import ABaseLight from "../core/ABaseLight";
/**
 * [KO] 한 점에서 특정 방향으로 원뿔(Cone) 형태의 빛을 방출하는 스포트라이트(Spot Light) 클래스입니다. 반경(`radius`) 거리 감쇠와 내·외부 컷오프 각도(`innerCutoff`, `outerCutoff`) 기반 가장자리 감쇠를 지원합니다.
 * [EN] Spot light class that emits a cone-shaped beam of light in a specific direction from a single point. Supports distance attenuation based on `radius` and smooth edge falloff between `innerCutoff` and `outerCutoff` angles.
 *
 * ### Example
 * ```typescript
 * const spotLight = new RedGPU.Light.SpotLight('#ffffff', 1000);
 * spotLight.setPosition(0, 5, 5);
 * spotLight.lookAt(0, 0, 0);
 * spotLight.innerCutoff = 15;
 * spotLight.outerCutoff = 30;
 * scene.lightManager.addSpotLight(spotLight);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/light/spotLight/" style="width:100%; height:500px;"></iframe>
 *
 * @see [SpotLight basic example](/RedGPU/examples/3d/light/spotLight/)
 * @see [SpotLight performance example](/RedGPU/examples/3d/light/spotLightPerformance/)
 * @see [SpotLight with GLTF example](/RedGPU/examples/3d/light/spotLightWithGltf/)
 * @category Light
 */
declare class SpotLight extends ABaseLight {
    #private;
    /**
     * [KO] SpotLight 인스턴스를 생성합니다.
     * [EN] Creates a SpotLight instance.
     *
     * ### Example
     * ```typescript
     * const light = new RedGPU.Light.SpotLight('#ffffff', 1000);
     * ```
     *
     * @param color -
     * [KO] 조명의 색상 (HEX 문자열, 기본값: `'#fff'`)
     * [EN] Light color (HEX string, default: `'#fff'`)
     * @param lumen -
     * [KO] 조명의 광속 (Lumen 단위, 기본값: `1000`)
     * [EN] Luminous flux of the light (in Lumens, default: `1000`)
     */
    constructor(color?: string, lumen?: number);
    /**
     * [KO] 스포트라이트의 광속(Lumen)을 가져오거나 설정합니다.
     * [EN] Gets or sets the luminous flux (Lumen) of the spot light.
     *
     * @returns
     * [KO] 광속 값 (Lumen)
     * [EN] Luminous flux value (Lumen)
     */
    get lumen(): number;
    set lumen(value: number);
    /**
     * [KO] 광원의 월드 X 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the world X coordinate of the light source.
     *
     * @returns
     * [KO] X축 좌표
     * [EN] X-axis coordinate
     */
    get x(): number;
    set x(value: number);
    /**
     * [KO] 광원의 월드 Y 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the world Y coordinate of the light source.
     *
     * @returns
     * [KO] Y축 좌표
     * [EN] Y-axis coordinate
     */
    get y(): number;
    set y(value: number);
    /**
     * [KO] 광원의 월드 Z 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the world Z coordinate of the light source.
     *
     * @returns
     * [KO] Z축 좌표
     * [EN] Z-axis coordinate
     */
    get z(): number;
    set z(value: number);
    /**
     * [KO] 광원의 월드 위치 좌표(`[x, y, z]`)를 반환합니다.
     * [EN] Returns the world position coordinates (`[x, y, z]`) of the light source.
     *
     * @returns
     * [KO] 위치 좌표 튜플 (`[number, number, number]`)
     * [EN] Position coordinate tuple (`[number, number, number]`)
     */
    get position(): [number, number, number];
    /**
     * [KO] 빛이 도달하는 최대 감쇠 반경(`radius`)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum attenuation radius (`radius`) of the light.
     *
     * @returns
     * [KO] 광원 반경
     * [EN] Light radius
     */
    get radius(): number;
    set radius(value: number);
    /**
     * [KO] 빛의 진행 방향 X 성분을 가져오거나 설정합니다.
     * [EN] Gets or sets the X component of the light direction.
     *
     * @returns
     * [KO] 방향 벡터의 X 성분
     * [EN] X component of the direction vector
     */
    get directionX(): number;
    set directionX(value: number);
    /**
     * [KO] 빛의 진행 방향 Y 성분을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y component of the light direction.
     *
     * @returns
     * [KO] 방향 벡터의 Y 성분
     * [EN] Y component of the direction vector
     */
    get directionY(): number;
    set directionY(value: number);
    /**
     * [KO] 빛의 진행 방향 Z 성분을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z component of the light direction.
     *
     * @returns
     * [KO] 방향 벡터의 Z 성분
     * [EN] Z component of the direction vector
     */
    get directionZ(): number;
    set directionZ(value: number);
    /**
     * [KO] 빛의 진행 방향 벡터(`[x, y, z]`)를 가져오거나 설정합니다.
     * [EN] Gets or sets the light direction vector (`[x, y, z]`).
     *
     * @returns
     * [KO] 방향 벡터 튜플 (`[number, number, number]`)
     * [EN] Direction vector tuple (`[number, number, number]`)
     */
    get direction(): [number, number, number];
    set direction(value: [number, number, number]);
    /**
     * [KO] 빛의 세기가 최대로 유지되는 내부 원뿔 각도(도 단위, `degree`)를 가져오거나 설정합니다.
     * [EN] Gets or sets the inner cone cutoff angle (in degrees) within which light intensity remains at maximum.
     *
     * @returns
     * [KO] 내부 컷오프 각도 (도 단위, `degree`)
     * [EN] Inner cutoff angle (in degrees)
     */
    get innerCutoff(): number;
    set innerCutoff(degrees: number);
    /**
     * [KO] 빛이 완전히 소멸하는 외부 원뿔 각도(도 단위, `degree`)를 가져오거나 설정합니다.
     * [EN] Gets or sets the outer cone cutoff angle (in degrees) beyond which light completely falls off.
     *
     * @returns
     * [KO] 외부 컷오프 각도 (도 단위, `degree`)
     * [EN] Outer cutoff angle (in degrees)
     */
    get outerCutoff(): number;
    set outerCutoff(degrees: number);
    /**
     * [KO] 광원의 월드 위치를 설정합니다.
     * [EN] Sets the world position of the light source.
     *
     * ### Example
     * ```typescript
     * // [KO] 개별 좌표로 위치 설정
     * // [EN] Set position with individual coordinates
     * spotLight.setPosition(0, 5, 5);
     *
     * // [KO] 배열로 위치 설정
     * // [EN] Set position with an array
     * spotLight.setPosition([0, 5, 5]);
     * ```
     *
     * @param x -
     * [KO] X축 좌표 또는 `[x, y, z]` 좌표 배열
     * [EN] X-axis coordinate or `[x, y, z]` coordinate array
     * @param y -
     * [KO] Y축 좌표 (`x`가 숫자인 경우)
     * [EN] Y-axis coordinate (when `x` is a number)
     * @param z -
     * [KO] Z축 좌표 (`x`가 숫자인 경우)
     * [EN] Z-axis coordinate (when `x` is a number)
     */
    setPosition(x: number | [number, number, number], y?: number, z?: number): void;
    /**
     * [KO] 광원이 지정된 목표 지점을 바라보도록 방향 벡터(`direction`)를 갱신합니다.
     * [EN] Updates the direction vector (`direction`) so that the light points toward the specified target position.
     *
     * ### Example
     * ```typescript
     * // [KO] 원점을 바라보도록 방향 설정
     * // [EN] Point the light toward the origin
     * spotLight.lookAt(0, 0, 0);
     * ```
     *
     * @param targetX -
     * [KO] 목표 지점의 X 좌표 또는 `[x, y, z]` 좌표 배열
     * [EN] Target X coordinate or `[x, y, z]` coordinate array
     * @param targetY -
     * [KO] 목표 지점의 Y 좌표 (`targetX`가 숫자인 경우)
     * [EN] Target Y coordinate (when `targetX` is a number)
     * @param targetZ -
     * [KO] 목표 지점의 Z 좌표 (`targetX`가 숫자인 경우)
     * [EN] Target Z coordinate (when `targetX` is a number)
     */
    lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void;
    /**
     * [KO] 스포트라이트의 시각적 디버거(`DrawDebuggerSpotLight`) 인스턴스를 반환합니다.
     * [EN] Returns the visual debugger (`DrawDebuggerSpotLight`) instance for the spot light.
     *
     * @returns
     * [KO] 디버거 인스턴스 (`DrawDebuggerSpotLight`)
     * [EN] Debugger instance (`DrawDebuggerSpotLight`)
     */
    get drawDebugger(): DrawDebuggerSpotLight;
    /**
     * [KO] 디버거가 활성화된 경우 스포트라이트 디버거 기즈모를 렌더링합니다.
     * [EN] Renders the spot light debugger gizmo when the debugger is enabled.
     *
     * @param debugViewRenderState -
     * [KO] 현재 렌더링 뷰의 상태 데이터 (`RenderViewStateData`)
     * [EN] State data of the current render view (`RenderViewStateData`)
     */
    render(debugViewRenderState: RenderViewStateData): void;
}
export default SpotLight;
