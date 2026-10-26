import BaseObject from "../../../base/BaseObject";
import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../view/View3D";
/**
 * [KO] 3D 씬(Scene)의 기준 바닥면(XZ 평면)에 절차적 안티앨리어싱 격자를 렌더링하는 디버거 클래스입니다.
 * [EN] Debugger class that renders a procedural anti-aliased grid on the base ground plane (XZ plane) of a 3D scene.
 *
 * [KO] 보조선(Minor Grid), 주선(Major Grid), X축(빨강) 및 Z축(파랑) 중심선을 표시하며 카메라 거리에 따른 페이드아웃을 지원합니다.
 * [EN] Displays minor grid lines, major grid lines, X-axis (Red) and Z-axis (Blue) center lines, and supports distance-based fadeout.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 grid 프로퍼티를 통해 활성화합니다.
 * // [EN] Enable via the grid property of View3D.
 * view.grid = true;
 * ```
 *
 * @see [DrawDebugger basic example](/RedGPU/examples/3d/drawDebugger/basic/)
 * @category Debugger
 */
declare class DrawDebuggerGrid extends BaseObject {
    #private;
    /**
     * [KO] `DrawDebuggerGrid` 인스턴스를 생성합니다.
     * [EN] Creates a `DrawDebuggerGrid` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 그리드 평면의 가로/세로 크기(단위: m, 기본값: 100)를 가져오거나 설정합니다.
     * [EN] Gets or sets the width and length of the grid plane (unit: m, default: 100).
     *
     * @returns
     * [KO] 그리드 평면 크기
     * [EN] Grid plane size
     */
    get size(): number;
    /**
     * [KO] 기본 보조 그리드(Minor Grid) 간격(단위: m, 기본값: 1.0)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minor grid spacing (unit: m, default: 1.0).
     *
     * @returns
     * [KO] 보조 그리드 간격
     * [EN] Minor grid spacing
     */
    get gridSize(): number;
    set size(value: number);
    /**
     * [KO] 주 그리드(Major Grid) 간격(단위: m, 기본값: 10.0)을 가져오거나 설정합니다.
     * [EN] Gets or sets the major grid spacing (unit: m, default: 10.0).
     *
     * @returns
     * [KO] 주 그리드 간격
     * [EN] Major grid spacing
     */
    get majorStep(): number;
    set gridSize(value: number);
    /**
     * [KO] 보조선(Minor Grid)의 화면 픽셀 두께(기본값: 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the screen pixel line width for minor grid lines (default: 1.0).
     *
     * @returns
     * [KO] 보조선 두께
     * [EN] Minor grid line width
     */
    get lineWidth(): number;
    set majorStep(value: number);
    /**
     * [KO] 주선(Major Grid)의 화면 픽셀 두께(기본값: 1.5)를 가져오거나 설정합니다.
     * [EN] Gets or sets the screen pixel line width for major grid lines (default: 1.5).
     *
     * @returns
     * [KO] 주선 두께
     * [EN] Major grid line width
     */
    get majorLineWidth(): number;
    set lineWidth(value: number);
    /**
     * [KO] X축 및 Z축 중심선의 화면 픽셀 두께(기본값: 2.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the screen pixel line width for X/Z axis lines (default: 2.0).
     *
     * @returns
     * [KO] 축 중심선 두께
     * [EN] Axis line width
     */
    get axisLineWidth(): number;
    set majorLineWidth(value: number);
    /**
     * [KO] 거리 기반 페이드가 시작되는 카메라 거리(단위: m, 기본값: 25.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera distance where distance fade starts (unit: m, default: 25.0).
     *
     * @returns
     * [KO] 페이드 시작 거리
     * [EN] Fade start distance
     */
    get fadeStart(): number;
    set axisLineWidth(value: number);
    /**
     * [KO] 거리 기반 페이드가 완료되어 투명해지는 카메라 거리(단위: m, 기본값: 60.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera distance where distance fade ends (unit: m, default: 60.0).
     *
     * @returns
     * [KO] 페이드 종료 거리
     * [EN] Fade end distance
     */
    get fadeEnd(): number;
    set fadeStart(value: number);
    /**
     * [KO] 기본 보조 그리드(Minor Grid) 색상을 반환합니다.
     * [EN] Returns the minor grid line color.
     *
     * @returns
     * [KO] 보조 그리드 색상 인스턴스
     * [EN] Minor grid color instance
     */
    get lineColor(): ColorRGBA;
    set fadeEnd(value: number);
    /**
     * [KO] 주 그리드(Major Grid) 색상을 반환합니다.
     * [EN] Returns the major grid line color.
     *
     * @returns
     * [KO] 주 그리드 색상 인스턴스
     * [EN] Major grid color instance
     */
    get majorLineColor(): ColorRGBA;
    /**
     * [KO] X축(빨강) 중심선 색상을 반환합니다.
     * [EN] Returns the X-axis (Red) center line color.
     *
     * @returns
     * [KO] X축 중심선 색상 인스턴스
     * [EN] X-axis center line color instance
     */
    get xAxisColor(): ColorRGBA;
    /**
     * [KO] Z축(파랑) 중심선 색상을 반환합니다.
     * [EN] Returns the Z-axis (Blue) center line color.
     *
     * @returns
     * [KO] Z축 중심선 색상 인스턴스
     * [EN] Z-axis center line color instance
     */
    get zAxisColor(): ColorRGBA;
    /**
     * [KO] 디버그 그리드를 렌더링합니다.
     * [EN] Renders the debug grid.
     *
     * @param view -
     * [KO] 렌더링할 View3D 인스턴스
     * [EN] View3D instance to render
     * @param targetTextureView -
     * [KO] 컬러 렌더 타겟 텍스처 뷰
     * [EN] Color render target texture view
     * @param depthTextureView -
     * [KO] 깊이 렌더 타겟 텍스처 뷰
     * [EN] Depth render target texture view
     */
    render(view: View3D, targetTextureView: GPUTextureView, depthTextureView: GPUTextureView): void;
    /**
     * [KO] `DrawDebuggerGrid` 인스턴스를 파기하고 할당된 GPU 리소스와 드로우 커맨드 슬롯을 해제합니다.
     * [EN] Destroys the `DrawDebuggerGrid` instance and releases allocated GPU resources and draw command slots.
     */
    destroy(): void;
}
export default DrawDebuggerGrid;
