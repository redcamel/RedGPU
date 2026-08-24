import Landscape from "../../core/Landscape";
import RedGPUContext from "../../../../context/RedGPUContext";
import fullscreenQuadVertexWGSL from "./shader/fullscreenQuadVertex.wgsl";

export interface ALandscapeDebuggerOptions {
    width?: number;
    height?: number;
    left?: number;
    bottom?: number;
    title?: string;
}

export interface LandscapeDebuggerCameraState {
    camX: number;
    camZ: number;
    pan: number;
    fov: number;
    panRad: number;
    halfFovRad: number;
    lookAngle: number;
    dirX: number;
    dirY: number;
    camNormX: number;
    camNormZ: number;
    loadingRadiusUV: number;
    worldSizeX: number;
    worldSizeZ: number;
    worldMinX: number;
    worldMinZ: number;
}

const DEBUGGER_STYLE_ID = 'redgpu-landscape-debugger-style';
const CONTAINER_BORDER = 1;
const INNER_MARGIN = 6;
const CANVAS_BORDER = 1;

function ensureDebuggerStyles(): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById(DEBUGGER_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = DEBUGGER_STYLE_ID;
    style.textContent = `
        .redgpu-landscape-debugger-container {
            position: fixed !important;
            top: auto !important;
            right: auto !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: none !important;
            background: rgba(15, 23, 42, 0.85) !important;
            backdrop-filter: blur(6px) !important;
            border: ${CONTAINER_BORDER}px solid rgba(56, 189, 248, 0.35) !important;
            border-radius: 6px !important;
            pointer-events: none !important;
            z-index: 99999 !important;
            overflow: hidden !important;
            display: block !important;
        }
        .redgpu-landscape-debugger-header {
            position: absolute !important;
            bottom: 3px !important;
            left: 4px !important;
            font-family: monospace, sans-serif !important;
            font-size: 8px !important;
            font-weight: 700 !important;
            letter-spacing: 0.4px !important;
            color: #38bdf8 !important;
            background: rgba(15, 23, 42, 0.88) !important;
            padding: 1px 4px !important;
            border-radius: 3px !important;
            border: 1px solid rgba(56, 189, 248, 0.3) !important;
            pointer-events: none !important;
            z-index: 10 !important;
            line-height: 1.1 !important;
            text-transform: uppercase !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
            white-space: nowrap !important;
            display: block !important;
        }
        .redgpu-landscape-debugger-canvas {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0 !important;
            border: ${CANVAS_BORDER}px solid rgba(255, 255, 255, 0.35) !important;
            border-radius: 3px !important;
            display: block !important;
            z-index: 1 !important;
        }
        .redgpu-landscape-debugger-overlay {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            pointer-events: none !important;
            display: block !important;
            z-index: 2 !important;
        }
        .redgpu-landscape-hud {
            position: fixed !important;
            top: auto !important;
            right: auto !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            z-index: 999999 !important;
            padding: 12px 14px !important;
            background-color: rgba(15, 23, 42, 0.92) !important;
            backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            color: #e2e8f0 !important;
            font-family: monospace, sans-serif !important;
            font-size: 12px !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
            pointer-events: none !important;
            display: block !important;
        }
        .redgpu-landscape-hud-title {
            font-weight: 700 !important;
            font-size: 13px !important;
            letter-spacing: 0.5px !important;
            margin-bottom: 8px !important;
            color: #38bdf8 !important;
            border-bottom: 1px solid rgba(56, 189, 248, 0.25) !important;
            padding-bottom: 6px !important;
        }
    `;
    document.head.appendChild(style);
}

export abstract class ALandscapeDebugger {
    #landscape: Landscape;
    #container: HTMLDivElement;
    static readonly FULLSCREEN_QUAD_VERTEX_WGSL: string = fullscreenQuadVertexWGSL;
    #canvas: HTMLCanvasElement;
    #overlayCanvas: HTMLCanvasElement;
    #headerElement: HTMLDivElement | null = null;
    #visible: boolean = true;
    #camera: any = null;
    #overlayCtx: CanvasRenderingContext2D | null = null;

    #width: number;
    #height: number;
    #contentWidth: number;
    #contentHeight: number;
    #left: number;
    #bottom: number;

