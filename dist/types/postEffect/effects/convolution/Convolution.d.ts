import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
/**
 * 컨볼루션(Convolution) 커널 기반 후처리 이펙트입니다.
 *
 * 다양한 커널(NORMAL, SHARPEN, BLUR, EDGE, EMBOSE)로 이미지 효과를 줄 수 있습니다.
 *
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
 * effect.kernel = RedGPU.PostEffect.Convolution.SHARPEN;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/convolution/"></iframe>
 */
declare class Convolution extends ASinglePassPostEffect {
    #private;
    /** NORMAL 커널 (기본값) */
    static NORMAL: number[];
    /** SHARPEN 커널 */
    static SHARPEN: number[];
    /** BLUR 커널 */
    static BLUR: number[];
    /** EDGE 커널 */
    static EDGE: number[];
    /** EMBOSE 커널 */
    static EMBOSE: number[];
    /**
     * Convolution 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /** 현재 커널 반환 */
    get kernel(): number[];
    /**
     * 커널 설정
     * 3x3 배열(길이 12) 사용
     * @param value 커널 배열
     */
    set kernel(value: number[]);
}
export default Convolution;
