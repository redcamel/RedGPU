import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

const parse_KHR_materials_transmission = (currentMaterial: PBRMaterial, KHR_materials_transmission, gltfLoader) => {
    currentMaterial.transmissionFactor = KHR_materials_transmission.transmissionFactor || 0.0
    currentMaterial.transparent = true
    {
        const transmissionTextureInfo = KHR_materials_transmission.transmissionTexture;
        if (transmissionTextureInfo) {
            parseMaterialTexture(
                gltfLoader,
                currentMaterial,
                transmissionTextureInfo,
                'transmissionTexture',
            )
        }
    }
}
export default parse_KHR_materials_transmission
