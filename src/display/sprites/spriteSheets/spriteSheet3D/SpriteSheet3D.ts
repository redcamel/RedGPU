import RedGPUContext from "../../../../context/RedGPUContext";
import DefineForVertex from "../../../../defineProperty/DefineForVertex";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import Plane from "../../../../primitive/Plane";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import vertexModuleSource from "./shader/spriteSheet3DVertex.wgsl";
import {keepLog} from "../../../../utils";

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
    /** 빌보드 모드 사용 여부 */
    useBillboard: boolean;
    /** X축 렌더링 비율 */
    _renderRatioX: number;
    /** Y축 렌더링 비율 */
    _renderRatioY: number;
}

/**
 * [KO] 3D 공간에서의 스프라이트 시트 애니메이션 클래스입니다.
 * [EN] 3D sprite sheet animation class.
 *
 * [KO] 3D 공간에서 빌보드 효과를 가진 스프라이트 시트 애니메이션을 제공합니다. 캐릭터나 파티클과 같은 2D 스프라이트를 3D 공간에 배치하면서도 항상 카메라를 향하도록 하여 자연스러운 시각 효과를 만듭니다. 텍스처의 종횡비에 따라 자동으로 렌더링 비율이 조정됩니다.
 * [EN] Provides sprite sheet animation with billboard effects in 3D space. Creates natural visual effects by placing 2D sprites like characters or particles in 3D space while always facing the camera. Rendering ratios are automatically adjusted according to the texture's aspect ratio.
 *
 * ### Example
 * ```typescript
 * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
 * const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
 * scene.addChild(spriteSheet);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/"></iframe>
 *
 * @see
 * [KO] 아래는 SpriteSheet3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of SpriteSheet3D.
 * @see [SpriteSheet3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/spriteSheet3D/)
 * @category SpriteSheet
 */
class SpriteSheet3D extends ASpriteSheet {
    /**
     * [KO] 렌더링될 텍스처 세그먼트의 실제 너비
     * [EN] Actual width of the texture segment to be rendered
     */
    #nativeWidth: number = 1
    /**
     * [KO] 렌더링될 텍스처 세그먼트의 실제 높이
     * [EN] Actual height of the texture segment to be rendered
     */
    #nativeHeight: number = 1
    #worldSize: number = 1
    #pixelSize: number = 0
    #usePixelSize: boolean = false

