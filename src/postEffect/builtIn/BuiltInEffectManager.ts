import RedGPUObject from "../../base/RedGPUObject";
import AutoExposure from "../../camera/core/autoExposure/AutoExposure";
import View3D from "../../display/view/View3D";
import keepLog from "../../utils/keepLog";
import Bloom from "./bloom/Bloom";
import DOF from "./dof/DOF";
import SSAO from "./ssao/SSAO";
import SSR from "./ssr/SSR";

/**
 * [KO] `View3D`의 시스템 내장(Built-in) 후처리 이펙트(`SSAO`, `SSR`, `DOF`, `Bloom`, `AutoExposure`)를 통합 관리하는 클래스입니다.
 * [EN] Class that manages built-in post-processing effects (`SSAO`, `SSR`, `DOF`, `Bloom`, `AutoExposure`) of a `View3D`.
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

    #calcVideoMemory() {
        this.#videoMemorySize = 0;
        if (this.#ssao) this.#videoMemorySize += this.#ssao.videoMemorySize;
        if (this.#ssr) this.#videoMemorySize += this.#ssr.videoMemorySize;
        if (this.#dof) this.#videoMemorySize += this.#dof.videoMemorySize;
        if (this.#bloom) this.#videoMemorySize += this.#bloom.videoMemorySize;
    }
}

Object.freeze(BuiltInEffectManager);
export default BuiltInEffectManager;
