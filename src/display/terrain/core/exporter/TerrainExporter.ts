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
        const imgData = imageData.data;

        if (format === 'rgba16float' || format === 'r16float') {
            const dataView = new DataView(copyArrayBuffer);
            const offsetMultiplier = format === 'rgba16float' ? 8 : 2;
            for (let y = 0; y < height; y++) {
                const srcRowOffset = y * paddedBytesPerRow;
                const dstRowOffset = y * width * 4;
                for (let x = 0; x < width; x++) {
                    const u16 = dataView.getUint16(srcRowOffset + x * offsetMultiplier, true);
                    const exp = (u16 & 0x7C00) >> 10;
                    const frac = u16 & 0x03FF;
                    const val = (exp === 0) ? (frac / 1024) * Math.pow(2, -14) : (1 + frac / 1024) * Math.pow(2, exp - 15);
                    const byteVal = Math.min(255, Math.max(0, Math.round(val * 255)));

                    const dstIdx = dstRowOffset + x * 4;
                    imgData[dstIdx + 0] = byteVal;
                    imgData[dstIdx + 1] = byteVal;
                    imgData[dstIdx + 2] = byteVal;
                    imgData[dstIdx + 3] = 255;
                }
            }
        } else {
            const data = new Uint8Array(copyArrayBuffer);
            for (let y = 0; y < height; y++) {
                const srcRowOffset = y * paddedBytesPerRow;
                const dstRowOffset = y * width * 4;
                for (let x = 0; x < width * 4; x++) {
                    imgData[dstRowOffset + x] = data[srcRowOffset + x];
                }
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
     * [KO] 2D CanvasContext에 현재 지형 타일 아틀라스 렌더링 현황을 프리뷰로 시각화합니다.
     */
    static renderAtlasPreview(
        ctx: CanvasRenderingContext2D,
        atlasTileCountX: number,
        atlasTileCountZ: number,
        tileDataCache: Map<string, ArrayBufferView | ArrayBuffer>,
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

        for (let x = 0; x < countX; x++) {
            for (let z = 0; z < countZ; z++) {
                const px = x * cellW;
                const py = z * cellH;

                ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
                ctx.fillRect(px, py, cellW, cellH);

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.strokeRect(px, py, cellW, cellH);

                const key = `${x}_${z}`;
                if (tileDataCache.has(key)) {
                    const data = tileDataCache.get(key);
                    if (data instanceof HTMLImageElement || data instanceof ImageBitmap) {
                        try {
                            ctx.drawImage(data as CanvasImageSource, px, py, cellW, cellH);
                        } catch (e) {
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
