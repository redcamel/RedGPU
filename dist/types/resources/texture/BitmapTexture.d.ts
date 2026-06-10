import RedGPUContext from "../../context/RedGPUContext";
import ManagementResourceBase from "../core/ManagementResourceBase";
/**
 * [KO] 텍스처 소스 정보 타입입니다. 이미지 URL 문자열이거나 src와 cacheKey를 가진 객체일 수 있습니다.
 * [EN] Texture source information type. Can be an image URL string or an object with src and cacheKey.
 */
export type BitmapSrcInfo = string | {
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
    constructor(redGPUContext: RedGPUContext, src?: BitmapSrcInfo, useMipMap?: boolean, onLoad?: (textureInstance?: BitmapTexture) => void, onError?: (error: Error) => void, format?: GPUTextureFormat, usePremultiplyAlpha?: boolean);
    /**
     * [KO] 텍스처 가로 크기를 반환합니다.
     * [EN] Returns the texture width.
     *
     * @returns
     * [KO] 가로 크기 (픽셀)
     * [EN] Width in pixels
     */
    get width(): number;
    /**
     * [KO] 텍스처 세로 크기를 반환합니다.
     * [EN] Returns the texture height.
     *
     * @returns
     * [KO] 세로 크기 (픽셀)
     * [EN] Height in pixels
     */
    get height(): number;
    /**
     * [KO] 프리멀티플 알파 사용 여부를 반환합니다.
     * [EN] Returns whether premultiplied alpha is used.
     *
     * @returns
     * [KO] 프리멀티플 알파 사용 여부
     * [EN] Whether premultiplied alpha is used
     */
    get usePremultiplyAlpha(): boolean;
    /**
     * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
     * [EN] Returns the video memory usage in bytes.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Bytes)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number;
    /**
     * [KO] GPUTexture 객체를 반환합니다.
     * [EN] Returns the GPUTexture object.
     *
     * @returns
     * [KO] GPUTexture 인스턴스
     * [EN] GPUTexture instance
     */
    get gpuTexture(): GPUTexture;
    /**
     * [KO] 밉맵 레벨 개수를 반환합니다.
     * [EN] Returns the number of mipmap levels.
     *
     * @returns
     * [KO] 밉맵 레벨 개수
     * [EN] Number of mipmap levels
     */
    get mipLevelCount(): number;
    /**
     * [KO] 텍스처 소스 경로를 반환합니다.
     * [EN] Returns the texture source path.
     *
     * @returns
     * [KO] 소스 경로 문자열
     * [EN] Source path string
     */
    get src(): string;
    /**
     * [KO] 텍스처 소스 경로 설정 및 로드를 시작합니다.
     * [EN] Sets the texture source path and starts loading.
     *
     * @param value -
     * [KO] 텍스처 소스 정보
     * [EN] Texture source info
     */
    set src(value: BitmapSrcInfo);
    /**
     * [KO] 밉맵 사용 여부를 반환합니다.
     * [EN] Returns whether mipmaps are used.
     *
     * @returns
     * [KO] 밉맵 사용 여부
     * [EN] Whether mipmaps are used
     */
    get useMipmap(): boolean;
    /**
     * [KO] 밉맵 사용 여부를 설정하고 텍스처를 재생성합니다.
     * [EN] Sets whether to use mipmaps and recreates the texture.
     *
     * @param value -
     * [KO] 밉맵 사용 여부
     * [EN] Whether to use mipmaps
     */
    set useMipmap(value: boolean);
    /** [KO] 텍스처 리소스를 파괴합니다. [EN] Destroys the texture resource. */
    destroy(): void;
}
export default BitmapTexture;
