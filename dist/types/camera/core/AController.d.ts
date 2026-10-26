import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import OrthographicCamera from "../camera/OrthographicCamera";
import PerspectiveCamera from "../camera/PerspectiveCamera";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] 컨트롤러 초기화 시 전달하는 입력 핸들러 및 옵션 타입입니다.
 * [EN] Input handler and option configuration type passed during controller initialization.
 *
 * @category Core
 */
export type controllerInit = {
    HD_Move?: (deltaX: number, deltaY: number) => void;
    HD_Wheel?: (e: WheelEvent) => void;
    HD_TouchPinch?: (deltaScale: number) => void;
    useKeyboard?: boolean;
    camera?: PerspectiveCamera | OrthographicCamera;
};
/**
 * [KO] 마우스, 터치, 키보드 입력을 처리하여 카메라(`PerspectiveCamera` 또는 `OrthographicCamera`)를 제어하는 추상 컨트롤러 클래스입니다.
 * [EN] Abstract controller class that processes mouse, touch, and keyboard inputs to control a camera (`PerspectiveCamera` or `OrthographicCamera`).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
declare abstract class AController extends RedGPUObject {
    #private;
    /**
     * [KO] `AController` 인스턴스를 초기화하고 캔버스 입력 이벤트 리스너를 등록합니다.
     * [EN] Initializes the `AController` instance and registers canvas input event listeners.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param initInfo -
     * [KO] 컨트롤러 입력 콜백 및 초기 카메라 설정 옵션
     * [EN] Controller input callbacks and initial camera configuration options
     */
    constructor(redGPUContext: RedGPUContext, initInfo: controllerInit);
    /**
     * [KO] 컨트롤러가 제어 중인 카메라 인스턴스를 반환합니다.
     * [EN] Returns the camera instance controlled by this controller.
     *
     * @returns
     * [KO] 제어 중인 `PerspectiveCamera` 또는 `OrthographicCamera` 인스턴스
     * [EN] Controlled `PerspectiveCamera` or `OrthographicCamera` instance
     */
    get camera(): PerspectiveCamera | OrthographicCamera;
    /**
     * [KO] 제어 중인 카메라의 월드 X 좌표를 반환합니다.
     * [EN] Returns the world X coordinate of the controlled camera.
     *
     * @returns
     * [KO] 카메라 월드 X 좌표
     * [EN] Camera world X coordinate
     */
    get x(): number;
    /**
     * [KO] 제어 중인 카메라의 월드 Y 좌표를 반환합니다.
     * [EN] Returns the world Y coordinate of the controlled camera.
     *
     * @returns
     * [KO] 카메라 월드 Y 좌표
     * [EN] Camera world Y coordinate
     */
    get y(): number;
    /**
     * [KO] 제어 중인 카메라의 월드 Z 좌표를 반환합니다.
     * [EN] Returns the world Z coordinate of the controlled camera.
     *
     * @returns
     * [KO] 카메라 월드 Z 좌표
     * [EN] Camera world Z coordinate
     */
    get z(): number;
    /**
     * [KO] 현재 포인터가 호버링 중인 `View3D` 인스턴스를 반환합니다.
     * [EN] Returns the `View3D` instance currently hovered by the pointer.
     *
     * @returns
     * [KO] 호버링 중인 `View3D` 또는 `null`
     * [EN] Hovered `View3D` or `null`
     */
    get hoveredView(): View3D | null;
    /**
     * [KO] 키보드 입력 포커스를 보유한 전역 활성 `View3D`를 가져오거나 설정합니다.
     * [EN] Gets or sets the global active `View3D` holding keyboard input focus.
     *
     * @returns
     * [KO] 키보드 활성 `View3D` 또는 `null`
     * [EN] Keyboard-active `View3D` or `null`
     */
    get keyboardActiveView(): View3D | null;
    set keyboardActiveView(value: View3D | null);
    /**
     * [KO] 이 컨트롤러가 현재 전역 키보드 입력 활성 컨트롤러인지 여부를 반환합니다.
     * [EN] Returns whether this controller is currently the global keyboard-active controller.
     *
     * @returns
     * [KO] 키보드 활성 컨트롤러 여부
     * [EN] Whether this controller is keyboard-active
     */
    get isKeyboardActiveController(): boolean;
    /**
     * [KO] 현재 프레임에서 키보드 입력이 이미 처리되었는지 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether keyboard input has already been processed in the current frame.
     *
     * @returns
     * [KO] 현재 프레임 키보드 입력 처리 완료 여부
     * [EN] Whether keyboard input has been processed this frame
     */
    get keyboardProcessedThisFrame(): boolean;
    set keyboardProcessedThisFrame(value: boolean);
    /**
     * [KO] 컨트롤러에 등록된 캔버스 및 윈도우 이벤트 리스너를 모두 해제하고 내부 참조를 정리합니다.
     * [EN] Removes all canvas and window event listeners registered to the controller and clears internal references.
     */
    destroy(): void;
    /**
     * [KO] 프레임 경과 시간(`deltaTime`)을 계산하고 중복 뷰 갱신을 방지하며 애니메이션 콜백을 실행합니다.
     * [EN] Calculates frame elapsed time (`deltaTime`), prevents duplicate view updates, and executes the animation callback.
     *
     * @param view -
     * [KO] 업데이트할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance to update
     * @param time -
     * [KO] 현재 프레임 타임스탬프 (ms)
     * [EN] Current frame timestamp in milliseconds
     * @param updateAnimation -
     * [KO] 초 단위 `deltaTime`을 전달받아 카메라 상태를 갱신하는 콜백 함수 (선택)
     * [EN] Optional callback function receiving `deltaTime` in seconds to update camera state
     */
    update(view: View3D, time: number, updateAnimation?: (view: View3D, deltaTime: number) => void): void;
    /**
     * [KO] 지정된 키 매핑 테이블의 입력 여부를 검사하고 현재 `View3D`의 키보드 처리 권한을 획득합니다.
     * [EN] Checks whether any key in the key mapping table is pressed and acquires keyboard processing focus for the current `View3D`.
     *
     * @param view -
     * [KO] 키보드 입력을 검사할 `View3D` 인스턴스
     * [EN] `View3D` instance to check keyboard input for
     * @param keyNameMapper -
     * [KO] 동작 이름과 키 이름을 매핑한 객체 (`Record<string, string>`)
     * [EN] Object mapping action names to key names (`Record<string, string>`)
     * @returns
     * [KO] 현재 뷰에서 키보드 입력을 처리할 수 있으면 `true`, 아니면 `false`
     * [EN] `true` if keyboard input can be processed in the current view, otherwise `false`
     */
    checkKeyboardInput<T extends Record<string, string>>(view: View3D, keyNameMapper: T): boolean;
    /**
     * [KO] 마우스, 터치, 휠 이벤트로부터 캔버스 기준 로컬 `{ x, y }` 좌표를 계산합니다.
     * [EN] Calculates canvas-local `{ x, y }` coordinates from a mouse, touch, or wheel event.
     *
     * @param e -
     * [KO] 입력 이벤트 (`MouseEvent` | `TouchEvent` | `WheelEvent`)
     * [EN] Input event (`MouseEvent` | `TouchEvent` | `WheelEvent`)
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @returns
     * [KO] 캔버스 기준 `{ x, y }` 좌표 객체
     * [EN] Canvas-local `{ x, y }` coordinate object
     */
    getCanvasEventPoint: (e: MouseEvent | TouchEvent | WheelEvent, redGPUContext: RedGPUContext) => {
        x: number;
        y: number;
    };
    /**
     * [KO] 입력 이벤트가 발생한 픽셀 좌표가 속한 `View3D` 인스턴스를 탐색하여 반환합니다.
     * [EN] Finds and returns the `View3D` instance containing the pixel coordinates of the input event.
     *
     * @param e -
     * [KO] 마우스 또는 터치 이벤트 (`MouseEvent` | `TouchEvent`)
     * [EN] Mouse or touch event (`MouseEvent` | `TouchEvent`)
     * @returns
     * [KO] 이벤트가 발생한 `View3D` 인스턴스 또는 `null`
     * [EN] `View3D` instance where the event occurred, or `null`
     */
    findTargetViewByInputEvent: (e: MouseEvent | TouchEvent) => View3D | null;
}
export default AController;
