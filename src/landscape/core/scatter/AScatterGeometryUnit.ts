import Geometry from "../../../geometry/Geometry";

/**
 * [KO] AScatterGeometryUnit 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for AScatterGeometryUnit.
 */
export interface AScatterGeometryUnitInitOptions {
    /**
     * [KO] WebGPU 버텍스 및 인덱스 버퍼를 포함하는 지오메트리 객체
     * [EN] Geometry object containing WebGPU vertex and index buffers
     */
    geometry: Geometry;

    /**
     * [KO] 지오메트리의 정점 수
     * [EN] Number of vertices in the geometry
     */
    vertexCount: number;

    /**
     * [KO] 지오메트리의 인덱스 수 (인덱스 버퍼가 없으면 vertexCount와 동일)
     * [EN] Number of indices in the geometry (equal to vertexCount if no index buffer)
     */
    indexCount: number;

    /**
     * [KO] 인덱스 버퍼를 사용하는지 여부
     * [EN] Whether an index buffer is used
     */
    isIndexed: boolean;

    /**
     * [KO] 인덱스 포맷 (기본값: 'uint32')
     * [EN] Index format (default: 'uint32')
     */
    indexFormat?: GPUIndexFormat;

    /**
     * [KO] 버텍스 스트라이드 바이트 크기
     * [EN] Vertex stride in bytes
     */
    strideBytes: number;

    /**
     * [KO] GPU 인디렉트 버퍼 내 해당 서브메쉬의 바이트 오프셋
     * [EN] Byte offset of this sub-mesh within the GPU indirect buffer
     */
    indirectOffsetBytes?: number;

    /**
     * [KO] 인스턴스 버퍼 내 인스턴스 오프셋
     * [EN] Instance offset within the instance buffer
     */
    instanceBufferOffset?: number;

    /**
     * [KO] 인덱스 버퍼 내 시작 인덱스 오프셋 (기본값: 0)
     * [EN] Starting index offset within index buffer (default: 0)
     */
    firstIndex?: number;
}

