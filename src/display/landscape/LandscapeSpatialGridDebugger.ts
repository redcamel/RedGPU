import ALandscapeDebugger from "./ALandscapeDebugger";
import Landscape from "./Landscape";

/**
 * [KO] Landscape 지형 시스템의 2D SpatialGrid 타일 상태, 카메라 시야 반경(loadingRadius) 및 정밀 동기화된 시선 방향/FOV 시야각을 2D 캔버스 오버레이로 실시간 시각화하는 디버거 클래스입니다 (Zero-GC 및 3D-to-2D 방위각 완전 동기화).
 * [EN] Debugger class visualizing the 2D SpatialGrid tile states, camera loading radius, view direction, and FOV frustum wedge of Landscape terrain system via 2D canvas overlay (Zero-GC and 3D-to-2D azimuth perfectly synchronized).
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

        // 3. Camera Loading Radius Circle (Bright Emerald Green)
        const camera = this.#camera;
        const camX = camera ? (camera.x ?? camera.position?.[0] ?? 0) : 0;
        const camZ = camera ? (camera.z ?? camera.position?.[2] ?? 0) : 0;

        const nx = (camX - worldMinX) / worldSizeX;
        const nz = (camZ - worldMinZ) / worldSizeZ;
        const camCanvasX = padding + Math.max(0, Math.min(1, nx)) * mapDrawWidth;
        const camCanvasY = padding + Math.max(0, Math.min(1, nz)) * mapDrawHeight;

        const radiusPixels = (this.landscape.loadingRadius / worldSizeX) * mapDrawWidth;

        this.#ctx.beginPath();
        this.#ctx.arc(camCanvasX, camCanvasY, radiusPixels, 0, Math.PI * 2);
        this.#ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
        this.#ctx.lineWidth = 1.5;
        this.#ctx.setLineDash([3, 3]);
        this.#ctx.stroke();
        this.#ctx.setLineDash([]);

        // 4. Camera View Direction & FOV Frustum Wedge (RedGPU 3D-to-2D 방위각 완전 정밀 연동)
        const pan = camera ? (camera.pan ?? 0) : 0;
        const fov = camera ? (camera.fov ?? 60) : 60;
        const panRad = (pan * Math.PI) / 180;
        const halfFovRad = ((fov / 2) * Math.PI) / 180;

        // 2D 미니맵 방위각 (pan=0: North -Z -> dx=0, dy=-1)
        const centerRad = Math.atan2(-Math.cos(panRad), Math.sin(panRad));

        const startAngle = centerRad - halfFovRad;
        const endAngle = centerRad + halfFovRad;
        const wedgeRadius = Math.max(16, Math.min(radiusPixels, 36));

        // FOV 시야 부채꼴 (High-contrast Amber Gold Fill & Stroke)
        this.#ctx.beginPath();
        this.#ctx.moveTo(camCanvasX, camCanvasY);
        this.#ctx.arc(camCanvasX, camCanvasY, wedgeRadius, startAngle, endAngle);
        this.#ctx.closePath();
        this.#ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
        this.#ctx.fill();
        this.#ctx.strokeStyle = 'rgba(251, 191, 36, 0.95)';
        this.#ctx.lineWidth = 1.5;
        this.#ctx.stroke();

        // 시선 중심 가이드 레이 (High-visibility Coral Red Ray Line)
        const dirX = Math.sin(panRad) * (wedgeRadius + 10);
        const dirY = -Math.cos(panRad) * (wedgeRadius + 10);
        this.#ctx.beginPath();
        this.#ctx.moveTo(camCanvasX, camCanvasY);
        this.#ctx.lineTo(camCanvasX + dirX, camCanvasY + dirY);
        this.#ctx.strokeStyle = '#ef4444';
        this.#ctx.lineWidth = 2.0;
        this.#ctx.stroke();

        // 5. Camera Position Dot (Glowing White Dot with Coral Red Ring)
        this.#ctx.beginPath();
        this.#ctx.arc(camCanvasX, camCanvasY, 4.0, 0, Math.PI * 2);
        this.#ctx.fillStyle = '#ffffff';
        this.#ctx.fill();
        this.#ctx.strokeStyle = '#ef4444';
        this.#ctx.lineWidth = 1.5;
        this.#ctx.stroke();

        this.#ctx.restore();
    }
}

export default LandscapeSpatialGridDebugger;
