/**
 * [KO] 인덱스 버퍼에서 사용하는 데이터 포맷을 정의하는 상수군입니다.
 * [EN] Constants defining the data format used in index buffers.
 *
 * [KO] 인덱스 값의 비트 수와 데이터 형식을 결정합니다.
 * [EN] Determines the number of bits and data type for index values.
 * 
 * @category Constants
 */
const GPU_INDEX_FORMAT = {
	/**
	 * [KO] 16비트 부호 없는 정수(Uint16) 포맷을 사용합니다.
	 * [EN] Uses 16-bit unsigned integer (Uint16) format.
	 */
	UINT16: 'uint16',
	/**
	 * [KO] 32비트 부호 없는 정수(Uint32) 포맷을 사용합니다.
	 * [EN] Uses 32-bit unsigned integer (Uint32) format.
	 */
	UINT32: 'uint32'
} as const;
Object.freeze(GPU_INDEX_FORMAT);
export default GPU_INDEX_FORMAT;