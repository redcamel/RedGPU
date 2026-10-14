import createUUID from "../utils/uuid/createUUID";

/**
 * [KO] 엔진 전역 안티앨리어싱(Anti-aliasing) 모드를 상호 배타적으로 관리하는 매니저 클래스입니다.
 * [EN] Manager class that mutually exclusively manages global anti-aliasing modes across the engine.
 *
 * [KO] `MSAA`(Multi-Sample Anti-Aliasing), `FXAA`(Fast Approximate Anti-Aliasing), `TAA`(Temporal Anti-Aliasing) 중 하나의 안티앨리어싱 기법을 선택하여 활성화하며, 기법 전환 시 기존 모드를 자동으로 해제합니다. `RedGPUContext` 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Selects and activates one anti-aliasing technique among `MSAA` (Multi-Sample Anti-Aliasing), `FXAA` (Fast Approximate Anti-Aliasing), and `TAA` (Temporal Anti-Aliasing), automatically deactivating other modes upon switching. Automatically created internally when `RedGPUContext` is instantiated.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const antialiasingManager = redGPUContext.antialiasingManager;
 * antialiasingManager.useTAA = true;
 * ```
 *
 * @category Antialiasing
 */
class AntialiasingManager {
    #msaaID: string = createUUID()
    #useMSAA: boolean = true
    #useFXAA: boolean = false
    #useTAA: boolean = false

    /**
     * [KO] `AntialiasingManager` 인스턴스를 생성합니다.
     * [EN] Creates an `AntialiasingManager` instance.
     *
     * [KO] 디스플레이의 `window.devicePixelRatio` 값에 따라 초기 안티앨리어싱 모드를 자동으로 결정합니다 (`devicePixelRatio > 1.0`인 고해상도 환경에서는 `TAA`, 그 외에는 `MSAA` 활성화).
     * [EN] Automatically determines the initial anti-aliasing mode based on the display's `window.devicePixelRatio` (`TAA` for High-DPI displays with `devicePixelRatio > 1.0`, otherwise `MSAA`).
     */
    constructor() {
        if (window.devicePixelRatio > 1.0) {
            this.useTAA = true;
        } else {
            this.useMSAA = true;
        }
    }

    /**
     * [KO] TAA(Temporal Anti-Aliasing) 활성화 여부를 반환합니다.
     * [EN] Returns whether TAA (Temporal Anti-Aliasing) is enabled.
     *
     * ### Example
     * ```typescript
     * const isTAA = redGPUContext.antialiasingManager.useTAA;
     * ```
     *
     * @returns
     * [KO] TAA 활성화 여부
     * [EN] Whether TAA is enabled
     */
    get useTAA(): boolean {
        return this.#useTAA;
    }

    /**
     * [KO] TAA(Temporal Anti-Aliasing) 활성화 여부를 설정합니다. 활성화 시 MSAA 및 FXAA는 자동으로 비활성화됩니다.
     * [EN] Sets whether to enable TAA (Temporal Anti-Aliasing). Enabling TAA automatically disables MSAA and FXAA.
     *
     * ### Example
     * ```typescript
     * redGPUContext.antialiasingManager.useTAA = true;
     * ```
     *
     * @param value -
     * [KO] TAA 활성화 여부
     * [EN] Whether to enable TAA
     */
    set useTAA(value: boolean) {
        if (this.#useTAA === value) return;
        this.#clearAll();
        this.#useTAA = value;
    }

    /**
     * [KO] MSAA(Multi-Sample Anti-Aliasing) 활성화 여부를 반환합니다.
     * [EN] Returns whether MSAA (Multi-Sample Anti-Aliasing) is enabled.
     *
     * ### Example
     * ```typescript
     * const isMSAA = redGPUContext.antialiasingManager.useMSAA;
     * ```
     *
     * @returns
     * [KO] MSAA 활성화 여부
     * [EN] Whether MSAA is enabled
     */
    get useMSAA(): boolean {
        return this.#useMSAA;
    }

    /**
     * [KO] MSAA(Multi-Sample Anti-Aliasing) 활성화 여부를 설정합니다. 상태 변경 시 새로운 `msaaID`가 발급되며, TAA 및 FXAA는 자동으로 비활성화됩니다.
     * [EN] Sets whether to enable MSAA (Multi-Sample Anti-Aliasing). Issues a new `msaaID` upon state change and automatically disables TAA and FXAA.
     *
     * ### Example
     * ```typescript
     * redGPUContext.antialiasingManager.useMSAA = true;
     * ```
     *
     * @param value -
     * [KO] MSAA 활성화 여부
     * [EN] Whether to enable MSAA
     */
    set useMSAA(value: boolean) {
        if (this.#useMSAA === value) return;
        this.#clearAll();
        this.#msaaID = createUUID();
        this.#useMSAA = value;
    }

    /**
     * [KO] FXAA(Fast Approximate Anti-Aliasing) 활성화 여부를 반환합니다.
     * [EN] Returns whether FXAA (Fast Approximate Anti-Aliasing) is enabled.
     *
     * ### Example
     * ```typescript
     * const isFXAA = redGPUContext.antialiasingManager.useFXAA;
     * ```
     *
     * @returns
     * [KO] FXAA 활성화 여부
     * [EN] Whether FXAA is enabled
     */
    get useFXAA(): boolean {
        return this.#useFXAA;
    }

    /**
     * [KO] FXAA(Fast Approximate Anti-Aliasing) 활성화 여부를 설정합니다. 활성화 시 MSAA 및 TAA는 자동으로 비활성화됩니다.
     * [EN] Sets whether to enable FXAA (Fast Approximate Anti-Aliasing). Enabling FXAA automatically disables MSAA and TAA.
     *
     * ### Example
     * ```typescript
     * redGPUContext.antialiasingManager.useFXAA = true;
     * ```
     *
     * @param value -
     * [KO] FXAA 활성화 여부
     * [EN] Whether to enable FXAA
     */
    set useFXAA(value: boolean) {
        if (this.#useFXAA === value) return;
        this.#clearAll();
        this.#useFXAA = value;
    }

    /**
     * [KO] MSAA 상태 변경 감지를 위한 고유 식별자(UUID)를 반환합니다.
     * [EN] Returns the unique identifier (UUID) for detecting MSAA state changes.
     *
     * @returns
     * [KO] MSAA 상태 고유 ID
     * [EN] Unique ID of the MSAA state
     */
    get msaaID(): string {
        return this.#msaaID;
    }

    /**
     * [KO] 지정된 뷰의 TAA 누적 히스토리를 즉시 초기화합니다. 카메라 컷, 씬 전환, 또는 카메라 텔레포트 시 잔상(Ghosting)을 방지하기 위해 호출합니다.
     * [EN] Immediately resets the TAA accumulation history of the specified view. Call during camera cuts, scene transitions, or camera teleportation to prevent ghosting.
     *
     * ### Example
     * ```typescript
     * redGPUContext.antialiasingManager.resetHistory(view);
     * ```
     *
     * @param view -
     * [KO] TAA 히스토리를 초기화할 대상 뷰 인스턴스
     * [EN] Target view instance whose TAA history will be reset
     */
    resetHistory(view?: { taa?: { reset(): void } }): void {
        view?.taa?.reset();
    }

    #clearAll() {
        this.#useMSAA = false;
        this.#useFXAA = false;
        this.#useTAA = false;
    }
}

Object.freeze(AntialiasingManager)
export default AntialiasingManager

