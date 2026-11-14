import RedGPUContext from "../../../../context/RedGPUContext";
import SkyAtmosphere from "../../SkyAtmosphere";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import Sampler from "../../../../resources/sampler/Sampler";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../generator/ASkyAtmosphereLUTGenerator";
/**
 * [KO] SkyAtmosphere의 대기 산란 데이터를 기반으로 실시간 간접 조명(IBL)용 정반사(Reflection, Cube 0) 및 난반사(Irradiance, Cube 1) 통합 큐브맵 배열(`texture_cube_array<f32>`)을 생성하는 클래스입니다.
 * [EN] Class that generates an integrated specular (Reflection, Cube 0) and diffuse (Irradiance, Cube 1) cubemap array (`texture_cube_array<f32>`) for real-time indirect lighting (IBL) based on SkyAtmosphere's atmospheric scattering data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
declare class SkyLight extends ASkyAtmosphereLUTGenerator {
    #private;
    /**
     * [KO] SkyLight 인스턴스를 생성합니다.
     * [EN] Creates a SkyLight instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param sharedUniformBuffer -
     * [KO] 대기 파라미터 공유 유니폼 버퍼
     * [EN] Shared uniform buffer for atmospheric parameters
     * @param sampler -
     * [KO] 대기 산란 샘플링용 샘플러
     * [EN] Sampler for atmospheric scattering sampling
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler);
    /**
     * [KO] 생성된 통합 IBL 큐브맵 배열 텍스처(`DirectCubeTexture`)를 반환합니다.
     * [EN] Returns the generated integrated IBL cubemap array texture (`DirectCubeTexture`).
     *
     * @returns
     * [KO] 통합 IBL `DirectCubeTexture` 인스턴스
     * [EN] Integrated IBL `DirectCubeTexture` instance
     */
    get lutTexture(): DirectCubeTexture;
    /**
     * [KO] SkyAtmosphere의 LUT 데이터를 기반으로 정반사 및 난반사 소스 큐브맵을 단일 패스로 베이킹하고 통합 IBL 큐브맵 배열을 갱신합니다.
     * [EN] Bakes specular and diffuse source cubemaps in a single pass based on SkyAtmosphere's LUT data and updates the integrated IBL cubemap array.
     *
     * @param skyAtmosphere -
     * [KO] 소스 SkyAtmosphere 인스턴스
     * [EN] Source SkyAtmosphere instance
     */
    update(skyAtmosphere: SkyAtmosphere): void;
    /**
     * [KO] SkyLight 인스턴스 및 내부 GPU 텍스처 리소스를 해제합니다.
     * [EN] Releases the SkyLight instance and internal GPU texture resources.
     */
    destroy(): void;
}
export default SkyLight;
