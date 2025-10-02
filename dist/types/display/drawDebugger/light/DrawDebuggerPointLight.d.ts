import RedGPUContext from "../../../context/RedGPUContext";
import PointLight from "../../../light/lights/PointLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
declare class DrawDebuggerPointLight extends ADrawDebuggerLight {
    #private;
    constructor(redGPUContext: RedGPUContext, target: PointLight);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerPointLight;
