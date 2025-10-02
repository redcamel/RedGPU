import RedGPUContext from "../../context/RedGPUContext";
import ManagementResourceBase from "../core/ManagementResourceBase";
type SrcInfo = string[] | {
    srcList: string[];
    cacheKey: string;
};
/**
 * CubeTexture
 * @category Texture
 */
declare class CubeTexture extends ManagementResourceBase {
    #private;
    /** 기본 뷰 디스크립터 */
    static defaultViewDescriptor: GPUTextureViewDescriptor;
    /**
     * CubeTexture 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param srcList - 큐브 텍스처 소스 정보
     * @param useMipMap - 밉맵 사용 여부(기본값: true)
     * @param onLoad - 로드 완료 콜백
     * @param onError - 에러 콜백
     * @param format - 텍스처 포맷(옵션)
     */
    constructor(redGPUContext: RedGPUContext, srcList: SrcInfo, useMipMap?: boolean, onLoad?: (cubeTextureInstance?: CubeTexture) => void, onError?: (error: Error) => void, format?: GPUTextureFormat);
    /** 뷰 디스크립터 반환 */
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
    /** 비디오 메모리 사용량(byte) 반환 */
    get videoMemorySize(): number;
    /** GPUTexture 객체 반환 */
    get gpuTexture(): GPUTexture;
    /** 밉맵 레벨 개수 반환 */
    get mipLevelCount(): number;
    /** 텍스처 소스 경로 리스트 반환 */
    get srcList(): string[];
    /** 텍스처 소스 경로 리스트 설정 및 로드 */
    set srcList(value: SrcInfo);
    /** 밉맵 사용 여부 반환 */
    get useMipmap(): boolean;
    /** 밉맵 사용 여부 설정 및 텍스처 재생성 */
    set useMipmap(value: boolean);
    /** 텍스처와 리소스 해제 */
    destroy(): void;
    /**
     * GPUTexture를 직접 설정합니다.
     * @param gpuTexture - GPUTexture 객체
     * @param cacheKey - 캐시 키(옵션)
     * @param useMipmap - 밉맵 사용 여부(기본값: true)
     * @category Texture
     */
    setGPUTextureDirectly(gpuTexture: GPUTexture, cacheKey?: string, useMipmap?: boolean): void;
}
export default CubeTexture;
