/**
 * [KO] Landscape 스캐터(Foliage, Grass 등) 렌더링에 사용되는 지오메트리 렌더 단위, 메쉬 결합 함수 및 정점 포맷 모듈입니다.
 * [EN] Geometry render units, mesh combination functions, and vertex format modules for Landscape scatter (foliage, grass, etc.) rendering.
 *
 * **[KO]**
 * - `AScatterGeometryUnit`: WebGPU 간접 드로우(Indirect Draw)를 수행하는 스캐터 공통 추상 기반 클래스
 * - `ScatterSubMesh`: 머티리얼과 텍스처 메타데이터가 결합된 스캐터 공용 서브메쉬 렌더 단위
 * - `combineScatterMeshes`: 복합 계층 3D 메시를 머티리얼별 단일 지오메트리로 자동 결합하는 순수 함수
 * - `ScatterVertexFormats`: PBR 및 위치 전용 정점 인터리브 구조체 및 스트라이드 상수
 *
 * **[EN]**
 * - `AScatterGeometryUnit`: Common scatter abstract base class executing WebGPU indirect draws
 * - `ScatterSubMesh`: Common scatter sub-mesh render unit combining material and texture metadata
 * - `combineScatterMeshes`: Pure function automatically combining composite hierarchical 3D meshes per material
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
import {computeNormalizedChannelWeight, sampleNormalizedLayerWeight} from "./ScatterSamplingUtils";
import {
    PBR_INTERLEAVED_STRUCT,
    PBR_STRIDE,
    PBR_STRIDE_BYTES,
    POSITION_ONLY_INTERLEAVED_STRUCT,
    POSITION_ONLY_STRIDE,
    POSITION_ONLY_STRIDE_BYTES
} from "./ScatterVertexFormats";

export {
    // Runtime Classes, Functions & Units
    combineScatterMeshes,
    AScatterGeometryUnit,
    ScatterSubMesh,
    computeNormalizedChannelWeight,
    sampleNormalizedLayerWeight,

    // Code Hint Interfaces & Vertex Constants
    type AScatterGeometryUnitInitOptions,
    type ScatterSubMeshInitOptions,
    type ScatterMeshCombineOptions,
    type ScatterMeshCombineResult,
    type CombinedSubMeshGroup,
    type RawSubMeshNode,
    PBR_INTERLEAVED_STRUCT,
    PBR_STRIDE,
    PBR_STRIDE_BYTES,
    POSITION_ONLY_INTERLEAVED_STRUCT,
    POSITION_ONLY_STRIDE,
    POSITION_ONLY_STRIDE_BYTES
};
