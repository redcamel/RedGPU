import RedGPUContext from "../../../context/RedGPUContext";
import TerrainMaterialBind from "./TerrainMaterialBind";
import keepLog from "../../../utils/keepLog";
import defineTexture from "../../../defineProperty/funcs/texture/defineTexture";
import DirectTexture from "../../../resources/texture/DirectTexture";
import {SpatialTileInfo, TerrainSpatialGrid} from "./TerrainSpatialGrid";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import defineVector2 from "../../../defineProperty/funcs/vector/defineVector2";
import {TerrainQuadtree} from "./TerrainQuadtree";
import defineNumber from "../../../defineProperty/funcs/number/defineNumber";
import updateTargetUniform from "../../../defineProperty/core/updateTargetUniform";
import TerrainGeometry from "./TerrainGeometry";

import TerrainHeightmapProcessor from "./terrainHeightmapProcessor/TerrainHeightmapProcessor";
import parse16BitPngBuffer from "../../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";

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
    verticesPerSide?: number;
    lodThreshold?: number;
}

function sanitizeVerticesPerSide(val: number): number {
    const minVal = 16;
    const maxVal = 512;
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const powerOfTwo = Math.pow(2, Math.round(Math.log2(clamped)));
    if (powerOfTwo !== val) {
        console.warn(`[RedGPU Terrain] verticesPerSide는 2의 거듭제곱(16, 32, 64, 128...)이어야 합니다. (${val} -> ${powerOfTwo}로 자동 보정됨)`);
    }
    return powerOfTwo;
}

class TerrainTileSystem extends TerrainMaterialBind {
    #spatialGrid: TerrainSpatialGrid;
    #quadtree: TerrainQuadtree;
    #instanceBuffer: GPUBuffer;
    #synthesizedTilesSet: Set<string> = new Set();
    #tileDataCache: Map<string, ArrayBufferView | ArrayBuffer> = new Map();
    #tileUrlResolver?: (tile: SpatialTileInfo) => string | void;
    #onTileLoadCallback?: (tile: SpatialTileInfo) => void;
    #onTileUnloadCallback?: (tile: SpatialTileInfo) => void;
    #prevWorldSize: number = 0;
    #prevMaxLOD: number = 0;
    #prevLodThreshold: number = 0;
    #lodRanges: Float32Array = new Float32Array(32);
    #lodThreshold: number = 2.0;
    #atlasTileCountX: number = 16;
    #atlasTileCountZ: number = 16;
    #atlasTileSize: number = 512;
    #verticesPerSide: number = 64;
    #maxInstances: number = 65536;
    #tileStreamMetrics = new TileStreamMetrics();

