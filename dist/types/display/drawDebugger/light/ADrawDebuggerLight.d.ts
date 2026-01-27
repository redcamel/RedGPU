import RedGPUContext from "../../../context/RedGPUContext";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
/**
 * [KO] 조명 객체를 시각화하는 디버거의 추상 베이스 클래스입니다.
 * [EN] Abstract base class for debuggers that visualize light objects.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class used internally by the system.<br/>Do not create instances directly.
 * :::
 * @category Debugger
 */
declare abstract class ADrawDebuggerLight {
    #private;
    constructor(redGPUContext: RedGPUContext, color: [number, number, number], maxLines?: number);
    get lightMaterial(): ColorMaterial;
    get lightDebugMesh(): Mesh;
    updateVertexBuffer(lines: number[][][], vertexBuffer: VertexBuffer): void;
    abstract render(renderViewStateData: RenderViewStateData): void;
    private createLightDebugGeometry;
}
export default ADrawDebuggerLight;
