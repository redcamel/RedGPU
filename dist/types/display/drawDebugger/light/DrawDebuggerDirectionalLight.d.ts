import RedGPUContext from "../../../context/RedGPUContext";
import DirectionalLight from "../../../light/lights/DirectionalLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
declare class DrawDebuggerDirectionalLight extends ADrawDebuggerLight {
    #private;
    constructor(redGPUContext: RedGPUContext, target: DirectionalLight);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerDirectionalLight;
