import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import RedGPUContext from "../RedGPUContext";

class AntialiasingManager {
	#redGPUContext: RedGPUContext;
	#useMSAA: boolean = false
	#useFXAA: boolean = false
	#fxaa_subpix: number = 0.75
	#fxaa_edgeThreshold: number = 0.166
	#fxaa_edgeThresholdMin: number = 0.0833
	#changedMSAA: boolean = true

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
	}

	get fxaa_subpix(): number {
		return this.#fxaa_subpix;
	}

	set fxaa_subpix(value: number) {
		validateNumberRange(value, 0, 1);
		this.#fxaa_subpix = value;
	}

	get fxaa_edgeThreshold(): number {
		return this.#fxaa_edgeThreshold;
	}

	set fxaa_edgeThreshold(value: number) {
		validateNumberRange(value, 0.0001, 0.25)
		this.#fxaa_edgeThreshold = value;
	}

	get fxaa_edgeThresholdMin(): number {
		return this.#fxaa_edgeThresholdMin;
	}

	set fxaa_edgeThresholdMin(value: number) {
		validateNumberRange(value, 0.00001, 0.1)
		this.#fxaa_edgeThresholdMin = value;
	}

	get useMSAA(): boolean {
		return this.#useMSAA;
	}

	set useMSAA(value: boolean) {
		this.#useMSAA = value;
		this.#changedMSAA = true;
	}

	get useFXAA(): boolean {
		return this.#useFXAA;
	}

	set useFXAA(value: boolean) {
		this.#useFXAA = value;
	}

	get changedMSAA(): boolean {
		return this.#changedMSAA;
	}

	set changedMSAA(value) {
		this.#changedMSAA = value;
	}
}

Object.freeze(AntialiasingManager)
export default AntialiasingManager
