/**
 * RedGPUContext Instance GPUContext 정보를 정리..
 */
class RedGPUContextDetector {
    #adapterInfo;
    #limits;
    #isFallbackAdapter;
    #groupedLimits;
    #userAgent;
    constructor(redGPUContext) {
        this.#init(redGPUContext.gpuAdapter);
        console.log(this);
    }
    get adapterInfo() {
        return this.#adapterInfo;
    }
    get limits() {
        return this.#limits;
    }
    get isFallbackAdapter() {
        return this.#isFallbackAdapter;
    }
    get groupedLimits() {
        return this.#groupedLimits;
    }
    get userAgent() {
        return this.#userAgent;
    }
    get isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Kindle|Silk|PlayBook/i.test(navigator.userAgent);
    }
    #init(gpuAdapter) {
        this.#userAgent = navigator.userAgent;
        this.#parseAdapter(gpuAdapter);
        this.#parseLimits();
    }
    #parseAdapter(gpuAdapter) {
        if (gpuAdapter) {
            const { limits, info } = gpuAdapter;
            const { isFallbackAdapter } = info;
            this.#adapterInfo = info;
            this.#isFallbackAdapter = isFallbackAdapter;
            this.#limits = limits;
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
        this.#groupedLimits = groupedLimits;
    }
}
export default RedGPUContextDetector;