/**
 * [KO] 스캐터 시스템(Foliage, FoliageShadow, Grass 등)에서 WebGPU 간접 드로우(Indirect Draw)를 수행하는 공통 지오메트리 렌더 단위 추상 기본 클래스입니다.
 * [EN] Common geometry rendering unit base abstract class executing WebGPU indirect draws across the scatter system (Foliage, FoliageShadow, Grass, etc.).
 *
 * **[KO] 아키텍처 및 역할:**
 * - **간접 드로우(Multi-Draw Indirect) 인프라**: GPU 버퍼(`GPUBuffer`) 상에 기록된 드로우 인자(`indexCount`, `instanceCount`, `firstIndex`, `baseVertex`, `firstInstance`)를 기반으로 CPU 개입 없는 초고속 일괄 렌더링을 수행합니다.
 * - **인덱스 및 비인덱스 드로우 자동 분기**: 인덱스 버퍼의 유무와 유효성에 따라 `drawIndexedIndirect` 또는 `drawIndirect` 명령을 자동으로 분기하여 패스 엔코더에 인코딩합니다.
 * - **오프셋 연계 관리**: 인디렉트 버퍼 내의 시작 오프셋(`indirectOffsetBytes`)과 인스턴스 행렬 버퍼 오프셋(`instanceBufferOffset`)을 캡슐화하여 렌더러가 단일 호출(`draw`)로 정확한 인스턴스를 렌더링하도록 지원합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Multi-Draw Indirect Infrastructure**: Executes zero-overhead batch rendering driven entirely by draw parameters stored in GPU buffers (`GPUBuffer`), eliminating CPU draw-call bottlenecks.
 * - **Automatic Indexed/Non-indexed Branching**: Intelligently routes commands to `drawIndexedIndirect` or `drawIndirect` depending on the presence and validity of GPU index buffers.
 * - **Offset Management**: Encapsulates both `indirectOffsetBytes` and `instanceBufferOffset`, enabling render dispatchers to draw exact instance ranges with a single `draw()` call.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 내부적으로 관리되는 추상 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class managed internally by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export abstract class AScatterGeometryUnit {
    #geometry: Geometry;
    #vertexCount: number;
    #indexCount: number;
    #firstIndex: number;
    #isIndexed: boolean;
    #indexFormat: GPUIndexFormat;
    #strideBytes: number;
    #indirectOffsetBytes: number;
    #instanceBufferOffset: number;

    constructor(init: AScatterGeometryUnitInitOptions) {
        this.#geometry = init.geometry;
        this.#vertexCount = init.vertexCount;
        this.#indexCount = init.indexCount;
        this.#firstIndex = init.firstIndex ?? 0;
        this.#isIndexed = init.isIndexed;
        this.#indexFormat = init.indexFormat || 'uint32';
        this.#strideBytes = init.strideBytes;
        this.#indirectOffsetBytes = init.indirectOffsetBytes ?? 0;
        this.#instanceBufferOffset = init.instanceBufferOffset ?? 0;
    }

    /**
     * [KO] 지오메트리 인스턴스를 반환합니다.
     * [EN] Returns the geometry instance.
     */
    get geometry(): Geometry {
        return this.#geometry;
    }

    /**
     * [KO] 지오메트리의 정점 수를 반환합니다.
     * [EN] Returns the vertex count of the geometry.
     */
    get vertexCount(): number {
        return this.#vertexCount;
    }

    /**
     * [KO] 지오메트리의 인덱스 수를 반환합니다.
     * [EN] Returns the index count of the geometry.
     */
    get indexCount(): number {
        return this.#indexCount;
    }

    /**
     * [KO] 인덱스 버퍼 내 시작 인덱스 오프셋을 반환합니다.
     * [EN] Returns the starting index offset within the index buffer.
     */
    get firstIndex(): number {
        return this.#firstIndex;
    }

    /**
     * [KO] 인덱스 버퍼 내 시작 인덱스 오프셋을 설정합니다.
     * [EN] Sets the starting index offset within the index buffer.
     */
    set firstIndex(val: number) {
        this.#firstIndex = val;
    }

    /**
     * [KO] 인덱스 버퍼 사용 여부를 반환합니다.
     * [EN] Returns whether an index buffer is used.
     */
    get isIndexed(): boolean {
        return this.#isIndexed;
    }

    /**
     * [KO] 인덱스 포맷을 반환합니다.
     * [EN] Returns the index format.
     */
    get indexFormat(): GPUIndexFormat {
        return this.#indexFormat;
    }

    /**
     * [KO] 버텍스 스트라이드(바이트 단위)를 반환합니다.
     * [EN] Returns the vertex stride in bytes.
     */
    get strideBytes(): number {
        return this.#strideBytes;
    }

    /**
     * [KO] GPU 인디렉트 버퍼 내 바이트 오프셋을 반환합니다.
     * [EN] Returns the byte offset within the GPU indirect buffer.
     */
    get indirectOffsetBytes(): number {
        return this.#indirectOffsetBytes;
    }

    /**
     * [KO] GPU 인디렉트 버퍼 내 바이트 오프셋을 설정합니다.
     * [EN] Sets the byte offset within the GPU indirect buffer.
     */
    set indirectOffsetBytes(val: number) {
        this.#indirectOffsetBytes = val;
    }

    /**
     * [KO] 인스턴스 버퍼 내 인스턴스 오프셋을 반환합니다.
     * [EN] Returns the instance offset within the instance buffer.
     */
    get instanceBufferOffset(): number {
        return this.#instanceBufferOffset;
    }

    /**
     * [KO] 인스턴스 버퍼 내 인스턴스 오프셋을 설정합니다.
     * [EN] Sets the instance offset within the instance buffer.
     */
    set instanceBufferOffset(val: number) {
        this.#instanceBufferOffset = val;
    }

    /**
     * [KO] 인디렉트 버퍼를 기반으로 GPU 간접 드로우 명령(`drawIndexedIndirect` 또는 `drawIndirect`)을 인코딩합니다.
     * [EN] Encodes the GPU indirect draw command (`drawIndexedIndirect` or `drawIndirect`) based on the indirect buffer.
     *
     * @param passEncoder - 렌더 패스 엔코더 또는 렌더 번들 엔코더
     * @param indirectGPUBuffer - 간접 드로우 인자가 포함된 GPU 버퍼
     * @param offsetBytes - 간접 드로우 인자 오프셋(바이트). 생략 시 기본 `indirectOffsetBytes` 사용.
     */
    draw(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder, indirectGPUBuffer: GPUBuffer, offsetBytes?: number): void {
        const offset = offsetBytes !== undefined ? offsetBytes : this.#indirectOffsetBytes;
        if (this.#isIndexed && this.#geometry?.indexBuffer?.gpuBuffer) {
            passEncoder.drawIndexedIndirect(indirectGPUBuffer, offset);
        } else {
            passEncoder.drawIndirect(indirectGPUBuffer, offset);
        }
    }

    /**
     * [KO] 지오메트리 유닛 리소스를 해제합니다.
     * [EN] Destroys the geometry unit resources.
     */
    destroy(): void {
        this.#geometry?.destroy();
    }
}

Object.freeze(AScatterGeometryUnit);
export default AScatterGeometryUnit;
