/**
 * [KO] 소스 `GPUBuffer`의 데이터를 대상 `GPUBuffer`로 복사하는 명령을 커맨드 인코더에 기록합니다.
 * [EN] Records a command on the command encoder that copies data from a source `GPUBuffer` to a destination `GPUBuffer`.
 *
 * [KO] 복사 크기는 두 버퍼 크기 중 작은 값이며 4바이트의 배수여야 합니다. 두 버퍼는 서로 다른 인스턴스여야 합니다.
 * [EN] The copy size is the smaller of the two buffer sizes and must be a multiple of 4 bytes. Both buffers must be different instances.
 *
 * ### Example
 * ```typescript
 * RedGPU.Util.copyGPUBuffer(commandEncoder, srcBuffer, dstBuffer);
 * ```
 *
 * @param commandEncoder -
 * [KO] 복사 명령을 기록할 커맨드 인코더
 * [EN] Command encoder to record the copy command
 * @param srcBuffer -
 * [KO] 소스 `GPUBuffer`
 * [EN] Source `GPUBuffer`
 * @param dstBuffer -
 * [KO] 대상 `GPUBuffer`
 * [EN] Destination `GPUBuffer`
 * @throws
 * [KO] 인자 타입이 잘못되었거나, 두 버퍼가 동일하거나, 복사 크기가 4의 배수가 아닌 경우
 * [EN] If argument types are invalid, both buffers are identical, or the copy size is not a multiple of 4
 * @category Utility
 */
declare const copyGPUBuffer: (commandEncoder: GPUCommandEncoder, srcBuffer: GPUBuffer, dstBuffer: GPUBuffer) => void;
export default copyGPUBuffer;
