import DirectionalShadowManager from "./DirectionalShadowManager";
class ShadowManager {
    #directionalShadowManager = new DirectionalShadowManager();
    constructor() { }
    get directionalShadowManager() {
        return this.#directionalShadowManager;
    }
    update(redGPUContext) {
        this.#directionalShadowManager.update(redGPUContext);
    }
}
Object.freeze(ShadowManager);
export default ShadowManager;
