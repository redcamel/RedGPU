import Landscape from "./Landscape";

/**
 * [KO] Landscape 지형 시스템의 2D SpatialGrid 타일 상태 및 카메라 시야 반경(loadingRadius)을 2D 캔버스 오버레이로 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class visualizing the 2D SpatialGrid tile states and camera loading radius of Landscape terrain system via 2D canvas overlay.
 */
export class LandscapeSpatialGridDebugger {
    #landscape: Landscape;
    #camera: any;
    #canvas: HTMLCanvasElement;
    #ctx: CanvasRenderingContext2D | null;
    #visible: boolean = true;

    #width: number = 100;
    #height: number = 100;
    #left: number = 12;
    #bottom: number = 12;

    constructor(landscape: Landscape, camera: any, options: {
        width?: number,
        height?: number,
        left?: number,
        bottom?: number
    } = {}) {
        this.#landscape = landscape;
        this.#camera = camera;

        const w = options.width ?? 100;
        const h = options.height ?? 100;
        const left = options.left ?? 12;
        const bottom = options.bottom ?? 12;

        const canvas = document.createElement('canvas');
        canvas.id = 'landscape-spatial-grid-debugger-canvas';
        canvas.width = w;
        canvas.height = h;

        // 외부 전역 CSS 규칙 (예: canvas { width: 100vw !important; })으로부터 100% 완전 격리
        canvas.style.setProperty('all', 'initial', 'important');
        canvas.style.setProperty('position', 'fixed', 'important');
        canvas.style.setProperty('left', `${left}px`, 'important');
        canvas.style.setProperty('bottom', `${bottom}px`, 'important');
        canvas.style.setProperty('top', 'auto', 'important');
        canvas.style.setProperty('right', 'auto', 'important');
        canvas.style.setProperty('width', `${w}px`, 'important');
        canvas.style.setProperty('height', `${h}px`, 'important');
        canvas.style.setProperty('min-width', `${w}px`, 'important');
        canvas.style.setProperty('min-height', `${h}px`, 'important');
        canvas.style.setProperty('max-width', `${w}px`, 'important');
        canvas.style.setProperty('max-height', `${h}px`, 'important');
        canvas.style.setProperty('box-sizing', 'border-box', 'important');
        canvas.style.setProperty('margin', '0', 'important');
        canvas.style.setProperty('padding', '0', 'important');
        canvas.style.setProperty('transform', 'none', 'important');
        canvas.style.setProperty('background', 'rgba(15, 23, 42, 0.85)', 'important');
        canvas.style.setProperty('backdrop-filter', 'blur(6px)', 'important');
        canvas.style.setProperty('border', '1px solid rgba(56, 189, 248, 0.35)', 'important');
        canvas.style.setProperty('border-radius', '6px', 'important');
        canvas.style.setProperty('pointer-events', 'none', 'important');
        canvas.style.setProperty('z-index', '99999', 'important');
        canvas.style.setProperty('display', 'block', 'important');

        document.body.appendChild(canvas);
        this.#canvas = canvas;
        this.#ctx = canvas.getContext('2d');
        this.#width = w;
        this.#height = h;
        this.#left = left;
        this.#bottom = bottom;
    }

    get visible(): boolean {
        return this.#visible;
    }

    set visible(val: boolean) {
        this.#visible = val;
        this.#canvas.style.setProperty('display', val ? 'block' : 'none', 'important');
    }

    get width(): number {
        return this.#width;
    }

    set width(w: number) {
        this.setSize(w, this.#height);
    }

    get height(): number {
        return this.#height;
    }

    set height(h: number) {
        this.setSize(this.#width, h);
    }

    get left(): number {
        return this.#left;
    }

    set left(l: number) {
        this.setPosition(l, this.#bottom);
    }

    get bottom(): number {
        return this.#bottom;
    }

    set bottom(b: number) {
        this.setPosition(this.#left, b);
    }

    setSize(w: number, h: number): void {
        this.#width = Math.max(20, w);
        this.#height = Math.max(20, h);
        this.#canvas.width = this.#width;
        this.#canvas.height = this.#height;

        this.#canvas.style.setProperty('width', `${this.#width}px`, 'important');
        this.#canvas.style.setProperty('height', `${this.#height}px`, 'important');
        this.#canvas.style.setProperty('min-width', `${this.#width}px`, 'important');
        this.#canvas.style.setProperty('min-height', `${this.#height}px`, 'important');
        this.#canvas.style.setProperty('max-width', `${this.#width}px`, 'important');
        this.#canvas.style.setProperty('max-height', `${this.#height}px`, 'important');
    }

    setPosition(left: number, bottom: number): void {
        this.#left = left;
        this.#bottom = bottom;
        this.#canvas.style.setProperty('left', `${left}px`, 'important');
        this.#canvas.style.setProperty('bottom', `${bottom}px`, 'important');
    }

    update(): void {
        if (!this.#visible || !this.#ctx || !this.#landscape) return;
        const w = this.#canvas.width;
        const h = this.#canvas.height;
        const padding = 5;
        const mapDrawSize = w - padding * 2;
        this.#ctx.clearRect(0, 0, w, h);

        const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;
        const worldMinX = -worldSizeX / 2;
        const worldMinZ = -worldSizeZ / 2;

        const worldToCanvas = (wx: number, wz: number): [number, number] => {
            const nx = (wx - worldMinX) / worldSizeX;
            const nz = (wz - worldMinZ) / worldSizeZ;
            return [
                padding + Math.max(0, Math.min(1, nx)) * mapDrawSize,
                padding + (1 - Math.max(0, Math.min(1, nz))) * mapDrawSize
            ];
        };

        // 1. World Outer Boundary
        this.#ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.#ctx.lineWidth = 1;
        this.#ctx.strokeRect(padding, padding, mapDrawSize, mapDrawSize);

        // 2. Component Grid Tiles
        const components = this.#landscape.landscapeComponents || [];
        const [tcX, tcZ] = this.#landscape.componentCount;
        const cellW = mapDrawSize / tcX;
        const cellH = mapDrawSize / tcZ;

        const activeCount = components.length;
        for (let i = 0; i < activeCount; i++) {
            const comp = components[i];
            const nx = (comp.worldX - worldMinX) / worldSizeX;
            const nz = (comp.worldZ - worldMinZ) / worldSizeZ;
            const cx = padding + nx * mapDrawSize - cellW / 2;
            const cy = padding + (1 - nz) * mapDrawSize - cellH / 2;

            const isLoaded = this.#landscape.tileStreamer && this.#landscape.tileStreamer.loadedTileCount > 0;
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
        const radiusPixels = (this.#landscape.loadingRadius / worldSizeX) * mapDrawSize;

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
    }

    destroy(): void {
        if (this.#canvas && this.#canvas.parentNode) {
            this.#canvas.parentNode.removeChild(this.#canvas);
        }
    }
}

export default LandscapeSpatialGridDebugger;
