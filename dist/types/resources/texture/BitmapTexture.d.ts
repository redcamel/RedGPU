import RedGPUContext from "../../context/RedGPUContext";
import ManagementResourceBase from "../core/ManagementResourceBase";
type SrcInfo = string | {
    src: string;
    cacheKey: string;
};
/**
 * BitmapTexture
 * @category Texture
 */
declare class BitmapTexture extends ManagementResourceBase {
    #private;
    /**
     * BitmapTexture 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param src - 텍스처 소스 정보
     * @param useMipMap - 밉맵 사용 여부(기본값: true)
     * @param onLoad - 로드 완료 콜백
     * @param onError - 에러 콜백
     * @param format - 텍스처 포맷(옵션)
     * @param usePremultiplyAlpha - 프리멀티플 알파 사용 여부(기본값: false)
     */
    constructor(redGPUContext: RedGPUContext, src?: SrcInfo, useMipMap?: boolean, onLoad?: (textureInstance?: BitmapTexture) => void, onError?: (error: Error) => void, format?: GPUTextureFormat, usePremultiplyAlpha?: boolean);
    /** 텍스처의 가로 크기 */
    get width(): number;
    /** 텍스처의 세로 크기 */
    get height(): number;
    /** 프리멀티플 알파 사용 여부 반환 */
    get usePremultiplyAlpha(): boolean;
    /** 비디오 메모리 사용량(byte) 반환 */
    get videoMemorySize(): number;
    /** GPUTexture 객체 반환 */
    get gpuTexture(): GPUTexture;
    /** 밉맵 레벨 개수 반환 */
    get mipLevelCount(): number;
    /** 텍스처 소스 경로 반환 */
    get src(): string;
    /** 텍스처 소스 경로 설정 및 로드 */
    set src(value: SrcInfo);
    /** 밉맵 사용 여부 반환 */
    get useMipmap(): boolean;
    /** 밉맵 사용 여부 설정 및 텍스처 재생성 */
    set useMipmap(value: boolean);
    /** 텍스처와 리소스 해제 */
    destroy(): void;
}
export default BitmapTexture;
