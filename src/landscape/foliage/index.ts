/**
 * [KO] Landscape 식생(Foliage) 시스템 모듈입니다.
 * [EN] Foliage system module for the Landscape terrain.
 *
 * **[KO]**
 * - `FoliageManager`: 대규모 식생(나무, 수풀 등) 인스턴스 등록 및 LOD, HZB 오클루전 컬링을 총괄 관리합니다.
 * - `Core`: 식생 엔티티(`Foliage`), GPU 메가 버퍼, 3D 옥타헤드럴 임포스터 베이커 및 공간 분할 엔진을 제공합니다.
 * - `assembleFoliageSubMeshes`: 계층적 식생 3D 모델을 분석·결합하여 단일 서브메쉬로 조립하는 함수
 * - `createOctahedralImpostorGeometry`: 8방향/16방향 3D 옥타헤드럴 빌보드 지오메트리 생성 함수
 *
 * **[EN]**
 * - `FoliageManager`: Orchestrates foliage instances, LOD, and HZB occlusion culling.
 * - `Core`: Provides foliage entity (`Foliage`), GPU mega buffers, 3D octahedral impostor baking, and spatial partitioning engines.
 * - `assembleFoliageSubMeshes`: Function assembling hierarchical foliage models into combined sub-meshes
 * - `createOctahedralImpostorGeometry`: Function generating 8-way/16-way 3D octahedral billboard geometries
 *
 * @packageDocumentation
 */
export * as Core from "./core";

import FoliageManager from "./FoliageManager";
import Foliage, {type FoliageLODConfig, type FoliageLODInfo, type FoliageOptions} from "./core/Foliage";
import assembleFoliageSubMeshes, {type FoliageAssemblyResult} from "./core/assembler/assembleFoliageSubMeshes";
import createOctahedralImpostorGeometry from "./core/impostor/octahedral/createOctahedralImpostorGeometry";

export {
    Foliage,
    FoliageManager,
    assembleFoliageSubMeshes,
    createOctahedralImpostorGeometry
};

export type {
    FoliageOptions,
    FoliageLODConfig,
    FoliageLODInfo,
    FoliageAssemblyResult
};
