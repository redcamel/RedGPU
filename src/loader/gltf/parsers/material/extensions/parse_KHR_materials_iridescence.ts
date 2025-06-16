import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import parseMaterialTexture from "../parseMaterialTexture";

const parse_KHR_materials_iridescence = (currentMaterial: PBRMaterial, KHR_materials_iridescence, gltfLoader) => {
	currentMaterial.useKHR_materials_iridescence = true
	currentMaterial.KHR_iridescenceFactor = KHR_materials_iridescence.iridescenceFactor || 0
	currentMaterial.KHR_iridescenceIor = KHR_materials_iridescence.iridescenceIor || 1.3
	currentMaterial.KHR_iridescenceThicknessMinimum = KHR_materials_iridescence.iridescenceThicknessMinimum || 100
	currentMaterial.KHR_iridescenceThicknessMaximum = KHR_materials_iridescence.iridescenceThicknessMaximum || 400
	// currentMaterial.use2PathRender = true
	currentMaterial.transparent = true
	{
		const {
			iridescenceTexture: iridescenceTextureInfo,
			iridescenceThicknessTexture: iridescenceThicknessTextureInfo
		} = KHR_materials_iridescence;
		if (iridescenceTextureInfo) {
			parseMaterialTexture(
				gltfLoader,
				currentMaterial,
				iridescenceTextureInfo,
				'KHR_iridescenceTexture',
			)
		}
		if (iridescenceThicknessTextureInfo) {
			parseMaterialTexture(
				gltfLoader,
				currentMaterial,
				iridescenceThicknessTextureInfo,
				'KHR_iridescenceThicknessTexture',
			)
		}
	}
}
export default parse_KHR_materials_iridescence
