/**
 * GPU 밉맵 필터 모드 옵션
 *
 * 밉맵 레벨 간 샘플링 방식을 정의합니다.
 * 텍스처가 화면에서 차지하는 크기에 따라 적절한 밉맵 레벨을 선택할 때 사용됩니다.
 *
 * @constant
 */
const GPU_MIPMAP_FILTER_MODE = {
	/**
	 * 최근접 밉맵 레벨을 선택합니다.
	 *
	 * 가장 가까운 하나의 밉맵 레벨에서만 샘플링합니다. 빠르지만 밉맵 경계에서 불연속적인 변화가 발생할 수 있습니다.
	 */
	NEAREST: 'nearest',

	/**
	 * 인접한 두 밉맵 레벨을 선형 보간합니다.
	 *
	 * 두 밉맵 레벨에서 샘플링한 후 선형 보간하여 부드러운 전환을 만듭니다.
	 */
	LINEAR: 'linear'
} as const

Object.freeze(GPU_MIPMAP_FILTER_MODE)

export default GPU_MIPMAP_FILTER_MODE
