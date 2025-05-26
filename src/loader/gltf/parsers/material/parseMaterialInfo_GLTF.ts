import GPU_BLEND_FACTOR from "../../../../gpuConst/GPU_BLEND_FACTOR";
import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import {GLTF, MeshPrimitive} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import parse_KHR_materials_anisotropy from "./extensions/parse_KHR_materials_anisotropy";
import parse_KHR_materials_clearcoat from "./extensions/parse_KHR_materials_clearcoat";
import parse_KHR_materials_diffuse_transmission from "./extensions/parse_KHR_materials_diffuse_transmission";
import parse_KHR_materials_iridescence from "./extensions/parse_KHR_materials_iridescence";
import parse_KHR_materials_sheen from "./extensions/parse_KHR_materials_sheen";
import parse_KHR_materials_specular from "./extensions/parse_KHR_materials_specular";
import parse_KHR_materials_transmission from "./extensions/parse_KHR_materials_transmission";
import parse_KHR_materials_volume from "./extensions/parse_KHR_materials_volume";
import parseMaterialTexture from "./parseMaterialTexture";

/**
 * Parse Material Info from GLTF
 * @param {GLTFLoader} gltfLoader - The GLTF Loader
 * @param {GLTF} gltfData - The GLTF data
 * @param {MeshPrimitive} meshPrimitive - The Mesh Primitive
 * @returns {PBRMaterial} - The parsed PBR Material
 */
