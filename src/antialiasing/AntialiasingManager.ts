import createUUID from "../utils/uuid/createUUID";

/**
 * [KO] 컨텍스트 전역의 안티앨리어싱(Anti-aliasing) 모드를 통합 관리하는 클래스입니다.
 * [EN] Class that manages the global anti-aliasing mode across the context.
 *
 * [KO] MSAA(Multi-Sample Anti-Aliasing), FXAA(Fast Approximate Anti-Aliasing), TAA(Temporal Anti-Aliasing) 중 하나의 기법을 상호 배타적으로 활성화하며, 모드 전환 시 기존 안티앨리어싱 설정을 자동으로 해제합니다.
 * [EN] Mutually exclusively activates one technique among MSAA (Multi-Sample Anti-Aliasing), FXAA (Fast Approximate Anti-Aliasing), and TAA (Temporal Anti-Aliasing), automatically deactivating the previous setting when switching modes.
 *
 * ::: info
 * [KO] 초기 생성 시 디스플레이의 픽셀 밀도(`window.devicePixelRatio`)가 `1.0`을 초과하는 고해상도(HiDPI/Retina) 환경에서는 `useTAA`가 기본 활성화되며, 일반 해상도(`1.0` 이하) 환경에서는 `useMSAA`가 기본 활성화됩니다.
 * [EN] Upon initialization, `useTAA` is enabled by default on high-resolution (HiDPI/Retina) displays where `window.devicePixelRatio` exceeds `1.0`, while `useMSAA` is enabled by default on standard-resolution (`1.0` or lower) displays.
 * :::
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
     * [KO] TAA(Temporal Anti-Aliasing) 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether TAA (Temporal Anti-Aliasing) is enabled.
     *
     * ::: info
     * [KO] `true`로 설정하면 기존에 활성화된 `useMSAA` 및 `useFXAA`는 자동으로 `false`로 전환됩니다.
     * [EN] Setting this to `true` automatically switches any previously enabled `useMSAA` and `useFXAA` to `false`.
     * :::
     *
     * ### Example
     * ```typescript
     * // [KO] TAA 활성화
     * // [EN] Enable TAA
     * redGPUContext.antialiasingManager.useTAA = true;
     * ```
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
     * [KO] MSAA(Multi-Sample Anti-Aliasing) 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether MSAA (Multi-Sample Anti-Aliasing) is enabled.
     *
     * ::: info
     * [KO] 상태가 변경될 때마다 새로운 `msaaID`가 발급되어 렌더 파이프라인의 멀티샘플링 구성을 갱신하며, 기존 `useFXAA` 및 `useTAA`는 자동으로 해제됩니다.
     * [EN] Whenever the state changes, a new `msaaID` is issued to update the multisampling configuration of the render pipeline, and any previously enabled `useFXAA` and `useTAA` are automatically disabled.
     * :::
     *
     * ### Example
     * ```typescript
     * // [KO] MSAA 활성화
     * // [EN] Enable MSAA
     * redGPUContext.antialiasingManager.useMSAA = true;
     * ```
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
     * [KO] FXAA(Fast Approximate Anti-Aliasing) 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether FXAA (Fast Approximate Anti-Aliasing) is enabled.
     *
     * ::: info
     * [KO] `true`로 설정하면 기존에 활성화된 `useMSAA` 및 `useTAA`는 자동으로 `false`로 전환됩니다.
     * [EN] Setting this to `true` automatically switches any previously enabled `useMSAA` and `useTAA` to `false`.
     * :::
     *
     * ### Example
     * ```typescript
     * // [KO] FXAA 활성화
     * // [EN] Enable FXAA
     * redGPUContext.antialiasingManager.useFXAA = true;
     * ```
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
     */
    get msaaID(): string {
        return this.#msaaID;
    }

    #clearAll() {
        this.#useMSAA = false;
        this.#useFXAA = false;
        this.#useTAA = false;
    }
}

Object.freeze(AntialiasingManager)
export default AntialiasingManager
