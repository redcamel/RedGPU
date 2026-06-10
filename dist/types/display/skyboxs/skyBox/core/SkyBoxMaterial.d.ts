import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import CubeTexture from "../../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import ANoiseTexture from "../../../../resources/texture/noiseTexture/core/ANoiseTexture";
interface SkyBoxMaterial {
    /**
     * [KO] 스카이박스 렌더링에 적용할 현재 큐브 텍스처
     * [EN] Current cube texture to apply for skybox rendering
     */
    texture0: CubeTexture | DirectCubeTexture;
    /**
     * [KO] 부드러운 전환 효과 진행 시 대상이 되는 목표 큐브 텍스처
     * [EN] Target cube texture when performing a smooth transition effect
     */
    transitionTexture: CubeTexture | DirectCubeTexture;
    /**
     * [KO] 전환 애니메이션에 적용할 지형/노이즈 마스크 텍스처
     * [EN] Terrain/noise mask texture to apply to the transition animation
     */
    transitionMask: ANoiseTexture | BitmapTexture;
    /**
     * [KO] 스카이박스 텍스처 샘플링 필터링 설정을 제어하는 Sampler 인스턴스
     * [EN] Sampler instance controlling the skybox texture sampling and filtering configuration
     */
    sampler0: Sampler;
    /**
     * [KO] 스카이박스 이미지의 블러 가우시안 필터 강도 (0.0 ~ 1.0)
     * [EN] Gaussian blur strength of the skybox image (0.0 to 1.0)
     */
    blur: number;
    /**
     * [KO] 아티스트 시각 제어용 최종 라이팅 밝기 강도 배율
     * [EN] Final lighting brightness intensity multiplier for artistic control
     */
    intensityMultiplier: number;
    /**
     * [KO] 물리 기반 광학 시뮬레이션용 휘도값 (Nit, 기본값: 10000 Nit)
     * [EN] Luminance value for physical optics simulation (Nit, default: 10000 Nit)
     */
    luminance: number;
    /**
     * [KO] 분석 완료된 HDR 텍스처의 평균 휘도
     * [EN] The analyzed average luminance of the HDR texture
     */
    averageLuminance: number;
    /**
     * [KO] 스카이박스의 불투명도 수치 (0.0 ~ 1.0)
     * [EN] Opacity value of the skybox (0.0 to 1.0)
     */
    opacity: number;
    /**
     * [KO] 두 텍스처 간의 보간 전환 진행률 (0.0 ~ 1.0)
     * [EN] Interpolated transition progress between the two textures (0.0 to 1.0)
     */
    transitionProgress: number;
}
/**
 * [KO] SkyBox 렌더링에 특화된 전용 셰이더 및 바인딩 처리를 제공하는 머티리얼 클래스입니다.
 * [EN] Material class that provides specialized shaders and binding configurations tailored for SkyBox rendering.
 *
 * @category SkyBox
 */
declare class SkyBoxMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] SkyBoxMaterial 인스턴스를 생성합니다.
     * [EN] Creates an instance of SkyBoxMaterial.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param texture -
     * [KO] 초기 큐브 텍스처 객체
     * [EN] Initial cube texture object
     */
    constructor(redGPUContext: RedGPUContext, texture: CubeTexture | DirectCubeTexture);
}
export default SkyBoxMaterial;
