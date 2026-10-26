import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
/**
 * [KO] 3D 공간의 X(빨강), Y(초록), Z(파랑) 3축 방향과 원점 위치를 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the X (Red), Y (Green), and Z (Blue) axis directions and origin position in 3D space.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 axis 프로퍼티를 통해 활성화합니다.
 * // [EN] Enable via the axis property of View3D.
 * view.axis = true;
 * ```
 *
 * @see [DrawDebugger basic example](/RedGPU/examples/3d/drawDebugger/basic/)
 * @category Debugger
 */
declare class DrawDebuggerAxis extends Mesh {
    #private;
    /**
     * [KO] `DrawDebuggerAxis` 인스턴스를 생성합니다.
     * [EN] Creates a `DrawDebuggerAxis` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default DrawDebuggerAxis;
