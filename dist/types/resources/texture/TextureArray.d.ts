import RedGPUContext from "../../context/RedGPUContext";
import ManagementResourceBase from "../core/ManagementResourceBase";
/**
 * [KO] 여러 이미지를 레이어별로 업로드하여 `texture_2d_array` GPU 텍스처를 생성합니다.
 * [EN] Uploads multiple images as layers to create a `texture_2d_array` GPU texture.
 *
 * [KO] 모든 레이어는 첫 번째 이미지 크기로 리사이즈되며, 동일한 소스 목록은 캐시된 인스턴스를 재사용합니다.
 * [EN] All layers are resized to the first image's size, and identical source lists reuse the cached instance.
 *
 * ### Example
 * ```typescript
 * const textureArray = new RedGPU.Resource.TextureArray(
 *     redGPUContext,
 *     ['layer0.png', 'layer1.png', 'layer2.png'],
 *     true,
 *     (texture) => console.log(texture.width, texture.height)
 * );
 * ```
 *
 * @category Texture
 */
declare class TextureArray extends ManagementResourceBase {
    #private;
    /**
     * [KO] 이미지 목록을 비동기로 로드하여 텍스처 배열을 생성합니다. 동일 소스 목록이 캐시되어 있으면 기존 인스턴스를 반환합니다.
     * [EN] Asynchronously loads the image list to create a texture array. Returns the existing instance if the same source list is cached.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param srcList -
     * [KO] 레이어 순서대로 나열된 이미지 URL 목록
     * [EN] List of image URLs in layer order
     * @param useMipMap -
     * [KO] 밉맵 생성 여부 (기본값: true)
     * [EN] Whether to generate mipmaps (default: true)
     * @param onLoad -
     * [KO] 로드 완료 콜백
     * [EN] Load completion callback
     * @param onError -
     * [KO] 로드 실패 콜백
     * [EN] Load failure callback
     * @param format -
     * [KO] 텍스처 포맷 (기본값: 선호 캔버스 포맷의 `-srgb` 변형)
     * [EN] Texture format (default: `-srgb` variant of the preferred canvas format)
     */
    constructor(redGPUContext: RedGPUContext, srcList: string[], useMipMap?: boolean, onLoad?: (textureInstance?: TextureArray) => void, onError?: (error: Error) => void, format?: GPUTextureFormat);
    get width(): number;
    get height(): number;
    get gpuTexture(): GPUTexture;
    get mipLevelCount(): number;
    get useMipmap(): boolean;
    /**
     * [KO] 텍스처 배열의 GPU 리소스를 파괴합니다.
     * [EN] Destroys the GPU texture resource of this texture array.
     */
    destroy(): void;
}
export default TextureArray;
