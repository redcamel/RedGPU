/**
 * [KO] 식생 렌더 단위(Render Unit)용 256바이트 정렬 Dynamic Offset UBO 슬롯 풀러 모듈입니다.
 * [EN] 256-byte aligned dynamic offset UBO slot pooler module for foliage render units.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import AScatterSlotPooler from "../../../core/scatter/AScatterSlotPooler";

/**
 * [KO] 최대 1,024개 렌더 단위(256 KB)의 UBO 슬롯을 관리하고, Zero-GC 방식으로 CPU 미러 버퍼를 갱신/업로드하는 식생 전용 슬롯 풀러 클래스입니다.
 * [EN] Foliage-dedicated slot pooler class managing UBO slots for up to 1,024 render units (256 KB) and updating/uploading CPU mirror buffers with zero-GC.
 */
export class FoliageSlotPooler extends AScatterSlotPooler {
    static MAX_SLOTS: number = 1024;
    static PARAMS_SIZE_BYTES: number = 32;
    static PARAMS_SIZE_FLOATS: number = 8; // 32 / 4

    /**
     * [KO] FoliageSlotPooler 인스턴스를 생성하고 256KB 고정 메가 UBO 및 CPU 미러 버퍼를 사전 할당합니다.
     * [EN] Creates a FoliageSlotPooler instance and pre-allocates a 256KB fixed mega UBO and CPU mirror buffers.
     *
     * @param redGPUContext - RedGPU 컨텍스트 인스턴스
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            FoliageSlotPooler.MAX_SLOTS,
            FoliageSlotPooler.PARAMS_SIZE_BYTES,
            'Foliage_RenderUnit_MegaUBO'
        );
    }

    /**
     * [KO] PBR 렌더 단위의 파라미터 데이터를 지정된 슬롯에 기록하고 GPU에 32바이트 정밀 전송합니다.
     * [EN] Writes PBR render unit parameter data to the specified slot and uploads 32 bytes precisely to GPU.
     *
     * @param slot - 슬롯 인덱스 (0 ~ 1023)
     * @param globalSlot - 전역 텍스처/머티리얼 슬롯 번호
     * @param receiveShadow - 그림자 수신 여부
     * @param isMasked - 알파 마스킹 여부
     * @param applyGroundBlend - 지면 색상 블렌딩 적용 여부
     * @param groundBlendStrength - 지면 블렌드 강도
     * @param groundBlendRange - 지면 블렌드 높이 범위
     * @param windMultiplier - 바람 세기 배수
     * @param treeHeight - 식생 수목 높이
     * @param windFlutterMultiplier - 잔잎 흔들림 배수
     */
    writePBRRenderUnitSlot(
        slot: number,
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
        if (slot < 0 || slot >= this.maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        const {cpuBuffer: f32, cpuUint32View: u32} = this;

        u32[baseFloat + 0] = globalSlot;
        f32[baseFloat + 1] = receiveShadow ? 1.0 : 0.0;
        f32[baseFloat + 2] = windMultiplier ?? 1.0;
        f32[baseFloat + 3] = isMasked ? (windFlutterMultiplier ?? 1.0) : 0.0;
        f32[baseFloat + 4] = treeHeight ?? 5.0;
        f32[baseFloat + 5] = applyGroundBlend ? (groundBlendStrength ?? 0.8) : 0.0;
        f32[baseFloat + 6] = groundBlendRange ?? 1.5;
        u32[baseFloat + 7] = 0; // pad0

        this.uploadSlotBytes(slot, this.paramsSizeBytes);
    }

    /**
     * [KO] 그림자 병합 렌더 단위의 파라미터 데이터를 지정된 슬롯에 기록하고 GPU에 32바이트 정밀 전송합니다.
     * [EN] Writes shadow merged render unit parameter data to the specified slot and uploads 32 bytes precisely to GPU.
     *
     * @param slot - 슬롯 인덱스 (0 ~ 1023)
     * @param windMultiplier - 바람 세기 배수
     * @param treeHeight - 식생 수목 높이
     * @param windFlutterMultiplier - 잔잎 흔들림 배수
     */
    writeShadowRenderUnitSlot(
        slot: number,
        windMultiplier?: number,
        treeHeight?: number,
        windFlutterMultiplier?: number
    ): void {
        if (slot < 0 || slot >= this.maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        const {cpuBuffer: f32, cpuUint32View: u32} = this;

        u32[baseFloat + 0] = 0; // globalSlot
        f32[baseFloat + 1] = 0.0; // receiveShadow
        f32[baseFloat + 2] = windMultiplier ?? 1.0;
        f32[baseFloat + 3] = (windFlutterMultiplier ?? 1.0) * 0.5;
        f32[baseFloat + 4] = treeHeight ?? 5.0;
        f32[baseFloat + 5] = 0.0; // groundBlendStrength
        f32[baseFloat + 6] = 1.5; // groundBlendRange
        u32[baseFloat + 7] = 0; // pad0

        this.uploadSlotBytes(slot, this.paramsSizeBytes);
    }

    /**
     * [KO] 특정 렌더 단위 슬롯의 바람 파라미터를 CPU 미러 버퍼에 기록합니다 (Zero-GC).
     * [EN] Writes wind parameters to CPU mirror buffer for a specific render unit slot (Zero-GC).
     *
     * @param slot - 슬롯 인덱스
     * @param windMultiplier - 바람 세기 배수
     * @param windFlutterMultiplier - 잔잎 흔들림 배수
     * @param treeHeight - 식생 수목 높이
     */
    updateWindParams(
        slot: number,
        windMultiplier: number,
        windFlutterMultiplier: number,
        treeHeight: number
    ): void {
        if (slot < 0 || slot >= this.maxSlots) return;
        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        const f32 = this.cpuBuffer;

        f32[baseFloat + 2] = windMultiplier;
        f32[baseFloat + 3] = windFlutterMultiplier;
        f32[baseFloat + 4] = treeHeight;
    }

    /**
     * [KO] 특정 렌더 단위 슬롯의 지면 블렌딩 파라미터를 CPU 미러 버퍼에 기록합니다 (Zero-GC).
     * [EN] Writes ground blending parameters to CPU mirror buffer for a specific render unit slot (Zero-GC).
     *
     * @param slot - 슬롯 인덱스
     * @param strength - 지면 블렌드 강도
     * @param range - 지면 블렌드 높이 범위
     */
    updateGroundBlendParams(
        slot: number,
        strength: number,
        range: number
    ): void {
        if (slot < 0 || slot >= this.maxSlots) return;
        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        const f32 = this.cpuBuffer;

        f32[baseFloat + 5] = strength;
        f32[baseFloat + 6] = range;
    }

    /**
     * [KO] 특정 렌더 단위 슬롯의 전체 파라미터(32바이트)를 GPU VRAM으로 단일 전송합니다 (프레임 지연 배칭 전용).
     * [EN] Flushes full parameters (32 bytes) of a specific render unit slot to GPU VRAM (for deferred frame batching).
     *
     * @param slot - 슬롯 인덱스
     */
    flushSlotBytes(slot: number): void {
        if (slot < 0 || slot >= this.maxSlots) return;
        this.uploadSlotBytes(slot, this.paramsSizeBytes);
    }
}

Object.freeze(FoliageSlotPooler);
export default FoliageSlotPooler;
