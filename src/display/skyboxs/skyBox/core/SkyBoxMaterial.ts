import RedGPUContext from "../../../../context/RedGPUContext";
import DefineForFragment from "../../../../defineProperty/DefineForFragment";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import CubeTexture from "../../../../resources/texture/CubeTexture";
import {IBLCubeTexture} from "../../../../resources/texture/ibl/core";
import ANoiseTexture from "../../../../resources/texture/noiseTexture/core/ANoiseTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "../shader/fragment.wgsl"

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface SkyBoxMaterial {
    /** [KO] 현재 스카이박스 큐브 텍스처 (일반 또는 IBL) [EN] Current skybox cube texture (Regular or IBL) */
    skyboxTexture: CubeTexture | IBLCubeTexture;
    /** [KO] 전환 대상 큐브 텍스처 (일반 또는 IBL) [EN] Target cube texture for transition (Regular or IBL) */
    transitionTexture: CubeTexture | IBLCubeTexture;
    /** [KO] 전환 효과용 알파 노이즈 텍스처 [EN] Alpha noise texture for transition effect */
    transitionAlphaTexture: ANoiseTexture | BitmapTexture;
    /** [KO] 스카이박스 텍스처 샘플러 [EN] Skybox texture sampler */
    skyboxTextureSampler: Sampler;
    /** [KO] 블러 강도 [EN] Blur strength */
    blur: number;
    /** [KO] 불투명도 [EN] Opacity */
    opacity: number;
    /** [KO] 전환 진행률 [EN] Transition progress */
    transitionProgress: number;
}

/**
 * [KO] SkyBox 렌더링에 사용되는 전용 머티리얼 클래스입니다.
 * [EN] Material class exclusively used for SkyBox rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 머티리얼 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is a material class used internally by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyBox
 */
class SkyBoxMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] 파이프라인 dirty 상태 플래그
     * [EN] Pipeline dirty status flag
     */
    dirtyPipeline: boolean = false

    /**
     * [KO] SkyBoxMaterial 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a SkyBoxMaterial instance. (Internal system only)
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param cubeTexture -
     * [KO] 스카이박스에 사용할 큐브 텍스처 (일반 또는 IBL)
     * [EN] Cube texture to use for the skybox (Regular or IBL)
     */
    constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | IBLCubeTexture) {
        super(
            redGPUContext,
            'SKYBOX_MATERIAL',
            SHADER_INFO,
            2
        )
        this.skyboxTexture = cubeTexture;
        this.skyboxTextureSampler = new Sampler(this.redGPUContext, {
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
            addressModeW: 'clamp-to-edge'
        })
        this.initGPURenderInfos()
    }
}

DefineForFragment.definePositiveNumber(SkyBoxMaterial, [
    ['blur', 0],
    ['opacity', 1, 0, 1],
])
DefineForFragment.definePositiveNumber(SkyBoxMaterial, [
    ['transitionProgress', 0],
])
DefineForFragment.defineCubeTexture(SkyBoxMaterial, [
    'transitionTexture',
])
DefineForFragment.defineTexture(SkyBoxMaterial, [
    'transitionAlphaTexture',
])
DefineForFragment.defineCubeTexture(SkyBoxMaterial, [
    'skyboxTexture',
])
DefineForFragment.defineSampler(SkyBoxMaterial, [
    'skyboxTextureSampler',
])
Object.freeze(SkyBoxMaterial)
export default SkyBoxMaterial