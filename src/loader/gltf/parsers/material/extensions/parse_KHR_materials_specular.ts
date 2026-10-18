import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

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
const parse_KHR_materials_specular = (currentMaterial: PBRMaterial, KHR_materials_specular, gltfLoader) => {
    currentMaterial.useKHR_materials_specular = true
    currentMaterial.KHR_specularFactor = KHR_materials_specular.specularFactor ?? 1.0
    currentMaterial.KHR_specularColorFactor = KHR_materials_specular.specularColorFactor || [1, 1, 1]
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
