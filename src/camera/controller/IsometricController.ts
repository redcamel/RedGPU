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
 */
class IsometricController extends AController {
	// ==================== 카메라 위치 및 각도 ====================
	#cameraAngle: number = 45;
	// ==================== 줌 관련 ====================
	#zoom: number = 1;
	#speedZoom: number = 0.1;
	#minZoom: number = 0.5;
	#maxZoom: number = 3;
	// ==================== 카메라 뷰 (OrthographicCamera) ====================
	#viewHeight: number = 15;
	// ==================== 타겟 추적 ====================
	#targetMesh: Mesh | null = null;
	// ==================== 이동 관련 ====================
	#moveSpeed: number = 0.2;
	#keyNameMapper = {
		moveUp: 'w',
		moveDown: 's',
		moveLeft: 'a',
		moveRight: 'd'
	};
	#mouseMoveSpeed: number = 0.05;

	// ==================== 라이프사이클 ====================
	/**
	 * IsometricController 생성자
	 * @param redGPUContext - RedGPUContext 인스턴스
	 * @param targetMesh - 추적할 타겟 메시
	 */
	constructor(redGPUContext: RedGPUContext, targetMesh?: Mesh) {
		super(redGPUContext, {
			camera: new OrthographicCamera(),
			HD_Wheel: (e: WheelEvent) => {
				// 줌 처리
				this.zoom -= (e.deltaY / 100) * this.#speedZoom;
			},
			HD_Move: (deltaX: number, deltaY: number) => {
				if (!this.#targetMesh) return;
				const angleRad = this.#cameraAngle * PER_PI;
				const cos = Math.cos(angleRad);
				const sin = Math.sin(angleRad);
// 마우스 이동량을 월드 좌표로 변환
				const mouseDeltaX = deltaX * this.#mouseMoveSpeed;
				const mouseDeltaY = deltaY * this.#mouseMoveSpeed;
// 카메라 각도 기반 좌표 변환
				const worldDeltaX = -(mouseDeltaX * cos) - (mouseDeltaY * sin);
				const worldDeltaZ = -(mouseDeltaX * (-sin)) - (mouseDeltaY * cos);
// 타겟 위치 업데이트
				this.#targetMesh.x += worldDeltaX;
				this.#targetMesh.z += worldDeltaZ;
			},
			HD_TouchPinch: (deltaScale: number) => {
				this.zoom /= deltaScale
			},
			useKeyboard: true
		});
		this.#targetMesh = targetMesh || new Mesh(redGPUContext);
		this.#targetMesh.setIgnoreFrustumCullingRecursively(true)
	}

	// ==================== 카메라 각도 Getter/Setter ====================
	get cameraAngle(): number {
		return this.#cameraAngle;
	}

	// ==================== 줌 Getter/Setter ====================
	get zoom(): number {
		return this.#zoom;
	}

	set zoom(value: number) {
		validateNumberRange(value);
		value = Math.max(this.#minZoom, Math.min(this.#maxZoom, value))
		this.#zoom = value
	}

	get speedZoom(): number {
		return this.#speedZoom;
	}

	set speedZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedZoom = value;
	}

	get minZoom(): number {
		return this.#minZoom;
	}

	set minZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#minZoom = value;
		this.zoom = this.#zoom;
	}

	get maxZoom(): number {
		return this.#maxZoom;
	}

	set maxZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#maxZoom = value;
		this.zoom = this.#zoom;
	}

	// ==================== 뷰 높이 Getter/Setter ====================
	get viewHeight(): number {
		return this.#viewHeight;
	}

	set viewHeight(value: number) {
		validateNumberRange(value, 0.1);
		this.#viewHeight = value;
	}

	// ==================== 이동 속도 Getter/Setter ====================
	get moveSpeed(): number {
		return this.#moveSpeed;
	}

	set moveSpeed(value: number) {
		validateNumberRange(value, 0.01);
		this.#moveSpeed = value;
	}

	get mouseMoveSpeed(): number {
		return this.#mouseMoveSpeed;
	}

	set mouseMoveSpeed(value: number) {
		validateNumberRange(value, 0.01);
		this.#mouseMoveSpeed = value;
	}

	// ==================== 키 매핑 Getter/Setter ====================
	get keyNameMapper() {
		return {...this.#keyNameMapper};
	}

	// ==================== 타겟 관련 ====================
	get targetMesh(): Mesh | null {
		return this.#targetMesh;
	}

	set targetObject(target: Mesh) {
		this.#targetMesh = target || new Mesh(this.redGPUContext);
	}

	setMoveUpKey(value: string) {
		this.#keyNameMapper.moveUp = value;
	}

	setMoveDownKey(value: string) {
		this.#keyNameMapper.moveDown = value;
	}

	setMoveLeftKey(value: string) {
		this.#keyNameMapper.moveLeft = value;
	}

	setMoveRightKey(value: string) {
		this.#keyNameMapper.moveRight = value;
	}

	// ==================== 업데이트 및 애니메이션 ====================
	update(view: View3D, time: number): void {
		super.update(view, time, () => {
			this.#updateAnimation(view);
		});
	}

	#updateAnimation(view: View3D): void {
		this.#handleKeyboardInput(view);
		if (!this.#targetMesh) return;
		const targetPos = this.#targetMesh.position;
		const angleRad = this.#cameraAngle * PER_PI;
		// ==================== 직교 투영 뷰 계산 ====================
		const {width, height} = view.pixelRectObject;
		const aspectRatio = width / height;
		const effectiveHeight = this.#viewHeight / this.#zoom;
		const effectiveWidth = effectiveHeight * aspectRatio;
		const scaleFactor = this.#viewHeight / 15;  // viewHeight 기준
		const baseDistance = 15;  // 기본 거리 (viewHeight 기본값과 동일)
		const baseHeight = 12;    // 기본 높이
		// zoom과 viewHeight 변화에 모두 대응
		const cameraDistance = (baseDistance * scaleFactor) / this.#zoom;
		const cameraHeight = (baseHeight * scaleFactor) / this.#zoom;
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
		// ==================== 타겟 위치 업데이트 ====================
		this.#targetMesh.x += worldDeltaX;
		this.#targetMesh.z += worldDeltaZ;
	}
}

export default IsometricController;
