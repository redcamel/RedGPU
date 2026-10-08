/**
 * [KO] Landscape 대규모 식생(Foliage) 시스템의 핵심 렌더링 인프라 및 파이프라인 모듈입니다.
 * [EN] Core rendering infrastructure and pipeline modules for the Landscape foliage system.
 *
 * **[KO]**
 * - `Foliage`: 단일 식생 타입 정의 및 서브셀별 인스턴스 라이프사이클 관리 엔티티
 * - `FoliageRenderUnit`: 식생 전용 통합 렌더 유닛 (SSOT, 메인 및 그림자 통합 지원)
 * - `FoliageSlotPooler`: 256-byte 정렬 Dynamic Offset UBO 슬롯 풀러
 * - `FoliageScatterMegaBuffer`: 대규모 인스턴스 트랜스폼 및 렌더 데이터를 통합 관리하는 GPU 버퍼
 * - `FoliageCuller`: HZB 오클루전 및 프러스텀 컬링 GPU 실행기
 * - `bakeFoliageImpostor` / `OctahedralImpostorMaterial`: 원거리 최적화를 위한 3D 옥타헤드럴 임포스터 베이커 및 셰이더
 * - `assembleFoliageRenderUnits`: 계층적 식생 3D 모델을 분석·결합하여 단일 렌더 유닛으로 조립하는 순수 함수
 * - `createOctahedralImpostorGeometry`: 8방향/16방향 3D 옥타헤드럴 임포스터 지오메트리 생성 함수
 * - `assembleFoliageLODMeshes`: 식생 LOD별 원본 메시 순회 및 지오메트리 결합 함수
 * - `buildFoliageImpostorRenderUnit`: 옥타헤드럴 임포스터 베이킹 및 렌더 유닛 빌드 함수
 * - `createFoliageRenderUnitInstance`: 식생 렌더 유닛 인스턴스 팩토리 함수
 * - `prepareFoliageMaterials`: 식생 원본 재질 복제 및 파이프라인 준비 함수
 *
 * **[EN]**
 * - `Foliage`: Entity defining a single foliage type and managing per-subcell instance lifecycles
 * - `FoliageRenderUnit`: Foliage-specific unified render unit (SSOT, supports main and shadow-merged)
 * - `FoliageSlotPooler`: 256-byte aligned Dynamic Offset UBO slot allocator
 * - `FoliageScatterMegaBuffer`: Unified GPU mega buffer managing large-scale instance transforms and draw data
 * - `FoliageCuller`: GPU culler for HZB occlusion and view frustum culling
 * - `bakeFoliageImpostor` / `OctahedralImpostorMaterial`: 3D octahedral impostor baker and shader for distant LODs
 * - `assembleFoliageRenderUnits`: Pure function assembling hierarchical foliage models into combined render units
 * - `createOctahedralImpostorGeometry`: Function generating 8-way/16-way 3D octahedral billboard geometries
 * - `assembleFoliageLODMeshes`: Function traversing and combining source meshes per LOD level
 * - `buildFoliageImpostorRenderUnit`: Function baking octahedral impostors and creating impostor render units
 * - `createFoliageRenderUnitInstance`: Render unit instance factory function
 * - `prepareFoliageMaterials`: Function cloning and preparing foliage materials
 *
 * @packageDocumentation
 */

// 1. Entities & RenderUnits
import Foliage, {
    FIXED_SCATTER_GRID_SIZE,
    type FoliageLODConfig,
    type FoliageLODInfo,
    type FoliageOptions,
    type FoliageSubCell
} from "./Foliage";
import FoliageRenderUnit from "./renderUnit/FoliageRenderUnit";
import {FoliageSlotPooler} from "./renderUnit/FoliageSlotPooler";

// 2. GPU Buffer & Culling & Baking Infrastructure
import FoliageScatterMegaBuffer from "./buffer/FoliageScatterMegaBuffer";
import FoliagePipelineRegistry from "./pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./renderer/FoliageRenderer";
import FoliageCuller from "./culling/FoliageCuller";
import FoliageInstanceBaker from "./baking/FoliageInstanceBaker";

// 3. Impostors
import bakeFoliageImpostor, {type FoliageBakeResult} from "./impostor/bakeFoliageImpostor";
import OctahedralImpostorMaterial from "./impostor/octahedral/OctahedralImpostorMaterial";
import createOctahedralImpostorGeometry from "./impostor/octahedral/createOctahedralImpostorGeometry";

// 4. Assembler & Internal Helpers
import assembleFoliageRenderUnits, {type FoliageAssemblyResult} from "./assembler/assembleFoliageRenderUnits";
import assembleFoliageLODMeshes from "./assembler/internal/assembleFoliageLODMeshes";
import buildFoliageImpostorRenderUnit from "./assembler/internal/buildFoliageImpostorRenderUnit";
import createFoliageRenderUnitInstance from "./assembler/internal/createFoliageRenderUnitInstance";
import prepareFoliageMaterials from "./assembler/internal/prepareFoliageMaterials";

export {
    // Runtime Classes & Entities
    Foliage,
    FoliageRenderUnit,
    FoliageSlotPooler,
    FoliageScatterMegaBuffer,
    FoliagePipelineRegistry,
    FoliageRenderer,
    FoliageCuller,
    FoliageInstanceBaker,
    OctahedralImpostorMaterial,
    FIXED_SCATTER_GRID_SIZE,

    // Standalone Functions
    assembleFoliageRenderUnits,
    createOctahedralImpostorGeometry,
    bakeFoliageImpostor,
    assembleFoliageLODMeshes,
    buildFoliageImpostorRenderUnit,
    createFoliageRenderUnitInstance,
    prepareFoliageMaterials,

    // Code Hint Interfaces
    type FoliageOptions,
    type FoliageLODConfig,
    type FoliageLODInfo,
    type FoliageSubCell,
    type FoliageAssemblyResult,
    type FoliageBakeResult
};
