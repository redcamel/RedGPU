import {mat4} from "gl-matrix";

const subMeshUniformData: Float32Array = new Float32Array(52);
const subMeshUniformUint32: Uint32Array = new Uint32Array(subMeshUniformData.buffer);
const identityMatrix: mat4 = mat4.create();

export interface FoliageSubMeshUniformResult {
    buffer: GPUBuffer;
    bindGroup: GPUBindGroup;
}

/**
 * [KO] PBR 렌더링에 필요한 208바이트 식생 서브메쉬 유니폼 버퍼 및 바인드 그룹을 생성합니다.
 * [EN] Creates a 208-byte foliage sub-mesh uniform buffer and bind group required for PBR rendering.
 */
export function createFoliagePBRSubMeshUniform(
    gpuDevice: GPUDevice,
    subMeshBindGroupLayout: GPUBindGroupLayout,
    relMatrix: mat4,
    normMatrix: mat4,
    globalSlot: number,
    receiveShadow: boolean,
    isMasked: boolean,
    applyGroundBlend: boolean,
    groundBlendStrength?: number,
    groundBlendRange?: number
): FoliageSubMeshUniformResult {
    const uniformBuffer = gpuDevice.createBuffer({
        label: `Foliage_SubMesh_UniformBuffer_${globalSlot}`,
        size: 208,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const floatView = subMeshUniformData;
    const uintView = subMeshUniformUint32;

    floatView.set(relMatrix, 0);
    floatView.set(normMatrix, 16);
    uintView[32] = globalSlot;

    const isIdentity = (
        relMatrix[0] === 1 && relMatrix[1] === 0 && relMatrix[2] === 0 && relMatrix[3] === 0 &&
        relMatrix[4] === 0 && relMatrix[5] === 1 && relMatrix[6] === 0 && relMatrix[7] === 0 &&
        relMatrix[8] === 0 && relMatrix[9] === 0 && relMatrix[10] === 1 && relMatrix[11] === 0 &&
        relMatrix[12] === 0 && relMatrix[13] === 0 && relMatrix[14] === 0 && relMatrix[15] === 1
    );
    uintView[33] = isIdentity ? 0 : 1;
    floatView[34] = receiveShadow ? 1.0 : 0.0;
    uintView[35] = 0;

    floatView[36] = 1.0;
    floatView[37] = 0.5;
    floatView[38] = 1.5;
    floatView[39] = 0.8;
    floatView[40] = 0.1;
    floatView[41] = 0.3;
    uintView[42] = 1;
    floatView[43] = 1.0;
    floatView[44] = isMasked ? 1.0 : 0.0;
    uintView[45] = 0;
    floatView[46] = 5.0;
    uintView[47] = 0;

    floatView[48] = applyGroundBlend ? (groundBlendStrength ?? 0.8) : 0.0;
    floatView[49] = groundBlendRange ?? 1.5;
    floatView[50] = 0.0;
    floatView[51] = 0.0;

    gpuDevice.queue.writeBuffer(uniformBuffer, 0, floatView.buffer, floatView.byteOffset, 208);

    const vertexBindGroup = gpuDevice.createBindGroup({
        label: `Foliage_SubMesh_BindGroup_${globalSlot}`,
        layout: subMeshBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {buffer: uniformBuffer}
            }
        ]
    });

    return {buffer: uniformBuffer, bindGroup: vertexBindGroup};
}

/**
 * [KO] 섀도우 패스 전용 208바이트 식생 서브메쉬 유니폼 버퍼 및 바인드 그룹을 생성합니다.
 * [EN] Creates a 208-byte foliage sub-mesh uniform buffer and bind group dedicated to the shadow pass.
 */
export function createFoliageShadowSubMeshUniform(
    gpuDevice: GPUDevice,
    subMeshBindGroupLayout: GPUBindGroupLayout,
    name: string,
    lodIndex: number
): FoliageSubMeshUniformResult {
    const uniformBuffer = gpuDevice.createBuffer({
        label: `Foliage_ShadowSubMesh_UniformBuffer_${name}_LOD${lodIndex}`,
        size: 208,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const floatView = subMeshUniformData;
    const uintView = subMeshUniformUint32;
    floatView.set(identityMatrix, 0);
    floatView.set(identityMatrix, 16);
    uintView[32] = 0;
    uintView[33] = 0;
    floatView[34] = 0.0;
    uintView[35] = 0;

    floatView[36] = 1.0;
    floatView[37] = 0.5;
    floatView[38] = 1.5;
    floatView[39] = 0.8;
    floatView[40] = 0.1;
    floatView[41] = 0.3;
    uintView[42] = 1;
    floatView[43] = 1.0;
    floatView[44] = 0.5;
    uintView[45] = 0;
    floatView[46] = 5.0;
    uintView[47] = 0;

    floatView[48] = 0.0;
    floatView[49] = 1.5;
    floatView[50] = 0.0;
    floatView[51] = 0.0;

    gpuDevice.queue.writeBuffer(uniformBuffer, 0, floatView.buffer, floatView.byteOffset, 208);

    const vertexBindGroup = gpuDevice.createBindGroup({
        label: `Foliage_ShadowSubMesh_BindGroup_${name}_LOD${lodIndex}`,
        layout: subMeshBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer,
                },
            },
        ],
    });

    return {buffer: uniformBuffer, bindGroup: vertexBindGroup};
}
