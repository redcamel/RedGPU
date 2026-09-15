/**
 * [KO] 여러 셰이더 스테이지 정보(Vertex, Fragment, Compute 등)로부터 특정 그룹의 바인드 그룹 레이아웃 디스크립터를 결합하여 생성합니다.
 * [EN] Generates a combined bind group layout descriptor for a specific group from multiple shader stage information (Vertex, Fragment, Compute, etc.).
 * @param stageInfoList -
 * [KO] 스테이지별 셰이더 정보 목록 ({ shaderInfo, visibility })
 * [EN] List of shader information per stage ({ shaderInfo, visibility })
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 * @param overrideEntries -
 * [KO] 특정 바인딩의 설정을 오버라이드할 맵 (선택)
 * [EN] Map to override specific binding configurations (optional)
 * @returns
 * [KO] 결합된 바인드 그룹 레이아웃 디스크립터
 * [EN] Combined bind group layout descriptor
 */
declare const getUnionBindGroupLayoutDescriptorFromShaderInfos: (stageInfoList: {
    shaderInfo: any;
    visibility: GPUFlagsConstant;
}[], targetGroupIndex: number, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
/**
 * [KO] 셰이더 정보로부터 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a bind group layout descriptor from shader information.
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 * @param visibility -
 * [KO] GPU 셰이더 스테이지 가시성
 * [EN] GPU shader stage visibility
 * @param useMSAA -
 * [KO] MSAA 사용 여부 (기본값: true)
 * [EN] Whether to use MSAA (default: true)
 * @returns
 * [KO] 바인드 그룹 레이아웃 디스크립터
 * [EN] Bind group layout descriptor
 */
declare const getBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, visibility: GPUFlagsConstant, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
/**
 * [KO] 셰이더 정보로부터 프래그먼트 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a fragment bind group layout descriptor from shader information.
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 * @param overrideEntries -
 * [KO] 특정 바인딩 오버라이드 맵 (선택)
 * [EN] Optional binding override map
 */
declare const getFragmentBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
/**
 * [KO] 셰이더 정보로부터 버텍스 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a vertex bind group layout descriptor from shader information.
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 * @param overrideEntries -
 * [KO] 특정 바인딩 오버라이드 맵 (선택)
 * [EN] Optional binding override map
 */
declare const getVertexBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
/**
 * [KO] 셰이더 정보로부터 컴퓨트 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a compute bind group layout descriptor from shader information.
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 * @param useMSAAOrOverride -
 * [KO] MSAA 사용 여부 또는 바인딩 오버라이드 맵 (선택)
 * [EN] MSAA boolean flag or optional binding override map
 * @param overrideEntries -
 * [KO] 특정 바인딩 오버라이드 맵 (선택)
 * [EN] Optional binding override map
 */
declare const getComputeBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, useMSAAOrOverride?: boolean | Record<number, Partial<GPUBindGroupLayoutEntry>>, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
export { getFragmentBindGroupLayoutDescriptorFromShaderInfo, getVertexBindGroupLayoutDescriptorFromShaderInfo, getComputeBindGroupLayoutDescriptorFromShaderInfo, getUnionBindGroupLayoutDescriptorFromShaderInfos, getBindGroupLayoutDescriptorFromShaderInfo };
