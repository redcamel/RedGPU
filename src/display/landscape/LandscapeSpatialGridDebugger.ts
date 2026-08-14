import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "./ALandscapeDebugger";
import Landscape from "./Landscape";

/**
 * [KO] Landscape 지형 시스템의 2D SpatialGrid 타일 상태, 카메라 시야 반경(loadingRadius) 및 시선 방향/FOV 시야각을 2D 캔버스 오버레이로 실시간 시각화하는 디버거 클래스입니다 (ALandscapeDebugger 공통 메소드 기반).
 * [EN] Debugger class visualizing the 2D SpatialGrid tile states, camera loading radius, view direction, and FOV frustum wedge of Landscape terrain system via 2D canvas overlay (ALandscapeDebugger common method based).
 */
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

        // 1. World Outer Boundary
        this.#ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.#ctx.lineWidth = 1;
        this.#ctx.strokeRect(padding, padding, mapDrawWidth, mapDrawHeight);

        // 2. Component Grid Tiles (Top = North -Z, Bottom = South +Z)
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

            const isLoaded = this.landscape.tileStreamer && this.landscape.tileStreamer.isTileLoaded(comp.componentZ, comp.componentX);
            this.#ctx.fillStyle = isLoaded ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.05)';
            this.#ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            this.#ctx.fillRect(cx, cy, cellW, cellH);
            this.#ctx.strokeRect(cx, cy, cellW, cellH);
        }

        // 3. 카메라 시야 반경, FOV 시야 부채꼴, 시선 레이 및 위치 점 공통 렌더링
        this.drawCameraOverlay2D(this.#ctx, state, w, h, padding);

        this.#ctx.restore();
    }
}

export default LandscapeSpatialGridDebugger;
