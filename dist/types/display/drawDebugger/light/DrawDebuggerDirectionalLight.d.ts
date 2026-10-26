import RedGPUContext from "../../../context/RedGPUContext";
import DirectionalLight from "../../../light/lights/DirectionalLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
/**
 * [KO] 직사광(`DirectionalLight`)의 조사 방향 벡터를 3D 공간에 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the light direction vector of a `DirectionalLight` in 3D space.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] DirectionalLight의 enableDebugger 프로퍼티를 통해 활성화합니다.
 * // [EN] Enable via the enableDebugger property of DirectionalLight.
 * directionalLight.enableDebugger = true;
 * ```
 *
 * @see [DirectionalLight example](/RedGPU/examples/3d/light/directionalLight/)
 * @see [DrawDebugger basic example](/RedGPU/examples/3d/drawDebugger/basic/)
 * @category Debugger
 */
declare class DrawDebuggerDirectionalLight extends ADrawDebuggerLight<DirectionalLight> {
    #private;
    /**
     * [KO] `DrawDebuggerDirectionalLight` 인스턴스를 생성합니다.
     * [EN] Creates a `DrawDebuggerDirectionalLight` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param target -
     * [KO] 디버깅할 대상 직사광 객체
     * [EN] Target directional light object to debug
     */
    constructor(redGPUContext: RedGPUContext, target: DirectionalLight);
    /**
     * [KO] 직사광 디버그 가이드와 아이콘 레이블을 렌더링합니다.
     * [EN] Renders the directional light debug guide and icon label.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerDirectionalLight;
