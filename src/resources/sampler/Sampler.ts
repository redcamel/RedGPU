import RedGPUContext from "../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import ResourceBase from "../ResourceBase";

const samplerCache: Map<string, GPUSampler> = new Map()
const validFilters: GPUFilterMode[] = Object.values(GPU_FILTER_MODE);
const validUVW: GPUAddressMode[] = Object.values(GPU_ADDRESS_MODE);
const validMipmapFilters: GPUMipmapFilterMode[] = Object.values(GPU_MIPMAP_FILTER_MODE);

/**
 * Class representing a sampler for GPU textures.
 *
 * @extends ResourceBase
 */
class Sampler extends ResourceBase {
	#gpuSampler: GPUSampler
	#magFilter: GPUFilterMode = GPU_FILTER_MODE.LINEAR
	#minFilter: GPUFilterMode = GPU_FILTER_MODE.LINEAR
	#mipmapFilter: GPUMipmapFilterMode = GPU_MIPMAP_FILTER_MODE.LINEAR
	#addressModeU?: GPUAddressMode = GPU_ADDRESS_MODE.CLAMP_TO_EDGE
	#addressModeV?: GPUAddressMode = GPU_ADDRESS_MODE.CLAMP_TO_EDGE;
	#addressModeW?: GPUAddressMode = GPU_ADDRESS_MODE.REPEAT;
	#lodMinClamp?: number;// TODO
	#lodMaxClamp?: number;// TODO
	#compare?: GPUCompareFunction;
	#maxAnisotropy: number = 1;

	/**
	 *
	 * @param redGPUContext
	 * @param options
	 */
	constructor(redGPUContext: RedGPUContext, options?: GPUSamplerDescriptor) {
		super(redGPUContext)
		this.#updateSampler(options)
	}

	get addressModeU(): GPUAddressMode {
		return this.#addressModeU;
	}

	set addressModeU(value: GPUAddressMode) {
		this.#validateAddressMode(value, 'addressModeU')
	}

	get addressModeV(): GPUAddressMode {
		return this.#addressModeV;
	}

	set addressModeV(value: GPUAddressMode) {
		this.#validateAddressMode(value, 'addressModeV')
	}

	get addressModeW(): GPUAddressMode {
		return this.#addressModeW;
	}

	set addressModeW(value: GPUAddressMode) {
		this.#validateAddressMode(value, 'addressModeW')
	}

	/**
	 * Returns the MipmapFilter mode of the GPU object.
	 *
	 * @returns {GPUMipmapFilterMode} The MipmapFilter mode of the GPU.
	 */
	get mipmapFilter(): GPUMipmapFilterMode {
		return this.#mipmapFilter;
	}

	/**
	 * Sets the mipmap filter mode.
	 *
	 * @param {GPUMipmapFilterMode} value - The filter mode to be set.
	 */
	set mipmapFilter(value: GPUMipmapFilterMode) {
		this.#updateAndValidateFilter(value, validMipmapFilters, "mipmapFilter");
	}

	/**
	 * Retrieves the GPU sampler associated with the current instance.
	 *
	 * @returns {GPUSampler} The GPU sampler.
	 */
	get gpuSampler(): GPUSampler {
		return this.#gpuSampler;
	}

	/**
	 * Retrieves the magnification filter mode used by the GPU.
	 *
	 * @return {GPUFilterMode} The magnification filter mode.
	 */
	get magFilter(): GPUFilterMode {
		return this.#magFilter;
	}

	/**
	 * Sets the magnification filter mode for the GPU texture.
	 *
	 * @param {GPUFilterMode} value - The magnification filter mode to be set.
	 */
	set magFilter(value: GPUFilterMode) {
		this.#updateAndValidateFilter(value, validFilters, "magFilter");
	}

	/**
	 * Returns the minimum filter mode for the GPU filter.
	 *
	 * @returns {GPUFilterMode} The minimum filter mode for the GPU filter.
	 */
	get minFilter(): GPUFilterMode {
		return this.#minFilter;
	}

	/**
	 * Sets the value of `minFilter`.
	 *
	 * @param {GPUFilterMode} value - The new value for `minFilter`.
	 */
	set minFilter(value: GPUFilterMode) {
		this.#updateAndValidateFilter(value, validFilters, "minFilter");
	}

	/**
	 * Retrieves the maximum anisotropy value.
	 *
	 * @return {number} The maximum anisotropy value.
	 */
	get maxAnisotropy(): number {
		return this.#maxAnisotropy;
	}

	/**
	 * Set the maximum anisotropy value for the sampler.
	 *
	 * @param {number} value - The value to set as maximum anisotropy. Must be within the range of 1 to 16.
	 * @throws {RangeError} If the value is not within the specified range.

	 */
	set maxAnisotropy(value: number) {
		validateUintRange(value, 1, 16)
		this.#maxAnisotropy = value;
		this.#updateSampler();
	}

	get isAnisotropyValid(): boolean {
		// Return true if maxAnisotropy is not set, or if it matches valid filtering options
		return this.#maxAnisotropy
			? this.#magFilter === "linear" && this.#minFilter === "linear" && this.#mipmapFilter === "linear"
			: true;
	}

	#onGpuSamplerChanged() {
		this.__fireListenerList()
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

	/**
	 * Updates and validates the filter value for a specific GPU filter.
	 *
	 * @param {GPUFilterMode | GPUMipmapFilterMode} filterValue - The new filter value to be updated.
	 * @param {string[]} validFilters - An array of valid filter values.
	 * @param {string} filterName - The name of the GPU filter to be updated.
	 *
	 * @throws Throws an error if the filter value is invalid based on the provided valid filters.
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

	#getKey(): string {
		return `${this.#magFilter}:${this.#minFilter}:${this.#mipmapFilter}:${this.#addressModeU}:${this.#addressModeV}:${this.#addressModeW}:${this.#lodMinClamp}:${this.#lodMaxClamp}:${this.#compare}:${this.#maxAnisotropy}`;
	}

	#updateSampler(options?: GPUSamplerDescriptor) {
		if (options) {
			// Update fields only if valid
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
			// Create sampler and cache it
			samplerCache.set(
				descriptorKey,
				this.redGPUContext.gpuDevice.createSampler(samplerOptions)
			);
		}
		// Use cached sampler
		this.#gpuSampler = samplerCache.get(descriptorKey);
		this.#onGpuSamplerChanged();
	}
}

Object.freeze(Sampler)
export default Sampler
