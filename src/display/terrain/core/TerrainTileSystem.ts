import RedGPUContext from "../../../context/RedGPUContext";
import TerrainMaterialBind from "./TerrainMaterialBind";
import {keepLog} from "../../../utils";
import defineTexture from "../../../defineProperty/funcs/texture/defineTexture";
import DirectTexture from "../../../resources/texture/DirectTexture";
import {SpatialTileInfo, TerrainSpatialGrid} from "./TerrainSpatialGrid";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager";
import defineVector2 from "../../../defineProperty/funcs/vector/defineVector2";
import {TerrainQuadtree} from "./TerrainQuadtree";
import defineNumber from "../../../defineProperty/funcs/number/defineNumber";
import updateTargetUniform from "../../../defineProperty/core/updateTargetUniform";
import TerrainGeometry from "./TerrainGeometry";

interface TerrainTileSystem {
    heightmapAtlasTexture: DirectTexture | BitmapTexture | null;

    worldOffset: [number, number];
    worldSize: [number, number];

    minHeight: number;
    maxHeight: number;

    maxLOD: number;

    baseSlotIndex: number;
}

class TileStreamMetrics {
    frameLoadCount: number = 0;
    frameUnloadCount: number = 0;
    lastFrameLoadCount: number = 0;
    lastFrameUnloadCount: number = 0;
    lastMetricsResetTime: number = performance.now();

    update() {
        const now = performance.now();
        if (now - this.lastMetricsResetTime >= 1000) {
            this.lastFrameLoadCount = this.frameLoadCount;
            this.lastFrameUnloadCount = this.frameUnloadCount;
            this.frameLoadCount = 0;
            this.frameUnloadCount = 0;
            this.lastMetricsResetTime = now;
        }
    }
}

export interface TerrainOptions {
    cellSize?: number;
    loadingRadius?: number;
    gridSize?: number;
}

class TerrainTileSystem extends TerrainMaterialBind {
    #spatialGrid: TerrainSpatialGrid;
    #quadtree: TerrainQuadtree;
    #instanceBuffer: GPUBuffer;
    #synthesizedTilesSet: Set<string> = new Set();
    #tileImageCache: Map<string, any> = new Map();
    #tileUrlResolver?: (tile: SpatialTileInfo) => string | void;
    #onTileUnloadCallback?: (tile: SpatialTileInfo) => void;
    #prevWorldSize: number = 0;
    #prevMaxLOD: number = 0;
    #lodRanges: Float32Array = new Float32Array(32);
    #atlasTileCountX: number = 16;
    #atlasTileCountZ: number = 16;
    #atlasTileSize: number = 512;
    #gridSize: number = 64;
    #maxInstances: number = 65536;
    #tileStreamMetrics = new TileStreamMetrics();

