import RedGPUContext from "../../../context/RedGPUContext";
import FoliageRenderUnit from "./FoliageRenderUnit";
import type { FoliageLODInfo, FoliageOptions } from "./Foliage";
import type FoliageSlotPooler from "./buffer/FoliageSlotPooler";
/**
 * [KO] 식생 메시 어셈블리 및 임포스터 베이킹 결과 데이터 인터페이스입니다.
 * [EN] Result data interface for foliage mesh assembly and impostor baking.
 * @category Landscape
 */
export interface FoliageAssemblyResult {
    /**
     * [KO] 메인 및 깊이 프리패스용 렌더 유닛 목록
     * [EN] List of render units for main and depth prepass rendering
     */
    renderUnits: FoliageRenderUnit[];
    /**
     * [KO] 그림자 패스 전용 병합 렌더 유닛 목록
     * [EN] List of merged render units dedicated to the shadow pass
     */
    shadowMergedRenderUnits: FoliageRenderUnit[];
    /**
     * [KO] LOD 단계별 거리 및 렌더 유닛 범위 메타데이터 목록
     * [EN] List of distance and render unit range metadata per LOD level
     */
    lodInfoList: FoliageLODInfo[];
    /**
     * [KO] 식생 전체 바운딩 스피어 반경(미터 단위)
     * [EN] Overall bounding sphere radius of the foliage in meters
     */
    boundingRadius: number;
    /**
     * [KO] 식생 전체 바운딩 높이(미터 단위)
     * [EN] Overall bounding height of the foliage in meters
     */
    boundingHeight: number;
}
/**
 * [KO] 식생 옵션에 정의된 LOD 메시들을 병합하고 팔면체 임포스터를 베이킹하여 렌더 유닛 리스트를 조립합니다.
 * [EN] Merges LOD meshes defined in foliage options and bakes an octahedral impostor to assemble render unit lists.
 *
 * @param redGPUContext -
 * [KO] `RedGPUContext` 인스턴스
 * [EN] `RedGPUContext` instance
 * @param options -
 * [KO] 식생 생성 및 LOD 구성 옵션
 * [EN] Foliage creation and LOD configuration options
 * @param slotPooler -
 * [KO] 렌더 유닛 동적 유니폼 슬롯 풀러 (선택)
 * [EN] Render unit dynamic uniform slot pooler (optional)
 * @returns
 * [KO] 조립된 렌더 유닛, 그림자 유닛, LOD 정보 및 바운딩 치수를 담은 결과 객체(`FoliageAssemblyResult`)
 * [EN] Result object containing assembled render units, shadow units, LOD info, and bounding dimensions (`FoliageAssemblyResult`)
 * @category Landscape
 */
export default function assembleFoliageRenderUnits(redGPUContext: RedGPUContext, options: FoliageOptions, slotPooler?: FoliageSlotPooler | null): FoliageAssemblyResult;
