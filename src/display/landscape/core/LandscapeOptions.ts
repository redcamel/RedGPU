import LANDSCAPE_BASE_GRID_SIZE from "./LANDSCAPE_BASE_GRID_SIZE";
import LandscapeMaterial from "../material/LandscapeMaterial";
import type {LandscapeDebuggerManagerOptions} from "../debugger/LandscapeDebuggerManager";

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

    tileUrlResolver?: (row: number, col: number) => string;

    loadingRadius?: number;

    wireframe?: boolean;

    lodColoration?: boolean;

    lodFadeStartRatio?: number;

    lodGeomorphStartRatio?: number;

    debuggerOptions?: LandscapeDebuggerManagerOptions;
}

export default LandscapeOptions;
