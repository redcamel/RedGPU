import Landscape from "../../core/Landscape";
import LandscapeHUDDebugger from "../hud/LandscapeHUDDebugger";
import LandscapeSpatialGridDebugger from "../spatialGrid/LandscapeSpatialGridDebugger";
import LandscapeVHTDebugger from "../vht/LandscapeVHTDebugger";
import LandscapeVNTDebugger from "../vnt/LandscapeVNTDebugger";
import LandscapeVBTDebugger from "../vbt/LandscapeVBTDebugger";
import LandscapeVBTNormalDebugger from "../vbt/LandscapeVBTNormalDebugger";
import LandscapeVBTORMDebugger from "../vbt/LandscapeVBTORMDebugger";
import RenderViewStateData from "../../../view/core/RenderViewStateData";

export interface LandscapeDebuggerManagerOptions {
    hud?: boolean;
    spatialGrid?: boolean;
    vht?: boolean;
    vnt?: boolean;
    vbt?: boolean;
    vbtBaseColor?: boolean;
    vbtNormal?: boolean;
    vbtORM?: boolean;
}

export class LandscapeDebuggerManager {
    #landscape: Landscape;

    #hudDebugger: LandscapeHUDDebugger | null = null;
    #spatialGridDebugger: LandscapeSpatialGridDebugger | null = null;
    #vhtDebugger: LandscapeVHTDebugger | null = null;
    #vntDebugger: LandscapeVNTDebugger | null = null;
    #vbtDebugger: LandscapeVBTDebugger | null = null;
    #vbtNormalDebugger: LandscapeVBTNormalDebugger | null = null;
    #vbtORMDebugger: LandscapeVBTORMDebugger | null = null;

    #enableHUD: boolean = false;
    #enableSpatialGrid: boolean = false;
    #enableVHT: boolean = false;
    #enableVNT: boolean = false;
    #enableVBT: boolean = false;
    #enableVBTNormal: boolean = false;
    #enableVBTORM: boolean = false;
    #visible: boolean = true;

    constructor(landscape: Landscape, options?: LandscapeDebuggerManagerOptions) {
        this.#landscape = landscape;

        if (options?.hud) this.hud = true;
        if (options?.spatialGrid) this.spatialGrid = true;
        if (options?.vht) this.vht = true;
        if (options?.vnt) this.vnt = true;
        if (options?.vbt || options?.vbtBaseColor) this.vbt = true;
        if (options?.vbtNormal) this.vbtNormal = true;
        if (options?.vbtORM) this.vbtORM = true;
    }

    get landscape(): Landscape {
        return this.#landscape;
    }

    get hud(): boolean {
        return this.#enableHUD;
    }

    set hud(val: boolean) {
        this.#enableHUD = val;
        if (val && !this.#hudDebugger) {
            this.#hudDebugger = new LandscapeHUDDebugger(this.#landscape, null, {
                width: 320,
                left: 12,
                bottom: 120
            });
        }
        if (this.#hudDebugger) {
            this.#hudDebugger.visible = this.#visible && val;
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
            this.#vhtDebugger = new LandscapeVHTDebugger(this.#landscape, null, {
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
            this.#vntDebugger = new LandscapeVNTDebugger(this.#landscape, null, {
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
            this.#vbtDebugger = new LandscapeVBTDebugger(this.#landscape, null, {
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
            this.#vbtNormalDebugger = new LandscapeVBTNormalDebugger(this.#landscape, null, {
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
            this.#vbtORMDebugger = new LandscapeVBTORMDebugger(this.#landscape, null, {
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

    get hudDebugger(): LandscapeHUDDebugger | null {
        return this.#hudDebugger;
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
        if (this.#hudDebugger) this.#hudDebugger.visible = val && this.#enableHUD;
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

    update(camera?: any, renderViewStateData?: RenderViewStateData): void {
        if (!this.#visible) return;

        if (this.#enableHUD && this.#hudDebugger && this.#hudDebugger.visible) {
            if (camera) this.#hudDebugger.camera = camera;
            this.#hudDebugger.update(renderViewStateData);
        }

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
        if (this.#hudDebugger) {
            this.#hudDebugger.destroy();
            this.#hudDebugger = null;
        }
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

export default LandscapeDebuggerManager;
