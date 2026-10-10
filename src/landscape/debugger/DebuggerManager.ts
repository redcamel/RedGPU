/**
 * [KO] 지형 가상 텍스처 및 공간 그리드 시각 디버깅 총괄 매니저 모듈입니다.
 * [EN] Overall manager module for terrain virtual texture and spatial grid visual debugging.
 * @packageDocumentation
 */
import Landscape from "../Landscape";
import LandscapeTileStreamer from "../core/spatial/LandscapeTileStreamer";
import LandscapeSpatialGridDebugger from "./core/spatialGrid/LandscapeSpatialGridDebugger";
import LandscapeTextureDebugger from "./core/LandscapeTextureDebugger";
import vhtDebuggerWGSL from "./core/shader/vhtDebugger.wgsl";
import LandscapeShaderLibrary from "../core/shader/library/LandscapeShaderLibrary";

/**
 * [KO] 디버그 프로퍼티 키 타입입니다.
 * [EN] Property keys for landscape debugging.
 */
export type DebuggerPropertyKey = 'wireframe' | 'debugMode' | 'lodColoration';

/**
 * [KO] 디버그 속성 변경 시 호출되는 이벤트 핸들러 타입입니다.
 * [EN] Callback handler triggered when a debugger property changes.
 */
export type DebuggerPropertyChangeHandler = (key: DebuggerPropertyKey, value: boolean | number) => void;

/**
 * [KO] DebuggerManager 생성 및 초기 활성화 옵션입니다.
 * [EN] Initialization options for DebuggerManager.
 */
export interface DebuggerManagerOptions {
    /**
     * [KO] 공간 그리드 디버거 뷰어 활성화 여부
     * [EN] Whether to enable the spatial grid debugger viewer
     */
    spatialGrid?: boolean;
    /**
     * [KO] 가상 하이트맵(VHT) 디버거 뷰어 활성화 여부
     * [EN] Whether to enable the virtual heightmap (VHT) debugger viewer
     */
    vht?: boolean;
    /**
     * [KO] 가상 노멀맵(VNT) 디버거 뷰어 활성화 여부
     * [EN] Whether to enable the virtual normal (VNT) debugger viewer
     */
    vnt?: boolean;
    /**
     * [KO] 가상 베이크 베이스 컬러(VBT BaseColor) 디버거 뷰어 활성화 여부
     * [EN] Whether to enable the virtual baked base color (VBT) debugger viewer
     */
    vbt?: boolean;
    /**
     * [KO] 가상 베이크 노멀(VBT Normal) 디버거 뷰어 활성화 여부
     * [EN] Whether to enable the virtual baked normal (VBT Normal) debugger viewer
     */
    vbtNormal?: boolean;
    /**
     * [KO] 가상 베이크 ORM(VBT ORM) 디버거 뷰어 활성화 여부
     * [EN] Whether to enable the virtual baked ORM (VBT ORM) debugger viewer
     */
    vbtORM?: boolean;
    /**
     * [KO] 지형 와이어프레임 렌더링 활성화 여부
     * [EN] Whether to enable terrain wireframe rendering
     */
    landscapeWireframe?: boolean;
    /**
     * [KO] 지형 LOD 단계별 색상 시각화 활성화 여부
     * [EN] Whether to enable terrain LOD level coloration
     */
    landscapeLodColoration?: boolean;
    /**
     * [KO] 지형 셰이더 디버그 모드 (0: NONE, 1: NORMAL, 2: ROUGHNESS 등)
     * [EN] Landscape shader debug mode (0: NONE, 1: NORMAL, 2: ROUGHNESS, etc.)
     */
    landscapeDebugMode?: number;
    /**
     * [KO] 디버그 속성 변경 이벤트 콜백
     * [EN] Event callback for debug property changes
     */
    onDebugPropertyChange?: DebuggerPropertyChangeHandler;
}

/**
 * [KO] 지형의 온스크린 2D 텍스처 뷰어(SpatialGrid, VHT, VNT, VBT) 및 와이어프레임/LOD 색상/디버그 모드를 총괄 제어하는 디버거 관리자입니다.
 * [EN] Debugger manager orchestrating on-screen 2D texture viewers (SpatialGrid, VHT, VNT, VBT) and wireframe/LOD coloration/debug modes for the landscape.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const debuggerManager = landscape.debuggerManager;
 * debuggerManager.vbt = true;
 * ```
 */
