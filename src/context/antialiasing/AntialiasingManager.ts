import RedGPUContext from "../RedGPUContext";

class AntialiasingManager {
	#redGPUContext: RedGPUContext;
	#useMSAA: boolean = true
	#useFXAA: boolean = false
	#changedMSAA: boolean = true

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

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
	}
}

Object.freeze(AntialiasingManager)
export default AntialiasingManager
