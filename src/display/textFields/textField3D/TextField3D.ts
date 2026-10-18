import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import ATextField from "../core/ATextField";
import vertexModuleSource from "./shader/textField3DVertex.wgsl";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineBoolean from "../../../defineProperty/funcs/defineBoolean";


/**
 * [KO] TextField3D의 빌보드 및 렌더링 비율 속성을 정의하는 인터페이스입니다.
 * [EN] Interface defining billboard and rendering ratio properties of TextField3D.
 *
 * @category TextField
 */
interface TextField3D {
    /**
     * [KO] 빌보드 모드 사용 여부 (`true`일 경우 항상 카메라를 향함)
     * [EN] Whether to use billboard mode (always faces the camera if `true`)
     */
    useBillboard: boolean;
    /**
     * [KO] 글자 크기 (픽셀 단위)
     * [EN] Font size (in pixels)
     */
    fontSize: number;
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

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_TEXT_FIELD_3D'


/**
 * [KO] 3D 공간에서 빌보드 및 고정 픽셀 크기 모드를 지원하는 3D 텍스트 필드 클래스입니다.
 * [EN] 3D text field class supporting billboard and fixed pixel size modes in 3D space.
 *
 * [KO] 렌더링된 텍스트 텍스처의 종횡비에 따라 가로/세로 비율이 자동 갱신되며, `geometry`와 `material`은 고정되어 외부에서 변경할 수 없습니다.
 * [EN] Horizontal and vertical ratios are automatically updated based on the aspect ratio of the rendered text texture, and `geometry` and `material` are fixed and cannot be changed externally.
 *
 * ### Example
 * ```typescript
 * const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello RedGPU!");
 * scene.addChild(textField);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/textField/textField3D/"></iframe>
 *
 * [KO] 월드 사이즈와 픽셀 사이즈 모드를 비교하는 예제입니다.
 * [EN] An example comparing World Size and Pixel Size modes.
 * <iframe src="/RedGPU/examples/3d/textField/textField3DCompare/"></iframe>
 *
 * @see [TextField3D Basic Example](/RedGPU/examples/3d/textField/textField3D/)
 * @see [TextField3D Comparison (World vs Pixel)](/RedGPU/examples/3d/textField/textField3DCompare/)
 * @see [TextField3D MouseEvent Example](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)
 * @category TextField
 */
class TextField3D extends ATextField {
    #nativeWidth: number = 1
    #nativeHeight: number = 1
    #worldSize: number = 1
    #usePixelSize: boolean = false

    /**
     * [KO] TextField3D 인스턴스를 생성합니다.
     * [EN] Creates a TextField3D instance.
     *
     * ### Example
     * ```typescript
     * const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello 3D!");
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param text -
     * [KO] 초기 표시할 텍스트 문자열 (선택)
     * [EN] Initial text string to display (optional)
     */
    constructor(redGPUContext: RedGPUContext, text?: string) {
        super(redGPUContext, (width: number, height: number) => {
            if (width && height) {
                if (width !== this.#nativeWidth || height !== this.#nativeHeight) {
                    this.#nativeWidth = width
                    this.#nativeHeight = height

                    if (this.gpuRenderInfo) {
                        this.redGPUContext.gpuDevice.queue.writeBuffer(
                            this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
                            this.gpuRenderInfo.vertexUniformInfo.members.pixelSize.uniformOffset,
                            new Float32Array([height * window.devicePixelRatio])
                        )
                    }
                    this.#updateRatios();
                }
            }
        });

        this._geometry = new Plane(redGPUContext);
        this.disableJitter = true;
        if (text) this.text = text;
    }

    /**
     * [KO] 월드 공간 기준 텍스트 세로 크기(Unit 단위)를 반환하거나 설정합니다. 가로 크기는 텍스트 종횡비에 비례하여 자동 조절됩니다.
     * [EN] Returns or sets the vertical size of the text in world space (in units). Horizontal size is automatically adjusted in proportion to the text aspect ratio.
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
     * [KO] 카메라 거리와 무관하게 렌더링된 물리 픽셀 크기(`pixelSize`)로 표시할지 여부를 반환하거나 설정합니다.
     * [EN] Returns or sets whether to display at the rendered physical pixel size (`pixelSize`) regardless of camera distance.
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
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                vertexUniformInfo.members.pixelSize.uniformOffset,
                new Float32Array([this.#nativeHeight * window.devicePixelRatio])
            )
        }
        if (this.#usePixelSize === value) return;
        this.#usePixelSize = value;
        this.#updateRatios();
    }

    /**
     * [KO] 렌더링된 텍스트 컨테이너의 물리 픽셀 높이(px)를 반환합니다.
     * [EN] Returns the rendered physical pixel height (in px) of the text container.
     *
     * @returns
     * [KO] 물리 픽셀 높이 (px 단위)
     * [EN] Physical pixel height (in px)
     */
    get pixelSize(): number {
        return this.#nativeHeight;
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
        console.error('TextField3D can not change geometry');
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
        console.error('TextField3D can not change material');
    }

    /**
     * [KO] 텍스트 필드를 렌더링합니다.
     * [EN] Renders the text field.
     *
     * @param renderViewStateData -
     * [KO] 뷰 렌더링 상태 데이터
     * [EN] View rendering state data
     */
    render(renderViewStateData: RenderViewStateData) {
        super.render(renderViewStateData);
    }

    /**
     * [KO] TextField3D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to TextField3D.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('TEXTFIELD3D_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        return this.createMeshVertexShaderModuleBASIC(
            VERTEX_SHADER_MODULE_NAME,
            SHADER_INFO,
            UNIFORM_STRUCT,
            vertexModuleSource
        );
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

definePositiveNumber(TextField3D, [
    {key: '_renderRatioX', value: 1},
    {key: '_renderRatioY', value: 1},
])
defineBoolean(TextField3D, [
    {key: 'useBillboard', value: true},
])
Object.freeze(TextField3D);
export default TextField3D;