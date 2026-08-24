import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import Landscape from "../../core/Landscape";

export class LandscapeSpatialGridDebugger extends ALandscapeDebugger {
    #ctx: CanvasRenderingContext2D | null;

    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'Spatial Grid',
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

        const components = this.landscape.landscapeComponents || [];
        const [tcX, tcZ] = this.landscape.componentCount;
        const cellW = w / tcX;
        const cellH = h / tcZ;

        const activeCount = components.length;
        for (let i = 0; i < activeCount; i++) {
            const comp = components[i];
            const cx = comp.componentX * cellW;
            const cy = comp.componentZ * cellH;

            const isCulled = comp.lodLevel < 0;
            const isLoaded = this.landscape.tileStreamer && this.landscape.tileStreamer.isTileLoaded(comp.componentZ, comp.componentX);

            if (isCulled) {
                this.#ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
            } else if (isLoaded) {
                this.#ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            } else {
                this.#ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            }

            this.#ctx.fillRect(cx, cy, cellW, cellH);
        }

        this.#ctx.restore();

        // 공통 2D 타일 그리드 및 카메라 오버레이 렌더링
        this.renderOverlay();
    }
}

export default LandscapeSpatialGridDebugger;
