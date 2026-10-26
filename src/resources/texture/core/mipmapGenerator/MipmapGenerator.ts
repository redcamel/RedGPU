import RedGPUContext from "../../../../context/RedGPUContext";
import GPU_LOAD_OP from "../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../gpuConst/GPU_STORE_OP";
import Sampler from "../../../sampler/Sampler";
import shaderSource from "./shader.wgsl";
import {COMMAND_ENCODER_TYPE, CommandEncoderType} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUObject from "../../../../base/RedGPUObject";

/**
 * [KO] 2D 텍스처의 밉맵(Mipmap)을 GPU 렌더 패스를 통해 자동 생성하는 유틸리티 클래스입니다.
 * [EN] Utility class that automatically generates mipmaps for 2D textures via GPU render passes.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Texture
 */
class MipmapGenerator extends RedGPUObject {

    readonly #sampler: GPUSampler;
    #pipelineLayout: GPUPipelineLayout;
    readonly #pipelines: { [key: string]: GPURenderPipeline };
    #bindGroupLayout: GPUBindGroupLayout;
    #mipmapShaderModule: GPUShaderModule;
    #tempViewCache: Map<string, GPUTextureView> = new Map();
    #tempBindGroupCache: Map<string, GPUBindGroup> = new Map();
    #persistentBindGroupCache: WeakMap<GPUTexture, Map<string, GPUBindGroup>> = new WeakMap();
    #persistentViewCache: WeakMap<GPUTexture, Map<string, GPUTextureView>> = new WeakMap();

    /**
     * [KO] MipmapGenerator 인스턴스를 생성합니다.
     * [EN] Creates an instance of MipmapGenerator.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#sampler = new Sampler(redGPUContext, {minFilter: 'linear'}).gpuSampler;
        this.#pipelines = {};
    }

    /**
     * [KO] 지정된 밉 레벨 및 레이어의 텍스처 뷰를 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the texture view for the specified mip level and layer.
     *
     * @param texture -
     * [KO] 대상 GPUTexture
     * [EN] Target GPUTexture
     * @param baseMipLevel -
     * [KO] 기본 밉 레벨
     * [EN] Base mip level
     * @param baseArrayLayer -
     * [KO] 기본 배열 레이어
     * [EN] Base array layer
     * @param useCache -
     * [KO] 영속 캐시 사용 여부 (기본값: false)
     * [EN] Whether to use persistent cache (default: false)
     * @returns
     * [KO] 생성되거나 캐시된 GPUTextureView
     * [EN] Created or cached GPUTextureView
     */
    createTextureView(texture: GPUTexture, baseMipLevel: number, baseArrayLayer: number, useCache: boolean = false): GPUTextureView {
        const key = `${baseMipLevel}_${baseArrayLayer}`;
        if (useCache) {
            let textureViewMap = this.#persistentViewCache.get(texture);
            if (!textureViewMap) {
                textureViewMap = new Map();
                this.#persistentViewCache.set(texture, textureViewMap);
            }
            if (textureViewMap.has(key)) {
                return textureViewMap.get(key);
            }
            const view = texture.createView({
                baseMipLevel,
                mipLevelCount: 1,
                dimension: '2d',
                baseArrayLayer,
                arrayLayerCount: 1,
                label: `MIPMAP_GENERATOR_CACHED_${texture.label}_${key}`
            });
            textureViewMap.set(key, view);
            return view;
        } else {
            const tempKey = `MIPMAP_GENERATOR_${texture.label}_${baseMipLevel}_${baseArrayLayer}`;
            if (!this.#tempViewCache.has(tempKey)) {
                const view = texture.createView({
                    baseMipLevel,
                    mipLevelCount: 1,
                    dimension: '2d',
                    baseArrayLayer,
                    arrayLayerCount: 1,
                    label: tempKey
                });
                this.#tempViewCache.set(tempKey, view);
            }
            return this.#tempViewCache.get(tempKey);
        }
    }

