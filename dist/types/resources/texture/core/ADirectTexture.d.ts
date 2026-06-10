import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
/**
 * [KO] 직접 주입형 텍스처(DirectTexture, DirectCubeTexture)의 공통 로직을 정의하는 추상 클래스입니다.
 * [EN] Abstract class defining common logic for direct-injected textures (DirectTexture, DirectCubeTexture).
 */
declare abstract class ADirectTexture extends ManagementResourceBase {
    #private;
    protected constructor(redGPUContext: RedGPUContext, managedStateKey: string, cacheKey: string);
    /** [KO] 뷰 디스크립터를 반환합니다. [EN] Returns the view descriptor. */
    abstract get viewDescriptor(): GPUTextureViewDescriptor;
    get gpuTexture(): GPUTexture;
    set gpuTexture(value: GPUTexture);
    get gpuTextureView(): GPUTextureView;
    get videoMemorySize(): number;
    get format(): GPUTextureFormat;
    get mipLevelCount(): number;
    /** [KO] 리소스를 파괴합니다. [EN] Destroys the resource. */
    destroy(): void;
    /** [KO] GPUTexture 객체를 설정하고 내부 상태를 동기화합니다. [EN] Sets the GPUTexture object and synchronizes internal state. */
    protected setGpuTexture(value: GPUTexture): void;
    protected abstract registerResource(): void;
    protected abstract unregisterResource(): void;
}
export default ADirectTexture;
