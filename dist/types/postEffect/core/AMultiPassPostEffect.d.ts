import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "./ASinglePassPostEffect";
/**
 * [KO] 다중 패스 후처리 이펙트 추상 클래스입니다.
 * [EN] Abstract class for multi-pass post-processing effects.
 *
 * [KO] 여러 개의 단일 패스 이펙트를 순차적으로 적용할 수 있습니다.
 * [EN] Can apply multiple single-pass effects sequentially.
 *
 * @category Core
 */
declare abstract class AMultiPassPostEffect extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] AMultiPassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an AMultiPassPostEffect instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param passList
     * [KO] 적용할 단일 패스 이펙트 배열
     * [EN] Array of single-pass effects to apply
     */
    constructor(redGPUContext: RedGPUContext, passList: ASinglePassPostEffect[]);
    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     */
    get videoMemorySize(): number;
    /**
     * [KO] 내부 패스 리스트를 반환합니다.
     * [EN] Returns the internal pass list.
     */
    get passList(): ASinglePassPostEffect[];
    /**
     * [KO] 모든 패스를 초기화합니다.
     * [EN] Clears all passes.
     */
    clear(): void;
    /**
     * [KO] 모든 패스를 순차적으로 렌더링합니다.
     * [EN] Renders all passes sequentially.
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
     * [EN] Source texture information
     * @returns
     * [KO] 마지막 패스의 결과
     * [EN] Result of the last pass
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default AMultiPassPostEffect;
