import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import CubeTexture from "../../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import ANoiseTexture from "../../../../resources/texture/noiseTexture/core/ANoiseTexture";
import fragmentModuleSource from "../shader/fragment.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineCubeTexture from "../../../../defineProperty/funcs/texture/defineCubeTexture";
import defineTexture from "../../../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../../../defineProperty/funcs/texture/defineSampler";

/**
 * [KO] `SkyBox`의 큐브맵 배경 및 전환 효과 파라미터를 정의하는 인터페이스입니다.
 * [EN] Interface defining cubemap background and transition effect parameters for `SkyBox`.
 *
 * @category SkyBox
 */
interface SkyBoxMaterial {
    /**
     * [KO] 스카이박스 렌더링에 적용할 기본 큐브 텍스처
     * [EN] Base cube texture applied to skybox rendering
     */
    texture0: CubeTexture | DirectCubeTexture;
    /**
     * [KO] 전환 효과 진행 시 목표가 되는 대상 큐브 텍스처
     * [EN] Target cube texture during a transition effect
     */
    transitionTexture: CubeTexture | DirectCubeTexture;
    /**
     * [KO] 전환 애니메이션에 적용할 노이즈 또는 비트맵 마스크 텍스처
     * [EN] Noise or bitmap mask texture applied to the transition animation
     */
    transitionMask: ANoiseTexture | BitmapTexture;
    /**
     * [KO] 스카이박스 텍스처 샘플러 인스턴스
     * [EN] Skybox texture sampler instance
     */
    sampler0: Sampler;
    /**
     * [KO] 배경 텍스처의 블러 강도 (0.0 ~ 1.0)
     * [EN] Blur strength of the background texture (0.0 to 1.0)
     */
    blur: number;
    /**
     * [KO] 시각적 라이팅 밝기 강도 배율
     * [EN] Visual lighting brightness intensity multiplier
     */
    intensityMultiplier: number;
    /**
     * [KO] 물리 기반 광학 시뮬레이션용 휘도 값 (단위: Nit, 기본값: 10000)
     * [EN] Luminance value for physical optics simulation (unit: Nit, default: 10000)
     */
    luminance: number;
    /**
     * [KO] 스카이박스의 불투명도 (0.0 ~ 1.0)
     * [EN] Opacity of the skybox (0.0 to 1.0)
     */
    opacity: number;
    /**
     * [KO] 두 큐브 텍스처 간의 전환 진행률 (0.0 ~ 1.0)
     * [EN] Transition progress between the two cube textures (0.0 to 1.0)
     */
    transitionProgress: number;
}

/**
 * [KO] `SkyBox` 내부에서 자동 생성되어 사용되는 전용 머티리얼 클래스입니다.
 * [EN] Dedicated material class automatically created and used internally by `SkyBox`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyBox
 */
class SkyBoxMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] SkyBoxMaterial 인스턴스를 생성합니다.
     * [EN] Creates a SkyBoxMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param texture -
     * [KO] 초기 큐브 텍스처 객체
     * [EN] Initial cube texture object
     */
    constructor(redGPUContext: RedGPUContext, texture: CubeTexture | DirectCubeTexture) {
        super(redGPUContext, 'SKYBOX_MATERIAL', fragmentModuleSource, 2)
        this.texture0 = texture;
        this.sampler0 = new Sampler(this.redGPUContext, {
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
            addressModeW: 'clamp-to-edge'
        })
        this.initGPURenderInfos()
    }
}

definePositiveNumber(SkyBoxMaterial, [
    {key: 'blur', value: 0},
    {key: 'intensityMultiplier', value: 1},
    {key: 'luminance', value: 10000},
    {key: 'transitionProgress', value: 0},
])
defineCubeTexture(SkyBoxMaterial, [
    {key: 'texture0'},
    {key: 'transitionTexture'}
])
defineTexture(SkyBoxMaterial, [
    {key: 'transitionMask'}
])
defineSampler(SkyBoxMaterial, [{key: 'sampler0'}])

Object.freeze(SkyBoxMaterial)
export default SkyBoxMaterial
