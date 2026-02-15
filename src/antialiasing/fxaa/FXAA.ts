import RedGPUContext from "../../context/RedGPUContext";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] FXAA(Fast Approximate Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] FXAA (Fast Approximate Anti-Aliasing) post-processing effect.
 *
 * [KO] 화면의 픽셀 정보를 분석하여 엣지 부분을 부드럽게 처리하는 저비용 안티앨리어싱 기법입니다.
 * [EN] A low-cost anti-aliasing technique that smoothens edges by analyzing screen pixel information.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * * ### Example
 * ```typescript
 * // AntialiasingManager를 통해 FXAA 설정 (Configure FXAA via AntialiasingManager)
 * redGPUContext.antialiasingManager.useFXAA = true;
 * ```
 *
 * @category PostEffect
 */
class FXAA extends ASinglePassPostEffect {
    /**
     * [KO] 서브픽셀 품질 (0.0 ~ 1.0)
     * [EN] Subpixel quality (0.0 ~ 1.0)
     * @defaultValue 0.75
     */
    #subpix: number = 0.75
    /**
     * [KO] 엣지 임계값 (0.0 ~ 0.5)
     * [EN] Edge threshold (0.0 ~ 0.5)
     * @defaultValue 0.125
     */
    #edgeThreshold: number = 0.125
    /**
     * [KO] 최소 엣지 임계값 (0.0 ~ 0.1)
     * [EN] Minimum edge threshold (0.0 ~ 0.1)
     * @defaultValue 0.0625
     */
    #edgeThresholdMin: number = 0.0625

    /**
     * [KO] FXAA 인스턴스를 생성합니다.
     * [EN] Creates an FXAA instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);

        this.init(
            redGPUContext,
            'POST_EFFECT_FXAA',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        this.subpix = this.#subpix;
        this.edgeThreshold = this.#edgeThreshold;
        this.edgeThresholdMin = this.#edgeThresholdMin;
    }

    /**
     * [KO] 서브픽셀 품질 값을 반환합니다.
     * [EN] Returns the subpixel quality value.
     *
     * @returns
     * [KO] 서브픽셀 품질
     * [EN] Subpixel quality
     */
    get subpix(): number {
        return this.#subpix;
    }

    /**
     * [KO] 서브픽셀 품질 값을 설정합니다.
     * [EN] Sets the subpixel quality value.
     *
     * @param value -
     * [KO] 서브픽셀 품질 (0.0 ~ 1.0)
     * [EN] Subpixel quality (0.0 ~ 1.0)
     */
    set subpix(value: number) {
        validateNumberRange(value, 0, 1);
        this.#subpix = value;
        this.updateUniform('subpix', value);
    }

    /**
     * [KO] 엣지 임계값을 반환합니다.
     * [EN] Returns the edge threshold.
     *
     * @returns
     * [KO] 엣지 임계값
     * [EN] Edge threshold
     */
    get edgeThreshold(): number {
        return this.#edgeThreshold;
    }

    /**
     * [KO] 엣지 임계값을 설정합니다.
     * [EN] Sets the edge threshold.
     *
     * @param value -
     * [KO] 엣지 임계값 (0.0001 ~ 0.25)
     * [EN] Edge threshold (0.0001 ~ 0.25)
     */
    set edgeThreshold(value: number) {
        validateNumberRange(value, 0.0001, 0.25)
        this.#edgeThreshold = value;
        this.updateUniform('edgeThreshold', value);
    }

    /**
     * [KO] 최소 엣지 임계값을 반환합니다.
     * [EN] Returns the minimum edge threshold.
     *
     * @returns
     * [KO] 최소 엣지 임계값
     * [EN] Minimum edge threshold
     */
    get edgeThresholdMin(): number {
        return this.#edgeThresholdMin;
    }

    /**
     * [KO] 최소 엣지 임계값을 설정합니다.
     * [EN] Sets the minimum edge threshold.
     *
     * @param value -
     * [KO] 최소 엣지 임계값 (0.00001 ~ 0.1)
     * [EN] Minimum edge threshold (0.00001 ~ 0.1)
     */
    set edgeThresholdMin(value: number) {
        validateNumberRange(value, 0.00001, 0.1)
        this.#edgeThresholdMin = value;
        this.updateUniform('edgeThresholdMin', value);
    }
}

Object.freeze(FXAA);
export default FXAA;
