import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import RenderViewStateData from "../../view/core/RenderViewStateData";
declare class DrawDebuggerGrid {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get name(): string;
    set name(value: string);
    get size(): number;
    set size(value: number);
    get lineColor(): ColorRGBA;
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerGrid;
