import Landscape from "./Landscape";

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
    effPanRad: number;
    halfFovRad: number;
    centerRad: number;
    camNormX: number;
    camNormZ: number;
    loadingRadiusUV: number;
    worldSizeX: number;
    worldSizeZ: number;
    worldMinX: number;
    worldMinZ: number;
}

/**
 * [KO] Landscape 2D 디버거 시스템들의 공통 캔버스 조작, CSS 격리, 크기/위치 상태, 카메라 파라미터 및 공통 FOV 시야 부채꼴 드로잉을 관리하는 추상 기반 클래스입니다.
 * [EN] Abstract base class managing common canvas manipulation, CSS isolation, size/position state, camera parameters, and shared FOV frustum wedge drawing for Landscape 2D debugger systems.
 */
export abstract class ALandscapeDebugger {
    #landscape: Landscape;
    #canvas: HTMLCanvasElement;
    #visible: boolean = true;
    #camera: any = null;

    #width: number;
    #height: number;
    #left: number;
    #bottom: number;

    // Zero-GC 재사용 카메라 상태 구조체
    #cameraState: LandscapeDebuggerCameraState = {
        camX: 0,
        camZ: 0,
        pan: 0,
        fov: 60,
        effPanRad: 0,
        halfFovRad: 0,
        centerRad: 0,
        camNormX: 0,
        camNormZ: 0,
        loadingRadiusUV: 0,
        worldSizeX: 1000,
        worldSizeZ: 1000,
        worldMinX: -500,
        worldMinZ: -500
    };

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

        const w = opts?.width ?? 100;
        const h = opts?.height ?? 100;
        const left = opts?.left ?? 12;
        const bottom = opts?.bottom ?? 12;

        this.#width = w;
        this.#height = h;
        this.#left = left;
        this.#bottom = bottom;

        const canvas = document.createElement('canvas');
        if (canvasId) {
            canvas.id = canvasId;
        }
        canvas.width = w;
        canvas.height = h;

        // 외부 전역 CSS 규칙으로부터 100% 완전 격리
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
    }

    get landscape(): Landscape {
        return this.#landscape;
    }

    get canvas(): HTMLCanvasElement {
        return this.#canvas;
    }

    get visible(): boolean {
        return this.#visible;
    }

    set visible(val: boolean) {
        this.#visible = val;
        this.#canvas.style.setProperty('display', val ? 'block' : 'none', 'important');
    }

    get camera(): any {
        return this.#camera;
    }

    set camera(cam: any) {
        this.#camera = cam;
    }

    set bottom(b: number) {
        this.setPosition(this.#left, b);
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

    setCamera(cam: any): void {
        this.#camera = cam;
    }

    /**
     * [KO] 매 프레임 카메라 위치, 방위각, 시야각 및 월드 좌표 파라미터를 추출하여 갱신합니다 (Zero-GC 재사용 객체 리턴).
     * [EN] Extracts and updates camera position, azimuth, FOV, and world coordinates every frame (Zero-GC reusable object returned).
     */
    getCameraState(): LandscapeDebuggerCameraState | null {
        if (!this.#landscape) return null;

        const camera = this.#camera || (this.#landscape as any)?.camera || (this.#landscape as any)?.controller;
        const camX = camera ? (camera.x ?? camera.position?.[0] ?? 0) : 0;
        const camZ = camera ? (camera.z ?? camera.position?.[2] ?? 0) : 0;
        const rawPan = camera ? (camera.pan ?? 0) : 0;
        const fov = camera ? (camera.fov ?? 60) : 60;

        const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;
        const worldMinX = -worldSizeX / 2;
        const worldMinZ = -worldSizeZ / 2;

        const camNormX = Math.max(0, Math.min(1, (camX - worldMinX) / worldSizeX));
        const camNormZ = Math.max(0, Math.min(1, (camZ - worldMinZ) / worldSizeZ));
        const loadingRadiusUV = this.#landscape.loadingRadius / worldSizeX;

        const effPanRad = (-rawPan * Math.PI) / 180;
        const halfFovRad = ((fov / 2) * Math.PI) / 180;
        const centerRad = Math.atan2(-Math.cos(effPanRad), Math.sin(effPanRad));

        const state = this.#cameraState;
        state.camX = camX;
        state.camZ = camZ;
        state.pan = rawPan;
        state.fov = fov;
        state.effPanRad = effPanRad;
        state.halfFovRad = halfFovRad;
        state.centerRad = centerRad;
        state.camNormX = camNormX;
        state.camNormZ = camNormZ;
        state.loadingRadiusUV = loadingRadiusUV;
        state.worldSizeX = worldSizeX;
        state.worldSizeZ = worldSizeZ;
        state.worldMinX = worldMinX;
        state.worldMinZ = worldMinZ;

        return state;
    }

    /**
     * [KO] 공통 2D 캔버스 기반 카메라 시야 부채꼴, 시선 레이, 로딩 반경 및 카메라 위치 점을 렌더링하는 전용 헬퍼 메소드입니다.
     * [EN] Dedicated helper method rendering the common 2D canvas based camera FOV frustum wedge, heading ray, loading radius, and camera position dot.
     */
    drawCameraOverlay2D(
        ctx: CanvasRenderingContext2D,
        state: LandscapeDebuggerCameraState,
        canvasWidth: number,
        canvasHeight: number,
        padding: number = 5
    ): void {
        const {camNormX, camNormZ, effPanRad, halfFovRad, centerRad, loadingRadiusUV} = state;
        const mapDrawWidth = canvasWidth - padding * 2;
        const mapDrawHeight = canvasHeight - padding * 2;

        const camCanvasX = padding + camNormX * mapDrawWidth;
        const camCanvasY = padding + camNormZ * mapDrawHeight;
        const radiusPixels = loadingRadiusUV * mapDrawWidth;

        // 1. Loading Radius Circle (Bright Emerald Green)
        ctx.beginPath();
        ctx.arc(camCanvasX, camCanvasY, radiusPixels, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. FOV Frustum Wedge (Amber Gold Fill & Stroke)
        const startAngle = centerRad - halfFovRad;
        const endAngle = centerRad + halfFovRad;
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

        // 3. Heading Ray Line (Coral Red)
        const dirX = Math.sin(effPanRad) * (wedgeRadius + 10);
        const dirY = -Math.cos(effPanRad) * (wedgeRadius + 10);
        ctx.beginPath();
        ctx.moveTo(camCanvasX, camCanvasY);
        ctx.lineTo(camCanvasX + dirX, camCanvasY + dirY);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // 4. Camera Position Dot (Glowing White Dot with Coral Red Ring)
        ctx.beginPath();
        ctx.arc(camCanvasX, camCanvasY, 4.0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();
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

    destroy(): void {
        if (this.#canvas && this.#canvas.parentNode) {
            this.#canvas.parentNode.removeChild(this.#canvas);
        }
    }

    /**
     * [KO] 매 프레임 실시간 디버거 캔버스를 갱신 렌더링하는 추상 메서드입니다.
     * [EN] Abstract method rendering and updating the live debugger canvas every frame.
     */
    public abstract update(): void;
}

export default ALandscapeDebugger;
