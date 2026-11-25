import ParsedSkinInfo_GLTF from "../../cls/ParsedSkinInfo_GLTF";
import GLTFParseContext from "../../core/GLTFParseContext";
import {GlTfId} from "../../GLTF";

/**
 * [KO] GLTF 스킨의 조인트(Joint) 노드를 `GLTFParseContext`에서 조회하여 스킨 정보의 조인트 목록에 등록합니다.
 * [EN] Resolves a joint node of a GLTF skin from `GLTFParseContext` and registers it in the skin info's joint list.
 *
 * @param skinInfo -
 * [KO] 조인트 메쉬가 추가될 파싱된 스킨 정보 객체
 * [EN] Parsed skin info object to which the joint mesh will be added
 * @param jointGlTfId -
 * [KO] 파싱할 대상 조인트 노드의 GLTF ID
 * [EN] GLTF ID of the target joint node to parse
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스
 * [EN] `GLTFParseContext` instance for the current parse session
 * @category Loader
 */
const parseJoint_GLTF = (skinInfo: ParsedSkinInfo_GLTF, jointGlTfId: GlTfId, parseContext: GLTFParseContext) => {
    const jointMesh = parseContext.nodeObjectMap.get(jointGlTfId);
    if (jointMesh) {
        skinInfo.joints.push(jointMesh);
    } else {
        console.warn(`[RedGPU GLTF] Joint node[${jointGlTfId}] was not found in scene nodeObjectMap.`);
    }
};
export default parseJoint_GLTF;
