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
 * ### Example
 * ```typescript
 * const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
 * scene.addChild(sprite);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/sprite3D/"></iframe>
 *
 * [KO] 월드 사이즈와 픽셀 사이즈 모드를 비교하는 예제입니다.
 * [EN] An example comparing World Size and Pixel Size modes.
 * <iframe src="/RedGPU/examples/3d/sprite/sprite3DCompare/"></iframe>
 *
 * @see
 * [KO] 아래는 Sprite3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Sprite3D.
 * @see [Sprite3D Comparison (World vs Pixel)](/RedGPU/examples/3d/sprite/sprite3DCompare/)
 * @see [Sprite3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/sprite3D/)
 *
 * @category Sprite
 */
class Sprite3D extends Mesh {
    #nativeWidth: number = 1
    #nativeHeight: number = 1
    #worldSize: number = 1
    #pixelSize: number = 0
    #usePixelSize: boolean = false

    /**
     * [KO] 새로운 Sprite3D 인스턴스를 생성합니다.
     * [EN] Creates a new Sprite3D instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param material -
     * [KO] 스프라이트에 적용할 머티리얼 (선택적)
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
     * [KO] 월드 공간에서의 스프라이트 세로 크기(Unit 단위)를 반환합니다.
     * [EN] Returns the vertical size of the sprite in world space (Unit).
     */
    get worldSize(): number {
        return this.#worldSize;
    }

    /**
     * [KO] 월드 공간에서의 스프라이트 세로 크기(Unit 단위)를 설정합니다. 가로 크기는 텍스처의 비율에 따라 자동으로 조절됩니다.
     * [EN] Sets the vertical size of the sprite in world space (Unit). The horizontal size is automatically adjusted based on the texture's aspect ratio.
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
     * [KO] 고정 픽셀 크기(Pixel Size) 모드 사용 여부를 설정합니다. true일 경우 거리에 상관없이 pixelSize에 설정된 크기로 렌더링됩니다.
     * [EN] Sets whether to use fixed pixel size mode. If true, it is rendered at the size set in pixelSize regardless of distance.
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
        }
        if (this.#usePixelSize === value) return;
        this.#usePixelSize = value;
        this.#updateRatios();
    }

    /**
     * [KO] 고정 픽셀 크기 값을 반환합니다. (px 단위)
     * [EN] Returns the fixed pixel size value (in px).
     */
    get pixelSize(): number {
        return this.#pixelSize;
    }

    /**
     * [KO] 고정 픽셀 크기 값을 설정합니다. (px 단위) usePixelSize가 true일 때만 적용됩니다.
     * [EN] Sets the fixed pixel size value (in px). Only applied when usePixelSize is true.
     * @param value -
     * [KO] 설정할 픽셀 크기
     * [EN] Pixel size to set
     */
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
     * [KO] 텍스처 비율과 설정값에 따라 내부 렌더링 비율을 업데이트합니다.
     * [EN] Updates internal rendering ratios based on texture ratio and settings.
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
     * [KO] 프레임마다 스프라이트를 렌더링합니다. 텍스처 로드 완료 시 원본 해상도를 자동으로 동기화합니다.
     * [EN] Renders the sprite every frame. Automatically syncs physical resolution when texture loading is complete.
     * @param renderViewStateData -
     * [KO] 현재 렌더링 상태 데이터
     * [EN] Current render view state data
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
     * [KO] Sprite3D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to Sprite3D.
     *
     * [KO] 빌보드 기능을 지원하며 카메라 방향에 따라 정점 위치를 동적으로 계산하는 셰이더를 생성합니다.
     * [EN] Supports billboard functionality and creates a shader that dynamically calculates vertex positions based on camera direction.
     *
     * @returns
     * [KO] 생성된 GPU 셰이더 모듈
     * [EN] Created GPU shader module
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
])
Object.freeze(Sprite3D)
export default Sprite3D