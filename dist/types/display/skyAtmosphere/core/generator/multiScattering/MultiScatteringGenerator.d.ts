import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
/**
 * [KO] MultiScatteringGenerator는 다중 산란(Multi-Scattering) LUT를 생성합니다.
 * [EN] MultiScatteringGenerator creates the Multi-Scattering LUT.
 *
 * [KO] 빛이 대기 입자에 여러 번 부딪혀 발생하는 추가적인 산란광을 시뮬레이션합니다. 이를 통해 하늘의 전체적인 에너지 보존을 실현하고, 대기가 더 밝고 풍부하게 표현되도록 합니다.
 * [EN] Simulates additional scattered light caused by light hitting atmospheric particles multiple times. This achieves overall energy conservation in the sky and makes the atmosphere appear brighter and richer.
 *
 * @category SkyAtmosphere
 */
declare class MultiScatteringGenerator extends ASkyAtmosphereLUTGenerator {
    #private;
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler);
    get lutTexture(): DirectTexture;
    render(transmittance: DirectTexture): void;
    destroy(): void;
}
export default MultiScatteringGenerator;
