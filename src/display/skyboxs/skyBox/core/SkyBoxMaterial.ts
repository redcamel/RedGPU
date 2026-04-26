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
    /** [KO] 현재 스카이박스 큐브 텍스처 (일반 또는 직접 주입) [EN] Current skybox cube texture (Regular or Direct) */
    skyboxTexture: CubeTexture | DirectCubeTexture;
    /** [KO] 전환 대상 큐브 텍스처 (일반 또는 직접 주입) [EN] Target cube texture for transition (Regular or Direct) */
    transitionTexture: CubeTexture | DirectCubeTexture;
    /** [KO] 전환 효과용 알파 노이즈 텍스처 [EN] Alpha noise texture for transition effect */
    transitionAlphaTexture: ANoiseTexture | BitmapTexture;
    /** [KO] 스카이박스 텍스처 샘플러 [EN] Skybox texture sampler */
    skyboxTextureSampler: Sampler;
    /** [KO] 블러 강도 (0.0 ~ 1.0) [EN] Blur strength (0.0 to 1.0) */
    blur: number;
    /** [KO] 강도 배율 (물리적 휘도에 곱해지는 추가 배율) [EN] Intensity multiplier (Additional scale multiplied by physical luminance) */
    intensity: number;
    /** [KO] 물리적 휘도 (단위: Nit, cd/m²) [EN] Physical luminance (Unit: Nit, cd/m²) */
    nit: number;
    /** [KO] 원본 이미지의 평균 휘도 (정규화용) [EN] Average luminance of the source image (for normalization) */
    inherentLuminance: number;
    /** [KO] 불투명도 (0.0 ~ 1.0) [EN] Opacity (0.0 to 1.0) */
    opacity: number;
    /** [KO] 전환 진행률 (0.0 ~ 1.0) [EN] Transition progress (0.0 to 1.0) */
    transitionProgress: number;
}

/**
 * [KO] SkyBox 렌더링에 사용되는 전용 머티리얼 클래스입니다.
 * [EN] Material class exclusively used for SkyBox rendering.
 *
 * [KO] 물리적 기반 라이팅 모델을 지원하며, 카메라 노출 시스템과 연동되어 정확한 배경 밝기를 계산합니다.
 * [EN] Supports physically based lighting models and works with the camera exposure system to calculate accurate background brightness.
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
     * [KO] 스카이박스에 사용할 큐브 텍스처 (일반 또는 직접 주입)
     * [EN] Cube texture to use for the skybox (Regular or Direct)
     */
    constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | DirectCubeTexture) {
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
    ['intensity', 1],
    ['nit', 10000],
    ['inherentLuminance', 1],
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
