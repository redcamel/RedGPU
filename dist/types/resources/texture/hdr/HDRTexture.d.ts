import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
/**
 * [KO] HDR 텍스처 소스 정보 타입입니다. 이미지 URL 문자열이거나 src와 cacheKey를 가진 객체일 수 있습니다.
 * [EN] HDR texture source information type. Can be an image URL string or an object with src and cacheKey.
 */
export type HDRSrcInfo = string | {
    src: string;
    cacheKey: string;
};
/**
 * [KO] Radiance HDR(.hdr) 파일을 사용하는 2D 텍스처 클래스입니다.
 * [EN] 2D texture class that uses Radiance HDR (.hdr) files.
 *
 * [KO] .hdr 파일을 로드하여 rgba16float 포맷의 2D GPUTexture를 생성합니다. 라이트맵, 투영 텍스처 또는 IBL의 원천 데이터로 사용됩니다.
 * [EN] Loads .hdr files to create a 2D GPUTexture in rgba16float format. Used as source data for lightmaps, projected textures, or IBL.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'path/to/image.hdr');
 * ```
 * @category Texture
 */
declare class HDRTexture extends ManagementResourceBase {
    #private;
    /**
     * [KO] HDRTexture 인스턴스를 생성합니다.
     * [EN] Creates an HDRTexture instance.
     *
     * ### Example
     * ```typescript
     * const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'assets/hdr/sky.hdr', (v) => {
     *     console.log('Loaded:', v);
     * });
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param src -
     * [KO] HDR 파일 경로 또는 정보
     * [EN] HDR file path or information
     * @param onLoad -
     * [KO] 로드 완료 콜백
     * [EN] Load complete callback
     * @param onError -
     * [KO] 에러 콜백
     * [EN] Error callback
     */
    constructor(redGPUContext: RedGPUContext, src: HDRSrcInfo, onLoad?: (textureInstance?: HDRTexture) => void, onError?: (error: Error) => void);
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
     * [KO] 텍스처 소스 경로를 반환합니다.
     * [EN] Returns the texture source path.
     *
     * @returns
     * [KO] 소스 경로
     * [EN] Source path
     */
    get src(): string;
    /**
     * [KO] 텍스처 소스 경로 설정 및 로드를 시작합니다.
     * [EN] Sets the texture source path and starts loading.
     *
     * @param value -
     * [KO] 설정할 소스 정보
     * [EN] Source info to set
     */
    set src(value: HDRSrcInfo);
    /** [KO] 리소스를 파괴합니다. [EN] Destroys the texture resource. */
    destroy(): void;
}
export default HDRTexture;
