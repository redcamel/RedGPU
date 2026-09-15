import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
/**
 * [KO] SkyViewGenerator는 스카이 뷰(Sky View) LUT를 생성합니다.
 * [EN] SkyViewGenerator creates the Sky View LUT.
 *
 * [KO] 현재 카메라 위치를 기준으로 하늘의 모든 방향에 대한 산란광 강도를 미리 계산하여 2D 텍스처에 저장합니다. 이를 통해 배경(Skybox) 렌더링 시 복잡한 물리 연산 없이 고속으로 하늘을 그릴 수 있습니다.
 * [EN] Precomputes the scattered light intensity for all directions of the sky based on the current camera position and stores it in a 2D texture. This enables high-speed sky rendering without complex physical calculations during background rendering.
 *
 * @category SkyAtmosphere
 */
declare class SkyViewGenerator extends ASkyAtmosphereLUTGenerator {
    #private;
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler);
    get lutTexture(): DirectTexture;
    render(transmittance: DirectTexture, multiScat: DirectTexture): void;
    destroy(): void;
}
export default SkyViewGenerator;
