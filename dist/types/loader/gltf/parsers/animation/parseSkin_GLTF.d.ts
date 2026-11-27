import Mesh from "../../../../display/mesh/Mesh";
import ParsedSkinInfo_GLTF from "../../cls/ParsedSkinInfo_GLTF";
import GLTFParseContext from "../../core/GLTFParseContext";
import { GLTF, GlTfId, Skin } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
/**
 * [KO] glTF 스킨의 조인트(Joint) 노드를 `GLTFParseContext`에서 조회하여 스킨 정보의 조인트 목록에 등록합니다.
 * [EN] Resolves a joint node of a glTF skin from `GLTFParseContext` and registers it in the skin info's joint list.
 *
 * @param skinInfo -
 * [KO] 대상 `ParsedSkinInfo_GLTF` 인스턴스
 * [EN] Target `ParsedSkinInfo_GLTF` instance
 * @param jointGlTfId -
 * [KO] 조인트 노드의 glTF ID
 * [EN] glTF node ID of the joint
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스
 * [EN] `GLTFParseContext` instance for the current parse session
 * @category GLTF
 */
export declare const parseJoint_GLTF: (skinInfo: ParsedSkinInfo_GLTF, jointGlTfId: GlTfId, parseContext: GLTFParseContext) => void;
/**
 * [KO] GLTF 스킨(Skin) 정보와 역바인드 행렬(Inverse Bind Matrices)을 파싱하여 메쉬에 할당합니다.
 * [EN] Parses GLTF skin information and inverse bind matrices and assigns them to the mesh.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param scenesData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param skin -
 * [KO] 조인트 및 스켈레톤 정보를 포함하는 GLTF Skin 객체
 * [EN] GLTF Skin object containing joint and skeleton information
 * @param mesh -
 * [KO] 스킨 정보가 할당될 대상 메쉬
 * [EN] Target mesh to which skin information will be assigned
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스
 * [EN] `GLTFParseContext` instance for the current parse session
 * @category GLTF
 */
declare const parseSkin_GLTF: (gltfLoader: GLTFLoader, scenesData: GLTF, skin: Skin, mesh: Mesh, parseContext: GLTFParseContext) => void;
export default parseSkin_GLTF;
