import RedGPUContext from "../../../../context/RedGPUContext";
import DebugRender from "../../DebugRender";
declare class ADebugItem {
    debugStatisticsDomService: any;
    constructor();
    get dom(): any;
    update(debugRender: DebugRender, redGPUContext: RedGPUContext, time: number): void;
}
export default ADebugItem;
