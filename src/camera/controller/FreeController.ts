import {mat4, vec3} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";
// ==================== 모듈 레벨 상수 및 임시 변수 ====================
const PER_PI = Math.PI / 180;
let tMTX0 = mat4.create();
const displacementMTX = mat4.create();
const displacementVec3 = vec3.create();
// ==================== 키 매핑 타입 ====================
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
class FreeController extends AController {
	// ==================== 키 매핑 ====================
	#keyNameMapper: KeyNameMapper = {
		moveForward: 'w',
		moveBack: 's',
		moveLeft: 'a',
		moveRight: 'd',
		moveUp: 't',
		moveDown: 'g',
		turnLeft: 'q',
		turnRight: 'e',
		turnUp: 'r',
		turnDown: 'f'
	};
	// ==================== 이동 관련 설정 ====================
	#moveSpeed: number = 0.5;
	#moveDelayInterpolation: number = 0.1;
	#maxAcceleration: number = 1;
	#currentAcceleration: number = 0;
	// ==================== 회전 관련 설정 ====================
	#rotationSpeed: number = 1;
	#rotationInterpolation: number = 0.1;
	// ==================== 위치 및 회전 상태 ====================
	#desirePosition: [number, number, number] = [0, 0, 0];
	#pan: number = 0;
	#tilt: number = 0;
	// ==================== 메시 및 입력 관련 ====================
	#targetMesh: Mesh;

	// ==================== 라이프사이클 ====================
	/**
	 * FreeController의 생성자입니다.
	 * 마우스/터치 드래그(HD_Move) 이벤트 핸들러와 키보드 입력을 초기화합니다.
	 *
	 * @param {RedGPUContext} redGPUContext - RedGPU 컨텍스트 객체
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			{
				HD_Move: (deltaX: number, deltaY: number) => {
					this.#pan -= deltaX * this.#rotationSpeed * 0.1;
					this.#tilt -= deltaY * this.#rotationSpeed * 0.1;
				},
				useKeyboard: true
			});
		this.#initListener();
	}

	// ==================== 위치(Position) Getter/Setter ====================
	/**
	 * 카메라의 X축 위치를 가져옵니다.
	 * @returns 카메라의 X축 위치 값
	 */
	get x(): number {
		return this.#targetMesh.x;
	}

	/**
	 * 카메라의 X축 위치를 설정합니다.
	 * @param value - 설정할 X축 위치 값 (숫자)
	 */
	set x(value: number) {
		validateNumber(value);
		this.#targetMesh.x = value;
		this.#desirePosition[0] = value;
	}

	/**
	 * 카메라의 Y축 위치를 가져옵니다.
	 * @returns 카메라의 Y축 위치 값
	 */
	get y(): number {
		return this.#targetMesh.y;
	}

	/**
	 * 카메라의 Y축 위치를 설정합니다.
	 * @param value - 설정할 Y축 위치 값 (숫자)
	 */
	set y(value: number) {
		validateNumber(value);
		this.#targetMesh.y = value;
		this.#desirePosition[1] = value;
	}

	/**
	 * 카메라의 Z축 위치를 가져옵니다.
	 * @returns 카메라의 Z축 위치 값
	 */
	get z(): number {
		return this.#targetMesh.z;
	}

	/**
	 * 카메라의 Z축 위치를 설정합니다.
	 * @param value - 설정할 Z축 위치 값 (숫자)
	 */
	set z(value: number) {
		validateNumber(value);
		this.#targetMesh.z = value;
		this.#desirePosition[2] = value;
	}

	// ==================== 회전(Rotation) Getter/Setter ====================
	/**
	 * 카메라의 좌우 회전 각도(Pan)를 가져옵니다. (단위: 도)
	 * @returns 좌우 회전 각도 값
	 */
	get pan(): number {
		return this.#pan;
	}

	/**
	 * 카메라의 좌우 회전 각도(Pan)를 설정합니다. (단위: 도)
	 * @param value - 설정할 좌우 회전 각도 값
	 */
	set pan(value: number) {
		validateNumber(value);
		this.#targetMesh.rotationY = value;
		this.#pan = value;
	}

	/**
	 * 카메라의 상하 회전 각도(Tilt)를 가져옵니다. (단위: 도, 범위: -90 ~ 90)
	 * @returns 상하 회전 각도 값
	 */
	get tilt(): number {
		return this.#tilt;
	}

	/**
	 * 카메라의 상하 회전 각도(Tilt)를 설정합니다. (단위: 도, 범위: -90 ~ 90)
	 * @param value - 설정할 상하 회전 각도 값
	 */
	set tilt(value: number) {
		validateNumber(value);
		const clampedTilt = Math.max(-90, Math.min(90, value));
		this.#targetMesh.rotationX = clampedTilt;
		this.#tilt = clampedTilt;
	}

	// ==================== 이동 속도 Getter/Setter ====================
	/**
	 * 카메라의 이동 속도를 가져옵니다.
	 * @returns 이동 속도 값
	 */
	get moveSpeed(): number {
		return this.#moveSpeed;
	}

	/**
	 * 카메라의 이동 속도를 설정합니다.
	 * @param value - 설정할 이동 속도 값 (0.01 이상)
	 */
	set moveSpeed(value: number) {
		validateNumberRange(value, 0.01);
		this.#moveSpeed = value;
	}

	/**
	 * 이동 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)
	 * @returns 이동 보간 정도 값
	 */
	get moveSpeedInterpolation(): number {
		return this.#moveDelayInterpolation;
	}

	/**
	 * 이동 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 이동)
	 * @param value - 설정할 보간 정도 값
	 */
	set moveSpeedInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#moveDelayInterpolation = value;
	}

	// ==================== 회전 속도 Getter/Setter ====================
	/**
	 * 카메라의 회전 속도를 가져옵니다.
	 * @returns 회전 속도 값
	 */
	get rotationSpeed(): number {
		return this.#rotationSpeed;
	}

	/**
	 * 카메라의 회전 속도를 설정합니다.
	 * @param value - 설정할 회전 속도 값 (0.01 이상)
	 */
	set rotationSpeed(value: number) {
		validateNumberRange(value, 0.01);
		this.#rotationSpeed = value;
	}

	/**
	 * 회전 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)
	 * @returns 회전 보간 정도 값
	 */
	get rotationSpeedInterpolation(): number {
		return this.#rotationInterpolation;
	}

	/**
	 * 회전 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 회전)
	 * @param value - 설정할 보간 정도 값
	 */
	set rotationSpeedInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#rotationInterpolation = value;
	}

	// ==================== 가속도 Getter/Setter ====================
	/**
	 * 최대 가속도를 가져옵니다.
	 * @returns 최대 가속도 값
	 */
	get maxAcceleration(): number {
		return this.#maxAcceleration;
	}

	/**
	 * 최대 가속도를 설정합니다.
	 * @param value - 설정할 최대 가속도 값
	 */
	set maxAcceleration(value: number) {
		this.#maxAcceleration = value;
	}

	// ==================== 키 매핑 Getter/Setter ====================
	/**
	 * 현재 키 매핑 설정을 가져옵니다.
	 * @returns 키 매핑 객체의 복사본
	 */
	get keyNameMapper(): KeyNameMapper {
		return {...this.#keyNameMapper};
	}

	/**
	 * 전진 이동 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 'w')
	 */
	setMoveForwardKey(value: string) {
		this.#keyNameMapper.moveForward = value;
	}

	/**
	 * 후진 이동 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 's')
	 */
	setMoveBackKey(value: string) {
		this.#keyNameMapper.moveBack = value;
	}

	/**
	 * 좌측 이동 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 'a')
	 */
	setMoveLeftKey(value: string) {
		this.#keyNameMapper.moveLeft = value;
	}

	/**
	 * 우측 이동 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 'd')
	 */
	setMoveRightKey(value: string) {
		this.#keyNameMapper.moveRight = value;
	}

	/**
	 * 상향 이동 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 't')
	 */
	setMoveUpKey(value: string) {
		this.#keyNameMapper.moveUp = value;
	}

	/**
	 * 하향 이동 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 'g')
	 */
	setMoveDownKey(value: string) {
		this.#keyNameMapper.moveDown = value;
	}

	/**
	 * 좌회전 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 'q')
	 */
	setTurnLeftKey(value: string) {
		this.#keyNameMapper.turnLeft = value;
	}

	/**
	 * 우회전 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 'e')
	 */
	setTurnRightKey(value: string) {
		this.#keyNameMapper.turnRight = value;
	}

	/**
	 * 상향 회전 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 'r')
	 */
	setTurnUpKey(value: string) {
		this.#keyNameMapper.turnUp = value;
	}

	/**
	 * 하향 회전 키를 설정합니다.
	 * @param value - 설정할 키 이름 (예: 'f')
	 */
	setTurnDownKey(value: string) {
		this.#keyNameMapper.turnDown = value;
	}

	// ==================== 업데이트 ====================
	/**
	 * 매 프레임마다 카메라 컨트롤러를 업데이트합니다.
	 * 키보드/마우스 입력을 처리하고 카메라 위치와 회전을 계산합니다.
	 *
	 * @param {View3D} view - 3D 뷰 객체
	 * @param {number} time - 현재 경과 시간 (밀리초)
	 */
	update(view: View3D, time: number): void {
		super.update(view, time, () => {
			this.#updateAnimation(view, time);
		});
	}

	// ==================== Private Methods ====================
	#initListener() {
		const {redGPUContext} = this;
		this.#targetMesh = new Mesh(redGPUContext);
	}

	#updateAnimation(view: View3D, time: number) {
		const tDelay = this.#moveDelayInterpolation;
		const tDelayRotation = this.#rotationInterpolation;
		const tDesirePosition = this.#desirePosition;
		const targetMesh = this.#targetMesh;
		// 회전 보간
		targetMesh.rotationY += (this.#pan - targetMesh.rotationY) * tDelayRotation;
		targetMesh.rotationX += (this.#tilt - targetMesh.rotationX) * tDelayRotation;
		// 키보드 입력 체크 및 이동 계산
		if (this.#checkKeyboardKeyBuffer(view)) {
			tMTX0 = targetMesh.modelMatrix;
			// 이동 방향 계산 (회전 고려)
			mat4.identity(displacementMTX);
			mat4.rotateY(displacementMTX, displacementMTX, targetMesh.rotationY * PER_PI);
			mat4.rotateX(displacementMTX, displacementMTX, targetMesh.rotationX * PER_PI);
			mat4.translate(displacementMTX, displacementMTX, displacementVec3);
			// 최종 위치 계산
			mat4.identity(tMTX0);
			mat4.translate(tMTX0, tMTX0, targetMesh.position);
			mat4.multiply(tMTX0, tMTX0, displacementMTX);
			tDesirePosition[0] = tMTX0[12];
			tDesirePosition[1] = tMTX0[13];
			tDesirePosition[2] = tMTX0[14];
		}
		// 위치 보간
		targetMesh.x += (tDesirePosition[0] - targetMesh.x) * tDelay;
		targetMesh.y += (tDesirePosition[1] - targetMesh.y) * tDelay;
		targetMesh.z += (tDesirePosition[2] - targetMesh.z) * tDelay;
		// 회전 재적용
		targetMesh.rotationY += (this.#pan - targetMesh.rotationY) * tDelayRotation;
		targetMesh.rotationX += (this.#tilt - targetMesh.rotationX) * tDelayRotation;
		// 메시 모델 매트릭스 생성
		tMTX0 = targetMesh.modelMatrix;
		mat4.identity(tMTX0);
		mat4.translate(tMTX0, tMTX0, targetMesh.position);
		mat4.rotateY(tMTX0, tMTX0, targetMesh.rotationY * PER_PI);
		mat4.rotateX(tMTX0, tMTX0, targetMesh.rotationX * PER_PI);
		// 카메라를 메시 바로 뒤에 위치
		const tMTX1 = mat4.clone(tMTX0);
		mat4.translate(tMTX1, tMTX1, [0, 0, 0.01]);
		this.camera.setPosition(tMTX1[12], tMTX1[13], tMTX1[14]);
		this.camera.lookAt(targetMesh.x, targetMesh.y, targetMesh.z);
	}

	#checkKeyboardKeyBuffer(view: View3D): boolean {
		if (!this.checkKeyboardInput(view, this.#keyNameMapper)) return false;
		const {keyboardKeyBuffer} = view.redGPUContext;
		const tSpeed = this.#moveSpeed;
		const tSpeedRotation = this.#rotationSpeed;
		const tKeyNameMapper = this.#keyNameMapper;
		let move = false;
		let rotate = false;
		let pan = 0;
		let tilt = 0;
		displacementVec3[0] = 0;
		displacementVec3[1] = 0;
		displacementVec3[2] = 0;
		const tempAccelerationValue = this.#currentAcceleration * tSpeed;
		// 회전 입력
		if (keyboardKeyBuffer[tKeyNameMapper.turnLeft]) {
			rotate = true;
			pan = tSpeedRotation;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.turnRight]) {
			rotate = true;
			pan = -tSpeedRotation;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.turnUp]) {
			rotate = true;
			tilt = tSpeedRotation;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.turnDown]) {
			rotate = true;
			tilt = -tSpeedRotation;
		}
		// 이동 입력
		if (keyboardKeyBuffer[tKeyNameMapper.moveForward]) {
			move = true;
			displacementVec3[2] = -tempAccelerationValue;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.moveBack]) {
			move = true;
			displacementVec3[2] = tempAccelerationValue;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.moveLeft]) {
			move = true;
			displacementVec3[0] = -tempAccelerationValue;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.moveRight]) {
			move = true;
			displacementVec3[0] = tempAccelerationValue;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.moveUp]) {
			move = true;
			displacementVec3[1] = tempAccelerationValue;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.moveDown]) {
			move = true;
			displacementVec3[1] = -tempAccelerationValue;
		}
		// 가속도 계산
		if (rotate || move) {
			this.#currentAcceleration += 0.1;
			if (this.#currentAcceleration > this.#maxAcceleration) {
				this.#currentAcceleration = this.#maxAcceleration;
			}
		} else {
			this.#currentAcceleration -= 0.1;
			if (this.#currentAcceleration < 0) {
				this.#currentAcceleration = 0;
			}
		}
		if (rotate) {
			this.#pan += pan;
			this.#tilt += tilt;
		}
		return move || rotate;
	}
}

export default FreeController;
