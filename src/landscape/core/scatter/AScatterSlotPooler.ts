import RedGPUContext from '../../../context/RedGPUContext';
import RedGPUObject from '../../../base/RedGPUObject';

abstract class AScatterSlotPooler extends RedGPUObject {
    static SLOT_STRIDE_BYTES: number = 256;

    static SLOT_STRIDE_FLOATS: number = 64;

    #maxSlots: number;
    #paramsSizeBytes: number;
    #paramsSizeFloats: number;

    #gpuBuffer: GPUBuffer | null = null;
    #cpuBuffer: Float32Array;
    #cpuUint32View: Uint32Array;
    #freeSlotStack: Int32Array;
    #freeTop: number = 0;
    #allocatedCount: number = 0;

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
            size: maxSlots * AScatterSlotPooler.SLOT_STRIDE_BYTES,
            usage: UNIFORM | COPY_DST
        });
    }

    get maxSlots(): number {
        return this.#maxSlots;
    }

    get paramsSizeBytes(): number {
        return this.#paramsSizeBytes;
    }

    get gpuBuffer(): GPUBuffer | null {
        return this.#gpuBuffer;
    }

    get cpuBuffer(): Float32Array {
        return this.#cpuBuffer;
    }

    get cpuUint32View(): Uint32Array {
        return this.#cpuUint32View;
    }

    allocateSlot(): number {
        if (this.#freeTop <= 0) {
            console.error(`[${this.constructor.name}] Exhausted all ${this.#maxSlots} UBO slots!`);
            return -1;
        }
        this.#freeTop--;
        this.#allocatedCount++;
        return this.#freeSlotStack[this.#freeTop];
    }

    freeSlot(slot: number): void {
        const {maxSlots, paramsSizeBytes} = this;
        if (slot < 0 || slot >= maxSlots) return;
        if (this.#freeTop >= maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        this.#cpuBuffer.fill(0, baseFloat, baseFloat + this.#paramsSizeFloats);

        this.uploadSlotBytes(slot, paramsSizeBytes);

        this.#freeSlotStack[this.#freeTop] = slot;
        this.#freeTop++;
        this.#allocatedCount = Math.max(0, this.#allocatedCount - 1);
    }

    clear(): void {
        this.#cpuBuffer.fill(0);
        for (let i = 0; i < this.#maxSlots; i++) {
            this.#freeSlotStack[i] = this.#maxSlots - 1 - i;
        }
        this.#freeTop = this.#maxSlots;
        this.#allocatedCount = 0;

        const {gpuDevice} = this;
        if (this.#gpuBuffer) {
            gpuDevice.queue.writeBuffer(this.#gpuBuffer, 0, this.#cpuBuffer.buffer);
        }
    }

    destroy(): void {
        if (this.#gpuBuffer) {
            this.#gpuBuffer.destroy();
            this.#gpuBuffer = null;
        }
        this.#cpuBuffer.fill(0);
        this.#freeTop = 0;
        this.#allocatedCount = 0;
    }

    uploadSlotBytes(slot: number, byteLength: number): void {
        const gpuBuffer = this.#gpuBuffer;
        if (!gpuBuffer) return;

        const {SLOT_STRIDE_BYTES, SLOT_STRIDE_FLOATS} = AScatterSlotPooler;
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

