import Mesh from "../../../display/mesh/Mesh";
import { GLTF, GlTfId } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * [KO] glTF 노드 계층을 파싱하여 대응하는 메시 또는 그룹을 생성하고 부모 메시에 추가합니다.
 * [EN] Parses the glTF node hierarchy to construct the corresponding mesh or group and attaches it to the parent mesh.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 원본 `GLTF` 데이터 객체
 * [EN] Source `GLTF` data object
 * @param nodeGlTfId -
 * [KO] 파싱할 노드의 glTF 식별자
 * [EN] glTF identifier of the node to parse
 * @param parentMesh -
 * [KO] 생성된 노드를 하위 자식으로 추가할 부모 `Mesh` 인스턴스
 * [EN] Parent `Mesh` instance to attach the parsed node to
 * @category GLTF
 */
declare const parseNode_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, nodeGlTfId: GlTfId, parentMesh: Mesh) => void;
export default parseNode_GLTF;
