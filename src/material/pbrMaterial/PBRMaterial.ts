import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../defineProperty/DefineForFragment";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import PackedTexture from "../../resources/texture/packedTexture/PackedTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
import fragmentModuleSource from './fragment.wgsl';

const EXTENSION_LIST = [
    {
        textureList: [
            'baseColorTexture',
        ],
        vec4List: [
            ['baseColorFactor', [1, 1, 1, 1]]
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
            'metallicFactor',
            'roughnessFactor',
        ]
    },
    {
        textureList: [
            'emissiveTexture',
        ],
        vec3List: [
            'emissiveFactor',
        ]
    },
    {
        textureList: [
            'occlusionTexture',
        ],
        positiveNumberList: [
            'occlusionStrength',
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
            ['KHR_clearcoatFactor', 0],
            ['KHR_clearcoatRoughnessFactor', 0],
            'KHR_clearcoatNormalScale',
        ]
    },
    {
        extensionName: 'KHR_materials_sheen',
        textureList: [
            'KHR_sheenColorTexture',
            'KHR_sheenRoughnessTexture',
        ],
        positiveNumberList: [
            ['KHR_sheenRoughnessFactor', 0]
        ],
        vec3List: [
            ['KHR_sheenColorFactor', [0, 0, 0]]
        ]
    },
    {
        extensionName: 'KHR_materials_specular',
        textureList: [
            'KHR_specularTexture',
            'KHR_specularColorTexture',
        ],
        positiveNumberList: [
            'KHR_specularFactor',
        ],
        vec3List: [
            ['KHR_specularColorFactor', [1, 1, 1]],
        ]
    },
    {
        extensionName: 'KHR_materials_transmission',
        textureList: [
            'KHR_transmissionTexture',
        ],
        positiveNumberList: [
            ['KHR_transmissionFactor', 0],
        ],
    },
    {
        extensionName: 'KHR_materials_volume',
        textureList: [
            'KHR_thicknessTexture',
        ],
        positiveNumberList: [
            ['KHR_thicknessFactor', 0],
            ['KHR_attenuationDistance', 1],
        ],
        vec3List: [
            ['KHR_attenuationColor', [1, 1, 1]],
        ]
    },
    {
        extensionName: 'KHR_materials_diffuse_transmission',
        textureList: [
            'KHR_diffuseTransmissionTexture',
            'KHR_diffuseTransmissionColorTexture',
        ],
        positiveNumberList: [
            ['KHR_diffuseTransmissionFactor', 0],
        ],
        vec3List: [
            ['KHR_diffuseTransmissionColorFactor', [1, 1, 1]],
        ]
    },
    {
        extensionName: 'KHR_materials_anisotropy',
        textureList: [
            'KHR_anisotropyTexture',
        ],
        positiveNumberList: [
            ['KHR_anisotropyStrength', 0],
            ['KHR_anisotropyRotation', 0],
        ]
    },
    {
        extensionName: 'KHR_materials_iridescence',
        textureList: [
            'KHR_iridescenceTexture',
            'KHR_iridescenceThicknessTexture',
        ],
        positiveNumberList: [
            ['KHR_iridescenceFactor', 0.0],
            ['KHR_iridescenceIor', 1.3],
            ['KHR_iridescenceThicknessMinimum', 100],
            ['KHR_iridescenceThicknessMaximum', 400],
        ]
    }
]
const parseExtensionShaderCode = (source: string) => {
    const result = EXTENSION_LIST.map(v => {
        const {textureList, positiveNumberList} = v
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
    // console.log('resultStr', resultStr)
    return resultStr
}
const SHADER_INFO = parseWGSL(parseExtensionShaderCode(fragmentModuleSource))

/**
 * [KO] PBRMaterial 속성 인터페이스
 * [EN] PBRMaterial property interface
 */
interface PBRMaterial {
    /**
     * [KO] 버텍스 컬러 사용 여부
     * [EN] Whether to use vertex color
     */
    useVertexColor: boolean
    /**
     * [KO] 알파 컷오프 사용 여부
     * [EN] Whether to use alpha cutoff
     */
    useCutOff: boolean
    /**
     * [KO] 알파 컷오프 값
     * [EN] Alpha cutoff value
     */
    cutOff: number
    /**
     * [KO] 알파 블렌딩 모드
     * [EN] Alpha blending mode
     */
    alphaBlend: number
    /**
     * [KO] 2패스 렌더링 사용 여부
     * [EN] Whether to use 2-pass rendering
     */
    use2PathRender: boolean
    //
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
     * [KO] 베이스 컬러 팩터
     * [EN] Base color factor
     */
    baseColorFactor: number[],
    /**
     * [KO] 베이스 컬러 텍스처 UV 인덱스
     * [EN] Base color texture UV index
     */
    baseColorTexture_texCoord_index: number,
    //
    /**
     * [KO] KHR_materials_clearcoat 확장 사용 여부
     * [EN] Whether to use KHR_materials_clearcoat extension
     */
    useKHR_materials_clearcoat: boolean,
    /**
     * [KO] 클리어코트 노멀 스케일
     * [EN] Clearcoat normal scale
     */
    KHR_clearcoatNormalScale: number,
    /**
     * [KO] 클리어코트 팩터
     * [EN] Clearcoat factor
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
     * [KO] 클리어코트 텍스처 UV 인덱스
     * [EN] Clearcoat texture UV index
     */
    KHR_clearcoatTexture_texCoord_index: number,
    /**
     * [KO] 클리어코트 노멀 텍스처 UV 인덱스
     * [EN] Clearcoat normal texture UV index
     */
    KHR_clearcoatNormalTexture_texCoord_index: number,
    /**
     * [KO] 클리어코트 거칠기 텍스처 UV 인덱스
     * [EN] Clearcoat roughness texture UV index
     */
    KHR_clearcoatRoughnessTexture_texCoord_index: number,
    //
    /**
     * [KO] KHR_materials_anisotropy 확장 사용 여부
     * [EN] Whether to use KHR_materials_anisotropy extension
     */
    useKHR_materials_anisotropy: boolean;
    /**
     * [KO] 이방성 강도
     * [EN] Anisotropy strength
     */
    KHR_anisotropyStrength: number;
    /**
     * [KO] 이방성 회전
     * [EN] Anisotropy rotation
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
     * [KO] 이방성 텍스처 UV 인덱스
     * [EN] Anisotropy texture UV index
     */
    KHR_anisotropyTexture_texCoord_index: number,
    //
    //
    /**
     * [KO] KHR_materials_transmission 확장 사용 여부
     * [EN] Whether to use KHR_materials_transmission extension
     */
    useKHR_materials_transmission: boolean;
    /**
     * [KO] 투과 팩터
     * [EN] Transmission factor
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
     * [KO] 투과 텍스처 UV 인덱스
     * [EN] Transmission texture UV index
     */
    KHR_transmissionTexture_texCoord_index: number,
    //
    /**
     * [KO] KHR_materials_diffuse_transmission 확장 사용 여부
     * [EN] Whether to use KHR_materials_diffuse_transmission extension
     */
    useKHR_materials_diffuse_transmission: boolean;
    /**
     * [KO] 확산 투과 팩터
     * [EN] Diffuse transmission factor
     */
    KHR_diffuseTransmissionFactor: number;
    /**
     * [KO] 확산 투과 컬러 팩터
     * [EN] Diffuse transmission color factor
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
     * [KO] 확산 투과 텍스처 UV 인덱스
     * [EN] Diffuse transmission texture UV index
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
     * [KO] 확산 투과 컬러 텍스처 UV 인덱스
     * [EN] Diffuse transmission color texture UV index
     */
    KHR_diffuseTransmissionColorTexture_texCoord_index: number,
    //
    /**
     * [KO] KHR_materials_volume 확장 사용 여부
     * [EN] Whether to use KHR_materials_volume extension
     */
    useKHR_materials_volume: boolean;
    /**
     * [KO] 두께 팩터
     * [EN] Thickness factor
     */
    KHR_thicknessFactor: number;
    /**
     * [KO] 감쇠 거리
     * [EN] Attenuation distance
     */
    KHR_attenuationDistance: number;
    /**
     * [KO] 감쇠 컬러
     * [EN] Attenuation color
     */
    KHR_attenuationColor: number[];
    /**
     * [KO] 두께 텍스처
     * [EN] Thickness texture
     */
    KHR_thicknessTexture: BitmapTexture,
    /**
     * [KO] 두께 텍스처 샘플러
     * [EN] Thickness texture sampler
     */
    KHR_thicknessTextureSampler: Sampler,
    /**
     * [KO] 두께 텍스처 UV 인덱스
     * [EN] Thickness texture UV index
     */
    KHR_thicknessTexture_texCoord_index: number,
    //
    /**
     * [KO] KHR_materials_sheen 확장 사용 여부
     * [EN] Whether to use KHR_materials_sheen extension
     */
    useKHR_materials_sheen: boolean,
    /**
     * [KO] 광택 컬러 팩터
     * [EN] Sheen color factor
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
    //
    /**
     * [KO] KHR_materials_specular 확장 사용 여부
     * [EN] Whether to use KHR_materials_specular extension
     */
    useKHR_materials_specular: boolean,
    /**
     * [KO] 스펙큘러 팩터
     * [EN] Specular factor
     */
    KHR_specularFactor: number,
    /**
     * [KO] 스펙큘러 컬러 팩터
     * [EN] Specular color factor
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
    //
    //
    /**
     * [KO] KHR_materials_iridescence 확장 사용 여부
     * [EN] Whether to use KHR_materials_iridescence extension
     */
    useKHR_materials_iridescence: boolean,
    /**
     * [KO] 무지개빛 팩터
     * [EN] Iridescence factor
     */
    KHR_iridescenceFactor: number,
    /**
     * [KO] 무지개빛 IOR
     * [EN] Iridescence IOR
     */
    KHR_iridescenceIor: number,
    /**
     * [KO] 무지개빛 최소 두께
     * [EN] Iridescence thickness minimum
     */
    KHR_iridescenceThicknessMinimum: number,
    /**
     * [KO] 무지개빛 최대 두께
     * [EN] Iridescence thickness maximum
     */
    KHR_iridescenceThicknessMaximum: number,
    /**
     * [KO] 무지개빛 텍스처
     * [EN] Iridescence texture
     */
    KHR_iridescenceTexture: BitmapTexture,
    /**
     * [KO] 무지개빛 텍스처 샘플러
     * [EN] Iridescence texture sampler
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
    //
    /**
     * [KO] KHR_materials_unlit 확장 사용 여부
     * [EN] Whether to use KHR_materials_unlit extension
     */
    useKHR_materials_unlit: boolean,
    //
    /**
     * [KO] KHR_materials_ior 확장 IOR 값
     * [EN] KHR_materials_ior extension IOR value
     */
    KHR_materials_ior: number,
    //
    /**
     * [KO] 노멀 스케일
     * [EN] Normal scale
     */
    normalScale: number
    /**
     * [KO] 노멀 텍스처 사용 여부
     * [EN] Whether to use normal texture
     */
    useNormalTexture: boolean
    /**
     * [KO] 노멀 텍스처
     * [EN] Normal texture
     */
    normalTexture: BitmapTexture
    /**
     * [KO] 노멀 텍스처 샘플러
     * [EN] Normal texture sampler
     */
    normalTextureSampler: Sampler,
    /**
     * [KO] 노멀 텍스처 UV 인덱스
     * [EN] Normal texture UV index
     */
    normalTexture_texCoord_index: number,
    //
    /**
     * [KO] 발광 텍스처
     * [EN] Emissive texture
     */
    emissiveTexture: BitmapTexture
    /**
     * [KO] 발광 텍스처 샘플러
     * [EN] Emissive texture sampler
     */
    emissiveTextureSampler: Sampler
    /**
     * [KO] 발광 텍스처 UV 인덱스
     * [EN] Emissive texture UV index
     */
    emissiveTexture_texCoord_index: number
    /**
     * [KO] 발광 팩터
     * [EN] Emissive factor
     */
    emissiveFactor: number[]
    /**
     * [KO] 발광 강도
     * [EN] Emissive strength
     */
    emissiveStrength: number[]
    //
    /**
     * [KO] 오클루전 텍스처
     * [EN] Occlusion texture
     */
    occlusionTexture: BitmapTexture
    /**
     * [KO] 오클루전 텍스처 샘플러
     * [EN] Occlusion texture sampler
     */
    occlusionTextureSampler: Sampler
    /**
     * [KO] 오클루전 텍스처 UV 인덱스
     * [EN] Occlusion texture UV index
     */
    occlusionTexture_texCoord_index: number
    /**
     * [KO] 오클루전 강도
     * [EN] Occlusion strength
     */
    occlusionStrength: number
    //
    /**
     * [KO] 금속성-거칠기 텍스처
     * [EN] Metallic-Roughness texture
     */
    metallicRoughnessTexture: BitmapTexture
    /**
     * [KO] 금속성-거칠기 텍스처 샘플러
     * [EN] Metallic-Roughness texture sampler
     */
    metallicRoughnessTextureSampler: Sampler
    /**
     * [KO] 금속성-거칠기 텍스처 UV 인덱스
     * [EN] Metallic-Roughness texture UV index
     */
    metallicRoughnessTexture_texCoord_index: number
    /**
     * [KO] 금속성 팩터
     * [EN] Metallic factor
     */
    metallicFactor: number
    /**
     * [KO] 거칠기 팩터
     * [EN] Roughness factor
     */
    roughnessFactor: number
    //
    // environmentTexture: CubeTexture
    // environmentTextureSampler: Sampler
    /**
     * [KO] 양면 렌더링 여부
     * [EN] Whether it is double-sided
     */
    doubleSided: boolean
    //
    //
    /**
     * [KO] KHR_dispersion 확장 사용 여부
     * [EN] Whether to use KHR_dispersion extension
     */
    KHR_dispersion: boolean
}

/**
 * [KO] PBR(Physically Based Rendering) 머티리얼 클래스입니다.
 * [EN] PBR (Physically Based Rendering) material class.
 *
 * [KO] ABitmapBaseMaterial을 상속받아 PBR 렌더링을 위한 머티리얼을 생성합니다.
 * [EN] Inherits from ABitmapBaseMaterial to create a material for PBR rendering.
 * @category Material
 */
class PBRMaterial extends ABitmapBaseMaterial {
    #packedORMTexture: PackedTexture
    // #packedKHR_clearcoatTexture: PackedTexture
    // #packedKHR_transmission: PackedTexture
    #packedKHR_diffuse_transmission: PackedTexture
    #packedKHR_sheen: PackedTexture
    #packedKHR_iridescence: PackedTexture
    #packedKHR_clearcoatTexture_transmission: PackedTexture

    /**
     * [KO] PBRMaterial 생성자
     * [EN] PBRMaterial constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            'PBR_MATERIAL',
            SHADER_INFO,
            2
        )
        this.initGPURenderInfos();


        this.__packingList = [
            () => {
                //TODO - 이거 개선해야함... 대상만 갱신되도록
                this.setupPackORMTexture()
                this.setupPackedKHR_clearcoatTexture_transmission()
                // this.setupPackedKHR_clearcoatTexture()
                // this.setupPackedKHR_transmission()
                this.setupPackedKHR_diffuse_transmission()
                this.setupPackedKHR_sheen()
                this.setupPackedKHR_iridescence()
            }
        ]
    }

    /**
     * [KO] Clearcoat 및 Transmission 패킹 텍스처 반환
     * [EN] Returns packed texture for Clearcoat and Transmission
     */
    get packedKHR_clearcoatTexture_transmission(): PackedTexture {
        return this.#packedKHR_clearcoatTexture_transmission;
    }

    /**
     * [KO] Iridescence 패킹 텍스처 반환
     * [EN] Returns packed texture for Iridescence
     */
    get packedKHR_iridescence(): PackedTexture {
        return this.#packedKHR_iridescence;
    }

    /**
     * [KO] ORM(Occlusion, Roughness, Metallic) 패킹 텍스처 반환
     * [EN] Returns packed texture for ORM (Occlusion, Roughness, Metallic)
     */
    get packedORMTexture(): PackedTexture {
        return this.#packedORMTexture;
    }

    /**
     * [KO] Sheen 패킹 텍스처 반환
     * [EN] Returns packed texture for Sheen
     */
    get packedKHR_sheen(): PackedTexture {
        return this.#packedKHR_sheen;
    }

    // get packedKHR_transmission(): PackedTexture {
    // 	return this.#packedKHR_transmission;
    // }
    /**
     * [KO] Diffuse Transmission 패킹 텍스처 반환
     * [EN] Returns packed texture for Diffuse Transmission
     */
    get packedKHR_diffuse_transmission(): PackedTexture {
        return this.#packedKHR_diffuse_transmission;
    }

    // get packedKHR_clearcoatTexture(): PackedTexture {
    // 	return this.#packedKHR_clearcoatTexture;
    // }
    /**
     * [KO] ORM(Occlusion, Roughness, Metallic) 텍스처 패킹 설정
     * [EN] Setup ORM (Occlusion, Roughness, Metallic) texture packing
     */
    async setupPackORMTexture() {
        if(!(this.occlusionTexture || this.metallicRoughnessTexture)){
            return
        }
        if(!this.#packedORMTexture){
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
     * [KO] Clearcoat 및 Transmission 텍스처 패킹 설정
     * [EN] Setup Clearcoat and Transmission texture packing
     */
    async setupPackedKHR_clearcoatTexture_transmission() {
        // if(!this.useKHR_materials_clearcoat && !this.useKHR_materials_transmission){
        //     return
        // }
        if(!this.#packedKHR_clearcoatTexture_transmission){
            this.#packedKHR_clearcoatTexture_transmission = new PackedTexture(this.redGPUContext)
        }
        // Clearcoat + Transmission을 하나의 텍스처로 패킹
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
        // 최종 크기는 두 그룹 중 큰 크기로 통일
        const finalWidth = Math.max(clearcoatWidth, transmissionWidth);
        const finalHeight = Math.max(clearcoatHeight, transmissionHeight);
        // 하나의 텍스처에 4개 채널 모두 패킹
        await this.#packedKHR_clearcoatTexture_transmission.packing(
            {
                r: this.KHR_clearcoatTexture?.gpuTexture,           // Red: Clearcoat
                g: this.KHR_clearcoatRoughnessTexture?.gpuTexture,  // Green: Clearcoat Roughness
                b: this.KHR_transmissionTexture?.gpuTexture,        // Blue: Transmission
                a: this.KHR_thicknessTexture?.gpuTexture,          // Alpha: Thickness
            },
            finalWidth,
            finalHeight,
            'packedKHR_clearcoatTexture_transmission',
            {
                b: 'r', a: 'g'
            }
        )
    }

    // async setupPackedKHR_clearcoatTexture() {
    // 	const width = Math.max(
    // 		this.KHR_clearcoatTexture?.gpuTexture?.width || 1,
    // 		this.KHR_clearcoatRoughnessTexture?.gpuTexture?.width || 1
    // 	);
    // 	const height = Math.max(
    // 		this.KHR_clearcoatTexture?.gpuTexture?.height || 1,
    // 		this.KHR_clearcoatRoughnessTexture?.gpuTexture?.height || 1
    // 	);
    // 	await this.#packedKHR_clearcoatTexture.packing(
    // 		{
    // 			r: this.KHR_clearcoatTexture?.gpuTexture,
    // 			g: this.KHR_clearcoatRoughnessTexture?.gpuTexture,
    // 		},
    // 		width,
    // 		height,
    // 		'packedKHR_clearcoatTexture'
    // 	)
    // }
    //
    // async setupPackedKHR_transmission() {
    // 	const width = Math.max(
    // 		this.KHR_transmissionTexture?.gpuTexture?.width || 1,
    // 		this.KHR_thicknessTexture?.gpuTexture?.width || 1
    // 	);
    // 	const height = Math.max(
    // 		this.KHR_transmissionTexture?.gpuTexture?.height || 1,
    // 		this.KHR_thicknessTexture?.gpuTexture?.height || 1
    // 	);
    // 	await this.#packedKHR_transmission.packing(
    // 		{
    // 			r: this.KHR_transmissionTexture?.gpuTexture,
    // 			g: this.KHR_thicknessTexture?.gpuTexture,
    // 		},
    // 		width,
    // 		height,
    // 		'packedKHR_transmission'
    // 	)
    // }
    /**
     * [KO] Diffuse Transmission 텍스처 패킹 설정
     * [EN] Setup Diffuse Transmission texture packing
     */
    async setupPackedKHR_diffuse_transmission() {
        if(!(this.KHR_diffuseTransmissionColorTexture || this.KHR_diffuseTransmissionTexture)){
            return
        }
        if(!this.#packedKHR_diffuse_transmission){
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
     * [KO] Sheen 텍스처 패킹 설정
     * [EN] Setup Sheen texture packing
     */
    async setupPackedKHR_sheen() {
        if(!(this.KHR_sheenColorTexture || this.KHR_sheenRoughnessTexture)){
            return
        }
        if(!this.#packedKHR_sheen){
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
     * [KO] Iridescence 텍스처 패킹 설정
     * [EN] Setup Iridescence texture packing
     */
    async setupPackedKHR_iridescence() {
        if(!(this.KHR_iridescenceTexture || this.KHR_iridescenceThicknessTexture)){
            return
        }
        if(!this.#packedKHR_iridescence){
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

DefineForFragment.defineByPreset(PBRMaterial, [
    DefineForFragment.PRESET_POSITIVE_NUMBER.EMISSIVE_STRENGTH,
    DefineForFragment.PRESET_POSITIVE_NUMBER.NORMAL_SCALE,
]);
const defineTexture = (textureList: string[], useSampler: boolean) => {
    textureList?.forEach(key => {
        DefineForFragment.defineBoolean(PBRMaterial, [
            `use${key.charAt(0).toUpperCase()}${key.substring(1)}`
        ])
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
        if (useSampler) {
            DefineForFragment.defineSampler(PBRMaterial, [
                `${key}Sampler`,
            ])
        }
    })
}
const extensionDefine = (defineList) => {
    defineList.forEach(v => {
        const {extensionName, textureList, useSampler} = v;
        const {positiveNumberList, vec3List, vec4List} = v;
        if (extensionName) DefineForFragment.defineBoolean(PBRMaterial, [`use${extensionName}`])
        defineTexture(textureList, !useSampler)
        positiveNumberList?.forEach(v => {
            DefineForFragment.definePositiveNumber(PBRMaterial, [
                v
            ])
        })
        vec3List?.forEach(v => {
            DefineForFragment.defineVec3(PBRMaterial, [
                v
            ])
        })
        vec4List?.forEach(v => {
            DefineForFragment.defineVec4(PBRMaterial, [
                v
            ])
        })
    })
}
extensionDefine(EXTENSION_LIST)
DefineForFragment.definePositiveNumber(PBRMaterial, [
    ['cutOff', 0],
    ['KHR_materials_ior', 1.5],
    ['KHR_dispersion', 0],
]);
DefineForFragment.defineUint(PBRMaterial, [
    'alphaBlend',
])
DefineForFragment.defineBoolean(PBRMaterial, [
    'doubleSided',
    'useCutOff',
    'useVertexColor',
    'useVertexTangent',
    //
    'useKHR_materials_unlit',
    //
    ['useSSR', true]
])
Object.freeze(PBRMaterial)
export default PBRMaterial