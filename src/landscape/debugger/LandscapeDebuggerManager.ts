import Landscape from "../Landscape";
import LandscapeTileStreamer from "../core/spatial/LandscapeTileStreamer";
import LandscapeSpatialGridDebugger from "./core/spatialGrid/LandscapeSpatialGridDebugger";
import LandscapeVHTDebugger from "./core/vht/LandscapeVHTDebugger";
import LandscapeVNTDebugger from "./core/vnt/LandscapeVNTDebugger";
import LandscapeVBTDebugger from "./core/vbt/LandscapeVBTDebugger";
import LandscapeVBTNormalDebugger from "./core/vbt/LandscapeVBTNormalDebugger";
import LandscapeVBTORMDebugger from "./core/vbt/LandscapeVBTORMDebugger";

export type LandscapeDebugPropertyKey = 'wireframe' | 'debugMode' | 'lodColoration';
export type LandscapeDebugPropertyChangeHandler = (key: LandscapeDebugPropertyKey, value: boolean | number) => void;

export interface LandscapeDebuggerManagerOptions {
    spatialGrid?: boolean;
    vht?: boolean;
    vnt?: boolean;
    vbt?: boolean;
    vbtBaseColor?: boolean;
    vbtNormal?: boolean;
    vbtORM?: boolean;
    landscapeWireframe?: boolean;
    landscapeLodColoration?: boolean;
    landscapeDebugMode?: number;
    onDebugPropertyChange?: LandscapeDebugPropertyChangeHandler;
}

export class LandscapeDebuggerManager {
    #landscape: Landscape;
    #tileStreamer: LandscapeTileStreamer;

    #spatialGridDebugger: LandscapeSpatialGridDebugger | null = null;
    #vhtDebugger: LandscapeVHTDebugger | null = null;
    #vntDebugger: LandscapeVNTDebugger | null = null;
    #vbtDebugger: LandscapeVBTDebugger | null = null;
    #vbtNormalDebugger: LandscapeVBTNormalDebugger | null = null;
    #vbtORMDebugger: LandscapeVBTORMDebugger | null = null;

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
    #onDebugPropertyChange?: LandscapeDebugPropertyChangeHandler;

    constructor(landscape: Landscape, tileStreamer: LandscapeTileStreamer, options?: LandscapeDebuggerManagerOptions) {
        this.#landscape = landscape;
        this.#tileStreamer = tileStreamer;
        this.#onDebugPropertyChange = options?.onDebugPropertyChange;

        if (options?.spatialGrid) this.spatialGrid = true;
        if (options?.vht) this.vht = true;
        if (options?.vnt) this.vnt = true;
        if (options?.vbt || options?.vbtBaseColor) this.vbt = true;
        if (options?.vbtNormal) this.vbtNormal = true;
        if (options?.vbtORM) this.vbtORM = true;
        if (options?.landscapeWireframe !== undefined) this.landscapeWireframe = options.landscapeWireframe;
        if (options?.landscapeLodColoration !== undefined) this.landscapeLodColoration = options.landscapeLodColoration;
        if (options?.landscapeDebugMode !== undefined) this.landscapeDebugMode = options.landscapeDebugMode;
    }

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
     * [KO]
     * 지형 메쉬를 와이어프레임(Line List 토폴로지)으로 렌더링할지 여부를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets whether to render the terrain mesh in wireframe mode (Line List topology).
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
     * [KO]
     * 지형 셰이더의 디버그 시각화 모드를 설정하거나 가져옵니다. {@link RedGPU.Landscape.LANDSCAPE_DEBUG_MODE} 상수를 사용합니다.
     *
     * [EN]
     * Gets or sets the shader debug visualization mode for the landscape. Uses {@link RedGPU.Landscape.LANDSCAPE_DEBUG_MODE} constants.
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
     * [KO]
     * 지형 타일의 LOD 단계별로 고유 색상을 오버레이하여 시각화할지 여부를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets whether to overlay distinct colors for each LOD level of terrain tiles for debugging.
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

