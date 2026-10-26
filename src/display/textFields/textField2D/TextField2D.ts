import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import {mixInMesh2D} from "../../mesh/core";
import ATextField from "../core/ATextField";
import vertexModuleSource from "./shader/textField2DVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_TEXT_FIELD_2D'

const BaseTextField2D = mixInMesh2D(ATextField);

/**
 * [KO] 2D 공간에서 HTML/SVG 기반 텍스트를 텍스처로 변환하여 표시하는 2D 텍스트 필드 클래스입니다.
 * [EN] 2D text field class that converts HTML/SVG-based text into a texture and displays it in 2D space.
 *
 * [KO] 렌더링된 텍스트 크기에 맞춰 가로/세로 픽셀 크기가 자동으로 결정되며, `geometry`와 `material`은 고정되어 외부에서 변경할 수 없습니다.
 * [EN] Width and height in pixels are automatically determined by the rendered text size, and `geometry` and `material` are fixed and cannot be changed externally.
 *
 * ### Example
 * ```typescript
 * const textField = new RedGPU.Display.TextField2D(redGPUContext);
 * textField.text = "Hello 2D Text!";
 * scene.addChild(textField);
 * ```
 *
 * <iframe src="/RedGPU/examples/2d/textField2D/basic/" style="width:100%; height:500px;"></iframe>
 *
 * @see [TextField2D Basic Example](/RedGPU/examples/2d/textField2D/basic/)
 * @see [TextField2D MouseEvent Example](/RedGPU/examples/2d/interaction/mouseEvent/textField2D/)
 * @category TextField
 */
class TextField2D extends BaseTextField2D {
    #width: number = 1;
    #height: number = 1;
    #useSmoothing: boolean = true;

    /**
     * [KO] TextField2D 인스턴스를 생성합니다.
     * [EN] Creates a TextField2D instance.
     *
     * ### Example
     * ```typescript
     * const textField = new RedGPU.Display.TextField2D(redGPUContext, true);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param useSmoothing -
     * [KO] 텍스처 스무딩(선형 필터링) 사용 여부 (기본값: `true`)
     * [EN] Whether to use texture smoothing (linear filtering) (default: `true`)
     */
    constructor(redGPUContext: RedGPUContext, useSmoothing: boolean = true) {
        super(redGPUContext, (width: number, height: number) => {
            if (this.#width !== width || this.#height !== height) {
                this.dirtyTransform = true
            }
            this.#width = width;
            this.#height = height;
        }, false);
        this._geometry = new Plane(redGPUContext, 1, 1, 1, 1, true);
        this.useSmoothing = useSmoothing;
        this.primitiveState.cullMode = GPU_CULL_MODE.FRONT;
    }

    /**
     * [KO] 텍스처 스무딩 사용 여부를 반환하거나 설정합니다. `true`일 경우 `LINEAR` 필터, `false`일 경우 `NEAREST` 필터가 적용됩니다.
     * [EN] Returns or sets whether texture smoothing is used. Applies `LINEAR` filter if `true`, or `NEAREST` filter if `false`.
     *
     * @returns
     * [KO] 스무딩 사용 여부
     * [EN] Whether smoothing is enabled
     */
    get useSmoothing(): boolean {
        return this.#useSmoothing;
    }

    set useSmoothing(value: boolean) {
        this.#useSmoothing = value;
        const {diffuseTextureSampler} = this._material;
        if (this.useSmoothing) {
            diffuseTextureSampler.minFilter = GPU_FILTER_MODE.LINEAR;
            diffuseTextureSampler.magFilter = GPU_FILTER_MODE.LINEAR;
            diffuseTextureSampler.mipmapFilter = GPU_MIPMAP_FILTER_MODE.LINEAR;
        } else {
            diffuseTextureSampler.minFilter = GPU_FILTER_MODE.NEAREST;
            diffuseTextureSampler.magFilter = GPU_FILTER_MODE.NEAREST;
            diffuseTextureSampler.mipmapFilter = null;
        }
    }

    /**
     * [KO] 렌더링된 텍스트 영역의 픽셀 너비를 반환합니다.
     * [EN] Returns the pixel width of the rendered text area.
     *
     * @returns
     * [KO] 너비 (픽셀 단위)
     * [EN] Width (in pixels)
     */
    get width(): number {
        return this.#width;
    }

    /**
     * [KO] 렌더링된 텍스트 영역의 픽셀 높이를 반환합니다.
     * [EN] Returns the pixel height of the rendered text area.
     *
     * @returns
     * [KO] 높이 (픽셀 단위)
     * [EN] Height (in pixels)
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
        console.error('TextField2D can not change geometry');
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
        console.error('TextField2D can not change material');
    }

    /**
     * [KO] TextField2D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to TextField2D.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('TEXTFIELD2D_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        return this.createMeshVertexShaderModuleBASIC(
            VERTEX_SHADER_MODULE_NAME,
            SHADER_INFO,
            UNIFORM_STRUCT,
            vertexModuleSource
        );
    }
}

Object.freeze(TextField2D);
export default TextField2D;
