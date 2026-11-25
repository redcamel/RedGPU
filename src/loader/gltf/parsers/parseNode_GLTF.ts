import Mesh from "../../../display/mesh/Mesh";
import GLTFParseContext from "../core/GLTFParseContext";
import resolveNodeVisibility from "../core/resolveNodeVisibility";
import {GLTF, GlTfId, Node} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseMesh_GLTF from "./parseMesh_GLTF";
import parseTRSAndMATRIX_GLTF from "./parseTRSAndMATRIX_GLTF";

/**
 * [KO] glTF 노드의 하위 자식 노드를 재귀적으로 파싱하고 스킨 바인딩은 Pass 2 대기열에 적재합니다.
 * [EN] Recursively parses child nodes of a glTF node and enqueues skin bindings for Pass 2.
 */
const parseChildrenAndEnqueueSkin = (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    mesh: Mesh,
    nodeInfo: Node,
    parseContext: GLTFParseContext
) => {
    if ('children' in nodeInfo) {
        const children = nodeInfo.children;
        const childCount = children.length;
        for (let i = 0; i < childCount; i++) {
            parseNode_GLTF(gltfLoader, gltfData, children[i], mesh, parseContext);
        }
    }
    if ('skin' in nodeInfo && nodeInfo.skin !== undefined) {
        parseContext.pendingSkins.push({skinId: nodeInfo.skin, mesh});
    }
};

/**
 * [KO] glTF 노드 계층을 파싱하여 대응하는 메시 또는 그룹을 생성하고 `GLTFParseContext`에 등록합니다.
 * [EN] Parses the glTF node hierarchy to construct corresponding meshes or groups and registers them in `GLTFParseContext`.
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
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스
 * [EN] `GLTFParseContext` instance for the current parse session
 * @category GLTF
 */
const parseNode_GLTF = (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    nodeGlTfId: GlTfId,
    parentMesh: Mesh,
    parseContext: GLTFParseContext
) => {
    const {redGPUContext, parsingResult} = gltfLoader;
    const {nodes: nodeData, meshes: meshData} = gltfData;
    const {groups: resultGroups} = parsingResult;
    const nodeInfo = nodeData[nodeGlTfId];
    const isVisible = resolveNodeVisibility(nodeInfo);
    const isSkinned = 'skin' in nodeInfo && nodeInfo.skin !== undefined;

    if ('mesh' in nodeInfo && nodeInfo.mesh !== undefined) {
        const meshGlTfId = nodeInfo.mesh;
        const meshes = parseMesh_GLTF(
            gltfLoader,
            gltfData,
            meshData[meshGlTfId],
            meshGlTfId,
            nodeGlTfId,
            isSkinned,
            parseContext
        );
        parseContext.nodeMeshesMap.set(nodeGlTfId, meshes);
        const meshCount = meshes.length;
        for (let i = 0; i < meshCount; i++) {
            const mesh = meshes[i];
            mesh.visible = isVisible;
            parentMesh.addChild(mesh);
            parseContext.nodeObjectMap.set(nodeGlTfId, mesh);
            parseTRSAndMATRIX_GLTF(mesh, nodeInfo);
            parseChildrenAndEnqueueSkin(gltfLoader, gltfData, mesh, nodeInfo, parseContext);
        }
    } else {
        let targetGroup: Mesh;
        if (resultGroups[nodeGlTfId]) {
            targetGroup = resultGroups[nodeGlTfId];
        } else {
            targetGroup = new Mesh(redGPUContext);
            parentMesh.addChild(targetGroup);
            targetGroup['name'] = nodeInfo['name'];
            resultGroups[nodeGlTfId] = targetGroup;
        }
        parseContext.nodeObjectMap.set(nodeGlTfId, targetGroup);
        targetGroup.visible = isVisible;
        parseTRSAndMATRIX_GLTF(targetGroup, nodeInfo);
        parseChildrenAndEnqueueSkin(gltfLoader, gltfData, targetGroup, nodeInfo, parseContext);
    }
};
export default parseNode_GLTF;
