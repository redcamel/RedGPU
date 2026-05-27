/**
 * [KO] GPUBuffer 간 데이터를 복사합니다.
 * [EN] Copies data between GPUBuffers.
 *
 * [KO] 소스 버퍼의 데이터를 대상 버퍼로 복사하며, 복사 크기는 두 버퍼 중 작은 쪽을 기준으로 합니다.
 * [EN] Copies data from the source buffer to the destination buffer, using the smaller of the two buffer sizes.
 *
 * * ### Example
 * ```typescript
 * RedGPU.Util.copyGPUBuffer(commandEncoder, sourceBuffer, destinationBuffer);
 * ```
 *
 * @param commandEncoder - [KO] 커맨드 인코더 [EN] Command Encoder
 * @param srcBuffer - [KO] 소스 GPUBuffer [EN] Source GPUBuffer
 * @param dstBuffer - [KO] 대상 GPUBuffer [EN] Destination GPUBuffer
 * @category Utility
 */
const copyGPUBuffer = (
    commandEncoder: GPUCommandEncoder,
    srcBuffer: GPUBuffer,
    dstBuffer: GPUBuffer
) => {
    const minSize = Math.min(srcBuffer.size, dstBuffer.size);
    if (minSize % 4 !== 0) {
        throw new Error(`[RedGPU] copyGPUBuffer: Copy size (${minSize}) must be a multiple of 4 bytes.`);
    }
    commandEncoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, minSize);
}
export default copyGPUBuffer
