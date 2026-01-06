import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * SSR(Screen Space Reflection) 후처리 이펙트입니다.
 * 화면 공간 반사 효과를 구현합니다. 최대 스텝, 거리, 스텝 크기, 반사 강도, 페이드 거리, 에지 페이드 등 다양한 파라미터를 지원합니다.
 *
 * @experimental
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.SSR(redGPUContext);
 * effect.maxSteps = 128;            // 최대 스텝 수
 * effect.maxDistance = 20.0;        // 최대 반사 거리
 * effect.stepSize = 0.05;           // 스텝 크기
 * effect.reflectionIntensity = 1.2; // 반사 강도
 * effect.fadeDistance = 15.0;       // 페이드 거리
 * effect.edgeFade = 0.2;            // 에지 페이드
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/ssr/ssr/"></iframe>
 */
class SSR extends ASinglePassPostEffect {
    /** 최대 스텝 수. 기본값 64, 범위 1~512 */
    #maxSteps: number = 64;
    /** 최대 반사 거리. 기본값 15.0, 범위 1.0~200.0 */
    #maxDistance: number = 15.0;
    /** 스텝 크기. 기본값 0.02, 범위 0.001~5.0 */
    #stepSize: number = 0.02;
    /** 반사 강도. 기본값 1, 범위 0.0~5.0 */
    #reflectionIntensity: number = 1;
    /** 페이드 거리. 기본값 12.0, 범위 1.0~100.0 */
    #fadeDistance: number = 12.0;
    /** 에지 페이드. 기본값 0.15, 범위 0.0~0.5 */
    #edgeFade: number = 0.15;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.WORK_SIZE_X = 8;
        this.WORK_SIZE_Y = 8;
        this.WORK_SIZE_Z = 1;
        this.useDepthTexture = true;
        this.useGBufferNormalTexture = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_SSR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        // 초기값 설정
        this.maxSteps = this.#maxSteps;
        this.maxDistance = this.#maxDistance;
        this.stepSize = this.#stepSize;
        this.reflectionIntensity = this.#reflectionIntensity;
        this.fadeDistance = this.#fadeDistance;
        this.edgeFade = this.#edgeFade;
    }

    /** 최대 스텝 수 반환 */
    get maxSteps(): number {
        return this.#maxSteps;
    }

    /** 최대 스텝 수 설정. 1~512 */
    set maxSteps(value: number) {
        validateNumberRange(value, 1, 512);
        this.#maxSteps = value;
        this.updateUniform('maxSteps', value);
    }

    /** 최대 반사 거리 반환 */
    get maxDistance(): number {
        return this.#maxDistance;
    }

    /** 최대 반사 거리 설정. 1.0~200.0 */
    set maxDistance(value: number) {
        validatePositiveNumberRange(value, 1.0, 200.0);
        this.#maxDistance = value;
        this.updateUniform('maxDistance', value);
    }

    /** 스텝 크기 반환 */
    get stepSize(): number {
        return this.#stepSize;
    }

    /** 스텝 크기 설정. 0.001~5.0 */
    set stepSize(value: number) {
        validatePositiveNumberRange(value, 0.001, 5.0);
        this.#stepSize = value;
        this.updateUniform('stepSize', value);
    }

    /** 반사 강도 반환 */
    get reflectionIntensity(): number {
        return this.#reflectionIntensity;
    }

    /** 반사 강도 설정. 0.0~5.0 */
    set reflectionIntensity(value: number) {
        validateNumberRange(value, 0.0, 5.0);
        this.#reflectionIntensity = value;
        this.updateUniform('reflectionIntensity', value);
    }

    /** 페이드 거리 반환 */
    get fadeDistance(): number {
        return this.#fadeDistance;
    }

    /** 페이드 거리 설정. 1.0~100.0 */
    set fadeDistance(value: number) {
        validatePositiveNumberRange(value, 1.0, 100.0);
        this.#fadeDistance = value;
        this.updateUniform('fadeDistance', value);
    }

    /** 에지 페이드 반환 */
    get edgeFade(): number {
        return this.#edgeFade;
    }

    /** 에지 페이드 설정. 0.0~0.5 */
    set edgeFade(value: number) {
        validateNumberRange(value, 0.0, 0.5);
        this.#edgeFade = value;
        this.updateUniform('edgeFade', value);
    }


}

Object.freeze(SSR);
export default SSR;