    #cameraState: LandscapeDebuggerCameraState = {
        camX: 0,
        camZ: 0,
        pan: 0,
        fov: 60,
        panRad: 0,
        halfFovRad: 0,
        lookAngle: 0,
        dirX: 0,
        dirY: -1,
        camNormX: 0,
        camNormZ: 0,
        loadingRadiusUV: 0,
        worldSizeX: 1000,
        worldSizeZ: 1000,
        worldMinX: -500,
        worldMinZ: -500
    };

    #dpr: number = 1;
    #title: string = '';

    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions,
        canvasId?: string
    ) {
        this.#landscape = landscape;

        let opts = options;
        let cam = cameraOrOptions;

        if (cameraOrOptions && (cameraOrOptions.width !== undefined || cameraOrOptions.left !== undefined || cameraOrOptions.bottom !== undefined || cameraOrOptions.title !== undefined)) {
            opts = cameraOrOptions;
            cam = null;
        }

        this.#camera = cam;

        const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
        this.#dpr = dpr;

        const w = opts?.width ?? 100;
        const h = opts?.height ?? 100;
        const left = opts?.left ?? 12;
        const bottom = opts?.bottom ?? 12;
        const title = opts?.title ?? '';

        this.#width = w;
        this.#height = h;
        this.#left = left;
        this.#bottom = bottom;
        this.#title = title;

        ensureDebuggerStyles();

        const container = document.createElement('div');
        container.className = 'redgpu-landscape-debugger-container';
        container.style.setProperty('left', `${left}px`, 'important');
        container.style.setProperty('bottom', `${bottom}px`, 'important');
        container.style.setProperty('width', `${w}px`, 'important');
        container.style.setProperty('height', `${h}px`, 'important');

        // 0. 미니 헤더 배지 라벨
        if (title) {
            const header = document.createElement('div');
            header.className = 'redgpu-landscape-debugger-header';
            header.textContent = title;
            container.appendChild(header);
            this.#headerElement = header;
        }

        const canvasCSSWidth = Math.max(10, w - INNER_MARGIN * 2);
        const canvasCSSHeight = Math.max(10, h - INNER_MARGIN * 2);

        const renderWidth = Math.max(10, canvasCSSWidth - CANVAS_BORDER * 2);
        const renderHeight = Math.max(10, canvasCSSHeight - CANVAS_BORDER * 2);

        this.#contentWidth = renderWidth;
        this.#contentHeight = renderHeight;

        // 1. 베이스 캔버스 (2D 그리드 또는 WebGPU 텍스처 전용)
        const canvas = document.createElement('canvas');
        if (canvasId) {
            canvas.id = canvasId;
        }
        canvas.className = 'redgpu-landscape-debugger-canvas';
        canvas.style.setProperty('width', `${canvasCSSWidth}px`, 'important');
        canvas.style.setProperty('height', `${canvasCSSHeight}px`, 'important');
        canvas.width = Math.round(renderWidth * dpr);
        canvas.height = Math.round(renderHeight * dpr);

        // 2. 공통 오버레이 캔버스 (카메라 시야각/FOV/로딩 링 전용)
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.className = 'redgpu-landscape-debugger-overlay';
        overlayCanvas.style.setProperty('width', `${renderWidth}px`, 'important');
        overlayCanvas.style.setProperty('height', `${renderHeight}px`, 'important');
        overlayCanvas.width = Math.round(renderWidth * dpr);
        overlayCanvas.height = Math.round(renderHeight * dpr);
        this.#overlayCtx = overlayCanvas.getContext('2d');

        container.appendChild(canvas);
        container.appendChild(overlayCanvas);
        document.body.appendChild(container);

        this.#container = container;
        this.#canvas = canvas;
        this.#overlayCanvas = overlayCanvas;
    }

    get title(): string {
        return this.#title;
    }

    set title(val: string) {
        this.#title = val;
        if (!this.#headerElement && val) {
            const header = document.createElement('div');
            header.className = 'redgpu-landscape-debugger-header';
            header.textContent = val;
            this.#container.appendChild(header);
            this.#headerElement = header;
        } else if (this.#headerElement) {
            this.#headerElement.textContent = val;
            this.#headerElement.style.setProperty('display', val ? 'block' : 'none', 'important');
        }
    }

    get redGPUContext(): RedGPUContext {
        return this.#landscape.redGPUContext;
    }

    get landscape(): Landscape {
        return this.#landscape;
    }

    get overlayCanvas(): HTMLCanvasElement {
        return this.#overlayCanvas;
    }

    get container(): HTMLDivElement {
        return this.#container;
    }

    get canvas(): HTMLCanvasElement {
        return this.#canvas;
    }

    static getPreferredCanvasFormat(): GPUTextureFormat {
        return (typeof navigator !== 'undefined' && navigator.gpu?.getPreferredCanvasFormat)
            ? navigator.gpu.getPreferredCanvasFormat()
            : 'bgra8unorm';
    }

    get visible(): boolean {
        return this.#visible;
    }

    set visible(val: boolean) {
        this.#visible = val;
        this.#container.style.setProperty('display', val ? 'block' : 'none', 'important');
    }

    show(): void {
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
    }

    toggle(): boolean {
        this.visible = !this.visible;
        return this.visible;
    }

    get camera(): any {
        return this.#camera;
    }

    set camera(cam: any) {
        this.#camera = cam;
    }

    get dpr(): number {
        return this.#dpr;
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

    get contentWidth(): number {
        return this.#contentWidth;
    }

    get contentHeight(): number {
        return this.#contentHeight;
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

    setCamera(cam: any): void {
        this.#camera = cam;
    }

    getCameraState(): LandscapeDebuggerCameraState | null {
        if (!this.#landscape) return null;

        const camera = this.#camera || (this.#landscape as any)?.camera || (this.#landscape as any)?.controller;
        const camX = camera ? (camera.x ?? camera.position?.[0] ?? 0) : 0;
        const camZ = camera ? (camera.z ?? camera.position?.[2] ?? 0) : 0;
        const rawPan = camera ? (camera.pan ?? 0) : 0;
        const fov = camera ? (camera.fov ?? 60) : 60;

        const panRad = (rawPan * Math.PI) / 180.0;
        const halfFovRad = ((fov * 0.5) * Math.PI) / 180.0;
        const dirX = -Math.sin(panRad);
        const dirY = -Math.cos(panRad);
        const lookAngle = Math.atan2(dirY, dirX);

        const [wsX, wsZ] = this.#landscape.worldSize;
        const halfWsX = wsX * 0.5;
        const halfWsZ = wsZ * 0.5;
        const minX = -halfWsX;
        const minZ = -halfWsZ;

        const camNormX = (camX - minX) / wsX;
        const camNormZ = (camZ - minZ) / wsZ;

        const loadingRadius = this.#landscape.loadingRadius || 2500;
        const loadingRadiusUV = loadingRadius / wsX;

        this.#cameraState.camX = camX;
        this.#cameraState.camZ = camZ;
        this.#cameraState.pan = rawPan;
        this.#cameraState.fov = fov;
        this.#cameraState.panRad = panRad;
        this.#cameraState.halfFovRad = halfFovRad;
        this.#cameraState.lookAngle = lookAngle;
        this.#cameraState.dirX = dirX;
        this.#cameraState.dirY = dirY;
        this.#cameraState.camNormX = camNormX;
        this.#cameraState.camNormZ = camNormZ;
        this.#cameraState.loadingRadiusUV = loadingRadiusUV;
        this.#cameraState.worldSizeX = wsX;
        this.#cameraState.worldSizeZ = wsZ;
        this.#cameraState.worldMinX = minX;
        this.#cameraState.worldMinZ = minZ;

        return this.#cameraState;
    }

    renderOverlay(): void {
        if (!this.#overlayCtx) return;
        const state = this.getCameraState();
        if (!state) return;

        const dpr = this.#dpr || 1;
        const w = this.#contentWidth;
        const h = this.#contentHeight;

        this.#overlayCtx.clearRect(0, 0, this.#overlayCanvas.width, this.#overlayCanvas.height);
        this.#overlayCtx.save();
        this.#overlayCtx.scale(dpr, dpr);

        const {camNormX, camNormZ, lookAngle, halfFovRad, dirX, dirY, loadingRadiusUV} = state;
        const camCanvasX = camNormX * w;
        const camCanvasY = camNormZ * h;
        const radiusPixels = loadingRadiusUV * w;

        // 0. 타일 컴포넌트 그리드 격자선 (선명한 1px 그리드)
        const [tcX, tcZ] = this.#landscape.componentCount;
        if (tcX > 0 && tcZ > 0) {
            const cellW = w / tcX;
            const cellH = h / tcZ;
            this.#overlayCtx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
            this.#overlayCtx.lineWidth = 1.0;
            this.#overlayCtx.beginPath();
            for (let x = 1; x < tcX; x++) {
                const lx = Math.round(x * cellW) + 0.5;
                this.#overlayCtx.moveTo(lx, 0);
                this.#overlayCtx.lineTo(lx, h);
            }
            for (let z = 1; z < tcZ; z++) {
                const lz = Math.round(z * cellH) + 0.5;
                this.#overlayCtx.moveTo(0, lz);
                this.#overlayCtx.lineTo(w, lz);
            }
            this.#overlayCtx.stroke();
        }

        // 1. 로딩 반경 점선 링 (Emerald Green)
        this.#overlayCtx.beginPath();
        this.#overlayCtx.arc(camCanvasX, camCanvasY, radiusPixels, 0, Math.PI * 2);
        this.#overlayCtx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
        this.#overlayCtx.lineWidth = 1.5;
        this.#overlayCtx.setLineDash([3, 3]);
        this.#overlayCtx.stroke();
        this.#overlayCtx.setLineDash([]);

        // 2. FOV 시야 부채꼴 (Amber Gold)
        const startAngle = lookAngle - halfFovRad;
        const endAngle = lookAngle + halfFovRad;
        const wedgeRadius = Math.max(16, Math.min(radiusPixels, 36));

        this.#overlayCtx.beginPath();
        this.#overlayCtx.moveTo(camCanvasX, camCanvasY);
        this.#overlayCtx.arc(camCanvasX, camCanvasY, wedgeRadius, startAngle, endAngle);
        this.#overlayCtx.closePath();
        this.#overlayCtx.fillStyle = 'rgba(251, 191, 36, 0.45)';
        this.#overlayCtx.fill();
        this.#overlayCtx.strokeStyle = 'rgba(251, 191, 36, 0.95)';
        this.#overlayCtx.lineWidth = 1.5;
        this.#overlayCtx.stroke();

        // 3. 시선 중심 가이드 레이 (Coral Red)
        const rayLen = wedgeRadius + 10;
        this.#overlayCtx.beginPath();
        this.#overlayCtx.moveTo(camCanvasX, camCanvasY);
        this.#overlayCtx.lineTo(camCanvasX + dirX * rayLen, camCanvasY + dirY * rayLen);
        this.#overlayCtx.strokeStyle = '#ef4444';
        this.#overlayCtx.lineWidth = 2.0;
        this.#overlayCtx.stroke();

        // 4. 카메라 원점 점 (White Dot with Coral Red Ring)
        this.#overlayCtx.beginPath();
        this.#overlayCtx.arc(camCanvasX, camCanvasY, 4.0, 0, Math.PI * 2);
        this.#overlayCtx.fillStyle = '#ffffff';
        this.#overlayCtx.fill();
        this.#overlayCtx.strokeStyle = '#ef4444';
        this.#overlayCtx.lineWidth = 1.5;
        this.#overlayCtx.stroke();

        this.#overlayCtx.restore();
    }

    setSize(w: number, h: number): void {
        const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
        this.#dpr = dpr;
        this.#width = Math.max(20, w);
        this.#height = Math.max(20, h);

        const canvasCSSWidth = Math.max(10, this.#width - INNER_MARGIN * 2);
        const canvasCSSHeight = Math.max(10, this.#height - INNER_MARGIN * 2);

        const renderWidth = Math.max(10, canvasCSSWidth - CANVAS_BORDER * 2);
        const renderHeight = Math.max(10, canvasCSSHeight - CANVAS_BORDER * 2);

        this.#contentWidth = renderWidth;
        this.#contentHeight = renderHeight;

        this.#container.style.setProperty('width', `${this.#width}px`, 'important');
        this.#container.style.setProperty('height', `${this.#height}px`, 'important');

        this.#canvas.style.setProperty('width', `${canvasCSSWidth}px`, 'important');
        this.#canvas.style.setProperty('height', `${canvasCSSHeight}px`, 'important');

        this.#canvas.width = Math.round(renderWidth * dpr);
        this.#canvas.height = Math.round(renderHeight * dpr);

        this.#overlayCanvas.style.setProperty('width', `${renderWidth}px`, 'important');
        this.#overlayCanvas.style.setProperty('height', `${renderHeight}px`, 'important');
        this.#overlayCanvas.width = Math.round(renderWidth * dpr);
        this.#overlayCanvas.height = Math.round(renderHeight * dpr);
    }

    setPosition(left: number, bottom: number): void {
        this.#left = left;
        this.#bottom = bottom;
        this.#container.style.setProperty('left', `${left}px`, 'important');
        this.#container.style.setProperty('bottom', `${bottom}px`, 'important');
    }

    destroy(): void {
        if (this.#container && this.#container.parentNode) {
            this.#container.parentNode.removeChild(this.#container);
        }
    }

    abstract update(): void;
}

export default ALandscapeDebugger;
