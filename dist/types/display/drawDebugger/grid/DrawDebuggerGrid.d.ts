import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import BaseObject from "../../../base/BaseObject";
/**
 * 3D 씬(Scene)의 기준 바닥면을 바둑판 형태의 격자로 렌더링하여 구조와 위치를 가늠하게 돕는 디버깅용 그리드 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 그리드 크기(`size`)에 상응하는 1단위 간격의 격자선을 그리며, Z축(파란색)과 X축(빨간색) 방향 중심선을 다르게 채색하여 방위 인지를 도모합니다.
 * - 투명 블렌딩 상태 조절 및 안티앨리어싱(MSAA) 설정 변경 등 렌더 상태에 동적으로 대처하며, 성능 최적화를 위해 GPU 렌더 번들(Render Bundle)로 드로우를 제어합니다.
 *
 * **[EN]**
 * - Visualizes the base ground plane as a grid mesh in the 3D scene.
 * - Spans line elements at 1-unit intervals matching `size`, and highlights coordinate directions: Z-center line in Blue and X-center line in Red.
 * - Adapts to blending and antialiasing parameters using optimized GPU Render Bundles.
 *
 * @category Debugger
 */
declare class DrawDebuggerGrid extends BaseObject {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get size(): number;
    set size(value: number);
    get lineColor(): ColorRGBA;
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] DrawDebuggerGrid를 파기하고 드로우 커맨드 슬롯과 자원 참조를 해제합니다.
     * [EN] Destroys the DrawDebuggerGrid and releases the draw command slot and resource references.
     */
    destroy(): void;
}
export default DrawDebuggerGrid;
