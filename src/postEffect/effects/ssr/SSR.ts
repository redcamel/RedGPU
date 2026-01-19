import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] SSR(Screen Space Reflection) 후처리 이펙트입니다.
 * [EN] SSR (Screen Space Reflection) post-processing effect.
 *
 * [KO] 화면 공간 반사 효과를 구현합니다. 최대 스텝, 거리, 스텝 크기, 반사 강도, 페이드 거리, 에지 페이드 등 다양한 파라미터를 지원합니다.
 * [EN] Implements screen space reflection effects. Supports various parameters such as max steps, distance, step size, reflection intensity, fade distance, and edge fade.
 *
 * @experimental
 * @category PostEffect
 *
 * @example
 * ```typescript
 * const effect = new RedGPU.PostEffect.SSR(redGPUContext);
 * effect.maxSteps = 128;            // 최대 스텝 수
 * effect.maxDistance = 20.0;        // 최대 반사 거리
 * effect.stepSize = 0.05;           // 스텝 크기
 * effect.reflectionIntensity = 1.2; // 반사 강도
 * effect.fadeDistance = 15.0;       // 페이드 거리
 * effect.edgeFade = 0.2;            // 에지 페이드
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class SSR extends ASinglePassPostEffect {
    /** 
     * [KO] 최대 스텝 수. 기본값 64
     * [EN] Max steps. Default 64
     */
    #maxSteps: number = 64;
    /** 
     * [KO] 최대 반사 거리. 기본값 15.0
     * [EN] Max distance. Default 15.0
     */
    #maxDistance: number = 15.0;
    /** 
     * [KO] 스텝 크기. 기본값 0.02
     * [EN] Step size. Default 0.02
     */
    #stepSize: number = 0.02;
    /** 
     * [KO] 반사 강도. 기본값 1
     * [EN] Reflection intensity. Default 1
     */
    #reflectionIntensity: number = 1;
    /** 
     * [KO] 페이드 거리. 기본값 12.0
     * [EN] Fade distance. Default 12.0
     */
    #fadeDistance: number = 12.0;
    /** 
     * [KO] 에지 페이드. 기본값 0.15
     * [EN] Edge fade. Default 0.15
     */
    #edgeFade: number = 0.15;

    /**
     * [KO] SSR 인스턴스를 생성합니다.
     * [EN] Creates an SSR instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
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

    /** 
     * [KO] 최대 스텝 수
     * [EN] Max steps
     */
    get maxSteps(): number {
        return this.#maxSteps;
    }

    /**
     * [KO] 최대 스텝 수를 설정합니다.
     * [EN] Sets the max steps.
     * 
     * [KO] 범위: 1~512
     * [EN] Range: 1~512
     */
    set maxSteps(value: number) {
        validateNumberRange(value, 1, 512);
        this.#maxSteps = value;
        this.updateUniform('maxSteps', value);
    }

    /** 
     * [KO] 최대 반사 거리
     * [EN] Max reflection distance
     */
    get maxDistance(): number {
        return this.#maxDistance;
    }

    /**
     * [KO] 최대 반사 거리를 설정합니다.
     * [EN] Sets the max reflection distance.
     * 
     * [KO] 범위: 1.0~200.0
     * [EN] Range: 1.0~200.0
     */
    set maxDistance(value: number) {
        validatePositiveNumberRange(value, 1.0, 200.0);
        this.#maxDistance = value;
        this.updateUniform('maxDistance', value);
    }

    /** 
     * [KO] 스텝 크기
     * [EN] Step size
     */
    get stepSize(): number {
        return this.#stepSize;
    }

    /**
     * [KO] 스텝 크기를 설정합니다.
     * [EN] Sets the step size.
     * 
     * [KO] 범위: 0.001~5.0
     * [EN] Range: 0.001~5.0
     */
    set stepSize(value: number) {
        validatePositiveNumberRange(value, 0.001, 5.0);
        this.#stepSize = value;
        this.updateUniform('stepSize', value);
    }

    /** 
     * [KO] 반사 강도
     * [EN] Reflection intensity
     */
    get reflectionIntensity(): number {
        return this.#reflectionIntensity;
    }

    /**
     * [KO] 반사 강도를 설정합니다.
     * [EN] Sets the reflection intensity.
     * 
     * [KO] 범위: 0.0~5.0
     * [EN] Range: 0.0~5.0
     */
    set reflectionIntensity(value: number) {
        validateNumberRange(value, 0.0, 5.0);
        this.#reflectionIntensity = value;
        this.updateUniform('reflectionIntensity', value);
    }

    /** 
     * [KO] 페이드 거리
     * [EN] Fade distance
     */
    get fadeDistance(): number {
        return this.#fadeDistance;
    }

    /**
     * [KO] 페이드 거리를 설정합니다.
     * [EN] Sets the fade distance.
     * 
     * [KO] 범위: 1.0~100.0
     * [EN] Range: 1.0~100.0
     */
    set fadeDistance(value: number) {
        validatePositiveNumberRange(value, 1.0, 100.0);
        this.#fadeDistance = value;
        this.updateUniform('fadeDistance', value);
    }

    /** 
     * [KO] 에지 페이드
     * [EN] Edge fade
     */
    get edgeFade(): number {
        return this.#edgeFade;
    }

    /**
     * [KO] 에지 페이드를 설정합니다.
     * [EN] Sets the edge fade.
     * 
     * [KO] 범위: 0.0~0.5
     * [EN] Range: 0.0~0.5
     */
    set edgeFade(value: number) {
        validateNumberRange(value, 0.0, 0.5);
        this.#edgeFade = value;
        this.updateUniform('edgeFade', value);
    }


}

Object.freeze(SSR);
export default SSR;