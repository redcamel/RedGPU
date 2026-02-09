import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import PackedTexture from "../../resources/texture/packedTexture/PackedTexture";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
/**
 * [KO] PBRMaterial 속성 인터페이스
 * [EN] PBRMaterial property interface
 */
interface PBRMaterial {
    /**
     * [KO] 버텍스 컬러 사용 여부
     * [EN] Whether to use vertex color
     */
    useVertexColor: boolean;
    /**
     * [KO] 알파 컷오프 사용 여부
     * [EN] Whether to use alpha cutoff
     */
    useCutOff: boolean;
    /**
     * [KO] 알파 컷오프 값
     * [EN] Alpha cutoff value
     */
    cutOff: number;
    /**
     * [KO] 알파 블렌딩 모드
     * [EN] Alpha blending mode
     */
    alphaBlend: number;
    /**
     * [KO] 2패스 렌더링 사용 여부
     * [EN] Whether to use 2-pass rendering
     */
    use2PathRender: boolean;
    /**
     * [KO] 베이스 컬러 텍스처
     * [EN] Base color texture
     */
    baseColorTexture: BitmapTexture;
    /**
     * [KO] 베이스 컬러 텍스처 샘플러
     * [EN] Base color texture sampler
     */
    baseColorTextureSampler: Sampler;
    /**
     * [KO] 베이스 컬러 팩터
     * [EN] Base color factor
     */
    baseColorFactor: number[];
    /**
     * [KO] 베이스 컬러 텍스처 UV 인덱스
     * [EN] Base color texture UV index
     */
    baseColorTexture_texCoord_index: number;
    /**
     * [KO] KHR_materials_clearcoat 확장 사용 여부
     * [EN] Whether to use KHR_materials_clearcoat extension
     */
    useKHR_materials_clearcoat: boolean;
    /**
     * [KO] 클리어코트 노멀 스케일
     * [EN] Clearcoat normal scale
     */
    KHR_clearcoatNormalScale: number;
    /**
     * [KO] 클리어코트 팩터
     * [EN] Clearcoat factor
     */
    KHR_clearcoatFactor: number;
    /**
     * [KO] 클리어코트 거칠기 팩터
     * [EN] Clearcoat roughness factor
     */
    KHR_clearcoatRoughnessFactor: number;
    /**
     * [KO] 클리어코트 텍스처
     * [EN] Clearcoat texture
     */
    KHR_clearcoatTexture: BitmapTexture;
    /**
     * [KO] 클리어코트 노멀 텍스처
     * [EN] Clearcoat normal texture
     */
    KHR_clearcoatNormalTexture: BitmapTexture;
    /**
     * [KO] 클리어코트 거칠기 텍스처
     * [EN] Clearcoat roughness texture
     */
    KHR_clearcoatRoughnessTexture: BitmapTexture;
    /**
     * [KO] 클리어코트 텍스처 샘플러
     * [EN] Clearcoat texture sampler
     */
    KHR_clearcoatTextureSampler: Sampler;
    /**
     * [KO] 클리어코트 노멀 텍스처 샘플러
     * [EN] Clearcoat normal texture sampler
     */
    KHR_clearcoatNormalTextureSampler: Sampler;
    /**
     * [KO] 클리어코트 거칠기 텍스처 샘플러
     * [EN] Clearcoat roughness texture sampler
     */
    KHR_clearcoatRoughnessTextureSampler: Sampler;
    /**
     * [KO] 클리어코트 텍스처 UV 인덱스
     * [EN] Clearcoat texture UV index
     */
    KHR_clearcoatTexture_texCoord_index: number;
    /**
     * [KO] 클리어코트 노멀 텍스처 UV 인덱스
     * [EN] Clearcoat normal texture UV index
     */
    KHR_clearcoatNormalTexture_texCoord_index: number;
    /**
     * [KO] 클리어코트 거칠기 텍스처 UV 인덱스
     * [EN] Clearcoat roughness texture UV index
     */
    KHR_clearcoatRoughnessTexture_texCoord_index: number;
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
    KHR_anisotropyTexture: BitmapTexture;
    /**
     * [KO] 이방성 텍스처 샘플러
     * [EN] Anisotropy texture sampler
     */
    KHR_anisotropyTextureSampler: Sampler;
    /**
     * [KO] 이방성 텍스처 UV 인덱스
     * [EN] Anisotropy texture UV index
     */
    KHR_anisotropyTexture_texCoord_index: number;
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
    KHR_transmissionTexture: BitmapTexture;
    /**
     * [KO] 투과 텍스처 샘플러
     * [EN] Transmission texture sampler
     */
    KHR_transmissionTextureSampler: Sampler;
    /**
     * [KO] 투과 텍스처 UV 인덱스
     * [EN] Transmission texture UV index
     */
    KHR_transmissionTexture_texCoord_index: number;
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
    KHR_diffuseTransmissionTexture: BitmapTexture;
    /**
     * [KO] 확산 투과 텍스처 샘플러
     * [EN] Diffuse transmission texture sampler
     */
    KHR_diffuseTransmissionTextureSampler: Sampler;
    /**
     * [KO] 확산 투과 텍스처 UV 인덱스
     * [EN] Diffuse transmission texture UV index
     */
    KHR_diffuseTransmissionTexture_texCoord_index: number;
    /**
     * [KO] 확산 투과 컬러 텍스처
     * [EN] Diffuse transmission color texture
     */
    KHR_diffuseTransmissionColorTexture: BitmapTexture;
    /**
     * [KO] 확산 투과 컬러 텍스처 샘플러
     * [EN] Diffuse transmission color texture sampler
     */
    KHR_diffuseTransmissionColorTextureSampler: Sampler;
    /**
     * [KO] 확산 투과 컬러 텍스처 UV 인덱스
     * [EN] Diffuse transmission color texture UV index
     */
    KHR_diffuseTransmissionColorTexture_texCoord_index: number;
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
    KHR_thicknessTexture: BitmapTexture;
    /**
     * [KO] 두께 텍스처 샘플러
     * [EN] Thickness texture sampler
     */
    KHR_thicknessTextureSampler: Sampler;
    /**
     * [KO] 두께 텍스처 UV 인덱스
     * [EN] Thickness texture UV index
     */
    KHR_thicknessTexture_texCoord_index: number;
    /**
     * [KO] KHR_materials_sheen 확장 사용 여부
     * [EN] Whether to use KHR_materials_sheen extension
     */
    useKHR_materials_sheen: boolean;
    /**
     * [KO] 광택 컬러 팩터
     * [EN] Sheen color factor
     */
    KHR_sheenColorFactor: [number, number, number];
    /**
     * [KO] 광택 거칠기 팩터
     * [EN] Sheen roughness factor
     */
    KHR_sheenRoughnessFactor: number;
    /**
     * [KO] 광택 컬러 텍스처
     * [EN] Sheen color texture
     */
    KHR_sheenColorTexture: BitmapTexture;
    /**
     * [KO] 광택 컬러 텍스처 샘플러
     * [EN] Sheen color texture sampler
     */
    KHR_sheenColorTextureSampler: Sampler;
    /**
     * [KO] 광택 거칠기 텍스처
     * [EN] Sheen roughness texture
     */
    KHR_sheenRoughnessTexture: BitmapTexture;
    /**
     * [KO] 광택 거칠기 텍스처 샘플러
     * [EN] Sheen roughness texture sampler
     */
    KHR_sheenRoughnessTextureSampler: Sampler;
    /**
     * [KO] KHR_materials_specular 확장 사용 여부
     * [EN] Whether to use KHR_materials_specular extension
     */
    useKHR_materials_specular: boolean;
    /**
     * [KO] 스펙큘러 팩터
     * [EN] Specular factor
     */
    KHR_specularFactor: number;
    /**
     * [KO] 스펙큘러 컬러 팩터
     * [EN] Specular color factor
     */
    KHR_specularColorFactor: [number, number, number];
    /**
     * [KO] 스펙큘러 텍스처
     * [EN] Specular texture
     */
    KHR_specularTexture: BitmapTexture;
    /**
     * [KO] 스펙큘러 텍스처 샘플러
     * [EN] Specular texture sampler
     */
    KHR_specularTextureSampler: Sampler;
    /**
     * [KO] 스펙큘러 컬러 텍스처
     * [EN] Specular color texture
     */
    KHR_specularColorTexture: BitmapTexture;
    /**
     * [KO] 스펙큘러 컬러 텍스처 샘플러
     * [EN] Specular color texture sampler
     */
    KHR_specularColorTextureSampler: Sampler;
    /**
     * [KO] KHR_materials_iridescence 확장 사용 여부
     * [EN] Whether to use KHR_materials_iridescence extension
     */
    useKHR_materials_iridescence: boolean;
    /**
     * [KO] 무지개빛 팩터
     * [EN] Iridescence factor
     */
    KHR_iridescenceFactor: number;
    /**
     * [KO] 무지개빛 IOR
     * [EN] Iridescence IOR
     */
    KHR_iridescenceIor: number;
    /**
     * [KO] 무지개빛 최소 두께
     * [EN] Iridescence thickness minimum
     */
    KHR_iridescenceThicknessMinimum: number;
    /**
     * [KO] 무지개빛 최대 두께
     * [EN] Iridescence thickness maximum
     */
    KHR_iridescenceThicknessMaximum: number;
    /**
     * [KO] 무지개빛 텍스처
     * [EN] Iridescence texture
     */
    KHR_iridescenceTexture: BitmapTexture;
    /**
     * [KO] 무지개빛 텍스처 샘플러
     * [EN] Iridescence texture sampler
     */
    KHR_iridescenceTextureSampler: Sampler;
    /**
     * [KO] 무지개빛 두께 텍스처
     * [EN] Iridescence thickness texture
     */
    KHR_iridescenceThicknessTexture: BitmapTexture;
    /**
     * [KO] 무지개빛 두께 텍스처 샘플러
     * [EN] Iridescence thickness texture sampler
     */
    KHR_iridescenceThicknessTextureSampler: Sampler;
    /**
     * [KO] KHR_materials_unlit 확장 사용 여부
     * [EN] Whether to use KHR_materials_unlit extension
     */
    useKHR_materials_unlit: boolean;
    /**
     * [KO] KHR_materials_ior 확장 IOR 값
     * [EN] KHR_materials_ior extension IOR value
     */
    KHR_materials_ior: number;
    /**
     * [KO] 노멀 스케일
     * [EN] Normal scale
     */
    normalScale: number;
    /**
     * [KO] 노멀 텍스처 사용 여부
     * [EN] Whether to use normal texture
     */
    useNormalTexture: boolean;
    /**
     * [KO] 노멀 텍스처
     * [EN] Normal texture
     */
    normalTexture: BitmapTexture;
    /**
     * [KO] 노멀 텍스처 샘플러
     * [EN] Normal texture sampler
     */
    normalTextureSampler: Sampler;
    /**
     * [KO] 노멀 텍스처 UV 인덱스
     * [EN] Normal texture UV index
     */
    normalTexture_texCoord_index: number;
    /**
     * [KO] 발광 텍스처
     * [EN] Emissive texture
     */
    emissiveTexture: BitmapTexture;
    /**
     * [KO] 발광 텍스처 샘플러
     * [EN] Emissive texture sampler
     */
    emissiveTextureSampler: Sampler;
    /**
     * [KO] 발광 텍스처 UV 인덱스
     * [EN] Emissive texture UV index
     */
    emissiveTexture_texCoord_index: number;
    /**
     * [KO] 발광 팩터
     * [EN] Emissive factor
     */
    emissiveFactor: number[];
    /**
     * [KO] 발광 강도
     * [EN] Emissive strength
     */
    emissiveStrength: number[];
    /**
     * [KO] 오클루전 텍스처
     * [EN] Occlusion texture
     */
    occlusionTexture: BitmapTexture;
    /**
     * [KO] 오클루전 텍스처 샘플러
     * [EN] Occlusion texture sampler
     */
    occlusionTextureSampler: Sampler;
    /**
     * [KO] 오클루전 텍스처 UV 인덱스
     * [EN] Occlusion texture UV index
     */
    occlusionTexture_texCoord_index: number;
    /**
     * [KO] 오클루전 강도
     * [EN] Occlusion strength
     */
    occlusionStrength: number;
    /**
     * [KO] 금속성-거칠기 텍스처
     * [EN] Metallic-Roughness texture
     */
    metallicRoughnessTexture: BitmapTexture;
    /**
     * [KO] 금속성-거칠기 텍스처 샘플러
     * [EN] Metallic-Roughness texture sampler
     */
    metallicRoughnessTextureSampler: Sampler;
    /**
     * [KO] 금속성-거칠기 텍스처 UV 인덱스
     * [EN] Metallic-Roughness texture UV index
     */
    metallicRoughnessTexture_texCoord_index: number;
    /**
     * [KO] 금속성 팩터
     * [EN] Metallic factor
     */
    metallicFactor: number;
    /**
     * [KO] 거칠기 팩터
     * [EN] Roughness factor
     */
    roughnessFactor: number;
    /**
     * [KO] 양면 렌더링 여부
     * [EN] Whether it is double-sided
     */
    doubleSided: boolean;
    /**
     * [KO] KHR_dispersion 확장 사용 여부
     * [EN] Whether to use KHR_dispersion extension
     */
    KHR_dispersion: boolean;
}
/**
 * [KO] PBR(Physically Based Rendering) 머티리얼 클래스입니다.
 * [EN] PBR (Physically Based Rendering) material class.
 *
 * [KO] ABitmapBaseMaterial을 상속받아 PBR 렌더링을 위한 머티리얼을 생성합니다.
 * [EN] Inherits from ABitmapBaseMaterial to create a material for PBR rendering.
 * @category Material
 */
