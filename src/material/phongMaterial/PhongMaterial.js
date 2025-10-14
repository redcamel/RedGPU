import DefineForFragment from "../../defineProperty/DefineForFragment";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
import fragmentModuleSource from './fragment.wgsl';
const SHADER_INFO = parseWGSL(fragmentModuleSource);
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
class PhongMaterial extends ABitmapBaseMaterial {
    /**
     * 디스플레이스먼트(변위) 텍스처
     */
    #displacementTexture;
    /**
     * 디스플레이스먼트(변위) 스케일(기본값: 1)
     */
    #displacementScale = 1;
    /**
     * PhongMaterial 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param color - 기본 색상(HEX 문자열, 기본값: '#fff')
     * @param name - 머티리얼 이름(옵션)
     */
    constructor(redGPUContext, color = '#fff', name) {
        super(redGPUContext, 'PHONG_MATERIAL', SHADER_INFO, 2);
        if (name)
            this.name = name;
        this.initGPURenderInfos();
        this.color.setColorByHEX(color);
        this.emissiveColor.setColorByHEX(this.emissiveColor.hex);
        this.specularColor.setColorByHEX(this.specularColor.hex);
    }
    /** 디스플레이스먼트(변위) 스케일 반환 */
    get displacementScale() {
        return this.#displacementScale;
    }
    /** 디스플레이스먼트(변위) 스케일 설정 */
    set displacementScale(value) {
        this.#displacementScale = value;
    }
    /** 디스플레이스먼트(변위) 텍스처 반환 */
    get displacementTexture() {
        return this.#displacementTexture;
    }
    /** 디스플레이스먼트(변위) 텍스처 설정 및 파이프라인 갱신 */
    set displacementTexture(value) {
        const prevTexture = this.#displacementTexture;
        this.#displacementTexture = value;
        this.updateTexture(prevTexture, value);
        this.dirtyPipeline = true;
    }
}
DefineForFragment.defineByPreset(PhongMaterial, [
    DefineForFragment.PRESET_COLOR_RGB.COLOR,
    //
    DefineForFragment.PRESET_TEXTURE.ALPHA_TEXTURE,
    DefineForFragment.PRESET_SAMPLER.ALPHA_TEXTURE_SAMPLER,
    //
    DefineForFragment.PRESET_TEXTURE.AO_TEXTURE,
    DefineForFragment.PRESET_SAMPLER.AO_TEXTURE_SAMPLER,
    DefineForFragment.PRESET_POSITIVE_NUMBER.AO_STRENGTH,
    //
    DefineForFragment.PRESET_TEXTURE.DIFFUSE_TEXTURE,
    DefineForFragment.PRESET_SAMPLER.DIFFUSE_TEXTURE_SAMPLER,
    //
    DefineForFragment.PRESET_TEXTURE.EMISSIVE_TEXTURE,
    DefineForFragment.PRESET_SAMPLER.EMISSIVE_TEXTURE_SAMPLER,
    DefineForFragment.PRESET_POSITIVE_NUMBER.EMISSIVE_STRENGTH,
    [DefineForFragment.PRESET_COLOR_RGB.EMISSIVE_COLOR, '#000000'],
    //
    DefineForFragment.PRESET_TEXTURE.NORMAL_TEXTURE,
    DefineForFragment.PRESET_SAMPLER.NORMAL_TEXTURE_SAMPLER,
    DefineForFragment.PRESET_POSITIVE_NUMBER.NORMAL_SCALE,
    //
    DefineForFragment.PRESET_TEXTURE.SPECULAR_TEXTURE,
    DefineForFragment.PRESET_SAMPLER.SPECULAR_TEXTURE_SAMPLER,
    DefineForFragment.PRESET_POSITIVE_NUMBER.SPECULAR_STRENGTH,
    [DefineForFragment.PRESET_COLOR_RGB.SPECULAR_COLOR, '#ffffff'],
    //
    [DefineForFragment.PRESET_POSITIVE_NUMBER.SHININESS, 32],
]);
DefineForFragment.defineBoolean(PhongMaterial, [
    ['useSSR', false]
]);
DefineForFragment.definePositiveNumber(PhongMaterial, [
    ['metallic', 0, 0, 1],
    ['roughness', 0, 0, 1]
]);
Object.freeze(PhongMaterial);
export default PhongMaterial;
