import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
type KeyNameMapper = {
    moveForward: string;
    moveBack: string;
    moveLeft: string;
    moveRight: string;
    moveUp: string;
    moveDown: string;
    turnLeft: string;
    turnRight: string;
    turnUp: string;
    turnDown: string;
};
/**
 * 기본 3D 카메라 컨트롤러(BasicController) 클래스입니다.
 * 키보드(WASD, QERFTG)와 마우스/터치로 카메라 이동·회전이 가능합니다.
 * 속도, 가속도, 키 매핑 등 다양한 파라미터를 지원합니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const controller = new RedGPU.Camera.BasicController(redGPUContext);
 * controller.x = 10;
 * controller.y = 5;
 * controller.z = 20;
 * controller.pan = 30;
 * controller.tilt = 10;
 * controller.setMoveForwardKey('ArrowUp');
 * ```
 */
declare class BasicController extends AController {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get tilt(): number;
    set tilt(value: number);
    get pan(): number;
    set pan(value: number);
    get keyNameMapper(): KeyNameMapper;
    setMoveForwardKey(value: string): void;
    setMoveBackKey(value: string): void;
    setMoveLeftKey(value: string): void;
    setMoveRightKey(value: string): void;
    setMoveUpKey(value: string): void;
    setMoveDownKey(value: string): void;
    setTurnLeftKey(value: string): void;
    setTurnRightKey(value: string): void;
    setTurnUpKey(value: string): void;
    setTurnDownKey(value: string): void;
    update(view: View3D, time: number): void;
}
export default BasicController;
