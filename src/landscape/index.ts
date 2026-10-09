/**
 * [KO] RedGPU 대규모 지형(Landscape) 시스템 모듈입니다.
 * [EN] Large-scale Landscape terrain system module for RedGPU.
 *
 * **[KO]**
 * - `Landscape`: 가상 텍스처(VT) 및 계층적 LOD 기반의 고성능 지형 렌더러
 * - `LandscapeMaterial`: 지형 전용 텍스처 2D 어레이 스플래팅 PBR 머티리얼
 * - `LandscapeLayer`: 지형 표면 개별 스플랫 레이어(텍스처, UV 스케일, 가중치 맵) 관리 클래스
 * - `Core`: 지형 자체의 내부 저수준 파이프라인 (Spatial, Generator, Scatter, Cache)
 * - `Foliage`: 식생 관리자 및 3D 메시 / 임포스터 인스턴싱 시스템
 * - `Grass`: 절차적 잔디 블레이드 및 Multi-Draw Indirect 렌더링 시스템
 * - `Debugger`: 지형 LOD, 타일, 가상 텍스처 시각화 디버깅 도구
 *
 * **[EN]**
 * - `Landscape`: High-performance terrain renderer based on Virtual Textures (VT) and hierarchical LOD
 * - `LandscapeMaterial`: Dedicated 2D texture array splatting PBR material for landscape
 * - `LandscapeLayer`: Class managing individual splat layers (textures, UV scale, weight maps)
 * - `Core`: Internal low-level pipelines of the terrain (Spatial, Generator, Scatter, Cache)
 * - `Foliage`: Foliage manager and 3D mesh / impostor instancing system
 * - `Grass`: Procedural grass blades and Multi-Draw Indirect rendering system
 * - `Debugger`: Terrain LOD, tile, and virtual texture visual debugging tools
 *
 * @packageDocumentation
 */

export * as Core from "./core";
export * as Foliage from "./foliage";
export * as Grass from "./grass";
export * as Debugger from "./debugger";

import Landscape from "./Landscape";
import LandscapeMaterial from "./LandscapeMaterial";
import LandscapeLayer, {type LandscapeLayerOptions, type LandscapeWeightMapChannel} from "./LandscapeLayer";
import {LANDSCAPE_BASE_GRID_SIZE} from "./LANDSCAPE_BASE_GRID_SIZE";
import {LANDSCAPE_DEBUG_MODE} from "./LANDSCAPE_DEBUG_MODE";
import LandscapeShaderLibrary from "./core/shader/library/LandscapeShaderLibrary";

export {
    Landscape,
    LandscapeMaterial,
    LandscapeLayer,
    LANDSCAPE_BASE_GRID_SIZE,
    LANDSCAPE_DEBUG_MODE,
    LandscapeShaderLibrary
};

export type {
    LandscapeLayerOptions,
    LandscapeWeightMapChannel
};
