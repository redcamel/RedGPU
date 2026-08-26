import PBRMaterial from "../../../../../material/pbrMaterial/PBRMaterial";
import GLTFLoader from "../../../GLTFLoader";
import parseMaterialTexture from "../parseMaterialTexture";

/**
 * [KO] glTF KHR_materials_pbrSpecularGlossiness 확장을 파싱하여 PBRMaterial에 매핑합니다.
 * [EN] Parses glTF KHR_materials_pbrSpecularGlossiness extension and maps it to PBRMaterial.
 *
 * @param currentMaterial - The target PBRMaterial
 * @param specGlossInfo - The extension data from glTF
 * @param gltfLoader - The GLTFLoader instance
 */
const parse_KHR_materials_pbrSpecularGlossiness = (
    currentMaterial: PBRMaterial,
    specGlossInfo: any,
    gltfLoader: GLTFLoader
) => {
    if (!specGlossInfo) return;

    if (specGlossInfo.diffuseFactor) {
        currentMaterial.baseColorFactor = specGlossInfo.diffuseFactor;
    }

    if (specGlossInfo.diffuseTexture) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            specGlossInfo.diffuseTexture,
            'baseColorTexture',
            `${navigator.gpu.getPreferredCanvasFormat()}-srgb`,
        );
    }

    if (specGlossInfo.glossinessFactor !== undefined) {
        currentMaterial.roughnessFactor = Math.max(0.0, Math.min(1.0, 1.0 - specGlossInfo.glossinessFactor));
    }

    if (specGlossInfo.specularFactor) {
        const [r, g, b] = specGlossInfo.specularFactor;
        const maxSpec = Math.max(r, g, b);
        if (maxSpec > 0.5) {
            currentMaterial.metallicFactor = maxSpec;
        } else {
            currentMaterial.metallicFactor = 0.0;
        }
    }

    if (specGlossInfo.specularGlossinessTexture) {
        parseMaterialTexture(
            gltfLoader,
            currentMaterial,
            specGlossInfo.specularGlossinessTexture,
            'metallicRoughnessTexture',
            null,
            false
        );
    }
};

export default parse_KHR_materials_pbrSpecularGlossiness;
