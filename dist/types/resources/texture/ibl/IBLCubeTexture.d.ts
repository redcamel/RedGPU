import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
declare class IBLCubeTexture extends ManagementResourceBase {
    #private;
    constructor(redGPUContext: RedGPUContext, cacheKey: string, gpuTexture?: GPUTexture);
    get viewDescriptor(): {
        mipLevelCount: number;
        format?: GPUTextureFormat;
        dimension?: GPUTextureViewDimension;
        usage?: GPUTextureUsageFlags;
        aspect?: GPUTextureAspect;
        baseMipLevel?: GPUIntegerCoordinate;
        baseArrayLayer?: GPUIntegerCoordinate;
        arrayLayerCount?: GPUIntegerCoordinate;
        label?: string;
    };
    get format(): GPUTextureFormat;
    get videoMemorySize(): number;
    get gpuTexture(): GPUTexture;
    set gpuTexture(gpuTexture: GPUTexture);
    get mipLevelCount(): number;
    get useMipmap(): boolean;
    destroy(): void;
}
export default IBLCubeTexture;
