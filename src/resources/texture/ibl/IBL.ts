import RedGPUContext from "../../../context/RedGPUContext";
import CubeTexture from "../CubeTexture";
import HDRTexture from "../hdr/HDRTexture";
import {IBLCubeTexture} from "./core";

/**
 * [KO] Image-Based Lighting (IBL)을 관리하는 클래스입니다.
 * [EN] Class that manages Image-Based Lighting (IBL).
 *
 * [KO] HDR 또는 큐브맵 이미지를 기반으로 주변광(Diffuse)과 반사광(Specular) 환경을 생성하여 사실적인 PBR 라이팅을 구현합니다.
 * [EN] Enables realistic PBR lighting by generating diffuse and specular environments based on HDR or cubemap images.
 *
 * ### Example
 * ```typescript
 * const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr');
 * view.ibl = ibl;
 * ```
 * @category IBL
 */
class IBL {
	#redGPUContext: RedGPUContext;
	#sourceCubeTexture: GPUTexture;
	#environmentTexture: IBLCubeTexture;
	#irradianceTexture: IBLCubeTexture;
	#prefilterTexture: IBLCubeTexture;
	#targetTexture: HDRTexture | CubeTexture;
	#environmentSize: number;
	#prefilterSize: number;
	#irradianceSize: number;
	#isInitializing: boolean = false;

	/**
	 * [KO] IBL 인스턴스를 생성합니다.
	 * [EN] Creates an IBL instance.
	 *
	 * ### Example
	 * ```typescript
	 * const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr', 1024, 512, 64);
	 * ```
	 *
	 * @param redGPUContext -
	 * [KO] RedGPUContext 인스턴스
	 * [EN] RedGPUContext instance
	 * @param srcInfo -
	 * [KO] 환경맵 소스 정보 (HDR URL 또는 6개 이미지 URL 배열)
	 * [EN] Environment map source information (HDR URL or array of 6 image URLs)
	 * @param environmentSize -
	 * [KO] 환경맵 큐브 크기 (기본값: 1024)
	 * [EN] Environment map cube size (default: 1024)
	 * @param prefilterSize -
	 * [KO] Prefilter 큐브 크기 (기본값: 512)
	 * [EN] Prefilter cube size (default: 512)
	 * @param irradianceSize -
	 * [KO] Irradiance 큐브 크기 (기본값: 64)
	 * [EN] Irradiance cube size (default: 64)
	 */
	constructor(
		redGPUContext: RedGPUContext,
		srcInfo: string | [string, string, string, string, string, string],
		environmentSize: number = 1024,
		prefilterSize: number = 512,
		irradianceSize: number = 64
	) {
		const cacheKeyPart = `${srcInfo}?key=${environmentSize}_${prefilterSize}_${irradianceSize}`;
		this.#prefilterSize = prefilterSize;
		this.#environmentSize = environmentSize;
		this.#irradianceSize = irradianceSize;
		this.#redGPUContext = redGPUContext;

		// 맵들을 담을 IBLCubeTexture 플레이스홀더 생성
		this.#environmentTexture = new IBLCubeTexture(redGPUContext, `IBL_ENV_${cacheKeyPart}`);
		this.#prefilterTexture = new IBLCubeTexture(redGPUContext, `IBL_SPECULAR_${cacheKeyPart}`);
		this.#irradianceTexture = new IBLCubeTexture(redGPUContext, `IBL_IRRADIANCE_${cacheKeyPart}`);

		const onLoad = async (v: HDRTexture | CubeTexture) => {
			v.__addDirtyPipelineListener(this.#onSourceChanged);
			if (v.gpuTexture) await this.#onSourceChanged();
		};

		if (typeof srcInfo === 'string') {
			// 2D HDR 소스 로드 및 큐브 변환
			this.#targetTexture = new HDRTexture(redGPUContext, srcInfo, onLoad);
		} else {
			// 6장 이미지 기반 큐브맵 로드
			this.#targetTexture = new CubeTexture(redGPUContext, srcInfo, true, onLoad);
		}
	}

	/**
	 * [KO] 소스 텍스처 변경 시 호출되는 핸들러입니다.
	 * [EN] Handler called when the source texture changes.
	 */
	#onSourceChanged = async () => {
		const v = this.#targetTexture;
		if (!v.gpuTexture || this.#isInitializing) return;

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

	/** [KO] 환경맵 큐브 크기 [EN] Environment map cube size */
	get environmentSize(): number { return this.#environmentSize; }
	/** [KO] Prefilter 큐브 크기 [EN] Prefilter cube size */
	get prefilterSize(): number { return this.#prefilterSize; }
	/** [KO] Irradiance 큐브 크기 [EN] Irradiance cube size */
	get irradianceSize(): number { return this.#irradianceSize; }
	/** [KO] Irradiance 텍스처를 반환합니다. [EN] Returns the irradiance texture. */
	get irradianceTexture(): IBLCubeTexture { return this.#irradianceTexture; }
	/** [KO] 환경맵 텍스처를 반환합니다. [EN] Returns the environment texture. */
	get environmentTexture(): IBLCubeTexture { return this.#environmentTexture; }
	/** [KO] IBL (Specular Prefilter) 텍스처를 반환합니다. [EN] Returns the IBL (Specular Prefilter) texture. */
	get iblTexture(): IBLCubeTexture { return this.#prefilterTexture; }

	/**
	 * [KO] 소스 큐브맵으로부터 IBL용 맵들을 생성합니다.
	 * [EN] Generates IBL maps from the source cubemap.
	 */
	async #initMaps() {
		const { resourceManager } = this.#redGPUContext;
		const { prefilterGenerator, irradianceGenerator } = resourceManager;

		if (this.#sourceCubeTexture) {
			// 1. Environment Texture (배경용)
			this.#environmentTexture.gpuTexture = this.#sourceCubeTexture;

			// 2. Prefilter Map (Specular 반사광용)
			const prefiltered = await prefilterGenerator.generate(this.#sourceCubeTexture, this.#prefilterSize);
			this.#prefilterTexture.gpuTexture = prefiltered.gpuTexture;

			// 3. Irradiance Map (Diffuse 주변광용)
			const irradiance = await irradianceGenerator.generate(this.#sourceCubeTexture, this.#irradianceSize);
			this.#irradianceTexture.gpuTexture = irradiance.gpuTexture;
		}
	}
}

Object.freeze(IBL);
export default IBL;
