import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { ASinglePassPostEffectResult } from "../../core/ASinglePassPostEffect";
/**
 * [KO] SSAO(Screen Space Ambient Occlusion) 후처리 이펙트입니다.
 * [EN] SSAO (Screen Space Ambient Occlusion) post-processing effect.
 * @category PostEffect
 */
declare class SSAO extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] SSAO 인스턴스를 생성합니다.
     * [EN] Creates an SSAO instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 블러 사용 여부를 반환합니다.
     * [EN] Returns whether blur is used.
     */
    get useBlur(): boolean;
    /**
     * [KO] 블러 사용 여부를 설정합니다.
     * [EN] Sets whether blur is used.
     */
    set useBlur(value: boolean);
    /**
     * [KO] 반경을 반환합니다.
     * [EN] Returns the radius.
     */
    get radius(): number;
    /**
     * [KO] 반경을 설정합니다.
     * [EN] Sets the radius.
     */
    set radius(value: number);
    /**
     * [KO] 강도를 반환합니다.
     * [EN] Returns the intensity.
     */
    get intensity(): number;
    /**
     * [KO] 강도를 설정합니다.
     * [EN] Sets the intensity.
     */
    set intensity(value: number);
    /**
     * [KO] 바이어스를 반환합니다.
     * [EN] Returns the bias.
     */
    get bias(): number;
    /**
     * [KO] 바이어스를 설정합니다.
     * [EN] Sets the bias.
     */
    set bias(value: number);
    /**
     * [KO] 바이어스 거리 스케일을 반환합니다.
     * [EN] Returns the bias distance scale.
     */
    get biasDistanceScale(): number;
    /**
     * [KO] 바이어스 거리 스케일을 설정합니다.
     * [EN] Sets the bias distance scale.
     */
    set biasDistanceScale(value: number);
    /**
     * [KO] 페이드 시작 거리를 반환합니다.
     * [EN] Returns the fade start distance.
     */
    get fadeDistanceStart(): number;
    /**
     * [KO] 페이드 시작 거리를 설정합니다.
     * [EN] Sets the fade start distance.
     */
    set fadeDistanceStart(value: number);
    /**
     * [KO] 페이드 거리 범위를 반환합니다.
     * [EN] Returns the fade distance range.
     */
    get fadeDistanceRange(): number;
    /**
     * [KO] 페이드 거리 범위를 설정합니다.
     * [EN] Sets the fade distance range.
     */
    set fadeDistanceRange(value: number);
    /**
     * [KO] 대비를 반환합니다.
     * [EN] Returns the contrast.
     */
    get contrast(): number;
    /**
     * [KO] 대비를 설정합니다.
     * [EN] Sets the contrast.
     */
    set contrast(value: number);
    /**
     * [KO] SSAO 효과를 렌더링합니다.
     * [EN] Renders the SSAO effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo
     * [KO] 소스 텍스처 정보
     * [EN] Source texture info
     * @returns
     * [KO] 렌더링 결과
     * [EN] Rendering result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default SSAO;
