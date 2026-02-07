const getBindGroupLayoutDescriptorFromShaderInfo = (
    SHADER_INFO,
    targetGroupIndex: number,
    visibility: GPUFlagsConstant,
    useMSAA: boolean = true
) => {
    const {textures, samplers, uniforms, storage} = SHADER_INFO
    const entries: GPUBindGroupLayoutEntry[] = []
    for (const k in storage) {
        const info = storage[k]
        // console.log(info, storage)
        const {binding, name, group, type} = info
        if (info.access) {
            const accessType = {
                'write': 'write-only-storage',
                'read': 'read-only-storage',
                'read_write': 'read-write-storage',
            }[info.access]
            if (targetGroupIndex === group) {
                entries.push(
                    {binding, visibility, buffer: {type: accessType}},
                )
            }
        } else {
            if (targetGroupIndex === group) {
                const {access, format} = type
                const accessType = {
                    'write': 'write-only',
                    'read': 'read-only',
                    'read_write': 'read-write',
                }[access]
                const formatType = format.name
                entries.push(
                    {binding, visibility, storageTexture: {access: accessType, format: formatType}},
                )
            }
        }
    }
    for (const k in textures) {
        const info = textures[k]
        const {binding, name, group, type} = info
        const {name: textureType} = type
        console.log('textureType', textureType, useMSAA)
        if (targetGroupIndex === group) {
            entries.push(
                {
                    binding,
                    visibility,
                    texture: textureType === "texture_depth_2d" || textureType === "texture_depth_multisampled_2d" ? {
                        viewDimension: '2d',
                        sampleType: 'depth',
                        multisampled: useMSAA
                    } : textureType === "texture_cube" ? {
                        viewDimension: 'cube'
                    } : textureType === "texture_2d_array" ? {
                        viewDimension: '2d-array',
                        sampleType: 'float',
                        multisampled: false
                    } : {}
                }
            )
        }
    }
    for (const k in samplers) {
        const info = samplers[k]
        const {binding, name, group} = info
        if (targetGroupIndex === group) {
            entries.push(
                {binding, visibility, sampler: {type: 'filtering'}},
            )
        }
    }
    for (const k in uniforms) {
        const info = uniforms[k]
        const {binding, name, group} = info
        if (targetGroupIndex === group) {
            entries.push(
                {binding, visibility, buffer: {type: 'uniform'}},
            )
        }
    }
    console.log('GPUBindGroupLayoutEntry', entries)
    return {
        entries
    }
}
/**
 * [KO] 셰이더 정보로부터 프래그먼트 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a fragment bind group layout descriptor from shader information.
 *
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 * @returns
 * [KO] 바인드 그룹 레이아웃 디스크립터
 * [EN] Bind group layout descriptor
 */
const getFragmentBindGroupLayoutDescriptorFromShaderInfo = (SHADER_INFO, targetGroupIndex: number) => {
    return getBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex, GPUShaderStage.FRAGMENT)
}
/**
 * [KO] 셰이더 정보로부터 버텍스 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a vertex bind group layout descriptor from shader information.
 *
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 * @returns
 * [KO] 바인드 그룹 레이아웃 디스크립터
 * [EN] Bind group layout descriptor
 */
const getVertexBindGroupLayoutDescriptorFromShaderInfo = (SHADER_INFO, targetGroupIndex: number) => {
    return getBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex, GPUShaderStage.VERTEX)
}
/**
 * [KO] 셰이더 정보로부터 컴퓨트 바인드 그룹 레이아웃 디스크립터를 생성합니다.
 * [EN] Generates a compute bind group layout descriptor from shader information.
 *
 * @param SHADER_INFO -
 * [KO] 셰이더 정보
 * [EN] Shader information
 * @param targetGroupIndex -
 * [KO] 타겟 그룹 인덱스
 * [EN] Target group index
 * @param useMSAA -
 * [KO] MSAA 사용 여부
 * [EN] Whether to use MSAA
 * @returns
 * [KO] 바인드 그룹 레이아웃 디스크립터
 * [EN] Bind group layout descriptor
 */
const getComputeBindGroupLayoutDescriptorFromShaderInfo = (SHADER_INFO, targetGroupIndex: number, useMSAA: boolean) => {
    return getBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex, GPUShaderStage.COMPUTE, useMSAA)
}
export {
    getFragmentBindGroupLayoutDescriptorFromShaderInfo,
    getVertexBindGroupLayoutDescriptorFromShaderInfo,
    getComputeBindGroupLayoutDescriptorFromShaderInfo
}
