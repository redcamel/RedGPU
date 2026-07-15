import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import fragmentModuleSource from './fragment.wgsl';
import defineSampler from "../../../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../../../defineProperty/funcs/texture/defineTexture";

/**
 * [KO] 텍스트 필드 머티리얼 인터페이스
 * [EN] Text field material interface
 */
interface TextFieldMaterial {
    /**
     * [KO] 디퓨즈 텍스처 (텍스트 필드 비트맵 텍스처)
     * [EN] Diffuse texture (text field bitmap texture)
     */
    diffuseTexture: BitmapTexture
    /**
     * [KO] 디퓨즈 텍스처 샘플러
     * [EN] Diffuse texture sampler
     */
    diffuseTextureSampler: Sampler
}

/**
 * [KO] 텍스트 필드 렌더링에 사용되는 머티리얼 클래스입니다.
 * [EN] Material class used for rendering text fields.
 *
 * [KO] `ABitmapBaseMaterial`을 확장하며, 텍스처와 샘플러를 기반으로 GPU 렌더링 정보를 초기화합니다.
 * [EN] Extends `ABitmapBaseMaterial` and initializes GPU rendering info based on a texture and a sampler.
 *
 * ::: warning
 * [KO] 시스템 전용 클래스입니다. 일반 사용자가 직접 인스턴스를 생성하여 활용하는 것은 권장되지 않습니다.
 * [EN] System-only class. It is not recommended for general users to instantiate and use it directly.
 * :::
 *
 * @category Material
 */
class TextFieldMaterial extends ABitmapBaseMaterial {

    /**
     * [KO] TextFieldMaterial 인스턴스를 생성합니다.
     * [EN] Creates a new TextFieldMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param diffuseTexture -
     * [KO] 텍스트 필드에 사용할 비트맵 텍스처 (선택 사항)
     * [EN] Bitmap texture to use for the text field (optional)
     * @param name -
     * [KO] 머티리얼의 이름 (선택 사항)
     * [EN] Name of the material (optional)
     */
    constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string) {
        super(
            redGPUContext,
            'TEXT_FIELD_MATERIAL',
            fragmentModuleSource,
            2
        )
        if (name) this.name = name
        this.diffuseTexture = diffuseTexture
        this.diffuseTextureSampler = new Sampler(this.redGPUContext)
        this.initGPURenderInfos()
    }


}

defineSampler(TextFieldMaterial, [
    {key: 'diffuseTextureSampler'}
])
/**
 * 프래그먼트 셰이더에서 사용할 텍스처 및 샘플러 속성을 정의합니다.
 */
defineTexture(TextFieldMaterial, [
    {key: 'diffuseTexture'}
])
/**
 * `TextFieldMaterial` 클래스의 속성을 변경할 수 없도록 고정합니다.
 */
Object.freeze(TextFieldMaterial)
Object.defineProperty(TextFieldMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});
export default TextFieldMaterial
