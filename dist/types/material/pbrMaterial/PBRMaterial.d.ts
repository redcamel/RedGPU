import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import PackedTexture from "../../resources/texture/packedTexture/PackedTexture";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
interface PBRMaterial {
    useVertexColor: boolean;
    useCutOff: boolean;
    cutOff: number;
    alphaBlend: number;
    use2PathRender: boolean;
    baseColorTexture: BitmapTexture;
    baseColorTextureSampler: Sampler;
    baseColorFactor: number[];
    baseColorTexture_texCoord_index: number;
    useKHR_materials_clearcoat: boolean;
    KHR_clearcoatNormalScale: number;
    KHR_clearcoatFactor: number;
    KHR_clearcoatRoughnessFactor: number;
    KHR_clearcoatTexture: BitmapTexture;
    KHR_clearcoatNormalTexture: BitmapTexture;
    KHR_clearcoatRoughnessTexture: BitmapTexture;
    KHR_clearcoatTextureSampler: Sampler;
    KHR_clearcoatNormalTextureSampler: Sampler;
    KHR_clearcoatRoughnessTextureSampler: Sampler;
    KHR_clearcoatTexture_texCoord_index: number;
    KHR_clearcoatNormalTexture_texCoord_index: number;
    KHR_clearcoatRoughnessTexture_texCoord_index: number;
    useKHR_materials_anisotropy: boolean;
    KHR_anisotropyStrength: number;
    KHR_anisotropyRotation: number;
    KHR_anisotropyTexture: BitmapTexture;
    KHR_anisotropyTextureSampler: Sampler;
    KHR_anisotropyTexture_texCoord_index: number;
    useKHR_materials_transmission: boolean;
    KHR_transmissionFactor: number;
    KHR_transmissionTexture: BitmapTexture;
    KHR_transmissionTextureSampler: Sampler;
    KHR_transmissionTexture_texCoord_index: number;
    useKHR_materials_diffuse_transmission: boolean;
    KHR_diffuseTransmissionFactor: number;
    KHR_diffuseTransmissionColorFactor: [number, number, number];
    KHR_diffuseTransmissionTexture: BitmapTexture;
    KHR_diffuseTransmissionTextureSampler: Sampler;
    KHR_diffuseTransmissionTexture_texCoord_index: number;
    KHR_diffuseTransmissionColorTexture: BitmapTexture;
    KHR_diffuseTransmissionColorTextureSampler: Sampler;
    KHR_diffuseTransmissionColorTexture_texCoord_index: number;
    useKHR_materials_volume: boolean;
    KHR_thicknessFactor: number;
    KHR_attenuationDistance: number;
    KHR_attenuationColor: number[];
    KHR_thicknessTexture: BitmapTexture;
    KHR_thicknessTextureSampler: Sampler;
    KHR_thicknessTexture_texCoord_index: number;
    useKHR_materials_sheen: boolean;
    KHR_sheenColorFactor: [number, number, number];
    KHR_sheenRoughnessFactor: number;
    KHR_sheenColorTexture: BitmapTexture;
    KHR_sheenColorTextureSampler: Sampler;
    KHR_sheenRoughnessTexture: BitmapTexture;
    KHR_sheenRoughnessTextureSampler: Sampler;
    useKHR_materials_specular: boolean;
    KHR_specularFactor: number;
    KHR_specularColorFactor: [number, number, number];
    KHR_specularTexture: BitmapTexture;
    KHR_specularTextureSampler: Sampler;
    KHR_specularColorTexture: BitmapTexture;
    KHR_specularColorTextureSampler: Sampler;
    useKHR_materials_iridescence: boolean;
    KHR_iridescenceFactor: number;
    KHR_iridescenceIor: number;
    KHR_iridescenceThicknessMinimum: number;
    KHR_iridescenceThicknessMaximum: number;
    KHR_iridescenceTexture: BitmapTexture;
    KHR_iridescenceTextureSampler: Sampler;
    KHR_iridescenceThicknessTexture: BitmapTexture;
    KHR_iridescenceThicknessTextureSampler: Sampler;
    useKHR_materials_unlit: boolean;
    KHR_materials_ior: number;
    normalScale: number;
    useNormalTexture: boolean;
    normalTexture: BitmapTexture;
    normalTextureSampler: Sampler;
    normalTexture_texCoord_index: number;
    emissiveTexture: BitmapTexture;
    emissiveTextureSampler: Sampler;
    emissiveTexture_texCoord_index: number;
    emissiveFactor: number[];
    emissiveStrength: number[];
    occlusionTexture: BitmapTexture;
    occlusionTextureSampler: Sampler;
    occlusionTexture_texCoord_index: number;
    occlusionStrength: number;
    metallicRoughnessTexture: BitmapTexture;
    metallicRoughnessTextureSampler: Sampler;
    metallicRoughnessTexture_texCoord_index: number;
    metallicFactor: number;
    roughnessFactor: number;
    doubleSided: boolean;
    KHR_dispersion: boolean;
}
/**
 * The PBRMaterial class is a subclass of the ABitmapBaseMaterial class.
 * It is used to create a PBR material for rendering.
 * @extends ABitmapBaseMaterial
 */
declare class PBRMaterial extends ABitmapBaseMaterial {
    #private;
    /**
     * @classdesc The constructor for creating an instance of the class.
     * @constructor
     * @param {RedGPUContext} redGPUContext - The RedGPUContext object.
     */
    constructor(redGPUContext: RedGPUContext);
    get packedKHR_clearcoatTexture_transmission(): PackedTexture;
    get packedKHR_iridescence(): PackedTexture;
    get packedORMTexture(): PackedTexture;
    get packedKHR_sheen(): PackedTexture;
    get packedKHR_diffuse_transmission(): PackedTexture;
    setupPackORMTexture(): Promise<void>;
    setupPackedKHR_clearcoatTexture_transmission(): Promise<void>;
    setupPackedKHR_diffuse_transmission(): Promise<void>;
    setupPackedKHR_sheen(): Promise<void>;
    setupPackedKHR_iridescence(): Promise<void>;
}
export default PBRMaterial;
