import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import RenderViewStateData from "../../view/core/RenderViewStateData";
/**
 * [KO] 3D 공간의 바닥면을 시각화하는 디버깅용 그리드 클래스입니다.
 * [EN] Debugging grid class that visualizes the floor plane in 3D space.
 * @category Debugger
 */
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
