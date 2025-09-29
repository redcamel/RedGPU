import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import DefineForVertex from "../../../resources/defineProperty/DefineForVertex";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import Mesh from "../../mesh/Mesh";
import vertexModuleSource from "./shader/sprite3DVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_3D'
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

interface Sprite3D {
	useBillboardPerspective: boolean;
	useBillboard: boolean;
	billboardFixedScale: number;
}

class Sprite3D extends Mesh {
	constructor(redGPUContext: RedGPUContext, material?, geometry?: Geometry | Primitive,) {
		super(redGPUContext);
		this._geometry = geometry || new Plane(redGPUContext);
		this._material = material
		this._material.transparent = true
		this.dirtyPipeline = true
		this.dirtyTransform = true
		this.primitiveState.cullMode = GPU_CULL_MODE.NONE
	}

	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}
}

DefineForVertex.defineByPreset(Sprite3D, [
	[DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD_PERSPECTIVE, true],
	[DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD, true],
	[DefineForVertex.PRESET_POSITIVE_NUMBER.BILLBOARD_FIXED_SCALE, 0.1, 0.1],
])
Object.freeze(Sprite3D)
export default Sprite3D
