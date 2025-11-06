/**
 * GPU 컬링 모드 옵션
 *
 * 렌더링 시 어떤 면을 제거할지 결정합니다.
 * 삼각형의 와인딩 순서(winding order)를 기준으로 앞면과 뒷면을 판단합니다.
 *
 * @constant
 */
const GPU_CULL_MODE = {
	/**
	 * 컬링을 수행하지 않습니다.
	 *
	 * 모든 면을 렌더링합니다.
	 */
	NONE: 'none',
	/**
	 * 앞면을 제거합니다.
	 *
	 * 카메라를 향한 면을 렌더링하지 않습니다.
	 */
	FRONT: 'front',
	/**
	 * 뒷면을 제거합니다.
	 *
	 * 카메라 반대편을 향한 면을 렌더링하지 않습니다. 일반적으로 가장 많이 사용됩니다.
	 */
	BACK: 'back',
} as const
Object.freeze(GPU_CULL_MODE)
export default GPU_CULL_MODE
