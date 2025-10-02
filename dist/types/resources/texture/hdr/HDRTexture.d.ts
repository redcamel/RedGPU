import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
type SrcInfo = string | {
    src: string;
    cacheKey: string;
};
interface LuminanceAnalysis {
    averageLuminance: number;
    maxLuminance: number;
    minLuminance: number;
    medianLuminance: number;
    percentile95: number;
    percentile99: number;
    recommendedExposure: number;
}
/**
 * HDRTexture 클래스
 * 지원 형식: .hdr (Radiance HDR/RGBE) 형식만 지원
 * @category Texture
 */
declare class HDRTexture extends ManagementResourceBase {
    #private;
    constructor(redGPUContext: RedGPUContext, src: SrcInfo, onLoad?: (textureInstance?: HDRTexture) => void, onError?: (error: Error) => void, cubeMapSize?: number, useMipMap?: boolean);
    get videoMemorySize(): number;
    get gpuTexture(): GPUTexture;
    get mipLevelCount(): number;
    get src(): string;
    set src(value: SrcInfo);
    get useMipmap(): boolean;
    set useMipmap(value: boolean);
    get exposure(): number;
    set exposure(value: number);
    get recommendedExposure(): number;
    get luminanceAnalysis(): LuminanceAnalysis;
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
    /**
     * 지원되는 HDR 형식 확인
     */
    static isSupportedFormat(src: string): boolean;
    /**
     * 지원되는 형식 목록 반환
     */
    static getSupportedFormats(): string[];
    resetToRecommendedExposure(): void;
    destroy(): void;
}
export default HDRTexture;
