import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import DefineForVertex from "../../../resources/defineProperty/DefineForVertex";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import ATextField from "../core/ATextField";
import TextFieldMaterial from "../core/textFieldMaterial/TextFieldMaterial";
import vertexModuleSource from "./shader/textField3DVertex.wgsl";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";

interface TextField3D {
	useBillboardPerspective: boolean;
	useBillboard: boolean
}

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_TEXT_FIELD_3D'
const STRUCT_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = STRUCT_INFO.uniforms.vertexUniforms;

class TextField3D extends ATextField {
	#renderTextureWidth: number = 1
	#renderTextureHeight: number = 1

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext, (width: number, height: number) => {
			this.#renderTextureWidth = width / 1024
			this.#renderTextureHeight = height / 1024
		});
		this._geometry = new Plane(redGPUContext);
		this._material = new TextFieldMaterial(redGPUContext, new BitmapTexture(redGPUContext))
		this._material.transparent = true
		this.dirtyPipeline = true
		this.dirtyTransform = true
	}

	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	set geometry(value: Geometry | Primitive) {
		console.error('TextField3D can not change geometry')
	}

	get material() {
		return this._material;
	}

	set material(value) {
		console.error('TextField3D can not change material')
	}

	get renderTextureWidth(): number {
		return this.#renderTextureWidth;
	}

	get renderTextureHeight(): number {
		return this.#renderTextureHeight;
	}

	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, STRUCT_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}
}

DefineForVertex.defineByPreset(TextField3D, [
	[DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD_PERSPECTIVE, true],
	DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD,
])
Object.freeze(TextField3D)
export default TextField3D
