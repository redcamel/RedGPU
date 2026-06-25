import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager";

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
class GlobalStorageBufferManager extends RedGPUObject {
    /**
     * [KO] 단일 슬롯 원소의 바이트 크기입니다. (예: Vertex 304, Material 912 등)
     * [EN] Byte size of a single slot element. (e.g. Vertex 304, Material 912, etc.)
     */
    #elementSize: number;
    /**
     * [KO] 버퍼의 디버그용 식별 레이블입니다.
     * [EN] Debug identification label for the buffer.
     */
    #label: string;

    /**
     * [KO] GPU 스토리지 버퍼 리소스 객체입니다.
     * [EN] GPU storage buffer resource object.
     */
    #gpuBuffer: GPUBuffer;
    /**
     * [KO] CPU 측 백킹 미러 버퍼 메모리 공간입니다.
     * [EN] CPU-side backing mirror buffer memory space.
     */
    #cpuData: ArrayBuffer;
    /**
     * [KO] CPU 백킹 버퍼를 쓰기 위한 Float32 뷰입니다.
     * [EN] Float32 view for writing to the CPU backing buffer.
     */
    #floatView: Float32Array;
    /**
     * [KO] CPU 백킹 버퍼를 쓰기 위한 Uint32 뷰입니다.
     * [EN] Uint32 view for writing to the CPU backing buffer.
     */
    #uintView: Uint32Array;

    /**
     * [KO] 해제되어 재사용 대기 중인 빈 슬롯 인덱스 풀입니다.
     * [EN] Pool of empty slot indices that have been freed and are waiting for reuse.
     */
    #freeIndices: number[] = [];
    /**
     * [KO] 다음 할당 시 사용될 슬롯 인덱스 시퀀스 번호입니다.
     * [EN] Slot index sequence number to be used for the next allocation.
     */
    #nextIndex = 0;
    /**
     * [KO] 현재 버퍼의 전체 슬롯 수용 개수입니다.
     * [EN] The current total slot capacity of the buffer.
     */
    #totalSlotCount: number;
    /**
     * [KO] 하드웨어가 허용하는 안전한 최대 버퍼 바이트 크기입니다.
     * [EN] The safe maximum buffer byte size allowed by the hardware.
     */
    #safeMaxBufferSize: number;

    /**
     * [KO] GPU 전송을 위해 추적 중인 더티 슬롯 인덱스 플래그 배열입니다.
     * [EN] Array of dirty slot index flags tracked for GPU transfer.
     */
    #dirtyFlags!: Uint8Array;
    /**
     * [KO] GPU 전송을 위해 추적 중인 더티 슬롯 인덱스 목록입니다.
     * [EN] List of dirty slot indices tracked for GPU transfer.
     */
    #dirtySlots: number[] = [];

    /**
     * [KO] 버퍼 리사이징이 완료되었을 때 바인드 그룹 갱신 등을 수행하기 위한 콜백입니다.
     * [EN] Callback invoked when buffer resizing is complete, typically used to update bind groups.
     */
    #onResizeCallback: ((manager: GlobalStorageBufferManager) => void) | null = null;

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
     * [KO] GPUBuffer 리소스 인스턴스를 반환합니다.
     * [EN] Returns the GPUBuffer resource instance.
     */
    get gpuBuffer(): GPUBuffer {
        return this.#gpuBuffer;
    }

    /**
     * [KO] 버퍼가 수용할 수 있는 전체 슬롯 개수(용량)를 반환합니다.
     * [EN] Returns the total number of slots (capacity) the buffer can accommodate.
     */
    get totalSlotCount(): number {
        return this.#totalSlotCount;
    }

    /**
     * [KO] 단일 슬롯 원소의 바이트 크기를 반환합니다.
     * [EN] Returns the byte size of a single slot element.
     */
    get elementSize(): number {
        return this.#elementSize;
    }

    /**
     * [KO] 버퍼 식별 레이블을 반환합니다.
     * [EN] Returns the buffer identification label.
     */
    get label(): string {
        return this.#label;
    }

    /**
     * [KO] CPU 측 백킹 미러 버퍼 메모리 공간(ArrayBuffer)을 반환합니다. (디버그 및 테스트 용도)
     * [EN] Returns the CPU-side backing mirror buffer memory space (ArrayBuffer). (For debugging and testing purposes)
     */
    get cpuData(): ArrayBuffer {
        return this.#cpuData;
    }

