import RedGPUContext from "../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import ResourceBase from "../core/ResourceBase";

const samplerCache: Map<string, GPUSampler> = new Map()
const validFilters: GPUFilterMode[] = Object.values(GPU_FILTER_MODE);
const validUVW: GPUAddressMode[] = Object.values(GPU_ADDRESS_MODE);
const validMipmapFilters: GPUMipmapFilterMode[] = Object.values(GPU_MIPMAP_FILTER_MODE);

/**
 * [KO] GPU 텍스처 샘플러를 관리하는 클래스입니다.
 * [EN] Class that manages GPU texture samplers.
 *
 * [KO] 샘플러의 필터, 어드레스 모드, 애니소트로피 등 다양한 옵션을 설정할 수 있습니다.
 * [EN] Various options such as sampler's filter, address mode, and anisotropy can be set.
 * [KO] 동일 옵션의 샘플러는 내부적으로 캐싱하여 중복 생성을 방지하며, 옵션 변경 시 자동으로 샘플러를 갱신합니다.
 * [EN] Samplers with the same options are cached internally to prevent redundant creation, and the sampler is automatically updated when options change.
 *
 * <iframe src="/RedGPU/examples/3d/texture/bitmapTextureSampler/"></iframe>
 *
 * @see
 * [KO] 아래는 Sampler의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Sampler.
 * @see [Sampler Combination example](/RedGPU/examples/3d/texture/samplerCombination/)
 * @see [Sampler AddressMode example](/RedGPU/examples/3d/texture/samplerAddressMode/)
 *
 * @category Sampler
 */
class Sampler extends ResourceBase {
    /** [KO] GPU 샘플러 객체 [EN] GPU sampler object */
    #gpuSampler: GPUSampler
    /** [KO] 확대 필터 모드 [EN] Magnification filter mode */
    #magFilter: GPUFilterMode = GPU_FILTER_MODE.LINEAR
    /** [KO] 축소 필터 모드 [EN] Minification filter mode */
    #minFilter: GPUFilterMode = GPU_FILTER_MODE.LINEAR
    /** [KO] 밉맵 필터 모드 [EN] Mipmap filter mode */
    #mipmapFilter: GPUMipmapFilterMode = GPU_MIPMAP_FILTER_MODE.LINEAR
    /** [KO] U축 어드레스 모드 [EN] Address mode for U coordinate */
    #addressModeU?: GPUAddressMode = GPU_ADDRESS_MODE.CLAMP_TO_EDGE
    /** [KO] V축 어드레스 모드 [EN] Address mode for V coordinate */
    #addressModeV?: GPUAddressMode = GPU_ADDRESS_MODE.CLAMP_TO_EDGE;
    /** [KO] W축 어드레스 모드 [EN] Address mode for W coordinate */
    #addressModeW?: GPUAddressMode = GPU_ADDRESS_MODE.REPEAT;
    /** [KO] LOD 최소값 [EN] Minimum LOD clamp */
    #lodMinClamp?: number;
    /** [KO] LOD 최대값 [EN] Maximum LOD clamp */
    #lodMaxClamp?: number;
    /** [KO] 비교 함수 [EN] Comparison function */
    #compare?: GPUCompareFunction;
    /** [KO] 최대 애니소트로피 [EN] Maximum anisotropy */
    #maxAnisotropy: number = 1;

    /**
     * [KO] Sampler 인스턴스를 생성합니다.
     * [EN] Creates a Sampler instance.
     *
     * * ### Example
     * ```typescript
     * const sampler = new RedGPU.Resource.Sampler(redGPUContext, {
     *   magFilter: 'linear',
     *   minFilter: 'linear',
     *   addressModeU: 'repeat',
     *   addressModeV: 'repeat'
     * });
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param options -
     * [KO] GPUSamplerDescriptor 옵션 객체
     * [EN] GPUSamplerDescriptor options object
     */
    constructor(redGPUContext: RedGPUContext, options?: GPUSamplerDescriptor) {
        super(redGPUContext)
        this.#updateSampler(options)
    }

    /** [KO] U축 어드레스 모드 [EN] Address mode for U coordinate */
    get addressModeU(): GPUAddressMode {
        return this.#addressModeU;
    }

    /** [KO] U축 어드레스 모드 설정 [EN] Sets the address mode for U coordinate */
    set addressModeU(value: GPUAddressMode) {
        this.#validateAddressMode(value, 'addressModeU')
    }

    /** [KO] V축 어드레스 모드 [EN] Address mode for V coordinate */
    get addressModeV(): GPUAddressMode {
        return this.#addressModeV;
    }

