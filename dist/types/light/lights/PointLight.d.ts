import DrawDebuggerPointLight from "../../display/drawDebugger/light/DrawDebuggerPointLight";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import ABaseLight from "../core/ABaseLight";
/**
 * [KO] 한 점에서 모든 방향으로 균일하게 퍼져 나가는 점광원(Point Light) 클래스입니다. 설정된 반경(`radius`) 내에서 거리에 따라 빛의 세기가 감쇠합니다.
 * [EN] Point light class that emits light uniformly in all directions from a single point. Light intensity attenuates with distance within the configured `radius`.
 *
 * ### Example
 * ```typescript
 * const pointLight = new RedGPU.Light.PointLight('#ffcc00', 1000);
 * pointLight.setPosition(0, 5, 0);
 * pointLight.radius = 15;
 * scene.lightManager.addPointLight(pointLight);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/light/pointLight/" style="width:100%; height:500px;"></iframe>
 *
 * @see [PointLight basic example](/RedGPU/examples/3d/light/pointLight/)
 * @see [PointLight performance example](/RedGPU/examples/3d/light/pointLightPerformance/)
 * @see [PointLight with GLTF example](/RedGPU/examples/3d/light/pointLightWithGltf/)
 * @category Light
 */
declare class PointLight extends ABaseLight {
    #private;
    /**
     * [KO] PointLight 인스턴스를 생성합니다.
     * [EN] Creates a PointLight instance.
     *
     * ### Example
     * ```typescript
     * const light = new RedGPU.Light.PointLight('#ffffff', 1000);
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
     * [KO] 점광원의 광속(Lumen)을 가져오거나 설정합니다.
     * [EN] Gets or sets the luminous flux (Lumen) of the point light.
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
     * [KO] 광원의 월드 위치를 설정합니다.
     * [EN] Sets the world position of the light source.
     *
     * ### Example
     * ```typescript
     * // [KO] 개별 좌표로 위치 설정
     * // [EN] Set position with individual coordinates
     * pointLight.setPosition(10, 5, -3);
     *
     * // [KO] 배열로 위치 설정
     * // [EN] Set position with an array
     * pointLight.setPosition([10, 5, -3]);
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
     * [KO] 점광원의 시각적 디버거(`DrawDebuggerPointLight`) 인스턴스를 반환합니다.
     * [EN] Returns the visual debugger (`DrawDebuggerPointLight`) instance for the point light.
     *
     * @returns
     * [KO] 디버거 인스턴스 (`DrawDebuggerPointLight`)
     * [EN] Debugger instance (`DrawDebuggerPointLight`)
     */
    get drawDebugger(): DrawDebuggerPointLight;
    /**
     * [KO] 디버거가 활성화된 경우 점광원 디버거 기즈모를 렌더링합니다.
     * [EN] Renders the point light debugger gizmo when the debugger is enabled.
     *
     * @param debugViewRenderState -
     * [KO] 현재 렌더링 뷰의 상태 데이터 (`RenderViewStateData`)
     * [EN] State data of the current render view (`RenderViewStateData`)
     */
    render(debugViewRenderState: RenderViewStateData): void;
}
export default PointLight;