    /**
     * [KO] 밉맵 렌더 패스에 사용할 바인드 그룹을 생성하거나 캐시에서 반환합니다.
     * [EN] Creates or retrieves from cache the bind group to be used for the mipmap render pass.
     *
     * @param texture -
     * [KO] 대상 GPUTexture
     * [EN] Target GPUTexture
     * @param textureView -
     * [KO] 대상 GPUTextureView
     * [EN] Target GPUTextureView
     * @param useCache -
     * [KO] 영속 캐시 사용 여부 (기본값: false)
     * [EN] Whether to use persistent cache (default: false)
     * @returns
     * [KO] 생성되거나 캐시된 GPUBindGroup
     * [EN] Created or cached GPUBindGroup
     */
    createBindGroup(texture: GPUTexture, textureView: GPUTextureView, useCache: boolean = false): GPUBindGroup {
        const {gpuDevice} = this;
        if (useCache) {
            let bindGroupMap = this.#persistentBindGroupCache.get(texture);
            if (!bindGroupMap) {
                bindGroupMap = new Map();
                this.#persistentBindGroupCache.set(texture, bindGroupMap);
            }
            const viewKey = textureView.label || 'unlabeled';
            if (bindGroupMap.has(viewKey)) {
                return bindGroupMap.get(viewKey);
            }
            const bindGroup = gpuDevice.createBindGroup({
                label: `MIPMAP_GENERATOR_BIND_GROUP_CACHED_${texture.label}_${viewKey}`,
                layout: this.#bindGroupLayout,
                entries: [{
                    binding: 0,
                    resource: this.#sampler,
                }, {
                    binding: 1,
                    resource: textureView,
                }],
            });
            bindGroupMap.set(viewKey, bindGroup);
            return bindGroup;
        } else {
            const tempKey = `${texture.label}_${textureView.label}`;
            if (this.#tempBindGroupCache.has(tempKey)) {
                return this.#tempBindGroupCache.get(tempKey);
            }
            const bindGroup = gpuDevice.createBindGroup({
                label: `MIPMAP_GENERATOR_BIND_GROUP_TEMP_${tempKey}`,
                layout: this.#bindGroupLayout,
                entries: [{
                    binding: 0,
                    resource: this.#sampler,
                }, {
                    binding: 1,
                    resource: textureView,
                }],
            });
            this.#tempBindGroupCache.set(tempKey, bindGroup);
            return bindGroup;
        }
    }

