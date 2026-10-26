import type RedGPUContext from "../RedGPUContext";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] `RedGPUContext`에 연결된 HTML 캔버스의 DOM 부모 변경 및 레이아웃(크기·위치) 변화를 감지하는 관찰자 클래스입니다.
 * [EN] Observer class that detects DOM parent changes and layout (size/position) changes of the HTML canvas attached to `RedGPUContext`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Context
 */
export default class RedGPUContextObserver extends RedGPUObject {

    readonly #htmlCanvas: HTMLCanvasElement;
    readonly #updateCallback: () => void;
    #currentParent: HTMLElement | null = null;
    #resizeObserver: ResizeObserver | null = null;
    #mutationObserver: MutationObserver | null = null;
    #intersectionObserver: IntersectionObserver | null = null;
    #resizeHandler: (() => void) | null = null;

    /**
     * [KO] RedGPUContextObserver 인스턴스를 생성합니다.
     * [EN] Creates a RedGPUContextObserver instance.
     *
     * @param redGPUContext -
     * [KO] 관찰할 RedGPUContext 인스턴스
     * [EN] RedGPUContext instance to observe
     * @param updateCallback -
     * [KO] 레이아웃 변화 감지 시 호출할 콜백 함수
     * [EN] Callback function invoked when a layout change is detected
     */
    constructor(redGPUContext: RedGPUContext, updateCallback: () => void) {
        super(redGPUContext);
        this.#htmlCanvas = redGPUContext.htmlCanvas;
        this.#updateCallback = updateCallback;
        this.#init();
    }

    /**
     * [KO] 등록된 모든 옵저버 연결을 해제하고 윈도우 리사이즈 이벤트 리스너를 제거합니다.
     * [EN] Disconnects all registered observers and removes the window resize event listener.
     */
    destroy() {
        this.#mutationObserver?.disconnect();
        this.#resizeObserver?.disconnect();
        this.#intersectionObserver?.disconnect();
        if (this.#resizeHandler) {
            window.removeEventListener('resize', this.#resizeHandler);
            this.#resizeHandler = null;
        }
    }

    #init() {
        this.#mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    if (this.#currentParent !== this.#htmlCanvas.parentElement) {
                        this.#updateObservers();
                    }
                }
            }
        });

        if (typeof document !== 'undefined') {
            this.#mutationObserver.observe(document.body, {childList: true, subtree: true});
        }

        this.#intersectionObserver = new IntersectionObserver(() => {
            this.#handleLayoutChange();
        }, {
            threshold: [0, 1]
        });
        this.#intersectionObserver.observe(this.#htmlCanvas);

        this.#resizeHandler = () => this.#handleLayoutChange();
        window.addEventListener('resize', this.#resizeHandler);

        this.#updateObservers();
    }

    #updateObservers() {
        const newParent = this.#htmlCanvas.parentElement;
        if (this.#currentParent !== newParent) {
            if (this.#resizeObserver) {
                this.#resizeObserver.disconnect();
                this.#resizeObserver = null;
            }
            this.#currentParent = newParent;
            if (this.#currentParent) {
                this.#resizeObserver = new ResizeObserver(() => {
                    this.#handleLayoutChange();
                });
                this.#resizeObserver.observe(this.#currentParent);
            }
        }
        this.#handleLayoutChange();
    }

    #handleLayoutChange() {
        this.#updateCallback();
        this.redGPUContext.sizeManager.setSize();
    }
}
