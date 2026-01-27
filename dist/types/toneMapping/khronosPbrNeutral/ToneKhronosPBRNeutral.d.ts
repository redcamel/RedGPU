import RedGPUContext from "../../context/RedGPUContext";
import AToneMappingEffect from "../core/AToneMappingEffect";
/**
 * [KO] Khronos PBR Neutral 톤 매핑을 수행하는 클래스입니다.
 * [EN] Class that performs Khronos PBR Neutral tone mapping.
 * @category ToneMapping
 */
declare class ToneKhronosPBRNeutral extends AToneMappingEffect {
    /**
     * [KO] ToneKhronosPBRNeutral 인스턴스를 생성합니다.
     * [EN] Creates a ToneKhronosPBRNeutral instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default ToneKhronosPBRNeutral;
