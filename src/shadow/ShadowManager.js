import DirectionalShadowManager from "./DirectionalShadowManager";
class ShadowManager {
    #directionalShadowManager = new DirectionalShadowManager();
    constructor() { }
    get directionalShadowManager() {
        return this.#directionalShadowManager;
    }
}
Object.freeze(ShadowManager);
export default ShadowManager;
