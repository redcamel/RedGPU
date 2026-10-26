import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import { GLTF, MeshPrimitive } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
/**
 * [KO] GLTF 메쉬 프리미티브의 재질(Material) 정보 및 확장(Extensions)을 파싱하여 PBRMaterial 인스턴스를 생성합니다.
 * [EN] Parses material information and extensions of a GLTF mesh primitive to create a PBRMaterial instance.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param meshPrimitive -
 * [KO] 대상 GLTF 메쉬 프리미티브
 * [EN] Target GLTF mesh primitive
 * @returns
 * [KO] 파싱된 `PBRMaterial` 인스턴스
 * [EN] Parsed `PBRMaterial` instance
 * @category Loader
 */
declare const parseMaterialInfo_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, meshPrimitive: MeshPrimitive) => PBRMaterial;
export default parseMaterialInfo_GLTF;
