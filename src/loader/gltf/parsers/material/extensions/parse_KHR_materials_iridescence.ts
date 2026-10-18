import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

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
const parse_KHR_materials_iridescence = (currentMaterial: PBRMaterial, KHR_materials_iridescence, gltfLoader) => {
    currentMaterial.useKHR_materials_iridescence = true
    currentMaterial.KHR_iridescenceFactor = KHR_materials_iridescence.iridescenceFactor || 0
    currentMaterial.KHR_iridescenceIor = KHR_materials_iridescence.iridescenceIor || 1.3
    currentMaterial.KHR_iridescenceThicknessMinimum = KHR_materials_iridescence.iridescenceThicknessMinimum || 100
    currentMaterial.KHR_iridescenceThicknessMaximum = KHR_materials_iridescence.iridescenceThicknessMaximum || 400
    currentMaterial.transparent = true
    {
        const {
            iridescenceTexture: iridescenceTextureInfo,
            iridescenceThicknessTexture: iridescenceThicknessTextureInfo
        } = KHR_materials_iridescence;
        if (iridescenceTextureInfo) {
            parseMaterialTexture(
                gltfLoader,
                currentMaterial,
                iridescenceTextureInfo,
                'KHR_iridescenceTexture',
                null,
                false
            )
        }
        if (iridescenceThicknessTextureInfo) {
            parseMaterialTexture(
                gltfLoader,
                currentMaterial,
                iridescenceThicknessTextureInfo,
                'KHR_iridescenceThicknessTexture',
                null,
                false
            )
        }
    }
}
export default parse_KHR_materials_iridescence
