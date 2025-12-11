import {mat4, vec3} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";
// ==================== 모듈 레벨 상수 및 임시 변수 ====================
const PER_PI = Math.PI / 180;
const tempMat4 = mat4.create();
const localOffset = vec3.create();
const worldOffset = vec3.create();

/**
 * 타겟 메시를 따라다니는 카메라 컨트롤러(FollowController) 클래스입니다.
 * 타겟 메시의 위치를 기준으로 카메라가 일정 거리와 각도를 유지하며 자동 추적합니다.
 * 입력 상호작용 없이 순수하게 타겟만 따라다닙니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const targetMesh = new RedGPU.Mesh(redGPUContext, geometry, material);
 * const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
 * controller.distance = 10;
 * controller.height = 5;
 * controller.pan = 30;
 * controller.tilt = 20;
 * ```
 */
class FollowController extends AController {

	// ==================== Follow 관련 설정 ====================
	#distance: number = 10; // 타겟으로부터의 거리
	#height: number = 5;    // 타겟으로부터의 높이 오프셋
	#delay: number = 0.1;   // 카메라 이동 부드러움
	#pan: number = 0;       // 수평 회전 각도 오프셋
	#tilt: number = 20;     // 수직 회전 각도 (기본 20도)
	#followTargetRotation: boolean = true; // 타겟의 회전을 따라갈지 여부
	// ==================== 메시 관련 ====================
	#targetMesh: Mesh;
	// ==================== 카메라 현재 위치 (부드러운 이동용) ====================
	#currentCameraX: number = 0;
	#currentCameraY: number = 0;
	#currentCameraZ: number = 0;

	// ==================== 라이프사이클 ====================
	constructor(redGPUContext: RedGPUContext, targetMesh: Mesh) {
		super(redGPUContext, {});
		this.#targetMesh = targetMesh;
		this.#targetMesh.setIgnoreFrustumCullingRecursively(true);

		// 초기 카메라 위치 설정
		this.#initializeCameraPosition();
	}

	// ==================== Private 초기화 ====================
	#initializeCameraPosition() {
		const position = this.#calculateCameraPosition();
		this.#currentCameraX = position[0];
		this.#currentCameraY = position[1];
		this.#currentCameraZ = position[2];
	}

	#calculateCameraPosition(): vec3 {
		const targetMesh = this.#targetMesh;

		// 타겟의 로컬 좌표계에서의 카메라 오프셋 계산
		// followTargetRotation이 true면 타겟의 뒤쪽(-Z 방향)을 기준으로 계산
		if (this.#followTargetRotation) {
			// 로컬 오프셋: pan과 tilt를 고려한 상대 위치
			const panRad = this.#pan * PER_PI;
			const tiltRad = this.#tilt * PER_PI;

			// 로컬 좌표계: X(좌우), Y(상하), Z(전후)
			// -Z 방향이 타겟의 뒤쪽
			vec3.set(localOffset,
				Math.sin(panRad) * this.#distance * Math.cos(tiltRad),  // X: 좌우
				Math.sin(tiltRad) * this.#distance + this.#height,       // Y: 상하
				Math.cos(panRad) * this.#distance * Math.cos(tiltRad)   // Z: 전후 (뒤쪽)
			);

			// 타겟의 회전만 추출 (위치 제외)
			mat4.copy(tempMat4, targetMesh.modelMatrix);
			// 위치 성분 제거 (회전 + 스케일만 유지)
			tempMat4[12] = 0;
			tempMat4[13] = 0;
			tempMat4[14] = 0;

			// localOffset을 회전된 방향으로 변환
			vec3.transformMat4(worldOffset, localOffset, tempMat4);

			// 타겟의 월드 위치에 회전된 오프셋 추가
			return vec3.fromValues(
				targetMesh.x + worldOffset[0],
				targetMesh.y + worldOffset[1],
				targetMesh.z + worldOffset[2]
			);
		} else {
			// followTargetRotation이 false면 월드 좌표계 기준으로 계산
			const panRad = this.#pan * PER_PI;
			const tiltRad = this.#tilt * PER_PI;

			return vec3.fromValues(
				targetMesh.x + this.#distance * Math.cos(tiltRad) * Math.sin(panRad),
				targetMesh.y + this.#height + this.#distance * Math.sin(tiltRad),
				targetMesh.z + this.#distance * Math.cos(tiltRad) * Math.cos(panRad)
			);
		}
	}

	// ==================== 거리(Distance) Getter/Setter ====================
	get distance(): number {
		return this.#distance;
	}

	set distance(value: number) {
		validateNumberRange(value, 0.1);
		this.#distance = value;
	}

	// ==================== 높이(Height) Getter/Setter ====================
	get height(): number {
		return this.#height;
	}

	set height(value: number) {
		validateNumber(value);
		this.#height = value;
	}

	// ==================== 회전(Rotation) Getter/Setter ====================
	get pan(): number {
		return this.#pan;
	}

	set pan(value: number) {
		validateNumber(value);
		this.#pan = value;
	}

	get tilt(): number {
		return this.#tilt;
	}

	set tilt(value: number) {
		validateNumber(value);
		this.#tilt = Math.max(-89, Math.min(89, value));
	}

	// ==================== 이동 딜레이 Getter/Setter ====================
	get delay(): number {
		return this.#delay;
	}

	set delay(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delay = value;
	}

	// ==================== 타겟 회전 추적 Getter/Setter ====================
	get followTargetRotation(): boolean {
		return this.#followTargetRotation;
	}

	set followTargetRotation(value: boolean) {
		this.#followTargetRotation = value;
	}

	// ==================== 타겟 메시 Getter/Setter ====================
	get targetMesh(): Mesh {
		return this.#targetMesh;
	}

	set targetMesh(value: Mesh) {
		if (!value) {
			throw new Error('FollowController: targetMesh cannot be null or undefined');
		}
		this.#targetMesh = value;
		this.#targetMesh.setIgnoreFrustumCullingRecursively(true);
		// 타겟 변경 시 카메라 위치 재초기화
		this.#initializeCameraPosition();
	}


	// ==================== 업데이트 ====================
	update(view: View3D, time: number): void {
		super.update(view, time, () => {
			this.#updateAnimation(view, time);
		});
	}

	// ==================== Private Methods ====================
	#updateAnimation(view: View3D, time: number) {
		const targetMesh = this.#targetMesh;
		const height = this.#height;
		const delay = this.#delay;

		// 카메라의 목표 위치 계산 (매트릭스 기반)
		const desiredPosition = this.#calculateCameraPosition();

		// 부드러운 이동 (Lerp)
		this.#currentCameraX += (desiredPosition[0] - this.#currentCameraX) * delay;
		this.#currentCameraY += (desiredPosition[1] - this.#currentCameraY) * delay;
		this.#currentCameraZ += (desiredPosition[2] - this.#currentCameraZ) * delay;

		// 카메라 위치 설정
		this.camera.setPosition(this.#currentCameraX, this.#currentCameraY, this.#currentCameraZ);

		// 카메라가 타겟을 바라보도록 설정
		this.camera.lookAt(targetMesh.x, targetMesh.y + height * 0.5, targetMesh.z);
	}

}

export default FollowController;