    /**
     * [KO] 새로운 SpriteSheet3D 인스턴스를 생성합니다.
     * [EN] Creates a new SpriteSheet3D instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param spriteSheetInfo -
     * [KO] 스프라이트 시트 정보 객체 (텍스처, 세그먼트 정보, 애니메이션 설정 포함)
     * [EN] Sprite sheet info object (including texture, segment info, and animation settings)
     */
    constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo,) {
        super(redGPUContext, spriteSheetInfo, (diffuseTexture: BitmapTexture, segmentW: number, segmentH: number) => {
            if (diffuseTexture) {
                const {gpuTexture} = diffuseTexture;
                if (gpuTexture) {
                    const tW = gpuTexture.width / segmentW
                    const tH = gpuTexture.height / segmentH
                    if (tW !== this.#nativeWidth || tH !== this.#nativeHeight) {
                        this.#nativeWidth = tW
                        this.#nativeHeight = tH

                        const prevPixelSize = this.pixelSize;
                        // [KO] 원본 세그먼트 해상도를 pixelSize 기본값으로 설정
                        // [EN] Sync physical segment resolution to default pixelSize
                        this.pixelSize = this.#pixelSize ? this.#pixelSize : tH;
                        this.#updateRatios();
                        keepLog('오냐 ',this.pixelSize)
                        this.dirtyTransform = true
                    }
                }
            } else {
                this.#nativeWidth = 1
                this.#nativeHeight = 1
            }
        });
        this._geometry = new Plane(redGPUContext);
    }

    /**
     * [KO] 월드 공간에서의 스프라이트 세로 크기(Unit 단위)를 반환합니다.
     * [EN] Returns the vertical size of the sprite in world space (Unit).
     */
    get worldSize(): number {
        return this.#worldSize;
    }

    /**
     * [KO] 월드 공간에서의 스프라이트 세로 크기(Unit 단위)를 설정합니다. 가로 크기는 세그먼트 비율에 따라 자동으로 조절됩니다.
     * [EN] Sets the vertical size of the sprite in world space (Unit). The horizontal size is automatically adjusted based on the segment's aspect ratio.
     * @param value -
     * [KO] 설정할 월드 크기
     * [EN] World size to set
     */
    set worldSize(value: number) {
        if (this.#worldSize === value) return;
        this.#worldSize = value;
        this.#updateRatios();
    }

    /**
     * [KO] 고정 픽셀 크기 값을 반환합니다. (px 단위)
     * [EN] Returns the fixed pixel size value (in px).
     */
    get pixelSize(): number {
        return this.#pixelSize;
    }

    /**
     * [KO] 고정 픽셀 크기 값을 설정합니다. (px 단위) usePixelSize가 true일 때만 적용됩니다.
     * [EN] Sets the fixed pixel size value (in px). Only applied when usePixelSize is true.
     * @param value -
     * [KO] 설정할 픽셀 크기
     * [EN] Pixel size to set
     */
    set pixelSize(value: number) {
        if(this.gpuRenderInfo){
            const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                vertexUniformInfo.members.pixelSize.uniformOffset,
                new Float32Array([value * window.devicePixelRatio]) 
            )
        }
        this.#pixelSize = value;
    }

    /**
     * [KO] 고정 픽셀 크기(Pixel Size) 모드 사용 여부를 반환합니다.
     * [EN] Returns whether to use fixed pixel size mode.
     */
    get usePixelSize(): boolean {
        return this.#usePixelSize;
    }

    /**
     * [KO] 고정 픽셀 크기(Pixel Size) 모드 사용 여부를 설정합니다. true일 경우 거리에 상관없이 pixelSize에 설정된 크기로 렌더링됩니다.
     * [EN] Sets whether to use fixed pixel size mode. If true, it is rendered at the size set in pixelSize regardless of distance.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set usePixelSize(value: boolean) {
        if(this.gpuRenderInfo){
            const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                vertexUniformInfo.members.usePixelSize.uniformOffset,
                new Uint32Array([value ? 1 : 0])
            )
        }
        if (this.#usePixelSize === value) return;
        this.#usePixelSize = value;
        this.#updateRatios();
    }

    /**
     * [KO] 세그먼트 비율과 설정값에 따라 내부 렌더링 비율을 업데이트합니다.
     * [EN] Updates internal rendering ratios based on segment ratio and settings.
     */
    #updateRatios() {
        if (this.#nativeHeight) {
            const prevX = this._renderRatioX;
            const prevY = this._renderRatioY;

            if (this.usePixelSize) {
                this._renderRatioY = 1;
                this._renderRatioX = this.#nativeWidth / this.#nativeHeight;
            } else {
                this._renderRatioY = this.#worldSize;
                this._renderRatioX = (this.#nativeWidth / this.#nativeHeight) * this.#worldSize;
            }

            if (prevX !== this._renderRatioX || prevY !== this._renderRatioY) {
                this.dirtyTransform = true;
            }
        }
    }

    /**
     * [KO] 프레임마다 스프라이트 시트를 렌더링합니다.
     * [EN] Renders the sprite sheet every frame.
     * @param renderViewStateData -
     * [KO] 현재 렌더링 상태 데이터
     * [EN] Current render view state data
     */
    render(renderViewStateData: RenderViewStateData) {
        super.render(renderViewStateData);
    }

    /**
     * [KO] 지오메트리를 반환합니다. SpriteSheet3D는 Plane으로 고정되어 있습니다.
     * [EN] Returns the geometry. SpriteSheet3D is fixed with Plane.
     * @returns
     * [KO] 현재 지오메트리
     * [EN] Current geometry
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    /**
     * [KO] SpriteSheet3D는 지오메트리를 변경할 수 없습니다.
     * [EN] SpriteSheet3D cannot change geometry.
     * @param value -
     * [KO] 설정하려는 지오메트리
     * [EN] Geometry to set
     * @throws
     * [KO] 지오메트리 변경 시도 시 에러 발생
     * [EN] Throws error when attempting to change geometry
     */
    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('SpriteSheet3D can not change geometry')
    }

    /**
     * [KO] 머티리얼을 반환합니다.
     * [EN] Returns the material.
     * @returns
     * [KO] 현재 머티리얼
     * [EN] Current material
     */
    get material() {
        return this._material;
    }

    /**
     * [KO] SpriteSheet3D는 머티리얼을 변경할 수 없습니다.
     * [EN] SpriteSheet3D cannot change material.
     * @param value -
     * [KO] 설정하려는 머티리얼
     * [EN] Material to set
     * @throws
     * [KO] 머티리얼 변경 시도 시 에러 발생
     * [EN] Throws error when attempting to change material
     */
    set material(value) {
        consoleAndThrowError('SpriteSheet3D can not change material')
    }

    /**
     * [KO] SpriteSheet3D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to SpriteSheet3D.
     *
     * [KO] 3D 공간에서의 빌보드 효과와 스프라이트 시트 렌더링에 최적화된 셰이더를 생성합니다.
     * [EN] Creates a shader optimized for billboard effects and sprite sheet rendering in 3D space.
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
    [DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD, true],
])
/**
 * SpriteSheet3D 클래스를 동결하여 런타임에서의 수정을 방지합니다.
 * @readonly
 */
Object.freeze(SpriteSheet3D)
export default SpriteSheet3D