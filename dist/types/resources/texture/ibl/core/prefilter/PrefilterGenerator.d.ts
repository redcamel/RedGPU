import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectCubeTexture from "../../../DirectCubeTexture";
import { CommandEncoderType } from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUObject from "../../../../../base/RedGPUObject";
/**
 * [KO] 큐브맵으로부터 거칠기(Roughness) 단계별로 필터링된 반사광 정보를 추출하여 밉맵에 저장하는 클래스입니다.
 * [EN] Class that extracts filtered reflection information for each roughness level from a cubemap and stores it in mipmaps.
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
 * const prefilterGenerator = redGPUContext.resourceManager.prefilterGenerator;
 * ```
 *
 * @see [IBL test example](/RedGPU/examples/3d/skybox/ibl/iblTest/)
 * @category IBL
 */
declare class PrefilterGenerator extends RedGPUObject {
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
     * // [KO] Prefilter 맵 생성
     * // [EN] Generate Prefilter map
     * const prefilteredMap = await redGPUContext.resourceManager.prefilterGenerator.generate(sourceCubeTexture, 512);
     * ```
     *
     * @param sourceCubeTexture -
     * [KO] 소스 환경 큐브 텍스처
     * [EN] Source environment cube texture
     * @param size -
     * [KO] 생성될 큐브맵의 한 면 크기 (기본값: 512)
     * [EN] Size of one side of the generated cubemap (default: 512)
     * @param destinationTexture -
     * [KO] 결과물을 저장할 대상 텍스처 (선택)
     * [EN] Target texture to store the result (optional)
     * @param phase -
     * [KO] 커맨드 인코더 실행 단계 (기본값: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * [EN] Command encoder execution phase (default: `COMMAND_ENCODER_TYPE.RESOURCE`)
     * @returns
     * [KO] 생성되거나 업데이트된 Prefilter `Promise<DirectCubeTexture>`
     * [EN] Generated or updated Prefilter `Promise<DirectCubeTexture>`
     */
    generate(sourceCubeTexture: GPUTexture, size?: number, destinationTexture?: GPUTexture | DirectCubeTexture, phase?: CommandEncoderType): Promise<DirectCubeTexture>;
    /**
     * [KO] 내부 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Releases internal GPU buffer and pipeline resources.
     */
    destroy(): void;
}
export default PrefilterGenerator;
