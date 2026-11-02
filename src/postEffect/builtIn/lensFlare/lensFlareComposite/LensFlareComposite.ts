import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface LensFlareComposite {
    /**
     * [KO] 전체 렌즈 플레어 합성 강도 (0.0 ~ 10.0)
     * [EN] Overall lens flare composition intensity (0.0 ~ 10.0)
     * @defaultValue 1.1
     */
    intensity: number;
    /**
     * [KO] 카메라 렌즈 표면 미세 먼지 산란 마스크 강도 (0.0 ~ 2.0)
     * [EN] Camera lens surface micro-dust scattering mask intensity (0.0 ~ 2.0)
     * @defaultValue 0.25
     */
    lensDirtIntensity: number;
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
     * [KO] 고스트 및 할로 가장자리 색수차 분리 강도 (0.0 ~ 0.1)
     * [EN] Chromatic aberration dispersion strength at ghost/halo edges (0.0 ~ 0.1)
     * @defaultValue 0.015
     */
    chromaticAberration: number;
    /**
     * [KO] 조리개 날 개수 (4 ~ 12)
     * [EN] Aperture blade count (4 ~ 12)
     * @defaultValue 8
     */
    bladeCount: number;
    /**
     * [KO] 태양/주광원 회절 빛갈라짐(Starburst) 강도 (0.0 ~ 5.0)
     * [EN] Sun/primary light diffraction starburst intensity (0.0 ~ 5.0)
     * @defaultValue 1.0
     */
    starburstIntensity: number;
    /**
     * [KO] 시네마틱 수평 아나모픽 스트릭 강도 (0.0 ~ 5.0)
     * [EN] Cinematic horizontal anamorphic streak intensity (0.0 ~ 5.0)
     * @defaultValue 0.0
     */
    anamorphicIntensity: number;
    /**
     * [KO] 프레넬 할로 링 반경 (0.1 ~ 0.9)
     * [EN] Fresnel halo ring radius (0.1 ~ 0.9)
     * @defaultValue 0.46
     */
    haloRadius: number;
    /**
     * [KO] 프레넬 할로 링 밝기 강도 (0.0 ~ 5.0)
     * [EN] Fresnel halo ring brightness intensity (0.0 ~ 5.0)
     * @defaultValue 0.65
     */
    haloIntensity: number;
}

