import FXAA from "../../postEffect/FXAA";
import TAA from "../../postEffect/TAA/TAA";
import RedGPUContext from "../RedGPUContext";

class AntialiasingManager {
	#redGPUContext: RedGPUContext;
	#useMSAA: boolean = false
	#useFXAA: boolean = false
	#useTAA: boolean = true

	#changedMSAA: boolean = true

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
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
