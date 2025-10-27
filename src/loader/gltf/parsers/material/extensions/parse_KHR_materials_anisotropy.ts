import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import GLTFLoader from "../../../GLTFLoader";
import parseMaterialTexture from "../parseMaterialTexture";

const parse_KHR_materials_anisotropy = (currentMaterial: PBRMaterial, KHR_materials_anisotropy, gltfLoader: GLTFLoader) => {
    currentMaterial.useKHR_materials_anisotropy = true
    currentMaterial.KHR_anisotropyStrength = KHR_materials_anisotropy.anisotropyStrength || 0.0
    currentMaterial.KHR_anisotropyRotation = KHR_materials_anisotropy.anisotropyRotation || 0
    const {
        anisotropyTexture: anisotropyTextureInfo,
    } = KHR_materials_anisotropy
    if (anisotropyTextureInfo) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            anisotropyTextureInfo,
            'KHR_anisotropyTexture'
        )
    }
}
export default parse_KHR_materials_anisotropy
