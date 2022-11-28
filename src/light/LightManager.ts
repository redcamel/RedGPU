import BaseLight from "./BaseLight";
import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";
import throwError from "../util/errorFunc/throwError";
import PointLight from "./PointLight";

class LightManager {
    static #MAX_DIRECTIONAL_LIGHT_NUM: number = 3
    static get MAX_DIRECTIONAL_LIGHT_NUM(): number {
        return this.#MAX_DIRECTIONAL_LIGHT_NUM;
    }

    static #MAX_POINT_LIGHT_NUM: number = 1024
    static get MAX_POINT_LIGHT_NUM(): number {
        return this.#MAX_POINT_LIGHT_NUM;
    }

    #ambientLight: AmbientLight
    get ambientLight(): AmbientLight {
        return this.#ambientLight;
    }


    #directionalLightList: DirectionalLight[] = []
    get directionalLightList(): DirectionalLight[] {
        return this.#directionalLightList;
    }

    #pointLightList: PointLight[] = []
    get pointLightList(): PointLight[] {
        return this.#pointLightList;
    }

    constructor() {

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