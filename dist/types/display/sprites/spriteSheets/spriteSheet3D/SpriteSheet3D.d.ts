import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
/**
 * [KO] 3D 공간에서 스프라이트 시트 애니메이션을 표시하는 클래스입니다.
 * [EN] Class that displays sprite sheet animations in 3D space.
 *
 * [KO] 단일 프레임 세그먼트 종횡비에 맞춰 가로·세로 비율(`renderRatioX`, `renderRatioY`)이 자동 산출되며, 빌보드 회전(`useBillboard`)과 크기 모드(`usePixelSize`: `worldSize` 또는 `pixelSize`)가 서로 독립적으로 동작합니다.
 * [EN] Automatically calculates horizontal and vertical ratios (`renderRatioX`, `renderRatioY`) from the aspect ratio of a single frame segment, with billboard orientation (`useBillboard`) and size mode (`usePixelSize`: `worldSize` or `pixelSize`) operating independently.
 *
 * ### Example
 * ```typescript
 * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
 * const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
 * scene.addChild(spriteSheet);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/" style="width:100%; height:500px;"></iframe>
 *
 * @see [SpriteSheet3D Basic Example](/RedGPU/examples/3d/sprite/spriteSheet3D/)
 * @see [SpriteSheet3D Comparison (World vs Pixel)](/RedGPU/examples/3d/sprite/spriteSheet3DCompare/)
 * @see [SpriteSheet3D MouseEvent Example](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)
 * @category SpriteSheet
 */
declare class SpriteSheet3D extends ASpriteSheet {
    #private;
    /**
     * [KO] SpriteSheet3D 인스턴스를 생성합니다.
     * [EN] Creates a SpriteSheet3D instance.
     *
     * ### Example
     * ```typescript
     * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
     * const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param spriteSheetInfo -
     * [KO] 스프라이트 시트 정의 정보(`SpriteSheetInfo`) 인스턴스
     * [EN] Sprite sheet definition (`SpriteSheetInfo`) instance
     */
    constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo);
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
     * [KO] 고정 픽셀 크기 모드(`usePixelSize: true`)에서 표시할 세로 픽셀 크기(px 단위, 미지정 시 단일 세그먼트 세로 해상도)를 반환하거나 설정합니다.
     * [EN] Returns or sets the vertical pixel size (in px; defaults to single segment height if unspecified) in fixed pixel size mode (`usePixelSize: true`).
     *
     * @returns
     * [KO] 세로 픽셀 크기 (단위: px)
     * [EN] Vertical pixel size (unit: px)
     */
    get pixelSize(): number;
    set pixelSize(value: number);
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
     * [KO] 세그먼트 종횡비와 현재 크기 모드에 따라 산출된 가로 렌더링 스케일 비율을 반환합니다.
     * [EN] Returns the horizontal rendering scale ratio calculated from the segment aspect ratio and current size mode.
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
     * @throws
     * [KO] 새 지오메트리 할당 시 에러가 발생합니다.
     * [EN] Throws an error if a new geometry is assigned.
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
     * @throws
     * [KO] 새 머티리얼 할당 시 에러가 발생합니다.
     * [EN] Throws an error if a new material is assigned.
     */
    get material(): any;
    set material(value: any);
    /**
     * [KO] 현재 프레임 상태를 갱신하고 스프라이트 시트를 렌더링합니다.
     * [EN] Updates the current frame state and renders the sprite sheet.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] `SpriteSheet3D` 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates the custom vertex shader module dedicated to `SpriteSheet3D`.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default SpriteSheet3D;
