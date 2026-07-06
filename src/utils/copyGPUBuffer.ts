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
    if (!(commandEncoder instanceof GPUCommandEncoder)) {
        throw new Error("[RedGPU] copyGPUBuffer: commandEncoder must be an instance of GPUCommandEncoder.");
    }
    if (!(srcBuffer instanceof GPUBuffer) || !(dstBuffer instanceof GPUBuffer)) {
        throw new Error("[RedGPU] copyGPUBuffer: srcBuffer and dstBuffer must be instances of GPUBuffer.");
    }
    if (srcBuffer === dstBuffer) {
        throw new Error("[RedGPU] copyGPUBuffer: Source and destination buffers must be different instances.");
    }
    const minSize = Math.min(srcBuffer.size, dstBuffer.size);
    if (minSize % 4 !== 0) {
        throw new Error(`[RedGPU] copyGPUBuffer: Copy size (${minSize}) must be a multiple of 4 bytes.`);
    }
    commandEncoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, minSize);
}
export default copyGPUBuffer
