import ALandscapeDebugger from "./ALandscapeDebugger";
import Landscape from "./Landscape";

/**
 * [KO] Landscape 지형 시스템의 2D SpatialGrid 타일 상태 및 카메라 시야 반경(loadingRadius)을 2D 캔버스 오버레이로 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class visualizing the 2D SpatialGrid tile states and camera loading radius of Landscape terrain system via 2D canvas overlay.
 */
export class LandscapeSpatialGridDebugger extends ALandscapeDebugger {
    #camera: any;
    #ctx: CanvasRenderingContext2D | null;

    constructor(
        landscape: Landscape,
        camera: any,
        options: {
            width?: number,
            height?: number,
            left?: number,
            bottom?: number
        } = {}
    ) {
        super(landscape, options);
        this.#camera = camera;
        this.#ctx = this.canvas.getContext('2d');
    }

    update(): void {
        if (!this.visible || !this.#ctx || !this.landscape) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const padding = 5;
        const mapDrawWidth = w - padding * 2;
        const mapDrawHeight = h - padding * 2;

        this.#ctx.clearRect(0, 0, w, h);

        this.#ctx.save();

        const [worldSizeX, worldSizeZ] = this.landscape.worldSize;
        const worldMinX = -worldSizeX / 2;
        const worldMinZ = -worldSizeZ / 2;

        const worldToCanvas = (wx: number, wz: number): [number, number] => {
            const nx = (wx - worldMinX) / worldSizeX;
            const nz = (wz - worldMinZ) / worldSizeZ;
            return [
                padding + Math.max(0, Math.min(1, nx)) * mapDrawWidth,
                padding + (1 - Math.max(0, Math.min(1, nz))) * mapDrawHeight
            ];
        };

        // 1. World Outer Boundary
        this.#ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.#ctx.lineWidth = 1;
        this.#ctx.strokeRect(padding, padding, mapDrawWidth, mapDrawHeight);

        // 2. Component Grid Tiles
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
            const cy = padding + (1 - nz) * mapDrawHeight - cellH / 2;

            const isLoaded = this.landscape.tileStreamer && this.landscape.tileStreamer.loadedTileCount > 0;
            this.#ctx.fillStyle = isLoaded ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.05)';
            this.#ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            this.#ctx.fillRect(cx, cy, cellW, cellH);
            this.#ctx.strokeRect(cx, cy, cellW, cellH);
        }

        // 3. Camera Loading Radius Circle
        const camera = this.#camera;
        const camX = camera ? (camera.x ?? camera.position?.[0] ?? 0) : 0;
        const camZ = camera ? (camera.z ?? camera.position?.[2] ?? 0) : 0;
        const [camCanvasX, camCanvasY] = worldToCanvas(camX, camZ);
        const radiusPixels = (this.landscape.loadingRadius / worldSizeX) * mapDrawWidth;

        this.#ctx.beginPath();
        this.#ctx.arc(camCanvasX, camCanvasY, radiusPixels, 0, Math.PI * 2);
        this.#ctx.strokeStyle = 'rgba(74, 222, 128, 0.8)';
        this.#ctx.lineWidth = 1.5;
        this.#ctx.setLineDash([3, 3]);
        this.#ctx.stroke();
        this.#ctx.setLineDash([]);

        // 4. Camera Position (Red Dot)
        this.#ctx.beginPath();
        this.#ctx.arc(camCanvasX, camCanvasY, 3.5, 0, Math.PI * 2);
        this.#ctx.fillStyle = '#f87171';
        this.#ctx.fill();
        this.#ctx.strokeStyle = '#ffffff';
        this.#ctx.lineWidth = 1;
        this.#ctx.stroke();

        this.#ctx.restore();
    }
}

export default LandscapeSpatialGridDebugger;
