/**
 * [KO] Landscape 스캐터(Foliage, Grass 등) 렌더링에 사용되는 대규모 인스턴스 VRAM 메가버퍼, 스캐터 엔티티, 렌더 유닛, 병합 함수 및 정점 포맷 모듈입니다.
 * [EN] Large-scale instance VRAM mega-buffer, scatter entity, render units, merge functions, and vertex format modules for Landscape scatter (foliage, grass, etc.) rendering.
 *
 * **[KO] 주요 구성 요소:**
 * - `AScatterMegaBuffer`: 인스턴스 행렬, 컬링 결과, WebGPU DrawIndexedIndirect 인자 버퍼를 단일 VRAM 영역에서 일괄 관리하는 최상위 순수 GPU 추상 메가버퍼
 * - `AScatterType`: 잔디(Grass) 및 식생(Foliage) 등 모든 스캐터 종의 공통 수명주기, LOD 통합 지오메트리 및 메가버퍼 바인딩을 총괄하는 추상 엔티티 클래스
 * - `ScatterRenderUnit`: WebGPU 간접 드로우 지오메트리 버퍼와 머티리얼, 베이스 컬러 텍스처, LOD 오프셋이 결합된 스캐터 공용 최소 렌더 단위
 * - `assembleScatterRenderUnits`: 복합 계층 3D 메시를 머티리얼별로 결합하여 스캐터 렌더 유닛 및 통합 지오메트리로 조립하는 순수 함수
 * - `ScatterVertexFormats`: PBR 및 위치 전용 정점 인터리브 구조체 및 스트라이드 상수
 *
 * **[EN] Key Components:**
 * - `AScatterMegaBuffer`: Top-level pure GPU abstract mega-buffer managing instance matrices, culling results, and WebGPU DrawIndexedIndirect args within a unified VRAM region
 * - `AScatterType`: Top-level abstract entity class orchestrating lifecycle, LOD unified geometries, and mega-buffer binding across all scatter species (Grass, Foliage)
 * - `ScatterRenderUnit`: Common scatter minimal render unit combining WebGPU indirect draw geometry buffers, material, base color texture, and LOD offsets
 * - `assembleScatterRenderUnits`: Pure function assembling composite hierarchical 3D meshes per material into scatter render units and unified geometries
 * - `ScatterVertexFormats`: Interleaved vertex structures and stride constants for PBR and position-only passes
 *
 * @packageDocumentation
 */

import assembleScatterRenderUnits, {
    type AssembledMeshGroup,
    type MergedMeshGroup,
    mergeScatterMeshes,
    type RawMeshNode,
    type ScatterAssemblyOptions,
    type ScatterAssemblyResult,
    type ScatterMeshMergeOptions,
    type ScatterMeshMergeResult
} from "./assembleScatterRenderUnits";
import ScatterRenderUnit, {type ScatterRenderUnitInitOptions} from "./ScatterRenderUnit";

import {
    PBR_INTERLEAVED_STRUCT,
    PBR_STRIDE,
    PBR_STRIDE_BYTES,
    POSITION_ONLY_INTERLEAVED_STRUCT,
    POSITION_ONLY_STRIDE,
    POSITION_ONLY_STRIDE_BYTES
} from "./ScatterVertexFormats";

import AScatterMegaBuffer, {
    CULLING_WORKGROUP_SIZE,
    DRAW_INDEXED_INDIRECT_ARGS_COUNT,
    type ScatterBaseSegmentAllocation,
    type ScatterShaderReflectionConfig
} from "./AScatterMegaBuffer";
import AScatterType, {type AScatterTypeInitOptions} from "./AScatterType";
import AScatterSlotPooler from "./AScatterSlotPooler";
import AScatterRenderer from "./AScatterRenderer";
import AScatterManager from "./AScatterManager";
import AScatterCuller from "./AScatterCuller";
import AScatterInstanceBaker, {type ScatterBakeBindGroupCacheEntry} from "./AScatterInstanceBaker";

export {
    // Runtime Classes, Functions & Units
    AScatterManager,
    AScatterCuller,
    assembleScatterRenderUnits,
    mergeScatterMeshes,
    ScatterRenderUnit,
    AScatterType,
    AScatterSlotPooler,
    AScatterRenderer,
    AScatterMegaBuffer,
    AScatterInstanceBaker,

    // Constants
    CULLING_WORKGROUP_SIZE,
    DRAW_INDEXED_INDIRECT_ARGS_COUNT,

    // Code Hint Interfaces & Vertex Constants
    type AScatterTypeInitOptions,
    type ScatterRenderUnitInitOptions,
    type ScatterAssemblyOptions,
    type ScatterAssemblyResult,
    type AssembledMeshGroup,
    type ScatterMeshMergeOptions,
    type ScatterMeshMergeResult,
    type MergedMeshGroup,
    type RawMeshNode,
    type ScatterShaderReflectionConfig,
    type ScatterBaseSegmentAllocation,
    type ScatterBakeBindGroupCacheEntry,
    PBR_INTERLEAVED_STRUCT,
    PBR_STRIDE,
    PBR_STRIDE_BYTES,
    POSITION_ONLY_INTERLEAVED_STRUCT,
    POSITION_ONLY_STRIDE,
    POSITION_ONLY_STRIDE_BYTES
};
