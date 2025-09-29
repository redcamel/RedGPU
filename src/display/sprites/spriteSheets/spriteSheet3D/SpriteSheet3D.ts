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

/** SpriteSheet3D 전용 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_SHEET_3D'
/** 파싱된 WGSL 셰이더 정보 */
const SHADER_INFO = parseWGSL(vertexModuleSource);
/** 버텍스 유니폼 구조체 정보 */
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

/**
 * 3D 스프라이트 시트의 빌보드 및 렌더링 속성을 정의하는 인터페이스
 */
interface SpriteSheet3D extends ASpriteSheet {
	/** 빌보드 원근감 적용 여부 */
	useBillboardPerspective: boolean;
	/** 빌보드 모드 사용 여부 */
	useBillboard: boolean;
	/** X축 렌더링 비율 */
	_renderRatioX: number;
	/** Y축 렌더링 비율 */
	_renderRatioY: number;
}

/**
 * 3D 공간에서의 스프라이트 시트 애니메이션 클래스
 *
 * SpriteSheet3D는 3D 공간에서 빌보드 효과를 가진 스프라이트 시트 애니메이션을 제공합니다.
 * 캐릭터나 파티클과 같은 2D 스프라이트를 3D 공간에 배치하면서도 항상 카메라를 향하도록 하여
 * 자연스러운 시각 효과를 만듭니다. 텍스처의 종횡비에 따라 자동으로 렌더링 비율이 조정됩니다.
 *
 * <iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/"></iframe>
 *
 * 아래는 SpriteSheet3D의 구조와 동작을 이해하는 데 도움이 되는 샘플 예제 목록입니다.
 * @see [SpriteSheet3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/spriteSheet3D/)
 * @category SpriteSheet
 */
class SpriteSheet3D extends ASpriteSheet {
	/**
	 * 렌더링될 텍스처 세그먼트의 실제 너비
	 * @private
	 */
	#renderTextureWidth: number = 1

	/**
	 * 렌더링될 텍스처 세그먼트의 실제 높이
	 * @private
	 */
	#renderTextureHeight: number = 1

	/**
	 * 새로운 SpriteSheet3D 인스턴스를 생성합니다.
	 *
	 * @param redGPUContext - RedGPU 렌더링 컨텍스트
	 * @param spriteSheetInfo - 스프라이트 시트 정보 객체 (텍스처, 세그먼트 정보, 애니메이션 설정 포함)
	 */
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

	/**
	 * 지오메트리를 반환합니다.
	 * @returns 현재 지오메트리 (고정된 Plane)
	 */
	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	/**
	 * SpriteSheet3D는 지오메트리를 변경할 수 없습니다
	 * @param value - 설정하려는 지오메트리
	 * @throws {Error} SpriteSheet3D는 지오메트리를 변경할 수 없습니다
	 */
	set geometry(value: Geometry | Primitive) {
		consoleAndThrowError('SpriteSheet3D can not change geometry')
	}

	/**
	 * 머티리얼을 반환합니다.
	 * @returns 현재 머티리얼 (BitmapMaterial)
	 */
	get material() {
		return this._material
	}

	/**
	 * SpriteSheet3D는 머티리얼을 변경할 수 없습니다
	 * @param value - 설정하려는 머티리얼
	 * @throws {Error} SpriteSheet3D는 머티리얼을 변경할 수 없습니다
	 */
	set material(value) {
		consoleAndThrowError('SpriteSheet3D can not change material')
	}

	/**
	 * SpriteSheet3D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
	 *
	 * 3D 공간에서의 빌보드 효과와 스프라이트 시트 렌더링에 최적화된
	 * 버텍스 셰이더를 생성합니다. 카메라 방향에 따른 동적 정점 계산과
	 * UV 좌표 프레임 인덱싱 로직이 포함되어 있습니다.
	 *
	 * @returns 생성된 버텍스 셰이더 모듈 정보
	 * @protected
	 */
	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}
}

/**
 * SpriteSheet3D 클래스에 렌더링 비율 속성들을 정의합니다.
 */
DefineForVertex.definePositiveNumber(SpriteSheet3D, [
	['_renderRatioX', 1],
	['_renderRatioY', 1],
])

/**
 * SpriteSheet3D 클래스에 빌보드 관련 속성들을 정의합니다.
 */
DefineForVertex.defineByPreset(SpriteSheet3D, [
	[DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD_PERSPECTIVE, true],
	[DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD, true],
	[DefineForVertex.PRESET_POSITIVE_NUMBER.BILLBOARD_FIXED_SCALE, 0.1, 0.1],
])

/**
 * SpriteSheet3D 클래스를 동결하여 런타임에서의 수정을 방지합니다.
 * @readonly
 */
Object.freeze(SpriteSheet3D)

export default SpriteSheet3D
