import RedGPUContext from "../../../../context/RedGPUContext";
import ANoiseTexture, { NoiseDefine } from "../core/ANoiseTexture";
/**
 * @category NoiseTexture
 * @experimental
 */
declare class SimplexTexture extends ANoiseTexture {
    #private;
    constructor(redGPUContext: RedGPUContext, width: number, height: number, define: NoiseDefine);
    get noiseDimension(): number;
    set noiseDimension(value: number);
    get frequency(): number;
    set frequency(value: number);
    get amplitude(): number;
    set amplitude(value: number);
    get octaves(): number;
    set octaves(value: number);
    get persistence(): number;
    set persistence(value: number);
    get lacunarity(): number;
    set lacunarity(value: number);
    get seed(): number;
    set seed(value: number);
    randomizeSeed(): void;
    getSettings(): {
        frequency: number;
        amplitude: number;
        octaves: number;
        persistence: number;
        lacunarity: number;
        seed: number;
    };
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
