import RedGPUContext from "../../../../context/RedGPUContext";
import DefineForFragment from "../../../../defineProperty/DefineForFragment";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import CubeTexture from "../../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import ANoiseTexture from "../../../../resources/texture/noiseTexture/core/ANoiseTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "../shader/fragment.wgsl"

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
    /** [KO] 원본 이미지의 기본 휘도 [EN] Base luminance of the source image */
    baseLuminance: number;
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
    dirtyPipeline: boolean = false

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

DefineForFragment.definePositiveNumber(SkyBoxMaterial, [
    ['blur', 0],
    ['intensityMultiplier', 1],
    ['luminance', 10000],
    ['baseLuminance', 1],
    ['opacity', 1, 0, 1],
    ['transitionProgress', 0],
])
DefineForFragment.defineCubeTexture(SkyBoxMaterial, [ 'texture0', 'transitionTexture' ])
DefineForFragment.defineTexture(SkyBoxMaterial, [ 'transitionMask' ])
DefineForFragment.defineSampler(SkyBoxMaterial, [ 'sampler0' ])

Object.freeze(SkyBoxMaterial)
export default SkyBoxMaterial
