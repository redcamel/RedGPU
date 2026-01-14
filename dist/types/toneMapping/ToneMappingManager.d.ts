import View3D from "../display/view/View3D";
import AToneMappingEffect from "./core/AToneMappingEffect";
import TONE_MAPPING_MODE from "./TONE_MAPPING_MODE";
import { ASinglePassPostEffectResult } from "../postEffect/core/ASinglePassPostEffect";
/**
 * 톤 매핑, 노출, 대비, 밝기를 통합 관리하는 클래스입니다.
 */
declare class ToneMappingManager {
    #private;
    constructor(view: View3D);
    get toneMapping(): AToneMappingEffect | undefined;
    get mode(): TONE_MAPPING_MODE;
    set mode(value: TONE_MAPPING_MODE);
    get exposure(): number;
    set exposure(value: number);
    get contrast(): number;
    set contrast(value: number);
    get brightness(): number;
    set brightness(value: number);
    render(width: number, height: number, currentTextureView: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default ToneMappingManager;
