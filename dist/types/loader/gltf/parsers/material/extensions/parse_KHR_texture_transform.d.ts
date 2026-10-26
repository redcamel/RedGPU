import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
/**
 * [KO] glTF의 `KHR_texture_transform` 확장을 파싱하여 재질의 대상 텍스처 변환 속성에 적용합니다.
 * [EN] Parses the `KHR_texture_transform` glTF extension and applies it to the target texture transform properties of the material.
 *
 * @param currentMaterial -
 * [KO] 변환 속성을 적용할 대상 PBR 재질
 * [EN] Target PBR material to apply transform properties
 * @param targetTextureKey -
 * [KO] 변환을 적용할 대상 텍스처 키 이름
 * [EN] Target texture key name to apply the transform
 * @param KHR_texture_transform -
 * [KO] `KHR_texture_transform` 확장 데이터 객체
 * [EN] `KHR_texture_transform` extension data object
 * @category GLTF
 */
declare const parse_KHR_texture_transform: (currentMaterial: PBRMaterial, targetTextureKey: any, KHR_texture_transform: any) => void;
export default parse_KHR_texture_transform;
