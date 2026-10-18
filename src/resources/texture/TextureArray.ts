import RedGPUContext from "../../context/RedGPUContext";
import getAbsoluteURL from "../../utils/file/getAbsoluteURL";
import loadImageToImageBitmap from "../../utils/texture/textureParser/imageBitmap/loadImageToImageBitmap";
import imageBitmapToGPUTexture from "../../utils/texture/textureParser/imageBitmap/imageBitmapToGPUTexture";
import getMipLevelCount from "../../utils/texture/getMipLevelCount";
import ManagementResourceBase from "../core/ManagementResourceBase";
import ResourceStateBitmapTexture from "../core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import {COMMAND_ENCODER_TYPE} from "../../commandEncoderManager/COMMAND_ENCODER_TYPE";

const MANAGED_STATE_KEY = 'managedTextureArrayState'

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
class TextureArray extends ManagementResourceBase {
    #gpuTexture: GPUTexture
    #srcList: string[] = []
    #format: GPUTextureFormat
    #onLoad: (textureInstance: TextureArray) => void;
    #onError: (error: Error) => void;
    #width: number = 0;
    #height: number = 0;
    #mipLevelCount: number = 1;
    #useMipmap: boolean = true;

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
    constructor(
        redGPUContext: RedGPUContext,
        srcList: string[],
        useMipMap: boolean = true,
        onLoad?: (textureInstance?: TextureArray) => void,
        onError?: (error: Error) => void,
        format?: GPUTextureFormat
    ) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.#useMipmap = useMipMap;
        this.#onLoad = onLoad
        this.#onError = onError
        this.#srcList = srcList.map(src => getAbsoluteURL(window.location.href, src))
        this.#format = format || `${navigator.gpu.getPreferredCanvasFormat()}-srgb` as GPUTextureFormat
        this.cacheKey = this.#srcList.join(',')

        const {table} = this.targetResourceManagedState
        let target = table.get(this.cacheKey)
        if (target) {
            const targetTexture = target.texture as TextureArray
            this.#onLoad?.(targetTexture)
            return targetTexture
        } else {
            this.#registerResource()
        }
    }

    get width(): number {
        return this.#width
    }

    get height(): number {
        return this.#height
    }

    get gpuTexture(): GPUTexture {
        return this.#gpuTexture
    }

    get mipLevelCount(): number {
        return this.#mipLevelCount
    }

    get useMipmap(): boolean {
        return this.#useMipmap
    }

    async #registerResource() {
        const {redGPUContext} = this
        const {gpuDevice} = redGPUContext

        const loadPromises = this.#srcList.map(src => loadImageToImageBitmap(src));

        Promise.all(loadPromises).then((bitmaps) => {
            if (bitmaps.length === 0) {
                throw new Error("No images loaded for TextureArray");
            }
            this.#width = bitmaps[0].width;
            this.#height = bitmaps[0].height;

            const canvas = document.createElement('canvas');
            canvas.width = this.#width;
            canvas.height = this.#height;
            const ctx = canvas.getContext('2d');

            const resizePromises = bitmaps.map((bitmap, index) => {
                if (index === 0) return Promise.resolve(bitmap);
                if (bitmap.width === this.#width && bitmap.height === this.#height) {
                    return Promise.resolve(bitmap);
                }
                ctx.clearRect(0, 0, this.#width, this.#height);
                ctx.drawImage(bitmap, 0, 0, this.#width, this.#height);
                return createImageBitmap(canvas);
            });

            return Promise.all(resizePromises);
        }).then((resizedBitmaps) => {
            this.#mipLevelCount = this.#useMipmap ? getMipLevelCount(this.#width, this.#height) : 1;
            const textureDescriptor: GPUTextureDescriptor = {
                size: [this.#width, this.#height, resizedBitmaps.length],
                format: this.#format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
                label: `TextureArray_GPUTexture_${this.uuid}`
            };
            if (this.#useMipmap) {
                textureDescriptor.mipLevelCount = this.#mipLevelCount;
            }

            this.#gpuTexture = imageBitmapToGPUTexture(gpuDevice, resizedBitmaps, textureDescriptor, false);

            if (this.#useMipmap) {
                this.redGPUContext.resourceManager.mipmapGenerator.generateMipmap(
                    this.#gpuTexture,
                    textureDescriptor,
                    false,
                    COMMAND_ENCODER_TYPE.IMMEDIATE
                );
            }

            // ImageBitmap 최적화: 사용 완료된 비트맵 객체 메모리 해제
            resizedBitmaps.forEach((bitmap) => {
                try {
                    bitmap?.close();
                } catch (e) {
                }
            });

            const {table} = this.targetResourceManagedState
            table.set(this.cacheKey, new ResourceStateBitmapTexture(this as any));

            this.notifyUpdate(true);
            this.#onLoad?.(this);
        }).catch(err => {
            console.error("Failed to create TextureArray:", err);
            this.#onError?.(err);
        });
    }

    destroy() {
        if (this.#gpuTexture) {
            this.#gpuTexture.destroy();
            this.#gpuTexture = null as any;
        }
    }
}

export default TextureArray;
