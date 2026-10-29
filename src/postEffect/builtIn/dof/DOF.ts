import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";
import calculateTextureByteSize from "../../../utils/texture/calculateTextureByteSize";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import DOF_CONFIG from "./DOF_CONFIG";
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
 * [KO] `View3D`의 `PostEffectManager.useDOF`를 `true`로 설정하여 시스템 내부에서 자동 활성화하며, `view.postEffectManager.dof`를 통해 카메라 렌즈 파라미터 및 프리셋을 제어합니다.
 * [EN] Automatically activated by the system when setting `PostEffectManager.useDOF` of `View3D` to `true`, and camera lens parameters and presets are controlled via `view.postEffectManager.dof`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 postEffectManager를 통해 DOF 활성화 및 프리셋 적용
 * // [EN] Enable DOF and apply a preset through View3D's postEffectManager
 * view.postEffectManager.useDOF = true;
 * view.postEffectManager.dof.setCinematic();
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/dof/" style="width:100%; height:500px;"></iframe>
 *
 * @see [DOF example](/RedGPU/examples/postEffect/lens/dof/)
 * @see [DOF Auto Focus example](/RedGPU/examples/postEffect/lens/dofAutoFocus/)
 * @category PostEffect
 */
class DOF extends AMultiPassPostEffect {
    #autoFocusPass: DOFAutoFocus;
    #cocDownsamplePass: DOFCoCDownsample;
    #mipDownsample1Pass: DOFMipDownsample;
    #mipDownsample2Pass: DOFMipDownsample;
    #tileMaxCoCPass: DOFTileMaxCoC;
    #bokehBlurBgPass: DOFBokehBlur;
    #bokehBlurFgPass: DOFBokehBlur;
    #postFilterBgPass: DOFPostFilter;
    #postFilterFgPass: DOFPostFilter;
    #compositePass: DOFComposite;

    #persistentFocusTexture: GPUTexture = null;
    #persistentFocusResult: IPostEffectResult = null;
    #copySrcInfo: { texture: GPUTexture } = {texture: null};
    #copyDstInfo: { texture: GPUTexture } = {texture: null};
    #copyExtent: { width: number; height: number } = {width: 1, height: 1};

    #persistentCoCTexture: GPUTexture = null;
    #persistentCoCResult: IPostEffectResult = null;
    #prevCoCHalfW: number = 0;
    #prevCoCHalfH: number = 0;
    #isCoCHistoryValid: boolean = false;
    #copyCoCSrcInfo: { texture: GPUTexture } = {texture: null};
    #copyCoCDstInfo: { texture: GPUTexture } = {texture: null};
    #copyCoCExtent: { width: number; height: number } = {width: 1, height: 1};

    #focusDistance: number = DOF_CONFIG.DEFAULT_FOCUS_DISTANCE;
    #aperture: number = DOF_CONFIG.DEFAULT_APERTURE;
    #focalLength: number = DOF_CONFIG.DEFAULT_FOCAL_LENGTH;
    #bladeCount: number = DOF_CONFIG.DEFAULT_BLADE_COUNT;
    #bokehBrightness: number = DOF_CONFIG.DEFAULT_BOKEH_BRIGHTNESS;

    #useAutoFocus: boolean = false;
    #hasRenderedManualFocus: boolean = false;
    #isAutoFocusHistoryValid: boolean = false;

