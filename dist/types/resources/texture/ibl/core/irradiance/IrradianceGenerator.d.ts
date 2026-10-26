import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectCubeTexture from "../../../DirectCubeTexture";
import { CommandEncoderType } from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUObject from "../../../../../base/RedGPUObject";
/**
 * [KO] 큐브맵으로부터 난반사(Diffuse) 라이팅에 사용할 Irradiance 맵을 생성하는 클래스입니다.
 * [EN] Class that generates an Irradiance map for diffuse lighting from a cubemap.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const irradianceGenerator = redGPUContext.resourceManager.irradianceGenerator;
 * ```
 *
 * @see [IBL irradiance test example](/RedGPU/examples/3d/skybox/ibl/irradianceTest/)
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
     * // [KO] Irradiance 맵 생성
     * // [EN] Generate Irradiance map
     * const irradianceMap = await redGPUContext.resourceManager.irradianceGenerator.generate(sourceCubeTexture, 64);
     * ```
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경 큐브 텍스처
     * [EN] Source environment cube texture
     * @param size -
     * [KO] 생성할 Irradiance 맵의 한 면 크기 (기본값: 32)
     * [EN] Size of one side of the Irradiance map to generate (default: 32)
     * @param phase -
     * [KO] 커맨드 인코더 실행 단계 (기본값: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * [EN] Command encoder execution phase (default: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * @returns
     * [KO] 생성된 Irradiance `Promise<DirectCubeTexture>`
     * [EN] Generated Irradiance `Promise<DirectCubeTexture>`
     */
    generate(sourceCubeTexture: GPUTexture, size?: number, phase?: CommandEncoderType): Promise<DirectCubeTexture>;
    /**
     * [KO] 소스 큐브 텍스처로부터 Irradiance를 계산하여 대상 `GPUTexture`에 기록합니다.
     * [EN] Calculates Irradiance from the source cube texture and writes it to the target `GPUTexture`.
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경 큐브 텍스처
     * [EN] Source environment cube texture
     * @param targetTexture -
     * [KO] 결과를 기록할 대상 `GPUTexture` (2D Array, 6개 레이어)
     * [EN] Target `GPUTexture` to write the result (2D Array, 6 layers)
     * @param phase -
     * [KO] 커맨드 인코더 실행 단계 (기본값: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * [EN] Command encoder execution phase (default: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * @returns
     * [KO] 작업 완료 `Promise<void>`
     * [EN] Completion `Promise<void>`
     */
    render(sourceCubeTexture: GPUTexture, targetTexture: GPUTexture, phase?: CommandEncoderType): Promise<void>;
    /**
     * [KO] 내부 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Releases internal GPU buffer and pipeline resources.
     */
    destroy(): void;
}
export default IrradianceGenerator;
