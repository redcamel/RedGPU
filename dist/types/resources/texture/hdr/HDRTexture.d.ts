import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
type SrcInfo = string | {
    src: string;
    cacheKey: string;
};
/**
 * [KO] Radiance HDR(.hdr) 파일을 사용하는 텍스처 클래스입니다.
 * [EN] Texture class that uses Radiance HDR (.hdr) files.
 *
 * [KO] GGX 중요도 샘플링을 통해 거칠기별로 프리필터링된 큐브맵을 생성합니다.
 * [EN] Generates pre-filtered cubemaps for each roughness through GGX importance sampling.
 *
 * * ### Example
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
     * @param cubeMapSize -
     * [KO] 생성될 큐브맵의 한 면 크기
     * [EN] Size of one side of the generated cubemap
     * @param useMipMap -
     * [KO] 밉맵 사용 여부 (IBL 사용 시 필수)
     * [EN] Whether to use mipmaps (required for IBL)
     */
    constructor(redGPUContext: RedGPUContext, src: SrcInfo, onLoad?: (textureInstance?: HDRTexture) => void, onError?: (error: Error) => void, cubeMapSize?: number, useMipMap?: boolean);
    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    get videoMemorySize(): number;
    /** [KO] GPUTexture 객체 [EN] GPUTexture object */
    get gpuTexture(): GPUTexture;
    /** [KO] 밉맵 레벨 개수 [EN] Number of mipmap levels */
    get mipLevelCount(): number;
    /** [KO] 텍스처 소스 경로 [EN] Texture source path */
    get src(): string;
    /** [KO] 텍스처 소스 경로 설정 및 로드를 시작합니다. [EN] Sets the texture source path and starts loading. */
    set src(value: SrcInfo);
    /** [KO] 밉맵 사용 여부 [EN] Whether to use mipmaps */
    get useMipmap(): boolean;
    /** [KO] 밉맵 사용 여부를 설정하고 텍스처를 재생성합니다. [EN] Sets whether to use mipmaps and recreates the texture. */
    set useMipmap(value: boolean);
    /** [KO] 뷰 디스크립터를 반환합니다. [EN] Returns the view descriptor. */
    get viewDescriptor(): {
        mipLevelCount: number;
        format?: GPUTextureFormat;
        dimension?: GPUTextureViewDimension;
        usage?: GPUTextureUsageFlags;
        aspect?: GPUTextureAspect;
        baseMipLevel?: GPUIntegerCoordinate;
        baseArrayLayer?: GPUIntegerCoordinate;
        arrayLayerCount?: GPUIntegerCoordinate;
        swizzle?: string;
        label?: string;
    };
    /**
     * [KO] 지정된 경로가 지원하는 HDR 형식인지 확인합니다.
     * [EN] Checks if the specified path is a supported HDR format.
     */
    static isSupportedFormat(src: string): boolean;
    /**
     * [KO] 지원하는 파일 형식 확장자 목록을 반환합니다.
     * [EN] Returns the list of supported file format extensions.
     */
    static getSupportedFormats(): string[];
    /** [KO] 텍스처 리소스를 파괴합니다. [EN] Destroys the texture resource. */
    destroy(): void;
}
export default HDRTexture;
