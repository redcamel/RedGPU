/**
 * [KO] 0~255 범위의 sRGB 채널 값을 IEC 61966-2-1 표준 sRGB 전달 함수(EOTF)로 0~1 범위의 리니어 값으로 변환합니다.
 * [EN] Converts an sRGB channel value in the 0~255 range to a linear value in the 0~1 range using the IEC 61966-2-1 standard sRGB transfer function (EOTF).
 *
 * [KO] 단순 `pow(x, 2.2)` 근사 대신 GPU의 `-srgb` 텍스처 디코딩 및 셰이더 `srgbToLinearVec3`와 동일한 구간 함수를 사용하므로, 저채도·암부 영역에서도 텍스처 색상과 유니폼 색상이 일치합니다. 사전 계산된 조회 테이블을 사용하여 핫패스에서도 연산 및 힙 할당 비용이 없습니다.
 * [EN] Uses the same piecewise function as GPU `-srgb` texture decoding and the shader `srgbToLinearVec3` instead of the simple `pow(x, 2.2)` approximation, so texture colors and uniform colors match even in dark regions. Uses a precomputed lookup table, so it has no computation or heap allocation cost even in hot paths.
 *
 * ### Example
 * ```typescript
 * const linear = RedGPU.Color.convertSrgbToLinear(128); // 0.2158605...
 * ```
 *
 * @param channel -
 * [KO] sRGB 채널 값 (0~255 정수). 범위 검증을 수행하지 않으므로 호출 측에서 유효 범위를 보장해야 합니다.
 * [EN] sRGB channel value (integer 0~255). No range validation is performed, so the caller must guarantee a valid range.
 * @returns
 * [KO] 0~1 범위의 리니어 값
 * [EN] Linear value in the 0~1 range
 * @category Color
 */
declare const convertSrgbToLinear: (channel: number) => number;
export default convertSrgbToLinear;
