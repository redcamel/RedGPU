import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import CubeTexture from "../../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import ANoiseTexture from "../../../../resources/texture/noiseTexture/core/ANoiseTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "../shader/fragment.wgsl"
import DefineGPUProperty from "../../../../defineProperty/DefineGPUProperty";

const SHADER_INFO = parseWGSL('SKYBOX_MATERIAL', fragmentModuleSource)

interface SkyBoxMaterial {
    /** [KO] 현재 큐브 텍스처 [EN] Current cube texture */
    texture0: CubeTexture | DirectCubeTexture;
    /** [KO] 전환 대상 큐브 텍스처 [EN] Target cube texture for transition */
    transitionTexture: CubeTexture | DirectCubeTexture;
    /** [KO] 전환 효과용 마스크 [EN] Mask for transition effect */
    transitionMask: ANoiseTexture | BitmapTexture;
    /** [KO] 샘플러 [EN] Sampler */
    sampler0: Sampler;
    /** [KO] 블러 강도 [EN] Blur strength */
    blur: number;
    /** [KO] 강도 배율 [EN] Intensity multiplier */
    intensityMultiplier: number;
    /** [KO] 물리적 휘도 (Nit) [EN] Physical luminance (Nit) */
    luminance: number;
    /** [KO] 분석된 텍스처의 평균 휘도 [EN] Average luminance of analyzed texture */
    averageLuminance: number;
    /** [KO] 불투명도 [EN] Opacity */
    opacity: number;
    /** [KO] 전환 진행률 [EN] Transition progress */
    transitionProgress: number;
}

/**
 * [KO] SkyBox 렌더링에 사용되는 전용 머티리얼 클래스입니다.
 * [EN] Material class exclusively used for SkyBox rendering.
 *
 * @category SkyBox
 */
class SkyBoxMaterial extends ABitmapBaseMaterial {


    constructor(redGPUContext: RedGPUContext, texture: CubeTexture | DirectCubeTexture) {
        super(redGPUContext, 'SKYBOX_MATERIAL', SHADER_INFO, 2)
        this.texture0 = texture;
        this.sampler0 = new Sampler(this.redGPUContext, {
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
            addressModeW: 'clamp-to-edge'
        })
        this.initGPURenderInfos()
    }
}

DefineGPUProperty.definePositiveNumber(SkyBoxMaterial, [
    {key: 'blur', value: 0},
    {key: 'intensityMultiplier', value: 1},
    {key: 'luminance', value: 10000},
    {key: 'transitionProgress', value: 0},
])
DefineGPUProperty.defineCubeTexture(SkyBoxMaterial, [
    {key: 'texture0'},
    {key: 'transitionTexture'}
])
DefineGPUProperty.defineTexture(SkyBoxMaterial, [
    {key: 'transitionMask'}
])
DefineGPUProperty.defineSampler(SkyBoxMaterial, [{key: 'sampler0'}])

Object.freeze(SkyBoxMaterial)
export default SkyBoxMaterial
