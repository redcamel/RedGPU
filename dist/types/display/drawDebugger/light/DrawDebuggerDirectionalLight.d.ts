import RedGPUContext from "../../../context/RedGPUContext";
import DirectionalLight from "../../../light/lights/DirectionalLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
/**
 * [KO] 직사광(DirectionalLight)의 방향과 위치를 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the direction and position of DirectionalLight.
 * @category Debugger
 */
declare class DrawDebuggerDirectionalLight extends ADrawDebuggerLight {
    #private;
    constructor(redGPUContext: RedGPUContext, target: DirectionalLight);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerDirectionalLight;
