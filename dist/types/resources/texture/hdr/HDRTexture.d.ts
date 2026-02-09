import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
type SrcInfo = string | {
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
    constructor(redGPUContext: RedGPUContext, src: SrcInfo, onLoad?: (textureInstance?: HDRTexture) => void, onError?: (error: Error) => void);
    /** [KO] 텍스처 가로 크기 [EN] Texture width */
    get width(): number;
    /** [KO] 텍스처 세로 크기 [EN] Texture height */
    get height(): number;
    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    get videoMemorySize(): number;
    /** [KO] GPUTexture 객체 [EN] GPUTexture object */
    get gpuTexture(): GPUTexture;
    /** [KO] 텍스처 소스 경로 [EN] Texture source path */
    get src(): string;
    /**
     * [KO] 텍스처 소스 경로 설정 및 로드를 시작합니다.
     * [EN] Sets the texture source path and starts loading.
     *
     * @param value -
     * [KO] 설정할 소스 정보
     * [EN] Source info to set
     */
    set src(value: SrcInfo);
    /** [KO] 리소스를 파괴합니다. [EN] Destroys the texture resource. */
    destroy(): void;
}
export default HDRTexture;
