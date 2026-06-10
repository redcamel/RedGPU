import RedGPUContext from "../../../context/RedGPUContext";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import ABaseLight from "../../../light/core/ABaseLight";
import TextField3D from "../../textFields/textField3D/TextField3D";
/**
 * 광원(Light) 디버거들의 조명 매개변수 및 시각 가이드를 그리기 위한 공통 추상 부모 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 3D 뷰포트 내에 조명의 위치를 상징하는 3D 텍스트 레이블({@link TextField3D}) 아이콘을 자동으로 오버레이 투영해 줍니다.
 * - 서브클래스에서 조명 데이터로부터 라인을 빌드하면, 이를 부드럽게 버텍스 버퍼에 매핑하는 공유 로직을 제공합니다.
 *
 * **[EN]**
 * - Draws light visualization layouts (lines, boundaries, emoji icons).
 * - Automatically initializes a 3D icon label using {@link TextField3D}.
 * - Implements a common buffer pipeline to stream coordinate details directly to GPU drawing passes.
 *
 * @category Debugger
 */
declare abstract class ADrawDebuggerLight<T extends ABaseLight> {
    #private;
    protected constructor(redGPUContext: RedGPUContext, target: T, labelIcon: string, color: [number, number, number], maxLines?: number);
    get target(): T;
    get label(): TextField3D;
    get lightDebugMesh(): Mesh;
    updateVertexBuffer(lines: number[][][], vertexBuffer: VertexBuffer): void;
    abstract render(renderViewStateData: RenderViewStateData): void;
}
export default ADrawDebuggerLight;
