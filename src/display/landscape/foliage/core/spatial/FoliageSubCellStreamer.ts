import type FoliageType from "../../FoliageType";
import type {FoliageSubCellChunk} from "./FoliageSubCellPartitioner";

class FoliageSubCellStreamer {
    static readonly #STRIDE: number = 8;
    static readonly #tempCandidates: FoliageSubCellChunk[] = [];
    static #sortCamX: number = 0;
    static #sortCamZ: number = 0;
    readonly #foliageType: FoliageType;
    readonly #chunks: Map<number, FoliageSubCellChunk> = new Map();
    readonly #mountedChunks: FoliageSubCellChunk[] = [];
    #totalInstanceCount: number = 0;
    #mountBudget: number = 16;
    #unmountBudget: number = 32;

    constructor(foliageType: FoliageType) {
        this.#foliageType = foliageType;
    }

    get totalChunkCount(): number {
        return this.#chunks.size;
    }

    get totalInstanceCount(): number {
        return this.#totalInstanceCount;
    }

    get mountedChunkCount(): number {
        return this.#mountedChunks.length;
    }

    get mountBudget(): number {
        return this.#mountBudget;
    }

    set mountBudget(val: number) {
        this.#mountBudget = Math.max(1, (val | 0) || 1);
    }

    get unmountBudget(): number {
        return this.#unmountBudget;
    }

    set unmountBudget(val: number) {
        this.#unmountBudget = Math.max(1, (val | 0) || 1);
    }

