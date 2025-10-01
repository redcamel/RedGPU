import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import GPU_CULL_MODE from "../../../../gpuConst/GPU_CULL_MODE";
import Primitive from "../../../../primitive/core/Primitive";
import Plane from "../../../../primitive/Plane";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import {mixInMesh2D} from "../../../mesh/core";

import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
import vertexModuleSource from "./shader/spriteSheet2DVertex.wgsl";

/** SpriteSheet2D 전용 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_SHEET_2D'
/** 파싱된 WGSL 셰이더 정보 */
const SHADER_INFO = parseWGSL(vertexModuleSource);
/** 버텍스 유니폼 구조체 정보 */
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
/** 2D 메시 기능이 믹스인된 베이스 스프라이트 시트 클래스 */
const BaseSpriteSheet2D = mixInMesh2D(ASpriteSheet);

/**
 * 2D 스프라이트 시트 애니메이션 클래스
 *
 * SpriteSheet2D는 2D 게임에서 캐릭터나 오브젝트의 애니메이션을 위한 클래스입니다.
 * 하나의 텍스처에 격자 형태로 배열된 여러 프레임을 시간에 따라 순차적으로 표시하여
 * 부드러운 2D 애니메이션을 생성합니다. 텍스처의 세그먼트 크기에 따라 자동으로
 * 렌더링 크기가 조정됩니다.
 *
 * <iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/"></iframe>
 *
 * 아래는 SpriteSheet2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [SpriteSheet2D MouseEvent example](/RedGPU/examples/2d/mouseEvent/spriteSheet2D/)
 *
 * @category SpriteSheet
 */
class SpriteSheet2D extends BaseSpriteSheet2D {
	/**
	 * 스프라이트 시트 세그먼트의 실제 너비
	 * @private
	 */
	#width: number = 1

	/**
	 * 스프라이트 시트 세그먼트의 실제 높이
	 * @private
	 */
	#height: number = 1

	/**
	 * 새로운 SpriteSheet2D 인스턴스를 생성합니다.
	 *
	 * @param redGPUContext - RedGPU 렌더링 컨텍스트
	 * @param spriteSheetInfo - 스프라이트 시트 정보 객체 (텍스처, 세그먼트 정보, 애니메이션 설정 포함)
	 */
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

	/**
	 * 스프라이트 시트 세그먼트의 너비를 반환합니다.
	 * 텍스처 전체 너비를 세그먼트 수로 나눈 값입니다.
	 * @returns 세그먼트 너비 (픽셀 단위)
	 */
	get width(): number {
		return this.#width;
	}

	// set width(value: number) {
	//     validatePositiveNumberRange(value)
	//     this.#width = value;
	//     this.dirtyTransform = true
	// }

	/**
	 * 스프라이트 시트 세그먼트의 높이를 반환합니다.
	 * 텍스처 전체 높이를 세그먼트 수로 나눈 값입니다.
	 * @returns 세그먼트 높이 (픽셀 단위)
	 */
	get height(): number {
		return this.#height;
	}

	// set height(value: number) {
	//     validatePositiveNumberRange(value)
	//     this.#height = value;
	//     this.dirtyTransform = true
	// }
	/////////////////////////////////////////

	/**
	 * 지오메트리를 반환합니다.
	 * @returns 현재 지오메트리 (고정된 Plane)
	 */
	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	/**
	 * SpriteSheet2D는 지오메트리를 변경할 수 없습니다
	 * @param value - 설정하려는 지오메트리
	 * @throws {Error} SpriteSheet2D는 지오메트리를 변경할 수 없습니다
	 */
	set geometry(value: Geometry | Primitive) {
		consoleAndThrowError('SpriteSheet2D can not change geometry')
	}

	/**
	 * 머티리얼을 반환합니다.
	 * @returns 현재 머티리얼 (BitmapMaterial)
	 */
	get material() {
		return this._material
	}

	/**
	 * SpriteSheet2D는 머티리얼을 변경할 수 없습니다
	 * @param value - 설정하려는 머티리얼
	 * @throws {Error} SpriteSheet2D는 머티리얼을 변경할 수 없습니다
	 */
	set material(value) {
		consoleAndThrowError('SpriteSheet2D can not change material')
	}

	/**
	 * SpriteSheet2D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
	 *
	 * 2D 스프라이트 시트 렌더링에 최적화된 버텍스 셰이더를 생성하며,
	 * UV 좌표 계산과 프레임 인덱싱 로직이 포함되어 있습니다.
	 *
	 * @returns 생성된 버텍스 셰이더 모듈 정보
	 * @protected
	 */
	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}
}

/**
 * SpriteSheet2D 클래스를 동결하여 런타임에서의 수정을 방지합니다.
 * @readonly
 */
Object.freeze(SpriteSheet2D)

export default SpriteSheet2D
