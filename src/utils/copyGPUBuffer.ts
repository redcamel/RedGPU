/**
 * GPUBuffer 간 데이터를 복사하는 함수입니다.
 *
 * srcBuffer의 데이터를 dstBuffer로 복사합니다.
 *
 * 복사 크기는 두 버퍼 중 작은 size로 결정됩니다.
 *
 *
 * @param {GPUDevice} gpuDevice 복사 작업에 사용할 GPU 디바이스
 * @param {GPUBuffer} srcBuffer 복사할 소스 버퍼
 * @param {GPUBuffer} dstBuffer 복사 대상 버퍼
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
