import RedGPUContext from "../../../context/RedGPUContext";
import DefineForVertex from "../../../defineProperty/DefineForVertex";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import ATextField from "../core/ATextField";
import vertexModuleSource from "./shader/textField3DVertex.wgsl";
import RenderViewStateData from "../../view/core/RenderViewStateData";

interface TextField3D {
    useBillboard: boolean;
    fontSize: number;
    _renderRatioX: number;
    _renderRatioY: number;
}

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_TEXT_FIELD_3D'
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

/**
 * [KO] 3D 공간에서 텍스트를 표현하는 클래스입니다.
 * [EN] Class that represents text in 3D space.
 *
 * [KO] 내부적으로 Plane 지오메트리를 사용하며, 텍스트 렌더링 결과를 텍스처로 출력하여 화면에 표시합니다. Billboard 기능을 지원하며, 텍스트 크기에 따라 transform을 자동으로 갱신합니다.
 * [EN] Internally uses Plane geometry and displays text rendering results as a texture. It supports Billboard functionality and automatically updates transforms according to text size.
 *
 * [KO] geometry와 material은 고정되어 있으며 외부에서 변경할 수 없습니다.
 * [EN] Geometry and material are fixed and cannot be changed externally.
 *
 * ### Example
 * ```typescript
 * const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello RedGPU!");
 * scene.addChild(textField);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/textField/textField3D/"></iframe>
 *
 * [KO] 아래는 TextField3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and and operation of TextField3D.
 * @see [TextField3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/textField3D/)
 *
 * @category TextField
 */
class TextField3D extends ATextField {
    #nativeWidth: number = 1
    #nativeHeight: number = 1
    #worldSize: number = 1
    #usePixelSize: boolean = false

    /**
     * [KO] 새로운 TextField3D 인스턴스를 생성합니다.
     * [EN] Creates a new TextField3D instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param text -
     * [KO] 초기 텍스트 문자열
     * [EN] Initial text string
     */
    constructor(redGPUContext: RedGPUContext, text?: string) {
        super(redGPUContext, (width: number, height: number) => {
            if (width && height) {
                if (width !== this.#nativeWidth || height !== this.#nativeHeight) {
                    this.#nativeWidth = width
                    this.#nativeHeight = height
                    
                    // [KO] 실제 렌더링된 컨테이너 크기(물리 픽셀)를 유니폼으로 전달
                    // [EN] Pass the actual rendered container size (physical pixels) to the uniform
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
     * [KO] 월드 공간에서의 텍스트 세로 크기(Unit 단위)를 반환합니다.
     * [EN] Returns the vertical size of the text in world space (Unit).
     */
    get worldSize(): number {
        return this.#worldSize;
    }

    /**
     * [KO] 월드 공간에서의 텍스트 세로 크기(Unit 단위)를 설정합니다. 가로 크기는 텍스트 길이에 따라 자동으로 조절됩니다.
     * [EN] Sets the vertical size of the text in world space (Unit). The horizontal size is automatically adjusted based on the text length.
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
     * [KO] 고정 픽셀 크기(Pixel Size) 모드 사용 여부를 반환합니다.
     * [EN] Returns whether to use fixed pixel size mode.
     */
    get usePixelSize(): boolean {
        return this.#usePixelSize;
    }

    /**
     * [KO] 실제 렌더링된 물리 픽셀 크기(높이)를 반환합니다.
     * [EN] Returns the actual rendered physical pixel size (height).
     */
    get pixelSize(): number {
        return this.#nativeHeight;
    }

    /**
     * [KO] 고정 픽셀 크기(Pixel Size) 모드 사용 여부를 설정합니다. true일 경우 거리에 상관없이 렌더링된 물리 픽셀 크기로 표시됩니다.
     * [EN] Sets whether to use fixed pixel size mode. If true, it is displayed at the rendered physical pixel size regardless of distance.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set usePixelSize(value: boolean) {
        if (this.gpuRenderInfo) {
            const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                vertexUniformInfo.members.usePixelSize.uniformOffset,
                new Uint32Array([value ? 1 : 0])
            )
            // [KO] 모드 전환 시 현재 물리 픽셀 크기도 즉시 동기화
            // [EN] Immediately sync current physical pixel size when switching modes
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
     * [KO] 텍스처 해상도와 설정값에 따라 내부 렌더링 비율을 업데이트합니다.
     * [EN] Updates internal rendering ratios based on texture resolution and settings.
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
     * [KO] 프레임마다 텍스트 필드를 렌더링합니다.
     * [EN] Renders the text field every frame.
     * @param renderViewStateData -
     * [KO] 현재 렌더링 상태 데이터
     * [EN] Current render view state data
     */
    render(renderViewStateData: RenderViewStateData) {
        super.render(renderViewStateData);
    }

    /**
     * [KO] 텍스트가 출력되는 지오메트리를 반환합니다. Plane으로 고정됩니다.
     * [EN] Returns the geometry where the text is displayed. Fixed with Plane.
     * @returns
     * [KO] 현재 지오메트리
     * [EN] Current geometry
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    /**
     * [KO] geometry는 외부에서 변경할 수 없습니다.
     * [EN] geometry cannot be changed externally.
     * @param value -
     * [KO] 설정하려는 지오메트리
     * [EN] Geometry to set
     */
    set geometry(value: Geometry | Primitive) {
        console.error('TextField3D can not change geometry');
    }

    /**
     * [KO] 텍스처를 관리하는 내부 머티리얼을 반환합니다.
     * [EN] Returns the internal material that manages the texture.
     * @returns
     * [KO] 머티리얼 객체
     * [EN] Material object
     */
    get material() {
        return this._material;
    }

    /**
     * [KO] material은 외부에서 변경할 수 없습니다.
     * [EN] material cannot be changed externally.
     * @param value -
     * [KO] 설정하려는 머티리얼
     * [EN] Material to set
     */
    set material(value) {
        console.error('TextField3D can not change material');
    }

    /**
     * [KO] TextField3D 전용 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a vertex shader module dedicated to TextField3D.
     * @returns
     * [KO] 생성된 GPU 셰이더 모듈
     * [EN] Created GPU shader module
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        return this.createMeshVertexShaderModuleBASIC(
            VERTEX_SHADER_MODULE_NAME,
            SHADER_INFO,
            UNIFORM_STRUCT,
            vertexModuleSource
        );
    }
}

/**
 * TextField3D 클래스에 렌더링 비율 속성들을 정의합니다.
 */
DefineForVertex.definePositiveNumber(TextField3D, [
    ['_renderRatioX', 1],
    ['_renderRatioY', 1],
])
// 버텍스 셰이더에서 사용할 프리셋 정의
DefineForVertex.defineByPreset(TextField3D, [
    [DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD, true],
]);
Object.freeze(TextField3D);
export default TextField3D;