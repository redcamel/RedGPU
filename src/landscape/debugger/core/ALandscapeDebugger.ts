import Landscape from "../../Landscape";
import RedGPUContext from "../../../context/RedGPUContext";

/**
 * [KO] ALandscapeDebugger 초기화 설정 옵션입니다.
 * [EN] Configuration options for ALandscapeDebugger initialization.
 */
export interface ALandscapeDebuggerOptions {
    /**
     * [KO] 컨테이너 가로 크기(px, 기본값: 100)
     * [EN] Container width in px (default: 100)
     */
    width?: number;
    /**
     * [KO] 컨테이너 세로 크기(px, 기본값: 100)
     * [EN] Container height in px (default: 100)
     */
    height?: number;
    /**
     * [KO] 화면 좌측 여백(px, 기본값: 12)
     * [EN] Screen left offset in px (default: 12)
     */
    left?: number;
    /**
     * [KO] 화면 하단 여백(px, 기본값: 12)
     * [EN] Screen bottom offset in px (default: 12)
     */
    bottom?: number;
    /**
     * [KO] 디버거 상단 제목 라벨
     * [EN] Debugger header title text
     */
    title?: string;
}

/**
 * [KO] 디버거 2D 오버레이 렌더링에 사용되는 카메라 위치 및 시야각 투영 상태 정보입니다.
 * [EN] Camera position, orientation, and FOV projection state for 2D debugger overlay rendering.
 */
