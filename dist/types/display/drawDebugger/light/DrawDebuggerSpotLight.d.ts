import RedGPUContext from "../../../context/RedGPUContext";
import SpotLight from "../../../light/lights/SpotLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
/**
 * [KO] 스포트라이트(SpotLight)의 위치, 방향, 원뿔 범위를 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the position, direction, and cone range of SpotLight.
 * @category Debugger
 */
declare class DrawDebuggerSpotLight extends ADrawDebuggerLight {
    #private;
    constructor(redGPUContext: RedGPUContext, target: SpotLight);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerSpotLight;
