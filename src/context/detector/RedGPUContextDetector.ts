import RedGPUContext from "../RedGPUContext";

/**
 * RedGPUContext Instance GPUContext 정보를 정리..
 */
class RedGPUContextDetector {
	#adapterInfo: GPUAdapterInfo
	#limits: GPUSupportedLimits
	#isFallbackAdapter: boolean
	#groupedLimits: any
	#userAgent: string

	constructor(redGPUContext: RedGPUContext) {
		this.#init(redGPUContext.gpuAdapter)
		console.log(this)
	}

	get adapterInfo(): GPUAdapterInfo {
		return this.#adapterInfo;
	}

	get limits(): GPUSupportedLimits {
		return this.#limits;
	}

	get isFallbackAdapter(): boolean {
		return this.#isFallbackAdapter;
	}

	get groupedLimits(): any {
		return this.#groupedLimits;
	}

	get userAgent(): string {
		return this.#userAgent;
	}

	get isMobile(): boolean {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Kindle|Silk|PlayBook/i.test(navigator.userAgent);
	}

	#init(gpuAdapter: GPUAdapter) {
		this.#userAgent = navigator.userAgent
		this.#parseAdapter(gpuAdapter)
		this.#parseLimits()
	}

	#parseAdapter(gpuAdapter: GPUAdapter) {
		if (gpuAdapter) {
			const {limits, info} = gpuAdapter
			const {isFallbackAdapter} = info
			this.#adapterInfo = info;
			this.#isFallbackAdapter = isFallbackAdapter
			this.#limits = limits
		}
	}

	#parseLimits() {
		const groupSettings = {
			"TextureLimits": ['maxTextureDimension1D', 'maxTextureDimension2D', 'maxTextureDimension3D', 'maxTextureArrayLayers', 'maxSampledTexturesPerShaderStage', 'maxSamplersPerShaderStage'],
			"BufferLimits": ['maxBindGroups', 'maxBindGroupsPlusVertexBuffers', 'maxBindingsPerBindGroup', 'maxDynamicUniformBuffersPerPipelineLayout', 'maxDynamicStorageBuffersPerPipelineLayout', 'maxStorageBuffersPerShaderStage', 'maxStorageTexturesPerShaderStage', 'maxUniformBuffersPerShaderStage', 'maxUniformBufferBindingSize', 'maxStorageBufferBindingSize', 'minUniformBufferOffsetAlignment', 'minStorageBufferOffsetAlignment', 'maxBufferSize'],
			"PipelineAndShaderLimits": ['maxVertexBuffers', 'maxVertexAttributes', 'maxVertexBufferArrayStride', 'maxInterStageShaderComponents', 'maxInterStageShaderVariables'],
			"ComputeLimits": ['maxComputeWorkgroupStorageSize', 'maxComputeInvocationsPerWorkgroup', 'maxComputeWorkgroupSizeX', 'maxComputeWorkgroupSizeY', 'maxComputeWorkgroupSizeZ', 'maxComputeWorkgroupsPerDimension'],
			"ColorLimits": ['maxColorAttachments', 'maxColorAttachmentBytesPerSample']
		};
		let groupedLimits = {
			"TextureLimits": {},
			"BufferLimits": {},
			"PipelineAndShaderLimits": {},
			"ComputeLimits": {},
			"ColorLimits": {},
			"EtcLimit": {}
		};
		for (const limit in this.#limits) {
			let found = false;
			for (const group in groupSettings) {
				if (groupSettings[group].includes(limit)) {
					groupedLimits[group][limit] = this.#limits[limit];
					found = true;
					break;
				}
			}
			if (!found) {
				groupedLimits["EtcLimit"][limit] = this.#limits[limit];
			}
		}
		this.#groupedLimits = groupedLimits
	}
}

export default RedGPUContextDetector
