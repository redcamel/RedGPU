/**
 * [KO] Landscape 대규모 식생(Foliage) 시스템의 핵심 렌더링 인프라 및 파이프라인 모듈입니다.
 * [EN] Core rendering infrastructure and pipeline modules for the Landscape foliage system.
 *
 * **[KO]**
 * - `Foliage`: 단일 식생 타입 정의 및 타일별 인스턴스 라이프사이클 관리 엔티티
 * - `FoliageSubMesh` / `FoliageShadowMergedSubMesh`: 식생 전용 메인 및 그림자 렌더 서브메쉬
 * - `FoliageMegaBuffer`: 대규모 인스턴스 트랜스폼 및 렌더 데이터를 통합 관리하는 GPU 버퍼
 * - `FoliageCullingDispatcher`: HZB 오클루전 및 프러스텀 컬링 GPU 디스패처
 * - `FoliageImpostorBaker` / `OctahedralImpostorMaterial`: 원거리 최적화를 위한 3D 옥타헤드럴 임포스터 베이커 및 셰이더
 * - `FoliageSubCellPartitioner` / `FoliageSubCellStreamer`: 지형 타일 내부 고밀도 서브셀 공간 분할 및 동적 인스턴스 스트리머
 * - `assembleFoliageSubMeshes`: 계층적 식생 3D 모델을 분석·결합하여 단일 서브메쉬로 조립하는 순수 함수
 * - `createOctahedralImpostorGeometry`: 8방향/16방향 3D 옥타헤드럴 임포스터 지오메트리 생성 함수
 * - `assembleFoliageLODMeshes`: 식생 LOD별 원본 메시 순회 및 지오메트리 결합 함수
 * - `buildFoliageImpostorSubMesh`: 옥타헤드럴 임포스터 베이킹 및 서브메쉬 빌드 함수
 * - `createFoliageSubMeshInstance`: 식생 서브메쉬 인스턴스 팩토리 함수
 * - `createFoliagePBRSubMeshUniform`: PBR 식생 서브메쉬 유니폼 버퍼 생성 함수
 * - `createFoliageShadowSubMeshUniform`: 섀도우 식생 서브메쉬 유니폼 버퍼 생성 함수
 * - `prepareFoliageMaterials`: 식생 원본 재질 복제 및 파이프라인 준비 함수
 *
 * **[EN]**
 * - `Foliage`: Entity defining a single foliage type and managing per-tile instance lifecycles
 * - `FoliageSubMesh` / `FoliageShadowMergedSubMesh`: Foliage-specific main and shadow render sub-meshes
 * - `FoliageMegaBuffer`: Unified GPU mega buffer managing large-scale instance transforms and draw data
 * - `FoliageCullingDispatcher`: GPU dispatcher for HZB occlusion and view frustum culling
 * - `FoliageImpostorBaker` / `OctahedralImpostorMaterial`: 3D octahedral impostor baker and shader for distant LODs
 * - `FoliageSubCellPartitioner` / `FoliageSubCellStreamer`: High-density subcell spatial partitioner and dynamic streamer
 * - `assembleFoliageSubMeshes`: Pure function assembling hierarchical foliage models into combined sub-meshes
 * - `createOctahedralImpostorGeometry`: Function generating 8-way/16-way 3D octahedral billboard geometries
 * - `assembleFoliageLODMeshes`: Function traversing and combining source meshes per LOD level
 * - `buildFoliageImpostorSubMesh`: Function baking octahedral impostors and creating impostor sub-meshes
 * - `createFoliageSubMeshInstance`: Sub-mesh instance factory function
 * - `createFoliagePBRSubMeshUniform`: Function creating PBR sub-mesh uniform buffers
 * - `createFoliageShadowSubMeshUniform`: Function creating shadow sub-mesh uniform buffers
 * - `prepareFoliageMaterials`: Function cloning and preparing foliage materials
 *
 * @packageDocumentation
 */

// 1. Entities & SubMeshes
import Foliage, {type FoliageLODConfig, type FoliageLODInfo, type FoliageOptions} from "./Foliage";
import FoliageSubMesh from "./submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "./submesh/FoliageShadowMergedSubMesh";

// 2. GPU Buffer & Culling & Baking Infrastructure
import FoliageMegaBuffer from "./buffer/FoliageMegaBuffer";
import {FoliageInstanceBaker} from "./baking/FoliageInstanceBaker";
import FoliageSpatialGrid from "./spatial/FoliageSpatialGrid";
import FoliagePipelineRegistry from "./pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./renderer/FoliageRenderer";
import FoliageCullingDispatcher from "./culling/FoliageCullingDispatcher";

// 3. Impostors
import FoliageImpostorBaker from "./impostor/FoliageImpostorBaker";
import OctahedralImpostorMaterial from "./impostor/octahedral/OctahedralImpostorMaterial";
import createOctahedralImpostorGeometry from "./impostor/octahedral/createOctahedralImpostorGeometry";

// 4. SubCell Partitioning & Streaming
import FoliageSubCellPartitioner from "./subcell/FoliageSubCellPartitioner";
import FoliageSubCellStreamer from "./subcell/FoliageSubCellStreamer";

// 5. Assembler & Internal Helpers
import assembleFoliageSubMeshes, {type FoliageAssemblyResult} from "./assembler/assembleFoliageSubMeshes";
import assembleFoliageLODMeshes from "./assembler/internal/assembleFoliageLODMeshes";
import buildFoliageImpostorSubMesh from "./assembler/internal/buildFoliageImpostorSubMesh";
import createFoliageSubMeshInstance from "./assembler/internal/createFoliageSubMeshInstance";
import {
    createFoliagePBRSubMeshUniform,
    createFoliageShadowSubMeshUniform,
    type FoliageSubMeshUniformResult
} from "./assembler/internal/createFoliageSubMeshUniform";
import prepareFoliageMaterials from "./assembler/internal/prepareFoliageMaterials";

export {
    // Runtime Classes & Entities
    Foliage,
    FoliageSubMesh,
    FoliageShadowMergedSubMesh,
    FoliageMegaBuffer,
    FoliageInstanceBaker,
    FoliageSpatialGrid,
    FoliagePipelineRegistry,
    FoliageRenderer,
    FoliageCullingDispatcher,
    FoliageImpostorBaker,
    OctahedralImpostorMaterial,
    FoliageSubCellPartitioner,
    FoliageSubCellStreamer,

    // Standalone Functions
    assembleFoliageSubMeshes,
    createOctahedralImpostorGeometry,
    assembleFoliageLODMeshes,
    buildFoliageImpostorSubMesh,
    createFoliageSubMeshInstance,
    createFoliagePBRSubMeshUniform,
    createFoliageShadowSubMeshUniform,
    prepareFoliageMaterials,

    // Code Hint Interfaces
    type FoliageOptions,
    type FoliageLODConfig,
    type FoliageLODInfo,
    type FoliageAssemblyResult,
    type FoliageSubMeshUniformResult
};
