import RedGPUContext from "../../../../context/RedGPUContext";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import {SpatialTileInfo, TerrainSpatialGrid} from "./TerrainSpatialGrid";
import {TerrainQuadtree} from "./TerrainQuadtree";
import TerrainHeightmapManager from "./heightmap/TerrainHeightmapManager";
import TerrainHeightmapProcessor from "./heightmap/processor/TerrainHeightmapProcessor";
import parse16BitPngBuffer from "../../../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";

export type {SpatialTileInfo};

export class TileStreamMetrics {
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
    atlasSize?: number;
    atlasTileCountX?: number;
    atlasTileCountZ?: number;
    atlasTileSize?: number;
}

export function sanitizeVerticesPerSide(val: number): number {
    const minVal = 16;
    const maxVal = 512;
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const powerOfTwo = Math.pow(2, Math.round(Math.log2(clamped)));
    if (powerOfTwo !== val) {
        console.warn(`[RedGPU Terrain] verticesPerSide는 2의 거듭제곱(16, 32, 64, 128...)이어야 합니다. (${val} -> ${powerOfTwo}로 자동 보정됨)`);
    }
    return powerOfTwo;
}

export interface ITerrainTarget {
    worldOffset: [number, number];
    worldSize: [number, number];
    minHeight: number;
    maxHeight: number;
    maxLOD: number;
    baseSlotIndex: number;
    globalVertexSlotIndex: number;
    lodRanges: Float32Array;
    heightmapAtlasTexture: DirectTexture | BitmapTexture | null;
    material: any;
    gpuRenderInfo: any;
    drawCommandSlot: any;
    drawBufferManager: any;
}

export class TerrainTileManager {
    #terrain: ITerrainTarget;
    #redGPUContext: RedGPUContext;

    #spatialGrid: TerrainSpatialGrid;
    #quadtree!: TerrainQuadtree;
    #instanceBuffer: GPUBuffer;
    #instanceArrayBuffer: Float32Array;
    #cachedLodRanges: Float32Array = new Float32Array(32);

    #heightmapManager: TerrainHeightmapManager;

    #tileUrlResolver?: (tile: SpatialTileInfo) => string | void;
    #onTileLoadCallback?: (tile: SpatialTileInfo) => void;
    #onTileUnloadCallback?: (tile: SpatialTileInfo) => void;

    #prevWorldSize: number = 0;
    #prevMaxLOD: number = 0;
    #prevLodThreshold: number = 0;
    #lodThreshold: number = 2.0;

    #maxInstances: number = 65536;
    #tileStreamMetrics = new TileStreamMetrics();

    #currentInstanceCount: number = 0;
    #isDirty: boolean = true;
    #lastCamX: number = NaN;
    #lastCamY: number = NaN;
    #lastCamZ: number = NaN;
    #lastCamRotX: number = NaN;
    #lastCamRotY: number = NaN;
    #lastCamRotZ: number = NaN;

    #processor?: TerrainHeightmapProcessor | null;

