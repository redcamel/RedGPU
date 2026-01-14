import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
type SrcInfo = string | {
    src: string;
    cacheKey: string;
};
/**
 * HDRTexture 클래스
 * 지원 형식: .hdr (Radiance HDR/RGBE) 형식만 지원
 * GGX 중요도 샘플링을 통해 거칠기별로 프리필터링된 큐브맵을 생성합니다.
 * @category Texture
 */
declare class HDRTexture extends ManagementResourceBase {
    #private;
    /**
     * @param redGPUContext - RedGPU 컨텍스트
     * @param src - HDR 파일 경로 또는 정보
     * @param onLoad - 로드 완료 콜백
     * @param onError - 로드 에러 콜백
     * @param cubeMapSize - 생성될 큐브맵의 한 면 크기
     * @param useMipMap - 밉맵 사용 여부 (IBL 사용 시 필수)
     */
    constructor(redGPUContext: RedGPUContext, src: SrcInfo, onLoad?: (textureInstance?: HDRTexture) => void, onError?: (error: Error) => void, cubeMapSize?: number, useMipMap?: boolean);
    get videoMemorySize(): number;
    get gpuTexture(): GPUTexture;
    get mipLevelCount(): number;
    get src(): string;
    set src(value: SrcInfo);
    get useMipmap(): boolean;
    set useMipmap(value: boolean);
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
    static isSupportedFormat(src: string): boolean;
    static getSupportedFormats(): string[];
    destroy(): void;
}
export default HDRTexture;
