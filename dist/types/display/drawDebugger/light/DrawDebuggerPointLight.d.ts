import RedGPUContext from "../../../context/RedGPUContext";
import PointLight from "../../../light/lights/PointLight";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ADrawDebuggerLight from "./ADrawDebuggerLight";
/**
 * 점광원({@link PointLight})의 물리적 위치와 영향 범위를 입체적으로 나타내어 주는 디버거 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 전구 모양('💡') 아이콘 텍스트와 청록색의 3축 교차 원형 와이어프레임(XY, XZ, YZ 평면 원형 루프) 및 십자선을 그려 구형 반경을 시뮬레이션합니다.
 * - 반경 크기는 실시간으로 타겟 조명의 `radius` 설정값을 추적하여 투영 범위를 업데이트합니다.
 *
 * **[EN]**
 * - Visualizes light bounds and origin point of a target {@link PointLight}.
 * - Draws cyan wireframe boundary circles in 3 orthogonal planes (XY, XZ, YZ) alongside a bulb emoji ('💡') icon label.
 * - Tracks change events of the target light's `radius` property to update geometric bounds dynamically.
 *
 * @category Debugger
 */
declare class DrawDebuggerPointLight extends ADrawDebuggerLight<PointLight> {
    #private;
    constructor(redGPUContext: RedGPUContext, target: PointLight);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerPointLight;
