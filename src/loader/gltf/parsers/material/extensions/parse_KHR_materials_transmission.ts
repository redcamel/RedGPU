import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

/**
 * [KO] glTF의 `KHR_materials_transmission` 확장을 파싱하여 재질에 적용합니다.
 * [EN] Parses the `KHR_materials_transmission` glTF extension and applies it to the material.
 *
 * @param currentMaterial -
 * [KO] 확장 속성을 적용할 대상 PBR 재질
 * [EN] Target PBR material to apply extension properties
 * @param KHR_materials_transmission -
 * [KO] `KHR_materials_transmission` 확장 데이터 객체
 * [EN] `KHR_materials_transmission` extension data object
 * @param gltfLoader -
 * [KO] 텍스처 로드를 수행할 GLTFLoader 인스턴스
 * [EN] GLTFLoader instance for loading textures
 * @category GLTF
 */
const parse_KHR_materials_transmission = (currentMaterial: PBRMaterial, KHR_materials_transmission, gltfLoader) => {
    currentMaterial.useKHR_materials_transmission = true
    currentMaterial.KHR_transmissionFactor = KHR_materials_transmission.transmissionFactor || 0.0
    currentMaterial.use2PathRender = true
    {
        const transmissionTextureInfo = KHR_materials_transmission.transmissionTexture;
        if (transmissionTextureInfo) {
            parseMaterialTexture(
                gltfLoader,
                currentMaterial,
                transmissionTextureInfo,
                'KHR_transmissionTexture',
                null,
                false
            )
        }
    }
}
export default parse_KHR_materials_transmission
