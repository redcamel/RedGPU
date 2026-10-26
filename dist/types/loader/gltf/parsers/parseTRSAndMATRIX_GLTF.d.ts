import Mesh from "../../../display/mesh/Mesh";
import { Node } from "../GLTF";
/**
 * [KO] GLTF 노드의 변환(TRS) 및 행렬(Matrix) 정보를 파싱하여 메쉬에 적용합니다.
 * [EN] Parses the transformation (TRS) and matrix information of a GLTF node and applies it to the mesh.
 *
 * @param mesh -
 * [KO] 변환을 적용할 대상 메쉬
 * [EN] Target mesh to apply transformations to
 * @param nodeInfo -
 * [KO] 변환 데이터를 포함하는 GLTF 노드 정보
 * [EN] GLTF node information containing transformation data
 * @category Loader
 */
declare const parseTRSAndMATRIX_GLTF: (mesh: Mesh, nodeInfo: Node) => void;
export default parseTRSAndMATRIX_GLTF;
