import Landscape from "./Landscape";

/**
 * [KO] Landscape 2D 디버거 시스템들의 공통 캔버스 조작, CSS 격리, 크기/위치 상태를 관리하는 추상 기반 클래스입니다.
 * [EN] Abstract base class managing common canvas manipulation, CSS isolation, and size/position state for Landscape 2D debugger systems.
 */
export abstract class ALandscapeDebugger {
    #landscape: Landscape;
    #canvas: HTMLCanvasElement;
    #visible: boolean = true;

    #width: number;
    #height: number;
    #left: number;
    #bottom: number;

    constructor(
        landscape: Landscape,
        canvasId: string,
        options: {
            width?: number,
            height?: number,
            left?: number,
            bottom?: number
        } = {}
    ) {
        this.#landscape = landscape;

        const w = options.width ?? 100;
        const h = options.height ?? 100;
        const left = options.left ?? 12;
        const bottom = options.bottom ?? 12;

        this.#width = w;
        this.#height = h;
        this.#left = left;
        this.#bottom = bottom;

        const canvas = document.createElement('canvas');
        canvas.id = canvasId;
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
