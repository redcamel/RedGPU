import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import GLTFLoader from "../../../GLTFLoader";
/**
 * [KO] glTF `KHR_materials_anisotropy` 확장 데이터를 파싱하여 `PBRMaterial`에 적용합니다.
 * [EN] Parses the glTF `KHR_materials_anisotropy` extension data and applies it to `PBRMaterial`.
 *
 * @param currentMaterial -
 * [KO] 속성을 적용할 대상 `PBRMaterial` 인스턴스
 * [EN] Target `PBRMaterial` instance to apply properties to
 * @param KHR_materials_anisotropy -
 * [KO] `KHR_materials_anisotropy` 확장 데이터 객체
 * [EN] `KHR_materials_anisotropy` extension data object
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @category GLTF
 */
declare const parse_KHR_materials_anisotropy: (currentMaterial: PBRMaterial, KHR_materials_anisotropy: any, gltfLoader: GLTFLoader) => void;
export default parse_KHR_materials_anisotropy;
