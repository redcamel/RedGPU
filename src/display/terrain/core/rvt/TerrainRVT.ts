import RedGPUContext from "../../../../context/RedGPUContext";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import TerrainMaterial from "../material/TerrainMaterial";
import PhysicalPagePool from "./PhysicalPagePool";
import PageTable, {PageState} from "./PageTable";
import bakeSrc from "./rvt_bake.wgsl";

export interface TerrainRVTOptions {
    atlasSize?: number;
    tileSize?: number;
    borderSize?: number;
    virtualCountX?: number;
    virtualCountZ?: number;
}

export interface TileBakeRequest {
    vX: number;
    vZ: number;
    pixelX: number;
    pixelY: number;
    width: number;
    height: number;
    tileCountX?: number;
    tileCountZ?: number;
}

class TerrainRVT {
    readonly #redGPUContext: RedGPUContext;
    readonly #physicalPagePool: PhysicalPagePool;
    readonly #pageTable: PageTable;

    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #storageBuffer: GPUBuffer | null = null;

    #sampler: GPUSampler | null = null;
    #empty2DGPUTexture: GPUTexture | null = null;
    #empty2DView: GPUTextureView | null = null;
    #emptyArrayGPUTexture: GPUTexture | null = null;
    #emptyArrayView: GPUTextureView | null = null;

    readonly #uDataBatch = new Float32Array(32 * 28);
    readonly #uDataBatchU32 = new Uint32Array(this.#uDataBatch.buffer);

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

