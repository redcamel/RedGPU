import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "./ALandscapeDebugger";
import Landscape from "../core/Landscape";

export class LandscapeSpatialGridDebugger extends ALandscapeDebugger {
    #ctx: CanvasRenderingContext2D | null;

    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        super(landscape, cameraOrOptions, options);
        this.#ctx = this.canvas.getContext('2d');
    }

    update(): void {
        if (!this.visible || !this.#ctx || !this.landscape) return;

        const state = this.getCameraState();
        if (!state) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const padding = 5;
        const mapDrawWidth = w - padding * 2;
        const mapDrawHeight = h - padding * 2;

        this.#ctx.clearRect(0, 0, w, h);
        this.#ctx.save();

        const {worldSizeX, worldSizeZ, worldMinX, worldMinZ} = state;

        this.#ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.#ctx.lineWidth = 1;
        this.#ctx.strokeRect(padding, padding, mapDrawWidth, mapDrawHeight);

        const components = this.landscape.landscapeComponents || [];
        const [tcX, tcZ] = this.landscape.componentCount;
        const cellW = mapDrawWidth / tcX;
        const cellH = mapDrawHeight / tcZ;

        const activeCount = components.length;
        for (let i = 0; i < activeCount; i++) {
            const comp = components[i];
            const nx = (comp.worldX - worldMinX) / worldSizeX;
            const nz = (comp.worldZ - worldMinZ) / worldSizeZ;
            const cx = padding + nx * mapDrawWidth - cellW / 2;
            const cy = padding + nz * mapDrawHeight - cellH / 2;

            const isCulled = comp.lodLevel < 0;
            const isLoaded = this.landscape.tileStreamer && this.landscape.tileStreamer.isTileLoaded(comp.componentZ, comp.componentX);

            if (isCulled) {
                this.#ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
                this.#ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
            } else if (isLoaded) {
                this.#ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
                this.#ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            } else {
                this.#ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                this.#ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            }

            this.#ctx.fillRect(cx, cy, cellW, cellH);
            this.#ctx.strokeRect(cx, cy, cellW, cellH);
        }

        this.drawCameraOverlay2D(this.#ctx, state, w, h, padding);

        this.#ctx.restore();
    }
}

export default LandscapeSpatialGridDebugger;
