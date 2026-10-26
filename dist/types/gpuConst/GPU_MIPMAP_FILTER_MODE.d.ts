/**
 * [KO] 텍스처 샘플링 시 서로 다른 밉맵(Mipmap) 레벨 사이의 보간 방식을 정의하는 필터 모드 상수입니다.
 * [EN] Filter mode constants defining the interpolation method between different mipmap levels during texture sampling.
 *
 * @category Constants
 */
declare const GPU_MIPMAP_FILTER_MODE: {
    /**
     * [KO] 계산된 LOD(Level of Detail)에서 가장 가까운 단일 밉맵 레벨을 선택하여 샘플링합니다.
     * [EN] Selects and samples from the single mipmap level nearest to the computed Level of Detail (LOD).
     */
    readonly NEAREST: "nearest";
    /**
     * [KO] 인접한 두 밉맵 레벨에서 각각 샘플링한 뒤 두 값을 선형 보간(Trilinear Filtering)합니다.
     * [EN] Samples from the two adjacent mipmap levels and linearly interpolates between them (Trilinear Filtering).
     */
    readonly LINEAR: "linear";
};
export default GPU_MIPMAP_FILTER_MODE;
