import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import PackedTexture from "../../resources/texture/packedTexture/PackedTexture";
import AUVTransformBaseMaterial from "../core/AUVTransformBaseMaterial";
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
    useVertexColor: boolean;
    /**
     * [KO] 알파 컷오프(MASK) 사용 여부
     * [EN] Whether to use alpha cutoff (MASK)
     */
    useCutOff: boolean;
    /**
     * [KO] 알파 컷오프 임계값
     * [EN] Alpha cutoff threshold value
     */
    cutOff: number;
    /**
     * [KO] 알파 블렌딩 모드 값
     * [EN] Alpha blending mode value
     */
    alphaBlend: number;
    /**
     * [KO] 2패스 투명 렌더링 사용 여부
     * [EN] Whether to use 2-pass transparent rendering
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
     * [KO] 베이스 컬러 팩터 `[r, g, b, a]`
     * [EN] Base color factor `[r, g, b, a]`
     */
    baseColorFactor: number[];
    /**
     * [KO] 베이스 컬러 텍스처 UV 채널 인덱스
     * [EN] Base color texture UV channel index
     */
    baseColorTexture_texCoord_index: number;
    /**
     * [KO] `KHR_materials_clearcoat` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_clearcoat` extension
     */
    useKHR_materials_clearcoat: boolean;
    /**
     * [KO] 클리어코트 노멀 맵 스케일
     * [EN] Clearcoat normal map scale
     */
    KHR_clearcoatNormalScale: number;
    /**
     * [KO] 클리어코트 강도 팩터
     * [EN] Clearcoat intensity factor
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
     * [KO] 클리어코트 텍스처 UV 채널 인덱스
     * [EN] Clearcoat texture UV channel index
     */
    KHR_clearcoatTexture_texCoord_index: number;
    /**
     * [KO] 클리어코트 노멀 텍스처 UV 채널 인덱스
     * [EN] Clearcoat normal texture UV channel index
     */
    KHR_clearcoatNormalTexture_texCoord_index: number;
    /**
     * [KO] 클리어코트 거칠기 텍스처 UV 채널 인덱스
     * [EN] Clearcoat roughness texture UV channel index
     */
    KHR_clearcoatRoughnessTexture_texCoord_index: number;
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
    KHR_anisotropyTexture: BitmapTexture;
    /**
     * [KO] 이방성 텍스처 샘플러
     * [EN] Anisotropy texture sampler
     */
    KHR_anisotropyTextureSampler: Sampler;
    /**
     * [KO] 이방성 텍스처 UV 채널 인덱스
     * [EN] Anisotropy texture UV channel index
     */
    KHR_anisotropyTexture_texCoord_index: number;
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
    KHR_transmissionTexture: BitmapTexture;
    /**
     * [KO] 투과 텍스처 샘플러
     * [EN] Transmission texture sampler
     */
    KHR_transmissionTextureSampler: Sampler;
    /**
     * [KO] 투과 텍스처 UV 채널 인덱스
     * [EN] Transmission texture UV channel index
     */
    KHR_transmissionTexture_texCoord_index: number;
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
    KHR_diffuseTransmissionTexture: BitmapTexture;
    /**
     * [KO] 확산 투과 텍스처 샘플러
     * [EN] Diffuse transmission texture sampler
     */
    KHR_diffuseTransmissionTextureSampler: Sampler;
    /**
     * [KO] 확산 투과 텍스처 UV 채널 인덱스
     * [EN] Diffuse transmission texture UV channel index
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
     * [KO] 확산 투과 컬러 텍스처 UV 채널 인덱스
     * [EN] Diffuse transmission color texture UV channel index
     */
    KHR_diffuseTransmissionColorTexture_texCoord_index: number;
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
    KHR_thicknessTexture: BitmapTexture;
    /**
     * [KO] 볼륨 두께 텍스처 샘플러
     * [EN] Volume thickness texture sampler
     */
    KHR_thicknessTextureSampler: Sampler;
    /**
     * [KO] 볼륨 두께 텍스처 UV 채널 인덱스
     * [EN] Volume thickness texture UV channel index
     */
    KHR_thicknessTexture_texCoord_index: number;
    /**
     * [KO] `KHR_materials_sheen` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_sheen` extension
     */
    useKHR_materials_sheen: boolean;
    /**
     * [KO] 광택(Sheen) 컬러 팩터 `[r, g, b]`
     * [EN] Sheen color factor `[r, g, b]`
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
     * [KO] `KHR_materials_specular` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_specular` extension
     */
    useKHR_materials_specular: boolean;
    /**
     * [KO] 스펙큘러 반사 강도 팩터
     * [EN] Specular reflection strength factor
     */
    KHR_specularFactor: number;
    /**
     * [KO] 스펙큘러 컬러 팩터 `[r, g, b]`
     * [EN] Specular color factor `[r, g, b]`
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
     * [KO] `KHR_materials_iridescence` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_iridescence` extension
     */
    useKHR_materials_iridescence: boolean;
    /**
     * [KO] 무지개빛(Iridescence) 강도 팩터
     * [EN] Iridescence intensity factor
     */
    KHR_iridescenceFactor: number;
    /**
     * [KO] 무지개빛 박막 굴절률 (IOR)
     * [EN] Iridescence thin-film index of refraction (IOR)
     */
    KHR_iridescenceIor: number;
    /**
     * [KO] 무지개빛 박막 최소 두께 (nm)
     * [EN] Iridescence thin-film minimum thickness (nm)
     */
    KHR_iridescenceThicknessMinimum: number;
    /**
     * [KO] 무지개빛 박막 최대 두께 (nm)
     * [EN] Iridescence thin-film maximum thickness (nm)
     */
    KHR_iridescenceThicknessMaximum: number;
    /**
     * [KO] 무지개빛 강도 텍스처
     * [EN] Iridescence intensity texture
     */
    KHR_iridescenceTexture: BitmapTexture;
    /**
     * [KO] 무지개빛 강도 텍스처 샘플러
     * [EN] Iridescence intensity texture sampler
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
     * [KO] `KHR_materials_unlit` 확장 사용 여부
     * [EN] Whether to use the `KHR_materials_unlit` extension
     */
    useKHR_materials_unlit: boolean;
    /**
     * [KO] `KHR_materials_ior` 굴절률(IOR) 값 (기본값: `1.5`)
     * [EN] `KHR_materials_ior` index of refraction (IOR) value (default: `1.5`)
     */
    KHR_materials_ior: number;
    /**
     * [KO] 노멀 맵 스케일
     * [EN] Normal map scale
     */
    normalScale: number;
    /**
     * [KO] 노멀 텍스처 사용 여부
     * [EN] Whether to use normal texture
     */
    useNormalTexture: boolean;
    /**
     * [KO] 노멀 맵 텍스처
     * [EN] Normal map texture
     */
    normalTexture: BitmapTexture;
    /**
     * [KO] 노멀 맵 텍스처 샘플러
     * [EN] Normal map texture sampler
     */
    normalTextureSampler: Sampler;
    /**
     * [KO] 노멀 맵 텍스처 UV 채널 인덱스
     * [EN] Normal map texture UV channel index
     */
    normalTexture_texCoord_index: number;
    /**
     * [KO] 발광(Emissive) 텍스처
     * [EN] Emissive texture
     */
    emissiveTexture: BitmapTexture;
    /**
     * [KO] 발광 텍스처 샘플러
     * [EN] Emissive texture sampler
     */
    emissiveTextureSampler: Sampler;
    /**
     * [KO] 발광 텍스처 UV 채널 인덱스
     * [EN] Emissive texture UV channel index
     */
    emissiveTexture_texCoord_index: number;
    /**
     * [KO] 발광 컬러 팩터 `[r, g, b]`
     * [EN] Emissive color factor `[r, g, b]`
     */
    emissiveFactor: number[];
    /**
     * [KO] 발광 강도 배율 (`KHR_materials_emissive_strength`)
     * [EN] Emissive strength multiplier (`KHR_materials_emissive_strength`)
     */
    emissiveStrength: number[];
    /**
     * [KO] 오클루전(AO) 텍스처
     * [EN] Occlusion (AO) texture
     */
    occlusionTexture: BitmapTexture;
    /**
     * [KO] 오클루전 텍스처 샘플러
     * [EN] Occlusion texture sampler
     */
    occlusionTextureSampler: Sampler;
    /**
     * [KO] 오클루전 텍스처 UV 채널 인덱스
     * [EN] Occlusion texture UV channel index
     */
    occlusionTexture_texCoord_index: number;
    /**
     * [KO] 오클루전 적용 강도
     * [EN] Occlusion application strength
     */
    occlusionStrength: number;
    /**
     * [KO] 금속성-거칠기(Metallic-Roughness) 텍스처
     * [EN] Metallic-Roughness texture
     */
    metallicRoughnessTexture: BitmapTexture;
    /**
     * [KO] 금속성-거칠기 텍스처 샘플러
     * [EN] Metallic-Roughness texture sampler
     */
    metallicRoughnessTextureSampler: Sampler;
    /**
     * [KO] 금속성-거칠기 텍스처 UV 채널 인덱스
     * [EN] Metallic-Roughness texture UV channel index
     */
    metallicRoughnessTexture_texCoord_index: number;
    /**
     * [KO] 금속성(Metallic) 팩터 (0.0 ~ 1.0)
     * [EN] Metallic factor (0.0 to 1.0)
     */
    metallicFactor: number;
    /**
     * [KO] 거칠기(Roughness) 팩터 (0.0 ~ 1.0)
     * [EN] Roughness factor (0.0 to 1.0)
     */
    roughnessFactor: number;
    /**
     * [KO] 양면 렌더링 여부
     * [EN] Whether double-sided rendering is enabled
     */
    doubleSided: boolean;
    /**
     * [KO] 식생(Two-Sided Foliage) 셰이딩 모델 활성화 여부
     * [EN] Whether Two-Sided Foliage shading model is enabled
     */
    isFoliage: boolean;
    /**
     * [KO] `KHR_materials_dispersion` 색분산 강도
     * [EN] `KHR_materials_dispersion` dispersion strength
     */
    KHR_dispersion: boolean;
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
declare class PBRMaterial extends AUVTransformBaseMaterial {
    #private;
    /**
     * [KO] PBRMaterial 인스턴스를 생성합니다.
     * [EN] Creates a PBRMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 클리어코트 및 투과(Transmission)/두께 채널이 결합된 패킹 텍스처를 반환합니다.
     * [EN] Returns the packed texture combining clearcoat and transmission/thickness channels.
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedKHR_clearcoatTexture_transmission(): PackedTexture;
    /**
     * [KO] 무지개빛(Iridescence) 및 두께 채널이 결합된 패킹 텍스처를 반환합니다.
     * [EN] Returns the packed texture combining iridescence and thickness channels.
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedKHR_iridescence(): PackedTexture;
    /**
     * [KO] 오클루전(R), 거칠기(G), 금속성(B)이 결합된 ORM 패킹 텍스처를 반환합니다.
     * [EN] Returns the ORM packed texture combining occlusion (R), roughness (G), and metallic (B).
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedORMTexture(): PackedTexture;
    /**
     * [KO] 광택(Sheen) 컬러 및 거칠기 채널이 결합된 패킹 텍스처를 반환합니다.
     * [EN] Returns the packed texture combining sheen color and roughness channels.
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedKHR_sheen(): PackedTexture;
    /**
     * [KO] 확산 투과(Diffuse Transmission) 컬러 및 팩터 채널이 결합된 패킹 텍스처를 반환합니다.
     * [EN] Returns the packed texture combining diffuse transmission color and factor channels.
     *
     * @returns
     * [KO] PackedTexture 인스턴스
     * [EN] PackedTexture instance
     */
    get packedKHR_diffuse_transmission(): PackedTexture;
    /**
     * [KO] 오클루전과 금속성-거칠기 텍스처를 단일 ORM 패킹 텍스처로 병합합니다.
     * [EN] Merges occlusion and metallic-roughness textures into a single ORM packed texture.
     */
    setupPackORMTexture(): Promise<void>;
    /**
     * [KO] 클리어코트, 클리어코트 거칠기, 투과, 볼륨 두께 텍스처를 단일 4채널 텍스처로 패킹합니다.
     * [EN] Packs clearcoat, clearcoat roughness, transmission, and volume thickness textures into a single 4-channel texture.
     */
    setupPackedKHR_clearcoatTexture_transmission(): Promise<void>;
    /**
     * [KO] 확산 투과 컬러 및 확산 투과 팩터 텍스처를 단일 패킹 텍스처로 병합합니다.
     * [EN] Merges diffuse transmission color and diffuse transmission factor textures into a single packed texture.
     */
    setupPackedKHR_diffuse_transmission(): Promise<void>;
    /**
     * [KO] 광택(Sheen) 컬러 및 광택 거칠기 텍스처를 단일 패킹 텍스처로 병합합니다.
     * [EN] Merges sheen color and sheen roughness textures into a single packed texture.
     */
    setupPackedKHR_sheen(): Promise<void>;
    /**
     * [KO] 무지개빛(Iridescence) 및 무지개빛 두께 텍스처를 단일 패킹 텍스처로 병합합니다.
     * [EN] Merges iridescence and iridescence thickness textures into a single packed texture.
     */
    setupPackedKHR_iridescence(): Promise<void>;
}
export default PBRMaterial;
