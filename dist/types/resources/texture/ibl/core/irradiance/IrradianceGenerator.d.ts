import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectCubeTexture from "../../../DirectCubeTexture";
import { CommandEncoderType } from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUObject from "../../../../../base/RedGPUObject";
/**
 * [KO] Irradiance 맵을 생성하는 클래스입니다.
 * [EN] Class that generates an Irradiance map.
 *
 * [KO] 큐브맵으로부터 저주파 조명 정보를 추출하여 난반사(Diffuse) 라이팅에 사용할 Irradiance 맵을 베이킹합니다.
 * [EN] Extracts low-frequency lighting information from a cubemap to bake an Irradiance map for diffuse lighting.
 *
 * @category IBL
 */
declare class IrradianceGenerator extends RedGPUObject {
    #private;
    /**
     * [KO] IrradianceGenerator 인스턴스를 생성합니다.
     * [EN] Creates an IrradianceGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 소스 큐브 텍스처로부터 Irradiance 맵을 생성하여 반환합니다.
     * [EN] Generates and returns an Irradiance map from the source cube texture.
     *
     * ### Example
     * ```typescript
     * const irradianceMap = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCubeTexture, 64);
     * ```
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경맵 (큐브)
     * [EN] Source environment map (Cube)
     * @param size -
     * [KO] 생성될 Irradiance 맵의 크기 (기본값: 32)
     * [EN] Size of the generated Irradiance map (default: 32)
     * @param phase -
     * [KO] 커맨드 인코더 단계 (기본값: PRE_PROCESS)
     * [EN] Command encoder phase (default: PRE_PROCESS)
     * @returns
     * [KO] 생성된 Irradiance DirectCubeTexture
     * [EN] Generated Irradiance DirectCubeTexture
     */
    generate(sourceCubeTexture: GPUTexture, size?: number, phase?: CommandEncoderType): Promise<DirectCubeTexture>;
    /**
     * [KO] 소스 큐브 텍스처로부터 Irradiance를 계산하여 대상 GPUTexture에 렌더링합니다.
     * [EN] Calculates Irradiance from the source cube texture and renders it to the target GPUTexture.
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경맵 (큐브)
     * [EN] Source environment map (Cube)
     * @param targetTexture -
     * [KO] 대상 GPUTexture (2D Array, 6 layers)
     * [EN] Target GPUTexture (2D Array, 6 layers)
     * @param phase -
     * [KO] 커맨드 인코더 단계 (기본값: RESOURCE)
     * [EN] Command encoder phase (default: RESOURCE)
     */
    render(sourceCubeTexture: GPUTexture, targetTexture: GPUTexture, phase?: CommandEncoderType): Promise<void>;
}
export default IrradianceGenerator;
