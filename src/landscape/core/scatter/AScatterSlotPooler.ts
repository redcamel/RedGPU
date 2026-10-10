/**
 * [KO] 스캐터 시스템(잔디, 식생 등)을 위한 256바이트 정렬 Dynamic Offset UBO 슬롯 풀러 추상 베이스 모듈입니다.
 * [EN] Abstract base module for 256-byte aligned dynamic offset UBO slot poolers across scatter systems (Grass, Foliage, etc.).
 * @packageDocumentation
 */
import RedGPUContext from '../../../context/RedGPUContext';
import RedGPUObject from '../../../base/RedGPUObject';

/**
 * [KO] WebGPU의 256바이트 정렬 규격을 만족하는 Dynamic Offset UBO 슬롯을 관리하는 추상 베이스 클래스입니다.
 * LIFO 스택 기반 O(1) 풀링, CPU Float32Array/Uint32Array 미러 버퍼 및 고정 메가 UBO GPUBuffer를 캡슐화하여 Zero-GC를 보장합니다.
 *
 * [EN] Abstract base class managing Dynamic Offset UBO slots conforming to WebGPU 256-byte alignment requirements.
 * Encapsulates LIFO stack O(1) pooling, CPU Float32Array/Uint32Array mirror buffers, and fixed mega UBO GPUBuffer ensuring zero-GC.
 */
abstract class AScatterSlotPooler extends RedGPUObject {
    /**
     * [KO] WebGPU UBO 동적 오프셋 최소 정렬 바이트 규격 (256바이트)
     * [EN] WebGPU minimum dynamic UBO offset alignment in bytes (256 bytes)
     */
    static SLOT_STRIDE_BYTES: number = 256;

    /**
     * [KO] 슬롯 1개당 32비트 Float 요소 개수 (256 / 4 = 64 floats)
     * [EN] Number of 32-bit float elements per slot (256 / 4 = 64 floats)
     */
    static SLOT_STRIDE_FLOATS: number = 64;

    /**
     * [KO] 풀러가 수용 가능한 최대 슬롯 개수
     * [EN] Maximum number of slots supported by this pooler
     */
    maxSlots: number;

    /**
     * [KO] 슬롯당 실제 유효 파라미터 바이트 크기
     * [EN] Actual valid parameter byte size per slot
     */
    paramsSizeBytes: number;

    /**
     * [KO] 슬롯당 실제 유효 파라미터 Float 요소 개수
     * [EN] Actual valid parameter float count per slot
     */
    paramsSizeFloats: number;

    #gpuBuffer: GPUBuffer;
    #cpuBuffer: Float32Array;
    #cpuUint32View: Uint32Array;
    #freeSlotStack: Int32Array;
    #freeTop: number = 0;
    #allocatedCount: number = 0;

    /**
     * [KO] AScatterSlotPooler 인스턴스를 초기화하고 CPU 미러 버퍼 및 고정 GPU 메가 UBO를 사전 할당합니다.
     * [EN] Initializes an AScatterSlotPooler instance and pre-allocates CPU mirror buffers and fixed GPU mega UBO.
     *
     * @param redGPUContext - RedGPU 컨텍스트 인스턴스
     * @param maxSlots - 최대 슬롯 수용량
     * @param paramsSizeBytes - 슬롯당 유효 파라미터 크기 (바이트)
     * @param bufferLabel - GPUBuffer 디버그 라벨
     */
    constructor(
        redGPUContext: RedGPUContext,
        maxSlots: number,
        paramsSizeBytes: number,
        bufferLabel: string
    ) {
        super(redGPUContext);
        this.maxSlots = maxSlots;
        this.paramsSizeBytes = paramsSizeBytes;
        this.paramsSizeFloats = paramsSizeBytes / 4;

        const totalFloats = maxSlots * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        this.#cpuBuffer = new Float32Array(totalFloats);
        this.#cpuUint32View = new Uint32Array(this.#cpuBuffer.buffer);

        this.#freeSlotStack = new Int32Array(maxSlots);
        for (let i = 0; i < maxSlots; i++) {
            this.#freeSlotStack[i] = maxSlots - 1 - i;
        }
        this.#freeTop = maxSlots;

        this.#gpuBuffer = this.gpuDevice.createBuffer({
            label: bufferLabel,
            size: maxSlots * AScatterSlotPooler.SLOT_STRIDE_BYTES,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }

