import RedGPUContext from "../../../../context/RedGPUContext";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";

export default class TerrainExporter {
    /**
     * [KO] Heightmap Atlas GPU Texture를 PNG 이미지 파일로 다운로드합니다.
     */
    static async downloadHeightmapAtlasAsPNG(
        redGPUContext: RedGPUContext,
        heightmapAtlasTexture: DirectTexture | BitmapTexture | null,
        fileName: string = 'Terrain_HeightmapTileAtlasGPUTexture.png'
    ): Promise<void> {
        const gpuTexture = heightmapAtlasTexture?.gpuTexture;
        if (!gpuTexture) {
            console.warn('[TerrainExporter] downloadHeightmapAtlasAsPNG: heightmapAtlasTexture가 생성되지 않았습니다.');
            return;
        }

        const device = redGPUContext.gpuDevice;
        const width = gpuTexture.width;
        const height = gpuTexture.height;

        const format = gpuTexture.format;
        const bytesPerPixel = format === 'rgba16float' ? 8 : (format === 'r16float' ? 2 : 4);
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

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.createImageData(width, height);
        const imgData32 = new Uint32Array(imageData.data.buffer);

        if (format === 'rgba16float' || format === 'r16float') {
            const dataView = new DataView(copyArrayBuffer);
            const offsetMultiplier = format === 'rgba16float' ? 8 : 2;
            for (let y = 0; y < height; y++) {
                const srcRowOffset = y * paddedBytesPerRow;
                const dstRowIdx = y * width;
                for (let x = 0; x < width; x++) {
                    const u16 = dataView.getUint16(srcRowOffset + x * offsetMultiplier, true);
                    const exp = (u16 & 0x7C00) >> 10;
                    const frac = u16 & 0x03FF;
                    const val = (exp === 0) ? (frac / 1024) * Math.pow(2, -14) : (1 + frac / 1024) * Math.pow(2, exp - 15);
                    const byteVal = Math.min(255, Math.max(0, Math.round(val * 255)));

                    // ABGR Little-Endian 32-bit direct packing (4 byte writes -> 1 32-bit write)
                    imgData32[dstRowIdx + x] = 0xFF000000 | (byteVal << 16) | (byteVal << 8) | byteVal;
                }
            }
        } else {
            const srcData = new Uint8Array(copyArrayBuffer);
            const dstData = new Uint8Array(imageData.data.buffer);
            const rowBytes = width * 4;
            for (let y = 0; y < height; y++) {
                const srcRowOffset = y * paddedBytesPerRow;
                const dstRowOffset = y * rowBytes;
                dstData.set(srcData.subarray(srcRowOffset, srcRowOffset + rowBytes), dstRowOffset);
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

    /**
     * [KO] 2D CanvasContext에 현재 지형 타일 아틀라스 렌더링 현황을 실제 지형 이미지 프리뷰로 시각화합니다.
     */
    static renderAtlasPreview(
        ctx: CanvasRenderingContext2D,
        atlasTileCountX: number,
        atlasTileCountZ: number,
        tileDataCache: Map<any, any>,
        width: number = 512,
        height: number = 512
    ): void {
        if (!ctx) return;
        const curDpr = window.devicePixelRatio || 1;
        ctx.setTransform(curDpr, 0, 0, curDpr, 0, 0);
        ctx.imageSmoothingEnabled = false;

        const countX = atlasTileCountX;
        const countZ = atlasTileCountZ;
        const cellW = width / countX;
        const cellH = height / countZ;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        let tileCanvas: HTMLCanvasElement | null = null;
        let tileCtx: CanvasRenderingContext2D | null = null;

        for (let x = 0; x < countX; x++) {
            for (let z = 0; z < countZ; z++) {
                const px = x * cellW;
                const py = z * cellH;

                ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
                ctx.fillRect(px, py, cellW, cellH);

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.strokeRect(px, py, cellW, cellH);

                const intKey = ((x + 32768) << 16) | ((z + 32768) & 0xFFFF);
                const strKey = `${x}_${z}`;
                const data = tileDataCache.get(intKey) || tileDataCache.get(strKey);

                if (data) {
                    if (data instanceof HTMLImageElement || data instanceof ImageBitmap || data instanceof HTMLCanvasElement) {
                        try {
                            ctx.drawImage(data as CanvasImageSource, px, py, cellW, cellH);
                        } catch (e) {
                        }
                    } else if (ArrayBuffer.isView(data)) {
                        try {
                            const u16 = data as Uint16Array;
                            const tileSize = Math.sqrt(u16.length) | 0;
                            if (tileSize > 0) {
                                if (!tileCanvas) {
                                    tileCanvas = document.createElement('canvas');
                                    tileCanvas.width = tileSize;
                                    tileCanvas.height = tileSize;
                                    tileCtx = tileCanvas.getContext('2d');
                                } else if (tileCanvas.width !== tileSize) {
                                    tileCanvas.width = tileSize;
                                    tileCanvas.height = tileSize;
                                }

                                if (tileCtx) {
                                    const imgData = tileCtx.createImageData(tileSize, tileSize);
                                    const buf32 = new Uint32Array(imgData.data.buffer);
                                    const len = u16.length;
                                    for (let i = 0; i < len; i++) {
                                        const v = (u16[i] >> 8) & 0xFF;
                                        buf32[i] = 0xFF000000 | (v << 16) | (v << 8) | v;
                                    }
                                    tileCtx.putImageData(imgData, 0, 0);
                                    ctx.drawImage(tileCanvas, px, py, cellW, cellH);
                                }
                            }
                        } catch (e) {
                            ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
                            ctx.fillRect(px + 2, py + 2, cellW - 4, cellH - 4);
                        }
                    } else {
                        ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
                        ctx.fillRect(px + 2, py + 2, cellW - 4, cellH - 4);
                    }
                }
            }
        }
    }
}
