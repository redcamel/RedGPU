/**
 * [KO] GPUBuffer의 데이터를 읽어와 ArrayBuffer로 반환합니다.
 * [EN] Reads data from GPUBuffer and returns it as an ArrayBuffer.
 */
export async function readGPUBufferToCPU(
    device: GPUDevice,
    gpuBuffer: GPUBuffer
): Promise<ArrayBuffer | null> {
    try {
        const size = gpuBuffer.size;
        
        // 1. Create a staging buffer with MAP_READ and COPY_DST usage
        const stagingBuffer = device.createBuffer({
            size,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        // 2. Encode copy command
        const commandEncoder = device.createCommandEncoder();
        commandEncoder.copyBufferToBuffer(gpuBuffer, 0, stagingBuffer, 0, size);
        
        // 3. Submit and wait for completion
        device.queue.submit([commandEncoder.finish()]);

        // 4. Map the staging buffer
        await stagingBuffer.mapAsync(GPUMapMode.READ);
        
        // 5. Get a copy of the data
        const copy = stagingBuffer.getMappedRange().slice(0);
        
        // 6. Cleanup
        stagingBuffer.unmap();
        stagingBuffer.destroy();
        
        return copy;
    } catch (e) {
        console.error('Failed to read GPU buffer:', e);
        return null;
    }
}
