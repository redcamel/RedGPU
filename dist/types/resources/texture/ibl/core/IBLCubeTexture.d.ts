import RedGPUContext from "../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../core/ManagementResourceBase";
/**
 * [KO] IBL에서 내부적으로 사용하는 큐브 텍스처 클래스입니다.
 * [EN] Cube texture class used internally in IBL.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category IBL
 */
declare class IBLCubeTexture extends ManagementResourceBase {
    #private;
    /**
     * [KO] IBLCubeTexture 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates an IBLCubeTexture instance. (Internal system only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param cacheKey -
     * [KO] 캐시 키
     * [EN] Cache key
     * @param gpuTexture -
     * [KO] `GPUTexture` 객체 (선택)
     * [EN] `GPUTexture` object (optional)
     */
    constructor(redGPUContext: RedGPUContext, cacheKey: string, gpuTexture?: GPUTexture);
    /**
     * [KO] 뷰 디스크립터를 반환합니다.
     * [EN] Returns the view descriptor.
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
     * [KO] 텍스처 포맷
     * [EN] Texture format
     */
    get format(): GPUTextureFormat;
    /**
     * [KO] 비디오 메모리 사용량(byte)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number;
    /**
     * [KO] GPUTexture 객체
     * [EN] GPUTexture object
     */
    get gpuTexture(): GPUTexture;
    /**
     * [KO] GPUTexture 객체를 설정합니다.
     * [EN] Sets the GPUTexture object.
     */
    set gpuTexture(gpuTexture: GPUTexture);
    /**
     * [KO] 밉맵 레벨 개수
     * [EN] Number of mipmap levels
     */
    get mipLevelCount(): number;
    /**
     * [KO] 밉맵 사용 여부
     * [EN] Whether to use mipmaps
     */
    get useMipmap(): boolean;
    /**
     * [KO] 리소스를 파괴합니다.
     * [EN] Destroys the resource.
     */
    destroy(): void;
}
export default IBLCubeTexture;
