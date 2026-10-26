import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import AUVTransformBaseMaterial from "../core/AUVTransformBaseMaterial";
/**
 * [KO] PhongMaterial의 동적 색상, 텍스처, 샘플러 및 라이팅 파라미터 속성 인터페이스입니다.
 * [EN] Dynamic color, texture, sampler, and lighting parameter property interface for PhongMaterial.
 * @category Material
 */
interface PhongMaterial {
    /**
     * [KO] 머티리얼의 기본 디퓨즈 색상 (ColorRGB)
     * [EN] Base diffuse color of the material (ColorRGB)
     */
    color: ColorRGB;
    /**
     * [KO] 자체 발광(Emissive) 색상 (ColorRGB)
     * [EN] Self-emissive color (ColorRGB)
     */
    emissiveColor: ColorRGB;
    /**
     * [KO] 발광 강도 (기본값: `1`)
     * [EN] Emissive strength (default: `1`)
     */
    emissiveStrength: number;
    /**
     * [KO] 스펙큘러 반사 색상 (ColorRGB)
     * [EN] Specular reflection color (ColorRGB)
     */
    specularColor: ColorRGB;
    /**
     * [KO] 스펙큘러 반사 강도 (기본값: `1`)
     * [EN] Specular reflection strength (default: `1`)
     */
    specularStrength: number;
    /**
     * [KO] 알파(불투명도) 맵 텍스처
     * [EN] Alpha (opacity) map texture
     */
    alphaTexture: BitmapTexture;
    /**
     * [KO] 알파 텍스처 샘플러
     * [EN] Alpha texture sampler
     */
    alphaTextureSampler: Sampler;
    /**
     * [KO] 디퓨즈 맵 텍스처
     * [EN] Diffuse map texture
     */
    diffuseTexture: BitmapTexture;
    /**
     * [KO] 디퓨즈 텍스처 샘플러
     * [EN] Diffuse texture sampler
     */
    diffuseTextureSampler: Sampler;
    /**
     * [KO] 스펙큘러 맵 텍스처
     * [EN] Specular map texture
     */
    specularTexture: BitmapTexture;
    /**
     * [KO] 스펙큘러 텍스처 샘플러
     * [EN] Specular texture sampler
     */
    specularTextureSampler: Sampler;
    /**
     * [KO] 발광(Emissive) 맵 텍스처
     * [EN] Emissive map texture
     */
    emissiveTexture: BitmapTexture;
    /**
     * [KO] 발광 텍스처 샘플러
     * [EN] Emissive texture sampler
     */
    emissiveTextureSampler: Sampler;
    /**
     * [KO] 앰비언트 오클루전(AO) 맵 텍스처
     * [EN] Ambient occlusion (AO) map texture
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
     * [KO] 노멀 맵 강도 스케일 (기본값: `1`)
     * [EN] Normal map intensity scale (default: `1`)
     */
    normalScale: number;
    /**
     * [KO] 금속성 수치 (0.0 ~ 1.0, 기본값: `0`)
     * [EN] Metallic value (0.0 to 1.0, default: `0`)
     */
    metallic: number;
    /**
     * [KO] 거칠기 수치 (0.0 ~ 1.0, 기본값: `0`)
     * [EN] Roughness value (0.0 to 1.0, default: `0`)
     */
    roughness: number;
    /**
     * [KO] 스크린 스페이스 리플렉션(SSR) 사용 여부
     * [EN] Whether to use Screen Space Reflection (SSR)
     */
    useSSR: number;
    /**
     * [KO] 변위(Displacement) 맵 변형 스케일 (기본값: `1`)
     * [EN] Displacement map deformation scale (default: `1`)
     */
    displacementScale: number;
    /**
     * [KO] 변위(Displacement) 맵 텍스처
     * [EN] Displacement map texture
     */
    displacementTexture: BitmapTexture;
}
/**
 * [KO] Phong 라이팅 모델을 기반으로 다양한 텍스처 맵과 표면 반사 파라미터를 지원하는 머티리얼 클래스입니다.
 * [EN] Material class supporting various texture maps and surface reflection parameters based on the Phong lighting model.
 *
 * [KO] 디퓨즈, 스펙큘러, 노멀, AO, 알파, 발광, 변위(Displacement) 텍스처 및 광택도(shininess) 제어를 통해 입체적인 조명 효과를 표현합니다.
 * [EN] Expresses three-dimensional lighting effects through diffuse, specular, normal, AO, alpha, emissive, and displacement textures along with shininess control.
 *
 * ### Example
 * ```typescript
 * const sourceTexture = new RedGPU.Resource.BitmapTexture(
 *     redGPUContext,
 *     '/RedGPU/examples/assets/github.png'
 * );
 * const material = new RedGPU.Material.PhongMaterial(redGPUContext);
 * material.diffuseTexture = sourceTexture;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/material/phongMaterial/" style="width:100%; height:500px;"></iframe>
 *
 * @see [PhongMaterial example](/RedGPU/examples/3d/material/phongMaterial/)
 * @see [PhongMaterial Textures example](/RedGPU/examples/3d/material/phongMaterialTextures/)
 * @see [UV Transform example](/RedGPU/examples/3d/material/uvTransform/)
 * @category Material
 */
declare class PhongMaterial extends AUVTransformBaseMaterial {
    /**
     * [KO] PhongMaterial 인스턴스를 생성합니다.
     * [EN] Creates a PhongMaterial instance.
     *
     * ### Example
     * ```typescript
     * const material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff', 'myPhongMaterial');
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param color -
     * [KO] HEX 형식의 기본 디퓨즈 색상 문자열 (기본값: `'#fff'`)
     * [EN] Base diffuse color string in HEX format (default: `'#fff'`)
     * @param name -
     * [KO] 머티리얼 이름 (선택)
     * [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, color?: string, name?: string);
}
export default PhongMaterial;
