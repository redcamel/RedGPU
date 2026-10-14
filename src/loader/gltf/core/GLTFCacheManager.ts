import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {GLTF} from "../GLTF";

class GLTFCacheManager extends RedGPUObject {
    #gltfCacheMap: Map<string, GLTF> = new Map();
    #gltfPendingMap: Map<string, Promise<any>> = new Map();

    #glbCacheMap: Map<string, ArrayBuffer> = new Map();
    #glbPendingMap: Map<string, Promise<ArrayBuffer>> = new Map();

    #bufferCacheMap: Map<string, ArrayBuffer> = new Map();
    #bufferPendingMap: Map<string, Promise<ArrayBuffer>> = new Map();

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
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

Object.freeze(GLTFCacheManager);
export default GLTFCacheManager;

