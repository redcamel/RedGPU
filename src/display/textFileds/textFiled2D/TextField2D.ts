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
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
const BaseTextField2D = mixInMesh2D(ATextField);

/**
 * TextField2D 클래스는 2D 공간에서 텍스트를 표현하는 객체입니다.
 *
 * 내부적으로 Plane 지오메트리를 사용하며, 텍스트 렌더링 결과를 텍스처로 출력하여 화면에 표시합니다.
 * 텍스트 크기와 smoothing 설정에 따라 텍스처 필터링 방식이 자동으로 조정됩니다.
 *
 * @remarks
 * geometry와 material은 고정되어 있으며 외부에서 변경할 수 없습니다.
 *
 * <iframe src="/RedGPU/examples/2d/textField2D/basic/"></iframe>
 *
 * 아래는 TextField2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [TextField2D MouseEvent example](/RedGPU/examples/2d/mouseEvent/textField2D/)
 *
 * @category TextField
 */
class TextField2D extends BaseTextField2D {
    /**
     * 텍스트 렌더링 결과의 너비 (픽셀 단위)
     */
    #width: number = 1;
    /**
     * 텍스트 렌더링 결과의 높이 (픽셀 단위)
     */
    #height: number = 1;
    /**
     * 텍스처 필터링에 smoothing을 사용할지 여부
     */
    #useSmoothing: boolean = true;

    /**
     * TextField2D 생성자입니다.
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param useSmoothing - 텍스처 필터링에 smoothing 적용 여부
     */
    constructor(redGPUContext: RedGPUContext, useSmoothing: boolean = true) {
        super(redGPUContext, (width: number, height: number) => {
            if(this.#width !== width || this.#height !== height) {
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
     * 텍스처 필터링에 smoothing을 사용할지 여부를 반환합니다.
     */
    get useSmoothing(): boolean {
        return this.#useSmoothing;
    }

    /**
     * 텍스처 필터링에 smoothing을 설정합니다.
     * true일 경우 LINEAR 필터를 사용하고, false일 경우 NEAREST 필터를 사용합니다.
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
     * 텍스트 렌더링 결과의 너비를 반환합니다.
     */
    get width(): number {
        return this.#width;
    }

    /**
     * 텍스트 렌더링 결과의 높이를 반환합니다.
     */
    get height(): number {
        return this.#height;
    }

    /**
     * 텍스트가 출력되는 지오메트리입니다. Plane으로 고정됩니다.
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    /**
     * geometry는 외부에서 변경할 수 없습니다.
     */
    set geometry(value: Geometry | Primitive) {
        console.error('TextField2D can not change geometry');
    }

    /**
     * 텍스트에 사용되는 머티리얼입니다.
     */
    get material() {
        return this._material;
    }

    /**
     * material은 외부에서 변경할 수 없습니다.
     */
    set material(value) {
        console.error('TextField2D can not change material');
    }

    /**
     * TextField2D 전용 버텍스 셰이더 모듈을 생성합니다.
     * @returns {GPUShaderModule}
     */
    createCustomMeshVertexShaderModule() {
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
