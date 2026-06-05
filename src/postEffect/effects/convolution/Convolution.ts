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
 * [KO] 컨볼루션(Convolution) 커널 기반 후처리 이펙트입니다.
 * [EN] Post-processing effect based on convolution kernels.
 *
 * [KO] 3x3 행렬 형태의 커널을 사용하여 이미지의 픽셀 정보를 주변 픽셀과 합성합니다.
 * [EN] Combines pixel information with surrounding pixels using a 3x3 matrix kernel.
 *
 * [KO] 이를 통해 샤픈(Sharpen), 블러(Blur), 엠보싱(Emboss), 외곽선 추출(Edge Detection) 등 다양한 예술적 효과를 구현할 수 있습니다.
 * [EN] This allows for various artistic effects such as Sharpen, Blur, Emboss, and Edge Detection.
 *
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
     * [KO] 이미지 변화가 없는 기본 커널입니다.
     * [EN] Default kernel with no image changes.
     */
    static NORMAL = NORMAL;
    /**
     * [KO] 이미지의 경계를 강조하는 샤픈 커널입니다.
     * [EN] Sharpen kernel that emphasizes image edges.
     */
    static SHARPEN = SHARPEN;
    /**
     * [KO] 주변 픽셀을 균일하게 섞는 단순 블러 커널입니다.
     * [EN] Simple blur kernel that uniformly mixes surrounding pixels.
     */
    static BLUR = BLUR;
    /**
     * [KO] 색상 차이가 급격한 경계면을 추출하는 커널입니다.
     * [EN] Kernel for extracting edges with sharp color differences.
     */
    static EDGE = EDGE;
    /**
     * [KO] 이미지에 입체적인 질감을 부여하는 엠보싱 커널입니다.
     * [EN] Emboss kernel that gives a 3D texture feel to the image.
     */
    static EMBOSS = EMBOSS;

    /**
     * [KO] 현재 적용 중인 커널 배열 (3x3 행렬 데이터)
     * [EN] Currently applied kernel array (3x3 matrix data)
     * @defaultValue EDGE
     */
    #kernel: number[] = EDGE;

    /**
     * [KO] Convolution 인스턴스를 생성합니다.
     * [EN] Creates a Convolution instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
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
     * [KO] 현재 설정된 커널 데이터를 반환합니다.
     * [EN] Returns the currently set kernel data.
     */
    get kernel(): number[] {
        return this.#kernel;
    }

    /**
     * [KO] 3x3 커널 데이터를 설정합니다.
     * [EN] Sets the 3x3 kernel data.
     *
     * [KO] 12개의 숫자 배열(mat3x3 정렬 데이터)을 입력받으며, 가중치(Weight)를 자동으로 계산하여 적용합니다.
     * [EN] Receives an array of 12 numbers (mat3x3 aligned data) and automatically calculates and applies the weight.
     */
    set kernel(value: number[]) {
        this.#kernel = value;
        let kernelWeight = 0;
        this.#kernel.forEach(v => kernelWeight += v);
        // [KO] 전체 가중치가 0인 경우(예: EDGE 커널) 밝기 유지를 위해 1을 사용합니다.
        // [EN] If the total weight is 0 (e.g., EDGE kernel), 1 is used to maintain brightness.
        this.updateUniform('kernelWeight', kernelWeight || 1);
        this.updateUniform('kernel', value);
    }
}

Object.freeze(Convolution)
export default Convolution
