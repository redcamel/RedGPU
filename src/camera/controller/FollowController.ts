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
 * 특정 타겟 메시를 따라다니는 3D 카메라 컨트롤러
 *
 * 카메라는 타겟 메시 주변을 구면 좌표계로 회전하며,
 * 거리(distance), 높이(height), 팬(pan), 틸트(tilt) 값을 통해 위치를 제어합니다.
 * 타겟 메시의 이동과 회전을 자동으로 추적하며, 부드러운 카메라 움직임을 위한
 * 보간(interpolation) 기능을 지원합니다.
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
	/** 현재 거리값 (카메라에서 타겟까지의 거리) */
	#currentDistance: number = 10;
	/** 목표 거리값 */
	#targetDistance: number = 10;
	/** 거리 보간 계수 (0.01 ~ 1) */
	#distanceInterpolation: number = 0.1;

	/** 현재 높이값 */
	#currentHeight: number = 5;
	/** 목표 높이값 */
	#targetHeight: number = 5;
	/** 높이 보간 계수 (0.01 ~ 1) */
	#heightInterpolation: number = 0.1;

	/** 전체 보간 계수 (0.01 ~ 1) */
	#interpolation: number = 1;

	/** 현재 팬(가로 회전) 각도 (도 단위) */
	#currentPan: number = 0;
	/** 목표 팬 각도 */
	#targetPan: number = 0;
	/** 팬 보간 계수 (0.01 ~ 1) */
	#panInterpolation: number = 0.1;

	/** 현재 틸트(세로 회전) 각도 (도 단위) */
	#currentTilt: number = 20;
	/** 목표 틸트 각도 */
	#targetTilt: number = 20;
	/** 틸트 보간 계수 (0.01 ~ 1) */
	#tiltInterpolation: number = 0.1;

	/** 타겟 메시의 회전을 따를지 여부 */
	#followTargetRotation: boolean = true;
	/** 타겟으로부터 카메라의 X축 오프셋 */
	#targetOffsetX: number = 0;
	/** 타겟으로부터 카메라의 Y축 오프셋 */
	#targetOffsetY: number = 0;
	/** 타겟으로부터 카메라의 Z축 오프셋 */
	#targetOffsetZ: number = 0;
	/** 따라갈 대상 메시 */
	#targetMesh: Mesh;
	/** 카메라의 현재 위치 */
	#currentPos = vec3.create();

	/**
	 * FollowController 생성자
	 *
	 * @param {RedGPUContext} redGPUContext - RedGPU 컨텍스트
	 * @param {Mesh} targetMesh - 따라갈 대상 메시
	 * @throws {Error} targetMesh가 null이거나 undefined일 경우 에러 발생
	 */
	constructor(redGPUContext: RedGPUContext, targetMesh: Mesh) {
		super(redGPUContext, {
			HD_Wheel: (e: WheelEvent) => {
				this.#targetDistance += e.deltaY / 100 ;
			},
			HD_TouchPinch: (deltaScale: number) => {
				const scaleChange = (deltaScale - 1) ;
				this.#targetDistance -= scaleChange * this.#targetDistance;
			},
		});
		this.#targetMesh = targetMesh;
		this.#targetMesh.setIgnoreFrustumCullingRecursively(true);
		vec3.copy(this.#currentPos, this.#calculateCameraPosition());
	}

	/**
	 * 현재의 팬, 틸트, 거리, 높이 값을 기반으로 카메라 위치를 계산합니다.
	 *
	 * 구면 좌표계를 사용하여 타겟 메시 주변의 카메라 위치를 계산하며,
	 * followTargetRotation이 활성화되어 있으면 타겟의 회전을 반영합니다.
	 *
	 * @returns {vec3} 계산된 카메라 월드 위치
	 * @private
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
	 * 타겟으로부터의 카메라 거리를 가져옵니다.
	 *
	 * @returns {number} 목표 거리 (0.1 이상)
	 */
	get distance(): number { return this.#targetDistance; }

	/**
	 * 타겟으로부터의 카메라 거리를 설정합니다.
	 *
	 * @param {number} value - 설정할 거리 (0.1 이상)
	 */
	set distance(value: number) {
		validateNumberRange(value, 0.1);
		this.#targetDistance = value;
	}

	/**
	 * 거리 값의 보간 계수를 가져옵니다.
	 *
	 * @returns {number} 거리 보간 계수 (0.01 ~ 1)
	 */
	get distanceInterpolation(): number { return this.#distanceInterpolation; }

	/**
	 * 거리 값의 보간 계수를 설정합니다.
	 * 낮을수록 부드러운 움직임, 높을수록 빠른 응답
	 *
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set distanceInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#distanceInterpolation = value;
	}

	/**
	 * 타겟으로부터의 카메라 높이를 가져옵니다.
	 *
	 * @returns {number} 목표 높이
	 */
	get height(): number { return this.#targetHeight; }

	/**
	 * 타겟으로부터의 카메라 높이를 설정합니다.
	 *
	 * @param {number} value - 설정할 높이
	 */
	set height(value: number) {
		validateNumber(value);
		this.#targetHeight = value;
	}

	/**
	 * 높이 값의 보간 계수를 가져옵니다.
	 *
	 * @returns {number} 높이 보간 계수 (0.01 ~ 1)
	 */
	get heightInterpolation(): number { return this.#heightInterpolation; }

	/**
	 * 높이 값의 보간 계수를 설정합니다.
	 *
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set heightInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#heightInterpolation = value;
	}

	/**
	 * 타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 가져옵니다.
	 *
	 * @returns {number} 팬 각도 (도 단위)
	 */
	get pan(): number { return this.#targetPan; }

	/**
	 * 타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 설정합니다.
	 *
	 * @param {number} value - 팬 각도 (도 단위)
	 */
	set pan(value: number) {
		validateNumber(value);
		this.#targetPan = value;
	}

	/**
	 * 팬 값의 보간 계수를 가져옵니다.
	 *
	 * @returns {number} 팬 보간 계수 (0.01 ~ 1)
	 */
	get panInterpolation(): number { return this.#panInterpolation; }

	/**
	 * 팬 값의 보간 계수를 설정합니다.
	 *
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set panInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#panInterpolation = value;
	}

	/**
	 * 타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 가져옵니다.
	 *
	 * @returns {number} 틸트 각도 (도 단위, -89 ~ 89)
	 */
	get tilt(): number { return this.#targetTilt; }

	/**
	 * 타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 설정합니다.
	 * -89도에서 89도 범위로 제한됩니다.
	 *
	 * @param {number} value - 틸트 각도 (도 단위)
	 */
	set tilt(value: number) {
		validateNumber(value);
		this.#targetTilt = Math.max(-89, Math.min(89, value));
	}

	/**
	 * 틸트 값의 보간 계수를 가져옵니다.
	 *
	 * @returns {number} 틸트 보간 계수 (0.01 ~ 1)
	 */
	get tiltInterpolation(): number { return this.#tiltInterpolation; }

	/**
	 * 틸트 값의 보간 계수를 설정합니다.
	 *
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set tiltInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#tiltInterpolation = value;
	}

	/**
	 * 전체 카메라 위치의 보간 계수를 가져옵니다.
	 *
	 * @returns {number} 보간 계수 (0.01 ~ 1)
	 */
	get interpolation(): number { return this.#interpolation; }

	/**
	 * 전체 카메라 위치의 보간 계수를 설정합니다.
	 * 낮을수록 부드러운 움직임, 높을수록 빠른 응답
	 *
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set interpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#interpolation = value;
	}

	/**
	 * 타겟 메시의 회전을 따를지 여부를 가져옵니다.
	 *
	 * @returns {boolean} true일 경우 타겟의 회전을 따름
	 */
	get followTargetRotation(): boolean { return this.#followTargetRotation; }

	/**
	 * 타겟 메시의 회전을 따를지 여부를 설정합니다.
	 *
	 * @param {boolean} value - true일 경우 타겟의 회전을 따름
	 */
	set followTargetRotation(value: boolean) { this.#followTargetRotation = value; }

	/**
	 * 타겟으로부터의 카메라 X축 오프셋을 가져옵니다.
	 *
	 * @returns {number} X축 오프셋
	 */
	get targetOffsetX(): number { return this.#targetOffsetX; }

	/**
	 * 타겟으로부터의 카메라 X축 오프셋을 설정합니다.
	 *
	 * @param {number} value - X축 오프셋
	 */
	set targetOffsetX(value: number) {
		validateNumber(value);
		this.#targetOffsetX = value;
	}

	/**
	 * 타겟으로부터의 카메라 Y축 오프셋을 가져옵니다.
	 *
	 * @returns {number} Y축 오프셋
	 */
	get targetOffsetY(): number { return this.#targetOffsetY; }

	/**
	 * 타겟으로부터의 카메라 Y축 오프셋을 설정합니다.
	 *
	 * @param {number} value - Y축 오프셋
	 */
	set targetOffsetY(value: number) {
		validateNumber(value);
		this.#targetOffsetY = value;
	}

	/**
	 * 타겟으로부터의 카메라 Z축 오프셋을 가져옵니다.
	 *
	 * @returns {number} Z축 오프셋
	 */
	get targetOffsetZ(): number { return this.#targetOffsetZ; }

	/**
	 * 타겟으로부터의 카메라 Z축 오프셋을 설정합니다.
	 *
	 * @param {number} value - Z축 오프셋
	 */
	set targetOffsetZ(value: number) {
		validateNumber(value);
		this.#targetOffsetZ = value;
	}

	/**
	 * 카메라의 타겟 오프셋을 한 번에 설정합니다.
	 *
	 * @param {number} x - X축 오프셋
	 * @param {number} [y=0] - Y축 오프셋 (기본값: 0)
	 * @param {number} [z=0] - Z축 오프셋 (기본값: 0)
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
	 * 따라갈 대상 메시를 가져옵니다.
	 *
	 * @returns {Mesh} 현재 타겟 메시
	 */
	get targetMesh(): Mesh { return this.#targetMesh; }

	/**
	 * 따라갈 대상 메시를 설정합니다.
	 * 새로운 타겟을 설정하면 카메라 위치가 재계산됩니다.
	 *
	 * @param {Mesh} value - 설정할 타겟 메시
	 * @throws {Error} value가 null이거나 undefined일 경우 에러 발생
	 */
	set targetMesh(value: Mesh) {
		if (!value) throw new Error('FollowController: targetMesh cannot be null or undefined');
		this.#targetMesh = value;
		this.#targetMesh.setIgnoreFrustumCullingRecursively(true);
		vec3.copy(this.#currentPos, this.#calculateCameraPosition());
	}

	/**
	 * 매 프레임마다 카메라의 위치와 방향을 업데이트합니다.
	 *
	 * 현재 값들을 목표 값으로 보간하고, 카메라의 위치와 lookAt 대상을 설정합니다.
	 *
	 * @param {View3D} view - 카메라가 속한 3D 뷰
	 * @param {number} time - 현재 시간 (ms)
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
	 * 카메라가 바라볼 타겟 위치를 계산합니다.
	 *
	 * 타겟 메시의 월드 위치에 오프셋을 적용하고,
	 * followTargetRotation이 활성화되어 있으면 타겟의 회전을 반영합니다.
	 *
	 * @returns {vec3} 카메라가 바라볼 타겟의 월드 위치
	 * @private
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
