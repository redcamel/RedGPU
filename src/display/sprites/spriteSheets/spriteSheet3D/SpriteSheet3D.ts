import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import Plane from "../../../../primitive/Plane";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import vertexModuleSource from "./shader/spriteSheet3DVertex.wgsl";
import defineBoolean from "../../../../defineProperty/funcs/defineBoolean";


const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_SHEET_3D'


/**
 * [KO] 3D 스프라이트 시트의 빌보드 속성을 정의하는 인터페이스입니다.
 * [EN] Interface defining billboard properties of a 3D sprite sheet.
 *
 * @category SpriteSheet
 */
interface SpriteSheet3D extends ASpriteSheet {
    /**
     * [KO] 빌보드 모드 사용 여부 (`true`일 경우 항상 카메라를 향함)
     * [EN] Whether to use billboard mode (always faces the camera if `true`)
     */
    useBillboard: boolean;
}

/**
 * [KO] 3D 공간에서 빌보드 및 고정 픽셀 크기 모드를 지원하는 스프라이트 시트 애니메이션 클래스입니다.
 * [EN] Sprite sheet animation class supporting billboard and fixed pixel size modes in 3D space.
 *
 * [KO] 텍스처 세그먼트의 종횡비에 따라 가로/세로 렌더링 비율이 자동으로 조정됩니다.
 * [EN] Horizontal and vertical rendering ratios are automatically adjusted according to the aspect ratio of the texture segment.
 *
 * ### Example
 * ```typescript
 * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
 * const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
 * scene.addChild(spriteSheet);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/" style="width:100%; height:500px;"></iframe>
 *
 * @see [SpriteSheet3D Basic Example](/RedGPU/examples/3d/sprite/spriteSheet3D/)
 * @see [SpriteSheet3D Comparison (World vs Pixel)](/RedGPU/examples/3d/sprite/spriteSheet3DCompare/)
 * @see [SpriteSheet3D MouseEvent Example](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)
 * @category SpriteSheet
 */
class SpriteSheet3D extends ASpriteSheet {
    #nativeWidth: number = 1
    #nativeHeight: number = 1
    #worldSize: number = 1
    #pixelSize: number = 0
    #usePixelSize: boolean = false
    #renderRatioX: number = 1
    #renderRatioY: number = 1

    /**
     * [KO] SpriteSheet3D 인스턴스를 생성합니다.
     * [EN] Creates a SpriteSheet3D instance.
     *
     * ### Example
     * ```typescript
     * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
     * const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param spriteSheetInfo -
     * [KO] 스프라이트 시트 애니메이션 정보 객체
     * [EN] Sprite sheet animation information object
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

                        this.pixelSize = this.#pixelSize ? this.#pixelSize : tH;
                        this.#updateRatios();
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
     * [KO] 월드 공간 기준 세로 크기(Unit 단위)를 반환하거나 설정합니다. 가로 크기는 세그먼트 종횡비에 비례하여 자동 계산됩니다.
     * [EN] Returns or sets the vertical size in world space (in units). Horizontal size is automatically calculated in proportion to the segment aspect ratio.
     *
     * @returns
     * [KO] 월드 기준 세로 크기
     * [EN] Vertical size in world units
     */
    get worldSize(): number {
        return this.#worldSize;
    }

    set worldSize(value: number) {
        if (this.#worldSize === value) return;
        this.#worldSize = value;
        this.#updateRatios();
    }

    /**
     * [KO] `usePixelSize` 활성화 시 적용되는 화면 고정 픽셀 높이(px)를 반환하거나 설정합니다.
     * [EN] Returns or sets the fixed screen pixel height (in px) applied when `usePixelSize` is enabled.
     *
     * @returns
     * [KO] 픽셀 크기 (px 단위)
     * [EN] Pixel size (in px)
     */
    get pixelSize(): number {
        return this.#pixelSize;
    }

    set pixelSize(value: number) {
        if (this.gpuRenderInfo) {
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
     * [KO] 카메라 거리와 무관하게 고정 픽셀 크기(`pixelSize`)로 렌더링할지 여부를 반환하거나 설정합니다.
     * [EN] Returns or sets whether to render at a fixed pixel size (`pixelSize`) regardless of camera distance.
     *
     * @returns
     * [KO] 고정 픽셀 크기 모드 사용 여부
     * [EN] Whether fixed pixel size mode is enabled
     */
    get usePixelSize(): boolean {
        return this.#usePixelSize;
    }

    set usePixelSize(value: boolean) {
        if (this.gpuRenderInfo) {
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
        consoleAndThrowError('SpriteSheet3D can not change geometry')
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
        return this._material;
    }

    set material(value) {
        consoleAndThrowError('SpriteSheet3D can not change material')
    }

    /**
     * [KO] 스프라이트 시트를 렌더링합니다.
     * [EN] Renders the sprite sheet.
     *
     * @param renderViewStateData -
     * [KO] 뷰 렌더링 상태 데이터
     * [EN] View rendering state data
     */
    render(renderViewStateData: RenderViewStateData) {
        super.render(renderViewStateData);
    }

    /**
     * [KO] SpriteSheet3D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to SpriteSheet3D.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('SPRITE_SHEET_3D_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
        this.#updateRatios();
        return shaderModule;
    }

    #updateRatios() {
        if (this.#nativeHeight) {
            const prevX = this.#renderRatioX;
            const prevY = this.#renderRatioY;

            if (this.#usePixelSize) {
                this.#renderRatioY = 1;
                this.#renderRatioX = this.#nativeWidth / this.#nativeHeight;
            } else {
                this.#renderRatioY = this.#worldSize;
                this.#renderRatioX = (this.#nativeWidth / this.#nativeHeight) * this.#worldSize;
            }

            if (this.gpuRenderInfo) {
                const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo;
                vertexUniformBuffer.writeOnlyBuffer(vertexUniformInfo.members.renderRatioX, this.#renderRatioX);
                vertexUniformBuffer.writeOnlyBuffer(vertexUniformInfo.members.renderRatioY, this.#renderRatioY);
            }

            if (prevX !== this.#renderRatioX || prevY !== this.#renderRatioY) {
                this.dirtyTransform = true;
            }
        }
    }
}

defineBoolean(SpriteSheet3D, [
    {key: 'useBillboard', value: true},
])
Object.freeze(SpriteSheet3D)
export default SpriteSheet3D
