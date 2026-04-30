import RedGPUContext from "../../../context/RedGPUContext";
import calculateTextureByteSize from "../../../utils/texture/calculateTextureByteSize";
import ManagementResourceBase from "../../core/ManagementResourceBase";

/**
 * [KO] 직접 주입형 텍스처(DirectTexture, DirectCubeTexture)의 공통 로직을 정의하는 추상 클래스입니다.
 * [EN] Abstract class defining common logic for direct-injected textures (DirectTexture, DirectCubeTexture).
 */
abstract class ADirectTexture extends ManagementResourceBase {
    #gpuTexture: GPUTexture;
    #gpuTextureView: GPUTextureView;
    #videoMemorySize: number = 0;
    #format: GPUTextureFormat;
    #mipLevelCount: number = 1;

    protected constructor(redGPUContext: RedGPUContext, managedStateKey: string, cacheKey: string) {
        super(redGPUContext, managedStateKey);
        this.cacheKey = cacheKey;
    }

    /** [KO] 뷰 디스크립터를 반환합니다. [EN] Returns the view descriptor. */
    abstract get viewDescriptor(): GPUTextureViewDescriptor;

    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    set gpuTexture(value: GPUTexture) {
        this.setGpuTexture(value);
    }

    get gpuTextureView(): GPUTextureView {
        return this.#gpuTextureView;
    }

    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    get format(): GPUTextureFormat {
        return this.#format;
    }

    get mipLevelCount(): number {
        return this.#mipLevelCount;
    }

    /** [KO] 리소스를 파괴합니다. [EN] Destroys the resource. */
    destroy() {
        const temp = this.#gpuTexture;
        this.setGpuTexture(null);
        this.notifyUpdate(true);
        this.unregisterResource();
        this.cacheKey = null;
        if (temp) temp.destroy();
    }

    /** [KO] GPUTexture 객체를 설정하고 내부 상태를 동기화합니다. [EN] Sets the GPUTexture object and synchronizes internal state. */
    protected setGpuTexture(value: GPUTexture) {
        this.targetResourceManagedState.videoMemory -= this.#videoMemorySize;
        this.#gpuTexture = value;
        if (value) {
            this.#format = value.format;
            this.#mipLevelCount = value.mipLevelCount;
            this.#videoMemorySize = calculateTextureByteSize(value);
            this.#gpuTextureView = value.createView(this.viewDescriptor);
        } else {
            this.#gpuTextureView = null;
            this.#format = null;
            this.#mipLevelCount = 0;
            this.#videoMemorySize = 0;
        }
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize;
        this.notifyUpdate();
    }

    protected abstract registerResource(): void;

    protected abstract unregisterResource(): void;
}

export default ADirectTexture;
