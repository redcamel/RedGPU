import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import AMultiPassPostEffect from "../../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../../core/types";
import DOFCoC from "./DOFCoC/DOFCoC";
import DOFUnified from "./DOFUnified/DOFUnified";


/**
 * [KO] 착란원(CoC) 모델을 기반으로 초점 거리에 따른 블러와 보케(Bokeh)를 시뮬레이션하는 피사계 심도(DOF) 후처리 이펙트입니다.
 * [EN] Depth of Field (DOF) post-processing effect that simulates distance-based blur and bokeh based on the Circle of Confusion (CoC) model.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.DOF(redGPUContext);
 * effect.focusDistance = 10;
 * effect.aperture = 1.4;
 * effect.nearBlurSize = 20;
 * effect.farBlurSize = 25;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/dof/" style="width:100%; height:500px;"></iframe>
 *
 * @see [DOF example](/RedGPU/examples/postEffect/lens/dof/)
 * @category Lens
 */
class DOF extends AMultiPassPostEffect {
    #effect_coc: DOFCoC;
    #effect_unified: DOFUnified;
    #focusDistance: number = 15.0;
    #aperture: number = 2.8;
    #maxCoC: number = 25.0;
    #nearPlane: number = 0.1;
    #farPlane: number = 1000.0;
    #nearBlurSize: number = 15;
    #farBlurSize: number = 15;
    #nearStrength: number = 1.0;
    #farStrength: number = 1.0;

    /**
     * [KO] DOF 인스턴스를 생성합니다.
     * [EN] Creates a DOF instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.DOF(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            [
                new DOFCoC(redGPUContext),
                new DOFUnified(redGPUContext),
            ],
        );
        this.#effect_coc = this.passList[0] as DOFCoC;
        this.#effect_unified = this.passList[1] as DOFUnified;
        this.#effect_coc.focusDistance = this.#focusDistance;
        this.#effect_coc.aperture = this.#aperture;
        this.#effect_coc.maxCoC = this.#maxCoC;
        this.#effect_coc.nearPlane = this.#nearPlane;
        this.#effect_coc.farPlane = this.#farPlane;
        this.#effect_unified.nearBlurSize = this.#nearBlurSize;
        this.#effect_unified.farBlurSize = this.#farBlurSize;
        this.#effect_unified.nearStrength = this.#nearStrength;
        this.#effect_unified.farStrength = this.#farStrength;
    }

    /**
     * [KO] 초점 거리를 반환하거나 설정합니다.
     * [EN] Returns or sets the focus distance.
     *
     * @defaultValue 15.0
     * @returns
     * [KO] 초점 거리
     * [EN] Focus distance
     */
    get focusDistance(): number {
        return this.#focusDistance;
    }

    set focusDistance(value: number) {
        this.#focusDistance = value;
        this.#effect_coc.focusDistance = value;
    }

    /**
     * [KO] 조리개 값(F-number)을 반환하거나 설정합니다.
     * [EN] Returns or sets the aperture value (F-number).
     *
     * @defaultValue 2.8
     * @returns
     * [KO] 조리개 값 (F-number)
     * [EN] Aperture value (F-number)
     */
    get aperture(): number {
        return this.#aperture;
    }

    set aperture(value: number) {
        this.#aperture = value;
        this.#effect_coc.aperture = value;
    }

    /**
     * [KO] 최대 착란원(CoC) 크기(0 ~ 100)를 반환하거나 설정합니다.
     * [EN] Returns or sets the maximum Circle of Confusion (CoC) size (0 ~ 100).
     *
     * @defaultValue 25.0
     * @returns
     * [KO] 최대 CoC 크기
     * [EN] Maximum CoC size
     */
    get maxCoC(): number {
        return this.#maxCoC;
    }

    set maxCoC(value: number) {
        this.#maxCoC = value;
        this.#effect_coc.maxCoC = value;
    }

    /**
     * [KO] 근평면 거리(0 이상)를 반환하거나 설정합니다.
     * [EN] Returns or sets the near plane distance (0 or greater).
     *
     * @defaultValue 0.1
     * @returns
     * [KO] 근평면 거리
     * [EN] Near plane distance
     */
    get nearPlane(): number {
        return this.#nearPlane;
    }

    set nearPlane(value: number) {
        this.#nearPlane = value;
        this.#effect_coc.nearPlane = value;
    }

    /**
     * [KO] 원평면 거리(0.1 이상)를 반환하거나 설정합니다.
     * [EN] Returns or sets the far plane distance (0.1 or greater).
     *
     * @defaultValue 1000.0
     * @returns
     * [KO] 원평면 거리
     * [EN] Far plane distance
     */
    get farPlane(): number {
        return this.#farPlane;
    }

    set farPlane(value: number) {
        this.#farPlane = value;
        this.#effect_coc.farPlane = value;
    }

    /**
     * [KO] 근거리 블러 크기(단위: 픽셀)를 반환하거나 설정합니다.
     * [EN] Returns or sets the near blur size (in pixels).
     *
     * @defaultValue 15
     * @returns
     * [KO] 근거리 블러 크기 (단위: 픽셀)
     * [EN] Near blur size (in pixels)
     */
    get nearBlurSize(): number {
        return this.#nearBlurSize;
    }

