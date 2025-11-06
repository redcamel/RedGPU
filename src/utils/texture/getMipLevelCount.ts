/**
 * 주어진 텍스처의 width, height에 대해 생성 가능한 mipmap 레벨의 개수를 계산합니다.
 *
 * width, height 중 더 큰 값을 기준으로 log2를 취해, 1을 더한 값을 반환합니다.
 * (예: 256x128 텍스처는 9레벨, 1x1 텍스처는 1레벨)
 *
 * @category Texture
 * @param {number} width 텍스처의 가로 크기 (픽셀)
 * @param {number} height 텍스처의 세로 크기 (픽셀)
 * @returns {number} 생성 가능한 mipmap 레벨의 개수
 */
const getMipLevelCount = (width: number, height: number): number => {
	return Math.floor(Math.log2(Math.max(width, height))) + 1;
}
export default getMipLevelCount
