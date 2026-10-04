/**
 * [KO] 식생 서브메시 유니폼 버퍼 생성 유틸리티 모듈입니다.
 * [EN] Utility module for generating foliage sub-mesh uniform buffers.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";

const subMeshUniformData: Float32Array = new Float32Array(44);
const subMeshUniformUint32: Uint32Array = new Uint32Array(subMeshUniformData.buffer);
const identityMatrix: mat4 = mat4.create();

/**
 * [KO] 서브메시 유니폼 생성 결과 인터페이스입니다.
 * [EN] Interface representing the result of creating sub-mesh uniforms.
 */
export interface FoliageSubMeshUniformResult {
    /**
     * [KO] 생성된 유니폼 버퍼 (176바이트)
     * [EN] Created uniform buffer (176 bytes)
     */
    buffer: GPUBuffer;
    /**
     * [KO] 서브메시 유니폼 바인드 그룹
     * [EN] Sub-mesh uniform bind group
     */
    bindGroup: GPUBindGroup;
}

/**
 * [KO] PBR 렌더링에 필요한 176바이트 식생 서브메쉬 유니폼 버퍼 및 바인드 그룹을 생성합니다.
 * [EN] Creates a 176-byte foliage sub-mesh uniform buffer and bind group required for PBR rendering.
 * @param gpuDevice -
 * [KO] WebGPU 디바이스 인스턴스
 * [EN] WebGPU device instance
 * @param subMeshBindGroupLayout -
 * [KO] 서브메시 바인드 그룹 레이아웃
 * [EN] Sub-mesh bind group layout
 * @param globalWindBuffer -
 * [KO] 전역 바람 공유 유니폼 버퍼
 * [EN] Global wind shared uniform buffer
 * @param relMatrix -
 * [KO] 상대 모델 행렬
 * [EN] Relative model matrix
 * @param normMatrix -
 * [KO] 상대 노멀 행렬
 * [EN] Relative normal matrix
 * @param globalSlot -
 * [KO] 글로벌 머티리얼 슬롯 인덱스
 * [EN] Global material slot index
 * @param receiveShadow -
 * [KO] 그림자 수신 여부
 * [EN] Whether to receive shadows
 * @param isMasked -
 * [KO] 알파 마스킹 적용 여부
 * [EN] Whether alpha masking is applied
 * @param applyGroundBlend -
 * [KO] 지면 색상 블렌딩 적용 여부
 * [EN] Whether ground color blending is applied
 * @param groundBlendStrength -
 * [KO] 지면 색상 블렌딩 강도 (기본값: 0.8)
 * [EN] Ground color blending strength (default: 0.8)
 * @param groundBlendRange -
 * [KO] 지면 색상 블렌딩 높이 범위 (기본값: 1.5)
 * [EN] Ground color blending vertical range (default: 1.5)
 * @param windMultiplier -
 * [KO] 인스턴스별 바람 강도 배수 (기본값: 1.0)
 * [EN] Per-instance wind strength multiplier (default: 1.0)
 * @param treeHeight -
 * [KO] 식생 전체 높이 (기본값: 5.0)
 * [EN] Total foliage height (default: 5.0)
 * @returns
 * [KO] 생성된 버퍼 및 바인드 그룹
 * [EN] Created buffer and bind group
 */
