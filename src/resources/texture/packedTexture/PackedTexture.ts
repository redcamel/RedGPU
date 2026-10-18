import RedGPUContext from "../../../context/RedGPUContext";
import getMipLevelCount from "../../../utils/texture/getMipLevelCount";
import createUUID from "../../../utils/uuid/createUUID";
import Sampler from "../../sampler/Sampler";
import computeShaderCode from "./computeShader.wgsl";
import RedGPUObject from "../../../base/RedGPUObject";
import PackedTextureManager from "./PackedTextureManager";

/**
 * [KO] 결과 텍스처의 각 채널(r/g/b/a)이 소스 텍스처의 어느 채널을 읽을지 지정하는 매핑 타입입니다.
 * [EN] Mapping type specifying which source texture channel each output channel (r/g/b/a) reads from.
 *
 * [KO] 생략된 채널은 동일한 이름의 채널을 사용합니다. (예: `r` 생략 시 `'r'`)
 * [EN] Omitted channels use the channel of the same name. (e.g. `'r'` when `r` is omitted)
 *
 * @category Texture
 */
export type ComponentMapping = {
    r?: 'r' | 'g' | 'b' | 'a';
    g?: 'r' | 'g' | 'b' | 'a';
    b?: 'r' | 'g' | 'b' | 'a';
    a?: 'r' | 'g' | 'b' | 'a';
};

/**
 * [KO] 여러 소스 텍스처의 채널을 조합하여 하나의 `rgba8unorm` 텍스처로 패킹합니다.
 * [EN] Packs channels from multiple source textures into a single `rgba8unorm` texture.
 *
 * [KO] 동일한 소스/매핑 조합의 결과는 `PackedTextureManager`에 캐시되어 참조 카운트 방식으로 공유됩니다.
 * [EN] Results with the same source/mapping combination are cached in `PackedTextureManager` and shared via reference counting.
 *
 * ### Example
 * ```typescript
 * const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
 * await packed.packing({
 *   r: texture1.gpuTexture,
 *   g: texture2.gpuTexture
 * }, 512, 512);
 * ```
 *
 * @category Texture
 */
class PackedTexture extends RedGPUObject {
    #sampler: GPUSampler;
    #gpuTexture: GPUTexture;

    #bindGroup: GPUBindGroup;
    #tempBindGroupCache: Map<string, GPUBindGroup> = new Map();

    /**
     * [KO] PackedTexture 인스턴스를 생성합니다.
     * [EN] Creates a PackedTexture instance.
     *
     * ### Example
     * ```typescript
     * const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext)
        this.#sampler = this.#createSampler();
    }

    /**
     * [KO] 패킹 결과 GPUTexture입니다.
     * [EN] Packed result GPUTexture.
     *
     * @returns
     * [KO] GPUTexture 인스턴스
     * [EN] GPUTexture instance
     */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /**
     * [KO] 소스 텍스처들의 채널을 조합해 패킹 텍스처를 생성합니다.
     * [EN] Creates a packed texture by combining channels of the source textures.
     *
     * [KO] 모든 소스가 비어 있으면 아무 작업도 하지 않으며, 동일한 조합이 이미 캐시되어 있으면 캐시를 재사용합니다.
     * [EN] Does nothing if all sources are empty, and reuses the cache if the same combination already exists.
     *
     * ### Example
     * ```typescript
     * await packed.packing(
     *   {r: aoTexture.gpuTexture, g: roughnessTexture.gpuTexture, b: metallicTexture.gpuTexture},
     *   1024, 1024, 'ORM_TEXTURE'
     * );
     * ```
     *
     * @param textures -
     * [KO] 채널(r/g/b/a)별 소스 GPUTexture 맵
     * [EN] Source GPUTexture map per channel (r/g/b/a)
     * @param width -
     * [KO] 결과 텍스처 너비
     * [EN] Resulting texture width
     * @param height -
     * [KO] 결과 텍스처 높이
     * [EN] Resulting texture height
     * @param label -
     * [KO] 결과 텍스처 레이블 (선택)
     * [EN] Resulting texture label (optional)
     * @param componentMapping -
     * [KO] 채널 매핑 정보 (선택)
     * [EN] Channel mapping info (optional)
     * @param commandEncoder -
     * [KO] 외부 커맨드 인코더 (선택, 생략 시 내부 인코더를 생성하여 즉시 제출)
     * [EN] External command encoder (optional; if omitted, an internal encoder is created and submitted immediately)
     */
    async packing(
        textures: { r?: GPUTexture; g?: GPUTexture; b?: GPUTexture; a?: GPUTexture },
        width: number,
        height: number,
        label?: string,
        componentMapping?: ComponentMapping,
        commandEncoder?: GPUCommandEncoder
    ) {
        const mapping = {
            r: 'r',
            g: 'g',
            b: 'b',
            a: 'a',
            ...componentMapping
        };
        const textureKey = `${textures.r?.label || ''}_${textures.g?.label || ''}_${textures.b?.label || ''}_${textures.a?.label || ''}`;
        const mappingKey = `${JSON.stringify(mapping)}_${textureKey}`;
        if (!textures.r && !textures.g && !textures.b && !textures.a) {
            return;
        }

        const manager = this.redGPUContext.resourceManager.packedTextureManager;
        this.#handleCacheManagement(mappingKey, manager);
        const currEntry = manager.cacheMap.get(mappingKey);
        if (currEntry) {
            return;
        }
        await this.#createPackedTexture(textures, width, height, label, mapping, mappingKey, manager, commandEncoder);
    }

