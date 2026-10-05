/**
 * [KO] 식생 서브셀 인스턴스 GPU 동적 스트리머 모듈입니다.
 * [EN] Foliage sub-cell instance GPU dynamic streamer module.
 * @packageDocumentation
 */

import type Foliage from "../Foliage";
import FoliageSubCellPartitioner, {type FoliageSubCell} from "./FoliageSubCellPartitioner";
import type FoliageScatterMegaBuffer from "../buffer/FoliageScatterMegaBuffer";
import {sortSubCellsByDistance} from "../../../core/scatter";

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
    #tempCandidates: FoliageSubCell[] = [];
    #candidateDists: Float32Array = new Float32Array(512);
    #foliage: Foliage;
    #subCells: Map<number, FoliageSubCell> = new Map();
    #mountedSubCells: FoliageSubCell[] = [];
    #lastMountedCount: number = 0;
    #lastUnmountedCount: number = 0;

    /**
     * [KO] FoliageSubCellStreamer 인스턴스를 생성합니다.
     * [EN] Creates a FoliageSubCellStreamer instance.
     * @param foliage -
     * [KO] 관리 대상 Foliage 인스턴스
     * [EN] Target Foliage instance to manage
     */
    constructor(foliage: Foliage) {
        this.#foliage = foliage;
    }

    /**
     * [KO] 직전 스트리밍 업데이트에서 실제로 마운트된 서브셀 개수
     * [EN] Number of sub-cells actually mounted in the last streaming update
     */
    get lastMountedCount(): number {
        return this.#lastMountedCount;
    }

    /**
     * [KO] 직전 스트리밍 업데이트에서 실제로 언마운트된 서브셀 개수
     * [EN] Number of sub-cells actually unmounted in the last streaming update
     */
    get lastUnmountedCount(): number {
        return this.#lastUnmountedCount;
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
     * @param mountBudget -
     * [KO] 이번 업데이트에서 마운트 가능한 최대 서브셀 수 (기본값: 16)
     * [EN] Maximum sub-cells allowed to mount in this update (default: 16)
     * @param unmountBudget -
     * [KO] 이번 업데이트에서 언마운트 가능한 최대 서브셀 수 (기본값: 32)
     * [EN] Maximum sub-cells allowed to unmount in this update (default: 32)
     */
    update(
        activeKeyArray: Int32Array,
        activeKeyCount: number,
        camX: number,
        camZ: number,
        enableStreaming: boolean = true,
        mountBudget: number = 16,
        unmountBudget: number = 32
    ): void {
        this.#lastMountedCount = 0;
        this.#lastUnmountedCount = 0;

        const megaBuffer = this.#foliage.megaBuffer;
        const allocation = this.#foliage.allocation;
        if (!megaBuffer || !allocation) return;

        if (!enableStreaming) {
            this.#mountAll(megaBuffer, allocation);
            return;
        }

        const typeRadius = this.#foliage.streamingRadius;
        const subCellSize = this.#foliage.landscape?.foliageManager?.subCellSize ?? 100.0;
        const unmountMargin = Math.max(10.0, subCellSize * 0.5);
        const unmountRadius = typeRadius + unmountMargin;
        const unmountRadiusSq = unmountRadius * unmountRadius;

        let unmountedThisFrame = 0;
        const mounted = this.#mountedSubCells;
        for (let i = mounted.length - 1; i >= 0; i--) {
            if (unmountedThisFrame >= unmountBudget) break;

            const subCell = mounted[i];
            const dx = subCell.centerX - camX;
            const dz = subCell.centerZ - camZ;
            const distSq = dx * dx + dz * dz;

            if (distSq > unmountRadiusSq) {
                this.#unmountSubCellAt(i, megaBuffer, allocation);
                unmountedThisFrame++;
            }
        }
        this.#lastUnmountedCount = unmountedThisFrame;

        if (mountBudget <= 0) return;

        const candidates = this.#tempCandidates;
        candidates.length = 0;

        const mountRadiusSq = typeRadius * typeRadius;
        for (let i = 0; i < activeKeyCount; i++) {
            const key = activeKeyArray[i];
            const subCell = this.#subCells.get(key);
            if (subCell && !subCell.isMounted) {
                const dx = subCell.centerX - camX;
                const dz = subCell.centerZ - camZ;
                if (dx * dx + dz * dz <= mountRadiusSq) {
                    candidates.push(subCell);
                }
            }
        }

        const candidateCount = candidates.length;
        if (candidateCount === 0) return;

        if (this.#candidateDists.length < candidateCount) {
            this.#candidateDists = new Float32Array(Math.max(candidateCount, this.#candidateDists.length * 2));
        }
        sortSubCellsByDistance(candidates, this.#candidateDists, camX, camZ, candidateCount);

        const toMountCount = Math.min(candidateCount, mountBudget);
        for (let i = 0; i < toMountCount; i++) {
            const subCell = candidates[i];
            this.#mountSubCell(subCell, megaBuffer, allocation);
        }
        this.#lastMountedCount = toMountCount;
    }

    /**
     * [KO] 새로운 서브셀들을 스트리머에 등록합니다.
     * [EN] Registers new sub-cells to the streamer.
     * @param newSubCells -
     * [KO] 등록할 서브셀 맵
     * [EN] Map of sub-cells to register
     */
    addSubCells(newSubCells: Map<number, FoliageSubCell>): void {
        newSubCells.forEach((subCell, key) => {
            if (!this.#subCells.has(key)) {
                this.#subCells.set(key, subCell);
            }
        });
    }


    /**
     * [KO] 모든 서브셀 등록 상태를 해제하고 인스턴스 마운트를 초기화합니다.
     * [EN] Unregisters all sub-cells and resets instance mounts.
     */
    clear(): void {
        this.#tempCandidates.length = 0;
        this.#mountedSubCells.forEach(c => {
            c.isMounted = false;
            c.mountedSlotIndex = -1;
        });
        this.#mountedSubCells.length = 0;
        this.#subCells.clear();
        this.#lastMountedCount = 0;
        this.#lastUnmountedCount = 0;
        if (this.#foliage.allocation) {
            this.#foliage.allocation.instanceCount = 0;
        }
    }

    #mountSubCell(subCell: FoliageSubCell, megaBuffer: FoliageScatterMegaBuffer, allocation: any): void {
        if (subCell.isMounted) return;
        const currentActive = allocation.instanceCount;
        const count = subCell.instanceCount;
        if (currentActive + count > allocation.maxInstances) return;

        const f32 = megaBuffer.cpuRawDataBuffer;
        const u32 = megaBuffer.cpuRawDataUint32;
        const strideFloats = megaBuffer.strideFloats;
        const baseFloat = (allocation.rawBaseOffset + currentActive) * strideFloats;
        const subCellSize = this.#foliage.landscape?.foliageManager?.subCellSize ?? 100.0;
        FoliageSubCellPartitioner.populateSubCellInstances(
            f32,
            u32,
            baseFloat,
            subCell,
            this.#foliage,
            this.#foliage.landscape,
            subCellSize
        );

        subCell.isMounted = true;
        subCell.mountedSlotIndex = currentActive;
        this.#mountedSubCells.push(subCell);

        allocation.instanceCount = currentActive + count;
        this.#foliage.uploadRangeToGPU(currentActive, count);
    }

    #unmountSubCellAt(mountedIndex: number, megaBuffer: FoliageScatterMegaBuffer, allocation: any): void {
        const mounted = this.#mountedSubCells;
        const targetSubCell = mounted[mountedIndex];
        const targetSlot = targetSubCell.mountedSlotIndex;
        const targetCount = targetSubCell.instanceCount;
        const currentActive = allocation.instanceCount;

        const isLast = (mountedIndex === mounted.length - 1);

        if (isLast) {
            mounted.pop();
            targetSubCell.isMounted = false;
            targetSubCell.mountedSlotIndex = -1;
            allocation.instanceCount = Math.max(0, currentActive - targetCount);
        } else {
            // [KO] Swap-with-Last (O(1)): 맨 마지막 서브셀을 제거할 중간 슬롯 위치로 1회만 이동
            // [EN] Swap-with-Last (O(1)): Move only the last subcell into the target slot position
            const lastSubCell = mounted.pop()!;
            const lastSlot = lastSubCell.mountedSlotIndex;
            const lastCount = lastSubCell.instanceCount;

            const f32 = megaBuffer.cpuRawDataBuffer;
            const strideFloats = megaBuffer.strideFloats;

            const srcStartFloat = (allocation.rawBaseOffset + lastSlot) * strideFloats;
            const srcEndFloat = srcStartFloat + lastCount * strideFloats;
            const destFloat = (allocation.rawBaseOffset + targetSlot) * strideFloats;

            f32.copyWithin(destFloat, srcStartFloat, srcEndFloat);

            lastSubCell.mountedSlotIndex = targetSlot;
            mounted[mountedIndex] = lastSubCell;

            targetSubCell.isMounted = false;
            targetSubCell.mountedSlotIndex = -1;

            allocation.instanceCount = Math.max(0, currentActive - targetCount);

            // [KO] 단 1개 서브셀 분량(lastCount)만 GPU 버퍼에 갱신 전송
            // [EN] Upload only the swapped single subcell range (lastCount) to the GPU buffer
            this.#foliage.uploadRangeToGPU(targetSlot, lastCount);
        }
    }

    #mountAll(megaBuffer: any, allocation: any): void {
        if (this.#mountedSubCells.length === this.#subCells.size) return;

        this.#subCells.forEach(subCell => {
            if (!subCell.isMounted) {
                this.#mountSubCell(subCell, megaBuffer, allocation);
            }
        });
    }
}

Object.freeze(FoliageSubCellStreamer);
