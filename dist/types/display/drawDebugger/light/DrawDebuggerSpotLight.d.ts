import RedGPUContext from "../../../context/RedGPUContext";
import SpotLight from "../../../light/lights/SpotLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
declare class DrawDebuggerSpotLight extends ADrawDebuggerLight {
    #private;
    constructor(redGPUContext: RedGPUContext, target: SpotLight);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerSpotLight;