    constructor(redGPUContext: RedGPUContext, options?: TerrainOptions) {
        const verticesPerSide = sanitizeVerticesPerSide(options?.verticesPerSide ?? 64);
        super(redGPUContext, verticesPerSide);
        const cellSize = options?.cellSize ?? 256;
        const loadingRadius = options?.loadingRadius ?? 2560;
        this.#lodThreshold = options?.lodThreshold ?? 2.0;
        this.#spatialGrid = new TerrainSpatialGrid(cellSize, loadingRadius);
        this.minHeight = 0;
        this.maxHeight = 0.5;
        this.worldOffset = [-0.5, -0.5];
        this.worldSize = [1, 1];
        this.maxLOD = 4;
        this.baseSlotIndex = 0;
        this.#verticesPerSide = verticesPerSide;

        this.#maxInstances = 65536;
        this.#instanceBuffer = redGPUContext.gpuDevice.createBuffer({
            size: 65536 * 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: 'TerrainInstanceBuffer'
        });

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

    get verticesPerSide(): number {
        return this.#verticesPerSide;
    }

    set verticesPerSide(value: number) {
        const safeValue = sanitizeVerticesPerSide(value);
        this.geometry = new TerrainGeometry(this.redGPUContext, safeValue);
        this.#verticesPerSide = safeValue;
        updateTargetUniform(this, 'verticesPerSide', safeValue);
    }

    get quadsPerSide(): number {
        return this.#verticesPerSide - 1;
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

    get lodThreshold(): number {
        return this.#lodThreshold;
    }

    set lodThreshold(value: number) {
        this.#lodThreshold = value;
    }

    checkQuadtree(renderViewStateData: any) {
        const currentWorldSize = this.worldSize[0];
        if (
            !this.#quadtree ||
            this.#prevWorldSize !== currentWorldSize ||
            this.#prevMaxLOD !== this.maxLOD ||
            this.#prevLodThreshold !== this.#lodThreshold
        ) {
            this.#quadtree = new TerrainQuadtree(currentWorldSize, this.maxLOD);
            this.#prevWorldSize = currentWorldSize;
            this.#prevMaxLOD = this.maxLOD;
            this.#prevLodThreshold = this.#lodThreshold;

            if (this.#spatialGrid) {
                this.#spatialGrid.cellSize = currentWorldSize / this.atlasTileCountX;
            }

            const lodRanges = new Float32Array(32);
            const lodThreshold = this.lodThreshold;
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

        this.#quadtree.update(
            cameraPos,
            renderViewStateData.frustumPlanes,
            this.minHeight,
            this.maxHeight,
            this.worldOffset[0],
            this.worldOffset[1],
            this.#lodThreshold
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

    setOnTileLoad(callback: (tile: SpatialTileInfo) => void) {
        this.#onTileLoadCallback = callback;
    }

    setOnTileUnload(callback: (tile: SpatialTileInfo) => void) {
        this.#onTileUnloadCallback = callback;
    }

    destroy() {
        if (this.#instanceBuffer) {
            this.#instanceBuffer.destroy();
            this.#instanceBuffer = null;
        }
        if (this.heightmapAtlasTexture) {
            this.heightmapAtlasTexture.destroy();
            this.heightmapAtlasTexture = null;
        }
        this.#tileDataCache.clear();
        this.#synthesizedTilesSet.clear();
        this.#processor = null;
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
            format: 'r16float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });

        this.heightmapAtlasTexture = new DirectTexture(
            this.redGPUContext,
            'Terrain_HeightmapTileAtlasDirectTexture',
            gpuTexture
        );
    }

    get tileDataCache(): Map<string, ArrayBufferView | ArrayBuffer> {
        return this.#tileDataCache;
    }

    loadTileFrom16BitBuffer(tile: SpatialTileInfo, data: ArrayBuffer | ArrayBufferView, width: number, height: number) {
        this.#registerTileData(tile, data);
        this.#updateTileHeightmapFromBuffer(tile, data, width, height);
        console.log(`[Tile Streamer 📥] Load 16-bit Buffer Cell(${tile.gridX}, ${tile.gridZ}) → Tile[${tile.tileColStr}, ${tile.tileRowStr}]`);
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

    #processor: TerrainHeightmapProcessor;

    #updateTileHeightmapFromBuffer(tile: SpatialTileInfo, data: ArrayBuffer | ArrayBufferView, width: number, height: number) {
        const tileX = tile.tileCol ?? 0;
        const tileZ = tile.tileRow ?? 0;

        if (!this.heightmapAtlasTexture) {
            this.#createHeightmapTileAtlas(16, 16, 512);
        }
        const gpuTexture = this.heightmapAtlasTexture?.gpuTexture;
        if (!gpuTexture) return;

        if (!this.#processor) {
            this.#processor = new TerrainHeightmapProcessor(this.redGPUContext);
        }

        const destX = tileX * this.atlasTileSize;
        const destZ = tileZ * this.atlasTileSize;

        this.#processor.processAndUploadTile(
            destX,
            destZ,
            data,
            width,
            height,
            gpuTexture,
            this.atlasTileSize
        );

        this.#markTileSynthesized(`${tileX}_${tileZ}`);

        if (this.#onTileLoadCallback) {
            this.#onTileLoadCallback(tile);
        }

        if (this.material) {
            const mat = this.material as any;
            if (typeof mat.bakeRVTTile === 'function') {
                mat.bakeRVTTile(tileX, tileZ, this.atlasTileCountX, this.atlasTileCountZ);
            }
        }
    }

    #registerTileData(tile: SpatialTileInfo | string, data: any) {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        this.#tileDataCache.set(key, data);
    }

    #loadTileFromUrl(tile: SpatialTileInfo, url: string) {
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.arrayBuffer();
            })
            .then(async (buffer) => {
                const parsed = await parse16BitPngBuffer(buffer);
                if (parsed) {
                    this.loadTileFrom16BitBuffer(tile, parsed.pixels, parsed.width, parsed.height);
                } else {
                    this.loadTileFrom16BitBuffer(tile, buffer, this.atlasTileSize, this.atlasTileSize);
                }
            })
            .catch(err => {
                console.error(`[Tile Streamer ❌] Failed to load 16-bit tile from ${url}`, err);
            });

        console.log(`[Tile Streamer 📥] Fetching 16-bit Tile Cell(${tile.gridX}, ${tile.gridZ}) → Tile[${tile.tileColStr}, ${tile.tileRowStr}] (${url})`);
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