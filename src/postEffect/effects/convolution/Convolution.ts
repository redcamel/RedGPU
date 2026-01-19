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
 * [KO] 컨볼루션(Convolution) 커널 기반 후처리 이펙트입니다.
 * [EN] Convolution kernel-based post-processing effect.
 *
 * [KO] 다양한 커널(NORMAL, SHARPEN, BLUR, EDGE, EMBOSE)로 이미지 효과를 줄 수 있습니다.
 * [EN] Various kernels (NORMAL, SHARPEN, BLUR, EDGE, EMBOSE) can be used to apply image effects.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
 * effect.kernel = RedGPU.PostEffect.Convolution.SHARPEN;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/convolution/"></iframe>
 * @category PostEffect
 */
class Convolution extends ASinglePassPostEffect {
    /**
     * [KO] NORMAL 커널
     * [EN] NORMAL kernel
     */
    static NORMAL = NORMAL
    /**
     * [KO] SHARPEN 커널
     * [EN] SHARPEN kernel
     */
    static SHARPEN = SHARPEN
    /**
     * [KO] BLUR 커널
     * [EN] BLUR kernel
     */
    static BLUR = BLUR
    /**
     * [KO] EDGE 커널
     * [EN] EDGE kernel
     */
    static EDGE = EDGE
    /**
     * [KO] EMBOSE 커널
     * [EN] EMBOSE kernel
     */
    static EMBOSE = EMBOSE
    /**
     * [KO] 현재 적용 중인 커널
     * [EN] Currently applied kernel
     * @defaultValue BLUR
     */
    #kernel: number[] = BLUR;

    /**
     * [KO] Convolution 인스턴스를 생성합니다.
     * [EN] Creates a Convolution instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
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

    /**
     * [KO] 현재 커널을 반환합니다.
     * [EN] Returns the current kernel.
     */
    get kernel(): number[] {
        return this.#kernel;
    }

    /**
     * [KO] 커널을 설정합니다. (4x4 배열, 길이 16)
     * [EN] Sets the kernel. (4x4 array, length 16)
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
