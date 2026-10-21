import Landscape from "../../Landscape";
import RedGPUContext from "../../../context/RedGPUContext";

/**
 * [KO] 지형 디버거의 UI 크기, 위치 및 제목 설정 옵션 인터페이스입니다.
 * [EN] Configuration options interface for the UI size, position, and title of a landscape debugger.
 *
 * @category Debugger
 */
export interface ALandscapeDebuggerOptions {
    /**
     * [KO] 디버거 컨테이너의 가로 너비 (픽셀, 기본값: `100`)
     * [EN] Horizontal width of the debugger container in pixels (default: `100`)
     */
    width?: number;
    /**
     * [KO] 디버거 컨테이너의 세로 높이 (픽셀, 기본값: `100`)
     * [EN] Vertical height of the debugger container in pixels (default: `100`)
     */
    height?: number;
    /**
     * [KO] 화면 좌측 기준 오프셋 위치 (픽셀, 기본값: `12`)
     * [EN] Offset position from the left edge of the screen in pixels (default: `12`)
     */
    left?: number;
    /**
     * [KO] 화면 하단 기준 오프셋 위치 (픽셀, 기본값: `12`)
     * [EN] Offset position from the bottom edge of the screen in pixels (default: `12`)
     */
    bottom?: number;
    /**
     * [KO] 디버거 하단 헤더에 표시할 제목 문자열
     * [EN] Title string displayed on the bottom header of the debugger
     */
    title?: string;
}

/**
 * [KO] 지형 디버거 오버레이 렌더링을 위해 계산된 카메라 및 월드 상태 정보 인터페이스입니다.
 * [EN] Interface representing calculated camera and world state information for rendering the landscape debugger overlay.
 *
 * @category Debugger
 */
export interface LandscapeDebuggerCameraState {
    /**
     * [KO] 카메라의 월드 X 좌표
     * [EN] World X coordinate of the camera
     */
    camX: number;
    /**
     * [KO] 카메라의 월드 Z 좌표
     * [EN] World Z coordinate of the camera
     */
    camZ: number;
    /**
     * [KO] 카메라의 수평 회전각 (Pan, 도 단위)
     * [EN] Horizontal rotation angle (Pan) of the camera in degrees
     */
    pan: number;
    /**
     * [KO] 카메라의 시야각 (FOV, 도 단위)
     * [EN] Field of view (FOV) of the camera in degrees
     */
    fov: number;
    /**
     * [KO] 라디안 단위의 카메라 수평 회전각
     * [EN] Horizontal rotation angle (Pan) of the camera in radians
     */
    panRad: number;
    /**
     * [KO] 라디안 단위의 절반 시야각 (`fov * 0.5`)
     * [EN] Half field of view (`fov * 0.5`) in radians
     */
    halfFovRad: number;
    /**
     * [KO] 2D 평면상의 카메라 시선 각도 (라디안)
     * [EN] Camera look angle on the 2D plane in radians
     */
    lookAngle: number;
    /**
     * [KO] 카메라 시선 방향의 2D X 성분
     * [EN] 2D X component of the camera look direction
     */
    dirX: number;
    /**
     * [KO] 카메라 시선 방향의 2D Y(월드 Z) 성분
     * [EN] 2D Y (world Z) component of the camera look direction
     */
    dirY: number;
    /**
     * [KO] 지형 범위 내 정규화된 카메라 X 좌표 (`0.0 ~ 1.0`)
     * [EN] Normalized camera X coordinate within the landscape bounds (`0.0 to 1.0`)
     */
    camNormX: number;
    /**
     * [KO] 지형 범위 내 정규화된 카메라 Z 좌표 (`0.0 ~ 1.0`)
     * [EN] Normalized camera Z coordinate within the landscape bounds (`0.0 to 1.0`)
     */
    camNormZ: number;
    /**
     * [KO] 정규화된 UV 공간 기준의 타일 로딩 반경 비율
     * [EN] Tile loading radius ratio in normalized UV space
     */
    tileLoadingRadiusUV: number;
    /**
     * [KO] 지형의 전체 월드 가로 크기
     * [EN] Total world width (X) of the landscape
     */
    worldSizeX: number;
    /**
     * [KO] 지형의 전체 월드 세로(깊이) 크기
     * [EN] Total world depth (Z) of the landscape
     */
    worldSizeZ: number;
    /**
     * [KO] 지형의 월드 최소 X 좌표
     * [EN] Minimum world X coordinate of the landscape
     */
    worldMinX: number;
    /**
     * [KO] 지형의 월드 최소 Z 좌표
     * [EN] Minimum world Z coordinate of the landscape
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
 * [KO] 지형(`Landscape`) 디버거 UI 컨테이너와 카메라 시야 오버레이 렌더링 기능을 제공하는 추상 기반 클래스입니다.
 * [EN] Abstract base class providing UI container management and camera frustum/radius overlay rendering for `Landscape` debuggers.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Debugger
 */
abstract class ALandscapeDebugger {
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
     * [KO] `ALandscapeDebugger`의 기반 DOM 요소 및 캔버스를 초기화합니다.
     * [EN] Initializes the base DOM elements and canvases of `ALandscapeDebugger`.
     *
     * @param landscape -
     * [KO] 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance
     * @param cameraOrOptions -
     * [KO] 추적할 카메라 인스턴스 또는 디버거 설정 옵션
     * [EN] Camera instance to track or debugger configuration options
     * @param options -
     * [KO] 디버거 UI 배치 및 크기 옵션 (`ALandscapeDebuggerOptions`)
     * [EN] Debugger UI placement and size options (`ALandscapeDebuggerOptions`)
     * @param canvasId -
     * [KO] 메인 디버거 캔버스 요소에 부여할 HTML `id` 속성값
     * [EN] HTML `id` attribute value to assign to the main debugger canvas element
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

