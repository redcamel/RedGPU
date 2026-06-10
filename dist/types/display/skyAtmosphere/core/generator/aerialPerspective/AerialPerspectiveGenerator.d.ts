import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import View3D from "../../../../view/View3D";
/**
 * [KO] AerialPerspectiveGenerator는 에리얼 퍼스펙티브(Aerial Perspective) LUT를 생성합니다.
 * [EN] AerialPerspectiveGenerator creates the Aerial Perspective LUT.
 *
 * [KO] 카메라와 물체 사이의 거리에 따른 대기 산란 및 투과율 감쇠를 3D LUT에 저장합니다. 이를 통해 씬 내의 일반 오브젝트들에 거리 기반 안개 효과와 공기감을 실시간으로 적용할 수 있습니다.
 * [EN] Stores atmospheric scattering and transmittance attenuation according to the distance between the camera and objects in a 3D LUT. This enables real-time application of distance-based fog and atmospheric feel to general objects in the scene.
 *
 * @category SkyAtmosphere
 */
declare class AerialPerspectiveGenerator extends ASkyAtmosphereLUTGenerator {
    #private;
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler);
    get lutTexture(): DirectCubeTexture;
    render(view: View3D, transmittance: DirectTexture, multiScat: DirectTexture): void;
}
export default AerialPerspectiveGenerator;
