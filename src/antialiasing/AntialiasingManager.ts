import createUUID from "../utils/uuid/createUUID";

/**
 * [KO] 컨텍스트 전역의 안티앨리어싱(Anti-aliasing) 모드를 통합 관리하는 클래스입니다.
 * [EN] Class that manages the global anti-aliasing mode across the context.
 *
 * [KO] MSAA, FXAA, TAA 중 하나의 안티앨리어싱 기법만 선택해 적용할 수 있습니다. 처음 생성될 때는 화면 해상도(`window.devicePixelRatio > 1.0`)를 감지하여, 고해상도(Retina 등) 모니터에서는 `useTAA`가, 일반 모니터에서는 `useMSAA`가 기본으로 켜집니다.
 * [EN] Only one anti-aliasing technique among MSAA, FXAA, and TAA can be applied at a time. Upon initial creation, it detects the screen resolution (`window.devicePixelRatio > 1.0`) and enables `useTAA` by default on high-DPI (e.g., Retina) displays, or `useMSAA` on standard displays.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] RedGPUContext로부터 AntialiasingManager 접근 및 모드 전환
 * // [EN] Access AntialiasingManager from RedGPUContext and switch modes
 * const { antialiasingManager } = redGPUContext;
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
     * [KO] `AntialiasingManager` 인스턴스를 초기화하고 디스플레이 픽셀 밀도에 따라 기본 안티앨리어싱 모드를 설정합니다.
     * [EN] Initializes the `AntialiasingManager` instance and sets the default anti-aliasing mode based on the display pixel ratio.
     */
    constructor() {
        if (window.devicePixelRatio > 1.0) {
            this.useTAA = true;
        } else {
            this.useMSAA = true;
        }
    }

    /**
     * [KO] TAA(Temporal Anti-Aliasing) 활성화 여부를 반환하거나 설정합니다. 활성화 시 기존 `useMSAA` 및 `useFXAA`는 자동으로 해제됩니다.
     * [EN] Gets or sets whether TAA (Temporal Anti-Aliasing) is enabled. Enabling this automatically disables `useMSAA` and `useFXAA`.
     *
     * ### Example
     * ```typescript
     * // [KO] TAA 활성화
     * // [EN] Enable TAA
     * redGPUContext.antialiasingManager.useTAA = true;
     * ```
     *
     * @returns
     * [KO] TAA 활성화 여부
     * [EN] Whether TAA is enabled
     */
    get useTAA(): boolean {
        return this.#useTAA;
    }

    set useTAA(value: boolean) {
        if (this.#useTAA === value) return;
        this.#clearAll();
        this.#useTAA = value;
    }

    /**
     * [KO] MSAA(Multi-Sample Anti-Aliasing) 활성화 여부를 반환하거나 설정합니다. 상태 변경 시 새로운 `msaaID`가 발급되며 기존 `useFXAA` 및 `useTAA`는 자동으로 해제됩니다.
     * [EN] Gets or sets whether MSAA (Multi-Sample Anti-Aliasing) is enabled. When changed, a new `msaaID` is issued and `useFXAA` and `useTAA` are automatically disabled.
     *
     * ### Example
     * ```typescript
     * // [KO] MSAA 활성화
     * // [EN] Enable MSAA
     * redGPUContext.antialiasingManager.useMSAA = true;
     * ```
     *
     * @returns
     * [KO] MSAA 활성화 여부
     * [EN] Whether MSAA is enabled
     */
    get useMSAA(): boolean {
        return this.#useMSAA;
    }

    set useMSAA(value: boolean) {
        if (this.#useMSAA === value) return;
        this.#clearAll();
        this.#msaaID = createUUID();
        this.#useMSAA = value;
    }

    /**
     * [KO] FXAA(Fast Approximate Anti-Aliasing) 활성화 여부를 반환하거나 설정합니다. 활성화 시 기존 `useMSAA` 및 `useTAA`는 자동으로 해제됩니다.
     * [EN] Gets or sets whether FXAA (Fast Approximate Anti-Aliasing) is enabled. Enabling this automatically disables `useMSAA` and `useTAA`.
     *
     * ### Example
     * ```typescript
     * // [KO] FXAA 활성화
     * // [EN] Enable FXAA
     * redGPUContext.antialiasingManager.useFXAA = true;
     * ```
     *
     * @returns
     * [KO] FXAA 활성화 여부
     * [EN] Whether FXAA is enabled
     */
    get useFXAA(): boolean {
        return this.#useFXAA;
    }

    set useFXAA(value: boolean) {
        if (this.#useFXAA === value) return;
        this.#clearAll();
        this.#useFXAA = value;
    }

    /**
     * [KO] MSAA 상태 변경을 추적하기 위한 고유 식별자(UUID)를 반환합니다.
     * [EN] Returns the unique identifier (UUID) used to track MSAA state changes.
     *
     * @returns
     * [KO] MSAA 상태 식별용 UUID 문자열
     * [EN] UUID string for identifying MSAA state
     */
    get msaaID(): string {
        return this.#msaaID;
    }

    /**
     * [KO] 지정된 뷰(`View3D`)의 TAA 누적 히스토리 프레임을 초기화합니다. 카메라가 컷 전환(순간 이동)되거나 씬 구성이 급격히 변경될 때 호출하면 이전 프레임 잔상(Ghosting)을 즉시 제거할 수 있습니다.
     * [EN] Resets the accumulated TAA history frames for the specified view (`View3D`). Call this when the camera teleports or the scene changes abruptly to immediately eliminate ghosting artifacts.
     *
     * ### Example
     * ```typescript
     * // [KO] 카메라 위치 급변 후 TAA 히스토리 리셋
     * // [EN] Reset TAA history after an abrupt camera position change
     * redGPUContext.antialiasingManager.resetHistory(view);
     * ```
     *
     * @param view -
     * [KO] TAA 히스토리를 리셋할 대상 뷰 객체
     * [EN] Target view object whose TAA history will be reset
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
