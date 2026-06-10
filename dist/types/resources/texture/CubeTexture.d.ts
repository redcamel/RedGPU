import RedGPUContext from "../../context/RedGPUContext";
import ManagementResourceBase from "../core/ManagementResourceBase";
/**
 * [KO] 큐브 텍스처 소스 정보 타입입니다. 이미지 URL 배열이거나 srcList와 cacheKey를 가진 객체일 수 있습니다.
 * [EN] Cube texture source information type. Can be an array of image URLs or an object with srcList and cacheKey.
 */
export type CubeSrcInfo = string[] | {
    srcList: string[];
    cacheKey: string;
};
/**
 * [KO] 6개의 이미지를 사용하는 큐브 텍스처 클래스입니다.
 * [EN] Cube texture class that uses 6 images.
 *
 * * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.CubeTexture(redGPUContext, [
 *   'right.png', 'left.png',
 *   'top.png', 'bottom.png',
 *   'front.png', 'back.png'
 * ]);
 * ```
 * @category Texture
 */
declare class CubeTexture extends ManagementResourceBase {
    #private;
    /** [KO] 기본 뷰 디스크립터 [EN] Default view descriptor */
    static defaultViewDescriptor: GPUTextureViewDescriptor;
    /**
     * [KO] CubeTexture 인스턴스를 생성합니다.
     * [EN] Creates a CubeTexture instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param srcList -
     * [KO] 큐브 텍스처 소스 정보 (URL 배열 또는 객체)
     * [EN] Cube texture source information (Array of URLs or object)
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
     */
    constructor(redGPUContext: RedGPUContext, srcList: CubeSrcInfo, useMipMap?: boolean, onLoad?: (cubeTextureInstance?: CubeTexture) => void, onError?: (error: Error) => void, format?: GPUTextureFormat);
    /**
     * [KO] 뷰 디스크립터를 반환합니다.
     * [EN] Returns the view descriptor.
     *
     * @returns
     * [KO] GPUTextureViewDescriptor 객체
     * [EN] GPUTextureViewDescriptor object
     */
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
     * [KO] 픽셀 포맷 등 비디오 메모리 사용량(byte)을 반환합니다.
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
     * [KO] 텍스처 소스 경로 리스트를 반환합니다.
     * [EN] Returns the list of texture source paths.
     *
     * @returns
     * [KO] 소스 경로 리스트
     * [EN] List of source paths
     */
    get srcList(): string[];
    /**
     * [KO] 텍스처 소스 경로 리스트를 설정하고 로드를 시작합니다.
     * [EN] Sets the list of texture source paths and starts loading.
     *
     * @param value -
     * [KO] 큐브 텍스처 소스 정보
     * [EN] Cube texture source info
     */
    set srcList(value: CubeSrcInfo);
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
    /**
     * [KO] GPUTexture를 직접 설정합니다.
     * [EN] Sets the GPUTexture directly.
     * @param gpuTexture -
     * [KO] 설정할 `GPUTexture` 객체
     * [EN] `GPUTexture` object to set
     * @param cacheKey -
     * [KO] 캐시 키 (선택)
     * [EN] Cache key (optional)
     * @param useMipmap -
     * [KO] 밉맵 사용 여부 (기본값: true)
     * [EN] Whether to use mipmaps (default: true)
     */
    setGPUTextureDirectly(gpuTexture: GPUTexture, cacheKey?: string, useMipmap?: boolean): void;
}
export default CubeTexture;
