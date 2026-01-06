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
        // setter를 통해 초기 상태를 설정하여 로직 일관성 유지
        if (window.devicePixelRatio > 1.0) {
            this.useTAA = true;
        } else {
            this.useMSAA = true;
        }
    }

    get useTAA(): boolean {
        return this.#useTAA;
    }

    set useTAA(value: boolean) {
        if (this.#useTAA === value) return;
        this.#clearAll();
        this.#useTAA = value;
    }

    get useMSAA(): boolean {
        return this.#useMSAA;
    }

    set useMSAA(value: boolean) {
        if (this.#useMSAA === value) return;
        this.#clearAll();
        this.#msaaID = createUUID();
        this.#useMSAA = value;
        this.#changedMSAA = true;
    }

    get useFXAA(): boolean {
        return this.#useFXAA;
    }

    set useFXAA(value: boolean) {
        if (this.#useFXAA === value) return;
        this.#clearAll();
        this.#useFXAA = value;
    }

    get changedMSAA(): boolean {
        return this.#changedMSAA;
    }

    set changedMSAA(value: boolean) { // boolean 타입 명시
        this.#changedMSAA = value;
    }

    get msaaID(): string {
        return this.#msaaID;
    }

    /** 모든 안티앨리어싱 설정을 초기화하는 공통 메서드 */
    #clearAll() {
        this.#useMSAA = false;
        this.#useFXAA = false;
        this.#useTAA = false;
    }
}

Object.freeze(AntialiasingManager)
export default AntialiasingManager
