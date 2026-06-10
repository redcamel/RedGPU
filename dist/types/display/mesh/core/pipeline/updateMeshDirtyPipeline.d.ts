import RenderViewStateData from "../../../view/core/RenderViewStateData";
import Mesh from "../../Mesh";
/**
 * Updates the dirty state of a mesh's pipeline and related data.
 *
 * @param {Mesh} mesh - The mesh to update.
 * @param {RenderViewStateData} renderViewStateData - The render state data used for debugging.
 *

 */
declare const updateMeshDirtyPipeline: (mesh: Mesh, renderViewStateData?: RenderViewStateData) => void;
export default updateMeshDirtyPipeline;
