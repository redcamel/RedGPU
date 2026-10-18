import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import GLTFLoader from "../../../GLTFLoader";
import parseMaterialTexture from "../parseMaterialTexture";

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
