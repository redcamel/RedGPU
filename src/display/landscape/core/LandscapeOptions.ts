import LandscapeMaterial from "../material/LandscapeMaterial";

export interface LandscapeOptions {

    worldSize?: number | [number, number];

    componentCount?: number | [number, number];

    tileSize?: number | [number, number];

    componentSizeQuads?: number;

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
}

export default LandscapeOptions;
