import ParsedSkinInfo_GLTF from "../../cls/ParsedSkinInfo_GLTF";
import {GlTfId, Node} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";

/**
 * [KO] GLTF 스킨의 조인트(Joint) 노드를 파싱하여 스킨 정보의 조인트 목록에 등록합니다.
 * [EN] Parses a joint node of a GLTF skin and registers it in the skin info's joint list.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param skinInfo -
 * [KO] 조인트 메쉬가 추가될 파싱된 스킨 정보 객체
 * [EN] Parsed skin info object to which the joint mesh will be added
 * @param nodes -
 * [KO] GLTF 노드 배열
 * [EN] Array of GLTF nodes
 * @param jointGlTfId -
 * [KO] 파싱할 대상 조인트 노드의 GLTF ID
 * [EN] GLTF ID of the target joint node to parse
 * @category Loader
 */
const parseJoint_GLTF = (gltfLoader: GLTFLoader, skinInfo: ParsedSkinInfo_GLTF, nodes: Node[], jointGlTfId: GlTfId) => {
    const {redGPUContext} = gltfLoader
    const jointMesh = nodes[jointGlTfId]['Mesh'];
    if (jointMesh) {

        skinInfo.joints.push(jointMesh);
    } else {
        requestAnimationFrame(function () {
            parseJoint_GLTF(gltfLoader, skinInfo, nodes, jointGlTfId);
        });
    }
};
export default parseJoint_GLTF
