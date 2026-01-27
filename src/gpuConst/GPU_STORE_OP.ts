/**
 * [KO] 렌더 패스 종료 시 어태치먼트의 내용을 저장하는 방식을 정의하는 상수군입니다.
 * [EN] Constants defining how to store attachment contents at the end of a render pass.
 *
 * [KO] 렌더링 결과물을 메모리에 저장할지 혹은 버릴지 결정합니다.
 * [EN] Determines whether to store the rendering results in memory or discard them.
 * 
 * @category Constants
 */
const GPU_STORE_OP = {
	/**
	 * [KO] 렌더링된 결과물을 어태치먼트에 저장합니다.
	 * [EN] Stores the rendered results in the attachment.
	 */
	STORE: 'store',
	/**
	 * [KO] 렌더링된 결과물을 저장하지 않고 버립니다.
	 * [EN] Discards the rendered results without storing them.
	 */
	DISCARD: 'discard',
} as const;
Object.freeze(GPU_STORE_OP);
export default GPU_STORE_OP;