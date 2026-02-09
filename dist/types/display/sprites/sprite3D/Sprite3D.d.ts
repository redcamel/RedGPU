import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
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
declare class Sprite3D extends Mesh {
    #private;
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
    constructor(redGPUContext: RedGPUContext, material?: any, geometry?: Geometry | Primitive);
    /**
     * [KO] 월드 공간에서의 스프라이트 세로 크기(Unit 단위)를 반환합니다.
     * [EN] Returns the vertical size of the sprite in world space (Unit).
     */
    get worldSize(): number;
    /**
     * [KO] 월드 공간에서의 스프라이트 세로 크기(Unit 단위)를 설정합니다. 가로 크기는 텍스처의 비율에 따라 자동으로 조절됩니다.
     * [EN] Sets the vertical size of the sprite in world space (Unit). The horizontal size is automatically adjusted based on the texture's aspect ratio.
     * @param value -
     * [KO] 설정할 월드 크기
     * [EN] World size to set
     */
    set worldSize(value: number);
    /**
     * [KO] 고정 픽셀 크기(Pixel Size) 모드 사용 여부를 반환합니다.
     * [EN] Returns whether to use fixed pixel size mode.
     */
    get usePixelSize(): boolean;
    /**
     * [KO] 고정 픽셀 크기(Pixel Size) 모드 사용 여부를 설정합니다. true일 경우 거리에 상관없이 pixelSize에 설정된 크기로 렌더링됩니다.
     * [EN] Sets whether to use fixed pixel size mode. If true, it is rendered at the size set in pixelSize regardless of distance.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set usePixelSize(value: boolean);
    /**
     * [KO] 고정 픽셀 크기 값을 반환합니다. (px 단위)
     * [EN] Returns the fixed pixel size value (in px).
     */
    get pixelSize(): number;
    /**
     * [KO] 고정 픽셀 크기 값을 설정합니다. (px 단위) usePixelSize가 true일 때만 적용됩니다.
     * [EN] Sets the fixed pixel size value (in px). Only applied when usePixelSize is true.
     * @param value -
     * [KO] 설정할 픽셀 크기
     * [EN] Pixel size to set
     */
    set pixelSize(value: number);
    /**
     * [KO] 프레임마다 스프라이트를 렌더링합니다. 텍스처 로드 완료 시 원본 해상도를 자동으로 동기화합니다.
     * [EN] Renders the sprite every frame. Automatically syncs physical resolution when texture loading is complete.
     * @param renderViewStateData -
     * [KO] 현재 렌더링 상태 데이터
     * [EN] Current render view state data
     */
    render(renderViewStateData: RenderViewStateData): void;
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
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default Sprite3D;
