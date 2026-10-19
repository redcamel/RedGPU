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
const EMBOSS = ([
    -2, -1, 0, 0,
    -1, 1, 1, 0,
    0, 1, 2, 0
]);

/**
 * [KO] 3x3 컨볼루션 커널을 사용하여 픽셀을 주변 픽셀과 합성하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that combines pixels with surrounding pixels using a 3x3 convolution kernel.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
 * effect.kernel = RedGPU.PostEffect.Convolution.SHARPEN;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/convolution/" style="width:100%; height:500px;"></iframe>
 * @see [Convolution example](/RedGPU/examples/postEffect/convolution/)
 * @category PostEffect
 */
class Convolution extends ASinglePassPostEffect {
    /**
     * [KO] 원본 유지 기본 커널
     * [EN] Default identity kernel
     */
    static NORMAL = NORMAL;
    /**
     * [KO] 경계 강조 샤픈 커널
     * [EN] Edge-enhancing sharpen kernel
     */
    static SHARPEN = SHARPEN;
    /**
     * [KO] 균일 블러 커널
     * [EN] Uniform blur kernel
     */
    static BLUR = BLUR;
    /**
     * [KO] 외곽선 추출 커널
     * [EN] Edge detection kernel
     */
    static EDGE = EDGE;
    /**
     * [KO] 입체 질감 엠보싱 커널
     * [EN] Embossing kernel
     */
    static EMBOSS = EMBOSS;

    #kernel: number[] = EDGE;

    /**
     * [KO] Convolution 인스턴스를 생성합니다.
     * [EN] Creates a Convolution instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Convolution(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_CONVOLUTION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

    /**
     * [KO] 3x3 커널 데이터(12개 요소의 `mat3x3` 정렬 숫자 배열, 기본값: `Convolution.EDGE`)를 반환하거나 설정합니다.
     * [EN] Returns or sets the 3x3 kernel data (12-element `mat3x3` aligned number array, default: `Convolution.EDGE`).
     *
     * @returns
     * [KO] 커널 데이터 배열
     * [EN] Kernel data array
     */
    get kernel(): number[] {
        return this.#kernel;
    }

    set kernel(value: number[]) {
        this.#kernel = value;
        let kernelWeight = 0;
        this.#kernel.forEach(v => kernelWeight += v);
        this.updateUniform('kernelWeight', kernelWeight || 1);
        this.updateUniform('kernel', value);
    }
}

Object.freeze(Convolution)
export default Convolution