    get vht(): boolean {
        return this.#enableVHT;
    }

    set vht(val: boolean) {
        this.#enableVHT = val;
        if (val && !this.#vhtDebugger) {
            this.#vhtDebugger = new LandscapeVHTDebugger(this.#landscape, this.#tileStreamer, null, {
                width: 100,
                height: 100,
                left: 122,
                bottom: 12
            });
        }
        if (this.#vhtDebugger) {
            this.#vhtDebugger.visible = this.#visible && val;
        }
    }

    get vnt(): boolean {
        return this.#enableVNT;
    }

    set vnt(val: boolean) {
        this.#enableVNT = val;
        if (val && !this.#vntDebugger) {
            this.#vntDebugger = new LandscapeVNTDebugger(this.#landscape, this.#tileStreamer, null, {
                width: 100,
                height: 100,
                left: 232,
                bottom: 12
            });
        }
        if (this.#vntDebugger) {
            this.#vntDebugger.visible = this.#visible && val;
        }
    }

    get vbt(): boolean {
        return this.#enableVBT;
    }

    set vbt(val: boolean) {
        this.#enableVBT = val;
        if (val && !this.#vbtDebugger) {
            this.#vbtDebugger = new LandscapeVBTDebugger(this.#landscape, this.#tileStreamer, null, {
                width: 100,
                height: 100,
                left: 342,
                bottom: 12
            });
        }
        if (this.#vbtDebugger) {
            this.#vbtDebugger.visible = this.#visible && val;
        }
    }

    get vbtBaseColor(): boolean {
        return this.vbt;
    }

    set vbtBaseColor(val: boolean) {
        this.vbt = val;
    }

    get vbtNormal(): boolean {
        return this.#enableVBTNormal;
    }

    set vbtNormal(val: boolean) {
        this.#enableVBTNormal = val;
        if (val && !this.#vbtNormalDebugger) {
            this.#vbtNormalDebugger = new LandscapeVBTNormalDebugger(this.#landscape, this.#tileStreamer, null, {
                width: 100,
                height: 100,
                left: 452,
                bottom: 12
            });
        }
        if (this.#vbtNormalDebugger) {
            this.#vbtNormalDebugger.visible = this.#visible && val;
        }
    }

    get vbtORM(): boolean {
        return this.#enableVBTORM;
    }

    set vbtORM(val: boolean) {
        this.#enableVBTORM = val;
        if (val && !this.#vbtORMDebugger) {
            this.#vbtORMDebugger = new LandscapeVBTORMDebugger(this.#landscape, this.#tileStreamer, null, {
                width: 100,
                height: 100,
                left: 562,
                bottom: 12
            });
        }
        if (this.#vbtORMDebugger) {
            this.#vbtORMDebugger.visible = this.#visible && val;
        }
    }

    get spatialGridDebugger(): LandscapeSpatialGridDebugger | null {
        return this.#spatialGridDebugger;
    }

    get vhtDebugger(): LandscapeVHTDebugger | null {
        return this.#vhtDebugger;
    }

    get vntDebugger(): LandscapeVNTDebugger | null {
        return this.#vntDebugger;
    }

    get vbtDebugger(): LandscapeVBTDebugger | null {
        return this.#vbtDebugger;
    }

    get vbtBaseColorDebugger(): LandscapeVBTDebugger | null {
        return this.#vbtDebugger;
    }

    get vbtNormalDebugger(): LandscapeVBTNormalDebugger | null {
        return this.#vbtNormalDebugger;
    }

    get vbtORMDebugger(): LandscapeVBTORMDebugger | null {
        return this.#vbtORMDebugger;
    }

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

    showAll(): void {
        this.visible = true;
    }

    hideAll(): void {
        this.visible = false;
    }

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
