import {mat4, vec3} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;
const tempMat4 = mat4.create();
const tempVec3 = vec3.create();

/**
 * [KO] 특정 타겟 메시를 추적하는 카메라 컨트롤러입니다.
 * [EN] Camera controller that tracks a specific target mesh.
 *
 * [KO] 3인칭 게임의 캐릭터 카메라처럼 타겟의 뒤를 쫓거나 주변을 회전하며 관찰하는 데 사용됩니다. 타겟의 이동과 회전을 부드럽게 따라가며, 거리와 높이, 각도를 조절하여 다양한 연출이 가능합니다.
 * [EN] Used to follow behind or rotate around a target, like a character camera in a 3rd person game. It smoothly tracks the target's movement and rotation, allowing for various cinematic effects by adjusting distance, height, and angles.
 *
 * @category Controller
 * @example
 * ```typescript
 * const followController = new new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
 * followController.distance = 15;
 * followController.height = 8;
 * followController.pan = 45;
 * followController.tilt = 30;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/followController/"></iframe>
 */
class FollowController extends AController {
	/**
	 * [KO] 현재 거리값 (카메라에서 타겟까지의 거리)
	 * [EN] Current distance value (distance from camera to target)
	 */
	#currentDistance: number = 10;
	/**
	 * [KO] 목표 거리값
	 * [EN] Target distance value
	 */
	#targetDistance: number = 10;
	/**
	 * [KO] 거리 보간 계수 (0.01 ~ 1)
	 * [EN] Distance interpolation factor (0.01 ~ 1)
	 */
	#distanceInterpolation: number = 0.1;

	/**
	 * [KO] 현재 높이값
	 * [EN] Current height value
	 */
	#currentHeight: number = 5;
	/**
	 * [KO] 목표 높이값
	 * [EN] Target height value
	 */
	#targetHeight: number = 5;
	/**
	 * [KO] 높이 보간 계수 (0.01 ~ 1)
	 * [EN] Height interpolation factor (0.01 ~ 1)
	 */
	#heightInterpolation: number = 0.1;

	/**
	 * [KO] 전체 보간 계수 (0.01 ~ 1)
	 * [EN] Overall interpolation factor (0.01 ~ 1)
	 */
	#interpolation: number = 1;

	/**
	 * [KO] 현재 팬(가로 회전) 각도 (도 단위)
	 * [EN] Current pan (horizontal rotation) angle (in degrees)
	 */
	#currentPan: number = 0;
	/**
	 * [KO] 목표 팬 각도
	 * [EN] Target pan angle
	 */
	#targetPan: number = 0;
	/**
	 * [KO] 팬 보간 계수 (0.01 ~ 1)
	 * [EN] Pan interpolation factor (0.01 ~ 1)
	 */
	#panInterpolation: number = 0.1;

	/**
	 * [KO] 현재 틸트(세로 회전) 각도 (도 단위)
	 * [EN] Current tilt (vertical rotation) angle (in degrees)
	 */
	#currentTilt: number = 20;
	/**
	 * [KO] 목표 틸트 각도
	 * [EN] Target tilt angle
	 */
	#targetTilt: number = 20;
	/**
	 * [KO] 틸트 보간 계수 (0.01 ~ 1)
	 * [EN] Tilt interpolation factor (0.01 ~ 1)
	 */
	#tiltInterpolation: number = 0.1;

	/**
	 * [KO] 타겟 메시의 회전을 따를지 여부
	 * [EN] Whether to follow the target mesh's rotation
	 */
	#followTargetRotation: boolean = true;
	/**
	 * [KO] 타겟으로부터 카메라의 X축 오프셋
	 * [EN] Camera X-axis offset from target
	 */
	#targetOffsetX: number = 0;
	/**
	 * [KO] 타겟으로부터 카메라의 Y축 오프셋
	 * [EN] Camera Y-axis offset from target
	 */
	#targetOffsetY: number = 0;
	/**
	 * [KO] 타겟으로부터 카메라의 Z축 오프셋
	 * [EN] Camera Z-axis offset from target
	 */
	#targetOffsetZ: number = 0;
	/**
	 * [KO] 따라갈 대상 메시
	 * [EN] Target mesh to follow
	 */
	#targetMesh: Mesh;
	/**
	 * [KO] 카메라의 현재 위치
	 * [EN] Current camera position
	 */
	#currentPos = vec3.create();

