import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
import fragmentModuleSource from './fragment.wgsl';

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface PBRMaterial {
    useVertexColor: boolean
    useCutOff: boolean
    cutOff: number
    alphaBlend: number
    //
    baseColorTexture: BitmapTexture
    baseColorTextureSampler: Sampler
    baseColorFactor: number[],
    baseColorTexture_texCoord_index: number,
    //
    useKHR_materials_clearcoat: boolean,
    KHR_clearcoatNormalScale: number,
    KHR_clearcoatFactor: number,
    KHR_clearcoatRoughnessFactor: number,
    KHR_clearcoatTexture: BitmapTexture,
    KHR_clearcoatNormalTexture: BitmapTexture,
    KHR_clearcoatRoughnessTexture: BitmapTexture,
    KHR_clearcoatTextureSampler: Sampler,
    KHR_clearcoatNormalTextureSampler: Sampler,
    KHR_clearcoatRoughnessTextureSampler: Sampler,
    KHR_clearcoatTexture_texCoord_index: number,
    KHR_clearcoatNormalTexture_texCoord_index: number,
    KHR_clearcoatRoughnessTexture_texCoord_index: number,
    //
    transmissionFactor: number;
    transmissionTexture: BitmapTexture,
    transmissionTextureSampler: Sampler,
    transmissionTexture_texCoord_index: number,
    //
    useKHR_materials_sheen: boolean,
    KHR_sheenColorFactor: [number, number, number],
    KHR_sheenRoughnessFactor: number,
    KHR_sheenColorTexture: BitmapTexture,
    KHR_sheenColorTextureSampler: Sampler,
    KHR_sheenRoughnessTexture: BitmapTexture,
    KHR_sheenRoughnessTextureSampler: Sampler,
    //
    useKHR_materials_specular: boolean,
    KHR_specularFactor: number,
    KHR_specularColorFactor: [number, number, number],
    KHR_specularTexture: BitmapTexture,
    KHR_specularTextureSampler: Sampler,
    KHR_specularColorTexture: BitmapTexture,
    KHR_specularColorTextureSampler: Sampler,
    //
    useKHR_materials_unlit: boolean,
    //
    KHR_materials_ior: number,
    //
    normalScale: number
    useNormalTexture: boolean
    normalTexture: BitmapTexture
    normalTextureSampler: Sampler,
    normalTexture_texCoord_index: number,
    //
    emissiveTexture: BitmapTexture
    emissiveTextureSampler: Sampler
    emissiveTexture_texCoord_index: number
    emissiveFactor: number[]
    emissiveStrength: number[]
    //
    occlusionTexture: BitmapTexture
    occlusionTextureSampler: Sampler
    occlusionTexture_texCoord_index: number
    occlusionStrength: number
    //
    metallicRoughnessTexture: BitmapTexture
    metallicRoughnessTextureSampler: Sampler
    metallicRoughnessTexture_texCoord_index: number
    metallicFactor: number
    roughnessFactor: number
    //
    // environmentTexture: CubeTexture
    // environmentTextureSampler: Sampler
    doubleSided: boolean
    //
    baseColorTexture_KHR_texture_transform_offset: [number, number],
    baseColorTexture_KHR_texture_transform_scale: [number, number],
    baseColorTexture_KHR_texture_transform_rotation: number,
    use_baseColorTexture_KHR_texture_transform: boolean,
    //
}

class PBRMaterial extends ABitmapBaseMaterial {
    /**
     * Indicates if the pipeline is dirty or not.
     *
     * @type {boolean}
     */
    dirtyPipeline: boolean = false

    /**
     * @classdesc The constructor for creating an instance of the class.
     * @constructor
     * @param {RedGPUContext} redGPUContext - The RedGPUContext object.
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            'PBR_MATERIAL',
            SHADER_INFO,
            2
        )
        this.initGPURenderInfos()
    }
}

DefineForFragment.defineByPreset(PBRMaterial, [
    DefineForFragment.PRESET_POSITIVE_NUMBER.EMISSIVE_STRENGTH,
    DefineForFragment.PRESET_POSITIVE_NUMBER.NORMAL_SCALE,
]);
{
    [
        'baseColorTexture', 'metallicRoughnessTexture', 'normalTexture', 'emissiveTexture', 'occlusionTexture',
        //
        'KHR_clearcoatTexture',
        'KHR_clearcoatNormalTexture',
        'KHR_clearcoatRoughnessTexture',
        //
        'KHR_sheenColorTexture',
        'KHR_sheenRoughnessTexture',
        //
        'KHR_specularTexture',
        'KHR_specularColorTexture'
    ].forEach(key => {
        DefineForFragment.definePositiveNumber(PBRMaterial, [
            [`${key}_KHR_texture_transform_rotation`, 0],
        ]);
        DefineForFragment.defineBoolean(PBRMaterial, [
            `use_${key}_KHR_texture_transform`,
        ])
        DefineForFragment.defineVec2(PBRMaterial, [
            `${key}_KHR_texture_transform_offset`,
            [`${key}_KHR_texture_transform_scale`, [1, 1]],
        ])
        //
        DefineForFragment.defineUint(PBRMaterial, [
            `${key}_texCoord_index`,
        ])
        //
        DefineForFragment.defineTexture(PBRMaterial, [
            key
        ])
        DefineForFragment.defineSampler(PBRMaterial, [
            `${key}Sampler`,
        ])
    })
}
DefineForFragment.definePositiveNumber(PBRMaterial, [
    ['cutOff', 0],
    'occlusionStrength',
    'metallicFactor',
    'roughnessFactor',
    //
    ['KHR_clearcoatFactor', 0],
    ['KHR_clearcoatRoughnessFactor', 0],
    'KHR_clearcoatNormalScale',
    //
    ['transmissionFactor', 0],
    //
    ['KHR_materials_ior', 1.5],
    //
    ['KHR_sheenRoughnessFactor', 0],
    //
    'KHR_specularFactor'
]);
DefineForFragment.defineUint(PBRMaterial, [
    'alphaBlend',
    ///
    'transmissionTexture_texCoord_index',
    //
])
DefineForFragment.defineBoolean(PBRMaterial, [
    'doubleSided',
    'useCutOff',
    'useVertexColor',
    'useVertexTangent',
    //
    'useKHR_materials_clearcoat',
    //
    'useKHR_materials_unlit',
    //
    'useKHR_materials_sheen',
    //
    'useKHR_materials_specular'
])
DefineForFragment.defineVec2(PBRMaterial, [])
DefineForFragment.defineVec3(PBRMaterial, [
    'emissiveFactor',
    'KHR_sheenColorFactor',
    ['KHR_specularColorFactor', [1, 1, 1]]
])
DefineForFragment.defineVec4(PBRMaterial, [
    ['baseColorFactor', [1, 1, 1, 1]]
])
DefineForFragment.defineSampler(PBRMaterial, [
    'transmissionTextureSampler',
])
DefineForFragment.defineTexture(PBRMaterial, [
    'transmissionTexture',
])
Object.freeze(PBRMaterial)
export default PBRMaterial
