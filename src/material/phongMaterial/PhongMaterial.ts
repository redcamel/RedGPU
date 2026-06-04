import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from './fragment.wgsl'
import AUVTransformBaseMaterial from "../core/AUVTransformBaseMaterial";
import DefineGPUProperty from "../../defineProperty/DefineGPUProperty";

const SHADER_INFO = parseWGSL('PHONG_MATERIAL', fragmentModuleSource)

/**
 * [KO] PhongMaterial의 공통 속성 인터페이스
 * [EN] Common property interface for PhongMaterial
 */
interface PhongMaterial {
    /**
     * [KO] 머티리얼의 기본 색상(RGB)
     * [EN] Base color of the material (RGB)
     */
    color: ColorRGB;
    /**
     * [KO] 발광 색상(RGB)
     * [EN] Emissive color (RGB)
     */
    emissiveColor: ColorRGB;
    /**
     * [KO] 발광 강도
     * [EN] Emissive strength
     */
    emissiveStrength: number
    /**
     * [KO] 스펙큘러 색상(RGB)
     * [EN] Specular color (RGB)
     */
    specularColor: ColorRGB;
    /**
     * [KO] 스펙큘러 강도
     * [EN] Specular strength
     */
    specularStrength: number
    /**
     * [KO] 알파(투명도) 텍스처
     * [EN] Alpha (transparency) texture
     */
    alphaTexture: BitmapTexture
    /**
     * [KO] 알파 텍스처 샘플러
     * [EN] Alpha texture sampler
     */
    alphaTextureSampler: Sampler
    /**
     * [KO] 디퓨즈 텍스처
     * [EN] Diffuse texture
     */
    diffuseTexture: BitmapTexture
    /**
     * [KO] 디퓨즈 텍스처 샘플러
     * [EN] Diffuse texture sampler
     */
    diffuseTextureSampler: Sampler
    /**
     * [KO] 스펙큘러 텍스처
     * [EN] Specular texture
     */
    specularTexture: BitmapTexture
    /**
     * [KO] 스펙큘러 텍스처 샘플러
     * [EN] Specular texture sampler
     */
    specularTextureSampler: Sampler
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
     * [KO] AO(ambient occlusion) 텍스처
     * [EN] AO (ambient occlusion) texture
     */
    aoTexture: BitmapTexture
    /**
     * [KO] AO 텍스처 샘플러
     * [EN] AO texture sampler
     */
    aoTextureSampler: Sampler
    /**
     * [KO] 노멀 맵 텍스처
     * [EN] Normal map texture
     */
    normalTexture: BitmapTexture
    /**
     * [KO] 노멀 맵 텍스처 샘플러
     * [EN] Normal map texture sampler
     */
    normalTextureSampler: Sampler
    /**
     * [KO] 노멀 맵 스케일
     * [EN] Normal map scale
     */
    normalScale: number
    /**
     * [KO] 금속도
     * [EN] Metallic
     */
    metallic: number
    /**
     * [KO] 거칠기
     * [EN] Roughness
     */
    roughness: number
    /**
     * [KO] SSR(스크린 스페이스 리플렉션) 사용 여부
     * [EN] Whether to use SSR (Screen Space Reflection)
     */
    useSSR: number;
    displacementScale: number;
    displacementTexture: BitmapTexture
}

/**
 * [KO] Phong 라이팅 기반의 다양한 텍스처/파라미터를 지원하는 머티리얼 클래스입니다.
 * [EN] Material class supporting various textures/parameters based on Phong lighting.
 *
 * [KO] 디퓨즈, 스펙큘러, 노멀, AO, 알파, 발광 등 다양한 텍스처와 샘플러, 파라미터를 통해 사실적인 라이팅 효과를 구현할 수 있습니다.
 * [EN] Realistic lighting effects can be implemented through various textures, samplers, and parameters such as diffuse, specular, normal, AO, alpha, and emissive.
 * * ### Example
 * ```typescript
 * const sourceTexture = new RedGPU.Resource.BitmapTexture(
 *    redGPUContext,
 *    '/RedGPU/examples/assets/github.png'
 * );
 * const material = new RedGPU.Material.PhongMaterial(redGPUContext);
 * material.diffuseTexture = sourceTexture;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/material/phongMaterial/"></iframe>
 *
 * @see [PhongMaterial Texture Combination example](/RedGPU/examples/3d/material/phongMaterialTextures/)
 *
 * @category Material
 */
class PhongMaterial extends AUVTransformBaseMaterial {


    /**
     * [KO] PhongMaterial 생성자
     * [EN] PhongMaterial constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param color -
     * [KO] 기본 색상 (HEX 문자열, 기본값: '#fff')
     * [EN] Base color (HEX string, default: '#fff')
     * @param name -
     * [KO] 머티리얼 이름 (옵션)
     * [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, color: string = '#fff', name?: string) {
        super(
            redGPUContext,
            'PHONG_MATERIAL',
            SHADER_INFO,
            2
        )
        if (name) this.name = name
        this.initGPURenderInfos()
        this.color.setColorByHEX(color)
        this.emissiveColor.setColorByHEX(this.emissiveColor.hex)
        this.specularColor.setColorByHEX(this.specularColor.hex)
    }


}

DefineGPUProperty.defineSampler(
    PhongMaterial,
    [
        {key: 'alphaTextureSampler'},
        {key: 'aoTextureSampler'},
        {key: 'diffuseTextureSampler'},
        {key: 'emissiveTextureSampler'},
        {key: 'environmentTextureSampler'},
        {key: 'normalTextureSampler'},
        {key: 'specularTextureSampler'}
    ])
DefineGPUProperty.definePositiveNumber(
    PhongMaterial,
    [
        {key: 'aoStrength', value: 1},
        {key: 'specularStrength', value: 1},
        {key: 'emissiveStrength', value: 1},
        {key: 'shininess', value: 32},
        {key: 'normalScale', value: 1},
        {key: 'displacementScale', value: 1}
    ]
)
DefineGPUProperty.defineColorRGB(PhongMaterial, [
    {key: 'color'},
    {key: 'emissiveColor', value: '#000000'},
    {key: 'specularColor', value: '#ffffff'}
])
DefineGPUProperty.defineTexture(PhongMaterial, [
    {key: 'alphaTexture'},
    {key: 'aoTexture'},
    {key: 'diffuseTexture'},
    {key: 'emissiveTexture'},
    {key: 'environmentTexture'},
    {key: 'normalTexture'},
    {key: 'specularTexture'},
    {key: 'displacementTexture'},
])
DefineGPUProperty.defineBoolean(PhongMaterial, [
    {key: 'useSSR', value: false}
])
DefineGPUProperty.definePositiveNumber(PhongMaterial, [
    {key: 'metallic', value: 0, min: 0, max: 1},
    {key: 'roughness', value: 0, min: 0, max: 1}
])
Object.freeze(PhongMaterial)
export default PhongMaterial
