import RedGPUContext from "../../context/RedGPUContext";
import ManagementResourceBase from "../core/ManagementResourceBase";
import { KTX2Container } from "ktx-parse";
/**
 * [KO] 비트맵 텍스처 소스 정보 타입입니다. 이미지 URL 문자열이거나 `src`와 `cacheKey`를 포함하는 객체입니다.
 * [EN] Bitmap texture source information type. Can be an image URL string or an object containing `src` and `cacheKey`.
 *
 * @category Texture
 */
export type BitmapSrcInfo = string | {
    src: string;
    cacheKey: string;
};
/**
 * [KO] 일반 이미지(PNG, JPG, WebP, SVG) 및 KTX2 압축 텍스처를 로드하여 GPU 2D 텍스처로 관리하는 클래스입니다.
 * [EN] Class that loads standard images (PNG, JPG, WebP, SVG) and KTX2 compressed textures and manages them as GPU 2D textures.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/image.png');
 * ```
 *
 * @see [BitmapTexture Sampler example](/RedGPU/examples/3d/texture/bitmapTextureSampler/)
 * @see [BitmapMaterial example](/RedGPU/examples/3d/material/bitmapMaterial/)
 * @see [KTX2 basic example](/RedGPU/examples/3d/texture/ktx2/basic/)
 * @category Texture
 */
declare class BitmapTexture extends ManagementResourceBase {
    #private;
    /**
     * [KO] BitmapTexture 인스턴스를 생성합니다. 동일한 `cacheKey`가 이미 존재할 경우 기존 캐시된 인스턴스를 반환합니다.
     * [EN] Creates a BitmapTexture instance. Returns the existing cached instance if the same `cacheKey` already exists.
     *
     * ### Example
     * ```typescript
     * const texture = new RedGPU.Resource.BitmapTexture(
     *     redGPUContext,
     *     'assets/diffuse.png',
     *     true,
     *     (loadedTexture) => {
     *         console.log('Loaded:', loadedTexture);
     *     }
     * );
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param src -
     * [KO] 텍스처 소스 경로 또는 캐시 키 포함 정보
     * [EN] Texture source path or information including cache key
     * @param useMipMap -
     * [KO] 밉맵 생성 여부 (기본값: `true`)
     * [EN] Whether to generate mipmaps (default: `true`)
     * @param onLoad -
     * [KO] 로드 완료 시 호출될 콜백 함수
     * [EN] Callback function called when loading completes
     * @param onError -
     * [KO] 로드 실패 시 호출될 콜백 함수
     * [EN] Callback function called when loading fails
     * @param format -
     * [KO] GPU 텍스처 픽셀 포맷 (기본값: 선호 캔버스 포맷의 `-srgb`)
     * [EN] GPU texture pixel format (default: preferred canvas format with `-srgb`)
     * @param usePremultiplyAlpha -
     * [KO] 알파 프리멀티플라이 적용 여부 (기본값: `false`)
     * [EN] Whether to apply premultiplied alpha (default: `false`)
     */
    constructor(redGPUContext: RedGPUContext, src?: BitmapSrcInfo, useMipMap?: boolean, onLoad?: (textureInstance?: BitmapTexture) => void, onError?: (error: Error) => void, format?: GPUTextureFormat, usePremultiplyAlpha?: boolean);
    /**
     * [KO] 텍스처의 가로 크기(픽셀)를 반환합니다.
     * [EN] Returns the width of the texture in pixels.
     *
     * @returns
     * [KO] 가로 크기 (픽셀)
     * [EN] Width in pixels
     */
    get width(): number;
    /**
     * [KO] 텍스처의 세로 크기(픽셀)를 반환합니다.
     * [EN] Returns the height of the texture in pixels.
     *
     * @returns
     * [KO] 세로 크기 (픽셀)
     * [EN] Height in pixels
     */
    get height(): number;
    /**
     * [KO] 프리멀티플 알파(Premultiplied Alpha) 사용 여부를 반환합니다.
     * [EN] Returns whether premultiplied alpha is used.
     *
     * @returns
     * [KO] 프리멀티플 알파 사용 여부
     * [EN] Whether premultiplied alpha is used
     */
    get usePremultiplyAlpha(): boolean;
    /**
     * [KO] 텍스처가 점유 중인 비디오 메모리 크기(Byte)를 반환합니다.
     * [EN] Returns the video memory size in bytes occupied by the texture.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Byte)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number;
    /**
     * [KO] 생성된 `GPUTexture` 인스턴스를 반환합니다.
     * [EN] Returns the created `GPUTexture` instance.
     *
     * @returns
     * [KO] `GPUTexture` 인스턴스
     * [EN] `GPUTexture` instance
     */
    get gpuTexture(): GPUTexture;
    /**
     * [KO] 생성된 밉맵 레벨 개수를 반환합니다.
     * [EN] Returns the number of generated mipmap levels.
     *
     * @returns
     * [KO] 밉맵 레벨 개수
     * [EN] Number of mipmap levels
     */
    get mipLevelCount(): number;
    /**
     * [KO] 텍스처 소스 경로를 반환하거나 설정합니다. 값을 변경하면 새 경로의 텍스처를 비동기로 다시 로드합니다.
     * [EN] Gets or sets the texture source path. Changing this value reloads the texture from the new path asynchronously.
     *
     * @returns
     * [KO] 텍스처 소스 경로 문자열
     * [EN] Texture source path string
     */
    get src(): string;
    /**
     * [KO] 밉맵 사용 여부를 반환하거나 설정합니다. 값을 변경하면 텍스처를 재생성합니다.
     * [EN] Gets or sets whether mipmaps are used. Changing this value recreates the texture.
     *
     * @returns
     * [KO] 밉맵 사용 여부
     * [EN] Whether mipmaps are used
     */
    get useMipmap(): boolean;
    set src(value: BitmapSrcInfo);
    /**
     * [KO] 텍스처 로드 완료 및 에러 이벤트 리스너를 추가합니다. 이미 로드가 완료되었거나 실패한 경우 마이크로태스크로 즉시 호출됩니다.
     * [EN] Adds texture load complete and error event listeners. If already loaded or failed, invoked immediately via microtask.
     *
     * @param onLoad -
     * [KO] 로드 완료 콜백 함수
     * [EN] Load complete callback function
     * @param onError -
     * [KO] 에러 발생 콜백 함수
     * [EN] Error callback function
     */
    addLoadListeners(onLoad?: (textureInstance: BitmapTexture) => void, onError?: (error: Error) => void): void;
    set useMipmap(value: boolean);
    /**
     * [KO] 텍스처 GPU 리소스를 해제하고 리소스 매니저 등록을 취소합니다.
     * [EN] Releases the texture GPU resource and unregisters it from the resource manager.
     */
    destroy(): void;
}
/**
 * [KO] KTX2 파일 파싱 결과 인터페이스입니다.
 * [EN] Interface representing the KTX2 file parsing result.
 *
 * @category Texture
 */
