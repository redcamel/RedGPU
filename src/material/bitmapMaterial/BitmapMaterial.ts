import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../defineProperty/DefineForFragment";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from './fragment.wgsl';
import AUVTransformBaseMaterial from "../core/AUVTransformBaseMaterial";

const SHADER_INFO = parseWGSL(fragmentModuleSource)

/**
 * [KO] 비트맵 텍스처 기반의 머티리얼 클래스입니다.
 * [EN] Material class based on bitmap texture.
 *
 * [KO] BitmapTexture와 Sampler를 통해 다양한 텍스처 기반 렌더링 효과를 구현할 수 있습니다.
 * [EN] Various texture-based rendering effects can be implemented through BitmapTexture and Sampler.
 *
 * ### Example
 * ```typescript
 * const sourceTexture = new RedGPU.Resource.BitmapTexture(
 *    redGPUContext,
 *    '/RedGPU/examples/assets/github.png'
 * );
 * const material = new RedGPU.Material.BitmapMaterial(redGPUContext, sourceTexture);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/material/bitmapMaterial/"></iframe>
 * @category Material
 */
class BitmapMaterial extends AUVTransformBaseMaterial {
    /**
     * [KO] 머티리얼에 적용할 비트맵 텍스처를 설정하거나 반환합니다.
     * [EN] Sets or returns the bitmap texture to apply to the material.
     */
    diffuseTexture: BitmapTexture
    /**
     * [KO] 비트맵 텍스처의 샘플러를 설정하거나 반환합니다.
     * [EN] Sets or returns the sampler for the bitmap texture.
     */
    diffuseTextureSampler: Sampler;

    /**
     * [KO] BitmapMaterial 인스턴스를 생성합니다.
     * [EN] Creates a BitmapMaterial instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param diffuseTexture -
     * [KO] 적용할 초기 비트맵 텍스처 (선택적)
     * [EN] Initial bitmap texture to apply (optional)
     * @param name -
     * [KO] 머티리얼 이름 (선택적)
     * [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string) {
        super(
            redGPUContext,
            'BITMAP_MATERIAL',
            SHADER_INFO,
            2
        )
        if (name) this.name = name
        this.diffuseTexture = diffuseTexture
        this.diffuseTextureSampler = new Sampler(this.redGPUContext)
        this.initGPURenderInfos()
    }
}

DefineForFragment.defineByPreset(BitmapMaterial, [
    DefineForFragment.PRESET_TEXTURE.DIFFUSE_TEXTURE,
    DefineForFragment.PRESET_SAMPLER.DIFFUSE_TEXTURE_SAMPLER,
])

Object.freeze(BitmapMaterial)
export default BitmapMaterial
