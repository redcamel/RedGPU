import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
/**
 * [KO] TransmittanceGenerator는 대기 투과율(Transmittance) LUT를 생성합니다.
 * [EN] TransmittanceGenerator creates the Transmittance LUT.
 *
 * [KO] 이 LUT는 대기의 특정 고도와 시야각에서 빛이 대기를 통과할 때 얼마나 감쇠되는지를 미리 계산하여 저장합니다. 모든 대기 산란 연산의 가장 기초가 되는 데이터입니다.
 * [EN] This LUT precomputes and stores how much light is attenuated when passing through the atmosphere at specific altitudes and viewing angles. It is the most fundamental data for all atmospheric scattering calculations.
 *
 * @category SkyAtmosphere
 */
declare class TransmittanceGenerator extends ASkyAtmosphereLUTGenerator {
    #private;
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler);
    get lutTexture(): DirectTexture;
    render(): void;
    destroy(): void;
}
export default TransmittanceGenerator;
