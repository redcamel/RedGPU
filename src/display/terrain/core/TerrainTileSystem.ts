import RedGPUContext from "../../../context/RedGPUContext";
import TerrainMaterialBind from "./TerrainMaterialBind";
import {keepLog} from "../../../utils";
import defineTexture from "../../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../../defineProperty/funcs/texture/defineSampler";
import DirectTexture from "../../../resources/texture/DirectTexture";
import {SpatialTileInfo, TerrainSpatialGrid} from "./TerrainSpatialGrid";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager";
import defineVector2 from "../../../defineProperty/funcs/vector/defineVector2";
import {TerrainQuadtree} from "./TerrainQuadtree";
import defineNumber from "../../../defineProperty/funcs/number/defineNumber";
import updateTargetUniform from "../../../defineProperty/core/updateTargetUniform";


interface TerrainTileSystem {
    heightTexture: any;
    heightTextureSampler: any;

    worldOffset: [number, number];
    worldSize: [number, number];

    minHeight: number;
    maxHeight: number;

    maxLOD: number;
    gridSize: number;

    baseSlotIndex: number;
}

class TerrainTileSystem extends TerrainMaterialBind {
    //
    spatialGrid: TerrainSpatialGrid;
    quadtree: TerrainQuadtree;
    //
    #instanceBuffer: GPUBuffer;
    #synthesizedTilesSet: Set<string> = new Set();
    #tileImageCache: Map<string, any> = new Map();
    //
    #tileUrlResolver?: (tile: SpatialTileInfo) => string | void;
    #onTileUnloadCallback?: (tile: SpatialTileInfo) => void;
    //
    #prevWorldSize: number = 0;
    #prevMaxLOD: number = 0;
    //
    #lodRanges: Float32Array = new Float32Array(32);
    //
    #atlasTileCountX: number = 16;
    #atlasTileCountZ: number = 16;
    #atlasTileSize: number = 512;
    //
    #heightmapAtlasGPUTexture: GPUTexture | null = null;
    #heightmapAtlasDirectTexture: DirectTexture | null = null;
    //
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

    //
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

    get heightmapAtlasDirectTexture(): DirectTexture | null {
        return this.#heightmapAtlasDirectTexture;
    }

    get heightmapAtlasGPUTexture(): GPUTexture | null {
        return this.#heightmapAtlasGPUTexture;
    }

    /** [KO] 누적 타일 로드 카운트 [EN] Cumulative tile load count */
    get frameLoadCount(): number {
        return this.#frameLoadCount;
    }

    /** [KO] 누적 타일 언로드 카운트 [EN] Cumulative tile unload count */
    get frameUnloadCount(): number {
        return this.#frameUnloadCount;
    }

    /** [KO] 최근 1초간 초당 타일 로드 속도 (Loads/sec) [EN] Tile load rate for the last 1 second (Loads/sec) */
    get lastFrameLoadCount(): number {
        return this.#lastFrameLoadCount;
    }

