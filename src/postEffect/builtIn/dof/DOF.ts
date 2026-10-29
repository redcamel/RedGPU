import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import DOFAutoFocus from "./dofAutoFocus/DOFAutoFocus";
import DOFBokehBlur from "./dofBokehBlur/DOFBokehBlur";
import DOFCoCDownsample from "./dofCoCDownsample/DOFCoCDownsample";
import DOFComposite from "./dofComposite/DOFComposite";
import DOFMipDownsample from "./dofMipDownsample/DOFMipDownsample";
import DOFPostFilter from "./dofPostFilter/DOFPostFilter";
import DOFTileMaxCoC from "./dofTileMaxCoC/DOFTileMaxCoC";

/**
 * [KO] 언리얼 엔진 5(`Diaphragm DOF`) 규격의 35mm 풀프레임 센서(`sensorSize = 24mm`) 기하광학 Thin-Lens 착란원(CoC), CoC-Aware 양방향 3단 밉체인(`Mip 0 ~ Mip 2`), 타일 최대 착란원 확장(`DOFTileMaxCoC`), 전/배경 Dual-Buffer 분리 정다각형 개더링, 및 풀해상도 Slight Out-of-Focus 8-Tap 직접 개더링·Recombine 기반의 차세대 물리 보케 피사계 심도(Physical Bokeh Depth of Field) 후처리 이펙트입니다.
 * [EN] Next-generation Physical Bokeh Depth of Field (DOF) post-processing effect matching Unreal Engine 5 (`Diaphragm DOF`), featuring 35mm full-frame sensor (`sensorSize = 24mm`) geometric Thin-Lens Circle of Confusion (CoC), CoC-Aware bilateral 3-level mip chain (`Mip 0 ~ Mip 2`), dilated Tile Max CoC (`DOFTileMaxCoC`), foreground/background Dual-Buffer polygonal gathering, and full-resolution Slight Out-of-Focus 8-Tap direct gathering & Recombine.
 *
 * [KO] `View3D`의 [`PostEffectManager.useDOF`](file:///D:/github/RedGPU/src/postEffect/PostEffectManager.ts)를 `true`로 설정하여 활성화하며, `view.postEffectManager.dof`를 통해 카메라 렌즈 파라미터 및 프리셋을 제어합니다.
 * [EN] Activated by setting [`PostEffectManager.useDOF`](file:///D:/github/RedGPU/src/postEffect/PostEffectManager.ts) of `View3D` to `true`, and camera lens parameters and presets are controlled via `view.postEffectManager.dof`.
 *
 * ### Example
 * ```typescript
 * view.postEffectManager.useDOF = true;
 * view.postEffectManager.dof.setCinematic();
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/dof/"></iframe>
 *
 * @category PostEffect
 */
class DOF extends AMultiPassPostEffect {
    #effect_autoFocus: DOFAutoFocus;
    #effect_cocDownsample: DOFCoCDownsample;
    #effect_mipDownsample1: DOFMipDownsample;
    #effect_mipDownsample2: DOFMipDownsample;
    #effect_tileMaxCoC: DOFTileMaxCoC;
    #effect_bokehBlurBg: DOFBokehBlur;
    #effect_bokehBlurFg: DOFBokehBlur;
    #effect_postFilterBg: DOFPostFilter;
    #effect_postFilterFg: DOFPostFilter;
    #effect_composite: DOFComposite;

    #persistentFocusTexture: GPUTexture = null;
    #persistentFocusResult: IPostEffectResult = null;
    #copySrcInfo: { texture: GPUTexture } = {texture: null};
    #copyDstInfo: { texture: GPUTexture } = {texture: null};
    #copyExtent: { width: number; height: number } = {width: 1, height: 1};

    #persistentCoCTexture: GPUTexture = null;
    #persistentCoCResult: IPostEffectResult = null;
    #prevCoCHalfW: number = 0;
    #prevCoCHalfH: number = 0;
    #cocHistoryValid: number = 0;
    #copyCoCSrcInfo: { texture: GPUTexture } = {texture: null};
    #copyCoCDstInfo: { texture: GPUTexture } = {texture: null};
    #copyCoCExtent: { width: number; height: number } = {width: 1, height: 1};

