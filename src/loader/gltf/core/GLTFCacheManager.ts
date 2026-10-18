import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {GLTF} from "../GLTF";

/**
 * [KO] GLTF JSON, GLB 바이너리, 외부 버퍼 데이터를 URL 기준으로 캐싱하고 중복 로딩 요청을 공유하는 클래스입니다.
 * [EN] Class that caches GLTF JSON, GLB binaries, and external buffer data by URL and shares pending duplicate load requests.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const gltfCacheManager = redGPUContext.resourceManager.gltfCacheManager;
 * ```
 *
 * @category GLTF
 */
class GLTFCacheManager extends RedGPUObject {
    #gltfCacheMap: Map<string, GLTF> = new Map();
    #gltfPendingMap: Map<string, Promise<any>> = new Map();

    #glbCacheMap: Map<string, ArrayBuffer> = new Map();
    #glbPendingMap: Map<string, Promise<ArrayBuffer>> = new Map();

    #bufferCacheMap: Map<string, ArrayBuffer> = new Map();
    #bufferPendingMap: Map<string, Promise<ArrayBuffer>> = new Map();

    /**
     * [KO] GLTFCacheManager 인스턴스를 생성합니다.
     * [EN] Creates a GLTFCacheManager instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] GLTF JSON 캐시 맵과 대기 중인 로딩 Promise 맵을 반환합니다.
     * [EN] Returns the GLTF JSON cache map and the pending load Promise map.
     *
     * @returns
     * [KO] `cache`(`Map<string, GLTF>`)와 `pending`(`Map<string, Promise<any>>`)을 담은 객체
     * [EN] Object containing `cache` (`Map<string, GLTF>`) and `pending` (`Map<string, Promise<any>>`)
     */
    get gltfCache() {
        return {
            cache: this.#gltfCacheMap,
            pending: this.#gltfPendingMap
        };
    }

    /**
     * [KO] GLB 바이너리 캐시 맵과 대기 중인 로딩 Promise 맵을 반환합니다.
     * [EN] Returns the GLB binary cache map and the pending load Promise map.
     *
     * @returns
     * [KO] `cache`(`Map<string, ArrayBuffer>`)와 `pending`(`Map<string, Promise<ArrayBuffer>>`)을 담은 객체
     * [EN] Object containing `cache` (`Map<string, ArrayBuffer>`) and `pending` (`Map<string, Promise<ArrayBuffer>>`)
     */
    get glbCache() {
        return {
            cache: this.#glbCacheMap,
            pending: this.#glbPendingMap
        };
    }

    /**
     * [KO] 외부 버퍼(.bin) 캐시 맵과 대기 중인 로딩 Promise 맵을 반환합니다.
     * [EN] Returns the external buffer (.bin) cache map and the pending load Promise map.
     *
     * @returns
     * [KO] `cache`(`Map<string, ArrayBuffer>`)와 `pending`(`Map<string, Promise<ArrayBuffer>>`)을 담은 객체
     * [EN] Object containing `cache` (`Map<string, ArrayBuffer>`) and `pending` (`Map<string, Promise<ArrayBuffer>>`)
     */
    get bufferCache() {
        return {
            cache: this.#bufferCacheMap,
            pending: this.#bufferPendingMap
        };
    }

    /**
     * [KO] 모든 캐시 맵과 대기 맵을 비웁니다.
     * [EN] Clears all cache maps and pending maps.
     */
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

