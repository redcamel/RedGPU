import RedGPUContext from "../../context/RedGPUContext";
import ADirectTexture from "./core/ADirectTexture";
/**
 * [KO] 파일 경로(URL)를 통한 로드 과정 없이, GPUTexture를 직접 주입받아 관리하는 다차원(Cube 및 3D) 텍스처 클래스입니다.
 * [EN] Multi-dimensional (Cube and 3D) texture class that directly injects and manages GPUTexture without loading from file paths (URLs).
 *
 * @category Texture
 */
declare class DirectCubeTexture extends ADirectTexture {
    #private;
    /**
     * [KO] DirectCubeTexture 인스턴스를 생성합니다.
     * [EN] Creates a DirectCubeTexture instance.
     *
     * @param redGPUContext - RedGPU 컨텍스트
     * @param cacheKey - 캐시 키 (동일 키 존재 시 기존 인스턴스 반환)
     * @param gpuTexture - `GPUTexture` 객체 (선택)
     */
    constructor(redGPUContext: RedGPUContext, cacheKey: string, gpuTexture?: GPUTexture);
    /**
     * [KO] 뷰 디스크립터를 반환합니다.
     * [EN] Returns the view descriptor.
     * @returns - [KO] GPUTextureViewDescriptor 객체 [EN] GPUTextureViewDescriptor object
     */
    get viewDescriptor(): GPUTextureViewDescriptor;
    protected setGpuTexture(value: GPUTexture): void;
    protected registerResource(): void;
    protected unregisterResource(): void;
}
export default DirectCubeTexture;
