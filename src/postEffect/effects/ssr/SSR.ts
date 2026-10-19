import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";

interface SSR {
    /**
     * [KO] 최대 레이 마칭 단계 수 (1 ~ 512)
     * [EN] Maximum number of ray marching steps (1 ~ 512)
     * @defaultValue 64
     */
    maxSteps: number;
    /**
     * [KO] 최대 반사 추적 거리 (월드 단위, 1.0 ~ 200.0)
     * [EN] Maximum reflection tracking distance in world units (1.0 ~ 200.0)
     * @defaultValue 15.0
     */
    maxDistance: number;
    /**
     * [KO] 레이 마칭 단계 기본 크기 (0.001 ~ 5.0)
     * [EN] Base step size during ray marching (0.001 ~ 5.0)
     * @defaultValue 0.02
     */
    stepSize: number;
    /**
     * [KO] 반사 효과 전체 강도 (0.0 ~ 10)
     * [EN] Overall intensity of the reflection effect (0.0 ~ 10)
     * @defaultValue 1
     */
    reflectionIntensity: number;
    /**
     * [KO] 거리에 따른 반사 감쇠 시작 거리 (1.0 ~ 100.0)
     * [EN] Distance where reflection attenuation starts (1.0 ~ 100.0)
     * @defaultValue 12.0
     */
    fadeDistance: number;
    /**
     * [KO] 화면 가장자리 반사 페이드 영역 크기 (0.0 ~ 0.5)
     * [EN] Reflection fade area size at the screen edges (0.0 ~ 0.5)
     * @defaultValue 0.15
     */
    edgeFade: number;
}

/**
 * [KO] 화면 공간의 깊이(Depth)와 법선(Normal) 정보를 기반으로 레이 마칭을 수행하여 실시간 반사를 구현하는 SSR(Screen Space Reflection) 후처리 이펙트입니다.
 * [EN] Screen Space Reflection (SSR) post-processing effect that implements real-time reflections via ray marching using screen-space depth and normal information.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * view.postEffectManager.useSSR = true;
 * const ssrEffect = view.postEffectManager.ssr;
 * ssrEffect.maxSteps = 128;
 * ssrEffect.reflectionIntensity = 0.8;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/ssr/" style="width:100%; height:500px;"></iframe>
 * @category PostEffect
 */
class SSR extends ASinglePassPostEffect {

    /**
     * [KO] SSR 인스턴스를 생성합니다.
     * [EN] Creates an SSR instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1});
        this.init(
            redGPUContext,
            'POST_EFFECT_SSR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

definePositiveNumber(SSR, [
    {key: 'maxSteps', value: 64, min: 1, max: 512},
    {key: 'maxDistance', value: 15.0, min: 1.0, max: 200.0},
    {key: 'stepSize', value: 0.02, min: 0.001, max: 5.0},
    {key: 'reflectionIntensity', value: 1, min: 0.0, max: 10},
    {key: 'fadeDistance', value: 12.0, min: 1.0, max: 100.0},
    {key: 'edgeFade', value: 0.15, min: 0.0, max: 0.5}
])
Object.freeze(SSR);
export default SSR;