	/**
	 * [KO] FollowController 생성자
	 * [EN] FollowController constructor
	 *
	 * @param redGPUContext
	 * [KO] RedGPU 컨텍스트
	 * [EN] RedGPU Context
	 * @param targetMesh
	 * [KO] 따라갈 대상 메시
	 * [EN] Target mesh to follow
	 * @throws
	 * [KO] targetMesh가 null이거나 undefined일 경우 에러 발생
	 * [EN] Throws Error if targetMesh is null or undefined
	 */
	constructor(redGPUContext: RedGPUContext, targetMesh: Mesh) {
		super(redGPUContext, {
			HD_Wheel: (e: WheelEvent) => {
				this.#targetDistance += e.deltaY / 100;
			},
			HD_TouchPinch: (deltaScale: number) => {
				const scaleChange = (deltaScale - 1);
				this.#targetDistance -= scaleChange * this.#targetDistance;
			},
		});
		this.#targetMesh = targetMesh;
		this.#targetMesh.setIgnoreFrustumCullingRecursively(true);
		vec3.copy(this.#currentPos, this.#calculateCameraPosition());
	}

	/**
	 * [KO] 타겟으로부터의 카메라 거리를 가져옵니다.
	 * [EN] Gets the camera distance from the target.
	 *
	 * @returns
	 * [KO] 목표 거리 (0.1 이상)
	 * [EN] Target distance (min 0.1)
	 */
	get distance(): number {
		return this.#targetDistance;
	}

	/**
	 * [KO] 타겟으로부터의 카메라 거리를 설정합니다.
	 * [EN] Sets the camera distance from the target.
	 *
	 * @param value
	 * [KO] 설정할 거리 (0.1 이상)
	 * [EN] Distance to set (min 0.1)
	 */
	set distance(value: number) {
		validateNumberRange(value, 0.1);
		this.#targetDistance = value;
	}

	/**
	 * [KO] 거리 값의 보간 계수를 가져옵니다.
	 * [EN] Gets the interpolation factor for the distance value.
	 *
	 * @returns
	 * [KO] 거리 보간 계수 (0.01 ~ 1)
	 * [EN] Distance interpolation factor (0.01 ~ 1)
	 */
	get distanceInterpolation(): number {
		return this.#distanceInterpolation;
	}

	/**
	 * [KO] 거리 값의 보간 계수를 설정합니다.
	 * [EN] Sets the interpolation factor for the distance value.
	 *
	 * @param value
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	set distanceInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#distanceInterpolation = value;
	}

	/**
	 * [KO] 타겟으로부터의 카메라 높이를 가져옵니다.
	 * [EN] Gets the camera height from the target.
	 *
	 * @returns
	 * [KO] 목표 높이
	 * [EN] Target height
	 */
	get height(): number {
		return this.#targetHeight;
	}

	/**
	 * [KO] 타겟으로부터의 카메라 높이를 설정합니다.
	 * [EN] Sets the camera height from the target.
	 *
	 * @param value
	 * [KO] 설정할 높이
	 * [EN] Height to set
	 */
	set height(value: number) {
		validateNumber(value);
		this.#targetHeight = value;
	}

	/**
	 * [KO] 높이 값의 보간 계수를 가져옵니다.
	 * [EN] Gets the interpolation factor for the height value.
	 *
	 * @returns
	 * [KO] 높이 보간 계수 (0.01 ~ 1)
	 * [EN] Height interpolation factor (0.01 ~ 1)
	 */
	get heightInterpolation(): number {
		return this.#heightInterpolation;
	}

	/**
	 * [KO] 높이 값의 보간 계수를 설정합니다.
	 * [EN] Sets the interpolation factor for the height value.
	 *
	 * @param value
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	set heightInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#heightInterpolation = value;
	}

	/**
	 * [KO] 타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 가져옵니다.
	 * [EN] Gets the camera's horizontal rotation (pan) angle around the target.
	 *
	 * @returns
	 * [KO] 팬 각도 (도 단위)
	 * [EN] Pan angle (in degrees)
	 */
	get pan(): number {
		return this.#targetPan;
	}

	/**
	 * [KO] 타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 설정합니다.
	 * [EN] Sets the camera's horizontal rotation (pan) angle around the target.
	 *
	 * @param value
	 * [KO] 팬 각도 (도 단위)
	 * [EN] Pan angle (in degrees)
	 */
	set pan(value: number) {
		validateNumber(value);
		this.#targetPan = value;
	}

	/**
	 * [KO] 팬 값의 보간 계수를 가져옵니다.
	 * [EN] Gets the interpolation factor for the pan value.
	 *
	 * @returns
	 * [KO] 팬 보간 계수 (0.01 ~ 1)
	 * [EN] Pan interpolation factor (0.01 ~ 1)
	 */
	get panInterpolation(): number {
		return this.#panInterpolation;
	}

	/**
	 * [KO] 팬 값의 보간 계수를 설정합니다.
	 * [EN] Sets the interpolation factor for the pan value.
	 *
	 * @param value
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	set panInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#panInterpolation = value;
	}

	/**
	 * [KO] 타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 가져옵니다.
	 * [EN] Gets the camera's vertical rotation (tilt) angle around the target.
	 *
	 * @returns
	 * [KO] 틸트 각도 (도 단위, -89 ~ 89)
	 * [EN] Tilt angle (in degrees, -89 ~ 89)
	 */
	get tilt(): number {
		return this.#targetTilt;
	}

	/**
	 * [KO] 타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 설정합니다.
	 * [EN] Sets the camera's vertical rotation (tilt) angle around the target.
	 *
	 * @param value
	 * [KO] 틸트 각도 (도 단위)
	 * [EN] Tilt angle (in degrees)
	 */
	set tilt(value: number) {
		validateNumber(value);
		this.#targetTilt = Math.max(-89, Math.min(89, value));
	}

	/**
	 * [KO] 틸트 값의 보간 계수를 가져옵니다.
	 * [EN] Gets the interpolation factor for the tilt value.
	 *
	 * @returns
	 * [KO] 틸트 보간 계수 (0.01 ~ 1)
	 * [EN] Tilt interpolation factor (0.01 ~ 1)
	 */
	get tiltInterpolation(): number {
		return this.#tiltInterpolation;
	}

	/**
	 * [KO] 틸트 값의 보간 계수를 설정합니다.
	 * [EN] Sets the interpolation factor for the tilt value.
	 *
	 * @param value
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	set tiltInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#tiltInterpolation = value;
	}

	/**
	 * [KO] 전체 카메라 위치의 보간 계수를 가져옵니다.
	 * [EN] Gets the interpolation factor for the overall camera position.
	 *
	 * @returns
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	get interpolation(): number {
		return this.#interpolation;
	}

	/**
	 * [KO] 전체 카메라 위치의 보간 계수를 설정합니다.
	 * [EN] Sets the interpolation factor for the overall camera position.
	 *
	 * @param value
	 * [KO] 보간 계수 (0.01 ~ 1)
	 * [EN] Interpolation factor (0.01 ~ 1)
	 */
	set interpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#interpolation = value;
	}