    /**
     * [KO] 단일 고정 메가 UBO GPUBuffer 객체를 반환합니다.
     * [EN] Returns the single fixed mega UBO GPUBuffer instance.
     */
    get gpuBuffer(): GPUBuffer {
        return this.#gpuBuffer;
    }

    /**
     * [KO] CPU 미러 버퍼 (Float32Array)를 반환합니다.
     * [EN] Returns the CPU mirror buffer (Float32Array).
     */
    get cpuBuffer(): Float32Array {
        return this.#cpuBuffer;
    }

    /**
     * [KO] CPU 미러 버퍼의 Uint32 뷰 (Uint32Array)를 반환합니다.
     * [EN] Returns the Uint32 view of the CPU mirror buffer (Uint32Array).
     */
    get cpuUint32View(): Uint32Array {
        return this.#cpuUint32View;
    }

    /**
     * [KO] 새 서브메시/스캐터 타입용 슬롯 인덱스를 할당합니다 (0 ~ maxSlots - 1).
     * [EN] Allocates a slot index for a new sub-mesh or scatter type (0 ~ maxSlots - 1).
     * @returns 할당된 슬롯 번호 (슬롯 고갈 시 -1)
     */
    allocateSlot(): number {
        if (this.#freeTop <= 0) {
            console.error(`[${this.constructor.name}] Exhausted all ${this.maxSlots} UBO slots!`);
            return -1;
        }
        this.#freeTop--;
        this.#allocatedCount++;
        return this.#freeSlotStack[this.#freeTop];
    }

    /**
     * [KO] 사용이 끝난 슬롯 인덱스를 풀에 반환하고 CPU/GPU 메모리를 0으로 초기화합니다.
     * [EN] Releases a finished slot index back to the pool and clears its CPU/GPU memory to zero.
     * @param slot - 반환할 슬롯 번호
     */
    freeSlot(slot: number): void {
        if (slot < 0 || slot >= this.maxSlots) return;
        if (this.#freeTop >= this.maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        this.#cpuBuffer.fill(0, baseFloat, baseFloat + this.paramsSizeFloats);

        this.uploadSlotBytes(slot, this.paramsSizeBytes);

        this.#freeSlotStack[this.#freeTop] = slot;
        this.#freeTop++;
        this.#allocatedCount = Math.max(0, this.#allocatedCount - 1);
    }

    /**
     * [KO] 모든 슬롯 상태를 초기화하고 VRAM을 0으로 동기화합니다.
     * [EN] Resets all slot states and synchronizes VRAM to zero.
     */
    clear(): void {
        this.#cpuBuffer.fill(0);
        for (let i = 0; i < this.maxSlots; i++) {
            this.#freeSlotStack[i] = this.maxSlots - 1 - i;
        }
        this.#freeTop = this.maxSlots;
        this.#allocatedCount = 0;

        if (this.#gpuBuffer) {
            this.gpuDevice.queue.writeBuffer(this.#gpuBuffer, 0, this.#cpuBuffer.buffer);
        }
    }

    /**
     * [KO] 풀러가 소유한 GPUBuffer 및 CPU 메모리를 안전하게 해제합니다.
     * [EN] Safely releases GPUBuffer and CPU memory held by the pooler.
     */
    destroy(): void {
        this.#gpuBuffer?.destroy();
        this.#gpuBuffer = null;
        this.#cpuBuffer.fill(0);
        this.#freeTop = 0;
        this.#allocatedCount = 0;
    }

    /**
     * [KO] 특정 슬롯의 시작 오프셋부터 지정된 바이트 크기만큼 VRAM으로 정밀 업로드합니다.
     * [EN] Uploads data precisely from slot start offset for specified byte length to VRAM.
     * @param slot - 슬롯 인덱스
     * @param byteLength - 전송할 바이트 크기
     */
    uploadSlotBytes(slot: number, byteLength: number): void {
        const gpuBuffer = this.#gpuBuffer;
        if (!gpuBuffer) return;

        const {SLOT_STRIDE_BYTES, SLOT_STRIDE_FLOATS} = AScatterSlotPooler;
        const offsetBytes = slot * SLOT_STRIDE_BYTES;
        const baseFloat = slot * SLOT_STRIDE_FLOATS;
        const {buffer, byteOffset} = this.#cpuBuffer;

        this.gpuDevice.queue.writeBuffer(
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
