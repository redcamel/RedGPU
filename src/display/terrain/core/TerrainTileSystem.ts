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

interface TerrainTileSystem {
    heightmapAtlasTexture: DirectTexture | BitmapTexture | null;

    worldOffset: [number, number];
    worldSize: [number, number];

    minHeight: number;
    maxHeight: number;

    maxLOD: number;
    gridSize: number;

    baseSlotIndex: number;
}

class TerrainTileSystem extends TerrainMaterialBind {
    spatialGrid: TerrainSpatialGrid;
    quadtree: TerrainQuadtree;
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
    #heightmapAtlasDirectTexture: DirectTexture | null = null;
    #frameLoadCount: number = 0;
    #frameUnloadCount: number = 0;
    #lastFrameLoadCount: number = 0;
    #lastFrameUnloadCount: number = 0;
    #lastMetricsResetTime: number = typeof performance !== 'undefined' ? performance.now() : Date.now();

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.spatialGrid = new TerrainSpatialGrid(256, 2560);
        this.minHeight = 0;
        this.maxHeight = 0.5;
        this.worldOffset = [-0.5, -0.5];
        this.worldSize = [1, 1];
        this.maxLOD = 4;
        this.baseSlotIndex = 0;

        this.gridSize = 64;
        const maxInstances = 4096;
        this.#instanceBuffer = redGPUContext.gpuDevice.createBuffer({
            size: maxInstances * 16,
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

    get atlasTileCountX(): number {
        return this.#atlasTileCountX;
    }

    set atlasTileCountX(value: number) {
        this.#atlasTileCountX = value;
    }

    get atlasTileCountZ(): number {
        return this.#atlasTileCountZ;
    }

    set atlasTileCountZ(value: number) {
        this.#atlasTileCountZ = value;
    }

    get atlasTileSize(): number {
        return this.#atlasTileSize;
    }

    set atlasTileSize(value: number) {
        this.#atlasTileSize = value;
    }

    get lastFrameLoadCount(): number {
        return this.#lastFrameLoadCount;
    }

    get lastFrameUnloadCount(): number {
        return this.#lastFrameUnloadCount;
    }

    get synthesizedTileCount(): number {
        return this.#synthesizedTilesSet.size;
    }

    createHeightmapTileAtlas(tileCountX: number = 16, tileCountZ: number = 16, tileSize: number = 512) {
        const device = this.redGPUContext.gpuDevice;
        this.atlasTileCountX = tileCountX;
        this.atlasTileCountZ = tileCountZ;
        this.atlasTileSize = tileSize;

        const atlasWidth = tileCountX * tileSize;
        const atlasHeight = tileCountZ * tileSize;
        keepLog('Terrain_HeightmapTileAtlasGPUTexture', atlasWidth, atlasHeight)
        const gpuTexture = device.createTexture({
            label: 'Terrain_HeightmapTileAtlasGPUTexture',
            size: [atlasWidth, atlasHeight, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });

        this.#heightmapAtlasDirectTexture = new DirectTexture(
            this.redGPUContext,
            'Terrain_HeightmapTileAtlasDirectTexture',
            gpuTexture
        );

        this.heightmapAtlasTexture = this.#heightmapAtlasDirectTexture;
    }

