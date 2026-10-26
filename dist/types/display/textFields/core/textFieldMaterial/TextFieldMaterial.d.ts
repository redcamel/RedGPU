import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
/**
 * [KO] 텍스트 필드 머티리얼의 텍스처 및 샘플러 속성을 정의하는 인터페이스입니다.
 * [EN] Interface defining texture and sampler properties for a text field material.
 *
 * @category Material
 */
interface TextFieldMaterial {
    /**
     * [KO] 텍스트 비트맵 디퓨즈 텍스처
     * [EN] Text bitmap diffuse texture
     */
    diffuseTexture: BitmapTexture;
    /**
     * [KO] 디퓨즈 텍스처 샘플러
     * [EN] Diffuse texture sampler
     */
    diffuseTextureSampler: Sampler;
}
/**
 * [KO] 텍스트 필드 내부에서 비트맵 텍스처 렌더링을 위해 자동으로 생성되는 전용 머티리얼 클래스입니다.
 * [EN] Dedicated material class automatically created inside a text field for bitmap texture rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Material
 */
declare class TextFieldMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] TextFieldMaterial 인스턴스를 생성합니다.
     * [EN] Creates a TextFieldMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param diffuseTexture -
     * [KO] 텍스트 필드에 적용할 비트맵 텍스처 (선택)
     * [EN] Bitmap texture to apply to the text field (optional)
     * @param name -
     * [KO] 머티리얼 이름 (선택)
     * [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string);
}
export default TextFieldMaterial;
