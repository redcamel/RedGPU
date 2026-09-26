import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import Landscape from "../../Landscape";
import {LANDSCAPE_DEFAULT_LOD_RGBA_STRINGS} from "../../LANDSCAPE_DEFAULT_LOD_COLORS";

const UNLOADED_COLOR = 'rgba(255, 255, 255, 0.08)';

export class LandscapeSpatialGridDebugger extends ALandscapeDebugger {
    #ctx: CanvasRenderingContext2D | null;

    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'Spatial Grid (LOD)',
            ...options
        };
        super(landscape, cameraOrOptions, defaultOptions);
        this.#ctx = this.canvas.getContext('2d');
    }

    update(): void {
        if (!this.visible || !this.#ctx || !this.landscape) return;

        const dpr = this.dpr || 1;
        const w = this.contentWidth;
        const h = this.contentHeight;

        this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.#ctx.save();
        this.#ctx.scale(dpr, dpr);

        const lodColorStrings = LANDSCAPE_DEFAULT_LOD_RGBA_STRINGS;
        const maxColorIndex = lodColorStrings.length - 1;

        const cameraState = this.getCameraState();
        const camX = cameraState?.camX ?? 0;
        const camZ = cameraState?.camZ ?? 0;

        const components = this.landscape.landscapeComponents || [];
        const [tcX, tcZ] = this.landscape.componentCount;
        const cellW = w / tcX;
        const cellH = h / tcZ;

        const lodDistancesSq = this.landscape.lodDistancesSq || [];
        const lodDistCount = lodDistancesSq.length;
        const maxLODLevel = this.landscape.maxLODLevel ?? 5;

        const activeCount = components.length;
        for (let i = 0; i < activeCount; i++) {
            const comp = components[i];
            const cx = comp.componentX * cellW;
            const cy = comp.componentZ * cellH;

            const isLoaded = this.landscape.isTileLoaded(comp.componentZ, comp.componentX);

            if (isLoaded) {
                const centerX = comp.worldX;
                const centerZ = comp.worldZ;
                const dx = centerX - camX;
                const dz = centerZ - camZ;
                const distSq = dx * dx + dz * dz;

                let lod = maxLODLevel - 1;
                for (let l = 0; l < lodDistCount; l++) {
                    if (distSq <= lodDistancesSq[l]) {
                        lod = l;
                        break;
                    }
                }

                const colorIdx = Math.max(0, Math.min(lod, maxColorIndex));
                this.#ctx.fillStyle = lodColorStrings[colorIdx] ?? lodColorStrings[0];
            } else {
                this.#ctx.fillStyle = UNLOADED_COLOR;
            }

            this.#ctx.fillRect(cx, cy, cellW, cellH);
        }

        this.#ctx.restore();

        this.renderOverlay();
    }

    override destroy(): void {
        super.destroy();
        this.#ctx = null;
    }
}

Object.freeze(LandscapeSpatialGridDebugger);
export default LandscapeSpatialGridDebugger;
