import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import GLTFLoader from "../../../GLTFLoader";
import parseMaterialTexture from "../parseMaterialTexture";

/**
 * [KO] glTF의 `KHR_materials_sheen` 확장을 파싱하여 재질에 적용합니다.
 * [EN] Parses the `KHR_materials_sheen` extension of glTF and applies it to the material.
 *
 * @param currentMaterial -
 * [KO] 대상 `PBRMaterial` 인스턴스
 * [EN] Target `PBRMaterial` instance
 * @param KHR_materials_sheen -
 * [KO] `KHR_materials_sheen` 확장 데이터
 * [EN] `KHR_materials_sheen` extension data
 * @param gltfLoader -
 * [KO] `GLTFLoader` 인스턴스
 * [EN] `GLTFLoader` instance
 * @category GLTF
 */
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
            `${navigator.gpu.getPreferredCanvasFormat()}-srgb`,
            false
        )
    }
    if (sheenRoughnessTextureInfo) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            sheenRoughnessTextureInfo,
            'KHR_sheenRoughnessTexture',
            null,
            false
        )
    }
}
export default parse_KHR_materials_sheen
