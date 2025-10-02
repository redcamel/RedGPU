import RedGPUContext from "../../../context/RedGPUContext";
/**
 * 컴포넌트 매핑 타입 정의 (r/g/b/a 채널별 매핑)
 */
type ComponentMapping = {
    r?: 'r' | 'g' | 'b' | 'a';
    g?: 'r' | 'g' | 'b' | 'a';
    b?: 'r' | 'g' | 'b' | 'a';
    a?: 'r' | 'g' | 'b' | 'a';
};
/**
 * 여러 텍스처의 채널을 조합해 하나의 텍스처로 패킹하는 유틸리티 클래스입니다.
 * @category Texture
 */
declare class PackedTexture {
    #private;
    /**
     * PackedTexture 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     */
    constructor(redGPUContext: RedGPUContext);
    /** 인스턴스 고유 식별자 반환 */
    get uuid(): string;
    /** 패킹 결과 GPUTexture 객체 반환 */
    get gpuTexture(): GPUTexture;
    /** 패킹 텍스처 캐시 맵 반환 (static) */
    static getCacheMap(): Map<string, {
        gpuTexture: GPUTexture;
        useNum: number;
        mappingKey: string;
        uuid: string;
    }>;
    /**
     * 여러 텍스처의 채널을 조합해 패킹 텍스처를 생성합니다.
     * @param textures - r/g/b/a 채널별 GPUTexture 객체
     * @param width - 결과 텍스처의 가로 크기
     * @param height - 결과 텍스처의 세로 크기
     * @param label - 텍스처 레이블(옵션)
     * @param componentMapping - 채널별 매핑 정보(옵션)
     */
    packing(textures: {
        r?: GPUTexture;
        g?: GPUTexture;
        b?: GPUTexture;
        a?: GPUTexture;
    }, width: number, height: number, label?: string, componentMapping?: ComponentMapping): Promise<void>;
    /**
     * 인스턴스 정리 메서드
     */
    destroy(): void;
}
export default PackedTexture;