    /**
     * [KO] 지정된 텍스처 포맷에 대응하는 밉맵 렌더 파이프라인을 반환합니다.
     * [EN] Returns the mipmap render pipeline corresponding to the specified texture format.
     *
     * @param format -
     * [KO] 대상 GPUTextureFormat
     * [EN] Target GPUTextureFormat
     * @returns
     * [KO] 밉맵 GPURenderPipeline
     * [EN] Mipmap GPURenderPipeline
     */
    getMipmapPipeline(format: GPUTextureFormat): GPURenderPipeline {
        const {gpuDevice, resourceManager} = this;
        let pipeline = this.#pipelines[format];
        if (!pipeline) {
            if (!this.#mipmapShaderModule) {
                this.#mipmapShaderModule = resourceManager.createGPUShaderModule(
                    'MIPMAP_GENERATOR_SHADER_MODULE',
                    {code: shaderSource}
                )
                this.#bindGroupLayout = resourceManager.createBindGroupLayout(
                    'MIPMAP_GENERATOR_FRAGMENT_BIND_GROUP_LAYOUT',
                    {
                        entries: [
                            {binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: {}},
                            {binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}}
                        ]
                    }
                )
                this.#pipelineLayout = resourceManager.createGPUPipelineLayout(
                    'MIPMAP_GENERATOR_PIPELINE_LAYOUT',
                    {
                        bindGroupLayouts: [this.#bindGroupLayout],
                    }
                )
            }
            pipeline = gpuDevice.createRenderPipeline({
                label: `MIPMAP_GENERATOR_PIPELINE_${format}`,
                layout: this.#pipelineLayout,
                vertex: {
                    module: this.#mipmapShaderModule,
                    entryPoint: 'vertexMain',
                },
                fragment: {
                    module: this.#mipmapShaderModule,
                    entryPoint: 'fragmentMain',
                    targets: [{format}],
                }
            });
            this.#pipelines[format] = pipeline;
        }
        return pipeline;
    }

    /**
     * [KO] 입력 텍스처에 대한 밉맵 체인을 생성합니다.
     * [EN] Generates a mipmap chain for the input texture.
     *
     * @param texture -
     * [KO] 원본 GPUTexture
     * [EN] Source GPUTexture
     * @param textureDescriptor -
     * [KO] 텍스처 디스크립터
     * [EN] Texture descriptor
     * @param useCache -
     * [KO] 영속 캐시 사용 여부 (기본값: false)
     * [EN] Whether to use persistent cache (default: false)
     * @param encoderType -
     * [KO] 사용할 명령 인코더 유형 (기본값: COMMAND_ENCODER_TYPE.RESOURCE)
     * [EN] Command encoder type to use (default: COMMAND_ENCODER_TYPE.RESOURCE)
     * @returns
     * [KO] 밉맵이 생성된 GPUTexture
     * [EN] GPUTexture with generated mipmaps
     */
    generateMipmap(
        texture: GPUTexture,
        textureDescriptor: GPUTextureDescriptor,
        useCache: boolean = false,
        encoderType: CommandEncoderType = COMMAND_ENCODER_TYPE.RESOURCE
    ): GPUTexture {
        if (!useCache) {
            this.#clearTempCaches();
        }
        const {resourceManager, commandEncoderManager} = this;
        const pipeline: GPURenderPipeline = this.getMipmapPipeline(textureDescriptor.format);
        if (textureDescriptor.dimension == '3d' || textureDescriptor.dimension == '1d') {
            throw new Error('Generating mipmaps for non-2d textures is currently unsupported!');
        }
        let mipTexture = texture;
        const W = textureDescriptor.size[0]
        const H = textureDescriptor.size[1]
        const depthOrArrayLayers = textureDescriptor.size[2]
        const arrayLayerCount = depthOrArrayLayers || 1;
        const renderToSource = textureDescriptor.usage & GPUTextureUsage.RENDER_ATTACHMENT;
        if (!renderToSource) {
            const mipTextureDescriptor = {
                size: {
                    width: Math.max(1, W >>> 1),
                    height: Math.max(1, H >>> 1),
                    depthOrArrayLayers: arrayLayerCount,
                },
                format: textureDescriptor.format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
                mipLevelCount: textureDescriptor.mipLevelCount - 1,
            };
            mipTexture = resourceManager.createManagedTexture(mipTextureDescriptor);
        }

        const isImmediate = encoderType === COMMAND_ENCODER_TYPE.IMMEDIATE;
        const immediateEncoder = isImmediate ? this.gpuDevice.createCommandEncoder({label: 'MipmapGenerator_ImmediateEncoder'}) : null;

        for (let arrayLayer = 0; arrayLayer < arrayLayerCount; ++arrayLayer) {
            let srcView: GPUTextureView = this.createTextureView(texture, 0, arrayLayer, useCache);
            let dstMipLevel = renderToSource ? 1 : 0;
            for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
                const dstView: GPUTextureView = this.createTextureView(mipTexture, dstMipLevel++, arrayLayer, useCache);
                const bindGroup: GPUBindGroup = this.createBindGroup(texture, srcView, useCache);

                const passDescriptor: GPURenderPassDescriptor = {
                    label: `MipmapGenerator_Pass_Level_${i}_Layer_${arrayLayer}`,
                    colorAttachments: [{
                        view: dstView,
                        clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
                        loadOp: GPU_LOAD_OP.CLEAR,
                        storeOp: GPU_STORE_OP.STORE
                    }],
                }

                if (isImmediate) {
                    const passEncoder = immediateEncoder.beginRenderPass(passDescriptor);
                    passEncoder.setPipeline(pipeline);
                    passEncoder.setBindGroup(0, bindGroup);
                    passEncoder.draw(3, 1, 0, 0);
                    passEncoder.end();
                } else if (encoderType === COMMAND_ENCODER_TYPE.RESOURCE) {
                    commandEncoderManager.addResourceRenderPass(passDescriptor, (passEncoder) => {
                        passEncoder.setPipeline(pipeline);
                        passEncoder.setBindGroup(0, bindGroup);
                        passEncoder.draw(3, 1, 0, 0);
                    });
                } else if (encoderType === COMMAND_ENCODER_TYPE.PRE_PROCESS) {
                    commandEncoderManager.addPreProcessRenderPass(passDescriptor, (passEncoder) => {
                        passEncoder.setPipeline(pipeline);
                        passEncoder.setBindGroup(0, bindGroup);
                        passEncoder.draw(3, 1, 0, 0);
                    });
                } else if (encoderType === COMMAND_ENCODER_TYPE.MAIN) {
                    commandEncoderManager.addMainRenderPass(passDescriptor, (passEncoder) => {
                        passEncoder.setPipeline(pipeline);
                        passEncoder.setBindGroup(0, bindGroup);
                        passEncoder.draw(3, 1, 0, 0);
                    });
                } else if (encoderType === COMMAND_ENCODER_TYPE.POST_PROCESS) {
                    commandEncoderManager.addPostProcessRenderPass(passDescriptor, (passEncoder) => {
                        passEncoder.setPipeline(pipeline);
                        passEncoder.setBindGroup(0, bindGroup);
                        passEncoder.draw(3, 1, 0, 0);
                    });
                }

                srcView = dstView;
            }
        }
        if (!renderToSource) {
            const copyTargetEncoder = isImmediate ? immediateEncoder : null;
            const recordCopy = (encoder: GPUCommandEncoder) => {
                const mipLevelSize = {
                    width: Math.max(1, W >>> 1),
                    height: Math.max(1, H >>> 1),
                    depthOrArrayLayers: arrayLayerCount,
                };
                for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
                    encoder.copyTextureToTexture({
                        texture: mipTexture,
                        mipLevel: i - 1,
                    }, {
                        texture: texture,
                        mipLevel: i,
                    }, mipLevelSize);
                    mipLevelSize.width = Math.max(1, mipLevelSize.width >>> 1);
                    mipLevelSize.height = Math.max(1, mipLevelSize.height >>> 1);
                }
            };

            if (isImmediate) {
                recordCopy(copyTargetEncoder);
            } else {
                commandEncoderManager.useEncoder(encoderType, recordCopy);
            }
        }

        if (isImmediate) {
            this.gpuDevice.queue.submit([immediateEncoder.finish()]);
        }

        if (!renderToSource) {
            commandEncoderManager.addDeferredDestroy(mipTexture);
        }

        if (!useCache) {
            this.#clearTempCaches();
        }
        return texture;
    }

    /**
     * [KO] 모든 캐시 및 밉맵 생성용 파이프라인 리소스를 해제합니다.
     * [EN] Releases all caches and mipmap generation pipeline resources.
     */
    destroy() {
        this.#clearTempCaches();
        for (const key in this.#pipelines) {
            delete this.#pipelines[key];
        }
        this.#pipelineLayout = null;
        this.#bindGroupLayout = null;
        this.#mipmapShaderModule = null;
    }

    #clearTempCaches() {
        this.#tempViewCache.clear();
        this.#tempBindGroupCache.clear();
    }
}

Object.freeze(MipmapGenerator)
export default MipmapGenerator