    /** [KO] V축 어드레스 모드 설정 [EN] Sets the address mode for V coordinate */
    set addressModeV(value: GPUAddressMode) {
        this.#validateAddressMode(value, 'addressModeV')
    }

    /** [KO] W축 어드레스 모드 [EN] Address mode for W coordinate */
    get addressModeW(): GPUAddressMode {
        return this.#addressModeW;
    }

    /** [KO] W축 어드레스 모드 설정 [EN] Sets the address mode for W coordinate */
    set addressModeW(value: GPUAddressMode) {
        this.#validateAddressMode(value, 'addressModeW')
    }

    /**
     * [KO] 밉맵 필터 모드를 반환합니다.
     * [EN] Returns the mipmap filter mode.
     */
    get mipmapFilter(): GPUMipmapFilterMode {
        return this.#mipmapFilter;
    }

    /**
     * [KO] 밉맵 필터 모드를 설정합니다.
     * [EN] Sets the mipmap filter mode.
     * @param value -
     * [KO] 필터 모드
     * [EN] Filter mode
     */
    set mipmapFilter(value: GPUMipmapFilterMode) {
        this.#updateAndValidateFilter(value, validMipmapFilters, "mipmapFilter");
    }

    /**
     * [KO] GPU 샘플러 객체를 반환합니다.
     * [EN] Returns the GPU sampler object.
     */
    get gpuSampler(): GPUSampler {
        return this.#gpuSampler;
    }

    /**
     * [KO] 확대 필터 모드를 반환합니다.
     * [EN] Returns the magnification filter mode.
     */
    get magFilter(): GPUFilterMode {
        return this.#magFilter;
    }

    /**
     * [KO] 확대 필터 모드를 설정합니다.
     * [EN] Sets the magnification filter mode.
     * @param value -
     * [KO] 필터 모드
     * [EN] Filter mode
     */
    set magFilter(value: GPUFilterMode) {
        this.#updateAndValidateFilter(value, validFilters, "magFilter");
    }

    /**
     * [KO] 축소 필터 모드를 반환합니다.
     * [EN] Returns the minification filter mode.
     */
    get minFilter(): GPUFilterMode {
        return this.#minFilter;
    }

    /**
     * [KO] 축소 필터 모드를 설정합니다.
     * [EN] Sets the minification filter mode.
     * @param value -
     * [KO] 필터 모드
     * [EN] Filter mode
     */
    set minFilter(value: GPUFilterMode) {
        this.#updateAndValidateFilter(value, validFilters, "minFilter");
    }

    /**
     * [KO] 최대 애니소트로피 값을 반환합니다.
     * [EN] Returns the maximum anisotropy value.
     */
    get maxAnisotropy(): number {
        return this.#maxAnisotropy;
    }

    /**
     * [KO] 최대 애니소트로피 값을 설정합니다. (1~16 사이)
     * [EN] Sets the maximum anisotropy value. (Between 1 and 16)
     * @param value -
     * [KO] 애니소트로피 값
     * [EN] Anisotropy value
     * @throws
     * [KO] 1 미만 또는 16 초과 시 RangeError 발생
     * [EN] Throws RangeError if value is less than 1 or greater than 16
     */
    set maxAnisotropy(value: number) {
        validateUintRange(value, 1, 16)
        this.#maxAnisotropy = value;
        this.#updateSampler();
    }

    /**
     * [KO] 애니소트로피 설정이 유효한지 확인합니다. (모든 필터가 'linear'여야 함)
     * [EN] Checks if the anisotropy setting is valid. (All filters must be 'linear')
     */
    get isAnisotropyValid(): boolean {
        return this.#maxAnisotropy
            ? this.#magFilter === "linear" && this.#minFilter === "linear" && this.#mipmapFilter === "linear"
            : true;
    }

