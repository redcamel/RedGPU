import { Node } from "../GLTF";
/**
 * [KO] glTF 노드의 `extensions.KHR_node_visibility.visible` 값을 해석합니다. 미지정 시 기본값은 `true`입니다.
 * [EN] Resolves `extensions.KHR_node_visibility.visible` on a glTF node. Defaults to `true` when omitted.
 *
 * @param nodeInfo -
 * [KO] 파싱할 glTF 노드 정보 객체
 * [EN] glTF node information object to inspect
 * @returns
 * [KO] 노드의 초기 가시성 불리언 값
 * [EN] Initial boolean visibility of the node
 * @category GLTF
 */
declare const resolveNodeVisibility: (nodeInfo?: Node) => boolean;
export default resolveNodeVisibility;
