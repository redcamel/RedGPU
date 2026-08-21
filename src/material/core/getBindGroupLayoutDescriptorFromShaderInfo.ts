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
const getUnionBindGroupLayoutDescriptorFromShaderInfos = (
    stageInfoList: { shaderInfo: any, visibility: GPUFlagsConstant }[],
    targetGroupIndex: number,
    overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>
): GPUBindGroupLayoutDescriptor => {
    const entryMap = new Map<number, GPUBindGroupLayoutEntry>();

    for (const {shaderInfo, visibility} of stageInfoList) {
        if (!shaderInfo) continue;
        const {textures, samplers, uniforms, storage} = shaderInfo;

        // 1. Storage Buffers & Storage Textures
        for (const k in storage) {
            const info = storage[k];
            const {binding, group, type} = info;
            if (targetGroupIndex === group) {
                const isStorageTexture = type?.name?.startsWith('texture_storage') || type?.name?.includes('storage_texture');
                const rawAccess = info.access || info.acccess || type?.access || 'read';

                if (isStorageTexture) {
                    const accessType = {
                        'write': 'write-only',
                        'read': 'read-only',
                        'read_write': 'read-write',
                    }[rawAccess] || 'read-only';
                    const formatType = type?.format?.name || 'rgba8unorm';

                    if (entryMap.has(binding)) {
                        entryMap.get(binding)!.visibility |= visibility;
                    } else {
                        entryMap.set(binding, {
                            binding,
                            visibility,
                            storageTexture: {
                                access: accessType as GPUStorageTextureAccess,
                                format: formatType as GPUTextureFormat
                            }
                        });
                    }
                } else {
                    const accessType = {
                        'write': 'write-only-storage',
                        'read': 'read-only-storage',
                        'read_write': 'read-write-storage',
                    }[rawAccess] || 'read-only-storage';

                    if (entryMap.has(binding)) {
                        entryMap.get(binding)!.visibility |= visibility;
                    } else {
                        entryMap.set(binding, {
                            binding,
                            visibility,
                            buffer: {type: accessType as GPUBufferBindingType}
                        });
                    }
                }
            }
        }

        // 2. Textures
        for (const k in textures) {
            const info = textures[k];
            const {binding, group, type} = info;
            if (targetGroupIndex === group) {
                const textureType = type?.name || '';
                if (entryMap.has(binding)) {
                    entryMap.get(binding)!.visibility |= visibility;
                } else {
                    let textureDesc: GPUTextureBindingLayout = {};
                    if (textureType === "texture_depth_2d" || textureType === "texture_depth_multisampled_2d") {
                        textureDesc = {
                            viewDimension: '2d',
                            sampleType: 'depth',
                            multisampled: textureType === "texture_depth_multisampled_2d"
                        };
                    } else if (textureType === "texture_cube") {
                        textureDesc = {viewDimension: 'cube'};
                    } else if (textureType === "texture_3d") {
                        textureDesc = {viewDimension: '3d'};
                    } else if (textureType === "texture_2d_array") {
                        textureDesc = {
                            viewDimension: '2d-array',
                            sampleType: 'float',
                            multisampled: false
                        };
                    } else {
                        textureDesc = {
                            viewDimension: '2d',
                            sampleType: (info.sampleType || 'float') as GPUTextureSampleType
                        };
                    }

                    entryMap.set(binding, {
                        binding,
                        visibility,
                        texture: textureDesc
                    });
                }
            }
        }

        // 3. Samplers
        for (const k in samplers) {
            const info = samplers[k];
            const {binding, group, type} = info;
            if (targetGroupIndex === group) {
                if (entryMap.has(binding)) {
                    entryMap.get(binding)!.visibility |= visibility;
                } else {
                    const samplerType = (type?.name === 'sampler_comparison' || info.type === 'comparison') ? 'comparison' : 'filtering';
                    entryMap.set(binding, {
                        binding,
                        visibility,
                        sampler: {type: samplerType as GPUSamplerBindingType}
                    });
                }
            }
        }

        // 4. Uniforms
        for (const k in uniforms) {
            const info = uniforms[k];
            const {binding, group} = info;
            if (targetGroupIndex === group) {
                if (entryMap.has(binding)) {
                    entryMap.get(binding)!.visibility |= visibility;
                } else {
                    entryMap.set(binding, {
                        binding,
                        visibility,
                        buffer: {type: 'uniform'}
                    });
                }
            }
        }
    }

    // 오버라이드 적용 (선택)
    if (overrideEntries) {
        for (const b in overrideEntries) {
            const numBinding = Number(b);
            if (entryMap.has(numBinding)) {
                const target = entryMap.get(numBinding)!;
                Object.assign(target, overrideEntries[numBinding]);
            }
        }
    }

    const entries = Array.from(entryMap.values()).sort((a, b) => a.binding - b.binding);
    return {entries};
};

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
const getBindGroupLayoutDescriptorFromShaderInfo = (
    SHADER_INFO: any,
    targetGroupIndex: number,
    visibility: GPUFlagsConstant,
    overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>
): GPUBindGroupLayoutDescriptor => {
    return getUnionBindGroupLayoutDescriptorFromShaderInfos(
        [{shaderInfo: SHADER_INFO, visibility}],
        targetGroupIndex,
        overrideEntries
    );
};

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
const getFragmentBindGroupLayoutDescriptorFromShaderInfo = (
    SHADER_INFO: any,
    targetGroupIndex: number,
    overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>
) => {
    return getBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex, GPUShaderStage.FRAGMENT, overrideEntries);
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
 * @param overrideEntries -
 * [KO] 특정 바인딩 오버라이드 맵 (선택)
 * [EN] Optional binding override map
 */
const getVertexBindGroupLayoutDescriptorFromShaderInfo = (
    SHADER_INFO: any,
    targetGroupIndex: number,
    overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>
) => {
    return getBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex, GPUShaderStage.VERTEX, overrideEntries);
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
 * @param useMSAAOrOverride -
 * [KO] MSAA 사용 여부 또는 바인딩 오버라이드 맵 (선택)
 * [EN] MSAA boolean flag or optional binding override map
 * @param overrideEntries -
 * [KO] 특정 바인딩 오버라이드 맵 (선택)
 * [EN] Optional binding override map
 */
const getComputeBindGroupLayoutDescriptorFromShaderInfo = (
    SHADER_INFO: any,
    targetGroupIndex: number,
    useMSAAOrOverride?: boolean | Record<number, Partial<GPUBindGroupLayoutEntry>>,
    overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>
) => {
    const overrides = typeof useMSAAOrOverride === 'object' ? useMSAAOrOverride : overrideEntries;
    return getBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex, GPUShaderStage.COMPUTE, overrides);
};

export {
    getFragmentBindGroupLayoutDescriptorFromShaderInfo,
    getVertexBindGroupLayoutDescriptorFromShaderInfo,
    getComputeBindGroupLayoutDescriptorFromShaderInfo,
    getUnionBindGroupLayoutDescriptorFromShaderInfos,
    getBindGroupLayoutDescriptorFromShaderInfo
};

