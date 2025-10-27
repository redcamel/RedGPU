import RedGPUContext from "../../../../context/RedGPUContext";
import DebugRender from "../../DebugRender";

class ADebugItem {
    debugStatisticsDomService;

    constructor() {
    }

    get dom() {
        return this.debugStatisticsDomService.dom;
    }

    update(debugRender: DebugRender, redGPUContext: RedGPUContext, time: number) {
        this.debugStatisticsDomService.update(debugRender, redGPUContext);
    }
}

export default ADebugItem
