/**
 * [KO] 식생 서브메시의 인스턴스별 바람 강도 및 잔잎 떨림 배수를 유니폼 버퍼에 기록하는 공통 헬퍼입니다. (Zero-GC)
 * [EN] Common helper that writes per-instance wind multiplier, flutter multiplier, and tree height to the sub-mesh uniform buffer. (Zero-GC)
 * @packageDocumentation
 */

const windMultipliersFloatBuffer: Float32Array = new Float32Array(3);

/**
 * [KO] 인스턴스별 바람 강도 배수, 잔잎 떨림 배수 및 수목 높이를 유니폼 버퍼에 기록합니다. (16 bytes, Zero-GC)
 * [EN] Writes per-instance wind multiplier, flutter multiplier, and tree height to uniform buffer. (16 bytes, Zero-GC)
 *
 * @param gpuDevice - WebGPU 디바이스 인스턴스
 * @param vertexUniformBuffer - 버텍스 유니폼 버퍼 GPUBuffer
 * @param windMultiplier - 인스턴스별 바람 강도 배수
 * @param windFlutterMultiplier - 인스턴스별 잔잎 흔들림 배수
 * @param treeHeight - 식생 전체 높이
 */
export function updateSubMeshWindMultipliers(
    gpuDevice: GPUDevice,
    vertexUniformBuffer: GPUBuffer | null | undefined,
    windMultiplier: number,
    windFlutterMultiplier: number,
    treeHeight: number
): void {
    if (!vertexUniformBuffer || !gpuDevice) return;
    const fView = windMultipliersFloatBuffer;
    fView[0] = windMultiplier;
    fView[1] = windFlutterMultiplier;
    fView[2] = treeHeight;

    gpuDevice.queue.writeBuffer(
        vertexUniformBuffer,
        35 * 4,
        fView.buffer,
        fView.byteOffset,
        12
    );
}
