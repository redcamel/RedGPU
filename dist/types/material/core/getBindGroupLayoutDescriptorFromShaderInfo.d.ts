/**
 *
 * @param SHADER_INFO
 * @param targetGroupIndex

 */
declare const getFragmentBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number) => {
    entries: GPUBindGroupLayoutEntry[];
};
/**
 *
 * @param SHADER_INFO
 * @param targetGroupIndex

 */
declare const getVertexBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number) => {
    entries: GPUBindGroupLayoutEntry[];
};
/**
 *
 * @param SHADER_INFO
 * @param targetGroupIndex
 * @param useMSAA

 */
declare const getComputeBindGroupLayoutDescriptorFromShaderInfo: (SHADER_INFO: any, targetGroupIndex: number, useMSAA: boolean) => {
    entries: GPUBindGroupLayoutEntry[];
};
export { getFragmentBindGroupLayoutDescriptorFromShaderInfo, getVertexBindGroupLayoutDescriptorFromShaderInfo, getComputeBindGroupLayoutDescriptorFromShaderInfo };
