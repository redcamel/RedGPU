import RedGPUContext from "../../../context/RedGPUContext";
import getAbsoluteURL from "../../../utils/file/getAbsoluteURL";
import ManagementResourceBase from "../../core/ManagementResourceBase";
import ResourceStateHDRTexture from "../../core/resourceManager/resourceState/texture/ResourceStateHDRTexture";
import CubeTexture from "../CubeTexture";
import {IBLCubeTexture} from "../ibl/core";
import HDRTexture from "./HDRTexture";

const MANAGED_STATE_KEY = 'managedHDRTextureState'
type SrcInfo = string | { src: string, cacheKey: string }

/**
 * [KO] 2D HDR 이미지를 큐브맵으로 변환하여 관리하는 클래스입니다.
 * [EN] Class that converts and manages 2D HDR images as cubemaps.
 *
 * [KO] Equirectangular 2D HDR 파일을 로드하여 큐브맵으로 변환하고, IBL 및 스카이박스에 최적화된 프리필터링 과정을 수행합니다.
 * [EN] Loads an Equirectangular 2D HDR file, converts it to a cubemap, and performs a pre-filtering process optimized for IBL and Skybox.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.HDRTextureCube(redGPUContext, 'path/to/image.hdr');
 * ```
 * @category Texture
 */
class HDRTextureCube extends ManagementResourceBase {
	#src: string;
	#hdrTexture2D: HDRTexture;
	#cubeTexture: IBLCubeTexture;
	#cubeMapSize: number = 1024;
	#onLoad: (textureInstance: HDRTextureCube) => void;
	#onError: (error: Error) => void;

	/**
	 * [KO] HDRTextureCube 인스턴스를 생성합니다.
	 * [EN] Creates an HDRTextureCube instance.
	 *
	 * ### Example
	 * ```typescript
	 * const texture = new RedGPU.Resource.HDRTextureCube(redGPUContext, 'assets/hdr/sky.hdr', (v) => {
	 *     console.log('Cube map loaded:', v);
	 * }, null, 1024);
	 * ```
	 *
	 * @param redGPUContext -
	 * [KO] RedGPUContext 인스턴스
	 * [EN] RedGPUContext instance
	 * @param src -
	 * [KO] HDR 파일 경로 또는 정보
	 * [EN] HDR file path or information
	 * @param onLoad -
	 * [KO] 로드 및 변환 완료 콜백
	 * [EN] Load and conversion complete callback
	 * @param onError -
	 * [KO] 에러 콜백
	 * [EN] Error callback
	 * @param cubeMapSize -
	 * [KO] 생성될 큐브맵의 크기 (기본값: 1024)
	 * [EN] Size of the generated cubemap (default: 1024)
	 */
	constructor(
		redGPUContext: RedGPUContext,
		src: SrcInfo,
		onLoad?: (textureInstance?: HDRTextureCube) => void,
		onError?: (error: Error) => void,
		cubeMapSize: number = 1024
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#onLoad = onLoad;
		this.#onError = onError;
		this.#cubeMapSize = cubeMapSize;

		if (src) {
			this.#src = typeof src === 'string' ? src : src.src;
			this.cacheKey = this.#getCacheKey(src);
			const { table } = this.targetResourceManagedState;
			let target: ResourceStateHDRTexture = table.get(this.cacheKey);
			
			if (target) {
				const targetTexture = target.texture as HDRTextureCube;
				this.#onLoad?.(targetTexture);
				return targetTexture;
			} else {
				this.#init(src);
				this.#registerResource();
			}
		}
	}

    /**
     * [KO] 내부 리소스를 초기화하고 변환 과정을 시작합니다.
     * [EN] Initializes internal resources and starts the conversion process.
     *
     * @param src -
     * [KO] 소스 정보
     * [EN] Source info
     */
	async #init(src: SrcInfo) {
		const { resourceManager } = this.redGPUContext;
		
		// 1. 원본 2D HDR 로드
		this.#hdrTexture2D = new HDRTexture(
			this.redGPUContext,
			src,
			async (v) => {
				try {
					// 2. 2D -> Cube 변환
					const rawCube = await resourceManager.equirectangularToCubeGenerator.generate(v.gpuTexture, this.#cubeMapSize);
					
					// 3. Prefiltering (밉맵 및 Roughness 필터링 포함)
					this.#cubeTexture = await resourceManager.prefilterGenerator.generate(rawCube.gpuTexture, this.#cubeMapSize);
					
					// 4. 임시 원본 큐브 제거 (메모리 절약)
					rawCube.destroy();
					
					this.__fireListenerList();
					this.#onLoad?.(this);
				} catch (err) {
					this.#onError?.(err);
				}
			},
			(err) => this.#onError?.(err)
		);
	}

	/** [KO] GPUTexture 객체 (프리필터링된 결과) [EN] GPUTexture object (pre-filtered result) */
	get gpuTexture(): GPUTexture {
		return this.#cubeTexture?.gpuTexture;
	}

	/** [KO] 뷰 디스크립터 [EN] View descriptor */
	get viewDescriptor() {
		return {
			...CubeTexture.defaultViewDescriptor,
			mipLevelCount: this.#cubeTexture?.mipLevelCount || 1
		};
	}

	/** [KO] 밉맵 레벨 개수 [EN] Number of mipmap levels */
	get mipLevelCount(): number {
		return this.#cubeTexture?.mipLevelCount || 1;
	}

	/** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
	get videoMemorySize(): number {
		return this.#cubeTexture?.videoMemorySize || 0;
	}

	/** [KO] 텍스처 소스 경로 [EN] Texture source path */
	get src(): string {
		return this.#src;
	}

	/** [KO] 리소스를 파괴합니다. [EN] Destroys the texture resource. */
	destroy() {
		this.#cubeTexture?.destroy();
		this.#hdrTexture2D?.destroy();
		this.#cubeTexture = null;
		this.#hdrTexture2D = null;
		this.#src = null;
		this.cacheKey = null;
		this.__fireListenerList(true);
		this.#unregisterResource();
	}

	#getCacheKey(srcInfo?: SrcInfo): string {
		let result;
		if (!srcInfo) result = this.uuid;
		if (typeof srcInfo === 'string') {
			result = getAbsoluteURL(window.location.href, srcInfo);
		} else {
			result = srcInfo.cacheKey || getAbsoluteURL(window.location.href, srcInfo.src);
		}
		return `HDRTextureCube_${result}_${this.#cubeMapSize}`;
	}

	#registerResource() {
		this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateHDRTexture(this));
	}

	#unregisterResource() {
		this.redGPUContext.resourceManager.unregisterManagementResource(this);
	}
}

Object.freeze(HDRTextureCube);
export default HDRTextureCube;
