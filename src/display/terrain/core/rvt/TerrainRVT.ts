import RedGPUContext from "../../../../context/RedGPUContext";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import TerrainMaterial from "../material/TerrainMaterial";
import PhysicalPagePool from "./PhysicalPagePool";
import PageTable, {PageState} from "./PageTable";
import FeedbackBuffer from "./FeedbackBuffer";
import bakeSrc from "./rvt_bake.wgsl";

export interface TerrainRVTOptions {
    atlasSize?: number;
    tileSize?: number;
    borderSize?: number;
    virtualCountX?: number;
    virtualCountZ?: number;
}

class TerrainRVT {
    readonly #redGPUContext: RedGPUContext;
    readonly #physicalPagePool: PhysicalPagePool;
    readonly #pageTable: PageTable;
    readonly #feedbackBuffer: FeedbackBuffer;

    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #uniformBuffer: GPUBuffer | null = null;

    #sampler: GPUSampler | null = null;
    #empty2DGPUTexture: GPUTexture | null = null;
    #empty2DView: GPUTextureView | null = null;
    #emptyArrayGPUTexture: GPUTexture | null = null;
    #emptyArrayView: GPUTextureView | null = null;

    readonly #uData = new Float32Array(28);
    readonly #uDataU32 = new Uint32Array(this.#uData.buffer);

