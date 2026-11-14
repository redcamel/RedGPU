import RedGPUContext from "../../../../context/RedGPUContext";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
/**
 * [KO] 절반 해상도(`1/2`) 배경 보케 버퍼(`passMode = 0`)와 전경 보케+불투명도 버퍼(`passMode = 1`)를 각각 독립적으로 9-Tap Tent 스무딩하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that independently performs 9-Tap Tent smoothing on the half-resolution (`1/2`) background bokeh buffer (`passMode = 0`) and foreground bokeh+opacity buffer (`passMode = 1`).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
declare class DOFPostFilter extends ASingleComputePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext, passMode?: number);
    /**
     * [KO] 패스 모드(`0`: 배경 보케, `1`: 전경 보케)를 반환합니다.
     * [EN] Returns the pass mode (`0`: background bokeh, `1`: foreground bokeh).
     *
     * @returns
     * [KO] 패스 모드
     * [EN] Pass mode
     */
    get passMode(): number;
}
export default DOFPostFilter;
