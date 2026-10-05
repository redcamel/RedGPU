/**
 * [KO] 식생 서브메시용 256바이트 정렬 Dynamic Offset UBO 슬롯 풀러 모듈입니다.
 * [EN] 256-byte aligned dynamic offset UBO slot pooler module for foliage sub-meshes.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";

const identityMatrix: mat4 = mat4.create();

/**
 * [KO] 최대 1,024개 서브메시(256 KB)의 UBO 슬롯을 관리하고, Zero-GC 방식으로 CPU 미러 버퍼를 갱신/업로드하는 슬롯 풀러 클래스입니다.
 * [EN] Slot pooler class managing UBO slots for up to 1,024 sub-meshes (256 KB) and updating/uploading CPU mirror buffers with zero-GC.
 */
export class FoliageSubMeshSlotPooler {
    static MAX_SLOTS: number = 1024;
    static SLOT_STRIDE_BYTES: number = 256;
    static SLOT_STRIDE_FLOATS: number = 64; // 256 / 4
    static PARAMS_SIZE_BYTES: number = 160;
    static PARAMS_SIZE_FLOATS: number = 40;  // 160 / 4

    #cpuBuffer: Float32Array;
    #cpuUint32View: Uint32Array;
    #freeSlotStack: Int32Array;
    #freeTop: number = 0;
    #allocatedCount: number = 0;

    constructor() {
        const totalFloats = FoliageSubMeshSlotPooler.MAX_SLOTS * FoliageSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        this.#cpuBuffer = new Float32Array(totalFloats);
        this.#cpuUint32View = new Uint32Array(this.#cpuBuffer.buffer);

        const maxSlots = FoliageSubMeshSlotPooler.MAX_SLOTS;
        this.#freeSlotStack = new Int32Array(maxSlots);
        for (let i = 0; i < maxSlots; i++) {
            // LIFO 스택: 0번부터 순차 할당되도록 역순으로 push
            this.#freeSlotStack[i] = maxSlots - 1 - i;
        }
        this.#freeTop = maxSlots;
    }

    /**
     * [KO] CPU 미러 버퍼 (Float32Array)를 반환합니다.
     * [EN] Returns the CPU mirror buffer (Float32Array).
     */
    get cpuBuffer(): Float32Array {
        return this.#cpuBuffer;
    }

    /**
     * [KO] 현재 할당된 활성 슬롯 개수를 반환합니다.
     * [EN] Returns the number of currently allocated active slots.
     */
    get allocatedCount(): number {
        return this.#allocatedCount;
    }

    /**
     * [KO] 새 서브메시용 슬롯 인덱스를 할당합니다 (0 ~ 1023).
     * [EN] Allocates a slot index for a new sub-mesh (0 ~ 1023).
     * @returns 할당된 슬롯 번호 (슬롯 고갈 시 -1)
     */
    allocateSlot(): number {
        if (this.#freeTop <= 0) {
            console.error(`[FoliageSubMeshSlotPooler] Exhausted all ${FoliageSubMeshSlotPooler.MAX_SLOTS} UBO slots!`);
            return -1;
        }
        this.#freeTop--;
        const slot = this.#freeSlotStack[this.#freeTop];
        this.#allocatedCount++;
        return slot;
    }