	/**
	 * [KO] 타겟 메시의 회전을 따를지 여부를 가져옵니다.
	 * [EN] Gets whether to follow the target mesh's rotation.
	 *
	 * @returns
	 * [KO] true일 경우 타겟의 회전을 따름
	 * [EN] If true, follows the target's rotation
	 */
	get followTargetRotation(): boolean {
		return this.#followTargetRotation;
	}

	/**
	 * [KO] 타겟 메시의 회전을 따를지 여부를 설정합니다.
	 * [EN] Sets whether to follow the target mesh's rotation.
	 *
	 * @param value
	 * [KO] true일 경우 타겟의 회전을 따름
	 * [EN] If true, follows the target's rotation
	 */
	set followTargetRotation(value: boolean) {
		this.#followTargetRotation = value;
	}

	/**
	 * [KO] 타겟으로부터의 카메라 X축 오프셋을 가져옵니다.
	 * [EN] Gets the camera's X-axis offset from the target.
	 *
	 * @returns
	 * [KO] X축 오프셋
	 * [EN] X-axis offset
	 */
	get targetOffsetX(): number {
		return this.#targetOffsetX;
	}

	/**
	 * [KO] 타겟으로부터의 카메라 X축 오프셋을 설정합니다.
	 * [EN] Sets the camera's X-axis offset from the target.
	 *
	 * @param value
	 * [KO] X축 오프셋
	 * [EN] X-axis offset
	 */
	set targetOffsetX(value: number) {
		validateNumber(value);
		this.#targetOffsetX = value;
	}

