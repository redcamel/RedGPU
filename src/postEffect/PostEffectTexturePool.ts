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
//TODO 현재는 할당이 한프레임에 누적으로 되어있는데 스마트하게 알아서 할당되는 구조를 가져야할듯
    /**
     * [KO] 적절한 텍스처를 풀에서 가져오거나 새로 생성합니다.
     * [EN] Gets a suitable texture from the pool or creates a new one.
     * @param width - 텍스처 너비
     * @param height - 텍스처 높이
     * @param format - 텍스처 포맷 (기본값: 'rgba16float')
     * @returns 할당된 GPUTexture
     */
    alloc(width: number, height: number, format: GPUTextureFormat = 'rgba16float'): GPUTexture {
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
            texture = this.#redGPUContext.resourceManager.createManagedTexture({
                size: {width, height},
                format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                label: `PostEffectTexturePool_${key}`
            });
            this.#videoMemorySize += calculateTextureByteSize(texture);
        }
        this.#activeTextures.add(texture);
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
    }
}

export default PostEffectTexturePool;
