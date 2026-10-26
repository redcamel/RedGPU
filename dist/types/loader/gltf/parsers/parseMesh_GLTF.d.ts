import { GLTF, GlTfId, Mesh as GltfMesh } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * [KO] glTF 메시 데이터를 파싱하여 프리미티브별 지오메트리, 재질, 모프 타겟이 적용된 `Mesh` 배열을 생성합니다.
 * [EN] Parses glTF mesh data and creates an array of `Mesh` instances with geometry, material, and morph targets applied per primitive.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 원본 `GLTF` 데이터 객체
 * [EN] Source `GLTF` data object
 * @param gltfMesh -
 * [KO] 파싱할 glTF 메시 데이터
 * [EN] glTF mesh data to parse
 * @param nodeGlTfId -
 * [KO] 메시가 속한 노드의 glTF 식별자
 * [EN] glTF identifier of the node to which the mesh belongs
 * @returns
 * [KO] 생성된 `Mesh` 인스턴스 배열
 * [EN] Array of created `Mesh` instances
 * @category GLTF
 */
declare const parseMesh_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, gltfMesh: GltfMesh, nodeGlTfId: GlTfId) => any[];
export default parseMesh_GLTF;
