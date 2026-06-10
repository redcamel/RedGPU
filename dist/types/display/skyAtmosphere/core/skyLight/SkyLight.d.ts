import RedGPUContext from "../../../../context/RedGPUContext";
import SkyAtmosphere from "../../SkyAtmosphere";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import Sampler from "../../../../resources/sampler/Sampler";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] SkyLight 클래스는 SkyAtmosphere의 대기 산란 데이터를 실시간으로 분석하여 씬의 간접 조명(IBL)을 생성합니다.
 * [EN] The SkyLight class analyzes SkyAtmosphere's atmospheric scattering data in real-time to generate indirect lighting (IBL) for the scene.
 *
 * [KO] 대기색에 기반한 디퓨즈(Irradiance) 및 스펙큘러(Reflection) 큐브맵을 베이킹하여, 물체들이 하늘색과 태양 위치에 따라 실시간으로 반응하도록 합니다.
 * [EN] Bakes diffuse (Irradiance) and specular (Reflection) cubemaps based on atmospheric color, allowing objects to react in real-time to the sky color and sun position.
 */
declare class SkyLight extends RedGPUObject {
    #private;
    /**
     * [KO] IBL 갱신 여부 (true일 경우 다음 프레임에 갱신 수행)
     * [EN] Whether IBL needs to be updated (if true, update is performed on the next frame)
     */
    dirty: boolean;
    /**
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     * @param sharedUniformBuffer - [KO] 공유 유니폼 버퍼 [EN] Shared uniform buffer
     * @param sampler - [KO] 대기 산란용 샘플러 [EN] Sampler for atmospheric scattering
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler);
    /** [KO] 간접 디퓨즈 조명용 Irradiance LUT [EN] Irradiance LUT for indirect diffuse lighting */
    get irradianceLUT(): DirectCubeTexture;
    /** [KO] 간접 스펙큘러 조명용 Reflection LUT [EN] Reflection LUT for indirect specular lighting */
    get reflectionLUT(): DirectCubeTexture;
    /**
     * [KO] SkyAtmosphere의 상태를 기반으로 IBL 데이터를 업데이트합니다.
     * [EN] Updates IBL data based on the state of SkyAtmosphere.
     * @param skyAtmosphere - [KO] 소스가 되는 SkyAtmosphere 인스턴스 [EN] Source SkyAtmosphere instance
     */
    update(skyAtmosphere: SkyAtmosphere): Promise<void>;
}
export default SkyLight;
