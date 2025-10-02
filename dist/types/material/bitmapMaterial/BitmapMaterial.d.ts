import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
/**
 * 비트맵 텍스처 기반 머티리얼의 공통 속성 인터페이스
 */
interface BitmapMaterial {
    /**
     * 머티리얼에 적용할 비트맵 텍스처
     */
    diffuseTexture: BitmapTexture;
    /**
     * 비트맵 텍스처 샘플러
     */
    diffuseTextureSampler: Sampler;
}
/**
 * 비트맵 텍스처 기반의 머티리얼 클래스입니다.
 *
 * BitmapTexture와 Sampler를 통해 다양한 텍스처 기반 렌더링 효과를 구현할 수 있습니다.
 *
 * @example
 * ```javascript
 * const sourceTexture = new RedGPU.Resource.BitmapTexture(
 *    redGPUContext,
 *    '/RedGPU/examples/assets/github.png'
 * );
 * const material = new RedGPU.Material.BitmapMaterial(redGPUContext, sourceTexture);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/material/bitmapMaterial/"></iframe>
 * @extends ABitmapBaseMaterial
 * @category Material
 */
declare class BitmapMaterial extends ABitmapBaseMaterial {
    /**
     * 파이프라인 dirty 상태 플래그
     */
    dirtyPipeline: boolean;
    /**
     * BitmapMaterial 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param diffuseTexture - 적용할 비트맵 텍스처
     * @param name - 머티리얼 이름(옵션)
     */
    constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string);
}
export default BitmapMaterial;
