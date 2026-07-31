import RedGPUContext from "../../../../context/RedGPUContext";

/**
 * [KO] 이미지 파싱 결과 데이터 정보 타입입니다.
 * [EN] Image parsing result data info type.
 */
export interface ParsedImageData {
    /** [KO] 픽셀 데이터 [EN] Pixel data */
    pixels: Uint16Array | Float32Array | Uint8Array | Uint8ClampedArray;
    /** [KO] 이미지 가로 크기 [EN] Image width */
    width: number;
    /** [KO] 이미지 세로 크기 [EN] Image height */
    height: number;
}

/**
 * [KO] ArrayBuffer 형태의 16비트 PNG 데이터를 원본 알고리즘과 100% 완전히 동일하게 파싱하여 Uint16Array 픽셀 데이터를 추출합니다.
 * [EN] Parses 16-bit PNG data from ArrayBuffer 100% identically to the original algorithm and extracts Uint16Array pixel data.
 *
 * @param buffer - [KO] PNG 바이너리 ArrayBuffer [EN] PNG binary ArrayBuffer
 * @param flipY - [KO] Y축 반전 여부 (기본값: false) [EN] Whether to flip Y-axis (Default: false)
 * @returns [KO] 디코딩된 픽셀 정보 객체 또는 실패 시 null [EN] Decoded pixel info object or null on failure
 * @category Texture
 */
export async function parse16BitPngBuffer(buffer: ArrayBuffer, flipY: boolean = false): Promise<ParsedImageData | null> {
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

        if (bitDepth !== 16 || idatChunks.length === 0 || width === 0 || height === 0) {
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

        // ★ 원본 TerrainTileSystem.ts의 #parse16BitPngBuffer 알고리즘 1:1 100% 정밀 복원
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
            const targetY = flipY ? (height - 1 - y) : y;
            const rowOffset = targetY * width;
            for (let x = 0; x < width; x++) {
                const sampleIdx = x * bytesPerPixel;
                const highByte = unfilteredRow[sampleIdx];
                const lowByte = unfilteredRow[sampleIdx + 1];
                // PNG 16-bit is Big-Endian: (highByte << 8) | lowByte
                outPixels[rowOffset + x] = (highByte << 8) | lowByte;
            }
        }

        return {pixels: outPixels, width, height};
    } catch (e) {
        console.warn('[parse16BitPngBuffer ⚠️] 16-bit PNG decoding failed:', e);
        return null;
    }
}


export async function parse16BitPngBufferToGPUTexture(
    redGPUContext: RedGPUContext,
    buffer: ArrayBuffer,
    format: GPUTextureFormat = 'rgba16float',
    flipY: boolean = false
): Promise<{ gpuTexture: GPUTexture, width: number, height: number } | null> {
    const parsed = await parse16BitPngBuffer(buffer, flipY);
    if (!parsed) return null;

    const {pixels, width, height} = parsed;
    const {gpuDevice} = redGPUContext;

    const gpuTexture = gpuDevice.createTexture({
        size: [width, height],
        format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        label: `16BitPng_GPUTexture_${format}`
    });

    gpuDevice.queue.writeTexture(
        {texture: gpuTexture},
        pixels.buffer,
        {bytesPerRow: width * 2},
        [width, height]
    );

    return {gpuTexture, width, height};
}

export default parse16BitPngBuffer;
