import RedGPUContext from "../RedGPUContext";

class AntialiasingManager {
	#redGPUContext: RedGPUContext;
	#useMSAA: boolean = true
	#useFXAA: boolean = false
	#changedMSAA: boolean = true
	#changedFXAA: boolean = true
	#changedAntialiasing: boolean = true

	get useMSAA(): boolean {
		return this.#useMSAA;
	}

	set useMSAA(value: boolean) {
		this.#useMSAA = value;
		this.#changedMSAA = true;
		this.#changedAntialiasing = true
	}

	get useFXAA(): boolean {
		return this.#useFXAA;
	}

	set useFXAA(value: boolean) {
		this.#useFXAA = value;
		this.#changedFXAA = true;
		this.#changedAntialiasing = true
	}

	get changedMSAA(): boolean {
		return this.#changedMSAA;
	}

	set changedMSAA(value: boolean) {
		this.#changedMSAA = value;
	}

	get changedFXAA(): boolean {
		return this.#changedFXAA;
	}

	set changedFXAA(value: boolean) {
		this.#changedFXAA = value;
	}

	get changedAntialiasing(): boolean {
		return this.#changedAntialiasing;
	}

	set changedAntialiasing(value: boolean) {
		this.#changedAntialiasing = value;
	}

	resetChangeFlags() {
		this.#changedMSAA = false
		this.#changedFXAA = false
		this.#changedAntialiasing = false
	}

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
	}
}

Object.freeze(AntialiasingManager)
export default AntialiasingManager
