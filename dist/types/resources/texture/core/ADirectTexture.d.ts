import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
/**
 * [KO] 직접 주입형 텍스처(DirectTexture, DirectCubeTexture)의 공통 로직을 정의하는 추상 클래스입니다.
 * [EN] Abstract class defining common logic for direct-injected textures (DirectTexture, DirectCubeTexture).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Texture
 */
declare abstract class ADirectTexture extends ManagementResourceBase {
    #private;
    /**
     * [KO] ADirectTexture 인스턴스를 초기화합니다.
     * [EN] Initializes an instance of ADirectTexture.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param managedStateKey -
     * [KO] 관리 대상 상태 키
     * [EN] Managed state key
     * @param cacheKey -
     * [KO] 캐시 식별 키
     * [EN] Cache identifier key
     */
    protected constructor(redGPUContext: RedGPUContext, managedStateKey: string, cacheKey: string);
    /**
     * [KO] 뷰 디스크립터를 반환합니다.
     * [EN] Returns the view descriptor.
     */
    abstract get viewDescriptor(): GPUTextureViewDescriptor;
    /**
     * [KO] 내부 WebGPU 텍스처 인스턴스를 반환하거나 설정합니다.
     * [EN] Gets or sets the internal WebGPU texture instance.
     */
    get gpuTexture(): GPUTexture;
    set gpuTexture(value: GPUTexture);
    /**
     * [KO] 내부 WebGPU 텍스처 뷰를 반환합니다.
     * [EN] Returns the internal WebGPU texture view.
     */
    get gpuTextureView(): GPUTextureView;
    /**
     * [KO] 텍스처의 비디오 메모리 사용량(바이트 단위)을 반환합니다.
     * [EN] Returns the video memory size of the texture in bytes.
     */
    get videoMemorySize(): number;
    /**
     * [KO] 텍스처의 GPU 포맷을 반환합니다.
     * [EN] Returns the GPU texture format.
     */
    get format(): GPUTextureFormat;
    /**
     * [KO] 텍스처의 밉 레벨 수를 반환합니다.
     * [EN] Returns the number of mip levels of the texture.
     */
    get mipLevelCount(): number;
    /**
     * [KO] 텍스처 리소스를 파괴하고 비디오 메모리를 해제합니다.
     * [EN] Destroys the texture resource and releases video memory.
     */
    destroy(): void;
    /**
     * [KO] GPUTexture 객체를 설정하고 내부 상태 및 비디오 메모리를 동기화합니다.
     * [EN] Sets the GPUTexture object and synchronizes internal state and video memory.
     *
     * @param value -
     * [KO] 설정할 GPUTexture 객체
     * [EN] GPUTexture object to set
     */
    protected setGpuTexture(value: GPUTexture): void;
    protected abstract registerResource(): void;
    protected abstract unregisterResource(): void;
}
export default ADirectTexture;
