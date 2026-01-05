import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
/**
 * TAA 전용 샤프닝 후처리 이펙트입니다.
 * TAA로 인해 발생하는 블러 현상을 복구합니다.
 */
declare class TAASharpen extends ASinglePassPostEffect {
    #private;
    /**
     * TAASharpen 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /** 샤프닝 강도 반환 */
    get sharpness(): number;
    /**
     * 샤프닝 강도 설정
     * 범위: 0~1
     */
    set sharpness(value: number);
}
export default TAASharpen;
