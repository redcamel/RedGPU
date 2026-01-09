
import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

const SUBTLE = {
    exposure: 0.8,
    contrast: 1.0,
    brightness: 0.0
};

const NORMAL = {
    exposure: 1.0,
    contrast: 1.0,
    brightness: 0.0
};

const BRIGHT = {
    exposure: 1.3,
    contrast: 1.1,
    brightness: 0.1
};

const CINEMATIC = {
    exposure: 1.2,
    contrast: 1.2,
    brightness: -0.05
};

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
    /** 미묘한 톤매핑 프리셋 */
    static SUBTLE = SUBTLE;
    /** 표준 톤매핑 프리셋 */
    static NORMAL = NORMAL;
    /** 밝은 톤매핑 프리셋 */
    static BRIGHT = BRIGHT;
    /** 시네마틱 톤매핑 프리셋 */
    static CINEMATIC = CINEMATIC;

    /** 노출값. 0.1~5.0, 기본값 1.0 */
    #exposure: number = NORMAL.exposure;
    /** 명암 강도. 0.5~2.0, 기본값 1.0 */
    #contrast: number = NORMAL.contrast;
    /** 밝기 조절. -1.0~1.0, 기본값 0.0 */
    #brightness: number = NORMAL.brightness;

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
     * 톤매핑 프리셋 적용
     *
     * 사전 정의된 톤매핑 프리셋을 한 번에 적용합니다.
     *
     * @param preset 적용할 프리셋 (SUBTLE, NORMAL, BRIGHT, CINEMATIC)
     *
     * @example
     * ```typescript
     * toneMapping.applyPreset(ToneMapping.CINEMATIC);
     * toneMapping.applyPreset(ToneMapping.BRIGHT);
     * ```
     */
    applyPreset(preset: typeof SUBTLE | typeof NORMAL | typeof BRIGHT | typeof CINEMATIC): void {
        this.#exposure = preset.exposure;
        this.#contrast = preset.contrast;
        this.#brightness = preset.brightness;
        this.#updateUniforms();
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