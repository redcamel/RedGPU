/**
 * 텍스처를 배열 텍스처의 특정 슬라이스에 복사
 * @param gpuDevice GPU 디바이스
 * @param sourceTexture 복사할 소스 텍스처
 * @param targetArrayTexture 대상 배열 텍스처
 * @param sliceIndex 복사할 슬라이스 인덱스
 */
function copyToTextureArray(
	gpuDevice: GPUDevice,
	sourceTexture: GPUTexture,
	targetArrayTexture: GPUTexture,
	sliceIndex: number
) {
	const encoder = gpuDevice.createCommandEncoder({
		label: 'COPY_TO_TEXTURE_ARRAY'
	});
	encoder.copyTextureToTexture(
		{texture: sourceTexture},
		{
			texture: targetArrayTexture,
			origin: [0, 0, sliceIndex]
		},
		[sourceTexture.width, sourceTexture.height, 1]
	);
	gpuDevice.queue.submit([encoder.finish()]);
}

export default copyToTextureArray;
