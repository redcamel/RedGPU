import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
/**
 * PhongMaterial의 공통 속성 인터페이스
 */
interface PhongMaterial {
    /** 머티리얼의 기본 색상(RGB) */
    color: ColorRGB;
    /** 발광 색상(RGB) */
    emissiveColor: ColorRGB;
    /** 발광 강도 */
    emissiveStrength: number;
    /** 스펙큘러 색상(RGB) */
    specularColor: ColorRGB;
    /** 스펙큘러 강도 */
    specularStrength: number;
    /** 알파(투명도) 텍스처 */
    alphaTexture: BitmapTexture;
    /** 알파 텍스처 샘플러 */
    alphaTextureSampler: Sampler;
    /** 디퓨즈 텍스처 */
    diffuseTexture: BitmapTexture;
    /** 디퓨즈 텍스처 샘플러 */
    diffuseTextureSampler: Sampler;
    /** 스펙큘러 텍스처 */
    specularTexture: BitmapTexture;
    /** 스펙큘러 텍스처 샘플러 */
    specularTextureSampler: Sampler;
    /** 발광 텍스처 */
    emissiveTexture: BitmapTexture;
    /** 발광 텍스처 샘플러 */
    emissiveTextureSampler: Sampler;
    /** AO(ambient occlusion) 텍스처 */
    aoTexture: BitmapTexture;
    /** AO 텍스처 샘플러 */
    aoTextureSampler: Sampler;
    /** 노멀 맵 텍스처 */
    normalTexture: BitmapTexture;
    /** 노멀 맵 텍스처 샘플러 */
    normalTextureSampler: Sampler;
    /** 노멀 맵 스케일 */
    normalScale: number;
    /** 금속도 */
    metallic: number;
    /** 거칠기 */
    roughness: number;
    /** SSR(스크린 스페이스 리플렉션) 사용 여부 */
    useSSR: number;
}
/**
 * PhongMaterial
 *
 * Phong 라이팅 기반의 다양한 텍스처/파라미터를 지원하는 머티리얼 클래스입니다.
 * 디퓨즈, 스펙큘러, 노멀, AO, 알파, 발광 등 다양한 텍스처와 샘플러, 파라미터를 통해 사실적인 라이팅 효과를 구현할 수 있습니다.
 * @example
 * ```javascript
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
 * 아래는 PhongMaterial의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [PhongMaterial Texture Combination example](/RedGPU/examples/3d/material/phongMaterialTextures/)
 *
 * @extends ABitmapBaseMaterial
 * @category Material
 */
declare class PhongMaterial extends ABitmapBaseMaterial {
    #private;
    /**
     * PhongMaterial 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param color - 기본 색상(HEX 문자열, 기본값: '#fff')
     * @param name - 머티리얼 이름(옵션)
     */
    constructor(redGPUContext: RedGPUContext, color?: string, name?: string);
    /** 디스플레이스먼트(변위) 스케일 반환 */
    get displacementScale(): number;
    /** 디스플레이스먼트(변위) 스케일 설정 */
    set displacementScale(value: number);
    /** 디스플레이스먼트(변위) 텍스처 반환 */
    get displacementTexture(): BitmapTexture;
    /** 디스플레이스먼트(변위) 텍스처 설정 및 파이프라인 갱신 */
    set displacementTexture(value: BitmapTexture);
}
export default PhongMaterial;