    set nearBlurSize(value: number) {
        this.#nearBlurSize = value;
        this.#effect_unified.nearBlurSize = value;
    }

    /**
     * [KO] 원거리 블러 크기(단위: 픽셀)를 반환하거나 설정합니다.
     * [EN] Returns or sets the far blur size (in pixels).
     *
     * @defaultValue 15
     * @returns
     * [KO] 원거리 블러 크기 (단위: 픽셀)
     * [EN] Far blur size (in pixels)
     */
    get farBlurSize(): number {
        return this.#farBlurSize;
    }

    set farBlurSize(value: number) {
        this.#farBlurSize = value;
        this.#effect_unified.farBlurSize = value;
    }

    /**
     * [KO] 근거리 블러 강도를 반환하거나 설정합니다.
     * [EN] Returns or sets the near blur strength.
     *
     * @defaultValue 1.0
     * @returns
     * [KO] 근거리 블러 강도
     * [EN] Near blur strength
     */
    get nearStrength(): number {
        return this.#nearStrength;
    }

    set nearStrength(value: number) {
        this.#nearStrength = value;
        this.#effect_unified.nearStrength = value;
    }

    /**
     * [KO] 원거리 블러 강도를 반환하거나 설정합니다.
     * [EN] Returns or sets the far blur strength.
     *
     * @defaultValue 1.0
     * @returns
     * [KO] 원거리 블러 강도
     * [EN] Far blur strength
     */
    get farStrength(): number {
        return this.#farStrength;
    }

    set farStrength(value: number) {
        this.#farStrength = value;
        this.#effect_unified.farStrength = value;
    }

    /**
     * [KO] 게임 기본 프리셋을 적용합니다.
     * [EN] Applies the Game Default preset.
     */
    setGameDefault(): void {
        this.focusDistance = 15.0;
        this.aperture = 2.8;
        this.maxCoC = 25.0;
        this.nearBlurSize = 15;
        this.farBlurSize = 15;
        this.nearStrength = 1.0;
        this.farStrength = 1.0;
    }

    /**
     * [KO] 시네마틱 프리셋을 적용합니다.
     * [EN] Applies the Cinematic preset.
     */
    setCinematic(): void {
        this.focusDistance = 20.0;
        this.aperture = 1.4;
        this.maxCoC = 40.0;
        this.nearBlurSize = 25;
        this.farBlurSize = 30;
        this.nearStrength = 1.2;
        this.farStrength = 1.3;
    }

    /**
     * [KO] 인물 사진 프리셋을 적용합니다.
     * [EN] Applies the Portrait preset.
     */
    setPortrait(): void {
        this.focusDistance = 8.0;
        this.aperture = 1.8;
        this.maxCoC = 35.0;
        this.nearBlurSize = 12;
        this.farBlurSize = 25;
        this.nearStrength = 0.8;
        this.farStrength = 1.4;
    }

    /**
     * [KO] 풍경 사진 프리셋을 적용합니다.
     * [EN] Applies the Landscape preset.
     */
    setLandscape(): void {
        this.focusDistance = 50.0;
        this.aperture = 8.0;
        this.maxCoC = 20.0;
        this.nearBlurSize = 20;
        this.farBlurSize = 10;
        this.nearStrength = 1.1;
        this.farStrength = 0.6;
    }

    /**
     * [KO] 매크로 촬영 프리셋을 적용합니다.
     * [EN] Applies the Macro preset.
     */
    setMacro(): void {
        this.focusDistance = 2.0;
        this.aperture = 1.0;
        this.maxCoC = 50.0;
        this.nearBlurSize = 30;
        this.farBlurSize = 35;
        this.nearStrength = 1.5;
        this.farStrength = 1.6;
    }

    /**
     * [KO] 액션/스포츠 프리셋을 적용합니다.
     * [EN] Applies the Action/Sports preset.
     */
    setSports(): void {
        this.focusDistance = 25.0;
        this.aperture = 4.0;
        this.maxCoC = 18.0;
        this.nearBlurSize = 10;
        this.farBlurSize = 12;
        this.nearStrength = 0.8;
        this.farStrength = 0.9;
    }

    /**
     * [KO] 야간 촬영 프리셋을 적용합니다.
     * [EN] Applies the Night Mode preset.
     */
    setNightMode(): void {
        this.focusDistance = 12.0;
        this.aperture = 2.0;
        this.maxCoC = 30.0;
        this.nearBlurSize = 18;
        this.farBlurSize = 20;
        this.nearStrength = 1.1;
        this.farStrength = 1.2;
    }

    /**
     * [KO] DOF 다중 패스 후처리 효과를 렌더링합니다.
     * [EN] Renders the multi-pass DOF post-processing effect.
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
     * [KO] 입력 소스 텍스처 정보
     * [EN] Input source texture information
     * @returns
     * [KO] DOF 처리된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] DOF output texture information (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult) {
        const pool = view.postEffectManager.texturePool;
        const cocResult = this.#effect_coc.render(
            view, width, height, sourceTextureInfo
        );
        const result = this.#effect_unified.render(
            view, width, height, sourceTextureInfo, cocResult
        );
        pool.release(cocResult.texture);

        return result;
    }
}

Object.freeze(DOF);
export default DOF;
