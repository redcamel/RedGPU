/**
 * 주어진 오프셋과 사이즈를 시작으로 필요한 정렬을 기준으로 오프셋을 반올림합니다.
 * <br/>Rounds up the offset based on the given previous offset and size and the required alignment.
 *
 * @param {number} previousOffsetAndSize - 이전 오프셋과 사이즈입니다.
 * <br/>The previous offset and size.
 * @param {number} requiredAlignment - 필요한 정렬입니다.
 * <br/>The required alignment.
 * @returns {number} - 반올림된 오프셋을 반환합니다.
 * <br/>Returns the rounded up offset.
 */
const getUniformOffsetByRoundUp = (previousOffsetAndSize, requiredAlignment) => (((previousOffsetAndSize + requiredAlignment - 1) / requiredAlignment) | 0) * requiredAlignment;
export default getUniformOffsetByRoundUp;