    #focusDistance: number = 15.0;
    #aperture: number = 2.0;
    #focalLength: number = 65.0;
    #sensorSize: number = 24.0;
    #maxCoC: number = 32.0;
    #bladeCount: number = 6;
    #bokehBrightness: number = 1.5;

    #useAutoFocus: boolean = false;

    /**
     * [KO] `DOF` 인스턴스를 생성합니다.
     * [EN] Creates a `DOF` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        const autoFocus = new DOFAutoFocus(redGPUContext);
        const cocDownsample = new DOFCoCDownsample(redGPUContext);
        const mipDownsample1 = new DOFMipDownsample(redGPUContext);
        const mipDownsample2 = new DOFMipDownsample(redGPUContext);
        const tileMaxCoC = new DOFTileMaxCoC(redGPUContext);
        const bokehBlurBg = new DOFBokehBlur(redGPUContext, 0);
        const bokehBlurFg = new DOFBokehBlur(redGPUContext, 1);
        const postFilterBg = new DOFPostFilter(redGPUContext, 0);
        const postFilterFg = new DOFPostFilter(redGPUContext, 1);
        const composite = new DOFComposite(redGPUContext);

        super(
            redGPUContext,
            [
                autoFocus,
                cocDownsample,
                mipDownsample1,
                mipDownsample2,
                tileMaxCoC,
                bokehBlurBg,
                bokehBlurFg,
                postFilterBg,
                postFilterFg,
                composite
            ]
        );

        this.#effect_autoFocus = autoFocus;
        this.#effect_cocDownsample = cocDownsample;
        this.#effect_mipDownsample1 = mipDownsample1;
        this.#effect_mipDownsample2 = mipDownsample2;
        this.#effect_tileMaxCoC = tileMaxCoC;
        this.#effect_bokehBlurBg = bokehBlurBg;
        this.#effect_bokehBlurFg = bokehBlurFg;
        this.#effect_postFilterBg = postFilterBg;
        this.#effect_postFilterFg = postFilterFg;
        this.#effect_composite = composite;
    }

    /**
     * [KO] 초점이 맺히는 피사체 거리 $S_1$을 반환합니다. (단위: 월드 미터 `m`, 기본값: `15.0`)
     * [EN] Returns the in-focus subject distance $S_1$. (Unit: world meters `m`, default: `15.0`)
     */
    get focusDistance(): number {
        return this.#focusDistance;
    }

    /**
     * [KO] 초점이 맺히는 피사체 거리 $S_1$을 설정합니다. (`0.1 ~ 10000`)
     * [EN] Sets the in-focus subject distance $S_1$. (`0.1 ~ 10000`)
     */
    set focusDistance(value: number) {
        validateNumberRange(value, 0.1, 10000);
        this.#focusDistance = value;
        this.#effect_autoFocus.focusDistance = value;
        this.#effect_cocDownsample.focusDistance = value;
        this.#effect_composite.focusDistance = value;
    }

    /**
     * [KO] 조리개 F-값($N$, F-number)을 반환합니다. (기본값: `2.0`)
     * [EN] Returns the aperture F-number ($N$). (Default: `2.0`)
     */
    get aperture(): number {
        return this.#aperture;
    }

    /**
     * [KO] 조리개 F-값($N$, F-number)을 설정합니다. 낮을수록(`f/1.4`) 심도가 얕아지고 보케가 커지며, 높을수록(`f/8.0`) 전 영역이 선명해집니다. (`0.5 ~ 32.0`)
     * [EN] Sets the aperture F-number ($N$). Lower values (`f/1.4`) produce shallower depth of field and larger bokeh; higher values (`f/8.0`) keep the entire scene sharp. (`0.5 ~ 32.0`)
     */
    set aperture(value: number) {
        validateNumberRange(value, 0.5, 32.0);
        this.#aperture = value;
        this.#effect_cocDownsample.aperture = value;
        this.#effect_composite.aperture = value;
    }

    /**
     * [KO] 렌즈 초점 거리 $f$ (단위: `mm`)를 반환합니다. (기본값: `65.0`)
     * [EN] Returns the lens focal length $f$ (in `mm`). (Default: `65.0`)
     */
    get focalLength(): number {
        return this.#focalLength;
    }

