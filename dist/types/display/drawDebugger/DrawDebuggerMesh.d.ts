import RedGPUContext from "../../context/RedGPUContext";
import RenderViewStateData from "../view/core/RenderViewStateData";
import Mesh from "../mesh/Mesh";
type DebugMode = 'OBB' | 'AABB' | 'BOTH' | 'COMBINED_AABB';
declare class DrawDebuggerMesh {
    #private;
    constructor(redGPUContext: RedGPUContext, target: Mesh);
    get debugMode(): DebugMode;
    set debugMode(value: DebugMode);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerMesh;
