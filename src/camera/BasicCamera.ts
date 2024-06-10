import BaseObject3DTransform from "../object3d/base/BaseObject3DTransform";
import CONST_DIRTY_TRANSFORM_STATE from "../object3d/base/CONST_DIRTY_TRANSFORM_STATE";
import throwError from "../util/errorFunc/throwError";
import getConstructorName from "../util/getConstructorName";
import {mat4} from "../util/gl-matrix";

class BasicCamera extends BaseObject3DTransform {
	static MODE_3D = '3d'
	static MODE_2D = '2d'
	#mode: string = BasicCamera.MODE_3D
	#farClipping: number = 100000
	#nearClipping: number = 0.1
	#fov: number = 60

	constructor(x: number = 0, y: number = 0, z: number = 10, mode: string = BasicCamera.MODE_3D) {
		super()
		this.x = x
		this.y = y
		this.z = z
		this.mode = mode
	}

	get farClipping(): number {
		return this.#farClipping;
	}

	set farClipping(value: number) {
		this.#farClipping = value;
		this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
	}

	get nearClipping(): number {
		return this.#nearClipping;
	}

	set nearClipping(value: number) {
		this.#nearClipping = value;
		this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
	}

	get fov(): number {
		return this.#fov;
	}

	set fov(value: number) {
		this.#fov = value;
		this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
	}

	get mode(): string {
		return this.#mode;
	}

	set mode(value: string) {
		if (value === BasicCamera.MODE_2D || value === BasicCamera.MODE_3D) this.#mode = value;
		else throwError(getConstructorName(value), 'only allow BasicCamera.MODE_2D or BasicCamera.MODE_3D')
		this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
	}

	update() {
		const eye = [this.x, this.y, this.z]
		const center = [0, 0, 0]
		const up = [0, 1, 0]
		mat4.identity(this.matrix);
		mat4.translate(this.matrix, this.matrix, [this.x, this.y, this.z]);
		mat4.rotateX(this.matrix, this.matrix, this.rotationX);
		mat4.rotateY(this.matrix, this.matrix, this.rotationY);
		mat4.rotateZ(this.matrix, this.matrix, this.rotationZ);
		mat4.lookAt(this.matrix, eye, center, up)
		this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.NONE
	}
}

export default BasicCamera
