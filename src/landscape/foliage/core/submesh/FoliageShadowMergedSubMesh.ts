/**
 * [KO] 식생 그림자 패스 전용 통합 서브메시 모듈입니다.
 * [EN] Foliage shadow pass dedicated merged sub-mesh module.
 * @packageDocumentation
 */

import Geometry from "../../../../geometry/Geometry";
import AScatterGeometryUnit from "../../../core/scatter/AScatterGeometryUnit";

/**
 * [KO] FoliageShadowMergedSubMesh 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for FoliageShadowMergedSubMesh.
 */
export interface FoliageShadowMergedSubMeshInitOptions {
    /**
     * [KO] 소속 LOD 인덱스
     * [EN] Associated LOD index
     */
    lodIndex: number;
    /**
     * [KO] 통합된 위치 전용 지오메트리
     * [EN] Merged position-only geometry
     */
    geometry: Geometry;
    /**
     * [KO] 정점 개수
     * [EN] Vertex count
     */
    vertexCount: number;
    /**
     * [KO] 인덱스 개수
     * [EN] Index count
     */
    indexCount: number;
    /**
     * [KO] 인덱스 버퍼 사용 여부
     * [EN] Whether indexed buffer is used
     */
    isIndexed: boolean;
    /**
     * [KO] 인덱스 포맷 (기본값: 'uint32')
     * [EN] Index format (default: 'uint32')
     */
    indexFormat?: GPUIndexFormat;
    /**
     * [KO] 정점 스트라이드 바이트 수 (기본값: 12)
     * [EN] Vertex stride in bytes (default: 12)
     */
    strideBytes?: number;
    /**
     * [KO] 버텍스 셰이더 유니폼 버퍼 (208 bytes)
     * [EN] Vertex shader uniform buffer (208 bytes)
     */
    vertexUniformBuffer: GPUBuffer;
    /**
     * [KO] 버텍스 셰이더 유니폼 바인드 그룹
     * [EN] Vertex shader uniform bind group
     */
    vertexUniformBindGroup: GPUBindGroup;
    /**
     * [KO] 인스턴스 버퍼 시작 오프셋
     * [EN] Instance buffer start offset
     */
    instanceBufferOffset?: number;
    /**
     * [KO] 간접 드로우 인다이렉트 버퍼 시작 바이트 오프셋
     * [EN] Indirect draw buffer start byte offset
     */
    indirectOffsetBytes?: number;
}

/**
 * [KO] 그림자 패스(Shadow Pass) 렌더링을 위해 단일 위치 전용(Position-only) 지오메트리로 통합된 식생 서브메쉬 클래스입니다.
 * [EN] Foliage sub-mesh class combined into unified position-only geometry for shadow pass rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class FoliageShadowMergedSubMesh extends AScatterGeometryUnit {
    #windFloatBuffer: Float32Array = new Float32Array(12);
    #windUintBuffer: Uint32Array = new Uint32Array(this.#windFloatBuffer.buffer);

    #lodIndex: number;
    #vertexUniformBuffer: GPUBuffer;
    #vertexUniformBindGroup: GPUBindGroup;

    constructor(init: FoliageShadowMergedSubMeshInitOptions) {
        super({
            geometry: init.geometry,
            vertexCount: init.vertexCount,
            indexCount: init.indexCount,
            isIndexed: init.isIndexed,
            indexFormat: init.indexFormat || 'uint32',
            strideBytes: init.strideBytes ?? 12,
            instanceBufferOffset: init.instanceBufferOffset ?? 0,
            indirectOffsetBytes: init.indirectOffsetBytes ?? 0,
        });

        this.#lodIndex = init.lodIndex;
        this.#vertexUniformBuffer = init.vertexUniformBuffer;
        this.#vertexUniformBindGroup = init.vertexUniformBindGroup;
    }

    /**
     * [KO] 서브메쉬의 LOD 인덱스를 반환합니다.
     * [EN] Returns the LOD index of the sub-mesh.
     */
    get lodIndex(): number {
        return this.#lodIndex;
    }

    /**
     * [KO] 버텍스 셰이더 Uniform 버퍼를 반환합니다.
     * [EN] Returns the vertex shader uniform buffer.
     */
    get vertexUniformBuffer(): GPUBuffer {
        return this.#vertexUniformBuffer;
    }

    /**
     * [KO] 버텍스 셰이더 Uniform 바인드 그룹을 반환합니다.
     * [EN] Returns the vertex shader uniform bind group.
     */
    get vertexUniformBindGroup(): GPUBindGroup {
        return this.#vertexUniformBindGroup;
    }

    /**
     * [KO] 바람 시뮬레이션 파라미터를 유니폼 버퍼에 기록합니다.
     * [EN] Writes wind simulation parameters to the uniform buffer.
     * @param gpuDevice -
     * [KO] WebGPU 디바이스 인스턴스
     * [EN] WebGPU device instance
     * @param windDirX -
     * [KO] 바람 방향 X
     * [EN] Wind direction X
     * @param windDirY -
     * [KO] 바람 방향 Y (Z축 대응)
     * [EN] Wind direction Y (maps to Z axis)
     * @param windSpeed -
     * [KO] 바람 속도
     * [EN] Wind speed
     * @param windStrength -
     * [KO] 바람 강도
     * [EN] Wind strength
     * @param windFreq -
     * [KO] 바람 주파수
     * [EN] Wind frequency
     * @param windFlutterStrength -
     * [KO] 잔잎 흔들림 강도
     * [EN] Leaf flutter strength
     * @param windEnabled -
     * [KO] 바람 효과 활성화 여부
     * [EN] Whether wind effect is enabled
     * @param windMultiplier -
     * [KO] 인스턴스별 바람 강도 배수
     * [EN] Per-instance wind strength multiplier
     * @param windFlutterMultiplier -
     * [KO] 인스턴스별 잔잎 흔들림 배수
     * [EN] Per-instance flutter multiplier
     * @param treeHeight -
     * [KO] 식생 전체 높이
     * [EN] Total foliage height
     */
    updateWindParams(
        gpuDevice: GPUDevice,
        windDirX: number,
        windDirY: number,
        windSpeed: number,
        windStrength: number,
        windFreq: number,
        windFlutterStrength: number,
        windEnabled: boolean,
        windMultiplier: number,
        windFlutterMultiplier: number,
        treeHeight: number
    ): void {
        if (!this.#vertexUniformBuffer || !gpuDevice) return;
        const fView = this.#windFloatBuffer;
        const uView = this.#windUintBuffer;
        fView[0] = windDirX;
        fView[1] = windDirY;
        fView[2] = windSpeed;
        fView[3] = windStrength;
        fView[4] = windFreq;
        fView[5] = windFlutterStrength;
        uView[6] = windEnabled ? 1 : 0;
        fView[7] = windMultiplier;
        fView[8] = windFlutterMultiplier;
        uView[9] = 0;
        fView[10] = treeHeight;
        uView[11] = 0;

        gpuDevice.queue.writeBuffer(
            this.#vertexUniformBuffer,
            36 * 4,
            fView.buffer,
            fView.byteOffset,
            48
        );
    }

    /**
     * [KO] 서브메쉬 리소스를 해제합니다.
     * [EN] Destroys sub-mesh resources.
     */
    override destroy(): void {
        this.#vertexUniformBuffer?.destroy();
        super.destroy();
    }
}

Object.freeze(FoliageShadowMergedSubMesh);
export default FoliageShadowMergedSubMesh;
