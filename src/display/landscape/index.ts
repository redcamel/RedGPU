import Landscape from "./core/Landscape";
import type LandscapeOptions from "./core/LandscapeOptions";
import {LANDSCAPE_BASE_GRID_SIZE, validateLandscapeBaseGridSize} from "./core/LANDSCAPE_BASE_GRID_SIZE";
import LANDSCAPE_DEFAULT_LOD_COLORS from "./core/LANDSCAPE_DEFAULT_LOD_COLORS";
import LandscapeMaterial from "./material/LandscapeMaterial";
import type {LandscapeLayerOptions, LandscapeWeightMapChannel} from "./material/LandscapeLayer";
import LandscapeLayer from "./material/LandscapeLayer";
import LandscapeFoliageManager from "./foliage/LandscapeFoliageManager";
import type {FoliageTypeOptions} from "./foliage/FoliageType";
import FoliageType from "./foliage/FoliageType";
import CrossBillboardMaterial from "./foliage/core/impostor/crossBillboard/CrossBillboardMaterial";
import type {LandscapeDebuggerManagerOptions} from "./debugger";
import LandscapeDebuggerManager from "./debugger";

export {
    Landscape,
    LandscapeMaterial,
    LandscapeLayer,
    LANDSCAPE_BASE_GRID_SIZE,
    validateLandscapeBaseGridSize,
    LandscapeFoliageManager,
    FoliageType,
    CrossBillboardMaterial,
    LandscapeDebuggerManager,
    LANDSCAPE_DEFAULT_LOD_COLORS
};

export type {
    LandscapeOptions,
    LandscapeLayerOptions,
    LandscapeWeightMapChannel,
    FoliageTypeOptions,
    LandscapeDebuggerManagerOptions
};
