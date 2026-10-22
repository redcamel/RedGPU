import RedGPUContext from '../../../context/RedGPUContext';
import RedGPUObject from '../../../base/RedGPUObject';

const SLOT_STRIDE_BYTES = 256;

/**
 * [KO] 동적 유니폼 버퍼 오프셋(Dynamic Uniform Offset) 규격에 맞춰 256바이트 단위로 정렬된 UBO 슬롯을 풀링 및 관리하는 추상 기반 클래스입니다.
 * [EN] Abstract base class that pools and manages 256-byte aligned UBO slots conforming to Dynamic Uniform Offset specifications.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
abstract class AScatterSlotPooler extends RedGPUObject {
    /**
     * [KO] 슬롯당 `Float32` 요소 개수 (`64`)입니다.
     * [EN] Number of `Float32` elements per slot (`64`).
     */
    static SLOT_STRIDE_FLOATS: number = 64;

    #maxSlots: number;
    #paramsSizeBytes: number;
    #paramsSizeFloats: number;

    #gpuBuffer: GPUBuffer | null = null;
    #cpuBuffer: Float32Array;
    #cpuUint32View: Uint32Array;
    #freeSlotStack: Int32Array;
    #freeTop: number = 0;

    /**
     * [KO] `AScatterSlotPooler` 인스턴스를 초기화하고 CPU/GPU 슬롯 풀 버퍼를 할당합니다.
     * [EN] Initializes an `AScatterSlotPooler` instance and allocates CPU/GPU slot pool buffers.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param maxSlots -
     * [KO] 풀에서 관리할 최대 슬롯 개수
     * [EN] Maximum number of slots to manage in the pool
     * @param paramsSizeBytes -
     * [KO] 개별 슬롯 내 실제 유니폼 파라미터의 바이트 크기 (`256` 이하)
     * [EN] Actual byte size of uniform parameters within an individual slot (`256` or less)
     * @param bufferLabel -
     * [KO] 생성될 GPU 유니폼 버퍼의 디버그 라벨
     * [EN] Debug label for the created GPU uniform buffer
     */
    constructor(
        redGPUContext: RedGPUContext,
        maxSlots: number,
        paramsSizeBytes: number,
        bufferLabel: string
    ) {
        super(redGPUContext);
        this.#maxSlots = maxSlots;
        this.#paramsSizeBytes = paramsSizeBytes;
        this.#paramsSizeFloats = paramsSizeBytes / 4;

        const totalFloats = maxSlots * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        this.#cpuBuffer = new Float32Array(totalFloats);
        this.#cpuUint32View = new Uint32Array(this.#cpuBuffer.buffer);

        this.#freeSlotStack = new Int32Array(maxSlots);
        for (let i = 0; i < maxSlots; i++) {
            this.#freeSlotStack[i] = maxSlots - 1 - i;
        }
        this.#freeTop = maxSlots;

        const {gpuDevice} = this;
        const {UNIFORM, COPY_DST} = GPUBufferUsage;
        this.#gpuBuffer = gpuDevice.createBuffer({
            label: bufferLabel,
            size: maxSlots * SLOT_STRIDE_BYTES,
            usage: UNIFORM | COPY_DST
        });
    }

    /**
     * [KO] 풀이 수용할 수 있는 최대 슬롯 개수를 반환합니다.
     * [EN] Returns the maximum number of slots the pool can accommodate.
     *
     * @returns
     * [KO] 최대 슬롯 개수
     * [EN] Maximum slot count
     */
    get maxSlots(): number {
        return this.#maxSlots;
    }

    /**
     * [KO] 단일 슬롯 내 실제 유니폼 파라미터의 바이트 크기를 반환합니다.
     * [EN] Returns the actual byte size of uniform parameters within a single slot.
     *
     * @returns
     * [KO] 슬롯 파라미터 바이트 크기
     * [EN] Slot parameter byte size
     */
    get paramsSizeBytes(): number {
        return this.#paramsSizeBytes;
    }

    /**
     * [KO] 전체 슬롯 데이터를 보관하는 통합 유니폼 `GPUBuffer`를 반환합니다.
     * [EN] Returns the unified uniform `GPUBuffer` holding all slot data.
     *
     * @returns
     * [KO] 통합 유니폼 `GPUBuffer` 또는 파기 시 `null`
     * [EN] Unified uniform `GPUBuffer`, or `null` if destroyed
     */
    get gpuBuffer(): GPUBuffer | null {
        return this.#gpuBuffer;
    }

    /**
     * [KO] 전체 슬롯 데이터의 CPU 측 `Float32Array` 버퍼를 반환합니다.
     * [EN] Returns the CPU-side `Float32Array` buffer for all slot data.
     *
     * @returns
     * [KO] CPU 슬롯 `Float32Array` 버퍼
     * [EN] CPU slot `Float32Array` buffer
     */
    get cpuBuffer(): Float32Array {
        return this.#cpuBuffer;
    }

    /**
     * [KO] 전체 슬롯 데이터의 CPU 측 `Uint32Array` 뷰를 반환합니다.
     * [EN] Returns the CPU-side `Uint32Array` view for all slot data.
     *
     * @returns
     * [KO] CPU 슬롯 `Uint32Array` 뷰
     * [EN] CPU slot `Uint32Array` view
     */
    get cpuUint32View(): Uint32Array {
        return this.#cpuUint32View;
    }

    /**
     * [KO] 가용 스택에서 빈 UBO 슬롯 인덱스를 하나 할당받아 반환합니다.
     * [EN] Allocates and returns an available UBO slot index from the free stack.
     *
     * @returns
     * [KO] 할당된 슬롯 인덱스 (`0` 이상) 또는 슬롯 고갈 시 `-1`
     * [EN] Allocated slot index (`0` or greater), or `-1` if slots are exhausted
     */
    allocateSlot(): number {
        if (this.#freeTop <= 0) {
            console.error(`[${this.constructor.name}] Exhausted all ${this.#maxSlots} UBO slots!`);
            return -1;
        }
        this.#freeTop--;
        return this.#freeSlotStack[this.#freeTop];
    }

    /**
     * [KO] 사용이 끝난 UBO 슬롯의 데이터를 0으로 초기화하고 가용 스택에 반환합니다.
     * [EN] Zeroes out the data of a used UBO slot and returns it to the free stack.
     *
     * @param slot -
     * [KO] 반환할 슬롯 인덱스
     * [EN] Slot index to free
     */
    freeSlot(slot: number): void {
        const {maxSlots, paramsSizeBytes} = this;
        if (slot < 0 || slot >= maxSlots) return;
        if (this.#freeTop >= maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        this.#cpuBuffer.fill(0, baseFloat, baseFloat + this.#paramsSizeFloats);

        this.uploadSlotBytes(slot, paramsSizeBytes);

        this.#freeSlotStack[this.#freeTop] = slot;
        this.#freeTop++;
    }

    /**
     * [KO] 모든 슬롯의 데이터를 초기화하고 전체 슬롯을 미할당 상태로 되돌립니다.
     * [EN] Clears all slot data and resets all slots to the unallocated state.
     */
    clear(): void {
        this.#cpuBuffer.fill(0);
        for (let i = 0; i < this.#maxSlots; i++) {
            this.#freeSlotStack[i] = this.#maxSlots - 1 - i;
        }
        this.#freeTop = this.#maxSlots;

        const {gpuDevice} = this;
        if (this.#gpuBuffer) {
            gpuDevice.queue.writeBuffer(this.#gpuBuffer, 0, this.#cpuBuffer.buffer);
        }
    }

    /**
     * [KO] 슬롯 풀의 GPU 버퍼를 파기하고 내부 상태를 초기화합니다.
     * [EN] Destroys the GPU buffer of the slot pool and resets internal state.
     */
    destroy(): void {
        if (this.#gpuBuffer) {
            this.#gpuBuffer.destroy();
            this.#gpuBuffer = null;
        }
        this.#cpuBuffer.fill(0);
        this.#freeTop = 0;
    }

    /**
     * [KO] 지정된 슬롯의 CPU 버퍼 데이터를 GPU 유니폼 버퍼의 해당 오프셋 위치로 업로드합니다.
     * [EN] Uploads the CPU buffer data of the specified slot to the corresponding offset in the GPU uniform buffer.
     *
     * @param slot -
     * [KO] 업로드할 대상 슬롯 인덱스
     * [EN] Target slot index to upload
     * @param byteLength -
     * [KO] 복사할 바이트 길이
     * [EN] Byte length to copy
     */
    uploadSlotBytes(slot: number, byteLength: number): void {
        const gpuBuffer = this.#gpuBuffer;
        if (!gpuBuffer) return;

        const {SLOT_STRIDE_FLOATS} = AScatterSlotPooler;
        const offsetBytes = slot * SLOT_STRIDE_BYTES;
        const baseFloat = slot * SLOT_STRIDE_FLOATS;
        const {buffer, byteOffset} = this.#cpuBuffer;
        const {gpuDevice} = this;

        gpuDevice.queue.writeBuffer(
            gpuBuffer,
            offsetBytes,
            buffer,
            byteOffset + baseFloat * 4,
            byteLength
        );
    }
}

Object.freeze(AScatterSlotPooler);
export default AScatterSlotPooler;