    /**
     * [KO] `DOF` 인스턴스를 생성합니다.
     * [EN] Creates a `DOF` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        const autoFocusPass = new DOFAutoFocus(redGPUContext);
        const cocDownsamplePass = new DOFCoCDownsample(redGPUContext);
        const mipDownsample1Pass = new DOFMipDownsample(redGPUContext);
        const mipDownsample2Pass = new DOFMipDownsample(redGPUContext);
        const tileMaxCoCPass = new DOFTileMaxCoC(redGPUContext);
        const bokehBlurBgPass = new DOFBokehBlur(redGPUContext, DOF_CONFIG.PASS_MODE.BACKGROUND);
        const bokehBlurFgPass = new DOFBokehBlur(redGPUContext, DOF_CONFIG.PASS_MODE.FOREGROUND);
        const postFilterBgPass = new DOFPostFilter(redGPUContext, DOF_CONFIG.PASS_MODE.BACKGROUND);
        const postFilterFgPass = new DOFPostFilter(redGPUContext, DOF_CONFIG.PASS_MODE.FOREGROUND);
        const compositePass = new DOFComposite(redGPUContext);

        super(
            redGPUContext,
            [
                autoFocusPass,
                cocDownsamplePass,
                mipDownsample1Pass,
                mipDownsample2Pass,
                tileMaxCoCPass,
                bokehBlurBgPass,
                bokehBlurFgPass,
                postFilterBgPass,
                postFilterFgPass,
                compositePass
            ]
        );

        this.#autoFocusPass = autoFocusPass;
        this.#cocDownsamplePass = cocDownsamplePass;
        this.#mipDownsample1Pass = mipDownsample1Pass;
        this.#mipDownsample2Pass = mipDownsample2Pass;
        this.#tileMaxCoCPass = tileMaxCoCPass;
        this.#bokehBlurBgPass = bokehBlurBgPass;
        this.#bokehBlurFgPass = bokehBlurFgPass;
        this.#postFilterBgPass = postFilterBgPass;
        this.#postFilterFgPass = postFilterFgPass;
        this.#compositePass = compositePass;
    }

    /**
     * [KO] 모든 내부 서브패스 및 영구 초점·착란원 히스토리 텍스처의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of all internal sub-passes and persistent focus/CoC history textures.
     *
     * @returns
     * [KO] 총 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Total video memory usage (in bytes)
     */
    get videoMemorySize(): number {
        let totalSize = super.videoMemorySize;
        if (this.#persistentFocusTexture) {
            totalSize += calculateTextureByteSize(this.#persistentFocusTexture);
        }
        if (this.#persistentCoCTexture) {
            totalSize += calculateTextureByteSize(this.#persistentCoCTexture);
        }
        return totalSize;
    }

    /**
     * [KO] 초점이 맺히는 피사체 거리 $S_1$을 반환하거나 설정합니다. (단위: 월드 미터 `m`, 허용 범위: `0.1 ~ 10000`, 기본값: `15.0`)
     * [EN] Gets or sets the in-focus subject distance $S_1$. (Unit: world meters `m`, valid range: `0.1 ~ 10000`, default: `15.0`)
     *
     * @defaultValue 15.0
     * @returns
     * [KO] 피사체 초점 거리 (`m`)
     * [EN] Subject focus distance (`m`)
     */
    get focusDistance(): number {
        return this.#focusDistance;
    }

    set focusDistance(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_FOCUS_DISTANCE, DOF_CONFIG.MAX_FOCUS_DISTANCE);
        if (this.#focusDistance === value) return;
        this.#focusDistance = value;
        this.#autoFocusPass.focusDistance = value;
        this.#cocDownsamplePass.focusDistance = value;
        this.#compositePass.focusDistance = value;
    }

    /**
     * [KO] 조리개 F-값($N$, F-number)을 반환하거나 설정합니다. 낮을수록(`f/1.4`) 심도가 얕아지고 보케가 커지며, 높을수록(`f/8.0`) 전 영역이 선명해집니다. (`0.5 ~ 32.0`, 기본값: `2.0`)
     * [EN] Gets or sets the aperture F-number ($N$). Lower values (`f/1.4`) produce shallower depth of field and larger bokeh; higher values (`f/8.0`) keep the entire scene sharp. (`0.5 ~ 32.0`, default: `2.0`)
     *
     * @defaultValue 2.0
     * @returns
     * [KO] 조리개 F-값
     * [EN] Aperture F-number
     */
    get aperture(): number {
        return this.#aperture;
    }

    set aperture(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_APERTURE, DOF_CONFIG.MAX_APERTURE);
        if (this.#aperture === value) return;
        this.#aperture = value;
        this.#cocDownsamplePass.aperture = value;
        this.#compositePass.aperture = value;
    }

    /**
     * [KO] 렌즈 초점 거리 $f$(단위: `mm`)를 반환하거나 설정합니다. 망원(`85mm ~ 135mm`)일수록 배경 압축과 보케 크기가 증가합니다. (`12.0 ~ 300.0`, 기본값: `65.0`)
     * [EN] Gets or sets the lens focal length $f$ (in `mm`). Longer telephoto focal lengths (`85mm ~ 135mm`) increase background compression and bokeh size. (`12.0 ~ 300.0`, default: `65.0`)
     *
     * @defaultValue 65.0
     * @returns
     * [KO] 렌즈 초점 거리 (`mm`)
     * [EN] Lens focal length (`mm`)
     */
    get focalLength(): number {
        return this.#focalLength;
    }

    set focalLength(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_FOCAL_LENGTH, DOF_CONFIG.MAX_FOCAL_LENGTH);
        if (this.#focalLength === value) return;
        this.#focalLength = value;
        this.#cocDownsamplePass.focalLength = value;
        this.#compositePass.focalLength = value;
    }

    /**
     * [KO] 조리개 날 개수(`0 ~ 9`)를 반환하거나 설정합니다. `0 ~ 2`는 완전 원형 보케, `3 ~ 9`는 정다각형 조리개 보케를 생성합니다. (기본값: `6`)
     * [EN] Gets or sets the aperture blade count (`0 ~ 9`). `0 ~ 2` produces circular bokeh; `3 ~ 9` produces regular polygonal aperture bokeh. (Default: `6`)
     *
     * @defaultValue 6
     * @returns
     * [KO] 조리개 날 개수
     * [EN] Aperture blade count
     */
    get bladeCount(): number {
        return this.#bladeCount;
    }

    set bladeCount(value: number) {
        validateUintRange(value, DOF_CONFIG.MIN_BLADE_COUNT, DOF_CONFIG.MAX_BLADE_COUNT);
        if (this.#bladeCount === value) return;
        this.#bladeCount = value;
        this.#bokehBlurBgPass.bladeCount = value;
        this.#bokehBlurFgPass.bladeCount = value;
    }

    /**
     * [KO] 고휘도 HDR 하이라이트 보케 디스크 강조 강도를 반환하거나 설정합니다. (`0.0 ~ 5.0`, 기본값: `1.5`)
     * [EN] Gets or sets the high-luminance HDR highlight bokeh disc boost intensity. (`0.0 ~ 5.0`, default: `1.5`)
     *
     * @defaultValue 1.5
     * @returns
     * [KO] 보케 하이라이트 강조 강도
     * [EN] Bokeh highlight boost intensity
     */
    get bokehBrightness(): number {
        return this.#bokehBrightness;
    }

    set bokehBrightness(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_BOKEH_BRIGHTNESS, DOF_CONFIG.MAX_BOKEH_BRIGHTNESS);
        if (this.#bokehBrightness === value) return;
        this.#bokehBrightness = value;
        this.#bokehBlurBgPass.bokehBrightness = value;
        this.#bokehBlurFgPass.bokehBrightness = value;
    }

    /**
     * [KO] 화면 깊이 버퍼 기반 9-Point Zone 연속 자동 초점(AF-C) 활성화 여부를 반환하거나 설정합니다. (기본값: `false`)
     * [EN] Gets or sets whether screen-depth-based 9-Point Zone continuous auto-focus (AF-C) is enabled. (Default: `false`)
     *
     * @defaultValue false
     * @returns
     * [KO] 자동 초점 활성화 여부
     * [EN] Whether auto-focus is enabled
     */
    get useAutoFocus(): boolean {
        return this.#useAutoFocus;
    }

    set useAutoFocus(value: boolean) {
        const nextValue = Boolean(value);
        if (this.#useAutoFocus === nextValue) return;
        this.#useAutoFocus = nextValue;
        const flag = nextValue ? 1 : 0;
        this.#cocDownsamplePass.useAutoFocus = flag;
        this.#compositePass.useAutoFocus = flag;
        if (!nextValue) {
            this.#isAutoFocusHistoryValid = false;
        }
    }

    /**
     * [KO] 할당된 영구 초점·착란원 히스토리 텍스처 및 내부 서브패스의 바인드 그룹 캐시를 모두 정리합니다.
     * [EN] Clears allocated persistent focus/CoC history textures and bind group caches of all internal sub-passes.
     */
    clear(): void {
        this.#releasePersistentFocusTexture();
        this.#releasePersistentCoCTexture();
        this.#hasRenderedManualFocus = false;
        super.clear();
    }

    /**
     * [KO] 내부 서브패스 및 영구 초점·착란원 상태 텍스처 리소스를 영구 파기합니다.
     * [EN] Permanently destroys internal sub-passes and persistent focus/CoC state texture resources.
     */
    destroy(): void {
        this.#releasePersistentFocusTexture();
        this.#releasePersistentCoCTexture();
        this.#hasRenderedManualFocus = false;
        super.destroy();
    }

    /**
     * [KO] 표준 게임 카메라(`65mm f/2.0`, 6날 조리개) 기본 프리셋을 적용합니다.
     * [EN] Applies the standard game camera (`65mm f/2.0`, 6-blade aperture) default preset.
     */
    setGameDefault(): void {
        this.focusDistance = DOF_CONFIG.DEFAULT_FOCUS_DISTANCE;
        this.focalLength = DOF_CONFIG.DEFAULT_FOCAL_LENGTH;
        this.aperture = DOF_CONFIG.DEFAULT_APERTURE;
        this.bladeCount = DOF_CONFIG.DEFAULT_BLADE_COUNT;
        this.bokehBrightness = DOF_CONFIG.DEFAULT_BOKEH_BRIGHTNESS;
    }

    /**
     * [KO] 대구경 시네마 프라임 렌즈 스타일의 시네마틱(`85mm f/1.4`, 8날 조리개) 프리셋을 적용합니다.
     * [EN] Applies a fast cinema prime lens Cinematic (`85mm f/1.4`, 8-blade aperture) preset.
     */
    setCinematic(): void {
        this.focusDistance = 10.0;
        this.focalLength = 85.0;
        this.aperture = 1.4;
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

        const fallbackFocusResult = this.#ensurePersistentFocusTexture();

        // Stage 0: Conditional GPU-Driven 9-Point Zone Auto-Focus (skipped completely in manual focus mode)
        let currFocusResult = fallbackFocusResult;
        const isAutoFocusDispatched = this.#useAutoFocus;
        if (isAutoFocusDispatched) {
            const historyMode = this.#isAutoFocusHistoryValid
                ? DOF_CONFIG.AF_HISTORY_MODE.VALID
                : (this.#hasRenderedManualFocus ? DOF_CONFIG.AF_HISTORY_MODE.SEED_MANUAL : DOF_CONFIG.AF_HISTORY_MODE.NONE);
            this.#autoFocusPass.historyMode = historyMode;
            currFocusResult = this.#autoFocusPass.render(view, 1, 1, fallbackFocusResult);
            this.#copySrcInfo.texture = currFocusResult.texture;
            this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, this.#copyFocusStateCallback);
            this.#isAutoFocusHistoryValid = true;
            this.#hasRenderedManualFocus = false;
        } else {
            this.#hasRenderedManualFocus = true;
        }

        // Stage 1: CoC-Aware Bilateral Mip Pyramid (Mip 0: 1/2 -> Mip 1: 1/4 -> Mip 2: 1/8)
        const {useTAA} = view.redGPUContext.antialiasingManager;
        let prevCoCResult = fallbackFocusResult;
        if (useTAA) {
            prevCoCResult = this.#ensurePersistentCoCTexture(halfW, halfH);
            this.#cocDownsamplePass.historyValid = this.#isCoCHistoryValid ? 1 : 0;
        } else {
            if (this.#persistentCoCTexture) {
                this.#releasePersistentCoCTexture();
            }
            this.#cocDownsamplePass.historyValid = 0;
        }

        const cocMip0 = this.#cocDownsamplePass.render(
            view, halfW, halfH, sourceTextureInfo, currFocusResult, prevCoCResult
        );

        if (useTAA) {
            this.#copyCoCSrcInfo.texture = cocMip0.texture;
            this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, this.#copyCoCStateCallback);
            this.#isCoCHistoryValid = true;
        }

        const cocMip1 = this.#mipDownsample1Pass.render(
            view, quarterW, quarterH, cocMip0
        );
        const cocMip2 = this.#mipDownsample2Pass.render(
            view, eighthW, eighthH, cocMip1
        );

        // Stage 2: Tile Flatten & Dilate (1/16)
        const tileMaxResult = this.#tileMaxCoCPass.render(
            view, tileW, tileH, cocMip0
        );

        // Stage 3: Dual-Buffer Mip-Adaptive Diaphragm Bokeh Gather (Background & Foreground separated)
        const bgBokehResult = this.#bokehBlurBgPass.render(
            view, halfW, halfH, cocMip0, cocMip1, cocMip2, tileMaxResult
        );
        const fgBokehResult = this.#bokehBlurFgPass.render(
            view, halfW, halfH, cocMip0, cocMip1, cocMip2, tileMaxResult
        );
        pool.release(cocMip1.texture);
        pool.release(cocMip2.texture);
        pool.release(tileMaxResult.texture);

