/**
 * [KO] 텍스처 좌표가 정규화된 범위(`[0, 1]`)를 벗어날 때 적용되는 샘플링 래핑 모드 상수입니다.
 * [EN] Sampling wrapping mode constants applied when texture coordinates fall outside the normalized range (`[0, 1]`).
 *
 * @category Constants
 */
declare const GPU_ADDRESS_MODE: {
    /**
     * [KO] 범위 밖의 좌표를 가장자리 끝값(`0.0` 또는 `1.0`)으로 고정합니다.
     * [EN] Clamps out-of-range coordinates to the edge values (`0.0` or `1.0`).
     */
    readonly CLAMP_TO_EDGE: "clamp-to-edge";
    /**
     * [KO] 정수를 버리고 소수 부분만 취해 텍스처 타일을 주기적으로 반복합니다.
     * [EN] Repeats the texture tile periodically by taking only the fractional part of coordinates.
     */
    readonly REPEAT: "repeat";
    /**
     * [KO] 정수 경계마다 텍스처를 거울처럼 반전시키며 타일을 반복합니다.
     * [EN] Repeats the texture tile while mirroring it across each integer boundary.
     */
    readonly MIRRORED_REPEAT: "mirror-repeat";
};
export default GPU_ADDRESS_MODE;
