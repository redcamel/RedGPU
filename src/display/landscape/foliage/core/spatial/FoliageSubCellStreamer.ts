import type FoliageType from "../../FoliageType";
import type {FoliageSubCellChunk} from "./FoliageSubCellPartitioner";

/**
 * [KO] 서브셀 단위 인스턴스 마운트/언마운트 및 연속 압축(Continuous Compaction) 스트리밍 엔진
 * [EN] Sub-cell instance mount/unmount and Continuous Compaction streaming engine
 */
class FoliageSubCellStreamer {
    static readonly #STRIDE: number = 8;
    static readonly #tempCandidates: FoliageSubCellChunk[] = [];
    static #sortCamX: number = 0;
    static #sortCamZ: number = 0;
    readonly #foliageType: FoliageType;
    readonly #chunks: Map<number, FoliageSubCellChunk> = new Map();
    readonly #mountedChunks: FoliageSubCellChunk[] = [];
    #mountBudget: number = 8;
    #unmountBudget: number = 16;

    constructor(foliageType: FoliageType) {
        this.#foliageType = foliageType;
    }

    get totalChunkCount(): number {
        return this.#chunks.size;
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

    /**
     * [KO] 파티셔닝된 서브셀 청크들을 스트리머 캐시에 등록합니다.
     * [EN] Registers partitioned sub-cell chunks into the streamer cache.
     */
    addChunks(newChunks: Map<number, FoliageSubCellChunk>): void {
        newChunks.forEach((chunk, key) => {
            if (!this.#chunks.has(key)) {
                this.#chunks.set(key, chunk);
            }
        });
    }

    /**
     * [KO] 매 프레임 활성 서브셀 목록과 동기화하여 마운트/언마운트 및 연속 압축을 수행합니다 (Zero-GC).
     * [EN] Synchronizes with active sub-cell keys each frame for mounting, unmounting, and continuous compaction (Zero-GC).
     */
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

        // 스트리밍이 비활성화된 경우: 모든 청크를 일괄 마운트 상태로 유지
        if (!enableStreaming) {
            this.#mountAll(megaBuffer, allocation);
            return;
        }

        const typeRadius = this.#foliageType.streamingRadius;
        // 히스테리시스 (이탈 시 여유 반경 100m)
        const unmountRadius = typeRadius + 100.0;
        const unmountRadiusSq = unmountRadius * unmountRadius;

        // 1. 언마운트 처리 (카메라 반경 밖으로 나간 청크 회수 및 연속 압축)
        let unmountedThisFrame = 0;
        const mounted = this.#mountedChunks;
        for (let i = mounted.length - 1; i >= 0; i--) {
            if (unmountedThisFrame >= this.#unmountBudget) break;

            const chunk = mounted[i];
            const dx = chunk.centerX - camX;
            const dz = chunk.centerZ - camZ;
            const distSq = dx * dx + dz * dz;

            if (distSq > unmountRadiusSq || !activeSubCellKeys.has(chunk.subCellKey)) {
                this.#unmountChunkAt(i, megaBuffer, allocation);
                unmountedThisFrame++;
            }
        }

        // 2. 마운트 후보 수집 (활성 서브셀 중 아직 마운트되지 않았으며 해당 타입 반경 내인 청크, Zero-GC)
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

        // 3. 카메라 중심 거리 오름차순 정렬 (가까운 서브셀 최우선 마운트, Zero-GC)
        FoliageSubCellStreamer.#sortCamX = camX;
        FoliageSubCellStreamer.#sortCamZ = camZ;
        candidates.sort(FoliageSubCellStreamer.#compareCandidates);

        // 4. 프레임당 예산 내에서 마운트 실행
        const toMountCount = Math.min(candidates.length, this.#mountBudget);
        for (let i = 0; i < toMountCount; i++) {
            const chunk = candidates[i];
            this.#mountChunk(chunk, megaBuffer, allocation);
        }
    }

    /**
     * [KO] 모든 마운트된 청크를 해제하고 초기화합니다.
     * [EN] Clears and unmounts all chunks.
     */
    clear(): void {
        this.#mountedChunks.forEach(c => {
            c.isMounted = false;
            c.mountedSlotIndex = -1;
        });
        this.#mountedChunks.length = 0;
        this.#chunks.clear();
        if (this.#foliageType.allocation) {
            this.#foliageType.allocation.activeCount = 0;
        }
    }

    /**
     * [KO] 단일 청크를 GPU 메가버퍼의 현재 활성 구간 끝에 마운트합니다.
     * [EN] Mounts a single chunk at the end of the active GPU mega-buffer range.
     */
    #mountChunk(chunk: FoliageSubCellChunk, megaBuffer: any, allocation: any): void {
        if (chunk.isMounted) return;
        const currentActive = allocation.activeCount;
        const count = chunk.instanceCount;
        if (currentActive + count > allocation.maxInstances) return;

        const f32 = megaBuffer.cpuRawDataBuffer;
        const baseFloat = (allocation.rawBaseOffset + currentActive) * FoliageSubCellStreamer.#STRIDE;

        // 청크 데이터 복사
        f32.set(chunk.instanceData, baseFloat);

        chunk.isMounted = true;
        chunk.mountedSlotIndex = currentActive;
        this.#mountedChunks.push(chunk);

        allocation.activeCount = currentActive + count;
        this.#foliageType.uploadRangeToGPU(currentActive, count);
    }

    /**
     * [KO] 인덱스 위치의 청크를 언마운트하고, 뒤쪽 데이터들을 당겨(Shift-down) 연속성을 유지합니다 (Zero-GC).
     * [EN] Unmounts chunk at index and shifts down following data to maintain contiguous packing (Zero-GC).
     */
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

            // targetChunk 뒤에 있는 연속 데이터들을 앞으로 당김
            const copyStartFloat = (allocation.rawBaseOffset + targetSlot + targetCount) * FoliageSubCellStreamer.#STRIDE;
            const copyEndFloat = (allocation.rawBaseOffset + currentActive) * FoliageSubCellStreamer.#STRIDE;
            const destFloat = (allocation.rawBaseOffset + targetSlot) * FoliageSubCellStreamer.#STRIDE;

            if (copyEndFloat > copyStartFloat) {
                f32.copyWithin(destFloat, copyStartFloat, copyEndFloat);
            }

            // targetChunk 제거 및 뒤쪽 청크들의 mountedSlotIndex 갱신 (GC 0 유지: 슬롯 인덱스 시프트 후 pop)
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

            // 갱신된 슬롯 구간 GPU 업로드
            const uploadCount = newActive - targetSlot;
            if (uploadCount > 0) {
                this.#foliageType.uploadRangeToGPU(targetSlot, uploadCount);
            }
        }
    }

    /**
     * [KO] 모든 서브셀 청크를 일괄 마운트합니다 (스트리밍 비활성화 시).
     * [EN] Mounts all sub-cell chunks (when streaming is disabled).
     */
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
