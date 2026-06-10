import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
/**
 * X, Y, Z 세 축의 방향과 위치를 직관적으로 시각화해 주는 3D 공간 디버깅용 축 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 각 축의 양(+)의 끝부분에는 원뿔 형태의 화살표가 배치되어 공간 방향성을 인지하기 좋습니다.
 * - X축은 빨간색(Red), Y축은 초록색(Green), Z축은 파란색(Blue)으로 대응되어 표현됩니다.
 * - 원점(0, 0, 0)을 명확하게 파악할 수 있도록 중심부에 지름 1 크기(반지름 0.5)의 Sphere 메시가 배치되어 있습니다.
 *
 * **[EN]**
 * - Renders coordinate axis indicators along with positive-direction cone tips to clarify alignment in 3D space.
 * - Color-codes the axes respectively: X-axis in Red, Y-axis in Green, and Z-axis in Blue.
 * - Places a center Sphere mesh (radius 0.5) at the origin to easily reference the default base position.
 *
 * @category Debugger
 */
declare class DrawDebuggerAxis extends Mesh {
    #private;
    /**
     * `DrawDebuggerAxis` 인스턴스를 생성합니다.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default DrawDebuggerAxis;