class DebuggerManager {
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
     * [KO] DebuggerManager 생성자입니다.
     * [EN] Constructor for DebuggerManager.
     *
     * @param landscape - [KO] 대상 Landscape 인스턴스 / [EN] Target Landscape instance
     * @param tileStreamer - [KO] 타일 스트리머 인스턴스 / [EN] Tile streamer instance
     * @param options - [KO] 초기 디버거 설정 옵션 / [EN] Initial debugger options
     */
    constructor(landscape: Landscape, tileStreamer: LandscapeTileStreamer, options?: DebuggerManagerOptions) {
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
     * [KO] 연결된 대상 Landscape 인스턴스를 반환합니다.
     * [EN] Returns the linked target Landscape instance.
     */
    get landscape(): Landscape {
        return this.#landscape;
    }

    /**
     * @example
     * ```ts
     * // 지형 와이어프레임 모드 전환
     * landscape.debuggerManager.landscapeWireframe = true;
     * ```
     *
     * [KO] 지형 메쉬를 와이어프레임(Line List 토폴로지)으로 렌더링할지 여부를 설정하거나 가져옵니다.
     * [EN] Gets or sets whether to render the terrain mesh in wireframe mode (Line List topology).
     *
     * @defaultValue false
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
     * @example
     * ```ts
     * // 노멀 벡터 시각화 모드로 변경
     * landscape.debuggerManager.landscapeDebugMode = RedGPU.Landscape.LANDSCAPE_DEBUG_MODE.NORMAL;
     * ```
     *
     * [KO] 지형 셰이더의 디버그 시각화 모드를 설정하거나 가져옵니다. {@link RedGPU.Landscape.LANDSCAPE_DEBUG_MODE} 상수를 사용합니다.
     * [EN] Gets or sets the shader debug visualization mode for the landscape. Uses {@link RedGPU.Landscape.LANDSCAPE_DEBUG_MODE} constants.
     *
     * @defaultValue 0 (LANDSCAPE_DEBUG_MODE.NONE)
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
     * @example
     * ```ts
     * // LOD 단계별 색상 시각화 켜기
     * landscape.debuggerManager.landscapeLodColoration = true;
     * ```
     *
     * [KO] 지형 타일의 LOD 단계별로 고유 색상을 오버레이하여 시각화할지 여부를 설정하거나 가져옵니다.
     * [EN] Gets or sets whether to overlay distinct colors for each LOD level of terrain tiles for debugging.
     *
     * @defaultValue false
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
     * [KO] 공간 그리드(Spatial Grid) 온스크린 뷰어의 활성화 여부를 설정하거나 가져옵니다.
     * [EN] Gets or sets whether the Spatial Grid on-screen viewer is enabled.
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
     * [KO] 가상 하이트맵(VHT) 온스크린 뷰어의 활성화 여부를 설정하거나 가져옵니다.
     * [EN] Gets or sets whether the VHT on-screen viewer is enabled.
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
     * [KO] 가상 노멀맵(VNT) 온스크린 뷰어의 활성화 여부를 설정하거나 가져옵니다.
     * [EN] Gets or sets whether the VNT on-screen viewer is enabled.
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
                LandscapeShaderLibrary.debug.textureDebuggerFragment,
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
     * [KO] 가상 베이크 베이스 컬러(VBT BaseColor) 온스크린 뷰어의 활성화 여부를 설정하거나 가져옵니다.
     * [EN] Gets or sets whether the VBT BaseColor on-screen viewer is enabled.
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
                LandscapeShaderLibrary.debug.textureDebuggerFragment,
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
     * [KO] 가상 베이크 노멀(VBT Normal) 온스크린 뷰어의 활성화 여부를 설정하거나 가져옵니다.
     * [EN] Gets or sets whether the VBT Normal on-screen viewer is enabled.
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
                LandscapeShaderLibrary.debug.textureDebuggerFragment,
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
     * [KO] 가상 베이크 ORM(VBT ORM) 온스크린 뷰어의 활성화 여부를 설정하거나 가져옵니다.
     * [EN] Gets or sets whether the VBT ORM on-screen viewer is enabled.
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
                LandscapeShaderLibrary.debug.textureDebuggerFragment,
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
     * [KO] 공간 그리드 디버거 인스턴스를 반환합니다.
     * [EN] Returns the LandscapeSpatialGridDebugger instance.
     */
    get spatialGridDebugger(): LandscapeSpatialGridDebugger | null {
        return this.#spatialGridDebugger;
    }

    /**
     * [KO] 가상 하이트맵(VHT) 디버거 인스턴스를 반환합니다.
     * [EN] Returns the LandscapeTextureDebugger instance for VHT.
     */
    get vhtDebugger(): LandscapeTextureDebugger | null {
        return this.#vhtDebugger;
    }

    /**
     * [KO] 가상 노멀맵(VNT) 디버거 인스턴스를 반환합니다.
     * [EN] Returns the LandscapeTextureDebugger instance for VNT.
     */
    get vntDebugger(): LandscapeTextureDebugger | null {
        return this.#vntDebugger;
    }

    /**
     * [KO] 가상 베이크 텍스처(VBT BaseColor) 디버거 인스턴스를 반환합니다.
     * [EN] Returns the LandscapeTextureDebugger instance for VBT BaseColor.
     */
    get vbtDebugger(): LandscapeTextureDebugger | null {
        return this.#vbtDebugger;
    }

    /**
     * [KO] 가상 베이크 노멀(VBT Normal) 디버거 인스턴스를 반환합니다.
     * [EN] Returns the LandscapeTextureDebugger instance for VBT Normal.
     */
    get vbtNormalDebugger(): LandscapeTextureDebugger | null {
        return this.#vbtNormalDebugger;
    }

    /**
     * [KO] 가상 베이크 ORM(VBT ORM) 디버거 인스턴스를 반환합니다.
     * [EN] Returns the LandscapeTextureDebugger instance for VBT ORM.
     */
    get vbtORMDebugger(): LandscapeTextureDebugger | null {
        return this.#vbtORMDebugger;
    }

    /**
     * [KO] 모든 온스크린 디버거 뷰어의 일괄 가시성 상태를 설정하거나 가져옵니다.
     * [EN] Gets or sets the overall visibility of all on-screen debugger viewers.
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
     * [KO] 활성화된 각 디버거 뷰어의 카메라 및 렌더링 상태를 매 프레임 갱신합니다.
     * [EN] Updates camera and render state for all active debugger viewers every frame.
     *
     * @param camera - [KO] 현재 뷰의 카메라 인스턴스 / [EN] Camera instance of the current view
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
     * [KO] 모든 디버거 뷰어를 파괴하고 리소스를 해제합니다.
     * [EN] Destroys all debugger viewers and releases resources.
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

Object.freeze(DebuggerManager);
export default DebuggerManager;
