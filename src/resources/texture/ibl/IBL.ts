import RedGPUContext from "../../../context/RedGPUContext";
import CubeTexture from "../CubeTexture";
import DirectCubeTexture from "../DirectCubeTexture";
import HDRTexture from "../hdr/HDRTexture";

/**
 * [KO] Image-Based Lighting (IBL)을 관리하는 클래스입니다.
 * [EN] Class that manages Image-Based Lighting (IBL).
 *
 * @category IBL
 */
class IBL {
    #redGPUContext: RedGPUContext;
    #sourceCubeTexture: GPUTexture;
    #environmentTexture: DirectCubeTexture;
    #irradianceTexture: DirectCubeTexture;
    #prefilterTexture: DirectCubeTexture;
    #targetTexture: HDRTexture | CubeTexture;
    #environmentSize: number;
    #prefilterSize: number;
    #irradianceSize: number;
    #isInitializing: boolean = false;
    #isAnalyzing: boolean = false;
    #intensityMultiplier: number = 1.0;
    #luminance: number = 20000.0;
    #averageLuminance: number = 1.0;

    /**
     * [KO] IBL 인스턴스를 생성합니다.
     * [EN] Creates an IBL instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
     * @param srcInfo - [KO] 환경맵 소스 (HDR URL 또는 6개 이미지 URL 배열) [EN] Environment map source
     * @param luminance - [KO] 물리적 휘도 (Nit, 기본값: 20000) [EN] Physical luminance (Nit, default: 20000)
     * @param environmentSize - [KO] 환경맵 크기 [EN] Environment map size
     * @param prefilterSize - [KO] Prefilter 크기 [EN] Prefilter size
     * @param irradianceSize - [KO] Irradiance 크기 [EN] Irradiance size
     */
    constructor(
        redGPUContext: RedGPUContext,
        srcInfo: string | [string, string, string, string, string, string],
        luminance: number = 20000,
        environmentSize: number = 1024,
        prefilterSize: number = 512,
        irradianceSize: number = 64
    ) {
        const cacheKeyPart = `${srcInfo}?key=${environmentSize}_${prefilterSize}_${irradianceSize}`;
        this.#prefilterSize = prefilterSize;
        this.#environmentSize = environmentSize;
        this.#irradianceSize = irradianceSize;
        this.#redGPUContext = redGPUContext;
        this.#luminance = luminance;

        this.#environmentTexture = new DirectCubeTexture(redGPUContext, `IBL_ENV_${cacheKeyPart}`);
        this.#prefilterTexture = new DirectCubeTexture(redGPUContext, `IBL_SPECULAR_${cacheKeyPart}`);
        this.#irradianceTexture = new DirectCubeTexture(redGPUContext, `IBL_IRRADIANCE_${cacheKeyPart}`);

        const onLoad = async (v: HDRTexture | CubeTexture) => {
            v.__addDirtyPipelineListener(this.#onSourceChanged);
            if (v.gpuTexture) await this.#onSourceChanged(v);
        };

        if (typeof srcInfo === 'string') {
            this.#targetTexture = new HDRTexture(redGPUContext, srcInfo, onLoad);
        } else {
            this.#targetTexture = new CubeTexture(redGPUContext, srcInfo, true, onLoad);
        }
    }

    get environmentSize(): number { return this.#environmentSize; }
    get prefilterSize(): number { return this.#prefilterSize; }
    get irradianceSize(): number { return this.#irradianceSize; }
    get irradianceTexture(): DirectCubeTexture { return this.#irradianceTexture; }
    get environmentTexture(): DirectCubeTexture { return this.#environmentTexture; }
    get prefilterTexture(): DirectCubeTexture { return this.#prefilterTexture; }

    /** [KO] 아티스트 제어를 위한 강도 배율 [EN] Intensity multiplier for artist control */
    get intensityMultiplier(): number { return this.#intensityMultiplier; }
    set intensityMultiplier(value: number) { this.#intensityMultiplier = value; }

    /** [KO] 물리적 휘도 (단위: cd/m²) [EN] Physical luminance (Unit: cd/m²) */
    get luminance(): number { return this.#luminance; }
    set luminance(value: number) {
        this.#luminance = value;
    }

    /** [KO] 분석된 텍스처의 평균 휘도 (정규화용) [EN] Average luminance of the source image (for normalization) */
    get averageLuminance(): number { return this.#averageLuminance; }
    set averageLuminance(value: number) { this.#averageLuminance = value; }

    #onSourceChanged = async (v?: HDRTexture | CubeTexture) => {
        v = v || this.#targetTexture;
        if (!v || !v.gpuTexture || this.#isInitializing) return;

        this.#isInitializing = true;
        try {
            if (v instanceof HDRTexture) {
                const {equirectangularToCubeGenerator} = this.#redGPUContext.resourceManager;
                const rawCube = await equirectangularToCubeGenerator.generate(v.gpuTexture, this.#environmentSize);
                this.#sourceCubeTexture = rawCube.gpuTexture;
            } else {
                this.#sourceCubeTexture = v.gpuTexture;
            }
            await this.#initMaps();
        } finally {
            this.#isInitializing = false;
        }
    };

    async #initMaps() {
        const {resourceManager} = this.#redGPUContext;
        const {prefilterGenerator, irradianceGenerator} = resourceManager;

        if (this.#sourceCubeTexture) {
            this.#environmentTexture.gpuTexture = this.#sourceCubeTexture;
            const prefiltered = await prefilterGenerator.generate(this.#sourceCubeTexture, this.#prefilterSize);
            this.#prefilterTexture.gpuTexture = prefiltered.gpuTexture;
            const irradiance = await irradianceGenerator.generate(this.#sourceCubeTexture, this.#irradianceSize);
            this.#irradianceTexture.gpuTexture = irradiance.gpuTexture;

            if (!this.#isAnalyzing) {
                this.#isAnalyzing = true;
                const analyzedLuminance = await resourceManager.iblLuminanceAnalyzer.analyze(this.#sourceCubeTexture);
                this.#averageLuminance = analyzedLuminance || 1.0;
                this.#isAnalyzing = false;
            }
        }
    }
}

Object.freeze(IBL);
export default IBL;
