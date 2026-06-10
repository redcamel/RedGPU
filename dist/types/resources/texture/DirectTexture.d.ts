import RedGPUContext from "../../context/RedGPUContext";
import ADirectTexture from "./core/ADirectTexture";
/**
 * [KO] 파일 경로(URL)를 통한 로드 과정 없이, GPUTexture를 직접 주입받아 관리하는 2D 전용 텍스처 클래스입니다.
 * [EN] 2D-specific texture class that directly injects and manages GPUTexture without loading from file paths (URLs).
 *
 * @category Texture
 */
declare class DirectTexture extends ADirectTexture {
    /**
     * [KO] DirectTexture 인스턴스를 생성합니다.
     * [EN] Creates a DirectTexture instance.
     *
     * @param redGPUContext - RedGPU 컨텍스트
     * @param cacheKey - 캐시 키 (동일 키 존재 시 기존 인스턴스 반환)
     * @param gpuTexture - 외부 GPUTexture 주입 (선택)
     */
    constructor(redGPUContext: RedGPUContext, cacheKey: string, gpuTexture?: GPUTexture);
    /**
     * [KO] 뷰 디스크립터를 반환합니다.
     * [EN] Returns the view descriptor.
     * @returns - [KO] GPUTextureViewDescriptor 객체 [EN] GPUTextureViewDescriptor object
     */
    get viewDescriptor(): GPUTextureViewDescriptor;
    protected registerResource(): void;
    protected unregisterResource(): void;
}
export default DirectTexture;
