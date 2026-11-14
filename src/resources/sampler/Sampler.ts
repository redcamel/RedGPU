import RedGPUContext from "../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import ResourceBase from "../core/ResourceBase";

const validFilters: GPUFilterMode[] = Object.values(GPU_FILTER_MODE);
const validUVW: GPUAddressMode[] = Object.values(GPU_ADDRESS_MODE);
const validMipmapFilters: GPUMipmapFilterMode[] = Object.values(GPU_MIPMAP_FILTER_MODE);

/**
 * [KO] GPU 텍스처 샘플러(`GPUSampler`)를 관리하는 클래스입니다.
 * [EN] Class that manages GPU texture samplers (`GPUSampler`).
 *
 * [KO] 필터링 모드, 어드레스 모드, 이방성 필터링(`maxAnisotropy`) 옵션을 설정할 수 있으며, 동일 옵션의 샘플러는 내부적으로 캐싱됩니다.
 * [EN] Configures filtering modes, address modes, and anisotropic filtering (`maxAnisotropy`) options, and caches samplers with identical options internally.
 *
 * ### Example
 * ```typescript
 * const sampler = new RedGPU.Resource.Sampler(redGPUContext, {
 *   magFilter: 'linear',
 *   minFilter: 'linear',
 *   addressModeU: 'repeat',
 *   addressModeV: 'repeat'
 * });
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/texture/bitmapTextureSampler/"></iframe>
 *
 * @see [Sampler Combination example](/RedGPU/examples/3d/texture/samplerCombination/)
 * @see [Sampler AddressMode example](/RedGPU/examples/3d/texture/samplerAddressMode/)
 *
 * @category Sampler
 */
class Sampler extends ResourceBase {
    #gpuSampler: GPUSampler
    #magFilter: GPUFilterMode = GPU_FILTER_MODE.LINEAR
    #minFilter: GPUFilterMode = GPU_FILTER_MODE.LINEAR
    #mipmapFilter: GPUMipmapFilterMode = GPU_MIPMAP_FILTER_MODE.LINEAR
    #addressModeU?: GPUAddressMode = GPU_ADDRESS_MODE.CLAMP_TO_EDGE
    #addressModeV?: GPUAddressMode = GPU_ADDRESS_MODE.CLAMP_TO_EDGE;
    #addressModeW?: GPUAddressMode = GPU_ADDRESS_MODE.REPEAT;
    #lodMinClamp?: number;
    #lodMaxClamp?: number;
    #compare?: GPUCompareFunction;
    #maxAnisotropy: number = 1;

    /**
     * [KO] Sampler 인스턴스를 생성합니다.
     * [EN] Creates a Sampler instance.
     *
     * ### Example
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
     * [KO] GPUSamplerDescriptor 옵션 객체 (선택)
     * [EN] GPUSamplerDescriptor options object (optional)
     */
    constructor(redGPUContext: RedGPUContext, options?: GPUSamplerDescriptor) {
        super(redGPUContext)
        this.#updateSampler(options)
    }

    /**
     * [KO] U축 어드레스 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the address mode for the U coordinate.
     *
     * @returns
     * [KO] U축 어드레스 모드
     * [EN] Address mode for the U coordinate
     */
    get addressModeU(): GPUAddressMode {
        return this.#addressModeU;
    }

    set addressModeU(value: GPUAddressMode) {
        this.#validateAddressMode(value, 'addressModeU')
    }

    /**
     * [KO] V축 어드레스 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the address mode for the V coordinate.
     *
     * @returns
     * [KO] V축 어드레스 모드
     * [EN] Address mode for the V coordinate
     */
    get addressModeV(): GPUAddressMode {
        return this.#addressModeV;
    }

    set addressModeV(value: GPUAddressMode) {
        this.#validateAddressMode(value, 'addressModeV')
    }