const parseMaterialInfo_GLTF = (gltfLoader: GLTFLoader, gltfData: GLTF, meshPrimitive: MeshPrimitive) => {
    const {redGPUContext} = gltfLoader
    let currentMaterial: PBRMaterial;
    let doubleSided = false;
    let alphaMode = 'OPAQUE'
    let alphaCutoff = 0.5;
    if ('material' in meshPrimitive) {
        currentMaterial = new PBRMaterial(redGPUContext);
        const materialGlTfId = meshPrimitive.material;
        const materialInfo = gltfData.materials[materialGlTfId];
        // console.log('tMaterialInfo', materialInfo)
        doubleSided = !!materialInfo.doubleSided;
        alphaMode = materialInfo.alphaMode ?? alphaMode;
        alphaCutoff = materialInfo.alphaCutoff ?? alphaCutoff;
        const {
            pbrMetallicRoughness: pbrMetallicRoughnessInfo,
            normalTexture: normalTextureInfo,
            emissiveTexture: emissiveTextureInfo,
            occlusionTexture: occlusionTextureInfo
        } = materialInfo
        currentMaterial.emissiveFactor = materialInfo.emissiveFactor || [0, 0, 0];
        if (pbrMetallicRoughnessInfo) {
            const {
                metallicRoughnessTexture: metallicRoughnessTextureInfo,
                baseColorTexture: baseColorTextureInfo,
            } = pbrMetallicRoughnessInfo
            currentMaterial.baseColorFactor = pbrMetallicRoughnessInfo.baseColorFactor || [1, 1, 1, 1];
            let metallicFactor, roughnessFactor;
            if ('metallicFactor' in pbrMetallicRoughnessInfo) {
                metallicFactor = pbrMetallicRoughnessInfo.metallicFactor;
            }
            if ('roughnessFactor' in pbrMetallicRoughnessInfo) {
                roughnessFactor = pbrMetallicRoughnessInfo.roughnessFactor;
            }
            currentMaterial.metallicFactor = metallicFactor != undefined ? metallicFactor : 1;
            currentMaterial.roughnessFactor = roughnessFactor != undefined ? roughnessFactor : 1;
            if (baseColorTextureInfo) {
                parseMaterialTexture(
                    gltfLoader,
                    currentMaterial,
                    baseColorTextureInfo,
                    'baseColorTexture',
                    `${navigator.gpu.getPreferredCanvasFormat()}-srgb`,
                )
            }
            if (metallicRoughnessTextureInfo) {
                parseMaterialTexture(
                    gltfLoader,
                    currentMaterial,
                    metallicRoughnessTextureInfo,
                    'metallicRoughnessTexture',
                )
            }
        }
        if (normalTextureInfo) {
            parseMaterialTexture(
                gltfLoader,
                currentMaterial,
                normalTextureInfo,
                'normalTexture',
            )
            const {scale} = normalTextureInfo
            currentMaterial.normalScale = scale != undefined ? scale : 1;
        }
        if (emissiveTextureInfo) {
            parseMaterialTexture(
                gltfLoader,
                currentMaterial,
                emissiveTextureInfo,
                'emissiveTexture',
                `${navigator.gpu.getPreferredCanvasFormat()}-srgb`
            )
        }
        if (occlusionTextureInfo) {
            parseMaterialTexture(
                gltfLoader,
                currentMaterial,
                occlusionTextureInfo,
                'occlusionTexture',
            )
            currentMaterial.occlusionStrength = materialInfo.occlusionTexture.strength || 1;
        }
        if ('extensions' in materialInfo) {
            const {extensions} = materialInfo
            const {
                KHR_materials_clearcoat,
                KHR_materials_emissive_strength,
                KHR_materials_transmission,
                KHR_materials_diffuse_transmission,
                KHR_materials_volume,
                KHR_materials_unlit,
                KHR_materials_ior,
                KHR_materials_sheen,
                KHR_materials_specular,
                KHR_materials_dispersion,
                KHR_materials_anisotropy,
                KHR_materials_iridescence
            } = extensions

            if (KHR_materials_iridescence) {
                parse_KHR_materials_iridescence(currentMaterial, KHR_materials_iridescence, gltfLoader)
            }
            if (KHR_materials_anisotropy) {
                parse_KHR_materials_anisotropy(currentMaterial, KHR_materials_anisotropy, gltfLoader)
            }
            if (KHR_materials_clearcoat) {
                parse_KHR_materials_clearcoat(currentMaterial, KHR_materials_clearcoat, gltfLoader)
            }
            if (KHR_materials_emissive_strength) {
                const {emissiveStrength} = KHR_materials_emissive_strength
                currentMaterial.emissiveStrength = emissiveStrength != undefined ? emissiveStrength : 1;
            }
            if (KHR_materials_transmission) {
                parse_KHR_materials_transmission(currentMaterial, KHR_materials_transmission, gltfLoader)
                currentMaterial.transparent = alphaMode === 'BLEND'


            }
            if (KHR_materials_diffuse_transmission) {
                parse_KHR_materials_diffuse_transmission(currentMaterial, KHR_materials_diffuse_transmission, gltfLoader)
            }
            if (KHR_materials_volume) {
                parse_KHR_materials_volume(currentMaterial, KHR_materials_volume, gltfLoader)
                alphaMode = 'BLEND'
            }
            if (KHR_materials_unlit) {
                currentMaterial.useKHR_materials_unlit = true
            }
            if (KHR_materials_ior) {
                const {ior} = KHR_materials_ior
                currentMaterial.KHR_materials_ior = ior != undefined ? ior : 1.5;
                currentMaterial.use2PathRender = true
                currentMaterial.transparent = true
            }
            if (KHR_materials_dispersion) {
                const {dispersion} = KHR_materials_dispersion
                currentMaterial.KHR_dispersion = dispersion || 0;
                currentMaterial.use2PathRender = true
                currentMaterial.transparent = true
            }
            if (KHR_materials_sheen) {
                parse_KHR_materials_sheen(currentMaterial, KHR_materials_sheen, gltfLoader)
            }
            if (KHR_materials_specular) {
                parse_KHR_materials_specular(currentMaterial, KHR_materials_specular, gltfLoader)
            }
        }
    } else {
        // let tColor = [1, 1, 1, 1];
        currentMaterial = new PBRMaterial(redGPUContext);
        // tMaterial.baseColorFactor = tColor;
    }
    if (Object.hasOwn(meshPrimitive.attributes, 'COLOR_0')) {
        currentMaterial.useVertexColor = true
    }
    currentMaterial.doubleSided = doubleSided
    currentMaterial.cutOff = alphaCutoff;
    const {blendColorState, blendAlphaState} = currentMaterial
    switch (alphaMode) {
        case 'BLEND' :
            currentMaterial.alphaBlend = 2;
            blendColorState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA
            blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA
            blendAlphaState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA
            blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA
            // blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE
            currentMaterial.transparent = true
            break;
        case 'MASK' :
            currentMaterial.alphaBlend = 1;
            currentMaterial.useCutOff = true;
            blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE
            blendColorState.dstFactor = GPU_BLEND_FACTOR.ZERO
            blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE
            blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ZERO
            break;
        default :
            blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE
            blendColorState.dstFactor = GPU_BLEND_FACTOR.ZERO
            blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE
            blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ZERO
            currentMaterial.alphaBlend = 0;
    }
    return currentMaterial;
};
export default parseMaterialInfo_GLTF;
