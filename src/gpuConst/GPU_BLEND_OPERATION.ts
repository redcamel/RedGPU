/**
 * [KO] 블렌딩 시 사용되는 수학적 연산 옵션을 정의하는 상수군입니다.
 * [EN] Constants defining mathematical operation options used in blending.
 *
 * [KO] 소스와 대상 색상 결과물을 어떻게 결합할지 결정합니다.
 * [EN] Determines how to combine the source and destination color results.
 * 
 * @category Constants
 */
const GPU_BLEND_OPERATION = {
	/**
	 * [KO] 소스와 대상 결과를 더합니다.
	 * [EN] Adds the source and destination results.
	 */
	ADD: "add",
	/**
	 * [KO] 대상 결과에서 소스 결과를 뺍니다.
	 * [EN] Subtracts the source result from the destination result.
	 */
	SUBTRACT: "subtract",
	/**
	 * [KO] 소스 결과에서 대상 결과를 뺍니다.
	 * [EN] Subtracts the destination result from the source result.
	 */
	REVERSE_SUBTRACT: "reverse-subtract",
	/**
	 * [KO] 두 결과 중 작은 값을 선택합니다.
	 * [EN] Selects the minimum of the two results.
	 */
	MIN: "min",
	/**
	 * [KO] 두 결과 중 큰 값을 선택합니다.
	 * [EN] Selects the maximum of the two results.
	 */
	MAX: "max",
} as const;
Object.freeze(GPU_BLEND_OPERATION);
export default GPU_BLEND_OPERATION;