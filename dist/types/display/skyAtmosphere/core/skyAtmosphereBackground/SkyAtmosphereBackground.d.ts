import RedGPUContext from "../../../../context/RedGPUContext";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import Sampler from "../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] 사전 계산된 SkyView LUT를 참조하여 무한 거리의 하늘 배경을 렌더링하는 클래스입니다.
 * [EN] Class that renders the sky background at infinite distance by referencing the precomputed SkyView LUT.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
declare class SkyAtmosphereBackground extends RedGPUObject {
    #private;
    /**
     * [KO] SkyAtmosphereBackground 인스턴스를 생성합니다.
     * [EN] Creates a SkyAtmosphereBackground instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 전체 화면 삼각형(Full-screen Triangle)을 사용하여 하늘과 지면의 산란광 배경을 렌더링합니다.
     * [EN] Renders the scattered light background for the sky and ground using a full-screen triangle.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     * @param transmittanceLUT -
     * [KO] 대기 투과율(Transmittance) LUT 텍스처
     * [EN] Transmittance LUT texture
     * @param multiScatteringLUT -
     * [KO] 다중 산란(Multi-Scattering) LUT 텍스처
     * [EN] Multi-Scattering LUT texture
     * @param skyViewLUT -
     * [KO] 스카이 뷰(Sky View) LUT 텍스처
     * [EN] Sky View LUT texture
     * @param sampler -
     * [KO] LUT 샘플링용 샘플러
     * [EN] Sampler for LUT sampling
     */
    render(renderViewStateData: RenderViewStateData, transmittanceLUT: DirectTexture, multiScatteringLUT: DirectTexture, skyViewLUT: DirectTexture, sampler: Sampler): void;
    /**
     * [KO] 배경 렌더러 및 내부 파이프라인 리소스 참조를 해제합니다.
     * [EN] Releases the background renderer and internal pipeline resource references.
     */
    destroy(): void;
}
export default SkyAtmosphereBackground;
