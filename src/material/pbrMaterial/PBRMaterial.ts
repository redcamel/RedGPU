import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import PackedTexture from "../../resources/texture/packedTexture/PackedTexture";
import fragmentModuleSource from './fragment.wgsl';

import AUVTransformBaseMaterial from "../core/AUVTransformBaseMaterial";
import definePositiveNumber, {DefinePositiveNumberInfo} from "../../defineProperty/funcs/number/definePositiveNumber";
import defineVector3, {DefineVector3Info} from "../../defineProperty/funcs/vector/defineVector3";
import defineVector4, {DefineVector4Info} from "../../defineProperty/funcs/vector/defineVector4";
import defineBoolean from "../../defineProperty/funcs/defineBoolean";
import defineUint from "../../defineProperty/funcs/number/defineUint";
import defineVector2 from "../../defineProperty/funcs/vector/defineVector2";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";
import keepLog from "../../utils/keepLog";


const EXTENSION_LIST: {
    textureList?: string[],
    vec4List?: DefineVector4Info[],
    vec3List?: DefineVector3Info[],
    positiveNumberList?: DefinePositiveNumberInfo[],
    extensionName?: string,
}[] = [
    {
        textureList: [
            'baseColorTexture',
        ],
        vec4List: [
            {key: 'baseColorFactor', value: [1, 1, 1, 1]},
        ]
    },
    {
        textureList: [
            'normalTexture',
        ]
    },
    {
        textureList: [
            'metallicRoughnessTexture',
        ],
        positiveNumberList: [
            {key: 'metallicFactor', value: 1},
            {key: 'roughnessFactor', value: 1},
        ]
    },
    {
        textureList: [
            'emissiveTexture',
        ],
        vec3List: [
            {key: 'emissiveFactor', value: [0, 0, 0]}
        ]
    },
    {
        textureList: [
            'occlusionTexture',
        ],
        positiveNumberList: [
            {key: 'occlusionStrength', value: 1},
        ]
    },
    {
        extensionName: 'KHR_materials_clearcoat',
        textureList: [
            'KHR_clearcoatTexture',
            'KHR_clearcoatNormalTexture',
            'KHR_clearcoatRoughnessTexture',
        ],
        positiveNumberList: [
            {key: 'KHR_clearcoatFactor', value: 0},
            {key: 'KHR_clearcoatRoughnessFactor', value: 0},
            {key: 'KHR_clearcoatNormalScale', value: 1},
        ]
    },
    {
        extensionName: 'KHR_materials_sheen',
        textureList: [
            'KHR_sheenColorTexture',
            'KHR_sheenRoughnessTexture',
        ],
        positiveNumberList: [
            {key: 'KHR_sheenRoughnessFactor', value: 0},
        ],
        vec3List: [
            {key: 'KHR_sheenColorFactor', value: [0, 0, 0]}
        ]
    },
    {
        extensionName: 'KHR_materials_specular',
        textureList: [
            'KHR_specularTexture',
            'KHR_specularColorTexture',
        ],
        positiveNumberList: [
            {key: 'KHR_specularFactor', value: 1},
        ],
        vec3List: [
            {key: 'KHR_specularColorFactor', value: [1, 1, 1]},
        ]
    },
    {
        extensionName: 'KHR_materials_transmission',
        textureList: [
            'KHR_transmissionTexture',
        ],
        positiveNumberList: [
            {key: 'KHR_transmissionFactor', value: 0},
        ],
    },
    {
        extensionName: 'KHR_materials_volume',
        textureList: [
            'KHR_thicknessTexture',
        ],
        positiveNumberList: [
            {key: 'KHR_thicknessFactor', value: 0},
            {key: 'KHR_attenuationDistance', value: 1},
        ],
        vec3List: [
            {key: 'KHR_attenuationColor', value: [1, 1, 1]},
        ]
    },
    {
        extensionName: 'KHR_materials_diffuse_transmission',
        textureList: [
            'KHR_diffuseTransmissionTexture',
            'KHR_diffuseTransmissionColorTexture',
        ],
        positiveNumberList: [
            {key: 'KHR_diffuseTransmissionFactor', value: 0},
        ],
        vec3List: [
            {key: 'KHR_diffuseTransmissionColorFactor', value: [1, 1, 1]},
        ]
    },
    {
        extensionName: 'KHR_materials_anisotropy',
        textureList: [
            'KHR_anisotropyTexture',
        ],
        positiveNumberList: [
            {key: 'KHR_anisotropyStrength', value: 0},
            {key: 'KHR_anisotropyRotation', value: 0},
        ]
    },
    {
        extensionName: 'KHR_materials_iridescence',
        textureList: [
            'KHR_iridescenceTexture',
            'KHR_iridescenceThicknessTexture',
        ],
        positiveNumberList: [
            {key: 'KHR_iridescenceFactor', value: 0.0},
            {key: 'KHR_iridescenceIor', value: 1.3},
            {key: 'KHR_iridescenceThicknessMinimum', value: 100},
            {key: 'KHR_iridescenceThicknessMaximum', value: 400},
        ]
    }
]
const parseExtensionShaderCode = (source: string) => {
    const result = EXTENSION_LIST.map(v => {
        const {textureList} = v
        const textureDefine = textureList?.map(textureName => {
            return `
				use${textureName.charAt(0).toUpperCase()}${textureName.substring(1)}: u32,
    		${textureName}_texCoord_index: u32,
				use_${textureName}_KHR_texture_transform: u32,
				${textureName}_KHR_texture_transform_offset: vec2<f32>,
				${textureName}_KHR_texture_transform_scale: vec2<f32>,
				${textureName}_KHR_texture_transform_rotation: f32,`
        }).join('')
        return [textureDefine].join('\n')
    }).join('')
    const resultStr = source.replace(/#redgpu_include KHR_texture_transform/g, result)
    return resultStr
}
const FRAGMENT_SOURCE = parseExtensionShaderCode(fragmentModuleSource)

/**
 * [KO] PBRMaterial의 동적 PBR 속성 및 glTF 확장(KHR) 속성 인터페이스입니다.
 * [EN] Dynamic PBR and glTF extension (KHR) property interface for PBRMaterial.
 * @category Material
 */
interface PBRMaterial {
    /**
     * [KO] 버텍스 컬러 사용 여부
     * [EN] Whether to use vertex color
     */
    useVertexColor: boolean
    /**
     * [KO] 알파 컷오프(MASK) 사용 여부
     * [EN] Whether to use alpha cutoff (MASK)
     */
    useCutOff: boolean
    /**
     * [KO] 알파 컷오프 임계값
     * [EN] Alpha cutoff threshold value
     */
    cutOff: number
    /**
     * [KO] 알파 블렌딩 모드 값
     * [EN] Alpha blending mode value
     */
    alphaBlend: number
    /**
     * [KO] 2패스 투명 렌더링 사용 여부
     * [EN] Whether to use 2-pass transparent rendering
     */
    use2PathRender: boolean
    /**
     * [KO] 베이스 컬러 텍스처
     * [EN] Base color texture
     */
    baseColorTexture: BitmapTexture
    /**
     * [KO] 베이스 컬러 텍스처 샘플러
     * [EN] Base color texture sampler
     */
    baseColorTextureSampler: Sampler
    /**
     * [KO] 베이스 컬러 팩터 `[r, g, b, a]`
     * [EN] Base color factor `[r, g, b, a]`
     */
    baseColorFactor: number[],
    /**
     * [KO] 베이스 컬러 텍스처 UV 채널 인덱스
     * [EN] Base color texture UV channel index
     */
    baseColorTexture_texCoord_index: number,
    /**
     * [KO] `KHR_materials_clearcoat` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_clearcoat` extension
     */
    useKHR_materials_clearcoat: boolean,
    /**
     * [KO] 클리어코트 노멀 맵 스케일
     * [EN] Clearcoat normal map scale
     */
    KHR_clearcoatNormalScale: number,
    /**
     * [KO] 클리어코트 강도 팩터
     * [EN] Clearcoat intensity factor
     */
    KHR_clearcoatFactor: number,
    /**
     * [KO] 클리어코트 거칠기 팩터
     * [EN] Clearcoat roughness factor
     */
    KHR_clearcoatRoughnessFactor: number,
    /**
     * [KO] 클리어코트 텍스처
     * [EN] Clearcoat texture
     */
    KHR_clearcoatTexture: BitmapTexture,
    /**
     * [KO] 클리어코트 노멀 텍스처
     * [EN] Clearcoat normal texture
     */
    KHR_clearcoatNormalTexture: BitmapTexture,
    /**
     * [KO] 클리어코트 거칠기 텍스처
     * [EN] Clearcoat roughness texture
     */
    KHR_clearcoatRoughnessTexture: BitmapTexture,
    /**
     * [KO] 클리어코트 텍스처 샘플러
     * [EN] Clearcoat texture sampler
     */
    KHR_clearcoatTextureSampler: Sampler,
    /**
     * [KO] 클리어코트 노멀 텍스처 샘플러
     * [EN] Clearcoat normal texture sampler
     */
    KHR_clearcoatNormalTextureSampler: Sampler,
    /**
     * [KO] 클리어코트 거칠기 텍스처 샘플러
     * [EN] Clearcoat roughness texture sampler
     */
    KHR_clearcoatRoughnessTextureSampler: Sampler,
    /**
     * [KO] 클리어코트 텍스처 UV 채널 인덱스
     * [EN] Clearcoat texture UV channel index
     */
    KHR_clearcoatTexture_texCoord_index: number,
    /**
     * [KO] 클리어코트 노멀 텍스처 UV 채널 인덱스
     * [EN] Clearcoat normal texture UV channel index
     */
    KHR_clearcoatNormalTexture_texCoord_index: number,
    /**
     * [KO] 클리어코트 거칠기 텍스처 UV 채널 인덱스
     * [EN] Clearcoat roughness texture UV channel index
     */
    KHR_clearcoatRoughnessTexture_texCoord_index: number,
    /**
     * [KO] `KHR_materials_anisotropy` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_anisotropy` extension
     */
    useKHR_materials_anisotropy: boolean;
    /**
     * [KO] 이방성(Anisotropy) 강도
     * [EN] Anisotropy strength
     */
    KHR_anisotropyStrength: number;
    /**
     * [KO] 이방성 회전 각도 (라디안)
     * [EN] Anisotropy rotation angle (in radians)
     */
    KHR_anisotropyRotation: number;
    /**
     * [KO] 이방성 텍스처
     * [EN] Anisotropy texture
     */
    KHR_anisotropyTexture: BitmapTexture,
    /**
     * [KO] 이방성 텍스처 샘플러
     * [EN] Anisotropy texture sampler
     */
    KHR_anisotropyTextureSampler: Sampler,
    /**
     * [KO] 이방성 텍스처 UV 채널 인덱스
     * [EN] Anisotropy texture UV channel index
     */
    KHR_anisotropyTexture_texCoord_index: number,
    /**
     * [KO] `KHR_materials_transmission` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_transmission` extension
     */
    useKHR_materials_transmission: boolean;
    /**
     * [KO] 광학 투과(Transmission) 팩터
     * [EN] Optical transmission factor
     */
    KHR_transmissionFactor: number;
    /**
     * [KO] 투과 텍스처
     * [EN] Transmission texture
     */
    KHR_transmissionTexture: BitmapTexture,
    /**
     * [KO] 투과 텍스처 샘플러
     * [EN] Transmission texture sampler
     */
    KHR_transmissionTextureSampler: Sampler,
    /**
     * [KO] 투과 텍스처 UV 채널 인덱스
     * [EN] Transmission texture UV channel index
     */
    KHR_transmissionTexture_texCoord_index: number,
    /**
     * [KO] `KHR_materials_diffuse_transmission` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_diffuse_transmission` extension
     */
    useKHR_materials_diffuse_transmission: boolean;
    /**
     * [KO] 확산 투과(Diffuse Transmission) 팩터
     * [EN] Diffuse transmission factor
     */
    KHR_diffuseTransmissionFactor: number;
    /**
     * [KO] 확산 투과 컬러 팩터 `[r, g, b]`
     * [EN] Diffuse transmission color factor `[r, g, b]`
     */
    KHR_diffuseTransmissionColorFactor: [number, number, number];
    /**
     * [KO] 확산 투과 텍스처
     * [EN] Diffuse transmission texture
     */
    KHR_diffuseTransmissionTexture: BitmapTexture,
    /**
     * [KO] 확산 투과 텍스처 샘플러
     * [EN] Diffuse transmission texture sampler
     */
    KHR_diffuseTransmissionTextureSampler: Sampler,
    /**
     * [KO] 확산 투과 텍스처 UV 채널 인덱스
     * [EN] Diffuse transmission texture UV channel index
     */
    KHR_diffuseTransmissionTexture_texCoord_index: number,
    /**
     * [KO] 확산 투과 컬러 텍스처
     * [EN] Diffuse transmission color texture
     */
    KHR_diffuseTransmissionColorTexture: BitmapTexture,
    /**
     * [KO] 확산 투과 컬러 텍스처 샘플러
     * [EN] Diffuse transmission color texture sampler
     */
    KHR_diffuseTransmissionColorTextureSampler: Sampler,
    /**
     * [KO] 확산 투과 컬러 텍스처 UV 채널 인덱스
     * [EN] Diffuse transmission color texture UV channel index
     */
    KHR_diffuseTransmissionColorTexture_texCoord_index: number,
    /**
     * [KO] `KHR_materials_volume` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_volume` extension
     */
    useKHR_materials_volume: boolean;
    /**
     * [KO] 볼륨 두께 팩터
     * [EN] Volume thickness factor
     */
    KHR_thicknessFactor: number;
    /**
     * [KO] 볼륨 내 빛 감쇠 거리
     * [EN] Light attenuation distance within the volume
     */
    KHR_attenuationDistance: number;
    /**
     * [KO] 볼륨 감쇠 컬러 `[r, g, b]`
     * [EN] Volume attenuation color `[r, g, b]`
     */
    KHR_attenuationColor: number[];
    /**
     * [KO] 볼륨 두께 텍스처
     * [EN] Volume thickness texture
     */
    KHR_thicknessTexture: BitmapTexture,
    /**
     * [KO] 볼륨 두께 텍스처 샘플러
     * [EN] Volume thickness texture sampler
     */
    KHR_thicknessTextureSampler: Sampler,
    /**
     * [KO] 볼륨 두께 텍스처 UV 채널 인덱스
     * [EN] Volume thickness texture UV channel index
     */
    KHR_thicknessTexture_texCoord_index: number,
    /**
     * [KO] `KHR_materials_sheen` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_sheen` extension
     */
    useKHR_materials_sheen: boolean,
    /**
     * [KO] 광택(Sheen) 컬러 팩터 `[r, g, b]`
     * [EN] Sheen color factor `[r, g, b]`
     */
    KHR_sheenColorFactor: [number, number, number],
    /**
     * [KO] 광택 거칠기 팩터
     * [EN] Sheen roughness factor
     */
    KHR_sheenRoughnessFactor: number,
    /**
     * [KO] 광택 컬러 텍스처
     * [EN] Sheen color texture
     */
    KHR_sheenColorTexture: BitmapTexture,
    /**
     * [KO] 광택 컬러 텍스처 샘플러
     * [EN] Sheen color texture sampler
     */
    KHR_sheenColorTextureSampler: Sampler,
    /**
     * [KO] 광택 거칠기 텍스처
     * [EN] Sheen roughness texture
     */
    KHR_sheenRoughnessTexture: BitmapTexture,
    /**
     * [KO] 광택 거칠기 텍스처 샘플러
     * [EN] Sheen roughness texture sampler
     */
    KHR_sheenRoughnessTextureSampler: Sampler,
    /**
     * [KO] `KHR_materials_specular` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_specular` extension
     */
    useKHR_materials_specular: boolean,
    /**
     * [KO] 스펙큘러 반사 강도 팩터
     * [EN] Specular reflection strength factor
     */
    KHR_specularFactor: number,
    /**
     * [KO] 스펙큘러 컬러 팩터 `[r, g, b]`
     * [EN] Specular color factor `[r, g, b]`
     */
    KHR_specularColorFactor: [number, number, number],
    /**
     * [KO] 스펙큘러 텍스처
     * [EN] Specular texture
     */
    KHR_specularTexture: BitmapTexture,
    /**
     * [KO] 스펙큘러 텍스처 샘플러
     * [EN] Specular texture sampler
     */
    KHR_specularTextureSampler: Sampler,
    /**
     * [KO] 스펙큘러 컬러 텍스처
     * [EN] Specular color texture
     */
    KHR_specularColorTexture: BitmapTexture,
    /**
     * [KO] 스펙큘러 컬러 텍스처 샘플러
     * [EN] Specular color texture sampler
     */
    KHR_specularColorTextureSampler: Sampler,
    /**
     * [KO] `KHR_materials_iridescence` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_iridescence` extension
     */
    useKHR_materials_iridescence: boolean,
    /**
     * [KO] 무지개빛(Iridescence) 강도 팩터
     * [EN] Iridescence intensity factor
     */
    KHR_iridescenceFactor: number,
    /**
     * [KO] 무지개빛 박막 굴절률 (IOR)
     * [EN] Iridescence thin-film index of refraction (IOR)
     */
    KHR_iridescenceIor: number,
    /**
     * [KO] 무지개빛 박막 최소 두께 (nm)
     * [EN] Iridescence thin-film minimum thickness (nm)
     */
    KHR_iridescenceThicknessMinimum: number,
    /**
     * [KO] 무지개빛 박막 최대 두께 (nm)
     * [EN] Iridescence thin-film maximum thickness (nm)
     */
    KHR_iridescenceThicknessMaximum: number,
    /**
     * [KO] 무지개빛 강도 텍스처
     * [EN] Iridescence intensity texture
     */
    KHR_iridescenceTexture: BitmapTexture,
    /**
     * [KO] 무지개빛 강도 텍스처 샘플러
     * [EN] Iridescence intensity texture sampler
     */
    KHR_iridescenceTextureSampler: Sampler,
    /**
     * [KO] 무지개빛 두께 텍스처
     * [EN] Iridescence thickness texture
     */
    KHR_iridescenceThicknessTexture: BitmapTexture,
    /**
     * [KO] 무지개빛 두께 텍스처 샘플러
     * [EN] Iridescence thickness texture sampler
     */
    KHR_iridescenceThicknessTextureSampler: Sampler,
    /**
     * [KO] `KHR_materials_unlit` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_unlit` extension
     */
    useKHR_materials_unlit: boolean,
    /**
     * [KO] `KHR_materials_ior` 굴절률(IOR) 값 (기본값: `1.5`)
     * [EN] `KHR_materials_ior` index of refraction (IOR) value (default: `1.5`)
     */
    KHR_materials_ior: number,
    /**
     * [KO] 노멀 맵 스케일
     * [EN] Normal map scale
     */
    normalScale: number
    /**
     * [KO] 노멀 텍스처 사용 여부
     * [EN] Whether to use normal texture
     */
    useNormalTexture: boolean
    /**
     * [KO] 노멀 맵 텍스처
     * [EN] Normal map texture
     */
    normalTexture: BitmapTexture
    /**
     * [KO] 노멀 맵 텍스처 샘플러
     * [EN] Normal map texture sampler
     */
    normalTextureSampler: Sampler,
    /**
     * [KO] 노멀 맵 텍스처 UV 채널 인덱스
     * [EN] Normal map texture UV channel index
     */
    normalTexture_texCoord_index: number,
    /**
     * [KO] 발광(Emissive) 텍스처
     * [EN] Emissive texture
     */
    emissiveTexture: BitmapTexture
    /**
     * [KO] 발광 텍스처 샘플러
     * [EN] Emissive texture sampler
     */
    emissiveTextureSampler: Sampler
    /**
     * [KO] 발광 텍스처 UV 채널 인덱스
     * [EN] Emissive texture UV channel index
     */
    emissiveTexture_texCoord_index: number
    /**
     * [KO] 발광 컬러 팩터 `[r, g, b]`
     * [EN] Emissive color factor `[r, g, b]`
     */
    emissiveFactor: number[]
    /**
     * [KO] 발광 강도 배율 (`KHR_materials_emissive_strength`)
     * [EN] Emissive strength multiplier (`KHR_materials_emissive_strength`)
     */
    emissiveStrength: number[]
    /**
     * [KO] 오클루전(AO) 텍스처
     * [EN] Occlusion (AO) texture
     */
    occlusionTexture: BitmapTexture
    /**
     * [KO] 오클루전 텍스처 샘플러
     * [EN] Occlusion texture sampler
     */
    occlusionTextureSampler: Sampler
    /**
     * [KO] 오클루전 텍스처 UV 채널 인덱스
     * [EN] Occlusion texture UV channel index
     */
    occlusionTexture_texCoord_index: number
    /**
     * [KO] 오클루전 적용 강도
     * [EN] Occlusion application strength
     */
    occlusionStrength: number
    /**
     * [KO] 금속성-거칠기(Metallic-Roughness) 텍스처
     * [EN] Metallic-Roughness texture
     */
    metallicRoughnessTexture: BitmapTexture
    /**
     * [KO] 금속성-거칠기 텍스처 샘플러
     * [EN] Metallic-Roughness texture sampler
     */
    metallicRoughnessTextureSampler: Sampler
    /**
     * [KO] 금속성-거칠기 텍스처 UV 채널 인덱스
     * [EN] Metallic-Roughness texture UV channel index
     */
    metallicRoughnessTexture_texCoord_index: number
    /**
     * [KO] 금속성(Metallic) 팩터 (0.0 ~ 1.0)
     * [EN] Metallic factor (0.0 to 1.0)
     */
    metallicFactor: number
    /**
     * [KO] 거칠기(Roughness) 팩터 (0.0 ~ 1.0)
     * [EN] Roughness factor (0.0 to 1.0)
     */
    roughnessFactor: number
    /**
     * [KO] 양면 렌더링 여부
     * [EN] Whether double-sided rendering is enabled
     */
    doubleSided: boolean
    /**
     * [KO] 식생(Two-Sided Foliage) 셰이딩 모델 활성화 여부
     * [EN] Whether Two-Sided Foliage shading model is enabled
     */
    isFoliage: boolean
    /**
     * [KO] `KHR_materials_dispersion` 색분산 강도
     * [EN] `KHR_materials_dispersion` dispersion strength
     */
    KHR_dispersion: boolean
}

/**
 * [KO] 물리 기반 렌더링(Physically Based Rendering) 및 glTF 2.0 재질 확장을 지원하는 머티리얼 클래스입니다.
 * [EN] Material class supporting Physically Based Rendering (PBR) and glTF 2.0 material extensions.
 *
 * [KO] 베이스 컬러, 금속성/거칠기, 노멀, 오클루전, 발광 텍스처 및 다양한 `KHR_materials_*` 확장 속성을 통합 관리하고 렌더 파이프라인용 패킹 텍스처를 구성합니다.
 * [EN] Integrates and manages base color, metallic/roughness, normal, occlusion, emissive textures, and various `KHR_materials_*` extension properties, configuring packed textures for the render pipeline.
 *
 * @category Material
 */
class PBRMaterial extends AUVTransformBaseMaterial {
    #packedORMTexture: PackedTexture
    #packedKHR_diffuse_transmission: PackedTexture
    #packedKHR_sheen: PackedTexture
    #packedKHR_iridescence: PackedTexture
    #packedKHR_clearcoatTexture_transmission: PackedTexture

    /**
     * [KO] PBRMaterial 인스턴스를 생성합니다.
     * [EN] Creates a PBRMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            'PBR_MATERIAL',
            FRAGMENT_SOURCE,
            2
        )
        this.initGPURenderInfos();


        this.__packingList = [
            () => {
                this.setupPackORMTexture()
                this.setupPackedKHR_clearcoatTexture_transmission()
                this.setupPackedKHR_diffuse_transmission()
                this.setupPackedKHR_sheen()
                this.setupPackedKHR_iridescence()
            }
        ]
    }

    /**
     * [KO] 클리어코트 및 투과(Transmission)/두께 채널이 결합된 패킹 텍스처를 반환합니다.
     * [EN] Returns the packed texture combining clearcoat and transmission/thickness channels.
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedKHR_clearcoatTexture_transmission(): PackedTexture {
        return this.#packedKHR_clearcoatTexture_transmission;
    }

    /**
     * [KO] 무지개빛(Iridescence) 및 두께 채널이 결합된 패킹 텍스처를 반환합니다.
     * [EN] Returns the packed texture combining iridescence and thickness channels.
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedKHR_iridescence(): PackedTexture {
        return this.#packedKHR_iridescence;
    }

    /**
     * [KO] 오클루전(R), 거칠기(G), 금속성(B)이 결합된 ORM 패킹 텍스처를 반환합니다.
     * [EN] Returns the ORM packed texture combining occlusion (R), roughness (G), and metallic (B).
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedORMTexture(): PackedTexture {
        return this.#packedORMTexture;
    }

    /**
     * [KO] 광택(Sheen) 컬러 및 거칠기 채널이 결합된 패킹 텍스처를 반환합니다.
     * [EN] Returns the packed texture combining sheen color and roughness channels.
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedKHR_sheen(): PackedTexture {
        return this.#packedKHR_sheen;
    }

    /**
     * [KO] 확산 투과(Diffuse Transmission) 컬러 및 팩터 채널이 결합된 패킹 텍스처를 반환합니다.
     * [EN] Returns the packed texture combining diffuse transmission color and factor channels.
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedKHR_diffuse_transmission(): PackedTexture {
        return this.#packedKHR_diffuse_transmission;
    }

    /**
     * [KO] 오클루전과 금속성-거칠기 텍스처를 단일 ORM 패킹 텍스처로 병합합니다.
     * [EN] Merges occlusion and metallic-roughness textures into a single ORM packed texture.
     */
    async setupPackORMTexture() {
        if (!(this.occlusionTexture || this.metallicRoughnessTexture)) {
            return
        }
        if (!this.#packedORMTexture) {
            this.#packedORMTexture = new PackedTexture(this.redGPUContext)
        }
        const width = Math.max(
            this.occlusionTexture?.gpuTexture?.width || 1,
            this.metallicRoughnessTexture?.gpuTexture?.width || 1
        );
        const height = Math.max(
            this.occlusionTexture?.gpuTexture?.height || 1,
            this.metallicRoughnessTexture?.gpuTexture?.height || 1
        );
        keepLog(this.occlusionTexture, this.metallicRoughnessTexture)
        await this.#packedORMTexture.packing(
            {
                r: this.occlusionTexture?.gpuTexture,
                g: this.metallicRoughnessTexture?.gpuTexture,
                b: this.metallicRoughnessTexture?.gpuTexture,
            },
            width,
            height,
            'packedORMTexture'
        )
    }

    /**
     * [KO] 클리어코트, 클리어코트 거칠기, 투과, 볼륨 두께 텍스처를 단일 4채널 텍스처로 패킹합니다.
     * [EN] Packs clearcoat, clearcoat roughness, transmission, and volume thickness textures into a single 4-channel texture.
     */
    async setupPackedKHR_clearcoatTexture_transmission() {
        if (!this.#packedKHR_clearcoatTexture_transmission) {
            this.#packedKHR_clearcoatTexture_transmission = new PackedTexture(this.redGPUContext)
        }
        const clearcoatWidth = Math.max(
            this.KHR_clearcoatTexture?.gpuTexture?.width || 1,
            this.KHR_clearcoatRoughnessTexture?.gpuTexture?.width || 1
        );
        const clearcoatHeight = Math.max(
            this.KHR_clearcoatTexture?.gpuTexture?.height || 1,
            this.KHR_clearcoatRoughnessTexture?.gpuTexture?.height || 1
        );
        const transmissionWidth = Math.max(
            this.KHR_transmissionTexture?.gpuTexture?.width || 1,
            this.KHR_thicknessTexture?.gpuTexture?.width || 1
        );
        const transmissionHeight = Math.max(
            this.KHR_transmissionTexture?.gpuTexture?.height || 1,
            this.KHR_thicknessTexture?.gpuTexture?.height || 1
        );
        const finalWidth = Math.max(clearcoatWidth, transmissionWidth);
        const finalHeight = Math.max(clearcoatHeight, transmissionHeight);
        await this.#packedKHR_clearcoatTexture_transmission.packing(
            {
                r: this.KHR_clearcoatTexture?.gpuTexture,
                g: this.KHR_clearcoatRoughnessTexture?.gpuTexture,
                b: this.KHR_transmissionTexture?.gpuTexture,
                a: this.KHR_thicknessTexture?.gpuTexture,
            },
            finalWidth,
            finalHeight,
            'packedKHR_clearcoatTexture_transmission',
            {
                b: 'r', a: 'g'
            }
        )
    }

    /**
     * [KO] 확산 투과 컬러 및 확산 투과 팩터 텍스처를 단일 패킹 텍스처로 병합합니다.
     * [EN] Merges diffuse transmission color and diffuse transmission factor textures into a single packed texture.
     */
    async setupPackedKHR_diffuse_transmission() {
        if (!(this.KHR_diffuseTransmissionColorTexture || this.KHR_diffuseTransmissionTexture)) {
            return
        }
        if (!this.#packedKHR_diffuse_transmission) {
            this.#packedKHR_diffuse_transmission = new PackedTexture(this.redGPUContext)
        }
        const width = Math.max(
            this.KHR_diffuseTransmissionColorTexture?.gpuTexture?.width || 1,
            this.KHR_diffuseTransmissionTexture?.gpuTexture?.width || 1
        );
        const height = Math.max(
            this.KHR_diffuseTransmissionColorTexture?.gpuTexture?.height || 1,
            this.KHR_diffuseTransmissionTexture?.gpuTexture?.height || 1
        );
        await this.#packedKHR_diffuse_transmission.packing(
            {
                r: this.KHR_diffuseTransmissionColorTexture?.gpuTexture,
                g: this.KHR_diffuseTransmissionColorTexture?.gpuTexture,
                b: this.KHR_diffuseTransmissionColorTexture?.gpuTexture,
                a: this.KHR_diffuseTransmissionTexture?.gpuTexture,
            },
            width,
            height,
            'packedKHR_diffuse_transmission'
        )
    }

    /**
     * [KO] 광택(Sheen) 컬러 및 광택 거칠기 텍스처를 단일 패킹 텍스처로 병합합니다.
     * [EN] Merges sheen color and sheen roughness textures into a single packed texture.
     */
    async setupPackedKHR_sheen() {
        if (!(this.KHR_sheenColorTexture || this.KHR_sheenRoughnessTexture)) {
            return
        }
        if (!this.#packedKHR_sheen) {
            this.#packedKHR_sheen = new PackedTexture(this.redGPUContext)
        }
        const width = Math.max(
            this.KHR_sheenColorTexture?.gpuTexture?.width || 1,
            this.KHR_sheenRoughnessTexture?.gpuTexture?.width || 1
        );
        const height = Math.max(
            this.KHR_sheenColorTexture?.gpuTexture?.height || 1,
            this.KHR_sheenRoughnessTexture?.gpuTexture?.height || 1
        );
        await this.#packedKHR_sheen.packing(
            {
                r: this.KHR_sheenColorTexture?.gpuTexture,
                g: this.KHR_sheenColorTexture?.gpuTexture,
                b: this.KHR_sheenColorTexture?.gpuTexture,
                a: this.KHR_sheenRoughnessTexture?.gpuTexture,
            },
            width,
            height,
            'packedKHR_sheen'
        )
    }

    /**
     * [KO] 무지개빛(Iridescence) 및 무지개빛 두께 텍스처를 단일 패킹 텍스처로 병합합니다.
     * [EN] Merges iridescence and iridescence thickness textures into a single packed texture.
     */
    async setupPackedKHR_iridescence() {
        if (!(this.KHR_iridescenceTexture || this.KHR_iridescenceThicknessTexture)) {
            return
        }
        if (!this.#packedKHR_iridescence) {
            this.#packedKHR_iridescence = new PackedTexture(this.redGPUContext)
        }
        const width = Math.max(
            this.KHR_iridescenceTexture?.gpuTexture?.width || 1,
            this.KHR_iridescenceThicknessTexture?.gpuTexture?.width || 1
        );
        const height = Math.max(
            this.KHR_iridescenceTexture?.gpuTexture?.height || 1,
            this.KHR_iridescenceThicknessTexture?.gpuTexture?.height || 1
        );
        await this.#packedKHR_iridescence.packing(
            {
                r: this.KHR_iridescenceTexture?.gpuTexture,
                g: this.KHR_iridescenceThicknessTexture?.gpuTexture,
            },
            width,
            height,
            'packedKHR_iridescence'
        )
    }
}

