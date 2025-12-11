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
	#distance: number = 10;
	#height: number = 5;
	#delay: number = 1;
	#pan: number = 0;
	#tilt: number = 20;
	#followTargetRotation: boolean = true;
	#targetOffsetX: number = 0;
	#targetOffsetY: number = 0;
	#targetOffsetZ: number = 0;
	#targetMesh: Mesh;
	#currentPos = vec3.create();

	constructor(redGPUContext: RedGPUContext, targetMesh: Mesh) {
		super(redGPUContext, {});
		this.#targetMesh = targetMesh;
		this.#targetMesh.setIgnoreFrustumCullingRecursively(true);
		vec3.copy(this.#currentPos, this.#calculateCameraPosition());
	}

	#calculateCameraPosition(): vec3 {
		const panRad = this.#pan * PER_PI;
		const tiltRad = this.#tilt * PER_PI;
		const cosT = Math.cos(tiltRad);
		const sinT = Math.sin(tiltRad);
		const cosP = Math.cos(panRad);
		const sinP = Math.sin(panRad);

		if (this.#followTargetRotation) {
			vec3.set(tempVec3,
				sinP * this.#distance * cosT,
				sinT * this.#distance + this.#height,
				cosP * this.#distance * cosT
			);

			mat4.copy(tempMat4, this.#targetMesh.modelMatrix);
			tempMat4[12] = tempMat4[13] = tempMat4[14] = 0;
			vec3.transformMat4(tempVec3, tempVec3, tempMat4);

			return vec3.fromValues(
				this.#targetMesh.x + tempVec3[0],
				this.#targetMesh.y + tempVec3[1],
				this.#targetMesh.z + tempVec3[2]
			);
		}

		return vec3.fromValues(
			this.#targetMesh.x + this.#distance * cosT * sinP,
			this.#targetMesh.y + this.#height + this.#distance * sinT,
			this.#targetMesh.z + this.#distance * cosT * cosP
		);
	}

	get distance(): number { return this.#distance; }
	set distance(value: number) {
		validateNumberRange(value, 0.1);
		this.#distance = value;
	}

	get height(): number { return this.#height; }
	set height(value: number) {
		validateNumber(value);
		this.#height = value;
	}

	get pan(): number { return this.#pan; }
	set pan(value: number) {
		validateNumber(value);
		this.#pan = value;
	}

	get tilt(): number { return this.#tilt; }
	set tilt(value: number) {
		validateNumber(value);
		this.#tilt = Math.max(-89, Math.min(89, value));
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
			vec3.lerp(this.#currentPos, this.#currentPos, this.#calculateCameraPosition(), this.#delay);
			this.camera.setPosition(this.#currentPos[0], this.#currentPos[1], this.#currentPos[2]);

			const lookAt = this.#calculateLookAtTarget();
			this.camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
		});
	}

	#calculateLookAtTarget(): vec3 {
		vec3.set(tempVec3, this.#targetOffsetX, this.#targetOffsetY, this.#targetOffsetZ);

		if (this.#followTargetRotation && (this.#targetOffsetX !== 0 || this.#targetOffsetY !== 0 || this.#targetOffsetZ !== 0)) {
			mat4.copy(tempMat4, this.#targetMesh.modelMatrix);
			tempMat4[12] = tempMat4[13] = tempMat4[14] = 0;
			vec3.transformMat4(tempVec3, tempVec3, tempMat4);
		}

		return vec3.fromValues(
			this.#targetMesh.x + tempVec3[0],
			this.#targetMesh.y + tempVec3[1],
			this.#targetMesh.z + tempVec3[2]
		);
	}

}

export default FollowController;
