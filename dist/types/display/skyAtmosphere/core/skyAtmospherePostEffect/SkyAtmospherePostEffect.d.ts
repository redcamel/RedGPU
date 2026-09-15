import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../../postEffect/core/ASinglePassPostEffect";
import { IPostEffectResult } from "../../../../postEffect/core/types";
import SkyAtmosphere from "../../SkyAtmosphere";
/**
 * [KO] SkyAtmospherePostEffect 클래스는 씬 내의 불투명 오브젝트들에 대기 효과를 적용합니다.
 * [EN] The SkyAtmospherePostEffect class applies atmospheric effects to opaque objects in the scene.
 *
 * [KO] Aerial Perspective 3D LUT를 참조하여 물체의 깊이에 따른 대기 산란광과 투과율 감쇠를 적용함으로써, 멀리 있는 물체가 대기색에 묻히는 효과를 시뮬레이션합니다.
 * [EN] Simulates the effect of distant objects being obscured by atmospheric color by referencing the Aerial Perspective 3D LUT and applying scattered light and transmittance attenuation based on depth.
 */
declare class SkyAtmospherePostEffect extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext, skyAtmosphere: SkyAtmosphere);
    /**
     * [KO] 스카이 대기 포스트 이펙트를 렌더링합니다.
     * [EN] Renders the sky atmosphere post effect.
     *
     * @param view - [KO] 현재 뷰 [EN] Current view
     * @param width - [KO] 너비 [EN] Width
     * @param height - [KO] 높이 [EN] Height
     * @param sourceTextureInfo - [KO] 소스 컬러 텍스처 [EN] Source color texture
     * @returns [KO] 렌더링 결과 [EN] Render result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
    destroy(): void;
}
export default SkyAtmospherePostEffect;
