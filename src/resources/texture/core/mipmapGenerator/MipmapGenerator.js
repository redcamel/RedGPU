import GPU_LOAD_OP from "../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../gpuConst/GPU_STORE_OP";
import Sampler from "../../../sampler/Sampler";
import shaderSource from "./shader.wgsl";
class MipmapGenerator {
    #redGPUContext;
    #sampler;
    #pipelineLayout;
    #pipelines;
    #bindGroupLayout;
    #mipmapShaderModule;
    #tempViewCache = new Map();
    #tempBindGroupCache = new Map();
    // WeakMap을 사용한 바인드 그룹 캐시 (GPUTexture를 키로 사용하고, textureView별 바인드 그룹 맵을 값으로 사용)
    #persistentBindGroupCache = new WeakMap();
    // 텍스처 뷰용 persistent 캐시
    #persistentViewCache = new WeakMap();
    constructor(redGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#sampler = new Sampler(redGPUContext, { minFilter: 'linear' }).gpuSampler;
        this.#pipelines = {};
    }
    createTextureView(texture, baseMipLevel, baseArrayLayer, useCache = false) {
        const key = `${baseMipLevel}_${baseArrayLayer}`;
        if (useCache) {
            // WeakMap에서 해당 텍스처의 뷰 캐시 맵 가져오기
            let textureViewMap = this.#persistentViewCache.get(texture);
            if (!textureViewMap) {
                textureViewMap = new Map();
                this.#persistentViewCache.set(texture, textureViewMap);
            }
            // 캐시된 뷰가 있는지 확인
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
            // 캐시에 저장
            textureViewMap.set(key, view);
            return view;
        }
        else {
            // 기존 temp 캐시 로직
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
    createBindGroup(texture, textureView, useCache = false) {
        const { gpuDevice } = this.#redGPUContext;
        if (useCache) {
            // GPUTexture를 키로 바인드 그룹 캐시 맵 가져오기
            let bindGroupMap = this.#persistentBindGroupCache.get(texture);
            if (!bindGroupMap) {
                bindGroupMap = new Map();
                this.#persistentBindGroupCache.set(texture, bindGroupMap);
            }
            // textureView의 label을 키로 사용
            const viewKey = textureView.label || 'unlabeled';
            // 캐시된 바인드 그룹이 있는지 확인
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
            // 캐시에 저장
            bindGroupMap.set(viewKey, bindGroup);
            return bindGroup;
        }
        else {
            // temp 캐시 사용 시에도 textureView 기반으로 키 생성
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
    getMipmapPipeline(format) {
        const { gpuDevice, resourceManager } = this.#redGPUContext;
        let pipeline = this.#pipelines[format];
        if (!pipeline) {
            if (!this.#mipmapShaderModule) {
                this.#mipmapShaderModule = resourceManager.createGPUShaderModule('MIPMAP_GENERATOR_SHADER_MODULE', { code: shaderSource });
                this.#bindGroupLayout = resourceManager.createBindGroupLayout('MIPMAP_GENERATOR_FRAGMENT_BIND_GROUP_LAYOUT', {
                    entries: [
                        { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
                        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {} }
                    ]
                });
                this.#pipelineLayout = resourceManager.createGPUPipelineLayout('MIPMAP_GENERATOR_PIPELINE_LAYOUT', {
                    bindGroupLayouts: [this.#bindGroupLayout],
                });
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
                    targets: [{ format }],
                }
            });
            this.#pipelines[format] = pipeline;
        }
        return pipeline;
    }
    /**
     * 밉맵 생성 메서드
     */
    generateMipmap(texture, textureDescriptor, useCache = false) {
        // useCache가 false일 때만 temp 캐시 클리어
        if (!useCache) {
            this.#clearTempCaches();
        }
        const { gpuDevice, resourceManager } = this.#redGPUContext;
        const pipeline = this.getMipmapPipeline(textureDescriptor.format);
        if (textureDescriptor.dimension == '3d' || textureDescriptor.dimension == '1d') {
            throw new Error('Generating mipmaps for non-2d textures is currently unsupported!');
        }
        let mipTexture = texture;
        const W = textureDescriptor.size[0];
        const H = textureDescriptor.size[1];
        const depthOrArrayLayers = textureDescriptor.size[2];
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
        const commandEncoder = gpuDevice.createCommandEncoder({});
        for (let arrayLayer = 0; arrayLayer < arrayLayerCount; ++arrayLayer) {
            let srcView = this.createTextureView(texture, 0, arrayLayer, useCache);
            let dstMipLevel = renderToSource ? 1 : 0;
            for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
                const dstView = this.createTextureView(mipTexture, dstMipLevel++, arrayLayer, useCache);
                const passEncoder = commandEncoder.beginRenderPass({
                    colorAttachments: [{
                            view: dstView,
                            clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
                            loadOp: GPU_LOAD_OP.CLEAR,
                            storeOp: GPU_STORE_OP.STORE
                        }],
                });
                // 현재 srcView에 맞는 바인드 그룹 생성 (textureView가 변경되므로 매번 새로운 바인드 그룹이 필요)
                const bindGroup = this.createBindGroup(texture, srcView, useCache);
                passEncoder.setPipeline(pipeline);
                passEncoder.setBindGroup(0, bindGroup);
                passEncoder.draw(3, 1, 0, 0);
                passEncoder.end();
                srcView = dstView;
            }
        }
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
        // useCache가 false일 때만 temp 캐시 클리어
        if (!useCache) {
            this.#clearTempCaches();
        }
        return texture;
    }
    destroy() {
        // WeakMap은 자동으로 정리되므로 별도 처리 불필요
        // temp 캐시만 명시적으로 정리
        this.#clearTempCaches();
    }
    #clearTempCaches() {
        this.#tempViewCache.clear();
        this.#tempBindGroupCache.clear();
    }
}
Object.freeze(MipmapGenerator);
export default MipmapGenerator;
