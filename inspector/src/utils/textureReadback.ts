/**
 * [KO] GPUTexture의 데이터를 읽어와 Canvas에 그립니다.
 * [EN] Reads data from GPUTexture and draws it on a Canvas.
 */
export async function readGPUTextureToCanvas(
    device: GPUDevice,
    gpuTexture: GPUTexture,
    canvas: HTMLCanvasElement,
    layer: number = 0,
    mipLevel: number = 0
): Promise<void> {
    const width = Math.max(1, gpuTexture.width >> mipLevel);
    const height = Math.max(1, gpuTexture.height >> mipLevel);
    const format = gpuTexture.format;
    const isDepth = format.startsWith('depth');

    // 1. Calculate buffer size and row alignment
    const bytesPerPixel = getBytesPerPixel(format);
    const unpaddedBytesPerRow = width * bytesPerPixel;
    const paddedBytesPerRow = Math.ceil(unpaddedBytesPerRow / 256) * 256;
    const bufferSize = paddedBytesPerRow * height;

    // 2. Create staging buffer
    const stagingBuffer = device.createBuffer({
        size: bufferSize,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    // 3. Encode copy command
    const commandEncoder = device.createCommandEncoder();
    commandEncoder.copyTextureToBuffer(
        {
            texture: gpuTexture,
            origin: [0, 0, layer],
            mipLevel: mipLevel,
            aspect: isDepth ? 'depth-only' : 'all'
        },
        {
            buffer: stagingBuffer,
            bytesPerRow: paddedBytesPerRow,
        },
        [width, height]
    );

    device.queue.submit([commandEncoder.finish()]);

    // 4. Map buffer and read data
    try {
        await stagingBuffer.mapAsync(GPUMapMode.READ);
        const arrayBuffer = stagingBuffer.getMappedRange();
        const data = new Uint8Array(arrayBuffer);

        // 5. Draw to canvas
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.createImageData(width, height);

        // Process based on format
        if (format === 'rgba8unorm' || format === 'rgba8unorm-srgb') {
            for (let y = 0; y < height; y++) {
                const srcOffset = y * paddedBytesPerRow;
                const dstOffset = y * width * 4;
                imageData.data.set(data.subarray(srcOffset, srcOffset + width * 4), dstOffset);
            }
        } else if (format === 'bgra8unorm' || format === 'bgra8unorm-srgb') {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const srcIdx = y * paddedBytesPerRow + x * 4;
                    const dstIdx = (y * width + x) * 4;
                    imageData.data[dstIdx] = data[srcIdx + 2];     // B -> R
                    imageData.data[dstIdx + 1] = data[srcIdx + 1]; // G -> G
                    imageData.data[dstIdx + 2] = data[srcIdx];     // R -> B
                    imageData.data[dstIdx + 3] = data[srcIdx + 3]; // A -> A
                }
            }
        } else if (format === 'rgba16float') {
            const float16Data = new Uint16Array(arrayBuffer);
            const gamma = 1 / 2.2;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const srcIdx = (y * (paddedBytesPerRow / 2)) + x * 4;
                    const dstIdx = (y * width + x) * 4;

                    // Read linear float16 values
                    const r = decodeFloat16(float16Data[srcIdx]);
                    const g = decodeFloat16(float16Data[srcIdx + 1]);
                    const b = decodeFloat16(float16Data[srcIdx + 2]);
                    const a = decodeFloat16(float16Data[srcIdx + 3]);

                    // Apply gamma correction (approx linear to sRGB)
                    // and clamp to 0-255 range
                    imageData.data[dstIdx] = Math.max(0, Math.min(255, Math.pow(r, gamma) * 255));
                    imageData.data[dstIdx + 1] = Math.max(0, Math.min(255, Math.pow(g, gamma) * 255));
                    imageData.data[dstIdx + 2] = Math.max(0, Math.min(255, Math.pow(b, gamma) * 255));
                    imageData.data[dstIdx + 3] = Math.max(0, Math.min(255, a * 255));
                }
            }
        } else if (format === 'depth32float') {
            const float32Data = new Float32Array(arrayBuffer);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const srcIdx = (y * (paddedBytesPerRow / 4)) + x;
                    const dstIdx = (y * width + x) * 4;
                    const depth = float32Data[srcIdx];
                    // Depth is usually 0-1. 
                    // To make it more visible, we can invert it or just show it as is.
                    // Usually 1.0 is far (background), 0.0 is near.
                    const val = Math.max(0, Math.min(255, depth * 255));
                    imageData.data[dstIdx] = val;
                    imageData.data[dstIdx + 1] = val;
                    imageData.data[dstIdx + 2] = val;
                    imageData.data[dstIdx + 3] = 255;
                }
            }
        } else {
            // Fallback for other formats - just fill with something visible
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#fff';
            ctx.fillText(`Unsupported format: ${format}`, 10, 20);
        }

        ctx.putImageData(imageData, 0, 0);
    } finally {
        stagingBuffer.unmap();
        stagingBuffer.destroy();
    }
}

function getBytesPerPixel(format: GPUTextureFormat): number {
    switch (format) {
        case 'rgba8unorm':
        case 'rgba8unorm-srgb':
        case 'bgra8unorm':
        case 'bgra8unorm-srgb':
            return 4;
        case 'rgba16float':
            return 8;
        case 'depth32float':
            return 4;
        default:
            return 4;
    }
}

function decodeFloat16(binary: number): number {
    const exponent = (binary & 0x7C00) >> 10;
    const fraction = binary & 0x03FF;
    const sign = (binary & 0x8000) ? -1 : 1;
    if (exponent === 0) return sign * Math.pow(2, -14) * (fraction / 1024);
    if (exponent === 0x1F) return fraction ? NaN : sign * Infinity;
    return sign * Math.pow(2, exponent - 15) * (1 + fraction / 1024);
}
