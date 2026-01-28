import Mesh from "../../../display/mesh/Mesh";
import { Node } from "../GLTF";
/**
 * Parses the transformation and matrix information from `nodeInfo` and applies it to the `mesh`.
 *
 * @param {Mesh} mesh - The mesh to apply the transformations to.
 * @param {Node} nodeInfo - The information about the node containing the transformation data.
 * @returns {void}
 */
declare const parseTRSAndMATRIX_GLTF: (mesh: Mesh, nodeInfo: Node) => void;
export default parseTRSAndMATRIX_GLTF;
