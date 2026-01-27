import RedGPUContext from "../../../../context/RedGPUContext";
import ANoiseTexture, { NoiseDefine } from "../core/ANoiseTexture";
/**
 * [KO] Simplex 노이즈 패턴을 생성하는 텍스처 클래스입니다.
 * [EN] Texture class that generates Simplex noise patterns.
 *
 * [KO] 1D, 2D, 3D Simplex 노이즈를 지원하며, FBM(Fractal Brownian Motion)을 통해 복잡한 패턴을 만들 수 있습니다.
 * [EN] Supports 1D, 2D, and 3D Simplex noise, and can create complex patterns through FBM (Fractal Brownian Motion).
 *
 * * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.SimplexTexture(redGPUContext);
 * ```
 * @experimental
 * @category NoiseTexture
 */
declare class SimplexTexture extends ANoiseTexture {
    #private;
    /**
     * [KO] SimplexTexture 인스턴스를 생성합니다.
     * [EN] Creates a SimplexTexture instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param width - [KO] 텍스처 가로 크기 [EN] Texture width
     * @param height - [KO] 텍스처 세로 크기 [EN] Texture height
     * @param define - [KO] 노이즈 정의 객체 (선택) [EN] Noise definition object (optional)
     */
    constructor(redGPUContext: RedGPUContext, width: number, height: number, define: NoiseDefine);
    /** [KO] 노이즈 차원을 반환합니다. [EN] Returns the noise dimension. */
    get noiseDimension(): number;
    /** [KO] 노이즈 차원을 설정합니다. [EN] Sets the noise dimension. */
    set noiseDimension(value: number);
    /** [KO] 주파수(Frequency)를 반환합니다. [EN] Returns the frequency. */
    get frequency(): number;
    /** [KO] 주파수(Frequency)를 설정합니다. [EN] Sets the frequency. */
    set frequency(value: number);
    /** [KO] 진폭(Amplitude)을 반환합니다. [EN] Returns the amplitude. */
    get amplitude(): number;
    /** [KO] 진폭(Amplitude)을 설정합니다. [EN] Sets the amplitude. */
    set amplitude(value: number);
    /** [KO] 옥타브(Octaves) 수를 반환합니다. [EN] Returns the number of octaves. */
    get octaves(): number;
    /** [KO] 옥타브(Octaves) 수를 설정합니다. [EN] Sets the number of octaves. */
    set octaves(value: number);
    /** [KO] 지속성(Persistence)을 반환합니다. [EN] Returns the persistence. */
    get persistence(): number;
    /** [KO] 지속성(Persistence)을 설정합니다. [EN] Sets the persistence. */
    set persistence(value: number);
    /** [KO] 간극성(Lacunarity)을 반환합니다. [EN] Returns the lacunarity. */
    get lacunarity(): number;
    /** [KO] 간극성(Lacunarity)을 설정합니다. [EN] Sets the lacunarity. */
    set lacunarity(value: number);
    /** [KO] 시드(Seed)를 반환합니다. [EN] Returns the seed. */
    get seed(): number;
    /** [KO] 시드(Seed)를 설정합니다. [EN] Sets the seed. */
    set seed(value: number);
    /** [KO] 시드를 랜덤 값으로 설정합니다. [EN] Randomizes the seed value. */
    randomizeSeed(): void;
    /** [KO] 현재 모든 노이즈 설정을 반환합니다. [EN] Returns all current noise settings. */
    getSettings(): {
        frequency: number;
        amplitude: number;
        octaves: number;
        persistence: number;
        lacunarity: number;
        seed: number;
    };
    /** [KO] 노이즈 설정을 일괄 적용합니다. [EN] Applies noise settings at once. */
    applySettings(settings: Partial<{
        frequency: number;
        amplitude: number;
        octaves: number;
        persistence: number;
        lacunarity: number;
        seed: number;
    }>): void;
}
export default SimplexTexture;
