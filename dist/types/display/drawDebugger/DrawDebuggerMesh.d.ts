import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
type DebugMode = 'OBB' | 'AABB' | 'BOTH' | 'COMBINED_AABB';
/**
 * [KO] 메시의 바운딩 볼륨(AABB, OBB)을 시각화하는 디버깅용 클래스입니다.
 * [EN] Debugging class that visualizes the bounding volume (AABB, OBB) of a mesh.
 * @category Debugger
 */
declare class DrawDebuggerMesh {
    #private;
    constructor(redGPUContext: RedGPUContext, target: Mesh);
    get debugMode(): DebugMode;
    set debugMode(value: DebugMode);
    render(renderViewStateData: RenderViewStateData): void;
}
export default DrawDebuggerMesh;
