import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import AUVTransformBaseMaterial from "../core/AUVTransformBaseMaterial";
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
    emissiveStrength: number;
    /**
     * [KO] 스펙큘러 색상(RGB)
     * [EN] Specular color (RGB)
     */
    specularColor: ColorRGB;
    /**
     * [KO] 스펙큘러 강도
     * [EN] Specular strength
     */
    specularStrength: number;
    /**
     * [KO] 알파(투명도) 텍스처
     * [EN] Alpha (transparency) texture
     */
    alphaTexture: BitmapTexture;
    /**
     * [KO] 알파 텍스처 샘플러
     * [EN] Alpha texture sampler
     */
    alphaTextureSampler: Sampler;
    /**
     * [KO] 디퓨즈 텍스처
     * [EN] Diffuse texture
     */
    diffuseTexture: BitmapTexture;
    /**
     * [KO] 디퓨즈 텍스처 샘플러
     * [EN] Diffuse texture sampler
     */
    diffuseTextureSampler: Sampler;
    /**
     * [KO] 스펙큘러 텍스처
     * [EN] Specular texture
     */
    specularTexture: BitmapTexture;
    /**
     * [KO] 스펙큘러 텍스처 샘플러
     * [EN] Specular texture sampler
     */
    specularTextureSampler: Sampler;
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
     * [KO] AO(ambient occlusion) 텍스처
     * [EN] AO (ambient occlusion) texture
     */
    aoTexture: BitmapTexture;
    /**
     * [KO] AO 텍스처 샘플러
     * [EN] AO texture sampler
     */
    aoTextureSampler: Sampler;
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
     * [KO] 노멀 맵 스케일
     * [EN] Normal map scale
     */
    normalScale: number;
    /**
     * [KO] 금속도
     * [EN] Metallic
     */
    metallic: number;
    /**
     * [KO] 거칠기
     * [EN] Roughness
     */
    roughness: number;
    /**
     * [KO] SSR(스크린 스페이스 리플렉션) 사용 여부
     * [EN] Whether to use SSR (Screen Space Reflection)
     */
    useSSR: number;
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
declare class PhongMaterial extends AUVTransformBaseMaterial {
    #private;
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
    constructor(redGPUContext: RedGPUContext, color?: string, name?: string);
    /**
     * [KO] 디스플레이스먼트(변위) 스케일을 반환합니다.
     * [EN] Returns the displacement scale.
     * @returns
     * [KO] 스케일 값
     * [EN] Scale value
     */
    get displacementScale(): number;
    /**
     * [KO] 디스플레이스먼트(변위) 스케일을 설정합니다.
     * [EN] Sets the displacement scale.
     * @param value -
     * [KO] 스케일 값
     * [EN] Scale value
     */
    set displacementScale(value: number);
    /**
     * [KO] 디스플레이스먼트(변위) 텍스처를 반환합니다.
     * [EN] Returns the displacement texture.
     * @returns
     * [KO] BitmapTexture
     * [EN] BitmapTexture
     */
    get displacementTexture(): BitmapTexture;
    /**
     * [KO] 디스플레이스먼트(변위) 텍스처를 설정하고 파이프라인을 갱신합니다.
     * [EN] Sets the displacement texture and updates the pipeline.
     * @param value -
     * [KO] BitmapTexture
     * [EN] BitmapTexture
     */
    set displacementTexture(value: BitmapTexture);
}
export default PhongMaterial;
