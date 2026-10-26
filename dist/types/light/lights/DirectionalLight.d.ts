import DrawDebuggerDirectionalLight from "../../display/drawDebugger/light/DrawDebuggerDirectionalLight";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import ABaseLight from "../core/ABaseLight";
/**
 * [KO] 무한히 먼 거리에서 일정한 방향으로 평행하게 입사하는 직사광(Directional Light) 클래스입니다. 거리 감쇠가 없으며 직교 방향 벡터(`direction`) 또는 구면 좌표(`elevation`, `azimuth`)로 입사 방향을 제어합니다.
 * [EN] Directional light class emitting parallel rays in a constant direction without distance attenuation, controlled via a direction vector (`direction`) or spherical coordinates (`elevation`, `azimuth`).
 *
 * ### Example
 * ```typescript
 * const directionalLight = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff', 100000);
 * scene.lightManager.addDirectionalLight(directionalLight);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/light/directionalLight/" style="width:100%; height:500px;"></iframe>
 *
 * @see [DirectionalLight example](/RedGPU/examples/3d/light/directionalLight/)
 * @category Light
 */
declare class DirectionalLight extends ABaseLight {
    #private;
    /**
     * [KO] 새로운 DirectionalLight 인스턴스를 생성합니다.
     * [EN] Creates a new DirectionalLight instance.
     *
     * ### Example
     * ```typescript
     * const light = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#fff', 100000);
     * ```
     *
     * @param direction -
     * [KO] 빛의 진행 방향 벡터 (`[x, y, z]`, 기본값: `[-1, -1, -1]`)
     * [EN] Light direction vector (`[x, y, z]`, default: `[-1, -1, -1]`)
     * @param color -
     * [KO] 조명의 색상 (HEX 문자열, 기본값: `'#fff'`)
     * [EN] Light color (HEX string, default: `'#fff'`)
     * @param lux -
     * [KO] 조명의 조도 (Lux 단위, 기본값: `100000`)
     * [EN] Illuminance of the light (in Lux, default: `100000`)
     */
    constructor(direction?: [number, number, number], color?: string, lux?: number);
    /**
     * [KO] 직사광의 조도(Lux)를 반환하거나 설정합니다.
     * [EN] Gets or sets the illuminance (Lux) of the directional light.
     *
     * @returns
     * [KO] 조도 값 (Lux)
     * [EN] Illuminance value (Lux)
     */
    get lux(): number;
    set lux(value: number);
    /**
     * [KO] 광원의 고도각(Elevation, 도 단위)을 반환하거나 설정합니다. 값을 변경하면 `direction` 벡터가 자동으로 갱신됩니다.
     * [EN] Gets or sets the elevation angle (in degrees) of the light source. Changing this value automatically updates the `direction` vector.
     *
     * @returns
     * [KO] 고도각 (도 단위, `degree`)
     * [EN] Elevation angle (in degrees)
     */
    get elevation(): number;
    set elevation(value: number);
    /**
     * [KO] 광원의 방위각(Azimuth, 도 단위)을 반환하거나 설정합니다. 값을 변경하면 `direction` 벡터가 자동으로 갱신됩니다.
     * [EN] Gets or sets the azimuth angle (in degrees) of the light source. Changing this value automatically updates the `direction` vector.
     *
     * @returns
     * [KO] 방위각 (도 단위, `degree`)
     * [EN] Azimuth angle (in degrees)
     */
    get azimuth(): number;
    set azimuth(value: number);
    /**
     * [KO] 빛의 진행 방향 X 성분을 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.
     * [EN] Gets or sets the X component of the light direction. Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).
     *
     * @returns
     * [KO] 방향 벡터의 X 성분
     * [EN] X component of the direction vector
     */
    get directionX(): number;
    set directionX(value: number);
    /**
     * [KO] 빛의 진행 방향 Y 성분을 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.
     * [EN] Gets or sets the Y component of the light direction. Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).
     *
     * @returns
     * [KO] 방향 벡터의 Y 성분
     * [EN] Y component of the direction vector
     */
    get directionY(): number;
    set directionY(value: number);
    /**
     * [KO] 빛의 진행 방향 Z 성분을 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.
     * [EN] Gets or sets the Z component of the light direction. Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).
     *
     * @returns
     * [KO] 방향 벡터의 Z 성분
     * [EN] Z component of the direction vector
     */
    get directionZ(): number;
    set directionZ(value: number);
    /**
     * [KO] 빛의 진행 방향 벡터(`[x, y, z]`)를 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.
     * [EN] Gets or sets the light direction vector (`[x, y, z]`). Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).
     *
     * @returns
     * [KO] 방향 벡터 튜플 (`[number, number, number]`)
     * [EN] Direction vector tuple (`[number, number, number]`)
     */
    get direction(): [number, number, number];
    set direction(value: [number, number, number]);
    /**
     * [KO] 직사광의 시각적 디버거(`DrawDebuggerDirectionalLight`) 인스턴스를 반환합니다.
     * [EN] Returns the visual debugger (`DrawDebuggerDirectionalLight`) instance for the directional light.
     *
     * @returns
     * [KO] 디버거 인스턴스 (`DrawDebuggerDirectionalLight`)
     * [EN] Debugger instance (`DrawDebuggerDirectionalLight`)
     */
    get drawDebugger(): DrawDebuggerDirectionalLight;
    /**
     * [KO] 디버거가 활성화된 경우 직사광 디버거 기즈모를 렌더링합니다.
     * [EN] Renders the directional light debugger gizmo when the debugger is enabled.
     *
     * @param debugViewRenderState -
     * [KO] 현재 렌더링 뷰의 상태 데이터 (`RenderViewStateData`)
     * [EN] State data of the current render view (`RenderViewStateData`)
     */
    render(debugViewRenderState: RenderViewStateData): void;
}
export default DirectionalLight;
