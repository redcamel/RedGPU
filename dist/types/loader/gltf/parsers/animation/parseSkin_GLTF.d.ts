import Mesh from "../../../../display/mesh/Mesh";
import { GLTF, Skin } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
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
 * @category Loader
 */
declare const parseSkin_GLTF: (gltfLoader: GLTFLoader, scenesData: GLTF, skin: Skin, mesh: Mesh) => void;
export default parseSkin_GLTF;
