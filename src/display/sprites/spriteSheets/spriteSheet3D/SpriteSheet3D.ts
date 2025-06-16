import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import Plane from "../../../../primitive/Plane";
import DefineForVertex from "../../../../resources/defineProperty/DefineForVertex";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
import vertexModuleSource from "./shader/spriteSheet3DVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_SHEET_3D'
const STRUCT_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = STRUCT_INFO.uniforms.vertexUniforms;

interface SpriteSheet3D extends ASpriteSheet {
	useBillboardPerspective: boolean;
	useBillboard: boolean;
	_renderRatioX: number;
	_renderRatioY: number;
}

class SpriteSheet3D extends ASpriteSheet {
	#renderTextureWidth: number = 1
	#renderTextureHeight: number = 1

	constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo,) {
		super(redGPUContext, spriteSheetInfo, (diffuseTexture: BitmapTexture, segmentW: number, segmentH: number) => {
			if (diffuseTexture) {
				const {gpuTexture} = diffuseTexture;
				const tW = gpuTexture?.width / segmentW
				const tH = gpuTexture?.height / segmentH
				if (tW !== this.#renderTextureWidth || tH !== this.#renderTextureHeight) {
					this.#renderTextureWidth = gpuTexture?.width / segmentW
					this.#renderTextureHeight = gpuTexture?.height / segmentH
					if (this.#renderTextureHeight > this.#renderTextureWidth) {
						this._renderRatioX = 1
						this._renderRatioY = this.#renderTextureHeight / this.#renderTextureWidth
					} else {
						this._renderRatioX = this.#renderTextureWidth / this.#renderTextureHeight
						this._renderRatioY = 1
					}
					this.dirtyTransform = true
					// this.pivotY = -this._renderRatioY * 0.5
				}
			} else {
				this.#renderTextureWidth = 1
				this.#renderTextureHeight = 1
			}
		});
		this._geometry = new Plane(redGPUContext);
	}

	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	set geometry(value: Geometry | Primitive) {
		consoleAndThrowError('SpriteSheet3D can not change geometry')
	}

	get material() {
		return this._material
	}

	set material(value) {
		consoleAndThrowError('SpriteSheet3D can not change material')
	}

	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, STRUCT_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}
}

DefineForVertex.definePositiveNumber(SpriteSheet3D, [
	['_renderRatioX', 1],
	['_renderRatioY', 1],
])
DefineForVertex.defineByPreset(SpriteSheet3D, [
	[DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD_PERSPECTIVE, true],
	[DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD, true],
	[DefineForVertex.PRESET_POSITIVE_NUMBER.BILLBOARD_FIXED_SCALE, 0.1, 0.1],
])
Object.freeze(SpriteSheet3D)
export default SpriteSheet3D
