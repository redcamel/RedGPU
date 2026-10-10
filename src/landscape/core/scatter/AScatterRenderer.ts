/**
 * [KO] 스캐터(잔디, 식생 등) 렌더러를 위한 Zero-GC GPURenderBundle 캐싱 및 실행 추상 베이스 모듈입니다.
 * [EN] Abstract base module for Zero-GC GPURenderBundle caching and execution for scatter (grass, foliage, etc.) renderers.
 * @packageDocumentation
 */
import RedGPUObject from "../../../base/RedGPUObject";
import RedGPUContext from "../../../context/RedGPUContext";
import type View3D from "../../../display/view/View3D";

/**
 * [KO] GPURenderBundle 캐싱, 섀도우 패스 캐스케이드 상태 관리 및 Zero-GC executeBundles 단일 배열 재사용 인프라를 제공하는 추상 클래스입니다.
 * [EN] Abstract class providing GPURenderBundle caching, shadow pass cascade state management, and Zero-GC executeBundles single-array reuse infrastructure.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부 추상 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is a system-internal abstract class.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
abstract class AScatterRenderer<TMainBundleCache = any> extends RedGPUObject {
    /** 메인 패스 GPURenderBundle 캐시 (View3D 키 기반) */
    #mainBundlesByView: WeakMap<View3D, TMainBundleCache> = new WeakMap();

    /** Zero-GC executeBundles 단일 배열 재사용 (매 프레임 임시 배열 할당 방지) */
    #singleBundleArray: [GPURenderBundle] = [null as any];

    /** 256B 정렬 Dynamic Offset UBO 바인딩용 재사용 배열 */
    #dynamicOffsetArray: Uint32Array = new Uint32Array(1);

    /** 캐스케이드 그림자 맵(CSM) 렌더 번들 캐시 (최대 4개 캐스케이드) */
    #shadowRenderBundles: (GPURenderBundle | null)[] = [null, null, null, null];
    #shadowBundleValid: boolean[] = [false, false, false, false];
    #lastSystemBGByCascade: (GPUBindGroup | null)[] = [null, null, null, null];

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 256바이트 정렬 동적 오프셋 바인딩용 재사용 Uint32Array(1)를 반환합니다.
     * [EN] Returns the reusable Uint32Array(1) for 256-byte aligned dynamic offset binding.
     */
    get dynamicOffsetArray(): Uint32Array {
        return this.#dynamicOffsetArray;
    }

    /**
     * [KO] View3D별 메인 GPURenderBundle 캐시 WeakMap을 반환합니다.
     * [EN] Returns the WeakMap cache of main GPURenderBundles per View3D.
     */
    get mainBundlesByView(): WeakMap<View3D, TMainBundleCache> {
        return this.#mainBundlesByView;
    }

    /**
     * [KO] 단일 GPURenderBundle을 임시 배열 할당 없이(Zero-GC) 패스 인코더에 실행합니다.
     * [EN] Executes a single GPURenderBundle to the pass encoder with zero GC allocation.
     * @param passEncoder - GPURenderPassEncoder 인스턴스
     * @param bundle - 실행할 GPURenderBundle
     */
    executeSingleBundle(passEncoder: GPURenderPassEncoder, bundle: GPURenderBundle): void {
        this.#singleBundleArray[0] = bundle;
        passEncoder.executeBundles(this.#singleBundleArray);
    }

    /**
     * [KO] 특정 캐스케이드 인덱스의 캐시된 그림자 렌더 번들을 가져옵니다.
     * [EN] Gets the cached shadow render bundle for a specific cascade index.
     * @param cascadeIndex - 캐스케이드 인덱스 (0 ~ 3)
     */
    getShadowBundle(cascadeIndex: number): GPURenderBundle | null {
        return this.#shadowRenderBundles[cascadeIndex];
    }

    /**
     * [KO] 특정 캐스케이드 인덱스의 그림자 렌더 번들 및 관련 상태를 캐시에 저장합니다.
     * [EN] Sets the shadow render bundle and associated state for a specific cascade index in cache.
     * @param cascadeIndex - 캐스케이드 인덱스 (0 ~ 3)
     * @param bundle - 캐시할 GPURenderBundle (실패 시 null)
     * @param systemBG - 현재 바인딩된 시스템 유니폼 바인드그룹
     */
    setShadowBundle(cascadeIndex: number, bundle: GPURenderBundle | null, systemBG: GPUBindGroup | null): void {
        if (cascadeIndex < 0 || cascadeIndex >= 4) return;
        this.#shadowRenderBundles[cascadeIndex] = bundle;
        this.#shadowBundleValid[cascadeIndex] = !!bundle;
        this.#lastSystemBGByCascade[cascadeIndex] = systemBG;
    }

    /**
     * [KO] 특정 캐스케이드의 그림자 번들이 유효하고 시스템 바인드그룹과 일치하는지 여부를 검사합니다.
     * [EN] Checks whether the shadow bundle for a specific cascade is valid and matches the system bind group.
     * @param cascadeIndex - 캐스케이드 인덱스 (0 ~ 3)
     * @param systemBG - 현재 시스템 유니폼 바인드그룹
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
     * [KO] 캐시된 모든 그림자 패스 렌더 번들을 무효화합니다.
     * [EN] Invalidates all cached shadow pass render bundles.
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
     * [KO] 그림자 번들이 무효화될 때 자식 클래스에서 도메인 고유 캐시를 정리할 수 있는 확장 훅 메서드입니다.
     * [EN] Extension hook method for child classes to clean up domain-specific caches when shadow bundles are invalidated.
     */
    onShadowBundleDirty(): void {
    }

    /**
     * [KO] 캐시된 모든 메인 패스 렌더 번들을 무효화하여 다음 렌더링 시 재생성하도록 합니다.
     * [EN] Invalidates all cached main pass render bundles to force regeneration on the next render.
     */
    markMainBundleDirty(): void {
        this.#mainBundlesByView = new WeakMap();
        this.onMainBundleDirty();
    }

    /**
     * [KO] 메인 패스 렌더 번들이 무효화될 때 자식 클래스에서 도메인 고유 캐시를 정리할 수 있는 확장 훅 메서드입니다.
     * [EN] Extension hook method for child classes to clean up domain-specific caches when main bundles are invalidated.
     */
    onMainBundleDirty(): void {
    }

    /**
     * [KO] 모든 렌더 번들 및 캐시를 일괄 무효화합니다.
     * [EN] Invalidates all render bundles and caches at once.
     */
    abstract markAllBundlesDirty(): void;

    /**
     * [KO] 렌더러가 점유한 번들 캐시 및 단일 배열 참조를 안전하게 해제합니다.
     * [EN] Safely releases bundle caches and single-array references held by the renderer.
     */
    destroy(): void {
        this.markShadowBundleDirty();
        this.markMainBundleDirty();
        this.#singleBundleArray[0] = null as any;
    }
}

Object.freeze(AScatterRenderer);
export default AScatterRenderer;
