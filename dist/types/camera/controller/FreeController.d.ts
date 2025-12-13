import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * 키보드 입력 키 매핑 설정을 정의합니다.
 * @interface KeyNameMapper
 * @property {string} moveForward - 전진 이동 키
 * @property {string} moveBack - 후진 이동 키
 * @property {string} moveLeft - 좌측 이동 키
 * @property {string} moveRight - 우측 이동 키
 * @property {string} moveUp - 상향 이동 키
 * @property {string} moveDown - 하향 이동 키
 * @property {string} turnLeft - 좌회전 키
 * @property {string} turnRight - 우회전 키
 * @property {string} turnUp - 상향 회전 키
 * @property {string} turnDown - 하향 회전 키
 */
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
 * 기본 3D 카메라 컨트롤러(FreeController) 클래스입니다.
 * 키보드(WASD, QERFTG)와 마우스/터치로 카메라 이동·회전이 가능합니다.
 * 속도, 가속도, 키 매핑 등 다양한 파라미터를 지원합니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const controller = new RedGPU.Camera.FreeController(redGPUContext);
 * controller.x = 10;
 * controller.y = 5;
 * controller.z = 20;
 * controller.pan = 30;
 * controller.tilt = 10;
 * controller.setMoveForwardKey('w');
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/freeController/"></iframe>
 */
declare class FreeController extends AController {
    #private;
    /**
     * FreeController의 생성자입니다.
     * 마우스/터치 드래그(HD_Move) 이벤트 핸들러와 키보드 입력을 초기화합니다.
     *
     * @param {RedGPUContext} redGPUContext - RedGPU 컨텍스트 객체
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * 카메라의 X축 위치를 가져옵니다.
     * @returns 카메라의 X축 위치 값
     */
    get x(): number;
    /**
     * 카메라의 X축 위치를 설정합니다.
     * @param value - 설정할 X축 위치 값 (숫자)
     */
    set x(value: number);
    /**
     * 카메라의 Y축 위치를 가져옵니다.
     * @returns 카메라의 Y축 위치 값
     */
    get y(): number;
    /**
     * 카메라의 Y축 위치를 설정합니다.
     * @param value - 설정할 Y축 위치 값 (숫자)
     */
    set y(value: number);
    /**
     * 카메라의 Z축 위치를 가져옵니다.
     * @returns 카메라의 Z축 위치 값
     */
    get z(): number;
    /**
     * 카메라의 Z축 위치를 설정합니다.
     * @param value - 설정할 Z축 위치 값 (숫자)
     */
    set z(value: number);
    /**
     * 카메라의 좌우 회전 각도(Pan)를 가져옵니다. (단위: 도)
     * @returns 좌우 회전 각도 값
     */
    get pan(): number;
    /**
     * 카메라의 좌우 회전 각도(Pan)를 설정합니다. (단위: 도)
     * @param value - 설정할 좌우 회전 각도 값
     */
    set pan(value: number);
    /**
     * 카메라의 상하 회전 각도(Tilt)를 가져옵니다. (단위: 도, 범위: -90 ~ 90)
     * @returns 상하 회전 각도 값
     */
    get tilt(): number;
    /**
     * 카메라의 상하 회전 각도(Tilt)를 설정합니다. (단위: 도, 범위: -90 ~ 90)
     * @param value - 설정할 상하 회전 각도 값
     */
    set tilt(value: number);
    /**
     * 카메라의 이동 속도를 가져옵니다.
     * @returns 이동 속도 값
     */
    get moveSpeed(): number;
    /**
     * 카메라의 이동 속도를 설정합니다.
     * @param value - 설정할 이동 속도 값 (0.01 이상)
     */
    set moveSpeed(value: number);
    /**
     * 이동 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)
     * @returns 이동 보간 정도 값
     */
    get moveSpeedInterpolation(): number;
    /**
     * 이동 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 이동)
     * @param value - 설정할 보간 정도 값
     */
    set moveSpeedInterpolation(value: number);
    /**
     * 카메라의 회전 속도를 가져옵니다.
     * @returns 회전 속도 값
     */
    get rotationSpeed(): number;
    /**
     * 카메라의 회전 속도를 설정합니다.
     * @param value - 설정할 회전 속도 값 (0.01 이상)
     */
    set rotationSpeed(value: number);
    /**
     * 회전 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)
     * @returns 회전 보간 정도 값
     */
    get rotationSpeedInterpolation(): number;
    /**
     * 회전 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 회전)
     * @param value - 설정할 보간 정도 값
     */
    set rotationSpeedInterpolation(value: number);
    /**
     * 최대 가속도를 가져옵니다.
     * @returns 최대 가속도 값
     */
    get maxAcceleration(): number;
    /**
     * 최대 가속도를 설정합니다.
     * @param value - 설정할 최대 가속도 값
     */
    set maxAcceleration(value: number);
    /**
     * 현재 키 매핑 설정을 가져옵니다.
     * @returns 키 매핑 객체의 복사본
     */
    get keyNameMapper(): KeyNameMapper;
    /**
     * 전진 이동 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 'w')
     */
    setMoveForwardKey(value: string): void;
    /**
     * 후진 이동 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 's')
     */
    setMoveBackKey(value: string): void;
    /**
     * 좌측 이동 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 'a')
     */
    setMoveLeftKey(value: string): void;
    /**
     * 우측 이동 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 'd')
     */
    setMoveRightKey(value: string): void;
    /**
     * 상향 이동 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 't')
     */
    setMoveUpKey(value: string): void;
    /**
     * 하향 이동 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 'g')
     */
    setMoveDownKey(value: string): void;
    /**
     * 좌회전 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 'q')
     */
    setTurnLeftKey(value: string): void;
    /**
     * 우회전 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 'e')
     */
    setTurnRightKey(value: string): void;
    /**
     * 상향 회전 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 'r')
     */
    setTurnUpKey(value: string): void;
    /**
     * 하향 회전 키를 설정합니다.
     * @param value - 설정할 키 이름 (예: 'f')
     */
    setTurnDownKey(value: string): void;
    /**
     * 매 프레임마다 카메라 컨트롤러를 업데이트합니다.
     * 키보드/마우스 입력을 처리하고 카메라 위치와 회전을 계산합니다.
     *
     * @param {View3D} view - 3D 뷰 객체
     * @param {number} time - 현재 경과 시간 (밀리초)
     */
    update(view: View3D, time: number): void;
}
export default FreeController;
