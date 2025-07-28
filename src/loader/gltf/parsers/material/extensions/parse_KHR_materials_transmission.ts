import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

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
