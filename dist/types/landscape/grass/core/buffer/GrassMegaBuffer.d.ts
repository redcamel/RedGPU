import RedGPUContext from '../../../../context/RedGPUContext';
import AScatterMegaBuffer, { type ScatterBaseSegmentAllocation } from '../../../core/scatter/AScatterMegaBuffer';
import type Grass from '../Grass';
interface GrassDrawSlot {
    readonly indirectOffset: number;
}
/**
 * [KO] 단일 잔디(Grass) 타입에 대한 메가 버퍼 세그먼트 및 근거리/원거리 드로우 슬롯 할당 정보입니다.
 * [EN] Mega buffer segment and near/far draw slot allocation information for a single grass type.
 *
 * @category Landscape
 */
export interface GrassTypeAllocation extends ScatterBaseSegmentAllocation {
    /**
     * [KO] 현재 활성화된 인스턴스 수
     * [EN] Number of currently active instances
     */
    instanceCount: number;
    /**
     * [KO] 근거리(Near) 렌더링용 간접 드로우 슬롯 배열
     * [EN] Array of indirect draw slots for near rendering
     */
    nearSlots: GrassDrawSlot[];
    /**
     * [KO] 원거리(Far) 렌더링용 간접 드로우 슬롯 배열
     * [EN] Array of indirect draw slots for far rendering
     */
    farSlots: GrassDrawSlot[];
}
/**
 * [KO] 잔디 인스턴스 원본 버퍼, 컬링 결과 버퍼, 간접 드로우 인자 버퍼를 통합 관리하는 시스템 내부 메가 버퍼 클래스입니다.
 * [EN] Internal system mega buffer class that manages raw grass instance buffers, culled result buffers, and indirect draw argument buffers.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class GrassMegaBuffer extends AScatterMegaBuffer {
    #private;
    /**
     * [KO] `GrassMegaBuffer` 인스턴스를 생성합니다.
     * [EN] Creates a `GrassMegaBuffer` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param initialCapacity -
     * [KO] 초기 최대 인스턴스 수용량 (기본값: `131072`)
     * [EN] Initial maximum instance capacity (default: `131072`)
     * @param maxTypes -
     * [KO] 지원할 최대 잔디 타입 수 (기본값: `64`)
     * [EN] Maximum number of supported grass types (default: `64`)
     */
    constructor(redGPUContext: RedGPUContext, initialCapacity?: number, maxTypes?: number);
    /**
     * [KO] 메가 버퍼 및 컬링 결과 버퍼가 모두 준비되었는지 여부를 반환합니다.
     * [EN] Returns whether both the mega buffer and culled result buffer are ready.
     *
     * @returns
     * [KO] 준비 완료 여부
     * [EN] Whether the buffers are ready
     */
    get isReady(): boolean;
    /**
     * [KO] 특정 잔디 타입을 위한 메가 버퍼 세그먼트와 근거리/원거리 간접 드로우 슬롯을 할당합니다.
     * [EN] Allocates a mega buffer segment and near/far indirect draw slots for a specific grass type.
     *
     * @param typeId -
     * [KO] 잔디 타입 고유 식별자
     * [EN] Unique identifier of the grass type
     * @param maxInstances -
     * [KO] 할당할 최대 인스턴스 수
     * [EN] Maximum number of instances to allocate
     * @param renderUnits -
     * [KO] 서브메시 렌더 유닛의 인덱스 수 및 시작 인덱스 배열
     * [EN] Array of index counts and first indices for submesh render units
     * @returns
     * [KO] 할당된 잔디 타입 세그먼트 정보(`GrassTypeAllocation`)
     * [EN] Allocated grass type segment information (`GrassTypeAllocation`)
     */
    allocateType(typeId: number, maxInstances: number, renderUnits: {
        indexCount: number;
        firstIndex?: number;
    }[]): GrassTypeAllocation;
    /**
     * [KO] 지정된 잔디 타입의 할당 정보와 타입 파라미터 버퍼 데이터를 해제 및 초기화합니다.
     * [EN] Frees and resets the allocation information and type parameter buffer data for the specified grass type.
     *
     * @param typeId -
     * [KO] 해제할 잔디 타입 고유 식별자
     * [EN] Unique identifier of the grass type to free
     */
    freeType(typeId: number): void;
    /**
     * [KO] 지정된 잔디 타입 ID의 할당 정보를 반환합니다.
     * [EN] Returns the allocation information for the specified grass type ID.
     *
     * @param typeId -
     * [KO] 조회할 잔디 타입 고유 식별자
     * [EN] Unique identifier of the grass type to query
     * @returns
     * [KO] 할당 정보 객체(`GrassTypeAllocation`) 또는 미할당 시 `undefined`
     * [EN] Allocation information object (`GrassTypeAllocation`), or `undefined` if not allocated
     */
    getAllocation(typeId: number): GrassTypeAllocation | undefined;
    /**
     * [KO] 특정 잔디 타입의 컬링 거리 및 오프셋 파라미터를 GPU 버퍼에 갱신합니다.
     * [EN] Updates culling distance and offset parameters for a specific grass type to the GPU buffer.
     *
     * @param typeId -
     * [KO] 잔디 타입 고유 식별자
     * [EN] Unique identifier of the grass type
     * @param grass -
     * [KO] 잔디(`Grass`) 타입 인스턴스
     * [EN] `Grass` type instance
     * @param alloc -
     * [KO] 해당 잔디 타입의 할당 정보
     * [EN] Allocation information for the grass type
     */
    updateTypeParams(typeId: number, grass: Grass, alloc: GrassTypeAllocation): void;
    /**
     * [KO] 캐싱된 통합 컬링 바인드 그룹을 무효화합니다.
     * [EN] Invalidates the cached unified culling bind group.
     */
    invalidateUnifiedCullingBindGroup(): void;
    /**
     * [KO] 통합 컬링 컴퓨트 패스용 바인드 그룹을 반환하거나 새로 생성합니다.
     * [EN] Returns or creates the bind group for the unified culling compute pass.
     *
     * @param bindGroupLayout -
     * [KO] 컬링 파이프라인 바인드 그룹 레이아웃
     * [EN] Culling pipeline bind group layout
     * @param globalUniformBuffer -
     * [KO] 컬링 글로벌 유니폼 GPU 버퍼
     * [EN] Culling global uniform GPU buffer
     * @returns
     * [KO] 생성된 `GPUBindGroup` 또는 버퍼 미준비 시 `null`
     * [EN] Created `GPUBindGroup`, or `null` if buffers are not ready
     */
    getOrCreateUnifiedCullingBindGroup(bindGroupLayout: GPUBindGroupLayout, globalUniformBuffer: GPUBuffer): GPUBindGroup | null;
    /**
     * [KO] 메가 버퍼 용량 확장 시 컬링 결과 GPU 버퍼를 새 용량에 맞춰 재생성합니다.
     * [EN] Recreates the culled result GPU buffer to match the new capacity when the mega buffer expands.
     *
     * @param newCapacity -
     * [KO] 변경된 최대 인스턴스 수용량
     * [EN] Updated maximum instance capacity
     */
    onResizeBuffers(newCapacity: number): void;
    /**
     * [KO] 메가 버퍼 파기 시 바인드 그룹 캐시와 할당 맵을 정리합니다.
     * [EN] Cleans up bind group caches and allocation maps when the mega buffer is destroyed.
     */
    onDestroy(): void;
}
export default GrassMegaBuffer;