    /**
     * [KO] GPU 샘플러 변경 시 리스너를 호출합니다.
     * [EN] Calls listeners when the GPU sampler changes.
     */
    #onGpuSamplerChanged() {
        this.__fireListenerList()
    }

    /**
     * [KO] 어드레스 모드 값의 유효성을 검사합니다.
     * [EN] Validates the address mode value.
     */
    #validateAddressMode(value: GPUAddressMode, modeName: string) {
        if (!validUVW.includes(value)) {
            consoleAndThrowError(`Invalid ${modeName} value. Must be one of ${validUVW.join(', ')}, but received: ${value}.`);
        } else {
            switch (modeName) {
                case 'addressModeU':
                    this.#addressModeU = value;
                    break
                case 'addressModeV':
                    this.#addressModeV = value;
                    break
                case 'addressModeW':
                    this.#addressModeW = value;
                    break
            }
            this.#updateSampler();
        }
    }

    /**
     * [KO] 필터 값의 유효성을 검사하고 샘플러를 업데이트합니다.
     * [EN] Validates the filter value and updates the sampler.
     */
    #updateAndValidateFilter(filterValue: GPUFilterMode | GPUMipmapFilterMode,
                             validFilters: string[], filterName: string) {
        if (!validFilters.includes(filterValue) && filterValue !== null) {
            consoleAndThrowError(`Invalid ${filterName} value. Must be one of ${validFilters.join(', ')}, but received: ${filterValue}.`);
        } else {
            switch (filterName) {
                case 'mipmapFilter':
                    this.#mipmapFilter = filterValue;
                    break
                case 'magFilter':
                    this.#magFilter = filterValue;
                    break
                case 'minFilter':
                    this.#minFilter = filterValue;
                    break
            }
            this.#updateSampler();
        }
    }

    /** [KO] 현재 옵션을 기반으로 캐시 키를 생성합니다. [EN] Creates a cache key based on current options. */
    #getKey(): string {
        return `${this.#magFilter}:${this.#minFilter}:${this.#mipmapFilter}:${this.#addressModeU}:${this.#addressModeV}:${this.#addressModeW}:${this.#lodMinClamp}:${this.#lodMaxClamp}:${this.#compare}:${this.#maxAnisotropy}`;
    }

    /** [KO] 샘플러 옵션을 업데이트하고 필요한 경우 새로운 GPUSampler를 생성합니다. [EN] Updates sampler options and creates a new GPUSampler if necessary. */
    #updateSampler(options?: GPUSamplerDescriptor) {
        if (options) {
            if (options.magFilter) this.#magFilter = options.magFilter;
            if (options.minFilter) this.#minFilter = options.minFilter;
            if (options.mipmapFilter) this.#mipmapFilter = options.mipmapFilter;
            if (options.addressModeU) this.#addressModeU = options.addressModeU;
            if (options.addressModeV) this.#addressModeV = options.addressModeV;
            if (options.addressModeW) this.#addressModeW = options.addressModeW;
            if (options.lodMinClamp !== undefined) this.#lodMinClamp = options.lodMinClamp;
            if (options.lodMaxClamp !== undefined) this.#lodMaxClamp = options.lodMaxClamp;
            if (options.compare) this.#compare = options.compare;
            if (options.maxAnisotropy) this.#maxAnisotropy = options.maxAnisotropy;
        }
        if (!this.isAnisotropyValid && this.#maxAnisotropy !== 1) {
            console.warn(
                `Invalid maxAnisotropy setting (${this.#maxAnisotropy}) detected: magFilter(${this.#magFilter}), minFilter(${this.#minFilter}), mipmapFilter(${this.#mipmapFilter}) must all be set to 'linear' for anisotropic filtering to work. Falling back to default (1).`
            );
            this.#maxAnisotropy = 1;
        }
        const descriptorKey = this.#getKey();
        if (!samplerCache.has(descriptorKey)) {
            let samplerOptions: GPUSamplerDescriptor = {};
            if (this.#magFilter) samplerOptions.magFilter = this.#magFilter;
            if (this.#minFilter) samplerOptions.minFilter = this.#minFilter;
            if (this.#mipmapFilter) samplerOptions.mipmapFilter = this.#mipmapFilter;
            if (this.#addressModeU) samplerOptions.addressModeU = this.#addressModeU;
            if (this.#addressModeV) samplerOptions.addressModeV = this.#addressModeV;
            if (this.#addressModeW) samplerOptions.addressModeW = this.#addressModeW;
            if (this.#lodMinClamp !== undefined) samplerOptions.lodMinClamp = this.#lodMinClamp;
            if (this.#lodMaxClamp !== undefined) samplerOptions.lodMaxClamp = this.#lodMaxClamp;
            if (this.#compare) samplerOptions.compare = this.#compare;
            if (this.#maxAnisotropy) samplerOptions.maxAnisotropy = this.#maxAnisotropy;
            samplerCache.set(
                descriptorKey,
                this.redGPUContext.gpuDevice.createSampler(samplerOptions)
            );
        }
        this.#gpuSampler = samplerCache.get(descriptorKey);
        this.#onGpuSamplerChanged();
    }
}

Object.freeze(Sampler)
export default Sampler