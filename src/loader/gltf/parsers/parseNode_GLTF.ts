import Mesh from "../../../display/mesh/Mesh";
import {GLTF, GlTfId, Node, Skin} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseSkin_GLTF from "./animation/parseSkin_GLTF";
import parseMesh_GLTF from "./parseMesh_GLTF";
import parseTRSAndMATRIX_GLTF from "./parseTRSAndMATRIX_GLTF";

/**
 * [KO] glTF 노드의 하위 자식 노드들과 스킨 정보를 재귀적으로 파싱합니다.
 * [EN] Recursively parses child nodes and skin information of a glTF node.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 원본 `GLTF` 데이터 객체
 * [EN] Source `GLTF` data object
 * @param mesh -
 * [KO] 기준이 되는 대상 `Mesh` 인스턴스
 * [EN] Target `Mesh` instance serving as the parent/base
 * @param nodeInfo -
 * [KO] 파싱할 glTF 노드 정보 객체
 * [EN] glTF node information object to parse
 * @param skins -
 * [KO] glTF 스킨 데이터 배열
 * [EN] Array of glTF skin data
 * @category GLTF
 */
const parseChildrenAndSkin = (gltfLoader: GLTFLoader, gltfData: GLTF, mesh: Mesh, nodeInfo: Node, skins: Skin[]) => {
    if ('children' in nodeInfo) {
        const children = nodeInfo.children;
        const childCount = children.length;
        for (let i = 0; i < childCount; i++) {
            parseNode_GLTF(gltfLoader, gltfData, children[i], mesh);
        }
    }
    if ('skin' in nodeInfo) {
        parseSkin_GLTF(gltfLoader, gltfData, skins[nodeInfo.skin], mesh);
    }
}
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
const parseNode_GLTF = (gltfLoader: GLTFLoader, gltfData: GLTF, nodeGlTfId: GlTfId, parentMesh: Mesh) => {
    const {redGPUContext, parsingResult} = gltfLoader;
    const {nodes: nodeData, meshes: meshData, skins} = gltfData;
    const {groups: resultGroups, cameras: resultCameras} = parsingResult;
    const nodeInfo = nodeData[nodeGlTfId];
    if ('mesh' in nodeInfo) {
        const meshes = parseMesh_GLTF(gltfLoader, gltfData, meshData[nodeInfo.mesh], nodeGlTfId);
        const meshCount = meshes.length;
        for (let i = 0; i < meshCount; i++) {
            let mesh = meshes[i];
            parentMesh.addChild(nodeInfo['Mesh'] = mesh);
            parseTRSAndMATRIX_GLTF(mesh, nodeInfo);
            parseChildrenAndSkin(gltfLoader, gltfData, mesh, nodeInfo, skins);
        }
    } else {
        let targetGroup;
        if (resultGroups[nodeGlTfId]) {
            targetGroup = resultGroups[nodeGlTfId];
            nodeInfo['Mesh'] = targetGroup;
        } else {
            targetGroup = new Mesh(redGPUContext);
            parentMesh.addChild(targetGroup);
            nodeInfo['Mesh'] = targetGroup;
            targetGroup['name'] = nodeInfo['name'];
            resultGroups[nodeGlTfId] = targetGroup;
        }
        parseTRSAndMATRIX_GLTF(targetGroup, nodeInfo);
        parseChildrenAndSkin(gltfLoader, gltfData, targetGroup, nodeInfo, skins);
    }
}
export default parseNode_GLTF;
