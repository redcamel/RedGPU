/**
 * [KO] 식생 그림자 패스 전용 통합 렌더 단위(Render Unit) 모듈입니다.
 * [EN] Foliage shadow pass dedicated merged render unit module.
 * @packageDocumentation
 */

import AFoliageRenderUnitBase, {type AFoliageRenderUnitBaseInitOptions} from "./AFoliageRenderUnitBase";

/**
 * [KO] FoliageShadowMergedRenderUnit 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for FoliageShadowMergedRenderUnit.
 */
export interface FoliageShadowMergedRenderUnitInitOptions extends Omit<AFoliageRenderUnitBaseInitOptions, 'strideBytes'> {
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
}

/**
 * [KO] 그림자 패스(Shadow Pass) 렌더링을 위해 단일 위치 전용(Position-only) 지오메트리로 통합된 식생 렌더 단위 클래스입니다.
 * [EN] Foliage render unit class combined into unified position-only geometry for shadow pass rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class FoliageShadowMergedRenderUnit extends AFoliageRenderUnitBase {
    constructor(init: FoliageShadowMergedRenderUnitInitOptions) {
        super({
            ...init,
            indexFormat: init.indexFormat || 'uint32',
            strideBytes: init.strideBytes ?? 12,
            instanceBufferOffset: init.instanceBufferOffset ?? 0,
            indirectOffsetBytes: init.indirectOffsetBytes ?? 0,
        });
    }

    /**
     * [KO] 인스턴스별 바람 강도 배수, 잔잎 떨림 배수(그림자 패스는 50% 감쇠) 및 수목 높이를 유니폼 버퍼에 기록합니다. (Zero-GC)
     * [EN] Writes per-instance wind multiplier, flutter multiplier (50% attenuated for shadow pass), and tree height to uniform buffer. (Zero-GC)
     * @param windMultiplier - 인스턴스별 바람 강도 배수
     * @param windFlutterMultiplier - 인스턴스별 잔잎 흔들림 배수
     * @param treeHeight - 식생 전체 높이
     */
    override updateWindMultipliers(
        windMultiplier: number,
        windFlutterMultiplier: number,
        treeHeight: number
    ): void {
        super.updateWindMultipliers(windMultiplier, windFlutterMultiplier * 0.5, treeHeight);
    }
}

Object.freeze(FoliageShadowMergedRenderUnit);
export default FoliageShadowMergedRenderUnit;