    constructor(terrain: ITerrainTarget, redGPUContext: RedGPUContext, options?: TerrainOptions) {
        this.#terrain = terrain;
        this.#redGPUContext = redGPUContext;

        const cellSize = options?.cellSize ?? 256;
        const loadingRadius = options?.loadingRadius ?? 2560;
        this.#lodThreshold = options?.lodThreshold ?? 2.0;

        this.#spatialGrid = new TerrainSpatialGrid(cellSize, loadingRadius);

        const atlasTileCountX = options?.atlasTileCountX ?? 16;
        const atlasTileCountZ = options?.atlasTileCountZ ?? 16;
        const atlasTileSize = options?.atlasTileSize ?? 512;

        this.#heightmapManager = new TerrainHeightmapManager(redGPUContext, {
            atlasTileCountX,
            atlasTileCountZ,
            atlasTileSize
        });

        this.#terrain.worldSize = [cellSize * atlasTileCountX, cellSize * atlasTileCountZ];
        this.#maxInstances = 65536;

        this.#instanceBuffer = redGPUContext.gpuDevice.createBuffer({
            size: 65536 * 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: 'TerrainInstanceBuffer'
        });

        this.#instanceArrayBuffer = new Float32Array(65536 * 4);
    }

    get synthesizedTileCount(): number {
        return this.#heightmapManager.synthesizedTileCount;
    }

    get instanceBuffer(): GPUBuffer {
        return this.#instanceBuffer;
    }

    get atlasTileCountX(): number {
        return this.#heightmapManager.atlasTileCountX;
    }

    get atlasTileCountZ(): number {
        return this.#heightmapManager.atlasTileCountZ;
    }

    get atlasTileSize(): number {
        return this.#heightmapManager.atlasTileSize;
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

    get flatHeightmapData(): Uint16Array {
        return this.#heightmapManager.flatHeightmapData;
    }

    get lodThreshold(): number {
        return this.#lodThreshold;
    }

    set lodThreshold(value: number) {
        this.#lodThreshold = value;
    }

    get tileDataCache(): Map<string, ArrayBufferView | ArrayBuffer> {
        return this.#heightmapManager.tileDataCache;
    }

    markDirty() {
        this.#isDirty = true;
    }

    getTerrainHeight(x: number, z: number): number {
        return this.#heightmapManager.getTerrainHeight(
            x, z, this.#terrain.worldOffset, this.#terrain.worldSize, this.#terrain.minHeight, this.#terrain.maxHeight
        );
    }

    checkQuadtree(renderViewStateData: any) {
        const currentWorldSize = this.#terrain.worldSize[0];
        const lodRangesChanged = this.#updateLODRanges(currentWorldSize);

        this.#terrain.baseSlotIndex = this.#terrain.globalVertexSlotIndex;

        const camera = renderViewStateData.view.rawCamera;
        const localCamX = camera.x - this.#terrain.worldOffset[0];
        const localCamY = camera.y;
        const localCamZ = camera.z - this.#terrain.worldOffset[1];
        const cameraPos: [number, number, number] = [localCamX, localCamY, localCamZ];

        this.#processTileStreaming(camera);

        const camRotX = camera.rotationX ?? 0;
        const camRotY = camera.rotationY ?? 0;
        const camRotZ = camera.rotationZ ?? 0;

        const dx = localCamX - this.#lastCamX;
        const dy = localCamY - this.#lastCamY;
        const dz = localCamZ - this.#lastCamZ;
        const distSq = dx * dx + dy * dy + dz * dz;

        const dRotX = Math.abs(camRotX - this.#lastCamRotX);
        const dRotY = Math.abs(camRotY - this.#lastCamRotY);
        const dRotZ = Math.abs(camRotZ - this.#lastCamRotZ);
        const rotDiff = dRotX + dRotY + dRotZ;

        const shouldUpdate =
            this.#isDirty ||
            lodRangesChanged ||
            isNaN(distSq) ||
            distSq > 0.0025 ||
            rotDiff > 0.001;

        if (shouldUpdate) {
            this.#lastCamX = localCamX;
            this.#lastCamY = localCamY;
            this.#lastCamZ = localCamZ;
            this.#lastCamRotX = camRotX;
            this.#lastCamRotY = camRotY;
            this.#lastCamRotZ = camRotZ;
            this.#isDirty = false;

            this.#updateInstanceRenderBuffer(cameraPos, renderViewStateData);
        } else if (this.#terrain.gpuRenderInfo && this.#terrain.drawCommandSlot && this.#terrain.drawBufferManager) {
            this.#terrain.drawBufferManager.setInstanceNum(this.#terrain.drawCommandSlot, this.#currentInstanceCount);
        }
    }

    get tileSpanX(): number {
        return this.#terrain.worldSize[0] / this.atlasTileCountX;
    }

    get tileSpanZ(): number {
        return this.#terrain.worldSize[1] / this.atlasTileCountZ;
    }

    #updateLODRanges(currentWorldSize: number): boolean {
        if (
            !this.#quadtree ||
            this.#prevWorldSize !== currentWorldSize ||
            this.#prevMaxLOD !== this.#terrain.maxLOD ||
            this.#prevLodThreshold !== this.#lodThreshold
        ) {
            this.#quadtree = new TerrainQuadtree(currentWorldSize, this.#terrain.maxLOD);
            this.#prevWorldSize = currentWorldSize;
            this.#prevMaxLOD = this.#terrain.maxLOD;
            this.#prevLodThreshold = this.#lodThreshold;

            if (this.#spatialGrid) {
                this.#spatialGrid.cellSize = this.tileSpanX;
            }

            const lodRanges = this.#cachedLodRanges;
            const lodThreshold = this.lodThreshold;
            const morphConstant = 0.5;

            for (let i = 0; i <= this.#terrain.maxLOD; i++) {
                const worldScale = currentWorldSize / Math.pow(2, i);
                const morphEnd = worldScale * lodThreshold;
                const morphStart = morphEnd - (worldScale * morphConstant);

                lodRanges[i * 4 + 0] = morphStart * morphStart;
                lodRanges[i * 4 + 1] = morphEnd * morphEnd;
                lodRanges[i * 4 + 2] = 0;
                lodRanges[i * 4 + 3] = 0;
            }
            this.#terrain.lodRanges = lodRanges;
            return true;
        }
        return false;
    }

    #processTileStreaming(camera: any) {
        if (!this.#spatialGrid) return;

        const {toLoad, toUnload} = this.#spatialGrid.update(camera, this.#terrain.worldOffset, this.#terrain.worldSize);
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

    destroy() {
        if (this.#instanceBuffer) {
            this.#instanceBuffer.destroy();
            this.#instanceBuffer = null!;
        }
        if (this.#terrain && this.#terrain.heightmapAtlasTexture) {
            this.#terrain.heightmapAtlasTexture.destroy();
            this.#terrain.heightmapAtlasTexture = null;
        }
        if (this.#spatialGrid) {
            this.#spatialGrid.destroy();
        }
        if (this.#heightmapManager) {
            this.#heightmapManager.destroy();
        }
        if (this.#processor) {
            this.#processor.destroy();
            this.#processor = null;
        }
        this.#onTileLoadCallback = undefined;
        this.#onTileUnloadCallback = undefined;
        this.#tileUrlResolver = undefined;
        this.#instanceArrayBuffer = null!;
        this.#terrain = null!;
    }

    isTileSynthesized(tile: SpatialTileInfo | string): boolean {
        return this.#heightmapManager.isTileSynthesized(tile);
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

    #updateInstanceRenderBuffer(cameraPos: [number, number, number], renderViewStateData: any) {
        this.#quadtree.update(
            cameraPos,
            renderViewStateData.frustumPlanes,
            this.#terrain.minHeight,
            this.#terrain.maxHeight,
            this.#terrain.worldOffset[0],
            this.#terrain.worldOffset[1],
            this.#lodThreshold
        );

        const leafNodes = this.#quadtree.leafNodes;
        const count = Math.min(leafNodes.length, this.#maxInstances);
        this.#currentInstanceCount = count;

        if (count > 0) {
            const arrayBuffer = this.#instanceArrayBuffer;
            const worldOffsetX = this.#terrain.worldOffset[0];
            const worldOffsetZ = this.#terrain.worldOffset[1];

            for (let i = 0; i < count; i++) {
                const node = leafNodes[i];
                const halfScale = node.worldScale * 0.5;
                const centerX = node.worldOffset[0] + halfScale;
                const centerZ = node.worldOffset[1] + halfScale;

                arrayBuffer[i * 4 + 0] = worldOffsetX + centerX;
                arrayBuffer[i * 4 + 1] = worldOffsetZ + centerZ;
                arrayBuffer[i * 4 + 2] = node.worldScale;
                arrayBuffer[i * 4 + 3] = node.lodLevel;
            }
            this.#redGPUContext.gpuDevice.queue.writeBuffer(this.#instanceBuffer, 0, arrayBuffer as BufferSource, 0, count * 4);
        }

        if (this.#terrain.gpuRenderInfo && this.#terrain.drawCommandSlot && this.#terrain.drawBufferManager) {
            this.#terrain.drawBufferManager.setInstanceNum(this.#terrain.drawCommandSlot, count);
        }
    }

    #createHeightmapTileAtlas(tileCountX: number = 16, tileCountZ: number = 16, tileSize: number = 512) {
        const device = this.#redGPUContext.gpuDevice;

        const atlasWidth = tileCountX * tileSize;
        const atlasHeight = tileCountZ * tileSize;
        const gpuTexture = device.createTexture({
            label: 'Terrain_HeightmapTileAtlasGPUTexture',
            size: [atlasWidth, atlasHeight, 1],
            format: 'rgba16float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });

        this.#terrain.heightmapAtlasTexture = new DirectTexture(
            this.#redGPUContext,
            'Terrain_HeightmapTileAtlasDirectTexture',
            gpuTexture
        );
    }

    loadTileFrom16BitBuffer(tile: SpatialTileInfo, data: ArrayBuffer | ArrayBufferView, width: number, height: number) {
        this.#heightmapManager.registerTileData(tile, data, this.#spatialGrid);
        this.#updateTileHeightmapFromBuffer(tile, data, width, height);
    }

    #enrichTileInfo(tile: SpatialTileInfo) {
        tile.cellKey = `${tile.gridX}_${tile.gridZ}`;
        const [tbMinX, tbMinZ, tbMaxX, tbMaxZ] = tile.worldBounds;
        const tileCenterX = (tbMinX + tbMaxX) * 0.5;
        const tileCenterZ = (tbMinZ + tbMaxZ) * 0.5;

        const gridX = Math.max(0, Math.min(this.atlasTileCountX - 1, Math.floor((tileCenterX - this.#terrain.worldOffset[0]) / this.tileSpanX)));
        const gridZ = Math.max(0, Math.min(this.atlasTileCountZ - 1, Math.floor((tileCenterZ - this.#terrain.worldOffset[1]) / this.tileSpanZ)));

        tile.tileCol = gridX;
        tile.tileRow = (this.atlasTileCountZ - 1) - gridZ;
        tile.atlasKey = `${tile.tileCol}_${tile.tileRow}`;
        tile.tileColStr = String(tile.tileCol).padStart(2, '0');
        tile.tileRowStr = String(tile.tileRow).padStart(2, '0');
    }

    #updateTileHeightmapFromBuffer(tile: SpatialTileInfo, data: ArrayBuffer | ArrayBufferView, width: number, height: number) {
        const tileX = tile.tileCol ?? 0;
        const tileZ = tile.tileRow ?? 0;

        if (!this.#terrain.heightmapAtlasTexture) {
            this.#createHeightmapTileAtlas(this.atlasTileCountX, this.atlasTileCountZ, this.atlasTileSize);
        }
        const gpuTexture = this.#terrain.heightmapAtlasTexture?.gpuTexture;
        if (!gpuTexture) return;

        if (!this.#processor) {
            this.#processor = new TerrainHeightmapProcessor(this.#redGPUContext);
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

        this.#heightmapManager.markTileSynthesized(`${tileX}_${tileZ}`);
        this.markDirty();

        if (this.#onTileLoadCallback) {
            this.#onTileLoadCallback(tile);
        }

        if (this.#terrain.material) {
            const mat = this.#terrain.material as any;
            if (typeof mat.bakeRVTTile === 'function') {
                mat.bakeRVTTile(tileX, tileZ, this.atlasTileCountX, this.atlasTileCountZ);
            }
        }
    }

    #loadTileFromUrl(tile: SpatialTileInfo, url: string) {
        const key = ((tile.gridX + 32768) << 16) | ((tile.gridZ + 32768) & 0xFFFF);
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.arrayBuffer();
            })
            .then(async (buffer) => {
                if (!this.#spatialGrid.activeTiles.has(key)) {
                    return;
                }

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
    }
}

export default TerrainTileManager;
