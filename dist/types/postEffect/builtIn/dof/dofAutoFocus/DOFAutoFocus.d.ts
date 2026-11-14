import RedGPUContext from "../../../../context/RedGPUContext";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
/**
 * [KO] 화면 깊이 버퍼(`depthTexture`)의 9-Point Zone AF 다중 측거점과 지수 감쇠 보간(EMA)을 통해 CPU Readback 없이 GPU 내부에서 유효 초점 거리를 산출하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that computes effective focus distance inside the GPU without CPU readback via 9-Point Zone AF multi-point metering on `depthTexture` and Exponential Moving Average (EMA) damping.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
declare class DOFAutoFocus extends ASingleComputePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 수동 초점 거리를 반환합니다.
     * [EN] Returns the manual focus distance.
     *
     * @returns
     * [KO] 수동 초점 거리
     * [EN] Manual focus distance
     */
    get focusDistance(): number;
    set focusDistance(value: number);
    /**
     * [KO] 자동 초점 히스토리 모드를 반환합니다.
     * [EN] Returns the autofocus history mode.
     *
     * @returns
     * [KO] 자동 초점 히스토리 모드
     * [EN] Autofocus history mode
     */
    get historyMode(): number;
    set historyMode(value: number);
}
export default DOFAutoFocus;
