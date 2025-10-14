import createUUID from "../../utils/uuid/createUUID";
class AntialiasingManager {
    #redGPUContext;
    #msaaID;
    #useMSAA = false;
    #useFXAA = false;
    #useTAA = true;
    #changedMSAA = true;
    constructor(redGPUContext) {
        this.#redGPUContext = redGPUContext;
        if (window.devicePixelRatio > 1) {
            this.useTAA = true;
            this.useMSAA = false;
            this.useFXAA = false;
        }
        else {
            this.useTAA = false;
            this.useMSAA = true;
            this.useFXAA = false;
        }
    }
    get useTAA() {
        return this.#useTAA;
    }
    set useTAA(value) {
        this.#useTAA = value;
    }
    get useMSAA() {
        return this.#useMSAA;
    }
    set useMSAA(value) {
        if (this.#useMSAA !== value)
            this.#msaaID = createUUID();
        this.#useMSAA = value;
        this.#changedMSAA = true;
    }
    get msaaID() {
        return this.#msaaID;
    }
    get useFXAA() {
        return this.#useFXAA;
    }
    set useFXAA(value) {
        this.#useFXAA = value;
    }
    get changedMSAA() {
        return this.#changedMSAA;
    }
    set changedMSAA(value) {
        this.#changedMSAA = value;
    }
}
Object.freeze(AntialiasingManager);
export default AntialiasingManager;
