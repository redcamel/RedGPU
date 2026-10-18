import RedGPUContext from "../../../../context/RedGPUContext";

export interface ParsedImageData {
    pixels: Uint16Array | Float32Array | Uint8Array | Uint8ClampedArray;
    width: number;
    height: number;
}

let g_rowBufA = new Uint8Array(8192);
let g_rowBufB = new Uint8Array(8192);

function ensureRowBufferSize(size: number): void {
    if (g_rowBufA.length < size) {
        g_rowBufA = new Uint8Array(size);
        g_rowBufB = new Uint8Array(size);
    }
}

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
            if (type === 0x49484452) {
                width = view.getUint32(offset + 8);
                height = view.getUint32(offset + 12);
                bitDepth = view.getUint8(offset + 16);
                colorType = view.getUint8(offset + 17);
            } else if (type === 0x49444154) {
                idatChunks.push(new Uint8Array(buffer, offset + 8, length));
            } else if (type === 0x49454E44) {
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

        const rowByteLength = width * bytesPerPixel;
        ensureRowBufferSize(rowByteLength);

        let prevRow = g_rowBufA;
        let curRow = g_rowBufB;
        prevRow.fill(0, 0, rowByteLength);

        for (let y = 0; y < height; y++) {
            const rowStart = y * stride;
            const filterType = decompressedData[rowStart];
            const dataOffset = rowStart + 1;

            for (let i = 0; i < rowByteLength; i++) {
                const x = decompressedData[dataOffset + i];
                const a = i >= bytesPerPixel ? curRow[i - bytesPerPixel] : 0;
                const b = prevRow[i];
                const c = i >= bytesPerPixel ? prevRow[i - bytesPerPixel] : 0;

                let reconstructed = 0;
                if (filterType === 0) {
                    reconstructed = x;
                } else if (filterType === 1) {
                    reconstructed = (x + a);
                } else if (filterType === 2) {
                    reconstructed = (x + b);
                } else if (filterType === 3) {
                    reconstructed = (x + ((a + b) >> 1));
                } else if (filterType === 4) {
                    const p = a + b - c;
                    const pa = Math.abs(p - a);
                    const pb = Math.abs(p - b);
                    const pc = Math.abs(p - c);
                    let pr = c;
                    if (pa <= pb && pa <= pc) pr = a;
                    else if (pb <= pc) pr = b;
                    reconstructed = (x + pr);
                }
                curRow[i] = reconstructed & 0xFF;
            }

            const targetY = flipY ? (height - 1 - y) : y;
            const rowOffset = targetY * width;
            for (let x = 0; x < width; x++) {
                const sampleIdx = x * bytesPerPixel;
                const highByte = curRow[sampleIdx];
                const lowByte = curRow[sampleIdx + 1];
                outPixels[rowOffset + x] = (highByte << 8) | lowByte;
            }

            const temp = prevRow;
            prevRow = curRow;
            curRow = temp;
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
    format: GPUTextureFormat = 'r16unorm',
    flipY: boolean = false
): Promise<{ gpuTexture: GPUTexture, width: number, height: number } | null> {
    const parsed = await parse16BitPngBuffer(buffer, flipY);
    if (!parsed) return null;

    const {pixels, width, height} = parsed;
    const {gpuDevice} = redGPUContext;

    let bytesPerPixel = 2;
    let uploadBuffer: ArrayBufferView = pixels;

    if (format === 'rgba16float') {
        bytesPerPixel = 8;
        const count = width * height;
        const rgba = new Uint16Array(count * 4);
        for (let i = 0; i < count; i++) {
            const val = pixels[i];
            const i4 = i * 4;
            rgba[i4] = val;
            rgba[i4 + 1] = val;
            rgba[i4 + 2] = val;
            rgba[i4 + 3] = 65535;
        }
        uploadBuffer = rgba;
    } else if (format === 'rgba8unorm') {
        bytesPerPixel = 4;
        const count = width * height;
        const rgba = new Uint8Array(count * 4);
        for (let i = 0; i < count; i++) {
            const val = pixels[i] >> 8;
            const i4 = i * 4;
            rgba[i4] = val;
            rgba[i4 + 1] = val;
            rgba[i4 + 2] = val;
            rgba[i4 + 3] = 255;
        }
        uploadBuffer = rgba;
    }

    const bytesPerRow = width * bytesPerPixel;

    const gpuTexture = gpuDevice.createTexture({
        size: [width, height],
        format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
        label: `16BitPng_GPUTexture_${format}`
    });

    gpuDevice.queue.writeTexture(
        {texture: gpuTexture},
        uploadBuffer.buffer,
        {bytesPerRow},
        [width, height]
    );

    return {gpuTexture, width, height};
}

export default parse16BitPngBuffer;
