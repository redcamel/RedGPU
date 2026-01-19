import createUUID from "../utils/uuid/createUUID";
import RedGPUContext from "../context/RedGPUContext";

/**
 * [KO] 안티앨리어싱(Anti-aliasing) 설정을 관리하는 클래스입니다.
 * [EN] Class that manages anti-aliasing settings.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다. <br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system. <br/> Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * const antialiasingManager = redGPUContext.antialiasingManager;
 * antialiasingManager.useMSAA = true;
 * ```
 *
 * @category Core
 */
class AntialiasingManager {
    #redGPUContext: RedGPUContext;
    #msaaID: string
    #useMSAA: boolean = true
    #useFXAA: boolean = false
    #useTAA: boolean = false
    #changedMSAA: boolean = true


    /**
     * [KO] AntialiasingManager 생성자
     * [EN] AntialiasingManager constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        // setter를 통해 초기 상태를 설정하여 로직 일관성 유지
        if (window.devicePixelRatio > 1.0) {
            this.useTAA = true;
        } else {
            this.useMSAA = true;
        }
    }

    /**
     * [KO] TAA(Temporal Anti-Aliasing) 사용 여부를 반환합니다.
     * [EN] Returns whether TAA (Temporal Anti-Aliasing) is used.
     *
     * @returns
     * [KO] TAA 사용 여부
     * [EN] Whether TAA is used
     */
    get useTAA(): boolean {
        return this.#useTAA;
    }

    /**
     * [KO] TAA(Temporal Anti-Aliasing) 사용 여부를 설정합니다.
     * [EN] Sets whether to use TAA (Temporal Anti-Aliasing).
     *
     * @param value -
     * [KO] TAA 사용 여부
     * [EN] Whether to use TAA
     */
    set useTAA(value: boolean) {
        if (this.#useTAA === value) return;
        this.#clearAll();
        this.#useTAA = value;
    }

    /**
     * [KO] MSAA(Multi-Sample Anti-Aliasing) 사용 여부를 반환합니다.
     * [EN] Returns whether MSAA (Multi-Sample Anti-Aliasing) is used.
     *
     * @returns
     * [KO] MSAA 사용 여부
     * [EN] Whether MSAA is used
     */
    get useMSAA(): boolean {
        return this.#useMSAA;
    }

    /**
     * [KO] MSAA(Multi-Sample Anti-Aliasing) 사용 여부를 설정합니다.
     * [EN] Sets whether to use MSAA (Multi-Sample Anti-Aliasing).
     *
     * @param value -
     * [KO] MSAA 사용 여부
     * [EN] Whether to use MSAA
     */
    set useMSAA(value: boolean) {
        if (this.#useMSAA === value) return;
        this.#clearAll();
        this.#msaaID = createUUID();
        this.#useMSAA = value;
        this.#changedMSAA = true;
    }

    /**
     * [KO] FXAA(Fast Approximate Anti-Aliasing) 사용 여부를 반환합니다.
     * [EN] Returns whether FXAA (Fast Approximate Anti-Aliasing) is used.
     *
     * @returns
     * [KO] FXAA 사용 여부
     * [EN] Whether FXAA is used
     */
    get useFXAA(): boolean {
        return this.#useFXAA;
    }

    /**
     * [KO] FXAA(Fast Approximate Anti-Aliasing) 사용 여부를 설정합니다.
     * [EN] Sets whether to use FXAA (Fast Approximate Anti-Aliasing).
     *
     * @param value -
     * [KO] FXAA 사용 여부
     * [EN] Whether to use FXAA
     */
    set useFXAA(value: boolean) {
        if (this.#useFXAA === value) return;
        this.#clearAll();
        this.#useFXAA = value;
    }

    /**
     * [KO] MSAA 설정 변경 여부를 반환합니다.
     * [EN] Returns whether the MSAA setting has changed.
     *
     * @returns
     * [KO] MSAA 변경 여부
     * [EN] Whether MSAA has changed
     * @internal
     */
    get changedMSAA(): boolean {
        return this.#changedMSAA;
    }

    /**
     * [KO] MSAA 설정 변경 여부를 설정합니다.
     * [EN] Sets whether the MSAA setting has changed.
     *
     * @param value -
     * [KO] MSAA 변경 여부
     * [EN] Whether MSAA has changed
     * @internal
     */
    set changedMSAA(value: boolean) { // boolean 타입 명시
        this.#changedMSAA = value;
    }

    /**
     * [KO] 현재 MSAA의 고유 ID를 반환합니다.
     * [EN] Returns the unique ID of the current MSAA.
     *
     * @returns
     * [KO] MSAA 고유 ID
     * [EN] Unique ID of MSAA
     * @internal
     */
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
