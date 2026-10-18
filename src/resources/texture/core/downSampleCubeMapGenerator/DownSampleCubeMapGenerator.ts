import RedGPUContext from "../../../../context/RedGPUContext";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import Sampler from "../../../sampler/Sampler";
import cubemapDownsampleCode from "./cubemapDownsample.wgsl";
import RedGPUObject from "../../../../base/RedGPUObject";

/**
 * [KO] 큐브맵 다운샘플링 및 밉맵 생성을 담당하는 제너레이터 클래스입니다.
 * [EN] Generator class responsible for cubemap downsampling and mipmap generation.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Texture
 */
class DownSampleCubeMapGenerator extends RedGPUObject {

    #cubemapComputePipelines: Map<GPUTextureFormat, GPUComputePipeline> = new Map();
    #cubemapBindGroupLayouts: Map<GPUTextureFormat, GPUBindGroupLayout> = new Map();
    #cubemapShaderModule: GPUShaderModule | null = null;
    #cubemapSampler: GPUSampler | null = null;
    #tempViewCache: Map<string, GPUTextureView> = new Map();
    #tempBindGroupCache: Map<string, GPUBindGroup> = new Map();
    #cubemapUniformBuffers: GPUBuffer[] = [];

    /**
     * [KO] DownSampleCubeMapGenerator 인스턴스를 생성합니다.
     * [EN] Creates an instance of DownSampleCubeMapGenerator.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 지정된 밉 레벨의 소스 큐브맵 텍스처 뷰를 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the source cubemap texture view for the specified mip level.
     *
     * @param sourceCubemap -
     * [KO] 소스 큐브맵 GPUTexture
     * [EN] Source cubemap GPUTexture
     * @param sourceMipLevel -
     * [KO] 소스 밉 레벨 인덱스
     * [EN] Source mip level index
     * @returns
     * [KO] 큐브맵 텍스처 뷰
     * [EN] Cubemap texture view
     */
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
        return this.#tempViewCache.get(key);
    }

    /**
     * [KO] 지정된 밉 레벨의 타겟 2D 배열 텍스처 뷰를 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the target 2D array texture view for the specified mip level.
     *
     * @param targetCubemap -
     * [KO] 타겟 큐브맵 GPUTexture
     * [EN] Target cubemap GPUTexture
     * @param targetMipLevel -
     * [KO] 타겟 밉 레벨 인덱스
     * [EN] Target mip level index
     * @returns
     * [KO] 2D 배열 텍스처 뷰
     * [EN] 2D array texture view
     */
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
        return this.#tempViewCache.get(key);
    }

    /**
     * [KO] 큐브맵 다운샘플링 연산에 사용할 바인드 그룹을 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the bind group to be used for cubemap downsampling.
     *
     * @param bindGroupLayout -
     * [KO] 바인드 그룹 레이아웃
     * [EN] Bind group layout
     * @param sourceView -
     * [KO] 소스 큐브맵 텍스처 뷰
     * [EN] Source cubemap texture view
     * @param targetView -
     * [KO] 타겟 2D 배열 텍스처 뷰
     * [EN] Target 2D array texture view
     * @param uniformBuffer -
     * [KO] 밉 레벨 파라미터 유니폼 버퍼
     * [EN] Mip level parameter uniform buffer
     * @returns
     * [KO] 생성되거나 캐시된 바인드 그룹
     * [EN] Created or cached bind group
     */
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
                    {binding: 2, resource: this.#cubemapSampler},
                    {binding: 3, resource: {buffer: uniformBuffer}}
                ]
            });
            this.#tempBindGroupCache.set(key, bindGroup);
        }
        return this.#tempBindGroupCache.get(key);
    }

    /**
     * [KO] 큐브맵 다운샘플링을 수행합니다.
     * [EN] Performs cubemap downsampling.
     *
     * @param sourceCubemap -
     * [KO] 소스 큐브맵 텍스처
     * [EN] Source cubemap texture
     * @param targetSize -
     * [KO] 타겟 크기 (기본값: 256)
     * [EN] Target size (default: 256)
     * @param format -
     * [KO] 텍스처 포맷 (기본값: 'rgba16float')
     * [EN] Texture format (default: 'rgba16float')
     * @returns
     * [KO] 다운샘플링된 큐브맵 GPUTexture
     * [EN] Downsampled cubemap GPUTexture
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

    /**
     * [KO] 모든 캐시와 GPU 리소스를 해제합니다.
     * [EN] Releases all caches and GPU resources.
     */
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
