import Landscape from "../Landscape";
import LandscapeTileStreamer from "../core/spatial/LandscapeTileStreamer";
import LandscapeSpatialGridDebugger from "./core/spatialGrid/LandscapeSpatialGridDebugger";
import LandscapeTextureDebugger from "./core/LandscapeTextureDebugger";
import vhtDebuggerWGSL from "./core/shader/vhtDebugger.wgsl";
import textureDebuggerFragmentWGSL from "./core/shader/textureDebuggerFragment.wgsl";

/**
 * [KO] 지형 디버그 속성 키 타입입니다.
 * [EN] Key type for landscape debug properties.
 *
 * @category Debugger
 */
export type DebuggerPropertyKey = 'wireframe' | 'debugMode' | 'lodColoration';

/**
 * [KO] 지형 디버그 속성 변경 시 호출되는 콜백 함수 타입입니다.
 * [EN] Callback function type invoked when a landscape debug property changes.
 *
 * @category Debugger
 */
export type DebuggerPropertyChangeHandler = (key: DebuggerPropertyKey, value: boolean | number) => void;

/**
 * [KO] `LandscapeDebuggerManager` 생성 옵션 인터페이스입니다.
 * [EN] Configuration options interface for creating a `LandscapeDebuggerManager`.
 *
 * @category Debugger
 */
export interface LandscapeDebuggerManagerOptions {
    /**
     * [KO] 공간 그리드(LOD) 디버거 활성화 여부
     * [EN] Whether to enable the spatial grid (LOD) debugger
     */
    spatialGrid?: boolean;
    /**
     * [KO] 가상 하이트맵 텍스처(VHT) 디버거 활성화 여부
     * [EN] Whether to enable the Virtual Heightmap Texture (VHT) debugger
     */
    vht?: boolean;
    /**
     * [KO] 가상 노멀 텍스처(VNT) 디버거 활성화 여부
     * [EN] Whether to enable the Virtual Normal Texture (VNT) debugger
     */
    vnt?: boolean;
    /**
     * [KO] 가상 블렌드 베이스 컬러 텍스처(VBT) 디버거 활성화 여부
     * [EN] Whether to enable the Virtual Blend BaseColor Texture (VBT) debugger
     */
    vbt?: boolean;
    /**
     * [KO] 가상 블렌드 노멀 텍스처(VBT Normal) 디버거 활성화 여부
     * [EN] Whether to enable the Virtual Blend Normal Texture (VBT Normal) debugger
     */
    vbtNormal?: boolean;
    /**
     * [KO] 가상 블렌드 ORM 텍스처(VBT ORM) 디버거 활성화 여부
     * [EN] Whether to enable the Virtual Blend ORM Texture (VBT ORM) debugger
     */
    vbtORM?: boolean;
    /**
     * [KO] 지형 와이어프레임 렌더링 활성화 여부
     * [EN] Whether to enable landscape wireframe rendering
     */
    landscapeWireframe?: boolean;
    /**
     * [KO] 지형 LOD 단계별 색상 시각화 활성화 여부
     * [EN] Whether to enable landscape LOD level coloration
     */
    landscapeLodColoration?: boolean;
    /**
     * [KO] 지형 디버그 렌더링 모드 인덱스
     * [EN] Landscape debug rendering mode index
     */
    landscapeDebugMode?: number;
    /**
     * [KO] 디버그 속성 변경 시 호출될 콜백 핸들러
     * [EN] Callback handler invoked when a debug property changes
     */
    onDebugPropertyChange?: DebuggerPropertyChangeHandler;
}

/**
 * [KO] 지형(`Landscape`)의 공간 그리드(LOD) 및 가상 텍스처(VHT, VNT, VBT) 디버거와 디버그 렌더링 상태를 통합 관리하는 매니저 클래스입니다.
 * [EN] Manager class that integrates and controls spatial grid (LOD) and virtual texture (VHT, VNT, VBT) debuggers and debug rendering states for `Landscape`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] Landscape 인스턴스로부터 디버거 매니저 접근 및 오버레이 활성화
 * // [EN] Access the debugger manager from a Landscape instance and enable overlays
 * const debuggerManager = landscape.debuggerManager;
 * debuggerManager.spatialGrid = true;
 * debuggerManager.vht = true;
 * ```
 *
 * @category Debugger
 */
class LandscapeDebuggerManager {
    #landscape: Landscape;
    #tileStreamer: LandscapeTileStreamer;

