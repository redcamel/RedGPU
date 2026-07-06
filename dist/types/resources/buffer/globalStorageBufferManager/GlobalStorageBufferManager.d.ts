import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
interface BufferSlot {
    index: number;
    byteOffset: number;
}
/**
 * [KO] WebGPU의 성능 극대화를 목표로 하는 글로벌 SSBO(Storage Buffer) 아키텍처에서 버텍스 단계(Vertex Stage) 및 프래그먼트 단계(Fragment Stage)에 필요한 다양한 속성 정보(Properties)를 정밀하게 통제하고, CPU-GPU 데이터 업로드를 전담할 범용 글로벌 버퍼 매니저입니다.
 * [EN] Universal global buffer manager designed to control various properties required for the Vertex Stage and Fragment Stage in a global SSBO (Storage Buffer) architecture for maximizing WebGPU performance, handling CPU-to-GPU data uploads.
 *
 * @category Resource
 */
declare class GlobalStorageBufferManager extends RedGPUObject {
    #private;
    /**
     * [KO] 기하급수 성장(2배)에서 선형 성장으로 전환되는 임계 버퍼 크기 (32MB)
     * [EN] Threshold buffer size to transition from exponential (2x) to linear growth (32MB)
     */
    static readonly RESIZE_THRESHOLD_BYTES: number;
    /**
     * [KO] 임계 크기 초과 후 선형 증가 시 가산할 고정 메모리 바이트 크기 (8MB)
     * [EN] Fixed memory byte size to add during linear growth after exceeding the threshold (8MB)
     */
    static readonly RESIZE_LINEAR_ADDITION_BYTES: number;
    destroy(): void;
    /**
     * [KO] GlobalStorageBufferManager 인스턴스를 생성합니다.
     * [EN] Creates an instance of GlobalStorageBufferManager.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 컨텍스트 인스턴스
     * [EN] RedGPUContext context instance
     * @param elementSize -
     * [KO] 단일 슬롯 원소의 바이트 크기
     * [EN] Byte size of a single slot element
     * @param initialSlotCount -
     * [KO] 최초 슬롯 수용량 (기본값: 1024)
     * [EN] Initial slot capacity (default: 1024)
     * @param label -
     * [KO] 버퍼 식별용 레이블 (기본값: 'GLOBAL_STORAGE_BUFFER')
     * [EN] Buffer identification label (default: 'GLOBAL_STORAGE_BUFFER')
     */
    constructor(redGPUContext: RedGPUContext, elementSize: number, initialSlotCount?: number, label?: string);
    /**
     * [KO] GPUBuffer 리소스 인스턴스를 반환합니다.
     * [EN] Returns the GPUBuffer resource instance.
     */
    get gpuBuffer(): GPUBuffer;
    /**
     * [KO] 버퍼가 수용할 수 있는 전체 슬롯 개수(용량)를 반환합니다.
     * [EN] Returns the total number of slots (capacity) the buffer can accommodate.
     */
    get totalSlotCount(): number;
    /**
     * [KO] 단일 슬롯 원소의 바이트 크기를 반환합니다.
     * [EN] Returns the byte size of a single slot element.
     */
    get elementSize(): number;
    /**
     * [KO] 버퍼 식별 레이블을 반환합니다.
     * [EN] Returns the buffer identification label.
     */
    get label(): string;
    /**
     * [KO] CPU 측 백킹 미러 버퍼 메모리 공간(ArrayBuffer)을 반환합니다. (디버그 및 테스트 용도)
     * [EN] Returns the CPU-side backing mirror buffer memory space (ArrayBuffer). (For debugging and testing purposes)
     */
    get cpuData(): ArrayBuffer;
    /**
     * [KO] 현재 더티로 추적된 슬롯의 최소 인덱스를 반환합니다. (디버그 및 테스트 용도)
     * [EN] Returns the minimum index of the slot currently tracked as dirty. (For debugging and testing purposes)
     */
    get dirtyMin(): number;
    /**
     * [KO] 현재 더티로 추적된 슬롯의 최대 인덱스를 반환합니다. (디버그 및 테스트 용도)
     * [EN] Returns the maximum index of the slot currently tracked as dirty. (For debugging and testing purposes)
     */
    get dirtyMax(): number;
    /**
     * [KO] 테스트 및 디버깅을 위해 하드웨어 허용 최대 버퍼 바이트 크기 값을 반환합니다.
     * [EN] Returns the hardware-allowed maximum buffer byte size for testing and debugging.
     */
    get safeMaxBufferSize(): number;
    /**
     * [KO] 현재 할당되어 사용 중인 슬롯의 개수를 반환합니다.
     * [EN] Returns the number of currently allocated and active slots.
     */
    get activeSlotCount(): number;
    /**
     * [KO] 남은 사용 가능한 슬롯의 개수를 반환합니다.
     * [EN] Returns the number of remaining available slots.
     */
    get remainingSlotCount(): number;
    /**
     * [KO] 리사이즈 콜백을 등록합니다. 버퍼 용량 한도 초과로 동적 리사이징이 실행된 후 호출됩니다.
     * [EN] Registers a resize callback. Called after dynamic resizing is executed due to capacity limit exceedance.
     *
     * @param callback -
     * [KO] 리사이즈 실행 후 호출될 콜백 함수
     * [EN] Callback function to be called after resizing
     */
    setOnResize(callback: (manager: GlobalStorageBufferManager) => void): void;
    /**
     * [KO] 버퍼 슬롯을 할당합니다. 해제 대기 중인 빈 슬롯 인덱스가 있다면 우선 재사용합니다.
     * [EN] Allocates a buffer slot. Reuses freed slot indices first if available in the pool.
     *
     * @returns
     * [KO] 할당된 슬롯의 인덱스 및 바이트 오프셋 정보
     * [EN] Information of the allocated slot's index and byte offset
     */
    allocateSlot(): BufferSlot;
    /**
     * [KO] 할당받았던 슬롯 인덱스를 반환하여 재사용 대기 풀에 등록합니다.
     * [EN] Frees the allocated slot index and registers it back to the reuse pool.
     *
     * @param index -
     * [KO] 반환할 슬롯의 인덱스 번호
     * [EN] Index number of the slot to be freed
     */
    freeSlot(index: number): void;
    /**
     * [KO] 특정 슬롯 인덱스 영역에 Float32 데이터를 기록하고 해당 범위를 더티로 추적합니다.
     * [EN] Writes Float32 data to a specific slot index region and tracks the region as dirty.
     *
     * @param index -
     * [KO] 데이터를 갱신할 슬롯의 인덱스 번호
     * [EN] Index number of the slot to update data
     * @param data -
     * [KO] 업로드할 Float32 데이터 배열
     * [EN] Float32 data array to upload
     * @param floatOffsetInsideElement -
     * [KO] 해당 슬롯 내부에서의 추가 float 단위 오프셋 (기본값: 0)
     * [EN] Additional float unit offset inside the slot (default: 0)
     */
    updateFloatData(index: number, data: Float32Array, floatOffsetInsideElement?: number): void;
    /**
     * [KO] 특정 슬롯 인덱스 영역에 Uint32 데이터를 기록하고 해당 범위를 더티로 추적합니다.
     * [EN] Writes Uint32 data to a specific slot index region and tracks the region as dirty.
     *
     * @param index -
     * [KO] 데이터를 갱신할 슬롯의 인덱스 번호
     * [EN] Index number of the slot to update data
     * @param data -
     * [KO] 업로드할 Uint32 데이터 배열
     * [EN] Uint32 data array to upload
     * @param uintOffsetInsideElement -
     * [KO] 해당 슬롯 내부에서의 추가 uint 단위 오프셋 (기본값: 0)
     * [EN] Additional uint unit offset inside the slot (default: 0)
     */
    updateUintData(index: number, data: Uint32Array, uintOffsetInsideElement?: number): void;
    /**
     * [KO] 더티 트래킹 범위(실제 데이터가 수정된 구간)만 선별하여 GPU 메모리로 업로드합니다.
     * [EN] Uploads only the dirty-tracked range (the portion with modified data) to the GPU memory.
     */
    flush(): void;
}
export default GlobalStorageBufferManager;
export type { BufferSlot };
