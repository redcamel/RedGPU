import throwError from "../util/errorFunc/throwError";
import AmbientLight from "./AmbientLight";
import BaseLight from "./BaseLight";
import DirectionalLight from "./DirectionalLight";
import PointLight from "./PointLight";

class LightManager {
	static #MAX_DIRECTIONAL_LIGHT_NUM: number = 3
	static #MAX_POINT_LIGHT_NUM: number = 512
	#ambientLight: AmbientLight
	#directionalLightList: DirectionalLight[] = []
	#pointLightList: PointLight[] = []

	constructor() {
	}

	static get MAX_DIRECTIONAL_LIGHT_NUM(): number {
		return this.#MAX_DIRECTIONAL_LIGHT_NUM;
	}

	static get MAX_POINT_LIGHT_NUM(): number {
		return this.#MAX_POINT_LIGHT_NUM;
	}

	get ambientLight(): AmbientLight {
		return this.#ambientLight;
	}

	get directionalLightList(): DirectionalLight[] {
		return this.#directionalLightList;
	}

	get pointLightList(): PointLight[] {
		return this.#pointLightList;
	}

	addLight(light: BaseLight) {
		if (light instanceof AmbientLight) this.#ambientLight = light
		else if (light instanceof DirectionalLight) {
			if (this.#directionalLightList.length === LightManager.MAX_DIRECTIONAL_LIGHT_NUM) {
				throwError('MAX_DIRECTIONAL_LIGHT_NUM :', LightManager.MAX_DIRECTIONAL_LIGHT_NUM)
			}
			this.#directionalLightList.push(light)
		} else if (light instanceof PointLight) {
			if (this.#pointLightList.length === LightManager.MAX_POINT_LIGHT_NUM) {
				throwError('MAX_POINT_LIGHT_NUM :', LightManager.MAX_POINT_LIGHT_NUM)
			}
			this.#pointLightList.push(light)
		}
	}
}

export default LightManager
