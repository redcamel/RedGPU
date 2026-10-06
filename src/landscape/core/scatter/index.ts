/**
 * [KO] Landscape 스캐터(Foliage, Grass 등) 렌더링에 사용되는 대규모 인스턴스 VRAM 메가버퍼, 스캐터 엔티티, 서브메쉬 단위, 결합 함수 및 정점 포맷 모듈입니다.
 * [EN] Large-scale instance VRAM mega-buffer, scatter entity, sub-mesh units, combination functions, and vertex format modules for Landscape scatter (foliage, grass, etc.) rendering.
 *
 * **[KO] 주요 구성 요소:**
 * - `AScatterMegaBuffer`: 인스턴스 행렬, 컬링 결과, WebGPU DrawIndexedIndirect 인자 버퍼를 단일 VRAM 영역에서 일괄 관리하는 최상위 순수 GPU 추상 메가버퍼
 * - `ACpuStagedScatterMegaBuffer`: CPU 스테이징 버퍼를 통해 인스턴스 데이터를 관리하고 GPU로 전송하는 스캐터 메가버퍼 확장 추상 클래스
 * - `AScatterType`: 잔디(Grass) 및 식생(Foliage) 등 모든 스캐터 종의 공통 수명주기, LOD 통합 지오메트리 및 메가버퍼 바인딩을 총괄하는 추상 엔티티 클래스
 * - `AScatterGeometryUnit`: WebGPU 간접 드로우(Indirect Draw)를 수행하는 스캐터 공통 추상 지오메트리 단위
 * - `ScatterSubMesh`: 머티리얼과 베이스 컬러 텍스처, LOD 오프셋이 결합된 스캐터 공용 서브메쉬 렌더 단위
 * - `combineScatterMeshes`: 복합 계층 3D 메시를 머티리얼별 단일 결합 지오메트리로 자동 병합하는 순수 함수
 * - `ScatterInstanceBaker`: 지형 가중치 맵 및 높이맵 기반 GPU 물리 인스턴스 베이킹 디스패처
 * - `ScatterVertexFormats`: PBR 및 위치 전용 정점 인터리브 구조체 및 스트라이드 상수
 *
 * **[EN] Key Components:**
 * - `AScatterMegaBuffer`: Top-level pure GPU abstract mega-buffer managing instance matrices, culling results, and WebGPU DrawIndexedIndirect args within a unified VRAM region
 * - `ACpuStagedScatterMegaBuffer`: Scatter mega-buffer extended abstract class that manages instance data via CPU staging buffers and uploads to the GPU
 * - `AScatterType`: Top-level abstract entity class orchestrating lifecycle, LOD unified geometries, and mega-buffer binding across all scatter species (Grass, Foliage)
 * - `AScatterGeometryUnit`: Common scatter abstract geometry unit executing WebGPU indirect draws
 * - `ScatterSubMesh`: Common scatter sub-mesh render unit combining material, base color texture, and LOD offsets
 * - `combineScatterMeshes`: Pure function automatically combining composite hierarchical 3D meshes per material
 * - `ScatterInstanceBaker`: GPU physics instance baking dispatcher based on terrain weight maps and height maps
 * - `ScatterVertexFormats`: Interleaved vertex structures and stride constants for PBR and position-only passes
 *
 * @packageDocumentation
 */

import combineScatterMeshes, {
    type CombinedSubMeshGroup,
    type RawSubMeshNode,
    type ScatterMeshCombineOptions,
    type ScatterMeshCombineResult
} from "./combineScatterMeshes";
import AScatterGeometryUnit, {type AScatterGeometryUnitInitOptions} from "./AScatterGeometryUnit";
import ScatterSubMesh, {type ScatterSubMeshInitOptions} from "./ScatterSubMesh";
import {sampleNormalizedLayerWeight} from "./ScatterSamplingUtils";
import {
    computeScatterGridSeed,
    fastFloatToHalf,
    fastPack2x16float,
    fastPackUniformScale,
    packSubCellKey,
    sortSubCellsByDistance
} from "./ScatterSpatialUtils";
import {
    PBR_INTERLEAVED_STRUCT,
    PBR_STRIDE,
    PBR_STRIDE_BYTES,
    POSITION_ONLY_INTERLEAVED_STRUCT,
    POSITION_ONLY_STRIDE,
    POSITION_ONLY_STRIDE_BYTES
} from "./ScatterVertexFormats";

import {
    type IScatterBakeMegaBuffer,
    ScatterInstanceBaker,
    type ScatterInstanceBakerOptions
} from "./baking/ScatterInstanceBaker";
import AScatterMegaBuffer, {
    CULLING_WORKGROUP_SIZE,
    DRAW_INDEXED_INDIRECT_ARGS_COUNT,
    type ScatterBaseSegmentAllocation,
    type ScatterShaderReflectionConfig
} from "./AScatterMegaBuffer";
import ACpuStagedScatterMegaBuffer from "./ACpuStagedScatterMegaBuffer";
import AScatterType, {type AScatterTypeInitOptions} from "./AScatterType";

export {
    // Runtime Classes, Functions & Units
    combineScatterMeshes,
    AScatterGeometryUnit,
    ScatterSubMesh,
    AScatterType,
    AScatterMegaBuffer,
    ACpuStagedScatterMegaBuffer,
    sampleNormalizedLayerWeight,
    ScatterInstanceBaker,

    // Spatial & Packing Utilities
    packSubCellKey,
    computeScatterGridSeed,
    fastFloatToHalf,
    fastPack2x16float,
    fastPackUniformScale,
    sortSubCellsByDistance,

    // Constants
    CULLING_WORKGROUP_SIZE,
    DRAW_INDEXED_INDIRECT_ARGS_COUNT,

    // Code Hint Interfaces & Vertex Constants
    type AScatterTypeInitOptions,
    type AScatterGeometryUnitInitOptions,
    type ScatterSubMeshInitOptions,
    type ScatterMeshCombineOptions,
    type ScatterMeshCombineResult,
    type CombinedSubMeshGroup,
    type RawSubMeshNode,
    type IScatterBakeMegaBuffer,
    type ScatterInstanceBakerOptions,
    type ScatterShaderReflectionConfig,
    type ScatterBaseSegmentAllocation,
    PBR_INTERLEAVED_STRUCT,
    PBR_STRIDE,
    PBR_STRIDE_BYTES,
    POSITION_ONLY_INTERLEAVED_STRUCT,
    POSITION_ONLY_STRIDE,
    POSITION_ONLY_STRIDE_BYTES
};
