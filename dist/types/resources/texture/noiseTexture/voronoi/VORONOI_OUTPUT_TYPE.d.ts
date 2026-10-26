/**
 * [KO] Voronoi 노이즈의 출력 값 계산 방식을 정의하는 상수입니다.
 * [EN] Constants defining how the Voronoi noise output value is computed.
 *
 * ### Example
 * ```typescript
 * texture.outputType = RedGPU.Resource.VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
 * ```
 *
 * @experimental
 * @category NoiseTexture
 */
declare const VORONOI_OUTPUT_TYPE: {
    /**
     * [KO] 가장 가까운 점까지의 거리
     * [EN] Distance to the closest point
     */
    readonly F1: 0;
    /**
     * [KO] 두 번째로 가까운 점까지의 거리
     * [EN] Distance to the second closest point
     */
    readonly F2: 1;
    /**
     * [KO] F2 - F1 (셀 경계 강조)
     * [EN] F2 - F1 (cell edge emphasis)
     */
    readonly F2_MINUS_F1: 2;
    /**
     * [KO] F1 + F2 (부드러운 블렌딩)
     * [EN] F1 + F2 (smooth blend)
     */
    readonly F1_PLUS_F2: 3;
    /**
     * [KO] 셀별 고유 그레이스케일 ID 값
     * [EN] Unique grayscale ID value per cell
     */
    readonly CELL_ID: 4;
    /**
     * [KO] 셀별 고유 RGB 색상
     * [EN] Unique RGB color per cell
     */
    readonly CELL_ID_COLOR: 5;
};
export default VORONOI_OUTPUT_TYPE;
