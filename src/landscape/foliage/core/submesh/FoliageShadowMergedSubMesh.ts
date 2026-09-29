import Geometry from "../../../../geometry/Geometry";
import LandscapeGeometryUnit from "../../../core/geometry/LandscapeGeometryUnit";

/**
 * [KO] FoliageShadowMergedSubMesh 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for FoliageShadowMergedSubMesh.
 */
export interface FoliageShadowMergedSubMeshInitOptions {
    lodIndex: number;
    geometry: Geometry;
    vertexCount: number;
    indexCount: number;
    isIndexed: boolean;
    indexFormat?: GPUIndexFormat;
    strideBytes?: number;
    vertexUniformBuffer: GPUBuffer;
    vertexUniformBindGroup: GPUBindGroup;
    instanceBufferOffset?: number;
    indirectOffsetBytes?: number;
}

/**
 * [KO] 그림자 패스(Shadow Pass) 렌더링을 위해 단일 위치 전용(Position-only) 지오메트리로 통합된 식생 서브메쉬 클래스입니다.
 * [EN] Foliage sub-mesh class combined into unified position-only geometry for shadow pass rendering.
 */
export class FoliageShadowMergedSubMesh extends LandscapeGeometryUnit {
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
