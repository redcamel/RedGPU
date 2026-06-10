import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect from "./ASinglePassPostEffect";
import { IPostEffectResult } from "./types";
/**
 * [KO] 다중 패스 후처리 이펙트 추상 클래스입니다.
 * [EN] Abstract class for multi-pass post-processing effects.
 *
 * [KO] 여러 개의 단일 패스(Single-pass) 이펙트를 체인처럼 연결하여 순차적으로 실행하는 기반 클래스입니다.
 * [EN] Base class for chaining and sequentially executing multiple single-pass effects.
 *
 * @category Core
 */
declare abstract class AMultiPassPostEffect extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] AMultiPassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an AMultiPassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param passList -
     * [KO] 순차적으로 적용할 단일 패스 이펙트 배열
     * [EN] Array of single-pass effects to be applied sequentially
     */
    protected constructor(redGPUContext: RedGPUContext, passList: ASinglePassPostEffect[]);
    /**
     * [KO] 모든 내부 패스의 비디오 메모리 사용량을 합산하여 반환합니다.
     * [EN] Returns the sum of video memory usage of all internal passes.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Bytes)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number;
    /**
     * [KO] 등록된 내부 패스 리스트를 반환합니다.
     * [EN] Returns the list of registered internal passes.
     *
     * @returns
     * [KO] 내부 단일 패스 이펙트 배열
     * [EN] Array of internal single-pass post effects
     */
    get passList(): ASinglePassPostEffect[];
    /**
     * [KO] 등록된 모든 내부 패스의 리소스를 해제합니다.
     * [EN] Clears the resources of all registered internal passes.
     */
    clear(): void;
    /**
     * [KO] 모든 패스를 순차적으로 렌더링합니다. 각 패스의 결과는 다음 패스의 입력으로 전달됩니다.
     * [EN] Renders all passes sequentially. The result of each pass is passed as input to the next.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param sourceTextureInfo -
     * [KO] 최초 입력 소스 텍스처 정보
     * [EN] Initial input source texture information
     * @returns
     * [KO] 최종 패스의 렌더링 결과
     * [EN] Rendering result of the final pass
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default AMultiPassPostEffect;
