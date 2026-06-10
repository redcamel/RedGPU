import type RedGPUContext from "../RedGPUContext";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] RedGPUContext의 캔버스 환경 변화(부모 변경, 크기/위치 변화)를 감지하는 클래스입니다.
 * [EN] Class that detects changes in the RedGPUContext's canvas environment (parent changes, size/position changes).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export default class RedGPUContextObserver extends RedGPUObject {

    /**
     * [KO] 관찰 대상 HTML 캔버스 엘리먼트
     * [EN] Target HTML canvas element to observe
     */
    readonly #htmlCanvas: HTMLCanvasElement;
    /**
     * [KO] 레이아웃 변화 시 실행될 콜백 함수
     * [EN] Callback function to execute when layout changes
     */
    readonly #updateCallback: () => void;
    /**
     * [KO] 현재 캔버스의 부모 엘리먼트
     * [EN] Current parent element of the canvas
     */
    #currentParent: HTMLElement | null = null;
    /**
     * [KO] 부모 엘리먼트 크기 감지용 ResizeObserver
     * [EN] ResizeObserver for detecting parent element size changes
     */
    #resizeObserver: ResizeObserver | null = null;
    /**
     * [KO] DOM 변화 감지용 MutationObserver
     * [EN] MutationObserver for detecting DOM structure changes
     */
    #mutationObserver: MutationObserver | null = null;
    /**
     * [KO] 위치/화면 노출 여부 감지용 IntersectionObserver
     * [EN] IntersectionObserver for detecting position and screen visibility changes
     */
    #intersectionObserver: IntersectionObserver | null = null;

    /**
     * [KO] RedGPUContextObserver 생성자
     * [EN] RedGPUContextObserver constructor
     * @param redGPUContext -
     * [KO] 관찰할 RedGPUContext 인스턴스
     * [EN] RedGPUContext instance to observe
     * @param updateCallback -
     * [KO] 레이아웃 변화 시 호출할 콜백
     * [EN] Callback to call when layout changes
     */
    constructor(redGPUContext: RedGPUContext, updateCallback: () => void) {
        super(redGPUContext);
        this.#htmlCanvas = redGPUContext.htmlCanvas;
        this.#updateCallback = updateCallback;
        this.#init();
    }

    /**
     * [KO] 모든 옵저버 중지
     * [EN] Stop all observers
     */
    stop() {
        this.#mutationObserver?.disconnect();
        this.#resizeObserver?.disconnect();
        this.#intersectionObserver?.disconnect();
    }

    /**
     * [KO] 옵저버 초기화
     * [EN] Initialize observers
     */
    #init() {
        // [KO] MutationObserver: 부모 객체의 변경(추가/삭제/이동) 감지
        // [EN] MutationObserver: Detect changes in parent object (add/delete/move)
        this.#mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // [KO] 캔버스의 부모가 바뀌었는지 확인
                    // [EN] Check if the canvas's parent has changed
                    if (this.#currentParent !== this.#htmlCanvas.parentElement) {
                        this.#updateObservers();
                    }
                }
            }
        });

        if (typeof document !== 'undefined') {
            // [KO] document.body를 관찰하여 캔버스의 이동을 감지합니다.
            // [EN] Observe document.body to detect canvas movement.
            this.#mutationObserver.observe(document.body, {childList: true, subtree: true});
        }

        // [KO] IntersectionObserver: 위치 변화(top, left 등) 감지
        // [EN] IntersectionObserver: Detect position changes (top, left, etc.)
        this.#intersectionObserver = new IntersectionObserver(() => {
            this.#handleLayoutChange();
        }, {
            threshold: [0, 1]
        });
        this.#intersectionObserver.observe(this.#htmlCanvas);

        // [KO] 즉각적인 반응성을 위해 윈도우 리사이즈 및 스크롤 이벤트도 함께 사용합니다.
        // [EN] For immediate responsiveness, window resize and scroll events are also used.
        window.addEventListener('resize', () => this.#handleLayoutChange());

        this.#updateObservers();
    }

    /**
     * [KO] 부모 요소 관찰자 업데이트
     * [EN] Update parent element observer
     */
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

    /**
     * [KO] 레이아웃 변화 처리
     * [EN] Handle layout change
     */
    #handleLayoutChange() {
        // [KO] RedGPUContext의 boundingClientRect 업데이트 및 setSize 호출
        // [EN] Update RedGPUContext's boundingClientRect and call setSize
        this.#updateCallback();
        this.redGPUContext.sizeManager.setSize();
    }
}
