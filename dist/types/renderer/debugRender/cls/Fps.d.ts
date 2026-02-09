import RedGPUContext from "../../../context/RedGPUContext";
import DebugRender from "../DebugRender";
import ADebugItem from "./core/ADebugItem";
declare class Fps extends ADebugItem {
    #private;
    constructor(redGPUContext: RedGPUContext);
    update(debugRender: DebugRender, redGPUContext: RedGPUContext, time: number): void;
}
export default Fps;
