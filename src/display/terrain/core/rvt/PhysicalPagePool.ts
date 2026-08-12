import RedGPUContext from "../../../../context/RedGPUContext";
import DirectTexture from "../../../../resources/texture/DirectTexture";

export interface PhysicalPagePoolOptions {
    tileSize?: number;
    borderSize?: number;
    atlasSize?: number;
}

export interface PageSlotInfo {
    slotIndex: number;
    slotX: number;
    slotY: number;
    pixelX: number;
    pixelY: number;
    isEvicted: boolean;
    evictedVirtualKey: string | null;
}

export class PhysicalPagePool {
    readonly #redGPUContext: RedGPUContext;
    readonly #tileSize: number;
    readonly #borderSize: number;
    readonly #tileSizeWithBorder: number;
    readonly #atlasSize: number;
    readonly #tilesPerRow: number;
    readonly #totalSlots: number;

    #albedoAtlasGPU: GPUTexture | null = null;
    #normalORMAtlasGPU: GPUTexture | null = null;
    #albedoStorageView: GPUTextureView | null = null;
    #normalORMStorageView: GPUTextureView | null = null;

    #albedoDirectTexture: DirectTexture | null = null;
    #normalORMDirectTexture: DirectTexture | null = null;

    readonly #virtualToSlotMap = new Map<string, number>();
    readonly #slotToVirtualMap = new Map<number, string>();
    readonly #lruList: number[] = [];

    constructor(redGPUContext: RedGPUContext, options: PhysicalPagePoolOptions = {}) {
        this.#redGPUContext = redGPUContext;
        this.#tileSize = options.tileSize ?? 128;
        this.#borderSize = options.borderSize ?? 4;
        this.#tileSizeWithBorder = this.#tileSize + this.#borderSize * 2;
        this.#atlasSize = options.atlasSize ?? 4096;

        this.#tilesPerRow = Math.floor(this.#atlasSize / this.#tileSizeWithBorder);
        this.#totalSlots = this.#tilesPerRow * this.#tilesPerRow;

        for (let i = 0; i < this.#totalSlots; i++) {
            this.#lruList.push(i);
        }

        this.#initTextures();
    }

    get tileSize(): number {
        return this.#tileSize;
    }

    get borderSize(): number {
        return this.#borderSize;
    }

    get tileSizeWithBorder(): number {
        return this.#tileSizeWithBorder;
    }

    get atlasSize(): number {
        return this.#atlasSize;
    }

    get tilesPerRow(): number {
        return this.#tilesPerRow;
    }

    get totalSlots(): number {
        return this.#totalSlots;
    }

    get allocatedCount(): number {
        return this.#virtualToSlotMap.size;
    }

    get albedoDirectTexture(): DirectTexture | null {
        return this.#albedoDirectTexture;
    }

    get normalORMDirectTexture(): DirectTexture | null {
        return this.#normalORMDirectTexture;
    }

    get albedoStorageView(): GPUTextureView | null {
        return this.#albedoStorageView;
    }

    get normalORMStorageView(): GPUTextureView | null {
        return this.#normalORMStorageView;
    }

    public getSlotForVirtualKey(virtualKey: string): PageSlotInfo | null {
        const slotIndex = this.#virtualToSlotMap.get(virtualKey);
        if (slotIndex === undefined) return null;
        this.touchPage(virtualKey);
        return this.#createSlotInfo(slotIndex, false, null);
    }

    public allocatePage(virtualKey: string): PageSlotInfo {
        const existingSlot = this.#virtualToSlotMap.get(virtualKey);
        if (existingSlot !== undefined) {
            this.touchPage(virtualKey);
            return this.#createSlotInfo(existingSlot, false, null);
        }

        const slotIndex = this.#lruList.shift()!;
        this.#lruList.push(slotIndex);

        let isEvicted = false;
        let evictedVirtualKey: string | null = null;

        const oldVirtualKey = this.#slotToVirtualMap.get(slotIndex);
        if (oldVirtualKey !== undefined) {
            this.#virtualToSlotMap.delete(oldVirtualKey);
            isEvicted = true;
            evictedVirtualKey = oldVirtualKey;
        }

        this.#virtualToSlotMap.set(virtualKey, slotIndex);
        this.#slotToVirtualMap.set(slotIndex, virtualKey);

        return this.#createSlotInfo(slotIndex, isEvicted, evictedVirtualKey);
    }

    public touchPage(virtualKey: string): void {
        const slotIndex = this.#virtualToSlotMap.get(virtualKey);
        if (slotIndex === undefined) return;
        const indexInLru = this.#lruList.indexOf(slotIndex);
        if (indexInLru !== -1) {
            this.#lruList.splice(indexInLru, 1);
            this.#lruList.push(slotIndex);
        }
    }

    public clear(): void {
        this.#virtualToSlotMap.clear();
        this.#slotToVirtualMap.clear();
        this.#lruList.length = 0;
        for (let i = 0; i < this.#totalSlots; i++) {
            this.#lruList.push(i);
        }
    }

    public destroy(): void {
        this.#albedoAtlasGPU?.destroy();
        this.#normalORMAtlasGPU?.destroy();
        this.#albedoAtlasGPU = null;
        this.#normalORMAtlasGPU = null;
        this.#albedoStorageView = null;
        this.#normalORMStorageView = null;
        this.#albedoDirectTexture = null;
        this.#normalORMDirectTexture = null;
        this.clear();
    }

    #createSlotInfo(slotIndex: number, isEvicted: boolean, evictedVirtualKey: string | null): PageSlotInfo {
        const slotX = slotIndex % this.#tilesPerRow;
        const slotY = Math.floor(slotIndex / this.#tilesPerRow);
        const pixelX = slotX * this.#tileSizeWithBorder;
        const pixelY = slotY * this.#tileSizeWithBorder;
        return {slotIndex, slotX, slotY, pixelX, pixelY, isEvicted, evictedVirtualKey};
    }

    #initTextures(): void {
        const device = this.#redGPUContext.gpuDevice;
        const size = this.#atlasSize;

        this.#albedoAtlasGPU = device.createTexture({
            label: 'RVT_PhysicalPagePool_AlbedoAtlas',
            size: [size, size, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
        });

        this.#normalORMAtlasGPU = device.createTexture({
            label: 'RVT_PhysicalPagePool_NormalORMAtlas',
            size: [size, size, 1],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
        });

        this.#albedoStorageView = this.#albedoAtlasGPU.createView();
        this.#normalORMStorageView = this.#normalORMAtlasGPU.createView();

        const uid = Math.random().toString(36).slice(2);
        this.#albedoDirectTexture = new DirectTexture(this.#redGPUContext, `RVT_Physical_Albedo_${uid}`, this.#albedoAtlasGPU);
        this.#normalORMDirectTexture = new DirectTexture(this.#redGPUContext, `RVT_Physical_NormalORM_${uid}`, this.#normalORMAtlasGPU);
    }
}

Object.freeze(PhysicalPagePool);
export default PhysicalPagePool;
