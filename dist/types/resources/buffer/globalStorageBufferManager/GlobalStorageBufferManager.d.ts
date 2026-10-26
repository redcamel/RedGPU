import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
interface BufferSlot {
    index: number;
    byteOffset: number;
}
/**
 * [KO] 글로벌 SSBO(Storage Buffer)의 슬롯 할당·해제와 CPU→GPU 데이터 업로드를 관리하는 매니저입니다.
 * [EN] Manager that handles slot allocation/release and CPU-to-GPU data upload for a global SSBO (Storage Buffer).
 *
 * [KO] 변경된 슬롯 범위만 업로드(더티 트래킹)하며, 용량 초과 시 32MB까지는 2배, 이후에는 8MB씩 선형 확장합니다 (최대 128MB).
 * [EN] Uploads only the modified slot range (dirty tracking); on overflow it grows 2x up to 32MB, then linearly by 8MB (max 128MB).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const globalVertexSSBO = redGPUContext.globalVertexSSBO;
 * ```
 *
 * @category Resource
 */
declare class GlobalStorageBufferManager extends RedGPUObject {
    #private;
    /**
     * [KO] 2배 성장에서 선형 성장으로 전환되는 임계 버퍼 크기 (32MB)
     * [EN] Buffer size threshold for switching from 2x growth to linear growth (32MB)
     */
    static readonly RESIZE_THRESHOLD_BYTES: number;
    /**
     * [KO] 임계 크기 초과 후 선형 성장 시 추가되는 바이트 크기 (8MB)
     * [EN] Bytes added per linear growth step after exceeding the threshold (8MB)
     */
    static readonly RESIZE_LINEAR_ADDITION_BYTES: number;
    /**
     * [KO] 지정한 슬롯 크기와 수용량으로 GPU 스토리지 버퍼와 CPU 미러 버퍼를 생성합니다.
     * [EN] Creates the GPU storage buffer and CPU mirror buffer with the given slot size and capacity.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param elementSize -
     * [KO] 단일 슬롯 원소의 바이트 크기
     * [EN] Byte size of a single slot element
     * @param initialSlotCount -
     * [KO] 초기 슬롯 수용량 (기본값: 1024)
     * [EN] Initial slot capacity (default: 1024)
     * @param label -
     * [KO] 버퍼 디버그 레이블 (기본값: 'GLOBAL_STORAGE_BUFFER')
     * [EN] Buffer debug label (default: 'GLOBAL_STORAGE_BUFFER')
     * @throws
     * [KO] 초기 버퍼 크기가 하드웨어 허용 최대 크기(최대 128MB)를 초과하면 에러를 발생시킵니다.
     * [EN] Throws an error if the initial buffer size exceeds the hardware-allowed maximum (up to 128MB).
     */
    constructor(redGPUContext: RedGPUContext, elementSize: number, initialSlotCount?: number, label?: string);
    /**
     * [KO] GPU 스토리지 버퍼를 반환합니다. 리사이즈 시 새 버퍼로 교체됩니다.
     * [EN] Returns the GPU storage buffer. It is replaced with a new buffer on resize.
     *
     * @returns
     * [KO] GPUBuffer 객체
     * [EN] GPUBuffer object
     */
    get gpuBuffer(): GPUBuffer;
    /**
     * [KO] 버퍼의 전체 슬롯 수용량을 반환합니다.
     * [EN] Returns the total slot capacity of the buffer.
     *
     * @returns
     * [KO] 전체 슬롯 개수
     * [EN] Total slot count
     */
    get totalSlotCount(): number;
    /**
     * [KO] 단일 슬롯 원소의 바이트 크기를 반환합니다.
     * [EN] Returns the byte size of a single slot element.
     *
     * @returns
     * [KO] 슬롯 바이트 크기
     * [EN] Slot byte size
     */
    get elementSize(): number;
    /**
     * [KO] 버퍼 디버그 레이블을 반환합니다.
     * [EN] Returns the buffer debug label.
     *
     * @returns
     * [KO] 레이블 문자열
     * [EN] Label string
     */
    get label(): string;
    /**
     * [KO] CPU 측 미러 버퍼를 반환합니다. (디버그·테스트 용도)
     * [EN] Returns the CPU-side mirror buffer. (For debugging and testing)
     *
     * @returns
     * [KO] CPU 미러 `ArrayBuffer`
     * [EN] CPU mirror `ArrayBuffer`
     */
    get cpuData(): ArrayBuffer;
    /**
     * [KO] 더티로 추적 중인 최소 슬롯 인덱스를 반환합니다. (디버그·테스트 용도)
     * [EN] Returns the minimum dirty slot index being tracked. (For debugging and testing)
     *
     * @returns
     * [KO] 최소 더티 인덱스 (없으면 Infinity)
     * [EN] Minimum dirty index (Infinity if none)
     */
    get dirtyMin(): number;
    /**
     * [KO] 더티로 추적 중인 최대 슬롯 인덱스를 반환합니다. (디버그·테스트 용도)
     * [EN] Returns the maximum dirty slot index being tracked. (For debugging and testing)
     *
     * @returns
     * [KO] 최대 더티 인덱스 (없으면 -Infinity)
     * [EN] Maximum dirty index (-Infinity if none)
     */
    get dirtyMax(): number;
    /**
     * [KO] 허용되는 최대 버퍼 바이트 크기를 반환합니다. (`maxStorageBufferBindingSize`와 128MB 중 작은 값)
     * [EN] Returns the maximum allowed buffer byte size. (The smaller of `maxStorageBufferBindingSize` and 128MB)
     *
     * @returns
     * [KO] 최대 버퍼 바이트 크기
     * [EN] Maximum buffer byte size
     */
    get safeMaxBufferSize(): number;
    /**
     * [KO] 현재 사용 중인 슬롯 개수를 반환합니다.
     * [EN] Returns the number of slots currently in use.
     *
     * @returns
     * [KO] 사용 중인 슬롯 개수
     * [EN] Active slot count
     */
    get activeSlotCount(): number;
    /**
     * [KO] 남은 사용 가능 슬롯 개수를 반환합니다.
     * [EN] Returns the number of remaining available slots.
     *
     * @returns
     * [KO] 남은 슬롯 개수
     * [EN] Remaining slot count
     */
    get remainingSlotCount(): number;
    /**
     * [KO] GPU 버퍼를 파괴하고 CPU 미러 데이터와 슬롯 풀을 해제합니다.
     * [EN] Destroys the GPU buffer and releases the CPU mirror data and slot pool.
     */
    destroy(): void;
    /**
     * [KO] 버퍼 리사이즈 완료 후 호출될 콜백을 등록합니다. 주로 바인드 그룹 재생성에 사용됩니다.
     * [EN] Registers a callback invoked after buffer resizing. Mainly used to recreate bind groups.
     *
     * @param callback -
     * [KO] 리사이즈 후 호출될 콜백 함수
     * [EN] Callback function called after resizing
     */
    setOnResize(callback: (manager: GlobalStorageBufferManager) => void): void;
    /**
     * [KO] 버퍼 슬롯을 할당합니다. 해제된 슬롯이 있으면 우선 재사용하고, 용량이 부족하면 버퍼를 확장합니다.
     * [EN] Allocates a buffer slot. Reuses freed slots first and grows the buffer when capacity runs out.
     *
     * ### Example
     * ```typescript
     * const slot = redGPUContext.globalVertexSSBO.allocateSlot();
     * console.log(slot.index, slot.byteOffset);
     * ```
     *
     * @returns
     * [KO] 할당된 슬롯의 인덱스와 바이트 오프셋
     * [EN] Index and byte offset of the allocated slot
     * @throws
     * [KO] 확장 후 크기가 최대 허용 크기를 초과하면 에러를 발생시킵니다.
     * [EN] Throws an error if the grown size exceeds the maximum allowed size.
     */
    allocateSlot(): BufferSlot;
    /**
     * [KO] 슬롯 인덱스를 재사용 풀에 반환합니다.
     * [EN] Returns a slot index to the reuse pool.
     *
     * @param index -
     * [KO] 반환할 슬롯 인덱스
     * [EN] Slot index to free
     */
    freeSlot(index: number): void;
    /**
     * [KO] 슬롯에 Float32 데이터를 CPU 미러 버퍼에 기록하고 더티로 표시합니다. 실제 업로드는 `flush()`에서 수행됩니다.
     * [EN] Writes Float32 data for a slot into the CPU mirror buffer and marks it dirty. The actual upload happens in `flush()`.
     *
     * @param index -
     * [KO] 대상 슬롯 인덱스
     * [EN] Target slot index
     * @param data -
     * [KO] 기록할 `Float32Array` 데이터
     * [EN] `Float32Array` data to write
     * @param floatOffsetInsideElement -
     * [KO] 슬롯 내부 float 단위 오프셋 (기본값: 0)
     * [EN] Offset inside the slot in floats (default: 0)
     * @throws
     * [KO] 오프셋과 데이터 길이의 합이 슬롯 크기를 초과하면 에러를 발생시킵니다.
     * [EN] Throws an error if offset plus data length exceeds the slot size.
     */
    updateFloatData(index: number, data: Float32Array, floatOffsetInsideElement?: number): void;
    /**
     * [KO] 슬롯에 Uint32 데이터를 CPU 미러 버퍼에 기록하고 더티로 표시합니다. 실제 업로드는 `flush()`에서 수행됩니다.
     * [EN] Writes Uint32 data for a slot into the CPU mirror buffer and marks it dirty. The actual upload happens in `flush()`.
     *
     * @param index -
     * [KO] 대상 슬롯 인덱스
     * [EN] Target slot index
     * @param data -
     * [KO] 기록할 `Uint32Array` 데이터
     * [EN] `Uint32Array` data to write
     * @param uintOffsetInsideElement -
     * [KO] 슬롯 내부 uint 단위 오프셋 (기본값: 0)
     * [EN] Offset inside the slot in uints (default: 0)
     * @throws
     * [KO] 오프셋과 데이터 길이의 합이 슬롯 크기를 초과하면 에러를 발생시킵니다.
     * [EN] Throws an error if offset plus data length exceeds the slot size.
     */
    updateUintData(index: number, data: Uint32Array, uintOffsetInsideElement?: number): void;
    /**
     * [KO] 더티 슬롯 범위만 GPU 버퍼로 업로드하고 더티 상태를 초기화합니다.
     * [EN] Uploads only the dirty slot range to the GPU buffer and resets the dirty state.
     */
    flush(): void;
}
export default GlobalStorageBufferManager;
export type { BufferSlot };
