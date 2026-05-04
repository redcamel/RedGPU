/**
 * [KO] GPUBuffer 간 데이터를 복사합니다.
 * [EN] Copies data between GPUBuffers.
 *
 * [KO] srcBuffer의 데이터를 dstBuffer로 복사합니다. 크기는 두 버퍼 중 작은 쪽을 따릅니다.
 * [EN] Copies data from srcBuffer to dstBuffer. Size is determined by the smaller buffer.
 *
 * * ### Example
 * ```typescript
 * RedGPU.Util.copyGPUBuffer(commandEncoder, sourceBuffer, destinationBuffer);
 * ```
 *
 * @param commandEncoder - [KO] 커맨드 인코더 [EN] Command Encoder
 * @param srcBuffer -
 * [KO] 복사할 소스 버퍼
 * [EN] Source buffer to copy from
 * @param dstBuffer -
 * [KO] 복사 대상 버퍼
 * [EN] Destination buffer to copy to
 * @category Utility
 */
const copyGPUBuffer = (
    commandEncoder: GPUCommandEncoder,
    srcBuffer: GPUBuffer,
    dstBuffer: GPUBuffer
) => {
    const minSize = Math.min(srcBuffer.size, dstBuffer.size);
    if (minSize % 4 !== 0) {
        throw new Error(`[RedGPU] copyGPUBuffer: Copy size (${minSize}) must be a multiple of 4 bytes. Please ensure your buffers are correctly aligned.`);
    }
    // if (srcBuffer.size !== dstBuffer.size) {
    //     console.warn(`[RedGPU] copyGPUBuffer: Buffer sizes do not match. (src: ${srcBuffer.size}, dst: ${dstBuffer.size}). Only the minimum size (${minSize}) will be copied.`);
    // }
    // Source 버퍼에서 Destination 버퍼로 데이터 복사
    commandEncoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, minSize);
}
export default copyGPUBuffer