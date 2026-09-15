import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import ASkyAtmosphereLUTGenerator from "../../generator/ASkyAtmosphereLUTGenerator";
/**
 * [KO] SkyLightIrradianceGenerator는 대기 산란 기반의 간접 디퓨즈 조명(Irradiance)을 생성합니다.
 * [EN] SkyLightIrradianceGenerator generates indirect diffuse lighting (Irradiance) based on atmospheric scattering.
 *
 * [KO] 하늘의 모든 방향에 대한 기초 산란광을 큐브맵에 베이킹하고, 이를 다시 디퓨즈 조명용으로 가공합니다.
 * [EN] Bakes base scattered light from all directions of the sky into a cubemap and processes it for diffuse lighting.
 */
declare class SkyLightIrradianceGenerator extends ASkyAtmosphereLUTGenerator {
    #private;
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler);
    get sourceCubeTexture(): GPUTexture;
    get prefilteredTexture(): DirectCubeTexture;
    get lutTexture(): DirectCubeTexture;
    render(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): Promise<void>;
    destroy(): void;
}
export default SkyLightIrradianceGenerator;
