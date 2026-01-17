import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

const NORMAL = ([
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0
]);
const SHARPEN = ([
    0, -1, 0, 0,
    -1, 5, -1, 0,
    0, -1, 0, 0,
])
const BLUR = ([
    1, 1, 1, 0,
    1, 1, 1, 0,
    1, 1, 1, 0
])
const EDGE = ([
    0, 1, 0, 0,
    1, -4, 1, 0,
    0, 1, 0, 0
]);
const EMBOSE = ([
    -2, -1, 0, 0,
    -1, 1, 1, 0,
    0, 1, 2, 0
]);

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
 * <iframe src="/RedGPU/examples/postEffect/convolution/"></iframe>
 */
class Convolution extends ASinglePassPostEffect {
    /** NORMAL 커널 (기본값) */
    static NORMAL = NORMAL
    /** SHARPEN 커널 */
    static SHARPEN = SHARPEN
    /** BLUR 커널 */
    static BLUR = BLUR
    /** EDGE 커널 */
    static EDGE = EDGE
    /** EMBOSE 커널 */
    static EMBOSE = EMBOSE
    /** 현재 적용 중인 커널. 기본값 BLUR */
    #kernel: number[] = BLUR;

    /**
     * Convolution 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_CONVOLUTION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
        this.kernel = this.#kernel
    }

    /** 현재 커널 반환 */
    get kernel(): number[] {
        return this.#kernel;
    }

    /**
     * 커널 설정
     * 3x3 배열(길이 12) 사용
     * @param value 커널 배열
     */
    set kernel(value: number[]) {
        this.#kernel = value;
        let kernelWeight = 0;
        for (const k in this.#kernel) kernelWeight += this.#kernel[k];
        console.log('kernelWeight', kernelWeight);
        this.updateUniform('kernelWeight', kernelWeight)
        this.updateUniform('kernel', value)
    }
}

Object.freeze(Convolution)
export default Convolution
