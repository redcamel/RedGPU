import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
/**
 * [KO] 3D 공간의 X, Y, Z축을 시각화하는 디버깅용 축 클래스입니다.
 * [EN] Debugging axis class that visualizes the X, Y, and Z axes in 3D space.
 *
 * [KO] 각 축의 끝에는 원뿔 형태의 화살표가 있어 방향을 명확히 알 수 있습니다. (X: 빨강, Y: 초록, Z: 파랑)
 * [EN] Arrows in the shape of cones at the end of each axis clearly indicate the direction. (X: red, Y: green, Z: blue)
 * @category Debugger
 */
declare class DrawDebuggerAxis extends Mesh {
    #private;
    /**
     * [KO] DrawDebuggerAxis 인스턴스를 생성합니다.
     * [EN] Creates an instance of DrawDebuggerAxis.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default DrawDebuggerAxis;
