import RedGPUContext from "../../../../../context/RedGPUContext";
import IBLCubeTexture from "../IBLCubeTexture";
/**
 * [KO] Prefilter 맵을 생성하는 클래스입니다.
 * [EN] Class that generates a Prefilter map.
 *
 * [KO] 큐브맵으로부터 거칠기(Roughness) 단계별로 필터링된 반사광 정보를 추출하여 큐브맵의 밉맵에 저장합니다.
 * [EN] Extracts filtered reflection information for each roughness level from a cubemap and stores it in the cubemap's mipmaps.
 *
 * @category IBL
 */
declare class PrefilterGenerator {
    #private;
    /**
     * [KO] PrefilterGenerator 인스턴스를 생성합니다.
     * [EN] Creates a PrefilterGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 소스 큐브 텍스처로부터 프리필터링된 큐브맵을 생성하여 반환합니다.
     * [EN] Generates and returns a pre-filtered cubemap from the source cube texture.
     *
     * ### Example
     * ```typescript
     * const prefilteredMap = await redGPUContext.resourceManager.prefilterGenerator.generate(sourceCubeTexture, 512);
     * ```
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경맵 (큐브)
     * [EN] Source environment map (Cube)
     * @param size -
     * [KO] 생성될 큐브맵의 한 면 크기 (기본값: 512)
     * [EN] Size of one side of the generated cubemap (default: 512)
     * @returns
     * [KO] 생성된 Prefilter IBLCubeTexture
     * [EN] Generated Prefilter IBLCubeTexture
     */
    generate(sourceCubeTexture: GPUTexture, size?: number): Promise<IBLCubeTexture>;
}
export default PrefilterGenerator;
