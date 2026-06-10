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
declare const copyGPUBuffer: (commandEncoder: GPUCommandEncoder, srcBuffer: GPUBuffer, dstBuffer: GPUBuffer) => void;
export default copyGPUBuffer;
