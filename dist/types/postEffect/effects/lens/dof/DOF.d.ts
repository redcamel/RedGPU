import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import AMultiPassPostEffect from "../../../core/AMultiPassPostEffect";
import { IPostEffectResult } from "../../../core/types";
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
declare class DOF extends AMultiPassPostEffect {
    #private;
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
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 초점 거리를 반환하거나 설정합니다.
     * [EN] Returns or sets the focus distance.
     *
     * @defaultValue 15.0
     * @returns
     * [KO] 초점 거리
     * [EN] Focus distance
     */
    get focusDistance(): number;
    set focusDistance(value: number);
    /**
     * [KO] 조리개 값(F-number)을 반환하거나 설정합니다.
     * [EN] Returns or sets the aperture value (F-number).
     *
     * @defaultValue 2.8
     * @returns
     * [KO] 조리개 값 (F-number)
     * [EN] Aperture value (F-number)
     */
    get aperture(): number;
    set aperture(value: number);
    /**
     * [KO] 최대 착란원(CoC) 크기(0 ~ 100)를 반환하거나 설정합니다.
     * [EN] Returns or sets the maximum Circle of Confusion (CoC) size (0 ~ 100).
     *
     * @defaultValue 25.0
     * @returns
     * [KO] 최대 CoC 크기
     * [EN] Maximum CoC size
     */
    get maxCoC(): number;
    set maxCoC(value: number);
    /**
     * [KO] 근평면 거리(0 이상)를 반환하거나 설정합니다.
     * [EN] Returns or sets the near plane distance (0 or greater).
     *
     * @defaultValue 0.1
     * @returns
     * [KO] 근평면 거리
     * [EN] Near plane distance
     */
    get nearPlane(): number;
    set nearPlane(value: number);
    /**
     * [KO] 원평면 거리(0.1 이상)를 반환하거나 설정합니다.
     * [EN] Returns or sets the far plane distance (0.1 or greater).
     *
     * @defaultValue 1000.0
     * @returns
     * [KO] 원평면 거리
     * [EN] Far plane distance
     */
    get farPlane(): number;
    set farPlane(value: number);
    /**
     * [KO] 근거리 블러 크기(단위: 픽셀)를 반환하거나 설정합니다.
     * [EN] Returns or sets the near blur size (in pixels).
     *
     * @defaultValue 15
     * @returns
     * [KO] 근거리 블러 크기 (단위: 픽셀)
     * [EN] Near blur size (in pixels)
     */
    get nearBlurSize(): number;
    set nearBlurSize(value: number);
    /**
     * [KO] 원거리 블러 크기(단위: 픽셀)를 반환하거나 설정합니다.
     * [EN] Returns or sets the far blur size (in pixels).
     *
     * @defaultValue 15
     * @returns
     * [KO] 원거리 블러 크기 (단위: 픽셀)
     * [EN] Far blur size (in pixels)
     */
    get farBlurSize(): number;
    set farBlurSize(value: number);
    /**
     * [KO] 근거리 블러 강도를 반환하거나 설정합니다.
     * [EN] Returns or sets the near blur strength.
     *
     * @defaultValue 1.0
     * @returns
     * [KO] 근거리 블러 강도
     * [EN] Near blur strength
     */
    get nearStrength(): number;
    set nearStrength(value: number);
    /**
     * [KO] 원거리 블러 강도를 반환하거나 설정합니다.
     * [EN] Returns or sets the far blur strength.
     *
     * @defaultValue 1.0
     * @returns
     * [KO] 원거리 블러 강도
     * [EN] Far blur strength
     */
    get farStrength(): number;
    set farStrength(value: number);
    /**
     * [KO] 게임 기본 프리셋을 적용합니다.
     * [EN] Applies the Game Default preset.
     */
    setGameDefault(): void;
    /**
     * [KO] 시네마틱 프리셋을 적용합니다.
     * [EN] Applies the Cinematic preset.
     */
    setCinematic(): void;
    /**
     * [KO] 인물 사진 프리셋을 적용합니다.
     * [EN] Applies the Portrait preset.
     */
    setPortrait(): void;
    /**
     * [KO] 풍경 사진 프리셋을 적용합니다.
     * [EN] Applies the Landscape preset.
     */
    setLandscape(): void;
    /**
     * [KO] 매크로 촬영 프리셋을 적용합니다.
     * [EN] Applies the Macro preset.
     */
    setMacro(): void;
    /**
     * [KO] 액션/스포츠 프리셋을 적용합니다.
     * [EN] Applies the Action/Sports preset.
     */
    setSports(): void;
    /**
     * [KO] 야간 촬영 프리셋을 적용합니다.
     * [EN] Applies the Night Mode preset.
     */
    setNightMode(): void;
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
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default DOF;
