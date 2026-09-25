import Landscape from "./Landscape";
import {LANDSCAPE_BASE_GRID_SIZE, validateLandscapeBaseGridSize} from "./LANDSCAPE_BASE_GRID_SIZE";
import LANDSCAPE_DEFAULT_LOD_COLORS from "./LANDSCAPE_DEFAULT_LOD_COLORS";
import {LANDSCAPE_DEBUG_MODE} from "./LANDSCAPE_DEBUG_MODE";
import LandscapeMaterial from "./core/material/LandscapeMaterial";
import type {LandscapeLayerOptions, LandscapeWeightMapChannel} from "./core/material/LandscapeLayer";
import LandscapeLayer from "./core/material/LandscapeLayer";
import LandscapeFoliageManager from "./foliage/LandscapeFoliageManager";
import LandscapeFoliageSpatialGrid from "./foliage/core/spatial/LandscapeFoliageSpatialGrid";
import type {FoliageTypeOptions} from "./foliage/FoliageType";
import FoliageType from "./foliage/FoliageType";
import FoliageSubMesh from "./foliage/FoliageSubMesh";
import FoliageMegaBuffer from "./foliage/core/buffer/FoliageMegaBuffer";
import OctahedralImpostorMaterial from "./foliage/core/impostor/octahedral/OctahedralImpostorMaterial";
import {createOctahedralImpostorGeometry} from "./foliage/core/impostor/octahedral/createOctahedralImpostorGeometry";
import type {LandscapeDebuggerManagerOptions} from "./debugger";
import LandscapeDebuggerManager from "./debugger";
import LandscapeGrassManager from "./grass/LandscapeGrassManager";
import type {GrassLODConfig, GrassLODInfo, GrassTypeOptions} from "./grass/GrassType";
import GrassType from "./grass/GrassType";
import GrassMegaBuffer from "./grass/core/buffer/GrassMegaBuffer";
import GrassCuller from "./grass/core/culling/GrassCuller";

export * as Core from "./core";

export {
    Landscape,
    LandscapeMaterial,
    LandscapeLayer,
    LANDSCAPE_BASE_GRID_SIZE,
    validateLandscapeBaseGridSize,
    LandscapeFoliageManager,
    LandscapeFoliageSpatialGrid,
    FoliageType,
    FoliageSubMesh,
    FoliageMegaBuffer,
    OctahedralImpostorMaterial,
    createOctahedralImpostorGeometry,
    LandscapeDebuggerManager,
    LANDSCAPE_DEFAULT_LOD_COLORS,
    LANDSCAPE_DEBUG_MODE,
    LandscapeGrassManager,
    GrassType,
    GrassMegaBuffer,
    GrassCuller
};

export type {
    LandscapeLayerOptions,
    LandscapeWeightMapChannel,
    FoliageTypeOptions,
    LandscapeDebuggerManagerOptions,
    GrassTypeOptions,
    GrassLODConfig,
    GrassLODInfo
};
