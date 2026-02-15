import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 필름 그레인 프리셋 정의 (업계 표준 수치 기반)
 * [EN] Film Grain preset definitions (Based on industry standard values)
 */
const SUBTLE = { filmGrainIntensity: 0.008, filmGrainResponse: 1.5, filmGrainScale: 1.2, coloredGrain: 0.05, grainSaturation: 0.1 };
const MEDIUM = { filmGrainIntensity: 0.015, filmGrainResponse: 1.2, filmGrainScale: 1.8, coloredGrain: 0.15, grainSaturation: 0.3 };
const HEAVY = { filmGrainIntensity: 0.03, filmGrainResponse: 1.0, filmGrainScale: 2.5, coloredGrain: 0.25, grainSaturation: 0.5 };
const VINTAGE = { filmGrainIntensity: 0.06, filmGrainResponse: 0.7, filmGrainScale: 4.0, coloredGrain: 0.6, grainSaturation: 0.8 };

/**
 * [KO] 현대적인 시네마틱 필름 그레인(Film Grain) 후처리 이펙트입니다.
 * [EN] Modern cinematic Film Grain post-processing effect.
 *
 * @category Visual Effects
 */
class FilmGrain extends ASinglePassPostEffect {
    static SUBTLE = SUBTLE;
    static MEDIUM = MEDIUM;
    static HEAVY = HEAVY;
    static VINTAGE = VINTAGE;

    // [KO] 초기값을 시각적으로 임팩트가 있는 VINTAGE 프리셋으로 설정 (데모 및 예제 최적화)
    // [EN] Set initial values to VINTAGE preset for immediate visual impact (Optimized for demos and examples)
    #filmGrainIntensity: number = VINTAGE.filmGrainIntensity;
    #filmGrainResponse: number = VINTAGE.filmGrainResponse;
    #filmGrainScale: number = VINTAGE.filmGrainScale;
    #coloredGrain: number = VINTAGE.coloredGrain;
    #grainSaturation: number = VINTAGE.grainSaturation;
    #time: number = 0.0;
    #devicePixelRatio: number = 1.0;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#devicePixelRatio = window?.devicePixelRatio || 1.0;
        this.init(
            redGPUContext,
            'POST_EFFECT_FILM_GRAIN',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        this.#updateUniforms();
    }

    get filmGrainIntensity(): number { return this.#filmGrainIntensity; }
    set filmGrainIntensity(v: number) { this.#filmGrainIntensity = v; this.updateUniform('filmGrainIntensity', v); }

    get filmGrainResponse(): number { return this.#filmGrainResponse; }
    set filmGrainResponse(v: number) { this.#filmGrainResponse = v; this.updateUniform('filmGrainResponse', v); }

    get filmGrainScale(): number { return this.#filmGrainScale; }
    set filmGrainScale(v: number) { this.#filmGrainScale = v; this.updateUniform('filmGrainScale', v); }

    get coloredGrain(): number { return this.#coloredGrain; }
    set coloredGrain(v: number) { this.#coloredGrain = v; this.updateUniform('coloredGrain', v); }

    get grainSaturation(): number { return this.#grainSaturation; }
    set grainSaturation(v: number) { this.#grainSaturation = v; this.updateUniform('grainSaturation', v); }

    applyPreset(preset: typeof SUBTLE): void {
        this.#filmGrainIntensity = preset.filmGrainIntensity;
        this.#filmGrainResponse = preset.filmGrainResponse;
        this.#filmGrainScale = preset.filmGrainScale;
        this.#coloredGrain = preset.coloredGrain;
        this.#grainSaturation = preset.grainSaturation;
        this.#updateUniforms();
    }

    update(deltaTime: number): void {
        this.#time += deltaTime;
        if (this.#time > 1000.0) this.#time -= 1000.0;
        this.updateUniform('time', this.#time);
    }

    #updateUniforms(): void {
        this.updateUniform('filmGrainIntensity', this.#filmGrainIntensity);
        this.updateUniform('filmGrainResponse', this.#filmGrainResponse);
        this.updateUniform('filmGrainScale', this.#filmGrainScale);
        this.updateUniform('coloredGrain', this.#coloredGrain);
        this.updateUniform('grainSaturation', this.#grainSaturation);
        this.updateUniform('time', this.#time);
        this.updateUniform('devicePixelRatio', this.#devicePixelRatio);
    }
}

Object.freeze(FilmGrain);
export default FilmGrain;