        const {
            width = 100,
            height = 100,
            left = 12,
            bottom = 12,
            title = ''
        } = opts || {};

        this.#width = width;
        this.#height = height;
        this.#left = left;
        this.#bottom = bottom;
        this.#title = title;

        ensureDebuggerStyles();

        const container = document.createElement('div');
        container.className = 'redgpu-landscape-debugger-container';
        container.style.setProperty('left', `${left}px`, 'important');
        container.style.setProperty('bottom', `${bottom}px`, 'important');
        container.style.setProperty('width', `${width}px`, 'important');
        container.style.setProperty('height', `${height}px`, 'important');

        if (title) {
            const header = document.createElement('div');
            header.className = 'redgpu-landscape-debugger-header';
            header.textContent = title;
            container.appendChild(header);
            this.#headerElement = header;
        }

        const canvasCSSWidth = Math.max(10, width - INNER_MARGIN * 2);
        const canvasCSSHeight = Math.max(10, height - INNER_MARGIN * 2);

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
     * [KO] 디버거 하단 헤더에 표시되는 제목 문자열을 반환하거나 설정합니다.
     * [EN] Gets or sets the title string displayed on the bottom header of the debugger.
     *
     * @returns
     * [KO] 디버거 제목 문자열
     * [EN] Debugger title string
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
     * [KO] 지형이 속한 `RedGPUContext` 인스턴스를 반환합니다.
     * [EN] Returns the `RedGPUContext` instance to which the landscape belongs.
     *
     * @returns
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    get redGPUContext(): RedGPUContext {
        return this.#landscape.redGPUContext;
    }

    /**
     * [KO] 디버깅 대상 `Landscape` 인스턴스를 반환합니다.
     * [EN] Returns the target `Landscape` instance being debugged.
     *
     * @returns
     * [KO] `Landscape` 인스턴스
     * [EN] `Landscape` instance
     */
    get landscape(): Landscape {
        return this.#landscape;
    }

    /**
     * [KO] 디버거 UI의 최상위 `HTMLDivElement` 컨테이너를 반환합니다.
     * [EN] Returns the root `HTMLDivElement` container of the debugger UI.
     *
     * @returns
     * [KO] 컨테이너 DOM 요소 (`HTMLDivElement`)
     * [EN] Container DOM element (`HTMLDivElement`)
     */
    get container(): HTMLDivElement {
        return this.#container;
    }

    /**
     * [KO] 디버거 콘텐츠가 그려지는 메인 `HTMLCanvasElement`를 반환합니다.
     * [EN] Returns the main `HTMLCanvasElement` where debugger content is drawn.
     *
     * @returns
     * [KO] 메인 캔버스 DOM 요소 (`HTMLCanvasElement`)
     * [EN] Main canvas DOM element (`HTMLCanvasElement`)
     */
    get canvas(): HTMLCanvasElement {
        return this.#canvas;
    }

    /**
     * [KO] 디버거 UI의 화면 표시 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the debugger UI is visible on screen.
     *
     * @returns
     * [KO] 가시성 여부
     * [EN] Visibility state
     */
    get visible(): boolean {
        return this.#visible;
    }