    /**
     * [KO] 캐시 참조 카운트를 감소시키고, 더 이상 참조되지 않는 GPUTexture는 지연 파괴합니다.
     * [EN] Decreases the cache reference count and defers destruction of GPUTextures no longer referenced.
     */
    destroy() {
        const manager = this.redGPUContext.resourceManager.packedTextureManager;
        if (!manager) return;

        const currentMappingKey = manager.instanceMappingKeys.get(this);
        if (currentMappingKey) {
            const entry = manager.cacheMap.get(currentMappingKey);
            if (entry) {
                entry.useNum--;
                if (entry.useNum === 0) {
                    if (entry.gpuTexture) {
                        this.redGPUContext.commandEncoderManager.addDeferredDestroy(entry.gpuTexture)
                    }
                    manager.cacheMap.delete(currentMappingKey);
                }
            }
            manager.instanceMappingKeys.delete(this);
        }
    }

    #updateBindGroup(textures: {
        r?: GPUTexture;
        g?: GPUTexture;
        b?: GPUTexture;
        a?: GPUTexture
    }, manager: PackedTextureManager) {
        const textureKey = `${textures.r?.label || 'empty'}_${textures.g?.label || 'empty'}_${textures.b?.label || 'empty'}_${textures.a?.label || 'empty'}`;
        const {resourceManager, gpuDevice} = this
        const {globalBindGroupLayout, mappingBuffer} = manager.getOrCreateResources(computeShaderCode);

        if (!this.#tempBindGroupCache.has(textureKey)) {
            const bindGroupEntries = [
                {
                    binding: 0,
                    resource: resourceManager.getGPUResourceBitmapTextureView(textures.r)
                },
                {
                    binding: 1,
                    resource: resourceManager.getGPUResourceBitmapTextureView(textures.g)
                },
                {
                    binding: 2,
                    resource: resourceManager.getGPUResourceBitmapTextureView(textures.b)
                },
                {
                    binding: 3,
                    resource: resourceManager.getGPUResourceBitmapTextureView(textures.a)
                },
                {binding: 4, resource: this.#sampler},
                {binding: 5, resource: {buffer: mappingBuffer}}
            ];
            const bindGroup = gpuDevice.createBindGroup({
                label: `PACK_TEXTURE_BIND_GROUP_${textureKey}`,
                layout: globalBindGroupLayout,
                entries: bindGroupEntries,
            });
            this.#tempBindGroupCache.set(textureKey, bindGroup);
        }
        this.#bindGroup = this.#tempBindGroupCache.get(textureKey)!;
    }

    #handleCacheManagement(mappingKey: string, manager: PackedTextureManager) {
        const prevMappingKey = manager.instanceMappingKeys.get(this);
        if (prevMappingKey && prevMappingKey !== mappingKey) {
            const prevEntry = manager.cacheMap.get(prevMappingKey);
            if (prevEntry) {
                prevEntry.useNum--;
                if (prevEntry.useNum === 0) {
                    if (prevEntry.gpuTexture) {
                        this.redGPUContext.commandEncoderManager.addDeferredDestroy(prevEntry.gpuTexture)
                    }
                    manager.cacheMap.delete(prevMappingKey);
                }
            }
        }
        const currEntry = manager.cacheMap.get(mappingKey);
        if (currEntry) {
            this.#gpuTexture = currEntry.gpuTexture;
            currEntry.useNum++;
        }
        manager.instanceMappingKeys.set(this, mappingKey);
    }

    async #createPackedTexture(
        textures: { r?: GPUTexture; g?: GPUTexture; b?: GPUTexture; a?: GPUTexture },
        width: number,
        height: number,
        label: string | undefined,
        mapping: any,
        mappingKey: string,
        manager: PackedTextureManager,
        commandEncoder?: GPUCommandEncoder
    ) {
        if (this.redGPUContext.destroyed) return
        const textureDescriptor: GPUTextureDescriptor = {
            size: [width, height, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
            label: label || `PACK_TEXTURE_${createUUID()}`,
            mipLevelCount: getMipLevelCount(width, height)
        };
        if (this.#gpuTexture) {
            this.#gpuTexture = null;
        }
        const {resourceManager, gpuDevice, uuid} = this
        const packedTexture = resourceManager.createManagedTexture(textureDescriptor);
        const mappingData = new Uint32Array([
            ['r', 'g', 'b', 'a'].indexOf(mapping.r),
            ['r', 'g', 'b', 'a'].indexOf(mapping.g),
            ['r', 'g', 'b', 'a'].indexOf(mapping.b),
            ['r', 'g', 'b', 'a'].indexOf(mapping.a),
        ]);
        const {mappingBuffer} = manager.getOrCreateResources(computeShaderCode);
        gpuDevice.queue.writeBuffer(mappingBuffer, 0, mappingData);
        this.#updateBindGroup(textures, manager);
        this.#executeRenderPass(packedTexture, manager, commandEncoder);
        if (textureDescriptor.mipLevelCount > 1) {
            this.#gpuTexture = resourceManager.mipmapGenerator.generateMipmap(packedTexture, textureDescriptor, true,);
        } else {
            this.#gpuTexture = packedTexture;
        }
        manager.cacheMap.set(mappingKey, {
            gpuTexture: this.#gpuTexture,
            useNum: 1,
            mappingKey,
            uuid
        });
        this.#bindGroup = null;
    }

    #executeRenderPass(packedTexture: GPUTexture, manager: PackedTextureManager, commandEncoder?: GPUCommandEncoder) {
        const {resourceManager, gpuDevice} = this;
        const {globalPipeline} = manager.getOrCreateResources(computeShaderCode);
        const internalEncoder = commandEncoder || gpuDevice.createCommandEncoder({
            label: 'PackedTexture_CommandEncoder'
        });
        const passEncoder = internalEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: resourceManager.getGPUResourceBitmapTextureView(packedTexture, {
                        baseMipLevel: 0,
                        mipLevelCount: 1,
                        dimension: '2d',
                        label: `${packedTexture.label}_RENDER_TARGET`
                    }),
                    loadOp: 'clear',
                    storeOp: 'store',
                    clearValue: [0, 0, 0, 0],
                },
            ],
        });
        passEncoder.setPipeline(globalPipeline);
        passEncoder.setBindGroup(0, this.#bindGroup);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();
        if (!commandEncoder) gpuDevice.queue.submit([internalEncoder.finish()]);
    }

    #createSampler(): GPUSampler {
        return new Sampler(this.redGPUContext).gpuSampler;
    }
}

export default PackedTexture;