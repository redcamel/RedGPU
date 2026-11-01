import RedGPUObject from "../../base/RedGPUObject";
import AutoExposure from "./autoExposure/AutoExposure";
import View3D from "../../display/view/View3D";
import keepLog from "../../utils/keepLog";
import Bloom from "./bloom/Bloom";
import DOF from "./dof/DOF";
import FilmGrain from "./filmGrain/FilmGrain";
import LensDistortion from "./lensDistortion/LensDistortion";
import SSAO from "./ssao/SSAO";
import SSR from "./ssr/SSR";
import Vignetting from "./vignetting/Vignetting";

/**
 * [KO] `View3D`의 시스템 내장(Built-in) 후처리 이펙트(`SSAO`, `SSR`, `DOF`, `Bloom`, `AutoExposure`, `LensDistortion`, `Vignetting`, `FilmGrain`)를 통합 관리하는 클래스입니다.
 * [EN] Class that manages built-in post-processing effects (`SSAO`, `SSR`, `DOF`, `Bloom`, `AutoExposure`, `LensDistortion`, `Vignetting`, `FilmGrain`) of a `View3D`.
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
class BuiltInEffectManager extends RedGPUObject {
    #view: View3D;
    #ssao: SSAO;
    #useSSAO: boolean = false;
    #ssr: SSR;
    #useSSR: boolean = false;
    #dof: DOF;
    #useDOF: boolean = false;
    #bloom: Bloom;
    #useBloom: boolean = false;
    #lensDistortion: LensDistortion;
    #useLensDistortion: boolean = false;
    #vignetting: Vignetting;
    #useVignetting: boolean = false;
    #filmGrain: FilmGrain;
    #useFilmGrain: boolean = false;
    #autoExposure: AutoExposure;
    #videoMemorySize: number = 0;
    #destroyed: boolean = false;

    /**
     * [KO] `BuiltInEffectManager` 인스턴스를 생성합니다.
     * [EN] Creates a `BuiltInEffectManager` instance.
     *
     * @param view -
     * [KO] 연결할 `View3D` 인스턴스
     * [EN] `View3D` instance to bind
     */
    constructor(view: View3D) {
        super(view.redGPUContext);
        this.#view = view;
    }

    /**
     * [KO] 연결된 `View3D` 인스턴스를 반환합니다.
     * [EN] Returns the bound `View3D` instance.
     *
     * @returns
     * [KO] `View3D` 인스턴스
     * [EN] `View3D` instance
     */
    get view(): View3D {
        return this.#view;
    }

    /**
     * [KO] 자동 노출(`AutoExposure`) 인스턴스를 반환합니다.
     * [EN] Returns the `AutoExposure` instance.
     *
     * @returns
     * [KO] `AutoExposure` 인스턴스
     * [EN] `AutoExposure` instance
     */
    get autoExposure(): AutoExposure {
        if (!this.#autoExposure) {
            this.#autoExposure = new AutoExposure(this.#view);
        }
        return this.#autoExposure;
    }

    /**
     * [KO] SSAO(Screen Space Ambient Occlusion) 활성화 여부입니다.
     * [EN] Whether SSAO (Screen Space Ambient Occlusion) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] SSAO 활성화 여부
     * [EN] Whether SSAO is enabled
     */
    get useSSAO(): boolean {
        return this.#useSSAO;
    }

    set useSSAO(value: boolean) {
        this.#useSSAO = value;
        this.#checkSSAO();
    }

    /**
     * [KO] SSAO 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSAO effect instance.
     *
     * @returns
     * [KO] `SSAO` 인스턴스
     * [EN] `SSAO` instance
     */
    get ssao(): SSAO {
        if (!this.#ssao) {
            this.#ssao = new SSAO(this.#view.redGPUContext);
        }
        return this.#ssao;
    }

    /**
     * [KO] SSR(Screen Space Reflection) 활성화 여부입니다.
     * [EN] Whether SSR (Screen Space Reflection) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] SSR 활성화 여부
     * [EN] Whether SSR is enabled
     */
    get useSSR(): boolean {
        return this.#useSSR;
    }

    set useSSR(value: boolean) {
        this.#useSSR = value;
        this.#checkSSR();
    }

    /**
     * [KO] SSR 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSR effect instance.
     *
     * @returns
     * [KO] `SSR` 인스턴스
     * [EN] `SSR` instance
     */
    get ssr(): SSR {
        if (!this.#ssr) {
            this.#ssr = new SSR(this.#view.redGPUContext);
        }
        return this.#ssr;
    }

    /**
     * [KO] DOF(Depth of Field) 활성화 여부입니다.
     * [EN] Whether DOF (Depth of Field) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] DOF 활성화 여부
     * [EN] Whether DOF is enabled
     */
    get useDOF(): boolean {
        return this.#useDOF;
    }

    set useDOF(value: boolean) {
        this.#useDOF = value;
        this.#checkDOF();
    }

    /**
     * [KO] DOF 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the DOF effect instance.
     *
     * @returns
     * [KO] `DOF` 인스턴스
     * [EN] `DOF` instance
     */
    get dof(): DOF {
        if (!this.#dof) {
            this.#dof = new DOF(this.#view.redGPUContext);
        }
        return this.#dof;
    }

    /**
     * [KO] Bloom 활성화 여부입니다.
     * [EN] Whether Bloom is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] Bloom 활성화 여부
     * [EN] Whether Bloom is enabled
     */
    get useBloom(): boolean {
        return this.#useBloom;
    }

    set useBloom(value: boolean) {
        this.#useBloom = value;
        this.#checkBloom();
    }

    /**
     * [KO] Bloom 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the Bloom effect instance.
     *
     * @returns
     * [KO] `Bloom` 인스턴스
     * [EN] `Bloom` instance
     */
    get bloom(): Bloom {
        if (!this.#bloom) {
            this.#bloom = new Bloom(this.#view.redGPUContext);
        }
        return this.#bloom;
    }

    /**
     * [KO] LensDistortion 활성화 여부입니다.
     * [EN] Whether LensDistortion is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] LensDistortion 활성화 여부
     * [EN] Whether LensDistortion is enabled
     */
    get useLensDistortion(): boolean {
        return this.#useLensDistortion;
    }

    set useLensDistortion(value: boolean) {
        this.#useLensDistortion = value;
        this.#checkLensDistortion();
    }

    /**
     * [KO] LensDistortion 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the LensDistortion effect instance.
     *
     * @returns
     * [KO] `LensDistortion` 인스턴스
     * [EN] `LensDistortion` instance
     */
    get lensDistortion(): LensDistortion {
        if (!this.#lensDistortion) {
            this.#lensDistortion = new LensDistortion(this.#view.redGPUContext);
        }
        return this.#lensDistortion;
    }

    /**
     * [KO] Vignetting 활성화 여부입니다.
     * [EN] Whether Vignetting is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] Vignetting 활성화 여부
     * [EN] Whether Vignetting is enabled
     */
    get useVignetting(): boolean {
        return this.#useVignetting;
    }

    set useVignetting(value: boolean) {
        this.#useVignetting = value;
        this.#checkVignetting();
    }

    /**
     * [KO] Vignetting 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the Vignetting effect instance.
     *
     * @returns
     * [KO] `Vignetting` 인스턴스
     * [EN] `Vignetting` instance
     */
    get vignetting(): Vignetting {
        if (!this.#vignetting) {
            this.#vignetting = new Vignetting(this.#view.redGPUContext);
        }
        return this.#vignetting;
    }

    /**
     * [KO] FilmGrain 활성화 여부입니다.
     * [EN] Whether FilmGrain is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] FilmGrain 활성화 여부
     * [EN] Whether FilmGrain is enabled
     */
    get useFilmGrain(): boolean {
        return this.#useFilmGrain;
    }

    set useFilmGrain(value: boolean) {
        this.#useFilmGrain = value;
        this.#checkFilmGrain();
    }

    /**
     * [KO] FilmGrain 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the FilmGrain effect instance.
     *
     * @returns
     * [KO] `FilmGrain` 인스턴스
     * [EN] `FilmGrain` instance
     */
    get filmGrain(): FilmGrain {
        if (!this.#filmGrain) {
            this.#filmGrain = new FilmGrain(this.#view.redGPUContext);
        }
        return this.#filmGrain;
    }

    /**
     * [KO] 생성된 모든 빌트인 이펙트들의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of all initialized built-in effects.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number {
        this.#calcVideoMemory();
        return this.#videoMemorySize;
    }

    /**
     * [KO] 생성된 모든 빌트인 이펙트들의 캐시된 리소스를 비웁니다.
     * [EN] Clears cached resources of all initialized built-in effects.
     */
    clear() {
        if (this.#ssao) this.#ssao.clear();
        if (this.#ssr) this.#ssr.clear();
        if (this.#dof) this.#dof.clear();
        if (this.#bloom) this.#bloom.clear();
        if (this.#lensDistortion) this.#lensDistortion.clear();
        if (this.#vignetting) this.#vignetting.clear();
        if (this.#filmGrain) this.#filmGrain.clear();
    }

    /**
     * [KO] 생성된 모든 빌트인 이펙트 및 자동 노출 리소스를 파기합니다.
     * [EN] Destroys all initialized built-in effects and auto-exposure resources.
     */
    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true;

        if (this.#ssao) {
            this.#ssao.destroy();
            this.#ssao = null;
        }
        if (this.#ssr) {
            this.#ssr.destroy();
            this.#ssr = null;
        }
        if (this.#dof) {
            this.#dof.destroy();
            this.#dof = null;
        }
        if (this.#bloom) {
            this.#bloom.destroy();
            this.#bloom = null;
        }
        if (this.#lensDistortion) {
            this.#lensDistortion.destroy();
            this.#lensDistortion = null;
        }
        if (this.#vignetting) {
            this.#vignetting.destroy();
            this.#vignetting = null;
        }
        if (this.#filmGrain) {
            this.#filmGrain.destroy();
            this.#filmGrain = null;
        }
        if (this.#autoExposure) {
            this.#autoExposure.destroy();
            this.#autoExposure = null;
        }
        keepLog(`🧹 ${this.#view.name} BuiltInEffectManager destroy 완료`);
    }

    #checkSSAO() {
        if (!this.#ssao && this.#useSSAO) {
            this.#ssao = new SSAO(this.#view.redGPUContext);
        }
    }

    #checkSSR() {
        if (!this.#ssr && this.#useSSR) {
            this.#ssr = new SSR(this.#view.redGPUContext);
        }
    }

    #checkDOF() {
        if (!this.#dof && this.#useDOF) {
            this.#dof = new DOF(this.#view.redGPUContext);
        }
    }

    #checkBloom() {
        if (!this.#bloom && this.#useBloom) {
            this.#bloom = new Bloom(this.#view.redGPUContext);
        }
    }

    #checkLensDistortion() {
        if (!this.#lensDistortion && this.#useLensDistortion) {
            this.#lensDistortion = new LensDistortion(this.#view.redGPUContext);
        }
    }

    #checkVignetting() {
        if (!this.#vignetting && this.#useVignetting) {
            this.#vignetting = new Vignetting(this.#view.redGPUContext);
        }
    }

    #checkFilmGrain() {
        if (!this.#filmGrain && this.#useFilmGrain) {
            this.#filmGrain = new FilmGrain(this.#view.redGPUContext);
        }
    }

    #calcVideoMemory() {
        this.#videoMemorySize = 0;
        if (this.#ssao) this.#videoMemorySize += this.#ssao.videoMemorySize;
        if (this.#ssr) this.#videoMemorySize += this.#ssr.videoMemorySize;
        if (this.#dof) this.#videoMemorySize += this.#dof.videoMemorySize;
        if (this.#bloom) this.#videoMemorySize += this.#bloom.videoMemorySize;
        if (this.#lensDistortion) this.#videoMemorySize += this.#lensDistortion.videoMemorySize;
        if (this.#vignetting) this.#videoMemorySize += this.#vignetting.videoMemorySize;
        if (this.#filmGrain) this.#videoMemorySize += this.#filmGrain.videoMemorySize;
    }
}

Object.freeze(BuiltInEffectManager);
export default BuiltInEffectManager;