    checkQuadtree(renderViewStateData: any) {
        const currentWorldSize = this.worldSize[0];
        if (!this.quadtree || this.#prevWorldSize !== currentWorldSize || this.#prevMaxLOD !== this.maxLOD) {
            this.quadtree = new TerrainQuadtree(currentWorldSize, this.maxLOD);
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

        if (this.spatialGrid) {
            const minX = this.worldOffset[0];
            const minZ = this.worldOffset[1];
            const maxX = minX + this.worldSize[0];
            const maxZ = minZ + this.worldSize[1];
            this.spatialGrid.setTerrainBounds(minX, minZ, maxX, maxZ);

            const camFwd = camera.cameraVector ? camera.cameraVector.forward : undefined;
            const camDir: [number, number, number] | undefined = camFwd ? [camFwd[0], camFwd[1], camFwd[2]] : undefined;

            const {toLoad, toUnload} = this.spatialGrid.update([camera.x, camera.y, camera.z], camDir);

            const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
            if (now - this.#lastMetricsResetTime >= 1000) {
                this.#lastFrameLoadCount = this.#frameLoadCount;
                this.#lastFrameUnloadCount = this.#frameUnloadCount;
                this.#frameLoadCount = 0;
                this.#frameUnloadCount = 0;
                this.#lastMetricsResetTime = now;
            }

            const enrichTileInfo = (tile: SpatialTileInfo) => {
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
            };

            if (toLoad.length > 0) {
                if (this.#tileUrlResolver) {
                    toLoad.forEach(tile => {
                        enrichTileInfo(tile);
                        if (this.isTileSynthesized(tile)) return;
                        this.#frameLoadCount++;
                        const result = this.#tileUrlResolver!(tile);
                        if (typeof result === 'string') {
                            this.#loadTileFromUrl(tile, result);
                        }
                    });
                }
            }
            if (toUnload.length > 0) {
                this.#frameUnloadCount += toUnload.length;
                toUnload.forEach(tile => {
                    enrichTileInfo(tile);
                    if (this.#onTileUnloadCallback) {
                        this.#onTileUnloadCallback!(tile);
                    }
                });
            }
        }

        const planes = renderViewStateData.frustumPlanes;

        this.quadtree.update(
            cameraPos,
            planes,
            this.minHeight,
            this.maxHeight,
            this.worldOffset[0],
            this.worldOffset[1],
            1.5
        );

        const leafNodes = this.quadtree.leafNodes;
        const count = leafNodes.length;

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

    updateTileHeightmap(tileOrCol: SpatialTileInfo | number, tileRowOrTexture?: number | BitmapTexture, srcTexture?: BitmapTexture) {
        let tileX: number;
        let tileZ: number;
        let sourceTexture: BitmapTexture;

        if (typeof tileOrCol === 'object' && tileOrCol !== null) {
            const tile = tileOrCol as SpatialTileInfo;
            tileX = tile.tileCol ?? 0;
            tileZ = tile.tileRow ?? 0;
            sourceTexture = tileRowOrTexture as BitmapTexture;
        } else {
            tileX = tileOrCol as number;
            tileZ = tileRowOrTexture as number;
            sourceTexture = srcTexture as BitmapTexture;
        }

        if (!this.heightmapAtlasTexture) {
            this.createHeightmapTileAtlas(16, 16, 512);
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

    async downloadHeightmapAtlasAsPNG(fileName: string = 'Terrain_HeightmapTileAtlasGPUTexture.png') {
        const gpuTexture = this.heightmapAtlasTexture?.gpuTexture;
        if (!gpuTexture) {
            console.warn('downloadHeightmapAtlasAsPNG: heightmapAtlasTexture가 생성되지 않았습니다.');
            return;
        }

        const device = this.redGPUContext.gpuDevice;
        const width = gpuTexture.width;
        const height = gpuTexture.height;

        const bytesPerPixel = 4;
        const unpaddedBytesPerRow = width * bytesPerPixel;
        const align = 256;
        const paddedBytesPerRow = Math.ceil(unpaddedBytesPerRow / align) * align;
        const bufferSize = paddedBytesPerRow * height;

        const readBuffer = device.createBuffer({
            label: 'Terrain_DownloadAtlasReadBuffer',
            size: bufferSize,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        const commandEncoder = device.createCommandEncoder({
            label: 'Terrain_DownloadAtlasEncoder'
        });

        commandEncoder.copyTextureToBuffer(
            {texture: gpuTexture},
            {
                buffer: readBuffer,
                bytesPerRow: paddedBytesPerRow,
                rowsPerImage: height
            },
            [width, height, 1]
        );

        device.queue.submit([commandEncoder.finish()]);

        await readBuffer.mapAsync(GPUMapMode.READ);
        const copyArrayBuffer = readBuffer.getMappedRange();
        const data = new Uint8Array(copyArrayBuffer);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.createImageData(width, height);
        const imgData = imageData.data;

        for (let y = 0; y < height; y++) {
            const srcRowOffset = y * paddedBytesPerRow;
            const dstRowOffset = y * width * 4;
            for (let x = 0; x < width * 4; x++) {
                imgData[dstRowOffset + x] = data[srcRowOffset + x];
            }
        }

        ctx.putImageData(imageData, 0, 0);
        readBuffer.unmap();
        readBuffer.destroy();

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    #markTileSynthesized(tile: SpatialTileInfo | string) {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        this.#synthesizedTilesSet.add(key);
    }

    #registerTileImage(tile: SpatialTileInfo | string, image: any) {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        this.#tileImageCache.set(key, image);
    }

    renderAtlasPreview(ctx: CanvasRenderingContext2D, width: number = 512, height: number = 512) {
        if (!ctx) return;
        const curDpr = window.devicePixelRatio || 1;
        ctx.setTransform(curDpr, 0, 0, curDpr, 0, 0);
        ctx.imageSmoothingEnabled = false;

        const countX = this.atlasTileCountX;
        const countZ = this.atlasTileCountZ;
        const cellW = width / countX;
        const cellH = height / countZ;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        for (let x = 0; x < countX; x++) {
            for (let z = 0; z < countZ; z++) {
                const px = x * cellW;
                const py = z * cellH;

                ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
                ctx.fillRect(px, py, cellW, cellH);

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.strokeRect(px, py, cellW, cellH);

                const key = `${x}_${z}`;
                if (this.#tileImageCache.has(key)) {
                    const img = this.#tileImageCache.get(key);
                    try {
                        ctx.drawImage(img, px, py, cellW, cellH);
                    } catch (e) {
                    }
                }
            }
        }
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
                this.updateTileHeightmap(tile, tex);
            },
            null,
            format
        );

        console.log(`[Tile Streamer 📥] Load Cell(${tile.gridX}, ${tile.gridZ}) → Tile[${tile.tileColStr}, ${tile.tileRowStr}] (${url})`);
    }

    destroy() {
        if (this.#instanceBuffer) {
            this.#instanceBuffer.destroy();
            this.#instanceBuffer = null;
        }
        super.destroy();
    }
}
defineNumber(TerrainTileSystem, [
    {key: "maxLOD", value: 4},
    {key: "baseSlotIndex", value: 0},
    {key: "minHeight", value: 0},
    {key: "maxHeight", value: 1},
    {key: "gridSize", value: 64}

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