    /**
     * [KO] 현재 더티로 추적된 슬롯 인덱스 목록을 반환합니다. (디버그 및 테스트 용도)
     * [EN] Returns the list of slot indices currently tracked as dirty. (For debugging and testing purposes)
     */
    get dirtySlots(): number[] {
        return this.#dirtySlots;
    }

    /**
     * [KO] 테스트 및 디버깅을 위해 하드웨어 허용 최대 버퍼 바이트 크기 값을 반환합니다.
     * [EN] Returns the hardware-allowed maximum buffer byte size for testing and debugging.
     */
    get safeMaxBufferSize(): number {
        return this.#safeMaxBufferSize;
    }

    /**
     * [KO] 현재 할당되어 사용 중인 슬롯의 개수를 반환합니다.
     * [EN] Returns the number of currently allocated and active slots.
     */
    get activeSlotCount(): number {
        return this.#nextIndex - this.#freeIndices.length;
    }

    /**
     * [KO] 남은 사용 가능한 슬롯의 개수를 반환합니다.
     * [EN] Returns the number of remaining available slots.
     */
    get remainingSlotCount(): number {
        return this.#totalSlotCount - this.activeSlotCount;
    }

    /**
     * [KO] 리사이즈 콜백을 등록합니다. 버퍼 용량 한도 초과로 동적 리사이징이 실행된 후 호출됩니다.
     * [EN] Registers a resize callback. Called after dynamic resizing is executed due to capacity limit exceedance.
     *
     * @param callback -
     * [KO] 리사이즈 실행 후 호출될 콜백 함수
     * [EN] Callback function to be called after resizing
     */
    setOnResize(callback: (manager: GlobalStorageBufferManager) => void): void {
        this.#onResizeCallback = callback;
    }

    /**
     * [KO] 버퍼 슬롯을 할당합니다. 해제 대기 중인 빈 슬롯 인덱스가 있다면 우선 재사용합니다.
     * [EN] Allocates a buffer slot. Reuses freed slot indices first if available in the pool.
     *
     * @returns
     * [KO] 할당된 슬롯의 인덱스 및 바이트 오프셋 정보
     * [EN] Information of the allocated slot's index and byte offset
     */
    allocateSlot(): BufferSlot {
        let index: number;
        if (this.#freeIndices.length > 0) {
            index = this.#freeIndices.pop()!;
        } else {
            if (this.#nextIndex >= this.#totalSlotCount) {
                this.#resizeBuffer(this.#totalSlotCount * 2);
            }
            index = this.#nextIndex++;
        }

        return {
            index,
            byteOffset: index * this.#elementSize
        };
    }

    /**
     * [KO] 할당받았던 슬롯 인덱스를 반환하여 재사용 대기 풀에 등록합니다.
     * [EN] Frees the allocated slot index and registers it back to the reuse pool.
     *
     * @param index -
     * [KO] 반환할 슬롯의 인덱스 번호
     * [EN] Index number of the slot to be freed
     */
    freeSlot(index: number): void {
        this.#freeIndices.push(index);
    }

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
    updateFloatData(index: number, data: Float32Array, floatOffsetInsideElement = 0): void {
        const maxFloatCount = this.#elementSize / 4;
        if (floatOffsetInsideElement + data.length > maxFloatCount) {
            throw new Error(`[GlobalStorageBufferManager - ${this.#label}] 입력 데이터의 크기(${data.length} floats, offset: ${floatOffsetInsideElement})가 할당된 단일 슬롯 수용량(${maxFloatCount} floats)을 초과했습니다.`);
        }

        const baseFloatOffset = (index * this.#elementSize) / 4 + floatOffsetInsideElement;
        this.#floatView.set(data, baseFloatOffset);

        if (!this.#dirtyFlags[index]) {
            this.#dirtyFlags[index] = 1;
            this.#dirtySlots.push(index);
        }
    }

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
    updateUintData(index: number, data: Uint32Array, uintOffsetInsideElement = 0): void {
        const maxUintCount = this.#elementSize / 4;
        if (uintOffsetInsideElement + data.length > maxUintCount) {
            throw new Error(`[GlobalStorageBufferManager - ${this.#label}] 입력 데이터의 크기(${data.length} uints, offset: ${uintOffsetInsideElement})가 할당된 단일 슬롯 수용량(${maxUintCount} uints)을 초과했습니다.`);
        }

        const baseUintOffset = (index * this.#elementSize) / 4 + uintOffsetInsideElement;
        this.#uintView.set(data, baseUintOffset);

        if (!this.#dirtyFlags[index]) {
            this.#dirtyFlags[index] = 1;
            this.#dirtySlots.push(index);
        }
    }

    /**
     * [KO] 더티 트래킹 범위(실제 데이터가 수정된 구간)만 선별하여 GPU 메모리로 업로드합니다.
     * [EN] Uploads only the dirty-tracked range (the portion with modified data) to the GPU memory.
     */
    flush(): void {
        if (this.#dirtySlots.length > 0) {
            // 인덱스 오름차순 정렬
            this.#dirtySlots.sort((a, b) => a - b);

            let startIdx = this.#dirtySlots[0];
            let prevIdx = startIdx;

            for (let i = 1; i < this.#dirtySlots.length; i++) {
                const currIdx = this.#dirtySlots[i];
                if (currIdx === prevIdx + 1) {
                    // 연속된 인덱스는 병합 대상
                    prevIdx = currIdx;
                } else {
                    // 끊겼으므로 이전 청크 업로드
                    this.#uploadSlotRange(startIdx, prevIdx);
                    startIdx = currIdx;
                    prevIdx = currIdx;
                }
            }
            // 마지막 남은 청크 업로드
            this.#uploadSlotRange(startIdx, prevIdx);

            // 더티 상태 초기화
            for (let i = 0; i < this.#dirtySlots.length; i++) {
                this.#dirtyFlags[this.#dirtySlots[i]] = 0;
            }
            this.#dirtySlots.length = 0;
        }
    }

    #uploadSlotRange(startIdx: number, endIdx: number): void {
        const startByte = startIdx * this.#elementSize;
        const uploadSize = (endIdx - startIdx + 1) * this.#elementSize;

        this.gpuDevice.queue.writeBuffer(
            this.#gpuBuffer,
            startByte,
            this.#cpuData,
            startByte,
            uploadSize
        );
    }

    #initializeManager(): void {
        const limits = this.redGPUContext.detector.activeLimits;
        this.#safeMaxBufferSize = Math.min(limits.maxStorageBufferBindingSize, 134217728); // 128MB 제한

        this.#allocateBuffer();
    }

