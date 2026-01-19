import RedGPUContext from "../../context/RedGPUContext";
import ManagementResourceBase from "../core/ManagementResourceBase";
type SrcInfo = string | {
    src: string;
    cacheKey: string;
};
/**
 * [KO] 비트맵 이미지를 사용하는 텍스처 클래스입니다.
 * [EN] Texture class that uses bitmap images.
 *
 * * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/image.png');
 * ```
 * @category Texture
 */
declare class BitmapTexture extends ManagementResourceBase {
    #private;
    /**
     * [KO] BitmapTexture 인스턴스를 생성합니다.
     * [EN] Creates a BitmapTexture instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param src -
     * [KO] 텍스처 소스 정보 (URL 또는 객체)
     * [EN] Texture source information (URL or object)
     * @param useMipMap -
     * [KO] 밉맵 사용 여부 (기본값: true)
     * [EN] Whether to use mipmaps (default: true)
     * @param onLoad -
     * [KO] 로드 완료 콜백
     * [EN] Load complete callback
     * @param onError -
     * [KO] 에러 콜백
     * [EN] Error callback
     * @param format -
     * [KO] 텍스처 포맷 (선택)
     * [EN] Texture format (optional)
     * @param usePremultiplyAlpha -
     * [KO] 프리멀티플 알파 사용 여부 (기본값: false)
     * [EN] Whether to use premultiplied alpha (default: false)
     */
    constructor(redGPUContext: RedGPUContext, src?: SrcInfo, useMipMap?: boolean, onLoad?: (textureInstance?: BitmapTexture) => void, onError?: (error: Error) => void, format?: GPUTextureFormat, usePremultiplyAlpha?: boolean);
    /** [KO] 텍스처 가로 크기 [EN] Texture width */
    get width(): number;
    /** [KO] 텍스처 세로 크기 [EN] Texture height */
    get height(): number;
    /** [KO] 프리멀티플 알파 사용 여부를 반환합니다. [EN] Returns whether premultiplied alpha is used. */
    get usePremultiplyAlpha(): boolean;
    /** [KO] 비디오 메모리 사용량(byte)을 반환합니다. [EN] Returns the video memory usage in bytes. */
    get videoMemorySize(): number;
    /** [KO] GPUTexture 객체를 반환합니다. [EN] Returns the GPUTexture object. */
    get gpuTexture(): GPUTexture;
    /** [KO] 밉맵 레벨 개수를 반환합니다. [EN] Returns the number of mipmap levels. */
    get mipLevelCount(): number;
    /** [KO] 텍스처 소스 경로를 반환합니다. [EN] Returns the texture source path. */
    get src(): string;
    /** [KO] 텍스처 소스 경로 설정 및 로드를 시작합니다. [EN] Sets the texture source path and starts loading. */
    set src(value: SrcInfo);
    /** [KO] 밉맵 사용 여부를 반환합니다. [EN] Returns whether mipmaps are used. */
    get useMipmap(): boolean;
    /** [KO] 밉맵 사용 여부를 설정하고 텍스처를 재생성합니다. [EN] Sets whether to use mipmaps and recreates the texture. */
    set useMipmap(value: boolean);
    /** [KO] 텍스처 리소스를 파괴합니다. [EN] Destroys the texture resource. */
    destroy(): void;
}
export default BitmapTexture;