    static readonly #compareCandidates = (a: FoliageSubCellChunk, b: FoliageSubCellChunk): number => {
        const cx = FoliageSubCellStreamer.#sortCamX;
        const cz = FoliageSubCellStreamer.#sortCamZ;
        const da = (a.centerX - cx) * (a.centerX - cx) + (a.centerZ - cz) * (a.centerZ - cz);
        const db = (b.centerX - cx) * (b.centerX - cx) + (b.centerZ - cz) * (b.centerZ - cz);
        return da - db;
    };

    addChunks(newChunks: Map<number, FoliageSubCellChunk>): void {
        newChunks.forEach((chunk, key) => {
            if (!this.#chunks.has(key)) {
                this.#chunks.set(key, chunk);
                this.#totalInstanceCount += chunk.instanceCount;
            }
        });
    }

    update(
        activeSubCellKeys: ReadonlySet<number>,
        activeKeyArray: Int32Array,
        activeKeyCount: number,
        camX: number,
        camZ: number,
        enableStreaming: boolean = true
    ): void {
        const megaBuffer = this.#foliageType.megaBuffer;
        const allocation = this.#foliageType.allocation;
        if (!megaBuffer || !allocation) return;

        if (!enableStreaming) {
            this.#mountAll(megaBuffer, allocation);
            return;
        }

        const typeRadius = this.#foliageType.streamingRadius;

        const unmountRadius = typeRadius + 100.0;
        const unmountRadiusSq = unmountRadius * unmountRadius;

        let unmountedThisFrame = 0;
        const mounted = this.#mountedChunks;
        for (let i = mounted.length - 1; i >= 0; i--) {
            if (unmountedThisFrame >= this.#unmountBudget) break;

            const chunk = mounted[i];
            const dx = chunk.centerX - camX;
            const dz = chunk.centerZ - camZ;
            const distSq = dx * dx + dz * dz;

            if (distSq > unmountRadiusSq) {
                this.#unmountChunkAt(i, megaBuffer, allocation);
                unmountedThisFrame++;
            }
        }

        const candidates = FoliageSubCellStreamer.#tempCandidates;
        candidates.length = 0;

        const mountRadiusSq = typeRadius * typeRadius;
        for (let i = 0; i < activeKeyCount; i++) {
            const key = activeKeyArray[i];
            const chunk = this.#chunks.get(key);
            if (chunk && !chunk.isMounted) {
                const dx = chunk.centerX - camX;
                const dz = chunk.centerZ - camZ;
                if (dx * dx + dz * dz <= mountRadiusSq) {
                    candidates.push(chunk);
                }
            }
        }

        if (candidates.length === 0) return;

        FoliageSubCellStreamer.#sortCamX = camX;
        FoliageSubCellStreamer.#sortCamZ = camZ;
        candidates.sort(FoliageSubCellStreamer.#compareCandidates);

        const toMountCount = Math.min(candidates.length, this.#mountBudget);
        for (let i = 0; i < toMountCount; i++) {
            const chunk = candidates[i];
            this.#mountChunk(chunk, megaBuffer, allocation);
        }
    }

    clear(): void {
        this.#mountedChunks.forEach(c => {
            c.isMounted = false;
            c.mountedSlotIndex = -1;
        });
        this.#mountedChunks.length = 0;
        this.#chunks.clear();
        this.#totalInstanceCount = 0;
        if (this.#foliageType.allocation) {
            this.#foliageType.allocation.activeCount = 0;
        }
    }

    #mountChunk(chunk: FoliageSubCellChunk, megaBuffer: any, allocation: any): void {
        if (chunk.isMounted) return;
        const currentActive = allocation.activeCount;
        const count = chunk.instanceCount;
        if (currentActive + count > allocation.maxInstances) return;

        const f32 = megaBuffer.cpuRawDataBuffer;
        const baseFloat = (allocation.rawBaseOffset + currentActive) * FoliageSubCellStreamer.#STRIDE;

        f32.set(chunk.instanceData, baseFloat);

        chunk.isMounted = true;
        chunk.mountedSlotIndex = currentActive;
        this.#mountedChunks.push(chunk);

        allocation.activeCount = currentActive + count;
        this.#foliageType.uploadRangeToGPU(currentActive, count);
    }

    #unmountChunkAt(mountedIndex: number, megaBuffer: any, allocation: any): void {
        const mounted = this.#mountedChunks;
        const targetChunk = mounted[mountedIndex];
        const targetSlot = targetChunk.mountedSlotIndex;
        const targetCount = targetChunk.instanceCount;
        const currentActive = allocation.activeCount;

        const isLastChunk = (mountedIndex === mounted.length - 1);

        if (isLastChunk) {
            mounted.pop();
            targetChunk.isMounted = false;
            targetChunk.mountedSlotIndex = -1;
            allocation.activeCount = Math.max(0, currentActive - targetCount);
        } else {
            const f32 = megaBuffer.cpuRawDataBuffer;

            const copyStartFloat = (allocation.rawBaseOffset + targetSlot + targetCount) * FoliageSubCellStreamer.#STRIDE;
            const copyEndFloat = (allocation.rawBaseOffset + currentActive) * FoliageSubCellStreamer.#STRIDE;
            const destFloat = (allocation.rawBaseOffset + targetSlot) * FoliageSubCellStreamer.#STRIDE;

            if (copyEndFloat > copyStartFloat) {
                f32.copyWithin(destFloat, copyStartFloat, copyEndFloat);
            }

            for (let i = mountedIndex; i < mounted.length - 1; i++) {
                const next = mounted[i + 1];
                next.mountedSlotIndex -= targetCount;
                mounted[i] = next;
            }
            mounted.pop();

            targetChunk.isMounted = false;
            targetChunk.mountedSlotIndex = -1;

            const newActive = Math.max(0, currentActive - targetCount);
            allocation.activeCount = newActive;

            const uploadCount = newActive - targetSlot;
            if (uploadCount > 0) {
                this.#foliageType.uploadRangeToGPU(targetSlot, uploadCount);
            }
        }
    }

    #mountAll(megaBuffer: any, allocation: any): void {
        if (this.#mountedChunks.length === this.#chunks.size) return;

        this.#chunks.forEach(chunk => {
            if (!chunk.isMounted) {
                this.#mountChunk(chunk, megaBuffer, allocation);
            }
        });
    }
}

Object.freeze(FoliageSubCellStreamer);
export default FoliageSubCellStreamer;
