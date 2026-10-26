import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectCubeTexture from "../../../DirectCubeTexture";
import RedGPUObject from "../../../../../base/RedGPUObject";
/**
 * [KO] 2D Equirectangular(등장방형도법) 텍스처를 큐브맵으로 변환하는 클래스입니다.
 * [EN] Class that converts a 2D Equirectangular texture into a cubemap.
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
 * const equirectangularToCubeGenerator = redGPUContext.resourceManager.equirectangularToCubeGenerator;
 * ```
 *
 * @see [IBL test example](/RedGPU/examples/3d/skybox/ibl/iblTest/)
 * @category IBL
 */
declare class EquirectangularToCubeGenerator extends RedGPUObject {
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
     * [EN] Converts a 2D Equirectangular texture into a cubemap and returns it.
     *
     * ### Example
     * ```typescript
     * // [KO] 2D HDR 텍스처를 큐브맵으로 변환
     * // [EN] Convert 2D HDR texture to cubemap
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
     * [KO] 생성된 `Promise<DirectCubeTexture>`
     * [EN] Generated `Promise<DirectCubeTexture>`
     */
    generate(sourceTexture: GPUTexture, size?: number): Promise<DirectCubeTexture>;
    /**
     * [KO] 내부 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Releases internal GPU buffer and pipeline resources.
     */
    destroy(): void;
}
export default EquirectangularToCubeGenerator;