    /**
     * [KO] 렌즈 초점 거리 $f$ (단위: `mm`)를 설정합니다. 망원(`85mm ~ 135mm`)일수록 배경 압축과 보케 크기가 증가합니다. (`12.0 ~ 300.0`)
     * [EN] Sets the lens focal length $f$ (in `mm`). Longer telephoto focal lengths (`85mm ~ 135mm`) increase background compression and bokeh size. (`12.0 ~ 300.0`)
     */
    set focalLength(value: number) {
        validateNumberRange(value, 12.0, 300.0);
        this.#focalLength = value;
        this.#effect_cocDownsample.focalLength = value;
        this.#effect_composite.focalLength = value;
    }

    /**
     * [KO] 카메라 센서 세로 높이 $H_{\text{sensor}}$ (단위: `mm`)를 반환합니다. (기본값: `24.0`, 35mm 풀프레임 표준)
     * [EN] Returns the vertical camera sensor height $H_{\text{sensor}}$ (in `mm`). (Default: `24.0`, 35mm full-frame standard)
     */
    get sensorSize(): number {
        return this.#sensorSize;
    }

    /**
     * [KO] 카메라 센서 세로 높이 $H_{\text{sensor}}$ (단위: `mm`)를 설정합니다. (`4.0 ~ 70.0`)
     * [EN] Sets the vertical camera sensor height $H_{\text{sensor}}$ (in `mm`). (`4.0 ~ 70.0`)
     */
    set sensorSize(value: number) {
        validateNumberRange(value, 4.0, 70.0);
        this.#sensorSize = value;
        this.#effect_cocDownsample.sensorSize = value;
        this.#effect_composite.sensorSize = value;
    }

    /**
     * [KO] 최대 허용 착란원(CoC) 반경 상한(단위: 풀해상도 픽셀 `px`)을 반환합니다. (기본값: `32.0`)
     * [EN] Returns the maximum allowed Circle of Confusion (CoC) radius cap (in full-resolution pixels `px`). (Default: `32.0`)
     */
    get maxCoC(): number {
        return this.#maxCoC;
    }

    /**
     * [KO] 최대 허용 착란원(CoC) 반경 상한(단위: 풀해상도 픽셀 `px`)을 설정합니다. (`4.0 ~ 64.0`)
     * [EN] Sets the maximum allowed Circle of Confusion (CoC) radius cap (in full-resolution pixels `px`). (`4.0 ~ 64.0`)
     */
    set maxCoC(value: number) {
        validateNumberRange(value, 4.0, 64.0);
        this.#maxCoC = value;
        this.#effect_cocDownsample.maxCoC = value;
        this.#effect_tileMaxCoC.maxCoC = value;
        this.#effect_bokehBlurBg.maxCoC = value;
        this.#effect_bokehBlurFg.maxCoC = value;
        this.#effect_composite.maxCoC = value;
    }

    /**
     * [KO] 조리개 날 개수(`0 ~ 9`)를 반환합니다. (기본값: `6`)
     * [EN] Returns the aperture blade count (`0 ~ 9`). (Default: `6`)
     */
    get bladeCount(): number {
        return this.#bladeCount;
    }

    /**
     * [KO] 조리개 날 개수를 설정합니다. `0 ~ 2`는 완전 원형 보케, `3 ~ 9`는 정다각형 조리개 보케를 생성합니다.
     * [EN] Sets the aperture blade count. `0 ~ 2` produces circular bokeh; `3 ~ 9` produces regular polygonal aperture bokeh.
     */
    set bladeCount(value: number) {
        validateUintRange(value, 0, 9);
        this.#bladeCount = value;
        this.#effect_bokehBlurBg.bladeCount = value;
        this.#effect_bokehBlurFg.bladeCount = value;
    }

    /**
     * [KO] 고휘도 HDR 하이라이트 보케 디스크 강조 강도를 반환합니다. (기본값: `1.5`)
     * [EN] Returns the high-luminance HDR highlight bokeh disc boost intensity. (Default: `1.5`)
     */
    get bokehBrightness(): number {
        return this.#bokehBrightness;
    }

    /**
     * [KO] 고휘도 HDR 하이라이트 보케 디스크 강조 강도를 설정합니다. (`0.0 ~ 5.0`)
     * [EN] Sets the high-luminance HDR highlight bokeh disc boost intensity. (`0.0 ~ 5.0`)
     */
    set bokehBrightness(value: number) {
        validateNumberRange(value, 0.0, 5.0);
        this.#bokehBrightness = value;
        this.#effect_bokehBlurBg.bokehBrightness = value;
        this.#effect_bokehBlurFg.bokehBrightness = value;
    }

