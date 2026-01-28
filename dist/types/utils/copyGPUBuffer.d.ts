/**
 * [KO] GPUBuffer 간 데이터를 복사합니다.
 * [EN] Copies data between GPUBuffers.
 *
 * [KO] srcBuffer의 데이터를 dstBuffer로 복사합니다. 크기는 두 버퍼 중 작은 쪽을 따릅니다.
 * [EN] Copies data from srcBuffer to dstBuffer. Size is determined by the smaller buffer.
 *
 * * ### Example
 * ```typescript
 * RedGPU.Util.copyGPUBuffer(device, sourceBuffer, destinationBuffer);
 * ```
 *
 * @param gpuDevice -
 * [KO] 복사 작업에 사용할 GPU 디바이스
 * [EN] GPU device to use for the copy operation
 * @param srcBuffer -
 * [KO] 복사할 소스 버퍼
 * [EN] Source buffer to copy from
 * @param dstBuffer -
 * [KO] 복사 대상 버퍼
 * [EN] Destination buffer to copy to
 * @category Utility
 */
declare const copyGPUBuffer: (gpuDevice: GPUDevice, srcBuffer: GPUBuffer, dstBuffer: GPUBuffer) => void;
export default copyGPUBuffer;