    constructor(redGPUContext: RedGPUContext, options?: TerrainOptions) {
        const gridSize = options?.gridSize ?? 64;
        super(redGPUContext, gridSize);
        const cellSize = options?.cellSize ?? 256;
        const loadingRadius = options?.loadingRadius ?? 2560;
        this.#spatialGrid = new TerrainSpatialGrid(cellSize, loadingRadius);
        this.minHeight = 0;
        this.maxHeight = 0.5;
        this.worldOffset = [-0.5, -0.5];
        this.worldSize = [1, 1];
        this.maxLOD = 4;
        this.baseSlotIndex = 0;
        this.#gridSize = gridSize;

        const maxInstances = 65536; // 65,536 인스턴스 (65,536 * 16 bytes = 1MB VRAM) - 32K 대형 지형 및 고해상도 LOD 대비
        this.#maxInstances = maxInstances;
        this.#instanceBuffer = redGPUContext.gpuDevice.createBuffer({
            size: maxInstances * 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: 'TerrainInstanceBuffer'
        });

    }

    get tileImageCache(): Map<string, any> {
        return this.#tileImageCache;
    }

    get instanceBuffer(): GPUBuffer {
        return this.#instanceBuffer;
    }

    get lodRanges(): Float32Array {
        return this.#lodRanges;
    }

    set lodRanges(value: Float32Array) {
        this.#lodRanges = value;
        updateTargetUniform(this, 'lodRanges', value);
    }

    get gridSize(): number {
        return this.#gridSize;
    }

    set gridSize(value: number) {
        this.geometry = new TerrainGeometry(this.redGPUContext, value);
        this.#gridSize = value;
        updateTargetUniform(this, 'gridSize', value);
    }

    get atlasTileCountX(): number {
        return this.#atlasTileCountX;
    }

    get atlasTileCountZ(): number {
        return this.#atlasTileCountZ;
    }

    get atlasTileSize(): number {
        return this.#atlasTileSize;
    }

    get spatialGrid(): TerrainSpatialGrid {
        return this.#spatialGrid;
    }

    get quadtree(): TerrainQuadtree {
        return this.#quadtree;
    }

    get tileStreamMetrics(): TileStreamMetrics {
        return this.#tileStreamMetrics;
    }

    get synthesizedTileCount(): number {
        return this.#synthesizedTilesSet.size;
    }

    checkQuadtree(renderViewStateData: any) {
        const currentWorldSize = this.worldSize[0];
        if (!this.#quadtree || this.#prevWorldSize !== currentWorldSize || this.#prevMaxLOD !== this.maxLOD) {
            this.#quadtree = new TerrainQuadtree(currentWorldSize, this.maxLOD);
            this.#prevWorldSize = currentWorldSize;
            this.#prevMaxLOD = this.maxLOD;

            const lodRanges = new Float32Array(32);
            const lodThreshold = 1.5;
            const morphConstant = 0.5;

            for (let i = 0; i <= this.maxLOD; i++) {
                const worldScale = currentWorldSize / Math.pow(2, i);

                const morphEnd = worldScale * lodThreshold;

                const morphStart = morphEnd - (worldScale * morphConstant);

                lodRanges[i * 4 + 0] = morphStart;
                lodRanges[i * 4 + 1] = morphEnd;
                lodRanges[i * 4 + 2] = 0;
                lodRanges[i * 4 + 3] = 0;
            }
            this.lodRanges = lodRanges;
        }

        this.baseSlotIndex = this.globalVertexSlotIndex;

        const camera = renderViewStateData.view.rawCamera;
        const localCamX = camera.x - this.worldOffset[0];
        const localCamY = camera.y;
        const localCamZ = camera.z - this.worldOffset[1];
        const cameraPos: [number, number, number] = [localCamX, localCamY, localCamZ];

        if (this.#spatialGrid) {
            const {toLoad, toUnload} = this.#spatialGrid.update(camera, this.worldOffset, this.worldSize);
            this.#tileStreamMetrics.update();

            if (toLoad.length > 0) {
                if (this.#tileUrlResolver) {
                    toLoad.forEach(tile => {
                        this.#enrichTileInfo(tile);
                        if (this.isTileSynthesized(tile)) return;
                        this.#tileStreamMetrics.frameLoadCount++;
                        const result = this.#tileUrlResolver!(tile);
                        if (typeof result === 'string') {
                            this.#loadTileFromUrl(tile, result);
                        }
                    });
                }
            }
            if (toUnload.length > 0) {
                this.#tileStreamMetrics.frameUnloadCount += toUnload.length;
                toUnload.forEach(tile => {
                    this.#enrichTileInfo(tile);
                    if (this.#onTileUnloadCallback) {
                        this.#onTileUnloadCallback!(tile);
                    }
                });
            }
        }

        const planes = renderViewStateData.frustumPlanes;

        this.#quadtree.update(
            cameraPos,
            planes,
            this.minHeight,
            this.maxHeight,
            this.worldOffset[0],
            this.worldOffset[1],
            1.5
        );

        const leafNodes = this.#quadtree.leafNodes;
        const count = Math.min(leafNodes.length, this.#maxInstances);

        if (count > 0) {
            const arrayBuffer = new Float32Array(count * 4);
            for (let i = 0; i < count; i++) {
                const node = leafNodes[i];
                const centerX = node.offset[0] + (node.scale * 0.5);
                const centerZ = node.offset[1] + (node.scale * 0.5);

                arrayBuffer[i * 4 + 0] = this.worldOffset[0] + centerX;
                arrayBuffer[i * 4 + 1] = this.worldOffset[1] + centerZ;
                arrayBuffer[i * 4 + 2] = node.scale;
                arrayBuffer[i * 4 + 3] = node.lod;
            }
            this.redGPUContext.gpuDevice.queue.writeBuffer(this.#instanceBuffer, 0, arrayBuffer, 0, count * 4);
        }

        if (this.gpuRenderInfo && this.drawCommandSlot && this.drawBufferManager) {
            this.drawBufferManager.setInstanceNum(this.drawCommandSlot, count);
        }
    }

    isTileSynthesized(tile: SpatialTileInfo | string): boolean {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        return this.#synthesizedTilesSet.has(key);
    }

    setTileUrlResolver(resolver: (tile: SpatialTileInfo) => string | void) {
        this.#tileUrlResolver = resolver;
    }

    setOnTileUnload(callback: (tile: SpatialTileInfo) => void) {
        this.#onTileUnloadCallback = callback;
    }

    destroy() {
        if (this.#instanceBuffer) {
            this.#instanceBuffer.destroy();
            this.#instanceBuffer = null;
        }
        super.destroy();
    }

    #createHeightmapTileAtlas(tileCountX: number = 16, tileCountZ: number = 16, tileSize: number = 512) {
        const device = this.redGPUContext.gpuDevice;
        this.#atlasTileCountX = tileCountX;
        this.#atlasTileCountZ = tileCountZ;
        this.#atlasTileSize = tileSize;

        const atlasWidth = tileCountX * tileSize;
        const atlasHeight = tileCountZ * tileSize;
        keepLog('Terrain_HeightmapTileAtlasGPUTexture', atlasWidth, atlasHeight)
        const gpuTexture = device.createTexture({
            label: 'Terrain_HeightmapTileAtlasGPUTexture',
            size: [atlasWidth, atlasHeight, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });

        this.heightmapAtlasTexture = new DirectTexture(
            this.redGPUContext,
            'Terrain_HeightmapTileAtlasDirectTexture',
            gpuTexture
        );
    }

    #updateTileHeightmap(tile: SpatialTileInfo, sourceTexture: BitmapTexture) {
        const tileX = tile.tileCol ?? 0;
        const tileZ = tile.tileRow ?? 0;

        if (!this.heightmapAtlasTexture) {
            this.#createHeightmapTileAtlas(16, 16, 512);
        }
        const gpuTexture = this.heightmapAtlasTexture?.gpuTexture;
        if (!sourceTexture || !sourceTexture.gpuTexture || !gpuTexture) return;

        const destX = tileX * this.atlasTileSize;
        const destZ = tileZ * this.atlasTileSize;

        const atlasWidth = this.atlasTileCountX * this.atlasTileSize;
        const atlasHeight = this.atlasTileCountZ * this.atlasTileSize;

        const srcW = Math.min(this.atlasTileSize, sourceTexture.gpuTexture.width);
        const srcH = Math.min(this.atlasTileSize, sourceTexture.gpuTexture.height);

        this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
            encoder.copyTextureToTexture(
                {texture: sourceTexture.gpuTexture},
                {texture: gpuTexture, origin: [destX, destZ, 0]},
                [srcW, srcH, 1]
            );

            const padW = this.atlasTileSize - srcW;
            const padH = this.atlasTileSize - srcH;

            if (padW > 0) {
                for (let p = 0; p < padW; p++) {
                    encoder.copyTextureToTexture(
                        {texture: sourceTexture.gpuTexture, origin: [srcW - 1, 0, 0]},
                        {texture: gpuTexture, origin: [destX + srcW + p, destZ, 0]},
                        [1, srcH, 1]
                    );
                }
            }
            if (padH > 0) {
                for (let p = 0; p < padH; p++) {
                    encoder.copyTextureToTexture(
                        {texture: sourceTexture.gpuTexture, origin: [0, srcH - 1, 0]},
                        {texture: gpuTexture, origin: [destX, destZ + srcH + p, 0]},
                        [srcW, 1, 1]
                    );
                }
            }

            if (destX + this.atlasTileSize < atlasWidth) {
                encoder.copyTextureToTexture(
                    {texture: sourceTexture.gpuTexture, origin: [srcW - 1, 0, 0]},
                    {texture: gpuTexture, origin: [destX + this.atlasTileSize, destZ, 0]},
                    [1, srcH, 1]
                );
            }
            if (destZ + this.atlasTileSize < atlasHeight) {
                encoder.copyTextureToTexture(
                    {texture: sourceTexture.gpuTexture, origin: [0, srcH - 1, 0]},
                    {texture: gpuTexture, origin: [destX, destZ + this.atlasTileSize, 0]},
                    [srcW, 1, 1]
                );
            }
        });

        this.#markTileSynthesized(`${tileX}_${tileZ}`);

        if (sourceTexture && typeof sourceTexture.destroy === 'function') {
            sourceTexture.destroy();
        }

        if (this.material && typeof (this.material as any).bakeRVT === 'function') {
            (this.material as any).bakeRVT();
        }
    }

    #enrichTileInfo(tile: SpatialTileInfo) {
        tile.cellKey = `${tile.gridX}_${tile.gridZ}`;
        const [tbMinX, tbMinZ, tbMaxX, tbMaxZ] = tile.worldBounds;
        const tileCenterX = (tbMinX + tbMaxX) * 0.5;
        const tileCenterZ = (tbMinZ + tbMaxZ) * 0.5;

        const worldW = this.worldSize[0];
        const worldH = this.worldSize[1];
        const tileSpanX = worldW / this.atlasTileCountX;
        const tileSpanZ = worldH / this.atlasTileCountZ;

        const gridX = Math.max(0, Math.min(this.atlasTileCountX - 1, Math.floor((tileCenterX - this.worldOffset[0]) / tileSpanX)));
        const gridZ = Math.max(0, Math.min(this.atlasTileCountZ - 1, Math.floor((tileCenterZ - this.worldOffset[1]) / tileSpanZ)));

        tile.tileCol = gridX;
        tile.tileRow = (this.atlasTileCountZ - 1) - gridZ;
        tile.atlasKey = `${tile.tileCol}_${tile.tileRow}`;
        tile.tileColStr = String(tile.tileCol).padStart(2, '0');
        tile.tileRowStr = String(tile.tileRow).padStart(2, '0');
    }

    #markTileSynthesized(tile: SpatialTileInfo | string) {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        this.#synthesizedTilesSet.add(key);
    }

    #registerTileImage(tile: SpatialTileInfo | string, image: any) {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        this.#tileImageCache.set(key, image);
    }

    #loadTileFromUrl(tile: SpatialTileInfo, url: string, format: GPUTextureFormat = 'rgba8unorm') {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            this.#registerTileImage(tile, img);
        };

        new BitmapTexture(
            this.redGPUContext,
            url,
            false,
            (tex: BitmapTexture) => {
                this.#updateTileHeightmap(tile, tex);
            },
            null,
            format
        );

        console.log(`[Tile Streamer 📥] Load Cell(${tile.gridX}, ${tile.gridZ}) → Tile[${tile.tileColStr}, ${tile.tileRowStr}] (${url})`);
    }
}

defineNumber(TerrainTileSystem, [
    {key: "maxLOD", value: 4},
    {key: "baseSlotIndex", value: 0},
    {key: "minHeight", value: 0},
    {key: "maxHeight", value: 1}
])
defineVector2(TerrainTileSystem, [
    {key: "worldOffset", value: [0, 0]},
    {key: "worldSize", value: [1, 1]},
]);
defineTexture(TerrainTileSystem, [
    {key: "heightmapAtlasTexture"}
]);
Object.freeze(TerrainTileSystem);
export default TerrainTileSystem;