    /**
     * [KO] 화면 깊이 버퍼 기반 9-Point Zone 연속 자동 초점(AF-C) 활성화 여부를 반환합니다. (기본값: `false`)
     * [EN] Returns whether screen-depth-based 9-Point Zone continuous auto-focus (AF-C) is enabled. (Default: `false`)
     */
    get useAutoFocus(): boolean {
        return this.#useAutoFocus;
    }

    /**
     * [KO] 화면 깊이 버퍼 기반 9-Point Zone 연속 자동 초점(AF-C) 활성화 여부를 설정합니다.
     * [EN] Sets whether screen-depth-based 9-Point Zone continuous auto-focus (AF-C) is enabled.
     */
    set useAutoFocus(value: boolean) {
        this.#useAutoFocus = Boolean(value);
        this.#effect_autoFocus.useAutoFocus = this.#useAutoFocus ? 1 : 0;
    }

    /**
     * [KO] 내부 서브패스 및 영구 초점 상태 텍스처 리소스를 파기합니다.
     * [EN] Destroys internal sub-passes and persistent focus state texture resources.
     */
    destroy(): void {
        if (this.#persistentFocusTexture) {
            this.#persistentFocusTexture.destroy();
            this.#persistentFocusTexture = null;
            this.#persistentFocusResult = null;
            this.#copySrcInfo.texture = null;
            this.#copyDstInfo.texture = null;
        }
        if (this.#persistentCoCTexture) {
            this.#persistentCoCTexture.destroy();
            this.#persistentCoCTexture = null;
            this.#persistentCoCResult = null;
            this.#copyCoCSrcInfo.texture = null;
            this.#copyCoCDstInfo.texture = null;
            this.#prevCoCHalfW = 0;
            this.#prevCoCHalfH = 0;
            this.#cocHistoryValid = 0;
        }
        super.destroy();
    }

    /**
     * [KO] 표준 게임 카메라(`65mm f/2.0`, 6날 조리개) 기본 프리셋을 적용합니다.
     * [EN] Applies the standard game camera (`65mm f/2.0`, 6-blade aperture) default preset.
     */
    setGameDefault(): void {
        this.focusDistance = 15.0;
        this.focalLength = 65.0;
        this.aperture = 2.0;
        this.sensorSize = 24.0;
        this.maxCoC = 32.0;
        this.bladeCount = 6;
        this.bokehBrightness = 1.5;
    }

    /**
     * [KO] 대구경 시네마 프라임 렌즈 스타일의 시네마틱(`85mm f/1.4`, 8날 조리개) 프리셋을 적용합니다.
     * [EN] Applies a fast cinema prime lens Cinematic (`85mm f/1.4`, 8-blade aperture) preset.
     */
    setCinematic(): void {
        this.focusDistance = 10.0;
        this.focalLength = 85.0;
        this.aperture = 1.4;
        this.sensorSize = 24.0;
        this.maxCoC = 40.0;
        this.bladeCount = 8;
        this.bokehBrightness = 2.2;
    }

    /**
     * [KO] 원형 조리개 기반의 인물 사진(`85mm f/1.4`, 원형 보케) 프리셋을 적용합니다.
     * [EN] Applies a circular-aperture Portrait (`85mm f/1.4`, circular bokeh) preset.
     */
    setPortrait(): void {
        this.focusDistance = 7.5;
        this.focalLength = 85.0;
        this.aperture = 1.4;
        this.sensorSize = 24.0;
        this.maxCoC = 36.0;
        this.bladeCount = 0;
        this.bokehBrightness = 1.8;
    }

    /**
     * [KO] 깊은 피사계 심도를 제공하는 광각 풍경 사진(`24mm f/8.0`) 프리셋을 적용합니다.
     * [EN] Applies a wide-angle Landscape (`24mm f/8.0`) preset providing deep depth of field.
     */
    setLandscape(): void {
        this.focusDistance = 25.0;
        this.focalLength = 24.0;
        this.aperture = 8.0;
        this.sensorSize = 24.0;
        this.maxCoC = 16.0;
        this.bladeCount = 6;
        this.bokehBrightness = 1.0;
    }

