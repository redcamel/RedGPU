import RedGPUContext from "../../../context/RedGPUContext";
/** [KO] 컴포넌트 매핑 타입 정의 [EN] Component mapping type definition */
type ComponentMapping = {
    r?: 'r' | 'g' | 'b' | 'a';
    g?: 'r' | 'g' | 'b' | 'a';
    b?: 'r' | 'g' | 'b' | 'a';
    a?: 'r' | 'g' | 'b' | 'a';
};
/**
 * [KO] 여러 텍스처의 채널을 조합해 하나의 텍스처로 패킹하는 유틸리티 클래스입니다.
 * [EN] Utility class that packs channels from multiple textures into a single texture.
 *
 * [KO] r, g, b, a 각 채널에 서로 다른 텍스처의 특정 채널을 할당하여 메모리 사용량을 줄이고 렌더링 효율을 높일 수 있습니다.
 * [EN] By assigning specific channels from different textures to the r, g, b, and a channels, you can reduce memory usage and increase rendering efficiency.
 *
 * * ### Example
 * ```typescript
 * const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
 * await packed.packing({
 *   r: texture1.gpuTexture,
 *   g: texture2.gpuTexture
 * }, 512, 512);
 * ```
 * @category Texture
 */
declare class PackedTexture {
    #private;
    /**
     * [KO] PackedTexture 인스턴스를 생성합니다.
     * [EN] Creates a PackedTexture instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /** [KO] 인스턴스 고유 식별자 [EN] Instance unique identifier */
    get uuid(): string;
    /** [KO] 패킹 결과 GPUTexture 객체 [EN] Packed result GPUTexture object */
    get gpuTexture(): GPUTexture;
    /** [KO] 패킹 텍스처 캐시 맵을 반환합니다. [EN] Returns the packed texture cache map. */
    static getCacheMap(): Map<string, {
        gpuTexture: GPUTexture;
        useNum: number;
        mappingKey: string;
        uuid: string;
    }>;
    /**
     * [KO] 여러 텍스처의 채널을 조합해 패킹 텍스처를 생성합니다.
     * [EN] Creates a packed texture by combining channels from multiple textures.
     * @param textures -
     * [KO] r/g/b/a 채널별 소스 GPUTexture 객체 맵
     * [EN] Source GPUTexture object map for each r/g/b/a channel
     * @param width -
     * [KO] 결과 텍스처 너비
     * [EN] Resulting texture width
     * @param height -
     * [KO] 결과 텍스처 높이
     * [EN] Resulting texture height
     * @param label -
     * [KO] 텍스처 레이블 (선택)
     * [EN] Texture label (optional)
     * @param componentMapping -
     * [KO] 컴포넌트 매핑 정보 (선택)
     * [EN] Component mapping info (optional)
     */
    packing(textures: {
        r?: GPUTexture;
        g?: GPUTexture;
        b?: GPUTexture;
        a?: GPUTexture;
    }, width: number, height: number, label?: string, componentMapping?: ComponentMapping): Promise<void>;
    /** [KO] 인스턴스를 파괴하고 캐시를 관리합니다. [EN] Destroys the instance and manages the cache. */
    destroy(): void;
}
export default PackedTexture;
