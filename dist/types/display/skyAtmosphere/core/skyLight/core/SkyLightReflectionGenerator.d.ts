import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import ASkyAtmosphereLUTGenerator from "../../generator/ASkyAtmosphereLUTGenerator";
/**
 * [KO] SkyLightReflectionGenerator는 대기 산란 기반의 간접 스펙큘러 조명(Reflection)을 생성합니다.
 * [EN] SkyLightReflectionGenerator generates indirect specular lighting (Reflection) based on atmospheric scattering.
 *
 * [KO] 정밀한 대기색 큐브맵을 베이킹하고 밉맵을 생성하여, 머티리얼의 거칠기(Roughness)에 따른 반사를 구현합니다.
 * [EN] Bakes a precise atmospheric color cubemap and generates mipmaps to implement reflections according to material roughness.
 */
declare class SkyLightReflectionGenerator extends ASkyAtmosphereLUTGenerator {
    #private;
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler);
    get sourceCubeTexture(): GPUTexture;
    get prefilteredTexture(): DirectCubeTexture;
    get lutTexture(): DirectCubeTexture;
    render(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): Promise<void>;
    destroy(): void;
}
export default SkyLightReflectionGenerator;