export interface KTX2ParseResult {
    /**
     * [KO] 파싱된 KTX2 컨테이너 객체
     * [EN] Parsed KTX2 container object
     */
    container: KTX2Container;
    /**
     * [KO] 원본 바이너리 `ArrayBuffer`
     * [EN] Raw binary `ArrayBuffer`
     */
    arrayBuffer: ArrayBuffer;
}
/**
 * [KO] 지정된 경로에서 KTX2 파일을 비동기로 로드하고 헤더 및 컨테이너 구조를 파싱합니다.
 * [EN] Asynchronously loads a KTX2 file from the specified path and parses its header and container structure.
 *
 * @param src -
 * [KO] KTX2 파일 URL 경로
 * [EN] KTX2 file URL path
 * @returns
 * [KO] 파싱된 `KTX2ParseResult` 객체를 담은 `Promise<KTX2ParseResult>`
 * [EN] `Promise<KTX2ParseResult>` containing the parsed `KTX2ParseResult` object
 * @throws
 * [KO] 네트워크 요청 실패, 잘못된 KTX2 매직 식별자, 또는 유효하지 않은 해상도일 경우 `Error` 발생
 * [EN] Throws `Error` if network request fails, KTX2 magic identifier is invalid, or dimensions are invalid
 * @category Texture
 */
export declare function loadKtx2Container(src: string): Promise<KTX2ParseResult>;
export default BitmapTexture;
