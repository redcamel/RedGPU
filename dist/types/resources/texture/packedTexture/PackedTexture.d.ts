import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 결과 텍스처의 각 채널(r/g/b/a)이 소스 텍스처의 어느 채널을 읽을지 지정하는 매핑 타입입니다.
 * [EN] Mapping type specifying which source texture channel each output channel (r/g/b/a) reads from.
 *
 * [KO] 생략된 채널은 동일한 이름의 채널을 사용합니다. (예: `r` 생략 시 `'r'`)
 * [EN] Omitted channels use the channel of the same name. (e.g. `'r'` when `r` is omitted)
 *
 * @category Texture
 */
export type ComponentMapping = {
    r?: 'r' | 'g' | 'b' | 'a';
    g?: 'r' | 'g' | 'b' | 'a';
    b?: 'r' | 'g' | 'b' | 'a';
    a?: 'r' | 'g' | 'b' | 'a';
};
/**
 * [KO] 여러 소스 텍스처의 채널을 조합하여 하나의 `rgba8unorm` 텍스처로 패킹합니다.
 * [EN] Packs channels from multiple source textures into a single `rgba8unorm` texture.
 *
 * [KO] 동일한 소스/매핑 조합의 결과는 `PackedTextureManager`에 캐시되어 참조 카운트 방식으로 공유됩니다.
 * [EN] Results with the same source/mapping combination are cached in `PackedTextureManager` and shared via reference counting.
 *
 * ### Example
 * ```typescript
 * const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
 * await packed.packing({
 *   r: texture1.gpuTexture,
 *   g: texture2.gpuTexture
 * }, 512, 512);
 * ```
 *
 * @category Texture
 */
declare class PackedTexture extends RedGPUObject {
    #private;
    /**
     * [KO] PackedTexture 인스턴스를 생성합니다.
     * [EN] Creates a PackedTexture instance.
     *
     * ### Example
     * ```typescript
     * const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 패킹 결과 GPUTexture입니다.
     * [EN] Packed result GPUTexture.
     *
     * @returns
     * [KO] GPUTexture 인스턴스
     * [EN] GPUTexture instance
     */
    get gpuTexture(): GPUTexture;
    /**
     * [KO] 소스 텍스처들의 채널을 조합해 패킹 텍스처를 생성합니다.
     * [EN] Creates a packed texture by combining channels of the source textures.
     *
     * [KO] 모든 소스가 비어 있으면 아무 작업도 하지 않으며, 동일한 조합이 이미 캐시되어 있으면 캐시를 재사용합니다.
     * [EN] Does nothing if all sources are empty, and reuses the cache if the same combination already exists.
     *
     * ### Example
     * ```typescript
     * await packed.packing(
     *   {r: aoTexture.gpuTexture, g: roughnessTexture.gpuTexture, b: metallicTexture.gpuTexture},
     *   1024, 1024, 'ORM_TEXTURE'
     * );
     * ```
     *
     * @param textures -
     * [KO] 채널(r/g/b/a)별 소스 GPUTexture 맵
     * [EN] Source GPUTexture map per channel (r/g/b/a)
     * @param width -
     * [KO] 결과 텍스처 너비
     * [EN] Resulting texture width
     * @param height -
     * [KO] 결과 텍스처 높이
     * [EN] Resulting texture height
     * @param label -
     * [KO] 결과 텍스처 레이블 (선택)
     * [EN] Resulting texture label (optional)
     * @param componentMapping -
     * [KO] 채널 매핑 정보 (선택)
     * [EN] Channel mapping info (optional)
     * @param commandEncoder -
     * [KO] 외부 커맨드 인코더 (선택, 생략 시 내부 인코더를 생성하여 즉시 제출)
     * [EN] External command encoder (optional; if omitted, an internal encoder is created and submitted immediately)
     */
    packing(textures: {
        r?: GPUTexture;
        g?: GPUTexture;
        b?: GPUTexture;
        a?: GPUTexture;
    }, width: number, height: number, label?: string, componentMapping?: ComponentMapping, commandEncoder?: GPUCommandEncoder): Promise<void>;
    /**
     * [KO] 캐시 참조 카운트를 감소시키고, 더 이상 참조되지 않는 GPUTexture는 지연 파괴합니다.
     * [EN] Decreases the cache reference count and defers destruction of GPUTextures no longer referenced.
     */
    destroy(): void;
}
export default PackedTexture;