    #spatialGridDebugger: LandscapeSpatialGridDebugger | null = null;
    #vhtDebugger: LandscapeTextureDebugger | null = null;
    #vntDebugger: LandscapeTextureDebugger | null = null;
    #vbtDebugger: LandscapeTextureDebugger | null = null;
    #vbtNormalDebugger: LandscapeTextureDebugger | null = null;
    #vbtORMDebugger: LandscapeTextureDebugger | null = null;

    #enableSpatialGrid: boolean = false;
    #enableVHT: boolean = false;
    #enableVNT: boolean = false;
    #enableVBT: boolean = false;
    #enableVBTNormal: boolean = false;
    #enableVBTORM: boolean = false;
    #visible: boolean = true;
    #landscapeWireframe: boolean = false;
    #landscapeLodColoration: boolean = false;
    #landscapeDebugMode: number = 0;
    #onDebugPropertyChange?: DebuggerPropertyChangeHandler;

    /**
     * [KO] `LandscapeDebuggerManager` 인스턴스를 생성합니다.
     * [EN] Creates a `LandscapeDebuggerManager` instance.
     *
     * @param landscape -
     * [KO] 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance
     * @param tileStreamer -
     * [KO] `LandscapeTileStreamer` 인스턴스
     * [EN] `LandscapeTileStreamer` instance
     * @param options -
     * [KO] 초기 디버거 설정 옵션 (`LandscapeDebuggerManagerOptions`)
     * [EN] Initial debugger configuration options (`LandscapeDebuggerManagerOptions`)
     */
    constructor(landscape: Landscape, tileStreamer: LandscapeTileStreamer, options?: LandscapeDebuggerManagerOptions) {
        this.#landscape = landscape;
        this.#tileStreamer = tileStreamer;
        if (options) {
            const {
                onDebugPropertyChange,
                spatialGrid,
                vht,
                vnt,
                vbt,
                vbtNormal,
                vbtORM,
                landscapeWireframe,
                landscapeLodColoration,
                landscapeDebugMode
            } = options;
            this.#onDebugPropertyChange = onDebugPropertyChange;
            if (spatialGrid) this.spatialGrid = true;
            if (vht) this.vht = true;
            if (vnt) this.vnt = true;
            if (vbt) this.vbt = true;
            if (vbtNormal) this.vbtNormal = true;
            if (vbtORM) this.vbtORM = true;
            if (landscapeWireframe !== undefined) this.landscapeWireframe = landscapeWireframe;
            if (landscapeLodColoration !== undefined) this.landscapeLodColoration = landscapeLodColoration;
            if (landscapeDebugMode !== undefined) this.landscapeDebugMode = landscapeDebugMode;
        }
    }

