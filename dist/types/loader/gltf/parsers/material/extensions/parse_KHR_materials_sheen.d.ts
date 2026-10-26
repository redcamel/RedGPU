import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import GLTFLoader from "../../../GLTFLoader";
/**
 * [KO] glTF의 `KHR_materials_sheen` 확장을 파싱하여 재질에 적용합니다.
 * [EN] Parses the `KHR_materials_sheen` extension of glTF and applies it to the material.
 *
 * @param currentMaterial -
 * [KO] 대상 `PBRMaterial` 인스턴스
 * [EN] Target `PBRMaterial` instance
 * @param KHR_materials_sheen -
 * [KO] `KHR_materials_sheen` 확장 데이터
 * [EN] `KHR_materials_sheen` extension data
 * @param gltfLoader -
 * [KO] `GLTFLoader` 인스턴스
 * [EN] `GLTFLoader` instance
 * @category GLTF
 */
declare const parse_KHR_materials_sheen: (currentMaterial: PBRMaterial, KHR_materials_sheen: any, gltfLoader: GLTFLoader) => void;
export default parse_KHR_materials_sheen;
