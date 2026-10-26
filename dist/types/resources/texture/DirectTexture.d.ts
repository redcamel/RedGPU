import RedGPUContext from "../../context/RedGPUContext";
import ADirectTexture from "./core/ADirectTexture";
/**
 * [KO] 외부에서 생성된 `GPUTexture`를 직접 주입받아 관리하는 2D 텍스처 클래스입니다.
 * [EN] 2D texture class that directly receives and manages an externally created `GPUTexture`.
 *
 * ### Example
 * ```typescript
 * const directTexture = new RedGPU.Resource.DirectTexture(redGPUContext, 'myDirectTexture', gpuTexture);
 * ```
 *
 * @category Texture
 */
declare class DirectTexture extends ADirectTexture {
    /**
     * [KO] DirectTexture 인스턴스를 생성합니다.
     * [EN] Creates a DirectTexture instance.
     *
     * ### Example
     * ```typescript
     * const directTexture = new RedGPU.Resource.DirectTexture(redGPUContext, 'myDirectTexture', gpuTexture);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param cacheKey -
     * [KO] 캐시 키 (동일 키가 존재하면 기존 인스턴스를 반환)
     * [EN] Cache key (returns the existing instance if the same key exists)
     * @param gpuTexture -
     * [KO] 외부 `GPUTexture` 인스턴스 (선택)
     * [EN] External `GPUTexture` instance (optional)
     */
    constructor(redGPUContext: RedGPUContext, cacheKey: string, gpuTexture?: GPUTexture);
    /**
     * [KO] 2D 텍스처 뷰 생성을 위한 `GPUTextureViewDescriptor`를 반환합니다.
     * [EN] Returns the `GPUTextureViewDescriptor` for creating a 2D texture view.
     *
     * @returns
     * [KO] `GPUTextureViewDescriptor` 객체
     * [EN] `GPUTextureViewDescriptor` object
     */
    get viewDescriptor(): GPUTextureViewDescriptor;
    /**
     * [KO] 텍스처를 `ResourceManager`에 등록합니다.
     * [EN] Registers the texture with `ResourceManager`.
     */
    protected registerResource(): void;
    /**
     * [KO] 텍스처를 `ResourceManager`에서 등록 해제합니다.
     * [EN] Unregisters the texture from `ResourceManager`.
     */
    protected unregisterResource(): void;
}
export default DirectTexture;
