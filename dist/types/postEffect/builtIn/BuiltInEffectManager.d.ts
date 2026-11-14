import RedGPUObject from "../../base/RedGPUObject";
import AutoExposure from "./autoExposure/AutoExposure";
import type View3D from "../../display/view/View3D";
import Bloom from "./bloom/Bloom";
import ChromaticAberration from "./chromaticAberration/ChromaticAberration";
import DOF from "./dof/DOF";
import FilmGrain from "./filmGrain/FilmGrain";
import Fog from "./fog/Fog";
import HeightFog from "./heightFog/HeightFog";
import LensDistortion from "./lensDistortion/LensDistortion";
import LensFlare from "./lensFlare/LensFlare";
import SSAO from "./ssao/SSAO";
import SSR from "./ssr/SSR";
import Vignetting from "./vignetting/Vignetting";
/**
 * [KO] `View3D`의 시스템 내장(Built-in) 후처리 이펙트(`SSAO`, `SSR`, `Fog`, `HeightFog`, `DOF`, `Bloom`, `LensFlare`, `AutoExposure`, `ChromaticAberration`, `LensDistortion`, `Vignetting`, `FilmGrain`)를 통합 관리하는 클래스입니다.
 * [EN] Class that manages built-in post-processing effects (`SSAO`, `SSR`, `Fog`, `HeightFog`, `DOF`, `Bloom`, `LensFlare`, `AutoExposure`, `ChromaticAberration`, `LensDistortion`, `Vignetting`, `FilmGrain`) of a `View3D`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 builtInEffectManager를 통해 접근
 * // [EN] Access via View3D's builtInEffectManager
 * const builtInEffectManager = view.builtInEffectManager;
 * builtInEffectManager.useSSAO = true;
 * builtInEffectManager.useBloom = true;
 * builtInEffectManager.bloom.setCinematic();
 * ```
 *
 * @category PostEffect
 */
