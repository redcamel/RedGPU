import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import {mixInMesh2D} from "../../mesh/core/mixInMesh2D";
import ATextField from "../core/ATextField";
import TextFieldMaterial from "../core/textFieldMaterial/TextFieldMaterial";
import vertexModuleSource from "./shader/textField2DVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_TEXT_FIELD_2D'
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
const BaseTextField2D = mixInMesh2D(ATextField);

class TextField2D extends BaseTextField2D {
	#width: number = 1
	#height: number = 1
	#useSmoothing: boolean = true;

	constructor(redGPUContext: RedGPUContext, useSmoothing: boolean = true) {
		super(redGPUContext, (width: number, height: number) => {
			this.#width = width
			this.#height = height
		}, false);
		this._geometry = new Plane(redGPUContext, 1, 1, 1, 1, 1, true);
		this._material = new TextFieldMaterial(redGPUContext, new BitmapTexture(redGPUContext))
		this._material.transparent = true
		this.useSmoothing = useSmoothing;
		this.dirtyPipeline = true
		this.dirtyTransform = true
		this.primitiveState.cullMode = GPU_CULL_MODE.FRONT
	}

	get useSmoothing(): boolean {
		return this.#useSmoothing;
	}

	set useSmoothing(value: boolean) {
		this.#useSmoothing = value;
		if (this.useSmoothing) {
			this._material.diffuseTextureSampler.minFilter = GPU_FILTER_MODE.LINEAR
			this._material.diffuseTextureSampler.magFilter = GPU_FILTER_MODE.LINEAR
			this._material.diffuseTextureSampler.mipmapFilter = GPU_MIPMAP_FILTER_MODE.LINEAR
		} else {
			this._material.diffuseTextureSampler.minFilter = GPU_FILTER_MODE.NEAREST
			this._material.diffuseTextureSampler.magFilter = GPU_FILTER_MODE.NEAREST
			this._material.diffuseTextureSampler.mipmapFilter = null
		}
	}

	get width(): number {
		return this.#width;
	}

	get height(): number {
		return this.#height;
	}

	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	set geometry(value: Geometry | Primitive) {
		console.error('TextField2D can not change geometry')
	}

	get material() {
		return this._material;
	}

	set material(value) {
		console.error('TextField2D can not change material')
	}

	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}
}

Object.freeze(TextField2D)
export default TextField2D
