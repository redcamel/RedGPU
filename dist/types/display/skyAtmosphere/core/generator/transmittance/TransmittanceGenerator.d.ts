import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
/**
 * [KO] 대기의 고도와 시야각에 따른 빛의 감쇠율을 저장하는 대기 투과율(Transmittance) 2D LUT 생성기입니다.
 * [EN] Generator for the Transmittance 2D LUT that stores light attenuation rates according to atmospheric altitude and viewing angle.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
declare class TransmittanceGenerator extends ASkyAtmosphereLUTGenerator {
    #private;
    /**
     * [KO] TransmittanceGenerator 인스턴스를 생성합니다.
     * [EN] Creates a TransmittanceGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param sharedUniformBuffer -
     * [KO] 대기 파라미터 공유 유니폼 버퍼
     * [EN] Shared uniform buffer for atmospheric parameters
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer);
    /**
     * [KO] 생성된 대기 투과율(Transmittance) LUT 텍스처를 반환합니다.
     * [EN] Returns the generated Transmittance LUT texture.
     *
     * @returns
     * [KO] DirectTexture 인스턴스
     * [EN] DirectTexture instance
     */
    get lutTexture(): DirectTexture;
    /**
     * [KO] 공유 대기 파라미터를 기반으로 투과율 LUT를 계산합니다.
     * [EN] Computes the transmittance LUT based on shared atmospheric parameters.
     */
    render(): void;
    /**
     * [KO] 생성기 및 내부 리소스를 해제합니다.
     * [EN] Releases the generator and internal resources.
     */
    destroy(): void;
}
export default TransmittanceGenerator;
