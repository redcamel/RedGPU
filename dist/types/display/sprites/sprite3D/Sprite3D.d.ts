import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
/**
 * [KO] 3D 공간에 배치되는 스프라이트 클래스입니다.
 * [EN] Sprite class placed in 3D space.
 *
 * [KO] 텍스처 종횡비에 맞춰 가로·세로 비율(`renderRatioX`, `renderRatioY`)이 자동 산출되며, 빌보드 회전(`useBillboard`)과 크기 모드(`usePixelSize`: `worldSize` 또는 `pixelSize`)가 서로 독립적으로 동작합니다.
 * [EN] Automatically calculates horizontal and vertical ratios (`renderRatioX`, `renderRatioY`) from the texture aspect ratio, with billboard orientation (`useBillboard`) and size mode (`usePixelSize`: `worldSize` or `pixelSize`) operating independently.
 *
 * ### Example
 * ```typescript
 * const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
 * const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
 * scene.addChild(sprite);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/sprite3D/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Sprite3D Basic example](/RedGPU/examples/3d/sprite/sprite3D/)
 * @see [Sprite3D Comparison (World vs Pixel)](/RedGPU/examples/3d/sprite/sprite3DCompare/)
 * @see [Sprite3D MouseEvent example](/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/)
 * @category Sprite
 */
declare class Sprite3D extends Mesh {
    #private;
    /**
     * [KO] Sprite3D 인스턴스를 생성합니다.
     * [EN] Creates a Sprite3D instance.
     *
     * ### Example
     * ```typescript
     * const sprite = new RedGPU.Display.Sprite3D(redGPUContext, material);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param material -
     * [KO] 적용할 머티리얼 (선택)
     * [EN] Material to apply (optional)
     * @param geometry -
     * [KO] 지오메트리 또는 프리미티브 인스턴스 (생략 시 기본 `Plane` 사용)
     * [EN] Geometry or Primitive instance (defaults to `Plane` if omitted)
     */
    constructor(redGPUContext: RedGPUContext, material?: any, geometry?: Geometry | Primitive);
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
     * [KO] 카메라 거리와 무관한 화면 고정 픽셀 크기(`pixelSize`) 모드 사용 여부를 반환하거나 설정합니다. (기본값: `false`)
     * [EN] Returns or sets whether screen-fixed pixel size (`pixelSize`) mode is enabled regardless of camera distance. (Default: `false`)
     *
     * @returns
     * [KO] 고정 픽셀 크기 모드 활성화 여부
     * [EN] Whether fixed pixel size mode is enabled
     */
    get usePixelSize(): boolean;
    set usePixelSize(value: boolean);
    /**
     * [KO] 고정 픽셀 크기 모드(`usePixelSize: true`)에서 표시할 세로 픽셀 크기(px 단위, 미지정 시 텍스처 세로 해상도)를 반환하거나 설정합니다.
     * [EN] Returns or sets the vertical pixel size (in px; defaults to native texture height if unspecified) in fixed pixel size mode (`usePixelSize: true`).
     *
     * @returns
     * [KO] 세로 픽셀 크기 (단위: px)
     * [EN] Vertical pixel size (unit: px)
     */
    get pixelSize(): number;
    set pixelSize(value: number);
    /**
     * [KO] 텍스처 종횡비와 현재 크기 모드에 따라 산출된 가로 렌더링 스케일 비율을 반환합니다.
     * [EN] Returns the horizontal rendering scale ratio calculated from the texture aspect ratio and current size mode.
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
     * [KO] 연결된 텍스처 해상도 변경을 감지하여 렌더링 비율을 갱신하고 스프라이트를 렌더링합니다.
     * [EN] Detects resolution changes in the bound texture to update rendering ratios and renders the sprite.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] `Sprite3D` 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates the custom vertex shader module dedicated to `Sprite3D`.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default Sprite3D;