    /**
     * [KO] 카메라 위치 및 시야각 오버레이 표시에 사용되는 카메라 인스턴스를 반환하거나 설정합니다.
     * [EN] Gets or sets the camera instance used for rendering the camera position and FOV overlay.
     *
     * @returns
     * [KO] 카메라 인스턴스
     * [EN] Camera instance
     */
    get camera(): any {
        return this.#camera;
    }

    set visible(val: boolean) {
        this.#visible = val;
        this.#container.style.setProperty('display', val ? 'block' : 'none', 'important');
    }

    /**
     * [KO] 캔버스 해상도 스케일링에 적용된 디바이스 픽셀 비율(DPR)을 반환합니다.
     * [EN] Returns the device pixel ratio (DPR) applied to canvas resolution scaling.
     *
     * @returns
     * [KO] 디바이스 픽셀 비율
     * [EN] Device pixel ratio
     */
    get dpr(): number {
        return this.#dpr;
    }

    /**
     * [KO] 디버거 컨테이너의 가로 너비(픽셀)를 반환하거나 설정합니다.
     * [EN] Gets or sets the horizontal width of the debugger container in pixels.
     *
     * @returns
     * [KO] 가로 너비 (픽셀)
     * [EN] Width in pixels
     */
    get width(): number {
        return this.#width;
    }

    /**
     * [KO] 디버거 컨테이너의 세로 높이(픽셀)를 반환하거나 설정합니다.
     * [EN] Gets or sets the vertical height of the debugger container in pixels.
     *
     * @returns
     * [KO] 세로 높이 (픽셀)
     * [EN] Height in pixels
     */
    get height(): number {
        return this.#height;
    }

    /**
     * [KO] 여백과 테두리를 제외한 내부 렌더링 영역의 가로 너비(CSS 픽셀)를 반환합니다.
     * [EN] Returns the horizontal width of the inner rendering area excluding margins and borders in CSS pixels.
     *
     * @returns
     * [KO] 내부 콘텐츠 가로 너비
     * [EN] Inner content width
     */
    get contentWidth(): number {
        return this.#contentWidth;
    }

    set camera(cam: any) {
        this.#camera = cam;
    }

    /**
     * [KO] 여백과 테두리를 제외한 내부 렌더링 영역의 세로 높이(CSS 픽셀)를 반환합니다.
     * [EN] Returns the vertical height of the inner rendering area excluding margins and borders in CSS pixels.
     *
     * @returns
     * [KO] 내부 콘텐츠 세로 높이
     * [EN] Inner content height
     */
    get contentHeight(): number {
        return this.#contentHeight;
    }

    /**
     * [KO] 화면 좌측 기준 디버거 컨테이너의 위치(픽셀)를 반환하거나 설정합니다.
     * [EN] Gets or sets the position of the debugger container from the left edge of the screen in pixels.
     *
     * @returns
     * [KO] 좌측 오프셋 (픽셀)
     * [EN] Left offset in pixels
     */
    get left(): number {
        return this.#left;
    }

