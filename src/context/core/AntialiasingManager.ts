import createUUID from "../../utils/uuid/createUUID";
import RedGPUContext from "../RedGPUContext";

/**
 * @description `AntialiasingManager` 클래스는 안티앨리어싱 설정을 관리한다.
 * 현재 MSAA, FXAA, TAA 설정을 지원하며, 각 설정의 활성화 여부를 제어할 수 있다.
 */
class AntialiasingManager {
    #redGPUContext: RedGPUContext;
    #msaaID: string
    #useMSAA: boolean = true
    #useFXAA: boolean = false
    #useTAA: boolean = false
    #changedMSAA: boolean = true

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        if (window.devicePixelRatio > 1.0) {
            this.useTAA = true
            this.useMSAA = false
            this.useFXAA = false
        } else {
            this.useTAA = false
            this.useMSAA = true
            this.useFXAA = false
        }
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
        if (this.#useMSAA !== value) this.#msaaID = createUUID()
        this.#useMSAA = value;
        this.#changedMSAA = true;
    }

    get msaaID(): string {
        return this.#msaaID;
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
