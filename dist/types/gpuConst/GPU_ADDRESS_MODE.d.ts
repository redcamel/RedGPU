/**
 * 텍스처 샘플링 및 래핑을 위한 GPU 주소 모드 옵션
 *
 * 텍스처 좌표가 [0, 1] 범위를 벗어날 때 텍스처가 어떻게 샘플링될지를 정의합니다.
 *
 * @example
 * ```typescript
 * // 텍스처가 가장자리에서 클램핑되도록 설정
 * (Sampler Instance).addressModeU = GPU_ADDRESS_MODE.CLAMP_TO_EDGE;
 *
 * // 텍스처가 반복되도록 설정
 * (Sampler Instance).addressModeV = GPU_ADDRESS_MODE.REPEAT;
 *
 * // 텍스처가 미러링되며 반복되도록 설정
 * (Sampler Instance).addressModeW = GPU_ADDRESS_MODE.MIRRORED_REPEAT;
 * ```
 *
 * @constant
 */
declare const GPU_ADDRESS_MODE: {
    /**
     * 텍스처 좌표를 가장자리 값으로 클램핑합니다.
     *
     * 0보다 작은 좌표는 0으로, 1보다 큰 좌표는 1로 처리됩니다.
     * 가장자리 픽셀이 영역 밖으로 확장됩니다.
     */
    readonly CLAMP_TO_EDGE: "clamp-to-edge";
    /**
     * 텍스처를 반복합니다.
     *
     * 텍스처 좌표의 정수 부분이 무시되고 소수 부분만 사용됩니다.
     * 텍스처가 타일처럼 반복됩니다.
     */
    readonly REPEAT: "repeat";
    /**
     * 텍스처를 미러링하며 반복합니다.
     *
     * 짝수 정수 구간에서는 일반 반복, 홀수 정수 구간에서는 미러링됩니다.
     * 이음새가 없는 부드러운 반복 패턴을 만듭니다.
     */
    readonly MIRRORED_REPEAT: "mirror-repeat";
};
export default GPU_ADDRESS_MODE;
