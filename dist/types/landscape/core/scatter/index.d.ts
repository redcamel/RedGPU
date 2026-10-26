/**
 * [KO] 지형(Landscape)의 식생(Foliage) 및 디테일(Detail) 스캐터링 시스템을 위한 추상 코어 클래스와 유틸리티를 제공합니다.
 * [EN] Provides abstract core classes and utilities for the Foliage and Detail scattering systems of Landscape.
 * @packageDocumentation
 */
import assembleScatterRenderUnits, { type AssembledMeshGroup, type RawMeshNode, type ScatterAssemblyOptions, type ScatterAssemblyResult } from "./assembleScatterRenderUnits";
import ScatterRenderUnit, { type ScatterRenderUnitInitOptions } from "./ScatterRenderUnit";
import { PBR_INTERLEAVED_STRUCT, PBR_STRIDE, PBR_STRIDE_BYTES, POSITION_ONLY_INTERLEAVED_STRUCT, POSITION_ONLY_STRIDE, POSITION_ONLY_STRIDE_BYTES } from "./ScatterVertexFormats";
import AScatterMegaBuffer, { CULLING_WORKGROUP_SIZE, DRAW_INDEXED_INDIRECT_ARGS_COUNT, type ScatterBaseSegmentAllocation, type ScatterShaderReflectionConfig } from "./AScatterMegaBuffer";
import AScatterType, { type AScatterTypeInitOptions } from "./AScatterType";
import AScatterSlotPooler from "./AScatterSlotPooler";
import AScatterRenderer from "./AScatterRenderer";
import AScatterManager from "./AScatterManager";
import AScatterCuller from "./AScatterCuller";
import AScatterInstanceBaker from "./AScatterInstanceBaker";
export { AScatterManager, AScatterCuller, assembleScatterRenderUnits, ScatterRenderUnit, AScatterType, AScatterSlotPooler, AScatterRenderer, AScatterMegaBuffer, AScatterInstanceBaker, CULLING_WORKGROUP_SIZE, DRAW_INDEXED_INDIRECT_ARGS_COUNT, type AScatterTypeInitOptions, type ScatterRenderUnitInitOptions, type ScatterAssemblyOptions, type ScatterAssemblyResult, type AssembledMeshGroup, type RawMeshNode, type ScatterShaderReflectionConfig, type ScatterBaseSegmentAllocation, PBR_INTERLEAVED_STRUCT, PBR_STRIDE, PBR_STRIDE_BYTES, POSITION_ONLY_INTERLEAVED_STRUCT, POSITION_ONLY_STRIDE, POSITION_ONLY_STRIDE_BYTES };