/**
 * [KO] 블러링이 완료된 `1/2` 해상도 화면 공간 플레어를 9-Tap Tent 필터로 업샘플링하고, 풀해상도에서 태양 회절 바늘 스파이크·중공형 다각형 코팅 보케·아나모픽 스트릭 및 렌즈 먼지 산란을 정밀 계산하여 원본 HDR 씬에 가산 합성하는 내부 패스입니다.
 * [EN] Internal pass that upsamples the blurred `1/2` resolution screen-space flare with a 9-Tap Tent filter, evaluates full-resolution sun diffraction needle spikes, hollow caustic aperture bokeh, anamorphic streaks, and lens dirt scattering, and additively blends them onto the original HDR scene.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class LensFlareComposite extends ASinglePassPostEffect {
    #prevSunDirX: number = 0;
    #prevSunDirY: number = 1;
    #prevSunDirZ: number = 0;
    #prevSunActive: number = -1;
    #prevSunColorR: number = -1;
    #prevSunColorG: number = -1;
    #prevSunColorB: number = -1;
    #prevSunIntensityScale: number = -1;
    #sunDirectionBuffer: Float32Array = new Float32Array([0, 1, 0]);
    #sunColorBuffer: Float32Array = new Float32Array([1, 1, 1]);

    /**
     * [KO] `LensFlareComposite` 인스턴스를 생성합니다.
     * [EN] Creates a `LensFlareComposite` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_LENS_FLARE_COMPOSITE',
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [
                    {name: 'sourceTexture'},
                    {name: 'flareTexture'}
                ]
            )
        );
        this.syncSunUniforms(0, 1, 0, 0, 1, 1, 1, 1.0);
    }

    /**
     * [KO] 주광원(태양) 방향, 활성 여부, 색상 및 강도 배율을 변경 시에만 유니폼 버퍼에 동기화합니다.
     * [EN] Synchronizes primary light (sun) direction, active flag, color, and intensity scale to the uniform buffer only when changed.
     */
    syncSunUniforms(
        dirX: number,
        dirY: number,
        dirZ: number,
        active: number,
        colorR: number,
        colorG: number,
        colorB: number,
        intensityScale: number
    ): void {
        if (
            this.#prevSunDirX !== dirX ||
            this.#prevSunDirY !== dirY ||
            this.#prevSunDirZ !== dirZ
        ) {
            this.#prevSunDirX = dirX;
            this.#prevSunDirY = dirY;
            this.#prevSunDirZ = dirZ;
            this.#sunDirectionBuffer[0] = dirX;
            this.#sunDirectionBuffer[1] = dirY;
            this.#sunDirectionBuffer[2] = dirZ;
            this.updateUniform('sunDirection', this.#sunDirectionBuffer as unknown as number[]);
        }

        if (this.#prevSunActive !== active) {
            this.#prevSunActive = active;
            this.updateUniform('sunActive', active);
        }

        if (
            this.#prevSunColorR !== colorR ||
            this.#prevSunColorG !== colorG ||
            this.#prevSunColorB !== colorB
        ) {
            this.#prevSunColorR = colorR;
            this.#prevSunColorG = colorG;
            this.#prevSunColorB = colorB;
            this.#sunColorBuffer[0] = colorR;
            this.#sunColorBuffer[1] = colorG;
            this.#sunColorBuffer[2] = colorB;
            this.updateUniform('sunColor', this.#sunColorBuffer as unknown as number[]);
        }

        if (this.#prevSunIntensityScale !== intensityScale) {
            this.#prevSunIntensityScale = intensityScale;
            this.updateUniform('sunIntensityScale', intensityScale);
        }
    }

    /**
     * [KO] 원본 HDR 텍스처와 블러링된 렌즈 플레어 텍스처를 합성하여 렌더링합니다.
     * [EN] Renders by compositing the original HDR texture and the blurred lens flare texture.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 원본 HDR 씬 소스 텍스처 정보
     * [EN] Original HDR scene source texture information
     * @param flareTextureInfo -
     * [KO] 블러링 완료된 `1/2` 해상도 플레어 소스 텍스처 정보
     * [EN] Blurred `1/2` resolution flare source texture information
     * @returns
     * [KO] 렌즈 플레어가 합성된 최종 HDR 결과 (`IPostEffectResult`)
     * [EN] Final HDR result with lens flare composited (`IPostEffectResult`)
     */
    render(
        view: View3D,
        width: number,
        height: number,
        sourceTextureInfo: IPostEffectResult,
        flareTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, sourceTextureInfo, flareTextureInfo);
    }
}

definePositiveNumber(LensFlareComposite, [
    {key: 'intensity', value: 1.1, min: 0.0, max: 10.0},
    {key: 'lensDirtIntensity', value: 0.25, min: 0.0, max: 2.0},
    {key: 'ghostCount', value: 8, min: 0, max: 12},
    {key: 'ghostSpacing', value: 0.34, min: 0.05, max: 1.0},
    {key: 'ghostIntensity', value: 1.15, min: 0.0, max: 5.0},
    {key: 'chromaticAberration', value: 0.015, min: 0.0, max: 0.1},
    {key: 'bladeCount', value: 8, min: 4, max: 12},
    {key: 'starburstIntensity', value: 1.0, min: 0.0, max: 5.0},
    {key: 'anamorphicIntensity', value: 0.0, min: 0.0, max: 5.0},
    {key: 'haloRadius', value: 0.46, min: 0.1, max: 0.9},
    {key: 'haloIntensity', value: 0.65, min: 0.0, max: 5.0},
]);
Object.freeze(LensFlareComposite);
export default LensFlareComposite;
