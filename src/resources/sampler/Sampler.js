import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import ResourceBase from "../core/ResourceBase";
const samplerCache = new Map();
const validFilters = Object.values(GPU_FILTER_MODE);
const validUVW = Object.values(GPU_ADDRESS_MODE);
const validMipmapFilters = Object.values(GPU_MIPMAP_FILTER_MODE);
/**
 * GPU 텍스처 샘플러를 관리하는 클래스입니다.
 *
 * - 샘플러의 필터, 어드레스 모드, 애니소트로피 등 다양한 옵션을 설정할 수 있습니다.
 * - 동일 옵션의 샘플러는 내부적으로 캐싱하여 중복 생성을 방지합니다.
 * - 옵션 변경 시 자동으로 샘플러를 갱신합니다.
 *
 * <iframe src="/RedGPU/examples/3d/texture/bitmapTextureSampler/"></iframe>
 *
 * 아래는 Sampler의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Sampler Combination example](/RedGPU/examples/3d/texture/samplerCombination/)
 * @see [Sampler AddressMode example](/RedGPU/examples/3d/texture/samplerAddressMode/)
 *
 * @category Sampler
 * @extends ResourceBase
 */
class Sampler extends ResourceBase {
    /** GPU 샘플러 객체 */
    #gpuSampler;
    /** 확대 필터 모드 */
    #magFilter = GPU_FILTER_MODE.LINEAR;
    /** 축소 필터 모드 */
    #minFilter = GPU_FILTER_MODE.LINEAR;
    /** 밉맵 필터 모드 */
    #mipmapFilter = GPU_MIPMAP_FILTER_MODE.LINEAR;
    /** U축 어드레스 모드 */
    #addressModeU = GPU_ADDRESS_MODE.CLAMP_TO_EDGE;
    /** V축 어드레스 모드 */
    #addressModeV = GPU_ADDRESS_MODE.CLAMP_TO_EDGE;
    /** W축 어드레스 모드 */
    #addressModeW = GPU_ADDRESS_MODE.REPEAT;
    /** LOD 최소값 */
    #lodMinClamp;
    /** LOD 최대값 */
    #lodMaxClamp;
    /** 비교 함수 */
    #compare;
    /** 최대 애니소트로피 */
    #maxAnisotropy = 1;
    /**
     * Sampler 인스턴스를 생성합니다.
     * @param redGPUContext RedGPUContext 인스턴스
     * @param options GPUSamplerDescriptor 옵션 객체
     */
    constructor(redGPUContext, options) {
        super(redGPUContext);
        this.#updateSampler(options);
    }
    get addressModeU() {
        return this.#addressModeU;
    }
    set addressModeU(value) {
        this.#validateAddressMode(value, 'addressModeU');
    }
    get addressModeV() {
        return this.#addressModeV;
    }
    set addressModeV(value) {
        this.#validateAddressMode(value, 'addressModeV');
    }
    get addressModeW() {
        return this.#addressModeW;
    }
    set addressModeW(value) {
        this.#validateAddressMode(value, 'addressModeW');
    }
    /**
     * Returns the MipmapFilter mode of the GPU object.
     *
     * @returns {GPUMipmapFilterMode} The MipmapFilter mode of the GPU.
     */
    get mipmapFilter() {
        return this.#mipmapFilter;
    }
    /**
     * Sets the mipmap filter mode.
     *
     * @param {GPUMipmapFilterMode} value - The filter mode to be set.
     */
    set mipmapFilter(value) {
        this.#updateAndValidateFilter(value, validMipmapFilters, "mipmapFilter");
    }
    /**
     * Retrieves the GPU sampler associated with the current instance.
     *
     * @returns {GPUSampler} The GPU sampler.
     */
    get gpuSampler() {
        return this.#gpuSampler;
    }
    /**
     * Retrieves the magnification filter mode used by the GPU.
     *
     * @return {GPUFilterMode} The magnification filter mode.
     */
    get magFilter() {
        return this.#magFilter;
    }
    /**
     * Sets the magnification filter mode for the GPU texture.
     *
     * @param {GPUFilterMode} value - The magnification filter mode to be set.
     */
    set magFilter(value) {
        this.#updateAndValidateFilter(value, validFilters, "magFilter");
    }
    /**
     * Returns the minimum filter mode for the GPU filter.
     *
     * @returns {GPUFilterMode} The minimum filter mode for the GPU filter.
     */
    get minFilter() {
        return this.#minFilter;
    }
    /**
     * Sets the value of `minFilter`.
     *
     * @param {GPUFilterMode} value - The new value for `minFilter`.
     */
    set minFilter(value) {
        this.#updateAndValidateFilter(value, validFilters, "minFilter");
    }
    /**
     * Retrieves the maximum anisotropy value.
     *
     * @return {number} The maximum anisotropy value.
     */
    get maxAnisotropy() {
        return this.#maxAnisotropy;
    }
    /**
     * Set the maximum anisotropy value for the sampler.
     *
     * @param {number} value - The value to set as maximum anisotropy. Must be within the range of 1 to 16.
     * @throws {RangeError} If the value is not within the specified range.

     */
    set maxAnisotropy(value) {
        validateUintRange(value, 1, 16);
        this.#maxAnisotropy = value;
        this.#updateSampler();
    }
    get isAnisotropyValid() {
        // Return true if maxAnisotropy is not set, or if it matches valid filtering options
        return this.#maxAnisotropy
            ? this.#magFilter === "linear" && this.#minFilter === "linear" && this.#mipmapFilter === "linear"
            : true;
    }
    #onGpuSamplerChanged() {
        this.__fireListenerList();
    }
    #validateAddressMode(value, modeName) {
        if (!validUVW.includes(value)) {
            consoleAndThrowError(`Invalid ${modeName} value. Must be one of ${validUVW.join(', ')}, but received: ${value}.`);
        }
        else {
            switch (modeName) {
                case 'addressModeU':
                    this.#addressModeU = value;
                    break;
                case 'addressModeV':
                    this.#addressModeV = value;
                    break;
                case 'addressModeW':
                    this.#addressModeW = value;
                    break;
            }
            this.#updateSampler();
        }
    }
    /**
     * Updates and validates the filter value for a specific GPU filter.
     *
     * @param {GPUFilterMode | GPUMipmapFilterMode} filterValue - The new filter value to be updated.
     * @param {string[]} validFilters - An array of valid filter values.
     * @param {string} filterName - The name of the GPU filter to be updated.
     *
     * @throws Throws an error if the filter value is invalid based on the provided valid filters.
     */
    #updateAndValidateFilter(filterValue, validFilters, filterName) {
        if (!validFilters.includes(filterValue) && filterValue !== null) {
            consoleAndThrowError(`Invalid ${filterName} value. Must be one of ${validFilters.join(', ')}, but received: ${filterValue}.`);
        }
        else {
            switch (filterName) {
                case 'mipmapFilter':
                    this.#mipmapFilter = filterValue;
                    break;
                case 'magFilter':
                    this.#magFilter = filterValue;
                    break;
                case 'minFilter':
                    this.#minFilter = filterValue;
                    break;
            }
            this.#updateSampler();
        }
    }
    #getKey() {
        return `${this.#magFilter}:${this.#minFilter}:${this.#mipmapFilter}:${this.#addressModeU}:${this.#addressModeV}:${this.#addressModeW}:${this.#lodMinClamp}:${this.#lodMaxClamp}:${this.#compare}:${this.#maxAnisotropy}`;
    }
    #updateSampler(options) {
        if (options) {
            // Update fields only if valid
            if (options.magFilter)
                this.#magFilter = options.magFilter;
            if (options.minFilter)
                this.#minFilter = options.minFilter;
            if (options.mipmapFilter)
                this.#mipmapFilter = options.mipmapFilter;
            if (options.addressModeU)
                this.#addressModeU = options.addressModeU;
            if (options.addressModeV)
                this.#addressModeV = options.addressModeV;
            if (options.addressModeW)
                this.#addressModeW = options.addressModeW;
            if (options.lodMinClamp !== undefined)
                this.#lodMinClamp = options.lodMinClamp;
            if (options.lodMaxClamp !== undefined)
                this.#lodMaxClamp = options.lodMaxClamp;
            if (options.compare)
                this.#compare = options.compare;
            if (options.maxAnisotropy)
                this.#maxAnisotropy = options.maxAnisotropy;
        }
        if (!this.isAnisotropyValid && this.#maxAnisotropy !== 1) {
            console.warn(`Invalid maxAnisotropy setting (${this.#maxAnisotropy}) detected: magFilter(${this.#magFilter}), minFilter(${this.#minFilter}), mipmapFilter(${this.#mipmapFilter}) must all be set to 'linear' for anisotropic filtering to work. Falling back to default (1).`);
            this.#maxAnisotropy = 1;
        }
        const descriptorKey = this.#getKey();
        if (!samplerCache.has(descriptorKey)) {
            let samplerOptions = {};
            if (this.#magFilter)
                samplerOptions.magFilter = this.#magFilter;
            if (this.#minFilter)
                samplerOptions.minFilter = this.#minFilter;
            if (this.#mipmapFilter)
                samplerOptions.mipmapFilter = this.#mipmapFilter;
            if (this.#addressModeU)
                samplerOptions.addressModeU = this.#addressModeU;
            if (this.#addressModeV)
                samplerOptions.addressModeV = this.#addressModeV;
            if (this.#addressModeW)
                samplerOptions.addressModeW = this.#addressModeW;
            if (this.#lodMinClamp !== undefined)
                samplerOptions.lodMinClamp = this.#lodMinClamp;
            if (this.#lodMaxClamp !== undefined)
                samplerOptions.lodMaxClamp = this.#lodMaxClamp;
            if (this.#compare)
                samplerOptions.compare = this.#compare;
            if (this.#maxAnisotropy)
                samplerOptions.maxAnisotropy = this.#maxAnisotropy;
            // Create sampler and cache it
            samplerCache.set(descriptorKey, this.redGPUContext.gpuDevice.createSampler(samplerOptions));
        }
        // Use cached sampler
        this.#gpuSampler = samplerCache.get(descriptorKey);
        this.#onGpuSamplerChanged();
    }
}
Object.freeze(Sampler);
export default Sampler;