        // Stage 4: Dual-Buffer Independent PostFilter (Background & Foreground separated)
        const bgPostFiltered = this.#postFilterBgPass.render(
            view, halfW, halfH, bgBokehResult
        );
        pool.release(bgBokehResult.texture);

        const fgPostFiltered = this.#postFilterFgPass.render(
            view, halfW, halfH, fgBokehResult
        );
        pool.release(fgBokehResult.texture);

        // Stage 5: Diaphragm Recombine (Full-Res Slight-DoF 8-Tap + Bg Bilateral Blend + Fg Opacity Over)
        const finalResult = this.#compositePass.render(
            view, width, height, sourceTextureInfo, cocMip0, bgPostFiltered, fgPostFiltered, currFocusResult
        );

        if (isAutoFocusDispatched) {
            pool.release(currFocusResult.texture);
        }
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
            this.#isAutoFocusHistoryValid = false;
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
            this.#isCoCHistoryValid = false;
        }
        return this.#persistentCoCResult;
    }

    #releasePersistentFocusTexture(): void {
        if (this.#persistentFocusTexture) {
            this.#persistentFocusTexture.destroy();
            this.#persistentFocusTexture = null;
            this.#persistentFocusResult = null;
            this.#copySrcInfo.texture = null;
            this.#copyDstInfo.texture = null;
        }
        this.#isAutoFocusHistoryValid = false;
    }

    #releasePersistentCoCTexture(): void {
        if (this.#persistentCoCTexture) {
            this.#persistentCoCTexture.destroy();
            this.#persistentCoCTexture = null;
            this.#persistentCoCResult = null;
            this.#copyCoCSrcInfo.texture = null;
            this.#copyCoCDstInfo.texture = null;
        }
        this.#prevCoCHalfW = 0;
        this.#prevCoCHalfH = 0;
        this.#isCoCHistoryValid = false;
    }
}

Object.freeze(DOF);
export default DOF;
