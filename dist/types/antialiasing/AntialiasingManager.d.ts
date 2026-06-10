/**
 * [KO] 안티앨리어싱(Anti-aliasing) 설정을 관리하는 클래스입니다.
 * [EN] Class that manages anti-aliasing settings.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * // [KO] RedGPUContext, View 또는 RedGPUObject 상속 객체를 통해 접근합니다.
 * // [EN] Access via RedGPUContext, View, or RedGPUObject inherited objects.
 * const antialiasingManager = redGPUContext.antialiasingManager;
 * ```
 *
 * @category Core
 */
declare class AntialiasingManager {
    #private;
    /**
     * [KO] AntialiasingManager 생성자입니다.
     * `window.devicePixelRatio` 값에 따라 초기 안티앨리어싱 모드가 결정됩니다:
     * - `devicePixelRatio > 1.0` (고해상도 화면): TAA가 활성화됩니다.
     * - `devicePixelRatio <= 1.0` (일반 해상도 화면): MSAA가 활성화됩니다.
     * [EN] AntialiasingManager constructor.
     * The initial anti-aliasing mode is determined based on the `window.devicePixelRatio` value:
     * - `devicePixelRatio > 1.0` (High-DPI screen): TAA is enabled.
     * - `devicePixelRatio <= 1.0` (Standard resolution screen): MSAA is enabled.
     */
    constructor();
    /**
     * [KO] TAA(Temporal Anti-Aliasing) 사용 여부를 반환합니다.
     * [EN] Returns whether TAA (Temporal Anti-Aliasing) is used.
     *
     * * ### Example
     * ```typescript
     * const useTAA = antialiasingManager.useTAA;
     * ```
     *
     * @returns
     * [KO] TAA 사용 여부
     * [EN] Whether TAA is used
     */
    get useTAA(): boolean;
    /**
     * [KO] TAA(Temporal Anti-Aliasing) 사용 여부를 설정합니다.
     * [EN] Sets whether to use TAA (Temporal Anti-Aliasing).
     *
     * * ### Example
     * ```typescript
     * antialiasingManager.useTAA = true;
     * ```
     *
     * @param value -
     * [KO] TAA 사용 여부
     * [EN] Whether to use TAA
     */
    set useTAA(value: boolean);
    /**
     * [KO] MSAA(Multi-Sample Anti-Aliasing) 사용 여부를 반환합니다.
     * [EN] Returns whether MSAA (Multi-Sample Anti-Aliasing) is used.
     *
     * * ### Example
     * ```typescript
     * const useMSAA = antialiasingManager.useMSAA;
     * ```
     *
     * @returns
     * [KO] MSAA 사용 여부
     * [EN] Whether MSAA is used
     */
    get useMSAA(): boolean;
    /**
     * [KO] MSAA(Multi-Sample Anti-Aliasing) 사용 여부를 설정합니다.
     * [EN] Sets whether to use MSAA (Multi-Sample Anti-Aliasing).
     *
     * * ### Example
     * ```typescript
     * antialiasingManager.useMSAA = true;
     * ```
     *
     * @param value -
     * [KO] MSAA 사용 여부
     * [EN] Whether to use MSAA
     */
    set useMSAA(value: boolean);
    /**
     * [KO] FXAA(Fast Approximate Anti-Aliasing) 사용 여부를 반환합니다.
     * [EN] Returns whether FXAA (Fast Approximate Anti-Aliasing) is used.
     *
     * * ### Example
     * ```typescript
     * const useFXAA = antialiasingManager.useFXAA;
     * ```
     *
     * @returns
     * [KO] FXAA 사용 여부
     * [EN] Whether FXAA is used
     */
    get useFXAA(): boolean;
    /**
     * [KO] FXAA(Fast Approximate Anti-Aliasing) 사용 여부를 설정합니다.
     * [EN] Sets whether to use FXAA (Fast Approximate Anti-Aliasing).
     *
     * * ### Example
     * ```typescript
     * antialiasingManager.useFXAA = true;
     * ```
     *
     * @param value -
     * [KO] FXAA 사용 여부
     * [EN] Whether to use FXAA
     */
    set useFXAA(value: boolean);
    /**
     * [KO] 현재 MSAA의 고유 ID를 반환합니다.
     * [EN] Returns the unique ID of the current MSAA.
     *
     * @returns
     * [KO] MSAA 고유 ID
     * [EN] Unique ID of MSAA
     * @internal
     */
    get msaaID(): string;
}
export default AntialiasingManager;
