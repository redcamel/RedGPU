import RedGPUContext from "../../context/RedGPUContext";
import ManagementResourceBase from "../core/ManagementResourceBase";
/**
 * [KO] 큐브 텍스처 소스 정보 타입입니다. 6개의 이미지 URL 배열이거나 `srcList`와 `cacheKey`를 포함하는 객체입니다.
 * [EN] Cube texture source information type. Can be an array of 6 image URLs or an object containing `srcList` and `cacheKey`.
 *
 * @category Texture
 */
export type CubeSrcInfo = string[] | {
    srcList: string[];
    cacheKey: string;
};
/**
 * [KO] 6면(+X, -X, +Y, -Y, +Z, -Z) 이미지를 로드하여 GPU 큐브맵(`cube`) 텍스처로 관리하는 클래스입니다.
 * [EN] Class that loads 6 face (+X, -X, +Y, -Y, +Z, -Z) images and manages them as a GPU cubemap (`cube`) texture.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.CubeTexture(redGPUContext, [
 *     'right.png', 'left.png',
 *     'top.png', 'bottom.png',
 *     'front.png', 'back.png'
 * ]);
 * ```
 *
 * @see [SkyBox basic example](/RedGPU/examples/3d/skybox/skybox/)
 * @see [SkyBox transition example](/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 * @category Texture
 */
declare class CubeTexture extends ManagementResourceBase {
    #private;
    /**
     * [KO] 큐브 텍스처의 기본 `GPUTextureViewDescriptor` 설정입니다.
     * [EN] Default `GPUTextureViewDescriptor` configuration for cube textures.
     */
    static defaultViewDescriptor: GPUTextureViewDescriptor;
    /**
     * [KO] CubeTexture 인스턴스를 생성합니다. 동일한 `cacheKey`가 이미 존재할 경우 기존 캐시된 인스턴스를 반환합니다.
     * [EN] Creates a CubeTexture instance. Returns the existing cached instance if the same `cacheKey` already exists.
     *
     * ### Example
     * ```typescript
     * const cubeTexture = new RedGPU.Resource.CubeTexture(
     *     redGPUContext,
     *     ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
     *     true,
     *     (loadedTexture) => {
     *         console.log('CubeTexture loaded:', loadedTexture);
     *     }
     * );
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param srcList -
     * [KO] 6면 큐브 텍스처 소스 정보 (URL 배열 또는 캐시 키 포함 객체)
     * [EN] 6-face cube texture source information (array of URLs or object with cache key)
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
     */
    constructor(redGPUContext: RedGPUContext, srcList: CubeSrcInfo, useMipMap?: boolean, onLoad?: (cubeTextureInstance?: CubeTexture) => void, onError?: (error: Error) => void, format?: GPUTextureFormat);
    /**
     * [KO] 현재 밉맵 레벨 개수가 반영된 `GPUTextureViewDescriptor` 객체를 반환합니다.
     * [EN] Returns the `GPUTextureViewDescriptor` object reflecting the current mipmap level count.
     *
     * @returns
     * [KO] `GPUTextureViewDescriptor` 객체
     * [EN] `GPUTextureViewDescriptor` object
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
     * [KO] 6면 이미지 소스 경로 배열을 반환하거나 설정합니다. 값을 변경하면 큐브 텍스처를 비동기로 다시 로드합니다.
     * [EN] Gets or sets the array of 6-face image source paths. Changing this value reloads the cube texture asynchronously.
     *
     * @returns
     * [KO] 이미지 소스 경로 배열 (`string[]`)
     * [EN] Array of image source paths (`string[]`)
     */
    get srcList(): string[];
    set srcList(value: CubeSrcInfo);
    /**
     * [KO] 밉맵 사용 여부를 반환하거나 설정합니다. 값을 변경하면 텍스처를 재생성합니다.
     * [EN] Gets or sets whether mipmaps are used. Changing this value recreates the texture.
     *
     * @returns
     * [KO] 밉맵 사용 여부
     * [EN] Whether mipmaps are used
     */
    get useMipmap(): boolean;
    set useMipmap(value: boolean);
    /**
     * [KO] 텍스처 GPU 리소스를 해제하고 리소스 매니저 등록을 취소합니다.
     * [EN] Releases the texture GPU resource and unregisters it from the resource manager.
     */
    destroy(): void;
    /**
     * [KO] 외부에서 생성된 `GPUTexture` 객체를 직접 주입하여 설정합니다.
     * [EN] Directly injects and sets an externally created `GPUTexture` object.
     *
     * @param gpuTexture -
     * [KO] 설정할 `GPUTexture` 객체
     * [EN] `GPUTexture` object to set
     * @param cacheKey -
     * [KO] 캐시 키 (생략 시 UUID 기반 키 사용)
     * [EN] Cache key (uses UUID-based key if omitted)
     * @param useMipmap -
     * [KO] 밉맵 사용 여부 (기본값: `true`)
     * [EN] Whether to use mipmaps (default: `true`)
     */
    setGPUTextureDirectly(gpuTexture: GPUTexture, cacheKey?: string, useMipmap?: boolean): void;
}
export default CubeTexture;
