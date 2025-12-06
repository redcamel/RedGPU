import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import PerspectiveCamera from "../camera/PerspectiveCamera";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import OrthographicCamera from "../camera/OrthographicCamera";

/**
 * 카메라 컨트롤러의 추상 클래스입니다.
 *
 * PerspectiveCamera, OrthographicCamera 등 다양한 카메라 타입을 제어하는 공통 인터페이스를 제공합니다.
 *
 * 파생 컨트롤러에서 update, getCanvasEventPoint 등을 구현하여 다양한 카메라 조작 방식을 지원할 수 있습니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 * @category Core
 *
 */
abstract class AController {
    static currentMouseEventView: View3D
    /** 인스턴스 고유 ID */
    #instanceId: number;
    /** 컨트롤러 이름 */
    #name: string;
    #redGPUContext: RedGPUContext;
    /**
     * 현재 컨트롤러가 제어하는 카메라 인스턴스
     */
    #camera: PerspectiveCamera|OrthographicCamera
    // 현재 프레임에서 활성화된 View 목록
    #lastUpdateTime = -1;
    #currentFrameViews = new Set<View3D>();
    #detectorEventKey: { moveKey: string; upKey: string; downKey: string };
    /**
     * AController 생성자
     */
    constructor(redGPUContext: RedGPUContext,camera?:PerspectiveCamera|OrthographicCamera) {
        this.#redGPUContext = redGPUContext
        this.#camera = camera || new PerspectiveCamera()
        const isMobile = this.#redGPUContext.detector.isMobile;
        this.#detectorEventKey = {
            moveKey: isMobile ? 'touchmove' : 'mousemove',
            upKey: isMobile ? 'touchend' : 'mouseup',
            downKey: isMobile ? 'touchstart' : 'mousedown',
        };
    }

    get detectorEventKey(): { moveKey: string; upKey: string; downKey: string } {
        return this.#detectorEventKey;
    }

    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    set name(value: string) {
        this.#name = value;
    }

    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * 현재 연결된 카메라를 반환합니다.
     */
    get camera(): PerspectiveCamera  {
        return this.#camera;
    }



    /**
     * 컨트롤러 상태를 갱신합니다. (파생 클래스에서 override)
     * @param view - View3D 인스턴스
     * @param time - 시간값(ms)
     */
    update(view: View3D, time: number, updateAnimation: () => void): void {
        const targetView = AController.currentMouseEventView || view
        // 새로운 프레임이 시작되면 View 목록 초기화
        if (this.#lastUpdateTime !== time) {
            this.#lastUpdateTime = time;
            this.#currentFrameViews.clear();
        }
        // 현재 프레임에서 사용되는 View 추가
        this.#currentFrameViews.add(targetView);
        // 첫 번째 View에서만 애니메이션 업데이트 실행
        if (this.#currentFrameViews.size === 1) {
            updateAnimation?.();
        }
    }

    /**
     * 마우스/터치 이벤트에서 캔버스 내 좌표를 반환합니다.
     * @param e - MouseEvent 또는 TouchEvent
     * @param redGPUContext - RedGPUContext 인스턴스
     * @returns 캔버스 내 상대 좌표 객체 { x, y }
     */
    getCanvasEventPoint = (e: MouseEvent | TouchEvent, redGPUContext: RedGPUContext) => {
        const canvas = redGPUContext.htmlCanvas;
        const isMobile = redGPUContext.detector.isMobile;
        //TODO getBoundingClientRect 를 redGPUContext 쪽에서 캐싱 관리하는 방안 고려
        const rect = canvas.getBoundingClientRect();
        const tX_key = 'clientX';
        const tY_key = 'clientY';
        let clientX: number;
        let clientY: number;
        if (isMobile) {
            const touch = (e as TouchEvent).changedTouches[0];
            clientX = touch[tX_key];
            clientY = touch[tY_key];
        } else {
            const mouseEvent = e as MouseEvent;
            clientX = mouseEvent[tX_key];
            clientY = mouseEvent[tY_key];
        }
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    findTargetViewByInputEvent = (e: MouseEvent | TouchEvent): View3D | null => {
        const redGPUContext = this.#redGPUContext;
        const isMobile = redGPUContext.detector.isMobile;
        const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
        let tX: number, tY: number;
        const scale = window.devicePixelRatio * redGPUContext.renderScale
        tX = x * scale;
        tY = y * scale;
        // 현재 프레임에서 활성화된 View들을 검사하여 마우스/터치 위치에 해당하는 View 찾기
        for (const view of this.#currentFrameViews) {
            const tViewRect = view.pixelRectObject;
            if (tViewRect.x < tX && tX < tViewRect.x + tViewRect.width &&
                tViewRect.y < tY && tY < tViewRect.y + tViewRect.height) {
                return view;
            }
        }
        return null;
    };
    destroy(){

    }
}

export default AController
