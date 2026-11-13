/**
 * [KO] 0~255 sRGB 채널 값별 리니어 변환 결과(IEC 61966-2-1)를 미리 계산해 둔 내부 조회 테이블입니다.
 * [EN] Internal lookup table of precomputed linear conversion results (IEC 61966-2-1) for each 0~255 sRGB channel value.
 *
 * [KO] 이미 범위 검증이 끝난 정수 채널 값을 핫패스에서 연산·할당 없이 변환하기 위해 엔진 내부에서만 사용합니다. 외부 입력은 `convertSrgbToLinear`를 사용하십시오.
 * [EN] Used only inside the engine to convert already-validated integer channel values in hot paths without computation or allocation. Use `convertSrgbToLinear` for external input.
 */
const SRGB_TO_LINEAR_TABLE: Float64Array = new Float64Array(256);
for (let i = 0; i < 256; i++) {
    const c = i / 255;
    SRGB_TO_LINEAR_TABLE[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
export default SRGB_TO_LINEAR_TABLE;
