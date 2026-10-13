import Landscape from "../Landscape";
import LandscapeTileStreamer from "../core/spatial/LandscapeTileStreamer";
import LandscapeSpatialGridDebugger from "./core/spatialGrid/LandscapeSpatialGridDebugger";
import LandscapeTextureDebugger from "./core/LandscapeTextureDebugger";
import vhtDebuggerWGSL from "./core/shader/vhtDebugger.wgsl";
import textureDebuggerFragmentWGSL from "./core/shader/textureDebuggerFragment.wgsl";

export type DebuggerPropertyKey = 'wireframe' | 'debugMode' | 'lodColoration';

export type DebuggerPropertyChangeHandler = (key: DebuggerPropertyKey, value: boolean | number) => void;

export interface LandscapeDebuggerManagerOptions {
    spatialGrid?: boolean;
    vht?: boolean;
    vnt?: boolean;
    vbt?: boolean;
    vbtNormal?: boolean;
    vbtORM?: boolean;
    landscapeWireframe?: boolean;
    landscapeLodColoration?: boolean;
    landscapeDebugMode?: number;
    onDebugPropertyChange?: DebuggerPropertyChangeHandler;
}

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

    get landscape(): Landscape {
        return this.#landscape;
    }

    get landscapeWireframe(): boolean {
        return this.#landscapeWireframe;
    }

    set landscapeWireframe(value: boolean) {
        if (this.#landscapeWireframe !== value) {
            this.#landscapeWireframe = value;
            this.#onDebugPropertyChange?.('wireframe', value);
        }
    }

    get landscapeDebugMode(): number {
        return this.#landscapeDebugMode;
    }

    set landscapeDebugMode(value: number) {
        if (this.#landscapeDebugMode !== value) {
            this.#landscapeDebugMode = value;
            this.#onDebugPropertyChange?.('debugMode', value);
        }
    }

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

