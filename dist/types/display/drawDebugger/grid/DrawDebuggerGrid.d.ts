import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import BaseObject from "../../../base/BaseObject";
/**
 * 3D 씬(Scene)의 기준 바닥면을 절차적 안티앨리어싱(Procedural Anti-Aliased) 격자로 렌더링하여 구조와 위치를 가늠하게 돕는 디버깅용 그리드 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 화면 공간 편미분(`fwidth`)과 `smoothstep`을 결합한 절차적 렌더링을 사용하여 모아레(Moiré) 간섭 무늬와 지글거림이 전혀 없는 극도로 선명한 그리드를 제공합니다.
 * - 단일 평면 쿼드(Quad) 메쉬 기반으로 동작하여 수천 개의 라인 정점 버퍼 할당 오버헤드를 원천 제거합니다.
 * - 기본 보조선(Minor, $1\text{m}$)과 주선(Major, $10\text{m}$) 다중 계층 렌더링을 지원하며, X축(빨강)과 Z축(파랑) 중심축을 선명하게 강조합니다.
 * - 카메라 거리에 따른 부드러운 페이드아웃 및 픽셀 단위 라인 두께 조절을 지원합니다.
 *
 * **[EN]**
 * - Renders a crystal-clear, moiré-free procedural anti-aliased grid on the base ground plane using screen-space derivatives (`fwidth`) and `smoothstep`.
 * - Operates on a single plane quad mesh, eliminating vertex buffer allocation overhead for thousands of line segments.
 * - Supports multi-level grid rendering with minor ($1\text{m}$) and major ($10\text{m}$) lines, distinctly highlighting X-axis (Red) and Z-axis (Blue).
 * - Features distance-based smooth fadeout and pixel-accurate line width control.
 *
 * @category Debugger
 */
declare class DrawDebuggerGrid extends BaseObject {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 그리드 평면의 가로/세로 크기(단위: m)를 반환합니다.
     * [EN] Returns the width/length of the grid plane (unit: m).
     */
    get size(): number;
    /**
     * [KO] 그리드 평면의 가로/세로 크기(단위: m)를 설정합니다.
     * [EN] Sets the width/length of the grid plane (unit: m).
     */
    set size(value: number);
    /**
     * [KO] 기본 보조 그리드(Minor Grid) 간격(단위: m, 기본값: 1.0)을 반환합니다.
     * [EN] Returns the minor grid spacing (unit: m, default: 1.0).
     */
    get gridSize(): number;
    /**
     * [KO] 기본 보조 그리드(Minor Grid) 간격(단위: m, 기본값: 1.0)을 설정합니다.
     * [EN] Sets the minor grid spacing (unit: m, default: 1.0).
     */
    set gridSize(value: number);
    /**
     * [KO] 주 그리드(Major Grid) 간격(단위: m, 기본값: 10.0)을 반환합니다.
     * [EN] Returns the major grid spacing (unit: m, default: 10.0).
     */
    get majorStep(): number;
    /**
     * [KO] 주 그리드(Major Grid) 간격(단위: m, 기본값: 10.0)을 설정합니다.
     * [EN] Sets the major grid spacing (unit: m, default: 10.0).
     */
    set majorStep(value: number);
    /**
     * [KO] 보조선(Minor)의 화면 픽셀 두께(기본값: 1.0)를 반환합니다.
     * [EN] Returns the screen pixel line width for minor grid lines (default: 1.0).
     */
    get lineWidth(): number;
    /**
     * [KO] 보조선(Minor)의 화면 픽셀 두께(기본값: 1.0)를 설정합니다.
     * [EN] Sets the screen pixel line width for minor grid lines (default: 1.0).
     */
    set lineWidth(value: number);
    /**
     * [KO] 주선(Major)의 화면 픽셀 두께(기본값: 1.5)를 반환합니다.
     * [EN] Returns the screen pixel line width for major grid lines (default: 1.5).
     */
    get majorLineWidth(): number;
    /**
     * [KO] 주선(Major)의 화면 픽셀 두께(기본값: 1.5)를 설정합니다.
     * [EN] Sets the screen pixel line width for major grid lines (default: 1.5).
     */
    set majorLineWidth(value: number);
    /**
     * [KO] X축 및 Z축 중심선의 화면 픽셀 두께(기본값: 2.0)를 반환합니다.
     * [EN] Returns the screen pixel line width for X/Z axis lines (default: 2.0).
     */
    get axisLineWidth(): number;
    /**
     * [KO] X축 및 Z축 중심선의 화면 픽셀 두께(기본값: 2.0)를 설정합니다.
     * [EN] Sets the screen pixel line width for X/Z axis lines (default: 2.0).
     */
    set axisLineWidth(value: number);
    /**
     * [KO] 거리 기반 페이드가 시작되는 카메라 거리(단위: m, 기본값: 20.0)를 반환합니다.
     * [EN] Returns the camera distance where distance fade starts (unit: m, default: 20.0).
     */
    get fadeStart(): number;
    /**
     * [KO] 거리 기반 페이드가 시작되는 카메라 거리(단위: m, 기본값: 20.0)를 설정합니다.
     * [EN] Sets the camera distance where distance fade starts (unit: m, default: 20.0).
     */
    set fadeStart(value: number);
    /**
     * [KO] 거리 기반 페이드가 완료되어 완전 투명해지는 카메라 거리(단위: m, 기본값: 80.0)를 반환합니다.
     * [EN] Returns the camera distance where distance fade ends (unit: m, default: 80.0).
     */
    get fadeEnd(): number;
    /**
     * [KO] 거리 기반 페이드가 완료되어 완전 투명해지는 카메라 거리(단위: m, 기본값: 80.0)를 설정합니다.
     * [EN] Sets the camera distance where distance fade ends (unit: m, default: 80.0).
     */
    set fadeEnd(value: number);
    /**
     * [KO] 기본 보조 그리드 색상(ColorRGBA)을 반환합니다.
     * [EN] Returns the minor grid line color (ColorRGBA).
     */
    get lineColor(): ColorRGBA;
    /**
     * [KO] 주 그리드(Major Grid) 색상(ColorRGBA)을 반환합니다.
     * [EN] Returns the major grid line color (ColorRGBA).
     */
    get majorLineColor(): ColorRGBA;
    /**
     * [KO] X축(빨강) 중심선 색상(ColorRGBA)을 반환합니다.
     * [EN] Returns the X-axis line color (ColorRGBA).
     */
    get xAxisColor(): ColorRGBA;
    /**
     * [KO] Z축(파랑) 중심선 색상(ColorRGBA)을 반환합니다.
     * [EN] Returns the Z-axis line color (ColorRGBA).
     */
    get zAxisColor(): ColorRGBA;
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] DrawDebuggerGrid를 파기하고 드로우 커맨드 슬롯과 자원 참조를 해제합니다.
     * [EN] Destroys the DrawDebuggerGrid and releases the draw command slot and resource references.
     */
    destroy(): void;
}
export default DrawDebuggerGrid;
