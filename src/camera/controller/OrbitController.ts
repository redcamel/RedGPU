import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;
const ROTATION_THRESHOLD = 0.01;
const DISTANCE_THRESHOLD = 0.01;
const tempMatrix = mat4.create();

/**
 * 오빗(Orbit) 카메라 컨트롤러 클래스입니다.
 * 마우스/터치 드래그로 회전, 휠로 줌, 중심점/거리/회전/틸트 등 다양한 파라미터를 지원합니다.
 * 여러 View3D에서 동시에 사용할 수 있습니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const controller = new RedGPU.Camera.OrbitController(redGPUContext);
 * controller.centerX = 0;
 * controller.centerY = 0;
 * controller.centerZ = 0;
 * controller.distance = 20;
 * controller.tilt = -30;
 * controller.pan = 45;
 * ```
 */
class OrbitController extends AController {
	// ==================== 카메라 위치 및 중심점 ====================
	#centerX = 0;
	#centerY = 0;
	#centerZ = 0;
	// ==================== 거리(줌) 관련 ====================
	#distance = 15;
	#speedDistance = 2;
	#distanceInterpolation = 0.1;
	// ==================== 회전(팬/틸트) 관련 ====================
	#pan = 0;
	#tilt = -35;
	#speedRotation = 3;
	#rotationInterpolation = 0.1;
	#minTilt = -90;
	#maxTilt = 90;
	// ==================== 애니메이션 상태 ====================
	#currentPan = 0;
	#currentTilt = 0;
	#currentDistance = 0;

	// ==================== 라이프사이클 ====================
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext,
			{
				HD_Move: (deltaX: number, deltaY: number) => {
					this.#pan -= deltaX * this.#speedRotation * 0.1;
					this.#tilt -= deltaY * this.#speedRotation * 0.1;
				},
				HD_Wheel: (e: WheelEvent) => {
					this.#distance += e.deltaY / 100 * this.#speedDistance;
				},
				HD_TouchPinch: (deltaScale: number) => {
					const scaleChange = (deltaScale - 1) * this.#speedDistance;
					this.#distance -= scaleChange * this.#distance;
				},
			}
		)
		;
	}

	// ==================== 센터 좌표 Getter/Setter ====================
	get centerX(): number {
		return this.#centerX;
	}

	set centerX(value: number) {
		this.#centerX = value;
	}

	get centerY(): number {
		return this.#centerY;
	}

	set centerY(value: number) {
		this.#centerY = value;
	}

	get centerZ(): number {
		return this.#centerZ;
	}

	set centerZ(value: number) {
		this.#centerZ = value;
	}

	// ==================== 거리(줌) Getter/Setter ====================
	get distance(): number {
		return this.#distance;
	}

	set distance(value: number) {
		validateNumberRange(value, 0);
		this.#distance = value;
	}

	get speedDistance(): number {
		return this.#speedDistance;
	}

	set speedDistance(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedDistance = value;
	}

	get distanceInterpolation(): number {
		return this.#distanceInterpolation;
	}

	set distanceInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#distanceInterpolation = value;
	}

	// ==================== 회전 속도 Getter/Setter ====================
	get speedRotation(): number {
		return this.#speedRotation;
	}

	set speedRotation(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedRotation = value;
	}

	get rotationInterpolation(): number {
		return this.#rotationInterpolation;
	}

	set rotationInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#rotationInterpolation = value;
	}

	// ==================== 팬/틸트 Getter/Setter ====================
	get pan(): number {
		return this.#pan;
	}

	set pan(value: number) {
		this.#pan = value;
	}

	get tilt(): number {
		return this.#tilt;
	}

	set tilt(value: number) {
		validateNumberRange(value, -90, 90);
		this.#tilt = value;
	}

	get minTilt(): number {
		return this.#minTilt;
	}

	set minTilt(value: number) {
		validateNumberRange(value, -90, 90);
		this.#minTilt = value;
	}

	get maxTilt(): number {
		return this.#maxTilt;
	}

	set maxTilt(value: number) {
		validateNumberRange(value, -90, 90);
		this.#maxTilt = value;
	}

	// ==================== 업데이트 및 애니메이션 ====================
	update(view: View3D, time: number): void {
		super.update(view, time, () => {
			this.#updateAnimation();
		});
	}

	#updateAnimation(): void {
		// 틸트 범위 제한
		if (this.#tilt < this.#minTilt) this.#tilt = this.#minTilt;
		if (this.#tilt > this.#maxTilt) this.#tilt = this.#maxTilt;
		const {camera} = this;
		// 현재 값을 목표값으로 부드럽게 보간
		const panDelta = this.#pan - this.#currentPan;
		if (Math.abs(panDelta) > ROTATION_THRESHOLD) {
			this.#currentPan += panDelta * this.#rotationInterpolation;
		}
		// 틸트 보간
		const tiltDelta = this.#tilt - this.#currentTilt;
		if (Math.abs(tiltDelta) > ROTATION_THRESHOLD) {
			this.#currentTilt += tiltDelta * this.#rotationInterpolation;
		}
		// 거리(줌) 범위 및 보간
		if (this.#distance < camera.nearClipping) this.#distance = camera.nearClipping;
		const distanceDelta = this.#distance - this.#currentDistance;
		if (Math.abs(distanceDelta) > DISTANCE_THRESHOLD) {
			this.#currentDistance += distanceDelta * this.#distanceInterpolation;
		}
		if (this.#currentDistance < camera.nearClipping) this.#currentDistance = camera.nearClipping;
		// 카메라 위치 계산
		mat4.identity(tempMatrix);
		mat4.translate(tempMatrix, tempMatrix, [this.#centerX, this.#centerY, this.#centerZ]);
		mat4.rotateY(tempMatrix, tempMatrix, this.#currentPan * PER_PI);
		mat4.rotateX(tempMatrix, tempMatrix, this.#currentTilt * PER_PI);
		mat4.translate(tempMatrix, tempMatrix, [0, 0, this.#currentDistance]);
		// 카메라에 적용
		camera.x = tempMatrix[12];
		camera.y = tempMatrix[13];
		camera.z = tempMatrix[14];
		this.camera.lookAt(this.#centerX, this.#centerY, this.#centerZ);
	}
}

export default OrbitController;
