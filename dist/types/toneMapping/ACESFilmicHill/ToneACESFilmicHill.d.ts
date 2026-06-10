import RedGPUContext from "../../context/RedGPUContext";
import AToneMappingEffect from "../core/AToneMappingEffect";
/**
 * [KO] ACES Filmic (Hill 근사) 톤 매핑을 수행하는 클래스입니다.
 * [EN] Class that performs ACES Filmic (Hill approximation) tone mapping.
 * @category ToneMapping
 */
declare class ToneACESFilmicHill extends AToneMappingEffect {
    /**
     * [KO] ToneACESFilmicHill 인스턴스를 생성합니다.
     * [EN] Creates a ToneACESFilmicHill instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default ToneACESFilmicHill;
