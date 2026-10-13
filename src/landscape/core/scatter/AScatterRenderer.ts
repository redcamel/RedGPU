import RedGPUObject from "../../../base/RedGPUObject";
import RedGPUContext from "../../../context/RedGPUContext";
import type View3D from "../../../display/view/View3D";

abstract class AScatterRenderer<TMainBundleCache = any> extends RedGPUObject {
    #mainBundlesByView: WeakMap<View3D, TMainBundleCache> = new WeakMap();

    #singleBundleArray: [GPURenderBundle] = [null as any];

    #dynamicOffsetArray: Uint32Array = new Uint32Array(1);

    #shadowRenderBundles: (GPURenderBundle | null)[] = [null, null, null, null];
    #shadowBundleValid: boolean[] = [false, false, false, false];
    #lastSystemBGByCascade: (GPUBindGroup | null)[] = [null, null, null, null];

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    get dynamicOffsetArray(): Uint32Array {
        return this.#dynamicOffsetArray;
    }

    get mainBundlesByView(): WeakMap<View3D, TMainBundleCache> {
        return this.#mainBundlesByView;
    }

    executeSingleBundle(passEncoder: GPURenderPassEncoder, bundle: GPURenderBundle): void {
        this.#singleBundleArray[0] = bundle;
        passEncoder.executeBundles(this.#singleBundleArray);
    }

    getShadowBundle(cascadeIndex: number): GPURenderBundle | null {
        return this.#shadowRenderBundles[cascadeIndex];
    }

    setShadowBundle(cascadeIndex: number, bundle: GPURenderBundle | null, systemBG: GPUBindGroup | null): void {
        if (cascadeIndex < 0 || cascadeIndex >= 4) return;
        this.#shadowRenderBundles[cascadeIndex] = bundle;
        this.#shadowBundleValid[cascadeIndex] = !!bundle;
        this.#lastSystemBGByCascade[cascadeIndex] = systemBG;
    }

    isShadowBundleValid(cascadeIndex: number, systemBG: GPUBindGroup | null): boolean {
        return (
            cascadeIndex >= 0 &&
            cascadeIndex < 4 &&
            this.#shadowBundleValid[cascadeIndex] &&
            this.#lastSystemBGByCascade[cascadeIndex] === systemBG
        );
    }

    markShadowBundleDirty(): void {
        for (let i = 0; i < 4; i++) {
            this.#shadowRenderBundles[i] = null;
            this.#shadowBundleValid[i] = false;
            this.#lastSystemBGByCascade[i] = null;
        }
        this.onShadowBundleDirty();
    }

    onShadowBundleDirty(): void {
    }

    markMainBundleDirty(): void {
        this.#mainBundlesByView = new WeakMap();
        this.onMainBundleDirty();
    }

    onMainBundleDirty(): void {
    }

    abstract markAllBundlesDirty(): void;

    destroy(): void {
        this.markShadowBundleDirty();
        this.markMainBundleDirty();
        this.#singleBundleArray[0] = null as any;
    }
}

Object.freeze(AScatterRenderer);
export default AScatterRenderer;

