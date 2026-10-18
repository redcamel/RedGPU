import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import keepLog from "../../../utils/keepLog";

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
class GlobalStorageBufferManager extends RedGPUObject {
    /**
     * [KO] 2배 성장에서 선형 성장으로 전환되는 임계 버퍼 크기 (32MB)
     * [EN] Buffer size threshold for switching from 2x growth to linear growth (32MB)
     */
    static readonly RESIZE_THRESHOLD_BYTES = 32 * 1024 * 1024;

    /**
     * [KO] 임계 크기 초과 후 선형 성장 시 추가되는 바이트 크기 (8MB)
     * [EN] Bytes added per linear growth step after exceeding the threshold (8MB)
     */
    static readonly RESIZE_LINEAR_ADDITION_BYTES = 8 * 1024 * 1024;

    #elementSize: number;
    #label: string;

    #gpuBuffer: GPUBuffer;
    #cpuData: ArrayBuffer;
    #floatView: Float32Array;
    #uintView: Uint32Array;

    #freeIndices: number[] = [];
    #nextIndex = 0;
    #totalSlotCount: number;
    #safeMaxBufferSize: number;

    #dirtyMin = Infinity;
    #dirtyMax = -Infinity;

    #onResizeCallback: ((manager: GlobalStorageBufferManager) => void) | null = null;

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
    constructor(
        redGPUContext: RedGPUContext,
        elementSize: number,
        initialSlotCount = 1024,
        label = "GLOBAL_STORAGE_BUFFER"
    ) {
        super(redGPUContext);
        this.#elementSize = elementSize;
        this.#totalSlotCount = initialSlotCount;
        this.#label = label;

        this.#initializeManager();
    }

    /**
     * [KO] GPU 스토리지 버퍼를 반환합니다. 리사이즈 시 새 버퍼로 교체됩니다.
     * [EN] Returns the GPU storage buffer. It is replaced with a new buffer on resize.
     *
     * @returns
     * [KO] GPUBuffer 객체
     * [EN] GPUBuffer object
     */
    get gpuBuffer(): GPUBuffer {
        return this.#gpuBuffer;
    }

    /**
     * [KO] 버퍼의 전체 슬롯 수용량을 반환합니다.
     * [EN] Returns the total slot capacity of the buffer.
     *
     * @returns
     * [KO] 전체 슬롯 개수
     * [EN] Total slot count
     */
    get totalSlotCount(): number {
        return this.#totalSlotCount;
    }

    /**
     * [KO] 단일 슬롯 원소의 바이트 크기를 반환합니다.
     * [EN] Returns the byte size of a single slot element.
     *
     * @returns
     * [KO] 슬롯 바이트 크기
     * [EN] Slot byte size
     */
    get elementSize(): number {
        return this.#elementSize;
    }

    /**
     * [KO] 버퍼 디버그 레이블을 반환합니다.
     * [EN] Returns the buffer debug label.
     *
     * @returns
     * [KO] 레이블 문자열
     * [EN] Label string
     */
    get label(): string {
        return this.#label;
    }

    /**
     * [KO] CPU 측 미러 버퍼를 반환합니다. (디버그·테스트 용도)
     * [EN] Returns the CPU-side mirror buffer. (For debugging and testing)
     *
     * @returns
     * [KO] CPU 미러 `ArrayBuffer`
     * [EN] CPU mirror `ArrayBuffer`
     */
    get cpuData(): ArrayBuffer {
        return this.#cpuData;
    }

    /**
     * [KO] 더티로 추적 중인 최소 슬롯 인덱스를 반환합니다. (디버그·테스트 용도)
     * [EN] Returns the minimum dirty slot index being tracked. (For debugging and testing)
     *
     * @returns
     * [KO] 최소 더티 인덱스 (없으면 Infinity)
     * [EN] Minimum dirty index (Infinity if none)
     */
    get dirtyMin(): number {
        return this.#dirtyMin;
    }

    /**
     * [KO] 더티로 추적 중인 최대 슬롯 인덱스를 반환합니다. (디버그·테스트 용도)
     * [EN] Returns the maximum dirty slot index being tracked. (For debugging and testing)
     *
     * @returns
     * [KO] 최대 더티 인덱스 (없으면 -Infinity)
     * [EN] Maximum dirty index (-Infinity if none)
     */
    get dirtyMax(): number {
        return this.#dirtyMax;
    }