declare class PBRMaterial extends ABitmapBaseMaterial {
    #private;
    /**
     * [KO] PBRMaterial 생성자
     * [EN] PBRMaterial constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] Clearcoat 및 Transmission 패킹 텍스처 반환
     * [EN] Returns packed texture for Clearcoat and Transmission
     */
    get packedKHR_clearcoatTexture_transmission(): PackedTexture;
    /**
     * [KO] Iridescence 패킹 텍스처 반환
     * [EN] Returns packed texture for Iridescence
     */
    get packedKHR_iridescence(): PackedTexture;
    /**
     * [KO] ORM(Occlusion, Roughness, Metallic) 패킹 텍스처 반환
     * [EN] Returns packed texture for ORM (Occlusion, Roughness, Metallic)
     */
    get packedORMTexture(): PackedTexture;
    /**
     * [KO] Sheen 패킹 텍스처 반환
     * [EN] Returns packed texture for Sheen
     */
    get packedKHR_sheen(): PackedTexture;
    /**
     * [KO] Diffuse Transmission 패킹 텍스처 반환
     * [EN] Returns packed texture for Diffuse Transmission
     */
    get packedKHR_diffuse_transmission(): PackedTexture;
    /**
     * [KO] ORM(Occlusion, Roughness, Metallic) 텍스처 패킹 설정
     * [EN] Setup ORM (Occlusion, Roughness, Metallic) texture packing
     */
    setupPackORMTexture(): Promise<void>;
    /**
     * [KO] Clearcoat 및 Transmission 텍스처 패킹 설정
     * [EN] Setup Clearcoat and Transmission texture packing
     */
    setupPackedKHR_clearcoatTexture_transmission(): Promise<void>;
    /**
     * [KO] Diffuse Transmission 텍스처 패킹 설정
     * [EN] Setup Diffuse Transmission texture packing
     */
    setupPackedKHR_diffuse_transmission(): Promise<void>;
    /**
     * [KO] Sheen 텍스처 패킹 설정
     * [EN] Setup Sheen texture packing
     */
    setupPackedKHR_sheen(): Promise<void>;
    /**
     * [KO] Iridescence 텍스처 패킹 설정
     * [EN] Setup Iridescence texture packing
     */
    setupPackedKHR_iridescence(): Promise<void>;
}
export default PBRMaterial;
