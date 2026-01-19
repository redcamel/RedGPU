import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import OrthographicCamera from "../camera/OrthographicCamera";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;


/**
 * [KO] 등각 투영(Isometric) 시점을 제공하는 카메라 컨트롤러입니다.
 * [EN] Camera controller providing an isometric view.
 *
 * [KO] 거리감 없는 직교 투영을 사용하여 전략 시뮬레이션이나 타일 기반 게임에서 주로 사용되는 고정된 각도의 쿼터뷰(Quarter View)를 구현합니다.
 * [EN] Implements a fixed-angle quarter view, commonly used in strategy simulations or tile-based games, using orthographic projection without perspective distortion.
 *
 * * ### Example
 * ```typescript
 * const controller = new RedGPU.Camera.IsometricController(redGPUContext);
 * controller.viewHeight = 15;
 * controller.zoom = 1;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/isometricController/"></iframe>
 * @category Controller
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
	 * [KO] IsometricController 생성자
	 * [EN] IsometricController constructor
	 *
	 * @param redGPUContext -
	 * [KO] RedGPUContext 인스턴스
	 * [EN] RedGPUContext instance
	 */
	constructor(redGPUContext: RedGPUContext,) {
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
	 * [KO] 줌 레벨을 가져옵니다.
	 * [EN] Gets the zoom level.
	 *
	 * @returns
	 * [KO] 줌 레벨 (기본값: 1)
	 * [EN] Zoom level (default: 1)
	 */
	get zoom(): number {
		return this.#targetZoom;
	}

	/**
	 * [KO] 줌 레벨을 설정합니다. minZoom ~ maxZoom 범위로 제한됩니다.
	 * [EN] Sets the zoom level. Limited to minZoom ~ maxZoom range.
	 *
	 * @param value -
	 * [KO] 줌 레벨 값
	 * [EN] Zoom level value
	 */
	set zoom(value: number) {
		validateNumberRange(value);
		value = Math.max(this.#minZoom, Math.min(this.#maxZoom, value));
		this.#targetZoom = value;
	}

	/**
	 * [KO] 줌 보간 계수를 가져옵니다.
	 * [EN] Gets the zoom interpolation factor.
	 *
	 * @returns
	 * [KO] 줌 보간 계수 (0.01 ~ 1)
	 * [EN] Zoom interpolation factor (0.01 ~ 1)
	 */
	get zoomInterpolation(): number {
		return this.#zoomInterpolation;
	}

	/**
	 * [KO] 줌 보간 계수를 설정합니다. 낮을수록 부드러운 줌 이동
	 * [EN] Sets the zoom interpolation factor. Lower values for smoother zoom.
	 *
	 * @param value -
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	set zoomInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#zoomInterpolation = value;
	}

	/**
	 * [KO] 줌 속도를 가져옵니다.
	 * [EN] Gets the zoom speed.
	 *
	 * @returns
	 * [KO] 줌 속도
	 * [EN] Zoom speed
	 */
	get speedZoom(): number {
		return this.#speedZoom;
	}

	/**
	 * [KO] 줌 속도를 설정합니다. 높을수록 빠른 줌 속도
	 * [EN] Sets the zoom speed. Higher values for faster zoom.
	 *
	 * @param value -
	 * [KO] 줌 속도 (0.01 이상)
	 * [EN] Zoom speed (min 0.01)
	 */
	set speedZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedZoom = value;
	}

	/**
	 * [KO] 최소 줌 레벨을 가져옵니다.
	 * [EN] Gets the minimum zoom level.
	 *
	 * @returns
	 * [KO] 최소 줌 레벨
	 * [EN] Minimum zoom level
	 */
	get minZoom(): number {
		return this.#minZoom;
	}

	/**
	 * [KO] 최소 줌 레벨을 설정합니다.
	 * [EN] Sets the minimum zoom level.
	 *
	 * @param value -
	 * [KO] 최소 줌 레벨 (0.01 이상)
	 * [EN] Minimum zoom level (min 0.01)
	 */
	set minZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#minZoom = value;
		this.zoom = this.#targetZoom;
	}

	/**
	 * [KO] 최대 줌 레벨을 가져옵니다.
	 * [EN] Gets the maximum zoom level.
	 *
	 * @returns
	 * [KO] 최대 줌 레벨
	 * [EN] Maximum zoom level
	 */
	get maxZoom(): number {
		return this.#maxZoom;
	}

	/**
	 * [KO] 최대 줌 레벨을 설정합니다.
	 * [EN] Sets the maximum zoom level.
	 *
	 * @param value -
	 * [KO] 최대 줌 레벨 (0.01 이상)
	 * [EN] Maximum zoom level (min 0.01)
	 */
	set maxZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#maxZoom = value;
		this.zoom = this.#targetZoom;
	}

	// ==================== 뷰 높이 Getter/Setter ====================
	/**
	 * [KO] 직교 투영 카메라의 뷰 높이를 가져옵니다.
	 * [EN] Gets the view height of the orthographic camera.
	 *
	 * @returns
	 * [KO] 뷰 높이
	 * [EN] View height
	 */
	get viewHeight(): number {
		return this.#targetViewHeight;
	}

	/**
	 * [KO] 직교 투영 카메라의 뷰 높이를 설정합니다.
	 * [EN] Sets the view height of the orthographic camera.
	 *
	 * @param value -
	 * [KO] 뷰 높이 (0.1 이상)
	 * [EN] View height (min 0.1)
	 */
	set viewHeight(value: number) {
		validateNumberRange(value, 0.1);
		this.#targetViewHeight = value;
	}

	/**
	 * [KO] 뷰 높이 보간 계수를 가져옵니다.
	 * [EN] Gets the view height interpolation factor.
	 *
	 * @returns
	 * [KO] 뷰 높이 보간 계수 (0.01 ~ 1)
	 * [EN] View height interpolation factor (0.01 ~ 1)
	 */
	get viewHeightInterpolation(): number {
		return this.#viewHeightInterpolation;
	}

	/**
	 * [KO] 뷰 높이 보간 계수를 설정합니다. 낮을수록 부드러운 변화
	 * [EN] Sets the view height interpolation factor. Lower values for smoother transition.
	 *
	 * @param value -
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	set viewHeightInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#viewHeightInterpolation = value;
	}

	// ==================== 이동 속도 Getter/Setter ====================
	/**
	 * [KO] 키보드 이동 속도를 가져옵니다.
	 * [EN] Gets the keyboard movement speed.
	 *
	 * @returns
	 * [KO] 이동 속도
	 * [EN] Movement speed
	 */
	get moveSpeed(): number {
		return this.#moveSpeed;
	}

	/**
	 * [KO] 키보드 이동 속도를 설정합니다.
	 * [EN] Sets the keyboard movement speed.
	 *
	 * @param value -
	 * [KO] 이동 속도 (0.01 이상)
	 * [EN] Movement speed (min 0.01)
	 */
	set moveSpeed(value: number) {
		validateNumberRange(value, 0.01);
		this.#moveSpeed = value;
	}

	/**
	 * [KO] 키보드 이동 보간 계수를 가져옵니다.
	 * [EN] Gets the keyboard movement interpolation factor.
	 *
	 * @returns
	 * [KO] 이동 보간 계수 (0.01 ~ 1)
	 * [EN] Movement interpolation factor (0.01 ~ 1)
	 */
	get moveSpeedInterpolation(): number {
		return this.#moveSpeedInterpolation;
	}

	/**
	 * [KO] 키보드 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임
	 * [EN] Sets the keyboard movement interpolation factor. Lower values for smoother movement.
	 *
	 * @param value -
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	set moveSpeedInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#moveSpeedInterpolation = value;
	}

	/**
	 * [KO] 마우스 이동 속도를 가져옵니다.
	 * [EN] Gets the mouse movement speed.
	 *
	 * @returns
	 * [KO] 마우스 이동 속도
	 * [EN] Mouse movement speed
	 */
	get mouseMoveSpeed(): number {
		return this.#mouseMoveSpeed;
	}

	/**
	 * [KO] 마우스 이동 속도를 설정합니다.
	 * [EN] Sets the mouse movement speed.
	 *
	 * @param value -
	 * [KO] 마우스 이동 속도 (0.01 이상)
	 * [EN] Mouse movement speed (min 0.01)
	 */
	set mouseMoveSpeed(value: number) {
		validateNumberRange(value, 0.01);
		this.#mouseMoveSpeed = value;
	}

	/**
	 * [KO] 마우스 이동 보간 계수를 가져옵니다.
	 * [EN] Gets the mouse movement interpolation factor.
	 *
	 * @returns
	 * [KO] 마우스 이동 보간 계수 (0.01 ~ 1)
	 * [EN] Mouse movement interpolation factor (0.01 ~ 1)
	 */
	get mouseMoveSpeedInterpolation(): number {
		return this.#mouseMoveSpeedInterpolation;
	}

	/**
	 * [KO] 마우스 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임
	 * [EN] Sets the mouse movement interpolation factor. Lower values for smoother movement.
	 *
	 * @param value -
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	set mouseMoveSpeedInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#mouseMoveSpeedInterpolation = value;
	}

	// ==================== 키 매핑 Getter/Setter ====================
	/**
	 * [KO] 현재 키 매핑 설정을 가져옵니다.
	 * [EN] Gets the current key mapping configuration.
	 *
	 * @returns
	 * [KO] 키 매핑 객체의 복사본
	 * [EN] Copy of key mapping object
	 */
	get keyNameMapper() {
		return {...this.#keyNameMapper};
	}

	// ==================== 타겟 관련 ====================
	/**
	 * [KO] 타겟의 X축 위치를 가져옵니다.
	 * [EN] Gets the target's X-axis position.
	 *
	 * @returns
	 * [KO] X축 좌표
	 * [EN] X-axis coordinate
	 */
	get x(): number {
		return this.#targetMesh.x;
	}

	/**
	 * [KO] 타겟의 Y축 위치를 가져옵니다.
	 * [EN] Gets the target's Y-axis position.
	 *
	 * @returns
	 * [KO] Y축 좌표
	 * [EN] Y-axis coordinate
	 */
	get y(): number {
		return this.#targetMesh.y;
	}

	/**
	 * [KO] 타겟의 Z축 위치를 가져옵니다.
	 * [EN] Gets the target's Z-axis position.
	 *
	 * @returns
	 * [KO] Z축 좌표
	 * [EN] Z-axis coordinate
	 */
	get z(): number {
		return this.#targetMesh.z;
	}

	/**
	 * [KO] 상향 이동 키를 설정합니다.
	 * [EN] Sets the move up key.
	 *
	 * @param value -
	 * [KO] 설정할 키 이름
	 * [EN] Key name to set
	 */
	setMoveUpKey(value: string) {
		this.#keyNameMapper.moveUp = value;
	}

	/**
	 * [KO] 하향 이동 키를 설정합니다.
	 * [EN] Sets the move down key.
	 *
	 * @param value -
	 * [KO] 설정할 키 이름
	 * [EN] Key name to set
	 */
	setMoveDownKey(value: string) {
		this.#keyNameMapper.moveDown = value;
	}

	/**
	 * [KO] 좌측 이동 키를 설정합니다.
	 * [EN] Sets the move left key.
	 *
	 * @param value -
	 * [KO] 설정할 키 이름
	 * [EN] Key name to set
	 */
	setMoveLeftKey(value: string) {
		this.#keyNameMapper.moveLeft = value;
	}

	/**
	 * [KO] 우측 이동 키를 설정합니다.
	 * [EN] Sets the move right key.
	 *
	 * @param value -
	 * [KO] 설정할 키 이름
	 * [EN] Key name to set
	 */
	setMoveRightKey(value: string) {
		this.#keyNameMapper.moveRight = value;
	}

	// ==================== 업데이트 및 애니메이션 ====================
	/**
	 * [KO] 매 프레임마다 아이소메트릭 카메라를 업데이트합니다.
	 * [EN] Updates the isometric camera every frame.
	 *
	 * @param view -
	 * [KO] 카메라가 속한 3D 뷰
	 * [EN] 3D view the camera belongs to
	 * @param time -
	 * [KO] 현재 시간 (ms)
	 * [EN] Current time (ms)
	 */
	update(view: View3D, time: number): void {
		super.update(view, time, () => {
			this.#updateAnimation(view);
		});
	}

	/**
	 * [KO] 카메라 애니메이션을 업데이트합니다.
	 * [EN] Updates camera animation.
	 *
	 * @param view -
	 * [KO] 3D 뷰 객체
	 * [EN] 3D View object
	 * @internal
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
	 * [KO] 키보드 입력을 처리합니다.
	 * [EN] Handles keyboard input.
	 *
	 * @private
	 * @param view
	 * [KO] 3D 뷰 객체
	 * [EN] 3D View object
	 * @returns
	 * [KO] 입력이 있었는지 여부
	 * [EN] Whether there was input
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