/**
 * [KO] 잔디 렌더링용 256바이트 정렬 Dynamic Offset UBO 슬롯 풀러 모듈입니다.
 * [EN] 256-byte aligned dynamic offset UBO slot pooler module for grass rendering.
 * @packageDocumentation
 */

import RedGPUContext from "../../../../context/RedGPUContext";
import {Grass} from "../Grass";

/**
 * [KO] 최대 256개 잔디 슬롯(64 KB)의 UBO 슬롯을 관리하고, Zero-GC 방식으로 CPU 미러 버퍼를 갱신/업로드하는 슬롯 풀러 클래스입니다.
 * [EN] Slot pooler class managing UBO slots for up to 256 grass slots (64 KB) and updating/uploading CPU mirror buffers with zero-GC.
 */
export class GrassSubMeshSlotPooler {
    static MAX_SLOTS: number = 256;
    static SLOT_STRIDE_BYTES: number = 256;
    static SLOT_STRIDE_FLOATS: number = 64; // 256 / 4
    static PARAMS_SIZE_BYTES: number = 80;
    static PARAMS_SIZE_FLOATS: number = 20; // 80 / 4

    #redGPUContext: RedGPUContext;
    #gpuBuffer: GPUBuffer | null = null;
    #cpuBuffer: Float32Array;
    #cpuUint32View: Uint32Array;
    #freeSlotStack: Int32Array;
    #freeTop: number = 0;
    #allocatedCount: number = 0;

    /**
     * [KO] GrassSubMeshSlotPooler 인스턴스를 생성하고 64KB 고정 메가 UBO 및 CPU 미러 버퍼를 사전 할당합니다.
     * [EN] Creates a GrassSubMeshSlotPooler instance and pre-allocates a 64KB fixed mega UBO and CPU mirror buffers.
     *
     * @param redGPUContext - RedGPU 컨텍스트 인스턴스
     */
    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;

        const maxSlots = GrassSubMeshSlotPooler.MAX_SLOTS;
        const totalFloats = maxSlots * GrassSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        this.#cpuBuffer = new Float32Array(totalFloats);
        this.#cpuUint32View = new Uint32Array(this.#cpuBuffer.buffer);

        this.#freeSlotStack = new Int32Array(maxSlots);
        for (let i = 0; i < maxSlots; i++) {
            // LIFO 스택: 0번부터 순차 할당되도록 역순으로 push
            this.#freeSlotStack[i] = maxSlots - 1 - i;
        }
        this.#freeTop = maxSlots;

        const {gpuDevice} = redGPUContext;
        if (gpuDevice) {
            this.#gpuBuffer = gpuDevice.createBuffer({
                label: 'Grass_SubMesh_MegaUBO',
                size: maxSlots * GrassSubMeshSlotPooler.SLOT_STRIDE_BYTES,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
    }

