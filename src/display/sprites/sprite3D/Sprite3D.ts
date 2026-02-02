import RedGPUContext from "../../../context/RedGPUContext";
import DefineForVertex from "../../../defineProperty/DefineForVertex";
import Geometry from "../../../geometry/Geometry";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import BitmapMaterial from "../../../material/bitmapMaterial/BitmapMaterial";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import vertexModuleSource from "./shader/sprite3DVertex.wgsl";

/** Sprite3D 전용 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_3D'
/** 파싱된 WGSL 셰이더 정보 */
const SHADER_INFO = parseWGSL(vertexModuleSource);
/** 버텍스 유니폼 구조체 정보 */
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

/**
 * Sprite3D의 빌보드 관련 속성을 정의하는 인터페이스
 */
interface Sprite3D {
    /** 빌보드 모드 사용 여부 */
    useBillboard: boolean;
    /** 고정 크기 사용 여부 */
    usePixelSize: boolean;
    /** 고정 크기 값 (px) */
    pixelSize: number;
    /** X축 렌더링 비율 */
    _renderRatioX: number;
    /** Y축 렌더링 비율 */
    _renderRatioY: number;
}

/**
 * [KO] 3D 공간에서 항상 카메라를 향하는 2D 스프라이트 객체입니다.
 * [EN] 2D sprite object that always faces the camera in 3D space.
 *
 * [KO] Mesh 클래스를 상속받아 빌보드 기능을 제공하는 클래스입니다. 빌보드는 3D 공간에 배치되지만 항상 카메라 방향을 바라보는 평면 객체로, UI 요소, 파티클, 텍스트, 아이콘 등을 3D 씬에 표시할 때 유용합니다.
 * [EN] A class that inherits from Mesh and provides billboard functionality. A billboard is a flat object placed in 3D space but always facing the camera, useful for displaying UI elements, particles, text, icons, etc., in a 3D scene.
 *
 * * ### Example
 * ```typescript
 * const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
 * scene.addChild(sprite);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/sprite3D/"></iframe>
 *
 * [KO] 아래는 Sprite3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Sprite3D.
 * @see [Sprite3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/sprite3D/)
 *
 * @category Sprite
 */
class Sprite3D extends Mesh {
    #nativeWidth: number = 1
    #nativeHeight: number = 1
    #worldSize: number = 1

    /**
     * [KO] 새로운 Sprite3D 인스턴스를 생성합니다.
     * [EN] Creates a new Sprite3D instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param material -
     * [KO] 스프라이트에 적용할 머티리얼 (옵션)
     * [EN] Material to apply to the sprite (optional)
     * @param geometry -
     * [KO] 스프라이트의 지오메트리 (기본값: 새로운 Plane 인스턴스)
     * [EN] Geometry of the sprite (default: new Plane instance)
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

    #updateRatios() {
        if (this.#nativeHeight) {
            const prevX = this._renderRatioX;
            const prevY = this._renderRatioY;

            // worldSize가 반영된 최종 렌더링 비율 계산
            this._renderRatioY = this.#worldSize;
            this._renderRatioX = (this.#nativeWidth / this.#nativeHeight) * this.#worldSize;

            if (prevX !== this._renderRatioX || prevY !== this._renderRatioY) {
                this.dirtyTransform = true;
            }
        }
    }

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
                    // 원본 해상도를 pixelSize 기본값으로 동기화
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
     * Sprite3D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     *
     * 이 메서드는 빌보드 기능을 지원하는 전용 버텍스 셰이더를 생성합니다.
     * 일반 메시와 달리 카메라 방향에 따라 정점 위치를 동적으로 계산하는
     * 셰이더 로직이 포함되어 있습니다.
     *
     * @returns 생성된 버텍스 셰이더 모듈 정보
     *
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }
}

/**
 * Sprite3D 클래스에 렌더링 비율 속성들을 정의합니다.
 */
DefineForVertex.definePositiveNumber(Sprite3D, [
    ['_renderRatioX', 1],
    ['_renderRatioY', 1],
])
/**
 * Sprite3D 클래스에 빌보드 관련 속성들을 정의합니다.
 */
DefineForVertex.defineByPreset(Sprite3D, [
    [DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD, true],
    [DefineForVertex.PRESET_BOOLEAN.USE_PIXEL_SIZE, false],
    [DefineForVertex.PRESET_POSITIVE_NUMBER.PIXEL_SIZE, 0],
])
Object.freeze(Sprite3D)
export default Sprite3D