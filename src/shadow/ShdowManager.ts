import DirectionalShadowManager from "./DirectionalShadowManager";

class ShadowManager {
    #directionalShadowManager: DirectionalShadowManager = new DirectionalShadowManager()
    get directionalShadowManager(): DirectionalShadowManager {
        return this.#directionalShadowManager;
    }

    constructor() {}
}

Object.freeze(ShadowManager)
export default ShadowManager
