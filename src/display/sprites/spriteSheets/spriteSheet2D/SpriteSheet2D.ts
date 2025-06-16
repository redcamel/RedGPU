import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import GPU_CULL_MODE from "../../../../gpuConst/GPU_CULL_MODE";
import Primitive from "../../../../primitive/core/Primitive";
import Plane from "../../../../primitive/Plane";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import {mixInMesh2D} from "../../../mesh/core/mixInMesh2D";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
import vertexModuleSource from "./shader/spriteSheet2DVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_SHEET_2D'
const STRUCT_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = STRUCT_INFO.uniforms.vertexUniforms;
const BaseSpriteSheet2D = mixInMesh2D(ASpriteSheet);

class SpriteSheet2D extends BaseSpriteSheet2D {
	#width: number = 1
	#height: number = 1

	constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo) {
		super(redGPUContext, spriteSheetInfo, (diffuseTexture: BitmapTexture, segmentW: number, segmentH: number) => {
			if (diffuseTexture) {
				const {gpuTexture} = diffuseTexture;
				const tW = gpuTexture?.width / segmentW
				const tH = gpuTexture?.height / segmentH
				if (tW !== this.#width || tH !== this.#height) {
					this.#width = gpuTexture?.width / segmentW
					this.#height = gpuTexture?.height / segmentH
					this.dirtyTransform = true
				}
			} else {
				this.#width = 1
				this.#height = 1
			}
		});
		this._geometry = new Plane(redGPUContext, 1, 1, 1, 1, 1, true);
		this.primitiveState.cullMode = GPU_CULL_MODE.FRONT
	}

	get width(): number {
		return this.#width;
	}

	// set width(value: number) {
	//     validatePositiveNumberRange(value)
	//     this.#width = value;
	//     this.dirtyTransform = true
	// }
	get height(): number {
		return this.#height;
	}

	// set height(value: number) {
	//     validatePositiveNumberRange(value)
	//     this.#height = value;
	//     this.dirtyTransform = true
	// }
	/////////////////////////////////////////
	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	set geometry(value: Geometry | Primitive) {
		consoleAndThrowError('SpriteSheet2D can not change geometry')
	}

	get material() {
		return this._material
	}

	set material(value) {
		consoleAndThrowError('SpriteSheet2D can not change material')
	}

	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, STRUCT_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}
}

Object.freeze(SpriteSheet2D)
export default SpriteSheet2D
