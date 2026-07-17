import RedGPUContext from "../../../context/RedGPUContext";
import getMipLevelCount from "../../../utils/texture/getMipLevelCount";
import createUUID from "../../../utils/uuid/createUUID";
import Sampler from "../../sampler/Sampler";
import computeShaderCode from "./computeShader.wgsl";
import RedGPUObject from "../../../base/RedGPUObject";
import PackedTextureManager from "./PackedTextureManager";

/** [KO] 컴포넌트 매핑 타입 정의 [EN] Component mapping type definition */
export type ComponentMapping = {
    r?: 'r' | 'g' | 'b' | 'a';
    g?: 'r' | 'g' | 'b' | 'a';
    b?: 'r' | 'g' | 'b' | 'a';
    a?: 'r' | 'g' | 'b' | 'a';
};

/**
 * [KO] 여러 텍스처의 채널을 조합해 하나의 텍스처로 패킹하는 유틸리티 클래스입니다.
 * [EN] Utility class that packs channels from multiple textures into a single texture.
 *
 * [KO] r, g, b, a 각 채널에 서로 다른 텍스처의 특정 채널을 할당하여 메모리 사용량을 줄이고 렌더링 효율을 높일 수 있습니다.
 * [EN] By assigning specific channels from different textures to the r, g, b, and a channels, you can reduce memory usage and increase rendering efficiency.
 *
 * * ### Example
 * ```typescript
 * const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
 * await packed.packing({
 *   r: texture1.gpuTexture,
 *   g: texture2.gpuTexture
 * }, 512, 512);
 * ```
 * @category Texture
 */
class PackedTexture extends RedGPUObject {
    /** [KO] 샘플러 객체 [EN] Sampler object */
    #sampler: GPUSampler;
    /** [KO] 패킹 결과 GPUTexture 객체 [EN] Packed result GPUTexture object */
    #gpuTexture: GPUTexture;

    /** [KO] 바인드 그룹 객체 [EN] Bind group object */
    #bindGroup: GPUBindGroup;
    /** [KO] 임시 바인드 그룹 캐시 [EN] Temporary bind group cache */
    #tempBindGroupCache: Map<string, GPUBindGroup> = new Map();

    /**
     * [KO] PackedTexture 인스턴스를 생성합니다.
     * [EN] Creates a PackedTexture instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext)
        this.#sampler = this.#createSampler();
    }

    /**
     * [KO] 패킹 결과 GPUTexture 객체를 반환합니다.
     * [EN] Returns the packed result GPUTexture object.
     *
     * @returns
     * [KO] GPUTexture 인스턴스
     * [EN] GPUTexture instance
     */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /**
     * [KO] 여러 텍스처의 채널을 조합해 패킹 텍스처를 생성합니다.
     * [EN] Creates a packed texture by combining channels from multiple textures.
     * @param textures -
     * [KO] r/g/b/a 채널별 소스 GPUTexture 객체 맵
     * [EN] Source GPUTexture object map for each r/g/b/a channel
     * @param width -
     * [KO] 결과 텍스처 너비
     * [EN] Resulting texture width
     * @param height -
     * [KO] 결과 텍스처 높이
     * [EN] Resulting texture height
     * @param label -
     * [KO] 텍스처 레이블 (선택)
     * [EN] Texture label (optional)
     * @param componentMapping -
     * [KO] 컴포넌트 매핑 정보 (선택)
     * [EN] Component mapping info (optional)
     * @param commandEncoder - [KO] 커맨드 인코더 [EN] Command Encoder
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

    /** [KO] 인스턴스를 파괴하고 캐시를 관리합니다. [EN] Destroys the instance and manages the cache. */
    destroy() {
        const manager = this.redGPUContext.resourceManager.packedTextureManager;
        if (!manager) return;

        const currentMappingKey = manager.instanceMappingKeys.get(this);
        if (currentMappingKey) {
            const entry = manager.cacheMap.get(currentMappingKey);
            if (entry) {
                entry.useNum--;
                if (entry.useNum === 0) {
                    entry.gpuTexture?.destroy();
                    manager.cacheMap.delete(currentMappingKey);
                }
            }
            manager.instanceMappingKeys.delete(this);
        }
    }

    /** [KO] 바인드 그룹을 업데이트합니다. [EN] Updates the bind group. */
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

    /** [KO] 캐시 정책을 처리합니다. [EN] Handles cache policy. */
    #handleCacheManagement(mappingKey: string, manager: PackedTextureManager) {
        const prevMappingKey = manager.instanceMappingKeys.get(this);
        if (prevMappingKey && prevMappingKey !== mappingKey) {
            const prevEntry = manager.cacheMap.get(prevMappingKey);
            if (prevEntry) {
                prevEntry.useNum--;
                if (prevEntry.useNum === 0) {
                    prevEntry.gpuTexture?.destroy();
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

    /** [KO] 패킹 텍스처를 실제로 생성합니다. [EN] Actually creates the packed texture. */
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

    /** [KO] 렌더 패스를 실행하여 패킹을 수행합니다. [EN] Executes the render pass to perform packing. */
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

    /** [KO] 샘플러를 생성합니다. [EN] Creates a sampler. */
    #createSampler(): GPUSampler {
        return new Sampler(this.redGPUContext).gpuSampler;
    }
}

export default PackedTexture;