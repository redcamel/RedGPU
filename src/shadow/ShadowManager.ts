import RedGPUContext from "../context/RedGPUContext";
import DirectionalShadowManager from "./DirectionalShadowManager";

class ShadowManager {
	#directionalShadowManager: DirectionalShadowManager = new DirectionalShadowManager()

	constructor() {
	}

	get directionalShadowManager(): DirectionalShadowManager {
		return this.#directionalShadowManager;
	}

	update(redGPUContext: RedGPUContext) {
		this.#directionalShadowManager.update(redGPUContext)
	}
}

Object.freeze(ShadowManager)
export default ShadowManager
