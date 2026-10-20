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

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_SHEET_3D'

/**
 * [KO] 3D 공간에서 스프라이트 시트 애니메이션을 표시하는 클래스입니다.
 * [EN] Class that displays sprite sheet animations in 3D space.
 *
 * [KO] 단일 프레임 세그먼트 종횡비에 맞춰 가로·세로 비율(`renderRatioX`, `renderRatioY`)이 자동 산출되며, 빌보드 회전(`useBillboard`)과 크기 모드(`usePixelSize`: `worldSize` 또는 `pixelSize`)가 서로 독립적으로 동작합니다.
 * [EN] Automatically calculates horizontal and vertical ratios (`renderRatioX`, `renderRatioY`) from the aspect ratio of a single frame segment, with billboard orientation (`useBillboard`) and size mode (`usePixelSize`: `worldSize` or `pixelSize`) operating independently.
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
    #useBillboard: boolean = true
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
     * [KO] 스프라이트 시트 정의 정보(`SpriteSheetInfo`) 인스턴스
     * [EN] Sprite sheet definition (`SpriteSheetInfo`) instance
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
     * [KO] 카메라를 항상 정면으로 바라보는 빌보드 모드 사용 여부를 반환하거나 설정합니다. (기본값: `true`)
     * [EN] Returns or sets whether billboard mode (always facing the camera) is enabled. (Default: `true`)
     *
     * @returns
     * [KO] 빌보드 모드 활성화 여부
     * [EN] Whether billboard mode is enabled
     */
    get useBillboard(): boolean {
        return this.#useBillboard;
    }

    set useBillboard(value: boolean) {
        if (this.gpuRenderInfo) {
            const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo;
            vertexUniformBuffer.writeOnlyBuffer(vertexUniformInfo.members.useBillboard, value ? 1 : 0);
        }
        this.#useBillboard = value;
    }

    /**
     * [KO] 월드 단위 크기 모드(`usePixelSize: false`)에서 기준 세로 크기(Unit 단위)를 반환하거나 설정합니다. (기본값: `1`)
     * [EN] Returns or sets the vertical size in world units when in world size mode (`usePixelSize: false`). (Default: `1`)
     *
     * @returns
     * [KO] 월드 공간 기준 세로 크기
     * [EN] Vertical size in world space
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
     * [KO] 고정 픽셀 크기 모드(`usePixelSize: true`)에서 표시할 세로 픽셀 크기(px 단위, 미지정 시 단일 세그먼트 세로 해상도)를 반환하거나 설정합니다.
     * [EN] Returns or sets the vertical pixel size (in px; defaults to single segment height if unspecified) in fixed pixel size mode (`usePixelSize: true`).
     *
     * @returns
     * [KO] 세로 픽셀 크기 (단위: px)
     * [EN] Vertical pixel size (unit: px)
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
     * [KO] 카메라 거리와 무관한 화면 고정 픽셀 크기(`pixelSize`) 모드 사용 여부를 반환하거나 설정합니다. (기본값: `false`)
     * [EN] Returns or sets whether screen-fixed pixel size (`pixelSize`) mode is enabled regardless of camera distance. (Default: `false`)
     *
     * @returns
     * [KO] 고정 픽셀 크기 모드 활성화 여부
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
     * [KO] 세그먼트 종횡비와 현재 크기 모드에 따라 산출된 가로 렌더링 스케일 비율을 반환합니다.
     * [EN] Returns the horizontal rendering scale ratio calculated from the segment aspect ratio and current size mode.
     *
     * @returns
     * [KO] 가로 렌더링 비율
     * [EN] Horizontal rendering ratio
     */
    get renderRatioX(): number {
        return this.#renderRatioX;
    }

    /**
     * [KO] 현재 크기 모드에 따라 산출된 세로 렌더링 스케일 비율을 반환합니다.
     * [EN] Returns the vertical rendering scale ratio calculated from the current size mode.
     *
     * @returns
     * [KO] 세로 렌더링 비율
     * [EN] Vertical rendering ratio
     */
    get renderRatioY(): number {
        return this.#renderRatioY;
    }

    /**
     * [KO] 내부 고정 `Plane` 지오메트리를 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the internal fixed `Plane` geometry. Cannot be changed externally.
     *
     * @returns
     * [KO] 지오메트리 인스턴스
     * [EN] Geometry instance
     * @throws
     * [KO] 새 지오메트리 할당 시 에러가 발생합니다.
     * [EN] Throws an error if a new geometry is assigned.
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('SpriteSheet3D can not change geometry')
    }

    /**
     * [KO] 내부 고정 머티리얼을 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the internal fixed material. Cannot be changed externally.
     *
     * @returns
     * [KO] 머티리얼 인스턴스
     * [EN] Material instance
     * @throws
     * [KO] 새 머티리얼 할당 시 에러가 발생합니다.
     * [EN] Throws an error if a new material is assigned.
     */
    get material() {
        return this._material;
    }

    set material(value) {
        consoleAndThrowError('SpriteSheet3D can not change material')
    }

    /**
     * [KO] 현재 프레임 상태를 갱신하고 스프라이트 시트를 렌더링합니다.
     * [EN] Updates the current frame state and renders the sprite sheet.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData) {
        super.render(renderViewStateData);
    }

    /**
     * [KO] `SpriteSheet3D` 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates the custom vertex shader module dedicated to `SpriteSheet3D`.
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

Object.freeze(SpriteSheet3D)
export default SpriteSheet3D