        this.#initPipeline();
    }

    get physicalPagePool(): PhysicalPagePool {
        return this.#physicalPagePool;
    }

    get pageTable(): PageTable {
        return this.#pageTable;
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
        const spatialGrid = material.targetTerrain?.spatialGrid;
        const activeTiles = spatialGrid?.activeTileList;
        if (!activeTiles || activeTiles.length === 0) return;

        const batchRequests: TileBakeRequest[] = [];
        const pageTableSetups: Array<{ vX: number; vZ: number; slotX: number; slotY: number; mip: number }> = [];

        const tileCountX = this.#pageTable.virtualCountX;
        const tileCountZ = this.#pageTable.virtualCountZ;
        const tileSize = this.#physicalPagePool.tileSizeWithBorder;

        for (let i = 0; i < activeTiles.length; i++) {
            if (batchRequests.length >= maxBakesPerFrame) break;
            const tile = activeTiles[i];
            const vX = tile.tileCol ?? (tile.gridX + (tileCountX >> 1));
            const vZ = tile.tileRow ?? (tile.gridZ + (tileCountZ >> 1));

            if (vX >= 0 && vX < tileCountX && vZ >= 0 && vZ < tileCountZ) {
                const entry = this.#pageTable.getEntry(vX, vZ);
                if (!entry || entry.state !== PageState.Ready) {
                    const virtualKey = `${vX}_${vZ}`;
                    const slot = this.#physicalPagePool.allocatePage(virtualKey);

                    if (slot.isEvicted && slot.evictedVirtualKey) {
                        const idx = slot.evictedVirtualKey.indexOf('_');
                        if (idx !== -1) {
                            const evX = parseInt(slot.evictedVirtualKey.substring(0, idx), 10);
                            const evZ = parseInt(slot.evictedVirtualKey.substring(idx + 1), 10);
                            this.#pageTable.clearEntry(evX, evZ);
                        }
                    }

                    batchRequests.push({
                        vX, vZ,
                        pixelX: slot.pixelX,
                        pixelY: slot.pixelY,
                        width: tileSize,
                        height: tileSize,
                        tileCountX, tileCountZ
                    });

                    pageTableSetups.push({
                        vX, vZ,
                        slotX: slot.slotX,
                        slotY: slot.slotY,
                        mip: 0
                    });
                }
            }
        }

        if (batchRequests.length > 0) {
            this.bakeBatch(material, batchRequests, true);
            for (let i = 0; i < pageTableSetups.length; i++) {
                const setup = pageTableSetups[i];
                this.#pageTable.setEntry(
                    setup.vX, setup.vZ,
                    setup.slotX, setup.slotY,
                    setup.mip,
                    PageState.Ready,
                    this.#physicalPagePool.tilesPerRow
                );
            }
        }
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

    #cachedBindGroup: GPUBindGroup | null = null;

    public bakeTileRect(
        material: TerrainMaterial,
        pixelX: number,
        pixelY: number,
        width: number,
        height: number,
        vX: number = 0,
        vZ: number = 0,
        tileCountX?: number,
        tileCountZ?: number,
        useDeferred: boolean = false
    ): void {
        this.bakeBatch(material, [{
            vX, vZ, pixelX, pixelY, width, height, tileCountX, tileCountZ
        }], useDeferred);
    }
    #cachedBindGroupKey: string = '';

    #initPipeline(): void {
        const device = this.#redGPUContext.gpuDevice;

        this.#storageBuffer = device.createBuffer({
            label: 'RVT_BakeStorageBuffer',
            size: 32 * 28 * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#sampler = device.createSampler({
            label: 'RVT_BakeSampler', magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
            addressModeU: 'repeat', addressModeV: 'repeat',
        });

        this.#bindGroupLayout = device.createBindGroupLayout({
            label: 'RVT_ComputeBakeBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
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

    public bakeBatch(
        material: TerrainMaterial,
        requests: TileBakeRequest[],
        useDeferred: boolean = false
    ): void {
        if (!this.#computePipeline || requests.length === 0) return;

        const count = Math.min(requests.length, 32);
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

        const layers = mat.layers || [];
        const baseRoughness = mat.roughnessFactor ?? 1.0;
        const defaultTileCountX = this.#pageTable.virtualCountX;
        const defaultTileCountZ = this.#pageTable.virtualCountZ;

        for (let i = 0; i < count; i++) {
            const req = requests[i];
            const tileCountX = req.tileCountX ?? defaultTileCountX;
            const tileCountZ = req.tileCountZ ?? defaultTileCountZ;
            const offset = i * 28;

            this.#uDataBatch[offset + 0] = req.vX / tileCountX;
            this.#uDataBatch[offset + 1] = req.vZ / tileCountZ;
            this.#uDataBatch[offset + 2] = 1.0 / tileCountX;
            this.#uDataBatch[offset + 3] = 1.0 / tileCountZ;
            this.#uDataBatch[offset + 4] = req.vX / tileCountX;
            this.#uDataBatch[offset + 5] = req.vZ / tileCountZ;
            this.#uDataBatch[offset + 6] = 1.0 / tileCountX;
            this.#uDataBatch[offset + 7] = 1.0 / tileCountZ;

            this.#uDataBatch[offset + 8] = req.pixelX;
            this.#uDataBatch[offset + 9] = req.pixelY;
            this.#uDataBatch[offset + 10] = req.width;
            this.#uDataBatch[offset + 11] = req.height;

            this.#uDataBatch[offset + 12] = mat.tileScale ?? 16.0;
            this.#uDataBatch[offset + 13] = mat.macroScale ?? 2.0;
            this.#uDataBatch[offset + 14] = mat.blendContrast ?? 0.0;
            this.#uDataBatch[offset + 15] = baseRoughness;
            this.#uDataBatch[offset + 16] = layers[0]?.roughnessFactor ?? 0.85;
            this.#uDataBatch[offset + 17] = layers[1]?.roughnessFactor ?? 0.85;
            this.#uDataBatch[offset + 18] = layers[2]?.roughnessFactor ?? 0.90;
            this.#uDataBatch[offset + 19] = layers[3]?.roughnessFactor ?? 0.85;
            this.#uDataBatch[offset + 20] = mat.normalScale ?? 1.0;
            this.#uDataBatch[offset + 21] = mat.occlusionStrength ?? 1.0;
            this.#uDataBatch[offset + 22] = mat.baseColorWeight ?? 0.5;

            this.#uDataBatchU32[offset + 23] = mat.baseColorBlendMode === 'multiply' ? 1 : 0;
            const isAutoSplat = !mat.splatTexture || mat.useAutoSplat === true;
            this.#uDataBatchU32[offset + 24] = isAutoSplat ? 1 : 0;
            this.#uDataBatchU32[offset + 25] = 0;
            this.#uDataBatchU32[offset + 26] = 0;
            this.#uDataBatchU32[offset + 27] = 0;
        }

        const storageBuf = this.#storageBuffer;
        const pipeline = this.#computePipeline;
        const albedoStorageView = this.#physicalPagePool.albedoStorageView;
        const normalORMStorageView = this.#physicalPagePool.normalORMStorageView;

        if (!storageBuf || !pipeline || !albedoStorageView || !normalORMStorageView) return;

        device.queue.writeBuffer(storageBuf, 0, this.#uDataBatch.subarray(0, count * 28));

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

        const bindGroup = this.#getOrCreateBakeBindGroup(
            resolvedSplat,
            resolvedDiffuse,
            resolvedNormal,
            resolvedHeight,
            resolvedORM,
            resolvedBaseColor,
            resolvedORMTexture,
            resolvedHeightmap,
            albedoStorageView,
            normalORMStorageView
        );

        if (!bindGroup) return;

        const commandEncoderManager = this.#redGPUContext.commandEncoderManager;
        const passRecord = (pass: GPUComputePassEncoder) => {
            pass.setPipeline(pipeline);
            pass.setBindGroup(0, bindGroup);
            const req0 = requests[0];
            pass.dispatchWorkgroups(
                Math.ceil(req0.width / 16),
                Math.ceil(req0.height / 16),
                count
            );
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
        this.#empty2DGPUTexture?.destroy();
        this.#emptyArrayGPUTexture?.destroy();
        this.#storageBuffer?.destroy();
        this.#empty2DGPUTexture = null;
        this.#empty2DView = null;
        this.#emptyArrayGPUTexture = null;
        this.#emptyArrayView = null;
        this.#storageBuffer = null;
        this.#cachedBindGroup = null;
        this.#cachedBindGroupKey = '';
    }

    #getOrCreateBakeBindGroup(
        resolvedSplat: GPUTextureView,
        resolvedDiffuse: GPUTextureView,
        resolvedNormal: GPUTextureView,
        resolvedHeight: GPUTextureView,
        resolvedORM: GPUTextureView,
        resolvedBaseColor: GPUTextureView,
        resolvedORMTexture: GPUTextureView,
        resolvedHeightmap: GPUTextureView,
        albedoStorageView: GPUTextureView,
        normalORMStorageView: GPUTextureView
    ): GPUBindGroup {
        const getObjId = (obj: any): string => {
            if (!obj) return 'null';
            if (!obj.__bindId) {
                obj.__bindId = Math.random().toString(36).substring(2, 9);
            }
            return obj.__bindId;
        };

        const key = `${getObjId(resolvedSplat)}_${getObjId(resolvedDiffuse)}_${getObjId(resolvedNormal)}_${getObjId(resolvedHeight)}_${getObjId(resolvedORM)}_${getObjId(resolvedBaseColor)}_${getObjId(resolvedORMTexture)}_${getObjId(resolvedHeightmap)}_${getObjId(albedoStorageView)}_${getObjId(normalORMStorageView)}`;

        if (this.#cachedBindGroup && this.#cachedBindGroupKey === key) {
            return this.#cachedBindGroup;
        }

        const layout = this.#bindGroupLayout;
        const storageBuf = this.#storageBuffer;
        const sampler = this.#sampler;
        if (!layout || !storageBuf || !sampler) return null;

        const device = this.#redGPUContext.gpuDevice;
        const bindGroup = device.createBindGroup({
            label: 'RVT_ComputeBakeBindGroup',
            layout,
            entries: [
                {binding: 0, resource: {buffer: storageBuf}},
                {binding: 1, resource: resolvedSplat},
                {binding: 2, resource: resolvedDiffuse},
                {binding: 3, resource: resolvedNormal},
                {binding: 4, resource: resolvedHeight},
                {binding: 5, resource: resolvedORM},
                {binding: 6, resource: sampler},
                {binding: 7, resource: resolvedBaseColor},
                {binding: 8, resource: resolvedORMTexture},
                {binding: 9, resource: resolvedHeightmap},
                {binding: 10, resource: albedoStorageView},
                {binding: 11, resource: normalORMStorageView},
            ]
        });

        this.#cachedBindGroup = bindGroup;
        this.#cachedBindGroupKey = key;
        return bindGroup;
    }

    #getOrCreateEmpty2DView(): GPUTextureView {
        if (!this.#empty2DGPUTexture || !this.#empty2DView) {
            this.#empty2DGPUTexture = this.#redGPUContext.gpuDevice.createTexture({
                label: 'RVT_Empty2D',
                size: [1, 1, 1],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            });
            this.#empty2DView = this.#empty2DGPUTexture.createView();
        }
        return this.#empty2DView;
    }

    #getOrCreateEmptyArrayView(): GPUTextureView {
        if (!this.#emptyArrayGPUTexture || !this.#emptyArrayView) {
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
        return this.#emptyArrayView;
    }
}

Object.freeze(TerrainRVT);
export default TerrainRVT;