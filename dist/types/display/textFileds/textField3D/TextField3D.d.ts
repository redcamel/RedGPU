import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import ATextField from "../core/ATextField";
import RenderViewStateData from "../../view/core/RenderViewStateData";
interface TextField3D {
    useBillboard: boolean;
    fontSize: number;
    _renderRatioX: number;
    _renderRatioY: number;
}
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
 * [KO] 월드 사이즈와 픽셀 사이즈 모드를 비교하는 예제입니다.
 * [EN] An example comparing World Size and Pixel Size modes.
 * <iframe src="/RedGPU/examples/3d/textField/textField3DCompare/"></iframe>
 *
 * [KO] 아래는 TextField3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and and operation of TextField3D.
 * @see [TextField3D Comparison (World vs Pixel)](/RedGPU/examples/3d/textField/textField3DCompare/)
 * @see [TextField3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/textField3D/)
 *
 * @category TextField
 */
declare class TextField3D extends ATextField {
    #private;
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
    constructor(redGPUContext: RedGPUContext, text?: string);
    /**
     * [KO] 월드 공간에서의 텍스트 세로 크기(Unit 단위)를 반환합니다.
     * [EN] Returns the vertical size of the text in world space (Unit).
     */
    get worldSize(): number;
    /**
     * [KO] 월드 공간에서의 텍스트 세로 크기(Unit 단위)를 설정합니다. 가로 크기는 텍스트 길이에 따라 자동으로 조절됩니다.
     * [EN] Sets the vertical size of the text in world space (Unit). The horizontal size is automatically adjusted based on the text length.
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
     * [KO] 실제 렌더링된 물리 픽셀 크기(높이)를 반환합니다.
     * [EN] Returns the actual rendered physical pixel size (height).
     */
    get pixelSize(): number;
    /**
     * [KO] 고정 픽셀 크기(Pixel Size) 모드 사용 여부를 설정합니다. true일 경우 거리에 상관없이 렌더링된 물리 픽셀 크기로 표시됩니다.
     * [EN] Sets whether to use fixed pixel size mode. If true, it is displayed at the rendered physical pixel size regardless of distance.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set usePixelSize(value: boolean);
    /**
     * [KO] 프레임마다 텍스트 필드를 렌더링합니다.
     * [EN] Renders the text field every frame.
     * @param renderViewStateData -
     * [KO] 현재 렌더링 상태 데이터
     * [EN] Current render view state data
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 텍스트가 출력되는 지오메트리를 반환합니다. Plane으로 고정됩니다.
     * [EN] Returns the geometry where the text is displayed. Fixed with Plane.
     * @returns
     * [KO] 현재 지오메트리
     * [EN] Current geometry
     */
    get geometry(): Geometry | Primitive;
    /**
     * [KO] geometry는 외부에서 변경할 수 없습니다.
     * [EN] geometry cannot be changed externally.
     * @param value -
     * [KO] 설정하려는 지오메트리
     * [EN] Geometry to set
     */
    set geometry(value: Geometry | Primitive);
    /**
     * [KO] 텍스처를 관리하는 내부 머티리얼을 반환합니다.
     * [EN] Returns the internal material that manages the texture.
     * @returns
     * [KO] 머티리얼 객체
     * [EN] Material object
     */
    get material(): any;
    /**
     * [KO] material은 외부에서 변경할 수 없습니다.
     * [EN] material cannot be changed externally.
     * @param value -
     * [KO] 설정하려는 머티리얼
     * [EN] Material to set
     */
    set material(value: any);
    /**
     * [KO] TextField3D 전용 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a vertex shader module dedicated to TextField3D.
     * @returns
     * [KO] 생성된 GPU 셰이더 모듈
     * [EN] Created GPU shader module
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default TextField3D;
