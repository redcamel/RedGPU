import DirectionalShadowManager from "./DirectionalShadowManager";

class ShadowManager {
	#directionalShadowManager: DirectionalShadowManager = new DirectionalShadowManager()

	constructor() {}

	get directionalShadowManager(): DirectionalShadowManager {
		return this.#directionalShadowManager;
	}
}

Object.freeze(ShadowManager)
export default ShadowManager
