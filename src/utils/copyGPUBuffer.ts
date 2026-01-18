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
const copyGPUBuffer = (
    gpuDevice: GPUDevice,
    srcBuffer: GPUBuffer,
    dstBuffer: GPUBuffer
) => {
    // 명령 인코더 생성
    const commandEncoder: GPUCommandEncoder = gpuDevice.createCommandEncoder({
        label: 'copyGPUBuffer_CommandEncoder'
    });
    // Source 버퍼에서 Destination 버퍼로 데이터 복사
    commandEncoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, Math.min(srcBuffer.size, dstBuffer.size));
    // 명령 인코더를 완료하고 커맨드 버퍼 가져옴
    const gpuCommandBuffer: GPUCommandBuffer = commandEncoder.finish();
    // 커맨드 버퍼를 디바이스의 기본 큐에 전송하여 실행
    gpuDevice.queue.submit([gpuCommandBuffer]);
}
export default copyGPUBuffer