import RedGPUContext from "../../context/RedGPUContext";
import getAbsoluteURL from "../../utils/file/getAbsoluteURL";
import imageBitmapToGPUTexture from "../../utils/texture/imageBitmapToGPUTexture";
import loadAndCreateBitmapImage from "../../utils/texture/loadAndCreateBitmapImage";
import ManagementResourceBase from "../core/ManagementResourceBase";
import ResourceStateBitmapTexture from "../core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";

const MANAGED_STATE_KEY = 'managedTextureArrayState'

/**
 * [KO] 복수의 비트맵 이미지를 레이어별로 업로드하여 WebGPU texture_2d_array 리소스를 만드는 텍스처 클래스입니다.
 * [EN] Texture class that uploads multiple bitmap images by layers to create a WebGPU texture_2d_array resource.
 */
class TextureArray extends ManagementResourceBase {
    #gpuTexture: GPUTexture
    #srcList: string[] = []
    #format: GPUTextureFormat
    #onLoad: (textureInstance: TextureArray) => void;
    #onError: (error: Error) => void;
    #width: number = 0;
    #height: number = 0;

    constructor(
        redGPUContext: RedGPUContext,
        srcList: string[],
        onLoad?: (textureInstance?: TextureArray) => void,
        onError?: (error: Error) => void,
        format?: GPUTextureFormat
    ) {
        super(redGPUContext, MANAGED_STATE_KEY);
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

    #registerResource() {
        const {redGPUContext} = this
        const {gpuDevice} = redGPUContext

        const loadPromises = this.#srcList.map(src => loadAndCreateBitmapImage(src));

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
            const textureDescriptor: GPUTextureDescriptor = {
                size: [this.#width, this.#height, resizedBitmaps.length],
                format: this.#format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
                label: `TextureArray_GPUTexture_${this.uuid}`
            };

            this.#gpuTexture = imageBitmapToGPUTexture(gpuDevice, resizedBitmaps, textureDescriptor, false);

            const {table} = this.targetResourceManagedState
            table.set(this.cacheKey, new ResourceStateBitmapTexture(this as any));

            this.notifyUpdate(true);
            this.#onLoad?.(this);
        }).catch(err => {
            console.error("Failed to create TextureArray:", err);
            this.#onError?.(err);
        });
    }
}

export default TextureArray;
