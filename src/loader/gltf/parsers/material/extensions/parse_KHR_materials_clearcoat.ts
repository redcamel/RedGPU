import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

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
