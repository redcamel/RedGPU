import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

const parse_KHR_materials_specular = (currentMaterial: PBRMaterial, KHR_materials_specular, gltfLoader) => {
    currentMaterial.KHR_specularFactor = KHR_materials_specular.specularFactor ?? 1.0
    currentMaterial.KHR_specularColorFactor = KHR_materials_specular.specularColorFactor || [1, 1, 1]
    currentMaterial.useKHR_materials_specular = true
    const {
        specularTexture: specularTextureInfo,
        specularColorTexture: specularColorTextureInfo,
    } = KHR_materials_specular
    if (specularTextureInfo) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            specularTextureInfo,
            'KHR_specularTexture',
        )
    }
    if (specularColorTextureInfo) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            specularColorTextureInfo,
            'KHR_specularColorTexture',
            `${navigator.gpu.getPreferredCanvasFormat()}-srgb`
        )
    }
}
export default parse_KHR_materials_specular