export interface LandscapeDebuggerCameraState {
    /**
     * [KO] 카메라 월드 X 좌표
     * [EN] Camera world X position
     */
    camX: number;
    /**
     * [KO] 카메라 월드 Z 좌표
     * [EN] Camera world Z position
     */
    camZ: number;
    /**
     * [KO] 카메라 수평 회전각(Pan, deg)
     * [EN] Camera pan angle in degrees
     */
    pan: number;
    /**
     * [KO] 카메라 수직 시야각(FOV, deg)
     * [EN] Camera field of view in degrees
     */
    fov: number;
    /**
     * [KO] 수평 회전각 라디안
     * [EN] Camera pan angle in radians
     */
    panRad: number;
    /**
     * [KO] 절반 시야각 라디안
     * [EN] Half FOV in radians
     */
    halfFovRad: number;
    /**
     * [KO] 시선 방향 2D 각도
     * [EN] 2D look angle
     */
    lookAngle: number;
    /**
     * [KO] 시선 2D 정규화 방향 벡터 X
     * [EN] Normalized look direction X
     */
    dirX: number;
    /**
     * [KO] 시선 2D 정규화 방향 벡터 Y (Z축 방향)
     * [EN] Normalized look direction Y (along Z axis)
     */
    dirY: number;
    /**
     * [KO] 지형 월드 바운딩 대비 정규화된 카메라 X (0~1)
     * [EN] Normalized camera X across terrain bounds (0~1)
     */
    camNormX: number;
    /**
     * [KO] 지형 월드 바운딩 대비 정규화된 카메라 Z (0~1)
     * [EN] Normalized camera Z across terrain bounds (0~1)
     */
    camNormZ: number;
    /**
     * [KO] UV 공간 상의 타일 스트리밍 반경 크기
     * [EN] Tile loading radius mapped to UV space
     */
    tileLoadingRadiusUV: number;
    /**
     * [KO] 전체 지형 월드 X 크기
     * [EN] Terrain full world X size
     */
    worldSizeX: number;
    /**
     * [KO] 전체 지형 월드 Z 크기
     * [EN] Terrain full world Z size
     */
    worldSizeZ: number;
    /**
     * [KO] 지형 월드 최소 X 바운딩
     * [EN] Terrain minimum world X bound
     */
    worldMinX: number;
    /**
     * [KO] 지형 월드 최소 Z 바운딩
     * [EN] Terrain minimum world Z bound
     */
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
    `;
    document.head.appendChild(style);
}

/**
 * [KO] 온스크린 2D 디버거 UI 컨테이너(DOM 및 캔버스)와 카메라 시야각/스트리밍 반경 오버레이 렌더링을 제공하는 기반 추상 디버거 클래스입니다.
 * [EN] Base abstract debugger providing on-screen 2D UI container (DOM & canvas) and camera frustum/streaming radius overlay rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 내부적으로 관리되는 추상 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class managed internally by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export abstract class ALandscapeDebugger {
    #landscape: Landscape;
    #container: HTMLDivElement;
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
        tileLoadingRadiusUV: 0,
        worldSizeX: 1000,
        worldSizeZ: 1000,
        worldMinX: -500,
        worldMinZ: -500
    };

    #dpr: number = 1;
    #title: string = '';

    /**
     * [KO] ALandscapeDebugger 생성자입니다.
     * [EN] Constructor for ALandscapeDebugger.
     *
     * @param landscape - [KO] 대상 Landscape 인스턴스 / [EN] Target Landscape instance
     * @param cameraOrOptions - [KO] 카메라 인스턴스 또는 옵션 객체 / [EN] Camera instance or options object
     * @param options - [KO] 디버거 옵션 / [EN] Debugger options
     * @param canvasId - [KO] 캔버스 DOM ID (선택 사항) / [EN] Optional canvas DOM ID
     */
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

        const canvas = document.createElement('canvas');
        if (canvasId) {
            canvas.id = canvasId;
        }
        canvas.className = 'redgpu-landscape-debugger-canvas';
        canvas.style.setProperty('width', `${canvasCSSWidth}px`, 'important');
        canvas.style.setProperty('height', `${canvasCSSHeight}px`, 'important');
        canvas.width = Math.round(renderWidth * dpr);
        canvas.height = Math.round(renderHeight * dpr);

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

    /**
     * [KO] 디버거 상단에 표시되는 제목 텍스트를 반환합니다.
     * [EN] Returns the title text displayed at the top of the debugger.
     */
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

    /**
     * [KO] RedGPUContext 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContext instance.
     */
    get redGPUContext(): RedGPUContext {
        return this.#landscape.redGPUContext;
    }

    /**
     * [KO] 대상 Landscape 인스턴스를 반환합니다.
     * [EN] Returns the target Landscape instance.
     */
    get landscape(): Landscape {
        return this.#landscape;
    }

    /**
     * [KO] 2D 오버레이 캔버스 요소를 반환합니다.
     * [EN] Returns the 2D overlay canvas element.
     */
    get overlayCanvas(): HTMLCanvasElement {
        return this.#overlayCanvas;
    }

    /**
     * [KO] 디버거 최상위 컨테이너 DIV 요소를 반환합니다.
     * [EN] Returns the root container DIV element of the debugger.
     */
    get container(): HTMLDivElement {
        return this.#container;
    }

    /**
     * [KO] 메인 디버거 캔버스 요소를 반환합니다.
     * [EN] Returns the main debugger canvas element.
     */
    get canvas(): HTMLCanvasElement {
        return this.#canvas;
    }

    /**
     * [KO] 디버거의 화면 표시 여부를 설정하거나 가져옵니다.
     * [EN] Gets or sets the display visibility of the debugger.
     */
    get visible(): boolean {
        return this.#visible;
    }

    /**
     * [KO] 관찰 대상 카메라 인스턴스를 반환합니다.
     * [EN] Returns the tracked camera instance.
     */
    get camera(): any {
        return this.#camera;
    }

    set visible(val: boolean) {
        this.#visible = val;
        this.#container.style.setProperty('display', val ? 'block' : 'none', 'important');
    }

    /**
     * [KO] 디바이스 픽셀 비율(DPR)을 반환합니다.
     * [EN] Returns the device pixel ratio (DPR).
     */
    get dpr(): number {
        return this.#dpr;
    }

    /**
     * [KO] 컨테이너 가로 크기(px)를 설정하거나 가져옵니다.
     * [EN] Gets or sets the container width in px.
     */
    get width(): number {
        return this.#width;
    }

    /**
     * [KO] 컨테이너 세로 크기(px)를 설정하거나 가져옵니다.
     * [EN] Gets or sets the container height in px.
     */
    get height(): number {
        return this.#height;
    }

    /**
     * [KO] 내부 렌더링 콘텐츠 가로 크기(px)를 반환합니다.
     * [EN] Returns the inner render content width in px.
     */
    get contentWidth(): number {
        return this.#contentWidth;
    }

    set camera(cam: any) {
        this.#camera = cam;
    }

    /**
     * [KO] 내부 렌더링 콘텐츠 세로 크기(px)를 반환합니다.
     * [EN] Returns the inner render content height in px.
     */
    get contentHeight(): number {
        return this.#contentHeight;
    }

    /**
     * [KO] 화면 좌측 오프셋(px)을 설정하거나 가져옵니다.
     * [EN] Gets or sets the screen left offset in px.
     */
    get left(): number {
        return this.#left;
    }

    set width(w: number) {
        this.setSize(w, this.#height);
    }

    /**
     * [KO] 화면 하단 오프셋(px)을 설정하거나 가져옵니다.
     * [EN] Gets or sets the screen bottom offset in px.
     */
    get bottom(): number {
        return this.#bottom;
    }

    set height(h: number) {
        this.setSize(this.#width, h);
    }

    /**
     * [KO] 시스템 선호 캔버스 텍스처 포맷을 반환합니다.
     * [EN] Returns the preferred canvas texture format.
     */
    static getPreferredCanvasFormat(): GPUTextureFormat {
        return (typeof navigator !== 'undefined' && navigator.gpu?.getPreferredCanvasFormat)
            ? navigator.gpu.getPreferredCanvasFormat()
            : 'bgra8unorm';
    }

    /**
     * [KO] 디버거를 화면에 표시합니다.
     * [EN] Shows the debugger on screen.
     */
    show(): void {
        this.visible = true;
    }

    /**
     * [KO] 디버거를 화면에서 숨깁니다.
     * [EN] Hides the debugger from screen.
     */
    hide(): void {
        this.visible = false;
    }

    set left(l: number) {
        this.setPosition(l, this.#bottom);
    }

    /**
     * [KO] 디버거의 가시성 상태를 반전(토글)합니다.
     * [EN] Toggles the visibility state of the debugger.
     *
     * @returns [KO] 변경된 후의 가시성 상태 / [EN] Visibility state after toggle
     */
    toggle(): boolean {
        this.visible = !this.visible;
        return this.visible;
    }

    set bottom(b: number) {
        this.setPosition(this.#left, b);
    }

    /**
     * [KO] 추적할 카메라 인스턴스를 지정합니다.
     * [EN] Assigns the camera instance to track.
     *
     * @param cam - [KO] 카메라 인스턴스 / [EN] Camera instance
     */
    setCamera(cam: any): void {
        this.#camera = cam;
    }

    /**
     * [KO] 현재 카메라의 위치, 방향, FOV 및 지형 공간 매핑 데이터를 계산하여 반환합니다.
     * [EN] Computes and returns the camera position, orientation, FOV, and terrain space mappings.
     */
    getCameraState(): LandscapeDebuggerCameraState | null {
        if (!this.#landscape) return null;

        const camera = this.#camera;
        const camX = camera ? (camera.x ?? camera.position?.[0] ?? 0) : 0;
        const camZ = camera ? (camera.z ?? camera.position?.[2] ?? 0) : 0;
        const rawPan = camera ? (camera.pan ?? 0) : 0;
        const fov = camera ? (camera.fieldOfView ?? 60) : 60;

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

        const tileLoadingRadius = this.#landscape.tileLoadingRadius || 2500;
        const tileLoadingRadiusUV = tileLoadingRadius / wsX;

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
        this.#cameraState.tileLoadingRadiusUV = tileLoadingRadiusUV;
        this.#cameraState.worldSizeX = wsX;
        this.#cameraState.worldSizeZ = wsZ;
        this.#cameraState.worldMinX = minX;
        this.#cameraState.worldMinZ = minZ;

        return this.#cameraState;
    }

    /**
     * [KO] 오버레이 캔버스에 지형 그리드 선, 카메라 위치 및 시야각 원추(FOV wedge), 스트리밍 반경 원을 2D로 그립니다.
     * [EN] Renders terrain grid lines, camera position, FOV view frustum wedge, and streaming radius circle on the 2D overlay canvas.
     */
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

        const {camNormX, camNormZ, lookAngle, halfFovRad, dirX, dirY, tileLoadingRadiusUV} = state;
        const camCanvasX = camNormX * w;
        const camCanvasY = camNormZ * h;
        const radiusPixels = tileLoadingRadiusUV * w;

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

        this.#overlayCtx.beginPath();
        this.#overlayCtx.arc(camCanvasX, camCanvasY, radiusPixels, 0, Math.PI * 2);
        this.#overlayCtx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
        this.#overlayCtx.lineWidth = 1.5;
        this.#overlayCtx.setLineDash([3, 3]);
        this.#overlayCtx.stroke();
        this.#overlayCtx.setLineDash([]);

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

        const rayLen = wedgeRadius + 10;
        this.#overlayCtx.beginPath();
        this.#overlayCtx.moveTo(camCanvasX, camCanvasY);
        this.#overlayCtx.lineTo(camCanvasX + dirX * rayLen, camCanvasY + dirY * rayLen);
        this.#overlayCtx.strokeStyle = '#ef4444';
        this.#overlayCtx.lineWidth = 2.0;
        this.#overlayCtx.stroke();

        this.#overlayCtx.beginPath();
        this.#overlayCtx.arc(camCanvasX, camCanvasY, 4.0, 0, Math.PI * 2);
        this.#overlayCtx.fillStyle = '#ffffff';
        this.#overlayCtx.fill();
        this.#overlayCtx.strokeStyle = '#ef4444';
        this.#overlayCtx.lineWidth = 1.5;
        this.#overlayCtx.stroke();

        this.#overlayCtx.restore();
    }

    /**
     * [KO] 디버거 뷰어의 전체 크기(width, height)를 재조정합니다.
     * [EN] Resizes the debugger viewer container and its inner canvases.
     *
     * @param w - [KO] 새로운 가로 크기(px) / [EN] New width in px
     * @param h - [KO] 새로운 세로 크기(px) / [EN] New height in px
     */
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

    /**
     * [KO] 디버거 뷰어의 화면 배치 위치(left, bottom)를 설정합니다.
     * [EN] Sets the screen position (left, bottom) of the debugger viewer.
     *
     * @param left - [KO] 화면 좌측 오프셋(px) / [EN] Left offset in px
     * @param bottom - [KO] 화면 하단 오프셋(px) / [EN] Bottom offset in px
     */
    setPosition(left: number, bottom: number): void {
        this.#left = left;
        this.#bottom = bottom;
        this.#container.style.setProperty('left', `${left}px`, 'important');
        this.#container.style.setProperty('bottom', `${bottom}px`, 'important');
    }

    /**
     * [KO] 디버거 DOM 요소를 제거하고 리소스를 해제합니다.
     * [EN] Removes the debugger DOM element and releases resources.
     */
    destroy(): void {
        if (this.#container && this.#container.parentNode) {
            this.#container.parentNode.removeChild(this.#container);
        }
    }

    /**
     * [KO] 매 프레임 디버거 뷰어 콘텐츠를 갱신하는 추상 메서드입니다. 하위 클래스에서 구현됩니다.
     * [EN] Abstract update method called each frame to refresh debugger contents. Implemented by subclasses.
     */
    abstract update(): void;
}

Object.freeze(ALandscapeDebugger);
export default ALandscapeDebugger;
