import RedGPUObject from "../../../base/RedGPUObject";
import RedGPUContext from "../../../context/RedGPUContext";
import type View3D from "../../../display/view/View3D";

/**
 * [KO] 스캐터 시스템의 메인 패스 및 그림자 캐스케이드 패스용 `GPURenderBundle` 캐싱과 실행을 담당하는 추상 렌더러 클래스입니다.
 * [EN] Abstract renderer class responsible for caching and executing `GPURenderBundle` instances for the main pass and shadow cascade passes of the scatter system.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @typeParam TMainBundleCache -
 * [KO] `View3D`별로 캐싱되는 메인 패스 렌더 번들 캐시 엔트리 타입
 * [EN] Main pass render bundle cache entry type cached per `View3D`
 *
 * @category Landscape
 */
abstract class AScatterRenderer<TMainBundleCache = any> extends RedGPUObject {
    #mainBundlesByView: WeakMap<View3D, TMainBundleCache> = new WeakMap();

    #singleBundleArray: [GPURenderBundle] = [null as any];

    #dynamicOffsetArray: Uint32Array = new Uint32Array(1);

    #shadowRenderBundles: (GPURenderBundle | null)[] = [null, null, null, null];
    #shadowBundleValid: boolean[] = [false, false, false, false];
    #lastSystemBGByCascade: (GPUBindGroup | null)[] = [null, null, null, null];

    /**
     * [KO] `AScatterRenderer` 인스턴스를 초기화합니다.
     * [EN] Initializes an `AScatterRenderer` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 동적 유니폼 오프셋 바인딩 시 임시 배열 할당을 방지하기 위한 재사용 가능한 1요소 `Uint32Array`를 반환합니다.
     * [EN] Returns a reusable 1-element `Uint32Array` to prevent temporary array allocations when binding dynamic uniform offsets.
     *
     * @returns
     * [KO] 동적 유니폼 오프셋용 1요소 `Uint32Array`
     * [EN] 1-element `Uint32Array` for dynamic uniform offsets
     */
    get dynamicOffsetArray(): Uint32Array {
        return this.#dynamicOffsetArray;
    }

    /**
     * [KO] `View3D`를 키로 하여 메인 렌더 번들 캐시를 관리하는 `WeakMap<View3D, TMainBundleCache>`를 반환합니다.
     * [EN] Returns the `WeakMap<View3D, TMainBundleCache>` managing main render bundle caches keyed by `View3D`.
     *
     * @returns
     * [KO] 뷰별 메인 렌더 번들 캐시 (`WeakMap<View3D, TMainBundleCache>`)
     * [EN] Per-view main render bundle cache (`WeakMap<View3D, TMainBundleCache>`)
     */
    get mainBundlesByView(): WeakMap<View3D, TMainBundleCache> {
        return this.#mainBundlesByView;
    }

