/**
 * [KO] 식생 렌더 단위(Render Unit) 공통 베이스 추상 클래스 모듈입니다.
 * [EN] Common base abstract class module for foliage render units.
 * @packageDocumentation
 */

import ScatterRenderUnit, {type ScatterRenderUnitInitOptions} from "../../../core/scatter/ScatterRenderUnit";
import {FoliageSlotPooler} from "./FoliageSlotPooler";

/**
 * [KO] AFoliageRenderUnitBase 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for AFoliageRenderUnitBase.
 */
export interface AFoliageRenderUnitBaseInitOptions extends ScatterRenderUnitInitOptions {
    /**
     * [KO] 256바이트 정렬 Dynamic Offset UBO 슬롯 인덱스 (0 ~ 1023)
     * [EN] 256-byte aligned Dynamic Offset UBO slot index (0 ~ 1023)
     */
    slotIndex?: number;
    /**
     * [KO] 슬롯 풀러 인스턴스
     * [EN] Slot pooler instance
     */
    slotPooler?: FoliageSlotPooler | null;
}

/**
 * [KO] 식생 일반 렌더 단위(FoliageRenderUnit) 및 그림자 통합 렌더 단위(FoliageShadowMergedRenderUnit)의 UBO 슬롯 생명주기를 공통 관리하는 추상 기본 클래스입니다.
 * [EN] Abstract base class managing UBO slot lifecycle shared across foliage regular render units and shadow merged render units.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이며 시스템(FoliageManager)에 의해 자동으로 관리됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class automatically managed by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export abstract class AFoliageRenderUnitBase extends ScatterRenderUnit {
    #slotIndex: number = -1;
    #slotPooler: FoliageSlotPooler | null = null;

    constructor(init: AFoliageRenderUnitBaseInitOptions) {
        super(init);
        this.#slotIndex = init.slotIndex !== undefined ? init.slotIndex : -1;
        this.#slotPooler = init.slotPooler || null;
    }

    /**
     * [KO] 256바이트 정렬 Dynamic Offset UBO 슬롯 인덱스 (0 ~ 1023)를 반환합니다.
     * [EN] Returns the 256-byte aligned Dynamic Offset UBO slot index (0 ~ 1023).
     */
    get slotIndex(): number {
        return this.#slotIndex;
    }

    /**
     * [KO] 슬롯 풀러 인스턴스를 반환합니다.
     * [EN] Returns the slot pooler instance.
     */
    get slotPooler(): FoliageSlotPooler | null {
        return this.#slotPooler;
    }

    /**
     * [KO] 인스턴스별 바람 강도 배수, 잔잎 떨림 배수 및 수목 높이를 유니폼 버퍼에 기록합니다. (Zero-GC)
     * [EN] Writes per-instance wind multiplier, flutter multiplier, and tree height to uniform buffer. (Zero-GC)
     * @param windMultiplier - 인스턴스별 바람 강도 배수
     * @param windFlutterMultiplier - 인스턴스별 잔잎 흔들림 배수
     * @param treeHeight - 식생 전체 높이
     */
    updateWindMultipliers(
        windMultiplier: number,
        windFlutterMultiplier: number,
        treeHeight: number
    ): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.updateWindParams(
                this.#slotIndex,
                windMultiplier,
                windFlutterMultiplier,
                treeHeight
            );
        }
    }

    /**
     * [KO] 지면 높이 기반 블렌딩 파라미터를 유니폼 버퍼에 기록합니다. (Zero-GC)
     * [EN] Writes ground blend parameters to the uniform buffer. (Zero-GC)
     * @param groundBlendStrength - 지면 블렌드 강도
     * @param groundBlendRange - 지면 블렌드 높이 범위
     */
    updateGroundBlendParams(
        groundBlendStrength: number,
        groundBlendRange: number
    ): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.updateGroundBlendParams(
                this.#slotIndex,
                groundBlendStrength,
                groundBlendRange
            );
        }
    }

    /**
     * [KO] 이 렌더 단위의 UBO 슬롯 파라미터를 GPU로 단일 플러시합니다 (프레임 지연 배칭 전용).
     * [EN] Flushes UBO slot parameters of this render unit to GPU (for deferred frame batching).
     */
    flushSlotUBO(): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.flushSlotBytes(this.#slotIndex);
        }
    }

    /**
     * [KO] 렌더 단위 리소스 및 할당된 UBO 슬롯을 해제합니다.
     * [EN] Releases render unit resources and allocated UBO slot.
     */
    override destroy(): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.freeSlot(this.#slotIndex);
            this.#slotIndex = -1;
        }
        this.#slotPooler = null;
        super.destroy();
    }
}

export default AFoliageRenderUnitBase;
