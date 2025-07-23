import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

const parse_KHR_materials_volume = (currentMaterial: PBRMaterial, KHR_materials_volume, gltfLoader) => {
	currentMaterial.useKHR_materials_volume = true
	currentMaterial.KHR_thicknessFactor = KHR_materials_volume.thicknessFactor || 1.0
	currentMaterial.KHR_attenuationDistance = KHR_materials_volume.attenuationDistance || 1.0
	currentMaterial.KHR_attenuationColor = KHR_materials_volume.attenuationColor || [1, 1, 1]
	currentMaterial.use2PathRender = true
	currentMaterial.transparent = true
	{
		const thicknessTextureInfo = KHR_materials_volume.thicknessTexture;
		if (thicknessTextureInfo) {
			parseMaterialTexture(
				gltfLoader,
				currentMaterial,
				thicknessTextureInfo,
				'KHR_thicknessTexture',
				null,
				false
			)
		}
	}
}
export default parse_KHR_materials_volume