    /**
     * [KO] 근접 피사체에 초점을 맞추고 배경을 부드럽게 날리는 매크로(`105mm f/2.0`, 원형 보케) 프리셋을 적용합니다.
     * [EN] Applies a close-up Macro (`105mm f/2.0`, circular bokeh) preset that focuses on near subjects and smoothly blurs the background.
     */
    setMacro(): void {
        this.focusDistance = 4.2;
        this.focalLength = 105.0;
        this.aperture = 2.0;
        this.sensorSize = 24.0;
        this.maxCoC = 44.0;
        this.bladeCount = 0;
        this.bokehBrightness = 2.4;
    }

    /**
     * [KO] 망원 액션 및 스포츠 촬영(`135mm f/2.8`) 프리셋을 적용합니다.
     * [EN] Applies a telephoto Action/Sports (`135mm f/2.8`) preset.
     */
    setSports(): void {
        this.focusDistance = 18.0;
        this.focalLength = 135.0;
        this.aperture = 2.8;
        this.sensorSize = 24.0;
        this.maxCoC = 28.0;
        this.bladeCount = 6;
        this.bokehBrightness = 1.4;
    }

    /**
     * [KO] 야간 하이라이트 보케 디스크를 극대화하는 야간 촬영(`75mm f/1.2`, 6날 정육각 보케) 프리셋을 적용합니다.
     * [EN] Applies a Night Mode (`75mm f/1.2`, 6-blade hexagonal bokeh) preset that maximizes nocturnal highlight bokeh discs.
     */
    setNightMode(): void {
        this.focusDistance = 9.0;
        this.focalLength = 75.0;
        this.aperture = 1.2;
        this.sensorSize = 24.0;
        this.maxCoC = 44.0;
        this.bladeCount = 6;
        this.bokehBrightness = 3.5;
    }