    /**
     * [KO] 사용이 끝난 서브메시 슬롯 인덱스를 풀에 반환합니다.
     * [EN] Releases a finished sub-mesh slot index back to the pool.
     * @param slot - 반환할 슬롯 번호
     */
    freeSlot(slot: number): void {
        if (slot < 0 || slot >= FoliageSubMeshSlotPooler.MAX_SLOTS) return;
        if (this.#freeTop >= FoliageSubMeshSlotPooler.MAX_SLOTS) return;

        // 슬롯 메모리 0 초기화 (160B / 40 floats)
        const baseFloat = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        this.#cpuBuffer.fill(0, baseFloat, baseFloat + FoliageSubMeshSlotPooler.PARAMS_SIZE_FLOATS);

        this.#freeSlotStack[this.#freeTop] = slot;
        this.#freeTop++;
        this.#allocatedCount = Math.max(0, this.#allocatedCount - 1);
    }

    /**
     * [KO] PBR 서브메시의 파라미터 데이터를 지정된 슬롯에 기록하고 GPU에 즉시 전송합니다.
     * [EN] Writes PBR sub-mesh parameter data to the specified slot and uploads immediately to GPU.
     */
    writePBRSubMeshSlot(
        gpuDevice: GPUDevice,
        gpuBuffer: GPUBuffer,
        slot: number,
        relMatrix: mat4,
        normMatrix: mat4,
        globalSlot: number,
        receiveShadow: boolean,
        isMasked: boolean,
        applyGroundBlend: boolean,
        groundBlendStrength?: number,
        groundBlendRange?: number,
        windMultiplier?: number,
        treeHeight?: number,
        windFlutterMultiplier?: number
    ): void {
        if (slot < 0 || slot >= FoliageSubMeshSlotPooler.MAX_SLOTS) return;

        const baseFloat = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        const f32 = this.#cpuBuffer;
        const u32 = this.#cpuUint32View;

        f32.set(relMatrix, baseFloat);
        f32.set(normMatrix, baseFloat + 16);
        u32[baseFloat + 32] = globalSlot;

        const isIdentity = (
            relMatrix[0] === 1 && relMatrix[1] === 0 && relMatrix[2] === 0 && relMatrix[3] === 0 &&
            relMatrix[4] === 0 && relMatrix[5] === 1 && relMatrix[6] === 0 && relMatrix[7] === 0 &&
            relMatrix[8] === 0 && relMatrix[9] === 0 && relMatrix[10] === 1 && relMatrix[11] === 0 &&
            relMatrix[12] === 0 && relMatrix[13] === 0 && relMatrix[14] === 0 && relMatrix[15] === 1
        );
        u32[baseFloat + 33] = isIdentity ? 0 : 1;
        f32[baseFloat + 34] = receiveShadow ? 1.0 : 0.0;

        f32[baseFloat + 35] = windMultiplier ?? 1.0;
        f32[baseFloat + 36] = isMasked ? (windFlutterMultiplier ?? 1.0) : 0.0;
        f32[baseFloat + 37] = treeHeight ?? 5.0;

        f32[baseFloat + 38] = applyGroundBlend ? (groundBlendStrength ?? 0.8) : 0.0;
        f32[baseFloat + 39] = groundBlendRange ?? 1.5;

        // GPU 버퍼의 해당 슬롯 위치(slot * 256 바이트)에 160바이트만 정확히 전송
        const offsetBytes = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_BYTES;
        const offsetElements = baseFloat;
        gpuDevice.queue.writeBuffer(
            gpuBuffer,
            offsetBytes,
            f32.buffer,
            f32.byteOffset + offsetElements * 4,
            FoliageSubMeshSlotPooler.PARAMS_SIZE_BYTES
        );
    }

    /**
     * [KO] 그림자 병합 서브메시의 파라미터 데이터를 지정된 슬롯에 기록하고 GPU에 즉시 전송합니다.
     * [EN] Writes shadow merged sub-mesh parameter data to the specified slot and uploads immediately to GPU.
     */
    writeShadowSubMeshSlot(
        gpuDevice: GPUDevice,
        gpuBuffer: GPUBuffer,
        slot: number,
        windMultiplier?: number,
        treeHeight?: number,
        windFlutterMultiplier?: number
    ): void {
        if (slot < 0 || slot >= FoliageSubMeshSlotPooler.MAX_SLOTS) return;

        const baseFloat = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        const f32 = this.#cpuBuffer;
        const u32 = this.#cpuUint32View;

        f32.set(identityMatrix, baseFloat);
        f32.set(identityMatrix, baseFloat + 16);
        u32[baseFloat + 32] = 0;
        u32[baseFloat + 33] = 0;
        f32[baseFloat + 34] = 0.0;

        f32[baseFloat + 35] = windMultiplier ?? 1.0;
        f32[baseFloat + 36] = (windFlutterMultiplier ?? 1.0) * 0.5;
        f32[baseFloat + 37] = treeHeight ?? 5.0;

        f32[baseFloat + 38] = 0.0;
        f32[baseFloat + 39] = 1.5;

        const offsetBytes = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_BYTES;
        const offsetElements = baseFloat;
        gpuDevice.queue.writeBuffer(
            gpuBuffer,
            offsetBytes,
            f32.buffer,
            f32.byteOffset + offsetElements * 4,
            FoliageSubMeshSlotPooler.PARAMS_SIZE_BYTES
        );
    }

    /**
     * [KO] 특정 서브메시 슬롯의 그림자 수신 플래그를 업데이트하고 GPU에 즉시 반영합니다 (Zero-GC).
     * [EN] Updates shadow receiving flag for a specific sub-mesh slot and reflects to GPU immediately (Zero-GC).
     */
    updateReceiveShadow(
        gpuDevice: GPUDevice,
        gpuBuffer: GPUBuffer,
        slot: number,
        receiveShadow: boolean
    ): void {
        if (slot < 0 || slot >= FoliageSubMeshSlotPooler.MAX_SLOTS) return;
        const baseFloat = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        const f32 = this.#cpuBuffer;
        const val = receiveShadow ? 1.0 : 0.0;
        if (f32[baseFloat + 34] === val) return;

        f32[baseFloat + 34] = val;

        const offsetBytes = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_BYTES + 34 * 4;
        gpuDevice.queue.writeBuffer(
            gpuBuffer,
            offsetBytes,
            f32.buffer,
            f32.byteOffset + (baseFloat + 34) * 4,
            4
        );
    }

    /**
     * [KO] 특정 서브메시 슬롯의 바람 파라미터를 업데이트하고 GPU에 즉시 반영합니다 (Zero-GC).
     * [EN] Updates wind parameters for a specific sub-mesh slot and reflects to GPU immediately (Zero-GC).
     */
    updateWindParams(
        gpuDevice: GPUDevice,
        gpuBuffer: GPUBuffer,
        slot: number,
        windMultiplier: number,
        windFlutterMultiplier: number,
        treeHeight: number
    ): void {
        if (slot < 0 || slot >= FoliageSubMeshSlotPooler.MAX_SLOTS) return;
        const baseFloat = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        const f32 = this.#cpuBuffer;

        f32[baseFloat + 35] = windMultiplier;
        f32[baseFloat + 36] = windFlutterMultiplier;
        f32[baseFloat + 37] = treeHeight;

        // 35, 36, 37번 인덱스 (12바이트)만 정밀 업로드
        const offsetBytes = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_BYTES + 35 * 4;
        gpuDevice.queue.writeBuffer(
            gpuBuffer,
            offsetBytes,
            f32.buffer,
            f32.byteOffset + (baseFloat + 35) * 4,
            12
        );
    }

    /**
     * [KO] 특정 서브메시 슬롯의 지면 블렌딩 파라미터를 업데이트하고 GPU에 즉시 반영합니다 (Zero-GC).
     * [EN] Updates ground blending parameters for a specific sub-mesh slot and reflects to GPU immediately (Zero-GC).
     */
    updateGroundBlendParams(
        gpuDevice: GPUDevice,
        gpuBuffer: GPUBuffer,
        slot: number,
        strength: number,
        range: number
    ): void {
        if (slot < 0 || slot >= FoliageSubMeshSlotPooler.MAX_SLOTS) return;
        const baseFloat = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        const f32 = this.#cpuBuffer;

        f32[baseFloat + 38] = strength;
        f32[baseFloat + 39] = range;

        // 38, 39번 인덱스 (8바이트)만 정밀 업로드
        const offsetBytes = slot * FoliageSubMeshSlotPooler.SLOT_STRIDE_BYTES + 38 * 4;
        gpuDevice.queue.writeBuffer(
            gpuBuffer,
            offsetBytes,
            f32.buffer,
            f32.byteOffset + (baseFloat + 38) * 4,
            8
        );
    }

    /**
     * [KO] 모든 슬롯 상태를 초기화합니다.
     * [EN] Resets all slot states.
     */
    clear(): void {
        this.#cpuBuffer.fill(0);
        const maxSlots = FoliageSubMeshSlotPooler.MAX_SLOTS;
        for (let i = 0; i < maxSlots; i++) {
            this.#freeSlotStack[i] = maxSlots - 1 - i;
        }
        this.#freeTop = maxSlots;
        this.#allocatedCount = 0;
    }
}

Object.freeze(FoliageSubMeshSlotPooler);
