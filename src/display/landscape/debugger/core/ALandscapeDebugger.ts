import Landscape from "../../core/Landscape";
import cameraParamsStructWGSL from "./shader/cameraParamsStruct.wgsl";
import cameraOverlayFunctionWGSL from "./shader/cameraOverlayFunction.wgsl";
import fullscreenQuadVertexWGSL from "./shader/fullscreenQuadVertex.wgsl";

export interface ALandscapeDebuggerOptions {
    width?: number;
    height?: number;
    left?: number;
    bottom?: number;
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
    static readonly CAMERA_PARAMS_WGSL_STRUCT: string = cameraParamsStructWGSL;
    static readonly CAMERA_OVERLAY_WGSL_FUNCTION: string = cameraOverlayFunctionWGSL;
    static readonly FULLSCREEN_QUAD_VERTEX_WGSL: string = fullscreenQuadVertexWGSL;
    #landscape: Landscape;
    #container: HTMLDivElement;
    #canvas: HTMLCanvasElement;
    #visible: boolean = true;
    #camera: any = null;
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

    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions,
        canvasId?: string
    ) {
        this.#landscape = landscape;

        let opts = options;
        let cam = cameraOrOptions;

        if (cameraOrOptions && (cameraOrOptions.width !== undefined || cameraOrOptions.left !== undefined || cameraOrOptions.bottom !== undefined)) {
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

        this.#width = w;
        this.#height = h;
        this.#left = left;
        this.#bottom = bottom;

        ensureDebuggerStyles();

        const container = document.createElement('div');
        container.className = 'redgpu-landscape-debugger-container';
        container.style.setProperty('left', `${left}px`, 'important');
        container.style.setProperty('bottom', `${bottom}px`, 'important');
        container.style.setProperty('width', `${w}px`, 'important');
        container.style.setProperty('height', `${h}px`, 'important');

        // 컨테이너 정중앙 배치를 위한 캔버스 크기 계산
        const canvasCSSWidth = Math.max(10, w - INNER_MARGIN * 2);
        const canvasCSSHeight = Math.max(10, h - INNER_MARGIN * 2);

        const renderWidth = Math.max(10, canvasCSSWidth - CANVAS_BORDER * 2);
        const renderHeight = Math.max(10, canvasCSSHeight - CANVAS_BORDER * 2);

        this.#contentWidth = renderWidth;
        this.#contentHeight = renderHeight;

        const canvas = document.createElement('canvas');
        if (canvasId) {
            canvas.id = canvasId;
        }
        canvas.className = 'redgpu-landscape-debugger-canvas';
        canvas.style.setProperty('width', `${canvasCSSWidth}px`, 'important');
        canvas.style.setProperty('height', `${canvasCSSHeight}px`, 'important');
        canvas.width = Math.round(renderWidth * dpr);
        canvas.height = Math.round(renderHeight * dpr);

        container.appendChild(canvas);
        document.body.appendChild(container);

        this.#container = container;
        this.#canvas = canvas;
    }

    get landscape(): Landscape {
        return this.#landscape;
    }

    get container(): HTMLDivElement {
        return this.#container;
    }

    get canvas(): HTMLCanvasElement {
        return this.#canvas;
    }

    get visible(): boolean {
        return this.#visible;
    }

    set visible(val: boolean) {
        this.#visible = val;
        this.#container.style.setProperty('display', val ? 'block' : 'none', 'important');
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

    static getPreferredCanvasFormat(): GPUTextureFormat {
        return (typeof navigator !== 'undefined' && navigator.gpu?.getPreferredCanvasFormat)
            ? navigator.gpu.getPreferredCanvasFormat()
            : 'bgra8unorm';
    }

    static createCameraUniformBuffer(gpuDevice: GPUDevice, label: string = 'LandscapeDebuggerCameraUniformBuffer'): GPUBuffer {
        return gpuDevice.createBuffer({
            label,
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }

    static writeCameraUniformData(
        dataArray: Float32Array,
        state: LandscapeDebuggerCameraState,
        componentCountX: number,
        componentCountZ: number
    ): void {
        dataArray[0] = state.camNormX;
        dataArray[1] = state.camNormZ;
        dataArray[2] = componentCountX;
        dataArray[3] = componentCountZ;
        dataArray[4] = state.panRad;
        dataArray[5] = state.halfFovRad;
        dataArray[6] = state.loadingRadiusUV;
        dataArray[7] = 0.0;
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

    drawCameraOverlay2D(
        ctx: CanvasRenderingContext2D,
        state: LandscapeDebuggerCameraState,
        canvasWidth: number,
        canvasHeight: number,
        padding: number = 0
    ): void {
        const {camNormX, camNormZ, lookAngle, halfFovRad, dirX, dirY, loadingRadiusUV} = state;
        const mapDrawWidth = canvasWidth - padding * 2;
        const mapDrawHeight = canvasHeight - padding * 2;

        const camCanvasX = padding + camNormX * mapDrawWidth;
        const camCanvasY = padding + camNormZ * mapDrawHeight;
        const radiusPixels = loadingRadiusUV * mapDrawWidth;

        // 1. 로딩 반경 점선 링 (Emerald Green)
        ctx.beginPath();
        ctx.arc(camCanvasX, camCanvasY, radiusPixels, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. FOV 시야 부채꼴 (Amber Gold)
        const startAngle = lookAngle - halfFovRad;
        const endAngle = lookAngle + halfFovRad;
        const wedgeRadius = Math.max(16, Math.min(radiusPixels, 36));

        ctx.beginPath();
        ctx.moveTo(camCanvasX, camCanvasY);
        ctx.arc(camCanvasX, camCanvasY, wedgeRadius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.95)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3. 시선 중심 가이드 레이 (Coral Red)
        const rayLen = wedgeRadius + 10;
        ctx.beginPath();
        ctx.moveTo(camCanvasX, camCanvasY);
        ctx.lineTo(camCanvasX + dirX * rayLen, camCanvasY + dirY * rayLen);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // 4. 카메라 원점 점 (White Dot with Coral Red Ring)
        ctx.beginPath();
        ctx.arc(camCanvasX, camCanvasY, 4.0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();
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
