/**
 * [KO] 지형(Landscape) 시스템의 핵심 클래스, 재질, 레이어, 식생(Foliage), 잔디(Grass) 및 디버거 모듈을 제공합니다.
 * [EN] Provides core classes, materials, layers, foliage, grass, and debugger modules for the Landscape system.
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
