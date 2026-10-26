import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
interface SSR {
    /**
     * [KO] 최대 레이 마칭 단계 수 (1 ~ 512)
     * [EN] Maximum number of ray marching steps (1 ~ 512)
     * @defaultValue 64
     */
    maxSteps: number;
    /**
     * [KO] 최대 반사 추적 거리 (단위: 월드 거리, 1.0 ~ 200.0)
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
 * // [KO] View3D의 postEffectManager를 통해 SSR 활성화 및 설정 제어
 * // [EN] Enable and configure SSR through View3D's postEffectManager
 * view.postEffectManager.useSSR = true;
 * const ssr = view.postEffectManager.ssr;
 * ssr.maxSteps = 128;
 * ssr.reflectionIntensity = 0.8;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/ssr/" style="width:100%; height:500px;"></iframe>
 *
 * @see [SSR example](/RedGPU/examples/postEffect/ssr/)
 * @category PostEffect
 */
declare class SSR extends ASinglePassPostEffect {
    /**
     * [KO] SSR 인스턴스를 생성합니다.
     * [EN] Creates an SSR instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default SSR;
