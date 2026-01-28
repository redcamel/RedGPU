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
 * [KO] 카메라 컨트롤러의 추상 클래스입니다.
 * [EN] Abstract class for camera controllers.
 *
 * [KO] PerspectiveCamera, OrthographicCamera 등 다양한 카메라 타입을 제어하는 공통 인터페이스를 제공합니다.
 * [EN] Provides a common interface for controlling various camera types such as PerspectiveCamera and OrthographicCamera.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접적인 인스턴스 생성은 불가능하며, 필요한 경우 이를 상속받아 구현하십시오.
 * [EN] This class is an abstract class used internally by the system.<br/>Direct instantiation is not possible; inherit and implement if necessary.
 * :::
 *
 * @category Core
 */
declare abstract class AController {
    #private;
    /**
     * [KO] AController 생성자
     * [EN] AController constructor
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param initInfo -
     * [KO] 컨트롤러 초기화 정보
     * [EN] Controller initialization info
     */
    constructor(redGPUContext: RedGPUContext, initInfo: controllerInit);
    /**
     * [KO] 컨트롤러의 이름을 반환합니다.
     * [EN] Returns the name of the controller.
     *
     * @returns
     * [KO] 컨트롤러 이름
     * [EN] Controller name
     */
    get name(): string;
    /**
     * [KO] 컨트롤러의 이름을 설정합니다.
     * [EN] Sets the name of the controller.
     *
     * @param value -
     * [KO] 설정할 이름
     * [EN] Name to set
     */
    set name(value: string);
    /**
     * [KO] RedGPU 컨텍스트를 반환합니다.
     * [EN] Returns the RedGPU context.
     *
     * @returns
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     */
    get redGPUContext(): RedGPUContext;
    /**
     * [KO] 이 컨트롤러가 제어하는 카메라를 반환합니다.
     * [EN] Returns the camera controlled by this controller.
     *
     * @returns
     * [KO] 제어 중인 카메라 (PerspectiveCamera 또는 OrthographicCamera)
     * [EN] Controlled camera (PerspectiveCamera or OrthographicCamera)
     */
    get camera(): PerspectiveCamera | OrthographicCamera;
    /**
     * [KO] 현재 마우스가 호버링 중인 View를 반환합니다.
     * [EN] Returns the View currently being hovered by the mouse.
     *
     * @returns
     * [KO] 호버링 중인 View 또는 null
     * [EN] Hovered View or null
     * @internal
     */
    get hoveredView(): View3D | null;
    /**
     * [KO] 키보드 입력이 활성화된 View를 반환합니다.
     * [EN] Returns the View with active keyboard input.
     *
     * @returns
     * [KO] 키보드 활성 View 또는 null
     * [EN] Keyboard active View or null
     * @internal
     */
    get keyboardActiveView(): View3D | null;
    /**
     * [KO] 키보드 입력이 활성화된 View를 설정합니다.
     * [EN] Sets the View with active keyboard input.
     *
     * @param value -
     * [KO] 설정할 View 또는 null
     * [EN] View to set or null
     * @internal
     */
    set keyboardActiveView(value: View3D | null);
    /**
     * [KO] 현재 컨트롤러가 키보드 입력을 처리 중인지 여부를 반환합니다.
     * [EN] Returns whether the current controller is processing keyboard input.
     *
     * @returns
     * [KO] 키보드 활성 컨트롤러 여부
     * [EN] Whether it is the keyboard active controller
     * @internal
     */
    get isKeyboardActiveController(): boolean;
    /**
     * [KO] 이번 프레임에서 키보드 입력이 이미 처리되었는지 여부를 반환합니다.
     * [EN] Returns whether keyboard input has already been processed in this frame.
     *
     * @returns
     * [KO] 처리 여부
     * [EN] Processing status
     * @internal
     */
    get keyboardProcessedThisFrame(): boolean;
    /**
     * [KO] 이번 프레임에서 키보드 입력이 처리되었는지 여부를 설정합니다.
     * [EN] Sets whether keyboard input has been processed in this frame.
     *
     * @param value -
     * [KO] 설정할 처리 여부
     * [EN] Processing status to set
     * @internal
     */
    set keyboardProcessedThisFrame(value: boolean);
    /**
     * [KO] 컨트롤러를 제거하고 이벤트 리스너를 해제합니다.
     * [EN] Destroys the controller and removes event listeners.
     */
    destroy(): void;
    /**
     * [KO] 컨트롤러 상태를 업데이트합니다. 파생 클래스에서 구현해야 합니다.
     * [EN] Updates the controller state. Must be implemented in derived classes.
     *
     * @param view -
     * [KO] 현재 View
     * [EN] Current View
     * @param time -
     * [KO] 현재 시간 (ms)
     * [EN] Current time (ms)
     * @param updateAnimation -
     * [KO] 애니메이션 업데이트 콜백
     * [EN] Animation update callback
     */
    update(view: View3D, time: number, updateAnimation: () => void): void;
    /**
     * [KO] 키보드 입력이 있는지 체크하고 활성 View를 설정합니다.
     * [EN] Checks for keyboard input and sets the active View.
     * @param view -
     * [KO] 현재 View
     * [EN] Current View
     * @param keyNameMapper -
     * [KO] 키 매핑 객체
     * [EN] Key mapping object
     * @returns
     * [KO] 키보드 입력 처리가 가능하면 true, 아니면 false
     * [EN] True if keyboard input processing is possible, otherwise false
     */
    checkKeyboardInput<T extends Record<string, string>>(view: View3D, keyNameMapper: T): boolean;
    /**
     * [KO] 캔버스 상의 이벤트 좌표를 가져옵니다.
     * [EN] Gets the event coordinates on the canvas.
     *
     * @param e -
     * [KO] 마우스, 터치 또는 휠 이벤트
     * [EN] Mouse, touch, or wheel event
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     * @returns
     * [KO] {x, y} 좌표 객체
     * [EN] {x, y} coordinate object
     * @internal
     */
    getCanvasEventPoint: (e: MouseEvent | TouchEvent | WheelEvent, redGPUContext: RedGPUContext) => {
        x: number;
        y: number;
    };
    /**
     * [KO] 입력 이벤트가 발생한 View를 찾습니다.
     * [EN] Finds the View where the input event occurred.
     *
     * @param e -
     * [KO] 마우스 또는 터치 이벤트
     * [EN] Mouse or touch event
     * @returns
     * [KO] 해당 View 또는 null
     * [EN] Corresponding View or null
     * @internal
     */
    findTargetViewByInputEvent: (e: MouseEvent | TouchEvent) => View3D | null;
}
export default AController;
