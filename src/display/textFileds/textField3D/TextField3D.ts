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
 * * ### Example
 * ```typescript
 * const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello RedGPU!");
 * scene.addChild(textField);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/textField3D/"></iframe>
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
     * [KO] TextField3D 생성자
     * [EN] TextField3D constructor
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
                    this.fontSize = this.fontSize
                    this.#updateRatios();
                }
            }
        });

        // [KO] fontSize 프로퍼티를 래핑하여 변경 시 GPU 유니폼(pixelSize)도 함께 업데이트하도록 설정
        // [EN] Wrap fontSize property to update GPU uniform (pixelSize) whenever it changes
        const descriptor = Object.getOwnPropertyDescriptor(this, 'fontSize');
        const orgSetter = descriptor.set;
        Object.defineProperty(this, 'fontSize', {
            get: () => this['_fontSize'],
            set: (v: number) => {
                orgSetter.call(this, v);
                if (this.gpuRenderInfo) {
                    const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo
                    this.redGPUContext.gpuDevice.queue.writeBuffer(
                        vertexUniformBuffer.gpuBuffer,
                        vertexUniformInfo.members.pixelSize.uniformOffset,
                        new Float32Array([v])
                    )
                }
            },
            configurable: true
        });

        this._geometry = new Plane(redGPUContext);
        this.disableJitter = true;
        if (text) this.text = text;
    }

    /**
     * [KO] 월드 공간에서의 세로 크기(높이)를 반환합니다.
     * [EN] Returns the vertical size (height) in world space.
     */
    get worldSize(): number {
        return this.#worldSize;
    }

    /**
     * [KO] 월드 공간에서의 세로 크기(높이)를 설정합니다.
     * [EN] Sets the vertical size (height) in world space.
     * @param value - [KO] 월드 크기 (Unit) [EN] World size (Unit)
     */
    set worldSize(value: number) {
        if (this.#worldSize === value) return;
        this.#worldSize = value;
        this.#updateRatios();
    }

    /**
     * [KO] 고정 크기 사용 여부를 설정합니다.
     * [EN] Sets whether to use fixed pixel size.
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

    #updateRatios() {
        if (this.#nativeHeight) {
            const prevX = this._renderRatioX;
            const prevY = this._renderRatioY;

            if (this.usePixelSize) {
                // [KO] pixelSize 모드일 때는 worldSize를 무시하고 종횡비만 유지
                // [EN] In pixelSize mode, ignore worldSize and maintain only the aspect ratio
                this._renderRatioY = 1;
                this._renderRatioX = this.#nativeWidth / this.#nativeHeight;
            } else {
                // [KO] worldSize가 반영된 최종 렌더링 비율 계산
                // [EN] Calculate final rendering ratios reflecting worldSize
                this._renderRatioY = this.#worldSize;
                this._renderRatioX = (this.#nativeWidth / this.#nativeHeight) * this.#worldSize;
            }

            if (prevX !== this._renderRatioX || prevY !== this._renderRatioY) {
                this.dirtyTransform = true;
            }
        }
    }

    render(renderViewStateData: RenderViewStateData) {
        super.render(renderViewStateData);
    }

    /**
     * 텍스트가 출력되는 지오메트리입니다. Plane으로 고정됩니다.
     * @returns {Geometry | Primitive}
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    /**
     * geometry는 외부에서 변경할 수 없습니다.
     */
    set geometry(value: Geometry | Primitive) {
        console.error('TextField3D can not change geometry');
    }

    /**
     * 텍스트에 사용되는 머티리얼입니다.
     * @returns 머티리얼 객체
     */
    get material() {
        return this._material;
    }

    /**
     * material은 외부에서 변경할 수 없습니다.
     */
    set material(value) {
        console.error('TextField3D can not change material');
    }

    /**
     * TextField3D 전용 버텍스 셰이더 모듈을 생성합니다.
     * @returns {GPUShaderModule}
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