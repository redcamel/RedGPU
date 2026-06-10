import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";

interface SSR {
    /** [KO] 최대 레이 마칭 단계 수. 값이 클수록 정밀한 반사가 가능하지만 성능 소모가 큽니다. [EN] Maximum number of ray marching steps. Higher values allow more precise reflections but increase performance cost. */
    maxSteps: number;
    /** [KO] 최대 반사 추적 거리 (월드 단위). [EN] Maximum reflection tracking distance (in world units). */
    maxDistance: number;
    /** [KO] 레이 마칭 시 한 단계의 기본 크기. [EN] Base size of a single step during ray marching. */
    stepSize: number;
    /** [KO] 반사 효과의 전체적인 강도. [EN] Overall intensity of the reflection effect. */
    reflectionIntensity: number;
    /** [KO] 거리에 따른 반사 감쇠 시작 거리. [EN] Distance where reflection attenuation starts based on distance. */
    fadeDistance: number;
    /** [KO] 화면 가장자리에서의 반사 페이드 영역 크기. [EN] Reflection fade area size at the screen edges. */
    edgeFade: number;
}

/**
 * [KO] SSR(Screen Space Reflection) 후처리 이펙트입니다.
 * [EN] SSR (Screen Space Reflection) post-processing effect.
 *
 * [KO] 화면상의 깊이(Depth)와 법선(Normal) 정보를 활용하여 실시간 반사 효과를 구현합니다. 레이 마칭(Ray Marching) 기법을 통해 지형 간의 교차점을 찾아내어 정교한 거울 반사 질감을 제공합니다.
 * [EN] Implements real-time reflection effects using screen-space depth and normal information. It finds intersection points between terrains via Ray Marching to provide sophisticated mirror reflection textures.
 *
 * [KO] 이 효과는 HDR 공간에서 동작하여 주변의 밝은 광원을 반사할 때 물리적으로 정확하고 아름다운 광채를 표현합니다.
 * [EN] This effect operates in HDR space, representing physically accurate and beautiful glows when reflecting surrounding bright light sources.
 *
 * * ### Example
 * ```typescript
 * // View3D의 postEffectManager를 통해 사용 여부를 제어합니다.
 * // Controlled through the useSSR property of View3D's postEffectManager.
 * view.postEffectManager.useSSR = true;
 * const ssrEffect = view.postEffectManager.ssr;
 * ssrEffect.maxSteps = 128;
 * ssrEffect.reflectionIntensity = 0.8;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/ssr/"></iframe>
 * @category PostEffect
 */
class SSR extends ASinglePassPostEffect {

    /**
     * [KO] SSR 인스턴스를 생성합니다.
     * [EN] Creates an SSR instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {x: 8, y: 8, z: 1});
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
