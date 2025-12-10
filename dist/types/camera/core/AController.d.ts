import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import OrthographicCamera from "../camera/OrthographicCamera";
import PerspectiveCamera from "../camera/PerspectiveCamera";
export type controllerInit = {
    HD_Move?: (deltaX: number, deltaY: number) => void;
    HD_Wheel?: (e: WheelEvent) => void;
    HD_TouchPinch?: (deltaScale: number) => void;
    useKeyboard?: boolean;
    camera?: PerspectiveCamera | OrthographicCamera;
};
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
declare abstract class AController {
    #private;
    /**
     * AController 생성자
     */
    constructor(redGPUContext: RedGPUContext, initInfo: controllerInit);
    get startX(): number;
    get startY(): number;
    get detectorEventKey(): {
        moveKey: string;
        upKey: string;
        downKey: string;
    };
    get hoveredView(): View3D | null;
    get keyboardActiveView(): View3D | null;
    set keyboardActiveView(value: View3D | null);
    get keyboardProcessedThisFrame(): boolean;
    set keyboardProcessedThisFrame(value: boolean);
    get name(): string;
    set name(value: string);
    get redGPUContext(): RedGPUContext;
    /**
     * 현재 연결된 카메라를 반환합니다.
     */
    get camera(): PerspectiveCamera;
    destroy(): void;
    /**
     * 컨트롤러 상태를 갱신합니다. (파생 클래스에서 override)
     * @param view - View3D 인스턴스
     * @param time - 시간값(ms)
     */
    update(view: View3D, time: number, updateAnimation: () => void): void;
    /**
     * 마우스/터치 이벤트에서 캔버스 내 좌표를 반환합니다.
     * @param e - MouseEvent 또는 TouchEvent
     * @param redGPUContext - RedGPUContext 인스턴스
     * @returns 캔버스 내 상대 좌표 객체 { x, y }
     */
    getCanvasEventPoint: (e: MouseEvent | TouchEvent | WheelEvent, redGPUContext: RedGPUContext) => {
        x: number;
        y: number;
    };
    findTargetViewByInputEvent: (e: MouseEvent | TouchEvent) => View3D | null;
}
export default AController;
