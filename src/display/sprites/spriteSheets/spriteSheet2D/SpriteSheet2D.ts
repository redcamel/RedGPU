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
 * [KO] 2D 스프라이트 시트 애니메이션 클래스입니다.
 * [EN] 2D sprite sheet animation class.
 *
 * [KO] 2D 게임에서 캐릭터나 오브젝트의 애니메이션을 위한 클래스입니다. 하나의 텍스처에 격자 형태로 배열된 여러 프레임을 시간에 따라 순차적으로 표시하여 부드러운 2D 애니메이션을 생성합니다. 텍스처의 세그먼트 크기에 따라 자동으로 렌더링 크기가 조정됩니다.
 * [EN] A class for animating characters or objects in 2D games. It creates smooth 2D animations by sequentially displaying multiple frames arranged in a grid within a single texture over time. Rendering size is automatically adjusted according to the segment size of the texture.
 *
 * ### Example
 * ```typescript
 * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
 * const spriteSheet = new RedGPU.Display.SpriteSheet2D(redGPUContext, info);
 * scene.addChild(spriteSheet);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/"></iframe>
 *
 * [KO] 아래는 SpriteSheet2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of SpriteSheet2D.
 * @see [SpriteSheet2D MouseEvent example](/RedGPU/examples/2d/interaction/mouseEvent/spriteSheet2D/)
 *
 * @category SpriteSheet
 */
class SpriteSheet2D extends BaseSpriteSheet2D {
    /**
     * [KO] 스프라이트 시트 세그먼트의 실제 너비
     * [EN] Actual width of the sprite sheet segment
     */
    #width: number = 1
    /**
     * [KO] 스프라이트 시트 세그먼트의 실제 높이
     * [EN] Actual height of the sprite sheet segment
     */
    #height: number = 1

    /**
     * [KO] 새로운 SpriteSheet2D 인스턴스를 생성합니다.
     * [EN] Creates a new SpriteSheet2D instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param spriteSheetInfo -
     * [KO] 스프라이트 시트 정보 객체 (텍스처, 세그먼트 정보, 애니메이션 설정 포함)
     * [EN] Sprite sheet info object (including texture, segment info, and animation settings)
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
     * [KO] 스프라이트 시트 세그먼트의 너비를 반환합니다. (텍스처 전체 너비를 세그먼트 수로 나눈 값)
     * [EN] Returns the width of the sprite sheet segment. (Total texture width divided by the number of segments)
     * @returns
     * [KO] 세그먼트 너비 (픽셀 단위)
     * [EN] Segment width (in pixels)
     */
    get width(): number {
        return this.#width;
    }

    /**
     * [KO] 스프라이트 시트 세그먼트의 높이를 반환합니다. (텍스처 전체 높이를 세그먼트 수로 나눈 값)
     * [EN] Returns the height of the sprite sheet segment. (Total texture height divided by the number of segments)
     * @returns
     * [KO] 세그먼트 높이 (픽셀 단위)
     * [EN] Segment height (in pixels)
     */
    get height(): number {
        return this.#height;
    }

    /**
     * [KO] 지오메트리를 반환합니다. SpriteSheet2D는 Plane으로 고정됩니다.
     * [EN] Returns the geometry. SpriteSheet2D is fixed with Plane.
     * @returns
     * [KO] 현재 지오메트리
     * [EN] Current geometry
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    /**
     * [KO] SpriteSheet2D는 지오메트리를 변경할 수 없습니다.
     * [EN] SpriteSheet2D cannot change geometry.
     * @param value -
     * [KO] 설정하려는 지오메트리
     * [EN] Geometry to set
     * @throws
     * [KO] 지오메트리 변경 시도 시 Error 발생
     * [EN] Throws Error when attempting to change geometry
     */
    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('SpriteSheet2D can not change geometry')
    }

    /**
     * [KO] 머티리얼을 반환합니다.
     * [EN] Returns the material.
     * @returns
     * [KO] 현재 머티리얼
     * [EN] Current material
     */
    get material() {
        return this._material
    }

    /**
     * [KO] SpriteSheet2D는 머티리얼을 변경할 수 없습니다.
     * [EN] SpriteSheet2D cannot change material.
     * @param value -
     * [KO] 설정하려는 머티리얼
     * [EN] Material to set
     * @throws
     * [KO] 머티리얼 변경 시도 시 Error 발생
     * [EN] Throws Error when attempting to change material
     */
    set material(value) {
        consoleAndThrowError('SpriteSheet2D can not change material')
    }

    /**
     * [KO] SpriteSheet2D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to SpriteSheet2D.
     *
     * [KO] 2D 스프라이트 시트 렌더링에 최적화된 버텍스 셰이더를 생성하며, UV 좌표 계산과 프레임 인덱싱 로직이 포함되어 있습니다.
     * [EN] Creates a vertex shader optimized for 2D sprite sheet rendering, including UV coordinate calculation and frame indexing logic.
     *
     * @returns
     * [KO] 생성된 GPU 셰이더 모듈
     * [EN] Created GPU shader module
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }
}

/**
 * SpriteSheet2D 클래스를 동결하여 런타임에서의 수정을 방지합니다.
 * @readonly
 */
Object.freeze(SpriteSheet2D)
export default SpriteSheet2D