	/**
	 * [KO] 타겟으로부터의 카메라 Y축 오프셋을 가져옵니다.
	 * [EN] Gets the camera's Y-axis offset from the target.
	 *
	 * @returns
	 * [KO] Y축 오프셋
	 * [EN] Y-axis offset
	 */
	get targetOffsetY(): number {
		return this.#targetOffsetY;
	}

	/**
	 * [KO] 타겟으로부터의 카메라 Y축 오프셋을 설정합니다.
	 * [EN] Sets the camera's Y-axis offset from the target.
	 *
	 * @param value
	 * [KO] Y축 오프셋
	 * [EN] Y-axis offset
	 */
	set targetOffsetY(value: number) {
		validateNumber(value);
		this.#targetOffsetY = value;
	}

	/**
	 * [KO] 타겟으로부터의 카메라 Z축 오프셋을 가져옵니다.
	 * [EN] Gets the camera's Z-axis offset from the target.
	 *
	 * @returns
	 * [KO] Z축 오프셋
	 * [EN] Z-axis offset
	 */
	get targetOffsetZ(): number {
		return this.#targetOffsetZ;
	}

	/**
	 * [KO] 타겟으로부터의 카메라 Z축 오프셋을 설정합니다.
	 * [EN] Sets the camera's Z-axis offset from the target.
	 *
	 * @param value
	 * [KO] Z축 오프셋
	 * [EN] Z-axis offset
	 */
	set targetOffsetZ(value: number) {
		validateNumber(value);
		this.#targetOffsetZ = value;
	}

	/**
	 * [KO] 따라갈 대상 메시를 가져옵니다.
	 * [EN] Gets the target mesh to follow.
	 *
	 * @returns
	 * [KO] 현재 타겟 메시
	 * [EN] Current target mesh
	 */
	get targetMesh(): Mesh {
		return this.#targetMesh;
	}

