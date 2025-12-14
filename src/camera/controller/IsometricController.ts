import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import OrthographicCamera from "../camera/OrthographicCamera";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;


/**
 * 아이소메트릭(Isometric) 카메라 컨트롤러 클래스입니다.
 * 고정된 각도의 직교 투영 카메라로 타겟 오브젝트를 추적합니다.
 * 마우스 휠로 줌 인/아웃이 가능하며, 키보드로 타겟을 이동할 수 있습니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const controller = new RedGPU.Camera.IsometricController(redGPUContext);
 * controller.cameraDistance = 15;
 * controller.cameraAngle = 45;
 * controller.zoom = 1;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/isometricController/"></iframe>
 */
class IsometricController extends AController {
	// ==================== 카메라 위치 및 각도 ====================
	#cameraAngle: number = 45;
	// ==================== 줌 관련 ====================
	#currentZoom: number = 1;
	#targetZoom: number = 1;
	#zoomInterpolation: number = 0.1;
	#speedZoom: number = 0.1;
	#minZoom: number = 0.5;
	#maxZoom: number = 3;
	// ==================== 카메라 뷰 (OrthographicCamera) ====================
	#currentViewHeight: number = 15;
	#targetViewHeight: number = 15;
	#viewHeightInterpolation: number = 0.1;
	// ==================== 타겟 추적 ====================
	#targetMesh: Mesh | null = null;
	#targetX: number = 0;
	#targetZ: number = 0;
	// ==================== 이동 관련 ====================
	#moveSpeed: number = 0.25;
	#moveSpeedInterpolation: number = 0.2;
	#keyNameMapper = {
		moveUp: 'w',
		moveDown: 's',
		moveLeft: 'a',
		moveRight: 'd'
	};
	#mouseMoveSpeed: number = 1;
	#mouseMoveSpeedInterpolation: number = 0.2;

	// ==================== 라이프사이클 ====================
	/**
	 * IsometricController 생성자
	 * @param redGPUContext - RedGPUContext 인스턴스
	 */
	constructor(redGPUContext: RedGPUContext, ) {
		super(redGPUContext, {
			camera: new OrthographicCamera(),
			HD_Wheel: (e: WheelEvent) => {
				// 줌 처리
				this.#targetZoom -= (e.deltaY / 100) * this.#speedZoom;
				this.#targetZoom = Math.max(this.#minZoom, Math.min(this.#maxZoom, this.#targetZoom));
			},
			HD_Move: (deltaX: number, deltaY: number) => {
				if (!this.#targetMesh) return;
				const angleRad = this.#cameraAngle * PER_PI;
				const cos = Math.cos(angleRad);
				const sin = Math.sin(angleRad);

				const effectiveHeight = this.#currentViewHeight / this.#currentZoom;

				// 픽셀당 월드 단위 계산
				const worldPerPixel = effectiveHeight / redGPUContext.boundingClientRect.height;

				// 마우스 이동량을 월드 좌표로 변환
				const mouseDeltaX = deltaX * worldPerPixel;
				const mouseDeltaY = deltaY * worldPerPixel;

				// 카메라 각도 기반 좌표 변환
				const worldDeltaX = -(mouseDeltaX * cos) - (mouseDeltaY * sin);
				const worldDeltaZ = -(mouseDeltaX * (-sin)) - (mouseDeltaY * cos);

				// 목표 위치 업데이트
				this.#targetX += worldDeltaX;
				this.#targetZ += worldDeltaZ;
			},
			HD_TouchPinch: (deltaScale: number) => {
				this.#targetZoom /= deltaScale;
				this.#targetZoom = Math.max(this.#minZoom, Math.min(this.#maxZoom, this.#targetZoom));
			},
			useKeyboard: true
		});
		this.#targetMesh = new Mesh(redGPUContext);
	}

	// ==================== 카메라 각도 Getter/Setter ====================

	// ==================== 줌 Getter/Setter ====================
	/**
	 * 줌 레벨을 가져옵니다.
	 * @returns {number} 줌 레벨 (기본값: 1)
	 */
	get zoom(): number {
		return this.#targetZoom;
	}

	/**
	 * 줌 레벨을 설정합니다. minZoom ~ maxZoom 범위로 제한됩니다.
	 * @param {number} value - 줌 레벨 값
	 */
	set zoom(value: number) {
		validateNumberRange(value);
		value = Math.max(this.#minZoom, Math.min(this.#maxZoom, value));
		this.#targetZoom = value;
	}

	/**
	 * 줌 보간 계수를 가져옵니다.
	 * @returns {number} 줌 보간 계수 (0.01 ~ 1)
	 */
	get zoomInterpolation(): number {
		return this.#zoomInterpolation;
	}

	/**
	 * 줌 보간 계수를 설정합니다. 낮을수록 부드러운 줌 이동
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set zoomInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#zoomInterpolation = value;
	}

	/**
	 * 줌 속도를 가져옵니다.
	 * @returns {number} 줌 속도
	 */
	get speedZoom(): number {
		return this.#speedZoom;
	}

	/**
	 * 줌 속도를 설정합니다. 높을수록 빠른 줌 속도
	 * @param {number} value - 줌 속도 (0.01 이상)
	 */
	set speedZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedZoom = value;
	}

	/**
	 * 최소 줌 레벨을 가져옵니다.
	 * @returns {number} 최소 줌 레벨
	 */
	get minZoom(): number {
		return this.#minZoom;
	}

	/**
	 * 최소 줌 레벨을 설정합니다.
	 * @param {number} value - 최소 줌 레벨 (0.01 이상)
	 */
	set minZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#minZoom = value;
		this.zoom = this.#targetZoom;
	}

	/**
	 * 최대 줌 레벨을 가져옵니다.
	 * @returns {number} 최대 줌 레벨
	 */
	get maxZoom(): number {
		return this.#maxZoom;
	}

	/**
	 * 최대 줌 레벨을 설정합니다.
	 * @param {number} value - 최대 줌 레벨 (0.01 이상)
	 */
	set maxZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#maxZoom = value;
		this.zoom = this.#targetZoom;
	}

	// ==================== 뷰 높이 Getter/Setter ====================
	/**
	 * 직교 투영 카메라의 뷰 높이를 가져옵니다.
	 * @returns {number} 뷰 높이
	 */
	get viewHeight(): number {
		return this.#targetViewHeight;
	}

	/**
	 * 직교 투영 카메라의 뷰 높이를 설정합니다.
	 * @param {number} value - 뷰 높이 (0.1 이상)
	 */
	set viewHeight(value: number) {
		validateNumberRange(value, 0.1);
		this.#targetViewHeight = value;
	}

	/**
	 * 뷰 높이 보간 계수를 가져옵니다.
	 * @returns {number} 뷰 높이 보간 계수 (0.01 ~ 1)
	 */
	get viewHeightInterpolation(): number {
		return this.#viewHeightInterpolation;
	}

	/**
	 * 뷰 높이 보간 계수를 설정합니다. 낮을수록 부드러운 변화
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set viewHeightInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#viewHeightInterpolation = value;
	}

	// ==================== 이동 속도 Getter/Setter ====================
	/**
	 * 키보드 이동 속도를 가져옵니다.
	 * @returns {number} 이동 속도
	 */
	get moveSpeed(): number {
		return this.#moveSpeed;
	}

	/**
	 * 키보드 이동 속도를 설정합니다.
	 * @param {number} value - 이동 속도 (0.01 이상)
	 */
	set moveSpeed(value: number) {
		validateNumberRange(value, 0.01);
		this.#moveSpeed = value;
	}

	/**
	 * 키보드 이동 보간 계수를 가져옵니다.
	 * @returns {number} 이동 보간 계수 (0.01 ~ 1)
	 */
	get moveSpeedInterpolation(): number {
		return this.#moveSpeedInterpolation;
	}

	/**
	 * 키보드 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set moveSpeedInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#moveSpeedInterpolation = value;
	}

	/**
	 * 마우스 이동 속도를 가져옵니다.
	 * @returns {number} 마우스 이동 속도
	 */
	get mouseMoveSpeed(): number {
		return this.#mouseMoveSpeed;
	}

	/**
	 * 마우스 이동 속도를 설정합니다.
	 * @param {number} value - 마우스 이동 속도 (0.01 이상)
	 */
	set mouseMoveSpeed(value: number) {
		validateNumberRange(value, 0.01);
		this.#mouseMoveSpeed = value;
	}

	/**
	 * 마우스 이동 보간 계수를 가져옵니다.
	 * @returns {number} 마우스 이동 보간 계수 (0.01 ~ 1)
	 */
	get mouseMoveSpeedInterpolation(): number {
		return this.#mouseMoveSpeedInterpolation;
	}

	/**
	 * 마우스 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set mouseMoveSpeedInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#mouseMoveSpeedInterpolation = value;
	}

	// ==================== 키 매핑 Getter/Setter ====================
	/**
	 * 현재 키 매핑 설정을 가져옵니다.
	 * @returns {Object} 키 매핑 객체의 복사본
	 */
	get keyNameMapper() {
		return {...this.#keyNameMapper};
	}

	/**
	 * 상향 이동 키를 설정합니다.
	 * @param {string} value - 설정할 키 이름
	 */
	setMoveUpKey(value: string) {
		this.#keyNameMapper.moveUp = value;
	}

	/**
	 * 하향 이동 키를 설정합니다.
	 * @param {string} value - 설정할 키 이름
	 */
	setMoveDownKey(value: string) {
		this.#keyNameMapper.moveDown = value;
	}

	/**
	 * 좌측 이동 키를 설정합니다.
	 * @param {string} value - 설정할 키 이름
	 */
	setMoveLeftKey(value: string) {
		this.#keyNameMapper.moveLeft = value;
	}

	/**
	 * 우측 이동 키를 설정합니다.
	 * @param {string} value - 설정할 키 이름
	 */
	setMoveRightKey(value: string) {
		this.#keyNameMapper.moveRight = value;
	}

	// ==================== 타겟 관련 ====================
	/**
	 * 타겟의 X축 위치를 가져옵니다.
	 * @returns {number} X축 좌표
	 */
	get x(): number {
		return this.#targetMesh.x;
	}

	/**
	 * 타겟의 Y축 위치를 가져옵니다.
	 * @returns {number} Y축 좌표
	 */
	get y(): number {
		return this.#targetMesh.y;
	}

	/**
	 * 타겟의 Z축 위치를 가져옵니다.
	 * @returns {number} Z축 좌표
	 */
	get z(): number {
		return this.#targetMesh.z;
	}

	// ==================== 업데이트 및 애니메이션 ====================
	/**
	 * 매 프레임마다 아이소메트릭 카메라를 업데이트합니다.
	 * 줌, 뷰 높이, 타겟 위치를 보간하고 카메라 위치를 계산합니다.
	 *
	 * @param {View3D} view - 카메라가 속한 3D 뷰
	 * @param {number} time - 현재 시간 (ms)
	 */
	update(view: View3D, time: number): void {
		super.update(view, time, () => {
			this.#updateAnimation(view);
		});
	}

	/**
	 * 카메라 애니메이션을 업데이트합니다.
	 * 줌, 뷰 높이, 타겟 위치를 보간하고 직교 투영 뷰를 설정합니다.
	 *
	 * @private
	 * @param {View3D} view - 3D 뷰 객체
	 */
	#updateAnimation(view: View3D): void {
		this.#handleKeyboardInput(view);
		// 줌 보간 처리
		this.#currentZoom += (this.#targetZoom - this.#currentZoom) * this.#zoomInterpolation;
		// viewHeight 보간 처리
		this.#currentViewHeight += (this.#targetViewHeight - this.#currentViewHeight) * this.#viewHeightInterpolation;
		if (!this.#targetMesh) return;

		// 타겟 메시 위치 보간 처리 (키보드와 마우스 모두 동일한 보간 사용)
		this.#targetMesh.x += (this.#targetX - this.#targetMesh.x) * this.#moveSpeedInterpolation;
		this.#targetMesh.z += (this.#targetZ - this.#targetMesh.z) * this.#moveSpeedInterpolation;
		const targetPos = this.#targetMesh.position;
		const angleRad = this.#cameraAngle * PER_PI;
		// ==================== 직교 투영 뷰 계산 ====================
		const {width, height} = view.pixelRectObject;
		const aspectRatio = width / height;
		const effectiveHeight = this.#currentViewHeight / this.#currentZoom;
		const effectiveWidth = effectiveHeight * aspectRatio;
		const scaleFactor = this.#currentViewHeight / 15;  // viewHeight 기준
		const baseDistance = 15;  // 기본 거리 (viewHeight 기본값과 동일)
		const baseHeight = 12;    // 기본 높이
		// zoom과 viewHeight 변화에 모두 대응
		const cameraDistance = (baseDistance * scaleFactor) / this.#currentZoom;
		const cameraHeight = (baseHeight * scaleFactor) / this.#currentZoom;
		// ==================== 카메라 위치 계산 ====================
		const cameraX = targetPos[0] + Math.cos(angleRad) * cameraDistance;
		const cameraY = targetPos[1] + cameraHeight;
		const cameraZ = targetPos[2] + Math.sin(angleRad) * cameraDistance;
		this.camera.setPosition(cameraX, cameraY, cameraZ);
		this.camera.lookAt(targetPos[0], targetPos[1], targetPos[2]);
		// ==================== 직교 투영 범위 설정 ====================
		const orthoCamera = this.camera as OrthographicCamera;
		orthoCamera.left = -effectiveWidth / 2;
		orthoCamera.right = effectiveWidth / 2;
		orthoCamera.top = effectiveHeight / 2;
		orthoCamera.bottom = -effectiveHeight / 2;
	}

	/**
	 * 키보드 입력을 처리합니다.
	 * WASD 키 입력을 읽어 타겟 메시의 이동 목표를 업데이트합니다.
	 *
	 * @private
	 * @param {View3D} view - 3D 뷰 객체
	 * @returns {boolean} 입력이 있었는지 여부
	 */
	#handleKeyboardInput(view: View3D): boolean {
		if (!this.checkKeyboardInput(view, this.#keyNameMapper)) return false;
		if (!this.#targetMesh) return false;
		const {keyboardKeyBuffer} = view.redGPUContext;
		const tKeyNameMapper = this.#keyNameMapper;
		// ==================== 입력 수집 ====================
		let inputUp = 0;
		let inputDown = 0;
		let inputLeft = 0;
		let inputRight = 0;
		if (keyboardKeyBuffer[tKeyNameMapper.moveUp]) {
			inputUp = this.#moveSpeed;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.moveDown]) {
			inputDown = this.#moveSpeed;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.moveLeft]) {
			inputLeft = this.#moveSpeed;
		}
		if (keyboardKeyBuffer[tKeyNameMapper.moveRight]) {
			inputRight = this.#moveSpeed;
		}
		// ==================== 카메라 각도 기반 좌표 변환 ====================
		const angleRad = this.#cameraAngle * PER_PI;
		const cos = Math.cos(angleRad);
		const sin = Math.sin(angleRad);
		// 45도 회전 행렬 적용
		// [cos  -sin] [inputUp  ]   [상하 기여도]
		// [sin   cos] [inputLeft] = [좌우 기여도]
		const upDownDeltaX = (inputDown - inputUp) * cos;
		const upDownDeltaZ = (inputDown - inputUp) * sin;
		const leftRightDeltaX = (inputRight - inputLeft) * cos;
		const leftRightDeltaZ = (inputRight - inputLeft) * (-sin);
		// ==================== 최종 이동량 계산 ====================
		const worldDeltaX = upDownDeltaX + leftRightDeltaX;
		const worldDeltaZ = upDownDeltaZ + leftRightDeltaZ;
		// ==================== 목표 위치 업데이트 ====================
		this.#targetX += worldDeltaX;
		this.#targetZ += worldDeltaZ;
	}
}

export default IsometricController;