    /** [KO] 최근 1초간 초당 타일 언로드 속도 (Unloads/sec) [EN] Tile unload rate for the last 1 second (Unloads/sec) */
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
        this.#heightmapAtlasGPUTexture = device.createTexture({
            label: 'Terrain_HeightmapTileAtlasGPUTexture',
            size: [atlasWidth, atlasHeight, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });

        this.#heightmapAtlasDirectTexture = new DirectTexture(
            this.redGPUContext,
            'Terrain_HeightmapTileAtlasDirectTexture',
            this.#heightmapAtlasGPUTexture
        );

        this.heightTexture = this.#heightmapAtlasDirectTexture as any;
    }

    markTileSynthesized(tile: SpatialTileInfo | string) {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        this.#synthesizedTilesSet.add(key);
    }

    isTileSynthesized(tile: SpatialTileInfo | string): boolean {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        return this.#synthesizedTilesSet.has(key);
    }

    clearSynthesizedTiles() {
        this.#synthesizedTilesSet.clear();
    }

    setTileUrlResolver(resolver: (tile: SpatialTileInfo) => string | void) {
        this.#tileUrlResolver = resolver;
    }

    setOnTileUnload(callback: (tile: SpatialTileInfo) => void) {
        this.#onTileUnloadCallback = callback;
    }

    registerTileImage(tile: SpatialTileInfo | string, image: any) {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        this.#tileImageCache.set(key, image);
    }

    /**
     * [KO] 등록된 타일 2D 이미지 자원을 가져옵니다.
     * [EN] Gets the registered tile 2D image resource.
     */
    getTileImage(tile: SpatialTileInfo | string): any {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        return this.#tileImageCache.get(key);
    }

    loadTileFromUrl(tile: SpatialTileInfo, url: string, format: GPUTextureFormat = 'rgba8unorm') {
        // 1. 💡 2D 미리보기용 이미지 비동기 로딩 & 엔진 내부 캐시 등록
        const img = new Image();
        img.src = url;
        img.onload = () => {
            this.registerTileImage(tile, img);
        };

        // 2. 💡 GPU Heightmap BitmapTexture 로딩 → Atlas 합성 자동화
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

        // 3. 💡 타일 스트리밍 로그
        console.log(`[Tile Streamer 📥] Load Cell(${tile.gridX}, ${tile.gridZ}) → Tile[${tile.tileColStr}, ${tile.tileRowStr}] (${url})`);
    }

    checkQuadtree(renderViewStateData: any) {
        const currentWorldSize = this.worldSize[0];
        if (!this.quadtree || this.#prevWorldSize !== currentWorldSize || this.#prevMaxLOD !== this.maxLOD) {
            this.quadtree = new TerrainQuadtree(currentWorldSize, this.maxLOD);
            this.#prevWorldSize = currentWorldSize;
            this.#prevMaxLOD = this.maxLOD;

            // LOD별 모핑 범위 계산 (vec4 8개 크기)
            const lodRanges = new Float32Array(32);
            const lodThreshold = 1.5; // TerrainQuadtree update 시 사용하는 임계값 배율
            const morphConstant = 0.5; // 자식 노드 크기 대비 모핑 구간 비율

            for (let i = 0; i <= this.maxLOD; i++) {
                const worldScale = currentWorldSize / Math.pow(2, i);

                // 분할 임계 거리 (Morph가 1.0으로 완전히 완료되어 부모 노드 정점과 1:1 일치하는 거리)
                const morphEnd = worldScale * lodThreshold;

                // 모핑이 시작되는 거리 (패치 크기의 0.5배 영역 동안 부드럽게 모핑 진행)
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

        // 스트리밍 옵션이 활성화된 경우 카메라 위치에 따라 동적 그리드 타일 갱신
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
                        // 💡 이미 GPU Atlas에 합성 완료된 타일은 콜백 호출 자체를 스킵
                        if (this.isTileSynthesized(tile)) return;
                        this.#frameLoadCount++;
                        const result = this.#tileUrlResolver!(tile);
                        // 💡 URL 문자열을 반환하면 자동으로 loadTileFromUrl 호출
                        if (typeof result === 'string') {
                            this.loadTileFromUrl(tile, result);
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
                // 💡 중요: Geometry가 중앙 정렬(-0.5 ~ 0.5)로 변경되었으므로,
                // 노드의 렌더링 원점을 좌상단(offset)이 아닌 노드의 '중앙(Center)'으로 맞춥니다.
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

        if (!this.heightmapAtlasGPUTexture) {
            this.createHeightmapTileAtlas(16, 16, 512);
        }
        if (!sourceTexture || !sourceTexture.gpuTexture) return;


        const destX = tileX * this.atlasTileSize;
        const destZ = tileZ * this.atlasTileSize;

        const atlasWidth = this.atlasTileCountX * this.atlasTileSize;
        const atlasHeight = this.atlasTileCountZ * this.atlasTileSize;

        const srcW = Math.min(this.atlasTileSize, sourceTexture.gpuTexture.width);
        const srcH = Math.min(this.atlasTileSize, sourceTexture.gpuTexture.height);

        this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
            // 1. 주 타일 픽셀 영역 복사
            encoder.copyTextureToTexture(
                {texture: sourceTexture.gpuTexture},
                {texture: this.heightmapAtlasGPUTexture, origin: [destX, destZ, 0]},
                [srcW, srcH, 1]
            );

            // 2. 💡 타일 해상도가 512px보다 작을 경우 (예: 449px 엣지 타일) 여백 픽셀에 엣지 색상 패딩 복사
            const padW = this.atlasTileSize - srcW;
            const padH = this.atlasTileSize - srcH;

            if (padW > 0) {
                for (let p = 0; p < padW; p++) {
                    encoder.copyTextureToTexture(
                        {texture: sourceTexture.gpuTexture, origin: [srcW - 1, 0, 0]},
                        {texture: this.heightmapAtlasGPUTexture, origin: [destX + srcW + p, destZ, 0]},
                        [1, srcH, 1]
                    );
                }
            }
            if (padH > 0) {
                for (let p = 0; p < padH; p++) {
                    encoder.copyTextureToTexture(
                        {texture: sourceTexture.gpuTexture, origin: [0, srcH - 1, 0]},
                        {texture: this.heightmapAtlasGPUTexture, origin: [destX, destZ + srcH + p, 0]},
                        [srcW, 1, 1]
                    );
                }
            }

            // 3. 💡 언리얼 엔진 5 스타일 Tile Edge Stitching Pass (이웃 타일 접합선 1px 오버랩 스티칭)
            if (destX + this.atlasTileSize < atlasWidth) {
                encoder.copyTextureToTexture(
                    {texture: sourceTexture.gpuTexture, origin: [srcW - 1, 0, 0]},
                    {texture: this.heightmapAtlasGPUTexture, origin: [destX + this.atlasTileSize, destZ, 0]},
                    [1, srcH, 1]
                );
            }
            if (destZ + this.atlasTileSize < atlasHeight) {
                encoder.copyTextureToTexture(
                    {texture: sourceTexture.gpuTexture, origin: [0, srcH - 1, 0]},
                    {texture: this.heightmapAtlasGPUTexture, origin: [destX, destZ + this.atlasTileSize, 0]},
                    [srcW, 1, 1]
                );
            }
        });

        this.markTileSynthesized(`${tileX}_${tileZ}`);

        // 💡 GPU Atlas 복사 완료 즉시 중간 BitmapTexture(CPU 디코딩 버퍼) 파기 → VRAM/RAM 즉시 반환
        if (sourceTexture && typeof sourceTexture.destroy === 'function') {
            sourceTexture.destroy();
        }

        // 3. 💡 높이맵 타일이 갱신되는 즉시 RVT (Runtime Virtual Texture) 베이커를 가동하여 표면 텍스처 재베이킹!
        if (this.material && typeof (this.material as any).bakeRVT === 'function') {
            (this.material as any).bakeRVT();
        }
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

    /**
     * [KO] GPU Heightmap Tile Atlas 텍스처를 PNG 이미지 파일로 다운로드합니다.
     * [EN] Downloads the GPU Heightmap Tile Atlas texture as a PNG image file.
     */
    async downloadHeightmapAtlasAsPNG(fileName: string = 'Terrain_HeightmapTileAtlasGPUTexture.png') {
        const gpuTexture = this.heightmapAtlasGPUTexture;
        if (!gpuTexture) {
            console.warn('downloadHeightmapAtlasAsPNG: heightmapAtlasGPUTexture가 생성되지 않았습니다.');
            return;
        }

        const device = this.redGPUContext.gpuDevice;
        const width = gpuTexture.width;
        const height = gpuTexture.height;

        const bytesPerPixel = 4; // rgba8unorm
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
    {key: "heightTexture"}
]);
defineSampler(TerrainTileSystem, [
    {key: "heightTextureSampler"}
]);
Object.freeze(TerrainTileSystem);
export default TerrainTileSystem;