    /**
     * [KO] 허용되는 최대 버퍼 바이트 크기를 반환합니다. (`maxStorageBufferBindingSize`와 128MB 중 작은 값)
     * [EN] Returns the maximum allowed buffer byte size. (The smaller of `maxStorageBufferBindingSize` and 128MB)
     *
     * @returns
     * [KO] 최대 버퍼 바이트 크기
     * [EN] Maximum buffer byte size
     */
    get safeMaxBufferSize(): number {
        return this.#safeMaxBufferSize;
    }

    /**
     * [KO] 현재 사용 중인 슬롯 개수를 반환합니다.
     * [EN] Returns the number of slots currently in use.
     *
     * @returns
     * [KO] 사용 중인 슬롯 개수
     * [EN] Active slot count
     */
    get activeSlotCount(): number {
        return this.#nextIndex - this.#freeIndices.length;
    }

    /**
     * [KO] 남은 사용 가능 슬롯 개수를 반환합니다.
     * [EN] Returns the number of remaining available slots.
     *
     * @returns
     * [KO] 남은 슬롯 개수
     * [EN] Remaining slot count
     */
    get remainingSlotCount(): number {
        return this.#totalSlotCount - this.activeSlotCount;
    }

    /**
     * [KO] GPU 버퍼를 파괴하고 CPU 미러 데이터와 슬롯 풀을 해제합니다.
     * [EN] Destroys the GPU buffer and releases the CPU mirror data and slot pool.
     */
    destroy() {
        this.#gpuBuffer.destroy()
        this.#cpuData = null;
        this.#floatView = null;
        this.#uintView = null;
        this.#freeIndices = null;
    }

    /**
     * [KO] 버퍼 리사이즈 완료 후 호출될 콜백을 등록합니다. 주로 바인드 그룹 재생성에 사용됩니다.
     * [EN] Registers a callback invoked after buffer resizing. Mainly used to recreate bind groups.
     *
     * @param callback -
     * [KO] 리사이즈 후 호출될 콜백 함수
     * [EN] Callback function called after resizing
     */
    setOnResize(callback: (manager: GlobalStorageBufferManager) => void): void {
        this.#onResizeCallback = callback;
    }

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
    allocateSlot(): BufferSlot {
        let index: number;
        if (this.#freeIndices.length > 0) {
            index = this.#freeIndices.pop()!;
        } else {
            if (this.#nextIndex >= this.#totalSlotCount) {
                const currentByteSize = this.#totalSlotCount * this.#elementSize;
                let newSlotCount: number;

                if (currentByteSize <= GlobalStorageBufferManager.RESIZE_THRESHOLD_BYTES) {
                    newSlotCount = this.#totalSlotCount * 2;
                } else {
                    const additionalSlots = Math.ceil(GlobalStorageBufferManager.RESIZE_LINEAR_ADDITION_BYTES / this.#elementSize);
                    newSlotCount = this.#totalSlotCount + additionalSlots;
                }

                this.#resizeBuffer(newSlotCount);
            }
            index = this.#nextIndex++;
        }

        return {
            index,
            byteOffset: index * this.#elementSize
        };
    }

    /**
     * [KO] 슬롯 인덱스를 재사용 풀에 반환합니다.
     * [EN] Returns a slot index to the reuse pool.
     *
     * @param index -
     * [KO] 반환할 슬롯 인덱스
     * [EN] Slot index to free
     */
    freeSlot(index: number): void {
        this.#freeIndices.push(index);
    }

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
    updateFloatData(index: number, data: Float32Array, floatOffsetInsideElement = 0): void {
        const maxFloatCount = this.#elementSize / 4;
        if (floatOffsetInsideElement + data.length > maxFloatCount) {
            throw new Error(`[GlobalStorageBufferManager - ${this.#label}] 입력 데이터의 크기(${data.length} floats, offset: ${floatOffsetInsideElement})가 할당된 단일 슬롯 수용량(${maxFloatCount} floats)을 초과했습니다.`);
        }

        const baseFloatOffset = (index * this.#elementSize) / 4 + floatOffsetInsideElement;
        this.#floatView.set(data, baseFloatOffset);

        this.#dirtyMin = Math.min(this.#dirtyMin, index);
        this.#dirtyMax = Math.max(this.#dirtyMax, index);
    }

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
    updateUintData(index: number, data: Uint32Array, uintOffsetInsideElement = 0): void {
        const maxUintCount = this.#elementSize / 4;
        if (uintOffsetInsideElement + data.length > maxUintCount) {
            throw new Error(`[GlobalStorageBufferManager - ${this.#label}] 입력 데이터의 크기(${data.length} uints, offset: ${uintOffsetInsideElement})가 할당된 단일 슬롯 수용량(${maxUintCount} uints)을 초과했습니다.`);
        }

        const baseUintOffset = (index * this.#elementSize) / 4 + uintOffsetInsideElement;
        this.#uintView.set(data, baseUintOffset);

        this.#dirtyMin = Math.min(this.#dirtyMin, index);
        this.#dirtyMax = Math.max(this.#dirtyMax, index);
    }

    /**
     * [KO] 더티 슬롯 범위만 GPU 버퍼로 업로드하고 더티 상태를 초기화합니다.
     * [EN] Uploads only the dirty slot range to the GPU buffer and resets the dirty state.
     */
    flush(): void {
        if (this.#dirtyMax >= this.#dirtyMin) {
            const startByte = this.#dirtyMin * this.#elementSize;
            const endByte = (this.#dirtyMax + 1) * this.#elementSize;
            const uploadSize = endByte - startByte;

            this.gpuDevice.queue.writeBuffer(
                this.#gpuBuffer,
                startByte,
                this.#cpuData,
                startByte,
                uploadSize
            );

            this.#dirtyMin = Infinity;
            this.#dirtyMax = -Infinity;
        }
    }

    #initializeManager(): void {
        const limits = this.redGPUContext.detector.activeLimits;
        this.#safeMaxBufferSize = Math.min(limits.maxStorageBufferBindingSize, 134217728);

        this.#allocateBuffer();
    }

    #allocateBuffer(): void {
        const byteSize = this.#totalSlotCount * this.#elementSize;

        if (byteSize > this.#safeMaxBufferSize) {
            throw new Error(`[GlobalStorageBufferManager - ${this.#label}] Buffer 용량이 초과되었습니다. RedGPU는 안전을 위해 최대 128MB까지만 허용합니다.`);
        }

        this.#gpuBuffer = this.gpuDevice.createBuffer({
            label: this.#label,
            size: byteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
        });

        this.#cpuData = new ArrayBuffer(byteSize);
        this.#floatView = new Float32Array(this.#cpuData);
        this.#uintView = new Uint32Array(this.#cpuData);
    }

