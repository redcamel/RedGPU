/**
 * GPU 필터 모드 옵션
 *
 * 텍스처 샘플링 시 픽셀 간 보간 방식을 정의합니다.
 * 텍스처를 확대하거나 축소할 때 사용됩니다.
 *
 * @constant
 */
const GPU_FILTER_MODE = {
	/**
	 * 최근접 이웃 필터링을 사용합니다.
	 *
	 * 가장 가까운 텍셀의 값을 그대로 사용합니다. 빠르지만 계단 현상이 발생할 수 있습니다.
	 */
	NEAREST: 'nearest',

	/**
	 * 선형 보간 필터링을 사용합니다.
	 *
	 * 주변 텍셀들의 값을 선형 보간하여 부드러운 결과를 만듭니다.
	 */
	LINEAR: 'linear'
} as const

Object.freeze(GPU_FILTER_MODE)

export default GPU_FILTER_MODE