    constructor(redGPUContext: RedGPUContext, options: TerrainRVTOptions = {}) {
        this.#redGPUContext = redGPUContext;

        this.#physicalPagePool = new PhysicalPagePool(redGPUContext, {
            atlasSize: options.atlasSize ?? 4096,
            tileSize: options.tileSize ?? 128,
            borderSize: options.borderSize ?? 4,
        });

        this.#pageTable = new PageTable(redGPUContext, {
            virtualCountX: options.virtualCountX ?? 32,
            virtualCountZ: options.virtualCountZ ?? 32,
        });

        this.#feedbackBuffer = new FeedbackBuffer(redGPUContext, {
            maxRequests: 256,
        });

        this.#initPipeline();
    }

    get physicalPagePool(): PhysicalPagePool {
        return this.#physicalPagePool;
    }

    get pageTable(): PageTable {
        return this.#pageTable;
    }

    get feedbackBuffer(): FeedbackBuffer {
        return this.#feedbackBuffer;
    }

    get atlasSize(): number {
        return this.#physicalPagePool.atlasSize;
    }

    get albedoDirectTexture(): DirectTexture | null {
        return this.#physicalPagePool.albedoDirectTexture;
    }

    get normalORMDirectTexture(): DirectTexture | null {
        return this.#physicalPagePool.normalORMDirectTexture;
    }

    get pageTableDirectTexture(): DirectTexture | null {
        return this.#pageTable.pageTableDirectTexture;
    }

    public requestVirtualPage(material: TerrainMaterial, vX: number, vZ: number, mip: number = 0, useDeferred: boolean = false): void {
        const virtualKey = `${vX}_${vZ}`;
        const slot = this.#physicalPagePool.allocatePage(virtualKey);

        if (slot.isEvicted && slot.evictedVirtualKey) {
            const [evX, evZ] = slot.evictedVirtualKey.split('_').map(Number);
            this.#pageTable.clearEntry(evX, evZ);
        }

        const tileCountX = this.#pageTable.virtualCountX;
        const tileCountZ = this.#pageTable.virtualCountZ;

        this.bakeTileRect(
            material,
            slot.pixelX,
            slot.pixelY,
            this.#physicalPagePool.tileSizeWithBorder,
            this.#physicalPagePool.tileSizeWithBorder,
            vX, vZ, tileCountX, tileCountZ,
            useDeferred
        );

        this.#pageTable.setEntry(
            vX, vZ,
            slot.slotX, slot.slotY,
            mip,
            PageState.Ready,
            this.#physicalPagePool.tilesPerRow
        );
    }

    public update(material: TerrainMaterial, commandEncoder?: GPUCommandEncoder, maxBakesPerFrame: number = 8): void {
        this.#feedbackBuffer.requestReadback((keys) => {
            let bakedCount = 0;
            for (const key of keys) {
                if (bakedCount >= maxBakesPerFrame) break;
                const [vX, vZ] = key.split('_').map(Number);
                if (!isNaN(vX) && !isNaN(vZ)) {
                    const entry = this.#pageTable.getEntry(vX, vZ);
                    if (!entry || entry.state !== PageState.Ready) {
                        this.requestVirtualPage(material, vX, vZ, 0, true);
                        bakedCount++;
                    }
                }
            }
        }, commandEncoder);
        this.#feedbackBuffer.resetBuffer(commandEncoder);
    }

    public bakeAll(material: TerrainMaterial): void {
        const countX = this.#pageTable.virtualCountX;
        const countZ = this.#pageTable.virtualCountZ;
        for (let vZ = 0; vZ < countZ; vZ++) {
            for (let vX = 0; vX < countX; vX++) {
                this.requestVirtualPage(material, vX, vZ);
            }
        }
    }

    public bakeTile(
        material: TerrainMaterial,
        vX: number,
        vZ: number,
        tileCountX: number = 32,
        tileCountZ: number = 32
    ): void {
        this.requestVirtualPage(material, vX, vZ);
    }

    public bakeTileRect(
        material: TerrainMaterial,
        pixelX: number,
        pixelY: number,
        width: number,
        height: number,
        vX: number = 0,
        vZ: number = 0,
        tileCountX: number = 1,
        tileCountZ: number = 1,
        useDeferred: boolean = false
    ): void {
        if (!this.#computePipeline) return;

        const mat = material as any;
        const splatGPUView = this.#getTextureView(mat.splatTexture);
        const diffuseGPUView = this.#getArrayTextureView(mat.diffuseArray);
        const normalGPUView = this.#getArrayTextureView(mat.normalArray);
        const heightGPUView = this.#getArrayTextureView(mat.heightArray);
        const ormGPUView = this.#getArrayTextureView(mat.ormArray);
        const baseColorGPUView = this.#getTextureView(mat.baseColorTexture);
        const ormTextureGPUView = this.#getTextureView(mat.ormTexture);
        const heightmapGPUView = this.#getTextureView(mat.targetTerrain?.heightmapAtlasTexture);

        const device = this.#redGPUContext.gpuDevice;

        const uData = this.#uData;
        const uDataU32 = this.#uDataU32;

        uData[0] = vX / tileCountX;
        uData[1] = vZ / tileCountZ;
        uData[2] = 1.0 / tileCountX;
        uData[3] = 1.0 / tileCountZ;
        uData[4] = vX / tileCountX;
        uData[5] = vZ / tileCountZ;
        uData[6] = 1.0 / tileCountX;
        uData[7] = 1.0 / tileCountZ;

        uData[8] = pixelX;
        uData[9] = pixelY;
        uData[10] = width;
        uData[11] = height;

        const layers = mat.layers || [];
        const baseRoughness = mat.roughnessFactor ?? 1.0;
        uData[12] = mat.tileScale ?? 16.0;
        uData[13] = mat.macroScale ?? 2.0;
        uData[14] = mat.blendContrast ?? 0.0;
        uData[15] = baseRoughness;
        uData[16] = layers[0]?.roughnessFactor ?? 0.85;
        uData[17] = layers[1]?.roughnessFactor ?? 0.85;
        uData[18] = layers[2]?.roughnessFactor ?? 0.90;
        uData[19] = layers[3]?.roughnessFactor ?? 0.85;
        uData[20] = mat.normalScale ?? 1.0;
        uData[21] = mat.occlusionStrength ?? 1.0;
        uData[22] = mat.baseColorWeight ?? 0.5;

        uDataU32[23] = mat.baseColorBlendMode === 'multiply' ? 1 : 0;
        const isAutoSplat = !mat.splatTexture || mat.useAutoSplat === true;
        uDataU32[24] = isAutoSplat ? 1 : 0;

        let buffer = this.#uniformBuffer;
        if (!buffer) {
            buffer = device.createBuffer({
                label: 'RVT_BakeUniformBuffer',
                size: this.#uData.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            this.#uniformBuffer = buffer;
        }

        device.queue.writeBuffer(buffer, 0, uData);

        const empty2DView = this.#getOrCreateEmpty2DView();
        const emptyArrayView = this.#getOrCreateEmptyArrayView();

        const resolvedSplat = splatGPUView ?? empty2DView;
        const resolvedDiffuse = diffuseGPUView ?? emptyArrayView;
        const resolvedNormal = normalGPUView ?? emptyArrayView;
        const resolvedHeight = heightGPUView ?? emptyArrayView;
        const resolvedORM = ormGPUView ?? emptyArrayView;
        const resolvedBaseColor = baseColorGPUView ?? empty2DView;
        const resolvedORMTexture = ormTextureGPUView ?? empty2DView;
        const resolvedHeightmap = heightmapGPUView ?? empty2DView;

        const albedoStorageView = this.#physicalPagePool.albedoStorageView!;
        const normalORMStorageView = this.#physicalPagePool.normalORMStorageView!;

        const bindGroup = device.createBindGroup({
            label: 'RVT_ComputeBakeBindGroup',
            layout: this.#bindGroupLayout!,
            entries: [
                {binding: 0, resource: {buffer: this.#uniformBuffer!}},
                {binding: 1, resource: resolvedSplat},
                {binding: 2, resource: resolvedDiffuse},
                {binding: 3, resource: resolvedNormal},
                {binding: 4, resource: resolvedHeight},
                {binding: 5, resource: resolvedORM},
                {binding: 6, resource: this.#sampler!},
                {binding: 7, resource: resolvedBaseColor},
                {binding: 8, resource: resolvedORMTexture},
                {binding: 9, resource: resolvedHeightmap},
                {binding: 10, resource: albedoStorageView},
                {binding: 11, resource: normalORMStorageView},
            ]
        });

        const commandEncoderManager = this.#redGPUContext.commandEncoderManager;
        const passRecord = (pass: GPUComputePassEncoder) => {
            pass.setPipeline(this.#computePipeline!);
            pass.setBindGroup(0, bindGroup);

            const workgroupsX = Math.ceil(width / 16);
            const workgroupsY = Math.ceil(height / 16);
            pass.dispatchWorkgroups(workgroupsX, workgroupsY);
        };

        if (useDeferred) {
            commandEncoderManager.addResourceComputePass({label: 'RVT_ComputeBakePass'}, passRecord);
        } else {
            commandEncoderManager.immediateComputePass({label: 'RVT_ComputeBakePass'}, passRecord);
        }
    }

    public destroy(): void {
        this.#physicalPagePool.destroy();
        this.#pageTable.destroy();
        this.#feedbackBuffer.destroy();
        this.#empty2DGPUTexture?.destroy();
        this.#emptyArrayGPUTexture?.destroy();
        this.#uniformBuffer?.destroy();
        this.#empty2DGPUTexture = null;
        this.#empty2DView = null;
        this.#emptyArrayGPUTexture = null;
        this.#emptyArrayView = null;
        this.#uniformBuffer = null;
    }

    #initPipeline(): void {
        const device = this.#redGPUContext.gpuDevice;

        this.#uniformBuffer = device.createBuffer({
            label: 'RVT_BakeUniform', size: 28 * 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#sampler = device.createSampler({
            label: 'RVT_BakeSampler', magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
            addressModeU: 'repeat', addressModeV: 'repeat',
        });

        this.#bindGroupLayout = device.createBindGroupLayout({
            label: 'RVT_ComputeBakeBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {binding: 6, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
                {binding: 7, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 8, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 9, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {
                    binding: 10,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                },
                {
                    binding: 11,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba16float', viewDimension: '2d'}
                },
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            label: 'RVT_ComputeBakePipelineLayout', bindGroupLayouts: [this.#bindGroupLayout]
        });

        const shaderModule = device.createShaderModule({label: 'RVT_ComputeBakeShader', code: bakeSrc});

        this.#computePipeline = device.createComputePipeline({
            label: 'RVT_ComputeBakePipeline', layout: pipelineLayout,
            compute: {module: shaderModule, entryPoint: 'cs_main'}
        });
    }

    #getTextureView(texture: any): GPUTextureView | null {
        if (!texture) return null;
        if (texture instanceof GPUTextureView) return texture;
        if (texture instanceof GPUTexture) return texture.createView();
        const gpuTex = texture.gpuTexture ?? texture.texture;
        if (gpuTex instanceof GPUTexture) return gpuTex.createView();
        return this.#redGPUContext.resourceManager.getGPUResourceBitmapTextureView(texture) ?? null;
    }

    #getArrayTextureView(textureArray: any): GPUTextureView | null {
        if (!textureArray) return null;
        if (textureArray instanceof GPUTextureView) return textureArray;
        if (textureArray instanceof GPUTexture) return textureArray.createView({dimension: '2d-array'});
        const gpuTex = textureArray.gpuTexture ?? textureArray.texture;
        if (gpuTex instanceof GPUTexture) return gpuTex.createView({dimension: '2d-array'});
        return this.#redGPUContext.resourceManager.getGPUResourceBitmapTextureView(textureArray, {dimension: '2d-array'}) ?? null;
    }

    #getOrCreateEmpty2DView(): GPUTextureView {
        if (!this.#empty2DGPUTexture) {
            this.#empty2DGPUTexture = this.#redGPUContext.gpuDevice.createTexture({
                label: 'RVT_Empty2D',
                size: [1, 1, 1],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            });
            this.#empty2DView = this.#empty2DGPUTexture.createView();
        }
        return this.#empty2DView!;
    }

    #getOrCreateEmptyArrayView(): GPUTextureView {
        if (!this.#emptyArrayGPUTexture) {
            this.#emptyArrayGPUTexture = this.#redGPUContext.gpuDevice.createTexture({
                label: 'RVT_EmptyArray',
                size: [1, 1, 4],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            });
            this.#emptyArrayView = this.#emptyArrayGPUTexture.createView({
                dimension: '2d-array',
                arrayLayerCount: 4,
                baseArrayLayer: 0
            });
        }
        return this.#emptyArrayView!;
    }
}

Object.freeze(TerrainRVT);
export default TerrainRVT;