import RedGPUContext from "../context/RedGPUContext";
import calculateTextureByteSize from "../utils/texture/calculateTextureByteSize";

/**
 * [KO] 후처리용 텍스처 풀링 클래스입니다.
 * [EN] Texture pooling class for post-processing.
 *
 * [KO] 후처리 과정에서 발생하는 임시 텍스처들을 재사용하여 비디오 메모리 점유율과 생성/파괴 오버헤드를 줄입니다.
 * [EN] Reduces video memory occupancy and creation/destruction overhead by reusing temporary textures generated during post-processing.
 */
class PostEffectTexturePool {
    #redGPUContext: RedGPUContext;
    #pool: Map<string, GPUTexture[]> = new Map();
    #activeTextures: Set<GPUTexture> = new Set();
    #videoMemorySize: number = 0;

    // 통계 관련 필드
    #peakActiveCount: number = 0;
    #allocationCount: number = 0;
    #requestCount: number = 0;

    /**
     * [KO] PostEffectTexturePool 인스턴스를 생성합니다.
     * [EN] Creates a PostEffectTexturePool instance.
     * @param redGPUContext - RedGPU 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
    }


    /**
     * [KO] 풀 내의 전체 비디오 메모리 사용량(bytes)을 반환합니다.
     * [EN] Returns the total video memory usage (bytes) in the pool.
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] 풀 내의 전체 텍스처 개수(활성 + 유휴)를 반환합니다.
     * [EN] Returns the total number of textures in the pool (active + idle).
     */
    get totalCount(): number {
        return this.activeCount + this.idleCount;
    }

    /**
     * [KO] 현재 사용 중인 활성 텍스처 개수를 반환합니다.
     * [EN] Returns the number of currently active textures.
     */
    get activeCount(): number {
        return this.#activeTextures.size;
    }

    /**
     * [KO] 풀에서 대기 중인 유휴 텍스처 개수를 반환합니다.
     * [EN] Returns the number of idle textures waiting in the pool.
     */
    get idleCount(): number {
        let count = 0;
        this.#pool.forEach(list => count += list.length);
        return count;
    }

    /**
     * [KO] 역대 최대 동시 활성 텍스처 수를 반환합니다.
     * [EN] Returns the historical peak number of concurrently active textures.
     */
    get peakActiveCount(): number {
        return this.#peakActiveCount;
    }

    /**
     * [KO] 신규로 생성된 총 텍스처 횟수를 반환합니다.
     * [EN] Returns the total number of newly created textures.
     */
    get allocationCount(): number {
        return this.#allocationCount;
    }

    /**
     * [KO] 재사용 적중률(Hit Rate)을 반환합니다. (0~1)
     * [EN] Returns the reuse hit rate. (0~1)
     */
    get hitRate(): number {
        if (this.#requestCount === 0) return 0;
        return (this.#requestCount - this.#allocationCount) / this.#requestCount;
    }

    /**
     * [KO] 풀에 담긴 상세 내역을 반환합니다.
     * [EN] Returns the detailed breakdown of the pool.
     */
    getDetails() {
        const details = [];
        this.#pool.forEach((list, key) => {
            const activeCount = [...this.#activeTextures].filter(t => `${t.width}x${t.height}_${t.format}` === key).length;
            details.push({
                key,
                total: list.length + activeCount,
                active: activeCount,
                idle: list.length
            });
        });
        return details;
    }

    /**
     * [KO] 적절한 텍스처를 풀에서 가져오거나 새로 생성합니다.
     * [EN] Gets a suitable texture from the pool or creates a new one.
     * @param width - 텍스처 너비
     * @param height - 텍스처 높이
     * @param format - 텍스처 포맷 (기본값: 'rgba16float')
     * @returns 할당된 GPUTexture
     */
    alloc(width: number, height: number, format: GPUTextureFormat = 'rgba16float'): GPUTexture {
        this.#requestCount++;
        const key = `${width}x${height}_${format}`;
        let list = this.#pool.get(key);
        if (!list) {
            list = [];
            this.#pool.set(key, list);
        }

        let texture: GPUTexture;
        if (list.length > 0) {
            texture = list.shift()!;
        } else {
            // [KO] 신규 생성 시에만 메모리 사이즈를 가산합니다.
            // [EN] Add to memory size only when a new texture is created.
            this.#allocationCount++;
            texture = this.#redGPUContext.resourceManager.createManagedTexture({
                size: {width, height},
                format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                label: `PostEffectTexturePool_${key}`
            });
            this.#videoMemorySize += calculateTextureByteSize(texture);
        }
        this.#activeTextures.add(texture);

        // 최대 활성수 업데이트
        if (this.#activeTextures.size > this.#peakActiveCount) {
            this.#peakActiveCount = this.#activeTextures.size;
        }

        return texture;
    }

    /**
     * [KO] 특정 텍스처를 풀로 반환합니다.
     * [EN] Returns a specific texture to the pool.
     * @param texture - 반환할 GPUTexture
     */
    release(texture: GPUTexture): void {
        if (this.#activeTextures.has(texture)) {
            this.#activeTextures.delete(texture);
            const key = `${texture.width}x${texture.height}_${texture.format}`;
            let list = this.#pool.get(key);
            if (!list) {
                list = [];
                this.#pool.set(key, list);
            }
            list.push(texture);
        }
    }

    /**
     * [KO] 사용 중인 모든 텍스처를 풀로 반환합니다.
     * [EN] Returns all active textures to the pool.
     */
    releaseAll(): void {
        this.#activeTextures.forEach(texture => {
            const key = `${texture.width}x${texture.height}_${texture.format}`;
            let list = this.#pool.get(key);
            if (!list) {
                list = [];
                this.#pool.set(key, list);
            }
            list.push(texture);
        });
        this.#activeTextures.clear();
    }

    /**
     * [KO] 풀에 있는 모든 텍스처를 파기합니다.
     * [EN] Destroys all textures in the pool.
     */
    clear(): void {
        this.releaseAll();
        this.#pool.forEach(list => {
            list.forEach(texture => texture.destroy());
        });
        this.#pool.clear();
        this.#videoMemorySize = 0; // [KO] 모든 자원이 파기되었으므로 0으로 리셋 [EN] Reset to 0 as all resources are destroyed.
        this.#peakActiveCount = 0;
        this.#allocationCount = 0;
        this.#requestCount = 0;
    }
}

export default PostEffectTexturePool;
