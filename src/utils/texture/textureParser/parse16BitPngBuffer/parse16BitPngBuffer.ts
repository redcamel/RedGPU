import RedGPUContext from "../../../../context/RedGPUContext";

/**
 * [KO] 파싱된 이미지의 픽셀 버퍼 및 해상도 정보를 담는 인터페이스입니다.
 * [EN] Interface representing parsed image pixel buffer and resolution information.
 *
 * @category Texture
 */
export interface ParsedImageData {
    /**
     * [KO] 디코딩된 픽셀 데이터 배열
     * [EN] Decoded pixel data array
     */
    pixels: Uint16Array | Float32Array | Uint8Array | Uint8ClampedArray;
    /**
     * [KO] 이미지 가로 픽셀 크기
     * [EN] Image width in pixels
     */
    width: number;
    /**
     * [KO] 이미지 세로 픽셀 크기
     * [EN] Image height in pixels
     */
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

/**
 * [KO] 16비트 PNG 바이너리 버퍼를 디코딩하여 `Uint16Array` 픽셀 데이터와 해상도를 추출합니다.
 * [EN] Decodes a 16-bit PNG binary buffer and extracts `Uint16Array` pixel data and resolution.
 *
 * @param buffer -
 * [KO] 16비트 PNG 파일의 `ArrayBuffer`
 * [EN] `ArrayBuffer` of the 16-bit PNG file
 * @param flipY -
 * [KO] Y축 상하 반전 여부 (기본값: `false`)
 * [EN] Whether to flip vertically along the Y-axis (default: `false`)
 * @returns
 * [KO] 디코딩 성공 시 `ParsedImageData`, 16비트 PNG가 아니거나 실패 시 `null`을 반환하는 `Promise`
 * [EN] `Promise` resolving to `ParsedImageData` on success, or `null` if not a 16-bit PNG or decoding fails
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


/**
 * [KO] 16비트 PNG 버퍼를 디코딩하여 지정된 포맷의 `GPUTexture`를 생성하고 픽셀 데이터를 업로드합니다.
 * [EN] Decodes a 16-bit PNG buffer, creates a `GPUTexture` of the specified format, and uploads the pixel data.
 *
 * @param redGPUContext -
 * [KO] RedGPUContext 인스턴스
 * [EN] RedGPUContext instance
 * @param buffer -
 * [KO] 16비트 PNG 파일의 `ArrayBuffer`
 * [EN] `ArrayBuffer` of the 16-bit PNG file
 * @param format -
 * [KO] 생성할 `GPUTexture` 포맷 (기본값: `'r16unorm'`)
 * [EN] `GPUTexture` format to create (default: `'r16unorm'`)
 * @param flipY -
 * [KO] Y축 상하 반전 여부 (기본값: `false`)
 * [EN] Whether to flip vertically along the Y-axis (default: `false`)
 * @returns
 * [KO] 생성된 `GPUTexture` 및 해상도 정보를 담은 객체 또는 실패 시 `null`을 반환하는 `Promise`
 * [EN] `Promise` resolving to an object containing the created `GPUTexture` and dimensions, or `null` on failure
 * @category Texture
 */
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
