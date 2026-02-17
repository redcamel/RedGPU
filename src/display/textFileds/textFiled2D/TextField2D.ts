import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import {keepLog} from "../../../utils";
import {mixInMesh2D} from "../../mesh/core";
import ATextField from "../core/ATextField";
import vertexModuleSource from "./shader/textField2DVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_TEXT_FIELD_2D'
const SHADER_INFO = parseWGSL(vertexModuleSource, 'TEXTFIELD2D_VERTEX');
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
const BaseTextField2D = mixInMesh2D(ATextField);

/**
 * [KO] 2D 공간에서 텍스트를 표현하는 클래스입니다.
 * [EN] Class that represents text in 2D space.
 *
 * [KO] 내부적으로 Plane 지오메트리를 사용하며, 텍스트 렌더링 결과를 텍스처로 출력하여 화면에 표시합니다. 텍스트 크기와 smoothing 설정에 따라 텍스처 필터링 방식이 자동으로 조정됩니다.
 * [EN] Internally uses Plane geometry and displays text rendering results as a texture. Texture filtering is automatically adjusted based on text size and smoothing settings.
 *
 * [KO] geometry와 material은 고정되어 있으며 외부에서 변경할 수 없습니다.
 * [EN] Geometry and material are fixed and cannot be changed externally.
 *
 * ### Example
 * ```typescript
 * const textField = new RedGPU.Display.TextField2D(redGPUContext);
 * textField.text = "Hello 2D Text!";
 * scene.addChild(textField);
 * ```
 *
 * <iframe src="/RedGPU/examples/2d/textField2D/basic/"></iframe>
 *
 * [KO] 아래는 TextField2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of TextField2D.
 * @see [TextField2D MouseEvent example](/RedGPU/examples/2d/interaction/mouseEvent/textField2D/)
 *
 * @category TextField
 */
class TextField2D extends BaseTextField2D {
    /**
     * [KO] 텍스트 렌더링 결과의 너비 (픽셀 단위)
     * [EN] Width of the text rendering result (in pixels)
     */
    #width: number = 1;
    /**
     * [KO] 텍스트 렌더링 결과의 높이 (픽셀 단위)
     * [EN] Height of the text rendering result (in pixels)
     */
    #height: number = 1;
    /**
     * [KO] 텍스처 필터링에 smoothing을 사용할지 여부
     * [EN] Whether to use smoothing for texture filtering
     */
    #useSmoothing: boolean = true;

    /**
     * [KO] TextField2D 인스턴스를 생성합니다.
     * [EN] Creates a TextField2D instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param useSmoothing -
     * [KO] 텍스처 필터링에 smoothing 적용 여부 (기본값: true)
     * [EN] Whether to apply smoothing to texture filtering (default: true)
     */
    constructor(redGPUContext: RedGPUContext, useSmoothing: boolean = true) {
        super(redGPUContext, (width: number, height: number) => {
            if (this.#width !== width || this.#height !== height) {
                this.dirtyTransform = true
            }
            this.#width = width;
            this.#height = height;
        }, false);
        this._geometry = new Plane(redGPUContext, 1, 1, 1, 1, 1, true);
        this.useSmoothing = useSmoothing;
        this.primitiveState.cullMode = GPU_CULL_MODE.FRONT;
        keepLog(this)
    }

    /**
     * [KO] 텍스처 필터링에 smoothing을 사용할지 여부를 반환합니다.
     * [EN] Returns whether to use smoothing for texture filtering.
     */
    get useSmoothing(): boolean {
        return this.#useSmoothing;
    }

    /**
     * [KO] 텍스처 필터링에 smoothing을 설정합니다. true일 경우 LINEAR 필터를 사용하고, false일 경우 NEAREST 필터를 사용합니다.
     * [EN] Sets smoothing for texture filtering. If true, uses LINEAR filter; if false, uses NEAREST filter.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set useSmoothing(value: boolean) {
        this.#useSmoothing = value;
        if (this.useSmoothing) {
            this._material.diffuseTextureSampler.minFilter = GPU_FILTER_MODE.LINEAR;
            this._material.diffuseTextureSampler.magFilter = GPU_FILTER_MODE.LINEAR;
            this._material.diffuseTextureSampler.mipmapFilter = GPU_MIPMAP_FILTER_MODE.LINEAR;
        } else {
            this._material.diffuseTextureSampler.minFilter = GPU_FILTER_MODE.NEAREST;
            this._material.diffuseTextureSampler.magFilter = GPU_FILTER_MODE.NEAREST;
            this._material.diffuseTextureSampler.mipmapFilter = null;
        }
    }

    /**
     * [KO] 텍스트 렌더링 결과의 너비를 반환합니다.
     * [EN] Returns the width of the text rendering result.
     */
    get width(): number {
        return this.#width;
    }

    /**
     * [KO] 텍스트 렌더링 결과의 높이를 반환합니다.
     * [EN] Returns the height of the text rendering result.
     */
    get height(): number {
        return this.#height;
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
     * [KO] TextField2D는 지오메트리를 변경할 수 없습니다.
     * [EN] TextField2D cannot change geometry.
     * @param value -
     * [KO] 설정하려는 지오메트리
     * [EN] Geometry to set
     */
    set geometry(value: Geometry | Primitive) {
        console.error('TextField2D can not change geometry');
    }

    /**
     * [KO] 텍스트에 사용되는 머티리얼을 반환합니다.
     * [EN] Returns the material used for the text.
     * @returns
     * [KO] 현재 머티리얼
     * [EN] Current material
     */
    get material() {
        return this._material;
    }

    /**
     * [KO] TextField2D는 머티리얼을 변경할 수 없습니다.
     * [EN] TextField2D cannot change material.
     * @param value -
     * [KO] 설정하려는 머티리얼
     * [EN] Material to set
     */
    set material(value) {
        console.error('TextField2D can not change material');
    }

    /**
     * [KO] TextField2D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a vertex shader module dedicated to TextField2D.
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

Object.freeze(TextField2D);
export default TextField2D;
