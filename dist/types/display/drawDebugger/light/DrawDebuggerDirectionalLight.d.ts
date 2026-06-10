import RedGPUContext from "../../../context/RedGPUContext";
import DirectionalLight from "../../../light/lights/DirectionalLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
/**
 * 직사광({@link DirectionalLight})의 위치 및 조사 방향 벡터를 공간상에 투영하는 디버거 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - ☀️ 모양의 레이블 아이콘과 노란색의 화살표 라인을 이용하여 직사광이 비추는 투사 각도를 명시해 줍니다.
 * - 대상 조명 객체의 `enableDebugger` 플래그 상태에 따라 자동으로 렌더링 노출을 온/오프 처리합니다.
 *
 * **[EN]**
 * - Visualizes direction vectors and reference coordinates of a target {@link DirectionalLight}.
 * - Utilizes a sun emoji icon ('☀️') and a yellow line arrow pointing towards the light projection vector.
 * - Listens to the `enableDebugger` flag of the source light object to dynamically switch draw execution.
 *
 * @category Debugger
 */
declare class DrawDebuggerDirectionalLight extends ADrawDebuggerLight<DirectionalLight> {
    #private;
    constructor(redGPUContext: RedGPUContext, target: DirectionalLight);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerDirectionalLight;
