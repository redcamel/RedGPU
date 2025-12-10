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
	#speed: number = 1;
	#delay: number = 0.1;
	#maxAcceleration: number = 3;
	#currentAcceleration: number = 0;
	// ==================== 회전 관련 설정 ====================
	#speedRotation: number = 1;
	#delayRotation: number = 0.1;
	// ==================== 위치 및 회전 상태 ====================
	#desirePosition: [number, number, number] = [0, 0, 0];
	#pan: number = 0;
	#tilt: number = 0;
	// ==================== 메시 및 입력 관련 ====================
	#targetMesh: Mesh;

	// ==================== 라이프사이클 ====================
	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			{
				HD_Move: (deltaX: number, deltaY: number) => {
					this.#pan -= deltaX * this.#speedRotation * 0.1;
					this.#tilt -= deltaY * this.#speedRotation * 0.1;
				},
				useKeyboard: true
			});
		this.#initListener();
	}

	// ==================== 위치(Position) Getter/Setter ====================
	get x(): number {
		return this.#targetMesh.x;
	}

	set x(value: number) {
		validateNumber(value);
		this.#targetMesh.x = value;
		this.#desirePosition[0] = value;
	}

	get y(): number {
		return this.#targetMesh.y;
	}

	set y(value: number) {
		validateNumber(value);
		this.#targetMesh.y = value;
		this.#desirePosition[1] = value;
	}

	get z(): number {
		return this.#targetMesh.z;
	}

	set z(value: number) {
		validateNumber(value);
		this.#targetMesh.z = value;
		this.#desirePosition[2] = value;
	}

	// ==================== 회전(Rotation) Getter/Setter ====================
	get pan(): number {
		return this.#pan;
	}

	set pan(value: number) {
		validateNumber(value);
		this.#targetMesh.rotationY = value;
		this.#pan = value;
	}

	get tilt(): number {
		return this.#tilt;
	}

	set tilt(value: number) {
		validateNumber(value);
		const clampedTilt = Math.max(-90, Math.min(90, value));
		this.#targetMesh.rotationX = clampedTilt;
		this.#tilt = clampedTilt;
	}

	// ==================== 이동 속도 Getter/Setter ====================
	get speed(): number {
		return this.#speed;
	}

	set speed(value: number) {
		validateNumberRange(value, 0.01);
		this.#speed = value;
	}

	get delay(): number {
		return this.#delay;
	}

	set delay(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delay = value;
	}

	// ==================== 회전 속도 Getter/Setter ====================
	get speedRotation(): number {
		return this.#speedRotation;
	}

	set speedRotation(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedRotation = value;
	}

	get delayRotation(): number {
		return this.#delayRotation;
	}

	set delayRotation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delayRotation = value;
	}

	// ==================== 가속도 Getter/Setter ====================
	get maxAcceleration(): number {
		return this.#maxAcceleration;
	}

	set maxAcceleration(value: number) {
		this.#maxAcceleration = value;
	}

	// ==================== 키 매핑 Getter/Setter ====================
	get keyNameMapper(): KeyNameMapper {
		return {...this.#keyNameMapper};
	}

	setMoveForwardKey(value: string) {
		this.#keyNameMapper.moveForward = value;
	}

	setMoveBackKey(value: string) {
		this.#keyNameMapper.moveBack = value;
	}

	setMoveLeftKey(value: string) {
		this.#keyNameMapper.moveLeft = value;
	}

	setMoveRightKey(value: string) {
		this.#keyNameMapper.moveRight = value;
	}

	setMoveUpKey(value: string) {
		this.#keyNameMapper.moveUp = value;
	}

	setMoveDownKey(value: string) {
		this.#keyNameMapper.moveDown = value;
	}

	setTurnLeftKey(value: string) {
		this.#keyNameMapper.turnLeft = value;
	}

	setTurnRightKey(value: string) {
		this.#keyNameMapper.turnRight = value;
	}

	setTurnUpKey(value: string) {
		this.#keyNameMapper.turnUp = value;
	}

	setTurnDownKey(value: string) {
		this.#keyNameMapper.turnDown = value;
	}

	// ==================== 업데이트 ====================
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
		const tDelay = this.#delay;
		const tDelayRotation = this.#delayRotation;
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
		const tSpeed = this.#speed;
		const tSpeedRotation = this.#speedRotation;
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