    /**
     * GPUBuffer 및 CPU 백킹 미러 버퍼 할당
     */
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
        this.#dirtyFlags = new Uint8Array(this.#totalSlotCount);
    }

    /**
     * 동적 버퍼 리사이징 정책 (GPU 가속 복사)
     */
    #resizeBuffer(newSlotCount: number): void {
        const oldBuffer = this.#gpuBuffer;
        const oldByteSize = this.#totalSlotCount * this.#elementSize;
        const newByteSize = newSlotCount * this.#elementSize;

        if (newByteSize > this.#safeMaxBufferSize) {
            //TODO - 나중에 모바일일떄와 데스트톱일때 허용치를 분기해야할듯
            throw new Error(`[GlobalStorageBufferManager - ${this.#label}] Buffer 용량이 초과되었습니다. RedGPU는 안전을 위해 최대 128MB까지만 허용합니다.`);
        }

        console.log(`🔄 [${this.#label}] 리사이즈 실행: ${this.#totalSlotCount} -> ${newSlotCount}`);
        this.#totalSlotCount = newSlotCount;

        // 1. 새 GPU 버퍼 생성 및 CPU 백킹 데이터 공간 재할당
        const newBuffer = this.gpuDevice.createBuffer({
            label: this.#label,
            size: newByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
        });
        const newCpuData = new ArrayBuffer(newByteSize);
        const newFloatView = new Float32Array(newCpuData);

        // 2. CPU 데이터 이전
        newFloatView.set(this.#floatView);

        // 3. GPU 하드웨어 가속 복사 커맨드 실행
        this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
            encoder.copyBufferToBuffer(oldBuffer, 0, newBuffer, 0, oldByteSize);
        });

        // 4. 기존 GPU 버퍼 해제 및 바인딩 교체
        oldBuffer.destroy();
        this.#gpuBuffer = newBuffer;
        this.#cpuData = newCpuData;
        this.#floatView = newFloatView;
        this.#uintView = new Uint32Array(newCpuData);

        // 5. 더티 플래그 배열 확장
        const newDirtyFlags = new Uint8Array(newSlotCount);
        newDirtyFlags.set(this.#dirtyFlags);
        this.#dirtyFlags = newDirtyFlags;

        // 6. 바인드그룹 재생성을 위해 외부 콜백 실행
        if (this.#onResizeCallback) {
            this.#onResizeCallback(this);
        }
    }
}

Object.freeze(GlobalStorageBufferManager);
export default GlobalStorageBufferManager;
export type {BufferSlot};
