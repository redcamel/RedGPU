import ColorRGB from "../../../color/ColorRGB";
import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import BloomComposite from "./bloomComposite/BloomComposite";
import BloomDownsample from "./bloomDownsample/BloomDownsample";
import BloomPrefilter from "./bloomPrefilter/BloomPrefilter";
import BloomUpsample from "./bloomUpsample/BloomUpsample";

/**
 * [KO] 5단계 밉체인 피라미드(13-Tap Dual-Grid 다운샘플 + 9-Tap Tent 업샘플), Soft-Knee HDR 임계값 및 Karis 가중 평균을 기반으로 물리적인 빛 산란을 구현하는 차세대 HDR 블룸(Bloom) 후처리 이펙트입니다.
 * [EN] Next-generation HDR Bloom post-processing effect that implements physical light scattering based on a 5-stage mip-chain pyramid (13-Tap Dual-Grid downsample + 9-Tap Tent upsample), Soft-Knee HDR threshold, and Karis weighted average.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * view.postEffectManager.useBloom = true;
 * const bloom = view.postEffectManager.bloom;
 * bloom.setCinematic();
 * bloom.intensity = 0.8;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/bloom/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Bloom example](/RedGPU/examples/postEffect/bloom/)
 * @category Visual Effects
 */
class Bloom extends AMultiPassPostEffect {
    #effect_prefilter: BloomPrefilter;
    #effect_downsample0: BloomDownsample;
    #effect_downsample1: BloomDownsample;
    #effect_downsample2: BloomDownsample;
    #effect_downsample3: BloomDownsample;
    #effect_upsample3: BloomUpsample;
    #effect_upsample2: BloomUpsample;
    #effect_upsample1: BloomUpsample;
    #effect_upsample0: BloomUpsample;
    #effect_composite: BloomComposite;

    /**
     * [KO] Bloom 인스턴스를 생성합니다.
     * [EN] Creates a Bloom instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        const prefilter = new BloomPrefilter(redGPUContext);
        const downsample0 = new BloomDownsample(redGPUContext);
        const downsample1 = new BloomDownsample(redGPUContext);
        const downsample2 = new BloomDownsample(redGPUContext);
        const downsample3 = new BloomDownsample(redGPUContext);
        const upsample3 = new BloomUpsample(redGPUContext);
        const upsample2 = new BloomUpsample(redGPUContext);
        const upsample1 = new BloomUpsample(redGPUContext);
        const upsample0 = new BloomUpsample(redGPUContext);
        const composite = new BloomComposite(redGPUContext);

        super(
            redGPUContext,
            [
                prefilter,
                downsample0,
                downsample1,
                downsample2,
                downsample3,
                upsample3,
                upsample2,
                upsample1,
                upsample0,
                composite,
            ],
        );

        this.#effect_prefilter = prefilter;
        this.#effect_downsample0 = downsample0;
        this.#effect_downsample1 = downsample1;
        this.#effect_downsample2 = downsample2;
        this.#effect_downsample3 = downsample3;
        this.#effect_upsample3 = upsample3;
        this.#effect_upsample2 = upsample2;
        this.#effect_upsample1 = upsample1;
        this.#effect_upsample0 = upsample0;
        this.#effect_composite = composite;

        this.setNatural();
    }

    /**
     * [KO] 블룸이 시작되는 선형 HDR 휘도 임계값(0.0 ~ 20.0)을 반환하거나 설정합니다.
     * [EN] Returns or sets the linear HDR luminance threshold (0.0 ~ 20.0) where bloom begins.
     *
     * @defaultValue 1.0
     * @returns
     * [KO] 선형 HDR 휘도 임계값
     * [EN] Linear HDR luminance threshold
     */
    get threshold(): number {
        return this.#effect_prefilter.threshold;
    }

    set threshold(value: number) {
        this.#effect_prefilter.threshold = value;
    }