export function createFoliagePBRSubMeshUniform(
    gpuDevice: GPUDevice,
    subMeshBindGroupLayout: GPUBindGroupLayout,
    globalWindBuffer: GPUBuffer,
    relMatrix: mat4,
    normMatrix: mat4,
    globalSlot: number,
    receiveShadow: boolean,
    isMasked: boolean,
    applyGroundBlend: boolean,
    groundBlendStrength?: number,
    groundBlendRange?: number,
    windMultiplier?: number,
    treeHeight?: number,
    windFlutterMultiplier?: number
): FoliageSubMeshUniformResult {
    const uniformBuffer = gpuDevice.createBuffer({
        label: `Foliage_SubMesh_UniformBuffer_${globalSlot}`,
        size: 176,
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

    floatView[36] = windMultiplier ?? 1.0;
    floatView[37] = isMasked ? (windFlutterMultiplier ?? 1.0) : 0.0;
    floatView[38] = treeHeight ?? 5.0;
    uintView[39] = 0;

    floatView[40] = applyGroundBlend ? (groundBlendStrength ?? 0.8) : 0.0;
    floatView[41] = groundBlendRange ?? 1.5;
    floatView[42] = 0.0;
    floatView[43] = 0.0;

    gpuDevice.queue.writeBuffer(uniformBuffer, 0, floatView.buffer, floatView.byteOffset, 176);

    const vertexBindGroup = gpuDevice.createBindGroup({
        label: `Foliage_SubMesh_BindGroup_${globalSlot}`,
        layout: subMeshBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {buffer: uniformBuffer}
            },
            {
                binding: 1,
                resource: {buffer: globalWindBuffer}
            }
        ]
    });

    return {buffer: uniformBuffer, bindGroup: vertexBindGroup};
}

/**
 * [KO] 섀도우 패스 전용 176바이트 식생 서브메쉬 유니폼 버퍼 및 바인드 그룹을 생성합니다.
 * [EN] Creates a 176-byte foliage sub-mesh uniform buffer and bind group dedicated to the shadow pass.
 * @param gpuDevice -
 * [KO] WebGPU 디바이스 인스턴스
 * [EN] WebGPU device instance
 * @param subMeshBindGroupLayout -
 * [KO] 서브메시 바인드 그룹 레이아웃
 * [EN] Sub-mesh bind group layout
 * @param globalWindBuffer -
 * [KO] 전역 바람 공유 유니폼 버퍼
 * [EN] Global wind shared uniform buffer
 * @param name -
 * [KO] 식생 인스턴스 이름
 * [EN] Foliage instance name
 * @param lodIndex -
 * [KO] 대상 LOD 인덱스
 * [EN] Target LOD index
 * @param windMultiplier -
 * [KO] 인스턴스별 바람 강도 배수 (기본값: 1.0)
 * [EN] Per-instance wind strength multiplier (default: 1.0)
 * @param treeHeight -
 * [KO] 식생 전체 높이 (기본값: 5.0)
 * [EN] Total foliage height (default: 5.0)
 * @param windFlutterMultiplier -
 * [KO] 잔잎 흔들림 배수
 * [EN] Leaf flutter multiplier
 * @returns
 * [KO] 생성된 버퍼 및 바인드 그룹
 * [EN] Created buffer and bind group
 */
export function createFoliageShadowSubMeshUniform(
    gpuDevice: GPUDevice,
    subMeshBindGroupLayout: GPUBindGroupLayout,
    globalWindBuffer: GPUBuffer,
    name: string,
    lodIndex: number,
    windMultiplier?: number,
    treeHeight?: number,
    windFlutterMultiplier?: number
): FoliageSubMeshUniformResult {
    const uniformBuffer = gpuDevice.createBuffer({
        label: `Foliage_ShadowSubMesh_UniformBuffer_${name}_LOD${lodIndex}`,
        size: 176,
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

    floatView[36] = windMultiplier ?? 1.0;
    floatView[37] = (windFlutterMultiplier ?? 1.0) * 0.5;
    floatView[38] = treeHeight ?? 5.0;
    uintView[39] = 0;

    floatView[40] = 0.0;
    floatView[41] = 1.5;
    floatView[42] = 0.0;
    floatView[43] = 0.0;

    gpuDevice.queue.writeBuffer(uniformBuffer, 0, floatView.buffer, floatView.byteOffset, 176);

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
            {
                binding: 1,
                resource: {
                    buffer: globalWindBuffer,
                },
            },
        ],
    });

    return {buffer: uniformBuffer, bindGroup: vertexBindGroup};
}
