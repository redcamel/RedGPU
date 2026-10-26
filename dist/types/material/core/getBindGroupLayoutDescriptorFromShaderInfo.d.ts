/**
 * [KO] 여러 셰이더 스테이지 정보(Vertex, Fragment, Compute 등)로부터 특정 그룹의 바인드 그룹 레이아웃 디스크립터를 병합하여 생성합니다.
 * [EN] Generates a merged bind group layout descriptor for a specific group from multiple shader stage information (Vertex, Fragment, Compute, etc.).
 *
 * @param stageInfoList -
 * [KO] 스테이지별 파싱된 셰이더 정보와 가시성 목록 (`Array<{ shaderInfo: any, visibility: GPUFlagsConstant }>`)
 * [EN] List of parsed shader information and visibility per stage (`Array<{ shaderInfo: any, visibility: GPUFlagsConstant }>`)
 * @param targetGroupIndex -
 * [KO] 대상 바인드 그룹 인덱스
 * [EN] Target bind group index
 * @param overrideEntries -
 * [KO] 특정 바인딩 번호의 설정을 덮어쓸 엔트리 맵 (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, 선택)
 * [EN] Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional)
 * @returns
 * [KO] 병합된 GPUBindGroupLayoutDescriptor 객체
 * [EN] Merged GPUBindGroupLayoutDescriptor object
 * @category Material
 */
declare const getUnionBindGroupLayoutDescriptorFromShaderInfos: (stageInfoList: {
    shaderInfo: any;
    visibility: GPUFlagsConstant;
}[], targetGroupIndex: number, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
/**
 * [KO] 단일 셰이더 정보로부터 지정된 스테이지 가시성을 가진 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a bind group layout descriptor with the specified stage visibility from single shader information.
 *
 * @param SHADER_INFO -
 * [KO] 파싱된 WGSL 셰이더 정보 객체
 * [EN] Parsed WGSL shader information object
 * @param targetGroupIndex -
 * [KO] 대상 바인드 그룹 인덱스
 * [EN] Target bind group index
 * @param visibility -
 * [KO] GPU 셰이더 스테이지 가시성 플래그 (GPUShaderStage)
 * [EN] GPU shader stage visibility flag (GPUShaderStage)
 * @param overrideEntries -
 * [KO] 특정 바인딩 번호의 설정을 덮어쓸 엔트리 맵 (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, 선택)
 * [EN] Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional)
 * @returns
 * [KO] 생성된 GPUBindGroupLayoutDescriptor 객체
 * [EN] Generated GPUBindGroupLayoutDescriptor object
 * @category Material
 */
declare const getBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, visibility: GPUFlagsConstant, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
/**
 * [KO] 파싱된 셰이더 정보로부터 프래그먼트 스테이지(GPUShaderStage.FRAGMENT)용 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a bind group layout descriptor for the fragment stage (GPUShaderStage.FRAGMENT) from parsed shader information.
 *
 * @param SHADER_INFO -
 * [KO] 파싱된 WGSL 셰이더 정보 객체
 * [EN] Parsed WGSL shader information object
 * @param targetGroupIndex -
 * [KO] 대상 바인드 그룹 인덱스
 * [EN] Target bind group index
 * @param overrideEntries -
 * [KO] 특정 바인딩 번호의 설정을 덮어쓸 엔트리 맵 (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, 선택)
 * [EN] Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional)
 * @returns
 * [KO] 프래그먼트용 GPUBindGroupLayoutDescriptor 객체
 * [EN] GPUBindGroupLayoutDescriptor object for fragment stage
 * @category Material
 */
declare const getFragmentBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
/**
 * [KO] 파싱된 셰이더 정보로부터 버텍스 스테이지(GPUShaderStage.VERTEX)용 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a bind group layout descriptor for the vertex stage (GPUShaderStage.VERTEX) from parsed shader information.
 *
 * @param SHADER_INFO -
 * [KO] 파싱된 WGSL 셰이더 정보 객체
 * [EN] Parsed WGSL shader information object
 * @param targetGroupIndex -
 * [KO] 대상 바인드 그룹 인덱스
 * [EN] Target bind group index
 * @param overrideEntries -
 * [KO] 특정 바인딩 번호의 설정을 덮어쓸 엔트리 맵 (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, 선택)
 * [EN] Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional)
 * @returns
 * [KO] 버텍스용 GPUBindGroupLayoutDescriptor 객체
 * [EN] GPUBindGroupLayoutDescriptor object for vertex stage
 * @category Material
 */
declare const getVertexBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
/**
 * [KO] 파싱된 셰이더 정보로부터 컴퓨트 스테이지(GPUShaderStage.COMPUTE)용 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a bind group layout descriptor for the compute stage (GPUShaderStage.COMPUTE) from parsed shader information.
 *
 * @param SHADER_INFO -
 * [KO] 파싱된 WGSL 셰이더 정보 객체
 * [EN] Parsed WGSL shader information object
 * @param targetGroupIndex -
 * [KO] 대상 바인드 그룹 인덱스
 * [EN] Target bind group index
 * @param useMSAAOrOverride -
 * [KO] MSAA 사용 여부 불리언 또는 바인딩 오버라이드 맵 (`boolean | Record<number, Partial<GPUBindGroupLayoutEntry>>`, 선택)
 * [EN] MSAA usage boolean flag or binding override map (`boolean | Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional)
 * @param overrideEntries -
 * [KO] 특정 바인딩 번호의 설정을 덮어쓸 엔트리 맵 (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, 선택)
 * [EN] Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional)
 * @returns
 * [KO] 컴퓨트용 GPUBindGroupLayoutDescriptor 객체
 * [EN] GPUBindGroupLayoutDescriptor object for compute stage
 * @category Material
 */
declare const getComputeBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, useMSAAOrOverride?: boolean | Record<number, Partial<GPUBindGroupLayoutEntry>>, overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>) => GPUBindGroupLayoutDescriptor;
export { getFragmentBindGroupLayoutDescriptorFromShaderInfo, getVertexBindGroupLayoutDescriptorFromShaderInfo, getComputeBindGroupLayoutDescriptorFromShaderInfo, getUnionBindGroupLayoutDescriptorFromShaderInfos, getBindGroupLayoutDescriptorFromShaderInfo };