    /**
     * [KO] 임계값 전이 구간의 부드러운 2차 곡선(Soft-Knee) 비율(0.0 ~ 1.0)을 반환하거나 설정합니다.
     * [EN] Returns or sets the Soft-Knee quadratic curve ratio (0.0 ~ 1.0) in the threshold transition zone.
     *
     * @defaultValue 0.5
     * @returns
     * [KO] Soft-Knee 비율
     * [EN] Soft-Knee ratio
     */
    get softKnee(): number {
        return this.#effect_prefilter.softKnee;
    }

    set softKnee(value: number) {
        this.#effect_prefilter.softKnee = value;
    }

    /**
     * [KO] 최종 블룸 합성 강도(0.0 ~ 10.0)를 반환하거나 설정합니다.
     * [EN] Returns or sets the final bloom composition intensity (0.0 ~ 10.0).
     *
     * @defaultValue 0.675
     * @returns
     * [KO] 블룸 합성 강도
     * [EN] Bloom composition intensity
     */
    get intensity(): number {
        return this.#effect_composite.intensity;
    }

    set intensity(value: number) {
        this.#effect_composite.intensity = value;
    }

    /**
     * [KO] 다단계 밉 간 빛 확산 반경 비율(0.0 ~ 1.0)을 반환하거나 설정합니다.
     * [EN] Returns or sets the light scatter radius ratio (0.0 ~ 1.0) between mip levels.
     *
     * @defaultValue 0.65
     * @returns
     * [KO] 빛 확산 반경 비율
     * [EN] Light scatter radius ratio
     */
    get radius(): number {
        return this.#effect_upsample0.radius;
    }

    set radius(value: number) {
        this.#effect_upsample0.radius = value;
        this.#effect_upsample1.radius = value;
        this.#effect_upsample2.radius = value;
        this.#effect_upsample3.radius = value;
    }

    /**
     * [KO] 스페큘러 파이어플라이 폭주 방지를 위한 최대 HDR 휘도 클램프(1.0 ~ 200.0)를 반환하거나 설정합니다.
     * [EN] Returns or sets the maximum HDR luminance clamp (1.0 ~ 200.0) to prevent specular firefly spikes.
     *
     * @defaultValue 32.0
     * @returns
     * [KO] 최대 HDR 휘도 클램프
     * [EN] Maximum HDR luminance clamp
     */
    get maxBrightness(): number {
        return this.#effect_prefilter.maxBrightness;
    }

    set maxBrightness(value: number) {
        this.#effect_prefilter.maxBrightness = value;
    }

    /**
     * [KO] 블룸 색조 필터 객체(`ColorRGB`)를 반환합니다.
     * [EN] Returns the bloom tint color filter object (`ColorRGB`).
     *
     * @returns
     * [KO] 블룸 색조 `ColorRGB` 인스턴스
     * [EN] Bloom tint `ColorRGB` instance
     */
    get tint(): ColorRGB {
        return this.#effect_composite.tint;
    }

    /**
     * [KO] 야외 대기 및 일반 PBR 씬에 가장 자연스러운 기본 물리 카메라 블룸 프리셋(언리얼 엔진 표준 `intensity = 0.675`)을 적용합니다.
     * [EN] Applies the default natural physical camera bloom preset (Unreal Engine standard `intensity = 0.675`) suitable for outdoor atmosphere and standard PBR scenes.
     */
    setNatural(): void {
        this.threshold = 1.0;
        this.softKnee = 0.5;
        this.intensity = 0.675;
        this.radius = 0.65;
        this.maxBrightness = 32.0;
        this.tint.setColorByRGB(255, 255, 255);
    }

    /**
     * [KO] 넓고 부드러운 하이라이트 확산을 제공하는 시네마틱(Cinematic) 블룸 프리셋을 적용합니다.
     * [EN] Applies a cinematic bloom preset providing wide and smooth highlight diffusion.
     */
    setCinematic(): void {
        this.threshold = 0.8;
        this.softKnee = 0.65;
        this.intensity = 1.0;
        this.radius = 0.78;
        this.maxBrightness = 32.0;
        this.tint.setColorByRGB(255, 248, 238);
    }

