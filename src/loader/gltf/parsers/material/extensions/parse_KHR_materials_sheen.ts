import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import GLTFLoader from "../../../GLTFLoader";
import parseMaterialTexture from "../parseMaterialTexture";

const parse_KHR_materials_sheen = (currentMaterial: PBRMaterial, KHR_materials_sheen, gltfLoader: GLTFLoader) => {
    currentMaterial.KHR_sheenColorFactor = KHR_materials_sheen.sheenColorFactor || [0, 0, 0]
    currentMaterial.KHR_sheenRoughnessFactor = KHR_materials_sheen.sheenRoughnessFactor || 0
    currentMaterial.useKHR_materials_sheen = true
    const {
        sheenColorTexture: sheenColorTextureInfo,
        sheenRoughnessTexture: sheenRoughnessTextureInfo,
    } = KHR_materials_sheen
    if (sheenColorTextureInfo) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            sheenColorTextureInfo,
            'KHR_sheenColorTexture',
            `${navigator.gpu.getPreferredCanvasFormat()}-srgb`
        )
    }
    if (sheenRoughnessTextureInfo) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            sheenRoughnessTextureInfo,
            'KHR_sheenRoughnessTexture',
        )
    }
}
export default parse_KHR_materials_sheen
