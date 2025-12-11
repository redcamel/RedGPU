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
 * @category Controller
 */
class FollowController extends AController {
	#currentDistance: number = 10;
	#targetDistance: number = 10;
	#delayDistance: number = 0.1;

	#currentHeight: number = 5;
	#targetHeight: number = 5;
	#delayHeight: number = 0.1;

	#delay: number = 1;

	#currentPan: number = 0;
	#targetPan: number = 0;
	#delayPan: number = 0.1;

	#currentTilt: number = 20;
	#targetTilt: number = 20;
	#delayTilt: number = 0.1;

	#followTargetRotation: boolean = true;
	#targetOffsetX: number = 0;
	#targetOffsetY: number = 0;
	#targetOffsetZ: number = 0;
	#targetMesh: Mesh;
	#currentPos = vec3.create();

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

	get distance(): number { return this.#targetDistance; }
	set distance(value: number) {
		validateNumberRange(value, 0.1);
		this.#targetDistance = value;
	}
	get delayDistance(): number { return this.#delayDistance; }
	set delayDistance(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delayDistance = value;
	}

	get height(): number { return this.#targetHeight; }
	set height(value: number) {
		validateNumber(value);
		this.#targetHeight = value;
	}
	get delayHeight(): number { return this.#delayHeight; }
	set delayHeight(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delayHeight = value;
	}

	get pan(): number { return this.#targetPan; }
	set pan(value: number) {
		validateNumber(value);
		this.#targetPan = value;
	}
	get delayPan(): number { return this.#delayPan; }
	set delayPan(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delayPan = value;
	}

	get tilt(): number { return this.#targetTilt; }
	set tilt(value: number) {
		validateNumber(value);
		this.#targetTilt = Math.max(-89, Math.min(89, value));
	}
	get delayTilt(): number { return this.#delayTilt; }
	set delayTilt(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delayTilt = value;
	}

	get delay(): number { return this.#delay; }
	set delay(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#delay = value;
	}


	get followTargetRotation(): boolean { return this.#followTargetRotation; }
	set followTargetRotation(value: boolean) { this.#followTargetRotation = value; }

	get targetOffsetX(): number { return this.#targetOffsetX; }
	set targetOffsetX(value: number) {
		validateNumber(value);
		this.#targetOffsetX = value;
	}

	get targetOffsetY(): number { return this.#targetOffsetY; }
	set targetOffsetY(value: number) {
		validateNumber(value);
		this.#targetOffsetY = value;
	}

	get targetOffsetZ(): number { return this.#targetOffsetZ; }
	set targetOffsetZ(value: number) {
		validateNumber(value);
		this.#targetOffsetZ = value;
	}

	setTargetOffset(x: number, y: number = 0, z: number = 0): void {
		validateNumber(x);
		validateNumber(y);
		validateNumber(z);
		this.#targetOffsetX = x;
		this.#targetOffsetY = y;
		this.#targetOffsetZ = z;
	}

	get targetMesh(): Mesh { return this.#targetMesh; }
	set targetMesh(value: Mesh) {
		if (!value) throw new Error('FollowController: targetMesh cannot be null or undefined');
		this.#targetMesh = value;
		this.#targetMesh.setIgnoreFrustumCullingRecursively(true);
		vec3.copy(this.#currentPos, this.#calculateCameraPosition());
	}

	update(view: View3D, time: number): void {
		super.update(view, time, () => {
			this.#currentDistance += (this.#targetDistance - this.#currentDistance) * this.#delayDistance;
			this.#currentHeight += (this.#targetHeight - this.#currentHeight) * this.#delayHeight;
			this.#currentPan += (this.#targetPan - this.#currentPan) * this.#delayPan;
			this.#currentTilt += (this.#targetTilt - this.#currentTilt) * this.#delayTilt;
			vec3.lerp(this.#currentPos, this.#currentPos, this.#calculateCameraPosition(), this.#delay);
			this.camera.setPosition(this.#currentPos[0], this.#currentPos[1], this.#currentPos[2]);

			const lookAt = this.#calculateLookAtTarget();
			this.camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
		});
	}

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