    /**
     * [KO] 관리 대상 `Landscape` 인스턴스를 반환합니다.
     * [EN] Returns the managed `Landscape` instance.
     *
     * @returns
     * [KO] `Landscape` 인스턴스
     * [EN] `Landscape` instance
     */
    get landscape(): Landscape {
        return this.#landscape;
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
     * [KO] 공간 그리드(LOD) 디버거 오버레이 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the spatial grid (LOD) debugger overlay is enabled.
     *
     * @returns
     * [KO] 공간 그리드 디버거 활성화 여부
     * [EN] Whether the spatial grid debugger is enabled
     */
    get spatialGrid(): boolean {
        return this.#enableSpatialGrid;
    }

    set spatialGrid(val: boolean) {
        this.#enableSpatialGrid = val;
        if (val && !this.#spatialGridDebugger) {
            this.#spatialGridDebugger = new LandscapeSpatialGridDebugger(this.#landscape, null, {
                width: 100,
                height: 100,
                left: 12,
                bottom: 12
            });
        }
        if (this.#spatialGridDebugger) {
            this.#spatialGridDebugger.visible = this.#visible && val;
        }
    }

    /**
     * [KO] 가상 하이트맵 텍스처(VHT) 디버거 오버레이 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the Virtual Heightmap Texture (VHT) debugger overlay is enabled.
     *
     * @returns
     * [KO] VHT 디버거 활성화 여부
     * [EN] Whether the VHT debugger is enabled
     */
    get vht(): boolean {
        return this.#enableVHT;
    }

    set vht(val: boolean) {
        this.#enableVHT = val;
        if (val && !this.#vhtDebugger) {
            this.#vhtDebugger = new LandscapeTextureDebugger(
                this.#landscape,
                this.#tileStreamer,
                null,
                {
                    title: 'VHT (Height)',
                    width: 100,
                    height: 100,
                    left: 122,
                    bottom: 12
                },
                vhtDebuggerWGSL,
                'Landscape_Debugger_VHT_ShaderModule',
                (_, ts) => ts?.getAtlasTexture('vht') ?? null,
                {r: 0.06, g: 0.09, b: 0.16, a: 1.0}
            );
        }
        if (this.#vhtDebugger) {
            this.#vhtDebugger.visible = this.#visible && val;
        }
    }

    /**
     * [KO] 가상 노멀 텍스처(VNT) 디버거 오버레이 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the Virtual Normal Texture (VNT) debugger overlay is enabled.
     *
     * @returns
     * [KO] VNT 디버거 활성화 여부
     * [EN] Whether the VNT debugger is enabled
     */
    get vnt(): boolean {
        return this.#enableVNT;
    }

    set vnt(val: boolean) {
        this.#enableVNT = val;
        if (val && !this.#vntDebugger) {
            this.#vntDebugger = new LandscapeTextureDebugger(
                this.#landscape,
                this.#tileStreamer,
                null,
                {
                    title: 'VNT (Normal)',
                    width: 100,
                    height: 100,
                    left: 232,
                    bottom: 12
                },
                textureDebuggerFragmentWGSL,
                'Landscape_Debugger_VNT_ShaderModule',
                (_, ts) => ts?.getAtlasTexture('vnt') ?? null,
                {r: 0.1, g: 0.1, b: 0.1, a: 1.0}
            );
        }
        if (this.#vntDebugger) {
            this.#vntDebugger.visible = this.#visible && val;
        }
    }

    /**
     * [KO] 가상 블렌드 베이스 컬러 텍스처(VBT BaseColor) 디버거 오버레이 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the Virtual Blend BaseColor Texture (VBT BaseColor) debugger overlay is enabled.
     *
     * @returns
     * [KO] VBT BaseColor 디버거 활성화 여부
     * [EN] Whether the VBT BaseColor debugger is enabled
     */
    get vbt(): boolean {
        return this.#enableVBT;
    }

    set vbt(val: boolean) {
        this.#enableVBT = val;
        if (val && !this.#vbtDebugger) {
            this.#vbtDebugger = new LandscapeTextureDebugger(
                this.#landscape,
                this.#tileStreamer,
                null,
                {
                    title: 'VBT (BaseColor)',
                    width: 100,
                    height: 100,
                    left: 342,
                    bottom: 12
                },
                textureDebuggerFragmentWGSL,
                'Landscape_Debugger_VBT_BaseColor_ShaderModule',
                (_, ts) => ts?.getAtlasTexture('vbtBaseColor') ?? null,
                {r: 0.08, g: 0.08, b: 0.08, a: 1.0}
            );
        }
        if (this.#vbtDebugger) {
            this.#vbtDebugger.visible = this.#visible && val;
        }
    }

    /**
     * [KO] 가상 블렌드 노멀 텍스처(VBT Normal) 디버거 오버레이 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the Virtual Blend Normal Texture (VBT Normal) debugger overlay is enabled.
     *
     * @returns
     * [KO] VBT Normal 디버거 활성화 여부
     * [EN] Whether the VBT Normal debugger is enabled
     */
    get vbtNormal(): boolean {
        return this.#enableVBTNormal;
    }

    set vbtNormal(val: boolean) {
        this.#enableVBTNormal = val;
        if (val && !this.#vbtNormalDebugger) {
            this.#vbtNormalDebugger = new LandscapeTextureDebugger(
                this.#landscape,
                this.#tileStreamer,
                null,
                {
                    title: 'VBT (Normal)',
                    width: 100,
                    height: 100,
                    left: 452,
                    bottom: 12
                },
                textureDebuggerFragmentWGSL,
                'Landscape_Debugger_VBT_Normal_ShaderModule',
                (_, ts) => ts?.getAtlasTexture('vbtNormal') ?? null,
                {r: 0.5, g: 0.5, b: 1.0, a: 1.0}
            );
        }
        if (this.#vbtNormalDebugger) {
            this.#vbtNormalDebugger.visible = this.#visible && val;
        }
    }

    /**
     * [KO] 가상 블렌드 ORM 텍스처(VBT ORM) 디버거 오버레이 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the Virtual Blend ORM Texture (VBT ORM) debugger overlay is enabled.
     *
     * @returns
     * [KO] VBT ORM 디버거 활성화 여부
     * [EN] Whether the VBT ORM debugger is enabled
     */
    get vbtORM(): boolean {
        return this.#enableVBTORM;
    }

    set vbtORM(val: boolean) {
        this.#enableVBTORM = val;
        if (val && !this.#vbtORMDebugger) {
            this.#vbtORMDebugger = new LandscapeTextureDebugger(
                this.#landscape,
                this.#tileStreamer,
                null,
                {
                    title: 'VBT (ORM)',
                    width: 100,
                    height: 100,
                    left: 562,
                    bottom: 12
                },
                textureDebuggerFragmentWGSL,
                'Landscape_Debugger_VBT_ORM_ShaderModule',
                (_, ts) => ts?.getAtlasTexture('vbtORM') ?? null,
                {r: 1.0, g: 0.8, b: 0.0, a: 1.0}
            );
        }
        if (this.#vbtORMDebugger) {
            this.#vbtORMDebugger.visible = this.#visible && val;
        }
    }

    /**
     * [KO] 모든 지형 디버거 오버레이의 전체 가시성 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets the overall visibility of all landscape debugger overlays.
     *
     * @returns
     * [KO] 전체 가시성 여부
     * [EN] Overall visibility state
     */
    get visible(): boolean {
        return this.#visible;
    }

    set visible(val: boolean) {
        this.#visible = val;
        if (this.#spatialGridDebugger) this.#spatialGridDebugger.visible = val && this.#enableSpatialGrid;
        if (this.#vhtDebugger) this.#vhtDebugger.visible = val && this.#enableVHT;
        if (this.#vntDebugger) this.#vntDebugger.visible = val && this.#enableVNT;
        if (this.#vbtDebugger) this.#vbtDebugger.visible = val && this.#enableVBT;
        if (this.#vbtNormalDebugger) this.#vbtNormalDebugger.visible = val && this.#enableVBTNormal;
        if (this.#vbtORMDebugger) this.#vbtORMDebugger.visible = val && this.#enableVBTORM;
    }

    /**
     * [KO] 활성화된 모든 지형 디버거 오버레이를 갱신합니다.
     * [EN] Updates all enabled landscape debugger overlays.
     *
     * @param camera -
     * [KO] 카메라 위치 및 시야각 표시에 사용할 카메라 인스턴스
     * [EN] Camera instance used to display camera position and FOV
     */
    update(camera?: any): void {
        if (!this.#visible) return;

        if (this.#enableSpatialGrid && this.#spatialGridDebugger && this.#spatialGridDebugger.visible) {
            if (camera) this.#spatialGridDebugger.camera = camera;
            this.#spatialGridDebugger.update();
        }

        if (this.#enableVHT && this.#vhtDebugger && this.#vhtDebugger.visible) {
            if (camera) this.#vhtDebugger.camera = camera;
            this.#vhtDebugger.update();
        }

        if (this.#enableVNT && this.#vntDebugger && this.#vntDebugger.visible) {
            if (camera) this.#vntDebugger.camera = camera;
            this.#vntDebugger.update();
        }

        if (this.#enableVBT && this.#vbtDebugger && this.#vbtDebugger.visible) {
            if (camera) this.#vbtDebugger.camera = camera;
            this.#vbtDebugger.update();
        }

        if (this.#enableVBTNormal && this.#vbtNormalDebugger && this.#vbtNormalDebugger.visible) {
            if (camera) this.#vbtNormalDebugger.camera = camera;
            this.#vbtNormalDebugger.update();
        }

        if (this.#enableVBTORM && this.#vbtORMDebugger && this.#vbtORMDebugger.visible) {
            if (camera) this.#vbtORMDebugger.camera = camera;
            this.#vbtORMDebugger.update();
        }
    }

    /**
     * [KO] 생성된 모든 디버거 인스턴스와 관련 리소스를 해제합니다.
     * [EN] Destroys all created debugger instances and releases related resources.
     */
    destroy(): void {
        this.landscapeWireframe = false;
        this.landscapeLodColoration = false;
        this.landscapeDebugMode = 0;
        this.#onDebugPropertyChange = undefined;
        if (this.#spatialGridDebugger) {
            this.#spatialGridDebugger.destroy();
            this.#spatialGridDebugger = null;
        }
        if (this.#vhtDebugger) {
            this.#vhtDebugger.destroy();
            this.#vhtDebugger = null;
        }
        if (this.#vntDebugger) {
            this.#vntDebugger.destroy();
            this.#vntDebugger = null;
        }
        if (this.#vbtDebugger) {
            this.#vbtDebugger.destroy();
            this.#vbtDebugger = null;
        }
        if (this.#vbtNormalDebugger) {
            this.#vbtNormalDebugger.destroy();
            this.#vbtNormalDebugger = null;
        }
        if (this.#vbtORMDebugger) {
            this.#vbtORMDebugger.destroy();
            this.#vbtORMDebugger = null;
        }
    }
}

Object.freeze(LandscapeDebuggerManager);
export default LandscapeDebuggerManager;