    set width(w: number) {
        this.setSize(w, this.#height);
    }

    /**
     * [KO] 화면 하단 기준 디버거 컨테이너의 위치(픽셀)를 반환하거나 설정합니다.
     * [EN] Gets or sets the position of the debugger container from the bottom edge of the screen in pixels.
     *
     * @returns
     * [KO] 하단 오프셋 (픽셀)
     * [EN] Bottom offset in pixels
     */
    get bottom(): number {
        return this.#bottom;
    }

    set height(h: number) {
        this.setSize(this.#width, h);
    }

    /**
     * [KO] 현재 브라우저 환경의 기본 WebGPU 캔버스 텍스처 포맷을 반환합니다.
     * [EN] Returns the preferred WebGPU canvas texture format for the current browser environment.
     *
     * @returns
     * [KO] 권장 `GPUTextureFormat` 값
     * [EN] Preferred `GPUTextureFormat` value
     */
    static getPreferredCanvasFormat(): GPUTextureFormat {
        return (typeof navigator !== 'undefined' && navigator.gpu?.getPreferredCanvasFormat)
            ? navigator.gpu.getPreferredCanvasFormat()
            : 'bgra8unorm';
    }

    /**
     * [KO] 디버거 UI를 화면에 표시합니다.
     * [EN] Shows the debugger UI on screen.
     */
    show(): void {
        this.visible = true;
    }

    /**
     * [KO] 디버거 UI를 화면에서 숨깁니다.
     * [EN] Hides the debugger UI from screen.
     */
    hide(): void {
        this.visible = false;
    }

    set left(l: number) {
        this.setPosition(l, this.#bottom);
    }

    /**
     * [KO] 디버거 UI의 가시성 상태를 반전(토글)시키고 변경된 상태를 반환합니다.
     * [EN] Toggles the visibility state of the debugger UI and returns the updated state.
     *
     * @returns
     * [KO] 토글 후의 가시성 여부
     * [EN] Visibility state after toggling
     */
    toggle(): boolean {
        this.visible = !this.visible;
        return this.visible;
    }

    set bottom(b: number) {
        this.setPosition(this.#left, b);
    }

    /**
     * [KO] 현재 카메라와 지형 정보를 기반으로 정규화된 카메라 상태 객체를 계산하여 반환합니다.
     * [EN] Calculates and returns the normalized camera state object based on the current camera and landscape information.
     *
     * @returns
     * [KO] 계산된 `LandscapeDebuggerCameraState` 객체 또는 지형이 없을 경우 `null`
     * [EN] Calculated `LandscapeDebuggerCameraState` object, or `null` if no landscape is bound
     */
    getCameraState(): LandscapeDebuggerCameraState | null {
        if (!this.#landscape) return null;

        const camera = this.#camera;
        let camX = 0, camZ = 0, rawPan = 0, fov = 60;
        if (camera) {
            const {x, z, position, pan, fieldOfView} = camera;
            camX = x ?? position?.[0] ?? 0;
            camZ = z ?? position?.[2] ?? 0;
            rawPan = pan ?? 0;
            fov = fieldOfView ?? 60;
        }

        const panRad = (rawPan * Math.PI) / 180.0;
        const halfFovRad = ((fov * 0.5) * Math.PI) / 180.0;
        const dirX = -Math.sin(panRad);
        const dirY = -Math.cos(panRad);
        const lookAngle = Math.atan2(dirY, dirX);

        const {
            worldSizeX: wsX,
            worldSizeZ: wsZ,
            halfWorldSizeX: halfWsX,
            halfWorldSizeZ: halfWsZ,
            invWorldSizeX,
            invWorldSizeZ,
            tileLoadingRadius: landscapeTileLoadingRadius
        } = this.#landscape;
        const minX = -halfWsX;
        const minZ = -halfWsZ;

        const camNormX = (camX - minX) * invWorldSizeX;
        const camNormZ = (camZ - minZ) * invWorldSizeZ;

        const tileLoadingRadius = landscapeTileLoadingRadius || 2500;
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
     * [KO] 오버레이 캔버스에 타일 경계선, 타일 로딩 반경, 카메라 위치 및 시야각(FOV) 부채꼴을 렌더링합니다.
     * [EN] Renders tile grid lines, tile loading radius, camera position, and FOV wedge onto the overlay canvas.
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
     * [KO] 디버거 컨테이너 및 내부 캔버스의 가로/세로 크기(픽셀)를 변경합니다.
     * [EN] Resizes the horizontal and vertical dimensions of the debugger container and inner canvases in pixels.
     *
     * @param w -
     * [KO] 설정할 가로 너비 (픽셀)
     * [EN] Width to set in pixels
     * @param h -
     * [KO] 설정할 세로 높이 (픽셀)
     * [EN] Height to set in pixels
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
     * [KO] 디버거 컨테이너의 화면 좌측 및 하단 기준 위치(픽셀)를 설정합니다.
     * [EN] Sets the position of the debugger container relative to the left and bottom edges of the screen in pixels.
     *
     * @param left -
     * [KO] 화면 좌측 기준 오프셋 (픽셀)
     * [EN] Offset from the left edge of the screen in pixels
     * @param bottom -
     * [KO] 화면 하단 기준 오프셋 (픽셀)
     * [EN] Offset from the bottom edge of the screen in pixels
     */
    setPosition(left: number, bottom: number): void {
        this.#left = left;
        this.#bottom = bottom;
        this.#container.style.setProperty('left', `${left}px`, 'important');
        this.#container.style.setProperty('bottom', `${bottom}px`, 'important');
    }

    /**
     * [KO] 디버거 컨테이너 DOM 요소를 문서에서 제거합니다.
     * [EN] Removes the debugger container DOM element from the document.
     */
    destroy(): void {
        if (this.#container && this.#container.parentNode) {
            this.#container.parentNode.removeChild(this.#container);
        }
    }

    /**
     * [KO] 디버거 시각화 화면을 갱신하는 추상 메서드입니다.
     * [EN] Abstract method that updates the debugger visualization display.
     */
    abstract update(): void;
}

Object.freeze(ALandscapeDebugger);
export default ALandscapeDebugger;