    /**
     * [KO] 사전 할당된 고정 튜플 배열을 재사용하여 단일 `GPURenderBundle`을 Zero-GC로 실행합니다.
     * [EN] Executes a single `GPURenderBundle` with Zero-GC by reusing a pre-allocated fixed tuple array.
     *
     * @param passEncoder -
     * [KO] 번들을 실행할 대상 렌더 패스 인코더
     * [EN] Target render pass encoder on which to execute the bundle
     * @param bundle -
     * [KO] 실행할 `GPURenderBundle` 인스턴스
     * [EN] `GPURenderBundle` instance to execute
     */
    executeSingleBundle(passEncoder: GPURenderPassEncoder, bundle: GPURenderBundle): void {
        this.#singleBundleArray[0] = bundle;
        passEncoder.executeBundles(this.#singleBundleArray);
    }

    /**
     * [KO] 지정된 그림자 캐스케이드 인덱스에 캐싱된 `GPURenderBundle`을 반환합니다.
     * [EN] Returns the cached `GPURenderBundle` for the specified shadow cascade index.
     *
     * @param cascadeIndex -
     * [KO] 조회할 그림자 캐스케이드 인덱스 (`0`~`3`)
     * [EN] Shadow cascade index (`0`~`3`) to look up
     * @returns
     * [KO] 캐싱된 `GPURenderBundle` 또는 없을 경우 `null`
     * [EN] Cached `GPURenderBundle`, or `null` if none exists
     */
    getShadowBundle(cascadeIndex: number): GPURenderBundle | null {
        return this.#shadowRenderBundles[cascadeIndex];
    }

    /**
     * [KO] 지정된 그림자 캐스케이드 인덱스에 `GPURenderBundle`과 시스템 바인드 그룹 참조를 캐싱합니다.
     * [EN] Caches a `GPURenderBundle` and system bind group reference for the specified shadow cascade index.
     *
     * @param cascadeIndex -
     * [KO] 대상 그림자 캐스케이드 인덱스 (`0`~`3`)
     * [EN] Target shadow cascade index (`0`~`3`)
     * @param bundle -
     * [KO] 저장할 `GPURenderBundle` 또는 `null`
     * [EN] `GPURenderBundle` to store, or `null`
     * @param systemBG -
     * [KO] 번들 기록에 사용된 시스템 유니폼 바인드 그룹
     * [EN] System uniform bind group used when recording the bundle
     */
    setShadowBundle(cascadeIndex: number, bundle: GPURenderBundle | null, systemBG: GPUBindGroup | null): void {
        if (cascadeIndex < 0 || cascadeIndex >= 4) return;
        this.#shadowRenderBundles[cascadeIndex] = bundle;
        this.#shadowBundleValid[cascadeIndex] = !!bundle;
        this.#lastSystemBGByCascade[cascadeIndex] = systemBG;
    }

    /**
     * [KO] 지정된 그림자 캐스케이드의 렌더 번들이 현재 시스템 바인드 그룹과 일치하고 유효한지 확인합니다.
     * [EN] Checks whether the render bundle for the specified shadow cascade is valid and matches the current system bind group.
     *
     * @param cascadeIndex -
     * [KO] 확인할 그림자 캐스케이드 인덱스 (`0`~`3`)
     * [EN] Shadow cascade index (`0`~`3`) to check
     * @param systemBG -
     * [KO] 현재 프레임의 시스템 유니폼 바인드 그룹
     * [EN] Current frame's system uniform bind group
     * @returns
     * [KO] 캐싱된 그림자 번들의 유효 여부
     * [EN] Whether the cached shadow bundle is valid
     */
    isShadowBundleValid(cascadeIndex: number, systemBG: GPUBindGroup | null): boolean {
        return (
            cascadeIndex >= 0 &&
            cascadeIndex < 4 &&
            this.#shadowBundleValid[cascadeIndex] &&
            this.#lastSystemBGByCascade[cascadeIndex] === systemBG
        );
    }

    /**
     * [KO] 모든 그림자 캐스케이드 렌더 번들 캐시를 무효화하고 `onShadowBundleDirty` 훅을 호출합니다.
     * [EN] Invalidates all shadow cascade render bundle caches and invokes the `onShadowBundleDirty` hook.
     */
    markShadowBundleDirty(): void {
        for (let i = 0; i < 4; i++) {
            this.#shadowRenderBundles[i] = null;
            this.#shadowBundleValid[i] = false;
            this.#lastSystemBGByCascade[i] = null;
        }
        this.onShadowBundleDirty();
    }

    /**
     * [KO] 그림자 렌더 번들이 무효화될 때 서브클래스에서 추가 상태를 초기화하기 위한 훅 메서드입니다.
     * [EN] Hook method for subclasses to reset additional state when shadow render bundles are invalidated.
     */
    onShadowBundleDirty(): void {
    }

    /**
     * [KO] 모든 뷰의 메인 패스 렌더 번들 캐시를 무효화하고 `onMainBundleDirty` 훅을 호출합니다.
     * [EN] Invalidates main pass render bundle caches for all views and invokes the `onMainBundleDirty` hook.
     */
    markMainBundleDirty(): void {
        this.#mainBundlesByView = new WeakMap();
        this.onMainBundleDirty();
    }

    /**
     * [KO] 메인 패스 렌더 번들이 무효화될 때 서브클래스에서 추가 상태를 초기화하기 위한 훅 메서드입니다.
     * [EN] Hook method for subclasses to reset additional state when main pass render bundles are invalidated.
     */
    onMainBundleDirty(): void {
    }

    /**
     * [KO] 메인 패스 및 그림자 패스의 모든 렌더 번들 캐시를 일괄 무효화합니다.
     * [EN] Invalidates all render bundle caches for both main and shadow passes.
     */
    abstract markAllBundlesDirty(): void;

    /**
     * [KO] 캐싱된 모든 렌더 번들 참조를 해제하고 렌더러를 파기합니다.
     * [EN] Releases all cached render bundle references and destroys the renderer.
     */
    destroy(): void {
        this.markShadowBundleDirty();
        this.markMainBundleDirty();
        this.#singleBundleArray[0] = null as any;
    }
}

Object.freeze(AScatterRenderer);
export default AScatterRenderer;
