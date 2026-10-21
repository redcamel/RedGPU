import RedGPUContext from "../../../../context/RedGPUContext";
import AScatterSlotPooler from "../../../core/scatter/AScatterSlotPooler";

/**
 * [KO] 식생(Foliage) 렌더 유닛별 동적 유니폼 슬롯 할당 및 데이터를 관리하는 풀러 클래스입니다.
 * [EN] Pooler class that manages dynamic uniform slot allocation and data per foliage render unit.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class FoliageSlotPooler extends AScatterSlotPooler {
    /**
     * [KO] 풀러가 지원하는 최대 렌더 유닛 슬롯 개수입니다.
     * [EN] Maximum number of render unit slots supported by the pooler.
     */
    static MAX_SLOTS: number = 1024;
    /**
     * [KO] 슬롯당 실제 유효 유니폼 파라미터 크기(바이트)입니다.
     * [EN] Effective uniform parameter size per slot in bytes.
     */
    static PARAMS_SIZE_BYTES: number = 32;

    /**
     * [KO] `FoliageSlotPooler` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliageSlotPooler` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
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
     * [KO] PBR 식생 렌더 유닛 슬롯의 전체 유니폼 파라미터를 기록하고 GPU 버퍼에 업로드합니다.
     * [EN] Writes all uniform parameters for a PBR foliage render unit slot and uploads them to the GPU buffer.
     *
     * @param slot -
     * [KO] 대상 슬롯 인덱스
     * [EN] Target slot index
     * @param globalSlot -
     * [KO] 전역 프래그먼트 머티리얼 슬롯 인덱스
     * [EN] Global fragment material slot index
     * @param receiveShadow -
     * [KO] 그림자 수신 여부
     * [EN] Whether to receive shadows
     * @param isMasked -
     * [KO] 알파 마스크(컷오프) 적용 여부
     * [EN] Whether alpha masking (cutoff) is applied
     * @param applyGroundBlend -
     * [KO] 지형 표면 블렌딩 적용 여부
     * [EN] Whether ground surface blending is applied
     * @param groundBlendStrength -
     * [KO] 지형 블렌딩 강도 (기본값: `0.8`)
     * [EN] Ground blend strength (default: `0.8`)
     * @param groundBlendRange -
     * [KO] 지형 블렌딩 적용 높이 범위 (기본값: `1.5`)
     * [EN] Ground blend height range (default: `1.5`)
     * @param trunkBendScale -
     * [KO] 바람에 의한 줄기 굽힘 배율 (기본값: `1.0`)
     * [EN] Wind trunk bend scale (default: `1.0`)
     * @param foliageHeight -
     * [KO] 식생 기준 높이 (기본값: `5.0`)
     * [EN] Reference foliage height (default: `5.0`)
     * @param leafFlutterScale -
     * [KO] 바람에 의한 잎사귀 흔들림 배율 (기본값: `1.0`)
     * [EN] Wind leaf flutter scale (default: `1.0`)
     */
    writePBRRenderUnitSlot(
        slot: number,
        globalSlot: number,
        receiveShadow: boolean,
        isMasked: boolean,
        applyGroundBlend: boolean,
        groundBlendStrength: number = 0.8,
        groundBlendRange: number = 1.5,
        trunkBendScale: number = 1.0,
        foliageHeight: number = 5.0,
        leafFlutterScale: number = 1.0
    ): void {
        const {maxSlots, paramsSizeBytes, cpuBuffer: f32, cpuUint32View: u32} = this;
        if (slot < 0 || slot >= maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;

        u32[baseFloat + 0] = globalSlot;
        f32[baseFloat + 1] = receiveShadow ? 1.0 : 0.0;
        f32[baseFloat + 2] = trunkBendScale;
        f32[baseFloat + 3] = isMasked ? leafFlutterScale : 0.0;
        f32[baseFloat + 4] = foliageHeight;
        f32[baseFloat + 5] = applyGroundBlend ? groundBlendStrength : 0.0;
        f32[baseFloat + 6] = groundBlendRange;
        u32[baseFloat + 7] = 0;

        this.uploadSlotBytes(slot, paramsSizeBytes);
    }

    /**
     * [KO] 그림자 패스 전용 식생 렌더 유닛 슬롯의 유니폼 파라미터를 기록하고 GPU 버퍼에 업로드합니다.
     * [EN] Writes uniform parameters for a shadow-pass foliage render unit slot and uploads them to the GPU buffer.
     *
     * @param slot -
     * [KO] 대상 슬롯 인덱스
     * [EN] Target slot index
     * @param trunkBendScale -
     * [KO] 바람에 의한 줄기 굽힘 배율 (기본값: `1.0`)
     * [EN] Wind trunk bend scale (default: `1.0`)
     * @param foliageHeight -
     * [KO] 식생 기준 높이 (기본값: `5.0`)
     * [EN] Reference foliage height (default: `5.0`)
     * @param leafFlutterScale -
     * [KO] 바람에 의한 잎사귀 흔들림 배율 (기본값: `1.0`)
     * [EN] Wind leaf flutter scale (default: `1.0`)
     */
    writeShadowRenderUnitSlot(
        slot: number,
        trunkBendScale: number = 1.0,
        foliageHeight: number = 5.0,
        leafFlutterScale: number = 1.0
    ): void {
        const {maxSlots, paramsSizeBytes, cpuBuffer: f32, cpuUint32View: u32} = this;
        if (slot < 0 || slot >= maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;

        u32[baseFloat + 0] = 0;
        f32[baseFloat + 1] = 0.0;
        f32[baseFloat + 2] = trunkBendScale;
        f32[baseFloat + 3] = leafFlutterScale * 0.5;
        f32[baseFloat + 4] = foliageHeight;
        f32[baseFloat + 5] = 0.0;
        f32[baseFloat + 6] = 1.5;
        u32[baseFloat + 7] = 0;

        this.uploadSlotBytes(slot, paramsSizeBytes);
    }

    /**
     * [KO] 지정된 슬롯의 CPU 버퍼에 바람 관련 파라미터를 갱신합니다.
     * [EN] Updates wind-related parameters in the CPU buffer for the specified slot.
     *
     * @param slot -
     * [KO] 대상 슬롯 인덱스
     * [EN] Target slot index
     * @param trunkBendScale -
     * [KO] 줄기 굽힘 배율
     * [EN] Trunk bend scale
     * @param leafFlutterScale -
     * [KO] 잎사귀 흔들림 배율
     * [EN] Leaf flutter scale
     * @param foliageHeight -
     * [KO] 식생 기준 높이
     * [EN] Reference foliage height
     */
    updateWindParams(
        slot: number,
        trunkBendScale: number,
        leafFlutterScale: number,
        foliageHeight: number
    ): void {
        const {maxSlots, cpuBuffer: f32} = this;
        if (slot < 0 || slot >= maxSlots) return;
        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;

        f32[baseFloat + 2] = trunkBendScale;
        f32[baseFloat + 3] = leafFlutterScale;
        f32[baseFloat + 4] = foliageHeight;
    }

    /**
     * [KO] 지정된 슬롯의 CPU 버퍼에 지형 블렌딩 파라미터를 갱신합니다.
     * [EN] Updates ground blend parameters in the CPU buffer for the specified slot.
     *
     * @param slot -
     * [KO] 대상 슬롯 인덱스
     * [EN] Target slot index
     * @param strength -
     * [KO] 지형 블렌딩 강도
     * [EN] Ground blend strength
     * @param range -
     * [KO] 지형 블렌딩 적용 높이 범위
     * [EN] Ground blend height range
     */
    updateGroundBlendParams(
        slot: number,
        strength: number,
        range: number
    ): void {
        const {maxSlots, cpuBuffer: f32} = this;
        if (slot < 0 || slot >= maxSlots) return;
        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;

        f32[baseFloat + 5] = strength;
        f32[baseFloat + 6] = range;
    }

    /**
     * [KO] 지정된 슬롯의 CPU 버퍼 데이터를 GPU 메가 유니폼 버퍼에 업로드합니다.
     * [EN] Uploads CPU buffer data for the specified slot to the GPU mega uniform buffer.
     *
     * @param slot -
     * [KO] 업로드할 대상 슬롯 인덱스
     * [EN] Target slot index to upload
     */
    flushSlotBytes(slot: number): void {
        const {maxSlots, paramsSizeBytes} = this;
        if (slot < 0 || slot >= maxSlots) return;
        this.uploadSlotBytes(slot, paramsSizeBytes);
    }

    /**
     * [KO] 지정된 슬롯의 그림자 수신 여부를 갱신하고 즉시 GPU 버퍼에 업로드합니다.
     * [EN] Updates the shadow receiving flag for the specified slot and immediately uploads it to the GPU buffer.
     *
     * @param slot -
     * [KO] 대상 슬롯 인덱스
     * [EN] Target slot index
     * @param receiveShadow -
     * [KO] 그림자 수신 여부
     * [EN] Whether to receive shadows
     */
    updateReceiveShadow(slot: number, receiveShadow: boolean): void {
        const {maxSlots, paramsSizeBytes, cpuBuffer} = this;
        if (slot < 0 || slot >= maxSlots) return;
        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        cpuBuffer[baseFloat + 1] = receiveShadow ? 1.0 : 0.0;
        this.uploadSlotBytes(slot, paramsSizeBytes);
    }
}

Object.freeze(FoliageSlotPooler);
export default FoliageSlotPooler;