	/**
	 * [KO] 따라갈 대상 메시를 설정합니다.
	 * [EN] Sets the target mesh to follow.
	 *
	 * @param value
	 * [KO] 설정할 타겟 메시
	 * [EN] Target mesh to set
	 * @throws
	 * [KO] value가 null이거나 undefined일 경우 에러 발생
	 * [EN] Throws Error if value is null or undefined
	 */
	set targetMesh(value: Mesh) {
		if (!value) throw new Error('FollowController: targetMesh cannot be null or undefined');
		this.#targetMesh = value;
		this.#targetMesh.setIgnoreFrustumCullingRecursively(true);
		vec3.copy(this.#currentPos, this.#calculateCameraPosition());
	}

	/**
	 * [KO] 카메라의 타겟 오프셋을 한 번에 설정합니다.
	 * [EN] Sets the camera's target offset at once.
	 *
	 * @param x
	 * [KO] X축 오프셋
	 * [EN] X-axis offset
	 * @param y
	 * [KO] Y축 오프셋 (기본값: 0)
	 * [EN] Y-axis offset (default: 0)
	 * @param z
	 * [KO] Z축 오프셋 (기본값: 0)
	 * [EN] Z-axis offset (default: 0)
	 */
	setTargetOffset(x: number, y: number = 0, z: number = 0): void {
		validateNumber(x);
		validateNumber(y);
		validateNumber(z);
		this.#targetOffsetX = x;
		this.#targetOffsetY = y;
		this.#targetOffsetZ = z;
	}

	/**
	 * [KO] 매 프레임마다 카메라의 위치와 방향을 업데이트합니다.
	 * [EN] Updates the camera's position and orientation every frame.
	 *
	 * @param view
	 * [KO] 카메라가 속한 3D 뷰
	 * [EN] The 3D view the camera belongs to
	 * @param time
	 * [KO] 현재 시간 (ms)
	 * [EN] Current time (ms)
	 */
	update(view: View3D, time: number): void {

		super.update(view, time, () => {
			this.#currentDistance += (this.#targetDistance - this.#currentDistance) * this.#distanceInterpolation;
			this.#currentHeight += (this.#targetHeight - this.#currentHeight) * this.#heightInterpolation;
			this.#currentPan += (this.#targetPan - this.#currentPan) * this.#panInterpolation;
			this.#currentTilt += (this.#targetTilt - this.#currentTilt) * this.#tiltInterpolation;
			vec3.lerp(this.#currentPos, this.#currentPos, this.#calculateCameraPosition(), this.#interpolation);
			this.camera.setPosition(this.#currentPos[0], this.#currentPos[1], this.#currentPos[2]);

			const lookAt = this.#calculateLookAtTarget();
			this.camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
		});
	}

	/**
	 * [KO] 현재의 팬, 틸트, 거리, 높이 값을 기반으로 카메라 위치를 계산합니다.
	 * [EN] Calculates the camera position based on current pan, tilt, distance, and height values.
	 *
	 * @returns
	 * [KO] 계산된 카메라 월드 위치
	 * [EN] Calculated camera world position
	 * @internal
	 */
	#calculateCameraPosition(): vec3 {
		const panRad = this.#currentPan * PER_PI;
		const tiltRad = this.#currentTilt * PER_PI;
		const cosT = Math.cos(tiltRad);
		const sinT = Math.sin(tiltRad);
		const cosP = Math.cos(panRad);
		const sinP = Math.sin(panRad);

		// 타겟 메시의 월드 위치 가져오기
		const worldMatrix = this.#targetMesh.modelMatrix;
		const targetWorldX = worldMatrix[12];
		const targetWorldY = worldMatrix[13];
		const targetWorldZ = worldMatrix[14];

		if (this.#followTargetRotation) {
			vec3.set(tempVec3,
				sinP * this.#currentDistance * cosT,
				sinT * this.#currentDistance + this.#currentHeight,
				cosP * this.#currentDistance * cosT
			);

			// 회전만 적용 (이동 제거)
			mat4.copy(tempMat4, worldMatrix);
			tempMat4[12] = tempMat4[13] = tempMat4[14] = 0;
			vec3.transformMat4(tempVec3, tempVec3, tempMat4);

			return vec3.fromValues(
				targetWorldX + tempVec3[0],
				targetWorldY + tempVec3[1],
				targetWorldZ + tempVec3[2]
			);
		}

		return vec3.fromValues(
			targetWorldX + this.#currentDistance * cosT * sinP,
			targetWorldY + this.#currentHeight + this.#currentDistance * sinT,
			targetWorldZ + this.#currentDistance * cosT * cosP
		);
	}

	/**
	 * [KO] 카메라가 바라볼 타겟 위치를 계산합니다.
	 * [EN] Calculates the target position the camera will look at.
	 *
	 * @returns
	 * [KO] 카메라가 바라볼 타겟의 월드 위치
	 * [EN] World position of the target the camera will look at
	 * @internal
	 */
	#calculateLookAtTarget(): vec3 {
		vec3.set(tempVec3, this.#targetOffsetX, this.#targetOffsetY, this.#targetOffsetZ);

		const worldMatrix = this.#targetMesh.modelMatrix;
		const targetWorldX = worldMatrix[12];
		const targetWorldY = worldMatrix[13];
		const targetWorldZ = worldMatrix[14];

		if (this.#followTargetRotation && (this.#targetOffsetX !== 0 || this.#targetOffsetY !== 0 || this.#targetOffsetZ !== 0)) {
			// 회전만 적용 (이동 제거)
			mat4.copy(tempMat4, worldMatrix);
			tempMat4[12] = tempMat4[13] = tempMat4[14] = 0;
			vec3.transformMat4(tempVec3, tempVec3, tempMat4);
		}

		return vec3.fromValues(
			targetWorldX + tempVec3[0],
			targetWorldY + tempVec3[1],
			targetWorldZ + tempVec3[2]
		);
	}

}

export default FollowController;