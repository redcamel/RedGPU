import RedGPUContext from "../../../../context/RedGPUContext";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface LensFlareGenerate {
    /**
     * [KO] 화면 공간 HDR 하이라이트 추출 임계값 (0.1 ~ 20.0)
     * [EN] Screen-space HDR highlight extraction threshold (0.1 ~ 20.0)
     * @defaultValue 1.8
     */
    threshold: number;
    /**
     * [KO] 렌즈 내부 반사 고스트 개수 (0 ~ 12)
     * [EN] Number of internal lens reflection ghosts (0 ~ 12)
     * @defaultValue 8
     */
    ghostCount: number;
    /**
     * [KO] 광학 축을 따른 고스트 간격 배율 (0.05 ~ 1.0)
     * [EN] Ghost spacing multiplier along the optical axis (0.05 ~ 1.0)
     * @defaultValue 0.34
     */
    ghostSpacing: number;
    /**
     * [KO] 다중 고스트 밝기 강도 (0.0 ~ 5.0)
     * [EN] Multi-ghost brightness intensity (0.0 ~ 5.0)
     * @defaultValue 1.15
     */
    ghostIntensity: number;
    /**
     * [KO] 프레넬 할로 링 반경 (0.1 ~ 0.9)
     * [EN] Fresnel halo ring radius (0.1 ~ 0.9)
     * @defaultValue 0.46
     */
    haloRadius: number;
    /**
     * [KO] 프레넬 할로 링 두께 (0.02 ~ 0.5)
     * [EN] Fresnel halo ring thickness (0.02 ~ 0.5)
     * @defaultValue 0.16
     */
    haloThickness: number;
    /**
     * [KO] 프레넬 할로 링 밝기 강도 (0.0 ~ 5.0)
     * [EN] Fresnel halo ring brightness intensity (0.0 ~ 5.0)
     * @defaultValue 0.65
     */
    haloIntensity: number;
    /**
     * [KO] 고스트 및 할로 가장자리 색수차 분리 강도 (0.0 ~ 0.1)
     * [EN] Chromatic aberration dispersion strength at ghost/halo edges (0.0 ~ 0.1)
     * @defaultValue 0.015
     */
    chromaticAberration: number;
}

/**
 * [KO] 절반(`1/2`) 해상도에서 화면 공간 고휘도 HDR 하이라이트를 추출하여 다중 코팅 고스트와 프레넬 할로를 생성하는 내부 패스입니다.
 * [EN] Internal pass that extracts screen-space high-luminance HDR highlights at half (`1/2`) resolution to generate multi-coated ghosts and Fresnel halos.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class LensFlareGenerate extends ASinglePassPostEffect {
    /**
     * [KO] `LensFlareGenerate` 인스턴스를 생성합니다.
     * [EN] Creates a `LensFlareGenerate` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_LENS_FLARE_GENERATE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

definePositiveNumber(LensFlareGenerate, [
    {key: 'threshold', value: 1.8, min: 0.1, max: 20.0},
    {key: 'ghostCount', value: 8, min: 0, max: 12},
    {key: 'ghostSpacing', value: 0.34, min: 0.05, max: 1.0},
    {key: 'ghostIntensity', value: 1.15, min: 0.0, max: 5.0},
    {key: 'haloRadius', value: 0.46, min: 0.1, max: 0.9},
    {key: 'haloThickness', value: 0.16, min: 0.02, max: 0.5},
    {key: 'haloIntensity', value: 0.65, min: 0.0, max: 5.0},
    {key: 'chromaticAberration', value: 0.015, min: 0.0, max: 0.1},
]);
Object.freeze(LensFlareGenerate);
export default LensFlareGenerate;
