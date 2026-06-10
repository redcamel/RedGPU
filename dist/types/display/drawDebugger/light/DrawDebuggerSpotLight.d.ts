import RedGPUContext from "../../../context/RedGPUContext";
import SpotLight from "../../../light/lights/SpotLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
/**
 * 스포트라이트({@link SpotLight})의 원추형 조사 범위, 방향, 도달거리를 입체 기하 형태로 시각화하는 디버거 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 🔦 모양의 레이블 아이콘과 함께, 조명의 조사각 설정(`innerCutoff` 및 `outerCutoff`)에 정렬된 이중 원뿔 선 형태를 노란색 와이어프레임으로 제공합니다.
 * - 도달 거리 경계 원호와 중심선, 시작점 조준 십자선 등을 조합하여 광원의 유효 방향을 입체적으로 인지하기 좋습니다.
 *
 * **[EN]**
 * - Renders nested cones corresponding to the inner (`innerCutoff`) and outer (`outerCutoff`) bounds of a target {@link SpotLight}.
 * - Employs a flashlight emoji ('🔦') label alongside yellow guidelines mapping directions, lengths, and point anchors.
 *
 * @category Debugger
 */
declare class DrawDebuggerSpotLight extends ADrawDebuggerLight<SpotLight> {
    #private;
    constructor(redGPUContext: RedGPUContext, target: SpotLight);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerSpotLight;
