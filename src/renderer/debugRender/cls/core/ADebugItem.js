class ADebugItem {
    debugStatisticsDomService;
    constructor() {
    }
    get dom() {
        return this.debugStatisticsDomService.dom;
    }
    update(debugRender, redGPUContext, time) {
        this.debugStatisticsDomService.update(debugRender, redGPUContext);
    }
}
export default ADebugItem;
