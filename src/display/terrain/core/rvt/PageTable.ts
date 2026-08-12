import RedGPUContext from "../../../../context/RedGPUContext";
import DirectTexture from "../../../../resources/texture/DirectTexture";

export interface PageTableOptions {
    virtualCountX?: number;
    virtualCountZ?: number;
    maxMipLevel?: number;
}

export enum PageState {
    Unallocated = 0,
    Baking = 128,
    Ready = 255,
}

export class PageTable {
    readonly #redGPUContext: RedGPUContext;
    readonly #virtualCountX: number;
    readonly #virtualCountZ: number;
    readonly #maxMipLevel: number;

    #pageTableGPUTexture: GPUTexture | null = null;
    #pageTableDirectTexture: DirectTexture | null = null;
    #pageTableData: Uint8Array;

    constructor(redGPUContext: RedGPUContext, options: PageTableOptions = {}) {
        this.#redGPUContext = redGPUContext;
        this.#virtualCountX = options.virtualCountX ?? 32;
        this.#virtualCountZ = options.virtualCountZ ?? 32;
        this.#maxMipLevel = options.maxMipLevel ?? 5;

        this.#pageTableData = new Uint8Array(this.#virtualCountX * this.#virtualCountZ * 4);
        this.#initTexture();
    }

    get virtualCountX(): number {
        return this.#virtualCountX;
    }

    get virtualCountZ(): number {
        return this.#virtualCountZ;
    }

    get maxMipLevel(): number {
        return this.#maxMipLevel;
    }

    get pageTableDirectTexture(): DirectTexture | null {
        return this.#pageTableDirectTexture;
    }

    get pageTableGPUTexture(): GPUTexture | null {
        return this.#pageTableGPUTexture;
    }

    public setEntry(
        vX: number,
        vZ: number,
        slotX: number,
        slotY: number,
        mip: number = 0,
        state: PageState = PageState.Ready,
        tilesPerRow: number = 32
    ): void {
        if (vX < 0 || vX >= this.#virtualCountX || vZ < 0 || vZ >= this.#virtualCountZ) return;

        const index = (vZ * this.#virtualCountX + vX) * 4;

        this.#pageTableData[index] = slotX & 0xff;
        this.#pageTableData[index + 1] = slotY & 0xff;
        this.#pageTableData[index + 2] = mip & 0xff;
        this.#pageTableData[index + 3] = state;

        this.#flushEntryToGPU(vX, vZ);
    }

    public getEntry(vX: number, vZ: number): { slotX: number; slotY: number; mip: number; state: PageState } | null {
        if (vX < 0 || vX >= this.#virtualCountX || vZ < 0 || vZ >= this.#virtualCountZ) return null;
        const index = (vZ * this.#virtualCountX + vX) * 4;
        return {
            slotX: this.#pageTableData[index],
            slotY: this.#pageTableData[index + 1],
            mip: this.#pageTableData[index + 2],
            state: this.#pageTableData[index + 3] as PageState,
        };
    }

    public clearEntry(vX: number, vZ: number): void {
        if (vX < 0 || vX >= this.#virtualCountX || vZ < 0 || vZ >= this.#virtualCountZ) return;

        const index = (vZ * this.#virtualCountX + vX) * 4;
        this.#pageTableData[index] = 0;
        this.#pageTableData[index + 1] = 0;
        this.#pageTableData[index + 2] = 0;
        this.#pageTableData[index + 3] = PageState.Unallocated;

        this.#flushEntryToGPU(vX, vZ);
    }

    public clear(): void {
        this.#pageTableData.fill(0);
        if (this.#pageTableGPUTexture) {
            this.#redGPUContext.gpuDevice.queue.writeTexture(
                {texture: this.#pageTableGPUTexture},
                this.#pageTableData as unknown as BufferSource,
                {bytesPerRow: this.#virtualCountX * 4},
                [this.#virtualCountX, this.#virtualCountZ, 1]
            );
        }
    }

    public destroy(): void {
        this.#pageTableGPUTexture?.destroy();
        this.#pageTableGPUTexture = null;
        this.#pageTableDirectTexture = null;
    }

    #flushEntryToGPU(vX: number, vZ: number): void {
        if (!this.#pageTableGPUTexture) return;

        const index = (vZ * this.#virtualCountX + vX) * 4;
        const entryData = this.#pageTableData.subarray(index, index + 4);

        this.#redGPUContext.gpuDevice.queue.writeTexture(
            {texture: this.#pageTableGPUTexture, origin: [vX, vZ, 0]},
            entryData as unknown as BufferSource,
            {bytesPerRow: 4},
            [1, 1, 1]
        );
    }

    #initTexture(): void {
        const device = this.#redGPUContext.gpuDevice;

        this.#pageTableGPUTexture = device.createTexture({
            label: 'RVT_PageTable_IndirectionTexture',
            size: [this.#virtualCountX, this.#virtualCountZ, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        });

        const uid = Math.random().toString(36).slice(2);
        this.#pageTableDirectTexture = new DirectTexture(
            this.#redGPUContext,
            `RVT_PageTable_${uid}`,
            this.#pageTableGPUTexture
        );

        this.clear();
    }
}

Object.freeze(PageTable);
export default PageTable;
