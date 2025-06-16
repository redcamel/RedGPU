import RedGPUContext from "../../../context/RedGPUContext";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import Plane from "../../../primitive/Plane";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import {mixInMesh2D} from "../../mesh/core/mixInMesh2D";
import Mesh from "../../mesh/Mesh";

const BaseSprite2D = mixInMesh2D(Mesh);

class Sprite2D extends BaseSprite2D {
	#width: number = 1
	#height: number = 1

	constructor(redGPUContext: RedGPUContext, material?) {
		//TODO - 재질없을떄 확인해야됨
		super(redGPUContext, new Plane(redGPUContext, 1, 1, 1, 1, 1, true), material);
		this.primitiveState.cullMode = GPU_CULL_MODE.FRONT
	}

	get width(): number {
		return this.#width;
	}

	set width(value: number) {
		validatePositiveNumberRange(value)
		this.#width = value;
		this.dirtyTransform = true
	}

	get height(): number {
		return this.#height;
	}

	set height(value: number) {
		validatePositiveNumberRange(value)
		this.#height = value;
		this.dirtyTransform = true
	}

	get material() {
		return this._material
	}

	set material(value) {
		consoleAndThrowError('Sprite2D can not change material')
	}

	setSize(width: number, height?: number) {
		this.width = width;
		this.height = height !== undefined ? height : width;
	}
}

Object.freeze(Sprite2D)
export default Sprite2D
