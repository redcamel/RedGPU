import LANDSCAPE_BASE_GRID_SIZE from "./LANDSCAPE_BASE_GRID_SIZE";
import LandscapeMaterial from "../material/LandscapeMaterial";
import type {LandscapeDebuggerManagerOptions} from "../debugger";
import type {LandscapeTileUrlResolver} from "../spatial/LandscapeTileStreamer";

export interface LandscapeOptions {

    worldSize?: number | [number, number];

    componentCount?: number | [number, number];

    tileSize?: number | [number, number];

    componentSizeQuads?: LANDSCAPE_BASE_GRID_SIZE | number;

    maxLODLevel?: number;

    lodColors?: string[];

    lodMultipliers?: number[];

    lodDistances?: number[];

    landscapeMaterial?: LandscapeMaterial;

    heightScale?: number;

    tileUrlResolver?: LandscapeTileUrlResolver;

    loadingRadius?: number;

    wireframe?: boolean;

    lodColoration?: boolean;

    lod0SizeQuads?: number;

    lodMetric?: 'distance' | 'screenSize';

    lodFadeStartRatio?: number;

    lodDitherStartRatio?: number;

    lodGeomorphStartRatio?: number;

    lodMorphStartRatio?: number;

    debuggerOptions?: LandscapeDebuggerManagerOptions;
}

export default LandscapeOptions;