    /**
     * [KO] 에미시브 네온사인, 마법 이펙트 및 SF 씬을 위한 강렬한 네온 글로우 프리셋을 적용합니다.
     * [EN] Applies an intense neon glow preset for emissive neon signs, magic effects, and sci-fi scenes.
     */
    setNeonGlow(): void {
        this.threshold = 1.0;
        this.softKnee = 0.35;
        this.intensity = 1.6;
        this.radius = 0.72;
        this.maxBrightness = 64.0;
        this.tint.setColorByRGB(255, 255, 255);
    }

    /**
     * [KO] 몽환적이고 부드러운 소프트 포커스 스타일의 드리미(Dreamy) 블룸 프리셋을 적용합니다.
     * [EN] Applies a dreamy bloom preset with an ethereal and soft-focus style.
     */
    setDreamy(): void {
        this.threshold = 0.6;
        this.softKnee = 0.85;
        this.intensity = 1.25;
        this.radius = 0.85;
        this.maxBrightness = 16.0;
        this.tint.setColorByRGB(255, 245, 250);
    }

    /**
     * [KO] 제품 컨피규레이터 및 건축 시각화를 위한 절제된 스페큘러 글로우(Subtle) 프리셋을 적용합니다.
     * [EN] Applies a subtle specular glow preset for product configurators and architectural visualization.
     */
    setSubtle(): void {
        this.threshold = 1.4;
        this.softKnee = 0.5;
        this.intensity = 0.35;
        this.radius = 0.45;
        this.maxBrightness = 32.0;
        this.tint.setColorByRGB(255, 255, 255);
    }

    /**
     * [KO] 5단계 밉체인 다운샘플링, 9-Tap Tent 업샘플링 및 최종 HDR 합성을 순차 실행합니다.
     * [EN] Sequentially executes 5-stage mip-chain downsampling, 9-Tap Tent upsampling, and final HDR composition.
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
     * [KO] 입력 원본 HDR 소스 텍스처 정보
     * [EN] Input original HDR source texture information
     * @returns
     * [KO] 블룸 합성된 최종 HDR 텍스처 정보 (`IPostEffectResult`)
     * [EN] Final HDR texture information with bloom composited (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        const pool = view.postEffectManager.texturePool;

        const w0 = Math.max(1, width >> 1);
        const h0 = Math.max(1, height >> 1);
        const w1 = Math.max(1, width >> 2);
        const h1 = Math.max(1, height >> 2);
        const w2 = Math.max(1, width >> 3);
        const h2 = Math.max(1, height >> 3);
        const w3 = Math.max(1, width >> 4);
        const h3 = Math.max(1, height >> 4);
        const w4 = Math.max(1, width >> 5);
        const h4 = Math.max(1, height >> 5);

        // 1. Progressive 13-Tap Downsample Chain (Full -> 1/2 -> 1/4 -> 1/8 -> 1/16 -> 1/32)
        const mip0 = this.#effect_prefilter.render(view, w0, h0, sourceTextureInfo);
        const mip1 = this.#effect_downsample0.render(view, w1, h1, mip0);
        const mip2 = this.#effect_downsample1.render(view, w2, h2, mip1);
        const mip3 = this.#effect_downsample2.render(view, w3, h3, mip2);
        const mip4 = this.#effect_downsample3.render(view, w4, h4, mip3);

        // 2. Progressive 9-Tap Tent Upsample Chain (1/32 -> 1/16 -> 1/8 -> 1/4 -> 1/2)
        const up3 = this.#effect_upsample3.render(view, w3, h3, mip3, mip4);
        pool.release(mip3.texture);
        pool.release(mip4.texture);

        const up2 = this.#effect_upsample2.render(view, w2, h2, mip2, up3);
        pool.release(mip2.texture);
        pool.release(up3.texture);

        const up1 = this.#effect_upsample1.render(view, w1, h1, mip1, up2);
        pool.release(mip1.texture);
        pool.release(up2.texture);

        const up0 = this.#effect_upsample0.render(view, w0, h0, mip0, up1);
        pool.release(mip0.texture);
        pool.release(up1.texture);

        // 3. Final Full-Res HDR Composite
        const compositeResult = this.#effect_composite.render(view, width, height, sourceTextureInfo, up0);
        pool.release(up0.texture);

        return compositeResult;
    }
}

Object.freeze(Bloom);
export default Bloom;
