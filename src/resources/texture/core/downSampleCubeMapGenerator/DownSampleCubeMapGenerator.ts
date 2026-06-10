import RedGPUContext from "../../../../context/RedGPUContext";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import Sampler from "../../../sampler/Sampler";
import cubemapDownsampleCode from "./cubemapDownsample.wgsl";
import RedGPUObject from "../../../../base/RedGPUObject";

/**
 * [KO] 큐브맵 다운샘플링 및 밉맵 생성을 담당하는 제너레이터 클래스입니다.
 * [EN] Generator class responsible for cubemap downsampling and mipmap generation.
 */
class DownSampleCubeMapGenerator extends RedGPUObject {

    #cubemapComputePipelines: Map<GPUTextureFormat, GPUComputePipeline> = new Map();
    #cubemapBindGroupLayouts: Map<GPUTextureFormat, GPUBindGroupLayout> = new Map();
    #cubemapShaderModule: GPUShaderModule | null = null;
    #cubemapSampler: GPUSampler | null = null;
    #tempViewCache: Map<string, GPUTextureView> = new Map();
    #tempBindGroupCache: Map<string, GPUBindGroup> = new Map();
    /** [KO] 밉 레벨별 독립적인 유니폼 버퍼 풀 [EN] Independent uniform buffer pool per mip level */
    #cubemapUniformBuffers: GPUBuffer[] = [];

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext)
    }

    /** [KO] 소스 텍스처 뷰 생성 (캐싱) [EN] Create source texture view (cached) */
    createSourceTextureView(sourceCubemap: GPUTexture, sourceMipLevel: number): GPUTextureView {
        const key = `DOWN_SAMPLE_CUBE_GENERATOR_SOURCE_VIEW_${sourceCubemap.label}_${sourceMipLevel}`;
        if (!this.#tempViewCache.has(key)) {
            const view = sourceCubemap.createView({
                label: key,
                dimension: 'cube',
                baseMipLevel: sourceMipLevel,
                mipLevelCount: 1
            });
            this.#tempViewCache.set(key, view);
        }
        return this.#tempViewCache.get(key)!;
    }

    /** [KO] 타겟 텍스처 뷰 생성 (캐싱) [EN] Create target texture view (cached) */
    createTargetTextureView(targetCubemap: GPUTexture, targetMipLevel: number): GPUTextureView {
        const key = `DOWN_SAMPLE_CUBE_GENERATOR_TARGET_VIEW_${targetCubemap.label}_${targetMipLevel}`;
        if (!this.#tempViewCache.has(key)) {
            const view = targetCubemap.createView({
                label: key,
                dimension: '2d-array',
                baseMipLevel: targetMipLevel,
                mipLevelCount: 1,
                arrayLayerCount: 6
            });
            this.#tempViewCache.set(key, view);
        }
        return this.#tempViewCache.get(key)!;
    }

    /** [KO] 바인드 그룹 생성 (캐싱) [EN] Create bind group (cached) */
    createBindGroup(
        bindGroupLayout: GPUBindGroupLayout,
        sourceView: GPUTextureView,
        targetView: GPUTextureView,
        uniformBuffer: GPUBuffer
    ): GPUBindGroup {
        const key = `DOWN_SAMPLE_CUBE_GENERATOR_BIND_GROUP_${sourceView.label}_${targetView.label}`;
        if (!this.#tempBindGroupCache.has(key)) {
            const {gpuDevice} = this;
            const bindGroup = gpuDevice.createBindGroup({
                label: key,
                layout: bindGroupLayout,
                entries: [
                    {binding: 0, resource: sourceView},
                    {binding: 1, resource: targetView},
                    {binding: 2, resource: this.#cubemapSampler!},
                    {binding: 3, resource: {buffer: uniformBuffer}}
                ]
            });
            this.#tempBindGroupCache.set(key, bindGroup);
        }
        return this.#tempBindGroupCache.get(key)!;
    }

    /**
     * [KO] 큐브맵 다운샘플링을 수행합니다.
     * [EN] Performs cubemap downsampling.
     *
     * @param sourceCubemap - [KO] 소스 큐브맵 텍스처 [EN] Source cubemap texture
     * @param targetSize - [KO] 타겟 크기 [EN] Target size
     * @param format - [KO] 텍스처 포맷 [EN] Texture format
     * @returns [KO] 다운샘플링된 큐브맵 [EN] Downsampled cubemap
     */
    async downsampleCubemap(
        sourceCubemap: GPUTexture,
        targetSize: number = 256,
        format: GPUTextureFormat = 'rgba16float'
    ): Promise<GPUTexture> {
        try {
            this.#clearTempCaches();
            this.#initCubemapDownsampler();
            const {resourceManager} = this;
            if (!sourceCubemap) throw new Error('Invalid source cubemap texture');
            if (targetSize <= 0 || !Number.isInteger(targetSize)) throw new Error('Target size must be a positive integer');

            const sourceMipLevels = sourceCubemap.mipLevelCount;
            const targetMipLevels = getMipLevelCount(targetSize, targetSize);

            const targetCubemap = resourceManager.createManagedTexture({
                size: [targetSize, targetSize, 6],
                format: format,
                usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
                dimension: '2d',
                mipLevelCount: targetMipLevels,
                label: `DOWN_SAMPLE_CUBE_GENERATOR_TEXTURE_${targetSize}_${Date.now()}`
            });

            for (let mipLevel = 0; mipLevel < targetMipLevels; mipLevel++) {
                const currentTargetSize = Math.max(1, targetSize >> mipLevel);
                const sourceMipLevel = this.#calculateSourceMipLevel(sourceCubemap.width, targetSize, mipLevel, sourceMipLevels);
                this.#downsampleCubemapMipLevel(sourceCubemap, targetCubemap, sourceMipLevel, mipLevel, currentTargetSize, format);
            }

            this.#clearTempCaches();
            return targetCubemap;
        } catch (error) {
            console.error('큐브맵 다운샘플링 실패:', error);
            this.#clearTempCaches();
            throw error;
        }
    }

    /** [KO] 모든 리소스를 해제합니다. [EN] Clears all resources. */
    destroy() {
        this.#clearTempCaches();
        this.#cubemapUniformBuffers.forEach(b => b.destroy());
        this.#cubemapUniformBuffers = [];
        this.#cubemapComputePipelines.clear();
        this.#cubemapBindGroupLayouts.clear();
        this.#cubemapShaderModule = null;
        this.#cubemapSampler = null;
    }

    #calculateSourceMipLevel(sourceSize: number, targetSize: number, targetMipLevel: number, sourceMipLevels: number): number {
        const currentTargetSize = Math.max(1, targetSize >> targetMipLevel);
        const scaleFactor = sourceSize / currentTargetSize;
        const sourceMipLevel = Math.max(0, Math.floor(Math.log2(scaleFactor)));
        return Math.min(sourceMipLevel, sourceMipLevels - 1);
    }

    #downsampleCubemapMipLevel(
        sourceCubemap: GPUTexture,
        targetCubemap: GPUTexture,
        sourceMipLevel: number,
        targetMipLevel: number,
        targetSize: number,
        format: GPUTextureFormat
    ): void {
        const {gpuDevice, commandEncoderManager} = this;
        const computePipeline = this.#getCubemapComputePipeline(format);
        const bindGroupLayout = this.#cubemapBindGroupLayouts.get(format)!;

        if (!this.#cubemapUniformBuffers[targetMipLevel]) {
            this.#cubemapUniformBuffers[targetMipLevel] = gpuDevice.createBuffer({
                size: 16,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                label: `DOWN_SAMPLE_CUBE_GENERATOR_UNIFORM_BUFFER_MIP${targetMipLevel}`
            });
        }
        const uniformBuffer = this.#cubemapUniformBuffers[targetMipLevel];

        const sourceView = this.createSourceTextureView(sourceCubemap, sourceMipLevel);
        const targetView = this.createTargetTextureView(targetCubemap, targetMipLevel);
        const bindGroup = this.createBindGroup(bindGroupLayout, sourceView, targetView, uniformBuffer);

        this.#updateCubemapUniforms(uniformBuffer, sourceMipLevel, targetMipLevel, targetSize);

        commandEncoderManager.addResourceComputePass({
            label: `DOWN_SAMPLE_CUBE_GENERATOR_PASS_MIP${targetMipLevel}`
        }, (passEncoder) => {
            passEncoder.setPipeline(computePipeline);
            passEncoder.setBindGroup(0, bindGroup);
            const dispatchSize = Math.ceil(targetSize / 8);
            passEncoder.dispatchWorkgroups(dispatchSize, dispatchSize, 6);
        });
    }

    #updateCubemapUniforms(uniformBuffer: GPUBuffer, sourceMipLevel: number, targetMipLevel: number, targetSize: number) {
        const uniformData = new Float32Array([targetSize, sourceMipLevel, targetMipLevel, 0]);
        this.gpuDevice.queue.writeBuffer(uniformBuffer, 0, uniformData);
    }

    #initCubemapDownsampler() {
        if (this.#cubemapShaderModule) return;
        const {resourceManager, redGPUContext} = this;
        this.#cubemapSampler = new Sampler(redGPUContext, {
            minFilter: 'linear', magFilter: 'linear', mipmapFilter: 'linear',
            addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge', addressModeW: 'clamp-to-edge'
        }).gpuSampler;
        this.#cubemapShaderModule = resourceManager.createGPUShaderModule('DOWN_SAMPLE_CUBE_GENERATOR_COMPUTE_SHADER', {code: cubemapDownsampleCode});
    }

    #getCubemapComputePipeline(format: GPUTextureFormat): GPUComputePipeline {
        if (!this.#cubemapComputePipelines.has(format)) {
            const {gpuDevice, resourceManager} = this;
            const bindGroupLayout = resourceManager.createBindGroupLayout(`DOWN_SAMPLE_CUBE_GENERATOR_BGL_${format}`, {
                entries: [
                    {binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {viewDimension: 'cube'}},
                    {
                        binding: 1,
                        visibility: GPUShaderStage.COMPUTE,
                        storageTexture: {format, viewDimension: '2d-array'}
                    },
                    {binding: 2, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
                    {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
                ]
            });
            const pipeline = gpuDevice.createComputePipeline({
                label: `DOWN_SAMPLE_CUBE_GENERATOR_PIPELINE_${format}`,
                layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [bindGroupLayout]}),
                compute: {module: this.#cubemapShaderModule!, entryPoint: 'main'}
            });
            this.#cubemapBindGroupLayouts.set(format, bindGroupLayout);
            this.#cubemapComputePipelines.set(format, pipeline);
        }
        return this.#cubemapComputePipelines.get(format)!;
    }

    #clearTempCaches() {
        this.#tempViewCache.clear();
        this.#tempBindGroupCache.clear();
    }
}

Object.freeze(DownSampleCubeMapGenerator)
export default DownSampleCubeMapGenerator
