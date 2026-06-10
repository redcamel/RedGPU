/**
 * [KO] 메쉬 피킹 프래그먼트 셰이더 엔트리 포인트입니다.
 * [EN] Fragment shader entry point for mesh picking.
 *
 * @param inputData [KO] 프래그먼트 입력 데이터 [EN] Fragment input data
 * @returns [KO] 피킹 ID (location 0) [EN] Picking ID (location 0)
 */
@fragment
fn entryPointPickingFragment(inputData: InputData) -> @location(0) vec4<f32> {
    var finalColor:vec4<f32> = inputData.pickingId;
    return finalColor;
}
