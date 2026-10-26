import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

/**
 * [KO] glTF `KHR_materials_diffuse_transmission` 확장 데이터를 파싱하여 `PBRMaterial`에 적용합니다.
 * [EN] Parses the glTF `KHR_materials_diffuse_transmission` extension data and applies it to `PBRMaterial`.
 *
 * @param currentMaterial -
 * [KO] 속성을 적용할 대상 `PBRMaterial` 인스턴스
 * [EN] Target `PBRMaterial` instance to apply properties to
 * @param KHR_materials_diffuse_transmission -
 * [KO] `KHR_materials_diffuse_transmission` 확장 데이터 객체
 * [EN] `KHR_materials_diffuse_transmission` extension data object
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @category GLTF
 */
const parse_KHR_materials_diffuse_transmission = (currentMaterial: PBRMaterial, KHR_materials_diffuse_transmission, gltfLoader) => {
    currentMaterial.useKHR_materials_diffuse_transmission = true
    currentMaterial.KHR_diffuseTransmissionFactor = KHR_materials_diffuse_transmission.diffuseTransmissionFactor || 0.0
    currentMaterial.KHR_diffuseTransmissionColorFactor = KHR_materials_diffuse_transmission.diffuseTransmissionColorFactor || [1, 1, 1]
    currentMaterial.transparent = true
    {
        const diffuseTransmissionTextureInfo = KHR_materials_diffuse_transmission.diffuseTransmissionTexture;
        if (diffuseTransmissionTextureInfo) {
            parseMaterialTexture(
                gltfLoader,
                currentMaterial,
                diffuseTransmissionTextureInfo,
                'KHR_diffuseTransmissionTexture',
                null,
                false
            )
        }
        const diffuseTransmissionColorTextureInfo = KHR_materials_diffuse_transmission.diffuseTransmissionColorTexture;
        if (diffuseTransmissionColorTextureInfo) {
            parseMaterialTexture(
                gltfLoader,
                currentMaterial,
                diffuseTransmissionColorTextureInfo,
                'KHR_diffuseTransmissionColorTexture',
                `${navigator.gpu.getPreferredCanvasFormat()}-srgb`,
                false
            )
        }
    }
}
export default parse_KHR_materials_diffuse_transmission
