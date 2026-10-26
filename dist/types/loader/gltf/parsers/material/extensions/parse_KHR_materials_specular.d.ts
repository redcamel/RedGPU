import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
/**
 * [KO] glTF의 `KHR_materials_specular` 확장을 파싱하여 재질에 적용합니다.
 * [EN] Parses the `KHR_materials_specular` glTF extension and applies it to the material.
 *
 * @param currentMaterial -
 * [KO] 확장 속성을 적용할 대상 PBR 재질
 * [EN] Target PBR material to apply extension properties
 * @param KHR_materials_specular -
 * [KO] `KHR_materials_specular` 확장 데이터 객체
 * [EN] `KHR_materials_specular` extension data object
 * @param gltfLoader -
 * [KO] 텍스처 로드를 수행할 GLTFLoader 인스턴스
 * [EN] GLTFLoader instance for loading textures
 * @category GLTF
 */
declare const parse_KHR_materials_specular: (currentMaterial: PBRMaterial, KHR_materials_specular: any, gltfLoader: any) => void;
export default parse_KHR_materials_specular;