    /**
     * [KO] W축 어드레스 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the address mode for the W coordinate.
     *
     * @returns
     * [KO] W축 어드레스 모드
     * [EN] Address mode for the W coordinate
     */
    get addressModeW(): GPUAddressMode {
        return this.#addressModeW;
    }

    set addressModeW(value: GPUAddressMode) {
        this.#validateAddressMode(value, 'addressModeW')
    }

    /**
     * [KO] 밉맵 필터 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the mipmap filter mode.
     *
     * @returns
     * [KO] 밉맵 필터 모드
     * [EN] Mipmap filter mode
     */
    get mipmapFilter(): GPUMipmapFilterMode {
        return this.#mipmapFilter;
    }

    set mipmapFilter(value: GPUMipmapFilterMode) {
        this.#updateAndValidateFilter(value, validMipmapFilters, "mipmapFilter");
    }

    /**
     * [KO] 생성된 `GPUSampler` 객체를 반환합니다.
     * [EN] Returns the created `GPUSampler` object.
     *
     * @returns
     * [KO] WebGPU `GPUSampler` 객체
     * [EN] WebGPU `GPUSampler` object
     */
    get gpuSampler(): GPUSampler {
        return this.#gpuSampler;
    }

    /**
     * [KO] 확대 필터 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the magnification filter mode.
     *
     * @returns
     * [KO] 확대 필터 모드
     * [EN] Magnification filter mode
     */
    get magFilter(): GPUFilterMode {
        return this.#magFilter;
    }

    set magFilter(value: GPUFilterMode) {
        this.#updateAndValidateFilter(value, validFilters, "magFilter");
    }

    /**
     * [KO] 축소 필터 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the minification filter mode.
     *
     * @returns
     * [KO] 축소 필터 모드
     * [EN] Minification filter mode
     */
    get minFilter(): GPUFilterMode {
        return this.#minFilter;
    }

    set minFilter(value: GPUFilterMode) {
        this.#updateAndValidateFilter(value, validFilters, "minFilter");
    }

    /**
     * [KO] 최대 이방성 필터링(`maxAnisotropy`) 값을 반환하거나 설정합니다. (유효 범위: 1~16)
     * [EN] Gets or sets the maximum anisotropy (`maxAnisotropy`) value. (Valid range: 1–16)
     *
     * @returns
     * [KO] 최대 이방성 필터링 값
     * [EN] Maximum anisotropy value
     */
    get maxAnisotropy(): number {
        return this.#maxAnisotropy;
    }

    set maxAnisotropy(value: number) {
        validateUintRange(value, 1, 16)
        this.#maxAnisotropy = value;
        this.#updateSampler();
    }

    /**
     * [KO] 이방성 필터링 설정이 유효한지 여부를 반환합니다. (`magFilter`, `minFilter`, `mipmapFilter`가 모두 `'linear'`여야 유효)
     * [EN] Returns whether the anisotropy setting is valid. (Valid only when `magFilter`, `minFilter`, and `mipmapFilter` are all `'linear'`)
     *
     * @returns
     * [KO] 유효 여부
     * [EN] Whether the setting is valid
     */
    get isAnisotropyValid(): boolean {
        return this.#maxAnisotropy
            ? this.#magFilter === "linear" && this.#minFilter === "linear" && this.#mipmapFilter === "linear"
            : true;
    }

    #onGpuSamplerChanged() {
        this.notifyUpdate()
    }

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

    #getKey(): string {
        return `${this.#magFilter}:${this.#minFilter}:${this.#mipmapFilter}:${this.#addressModeU}:${this.#addressModeV}:${this.#addressModeW}:${this.#lodMinClamp}:${this.#lodMaxClamp}:${this.#compare}:${this.#maxAnisotropy}`;
    }

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

        this.#gpuSampler = this.redGPUContext.resourceManager.createSampler(descriptorKey, samplerOptions);
        this.#onGpuSamplerChanged();
    }
}

Object.freeze(Sampler)


export default Sampler