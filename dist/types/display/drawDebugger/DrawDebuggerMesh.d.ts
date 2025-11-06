import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
type DebugMode = 'OBB' | 'AABB' | 'BOTH' | 'COMBINED_AABB';
declare class DrawDebuggerMesh {
    #private;
    constructor(redGPUContext: RedGPUContext, target: Mesh);
    get debugMode(): DebugMode;
    set debugMode(value: DebugMode);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerMesh;
