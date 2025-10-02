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
declare const copyGPUBuffer: (gpuDevice: GPUDevice, srcBuffer: GPUBuffer, dstBuffer: GPUBuffer) => void;
export default copyGPUBuffer;
