/**
 * [KO] 식생 서브셀 인스턴스 GPU 동적 스트리머 모듈입니다.
 * [EN] Foliage sub-cell instance GPU dynamic streamer module.
 * @packageDocumentation
 */

import type Foliage from "../Foliage";
import type {FoliageSubCellChunk} from "./FoliageSubCellPartitioner";

/**
 * [KO] 카메라 위치와 뷰 프러스텀, 스트리밍 버짓에 따라 활성 서브셀의 인스턴스를 GPU 버퍼에 동적으로 마운트/언마운트하는 스트리머 클래스입니다.
 * [EN] Streamer class that dynamically mounts/unmounts active subcell instances to the GPU buffer according to camera position and streaming budget.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export default class FoliageSubCellStreamer {
    static readonly #STRIDE: number = 8;
    #tempCandidates: FoliageSubCellChunk[] = [];
    #sortCamX: number = 0;
    #sortCamZ: number = 0;
    #foliageType: Foliage;
    #chunks: Map<number, FoliageSubCellChunk> = new Map();
    #mountedChunks: FoliageSubCellChunk[] = [];
    #totalInstanceCount: number = 0;
    #mountBudget: number = 16;
    #unmountBudget: number = 32;

    /**
     * [KO] FoliageSubCellStreamer 인스턴스를 생성합니다.
     * [EN] Creates a FoliageSubCellStreamer instance.
     * @param foliageType -
     * [KO] 관리 대상 Foliage 인스턴스
     * [EN] Target Foliage instance to manage
     */
    constructor(foliageType: Foliage) {
        this.#foliageType = foliageType;
    }

    /**
     * [KO] 등록된 전체 서브셀 청크 수
     * [EN] Total number of registered sub-cell chunks
     */
    get totalChunkCount(): number {
        return this.#chunks.size;
    }

    /**
     * [KO] 등록된 전체 식생 인스턴스 수
     * [EN] Total number of registered foliage instances
     */
    get totalInstanceCount(): number {
        return this.#totalInstanceCount;
    }

    /**
     * [KO] 현재 GPU 버퍼에 마운트된 서브셀 청크 수
     * [EN] Number of sub-cell chunks currently mounted to GPU buffer
     */
    get mountedChunkCount(): number {
        return this.#mountedChunks.length;
    }

    /**
     * [KO] 프레임당 최대 마운트 허용 청크 수
     * [EN] Maximum chunks allowed to mount per frame
     */
    get mountBudget(): number {
        return this.#mountBudget;
    }

    set mountBudget(val: number) {
        this.#mountBudget = Math.max(1, (val | 0) || 1);
    }

    /**
     * [KO] 프레임당 최대 언마운트 허용 청크 수
     * [EN] Maximum chunks allowed to unmount per frame
     */
    get unmountBudget(): number {
        return this.#unmountBudget;
    }

    set unmountBudget(val: number) {
        this.#unmountBudget = Math.max(1, (val | 0) || 1);
    }

    /**
     * [KO] 카메라 위치와 활성 서브셀 목록을 기반으로 스트리밍 마운트/언마운트를 갱신합니다.
     * [EN] Updates streaming mounts/unmounts based on camera position and active sub-cell keys.
     * @param activeKeyArray -
     * [KO] 활성 서브셀 키 Int32Array
     * [EN] Active sub-cell keys Int32Array
     * @param activeKeyCount -
     * [KO] 활성 키 개수
     * [EN] Active key count
     * @param camX -
     * [KO] 카메라 월드 X 좌표
     * [EN] Camera world X coordinate
     * @param camZ -
     * [KO] 카메라 월드 Z 좌표
     * [EN] Camera world Z coordinate
     * @param enableStreaming -
     * [KO] 동적 스트리밍 활성화 여부 (false면 전체 마운트)
     * [EN] Whether dynamic streaming is enabled (mounts all if false)
     */
    update(
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

        const candidates = this.#tempCandidates;
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

        this.#sortCamX = camX;
        this.#sortCamZ = camZ;
        candidates.sort(this.#compareCandidates);

        const toMountCount = Math.min(candidates.length, this.#mountBudget);
        for (let i = 0; i < toMountCount; i++) {
            const chunk = candidates[i];
            this.#mountChunk(chunk, megaBuffer, allocation);
        }
    }

    /**
     * [KO] 새로운 서브셀 청크들을 스트리머에 등록합니다.
     * [EN] Registers new sub-cell chunks to the streamer.
     * @param newChunks -
     * [KO] 등록할 청크 맵
     * [EN] Map of chunks to register
     */
    addChunks(newChunks: Map<number, FoliageSubCellChunk>): void {
        newChunks.forEach((chunk, key) => {
            if (!this.#chunks.has(key)) {
                this.#chunks.set(key, chunk);
                this.#totalInstanceCount += chunk.instanceCount;
            }
        });
    }

    /**
     * [KO] 모든 서브셀 청크 등록 상태를 해제하고 인스턴스 마운트를 초기화합니다.
     * [EN] Unregisters all sub-cell chunks and resets instance mounts.
     */
    clear(): void {
        this.#tempCandidates.length = 0;
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

    #compareCandidates = (a: FoliageSubCellChunk, b: FoliageSubCellChunk): number => {
        const cx = this.#sortCamX;
        const cz = this.#sortCamZ;
        const da = (a.centerX - cx) * (a.centerX - cx) + (a.centerZ - cz) * (a.centerZ - cz);
        const db = (b.centerX - cx) * (b.centerX - cx) + (b.centerZ - cz) * (b.centerZ - cz);
        return da - db;
    };

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