declare class BuiltInEffectManager extends RedGPUObject {
    #private;
    /**
     * [KO] `BuiltInEffectManager` 인스턴스를 생성합니다.
     * [EN] Creates a `BuiltInEffectManager` instance.
     *
     * @param view -
     * [KO] 연결할 `View3D` 인스턴스
     * [EN] `View3D` instance to bind
     */
    constructor(view: View3D);
    /**
     * [KO] 연결된 `View3D` 인스턴스를 반환합니다.
     * [EN] Returns the bound `View3D` instance.
     *
     * @returns
     * [KO] `View3D` 인스턴스
     * [EN] `View3D` instance
     */
    get view(): View3D;
    /**
     * [KO] 자동 노출(`AutoExposure`) 인스턴스가 이미 초기화되어 있는지 여부를 반환합니다.
     * [EN] Returns whether the `AutoExposure` instance has already been initialized.
     *
     * @returns
     * [KO] `AutoExposure` 초기화 여부
     * [EN] Whether `AutoExposure` is initialized
     */
    get hasAutoExposure(): boolean;
    /**
     * [KO] 자동 노출(`AutoExposure`) 인스턴스를 반환합니다.
     * [EN] Returns the `AutoExposure` instance.
     *
     * @returns
     * [KO] `AutoExposure` 인스턴스
     * [EN] `AutoExposure` instance
     */
    get autoExposure(): AutoExposure;
    /**
     * [KO] 불필요한 GPU 버퍼 지연 생성을 방지하면서 현재 뷰의 사전 노출 배율(`preExposure`)을 계산하여 반환합니다.
     * [EN] Calculates and returns the current view's pre-exposure multiplier (`preExposure`) without triggering unnecessary GPU buffer allocation.
     *
     * @returns
     * [KO] 사전 노출 배율
     * [EN] Pre-exposure multiplier
     */
    getPreExposure(): number;
    /**
     * [KO] SSAO(Screen Space Ambient Occlusion) 활성화 여부입니다.
     * [EN] Whether SSAO (Screen Space Ambient Occlusion) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] SSAO 활성화 여부
     * [EN] Whether SSAO is enabled
     */
    get useSSAO(): boolean;
    set useSSAO(value: boolean);
    /**
     * [KO] SSAO 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSAO effect instance.
     *
     * @returns
     * [KO] `SSAO` 인스턴스
     * [EN] `SSAO` instance
     */
    get ssao(): SSAO;
    /**
     * [KO] SSR(Screen Space Reflection) 활성화 여부입니다.
     * [EN] Whether SSR (Screen Space Reflection) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] SSR 활성화 여부
     * [EN] Whether SSR is enabled
     */
    get useSSR(): boolean;
    set useSSR(value: boolean);
    /**
     * [KO] SSR 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSR effect instance.
     *
     * @returns
     * [KO] `SSR` 인스턴스
     * [EN] `SSR` instance
     */
    get ssr(): SSR;
    /**
     * [KO] Fog 활성화 여부입니다.
     * [EN] Whether Fog is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] Fog 활성화 여부
     * [EN] Whether Fog is enabled
     */
    get useFog(): boolean;
    set useFog(value: boolean);
    /**
     * [KO] Fog 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the Fog effect instance.
     *
     * @returns
     * [KO] `Fog` 인스턴스
     * [EN] `Fog` instance
     */
    get fog(): Fog;
    /**
     * [KO] HeightFog 활성화 여부입니다.
     * [EN] Whether HeightFog is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] HeightFog 활성화 여부
     * [EN] Whether HeightFog is enabled
     */
    get useHeightFog(): boolean;
    set useHeightFog(value: boolean);
    /**
     * [KO] HeightFog 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the HeightFog effect instance.
     *
     * @returns
     * [KO] `HeightFog` 인스턴스
     * [EN] `HeightFog` instance
     */
    get heightFog(): HeightFog;
    /**
     * [KO] DOF(Depth of Field) 활성화 여부입니다.
     * [EN] Whether DOF (Depth of Field) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] DOF 활성화 여부
     * [EN] Whether DOF is enabled
     */
    get useDOF(): boolean;
    set useDOF(value: boolean);
    /**
     * [KO] DOF 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the DOF effect instance.
     *
     * @returns
     * [KO] `DOF` 인스턴스
     * [EN] `DOF` instance
     */
    get dof(): DOF;
    /**
     * [KO] Bloom 활성화 여부입니다.
     * [EN] Whether Bloom is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] Bloom 활성화 여부
     * [EN] Whether Bloom is enabled
     */
    get useBloom(): boolean;
    set useBloom(value: boolean);
    /**
     * [KO] Bloom 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the Bloom effect instance.
     *
     * @returns
     * [KO] `Bloom` 인스턴스
     * [EN] `Bloom` instance
     */
    get bloom(): Bloom;
    /**
     * [KO] LensFlare 활성화 여부입니다.
     * [EN] Whether LensFlare is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] LensFlare 활성화 여부
     * [EN] Whether LensFlare is enabled
     */
    get useLensFlare(): boolean;
    set useLensFlare(value: boolean);
    /**
     * [KO] LensFlare 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the LensFlare effect instance.
     *
     * @returns
     * [KO] `LensFlare` 인스턴스
     * [EN] `LensFlare` instance
     */
    get lensFlare(): LensFlare;
    /**
     * [KO] ChromaticAberration 활성화 여부입니다.
     * [EN] Whether ChromaticAberration is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] ChromaticAberration 활성화 여부
     * [EN] Whether ChromaticAberration is enabled
     */
    get useChromaticAberration(): boolean;
    set useChromaticAberration(value: boolean);
    /**
     * [KO] ChromaticAberration 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the ChromaticAberration effect instance.
     *
     * @returns
     * [KO] `ChromaticAberration` 인스턴스
     * [EN] `ChromaticAberration` instance
     */
    get chromaticAberration(): ChromaticAberration;
    /**
     * [KO] LensDistortion 활성화 여부입니다.
     * [EN] Whether LensDistortion is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] LensDistortion 활성화 여부
     * [EN] Whether LensDistortion is enabled
     */
    get useLensDistortion(): boolean;
    set useLensDistortion(value: boolean);
    /**
     * [KO] LensDistortion 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the LensDistortion effect instance.
     *
     * @returns
     * [KO] `LensDistortion` 인스턴스
     * [EN] `LensDistortion` instance
     */
    get lensDistortion(): LensDistortion;
    /**
     * [KO] Vignetting 활성화 여부입니다.
     * [EN] Whether Vignetting is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] Vignetting 활성화 여부
     * [EN] Whether Vignetting is enabled
     */
    get useVignetting(): boolean;
    set useVignetting(value: boolean);
    /**
     * [KO] Vignetting 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the Vignetting effect instance.
     *
     * @returns
     * [KO] `Vignetting` 인스턴스
     * [EN] `Vignetting` instance
     */
    get vignetting(): Vignetting;
    /**
     * [KO] FilmGrain 활성화 여부입니다.
     * [EN] Whether FilmGrain is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] FilmGrain 활성화 여부
     * [EN] Whether FilmGrain is enabled
     */
    get useFilmGrain(): boolean;
    set useFilmGrain(value: boolean);
    /**
     * [KO] FilmGrain 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the FilmGrain effect instance.
     *
     * @returns
     * [KO] `FilmGrain` 인스턴스
     * [EN] `FilmGrain` instance
     */
    get filmGrain(): FilmGrain;
    /**
     * [KO] 생성된 모든 빌트인 이펙트들의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of all initialized built-in effects.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 생성된 모든 빌트인 이펙트들의 캐시된 리소스를 비웁니다.
     * [EN] Clears cached resources of all initialized built-in effects.
     */
    clear(): void;
    /**
     * [KO] 생성된 모든 빌트인 이펙트 및 자동 노출 리소스를 파기합니다.
     * [EN] Destroys all initialized built-in effects and auto-exposure resources.
     */
    destroy(): void;
}
export default BuiltInEffectManager;
