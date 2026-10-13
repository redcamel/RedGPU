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

