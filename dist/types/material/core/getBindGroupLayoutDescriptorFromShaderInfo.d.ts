/**
 * [KO] 셰이더 정보로부터 프래그먼트 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a fragment bind group layout descriptor from shader information.
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 */
declare const getFragmentBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number) => {
    entries: GPUBindGroupLayoutEntry[];
};
/**
 * [KO] 셰이더 정보로부터 버텍스 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a vertex bind group layout descriptor from shader information.
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 */
declare const getVertexBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number) => {
    entries: GPUBindGroupLayoutEntry[];
};
/**
 * [KO] 셰이더 정보로부터 컴퓨트 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a compute bind group layout descriptor from shader information.
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 * @param useMSAA -
 * [KO] MSAA 사용 여부
 * [EN] Whether to use MSAA
 */
declare const getComputeBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, useMSAA: boolean) => {
    entries: GPUBindGroupLayoutEntry[];
};
export { getFragmentBindGroupLayoutDescriptorFromShaderInfo, getVertexBindGroupLayoutDescriptorFromShaderInfo, getComputeBindGroupLayoutDescriptorFromShaderInfo };
