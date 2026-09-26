/**
 * [KO] RedGPU 대규모 지형(Landscape) 시스템 모듈입니다.
 * [EN] Large-scale Landscape terrain system module for RedGPU.
 *
 * @remarks
 * **[KO]**
 * - `Landscape`: 가상 텍스처(VT) 및 계층적 LOD 기반의 고성능 지형 렌더러
 * - `Core`: 지형 자체의 내부 렌더링 파이프라인 (Material, Spatial, Generator)
 * - `Foliage`: 식생 관리자 및 3D 메시 / 임포스터 인스턴싱 시스템
 * - `Grass`: 절차적 잔디 블레이드 및 Multi-Draw Indirect 렌더링 시스템
 * - `Debugger`: 지형 LOD, 타일, 가상 텍스처 시각화 디버깅 도구
 *
 * **[EN]**
 * - `Landscape`: High-performance terrain renderer based on Virtual Textures (VT) and hierarchical LOD
 * - `Core`: Internal rendering pipelines of the terrain (Material, Spatial, Generator)
 * - `Foliage`: Foliage manager and 3D mesh / impostor instancing system
 * - `Grass`: Procedural grass blades and Multi-Draw Indirect rendering system
 * - `Debugger`: Terrain LOD, tile, and virtual texture visual debugging tools
 *
 * @packageDocumentation
 */

// 1. Core & Subsystem Namespaces
export * as Core from "./core";
export * as Foliage from "./foliage";
export * as Grass from "./grass";
export * as Debugger from "./debugger";

// 2. Main Entry Class & Settings
import Landscape from "./Landscape";
import {LANDSCAPE_BASE_GRID_SIZE, validateLandscapeBaseGridSize} from "./LANDSCAPE_BASE_GRID_SIZE";
import LANDSCAPE_DEFAULT_LOD_COLORS from "./LANDSCAPE_DEFAULT_LOD_COLORS";
import {LANDSCAPE_DEBUG_MODE} from "./LANDSCAPE_DEBUG_MODE";

export {
    Landscape,
    LANDSCAPE_BASE_GRID_SIZE,
    validateLandscapeBaseGridSize,
    LANDSCAPE_DEBUG_MODE,
    LANDSCAPE_DEFAULT_LOD_COLORS
};

// 3. User-facing Configuration Types
export type {
    LandscapeLayerOptions,
    LandscapeWeightMapChannel
} from "./core/material/LandscapeLayer";

export type {
    LandscapeFoliageOptions,
    FoliageLODConfig
} from "./foliage/LandscapeFoliage";

export type {
    LandscapeGrassOptions,
    GrassLODConfig
} from "./grass/LandscapeGrass";

export type {
    LandscapeDebuggerManagerOptions
} from "./debugger";
