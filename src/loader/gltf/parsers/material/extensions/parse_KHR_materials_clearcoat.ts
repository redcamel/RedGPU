import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

/**
 * [KO] glTF `KHR_materials_clearcoat` 확장 데이터를 파싱하여 `PBRMaterial`에 적용합니다.
 * [EN] Parses the glTF `KHR_materials_clearcoat` extension data and applies it to `PBRMaterial`.
 *
 * @param currentMaterial -
 * [KO] 속성을 적용할 대상 `PBRMaterial` 인스턴스
 * [EN] Target `PBRMaterial` instance to apply properties to
 * @param KHR_materials_clearcoat -
 * [KO] `KHR_materials_clearcoat` 확장 데이터 객체
 * [EN] `KHR_materials_clearcoat` extension data object
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @category GLTF
 */
const parse_KHR_materials_clearcoat = (currentMaterial: PBRMaterial, KHR_materials_clearcoat, gltfLoader) => {
    currentMaterial.KHR_clearcoatFactor = KHR_materials_clearcoat.clearcoatFactor || 0.0
    currentMaterial.KHR_clearcoatRoughnessFactor = KHR_materials_clearcoat.clearcoatRoughnessFactor || 0.0
    currentMaterial.useKHR_materials_clearcoat = true
    const {
        clearcoatTexture: clearcoatTextureInfo,
        clearcoatNormalTexture: clearcoatNormalTextureInfo,
        clearcoatRoughnessTexture: clearcoatRoughnessTextureInfo
    } = KHR_materials_clearcoat
    if (clearcoatTextureInfo) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            clearcoatTextureInfo,
            'KHR_clearcoatTexture',
            null,
            false
        )
    }
    if (clearcoatNormalTextureInfo) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            clearcoatNormalTextureInfo,
            'KHR_clearcoatNormalTexture',
        )
    }
    if (clearcoatRoughnessTextureInfo) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            clearcoatRoughnessTextureInfo,
            'KHR_clearcoatRoughnessTexture',
            null,
            false
        )
    }
}
export default parse_KHR_materials_clearcoat
