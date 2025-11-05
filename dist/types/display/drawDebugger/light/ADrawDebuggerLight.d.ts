import RedGPUContext from "../../../context/RedGPUContext";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
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
