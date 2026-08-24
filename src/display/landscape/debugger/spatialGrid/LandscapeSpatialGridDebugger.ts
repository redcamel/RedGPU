import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import Landscape from "../../core/Landscape";

const DEFAULT_LOD_COLOR_STRINGS: string[] = [
    'rgba(59, 130, 246, 0.75)',   // LOD 0 (Blue)
    'rgba(16, 185, 129, 0.75)',   // LOD 1 (Emerald Green)
    'rgba(234, 179, 8, 0.75)',    // LOD 2 (Yellow)
    'rgba(249, 115, 22, 0.75)',   // LOD 3 (Orange)
    'rgba(239, 68, 68, 0.75)',    // LOD 4 (Red)
    'rgba(168, 85, 247, 0.75)',   // LOD 5 (Purple)
    'rgba(236, 72, 153, 0.75)',   // LOD 6 (Pink)
    'rgba(148, 163, 184, 0.75)'   // LOD 7 (Slate)
];

const UNLOADED_COLOR = 'rgba(255, 255, 255, 0.08)';

export class LandscapeSpatialGridDebugger extends ALandscapeDebugger {
    #ctx: CanvasRenderingContext2D | null;
    #cachedLODColorStrings: string[] = [];

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

        this.#updateCachedColors();
        const lodColorStrings = this.#cachedLODColorStrings;
        const maxColorIndex = lodColorStrings.length - 1;

        const cameraState = this.getCameraState();
        const camX = cameraState?.camX ?? 0;
        const camZ = cameraState?.camZ ?? 0;

        const components = this.landscape.landscapeComponents || [];
        const [tcX, tcZ] = this.landscape.componentCount;
        const [tileSizeX, tileSizeZ] = this.landscape.tileSize;
        const cellW = w / tcX;
        const cellH = h / tcZ;
        const halfTileX = tileSizeX * 0.5;
        const halfTileZ = tileSizeZ * 0.5;

        const lodDistancesSq = this.landscape.lodDistancesSq || [];
        const lodDistCount = lodDistancesSq.length;
        const maxLODLevel = this.landscape.maxLODLevel ?? 5;

        const activeCount = components.length;
        for (let i = 0; i < activeCount; i++) {
            const comp = components[i];
            const cx = comp.componentX * cellW;
            const cy = comp.componentZ * cellH;

            const isLoaded = this.landscape.tileStreamer && this.landscape.tileStreamer.isTileLoaded(comp.componentZ, comp.componentX);

            if (isLoaded) {
                const centerX = comp.worldX + halfTileX;
                const centerZ = comp.worldZ + halfTileZ;
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

        // 공통 2D 타일 그리드 및 카메라 오버레이 렌더링
        this.renderOverlay();
    }

    #updateCachedColors(): void {
        const lodColors = this.landscape?.lodColors;
        if (!lodColors || lodColors.length === 0) {
            this.#cachedLODColorStrings = DEFAULT_LOD_COLOR_STRINGS;
            return;
        }

        if (this.#cachedLODColorStrings.length !== lodColors.length) {
            this.#cachedLODColorStrings = lodColors.map(c =>
                `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, 0.75)`
            );
        }
    }
}

export default LandscapeSpatialGridDebugger;
