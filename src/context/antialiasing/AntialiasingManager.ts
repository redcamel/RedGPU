import FXAA from "../../postEffect/FXAA";
import TAA from "../../postEffect/TAA/TAA";
import RedGPUContext from "../RedGPUContext";

class AntialiasingManager {
	#redGPUContext: RedGPUContext;
	#useMSAA: boolean = false
	#useFXAA: boolean = false
	#useTAA: boolean = true
	#fxaa:FXAA
	#taa:TAA
	#fxaa_subpix: number = 0.75
	#fxaa_edgeThreshold: number = 0.166
	#fxaa_edgeThresholdMin: number = 0.0833
	#changedMSAA: boolean = true

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#taa = new TAA(redGPUContext)
		this.#fxaa = new FXAA(redGPUContext)
	}

	get fxaa(): FXAA {
		return this.#fxaa;
	}

	get taa(): TAA {
		return this.#taa;
	}

	get useTAA(): boolean {
		return this.#useTAA;
	}

	set useTAA(value: boolean) {
		this.#useTAA = value;
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
