import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import DefineForVertex from "../../../resources/defineProperty/DefineForVertex";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import ATextField from "../core/ATextField";
import vertexModuleSource from "./shader/textField3DVertex.wgsl";

interface TextField3D {
	useBillboardPerspective: boolean;
	useBillboard: boolean
}

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_TEXT_FIELD_3D'
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

class TextField3D extends ATextField {
	#renderTextureWidth: number = 1
	#renderTextureHeight: number = 1

	constructor(redGPUContext: RedGPUContext, text?: string) {
		super(redGPUContext, (width: number, height: number) => {
			const prevWidth = this.#renderTextureWidth;
			const prevHeight = this.#renderTextureHeight;
			this.#renderTextureWidth = width / 1024;
			this.#renderTextureHeight = height / 1024;
			if (prevWidth !== this.#renderTextureWidth || prevHeight !== this.#renderTextureHeight) {
				this.dirtyTransform = true;
			}
		});
		this._geometry = new Plane(redGPUContext);
		if (text) this.text = text
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
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}
}

DefineForVertex.defineByPreset(TextField3D, [
	[DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD_PERSPECTIVE, true],
	DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD,
])
Object.freeze(TextField3D)
export default TextField3D