    #resizeBuffer(newSlotCount: number): void {
        const oldBuffer = this.#gpuBuffer;
        const oldByteSize = this.#totalSlotCount * this.#elementSize;
        const newByteSize = newSlotCount * this.#elementSize;

        if (newByteSize > this.#safeMaxBufferSize) {
            throw new Error(`[GlobalStorageBufferManager - ${this.#label}] Buffer 용량이 초과되었습니다. RedGPU는 안전을 위해 최대 128MB까지만 허용합니다.`);
        }

        keepLog(`🔄 [${this.#label}] 리사이즈 실행: ${this.#totalSlotCount} -> ${newSlotCount}`);
        this.#totalSlotCount = newSlotCount;

        const newBuffer = this.gpuDevice.createBuffer({
            label: this.#label,
            size: newByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
        });
        const newCpuData = new ArrayBuffer(newByteSize);
        const newFloatView = new Float32Array(newCpuData);

        newFloatView.set(this.#floatView);

        const copyEncoder = this.gpuDevice.createCommandEncoder({
            label: `GlobalStorageBufferManager_ResizeCopy_${this.#label}`
        });
        copyEncoder.copyBufferToBuffer(oldBuffer, 0, newBuffer, 0, oldByteSize);
        const copyCommandBuffer = copyEncoder.finish();
        this.gpuDevice.queue.submit([copyCommandBuffer]);

        this.commandEncoderManager.addDeferredDestroy(oldBuffer)
        this.#gpuBuffer = newBuffer;
        this.#cpuData = newCpuData;
        this.#floatView = newFloatView;
        this.#uintView = new Uint32Array(newCpuData);

        if (this.#onResizeCallback) {
            this.#onResizeCallback(this);
        }
    }
}

Object.freeze(GlobalStorageBufferManager);
export default GlobalStorageBufferManager;
export type {BufferSlot};
