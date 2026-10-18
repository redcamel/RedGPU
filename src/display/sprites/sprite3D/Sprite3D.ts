import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import BitmapMaterial from "../../../material/bitmapMaterial/BitmapMaterial";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import vertexModuleSource from "./shader/sprite3DVertex.wgsl";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineBoolean from "../../../defineProperty/funcs/defineBoolean";


const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_3D'

/**
 * [KO] `Sprite3D`의 빌보드 및 렌더링 비율 프로퍼티를 정의하는 인터페이스입니다.
 * [EN] Interface defining billboard and rendering ratio properties for `Sprite3D`.
 *
 * @category Sprite
 */
interface Sprite3D {
    /**
     * [KO] 빌보드 모드 사용 여부 (`true`일 경우 항상 카메라를 향함)
     * [EN] Whether to use billboard mode (if `true`, always faces the camera)
     */
    useBillboard: boolean;
    /**
     * [KO] X축 렌더링 비율
     * [EN] X-axis rendering ratio
     */
    _renderRatioX: number;
    /**
     * [KO] Y축 렌더링 비율
     * [EN] Y-axis rendering ratio
     */
    _renderRatioY: number;
}

/**
 * [KO] 3D 공간에 배치되어 빌보드 및 고정 픽셀 크기 모드를 지원하는 3D 스프라이트 클래스입니다.
 * [EN] 3D sprite class placed in 3D space that supports billboard and fixed pixel size modes.
 *
 * [KO] `useBillboard`를 통해 카메라를 항상 바라보도록 설정할 수 있으며, 월드 단위 크기(`worldSize`) 또는 거리와 무관한 화면 고정 픽셀 크기(`usePixelSize`, `pixelSize`)로 렌더링할 수 있습니다.
 * [EN] Can be configured to always face the camera via `useBillboard`, and rendered using world unit size (`worldSize`) or screen-fixed pixel size regardless of distance (`usePixelSize`, `pixelSize`).
 *
 * ### Example
 * ```typescript
 * const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
 * scene.addChild(sprite);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/sprite3D/"></iframe>
 *
 * @see [Sprite3D Basic example](/RedGPU/examples/3d/sprite/sprite3D/)
 * @see [Sprite3D Comparison (World vs Pixel)](/RedGPU/examples/3d/sprite/sprite3DCompare/)
 * @see [Sprite3D MouseEvent example](/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/)
 * @category Sprite
 */
class Sprite3D extends Mesh {
    #nativeWidth: number = 1
    #nativeHeight: number = 1
    #worldSize: number = 1
    #pixelSize: number = 0
    #usePixelSize: boolean = false

    /**
     * [KO] Sprite3D 인스턴스를 생성합니다.
     * [EN] Creates a Sprite3D instance.
     *
     * ### Example
     * ```typescript
     * const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param material -
     * [KO] 스프라이트에 적용할 머티리얼 (선택)
     * [EN] Material to apply to the sprite (optional)
     * @param geometry -
     * [KO] 스프라이트 지오메트리 (생략 시 기본 `Plane` 생성)
     * [EN] Sprite geometry (creates a default `Plane` if omitted)
     */
    constructor(redGPUContext: RedGPUContext, material?, geometry?: Geometry | Primitive,) {
        super(redGPUContext);
        this._geometry = geometry || new Plane(redGPUContext);
        this._material = material
        if (this._material) this._material.transparent = true
        this.dirtyPipeline = true
        this.dirtyTransform = true
        this.primitiveState.cullMode = GPU_CULL_MODE.NONE
    }

    /**
     * [KO] 월드 공간 기준 스프라이트의 세로 크기(Unit 단위)를 가져오거나 설정합니다. 가로 크기는 텍스처 종횡비에 맞춰 자동 계산됩니다.
     * [EN] Gets or sets the vertical size of the sprite in world space (in units). The horizontal size is automatically calculated from the texture aspect ratio.
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
     * [KO] 카메라 거리와 무관한 고정 픽셀 크기(`pixelSize`) 모드 사용 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether to use fixed pixel size (`pixelSize`) mode regardless of camera distance.
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
     * [KO] `usePixelSize`가 `true`일 때 적용되는 화면 고정 픽셀 크기(px 단위)를 가져오거나 설정합니다.
     * [EN] Gets or sets the screen-fixed pixel size (in px) applied when `usePixelSize` is `true`.
     *
     * @returns
     * [KO] 고정 픽셀 크기 (단위: px)
     * [EN] Fixed pixel size (unit: px)
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
     * [KO] 스프라이트를 렌더링하며 텍스처 해상도 변경 시 렌더링 비율을 동기화합니다.
     * [EN] Renders the sprite and synchronizes rendering ratios when texture resolution changes.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData) {
        if (this._material instanceof BitmapMaterial && this._material.diffuseTexture) {
            const {gpuTexture} = this._material.diffuseTexture;
            if (gpuTexture) {
                const tW = gpuTexture.width
                const tH = gpuTexture.height
                if (tW !== this.#nativeWidth || tH !== this.#nativeHeight) {
                    this.#nativeWidth = tW
                    this.#nativeHeight = tH

                    const prevPixelSize = this.pixelSize;
                    this.pixelSize = this.pixelSize || tH;
                    this.#updateRatios();

                    if (prevPixelSize !== this.pixelSize) {
                        this.dirtyTransform = true
                    }
                }
            }
        }
        super.render(renderViewStateData);
    }

    /**
     * [KO] 빌보드 및 픽셀 크기 모드를 처리하는 `Sprite3D` 전용 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to `Sprite3D` that handles billboard and pixel size modes.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('SPRITE3D_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }

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
}

definePositiveNumber(Sprite3D, [
    {key: '_renderRatioX', value: 1},
    {key: '_renderRatioY', value: 1},
])
defineBoolean(Sprite3D, [
    {key: 'useBillboard', value: true},
])
Object.freeze(Sprite3D)
export default Sprite3D