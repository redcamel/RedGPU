import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../color/convertHexToRgb";
import DrawDebuggerPointLight from "../../display/drawDebugger/light/DrawDebuggerPointLight";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import ABaseLight from "../core/ABaseLight";

/**
 * [KO] 3차원 공간의 한 점에서 모든 방향으로 균일하게 퍼져 나가는 점광원(Point Light) 클래스입니다.
 * [EN] Point light class that emits light uniformly in all directions from a single point in 3D space.
 *
 * [KO] 광원으로부터의 거리가 멀어질수록 빛의 세기가 감쇠하며, 설정된 반경(`radius`) 내에서만 조명 연산에 영향을 미칩니다.
 * [EN] Light intensity attenuates as the distance from the source increases, affecting lighting calculations only within the configured `radius`.
 *
 * ### Example
 * ```typescript
 * const pointLight = new RedGPU.Light.PointLight('#ffcc00', 1000);
 * pointLight.setPosition(0, 5, 0);
 * pointLight.radius = 15;
 * scene.lightManager.addPointLight(pointLight);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/light/pointLight/" ></iframe>
 *
 * @see [PointLight basic example](/RedGPU/examples/3d/light/pointLight/)
 * @see [PointLight performance example](/RedGPU/examples/3d/light/pointLightPerformance/)
 * @see [PointLight with GLTF example](/RedGPU/examples/3d/light/pointLightWithGltf/)
 * @category Light
 */
class PointLight extends ABaseLight {
    #radius: number = 10;
    #x: number = 0;
    #y: number = 0;
    #z: number = 0;
    #lumen: number;
    #drawDebugger: DrawDebuggerPointLight = null;

    /**
     * [KO] 새로운 PointLight 인스턴스를 생성합니다.
     * [EN] Creates a new PointLight instance.
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
    constructor(color: string = '#fff', lumen: number = 1000) {
        super(new ColorRGB(...convertHexToRgb(color, true)));
        this.#lumen = lumen;
    }

    /**
     * [KO] 점광원의 광속(Lumen)을 반환하거나 설정합니다.
     * [EN] Gets or sets the luminous flux (Lumen) of the point light.
     *
     * @returns
     * [KO] 광속 값 (Lumen)
     * [EN] Luminous flux value (Lumen)
     */
    get lumen(): number {
        return this.#lumen;
    }

    set lumen(value: number) {
        this.#lumen = value;
    }

    /**
     * [KO] 광원의 월드 X 좌표를 반환하거나 설정합니다.
     * [EN] Gets or sets the world X coordinate of the light source.
     *
     * @returns
     * [KO] X축 좌표
     * [EN] X-axis coordinate
     */
    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = value;
    }

    /**
     * [KO] 광원의 월드 Y 좌표를 반환하거나 설정합니다.
     * [EN] Gets or sets the world Y coordinate of the light source.
     *
     * @returns
     * [KO] Y축 좌표
     * [EN] Y-axis coordinate
     */
    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = value;
    }

    /**
     * [KO] 광원의 월드 Z 좌표를 반환하거나 설정합니다.
     * [EN] Gets or sets the world Z coordinate of the light source.
     *
     * @returns
     * [KO] Z축 좌표
     * [EN] Z-axis coordinate
     */
    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = value;
    }

    /**
     * [KO] 광원의 월드 위치 좌표(`[x, y, z]`)를 반환합니다.
     * [EN] Returns the world position coordinates (`[x, y, z]`) of the light source.
     *
     * @returns
     * [KO] 위치 좌표 튜플 (`[number, number, number]`)
     * [EN] Position coordinate tuple (`[number, number, number]`)
     */
    get position(): [number, number, number] {
        return [this.#x, this.#y, this.#z];
    }

    /**
     * [KO] 빛이 도달하는 최대 감쇠 반경(`radius`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum attenuation radius (`radius`) of the light.
     *
     * @returns
     * [KO] 광원 반경
     * [EN] Light radius
     */
    get radius(): number {
        return this.#radius;
    }

    set radius(value: number) {
        this.#radius = value;
    }

    /**
     * [KO] 광원의 월드 위치를 설정합니다. 개별 좌표(`x, y, z`) 또는 3요소 배열(`[x, y, z]`)을 전달할 수 있습니다.
     * [EN] Sets the world position of the light source. Accepts individual coordinates (`x, y, z`) or a 3-element array (`[x, y, z]`).
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
    setPosition(x: number | [number, number, number], y?: number, z?: number) {
        if (Array.isArray(x)) {
            [this.#x, this.#y, this.#z] = x;
        } else {
            this.#x = x;
            this.#y = y;
            this.#z = z;
        }
    }

    /**
     * [KO] 점광원의 시각적 디버거(`DrawDebuggerPointLight`) 인스턴스를 반환합니다.
     * [EN] Returns the visual debugger (`DrawDebuggerPointLight`) instance for the point light.
     *
     * @returns
     * [KO] 디버거 인스턴스 (`DrawDebuggerPointLight`)
     * [EN] Debugger instance (`DrawDebuggerPointLight`)
     */
    get drawDebugger(): DrawDebuggerPointLight {
        return this.#drawDebugger;
    }

    /**
     * [KO] 디버거가 활성화된 경우 점광원 디버거 기즈모를 렌더링합니다.
     * [EN] Renders the point light debugger gizmo when the debugger is enabled.
     *
     * @param debugViewRenderState -
     * [KO] 현재 렌더링 뷰의 상태 데이터 (`RenderViewStateData`)
     * [EN] State data of the current render view (`RenderViewStateData`)
     */
    render(debugViewRenderState: RenderViewStateData) {
        if (this.enableDebugger) {
            if (!this.#drawDebugger) this.#drawDebugger = new DrawDebuggerPointLight(debugViewRenderState.view.redGPUContext, this);
            this.#drawDebugger.render(debugViewRenderState);
        }
    }
}

Object.freeze(PointLight);
export default PointLight;