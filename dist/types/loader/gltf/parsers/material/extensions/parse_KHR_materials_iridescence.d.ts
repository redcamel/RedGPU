import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
/**
 * [KO] glTF의 `KHR_materials_iridescence` 확장을 파싱하여 재질에 적용합니다.
 * [EN] Parses the `KHR_materials_iridescence` extension of glTF and applies it to the material.
 *
 * @param currentMaterial -
 * [KO] 대상 `PBRMaterial` 인스턴스
 * [EN] Target `PBRMaterial` instance
 * @param KHR_materials_iridescence -
 * [KO] `KHR_materials_iridescence` 확장 데이터
 * [EN] `KHR_materials_iridescence` extension data
 * @param gltfLoader -
 * [KO] `GLTFLoader` 인스턴스
 * [EN] `GLTFLoader` instance
 * @category GLTF
 */
declare const parse_KHR_materials_iridescence: (currentMaterial: PBRMaterial, KHR_materials_iridescence: any, gltfLoader: any) => void;
export default parse_KHR_materials_iridescence;
