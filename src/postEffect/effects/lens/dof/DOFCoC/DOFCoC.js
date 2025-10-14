import validateNumberRange from "../../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
class DOFCoC extends ASinglePassPostEffect {
    #focusDistance = 15.0;
    #aperture = 1.4;
    #maxCoC = 32.0;
    #nearPlane = 0.1;
    #farPlane = 1000.0;
    constructor(redGPUContext) {
        super(redGPUContext);
        this.useDepthTexture = true;
        this.init(redGPUContext, 'POST_EFFECT_DOF_COC', createBasicPostEffectCode(this, computeCode, uniformStructCode));
        this.focusDistance = this.#focusDistance;
        this.aperture = this.#aperture;
        this.maxCoC = this.#maxCoC;
        this.nearPlane = this.#nearPlane;
        this.farPlane = this.#farPlane;
    }
    get focusDistance() {
        return this.#focusDistance;
    }
    set focusDistance(value) {
        validateNumberRange(value);
        this.#focusDistance = value;
        this.updateUniform('focusDistance', value);
    }
    get aperture() {
        return this.#aperture;
    }
    set aperture(value) {
        validateNumberRange(value);
        this.#aperture = value;
        this.updateUniform('aperture', value);
    }
    get maxCoC() {
        return this.#maxCoC;
    }
    set maxCoC(value) {
        validateNumberRange(value);
        this.#maxCoC = value;
        this.updateUniform('maxCoC', value);
    }
    get nearPlane() {
        return this.#nearPlane;
    }
    set nearPlane(value) {
        validateNumberRange(value);
        this.#nearPlane = value;
        this.updateUniform('nearPlane', value);
    }
    get farPlane() {
        return this.#farPlane;
    }
    set farPlane(value) {
        validateNumberRange(value);
        this.#farPlane = value;
        this.updateUniform('farPlane', value);
    }
}
Object.freeze(DOFCoC);
export default DOFCoC;
