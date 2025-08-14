import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class SSR extends ASinglePassPostEffect {
	#maxSteps: number = 128;
	#maxDistance: number = 20.0;
	#stepSize: number = 0.08;
	#reflectionIntensity: number = 1;
	#fadeDistance: number = 8.0;
	#edgeFade: number = 0.1;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);

		// SSR에 최적화된 워크그룹 크기 설정
		this.WORK_SIZE_X = 8;  // 8x8 = 64 threads per workgroup
		this.WORK_SIZE_Y = 8;  // GPU 웨이브프론트 크기에 최적화
		this.WORK_SIZE_Z = 1;  // 2D 텍스처이므로 1

		this.useDepthTexture = true;
		this.useNormalRougnessTexture = true;
		this.init(
			redGPUContext,
			'POST_EFFECT_SSR',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		);
		this.maxSteps = this.#maxSteps;
		this.maxDistance = this.#maxDistance;
		this.stepSize = this.#stepSize;
		this.reflectionIntensity = this.#reflectionIntensity;
		this.fadeDistance = this.#fadeDistance;
		this.edgeFade = this.#edgeFade;
	}

	get maxSteps(): number {
		return this.#maxSteps;
	}

	set maxSteps(value: number) {
		validateNumberRange(value, 1, 256);
		this.#maxSteps = value;
		this.updateUniform('maxSteps', value);
	}

	get maxDistance(): number {
		return this.#maxDistance;
	}

	set maxDistance(value: number) {
		validateNumberRange(value, 1.0, 200.0);
		this.#maxDistance = value;
		this.updateUniform('maxDistance', value);
	}

	get stepSize(): number {
		return this.#stepSize;
	}

	set stepSize(value: number) {
		validateNumberRange(value, 0.001, 5.0);
		this.#stepSize = value;
		this.updateUniform('stepSize', value);
	}

	get reflectionIntensity(): number {
		return this.#reflectionIntensity;
	}

	set reflectionIntensity(value: number) {
		validateNumberRange(value, 0.0, 5.0);
		this.#reflectionIntensity = value;
		this.updateUniform('reflectionIntensity', value);
	}

	get fadeDistance(): number {
		return this.#fadeDistance;
	}

	set fadeDistance(value: number) {
		validateNumberRange(value, 1.0, 100.0);
		this.#fadeDistance = value;
		this.updateUniform('fadeDistance', value);
	}

	get edgeFade(): number {
		return this.#edgeFade;
	}

	set edgeFade(value: number) {
		validateNumberRange(value, 0.0, 0.5);
		this.#edgeFade = value;
		this.updateUniform('edgeFade', value);
	}
}

Object.freeze(SSR);
export default SSR;
