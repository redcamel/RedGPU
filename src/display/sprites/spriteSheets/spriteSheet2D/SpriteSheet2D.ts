import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import GPU_CULL_MODE from "../../../../gpuConst/GPU_CULL_MODE";
import Primitive from "../../../../primitive/core/Primitive";
import Plane from "../../../../primitive/Plane";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import {mixInMesh2D} from "../../../mesh/core";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
import vertexModuleSource from "./shader/spriteSheet2DVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_SHEET_2D'

const BaseSpriteSheet2D = mixInMesh2D(ASpriteSheet);

/**
 * [KO] 2D 공간에서 격자형 텍스처 프레임을 순차 재생하는 2D 스프라이트 시트 클래스입니다.
 * [EN] 2D sprite sheet class that sequentially plays grid-structured texture frames in 2D space.
 *
 * [KO] 텍스처의 가로/세로 세그먼트 분할 크기에 맞춰 렌더링 픽셀 크기가 자동으로 계산됩니다.
 * [EN] The rendered pixel size is automatically calculated according to the horizontal and vertical segment divisions of the texture.
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
 * @see [SpriteSheet2D Basic Example](/RedGPU/examples/2d/spriteSheet2D/basic/)
 * @see [SpriteSheet2D MouseEvent Example](/RedGPU/examples/2d/interaction/mouseEvent/spriteSheet2D/)
 * @category SpriteSheet
 */
class SpriteSheet2D extends BaseSpriteSheet2D {
    #width: number = 1
    #height: number = 1

    /**
     * [KO] SpriteSheet2D 인스턴스를 생성합니다.
     * [EN] Creates a SpriteSheet2D instance.
     *
     * ### Example
     * ```typescript
     * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
     * const spriteSheet = new RedGPU.Display.SpriteSheet2D(redGPUContext, info);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param spriteSheetInfo -
     * [KO] 스프라이트 시트 애니메이션 정보 객체
     * [EN] Sprite sheet animation information object
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
        this._geometry = new Plane(redGPUContext, 1, 1, 1, 1, true);
        this.primitiveState.cullMode = GPU_CULL_MODE.FRONT
    }

    /**
     * [KO] 단일 프레임 세그먼트의 픽셀 너비를 반환합니다.
     * [EN] Returns the pixel width of a single frame segment.
     *
     * @returns
     * [KO] 세그먼트 너비 (픽셀 단위)
     * [EN] Segment width (in pixels)
     */
    get width(): number {
        return this.#width;
    }

    /**
     * [KO] 단일 프레임 세그먼트의 픽셀 높이를 반환합니다.
     * [EN] Returns the pixel height of a single frame segment.
     *
     * @returns
     * [KO] 세그먼트 높이 (픽셀 단위)
     * [EN] Segment height (in pixels)
     */
    get height(): number {
        return this.#height;
    }

    /**
     * [KO] 고정된 Plane 지오메트리를 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the fixed Plane geometry. Cannot be changed externally.
     *
     * @returns
     * [KO] 지오메트리 인스턴스
     * [EN] Geometry instance
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('SpriteSheet2D can not change geometry')
    }

    /**
     * [KO] 고정된 내부 머티리얼을 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the fixed internal material. Cannot be changed externally.
     *
     * @returns
     * [KO] 머티리얼 인스턴스
     * [EN] Material instance
     */
    get material() {
        return this._material
    }

    set material(value) {
        consoleAndThrowError('SpriteSheet2D can not change material')
    }

    /**
     * [KO] SpriteSheet2D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to SpriteSheet2D.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('SPRITE_SHEET_2D_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }
}

Object.freeze(SpriteSheet2D)
export default SpriteSheet2D
