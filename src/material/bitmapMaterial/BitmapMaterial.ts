import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import fragmentModuleSource from './fragment.wgsl';
import AUVTransformBaseMaterial from "../core/AUVTransformBaseMaterial";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";

/**
 * [KO] BitmapMaterial의 동적 텍스처 및 샘플러 속성 인터페이스입니다.
 * [EN] Dynamic texture and sampler property interface for BitmapMaterial.
 * @category Material
 */
interface BitmapMaterial {
    /**
     * [KO] 머티리얼에 적용할 디퓨즈 비트맵 텍스처
     * [EN] Diffuse bitmap texture to apply to the material
     */
    diffuseTexture: BitmapTexture
    /**
     * [KO] 디퓨즈 텍스처 샘플러
     * [EN] Diffuse texture sampler
     */
    diffuseTextureSampler: Sampler;
}

/**
 * [KO] 단일 비트맵 텍스처를 사용하여 조명 연산 없이 표면을 렌더링하는 머티리얼 클래스입니다.
 * [EN] Material class that renders surfaces using a single bitmap texture without lighting calculations.
 *
 * ### Example
 * ```typescript
 * const sourceTexture = new RedGPU.Resource.BitmapTexture(
 *     redGPUContext,
 *     '/RedGPU/examples/assets/github.png'
 * );
 * const material = new RedGPU.Material.BitmapMaterial(redGPUContext, sourceTexture);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/material/bitmapMaterial/" style="width:100%; height:500px;"></iframe>
 *
 * @see [BitmapMaterial example](/RedGPU/examples/3d/material/bitmapMaterial/)
 * @see [Material Opacity example](/RedGPU/examples/3d/material/opacity/)
 * @see [UV Transform example](/RedGPU/examples/3d/material/uvTransform/)
 * @category Material
 */
class BitmapMaterial extends AUVTransformBaseMaterial {

    /**
     * [KO] BitmapMaterial 인스턴스를 생성합니다.
     * [EN] Creates a BitmapMaterial instance.
     *
     * ### Example
     * ```typescript
     * const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '/RedGPU/examples/assets/github.png');
     * const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture, 'myBitmapMaterial');
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param diffuseTexture -
     * [KO] 적용할 비트맵 텍스처 (선택)
     * [EN] Bitmap texture to apply (optional)
     * @param name -
     * [KO] 머티리얼 이름 (선택)
     * [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string) {
        super(
            redGPUContext,
            'BITMAP_MATERIAL',
            fragmentModuleSource,
            2
        )
        if (name) this.name = name
        this.diffuseTexture = diffuseTexture
        this.diffuseTextureSampler = new Sampler(this.redGPUContext)
        this.initGPURenderInfos()
    }

}

defineSampler(BitmapMaterial, [
    {key: 'diffuseTextureSampler'}
])
defineTexture(BitmapMaterial, [
    {key: 'diffuseTexture'}
])
Object.defineProperty(BitmapMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});
Object.freeze(BitmapMaterial)
export default BitmapMaterial
