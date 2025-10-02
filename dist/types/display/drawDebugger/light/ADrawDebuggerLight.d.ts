import RedGPUContext from "../../../context/RedGPUContext";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import Mesh from "../../mesh/Mesh";
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
