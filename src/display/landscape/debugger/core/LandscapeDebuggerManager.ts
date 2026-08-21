import Landscape from "../../core/Landscape";
import LandscapeHUDDebugger from "../hud/LandscapeHUDDebugger";
import LandscapeSpatialGridDebugger from "../spatialGrid/LandscapeSpatialGridDebugger";
import LandscapeVHTDebugger from "../vht/LandscapeVHTDebugger";
import LandscapeVNTDebugger from "../vnt/LandscapeVNTDebugger";
import RenderViewStateData from "../../../view/core/RenderViewStateData";

export interface LandscapeDebuggerManagerOptions {
    hud?: boolean;
    spatialGrid?: boolean;
    vht?: boolean;
    vnt?: boolean;
}

export class LandscapeDebuggerManager {
    #landscape: Landscape;

    #hudDebugger: LandscapeHUDDebugger | null = null;
    #spatialGridDebugger: LandscapeSpatialGridDebugger | null = null;
    #vhtDebugger: LandscapeVHTDebugger | null = null;
    #vntDebugger: LandscapeVNTDebugger | null = null;

    #enableHUD: boolean = false;
    #enableSpatialGrid: boolean = false;
    #enableVHT: boolean = false;
    #enableVNT: boolean = false;
    #visible: boolean = true;

    constructor(landscape: Landscape, options?: LandscapeDebuggerManagerOptions) {
        this.#landscape = landscape;

        if (options?.hud) this.hud = true;
        if (options?.spatialGrid) this.spatialGrid = true;
        if (options?.vht) this.vht = true;
        if (options?.vnt) this.vnt = true;
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

    get visible(): boolean {
        return this.#visible;
    }

    set visible(val: boolean) {
        this.#visible = val;
        if (this.#hudDebugger) this.#hudDebugger.visible = val && this.#enableHUD;
        if (this.#spatialGridDebugger) this.#spatialGridDebugger.visible = val && this.#enableSpatialGrid;
        if (this.#vhtDebugger) this.#vhtDebugger.visible = val && this.#enableVHT;
        if (this.#vntDebugger) this.#vntDebugger.visible = val && this.#enableVNT;
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
    }
}

export default LandscapeDebuggerManager;