    /**
     * [KO] 64KB 단일 고정 메가 UBO GPUBuffer 객체를 반환합니다.
     * [EN] Returns the 64KB single fixed mega UBO GPUBuffer instance.
     */
    get gpuBuffer(): GPUBuffer | null {
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
     * [KO] 현재 할당된 활성 슬롯 개수를 반환합니다.
     * [EN] Returns the number of currently allocated active slots.
     */
    get allocatedCount(): number {
        return this.#allocatedCount;
    }

    /**
     * [KO] 새 잔디 타입용 슬롯 인덱스를 할당합니다 (0 ~ 255).
     * [EN] Allocates a slot index for a new grass type (0 ~ 255).
     * @returns 할당된 슬롯 번호 (슬롯 고갈 시 -1)
     */
    allocateSlot(): number {
        if (this.#freeTop <= 0) {
            console.error(`[GrassSubMeshSlotPooler] Exhausted all ${GrassSubMeshSlotPooler.MAX_SLOTS} UBO slots!`);
            return -1;
        }
        this.#freeTop--;
        const slot = this.#freeSlotStack[this.#freeTop];
        this.#allocatedCount++;
        return slot;
    }

    /**
     * [KO] 사용이 끝난 잔디 슬롯 인덱스를 풀에 반환합니다.
     * [EN] Releases a finished grass slot index back to the pool.
     * @param slot - 반환할 슬롯 번호
     */
    freeSlot(slot: number): void {
        if (slot < 0 || slot >= GrassSubMeshSlotPooler.MAX_SLOTS) return;
        if (this.#freeTop >= GrassSubMeshSlotPooler.MAX_SLOTS) return;

        // 슬롯 메모리 0 초기화 (80B / 20 floats)
        const baseFloat = slot * GrassSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        this.#cpuBuffer.fill(0, baseFloat, baseFloat + GrassSubMeshSlotPooler.PARAMS_SIZE_FLOATS);

        const {gpuDevice} = this.#redGPUContext;
        if (gpuDevice && this.#gpuBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#gpuBuffer,
                slot * GrassSubMeshSlotPooler.SLOT_STRIDE_BYTES,
                this.#cpuBuffer.buffer,
                baseFloat * 4,
                GrassSubMeshSlotPooler.PARAMS_SIZE_BYTES
            );
        }

        this.#freeSlotStack[this.#freeTop] = slot;
        this.#freeTop++;
        this.#allocatedCount = Math.max(0, this.#allocatedCount - 1);
    }

    /**
     * [KO] 잔디 파라미터 데이터를 지정된 슬롯에 기록하고 GPU에 80바이트 정밀 전송합니다.
     * [EN] Writes grass parameter data to the specified slot and uploads 80 bytes precisely to GPU.
     *
     * @param slot - 슬롯 인덱스 (0 ~ 255)
     * @param grass - 잔디 생태계 인스턴스
     * @param hasValidVbt - 유효한 가상 베이스 텍스처(VBT) 존재 여부
     */
    writeGrassSlot(slot: number, grass: Grass, hasValidVbt: boolean): void {
        if (slot < 0 || slot >= GrassSubMeshSlotPooler.MAX_SLOTS) return;
        const {gpuDevice} = this.#redGPUContext;
        if (!gpuDevice || !this.#gpuBuffer) return;

        const baseFloat = slot * GrassSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        const f32 = this.#cpuBuffer;
        const u32 = this.#cpuUint32View;

        const {
            cullingDistance,
            fadeStartDistance,
            height,
            minY,
            shadowCullDistance,
            shadowFadeStartDistance,
            groundBlendStrength,
            alphaCutoff,
            exposureBoost,
            subsurfaceColor,
            subsurfaceStrength,
            roughness,
            shadowStrength,
            receiveShadow
        } = grass;

        // GrassUniforms (32B)
        f32[baseFloat + 0] = cullingDistance;
        f32[baseFloat + 1] = fadeStartDistance;
        f32[baseFloat + 2] = height;
        f32[baseFloat + 3] = minY;
        f32[baseFloat + 4] = shadowCullDistance;
        f32[baseFloat + 5] = shadowFadeStartDistance;
        f32[baseFloat + 6] = 0.0; // pad0
        f32[baseFloat + 7] = 0.0; // pad1

        // GrassMaterialUniforms (48B)
        f32[baseFloat + 8] = groundBlendStrength;
        f32[baseFloat + 9] = alphaCutoff;
        u32[baseFloat + 10] = hasValidVbt ? 1 : 0;
        f32[baseFloat + 11] = exposureBoost;

        f32[baseFloat + 12] = subsurfaceColor[0];
        f32[baseFloat + 13] = subsurfaceColor[1];
        f32[baseFloat + 14] = subsurfaceColor[2];
        f32[baseFloat + 15] = subsurfaceStrength;

        f32[baseFloat + 16] = roughness;
        f32[baseFloat + 17] = shadowStrength;
        u32[baseFloat + 18] = receiveShadow ? 1 : 0;
        u32[baseFloat + 19] = 0; // pad2

        // GPU 버퍼의 해당 슬롯 위치(slot * 256 바이트)에 80바이트만 정확히 전송
        const offsetBytes = slot * GrassSubMeshSlotPooler.SLOT_STRIDE_BYTES;
        gpuDevice.queue.writeBuffer(
            this.#gpuBuffer,
            offsetBytes,
            f32.buffer,
            f32.byteOffset + baseFloat * 4,
            GrassSubMeshSlotPooler.PARAMS_SIZE_BYTES
        );
    }

    /**
     * [KO] 모든 슬롯 상태를 초기화합니다.
     * [EN] Resets all slot states.
     */
    clear(): void {
        this.#cpuBuffer.fill(0);
        const maxSlots = GrassSubMeshSlotPooler.MAX_SLOTS;
        for (let i = 0; i < maxSlots; i++) {
            this.#freeSlotStack[i] = maxSlots - 1 - i;
        }
        this.#freeTop = maxSlots;
        this.#allocatedCount = 0;
    }

    /**
     * [KO] 슬롯 풀러가 소유한 GPU 버퍼 및 CPU 미러 메모리를 안전하게 해제합니다.
     * [EN] Safely releases GPU buffers and CPU mirror memory held by the slot pooler.
     */
    destroy(): void {
        this.#gpuBuffer?.destroy();
        this.#gpuBuffer = null;
        this.#cpuBuffer.fill(0);
        this.#freeTop = 0;
        this.#allocatedCount = 0;
    }
}

Object.freeze(GrassSubMeshSlotPooler);
export default GrassSubMeshSlotPooler;
