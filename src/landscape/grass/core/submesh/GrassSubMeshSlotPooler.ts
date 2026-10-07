/**
 * [KO] 잔디 렌더링용 256바이트 정렬 Dynamic Offset UBO 슬롯 풀러 모듈입니다.
 * [EN] 256-byte aligned dynamic offset UBO slot pooler module for grass rendering.
 * @packageDocumentation
 */

import RedGPUContext from "../../../../context/RedGPUContext";
import {Grass} from "../Grass";
import AScatterSubMeshSlotPooler from "../../../core/scatter/AScatterSubMeshSlotPooler";

/**
 * [KO] 최대 256개 잔디 슬롯(64 KB)의 UBO 슬롯을 관리하고, Zero-GC 방식으로 CPU 미러 버퍼를 갱신/업로드하는 잔디 전용 슬롯 풀러 클래스입니다.
 * [EN] Grass-dedicated slot pooler class managing UBO slots for up to 256 grass slots (64 KB) and updating/uploading CPU mirror buffers with zero-GC.
 */
export class GrassSubMeshSlotPooler extends AScatterSubMeshSlotPooler {
    static MAX_SLOTS: number = 256;
    static PARAMS_SIZE_BYTES: number = 80;
    static PARAMS_SIZE_FLOATS: number = 20; // 80 / 4

    /**
     * [KO] GrassSubMeshSlotPooler 인스턴스를 생성하고 64KB 고정 메가 UBO 및 CPU 미러 버퍼를 사전 할당합니다.
     * [EN] Creates a GrassSubMeshSlotPooler instance and pre-allocates a 64KB fixed mega UBO and CPU mirror buffers.
     *
     * @param redGPUContext - RedGPU 컨텍스트 인스턴스
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            GrassSubMeshSlotPooler.MAX_SLOTS,
            GrassSubMeshSlotPooler.PARAMS_SIZE_BYTES,
            'Grass_SubMesh_MegaUBO'
        );
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
        if (slot < 0 || slot >= this.maxSlots) return;

        const baseFloat = slot * AScatterSubMeshSlotPooler.SLOT_STRIDE_FLOATS;
        const f32 = this.cpuBuffer;
        const u32 = this.cpuUint32View;

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

        // 부모의 80바이트 정밀 업로드 호출
        this.uploadSlotBytes(slot, this.paramsSizeBytes);
    }
}

Object.freeze(GrassSubMeshSlotPooler);
export default GrassSubMeshSlotPooler;
