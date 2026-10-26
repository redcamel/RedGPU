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
const getUnionBindGroupLayoutDescriptorFromShaderInfos = (
    stageInfoList: { shaderInfo: any, visibility: GPUFlagsConstant }[],
    targetGroupIndex: number,
    overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>
): GPUBindGroupLayoutDescriptor => {
    const entryMap = new Map<number, GPUBindGroupLayoutEntry>();

    for (const {shaderInfo, visibility} of stageInfoList) {
        if (!shaderInfo) continue;
        const {textures, samplers, uniforms, storage} = shaderInfo;

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
                    const accessType: GPUBufferBindingType = {
                        'write': 'storage',
                        'read': 'read-only-storage',
                        'read_write': 'storage',
                    }[rawAccess] || 'storage';

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
const getFragmentBindGroupLayoutDescriptorFromShaderInfo = (
    SHADER_INFO: any,
    targetGroupIndex: number,
    overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>
) => {
    return getBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex, GPUShaderStage.FRAGMENT, overrideEntries);
};

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
const getVertexBindGroupLayoutDescriptorFromShaderInfo = (
    SHADER_INFO: any,
    targetGroupIndex: number,
    overrideEntries?: Record<number, Partial<GPUBindGroupLayoutEntry>>
) => {
    return getBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex, GPUShaderStage.VERTEX, overrideEntries);
};

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