    /**
     * [KO] 언리얼 `Diaphragm DOF` 규격의 3단 CoC 밉체인(`Mip 0 ~ Mip 2`), `1/16` 타일 확장, 전/배경 Dual-Buffer 정다각형 보케 개더링, 전/배경 독립 9-Tap Tent 스무딩, 및 풀해상도 Slight-DoF 8-Tap 직접 개더링·Recombine 패스를 순차 실행합니다.
     * [EN] Sequentially executes the Unreal `Diaphragm DOF` 3-level CoC mip chain (`Mip 0 ~ Mip 2`), `1/16` tile dilation, foreground/background Dual-Buffer polygonal bokeh gathering, independent foreground/background 9-Tap Tent smoothing, and full-resolution Slight-DoF 8-Tap direct gathering & Recombine.
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
     * [KO] DOF 처리된 최종 HDR 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Final DOF-processed HDR texture information (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        const pool = view.postEffectManager.texturePool;
        const halfW = Math.max(1, width >> 1);
        const halfH = Math.max(1, height >> 1);
        const quarterW = Math.max(1, width >> 2);
        const quarterH = Math.max(1, height >> 2);
        const eighthW = Math.max(1, width >> 3);
        const eighthH = Math.max(1, height >> 3);
        const tileW = Math.max(1, Math.ceil(halfW / 8));
        const tileH = Math.max(1, Math.ceil(halfH / 8));

        // Stage 0: GPU-Driven 9-Point Zone Auto-Focus (1x1 Thread, Zero CPU Readback)
        const prevFocusResult = this.#ensurePersistentFocusTexture();
        const currFocusResult = this.#effect_autoFocus.render(view, 1, 1, prevFocusResult);
        this.#copySrcInfo.texture = currFocusResult.texture;
        this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, this.#copyFocusStateCallback);

        // Stage 1: CoC-Aware Bilateral Mip Pyramid (Mip 0: 1/2 -> Mip 1: 1/4 -> Mip 2: 1/8)
        const prevCoCResult = this.#ensurePersistentCoCTexture(halfW, halfH);
        this.#effect_cocDownsample.historyValid = this.#cocHistoryValid;
        const cocMip0 = this.#effect_cocDownsample.render(
            view, halfW, halfH, sourceTextureInfo, currFocusResult, prevCoCResult
        );
        this.#copyCoCSrcInfo.texture = cocMip0.texture;
        this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, this.#copyCoCStateCallback);
        this.#cocHistoryValid = 1;

        const cocMip1 = this.#effect_mipDownsample1.render(
            view, quarterW, quarterH, cocMip0
        );
        const cocMip2 = this.#effect_mipDownsample2.render(
            view, eighthW, eighthH, cocMip1
        );

        // Stage 2: Tile Flatten & Dilate (1/16)
        const tileMaxResult = this.#effect_tileMaxCoC.render(
            view, tileW, tileH, cocMip0
        );

        // Stage 3: Dual-Buffer Mip-Adaptive Diaphragm Bokeh Gather (Background & Foreground separated)
        const bgBokehResult = this.#effect_bokehBlurBg.render(
            view, halfW, halfH, cocMip0, cocMip1, cocMip2, tileMaxResult
        );
        const fgBokehResult = this.#effect_bokehBlurFg.render(
            view, halfW, halfH, cocMip0, cocMip1, cocMip2, tileMaxResult
        );
        pool.release(cocMip1.texture);
        pool.release(cocMip2.texture);
        pool.release(tileMaxResult.texture);

        // Stage 4: Dual-Buffer Independent PostFilter (Background & Foreground separated)
        const bgPostFiltered = this.#effect_postFilterBg.render(
            view, halfW, halfH, bgBokehResult, cocMip0
        );
        pool.release(bgBokehResult.texture);

        const fgPostFiltered = this.#effect_postFilterFg.render(
            view, halfW, halfH, fgBokehResult, cocMip0
        );
        pool.release(fgBokehResult.texture);

        // Stage 5: Diaphragm Recombine (Full-Res Slight-DoF 8-Tap + Bg Bilateral Blend + Fg Opacity Over)
        const finalResult = this.#effect_composite.render(
            view, width, height, sourceTextureInfo, cocMip0, bgPostFiltered, fgPostFiltered, currFocusResult
        );

        pool.release(currFocusResult.texture);
        pool.release(cocMip0.texture);
        pool.release(bgPostFiltered.texture);
        pool.release(fgPostFiltered.texture);

        return finalResult;
    }

    #copyFocusStateCallback = (encoder: GPUCommandEncoder): void => {
        if (this.#copySrcInfo.texture && this.#copyDstInfo.texture) {
            encoder.copyTextureToTexture(this.#copySrcInfo, this.#copyDstInfo, this.#copyExtent);
        }
    };

    #copyCoCStateCallback = (encoder: GPUCommandEncoder): void => {
        if (this.#copyCoCSrcInfo.texture && this.#copyCoCDstInfo.texture) {
            encoder.copyTextureToTexture(this.#copyCoCSrcInfo, this.#copyCoCDstInfo, this.#copyCoCExtent);
        }
    };

    #ensurePersistentFocusTexture(): IPostEffectResult {
        if (!this.#persistentFocusTexture) {
            const {resourceManager} = this;
            const texture = resourceManager.createManagedTexture({
                size: {width: 1, height: 1},
                format: 'rgba16float',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
                label: 'DOF_PersistentFocusState_1x1'
            });
            const textureView = resourceManager.getGPUResourceBitmapTextureView(texture);
            this.#persistentFocusTexture = texture;
            this.#persistentFocusResult = {texture, textureView};
            this.#copyDstInfo.texture = texture;
        }
        return this.#persistentFocusResult;
    }

    #ensurePersistentCoCTexture(halfW: number, halfH: number): IPostEffectResult {
        if (!this.#persistentCoCTexture || this.#prevCoCHalfW !== halfW || this.#prevCoCHalfH !== halfH) {
            if (this.#persistentCoCTexture) {
                this.#persistentCoCTexture.destroy();
            }
            const {resourceManager} = this;
            const texture = resourceManager.createManagedTexture({
                size: {width: halfW, height: halfH},
                format: 'rgba16float',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
                label: `DOF_PersistentCoCMip0_${halfW}x${halfH}`
            });
            const textureView = resourceManager.getGPUResourceBitmapTextureView(texture);
            this.#persistentCoCTexture = texture;
            this.#persistentCoCResult = {texture, textureView};
            this.#copyCoCDstInfo.texture = texture;
            this.#copyCoCExtent.width = halfW;
            this.#copyCoCExtent.height = halfH;
            this.#prevCoCHalfW = halfW;
            this.#prevCoCHalfH = halfH;
            this.#cocHistoryValid = 0;
        }
        return this.#persistentCoCResult;
    }
}

Object.freeze(DOF);
export default DOF;
