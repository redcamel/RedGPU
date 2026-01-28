import RedGPUContext from "../../../../context/RedGPUContext";
import DebugRender from "../../DebugRender";
declare class ADebugStatisticsDomService {
    #private;
    dom: HTMLElement;
    constructor();
    get openYn(): boolean;
    set openYn(value: boolean);
    init(title: string, openYn?: boolean, useSmallTitle?: boolean): void;
    update(debugRender: DebugRender, redGPUContext: RedGPUContext): void;
}
export default ADebugStatisticsDomService;
