import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../../postEffect/core/ASinglePassPostEffect";
import { IPostEffectResult } from "../../../../postEffect/core/types";
import SkyAtmosphere from "../../SkyAtmosphere";
/**
 * [KO] Aerial Perspective 3D LUT를 참조하여 씬 내 오브젝트들에 깊이에 따른 대기 산란광과 투과율 감쇠를 적용하는 포스트 이펙트 클래스입니다.
 * [EN] Post-effect class that applies depth-based atmospheric scattered light and transmittance attenuation to scene objects by referencing the Aerial Perspective 3D LUT.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
declare class SkyAtmospherePostEffect extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] SkyAtmospherePostEffect 인스턴스를 생성합니다.
     * [EN] Creates a SkyAtmospherePostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param skyAtmosphere -
     * [KO] 연결된 SkyAtmosphere 인스턴스
     * [EN] Associated SkyAtmosphere instance
     */
    constructor(redGPUContext: RedGPUContext, skyAtmosphere: SkyAtmosphere);
    /**
     * [KO] 대기 원근(Aerial Perspective) 포스트 이펙트를 렌더링합니다.
     * [EN] Renders the aerial perspective post-effect.
     *
     * @param view -
     * [KO] 렌더링 대상 View3D 인스턴스
     * [EN] Target View3D instance for rendering
     * @param width -
     * [KO] 렌더 타겟 너비
     * [EN] Render target width
     * @param height -
     * [KO] 렌더 타겟 높이
     * [EN] Render target height
     * @param sourceTextureInfo -
     * [KO] 입력 소스 컬러 텍스처 정보
     * [EN] Input source color texture information
     * @returns
     * [KO] 포스트 이펙트 렌더링 결과
     * [EN] Post-effect render result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
    /**
     * [KO] 포스트 이펙트 인스턴스 및 내부 리소스를 해제합니다.
     * [EN] Releases the post-effect instance and internal resources.
     */
    destroy(): void;
}
export default SkyAtmospherePostEffect;
