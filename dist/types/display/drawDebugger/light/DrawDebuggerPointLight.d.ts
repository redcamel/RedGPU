import RedGPUContext from "../../../context/RedGPUContext";
import PointLight from "../../../light/lights/PointLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
/**
 * [KO] 점광원(PointLight)의 위치와 영향을 미치는 반경을 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the position and influence radius of PointLight.
 * @category Debugger
 */
declare class DrawDebuggerPointLight extends ADrawDebuggerLight {
    #private;
    constructor(redGPUContext: RedGPUContext, target: PointLight);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerPointLight;
