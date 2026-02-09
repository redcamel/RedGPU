import RedGPUContext from "../../../../../context/RedGPUContext";
import IBLCubeTexture from "../IBLCubeTexture";
/**
 * [KO] Equirectangular(2D) 텍스처를 CubeMap으로 변환하는 클래스입니다.
 * [EN] Class that converts an Equirectangular (2D) texture to a CubeMap.
 *
 * @category IBL
 */
declare class EquirectangularToCubeGenerator {
    #private;
    /**
     * [KO] EquirectangularToCubeGenerator 인스턴스를 생성합니다.
     * [EN] Creates an EquirectangularToCubeGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 2D Equirectangular 텍스처를 큐브맵으로 변환하여 반환합니다.
     * [EN] Converts a 2D Equirectangular texture to a cubemap and returns it.
     *
     * ### Example
     * ```typescript
     * const cubeMap = await redGPUContext.resourceManager.equirectangularToCubeGenerator.generate(hdrTexture, 1024);
     * ```
     *
     * @param sourceTexture -
     * [KO] 소스 2D HDR 텍스처
     * [EN] Source 2D HDR texture
     * @param size -
     * [KO] 생성될 큐브맵의 한 면 크기 (기본값: 512)
     * [EN] Size of one side of the generated cubemap (default: 512)
     * @returns
     * [KO] 생성된 IBLCubeTexture
     * [EN] Generated IBLCubeTexture
     */
    generate(sourceTexture: GPUTexture, size?: number): Promise<IBLCubeTexture>;
}
export default EquirectangularToCubeGenerator;