definePositiveNumber(PBRMaterial,
    [
        {key: 'emissiveStrength', value: 1},
        {key: 'normalScale', value: 1}
    ]
)
const defineTexturePropertys = (textureList: string[], useSampler: boolean) => {
    textureList?.forEach(key => {
        defineBoolean(PBRMaterial, [
            {key: `use${key.charAt(0).toUpperCase()}${key.substring(1)}`, value: false}
        ])
        definePositiveNumber(PBRMaterial, [
            {key: `${key}_KHR_texture_transform_rotation`, value: 0},
        ]);
        defineBoolean(PBRMaterial, [
            {key: `use_${key}_KHR_texture_transform`, value: false},
        ])
        defineVector2(PBRMaterial, [
            {key: `${key}_KHR_texture_transform_offset`},
            {key: `${key}_KHR_texture_transform_scale`, value: [1, 1]},
        ])
        defineUint(PBRMaterial, [
            {key: `${key}_texCoord_index`, value: 0}
        ])
        defineTexture(PBRMaterial, [
            {key: key}
        ])
        if (useSampler) {
            defineSampler(PBRMaterial, [
                {key: `${key}Sampler`},
            ])
        }
    })
}
const extensionDefine = (defineList) => {
    defineList.forEach(v => {
        const {extensionName, textureList, useSampler} = v;
        const {positiveNumberList, vec3List, vec4List} = v;
        if (extensionName) defineBoolean(PBRMaterial, [{
            key: `use${extensionName}`,
            value: false
        }])
        defineTexturePropertys(textureList, !useSampler)
        positiveNumberList?.forEach(v => {
            definePositiveNumber(PBRMaterial, [
                v
            ])
        })
        vec3List?.forEach(v => {
            defineVector3(PBRMaterial, [
                v
            ])
        })
        vec4List?.forEach(v => {
            defineVector4(PBRMaterial, [
                v
            ])
        })
    })
}
extensionDefine(EXTENSION_LIST)
definePositiveNumber(PBRMaterial, [
    {key: 'cutOff', value: 0},
    {key: 'KHR_materials_ior', value: 1.5},
    {key: 'KHR_dispersion', value: 0},
]);
defineUint(PBRMaterial, [
    {key: 'alphaBlend', value: 0},
])
defineBoolean(PBRMaterial, [
    {key: 'doubleSided', value: false},
    {key: 'useCutOff', value: false},
    {key: 'useVertexColor', value: false},
    {key: 'useVertexTangent', value: false},
    {key: 'isFoliage', value: false},
    {key: 'useKHR_materials_unlit', value: false},
    {key: 'useSSR', value: true}
])
Object.defineProperty(PBRMaterial.prototype, 'isPBRMaterial', {
    value: true,
    writable: false
});
Object.freeze(PBRMaterial)
export default PBRMaterial
