type DebuggerPropertyKey = 'wireframe' | 'debugMode' | 'lodColoration';
type DebuggerPropertyChangeHandler = (key: DebuggerPropertyKey, value: boolean | number) => void;

/**
 * [KO] 지형(`Landscape`)의 와이어프레임, LOD 색상 시각화, 디버그 렌더링 모드를 관리하는 매니저 클래스입니다. `Landscape` 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Manager class that controls wireframe, LOD coloration, and debug rendering modes for `Landscape`. Automatically created internally when a `Landscape` is instantiated.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] Landscape 인스턴스로부터 디버거 매니저 접근 및 디버그 렌더링 활성화
 * // [EN] Access the debugger manager from a Landscape instance and enable debug rendering
 * const debuggerManager = landscape.debuggerManager;
 * debuggerManager.landscapeWireframe = true;
 * debuggerManager.landscapeLodColoration = true;
 * ```
 *
 * @category Debugger
 */
class LandscapeDebuggerManager {
    #landscapeWireframe: boolean = false;
    #landscapeLodColoration: boolean = false;
    #landscapeDebugMode: number = 0;
    #onDebugPropertyChange?: DebuggerPropertyChangeHandler;

    /**
     * [KO] `LandscapeDebuggerManager` 인스턴스를 생성합니다.
     * [EN] Creates a `LandscapeDebuggerManager` instance.
     *
     * @param onDebugPropertyChange -
     * [KO] 디버그 속성 변경 시 호출될 콜백 핸들러
     * [EN] Callback handler invoked when a debug property changes
     */
    constructor(onDebugPropertyChange?: DebuggerPropertyChangeHandler) {
        this.#onDebugPropertyChange = onDebugPropertyChange;
    }

    /**
     * [KO] 지형 와이어프레임 렌더링 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether landscape wireframe rendering is enabled.
     *
     * @returns
     * [KO] 와이어프레임 활성화 여부
     * [EN] Whether wireframe is enabled
     */
    get landscapeWireframe(): boolean {
        return this.#landscapeWireframe;
    }

    set landscapeWireframe(value: boolean) {
        if (this.#landscapeWireframe !== value) {
            this.#landscapeWireframe = value;
            this.#onDebugPropertyChange?.('wireframe', value);
        }
    }

    /**
     * [KO] 지형 디버그 렌더링 모드를 반환하거나 설정합니다. (`LANDSCAPE_DEBUG_MODE` 상수 참조)
     * [EN] Gets or sets the landscape debug rendering mode. (Refer to `LANDSCAPE_DEBUG_MODE` constants)
     *
     * @returns
     * [KO] 디버그 모드 값
     * [EN] Debug mode value
     */
    get landscapeDebugMode(): number {
        return this.#landscapeDebugMode;
    }

    set landscapeDebugMode(value: number) {
        if (this.#landscapeDebugMode !== value) {
            this.#landscapeDebugMode = value;
            this.#onDebugPropertyChange?.('debugMode', value);
        }
    }

    /**
     * [KO] 지형 LOD 단계별 색상 시각화 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether landscape LOD coloration is enabled.
     *
     * @returns
     * [KO] LOD 색상 시각화 활성화 여부
     * [EN] Whether LOD coloration is enabled
     */
    get landscapeLodColoration(): boolean {
        return this.#landscapeLodColoration;
    }

    set landscapeLodColoration(value: boolean) {
        if (this.#landscapeLodColoration !== value) {
            this.#landscapeLodColoration = value;
            this.#onDebugPropertyChange?.('lodColoration', value);
        }
    }

    /**
     * [KO] 디버거 상태를 초기화하고 콜백 참조를 해제합니다.
     * [EN] Resets debugger states and releases callback references.
     */
    destroy(): void {
        this.landscapeWireframe = false;
        this.landscapeLodColoration = false;
        this.landscapeDebugMode = 0;
        this.#onDebugPropertyChange = undefined;
    }
}

Object.freeze(LandscapeDebuggerManager);
export default LandscapeDebuggerManager;
