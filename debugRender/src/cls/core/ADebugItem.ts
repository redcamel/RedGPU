import RedGPUContext from "../../../../src/context/RedGPUContext";
import Index from "../../index";

class ADebugItem {
    debugStatisticsDomService;

    constructor() {
    }

    get dom() {
        return this.debugStatisticsDomService.dom;
    }

    update(debugRender: Index, redGPUContext: RedGPUContext, time: number) {
        this.debugStatisticsDomService.update(debugRender, redGPUContext);
    }
}

export default ADebugItem
