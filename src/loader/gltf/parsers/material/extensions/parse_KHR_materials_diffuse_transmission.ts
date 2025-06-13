import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

const parse_KHR_materials_diffuse_transmission = (currentMaterial: PBRMaterial, KHR_materials_diffuse_transmission, gltfLoader) => {
	currentMaterial.useKHR_materials_diffuse_transmission = true
	currentMaterial.KHR_diffuseTransmissionFactor = KHR_materials_diffuse_transmission.diffuseTransmissionFactor || 0.0
	currentMaterial.KHR_diffuseTransmissionColorFactor = KHR_materials_diffuse_transmission.diffuseTransmissionColorFactor || [1, 1, 1]
	// currentMaterial.use2PathRender = true
	currentMaterial.transparent = true
	{
		const diffuseTransmissionTextureInfo = KHR_materials_diffuse_transmission.diffuseTransmissionTexture;
		if (diffuseTransmissionTextureInfo) {
			parseMaterialTexture(
				gltfLoader,
				currentMaterial,
				diffuseTransmissionTextureInfo,
				'KHR_diffuseTransmissionTexture',
			)
		}
		const diffuseTransmissionColorTextureInfo = KHR_materials_diffuse_transmission.diffuseTransmissionColorTexture;
		if (diffuseTransmissionColorTextureInfo) {
			parseMaterialTexture(
				gltfLoader,
				currentMaterial,
				diffuseTransmissionColorTextureInfo,
				'KHR_diffuseTransmissionColorTexture',
				`${navigator.gpu.getPreferredCanvasFormat()}-srgb`
			)
		}
	}
}
export default parse_KHR_materials_diffuse_transmission
