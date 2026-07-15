import RedGPUContext from "../../../context/RedGPUContext";
import {GLTF} from "../GLTF";

export default class GLTFCacheManager {
    readonly #redGPUContext: RedGPUContext;

    readonly #gltfCacheMap: Map<string, GLTF> = new Map();
    readonly #gltfPendingMap: Map<string, Promise<any>> = new Map();

    readonly #glbCacheMap: Map<string, ArrayBuffer> = new Map();
    readonly #glbPendingMap: Map<string, Promise<ArrayBuffer>> = new Map();

    readonly #bufferCacheMap: Map<string, ArrayBuffer> = new Map();
    readonly #bufferPendingMap: Map<string, Promise<ArrayBuffer>> = new Map();

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
    }

    get gltfCache() {
        return {
            cache: this.#gltfCacheMap,
            pending: this.#gltfPendingMap
        };
    }

    get glbCache() {
        return {
            cache: this.#glbCacheMap,
            pending: this.#glbPendingMap
        };
    }

    get bufferCache() {
        return {
            cache: this.#bufferCacheMap,
            pending: this.#bufferPendingMap
        };
    }

    destroy() {
        this.#gltfCacheMap.clear();
        this.#gltfPendingMap.clear();

        this.#glbCacheMap.clear();
        this.#glbPendingMap.clear();

        this.#bufferCacheMap.clear();
        this.#bufferPendingMap.clear();
    }
}
