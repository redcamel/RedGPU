/**
 * [KO] 식생 그림자 패스 전용 통합 서브메시 모듈입니다.
 * [EN] Foliage shadow pass dedicated merged sub-mesh module.
 * @packageDocumentation
 */

import AScatterGeometryUnit, {type AScatterGeometryUnitInitOptions} from "../../../core/scatter/AScatterGeometryUnit";
import {FoliageSlotPooler} from "./FoliageSlotPooler";

/**
 * [KO] FoliageShadowMergedSubMesh 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for FoliageShadowMergedSubMesh.
 */
export interface FoliageShadowMergedSubMeshInitOptions extends Omit<AScatterGeometryUnitInitOptions, 'strideBytes'> {
    /**
     * [KO] 소속 LOD 인덱스
     * [EN] Associated LOD index
     */
    lodIndex: number;
    /**
     * [KO] 정점 스트라이드 바이트 수 (기본값: 12)
     * [EN] Vertex stride in bytes (default: 12)
     */
    strideBytes?: number;
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
 * [KO] 그림자 패스(Shadow Pass) 렌더링을 위해 단일 위치 전용(Position-only) 지오메트리로 통합된 식생 서브메쉬 클래스입니다.
 * [EN] Foliage sub-mesh class combined into unified position-only geometry for shadow pass rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class FoliageShadowMergedSubMesh extends AScatterGeometryUnit {
    #lodIndex: number;
    #slotIndex: number = -1;
    #slotPooler: FoliageSlotPooler | null = null;

    constructor(init: FoliageShadowMergedSubMeshInitOptions) {
        super({
            ...init,
            indexFormat: init.indexFormat || 'uint32',
            strideBytes: init.strideBytes ?? 12,
            instanceBufferOffset: init.instanceBufferOffset ?? 0,
            indirectOffsetBytes: init.indirectOffsetBytes ?? 0,
        });

        this.#lodIndex = init.lodIndex;
        this.#slotIndex = init.slotIndex !== undefined ? init.slotIndex : -1;
        this.#slotPooler = init.slotPooler || null;
    }

    /**
     * [KO] 서브메쉬의 LOD 인덱스를 반환합니다.
     * [EN] Returns the LOD index of the sub-mesh.
     */
    get lodIndex(): number {
        return this.#lodIndex;
    }

    /**
     * [KO] 256바이트 정렬 Dynamic Offset UBO 슬롯 인덱스 (0 ~ 1023)를 반환합니다.
     * [EN] Returns the 256-byte aligned Dynamic Offset UBO slot index (0 ~ 1023).
     */
    get slotIndex(): number {
        return this.#slotIndex;
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
                windFlutterMultiplier * 0.5,
                treeHeight
            );
        }
    }

    /**
     * [KO] 이 서브메시의 UBO 슬롯 파라미터를 GPU로 단일 플러시합니다 (프레임 지연 배칭 전용).
     * [EN] Flushes UBO slot parameters of this sub-mesh to GPU (for deferred frame batching).
     */
    flushSlotUBO(): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.flushSlotBytes(this.#slotIndex);
        }
    }

    /**
     * [KO] 서브메쉬 리소스를 해제합니다.
     * [EN] Destroys sub-mesh resources.
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

Object.freeze(FoliageShadowMergedSubMesh);
export default FoliageShadowMergedSubMesh;
