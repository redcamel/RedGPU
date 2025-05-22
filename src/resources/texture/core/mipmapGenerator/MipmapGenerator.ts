import RedGPUContext from "../../../../context/RedGPUContext";
import GPU_LOAD_OP from "../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../gpuConst/GPU_STORE_OP";
import Sampler from "../../../sampler/Sampler";
import shaderSource from "./shader.wgsl";

const SHADER_MODULE_NAME = 'MODULE_MIP_MAP'
const FRAGMENT_BIND_GROUP_LAYOUT_NAME = 'FRAGMENT_BIND_GROUP_LAYOUT_NAME_MIP_MAP'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_FINAL_MIP_MAP'

class MipmapGenerator {
    readonly #redGPUContext: RedGPUContext
    readonly #sampler: GPUSampler
    #pipelineLayout: GPUPipelineLayout
    readonly #pipelines: { [key: string]: GPURenderPipeline }
    #bindGroupLayout: GPUBindGroupLayout
    #mipmapShaderModule: GPUShaderModule

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext
        this.#sampler = new Sampler(redGPUContext, {minFilter: 'linear'}).gpuSampler
        this.#pipelines = {};
    }

    getMipmapPipeline(format: GPUTextureFormat): GPURenderPipeline {
        const {gpuDevice, resourceManager} = this.#redGPUContext
        let pipeline = this.#pipelines[format];
        if (!pipeline) {
            if (!this.#mipmapShaderModule) {
                this.#mipmapShaderModule = resourceManager.createGPUShaderModule(
                    SHADER_MODULE_NAME,
                    {code: shaderSource}
                )
                this.#bindGroupLayout = resourceManager.createBindGroupLayout(
                    FRAGMENT_BIND_GROUP_LAYOUT_NAME,
                    {
                        entries: [
                            {binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: {}},
                            {binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}}
                        ]
                    }
                )
                this.#pipelineLayout = resourceManager.createGPUPipelineLayout(
                    PIPELINE_DESCRIPTOR_LABEL,
                    {
                        bindGroupLayouts: [this.#bindGroupLayout],
                    }
                )
            }
            pipeline = gpuDevice.createRenderPipeline({
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
     * 
     * @param texture
     * @param textureDescriptor
     */
    generateMipmap(texture: GPUTexture, textureDescriptor: GPUTextureDescriptor) {
        const {gpuDevice,} = this.#redGPUContext
        // console.log(textureDescriptor.format)
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
            mipTexture = gpuDevice.createTexture(mipTextureDescriptor);
        }
        const commandEncoder = gpuDevice.createCommandEncoder({});
        for (let arrayLayer = 0; arrayLayer < arrayLayerCount; ++arrayLayer) {
            let srcView: GPUTextureView = texture.createView({
                baseMipLevel: 0,
                mipLevelCount: 1,
                dimension: '2d',
                baseArrayLayer: arrayLayer,
                arrayLayerCount: 1,
            });
            let dstMipLevel = renderToSource ? 1 : 0;
            for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
                const dstView: GPUTextureView = mipTexture.createView({
                    baseMipLevel: dstMipLevel++,
                    mipLevelCount: 1,
                    dimension: '2d',
                    baseArrayLayer: arrayLayer,
                    arrayLayerCount: 1,
                });
                const passEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass({
                    colorAttachments: [{
                        view: dstView,
                        clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
                        loadOp: GPU_LOAD_OP.CLEAR,
                        storeOp: GPU_STORE_OP.STORE
                    }],
                });
                const bindGroup: GPUBindGroup = gpuDevice.createBindGroup({
                    layout: this.#bindGroupLayout,
                    entries: [{
                        binding: 0,
                        resource: this.#sampler,
                    }, {
                        binding: 1,
                        resource: srcView,
                    }],
                });
                passEncoder.setPipeline(pipeline);
                passEncoder.setBindGroup(0, bindGroup);
                passEncoder.draw(3, 1, 0, 0);
                passEncoder.end();
                srcView = dstView;
            }
        }
        // If we didn't render to the source texture, finish by copying the mip results from the temporary mipmap texture
        // to the source.
        if (!renderToSource) {
            const mipLevelSize = {
                width: Math.max(1, W >>> 1),
                height: Math.max(1, H >>> 1),
                depthOrArrayLayers: arrayLayerCount,
            };
            for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
                commandEncoder.copyTextureToTexture({
                    texture: mipTexture,
                    mipLevel: i - 1,
                }, {
                    texture: texture,
                    mipLevel: i,
                }, mipLevelSize);
                mipLevelSize.width = Math.max(1, mipLevelSize.width >>> 1);
                mipLevelSize.height = Math.max(1, mipLevelSize.height >>> 1);
            }
        }
        gpuDevice.queue.submit([commandEncoder.finish()]);
        if (!renderToSource) {
            mipTexture.destroy();
        }
        return texture;
    }
}

Object.freeze(MipmapGenerator)
export default MipmapGenerator
