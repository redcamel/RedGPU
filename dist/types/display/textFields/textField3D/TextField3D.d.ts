import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import ATextField from "../core/ATextField";
import RenderViewStateData from "../../view/core/RenderViewStateData";
/**
 * [KO] 3D 공간에 배치되는 텍스트 필드 클래스입니다.
 * [EN] Text field class placed in 3D space.
 *
 * [KO] 텍스트 텍스처 종횡비에 맞춰 가로·세로 비율(`renderRatioX`, `renderRatioY`)이 자동 산출되며, 빌보드 회전(`useBillboard`)과 크기 모드(`usePixelSize`: `worldSize` 또는 `pixelSize`)가 서로 독립적으로 동작합니다.
 * [EN] Automatically calculates horizontal and vertical ratios (`renderRatioX`, `renderRatioY`) from the text texture aspect ratio, with billboard orientation (`useBillboard`) and size mode (`usePixelSize`: `worldSize` or `pixelSize`) operating independently.
 *
 * ### Example
 * ```typescript
 * const textField = new RedGPU.Display.TextField3D(redGPUContext, "Hello RedGPU!");
 * scene.addChild(textField);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/textField/textField3D/" style="width:100%; height:500px;"></iframe>
 *
 * [KO] 월드 사이즈와 픽셀 사이즈 모드를 비교하는 예제입니다.
 * [EN] An example comparing World Size and Pixel Size modes.
 * <iframe src="/RedGPU/examples/3d/textField/textField3DCompare/" style="width:100%; height:500px;"></iframe>
 *
 * @see [TextField3D Basic Example](/RedGPU/examples/3d/textField/textField3D/)
 * @see [TextField3D Comparison (World vs Pixel)](/RedGPU/examples/3d/textField/textField3DCompare/)
 * @see [TextField3D MouseEvent Example](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)
 * @category TextField
 */
declare class TextField3D extends ATextField {
    #private;
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
    constructor(redGPUContext: RedGPUContext, text?: string);
    /**
     * [KO] 카메라를 항상 정면으로 바라보는 빌보드 모드 사용 여부를 반환하거나 설정합니다. (기본값: `true`)
     * [EN] Returns or sets whether billboard mode (always facing the camera) is enabled. (Default: `true`)
     *
     * @returns
     * [KO] 빌보드 모드 활성화 여부
     * [EN] Whether billboard mode is enabled
     */
    get useBillboard(): boolean;
    set useBillboard(value: boolean);
    /**
     * [KO] 월드 단위 크기 모드(`usePixelSize: false`)에서 기준 세로 크기(Unit 단위)를 반환하거나 설정합니다. (기본값: `1`)
     * [EN] Returns or sets the vertical size in world units when in world size mode (`usePixelSize: false`). (Default: `1`)
     *
     * @returns
     * [KO] 월드 공간 기준 세로 크기
     * [EN] Vertical size in world space
     */
    get worldSize(): number;
    set worldSize(value: number);
    /**
     * [KO] 카메라 거리와 무관하게 텍스트 컨테이너의 픽셀 높이(`pixelSize`)로 표시할지 여부를 반환하거나 설정합니다. (기본값: `false`)
     * [EN] Returns or sets whether to display at the text container's pixel height (`pixelSize`) regardless of camera distance. (Default: `false`)
     *
     * @returns
     * [KO] 고정 픽셀 크기 모드 활성화 여부
     * [EN] Whether fixed pixel size mode is enabled
     */
    get usePixelSize(): boolean;
    set usePixelSize(value: boolean);
    /**
     * [KO] 스타일(`fontSize`, `padding` 등)에 의해 결정된 텍스트 컨테이너의 세로 픽셀 크기(px 단위)를 반환합니다.
     * [EN] Returns the vertical pixel size (in px) of the text container determined by styles (`fontSize`, `padding`, etc.).
     *
     * @returns
     * [KO] 세로 픽셀 크기 (단위: px)
     * [EN] Vertical pixel size (unit: px)
     */
    get pixelSize(): number;
    /**
     * [KO] 텍스트 텍스처 종횡비와 현재 크기 모드에 따라 산출된 가로 렌더링 스케일 비율을 반환합니다.
     * [EN] Returns the horizontal rendering scale ratio calculated from the text texture aspect ratio and current size mode.
     *
     * @returns
     * [KO] 가로 렌더링 비율
     * [EN] Horizontal rendering ratio
     */
    get renderRatioX(): number;
    /**
     * [KO] 현재 크기 모드에 따라 산출된 세로 렌더링 스케일 비율을 반환합니다.
     * [EN] Returns the vertical rendering scale ratio calculated from the current size mode.
     *
     * @returns
     * [KO] 세로 렌더링 비율
     * [EN] Vertical rendering ratio
     */
    get renderRatioY(): number;
    /**
     * [KO] 내부 고정 `Plane` 지오메트리를 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the internal fixed `Plane` geometry. Cannot be changed externally.
     *
     * @returns
     * [KO] 지오메트리 인스턴스
     * [EN] Geometry instance
     */
    get geometry(): Geometry | Primitive;
    set geometry(value: Geometry | Primitive);
    /**
     * [KO] 내부 고정 머티리얼을 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the internal fixed material. Cannot be changed externally.
     *
     * @returns
     * [KO] 머티리얼 인스턴스
     * [EN] Material instance
     */
    get material(): any;
    set material(value: any);
    /**
     * [KO] 텍스트 텍스처를 갱신하고 텍스트 필드를 렌더링합니다.
     * [EN] Updates the text texture and renders the text field.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] `TextField3D` 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates the custom vertex shader module dedicated to `TextField3D`.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default TextField3D;
