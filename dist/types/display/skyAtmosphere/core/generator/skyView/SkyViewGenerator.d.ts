import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
/**
 * [KO] 현재 카메라 위치를 기준으로 하늘의 전 방향 산란광 강도를 저장하는 Sky View 2D LUT 생성기입니다.
 * [EN] Generator for the Sky View 2D LUT that stores scattered light intensity across all sky directions based on the current camera position.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
declare class SkyViewGenerator extends ASkyAtmosphereLUTGenerator {
    #private;
    /**
     * [KO] SkyViewGenerator 인스턴스를 생성합니다.
     * [EN] Creates a SkyViewGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param sharedUniformBuffer -
     * [KO] 대기 파라미터 공유 유니폼 버퍼
     * [EN] Shared uniform buffer for atmospheric parameters
     * @param sampler -
     * [KO] LUT 샘플링용 샘플러
     * [EN] Sampler for LUT sampling
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler);
    /**
     * [KO] 생성된 스카이 뷰(Sky View) LUT 텍스처를 반환합니다.
     * [EN] Returns the generated Sky View LUT texture.
     *
     * @returns
     * [KO] DirectTexture 인스턴스
     * [EN] DirectTexture instance
     */
    get lutTexture(): DirectTexture;
    /**
     * [KO] 투과율 및 다중 산란 LUT를 기반으로 스카이 뷰 LUT를 계산합니다.
     * [EN] Computes the Sky View LUT based on the transmittance and multi-scattering LUTs.
     *
     * @param transmittance -
     * [KO] 투과율(Transmittance) LUT 텍스처
     * [EN] Transmittance LUT texture
     * @param multiScat -
     * [KO] 다중 산란(Multi-Scattering) LUT 텍스처
     * [EN] Multi-Scattering LUT texture
     */
    render(transmittance: DirectTexture, multiScat: DirectTexture): void;
    /**
     * [KO] 생성기 및 내부 리소스를 해제합니다.
     * [EN] Releases the generator and internal resources.
     */
    destroy(): void;
}
export default SkyViewGenerator;
