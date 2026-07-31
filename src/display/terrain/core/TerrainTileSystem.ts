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

        const maxInstances = 65536; // 65,536 인스턴스 (65,536 * 16 bytes = 1MB VRAM) - 32K 대형 지형 및 고해상도 LOD 대비
        this.#maxInstances = maxInstances;
        this.#instanceBuffer = redGPUContext.gpuDevice.createBuffer({
            size: maxInstances * 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: 'TerrainInstanceBuffer'
        });

    }
    #computePipeline: GPUComputePipeline | null = null;

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
            format: 'r16float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });

        this.heightmapAtlasTexture = new DirectTexture(
            this.redGPUContext,
            'Terrain_HeightmapTileAtlasDirectTexture',
            gpuTexture
        );
    }
    #computeBindGroupLayout: GPUBindGroupLayout | null = null;

    get tileDataCache(): Map<string, ArrayBufferView | ArrayBuffer> {
        return this.#tileDataCache;
    }

    loadTileFrom16BitBuffer(tile: SpatialTileInfo, data: ArrayBuffer | Uint16Array | Float32Array, width: number, height: number, format: GPUTextureFormat = 'r16float') {
        this.#registerTileData(tile, data);
        this.#updateTileHeightmapFromBuffer(tile, data, width, height, format);
        console.log(`[Tile Streamer 📥] Load 16-bit Buffer Cell(${tile.gridX}, ${tile.gridZ}) → Tile[${tile.tileColStr}, ${tile.tileRowStr}]`);
    }

    #initComputePipeline() {
        if (this.#computePipeline) return;
        const device = this.redGPUContext.gpuDevice;

        const wgslCode = `
            @group(0) @binding(0) var<storage, read> raw16Buffer: array<u32>;
            @group(0) @binding(1) var<storage, read_write> outputBuffer: array<u32>;

            struct TileUniforms {
                width: u32,
                height: u32,
            };
            @group(0) @binding(2) var<uniform> uniforms: TileUniforms;

            @compute @workgroup_size(16, 16)
            fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
                let x = global_id.x;
                let z = global_id.y;

                if (x >= uniforms.width || z >= uniforms.height) {
                    return;
                }

                let pixelIndex = z * uniforms.width + x;

                // raw16Buffer contains Uint16 stored as Uint32 per pixel (0 ~ 65535)
                let raw16 = raw16Buffer[pixelIndex];
                let normalizedHeight = f32(raw16) / 65535.0;

                // pack2x16float is WebGPU Built-in: packs 2x float32 into 2x float16 (32-bit uint)
                let packedF16Pair = pack2x16float(vec2<f32>(normalizedHeight, 0.0));

                let outU32Index = pixelIndex / 2u;
                let isOdd = pixelIndex % 2u;

                let f16Bits = packedF16Pair & 0xFFFFu;

                if (isOdd == 0u) {
                    outputBuffer[outU32Index] = (outputBuffer[outU32Index] & 0xFFFF0000u) | f16Bits;
                } else {
                    outputBuffer[outU32Index] = (outputBuffer[outU32Index] & 0x0000FFFFu) | (f16Bits << 16u);
                }
            }
        `;

        const shaderModule = device.createShaderModule({
            label: 'TerrainTile_16bitComputeShader',
            code: wgslCode
        });

        this.#computeBindGroupLayout = device.createBindGroupLayout({
            label: 'TerrainTile_ComputeBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        this.#computePipeline = device.createComputePipeline({
            label: 'TerrainTile_16bitComputePipeline',
            layout: device.createPipelineLayout({bindGroupLayouts: [this.#computeBindGroupLayout]}),
            compute: {module: shaderModule, entryPoint: 'main'}
        });
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

    #updateTileHeightmapFromBuffer(tile: SpatialTileInfo, data: ArrayBuffer | Uint16Array | Float32Array, width: number, height: number, format: GPUTextureFormat = 'r16float') {
        const tileX = tile.tileCol ?? 0;
        const tileZ = tile.tileRow ?? 0;

        if (!this.heightmapAtlasTexture) {
            this.#createHeightmapTileAtlas(16, 16, 512);
        }
        const gpuTexture = this.heightmapAtlasTexture?.gpuTexture;
        if (!gpuTexture) return;

        const device = this.redGPUContext.gpuDevice;
        this.#initComputePipeline();

        const destX = tileX * this.atlasTileSize;
        const destZ = tileZ * this.atlasTileSize;

        const pixelCount = width * height;
        const u32InputBuffer = new Uint32Array(pixelCount);

        if (data instanceof Uint16Array) {
            for (let i = 0; i < pixelCount; i++) {
                u32InputBuffer[i] = data[i];
            }
        } else if (data instanceof Float32Array) {
            for (let i = 0; i < pixelCount; i++) {
                u32InputBuffer[i] = Math.floor(Math.max(0, Math.min(1, data[i])) * 65535);
            }
        } else {
            const raw16 = new Uint16Array(data);
            for (let i = 0; i < pixelCount; i++) {
                u32InputBuffer[i] = raw16[i] || 0;
            }
        }

        const inputStorageBuffer = device.createBuffer({
            label: 'TerrainTile_RawStorageBuffer',
            size: pixelCount * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(inputStorageBuffer, 0, u32InputBuffer);

        const outputStorageBuffer = device.createBuffer({
            label: 'TerrainTile_OutputStorageBuffer',
            size: pixelCount * 2,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });

        const uniformsArray = new Uint32Array([width, height]);
        const uniformBuffer = device.createBuffer({
            label: 'TerrainTile_UniformBuffer',
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(uniformBuffer, 0, uniformsArray);

        const bindGroup = device.createBindGroup({
            label: 'TerrainTile_ComputeBindGroup',
            layout: this.#computeBindGroupLayout!,
            entries: [
                {binding: 0, resource: {buffer: inputStorageBuffer}},
                {binding: 1, resource: {buffer: outputStorageBuffer}},
                {binding: 2, resource: {buffer: uniformBuffer}}
            ]
        });

        this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
            const pass = encoder.beginComputePass({label: 'TerrainTile_ComputePass'});
            pass.setPipeline(this.#computePipeline!);
            pass.setBindGroup(0, bindGroup);
            pass.dispatchWorkgroups(Math.ceil(width / 16), Math.ceil(height / 16));
            pass.end();

            const bytesPerRow = width * 2;
            encoder.copyBufferToTexture(
                {
                    buffer: outputStorageBuffer,
                    bytesPerRow: bytesPerRow,
                    rowsPerImage: height
                },
                {
                    texture: gpuTexture,
                    origin: [destX, destZ, 0]
                },
                [Math.min(width, this.atlasTileSize), Math.min(height, this.atlasTileSize), 1]
            );
        });

        this.#markTileSynthesized(`${tileX}_${tileZ}`);

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

    async #parse16BitPngBuffer(buffer: ArrayBuffer): Promise<Uint16Array | null> {
        try {
            const view = new DataView(buffer);
            if (view.getUint32(0) !== 0x89504E47 || view.getUint32(4) !== 0x0D0A1A0A) {
                return null;
            }
            let offset = 8;
            let width = 0;
            let height = 0;
            let bitDepth = 0;
            let colorType = 0;
            const idatChunks: Uint8Array[] = [];

            while (offset < buffer.byteLength) {
                const length = view.getUint32(offset);
                const type = view.getUint32(offset + 4);
                if (type === 0x49484452) { // IHDR
                    width = view.getUint32(offset + 8);
                    height = view.getUint32(offset + 12);
                    bitDepth = view.getUint8(offset + 16);
                    colorType = view.getUint8(offset + 17);
                } else if (type === 0x49444154) { // IDAT
                    idatChunks.push(new Uint8Array(buffer, offset + 8, length));
                } else if (type === 0x49454E44) { // IEND
                    break;
                }
                offset += 12 + length;
            }

            if (bitDepth !== 16 || idatChunks.length === 0) {
                return null;
            }

            let totalIdatLength = 0;
            for (const chunk of idatChunks) totalIdatLength += chunk.length;
            const combinedIdat = new Uint8Array(totalIdatLength);
            let currentOffset = 0;
            for (const chunk of idatChunks) {
                combinedIdat.set(chunk, currentOffset);
                currentOffset += chunk.length;
            }

            let decompressedData: Uint8Array;
            if (typeof DecompressionStream !== 'undefined') {
                try {
                    const ds = new DecompressionStream('deflate');
                    const writer = ds.writable.getWriter();
                    writer.write(combinedIdat);
                    writer.close();
                    const response = new Response(ds.readable);
                    const decompressedBuffer = await response.arrayBuffer();
                    decompressedData = new Uint8Array(decompressedBuffer);
                } catch (zlibErr) {
                    const dsRaw = new DecompressionStream('deflate-raw');
                    const rawData = (combinedIdat.length > 2 && (combinedIdat[0] & 0x0F) === 8)
                        ? combinedIdat.subarray(2, combinedIdat.length - 4)
                        : combinedIdat;
                    const writer = dsRaw.writable.getWriter();
                    writer.write(rawData);
                    writer.close();
                    const response = new Response(dsRaw.readable);
                    const decompressedBuffer = await response.arrayBuffer();
                    decompressedData = new Uint8Array(decompressedBuffer);
                }
            } else {
                return null;
            }

            const channels = (colorType === 0) ? 1 : (colorType === 2) ? 3 : (colorType === 4) ? 2 : (colorType === 6) ? 4 : 1;
            const bytesPerPixel = channels * 2;
            const stride = 1 + width * bytesPerPixel;
            const outPixels = new Uint16Array(width * height);

            let prevRow = new Uint8Array(width * bytesPerPixel);

            for (let y = 0; y < height; y++) {
                const rowStart = y * stride;
                const filterType = decompressedData[rowStart];
                const rowData = decompressedData.subarray(rowStart + 1, rowStart + stride);
                const unfilteredRow = new Uint8Array(width * bytesPerPixel);

                for (let i = 0; i < rowData.length; i++) {
                    const x = rowData[i];
                    const a = i >= bytesPerPixel ? unfilteredRow[i - bytesPerPixel] : 0;
                    const b = prevRow[i];
                    const c = i >= bytesPerPixel ? prevRow[i - bytesPerPixel] : 0;

                    let reconstructed = 0;
                    if (filterType === 0) { // None
                        reconstructed = x;
                    } else if (filterType === 1) { // Sub
                        reconstructed = (x + a);
                    } else if (filterType === 2) { // Up
                        reconstructed = (x + b);
                    } else if (filterType === 3) { // Average
                        reconstructed = (x + Math.floor((a + b) / 2));
                    } else if (filterType === 4) { // Paeth
                        const p = a + b - c;
                        const pa = Math.abs(p - a);
                        const pb = Math.abs(p - b);
                        const pc = Math.abs(p - c);
                        let pr = c;
                        if (pa <= pb && pa <= pc) pr = a;
                        else if (pb <= pc) pr = b;
                        reconstructed = (x + pr);
                    }
                    unfilteredRow[i] = reconstructed & 0xFF;
                }

                prevRow = unfilteredRow;

                // Extract 16-bit values and normalize/pack to 16-bit format
                for (let x = 0; x < width; x++) {
                    const sampleIdx = x * bytesPerPixel;
                    const highByte = unfilteredRow[sampleIdx];
                    const lowByte = unfilteredRow[sampleIdx + 1];
                    // PNG 16-bit is Big-Endian: (highByte << 8) | lowByte
                    const valUint16 = (highByte << 8) | lowByte;
                    outPixels[y * width + x] = valUint16;
                }
            }

            return outPixels;
        } catch (e) {
            console.warn('[Tile Streamer ⚠️] Native 16-bit PNG decoding fallback:', e);
            return null;
        }
    }

    #loadTileFromUrl(tile: SpatialTileInfo, url: string, format: GPUTextureFormat = 'r16float') {
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.arrayBuffer();
            })
            .then(async (buffer) => {
                const parsed16Bit = await this.#parse16BitPngBuffer(buffer);
                if (parsed16Bit) {
                    this.loadTileFrom16BitBuffer(tile, parsed16Bit, this.atlasTileSize, this.atlasTileSize, format);
                } else {
                    this.loadTileFrom16BitBuffer(tile, buffer, this.atlasTileSize, this.atlasTileSize, format);
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