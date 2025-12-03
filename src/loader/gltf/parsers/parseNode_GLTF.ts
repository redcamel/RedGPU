import Mesh from "../../../display/mesh/Mesh";
import {GLTF, GlTfId, Node, Skin} from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import parseSkin_GLTF from "./animation/parseSkin_GLTF";
import parseMesh_GLTF from "./parseMesh_GLTF";
import parseTRSAndMATRIX_GLTF from "./parseTRSAndMATRIX_GLTF";

/**
 * Parses the children and skin of a node in a GLTF file.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader instance.
 * @param {GLTF} gltfData - The GLTF data object.
 * @param {Mesh} mesh - The mesh object.
 * @param {Node} nodeInfo - The node information object.
 * @param {Skin[]} skins - The array of skin objects.
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
 * Parses a node in a GLTF hierarchy and constructs the corresponding mesh or group in the scene.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader instance.
 * @param {GLTF} gltfData - The GLTF data.
 * @param {GlTfId} nodeGlTfId - The identifier of the node in the GLTF data.
 * @param {Mesh} parentMesh - The parent mesh to attach the parsed node to.
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
        //TODO -카메라 까야함
        // if ('camera' in nodeInfo) {
        // 	resultCameras[nodeInfo.camera]['_parentMesh'] = parentMesh;
        // 	resultCameras[nodeInfo.camera]['_targetMesh'] = targetGroup;
        // 	let cameraMesh = new Mesh(redGPUContext);
        // 	targetGroup.addChild(cameraMesh);
        // 	resultCameras[nodeInfo.camera]['_cameraMesh'] = cameraMesh;
        // }
        parseChildrenAndSkin(gltfLoader, gltfData, targetGroup, nodeInfo, skins);
    }
}
export default parseNode_GLTF;
