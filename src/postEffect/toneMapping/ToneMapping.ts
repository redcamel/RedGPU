
import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"


/**
 * 🎬 ACES 톤매핑 포스트이펙트
 *
 * HDR 콘텐츠를 SDR 디스플레이에 맞게 변환합니다.
 * 다양한 프리셋과 세부 조절을 통해 영상의 톤을 최적화합니다.
 *
 * @example
 * ```typescript
 * const toneMapping = new ToneMapping(redGPUContext);
 * toneMapping.exposure = 1.2;
 * toneMapping.contrast = 1.1;
 * toneMapping.applyPreset(ToneMapping.CINEMATIC);
 * view.postEffectManager.addEffect(toneMapping);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/toneMapping/"></iframe>
 */
class ToneMapping extends ASinglePassPostEffect {


    /** 노출값. 0.1~5.0, 기본값 1.0 */
    #exposure: number = 1.0;
    /** 명암 강도. 0.5~2.0, 기본값 1.0 */
    #contrast: number = 1.0;
    /** 밝기 조절. -1.0~1.0, 기본값 0.0 */
    #brightness: number = 0.0;

    /**
     * ToneMapping 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     * @throws GPU 리소스 생성 실패 시
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TONE_MAPPING',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        this.#updateUniforms();
    }

    /**
     * 노출값 반환
     * @returns 현재 노출값 (0.1~5.0)
     */
    get exposure(): number {
        return this.#exposure;
    }

    /**
     * 노출값 설정
     *
     * 값이 낮을수록 어두워지고, 높을수록 밝아집니다.
     * - 1.0: 기본값
     * - < 1.0: 어두운 처리
     * - > 1.0: 밝은 처리
     *
     * @param value 설정할 노출값 (범위: 0.1~5.0)
     *
     * @example
     * ```typescript
     * toneMapping.exposure = 1.5; // 밝게 조절
     * toneMapping.exposure = 0.8; // 어둡게 조절
     * ```
     */
    set exposure(value: number) {
        this.#exposure = Math.max(0.1, Math.min(5.0, value));
        this.updateUniform('exposure', this.#exposure);
    }

    /**
     * 명암 강도 반환
     * @returns 현재 명암 강도 (0.5~2.0)
     */
    get contrast(): number {
        return this.#contrast;
    }

    /**
     * 명암 강도 설정
     *
     * 밝은 부분과 어두운 부분의 차이를 조절합니다.
     * - 1.0: 기본값
     * - < 1.0: 명암 감소
     * - > 1.0: 명암 증가
     *
     * @param value 설정할 명암 강도 (범위: 0.5~2.0)
     */
    set contrast(value: number) {
        this.#contrast = Math.max(0.5, Math.min(2.0, value));
        this.updateUniform('contrast', this.#contrast);
    }

    /**
     * 밝기 반환
     * @returns 현재 밝기값 (-1.0~1.0)
     */
    get brightness(): number {
        return this.#brightness;
    }

    /**
     * 밝기 조절
     *
     * 전체 장면의 밝기를 일정한 값만큼 이동합니다.
     * - 0.0: 기본값
     * - < 0.0: 어둠
     * - > 0.0: 밝음
     *
     * @param value 설정할 밝기값 (범위: -1.0~1.0)
     */
    set brightness(value: number) {
        this.#brightness = Math.max(-1.0, Math.min(1.0, value));
        this.updateUniform('brightness', this.#brightness);
    }


    /**
     * 내부 유니폼 일괄 갱신
     * @private
     */
    #updateUniforms(): void {
        this.updateUniform('exposure', this.#exposure);
        this.updateUniform('contrast', this.#contrast);
        this.updateUniform('brightness', this.#brightness);
    }
}

Object.freeze(ToneMapping);
export default ToneMapping;