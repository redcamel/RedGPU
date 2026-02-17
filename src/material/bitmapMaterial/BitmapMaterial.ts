import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../defineProperty/DefineForFragment";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from './fragment.wgsl';
import AUVTransformBaseMaterial from "../core/AUVTransformBaseMaterial";

const SHADER_INFO = parseWGSL(fragmentModuleSource, 'BITMAP_MATERIAL')

/**
 * [KO] 비트맵 텍스처 기반 머티리얼의 공통 속성 인터페이스
 * [EN] Common property interface for bitmap texture-based materials
 */
interface BitmapMaterial {
	/**
	 * [KO] 머티리얼에 적용할 비트맵 텍스처
	 * [EN] Bitmap texture to apply to the material
	 */
	diffuseTexture: BitmapTexture
	/**
	 * [KO] 비트맵 텍스처 샘플러
	 * [EN] Bitmap texture sampler
	 */
	diffuseTextureSampler: Sampler;
}

/**
 * [KO] 비트맵 텍스처 기반의 머티리얼 클래스입니다.
 * [EN] Material class based on bitmap texture.
 *
 * [KO] BitmapTexture와 Sampler를 통해 다양한 텍스처 기반 렌더링 효과를 구현할 수 있습니다.
 * [EN] Various texture-based rendering effects can be implemented through BitmapTexture and Sampler.
 * * ### Example
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
	 * [KO] 파이프라인 dirty 상태 플래그
	 * [EN] Pipeline dirty status flag
	 */
	dirtyPipeline: boolean = false

    /**
     * [KO] BitmapMaterial 생성자
     * [EN] BitmapMaterial constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param diffuseTexture -
     * [KO] 적용할 비트맵 텍스처
     * [EN] Bitmap texture to apply
     * @param name -
     * [KO] 머티리얼 이름(옵션)
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
