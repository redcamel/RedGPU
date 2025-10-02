import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "./ASinglePassPostEffect";
/**
 * 다중 패스 후처리 이펙트(AMultiPassPostEffect) 추상 클래스입니다.
 * 여러 개의 단일 패스 이펙트를 순차적으로 적용할 수 있습니다.
 *
 *
 */
declare abstract class AMultiPassPostEffect extends ASinglePassPostEffect {
    #private;
    /**
     * AMultiPassPostEffect 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     * @param passList 적용할 단일 패스 이펙트 배열
     */
    constructor(redGPUContext: RedGPUContext, passList: ASinglePassPostEffect[]);
    /** 비디오 메모리 사용량 반환 */
    get videoMemorySize(): number;
    /** 내부 패스 리스트 반환 */
    get passList(): ASinglePassPostEffect[];
    /** 모든 패스 clear */
    clear(): void;
    /**
     * 모든 패스를 순차적으로 렌더링합니다.
     * @returns 마지막 패스의 결과
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default AMultiPassPostEffect;
