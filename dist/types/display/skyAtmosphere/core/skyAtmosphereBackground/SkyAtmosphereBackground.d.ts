import RedGPUContext from "../../../../context/RedGPUContext";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import Sampler from "../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] SkyAtmosphereBackground 클래스는 무한 거리에 위치한 하늘 배경을 렌더링합니다.
 * [EN] The SkyAtmosphereBackground class renders the sky background located at infinite distance.
 *
 * [KO] 미리 계산된 SkyView LUT를 참조하여 전체 화면 삼각형(Full-screen Triangle)에 하늘과 지면의 기초 산란광을 출력합니다.
 * [EN] Renders base scattered light for the sky and ground onto a full-screen triangle by referencing the precomputed SkyView LUT.
 */
declare class SkyAtmosphereBackground extends RedGPUObject {
    #private;
    constructor(redGPUContext: RedGPUContext);
    render(renderViewStateData: RenderViewStateData, transmittanceLUT: DirectTexture, multiScatLUT: DirectTexture, skyViewLUT: DirectTexture, sampler: Sampler): void;
}
export default SkyAtmosphereBackground;
