import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import GLTFLoader from "../../../GLTFLoader";
/**
 * [KO] glTF의 `KHR_materials_pbrSpecularGlossiness` 확장을 파싱하여 `PBRMaterial`에 매핑합니다.
 * [EN] Parses the `KHR_materials_pbrSpecularGlossiness` extension of glTF and maps it to `PBRMaterial`.
 *
 * @param currentMaterial -
 * [KO] 대상 `PBRMaterial` 인스턴스
 * [EN] Target `PBRMaterial` instance
 * @param specGlossInfo -
 * [KO] `KHR_materials_pbrSpecularGlossiness` 확장 데이터
 * [EN] `KHR_materials_pbrSpecularGlossiness` extension data
 * @param gltfLoader -
 * [KO] `GLTFLoader` 인스턴스
 * [EN] `GLTFLoader` instance
 * @category GLTF
 */
declare const parse_KHR_materials_pbrSpecularGlossiness: (currentMaterial: PBRMaterial, specGlossInfo: any, gltfLoader: GLTFLoader) => void;
export default parse_KHR_materials_pbrSpecularGlossiness;
